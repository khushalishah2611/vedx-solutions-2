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

// ---------- Static content routes ----------
const hero = {
  title: 'Unlock Your Business Potential',
  subtitle: 'Data-driven marketing campaigns that deliver measurable growth.',
  ctaPrimary: 'Get Started',
  ctaSecondary: 'View Case Studies',
  stats: [
    { label: 'Campaigns Launched', value: '1200+' },
    { label: 'Satisfied Clients', value: '500+' },
    { label: 'Average ROI', value: '340%' },
  ],
};

const advantages = [
  {
    title: 'Real-time analytics',
    description: 'Measure every click, conversion, and customer touchpoint with live dashboards.',
  },
  {
    title: 'Omni-channel strategies',
    description: 'Execute cohesive campaigns across search, social, email, and programmatic display.',
  },
  {
    title: 'Human + AI expertise',
    description: 'Blend award-winning strategists with machine learning models tuned for marketing.',
  },
  {
    title: 'Full funnel optimization',
    description: 'Drive awareness, engagement, and sales with tailored conversion journeys.',
  },
];

const differentiators = [
  {
    title: 'Industry leading onboarding',
    points: ['Kickoff workshop in under 48 hours', 'Persona and messaging strategy in 1 week', 'Launch-ready campaigns by day 14'],
  },
  {
    title: 'Performance insights',
    points: ['Weekly growth playbooks', 'Audience micro-segmentation', 'Predictive lead scoring models'],
  },
];

const reasons = [
  {
    title: 'Customizable technology stack',
    description: 'Integrate seamlessly with your CRM, CDP, and sales automation tools.',
  },
  {
    title: 'Transparent collaboration',
    description: 'Slack, dashboards, and quarterly business reviews keep everyone in sync.',
  },
  {
    title: 'Proven processes',
    description: 'Framework refined across SaaS, eCommerce, and enterprise clients.',
  },
  {
    title: 'Global delivery',
    description: 'Regional experts cover 30+ countries and 15 languages.',
  },
];

const products = [
  {
    name: 'DemandGen Accelerator',
    description: 'Launch multi-channel campaigns with creative, automation, and analytics included.',
    badge: 'Top Seller',
  },
  {
    name: 'Lifecycle Nurture Suite',
    description: 'Automated nurture flows tailored for trials, conversions, and retention.',
    badge: 'New',
  },
  {
    name: 'Commerce Growth Engine',
    description: 'Dynamic product ads, retargeting, and merchandising optimization for retailers.',
  },
];

const metrics = [
  { value: '12M+', label: 'Leads Generated' },
  { value: '250%', label: 'Average Pipeline Growth' },
  { value: '6.5x', label: 'Return on Ad Spend' },
  { value: '95%', label: 'Client Retention Rate' },
];

const faqs = [
  {
    question: 'What industries do you specialize in?',
    answer: 'We work with SaaS, FinTech, eCommerce, healthcare, and B2B service organizations.',
  },
  {
    question: 'How quickly can we launch?',
    answer: 'Most clients launch their first optimized campaigns within the first two weeks.',
  },
  {
    question: 'Do you offer performance guarantees?',
    answer: 'We set clear KPIs during onboarding and continuously iterate to exceed them.',
  },
];

const testimonials = [
  {
    quote: 'VEDX tripled our inbound opportunities within three months and gave us reporting our board loves.',
    author: 'Priya Shah',
    role: 'VP of Marketing, Aethon Labs',
  },
  {
    quote: 'The blend of strategy, creative, and data science is unmatched. They feel like an extension of our team.',
    author: 'Chris Douglas',
    role: 'Head of Growth, Stratus AI',
  },
];

app.get('/api/hero', (_req, res) => res.json(hero));
app.get('/api/advantages', (_req, res) => res.json(advantages));
app.get('/api/differentiators', (_req, res) => res.json(differentiators));
app.get('/api/reasons', (_req, res) => res.json(reasons));
app.get('/api/products', (_req, res) => res.json(products));
app.get('/api/metrics', (_req, res) => res.json(metrics));
app.get('/api/faqs', (_req, res) => res.json(faqs));
app.get('/api/testimonials', (_req, res) => res.json(testimonials));
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
