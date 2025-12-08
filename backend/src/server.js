import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { sendOtpEmail } from './utils/email.js';
import 'dotenv/config';
import connectDB from './lib/db.js';

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

app.use(cors());
app.use(express.json());

/**
 * Request / Response logger middleware
 * Logs method, path, params, query, body and final response status.
 */
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`--> ${req.method} ${req.originalUrl}`);
  console.log('    params:', req.params);
  console.log('    query: ', req.query);
  console.log('    body:  ', req.body);

  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`<-- ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next();
});

// Initialize MongoDB connection
let mongoClient;
connectDB()
  .then((client) => {
    mongoClient = client;
    console.log('MongoDB client ready for use');
  })
  .catch((err) => {
    console.error('Failed to initialize MongoDB:', err);
    process.exit(1);
  });

const hashPassword = (value) =>
  crypto.createHash('sha256').update(String(value ?? '')).digest('hex');

const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : '');

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeSlug = (value) => {
  if (!value) return '';

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const isValidEmail = (email) =>
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
  email.trim().length <= 255;

const isStrongPassword = (password) =>
  typeof password === 'string' &&
  password.length >= 8 &&
  /[A-Za-z]/.test(password) &&
  /[0-9]/.test(password);

const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const buildAdminResponse = (admin) => ({
  id: admin.id,
  email: admin.email,
  name: admin.name,
  role: admin.role,
  status: admin.status,
});

const isValidRating = (value) => Number.isInteger(value) && value >= 1 && value <= 5;

const normalizeOtpInput = (otp) => {
  const digitsOnly = String(otp ?? '').replace(/\D/g, '');

  if (!digitsOnly || digitsOnly.length > 6) {
    return null;
  }

  const normalized = digitsOnly.padStart(6, '0');

  return normalized.length === 6 ? normalized : null;
};

const getNormalizedOtp = (otpInput) => {
  const normalizedOtp = normalizeOtpInput(otpInput);

  if (!normalizedOtp) return { normalizedOtp: null };

  return { normalizedOtp };
};

const findValidOtpRecord = async (email, normalizedOtp) => {
  if (!email || !normalizedOtp) return null;

  return prisma.otpVerification.findFirst({
    where: {
      email,
      code: normalizedOtp,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const formatFeedbackResponse = (feedback) => ({
  id: feedback.id,
  name: feedback.client,
  title: feedback.highlight ?? '',
  description: feedback.quote ?? '',
  rating: feedback.rating ?? null,
  submittedAt: feedback.createdAt?.toISOString().split('T')[0],
  createdAt: feedback.createdAt,
  updatedAt: feedback.updatedAt,
});

const formatContactResponse = (contact) => ({
  id: contact.id,
  name: contact.name,
  email: contact.email,
  phone: contact.phone || '',
  countryCode: contact.countryCode || '',
  contactType: contact.contactType || 'General enquiry',
  projectType: contact.projectType || '',
  description: contact.description || contact.message || '',
  status: contact.status || 'New',
  receivedOn: contact.createdAt ? contact.createdAt.toISOString().split('T')[0] : null,
  createdAt: contact.createdAt,
  updatedAt: contact.updatedAt,
});

const formatProjectTypeResponse = (projectType) => ({
  id: projectType.id,
  name: projectType.name,
  createdAt: projectType.createdAt,
  updatedAt: projectType.updatedAt,
});

const formatBlogCategoryResponse = (category) => ({
  id: category.id,
  name: category.name,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

const deriveBlogUiStatus = (status, publishDate) => {
  const today = new Date().toISOString().split('T')[0];
  if (status === 'DRAFT') return 'Draft';
  if (publishDate && publishDate > today) return 'Scheduled';
  return 'Published';
};

const formatBlogPostResponse = (post) => {
  const publishDate = post.publishedAt ? post.publishedAt.toISOString().split('T')[0] : null;
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    categoryId: post.categoryId || '',
    category: post.category ? formatBlogCategoryResponse(post.category) : null,
    publishDate,
    description: post.summary || '',
    conclusion: post.content || '',
    status: deriveBlogUiStatus(post.status, publishDate),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

const EMPLOYMENT_LABELS = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERN: 'Intern',
};

const normalizeEmploymentType = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[-\s]/g, '_');

  if (normalized === 'FULL_TIME') return 'FULL_TIME';
  if (normalized === 'PART_TIME') return 'PART_TIME';
  if (normalized === 'CONTRACT') return 'CONTRACT';
  if (normalized === 'INTERN') return 'INTERN';

  return 'FULL_TIME';
};

const formatEmploymentLabel = (value) => EMPLOYMENT_LABELS[value] || 'Full-time';

const normalizeDateOnly = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatCareerOpeningResponse = (opening) => ({
  id: opening.id,
  title: opening.title,
  position: opening.position || opening.department || '',
  experience: opening.experience || '',
  employmentType: formatEmploymentLabel(opening.employmentType),
  postedOn: opening.postedOn ? opening.postedOn.toISOString().split('T')[0] : opening.createdAt?.toISOString().split('T')[0],
  description: opening.description || '',
  imageUrl: opening.imageUrl || '',
  createdAt: opening.createdAt,
  updatedAt: opening.updatedAt,
});

const formatCareerApplicationResponse = (application) => ({
  id: application.id,
  name: application.name,
  email: application.email,
  contact: application.contact || '',
  experience: application.experience || '',
  employmentType: formatEmploymentLabel(application.employmentType),
  appliedOn: application.appliedOn ? application.appliedOn.toISOString().split('T')[0] : application.createdAt?.toISOString().split('T')[0],
  resumeUrl: application.resumeUrl || '',
  notes: application.notes || '',
  jobId: application.jobId || '',
  job: application.job ? formatCareerOpeningResponse(application.job) : null,
  createdAt: application.createdAt,
  updatedAt: application.updatedAt,
});

const parseBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) return null;
  const parts = String(authorizationHeader).split(' ').filter(Boolean);
  if (parts.length < 2) return null;
  const scheme = parts[0];
  const token = parts.slice(1).join(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
};

const invalidateExistingOtps = (email) =>
  prisma.otpVerification.deleteMany({
    where: { email },
  });

const CONTACT_STATUSES = ['New', 'In progress', 'Replied', 'Closed'];

const validateContactInput = (body, { allowStatusUpdate = false } = {}) => {
  const name = normalizeText(body?.name);
  const email = normalizeEmail(body?.email);
  const phone = normalizeText(body?.phone) || null;
  const countryCode = normalizeText(body?.countryCode)?.toUpperCase() || null;
  const contactType = normalizeText(body?.contactType) || null;
  const projectType = normalizeText(body?.projectType) || null;
  const description = normalizeText(body?.description || body?.message);
  const rawStatus = normalizeText(body?.status);
  const statusMatch = rawStatus
    ? CONTACT_STATUSES.find((value) => value.toLowerCase() === rawStatus.toLowerCase())
    : null;
  const status = statusMatch || 'New';

  if (!name) {
    return { error: 'Name is required.' };
  }

  if (!isValidEmail(email)) {
    return { error: 'A valid email address is required.' };
  }

  if (!description) {
    return { error: 'Description is required.' };
  }

  if (allowStatusUpdate && rawStatus && !statusMatch) {
    return { error: 'Invalid status provided.' };
  }

  return { name, email, phone, countryCode, contactType, projectType, description, status: allowStatusUpdate ? status : 'New' };
};

const validateProjectTypeInput = (body) => {
  const name = normalizeText(body?.name);

  if (!name) {
    return { error: 'Project type name is required.' };
  }

  return { name };
};

const validateBlogCategoryInput = (body) => {
  const name = normalizeText(body?.name);

  if (!name) {
    return { error: 'Category name is required.' };
  }

  return { name };
};

const normalizePublishDate = (value) => {
  const parsed = value ? new Date(value) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const normalizeBlogStatus = (status) => {
  const value = normalizeText(status).toLowerCase();
  if (value === 'published') return 'Published';
  if (value === 'scheduled') return 'Scheduled';
  return 'Draft';
};

const mapUiStatusToPublishStatus = (status) => {
  if (status === 'Published') return 'PUBLISHED';
  if (status === 'Scheduled') return 'REVIEW';
  return 'DRAFT';
};

const validateBlogPostInput = (body) => {
  const title = normalizeText(body?.title);
  const description = normalizeText(body?.description);
  const conclusion = normalizeText(body?.conclusion);
  const slugInput = normalizeText(body?.slug || body?.title);
  const slug = normalizeSlug(slugInput) || `post-${Date.now()}`;
  const publishDate = normalizePublishDate(body?.publishDate);
  const status = normalizeBlogStatus(body?.status);
  const categoryId = normalizeText(body?.categoryId) || null;

  if (!title) return { error: 'Title is required.' };
  if (!description) return { error: 'Description is required.' };

  return { title, description, conclusion, slug, publishDate, status, categoryId };
};

const validateCareerOpeningInput = (body) => {
  const title = normalizeText(body?.title);
  const position = normalizeText(body?.position);
  const experience = normalizeText(body?.experience) || null;
  const description = normalizeText(body?.description);
  const employmentType = normalizeEmploymentType(body?.employmentType);
  const postedOn = normalizeDateOnly(body?.postedOn) || new Date();
  const imageUrl = normalizeText(body?.imageUrl) || null;
  const slugInput = normalizeSlug(body?.slug || body?.title) || `role-${Date.now()}`;

  if (!title) return { error: 'Title is required.' };
  if (!position) return { error: 'Position is required.' };
  if (!description) return { error: 'Description is required.' };

  return { title, position, experience, description, employmentType, postedOn, imageUrl, slug: slugInput };
};

const validateCareerApplicationInput = (body) => {
  const name = normalizeText(body?.name);
  const email = normalizeEmail(body?.email);
  const contact = normalizeText(body?.contact) || null;
  const experience = normalizeText(body?.experience) || null;
  const employmentType = normalizeEmploymentType(body?.employmentType);
  const appliedOn = normalizeDateOnly(body?.appliedOn) || new Date();
  const resumeUrl = normalizeText(body?.resumeUrl) || null;
  const notes = normalizeText(body?.notes) || null;
  const jobId = normalizeText(body?.jobId) || null;

  if (!name) return { error: 'Name is required.' };
  if (!email || !isValidEmail(email)) return { error: 'A valid email is required.' };

  return { name, email, contact, experience, employmentType, appliedOn, resumeUrl, notes, jobId };
};

const findActiveSession = async (token) => {
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => { });
    return null;
  }

  if (session.admin.status !== 'ACTIVE') return null;

  return session;
};

const getAuthenticatedAdmin = async (req) => {
  const token = parseBearerToken(req.headers.authorization);

  if (!token) {
    return { status: 401, message: 'Session token missing.' };
  }

  const session = await findActiveSession(token);

  if (!session) {
    return { status: 401, message: 'Invalid or expired session.' };
  }

  return { admin: session.admin, session, status: 200 };
};

// ---------- Auth Routes ----------

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body ?? {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const admin = await prisma.adminUser.findFirst({ where: { email: normalizedEmail } });

    if (!admin) {
      return res.status(404).json({ message: 'Account not found for the provided email.' });
    }

    if (admin.status !== 'ACTIVE') {
      return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
    }

    await invalidateExistingOtps(normalizedEmail);

    const otp = generateOtpCode();
    const { normalizedOtp } = getNormalizedOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    if (!normalizedOtp) {
      console.error('Generated OTP was invalid');
      return res.status(500).json({ message: 'Unable to start password reset right now.' });
    }

    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        code: normalizedOtp,
        expiresAt,
      },
    });

    const emailSent = await sendOtpEmail(normalizedEmail, normalizedOtp);

    if (!emailSent) {
      return res.status(500).json({ message: 'Unable to send the OTP email right now.' });
    }

    return res.json({ message: 'OTP sent to the registered email address.' });
  } catch (error) {
    console.error('Forgot password request failed', error);
    return res.status(500).json({ message: 'Unable to start password reset right now.' });
  }
});

app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body ?? {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const admin = await prisma.adminUser.findFirst({ where: { email: normalizedEmail } });

    if (!admin) {
      return res.status(404).json({ message: 'Account not found for the provided email.' });
    }

    await invalidateExistingOtps(normalizedEmail);

    const otp = generateOtpCode();
    const { normalizedOtp } = getNormalizedOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    if (!normalizedOtp) {
      console.error('Generated OTP was invalid');
      return res.status(500).json({ message: 'Unable to resend OTP right now.' });
    }

    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        code: normalizedOtp,
        expiresAt,
      },
    });

    const emailSent = await sendOtpEmail(normalizedEmail, normalizedOtp);

    if (!emailSent) {
      return res.status(500).json({ message: 'Unable to send the OTP email right now.' });
    }

    return res.json({ message: 'A new OTP has been sent to the registered email address.' });
  } catch (error) {
    console.error('Resend OTP failed', error);
    return res.status(500).json({ message: 'Unable to resend OTP right now.' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body ?? {};
    const { normalizedOtp } = getNormalizedOtp(otp);

    if (!isValidEmail(email) || !normalizedOtp) {
      return res.status(400).json({ message: 'Email and a valid 6 digit OTP are required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const otpRecord = await findValidOtpRecord(normalizedEmail, normalizedOtp);

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    if (otpRecord.verifiedAt) {
      return res.json({ message: 'OTP already verified.', verified: true });
    }

    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: new Date() },
    });

    return res.json({ message: 'OTP verified successfully.', verified: true });
  } catch (error) {
    console.error('OTP verification failed', error);
    return res.status(500).json({ message: 'Unable to verify OTP right now.' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body ?? {};
    const { normalizedOtp } = getNormalizedOtp(otp);

    if (!isValidEmail(email) || !normalizedOtp || !newPassword) {
      return res.status(400).json({ message: 'Email, a valid 6 digit OTP, and new password are required.' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include letters and numbers.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const admin = await prisma.adminUser.findFirst({ where: { email: normalizedEmail } });

    if (!admin) {
      return res.status(404).json({ message: 'Account not found for the provided email.' });
    }

    const otpRecord = await findValidOtpRecord(normalizedEmail, normalizedOtp);

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    if (!otpRecord.verifiedAt) {
      return res.status(400).json({ message: 'OTP must be verified before resetting the password.' });
    }

    await prisma.$transaction([
      prisma.adminUser.update({
        where: { id: admin.id },
        data: { passwordHash: hashPassword(newPassword) },
      }),
      prisma.adminSession.deleteMany({ where: { adminId: admin.id } }),
      prisma.otpVerification.delete({ where: { id: otpRecord.id } }),
    ]);

    return res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Password reset failed', error);
    return res.status(500).json({ message: 'Unable to reset password right now.' });
  }
});

// ---------- Admin Auth ----------

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const admin = await prisma.adminUser.findFirst({ where: { email: normalizedEmail } });

    if (!admin || admin.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Invalid credentials or inactive account.' });
    }

    if (hashPassword(password) !== admin.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    const session = await prisma.adminSession.create({
      data: {
        token,
        adminId: admin.id,
        expiresAt,
      },
    });

    return res.json({
      token: session.token,
      expiresAt: session.expiresAt,
      admin: buildAdminResponse(admin),
    });
  } catch (error) {
    console.error('Login failed', error);
    return res.status(500).json({ message: 'Unable to process login right now.' });
  }
});

app.post('/api/admin/change-password', async (req, res) => {
  try {
    const { admin, session, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const { currentPassword, newPassword } = req.body ?? {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include letters and numbers.' });
    }

    if (hashPassword(currentPassword) !== admin.passwordHash) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    if (hashPassword(newPassword) === admin.passwordHash) {
      return res.status(400).json({ message: 'Choose a password that differs from your current one.' });
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: hashPassword(newPassword) },
    });

    // invalidate other sessions (keep current)
    await prisma.adminSession.deleteMany({
      where: {
        adminId: admin.id,
        NOT: { token: session.token },
      },
    });

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password failed', error);
    return res.status(500).json({ message: 'Unable to change password right now.' });
  }
});

app.put('/api/admin/profile', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const { firstName, lastName, email } = req.body ?? {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

    if (!fullName) {
      return res.status(400).json({ message: 'First name or last name is required.' });
    }

    const existingWithEmail = await prisma.adminUser.findFirst({
      where: { email: normalizedEmail, NOT: { id: admin.id } },
    });

    if (existingWithEmail) {
      return res.status(409).json({ message: 'Email is already in use by another account.' });
    }

    const updatedAdmin = await prisma.adminUser.update({
      where: { id: admin.id },
      data: { email: normalizedEmail, name: fullName },
    });

    return res.json({ admin: buildAdminResponse(updatedAdmin), message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Profile update failed', error);
    return res.status(500).json({ message: 'Unable to update profile right now.' });
  }
});

app.get('/api/admin/session', async (req, res) => {
  try {
    const { admin, session, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    return res.json({
      valid: true,
      expiresAt: session.expiresAt,
      admin: buildAdminResponse(session.admin),
    });
  } catch (error) {
    console.error('Session check failed', error);
    return res.status(500).json({ message: 'Unable to validate session right now.' });
  }
});

app.post('/api/admin/logout', async (req, res) => {
  try {
    const token = parseBearerToken(req.headers.authorization);

    if (!token) {
      console.log('Logout requested without token');
      return res.status(200).json({ message: 'Logged out.' });
    }

    await prisma.adminSession.deleteMany({ where: { token } });

    return res.json({ message: 'Logged out.' });
  } catch (error) {
    console.error('Logout failed', error);
    return res.status(500).json({ message: 'Unable to logout right now.' });
  }
});

// ---------- Service categories ----------
app.get('/api/service-categories', async (_req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: { subCategories: true },
      orderBy: { name: 'asc' },
    });

    return res.json({ categories });
  } catch (error) {
    console.error('Public service categories fetch failed', error);
    return res.status(500).json({ message: 'Unable to load service categories.' });
  }
});

app.get('/api/services', async (_req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: { subCategory: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ services });
  } catch (error) {
    console.error('Public services fetch failed', error);
    return res.status(500).json({ message: 'Unable to load services.' });
  }
});

const validateCategoryInput = (body) => {
  const name = normalizeText(body?.name);
  const description = normalizeText(body?.description) || null;
  const providedSlug = normalizeSlug(body?.slug);
  const slugSource = providedSlug || normalizeSlug(name);
  const slug = slugSource;

  if (!name || !slug) {
    return { error: 'Name is required for the category.' };
  }

  return { name, description, slug };
};

app.get('/api/admin/service-categories', async (req, res) => {
  const { admin, status, message } = await getAuthenticatedAdmin(req);

  if (!admin) {
    const statusCode = status || 401;
    return res.status(statusCode).json({ message: message || 'Session token missing.' });
  }

  try {
    const categories = await prisma.serviceCategory.findMany({
      include: { subCategories: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ categories });
  } catch (error) {
    console.error('Admin service categories fetch failed', error);
    return res.status(500).json({ message: 'Unable to load service categories right now.' });
  }
});

app.post('/api/admin/service-categories', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateCategoryInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { name, description, slug } = validation;

    const existing = await prisma.serviceCategory.findUnique({ where: { slug } });

    if (existing) {
      return res.status(409).json({ message: 'Category with this slug already exists.' });
    }

    const category = await prisma.serviceCategory.create({
      data: { name, slug, description },
    });

    return res.status(201).json({ category, message: 'Service category created.' });
  } catch (error) {
    console.error('Service category create failed', error);
    return res.status(500).json({ message: 'Unable to create service category right now.' });
  }
});

app.put('/api/admin/service-categories/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const categoryId = req.params.id?.trim();

    if (!categoryId) {
      return res.status(400).json({ message: 'A valid category id is required.' });
    }

    const validation = validateCategoryInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { name, description, slug } = validation;

    const existing = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });

    if (!existing) {
      return res.status(404).json({ message: 'Service category not found.' });
    }

    if (slug !== existing.slug) {
      const slugOwner = await prisma.serviceCategory.findUnique({ where: { slug } });

      if (slugOwner && slugOwner.id !== categoryId) {
        return res.status(409).json({ message: 'Another category already uses this slug.' });
      }
    }

    const updated = await prisma.serviceCategory.update({
      where: { id: categoryId },
      data: { name, description, slug },
    });

    return res.json({ category: updated, message: 'Service category updated.' });
  } catch (error) {
    console.error('Service category update failed', error);
    return res.status(500).json({ message: 'Unable to update service category right now.' });
  }
});

app.delete('/api/admin/service-categories/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const categoryId = req.params.id?.trim();

    if (!categoryId) {
      return res.status(400).json({ message: 'A valid category id is required.' });
    }

    const existing = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
      include: { subCategories: { select: { id: true } } },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Service category not found.' });
    }

    const subCategoryIds = existing.subCategories.map((sub) => sub.id);

    await prisma.$transaction([
      prisma.service.updateMany({
        where: { subCategoryId: { in: subCategoryIds } },
        data: { subCategoryId: null },
      }),
      prisma.serviceSubCategory.deleteMany({ where: { id: { in: subCategoryIds } } }),
      prisma.serviceCategory.delete({ where: { id: categoryId } }),
    ]);

    return res.json({ message: 'Service category deleted.' });
  } catch (error) {
    console.error('Service category delete failed', error);
    return res.status(500).json({ message: 'Unable to delete service category right now.' });
  }
});

// ---------- Service subcategories ----------
const validateSubCategoryInput = (body) => {
  const name = normalizeText(body?.name);
  const description = normalizeText(body?.description) || null;
  const categoryId = body?.categoryId?.trim();
  const providedSlug = normalizeSlug(body?.slug);
  const slugSource = providedSlug || normalizeSlug(name);
  const slug = slugSource;

  if (!name || !slug) {
    return { error: 'Name is required for the subcategory.' };
  }

  if (!categoryId) {
    return { error: 'A parent category id is required.' };
  }

  return { name, description, categoryId, slug };
};

app.get('/api/admin/service-subcategories', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const subCategories = await prisma.serviceSubCategory.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ subCategories });
  } catch (error) {
    console.error('Service subcategories fetch failed', error);
    return res.status(500).json({ message: 'Unable to load service subcategories right now.' });
  }
});

app.post('/api/admin/service-subcategories', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateSubCategoryInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { name, description, slug, categoryId } = validation;

    const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });

    if (!category) {
      return res.status(404).json({ message: 'Parent category not found.' });
    }

    const existingSlug = await prisma.serviceSubCategory.findUnique({ where: { slug } });

    if (existingSlug) {
      return res.status(409).json({ message: 'Subcategory with this slug already exists.' });
    }

    const subCategory = await prisma.serviceSubCategory.create({
      data: { name, description, slug, categoryId },
    });

    return res.status(201).json({ subCategory, message: 'Service subcategory created.' });
  } catch (error) {
    console.error('Service subcategory create failed', error);
    return res.status(500).json({ message: 'Unable to create service subcategory right now.' });
  }
});

app.put('/api/admin/service-subcategories/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const subCategoryId = req.params.id?.trim();

    if (!subCategoryId) {
      return res.status(400).json({ message: 'A valid subcategory id is required.' });
    }

    const validation = validateSubCategoryInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { name, description, slug, categoryId } = validation;

    const subCategory = await prisma.serviceSubCategory.findUnique({ where: { id: subCategoryId } });

    if (!subCategory) {
      return res.status(404).json({ message: 'Service subcategory not found.' });
    }

    if (slug !== subCategory.slug) {
      const slugOwner = await prisma.serviceSubCategory.findUnique({ where: { slug } });

      if (slugOwner && slugOwner.id !== subCategoryId) {
        return res.status(409).json({ message: 'Another subcategory already uses this slug.' });
      }
    }

    const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });

    if (!category) {
      return res.status(404).json({ message: 'Parent category not found.' });
    }

    const updated = await prisma.serviceSubCategory.update({
      where: { id: subCategoryId },
      data: { name, description, slug, categoryId },
    });

    return res.json({ subCategory: updated, message: 'Service subcategory updated.' });
  } catch (error) {
    console.error('Service subcategory update failed', error);
    return res.status(500).json({ message: 'Unable to update service subcategory right now.' });
  }
});

app.delete('/api/admin/service-subcategories/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const subCategoryId = req.params.id?.trim();

    if (!subCategoryId) {
      return res.status(400).json({ message: 'A valid subcategory id is required.' });
    }

    const subCategory = await prisma.serviceSubCategory.findUnique({ where: { id: subCategoryId } });

    if (!subCategory) {
      return res.status(404).json({ message: 'Service subcategory not found.' });
    }

    await prisma.$transaction([
      prisma.service.updateMany({
        where: { subCategoryId },
        data: { subCategoryId: null },
      }),
      prisma.serviceSubCategory.delete({ where: { id: subCategoryId } }),
    ]);

    return res.json({ message: 'Service subcategory deleted.' });
  } catch (error) {
    console.error('Service subcategory delete failed', error);
    return res.status(500).json({ message: 'Unable to delete service subcategory right now.' });
  }
});

// ---------- Services ----------
const validateServiceInput = (body) => {
  const title = normalizeText(body?.title);
  const summary = normalizeText(body?.summary) || null;
  const imageUrl = normalizeText(body?.imageUrl) || null;
  const providedSlug = normalizeSlug(body?.slug);
  const slugSource = providedSlug || normalizeSlug(title);
  const slug = slugSource;
  const subCategoryId = body?.subCategoryId?.trim() || null;
  const tags = Array.isArray(body?.tags) ? body.tags : body?.tags ?? null;

  if (!title || !slug) {
    return { error: 'Title is required for the service.' };
  }

  return { title, summary, imageUrl, slug, subCategoryId, tags };
};

app.get('/api/admin/services', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const services = await prisma.service.findMany({
      include: { subCategory: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ services });
  } catch (error) {
    console.error('Services fetch failed', error);
    return res.status(500).json({ message: 'Unable to load services right now.' });
  }
});

app.post('/api/admin/services', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateServiceInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { title, summary, imageUrl, slug, subCategoryId, tags } = validation;

    const existing = await prisma.service.findUnique({ where: { slug } });

    if (existing) {
      return res.status(409).json({ message: 'Service with this slug already exists.' });
    }

    if (subCategoryId) {
      const subCategory = await prisma.serviceSubCategory.findUnique({ where: { id: subCategoryId } });

      if (!subCategory) {
        return res.status(404).json({ message: 'Related subcategory not found.' });
      }
    }

    const service = await prisma.service.create({
      data: { title, summary, imageUrl, slug, subCategoryId, tags },
    });

    return res.status(201).json({ service, message: 'Service created.' });
  } catch (error) {
    console.error('Service create failed', error);
    return res.status(500).json({ message: 'Unable to create service right now.' });
  }
});

app.put('/api/admin/services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const serviceId = req.params.id?.trim();

    if (!serviceId) {
      return res.status(400).json({ message: 'A valid service id is required.' });
    }

    const validation = validateServiceInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { title, summary, imageUrl, slug, subCategoryId, tags } = validation;

    const service = await prisma.service.findUnique({ where: { id: serviceId } });

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    if (slug !== service.slug) {
      const slugOwner = await prisma.service.findUnique({ where: { slug } });

      if (slugOwner && slugOwner.id !== serviceId) {
        return res.status(409).json({ message: 'Another service already uses this slug.' });
      }
    }

    if (subCategoryId) {
      const subCategory = await prisma.serviceSubCategory.findUnique({ where: { id: subCategoryId } });

      if (!subCategory) {
        return res.status(404).json({ message: 'Related subcategory not found.' });
      }
    }

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: { title, summary, imageUrl, slug, subCategoryId, tags },
    });

    return res.json({ service: updated, message: 'Service updated.' });
  } catch (error) {
    console.error('Service update failed', error);
    return res.status(500).json({ message: 'Unable to update service right now.' });
  }
});

app.delete('/api/admin/services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const serviceId = req.params.id?.trim();

    if (!serviceId) {
      return res.status(400).json({ message: 'A valid service id is required.' });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    await prisma.service.delete({ where: { id: serviceId } });

    return res.json({ message: 'Service deleted.' });
  } catch (error) {
    console.error('Service delete failed', error);
    return res.status(500).json({ message: 'Unable to delete service right now.' });
  }
});

// ---------- Hire categories and roles ----------
const validateHireCategoryInput = (body) => {
  const title = normalizeText(body?.title);
  const description = normalizeText(body?.description) || null;
  const providedSlug = normalizeSlug(body?.slug);
  const slugSource = providedSlug || normalizeSlug(title);
  const slug = slugSource;

  if (!title || !slug) {
    return { error: 'Title is required for the hire category.' };
  }

  return { title, description, slug };
};

const validateHireRoleInput = (body) => {
  const title = normalizeText(body?.title);
  const description = normalizeText(body?.description) || null;
  const hireCategoryId = body?.hireCategoryId?.trim();
  const providedSlug = normalizeSlug(body?.slug);
  const slugSource = providedSlug || normalizeSlug(title);
  const slug = slugSource;

  if (!title || !slug) {
    return { error: 'Title is required for the hire sub-category.' };
  }

  if (!hireCategoryId) {
    return { error: 'A parent hire category id is required.' };
  }

  return { title, description, hireCategoryId, slug };
};

app.get('/api/hire-categories', async (_req, res) => {
  try {
    const categories = await prisma.hireCategory.findMany({
      include: { roles: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ categories });
  } catch (error) {
    console.error('Public hire categories fetch failed', error);
    return res.status(500).json({ message: 'Unable to load hire categories.' });
  }
});

app.get('/api/admin/hire-categories', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const categories = await prisma.hireCategory.findMany({
      include: { roles: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ categories });
  } catch (error) {
    console.error('Admin hire categories fetch failed', error);
    return res.status(500).json({ message: 'Unable to load hire categories right now.' });
  }
});

app.post('/api/admin/hire-categories', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateHireCategoryInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { title, description, slug } = validation;

    const existing = await prisma.hireCategory.findUnique({ where: { slug } });

    if (existing) {
      return res.status(409).json({ message: 'Hire category with this slug already exists.' });
    }

    const category = await prisma.hireCategory.create({
      data: { title, description, slug },
    });

    return res.status(201).json({ category, message: 'Hire category created.' });
  } catch (error) {
    console.error('Hire category create failed', error);
    return res.status(500).json({ message: 'Unable to create hire category right now.' });
  }
});

app.put('/api/admin/hire-categories/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const categoryId = req.params.id?.trim();

    if (!categoryId) {
      return res.status(400).json({ message: 'A valid hire category id is required.' });
    }

    const validation = validateHireCategoryInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { title, description, slug } = validation;

    const existing = await prisma.hireCategory.findUnique({ where: { id: categoryId } });

    if (!existing) {
      return res.status(404).json({ message: 'Hire category not found.' });
    }

    if (slug !== existing.slug) {
      const slugOwner = await prisma.hireCategory.findUnique({ where: { slug } });

      if (slugOwner && slugOwner.id !== categoryId) {
        return res.status(409).json({ message: 'Another hire category already uses this slug.' });
      }
    }

    const updated = await prisma.hireCategory.update({
      where: { id: categoryId },
      data: { title, description, slug },
    });

    return res.json({ category: updated, message: 'Hire category updated.' });
  } catch (error) {
    console.error('Hire category update failed', error);
    return res.status(500).json({ message: 'Unable to update hire category right now.' });
  }
});

app.delete('/api/admin/hire-categories/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const categoryId = req.params.id?.trim();

    if (!categoryId) {
      return res.status(400).json({ message: 'A valid hire category id is required.' });
    }

    const existing = await prisma.hireCategory.findUnique({
      where: { id: categoryId },
      include: { roles: { select: { id: true } } },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Hire category not found.' });
    }

    const roleIds = existing.roles.map((role) => role.id);

    await prisma.$transaction([
      prisma.hireRole.deleteMany({ where: { id: { in: roleIds } } }),
      prisma.hireCategory.delete({ where: { id: categoryId } }),
    ]);

    return res.json({ message: 'Hire category deleted.' });
  } catch (error) {
    console.error('Hire category delete failed', error);
    return res.status(500).json({ message: 'Unable to delete hire category right now.' });
  }
});

app.get('/api/admin/hire-roles', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const roles = await prisma.hireRole.findMany({
      include: { hireCategory: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ roles });
  } catch (error) {
    console.error('Hire roles fetch failed', error);
    return res.status(500).json({ message: 'Unable to load hire roles right now.' });
  }
});

app.post('/api/admin/hire-roles', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateHireRoleInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { title, description, slug, hireCategoryId } = validation;

    const category = await prisma.hireCategory.findUnique({ where: { id: hireCategoryId } });

    if (!category) {
      return res.status(404).json({ message: 'Parent hire category not found.' });
    }

    const existingSlug = await prisma.hireRole.findUnique({ where: { slug } });

    if (existingSlug) {
      return res.status(409).json({ message: 'Hire sub-category with this slug already exists.' });
    }

    const role = await prisma.hireRole.create({
      data: { title, description, slug, hireCategoryId },
    });

    return res.status(201).json({ role, message: 'Hire sub-category created.' });
  } catch (error) {
    console.error('Hire sub-category create failed', error);
    return res.status(500).json({ message: 'Unable to create hire sub-category right now.' });
  }
});

app.put('/api/admin/hire-roles/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const roleId = req.params.id?.trim();

    if (!roleId) {
      return res.status(400).json({ message: 'A valid hire sub-category id is required.' });
    }

    const validation = validateHireRoleInput(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { title, description, slug, hireCategoryId } = validation;

    const role = await prisma.hireRole.findUnique({ where: { id: roleId } });

    if (!role) {
      return res.status(404).json({ message: 'Hire sub-category not found.' });
    }

    if (slug !== role.slug) {
      const slugOwner = await prisma.hireRole.findUnique({ where: { slug } });

      if (slugOwner && slugOwner.id !== roleId) {
        return res.status(409).json({ message: 'Another hire sub-category already uses this slug.' });
      }
    }

    const category = await prisma.hireCategory.findUnique({ where: { id: hireCategoryId } });

    if (!category) {
      return res.status(404).json({ message: 'Parent hire category not found.' });
    }

    const updated = await prisma.hireRole.update({
      where: { id: roleId },
      data: { title, description, slug, hireCategoryId },
    });

    return res.json({ role: updated, message: 'Hire sub-category updated.' });
  } catch (error) {
    console.error('Hire sub-category update failed', error);
    return res.status(500).json({ message: 'Unable to update hire sub-category right now.' });
  }
});

app.delete('/api/admin/hire-roles/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const roleId = req.params.id?.trim();

    if (!roleId) {
      return res.status(400).json({ message: 'A valid hire sub-category id is required.' });
    }

    const role = await prisma.hireRole.findUnique({ where: { id: roleId } });

    if (!role) {
      return res.status(404).json({ message: 'Hire sub-category not found.' });
    }

    await prisma.hireRole.delete({ where: { id: roleId } });

    return res.json({ message: 'Hire sub-category deleted.' });
  } catch (error) {
    console.error('Hire sub-category delete failed', error);
    return res.status(500).json({ message: 'Unable to delete hire sub-category right now.' });
  }
});

// ---------- Project Type Routes ----------

app.get('/api/project-types', async (req, res) => {
  try {
    const projectTypes = await prisma.projectType.findMany({
      orderBy: { name: 'asc' },
    });

    return res.json({ projectTypes: projectTypes.map(formatProjectTypeResponse) });
  } catch (error) {
    console.error('Project type list (public) failed', error);
    return res.status(500).json({ message: 'Unable to load project types right now.' });
  }
});

app.get('/api/admin/project-types', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const projectTypes = await prisma.projectType.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ projectTypes: projectTypes.map(formatProjectTypeResponse) });
  } catch (error) {
    console.error('Project type list failed', error);
    return res.status(500).json({ message: 'Unable to load project types right now.' });
  }
});

app.post('/api/admin/project-types', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateProjectTypeInput(req.body || {});

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { name } = validation;

    const created = await prisma.projectType.create({
      data: { name },
    });

    return res.status(201).json({ projectType: formatProjectTypeResponse(created) });
  } catch (error) {
    console.error('Project type create failed', error);

    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A project type with this name already exists.' });
    }

    return res.status(500).json({ message: 'Unable to create project type right now.' });
  }
});

app.put('/api/admin/project-types/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const projectTypeId = req.params.id?.trim();

    if (!projectTypeId) {
      return res.status(400).json({ message: 'A valid project type id is required.' });
    }

    const validation = validateProjectTypeInput(req.body || {});

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const existing = await prisma.projectType.findUnique({ where: { id: projectTypeId } });

    if (!existing) {
      return res.status(404).json({ message: 'Project type not found.' });
    }

    const { name } = validation;

    const updated = await prisma.projectType.update({
      where: { id: projectTypeId },
      data: { name },
    });

    return res.json({ projectType: formatProjectTypeResponse(updated), message: 'Project type updated.' });
  } catch (error) {
    console.error('Project type update failed', error);

    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A project type with this name already exists.' });
    }

    return res.status(500).json({ message: 'Unable to update project type right now.' });
  }
});

app.delete('/api/admin/project-types/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const projectTypeId = req.params.id?.trim();

    if (!projectTypeId) {
      return res.status(400).json({ message: 'A valid project type id is required.' });
    }

    const existing = await prisma.projectType.findUnique({ where: { id: projectTypeId } });

    if (!existing) {
      return res.status(404).json({ message: 'Project type not found.' });
    }

    await prisma.projectType.delete({ where: { id: projectTypeId } });

    return res.json({ message: 'Project type deleted.' });
  } catch (error) {
    console.error('Project type delete failed', error);
    return res.status(500).json({ message: 'Unable to delete project type right now.' });
  }
});

// ---------- Blog Category Routes ----------

app.get('/api/blog-categories', async (req, res) => {
  try {
    const categories = await prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
    return res.json({ categories: categories.map(formatBlogCategoryResponse) });
  } catch (error) {
    console.error('Blog category list (public) failed', error);
    return res.status(500).json({ message: 'Unable to load blog categories right now.' });
  }
});

app.get('/api/admin/blog-categories', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const categories = await prisma.blogCategory.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ categories: categories.map(formatBlogCategoryResponse) });
  } catch (error) {
    console.error('Blog category list failed', error);
    return res.status(500).json({ message: 'Unable to load blog categories right now.' });
  }
});

app.post('/api/admin/blog-categories', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateBlogCategoryInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.blogCategory.create({ data: { name: validation.name } });
    return res.status(201).json({ category: formatBlogCategoryResponse(created) });
  } catch (error) {
    console.error('Blog category create failed', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A category with this name already exists.' });
    }
    return res.status(500).json({ message: 'Unable to create category right now.' });
  }
});

app.put('/api/admin/blog-categories/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const categoryId = req.params.id?.trim();
    if (!categoryId) return res.status(400).json({ message: 'A valid category id is required.' });

    const validation = validateBlogCategoryInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const existing = await prisma.blogCategory.findUnique({ where: { id: categoryId } });
    if (!existing) return res.status(404).json({ message: 'Category not found.' });

    const updated = await prisma.blogCategory.update({
      where: { id: categoryId },
      data: { name: validation.name },
    });

    return res.json({ category: formatBlogCategoryResponse(updated), message: 'Category updated.' });
  } catch (error) {
    console.error('Blog category update failed', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A category with this name already exists.' });
    }
    return res.status(500).json({ message: 'Unable to update category right now.' });
  }
});

app.delete('/api/admin/blog-categories/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const categoryId = req.params.id?.trim();
    if (!categoryId) return res.status(400).json({ message: 'A valid category id is required.' });

    const existing = await prisma.blogCategory.findUnique({ where: { id: categoryId } });
    if (!existing) return res.status(404).json({ message: 'Category not found.' });

    await prisma.$transaction([
      prisma.blogPost.updateMany({ where: { categoryId }, data: { categoryId: null } }),
      prisma.blogCategory.delete({ where: { id: categoryId } }),
    ]);

    return res.json({ message: 'Category deleted.' });
  } catch (error) {
    console.error('Blog category delete failed', error);
    return res.status(500).json({ message: 'Unable to delete category right now.' });
  }
});

// ---------- Blog Post Routes ----------

app.get('/api/blog-posts', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    });

    const today = new Date();
    const published = posts.filter((post) => !post.publishedAt || post.publishedAt <= today);

    return res.json({ posts: published.map(formatBlogPostResponse) });
  } catch (error) {
    console.error('Blog post list (public) failed', error);
    return res.status(500).json({ message: 'Unable to load blog posts right now.' });
  }
});

app.get('/api/admin/blog-posts', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return res.json({ posts: posts.map(formatBlogPostResponse) });
  } catch (error) {
    console.error('Blog post list failed', error);
    return res.status(500).json({ message: 'Unable to load blog posts right now.' });
  }
});

app.post('/api/admin/blog-posts', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateBlogPostInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const { title, description, conclusion, slug, publishDate, status: uiStatus, categoryId } = validation;

    if (categoryId) {
      const categoryExists = await prisma.blogCategory.findUnique({ where: { id: categoryId } });
      if (!categoryExists) return res.status(404).json({ message: 'Selected category not found.' });
    }

    const created = await prisma.blogPost.create({
      data: {
        title,
        slug,
        summary: description,
        content: conclusion || description,
        status: mapUiStatusToPublishStatus(uiStatus),
        publishedAt: publishDate,
        categoryId: categoryId || null,
      },
      include: { category: true },
    });

    return res.status(201).json({ post: formatBlogPostResponse(created) });
  } catch (error) {
    console.error('Blog post create failed', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A blog post with this slug already exists.' });
    }
    return res.status(500).json({ message: 'Unable to create blog post right now.' });
  }
});

app.put('/api/admin/blog-posts/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: 'A valid blog post id is required.' });

    const validation = validateBlogPostInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!existing) return res.status(404).json({ message: 'Blog post not found.' });

    const { title, description, conclusion, slug, publishDate, status: uiStatus, categoryId } = validation;

    if (categoryId) {
      const categoryExists = await prisma.blogCategory.findUnique({ where: { id: categoryId } });
      if (!categoryExists) return res.status(404).json({ message: 'Selected category not found.' });
    }

    const updated = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title,
        slug,
        summary: description,
        content: conclusion || description,
        status: mapUiStatusToPublishStatus(uiStatus),
        publishedAt: publishDate,
        categoryId: categoryId || null,
      },
      include: { category: true },
    });

    return res.json({ post: formatBlogPostResponse(updated), message: 'Blog post updated.' });
  } catch (error) {
    console.error('Blog post update failed', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A blog post with this slug already exists.' });
    }
    return res.status(500).json({ message: 'Unable to update blog post right now.' });
  }
});

app.delete('/api/admin/blog-posts/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: 'A valid blog post id is required.' });

    const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!existing) return res.status(404).json({ message: 'Blog post not found.' });

    await prisma.blogPost.delete({ where: { id: postId } });
    return res.json({ message: 'Blog post deleted.' });
  } catch (error) {
    console.error('Blog post delete failed', error);
    return res.status(500).json({ message: 'Unable to delete blog post right now.' });
  }
});

// ---------- Contact Routes ----------

app.post('/api/contact', async (req, res) => {
  try {
    const validation = validateContactInput(req.body || {});

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { name, email, phone, countryCode, contactType, projectType, description, status } = validation;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        countryCode: countryCode || null,
        contactType: contactType || null,
        projectType: projectType || null,
        description,
        message: description,
        status,
      },
    });

    return res.status(201).json({ message: 'Thanks! Your enquiry has been received.' });
  } catch (error) {
    console.error('Contact submission failed', error);
    return res.status(500).json({ message: 'Unable to submit your enquiry right now.' });
  }
});

app.get('/api/admin/contacts', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ contacts: contacts.map(formatContactResponse) });
  } catch (error) {
    console.error('Contact list failed', error);
    return res.status(500).json({ message: 'Unable to load contacts right now.' });
  }
});

app.post('/api/admin/contacts', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateContactInput(req.body || {}, { allowStatusUpdate: true });

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { name, email, phone, countryCode, contactType, projectType, description, status: contactStatus } = validation;

    const created = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        countryCode: countryCode || null,
        contactType: contactType || null,
        projectType: projectType || null,
        description,
        message: description,
        status: contactStatus,
      },
    });

    return res.status(201).json({ contact: formatContactResponse(created), message: 'Contact created.' });
  } catch (error) {
    console.error('Contact create failed', error);
    return res.status(500).json({ message: 'Unable to create contact right now.' });
  }
});

app.put('/api/admin/contacts/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const contactId = req.params.id?.trim();

    if (!contactId) {
      return res.status(400).json({ message: 'A valid contact id is required.' });
    }

    const validation = validateContactInput(req.body || {}, { allowStatusUpdate: true });

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id: contactId } });

    if (!existing) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    const { name, email, phone, countryCode, contactType, projectType, description, status: contactStatus } = validation;

    const updated = await prisma.contactMessage.update({
      where: { id: contactId },
      data: {
        name,
        email,
        phone: phone || null,
        countryCode: countryCode || null,
        contactType: contactType || null,
        projectType: projectType || null,
        description,
        message: description,
        status: contactStatus,
      },
    });

    return res.json({ contact: formatContactResponse(updated), message: 'Contact updated.' });
  } catch (error) {
    console.error('Contact update failed', error);
    return res.status(500).json({ message: 'Unable to update contact right now.' });
  }
});

app.delete('/api/admin/contacts/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const contactId = req.params.id?.trim();

    if (!contactId) {
      return res.status(400).json({ message: 'A valid contact id is required.' });
    }

    await prisma.contactMessage.delete({ where: { id: contactId } });

    return res.json({ message: 'Contact deleted.' });
  } catch (error) {
    console.error('Contact delete failed', error);
    return res.status(500).json({ message: 'Unable to delete contact right now.' });
  }
});

// ---------- Feedback Routes ----------

app.get('/api/admin/feedbacks', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const feedbacks = await prisma.clientFeedback.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ feedbacks: feedbacks.map(formatFeedbackResponse) });
  } catch (error) {
    console.error('Feedback list failed', error);
    return res.status(500).json({ message: 'Unable to load feedbacks right now.' });
  }
});

app.post('/api/admin/feedbacks', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const { name, title, description, rating, submittedAt } = req.body ?? {};

    const normalizedName = name?.trim();
    const normalizedTitle = title?.trim();
    const normalizedDescription = description?.trim();
    const parsedRating = Number(rating);
    const submittedDate = submittedAt ? new Date(submittedAt) : null;
    const hasValidDate = submittedDate && !Number.isNaN(submittedDate.getTime());

    if (!normalizedName || !normalizedTitle || !normalizedDescription) {
      return res.status(400).json({ message: 'Name, title, and description are required.' });
    }

    if (!isValidRating(parsedRating)) {
      return res.status(400).json({ message: 'Rating must be a whole number between 1 and 5.' });
    }

    const feedback = await prisma.clientFeedback.create({
      data: {
        client: normalizedName,
        highlight: normalizedTitle,
        quote: normalizedDescription,
        rating: parsedRating,
        createdAt: hasValidDate ? submittedDate : undefined,
      },
    });

    return res.status(201).json({ feedback: formatFeedbackResponse(feedback), message: 'Feedback created.' });
  } catch (error) {
    console.error('Feedback creation failed', error);
    return res.status(500).json({ message: 'Unable to create feedback right now.' });
  }
});

app.put('/api/admin/feedbacks/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const feedbackId = req.params.id?.trim();

    if (!feedbackId) {
      return res.status(400).json({ message: 'A valid feedback id is required.' });
    }

    const { name, title, description, rating, submittedAt } = req.body ?? {};

    const normalizedName = name?.trim();
    const normalizedTitle = title?.trim();
    const normalizedDescription = description?.trim();
    const parsedRating = Number(rating);
    const submittedDate = submittedAt ? new Date(submittedAt) : null;
    const hasValidDate = submittedDate && !Number.isNaN(submittedDate.getTime());

    if (!normalizedName || !normalizedTitle || !normalizedDescription) {
      return res.status(400).json({ message: 'Name, title, and description are required.' });
    }

    if (!isValidRating(parsedRating)) {
      return res.status(400).json({ message: 'Rating must be a whole number between 1 and 5.' });
    }

    const existing = await prisma.clientFeedback.findUnique({ where: { id: feedbackId } });

    if (!existing) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    const updated = await prisma.clientFeedback.update({
      where: { id: feedbackId },
      data: {
        client: normalizedName,
        highlight: normalizedTitle,
        quote: normalizedDescription,
        rating: parsedRating,
        createdAt: hasValidDate ? submittedDate : existing.createdAt,
      },
    });

    return res.json({ feedback: formatFeedbackResponse(updated), message: 'Feedback updated.' });
  } catch (error) {
    console.error('Feedback update failed', error);
    return res.status(500).json({ message: 'Unable to update feedback right now.' });
  }
});

app.delete('/api/admin/feedbacks/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const feedbackId = req.params.id?.trim();

    if (!feedbackId) {
      return res.status(400).json({ message: 'A valid feedback id is required.' });
    }

    await prisma.clientFeedback.delete({ where: { id: feedbackId } });

    return res.json({ message: 'Feedback deleted.' });
  } catch (error) {
    console.error('Feedback delete failed', error);
    return res.status(500).json({ message: 'Unable to delete feedback right now.' });
  }
});

// ---------- Careers (jobs & applications) ----------

app.get('/api/careers/jobs', async (_req, res) => {
  try {
    const jobs = await prisma.careerOpening.findMany({
      where: { isOpen: true },
      orderBy: [{ postedOn: 'desc' }, { createdAt: 'desc' }],
    });

    return res.json({ jobs: jobs.map(formatCareerOpeningResponse) });
  } catch (error) {
    console.error('Public career openings fetch failed', error);
    return res.status(500).json({ message: 'Unable to load openings.' });
  }
});

app.post('/api/careers/applications', async (req, res) => {
  try {
    const validation = validateCareerApplicationInput(req.body || {});

    if (validation.error) return res.status(400).json({ message: validation.error });

    const { name, email, contact, experience, employmentType, appliedOn, resumeUrl, notes, jobId } = validation;

    if (jobId) {
      const exists = await prisma.careerOpening.findUnique({ where: { id: jobId } });
      if (!exists) return res.status(404).json({ message: 'Selected job was not found.' });
    }

    const application = await prisma.careerApplication.create({
      data: {
        name,
        email,
        contact,
        experience,
        employmentType,
        appliedOn,
        resumeUrl,
        notes,
        jobId: jobId || null,
      },
      include: { job: true },
    });

    return res.status(201).json({
      application: formatCareerApplicationResponse(application),
      message: 'Application submitted successfully.',
    });
  } catch (error) {
    console.error('Public career application failed', error);
    return res.status(500).json({ message: 'Unable to submit application right now.' });
  }
});

app.get('/api/admin/careers/jobs', async (req, res) => {
  const { admin, status, message } = await getAuthenticatedAdmin(req);

  if (!admin) {
    const code = status || 401;
    return res.status(code).json({ message: message || 'Session token missing.' });
  }

  try {
    const jobs = await prisma.careerOpening.findMany({
      orderBy: [{ postedOn: 'desc' }, { createdAt: 'desc' }],
    });

    return res.json({ jobs: jobs.map(formatCareerOpeningResponse) });
  } catch (error) {
    console.error('Admin career openings fetch failed', error);
    return res.status(500).json({ message: 'Unable to load career openings right now.' });
  }
});

app.post('/api/admin/careers/jobs', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateCareerOpeningInput(req.body || {});

    if (validation.error) return res.status(400).json({ message: validation.error });

    let { slug } = validation;
    const { title, position, experience, description, employmentType, postedOn, imageUrl } = validation;

    const existingSlug = await prisma.careerOpening.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const created = await prisma.careerOpening.create({
      data: {
        title,
        slug,
        position,
        employmentType,
        experience,
        description,
        postedOn,
        imageUrl,
      },
    });

    return res.status(201).json({ job: formatCareerOpeningResponse(created), message: 'Job created.' });
  } catch (error) {
    console.error('Career opening create failed', error);
    return res.status(500).json({ message: 'Unable to create job right now.' });
  }
});

app.put('/api/admin/careers/jobs/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const jobId = req.params.id?.trim();
    if (!jobId) return res.status(400).json({ message: 'A valid job id is required.' });

    const validation = validateCareerOpeningInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const existing = await prisma.careerOpening.findUnique({ where: { id: jobId } });
    if (!existing) return res.status(404).json({ message: 'Job not found.' });

    let { slug } = validation;
    const { title, position, experience, description, employmentType, postedOn, imageUrl } = validation;

    const slugConflict = await prisma.careerOpening.findUnique({ where: { slug } });
    if (slugConflict && slugConflict.id !== jobId) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const updated = await prisma.careerOpening.update({
      where: { id: jobId },
      data: {
        title,
        slug,
        position,
        employmentType,
        experience,
        description,
        postedOn,
        imageUrl,
      },
    });

    return res.json({ job: formatCareerOpeningResponse(updated), message: 'Job updated.' });
  } catch (error) {
    console.error('Career opening update failed', error);
    return res.status(500).json({ message: 'Unable to update job right now.' });
  }
});

app.delete('/api/admin/careers/jobs/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const jobId = req.params.id?.trim();
    if (!jobId) return res.status(400).json({ message: 'A valid job id is required.' });

    await prisma.careerOpening.delete({ where: { id: jobId } });

    return res.json({ message: 'Job deleted.' });
  } catch (error) {
    console.error('Career opening delete failed', error);
    return res.status(500).json({ message: 'Unable to delete job right now.' });
  }
});

app.get('/api/admin/careers/applications', async (req, res) => {
  const { admin, status, message } = await getAuthenticatedAdmin(req);

  if (!admin) {
    const code = status || 401;
    return res.status(code).json({ message: message || 'Session token missing.' });
  }

  try {
    const jobId = req.query?.jobId ? String(req.query.jobId) : null;
    const applications = await prisma.careerApplication.findMany({
      where: jobId ? { jobId } : {},
      include: { job: true },
      orderBy: [{ appliedOn: 'desc' }, { createdAt: 'desc' }],
    });

    return res.json({ applications: applications.map(formatCareerApplicationResponse) });
  } catch (error) {
    console.error('Admin career applications fetch failed', error);
    return res.status(500).json({ message: 'Unable to load applications right now.' });
  }
});

app.post('/api/admin/careers/applications', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateCareerApplicationInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const { name, email, contact, experience, employmentType, appliedOn, resumeUrl, notes, jobId } = validation;

    if (jobId) {
      const exists = await prisma.careerOpening.findUnique({ where: { id: jobId } });
      if (!exists) return res.status(404).json({ message: 'Selected job was not found.' });
    }

    const application = await prisma.careerApplication.create({
      data: {
        name,
        email,
        contact,
        experience,
        employmentType,
        appliedOn,
        resumeUrl,
        notes,
        jobId: jobId || null,
      },
      include: { job: true },
    });

    return res.status(201).json({
      application: formatCareerApplicationResponse(application),
      message: 'Application created.',
    });
  } catch (error) {
    console.error('Career application create failed', error);
    return res.status(500).json({ message: 'Unable to create application right now.' });
  }
});

app.put('/api/admin/careers/applications/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const applicationId = req.params.id?.trim();
    if (!applicationId) return res.status(400).json({ message: 'A valid application id is required.' });

    const validation = validateCareerApplicationInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const existing = await prisma.careerApplication.findUnique({ where: { id: applicationId } });
    if (!existing) return res.status(404).json({ message: 'Application not found.' });

    const { name, email, contact, experience, employmentType, appliedOn, resumeUrl, notes, jobId } = validation;

    if (jobId) {
      const exists = await prisma.careerOpening.findUnique({ where: { id: jobId } });
      if (!exists) return res.status(404).json({ message: 'Selected job was not found.' });
    }

    const updated = await prisma.careerApplication.update({
      where: { id: applicationId },
      data: {
        name,
        email,
        contact,
        experience,
        employmentType,
        appliedOn,
        resumeUrl,
        notes,
        jobId: jobId || null,
      },
      include: { job: true },
    });

    return res.json({ application: formatCareerApplicationResponse(updated), message: 'Application updated.' });
  } catch (error) {
    console.error('Career application update failed', error);
    return res.status(500).json({ message: 'Unable to update application right now.' });
  }
});

app.delete('/api/admin/careers/applications/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const applicationId = req.params.id?.trim();
    if (!applicationId) return res.status(400).json({ message: 'A valid application id is required.' });

    await prisma.careerApplication.delete({ where: { id: applicationId } });

    return res.json({ message: 'Application deleted.' });
  } catch (error) {
    console.error('Career application delete failed', error);
    return res.status(500).json({ message: 'Unable to delete application right now.' });
  }
});

function serializeImages(images) {
  if (!images) return null;
  if (Array.isArray(images)) return JSON.stringify(images);
  return JSON.stringify([images]);
}

function parseImages(imagesField) {
  if (!imagesField) return [];
  try {
    const parsed = JSON.parse(imagesField);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* -----------------------------------
 * BANNERS
 * ----------------------------------- */

// GET all banners
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { id: 'desc' },
    });

    const normalized = banners.map((b) => ({
      id: b.id,
      title: b.title,
      type: b.type,
      image: b.image,
      images: parseImages(b.images),
    }));

    res.json(normalized);
  } catch (err) {
    console.error('GET /api/banners error', err);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// CREATE banner
app.post('/api/banners', async (req, res) => {
  try {
    const { title, type, image, images } = req.body;
    if (!title || !type) {
      return res.status(400).json({ error: 'title and type are required' });
    }

    const created = await prisma.banner.create({
      data: {
        title,
        type,
        image: type === 'home' ? null : image || null,
        images: type === 'home' ? serializeImages(images) : null,
      },
    });

    res.status(201).json({
      id: created.id,
      title: created.title,
      type: created.type,
      image: created.image,
      images: parseImages(created.images),
    });
  } catch (err) {
    console.error('POST /api/banners error', err);
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// UPDATE banner
app.put('/api/banners/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, type, image, images } = req.body;

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        type: type ?? existing.type,
        image: (type || existing.type) === 'home' ? null : image ?? existing.image,
        images:
          (type || existing.type) === 'home'
            ? serializeImages(images ?? parseImages(existing.images))
            : null,
      },
    });

    res.json({
      id: updated.id,
      title: updated.title,
      type: updated.type,
      image: updated.image,
      images: parseImages(updated.images),
    });
  } catch (err) {
    console.error('PUT /api/banners/:id error', err);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// DELETE banner
app.delete('/api/banners/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.banner.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/banners/:id error', err);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

/* -----------------------------------
 * PROCESS STEPS
 * ----------------------------------- */

app.get('/api/process-steps', async (req, res) => {
  try {
    const steps = await prisma.processStep.findMany({ orderBy: { id: 'desc' } });
    res.json(steps);
  } catch (err) {
    console.error('GET /api/process-steps error', err);
    res.status(500).json({ error: 'Failed to fetch process steps' });
  }
});

app.post('/api/process-steps', async (req, res) => {
  try {
    const { title, description, image } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const created = await prisma.processStep.create({
      data: { title, description: description || null, image: image || null },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/process-steps error', err);
    res.status(500).json({ error: 'Failed to create process step' });
  }
});

app.put('/api/process-steps/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, image } = req.body;
    const updated = await prisma.processStep.update({
      where: { id },
      data: {
        title,
        description,
        image,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/process-steps/:id error', err);
    res.status(500).json({ error: 'Failed to update process step' });
  }
});

app.delete('/api/process-steps/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.processStep.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/process-steps/:id error', err);
    res.status(500).json({ error: 'Failed to delete process step' });
  }
});

/* -----------------------------------
 * OUR SERVICES: SLIDERS
 * ----------------------------------- */

app.get('/api/our-services/sliders', async (req, res) => {
  try {
    const sliders = await prisma.ourServicesSlider.findMany({
      orderBy: { id: 'desc' },
    });
    res.json(sliders);
  } catch (err) {
    console.error('GET /api/our-services/sliders error', err);
    res.status(500).json({ error: 'Failed to fetch sliders' });
  }
});

app.post('/api/our-services/sliders', async (req, res) => {
  try {
    const { sliderTitle, sliderDescription, sliderImage } = req.body;
    if (!sliderTitle) return res.status(400).json({ error: 'sliderTitle is required' });

    const created = await prisma.ourServicesSlider.create({
      data: {
        sliderTitle,
        sliderDescription: sliderDescription || null,
        sliderImage: sliderImage || null,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/our-services/sliders error', err);
    res.status(500).json({ error: 'Failed to create slider' });
  }
});

app.put('/api/our-services/sliders/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { sliderTitle, sliderDescription, sliderImage } = req.body;

    const updated = await prisma.ourServicesSlider.update({
      where: { id },
      data: { sliderTitle, sliderDescription, sliderImage },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/our-services/sliders/:id error', err);
    res.status(500).json({ error: 'Failed to update slider' });
  }
});

app.delete('/api/our-services/sliders/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.ourServicesSlider.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/our-services/sliders/:id error', err);
    res.status(500).json({ error: 'Failed to delete slider' });
  }
});

/* -----------------------------------
 * OUR SERVICES: SERVICE CARDS
 * ----------------------------------- */

app.get('/api/our-services/services', async (req, res) => {
  try {
    const services = await prisma.ourService.findMany({
      orderBy: { id: 'desc' },
      include: { slider: true },
    });
    res.json(services);
  } catch (err) {
    console.error('GET /api/our-services/services error', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/our-services/services', async (req, res) => {
  try {
    const { title, sliderId } = req.body;
    if (!title || !sliderId) {
      return res.status(400).json({ error: 'title and sliderId are required' });
    }

    const created = await prisma.ourService.create({
      data: { title, sliderId: Number(sliderId) },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/our-services/services error', err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/our-services/services/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, sliderId } = req.body;

    const updated = await prisma.ourService.update({
      where: { id },
      data: { title, sliderId: sliderId ? Number(sliderId) : undefined },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/our-services/services/:id error', err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/our-services/services/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.ourService.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/our-services/services/:id error', err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

/* -----------------------------------
 * INDUSTRIES (header + list)
 * ----------------------------------- */

// Header
app.get('/api/industries/config', async (req, res) => {
  try {
    let config = await prisma.industriesConfig.findUnique({ where: { id: 1 } });
    if (!config) {
      config = await prisma.industriesConfig.create({
        data: {
          id: 1,
          title: 'Industries we serve',
          description: 'Tailored solutions for digital-first leaders across sectors.',
        },
      });
    }
    res.json(config);
  } catch (err) {
    console.error('GET /api/industries/config error', err);
    res.status(500).json({ error: 'Failed to fetch industries config' });
  }
});

app.put('/api/industries/config', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updated = await prisma.industriesConfig.upsert({
      where: { id: 1 },
      update: { title, description },
      create: {
        id: 1,
        title: title || 'Industries we serve',
        description: description || '',
      },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/industries/config error', err);
    res.status(500).json({ error: 'Failed to update industries config' });
  }
});

// Items
app.get('/api/industries', async (req, res) => {
  try {
    const items = await prisma.industry.findMany({ orderBy: { id: 'desc' } });
    res.json(items);
  } catch (err) {
    console.error('GET /api/industries error', err);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});

app.post('/api/industries', async (req, res) => {
  try {
    const { title, description, image } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const created = await prisma.industry.create({
      data: { title, description: description || null, image: image || null },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/industries error', err);
    res.status(500).json({ error: 'Failed to create industry' });
  }
});

app.put('/api/industries/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, image } = req.body;

    const updated = await prisma.industry.update({
      where: { id },
      data: { title, description, image },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/industries/:id error', err);
    res.status(500).json({ error: 'Failed to update industry' });
  }
});

app.delete('/api/industries/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.industry.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/industries/:id error', err);
    res.status(500).json({ error: 'Failed to delete industry' });
  }
});

/* -----------------------------------
 * TECH SOLUTIONS (header + items)
 * ----------------------------------- */

app.get('/api/tech-solutions/config', async (req, res) => {
  try {
    let config = await prisma.techSolutionsConfig.findUnique({ where: { id: 1 } });
    if (!config) {
      config = await prisma.techSolutionsConfig.create({
        data: {
          id: 1,
          title: 'Tech solutions for all business types',
          description: '',
        },
      });
    }
    res.json(config);
  } catch (err) {
    console.error('GET /api/tech-solutions/config error', err);
    res.status(500).json({ error: 'Failed to fetch tech solutions config' });
  }
});

app.put('/api/tech-solutions/config', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updated = await prisma.techSolutionsConfig.upsert({
      where: { id: 1 },
      update: { title, description },
      create: { id: 1, title: title || '', description: description || '' },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/tech-solutions/config error', err);
    res.status(500).json({ error: 'Failed to update tech solutions config' });
  }
});

app.get('/api/tech-solutions', async (req, res) => {
  try {
    const items = await prisma.techSolution.findMany({ orderBy: { id: 'desc' } });
    res.json(items);
  } catch (err) {
    console.error('GET /api/tech-solutions error', err);
    res.status(500).json({ error: 'Failed to fetch tech solutions' });
  }
});

app.post('/api/tech-solutions', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const created = await prisma.techSolution.create({
      data: { title, description: description || null },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/tech-solutions error', err);
    res.status(500).json({ error: 'Failed to create tech solution' });
  }
});

app.put('/api/tech-solutions/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    const updated = await prisma.techSolution.update({
      where: { id },
      data: { title, description },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/tech-solutions/:id error', err);
    res.status(500).json({ error: 'Failed to update tech solution' });
  }
});

app.delete('/api/tech-solutions/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.techSolution.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/tech-solutions/:id error', err);
    res.status(500).json({ error: 'Failed to delete tech solution' });
  }
});

/* -----------------------------------
 * EXPERTISE (header + items)
 * ----------------------------------- */

app.get('/api/expertise/config', async (req, res) => {
  try {
    let config = await prisma.expertiseConfig.findUnique({ where: { id: 1 } });
    if (!config) {
      config = await prisma.expertiseConfig.create({
        data: {
          id: 1,
          title: 'Ways to choose our expertise',
          description: '',
        },
      });
    }
    res.json(config);
  } catch (err) {
    console.error('GET /api/expertise/config error', err);
    res.status(500).json({ error: 'Failed to fetch expertise config' });
  }
});

app.put('/api/expertise/config', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updated = await prisma.expertiseConfig.upsert({
      where: { id: 1 },
      update: { title, description },
      create: { id: 1, title: title || '', description: description || '' },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/expertise/config error', err);
    res.status(500).json({ error: 'Failed to update expertise config' });
  }
});

app.get('/api/expertise', async (req, res) => {
  try {
    const items = await prisma.expertiseItem.findMany({ orderBy: { id: 'desc' } });
    res.json(items);
  } catch (err) {
    console.error('GET /api/expertise error', err);
    res.status(500).json({ error: 'Failed to fetch expertise items' });
  }
});

app.post('/api/expertise', async (req, res) => {
  try {
    const { title, description, image } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const created = await prisma.expertiseItem.create({
      data: { title, description: description || null, image: image || null },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/expertise error', err);
    res.status(500).json({ error: 'Failed to create expertise item' });
  }
});

app.put('/api/expertise/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, image } = req.body;

    const updated = await prisma.expertiseItem.update({
      where: { id },
      data: { title, description, image },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/expertise/:id error', err);
    res.status(500).json({ error: 'Failed to update expertise item' });
  }
});

app.delete('/api/expertise/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.expertiseItem.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/expertise/:id error', err);
    res.status(500).json({ error: 'Failed to delete expertise item' });
  }
});

/* -----------------------------------
 * HIRE DEVELOPERS (category + subcategories)
 * ----------------------------------- */

app.get('/api/hire/categories', async (req, res) => {
  try {
    const categories = await prisma.hireCategory.findMany({
      orderBy: { id: 'desc' },
      include: { subcategories: true },
    });
    res.json(categories);
  } catch (err) {
    console.error('GET /api/hire/categories error', err);
    res.status(500).json({ error: 'Failed to fetch hire categories' });
  }
});

app.post('/api/hire/categories', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const created = await prisma.hireCategory.create({
      data: { title, description: description || null },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/hire/categories error', err);
    res.status(500).json({ error: 'Failed to create hire category' });
  }
});

app.put('/api/hire/categories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    const updated = await prisma.hireCategory.update({
      where: { id },
      data: { title, description },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire/categories/:id error', err);
    res.status(500).json({ error: 'Failed to update hire category' });
  }
});

app.delete('/api/hire/categories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.hireCategory.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire/categories/:id error', err);
    res.status(500).json({ error: 'Failed to delete hire category' });
  }
});

// Subcategories
app.post('/api/hire/categories/:categoryId/subcategories', async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const created = await prisma.hireSubcategory.create({
      data: { title, categoryId },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/hire/categories/:categoryId/subcategories error', err);
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
});

app.put('/api/hire/subcategories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    const updated = await prisma.hireSubcategory.update({
      where: { id },
      data: { title },
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire/subcategories/:id error', err);
    res.status(500).json({ error: 'Failed to update subcategory' });
  }
});

app.delete('/api/hire/subcategories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.hireSubcategory.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire/subcategories/:id error', err);
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
});

app.get('/', (_req, res) => res.json({ status: 'ok', message: 'VEDX Solutions marketing API' }));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  if (mongoClient) {
    try {
      await mongoClient.close();
    } catch (err) {
      console.error('Error closing mongo client', err);
    }
  }
  process.exit(0);
});

app.listen(port, () => {
  console.log(`✅ API server listening on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
