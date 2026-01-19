import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { sendOtpEmail } from './utils/email.js';

const app = express();
const port = process.env.PORT || 5000;

const prisma = new PrismaClient();
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_IMAGE_BYTES = 1 * 1024 * 1024; // 1MB

const OtpPurpose = {
  PASSWORD_RESET: 'PASSWORD_RESET',
};

app.use(cors());

app.use(
  express.json({
    limit: '10mb',      // JSON body max ~10MB
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',      // form-data urlencoded ma pan 10MB
  })
);

const isBase64Image = (value) =>
  typeof value === 'string' && /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);

const calculateBase64Bytes = (dataUrl) => {
  const [, base64Part = ''] = String(dataUrl).split(',', 2);
  const padding = (base64Part.match(/=*$/) ?? [''])[0].length;
  const base64Length = base64Part.length - padding;

  return Math.floor((base64Length * 3) / 4);
};

const hasOversizeImage = (value) => {
  const stack = [value];
  const seen = new Set();

  while (stack.length) {
    const current = stack.pop();

    if (current && typeof current === 'object') {
      if (seen.has(current)) continue;
      seen.add(current);

      if (Array.isArray(current)) {
        stack.push(...current);
      } else {
        stack.push(...Object.values(current));
      }
      continue;
    }

    if (isBase64Image(current) && calculateBase64Bytes(current) > MAX_IMAGE_BYTES) {
      return true;
    }
  }

  return false;
};

app.use((req, res, next) => {
  if (hasOversizeImage(req.body)) {
    return res.status(413).json({ error: 'Image payload too large. Maximum allowed size is 1MB.' });
  }

  return next();
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

const parseIntegerId = (value) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const getPaginationParams = (query = {}, { defaultPageSize = 10, maxPageSize = 50 } = {}) => {
  const rawPage = Number.parseInt(query.page, 10);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const rawPageSize = query.pageSize === 'all' ? 'all' : Number.parseInt(query.pageSize, 10);
  const hasUnlimited = rawPageSize === 'all' || rawPageSize === 0;

  const pageSize = hasUnlimited
    ? null
    : Math.min(maxPageSize, Math.max(1, Number.isInteger(rawPageSize) ? rawPageSize : defaultPageSize));

  const skip = pageSize ? (page - 1) * pageSize : 0;

  return { page, pageSize, skip };
};

const parseIdList = (value) => {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((part) => parseIntegerId(part))
    .filter((id) => Number.isInteger(id));
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
  postCount: category._count?.posts ?? null,
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
  const publishDate = post.publishedAt
    ? post.publishedAt.toISOString().split('T')[0]
    : null;

  return {
    id: post.id,
    title: post.title,
    subtitle: post.subtitle || '',
    slug: post.slug,

    shortDescription: post.shortDescription || post.summary || '',
    longDescription: post.longDescription || post.content || post.summary || '',

    description: post.summary || post.shortDescription || '',
    conclusion: post.conclusion || post.content || post.longDescription || '',

    coverImage: post.coverImage || post.blogImage || '',
    blogImage: post.blogImage || post.coverImage || '',

    tags: post.tags || [],

    categoryId: post.categoryId || null,
    category: post.category
      ? formatBlogCategoryResponse(post.category)
      : null,

    publishDate,
    status: deriveBlogUiStatus(post.status, publishDate),

    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

const formatTagResponse = (tag) => ({
  id: tag.id,
  name: tag.name,
  createdAt: tag.createdAt,
  updatedAt: tag.updatedAt,
});

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => normalizeText(item))
      .filter(Boolean);
  }

  return [];
};

const formatCaseStudyDetailResponse = (detail) => {
  if (!detail) return null;

  const projectOverview = {
    title: detail.projectTitle,
    subtitle: detail.projectSubtitle || '',
    description: detail.projectDescription || '',
    image: detail.projectImage || '',
  };

  const problemConfig = {
    description: detail.problemDescription || '',
    image: detail.problemImage || '',
  };

  const solutionConfig = {
    description: detail.solutionDescription || '',
  };

  const appConfig = {
    description: detail.appDescription || '',
  };

  const developmentConfig = {
    title: detail.developmentTitle || '',
    image: detail.developmentImage || '',
  };

  const problems = Array.isArray(detail.problems)
    ? detail.problems.map((item) => ({
      id: item.id,
      description: item.description || '',
    }))
    : [];

  const solutions = Array.isArray(detail.solutions)
    ? detail.solutions.map((item) => ({
      id: item.id,
      image: item.image || '',
      description: item.description || '',
    }))
    : [];

  const features = Array.isArray(detail.features)
    ? detail.features.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image || '',
      description: item.description || '',
    }))
    : [];

  const developmentChallenges = Array.isArray(detail.developmentChallenges)
    ? detail.developmentChallenges.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
    }))
    : [];

  const apps = Array.isArray(detail.apps)
    ? detail.apps.map((item) => ({
      id: item.id,
      images: normalizeStringArray(item.images),
    }))
    : [];

  const impacts = Array.isArray(detail.impacts)
    ? detail.impacts.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image || '',
    }))
    : [];

  const teamMembers = Array.isArray(detail.teamMembers)
    ? detail.teamMembers.map((item) => ({
      id: item.id,
      title: item.title,
    }))
    : [];

  const timelines = Array.isArray(detail.timelines)
    ? detail.timelines.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
    }))
    : [];

  return {
    projectOverview,
    problemConfig,
    solutionConfig,
    appConfig,
    developmentConfig,
    problems,
    solutions,
    features,
    developmentChallenges,
    apps,
    impacts,
    teamMembers,
    timelines,
  };
};

const formatCaseStudyProblemResponse = (item) => ({
  id: item.id,
  description: item.description || '',
});

const formatCaseStudySolutionResponse = (item) => ({
  id: item.id,
  image: item.image || '',
  description: item.description || '',
});

const formatCaseStudyFeatureResponse = (item) => ({
  id: item.id,
  title: item.title,
  image: item.image || '',
  description: item.description || '',
});

const formatCaseStudyChallengeResponse = (item) => ({
  id: item.id,
  title: item.title,
  image: item.image || '',
  subtitle: item.subtitle || '',
  description: item.description || '',
});

const formatCaseStudyAppResponse = (item) => ({
  id: item.id,
  images: normalizeStringArray(item.images),
});

const formatCaseStudyImpactResponse = (item) => ({
  id: item.id,
  title: item.title,
  image: item.image || '',
});

const formatCaseStudyTeamMemberResponse = (item) => ({
  id: item.id,
  title: item.title,
});

const formatCaseStudyTimelineResponse = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description || '',
});

const formatCaseStudyResponse = (caseStudy) => ({
  id: caseStudy.id,
  slug: caseStudy.slug,
  title: caseStudy.title,
  subtitle: caseStudy.subtitle || '',
  description: caseStudy.description || '',
  coverImage: caseStudy.coverImage || '',
  tags: Array.isArray(caseStudy.tags) ? caseStudy.tags.map(formatTagResponse) : [],
  tagIds: Array.isArray(caseStudy.tags) ? caseStudy.tags.map((tag) => tag.id) : [],
  detail: caseStudy.detail ? formatCaseStudyDetailResponse(caseStudy.detail) : undefined,
  createdAt: caseStudy.createdAt,
  updatedAt: caseStudy.updatedAt,
});

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

const validateTagInput = (body) => {
  const name = normalizeText(body?.name);

  if (!name) {
    return { error: 'Tag name is required.' };
  }

  return { name };
};

const validateCaseStudyInput = (body) => {
  const title = normalizeText(body?.title);
  const subtitle = normalizeText(body?.subtitle);
  const description = normalizeText(body?.description);
  const coverImage = normalizeText(body?.coverImage) || null;
  const slug = normalizeSlug(body?.slug || title) || null;
  const tagIds = Array.isArray(body?.tagIds)
    ? (body.tagIds || [])
        .map((value) => parseIntegerId(value))
        .filter((value) => Number.isInteger(value))
    : [];

  if (!title) return { error: 'Title is required.' };
  if (!slug) return { error: 'A valid slug is required.' };

  return { title, subtitle, description, coverImage, slug, tagIds };
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

const normalizeAdminStatusFilter = (status) => {
  const rawStatus = normalizeText(status);

  if (!rawStatus) return null;

  const normalized = rawStatus.toUpperCase();
  if (['PUBLISHED', 'PUBLISH', 'PUBLISHING'].includes(normalized)) return 'PUBLISHED';
  if (['SCHEDULED', 'REVIEW'].includes(normalized)) return 'REVIEW';
  if (normalized === 'DRAFT') return 'DRAFT';

  const uiNormalized = normalizeBlogStatus(status);
  return mapUiStatusToPublishStatus(uiNormalized);
};

const validateBlogPostInput = (body) => {
  const title = normalizeText(body?.title);
  const subtitle = normalizeText(body?.subtitle);
  const shortDescription = normalizeText(body?.shortDescription);
  const longDescription = normalizeText(body?.longDescription);
  const conclusion = normalizeText(body?.conclusion);

  const coverImage = normalizeText(body?.coverImage) || null;
  const blogImage = normalizeText(body?.blogImage) || null;

  const slugInput = normalizeText(body?.slug || body?.title);
  const slug = normalizeSlug(slugInput) || `post-${Date.now()}`;

  const publishDate = normalizePublishDate(body?.publishDate);
  const status = normalizeBlogStatus(body?.status);
  const categoryId = parseIntegerId(body?.categoryId) ?? null;

  if (!title) return { error: 'Title is required.' };
  if (!shortDescription) return { error: 'Short description is required.' };
  if (!longDescription) return { error: 'Long description is required.' };
  if (!conclusion) return { error: 'Conclusion is required.' };

  return {
    title,
    subtitle,
    shortDescription,
    longDescription,
    conclusion,
    coverImage,
    blogImage,
    slug,
    publishDate,
    status,
    categoryId,
  };
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
  const jobId = parseIntegerId(body?.jobId) ?? null;

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

app.get('/api/service-subcategories', async (_req, res) => {
  try {
    const subCategories = await prisma.serviceSubCategory.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ subCategories });
  } catch (error) {
    console.error('Public service subcategories fetch failed', error);
    return res.status(500).json({ message: 'Unable to load service subcategories.' });
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

    const categoryId = parseIntegerId(req.params.id);

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

    const categoryId = parseIntegerId(req.params.id);

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
  const categoryId = parseIntegerId(body?.categoryId);
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

    const subCategoryId = parseIntegerId(req.params.id);

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

    const subCategoryId = parseIntegerId(req.params.id);

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

    const serviceId = parseIntegerId(req.params.id);

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

    const serviceId = parseIntegerId(req.params.id);

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
  const hireCategoryId = parseIntegerId(body?.hireCategoryId);
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

    const categoryId = parseIntegerId(req.params.id);

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

    const categoryId = parseIntegerId(req.params.id);

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

    const roleId = parseIntegerId(req.params.id);

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

    const roleId = parseIntegerId(req.params.id);

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

    const projectTypeId = parseIntegerId(req.params.id);

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

    const projectTypeId = parseIntegerId(req.params.id);

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
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
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

    const categories = await prisma.blogCategory.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { posts: true } } },
    });
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

    const categoryId = parseIntegerId(req.params.id);
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

    const categoryId = parseIntegerId(req.params.id);
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
    const { page, pageSize, skip } = getPaginationParams(req.query, { defaultPageSize: 6, maxPageSize: 50 });
    const categoryIds = parseIdList(req.query.categoryIds || req.query.categories);
    const singleCategory = parseIntegerId(req.query.categoryId);
    const targetCategories = categoryIds.length > 0 ? categoryIds : singleCategory ? [singleCategory] : [];

    const searchTerm = normalizeText(req.query.search || req.query.q);
    const excludeSlug = normalizeSlug(req.query.excludeSlug || req.query.exclude);

    const today = new Date();

    const where = {
      status: 'PUBLISHED',
      AND: [
        { OR: [{ publishedAt: null }, { publishedAt: { lte: today } }] },
      ],
    };

    if (targetCategories.length > 0) {
      where.AND.push({ categoryId: { in: targetCategories } });
    }

    if (req.query.uncategorized === 'true') {
      where.AND.push({ categoryId: null });
    }

    if (searchTerm) {
      where.AND.push({
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { summary: { contains: searchTerm, mode: 'insensitive' } },
          { shortDescription: { contains: searchTerm, mode: 'insensitive' } },
          { longDescription: { contains: searchTerm, mode: 'insensitive' } },
          { conclusion: { contains: searchTerm, mode: 'insensitive' } },
        ],
      });
    }

    const total = await prisma.blogPost.count({ where });

    let adjustedTotal = total;
    if (excludeSlug) {
      const slugWhere = {
        ...where,
        AND: [...(where.AND || []), { slug: excludeSlug }],
      };
      const excludedCount = await prisma.blogPost.count({ where: slugWhere });
      adjustedTotal = Math.max(0, total - excludedCount);
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: { category: true },
      skip: pageSize ? skip : undefined,
      take: pageSize || undefined,
    });

    const filteredPosts = excludeSlug ? posts.filter((post) => post.slug !== excludeSlug) : posts;

    const metaPageSize = pageSize || Math.max(1, filteredPosts.length || 1);
    const pagination = {
      page,
      pageSize: metaPageSize,
      total: adjustedTotal,
      totalPages: pageSize ? Math.max(1, Math.ceil(adjustedTotal / metaPageSize)) : 1,
    };

    return res.json({ posts: filteredPosts.map(formatBlogPostResponse), pagination });
  } catch (error) {
    console.error('Blog post list (public) failed', error);
    return res.status(500).json({ message: 'Unable to load blog posts right now.' });
  }
});

app.get('/api/blog-posts/:slug', async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug);
    if (!slug) {
      return res.status(400).json({ message: 'A valid slug is required.' });
    }

    const today = new Date();
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
        OR: [{ publishedAt: null }, { publishedAt: { lte: today } }],
      },
      include: { category: true },
    });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    return res.json({ post: formatBlogPostResponse(post) });
  } catch (error) {
    console.error('Blog post detail (public) failed', error);
    return res.status(500).json({ message: 'Unable to load blog post right now.' });
  }
});

app.get('/api/admin/blog-posts', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const { page, pageSize, skip } = getPaginationParams(req.query, { defaultPageSize: 20, maxPageSize: 100 });
    const categoryIds = parseIdList(req.query.categoryIds || req.query.categories);
    const singleCategory = parseIntegerId(req.query.categoryId);
    const targetCategories = categoryIds.length > 0 ? categoryIds : singleCategory ? [singleCategory] : [];
    const searchTerm = normalizeText(req.query.search || req.query.q);
    const statusFilter = normalizeAdminStatusFilter(req.query.status);

    const where = {};

    if (targetCategories.length > 0) {
      where.categoryId = { in: targetCategories };
    }

    if (req.query.uncategorized === 'true') {
      where.categoryId = null;
    }

    if (statusFilter) {
      where.status = statusFilter;
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
        { shortDescription: { contains: searchTerm, mode: 'insensitive' } },
        { longDescription: { contains: searchTerm, mode: 'insensitive' } },
        { conclusion: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.blogPost.count({ where });

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
      skip: pageSize ? skip : undefined,
      take: pageSize || undefined,
    });

    const metaPageSize = pageSize || Math.max(1, posts.length || 1);
    const pagination = {
      page,
      pageSize: metaPageSize,
      total,
      totalPages: pageSize ? Math.max(1, Math.ceil(total / metaPageSize)) : 1,
    };

    return res.json({ posts: posts.map(formatBlogPostResponse), pagination });
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
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const {
      title,
      subtitle,
      shortDescription,
      longDescription,
      conclusion,
      blogImage,
      coverImage,
      slug,
      publishDate,
      status: uiStatus,
      categoryId,
    } = validation;

    // Category validation
    if (categoryId) {
      const categoryExists = await prisma.blogCategory.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return res.status(404).json({ message: 'Selected category not found.' });
      }
    }

    const created = await prisma.blogPost.create({
      data: {
        title,
        subtitle,
        slug,

        summary: shortDescription,
        shortDescription,
        longDescription,

        conclusion,
        content: longDescription || conclusion || shortDescription,

        coverImage: coverImage || blogImage,
        blogImage,

        status: mapUiStatusToPublishStatus(uiStatus),
        publishedAt: publishDate,

        categoryId: categoryId || null,
      },
      include: { category: true },
    });

    return res.status(201).json({
      post: formatBlogPostResponse(created),
      message: 'Blog post created successfully.',
    });
  } catch (error) {
    console.error('Blog post create failed', error);
    if (error?.code === 'P2002') {
      return res
        .status(409)
        .json({ message: 'A blog post with this slug already exists.' });
    }
    return res
      .status(500)
      .json({ message: 'Unable to create blog post right now.' });
  }
});

app.put('/api/admin/blog-posts/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const postId = parseIntegerId(req.params.id);
    if (!postId) {
      return res.status(400).json({ message: 'A valid blog post id is required.' });
    }

    const validation = validateBlogPostInput(req.body || {});
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const existing = await prisma.blogPost.findUnique({
      where: { id: postId },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    const {
      title,
      subtitle,
      shortDescription,
      longDescription,
      conclusion,
      blogImage,
      coverImage,
      slug,
      publishDate,
      status: uiStatus,
      categoryId,
    } = validation;

    // Category validation
    if (categoryId) {
      const categoryExists = await prisma.blogCategory.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return res.status(404).json({ message: 'Selected category not found.' });
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title,
        subtitle,
        slug,

        summary: shortDescription,
        shortDescription,
        longDescription,

        conclusion,
        content: longDescription || conclusion || shortDescription,

        coverImage: coverImage || blogImage,
        blogImage,

        status: mapUiStatusToPublishStatus(uiStatus),
        publishedAt: publishDate,

        categoryId: categoryId || null,
      },
      include: { category: true },
    });

    return res.json({
      post: formatBlogPostResponse(updated),
      message: 'Blog post updated successfully.',
    });
  } catch (error) {
    console.error('Blog post update failed', error);
    if (error?.code === 'P2002') {
      return res
        .status(409)
        .json({ message: 'A blog post with this slug already exists.' });
    }
    return res
      .status(500)
      .json({ message: 'Unable to update blog post right now.' });
  }
});

app.delete('/api/admin/blog-posts/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const postId = parseIntegerId(req.params.id);
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

// ---------- Case Study + Tag Routes ----------

app.get('/api/tags', async (_req, res) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
    return res.json({ tags: tags.map(formatTagResponse) });
  } catch (error) {
    console.error('Tag list (public) failed', error);
    return res.status(500).json({ message: 'Unable to load tags right now.' });
  }
});

app.get('/api/admin/tags', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const tags = await prisma.tag.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ tags: tags.map(formatTagResponse) });
  } catch (error) {
    console.error('Tag list failed', error);
    return res.status(500).json({ message: 'Unable to load tags right now.' });
  }
});

app.post('/api/admin/tags', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateTagInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.tag.create({ data: { name: validation.name } });
    return res.status(201).json({ tag: formatTagResponse(created) });
  } catch (error) {
    console.error('Tag create failed', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A tag with this name already exists.' });
    }
    return res.status(500).json({ message: 'Unable to create tag right now.' });
  }
});

app.put('/api/admin/tags/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const tagId = parseIntegerId(req.params.id);
    if (!tagId) return res.status(400).json({ message: 'A valid tag id is required.' });

    const validation = validateTagInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const existing = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!existing) return res.status(404).json({ message: 'Tag not found.' });

    const updated = await prisma.tag.update({
      where: { id: tagId },
      data: { name: validation.name },
    });

    return res.json({ tag: formatTagResponse(updated), message: 'Tag updated.' });
  } catch (error) {
    console.error('Tag update failed', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A tag with this name already exists.' });
    }
    return res.status(500).json({ message: 'Unable to update tag right now.' });
  }
});

app.delete('/api/admin/tags/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const tagId = parseIntegerId(req.params.id);
    if (!tagId) return res.status(400).json({ message: 'A valid tag id is required.' });

    const existing = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!existing) return res.status(404).json({ message: 'Tag not found.' });

    await prisma.tag.delete({ where: { id: tagId } });
    return res.json({ message: 'Tag deleted.' });
  } catch (error) {
    console.error('Tag delete failed', error);
    return res.status(500).json({ message: 'Unable to delete tag right now.' });
  }
});

app.get('/api/case-studies', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPaginationParams(req.query, { defaultPageSize: 9, maxPageSize: 50 });
    const tagIds = parseIdList(req.query.tagIds || req.query.tags);
    const searchTerm = normalizeText(req.query.search || req.query.q);

    const where = {};

    if (tagIds.length > 0) {
      where.tags = { some: { id: { in: tagIds } } };
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { subtitle: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.caseStudy.count({ where });
    const caseStudies = await prisma.caseStudy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
      skip: pageSize ? skip : undefined,
      take: pageSize || undefined,
    });

    const metaPageSize = pageSize || Math.max(1, caseStudies.length || 1);
    const pagination = {
      page,
      pageSize: metaPageSize,
      total,
      totalPages: pageSize ? Math.max(1, Math.ceil(total / metaPageSize)) : 1,
    };

    return res.json({
      caseStudies: caseStudies.map(formatCaseStudyResponse),
      pagination,
    });
  } catch (error) {
    console.error('Case study list (public) failed', error);
    return res.status(500).json({ message: 'Unable to load case studies right now.' });
  }
});

const CASE_STUDY_DETAIL_INCLUDE = {
  tags: true,
  detail: {
    include: {
      problems: true,
      solutions: true,
      features: true,
      developmentChallenges: true,
      apps: true,
      impacts: true,
      teamMembers: true,
      timelines: true,
    },
  },
};

app.get('/api/case-studies/:slug', async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug);
    if (!slug) return res.status(400).json({ message: 'A valid slug is required.' });

    const caseStudy = await prisma.caseStudy.findFirst({
      where: { slug },
      include: CASE_STUDY_DETAIL_INCLUDE,
    });

    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found.' });
    }

    return res.json({ caseStudy: formatCaseStudyResponse(caseStudy) });
  } catch (error) {
    console.error('Case study detail failed', error);
    return res.status(500).json({ message: 'Unable to load case study right now.' });
  }
});

app.get('/api/admin/case-studies', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const { page, pageSize, skip } = getPaginationParams(req.query, { defaultPageSize: 20, maxPageSize: 100 });
    const tagIds = parseIdList(req.query.tagIds || req.query.tags);
    const searchTerm = normalizeText(req.query.search || req.query.q);

    const where = {};

    if (tagIds.length > 0) {
      where.tags = { some: { id: { in: tagIds } } };
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { subtitle: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.caseStudy.count({ where });
    const caseStudies = await prisma.caseStudy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
      skip: pageSize ? skip : undefined,
      take: pageSize || undefined,
    });

    const metaPageSize = pageSize || Math.max(1, caseStudies.length || 1);
    const pagination = {
      page,
      pageSize: metaPageSize,
      total,
      totalPages: pageSize ? Math.max(1, Math.ceil(total / metaPageSize)) : 1,
    };

    return res.json({
      caseStudies: caseStudies.map(formatCaseStudyResponse),
      pagination,
    });
  } catch (error) {
    console.error('Case study list (admin) failed', error);
    return res.status(500).json({ message: 'Unable to load case studies right now.' });
  }
});

app.post('/api/admin/case-studies', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const validation = validateCaseStudyInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const { title, subtitle, description, coverImage, slug, tagIds } = validation;

    if (tagIds.length > 0) {
      const existingTags = await prisma.tag.findMany({ where: { id: { in: tagIds } } });
      if (existingTags.length !== tagIds.length) {
        return res.status(404).json({ message: 'One or more selected tags were not found.' });
      }
    }

    const created = await prisma.caseStudy.create({
      data: {
        title,
        subtitle,
        description,
        coverImage,
        slug,
        tags: tagIds.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      },
      include: { tags: true },
    });

    return res.status(201).json({
      caseStudy: formatCaseStudyResponse(created),
      message: 'Case study created successfully.',
    });
  } catch (error) {
    console.error('Case study create failed', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A case study with this slug already exists.' });
    }
    return res.status(500).json({ message: 'Unable to create case study right now.' });
  }
});

app.put('/api/admin/case-studies/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const validation = validateCaseStudyInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const existing = await prisma.caseStudy.findUnique({ where: { id: caseStudyId }, include: { tags: true } });
    if (!existing) return res.status(404).json({ message: 'Case study not found.' });

    const { title, subtitle, description, coverImage, slug, tagIds } = validation;

    if (tagIds.length > 0) {
      const existingTags = await prisma.tag.findMany({ where: { id: { in: tagIds } } });
      if (existingTags.length !== tagIds.length) {
        return res.status(404).json({ message: 'One or more selected tags were not found.' });
      }
    }

    const updated = await prisma.caseStudy.update({
      where: { id: caseStudyId },
      data: {
        title,
        subtitle,
        description,
        coverImage,
        slug,
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
      },
      include: { tags: true },
    });

    return res.json({
      caseStudy: formatCaseStudyResponse(updated),
      message: 'Case study updated successfully.',
    });
  } catch (error) {
    console.error('Case study update failed', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'A case study with this slug already exists.' });
    }
    return res.status(500).json({ message: 'Unable to update case study right now.' });
  }
});

app.delete('/api/admin/case-studies/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const existing = await prisma.caseStudy.findUnique({ where: { id: caseStudyId } });
    if (!existing) return res.status(404).json({ message: 'Case study not found.' });

    await prisma.caseStudy.delete({ where: { id: caseStudyId } });
    return res.json({ message: 'Case study deleted.' });
  } catch (error) {
    console.error('Case study delete failed', error);
    return res.status(500).json({ message: 'Unable to delete case study right now.' });
  }
});

app.get('/api/admin/case-studies/:id/details', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const caseStudy = await prisma.caseStudy.findUnique({
      where: { id: caseStudyId },
      include: CASE_STUDY_DETAIL_INCLUDE,
    });

    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found.' });
    }

    return res.json({
      caseStudy: formatCaseStudyResponse(caseStudy),
      detail: formatCaseStudyDetailResponse(caseStudy.detail),
    });
  } catch (error) {
    console.error('Case study detail fetch failed', error);
    return res.status(500).json({ message: 'Unable to load case study detail right now.' });
  }
});

app.put('/api/admin/case-studies/:id/details', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const validation = validateCaseStudyOverviewInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const existing = await prisma.caseStudy.findUnique({ where: { id: caseStudyId } });
    if (!existing) return res.status(404).json({ message: 'Case study not found.' });

    const detail = await prisma.caseStudyDetail.upsert({
      where: { caseStudyId },
      update: {
        projectTitle: validation.projectOverview.title,
        projectSubtitle: validation.projectOverview.subtitle,
        projectDescription: validation.projectOverview.description,
        projectImage: validation.projectOverview.image,
      },
      create: {
        caseStudyId,
        projectTitle: validation.projectOverview.title,
        projectSubtitle: validation.projectOverview.subtitle,
        projectDescription: validation.projectOverview.description,
        projectImage: validation.projectOverview.image,
      },
    });

    const updatedCaseStudy = await prisma.caseStudy.findUnique({
      where: { id: caseStudyId },
      include: CASE_STUDY_DETAIL_INCLUDE,
    });

    return res.json({
      message: 'Case study detail saved successfully.',
      caseStudy: formatCaseStudyResponse(updatedCaseStudy),
      detail: formatCaseStudyDetailResponse(updatedCaseStudy?.detail),
    });
  } catch (error) {
    console.error('Case study detail save failed', error);
    return res.status(500).json({ message: 'Unable to save case study detail right now.' });
  }
});

app.put('/api/admin/case-studies/:id/section-configs', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const updateData = {};
    const { problemConfig, solutionConfig, appConfig, developmentConfig } = req.body || {};

    if (problemConfig) {
      const validation = validateProblemConfigInput(problemConfig);
      if (validation.error) return res.status(400).json({ message: validation.error });
      updateData.problemDescription = validation.description;
      updateData.problemImage = validation.image;
    }

    if (solutionConfig) {
      const validation = validateSolutionConfigInput(solutionConfig);
      if (validation.error) return res.status(400).json({ message: validation.error });
      updateData.solutionDescription = validation.description;
    }

    if (appConfig) {
      const validation = validateAppConfigInput(appConfig);
      if (validation.error) return res.status(400).json({ message: validation.error });
      updateData.appDescription = validation.description;
    }

    if (developmentConfig) {
      const validation = validateDevelopmentConfigInput(developmentConfig);
      if (validation.error) return res.status(400).json({ message: validation.error });
      updateData.developmentTitle = validation.title;
      updateData.developmentImage = validation.image;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Provide at least one section config to update.' });
    }

    await prisma.caseStudyDetail.update({
      where: { id: detail.id },
      data: updateData,
    });

    const updatedCaseStudy = await prisma.caseStudy.findUnique({
      where: { id: caseStudyId },
      include: CASE_STUDY_DETAIL_INCLUDE,
    });

    return res.json({
      message: 'Case study section config saved successfully.',
      caseStudy: formatCaseStudyResponse(updatedCaseStudy),
      detail: formatCaseStudyDetailResponse(updatedCaseStudy?.detail),
    });
  } catch (error) {
    console.error('Case study section config save failed', error);
    return res.status(500).json({ message: 'Unable to save section config right now.' });
  }
});

app.get('/api/admin/case-studies/:id/problems', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.json({ items: [] });

    const items = await prisma.caseStudyProblem.findMany({
      where: { detailId: detail.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ items: items.map(formatCaseStudyProblemResponse) });
  } catch (error) {
    console.error('Case study problems fetch failed', error);
    return res.status(500).json({ message: 'Unable to load problems right now.' });
  }
});

app.post('/api/admin/case-studies/:id/problems', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const validation = validateProblemInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.caseStudyProblem.create({
      data: {
        detailId: detail.id,
        description: validation.description,
      },
    });

    return res.status(201).json({
      message: 'Problem created.',
      item: formatCaseStudyProblemResponse(created),
    });
  } catch (error) {
    console.error('Case study problem create failed', error);
    return res.status(500).json({ message: 'Unable to create problem right now.' });
  }
});

app.put('/api/admin/case-studies/:id/problems/:problemId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const problemId = parseIntegerId(req.params.problemId);
    if (!caseStudyId || !problemId) return res.status(400).json({ message: 'A valid problem id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyProblem.findUnique({ where: { id: problemId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    const validation = validateProblemInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const updated = await prisma.caseStudyProblem.update({
      where: { id: problemId },
      data: {
        description: validation.description,
      },
    });

    return res.json({
      message: 'Problem updated.',
      item: formatCaseStudyProblemResponse(updated),
    });
  } catch (error) {
    console.error('Case study problem update failed', error);
    return res.status(500).json({ message: 'Unable to update problem right now.' });
  }
});

app.delete('/api/admin/case-studies/:id/problems/:problemId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const problemId = parseIntegerId(req.params.problemId);
    if (!caseStudyId || !problemId) return res.status(400).json({ message: 'A valid problem id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyProblem.findUnique({ where: { id: problemId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    await prisma.caseStudyProblem.delete({ where: { id: problemId } });
    return res.json({ message: 'Problem deleted.' });
  } catch (error) {
    console.error('Case study problem delete failed', error);
    return res.status(500).json({ message: 'Unable to delete problem right now.' });
  }
});

app.get('/api/admin/case-studies/:id/solutions', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.json({ items: [] });

    const items = await prisma.caseStudySolution.findMany({
      where: { detailId: detail.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ items: items.map(formatCaseStudySolutionResponse) });
  } catch (error) {
    console.error('Case study solutions fetch failed', error);
    return res.status(500).json({ message: 'Unable to load solutions right now.' });
  }
});

app.post('/api/admin/case-studies/:id/solutions', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const validation = validateSolutionInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.caseStudySolution.create({
      data: {
        detailId: detail.id,
        image: validation.image,
        description: validation.description,
      },
    });

    return res.status(201).json({
      message: 'Solution created.',
      item: formatCaseStudySolutionResponse(created),
    });
  } catch (error) {
    console.error('Case study solution create failed', error);
    return res.status(500).json({ message: 'Unable to create solution right now.' });
  }
});

app.put('/api/admin/case-studies/:id/solutions/:solutionId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const solutionId = parseIntegerId(req.params.solutionId);
    if (!caseStudyId || !solutionId) return res.status(400).json({ message: 'A valid solution id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudySolution.findUnique({ where: { id: solutionId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Solution not found.' });
    }

    const validation = validateSolutionInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const updated = await prisma.caseStudySolution.update({
      where: { id: solutionId },
      data: {
        image: validation.image,
        description: validation.description,
      },
    });

    return res.json({
      message: 'Solution updated.',
      item: formatCaseStudySolutionResponse(updated),
    });
  } catch (error) {
    console.error('Case study solution update failed', error);
    return res.status(500).json({ message: 'Unable to update solution right now.' });
  }
});

app.delete('/api/admin/case-studies/:id/solutions/:solutionId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const solutionId = parseIntegerId(req.params.solutionId);
    if (!caseStudyId || !solutionId) return res.status(400).json({ message: 'A valid solution id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudySolution.findUnique({ where: { id: solutionId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Solution not found.' });
    }

    await prisma.caseStudySolution.delete({ where: { id: solutionId } });
    return res.json({ message: 'Solution deleted.' });
  } catch (error) {
    console.error('Case study solution delete failed', error);
    return res.status(500).json({ message: 'Unable to delete solution right now.' });
  }
});

app.get('/api/admin/case-studies/:id/features', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.json({ items: [] });

    const items = await prisma.caseStudyFeature.findMany({
      where: { detailId: detail.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ items: items.map(formatCaseStudyFeatureResponse) });
  } catch (error) {
    console.error('Case study features fetch failed', error);
    return res.status(500).json({ message: 'Unable to load features right now.' });
  }
});

app.post('/api/admin/case-studies/:id/features', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const validation = validateFeatureInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.caseStudyFeature.create({
      data: {
        detailId: detail.id,
        title: validation.title,
        image: validation.image,
        description: validation.description,
      },
    });

    return res.status(201).json({
      message: 'Feature created.',
      item: formatCaseStudyFeatureResponse(created),
    });
  } catch (error) {
    console.error('Case study feature create failed', error);
    return res.status(500).json({ message: 'Unable to create feature right now.' });
  }
});

app.put('/api/admin/case-studies/:id/features/:featureId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const featureId = parseIntegerId(req.params.featureId);
    if (!caseStudyId || !featureId) return res.status(400).json({ message: 'A valid feature id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyFeature.findUnique({ where: { id: featureId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Feature not found.' });
    }

    const validation = validateFeatureInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const updated = await prisma.caseStudyFeature.update({
      where: { id: featureId },
      data: {
        title: validation.title,
        image: validation.image,
        description: validation.description,
      },
    });

    return res.json({
      message: 'Feature updated.',
      item: formatCaseStudyFeatureResponse(updated),
    });
  } catch (error) {
    console.error('Case study feature update failed', error);
    return res.status(500).json({ message: 'Unable to update feature right now.' });
  }
});

app.delete('/api/admin/case-studies/:id/features/:featureId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const featureId = parseIntegerId(req.params.featureId);
    if (!caseStudyId || !featureId) return res.status(400).json({ message: 'A valid feature id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyFeature.findUnique({ where: { id: featureId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Feature not found.' });
    }

    await prisma.caseStudyFeature.delete({ where: { id: featureId } });
    return res.json({ message: 'Feature deleted.' });
  } catch (error) {
    console.error('Case study feature delete failed', error);
    return res.status(500).json({ message: 'Unable to delete feature right now.' });
  }
});

app.get('/api/admin/case-studies/:id/development-challenges', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.json({ items: [] });

    const items = await prisma.caseStudyDevelopmentChallenge.findMany({
      where: { detailId: detail.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ items: items.map(formatCaseStudyChallengeResponse) });
  } catch (error) {
    console.error('Case study challenges fetch failed', error);
    return res.status(500).json({ message: 'Unable to load challenges right now.' });
  }
});

app.post('/api/admin/case-studies/:id/development-challenges', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const validation = validateDevelopmentChallengeInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.caseStudyDevelopmentChallenge.create({
      data: {
        detailId: detail.id,
        title: validation.title,
        image: validation.image,
        subtitle: validation.subtitle,
        description: validation.description,
      },
    });

    return res.status(201).json({
      message: 'Challenge created.',
      item: formatCaseStudyChallengeResponse(created),
    });
  } catch (error) {
    console.error('Case study challenge create failed', error);
    return res.status(500).json({ message: 'Unable to create challenge right now.' });
  }
});

app.put('/api/admin/case-studies/:id/development-challenges/:challengeId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const challengeId = parseIntegerId(req.params.challengeId);
    if (!caseStudyId || !challengeId) return res.status(400).json({ message: 'A valid challenge id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyDevelopmentChallenge.findUnique({ where: { id: challengeId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Challenge not found.' });
    }

    const validation = validateDevelopmentChallengeInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const updated = await prisma.caseStudyDevelopmentChallenge.update({
      where: { id: challengeId },
      data: {
        title: validation.title,
        image: validation.image,
        subtitle: validation.subtitle,
        description: validation.description,
      },
    });

    return res.json({
      message: 'Challenge updated.',
      item: formatCaseStudyChallengeResponse(updated),
    });
  } catch (error) {
    console.error('Case study challenge update failed', error);
    return res.status(500).json({ message: 'Unable to update challenge right now.' });
  }
});

app.delete('/api/admin/case-studies/:id/development-challenges/:challengeId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const challengeId = parseIntegerId(req.params.challengeId);
    if (!caseStudyId || !challengeId) return res.status(400).json({ message: 'A valid challenge id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyDevelopmentChallenge.findUnique({ where: { id: challengeId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Challenge not found.' });
    }

    await prisma.caseStudyDevelopmentChallenge.delete({ where: { id: challengeId } });
    return res.json({ message: 'Challenge deleted.' });
  } catch (error) {
    console.error('Case study challenge delete failed', error);
    return res.status(500).json({ message: 'Unable to delete challenge right now.' });
  }
});

app.get('/api/admin/case-studies/:id/apps', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.json({ items: [] });

    const items = await prisma.caseStudyApp.findMany({
      where: { detailId: detail.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ items: items.map(formatCaseStudyAppResponse) });
  } catch (error) {
    console.error('Case study apps fetch failed', error);
    return res.status(500).json({ message: 'Unable to load apps right now.' });
  }
});

app.post('/api/admin/case-studies/:id/apps', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const validation = validateAppInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.caseStudyApp.create({
      data: {
        detailId: detail.id,
        images: validation.images,
      },
    });

    return res.status(201).json({
      message: 'App entry created.',
      item: formatCaseStudyAppResponse(created),
    });
  } catch (error) {
    console.error('Case study app create failed', error);
    return res.status(500).json({ message: 'Unable to create app entry right now.' });
  }
});

app.put('/api/admin/case-studies/:id/apps/:appId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const appId = parseIntegerId(req.params.appId);
    if (!caseStudyId || !appId) return res.status(400).json({ message: 'A valid app id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyApp.findUnique({ where: { id: appId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'App entry not found.' });
    }

    const validation = validateAppInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const updated = await prisma.caseStudyApp.update({
      where: { id: appId },
      data: {
        images: validation.images,
      },
    });

    return res.json({
      message: 'App entry updated.',
      item: formatCaseStudyAppResponse(updated),
    });
  } catch (error) {
    console.error('Case study app update failed', error);
    return res.status(500).json({ message: 'Unable to update app entry right now.' });
  }
});

app.delete('/api/admin/case-studies/:id/apps/:appId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const appId = parseIntegerId(req.params.appId);
    if (!caseStudyId || !appId) return res.status(400).json({ message: 'A valid app id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyApp.findUnique({ where: { id: appId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'App entry not found.' });
    }

    await prisma.caseStudyApp.delete({ where: { id: appId } });
    return res.json({ message: 'App entry deleted.' });
  } catch (error) {
    console.error('Case study app delete failed', error);
    return res.status(500).json({ message: 'Unable to delete app entry right now.' });
  }
});

app.get('/api/admin/case-studies/:id/impacts', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.json({ items: [] });

    const items = await prisma.caseStudyImpact.findMany({
      where: { detailId: detail.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ items: items.map(formatCaseStudyImpactResponse) });
  } catch (error) {
    console.error('Case study impacts fetch failed', error);
    return res.status(500).json({ message: 'Unable to load impacts right now.' });
  }
});

app.post('/api/admin/case-studies/:id/impacts', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const validation = validateImpactInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.caseStudyImpact.create({
      data: {
        detailId: detail.id,
        title: validation.title,
        image: validation.image,
      },
    });

    return res.status(201).json({
      message: 'Impact created.',
      item: formatCaseStudyImpactResponse(created),
    });
  } catch (error) {
    console.error('Case study impact create failed', error);
    return res.status(500).json({ message: 'Unable to create impact right now.' });
  }
});

app.put('/api/admin/case-studies/:id/impacts/:impactId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const impactId = parseIntegerId(req.params.impactId);
    if (!caseStudyId || !impactId) return res.status(400).json({ message: 'A valid impact id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyImpact.findUnique({ where: { id: impactId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Impact not found.' });
    }

    const validation = validateImpactInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const updated = await prisma.caseStudyImpact.update({
      where: { id: impactId },
      data: {
        title: validation.title,
        image: validation.image,
      },
    });

    return res.json({
      message: 'Impact updated.',
      item: formatCaseStudyImpactResponse(updated),
    });
  } catch (error) {
    console.error('Case study impact update failed', error);
    return res.status(500).json({ message: 'Unable to update impact right now.' });
  }
});

app.delete('/api/admin/case-studies/:id/impacts/:impactId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const impactId = parseIntegerId(req.params.impactId);
    if (!caseStudyId || !impactId) return res.status(400).json({ message: 'A valid impact id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyImpact.findUnique({ where: { id: impactId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Impact not found.' });
    }

    await prisma.caseStudyImpact.delete({ where: { id: impactId } });
    return res.json({ message: 'Impact deleted.' });
  } catch (error) {
    console.error('Case study impact delete failed', error);
    return res.status(500).json({ message: 'Unable to delete impact right now.' });
  }
});

app.get('/api/admin/case-studies/:id/team-members', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.json({ items: [] });

    const items = await prisma.caseStudyTeamMember.findMany({
      where: { detailId: detail.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ items: items.map(formatCaseStudyTeamMemberResponse) });
  } catch (error) {
    console.error('Case study team members fetch failed', error);
    return res.status(500).json({ message: 'Unable to load team members right now.' });
  }
});

app.post('/api/admin/case-studies/:id/team-members', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const validation = validateTeamMemberInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.caseStudyTeamMember.create({
      data: {
        detailId: detail.id,
        title: validation.title,
      },
    });

    return res.status(201).json({
      message: 'Team member created.',
      item: formatCaseStudyTeamMemberResponse(created),
    });
  } catch (error) {
    console.error('Case study team member create failed', error);
    return res.status(500).json({ message: 'Unable to create team member right now.' });
  }
});

app.put('/api/admin/case-studies/:id/team-members/:memberId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const memberId = parseIntegerId(req.params.memberId);
    if (!caseStudyId || !memberId) return res.status(400).json({ message: 'A valid member id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyTeamMember.findUnique({ where: { id: memberId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Team member not found.' });
    }

    const validation = validateTeamMemberInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const updated = await prisma.caseStudyTeamMember.update({
      where: { id: memberId },
      data: { title: validation.title },
    });

    return res.json({
      message: 'Team member updated.',
      item: formatCaseStudyTeamMemberResponse(updated),
    });
  } catch (error) {
    console.error('Case study team member update failed', error);
    return res.status(500).json({ message: 'Unable to update team member right now.' });
  }
});

app.delete('/api/admin/case-studies/:id/team-members/:memberId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const memberId = parseIntegerId(req.params.memberId);
    if (!caseStudyId || !memberId) return res.status(400).json({ message: 'A valid member id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyTeamMember.findUnique({ where: { id: memberId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Team member not found.' });
    }

    await prisma.caseStudyTeamMember.delete({ where: { id: memberId } });
    return res.json({ message: 'Team member deleted.' });
  } catch (error) {
    console.error('Case study team member delete failed', error);
    return res.status(500).json({ message: 'Unable to delete team member right now.' });
  }
});

app.get('/api/admin/case-studies/:id/timelines', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.json({ items: [] });

    const items = await prisma.caseStudyTimeline.findMany({
      where: { detailId: detail.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ items: items.map(formatCaseStudyTimelineResponse) });
  } catch (error) {
    console.error('Case study timelines fetch failed', error);
    return res.status(500).json({ message: 'Unable to load timeline right now.' });
  }
});

app.post('/api/admin/case-studies/:id/timelines', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    if (!caseStudyId) return res.status(400).json({ message: 'A valid case study id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const validation = validateTimelineInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const created = await prisma.caseStudyTimeline.create({
      data: {
        detailId: detail.id,
        title: validation.title,
        description: validation.description,
      },
    });

    return res.status(201).json({
      message: 'Timeline created.',
      item: formatCaseStudyTimelineResponse(created),
    });
  } catch (error) {
    console.error('Case study timeline create failed', error);
    return res.status(500).json({ message: 'Unable to create timeline right now.' });
  }
});

app.put('/api/admin/case-studies/:id/timelines/:timelineId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const timelineId = parseIntegerId(req.params.timelineId);
    if (!caseStudyId || !timelineId) return res.status(400).json({ message: 'A valid timeline id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyTimeline.findUnique({ where: { id: timelineId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Timeline not found.' });
    }

    const validation = validateTimelineInput(req.body || {});
    if (validation.error) return res.status(400).json({ message: validation.error });

    const updated = await prisma.caseStudyTimeline.update({
      where: { id: timelineId },
      data: {
        title: validation.title,
        description: validation.description,
      },
    });

    return res.json({
      message: 'Timeline updated.',
      item: formatCaseStudyTimelineResponse(updated),
    });
  } catch (error) {
    console.error('Case study timeline update failed', error);
    return res.status(500).json({ message: 'Unable to update timeline right now.' });
  }
});

app.delete('/api/admin/case-studies/:id/timelines/:timelineId', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);

    if (!admin) {
      return res.status(status).json({ message });
    }

    const caseStudyId = parseIntegerId(req.params.id);
    const timelineId = parseIntegerId(req.params.timelineId);
    if (!caseStudyId || !timelineId) return res.status(400).json({ message: 'A valid timeline id is required.' });

    const detail = await findCaseStudyDetailByCaseStudyId(caseStudyId);
    if (!detail) return res.status(400).json({ message: 'Save the project overview first.' });

    const existing = await prisma.caseStudyTimeline.findUnique({ where: { id: timelineId } });
    if (!existing || existing.detailId !== detail.id) {
      return res.status(404).json({ message: 'Timeline not found.' });
    }

    await prisma.caseStudyTimeline.delete({ where: { id: timelineId } });
    return res.json({ message: 'Timeline deleted.' });
  } catch (error) {
    console.error('Case study timeline delete failed', error);
    return res.status(500).json({ message: 'Unable to delete timeline right now.' });
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

    const contactId = parseIntegerId(req.params.id);

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

    const contactId = parseIntegerId(req.params.id);

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

    const feedbackId = parseIntegerId(req.params.id);

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

    const feedbackId = parseIntegerId(req.params.id);

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

    const jobId = parseIntegerId(req.params.id);
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

    const jobId = parseIntegerId(req.params.id);
    if (!jobId) return res.status(400).json({ message: 'A valid job id is required.' });

    await prisma.careerOpening.delete({ where: { id: Number(jobId) } });

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

    const applicationId = parseIntegerId(req.params.id);
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

    const applicationId = parseIntegerId(req.params.id);
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

/// Banner enums (Prisma enum BannerType)
const BANNER_TYPES = ['HOME', 'DASHBOARD', 'ABOUT', 'BLOGS', 'CONTACT', 'CAREER', 'CASESTUDY'];

const normalizeBannerTypeInput = (value) => {
  const raw = String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  if (raw === 'CASESTUDY' || raw === 'CASESTUDIES') return 'CASESTUDY';

  return BANNER_TYPES.includes(raw) ? raw : 'HOME';
};

const toUiBannerType = (enumValue) =>
  enumValue === 'CASESTUDY'
    ? 'case-study'
    : typeof enumValue === 'string'
      ? enumValue.toLowerCase()
      : 'home';

const validateImageUrl = (url) => {
  if (!url) return null;

  if (typeof url !== 'string') {
    return 'Image URL must be a string.';
  }

  // Allow base64 images (size already guarded globally) and only validate length for hosted URLs
  if (!isBase64Image(url) && url.length > 2048) {
    return 'Image URL is too long (max 2048 characters).';
  }

  return null;
};

const validateCaseStudyOverviewInput = (body = {}) => {
  const projectOverview = body.projectOverview || {};

  const title = normalizeText(projectOverview.title);
  const subtitle = normalizeText(projectOverview.subtitle);
  const description = normalizeText(projectOverview.description);
  const image = normalizeText(projectOverview.image);

  if (!title) {
    return { error: 'Project overview title is required.' };
  }

  const overviewImageError = validateImageUrl(image);
  if (overviewImageError) {
    return { error: overviewImageError };
  }

  return {
    projectOverview: {
      title,
      subtitle,
      description,
      image: image || null,
    },
  };
};

const validateProblemConfigInput = (config = {}) => {
  const description = normalizeText(config.description);
  const image = normalizeText(config.image);

  const imageError = validateImageUrl(image);
  if (imageError) {
    return { error: imageError };
  }

  return {
    description: description || null,
    image: image || null,
  };
};

const validateSolutionConfigInput = (config = {}) => {
  const description = normalizeText(config.description);

  return {
    description: description || null,
  };
};

const validateAppConfigInput = (config = {}) => {
  const description = normalizeText(config.description);

  return {
    description: description || null,
  };
};

const validateDevelopmentConfigInput = (config = {}) => {
  const title = normalizeText(config.title);
  const image = normalizeText(config.image);

  if (!title) return { error: 'Development title is required.' };

  const imageError = validateImageUrl(image);
  if (imageError) {
    return { error: imageError };
  }

  return {
    title,
    image: image || null,
  };
};

const validateProblemInput = (body = {}) => {
  const description = normalizeText(body.description);

  if (!description) return { error: 'Problem description is required.' };

  return { description };
};

const validateSolutionInput = (body = {}) => {
  const description = normalizeText(body.description);
  const image = normalizeText(body.image);

  if (!description) return { error: 'Solution description is required.' };

  const imageError = validateImageUrl(image);
  if (imageError) {
    return { error: imageError };
  }

  return { description, image: image || null };
};

const validateFeatureInput = (body = {}) => {
  const title = normalizeText(body.title);
  const description = normalizeText(body.description);
  const image = normalizeText(body.image);

  if (!title) return { error: 'Feature title is required.' };

  const imageError = validateImageUrl(image);
  if (imageError) {
    return { error: imageError };
  }

  return { title, description: description || null, image: image || null };
};

const validateDevelopmentChallengeInput = (body = {}) => {
  const title = normalizeText(body.title);
  const image = normalizeText(body.image);
  const subtitle = normalizeText(body.subtitle);
  const description = normalizeText(body.description);

  if (!title) return { error: 'Challenge title is required.' };

  const imageError = validateImageUrl(image);
  if (imageError) {
    return { error: imageError };
  }

  return {
    title,
    image: image || null,
    subtitle: subtitle || null,
    description: description || null,
  };
};

const validateAppInput = (body = {}) => {
  const images = Array.isArray(body.images) ? body.images : [];

  const cleanedImages = [];
  for (const image of images) {
    const normalized = normalizeText(image);
    if (!normalized) continue;
    const imageError = validateImageUrl(normalized);
    if (imageError) {
      return { error: imageError };
    }
    cleanedImages.push(normalized);
  }

  if (cleanedImages.length === 0) return { error: 'At least one app image is required.' };

  return {
    images: cleanedImages,
  };
};

const validateImpactInput = (body = {}) => {
  const title = normalizeText(body.title);
  const image = normalizeText(body.image);

  if (!title) return { error: 'Impact title is required.' };

  const imageError = validateImageUrl(image);
  if (imageError) {
    return { error: imageError };
  }

  return { title, image: image || null };
};

const validateTeamMemberInput = (body = {}) => {
  const title = normalizeText(body.title);
  if (!title) return { error: 'Team member title is required.' };
  return { title };
};

const validateTimelineInput = (body = {}) => {
  const title = normalizeText(body.title);
  const description = normalizeText(body.description);

  if (!title) return { error: 'Timeline title is required.' };

  return { title, description: description || null };
};

const findCaseStudyDetailByCaseStudyId = (caseStudyId) =>
  prisma.caseStudyDetail.findUnique({ where: { caseStudyId } });

const mapBannerToResponse = (banner) => {
  const isHome = banner.type === 'HOME';

  const images = isHome && Array.isArray(banner.images)
    ? [...banner.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => img.imageUrl)
    : [];

  return {
    id: banner.id,
    title: banner.title,
    type: toUiBannerType(banner.type), // "HOME" -> "home" for frontend
    image: isHome ? null : banner.imageUrl || null,
    images,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
  };
};

const mapProcessStepToResponse = (step) => ({
  id: step.id,
  title: step.title,
  description: step.description || '',
  image: step.imageUrl || null, // map imageUrl -> image
  sortOrder: step.sortOrder,
  isActive: step.isActive,
  createdAt: step.createdAt,
  updatedAt: step.updatedAt,
});

const mapServiceSliderToResponse = (slider) => ({
  id: slider.id,
  sliderTitle: slider.sliderTitle,
  sliderDescription: slider.sliderDescription || '',
  sliderImage: slider.sliderImageUrl || null, // map sliderImageUrl -> sliderImage
  isActive: slider.isActive,
  createdAt: slider.createdAt,
  updatedAt: slider.updatedAt,
});

const mapServiceCardToResponse = (card) => ({
  id: card.id,
  title: card.title,
  subtitle: card.subtitle || '',
  description: card.description || '',
  image: card.imageUrl || null, // map imageUrl -> image
  sliderId: card.sliderId,
  sortOrder: card.sortOrder,
  isFeatured: card.isFeatured,
  // optional nested slider for admin table
  slider: card.slider ? mapServiceSliderToResponse(card.slider) : undefined,
  createdAt: card.createdAt,
  updatedAt: card.updatedAt,
});

const mapIndustryToResponse = (item) => ({
  id: item.id,
  sectionId: item.sectionId,
  title: item.title,
  description: item.description || '',
  image: item.imageUrl || null, // map imageUrl -> image
  sortOrder: item.sortOrder,
  isActive: item.isActive,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const mapTechSolutionToResponse = (item) => ({
  id: item.id,
  sectionId: item.sectionId,
  title: item.title,
  description: item.description || '',
  sortOrder: item.sortOrder,
  isActive: item.isActive,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const mapExpertiseItemToResponse = (item) => ({
  id: item.id,
  sectionId: item.sectionId,
  title: item.title,
  description: item.description || '',
  image: item.imageUrl || null, // map imageUrl -> image
  sortOrder: item.sortOrder,
  isActive: item.isActive,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

// Singleton config helpers
const getOrCreateIndustriesConfig = async () => {
  let config = await prisma.industriesConfig.findFirst();
  if (!config) {
    config = await prisma.industriesConfig.create({
      data: {
        title: 'Industries we serve',
        description: 'Tailored solutions for digital-first leaders across sectors.',
      },
    });
  }
  return config;
};

const getOrCreateTechSolutionsConfig = async () => {
  let config = await prisma.techSolutionsConfig.findFirst();
  if (!config) {
    config = await prisma.techSolutionsConfig.create({
      data: {
        title: 'Tech solutions for all business types',
        description: '',
      },
    });
  }
  return config;
};

const getOrCreateExpertiseConfig = async () => {
  let config = await prisma.expertiseConfig.findFirst();
  if (!config) {
    config = await prisma.expertiseConfig.create({
      data: {
        title: 'Ways to choose our expertise',
        description: '',
      },
    });
  }
  return config;
};

/* -----------------------------------
 * BANNERS (Banner + BannerImage)
 * ----------------------------------- */

// GET all banners
app.get('/api/banners', async (_req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });

    res.json(banners.map(mapBannerToResponse));
  } catch (err) {
    console.error('GET /api/banners error', err);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// CREATE banner
app.post('/api/banners', async (req, res) => {
  try {
    const { title, type, image, images } = req.body ?? {};

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const bannerType = normalizeBannerTypeInput(type);
    const isHome = bannerType === 'HOME';
    const imageList = isHome && Array.isArray(images)
      ? images.filter(Boolean)
      : [];

    if (!isHome) {
      const imageError = validateImageUrl(image);
      if (imageError) {
        return res.status(400).json({ error: imageError });
      }
    } else {
      for (const url of imageList) {
        const imageError = validateImageUrl(url);
        if (imageError) {
          return res.status(400).json({ error: imageError });
        }
      }
    }

    const created = await prisma.banner.create({
      data: {
        title,
        type: bannerType,
        imageUrl: isHome ? null : (image || null),
        images:
          isHome && imageList.length
            ? {
              create: imageList.map((url, index) => ({
                imageUrl: url,
                sortOrder: index,
              })),
            }
            : undefined,
      },
      include: { images: true },
    });

    res.status(201).json(mapBannerToResponse(created));
  } catch (err) {
    console.error('POST /api/banners error', err);
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// UPDATE banner
app.put('/api/banners/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid banner id is required' });
    }

    const { title, type, image, images } = req.body ?? {};

    const existing = await prisma.banner.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    const bannerType = type ? normalizeBannerTypeInput(type) : existing.type;
    const isHome = bannerType === 'HOME';

    if (!isHome) {
      const imageError = validateImageUrl(typeof image === 'string' ? image : existing.imageUrl);
      if (imageError) {
        return res.status(400).json({ error: imageError });
      }
    }

    // Update main banner row
    await prisma.banner.update({
      where: { id },
      data: {
        title: typeof title === 'string' ? title : existing.title,
        type: bannerType,
        imageUrl: isHome
          ? null
          : typeof image === 'string'
            ? image
            : existing.imageUrl,
      },
    });

    // Handle images relation
    if (isHome) {
      const imageList = Array.isArray(images)
        ? images.filter(Boolean)
        : existing.images.map((img) => img.imageUrl).filter(Boolean);

      for (const url of imageList) {
        const imageError = validateImageUrl(url);
        if (imageError) {
          return res.status(400).json({ error: imageError });
        }
      }

      await prisma.bannerImage.deleteMany({ where: { bannerId: id } });

      if (imageList.length) {
        await prisma.bannerImage.createMany({
          data: imageList.map((url, index) => ({
            bannerId: id,
            imageUrl: url,
            sortOrder: index,
          })),
        });
      }
    } else {
      // Non-home banners should not have multiple images
      await prisma.bannerImage.deleteMany({ where: { bannerId: id } });
    }

    const finalBanner = await prisma.banner.findUnique({
      where: { id },
      include: { images: true },
    });

    res.json(mapBannerToResponse(finalBanner));
  } catch (err) {
    console.error('PUT /api/banners/:id error', err);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// DELETE banner
app.delete('/api/banners/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid banner id is required' });
    }

    await prisma.bannerImage.deleteMany({ where: { bannerId: id } });
    await prisma.banner.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/banners/:id error', err);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

/* -----------------------------------
 * PROCESS STEPS (ProcessStep)
 * ----------------------------------- */

app.get('/api/process-steps', async (_req, res) => {
  try {
    const steps = await prisma.processStep.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(steps.map(mapProcessStepToResponse));
  } catch (err) {
    console.error('GET /api/process-steps error', err);
    res.status(500).json({ error: 'Failed to fetch process steps' });
  }
});

app.post('/api/process-steps', async (req, res) => {
  try {
    const { title, description, image, sortOrder, isActive } = req.body ?? {};
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const imageError = validateImageUrl(image);
    if (imageError) {
      return res.status(400).json({ error: imageError });
    }

    const created = await prisma.processStep.create({
      data: {
        title,
        description: description || null,
        imageUrl: image || null,
        sortOrder: Number.isInteger(Number(sortOrder)) ? Number(sortOrder) : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });

    res.status(201).json(mapProcessStepToResponse(created));
  } catch (err) {
    console.error('POST /api/process-steps error', err);
    res.status(500).json({ error: 'Failed to create process step' });
  }
});

app.put('/api/process-steps/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid process step id is required' });
    }

    const { title, description, image, sortOrder, isActive } = req.body ?? {};

    const imageError = validateImageUrl(image);
    if (imageError) {
      return res.status(400).json({ error: imageError });
    }

    const updated = await prisma.processStep.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl: image,
        sortOrder: sortOrder === undefined ? undefined : Number(sortOrder) || 0,
        isActive,
      },
    });

    res.json(mapProcessStepToResponse(updated));
  } catch (err) {
    console.error('PUT /api/process-steps/:id error', err);
    res.status(500).json({ error: 'Failed to update process step' });
  }
});

app.delete('/api/process-steps/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid process step id is required' });
    }

    await prisma.processStep.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/process-steps/:id error', err);
    res.status(500).json({ error: 'Failed to delete process step' });
  }
});

/* -----------------------------------
 * OUR SERVICES: SLIDERS (ServiceSlider)
 * ----------------------------------- */

app.get('/api/our-services/sliders', async (_req, res) => {
  try {
    const sliders = await prisma.serviceSlider.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(sliders.map(mapServiceSliderToResponse));
  } catch (err) {
    console.error('GET /api/our-services/sliders error', err);
    res.status(500).json({ error: 'Failed to fetch sliders' });
  }
});

app.post('/api/our-services/sliders', async (req, res) => {
  try {
    const { sliderTitle, sliderDescription, sliderImage, isActive } = req.body ?? {};
    if (!sliderTitle) {
      return res.status(400).json({ error: 'sliderTitle is required' });
    }

    const created = await prisma.serviceSlider.create({
      data: {
        sliderTitle,
        sliderDescription: sliderDescription || null,
        sliderImageUrl: sliderImage || null,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });

    res.status(201).json(mapServiceSliderToResponse(created));
  } catch (err) {
    console.error('POST /api/our-services/sliders error', err);
    res.status(500).json({ error: 'Failed to create slider' });
  }
});

app.put('/api/our-services/sliders/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid slider id is required' });
    }

    const { sliderTitle, sliderDescription, sliderImage, isActive } = req.body ?? {};

    const updated = await prisma.serviceSlider.update({
      where: { id },
      data: {
        sliderTitle,
        sliderDescription,
        sliderImageUrl: sliderImage,
        isActive,
      },
    });

    res.json(mapServiceSliderToResponse(updated));
  } catch (err) {
    console.error('PUT /api/our-services/sliders/:id error', err);
    res.status(500).json({ error: 'Failed to update slider' });
  }
});

app.delete('/api/our-services/sliders/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid slider id is required' });
    }

    // Optional: delete related cards
    await prisma.serviceCard.deleteMany({ where: { sliderId: id } });
    await prisma.serviceSlider.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/our-services/sliders/:id error', err);
    res.status(500).json({ error: 'Failed to delete slider' });
  }
});

/* -----------------------------------
 * OUR SERVICES: SERVICE CARDS (ServiceCard)
 * ----------------------------------- */

app.get('/api/our-services/services', async (_req, res) => {
  try {
    const services = await prisma.serviceCard.findMany({
      orderBy: { createdAt: 'desc' },
      include: { slider: true },
    });

    res.json(services.map(mapServiceCardToResponse));
  } catch (err) {
    console.error('GET /api/our-services/services error', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/our-services/services', async (req, res) => {
  try {
    const { title, subtitle, description, image, sliderId, isFeatured, sortOrder } = req.body ?? {};

    const sliderIdInt = parseIntegerId(sliderId);
    if (!title || !sliderIdInt) {
      return res.status(400).json({ error: 'title and sliderId are required' });
    }

    const slider = await prisma.serviceSlider.findUnique({ where: { id: sliderIdInt } });
    if (!slider) {
      return res.status(404).json({ error: 'Related slider not found' });
    }

    const sortOrderInt = Number.isInteger(Number(sortOrder)) ? Number(sortOrder) : 0;

    const created = await prisma.serviceCard.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        imageUrl: image || null,
        sliderId: sliderIdInt,
        sortOrder: sortOrderInt,
        isFeatured: !!isFeatured,
      },
      include: { slider: true },
    });

    res.status(201).json(mapServiceCardToResponse(created));
  } catch (err) {
    console.error('POST /api/our-services/services error', err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/our-services/services/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid service id is required' });
    }

    const { title, subtitle, description, image, sliderId, isFeatured, sortOrder } = req.body ?? {};

    const sliderIdInt = sliderId !== undefined ? parseIntegerId(sliderId) : undefined;

    if (sliderIdInt) {
      const slider = await prisma.serviceSlider.findUnique({ where: { id: sliderIdInt } });
      if (!slider) {
        return res.status(404).json({ error: 'Related slider not found' });
      }
    }

    const sortOrderInt =
      sortOrder !== undefined && Number.isInteger(Number(sortOrder)) ? Number(sortOrder) : undefined;

    const updated = await prisma.serviceCard.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        imageUrl: image,
        sliderId: sliderIdInt,
        isFeatured,
        sortOrder: sortOrderInt,
      },
      include: { slider: true },
    });

    res.json(mapServiceCardToResponse(updated));
  } catch (err) {
    console.error('PUT /api/our-services/services/:id error', err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/our-services/services/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid service id is required' });
    }

    await prisma.serviceCard.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/our-services/services/:id error', err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

/* -----------------------------------
 * INDUSTRIES (IndustriesConfig + Industry)
 * ----------------------------------- */

// Header config
app.get('/api/industries/config', async (_req, res) => {
  try {
    const config = await getOrCreateIndustriesConfig();
    res.json(config);
  } catch (err) {
    console.error('GET /api/industries/config error', err);
    res.status(500).json({ error: 'Failed to fetch industries config' });
  }
});

app.put('/api/industries/config', async (req, res) => {
  try {
    const { title, description } = req.body ?? {};
    const existing = await prisma.industriesConfig.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.industriesConfig.update({
        where: { id: existing.id },
        data: {
          title: title ?? existing.title,
          description: description ?? existing.description,
        },
      });
    } else {
      updated = await prisma.industriesConfig.create({
        data: {
          title: title || 'Industries we serve',
          description: description || '',
        },
      });
    }

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/industries/config error', err);
    res.status(500).json({ error: 'Failed to update industries config' });
  }
});

// List items
app.get('/api/industries', async (_req, res) => {
  try {
    const items = await prisma.industry.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(items.map(mapIndustryToResponse));
  } catch (err) {
    console.error('GET /api/industries error', err);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});

app.post('/api/industries', async (req, res) => {
  try {
    const { title, description, image, sortOrder, isActive } = req.body ?? {};
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const section = await getOrCreateIndustriesConfig();

    const created = await prisma.industry.create({
      data: {
        title,
        description: description || null,
        imageUrl: image || null,
        sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true,
        sectionId: section.id,
      },
    });

    res.status(201).json(mapIndustryToResponse(created));
  } catch (err) {
    console.error('POST /api/industries error', err);
    res.status(500).json({ error: 'Failed to create industry' });
  }
});

app.put('/api/industries/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid industry id is required' });
    }

    const { title, description, image, sortOrder, isActive } = req.body ?? {};

    const updated = await prisma.industry.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl: image,
        sortOrder,
        isActive,
      },
    });

    res.json(mapIndustryToResponse(updated));
  } catch (err) {
    console.error('PUT /api/industries/:id error', err);
    res.status(500).json({ error: 'Failed to update industry' });
  }
});

app.delete('/api/industries/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid industry id is required' });
    }

    await prisma.industry.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/industries/:id error', err);
    res.status(500).json({ error: 'Failed to delete industry' });
  }
});

/* -----------------------------------
 * TECH SOLUTIONS (TechSolutionsConfig + TechSolution)
 * ----------------------------------- */

app.get('/api/tech-solutions/config', async (_req, res) => {
  try {
    const config = await getOrCreateTechSolutionsConfig();
    res.json(config);
  } catch (err) {
    console.error('GET /api/tech-solutions/config error', err);
    res.status(500).json({ error: 'Failed to fetch tech solutions config' });
  }
});

app.put('/api/tech-solutions/config', async (req, res) => {
  try {
    const { title, description } = req.body ?? {};
    const existing = await prisma.techSolutionsConfig.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.techSolutionsConfig.update({
        where: { id: existing.id },
        data: {
          title: title ?? existing.title,
          description: description ?? existing.description,
        },
      });
    } else {
      updated = await prisma.techSolutionsConfig.create({
        data: {
          title: title || 'Tech solutions for all business types',
          description: description || '',
        },
      });
    }

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/tech-solutions/config error', err);
    res.status(500).json({ error: 'Failed to update tech solutions config' });
  }
});

app.get('/api/tech-solutions', async (_req, res) => {
  try {
    const items = await prisma.techSolution.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(items.map(mapTechSolutionToResponse));
  } catch (err) {
    console.error('GET /api/tech-solutions error', err);
    res.status(500).json({ error: 'Failed to fetch tech solutions' });
  }
});

app.post('/api/tech-solutions', async (req, res) => {
  try {
    const { title, description, sortOrder, isActive } = req.body ?? {};
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const section = await getOrCreateTechSolutionsConfig();

    const created = await prisma.techSolution.create({
      data: {
        title,
        description: description || null,
        sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true,
        sectionId: section.id,
      },
    });

    res.status(201).json(mapTechSolutionToResponse(created));
  } catch (err) {
    console.error('POST /api/tech-solutions error', err);
    res.status(500).json({ error: 'Failed to create tech solution' });
  }
});

app.put('/api/tech-solutions/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid tech solution id is required' });
    }

    const { title, description, sortOrder, isActive } = req.body ?? {};

    const updated = await prisma.techSolution.update({
      where: { id },
      data: {
        title,
        description,
        sortOrder,
        isActive,
      },
    });

    res.json(mapTechSolutionToResponse(updated));
  } catch (err) {
    console.error('PUT /api/tech-solutions/:id error', err);
    res.status(500).json({ error: 'Failed to update tech solution' });
  }
});

app.delete('/api/tech-solutions/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid tech solution id is required' });
    }

    await prisma.techSolution.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/tech-solutions/:id error', err);
    res.status(500).json({ error: 'Failed to delete tech solution' });
  }
});

/* -----------------------------------
 * EXPERTISE (ExpertiseConfig + ExpertiseItem)
 * ----------------------------------- */

app.get('/api/expertise/config', async (_req, res) => {
  try {
    const config = await getOrCreateExpertiseConfig();
    res.json(config);
  } catch (err) {
    console.error('GET /api/expertise/config error', err);
    res.status(500).json({ error: 'Failed to fetch expertise config' });
  }
});

app.put('/api/expertise/config', async (req, res) => {
  try {
    const { title, description } = req.body ?? {};
    const existing = await prisma.expertiseConfig.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.expertiseConfig.update({
        where: { id: existing.id },
        data: {
          title: title ?? existing.title,
          description: description ?? existing.description,
        },
      });
    } else {
      updated = await prisma.expertiseConfig.create({
        data: {
          title: title || 'Ways to choose our expertise',
          description: description || '',
        },
      });
    }

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/expertise/config error', err);
    res.status(500).json({ error: 'Failed to update expertise config' });
  }
});

app.get('/api/expertise', async (_req, res) => {
  try {
    const items = await prisma.expertiseItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(items.map(mapExpertiseItemToResponse));
  } catch (err) {
    console.error('GET /api/expertise error', err);
    res.status(500).json({ error: 'Failed to fetch expertise items' });
  }
});

app.post('/api/expertise', async (req, res) => {
  try {
    const { title, description, image, sortOrder, isActive } = req.body ?? {};
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const section = await getOrCreateExpertiseConfig();

    const created = await prisma.expertiseItem.create({
      data: {
        title,
        description: description || null,
        imageUrl: image || null,
        sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true,
        sectionId: section.id,
      },
    });

    res.status(201).json(mapExpertiseItemToResponse(created));
  } catch (err) {
    console.error('POST /api/expertise error', err);
    res.status(500).json({ error: 'Failed to create expertise item' });
  }
});

app.put('/api/expertise/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid expertise item id is required' });
    }

    const { title, description, image, sortOrder, isActive } = req.body ?? {};

    const updated = await prisma.expertiseItem.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl: image,
        sortOrder,
        isActive,
      },
    });

    res.json(mapExpertiseItemToResponse(updated));
  } catch (err) {
    console.error('PUT /api/expertise/:id error', err);
    res.status(500).json({ error: 'Failed to update expertise item' });
  }
});

app.delete('/api/expertise/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'A valid expertise item id is required' });
    }

    await prisma.expertiseItem.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/expertise/:id error', err);
    res.status(500).json({ error: 'Failed to delete expertise item' });
  }
});


// Add these endpoints to your existing server.js file after the Expertise routes

/* ===============================================
 * SERVICE MENU APIs
 * =============================================== */

// Helper functions
const mapServiceMenuToResponse = (menu) => ({
  id: menu.id,
  category: menu.category,
  bannerTitle: menu.bannerTitle,
  bannerSubtitle: menu.bannerSubtitle,
  bannerImage: menu.bannerImage,
  totalServices: menu.totalServices,
  totalProjects: menu.totalProjects,
  totalClients: menu.totalClients,
  description: menu.description || '',
  subcategories: menu.subcategories?.map(s => ({
    id: s.id,
    name: s.name,
  })) || [],
  faqs: menu.faqs?.map(f => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  })) || [],
  createdAt: menu.createdAt,
  updatedAt: menu.updatedAt,
});

// GET all service menus
app.get('/api/service-menus', async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    const menus = await prisma.serviceMenu.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(subcategory && {
          subcategories: {
            some: { name: String(subcategory) },
          },
        }),
      },
      include: {
        subcategories: true,
        faqs: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(menus.map(mapServiceMenuToResponse));
  } catch (err) {
    console.error('GET /api/service-menus error', err);
    res.status(500).json({ error: 'Failed to fetch service menus' });
  }
});

// GET single service menu
app.get('/api/service-menus/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid service menu id required' });
    }

    const menu = await prisma.serviceMenu.findUnique({
      where: { id },
      include: {
        subcategories: true,
        faqs: true,
      },
    });

    if (!menu) {
      return res.status(404).json({ error: 'Service menu not found' });
    }

    res.json(mapServiceMenuToResponse(menu));
  } catch (err) {
    console.error('GET /api/service-menus/:id error', err);
    res.status(500).json({ error: 'Failed to fetch service menu' });
  }
});

// CREATE service menu
app.post('/api/service-menus', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const {
      category,
      bannerTitle,
      bannerSubtitle,
      bannerImage,
      totalServices,
      totalProjects,
      totalClients,
      description,
      subcategories,
      faqs,
    } = req.body ?? {};

    if (!category || !bannerTitle || !bannerSubtitle || !bannerImage) {
      return res.status(400).json({
        error: 'category, bannerTitle, bannerSubtitle, and bannerImage are required'
      });
    }

    const created = await prisma.serviceMenu.create({
      data: {
        category,
        bannerTitle,
        bannerSubtitle,
        bannerImage,
        totalServices: totalServices || 0,
        totalProjects: totalProjects || 0,
        totalClients: totalClients || 0,
        description: description || null,
        subcategories: subcategories?.length ? {
          create: subcategories.map(s => ({ name: s.name })),
        } : undefined,
        faqs: faqs?.length ? {
          create: faqs.map(f => ({
            question: f.question,
            answer: f.answer
          })),
        } : undefined,
      },
      include: {
        subcategories: true,
        faqs: true,
      },
    });

    res.status(201).json(mapServiceMenuToResponse(created));
  } catch (err) {
    console.error('POST /api/service-menus error', err);
    res.status(500).json({ error: 'Failed to create service menu' });
  }
});

// UPDATE service menu
app.put('/api/service-menus/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid service menu id required' });
    }

    const {
      category,
      bannerTitle,
      bannerSubtitle,
      bannerImage,
      totalServices,
      totalProjects,
      totalClients,
      description,
      subcategories,
      faqs,
    } = req.body ?? {};

    // Update main menu
    const updated = await prisma.serviceMenu.update({
      where: { id },
      data: {
        category,
        bannerTitle,
        bannerSubtitle,
        bannerImage,
        totalServices,
        totalProjects,
        totalClients,
        description,
      },
    });

    // Update subcategories if provided
    if (Array.isArray(subcategories)) {
      await prisma.serviceMenuSubcategory.deleteMany({ where: { serviceId: id } });
      if (subcategories.length) {
        await prisma.serviceMenuSubcategory.createMany({
          data: subcategories.map(s => ({
            name: s.name,
            serviceId: id
          })),
        });
      }
    }

    // Update FAQs if provided
    if (Array.isArray(faqs)) {
      await prisma.serviceMenuFaq.deleteMany({ where: { serviceId: id } });
      if (faqs.length) {
        await prisma.serviceMenuFaq.createMany({
          data: faqs.map(f => ({
            question: f.question,
            answer: f.answer,
            serviceId: id
          })),
        });
      }
    }

    const final = await prisma.serviceMenu.findUnique({
      where: { id },
      include: {
        subcategories: true,
        faqs: true,
      },
    });

    res.json(mapServiceMenuToResponse(final));
  } catch (err) {
    console.error('PUT /api/service-menus/:id error', err);
    res.status(500).json({ error: 'Failed to update service menu' });
  }
});

// DELETE service menu
app.delete('/api/service-menus/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid service menu id required' });
    }

    await prisma.$transaction([
      prisma.serviceMenuSubcategory.deleteMany({ where: { serviceId: id } }),
      prisma.serviceMenuFaq.deleteMany({ where: { serviceId: id } }),
      prisma.serviceProcess.updateMany({
        where: { serviceId: id },
        data: { serviceId: null }
      }),
      prisma.serviceMenu.delete({ where: { id } }),
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/service-menus/:id error', err);
    res.status(500).json({ error: 'Failed to delete service menu' });
  }
});

/* ===============================================
 * TECHNOLOGY APIs
 * =============================================== */

const mapTechnologyToResponse = (tech) => ({
  id: tech.id,
  title: tech.title,
  image: tech.image,
  items: tech.items || [],
  createdAt: tech.createdAt,
  updatedAt: tech.updatedAt,
});

// GET all technologies
app.get('/api/technologies', async (req, res) => {
  try {
    const technologies = await prisma.technology.findMany({ orderBy: { createdAt: 'desc' } });

    res.json(technologies.map(mapTechnologyToResponse));
  } catch (err) {
    console.error('GET /api/technologies error', err);
    res.status(500).json({ error: 'Failed to fetch technologies' });
  }
});

// CREATE technology
app.post('/api/technologies', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, image, items } = req.body ?? {};

    if (!title || !image) {
      return res.status(400).json({
        error: 'title and image are required'
      });
    }

    const created = await prisma.technology.create({
      data: {
        title,
        image,
        items: Array.isArray(items) ? items : [],
      },
    });

    res.status(201).json(mapTechnologyToResponse(created));
  } catch (err) {
    console.error('POST /api/technologies error', err);
    res.status(500).json({ error: 'Failed to create technology' });
  }
});

// UPDATE technology
app.put('/api/technologies/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid technology id required' });
    }

    const { title, image, items } = req.body ?? {};

    const updated = await prisma.technology.update({
      where: { id },
      data: {
        title,
        image,
        items: Array.isArray(items) ? items : undefined,
      },
    });

    res.json(mapTechnologyToResponse(updated));
  } catch (err) {
    console.error('PUT /api/technologies/:id error', err);
    res.status(500).json({ error: 'Failed to update technology' });
  }
});

// DELETE technology
app.delete('/api/technologies/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid technology id required' });
    }

    await prisma.technology.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/technologies/:id error', err);
    res.status(500).json({ error: 'Failed to delete technology' });
  }
});

/* ===============================================
 * BENEFITS APIs
 * =============================================== */

const mapBenefitToResponse = (benefit) => ({
  id: benefit.id,
  title: benefit.title,
  category: benefit.benefitConfig?.category?.name || benefit.category || '',
  subcategory: benefit.benefitConfig?.subcategory?.name || benefit.subcategory || '',
  description: benefit.description,
  image: benefit.image,
  benefitConfigId: benefit.benefitConfigId || null,
  benefitConfigTitle: benefit.benefitConfig?.title || '',
  createdAt: benefit.createdAt,
  updatedAt: benefit.updatedAt,
});

const mapBenefitConfigToResponse = (config) => ({
  id: config.id,
  title: config.title,
  description: config.description || '',
  categoryId: config.categoryId || null,
  subcategoryId: config.subcategoryId || null,
  categoryName: config.category?.name || '',
  subcategoryName: config.subcategory?.name || '',
  createdAt: config.createdAt,
  updatedAt: config.updatedAt,
});

const mapContactButtonToResponse = (button) => ({
  id: button.id,
  title: button.title,
  description: button.description || '',
  image: button.image || '',
  category: button.category || '',
  subcategory: button.subcategory || '',
  createdAt: button.createdAt,
  updatedAt: button.updatedAt,
});

// GET benefit hero/config
app.get('/api/benefits/config', async (_req, res) => {
  try {
    const config = await prisma.benefitConfig.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { category: true, subcategory: true },
    });

    if (!config) {
      return res.json(null);
    }

    return res.json(mapBenefitConfigToResponse(config));
  } catch (err) {
    console.error('GET /api/benefits/config error', err);
    return res.status(500).json({ error: 'Failed to fetch benefit configuration' });
  }
});

// GET benefit configs (all)
app.get('/api/benefit-configs', async (req, res) => {
  try {
    const parsedCategoryId = parseIntegerId(req.query.categoryId);
    const parsedSubcategoryId = parseIntegerId(req.query.subcategoryId);

    const configs = await prisma.benefitConfig.findMany({
      where: {
        ...(parsedCategoryId && { categoryId: parsedCategoryId }),
        ...(parsedSubcategoryId && { subcategoryId: parsedSubcategoryId }),
      },
      orderBy: { createdAt: 'desc' },
      include: { category: true, subcategory: true },
    });

    return res.json(configs.map(mapBenefitConfigToResponse));
  } catch (err) {
    console.error('GET /api/benefit-configs error', err);
    return res.status(500).json({ error: 'Failed to fetch benefit configurations' });
  }
});

// CREATE or update benefit hero/config
app.post('/api/benefits/config', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { id, title, description } = req.body ?? {};
    const categoryId = parseIntegerId(req.body?.categoryId);
    const subcategoryId = parseIntegerId(req.body?.subcategoryId);

    if (!title || !description) {
      return res.status(400).json({ error: 'Both title and description are required' });
    }

    let category = null;
    if (categoryId) {
      category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    let subcategory = null;
    if (subcategoryId) {
      subcategory = await prisma.serviceSubCategory.findUnique({ where: { id: subcategoryId } });
      if (!subcategory) {
        return res.status(400).json({ error: 'Sub-category not found' });
      }

      if (category && subcategory.categoryId !== category.id) {
        return res.status(400).json({ error: 'Sub-category does not belong to the selected category' });
      }

      if (!category) {
        category = await prisma.serviceCategory.findUnique({ where: { id: subcategory.categoryId } });
      }
    }

    const existing = id ? await prisma.benefitConfig.findUnique({ where: { id } }) : null;

    const saved = existing
      ? await prisma.benefitConfig.update({
          where: { id: existing.id },
          data: { title, description, categoryId: category?.id || null, subcategoryId: subcategory?.id || null },
          include: { category: true, subcategory: true },
        })
      : await prisma.benefitConfig.create({
          data: { title, description, categoryId: category?.id || null, subcategoryId: subcategory?.id || null },
          include: { category: true, subcategory: true },
        });

    return res.json(mapBenefitConfigToResponse(saved));
  } catch (err) {
    console.error('POST /api/benefits/config error', err);
    return res.status(500).json({ error: 'Failed to save benefit configuration' });
  }
});

// CREATE benefit config
app.post('/api/benefit-configs', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description } = req.body ?? {};
    const categoryId = parseIntegerId(req.body?.categoryId);
    const subcategoryId = parseIntegerId(req.body?.subcategoryId);

    if (!title || !description) {
      return res.status(400).json({ error: 'Both title and description are required' });
    }

    let category = null;
    if (categoryId) {
      category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    let subcategory = null;
    if (subcategoryId) {
      subcategory = await prisma.serviceSubCategory.findUnique({ where: { id: subcategoryId } });
      if (!subcategory) {
        return res.status(400).json({ error: 'Sub-category not found' });
      }

      if (category && subcategory.categoryId !== category.id) {
        return res.status(400).json({ error: 'Sub-category does not belong to the selected category' });
      }

      if (!category) {
        category = await prisma.serviceCategory.findUnique({ where: { id: subcategory.categoryId } });
      }
    }

    const saved = await prisma.benefitConfig.create({
      data: { title, description, categoryId: category?.id || null, subcategoryId: subcategory?.id || null },
      include: { category: true, subcategory: true },
    });

    return res.status(201).json(mapBenefitConfigToResponse(saved));
  } catch (err) {
    console.error('POST /api/benefit-configs error', err);
    return res.status(500).json({ error: 'Failed to create benefit configuration' });
  }
});

// UPDATE benefit config
app.put('/api/benefit-configs/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const parsedId = parseIntegerId(req.params.id);
    if (!parsedId) {
      return res.status(400).json({ error: 'Valid benefit config id required' });
    }

    const { title, description } = req.body ?? {};
    const categoryId = parseIntegerId(req.body?.categoryId);
    const subcategoryId = parseIntegerId(req.body?.subcategoryId);

    if (!title || !description) {
      return res.status(400).json({ error: 'Both title and description are required' });
    }

    const existing = await prisma.benefitConfig.findUnique({ where: { id: parsedId } });
    if (!existing) {
      return res.status(404).json({ error: 'Benefit configuration not found' });
    }

    let category = null;
    if (categoryId) {
      category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    let subcategory = null;
    if (subcategoryId) {
      subcategory = await prisma.serviceSubCategory.findUnique({ where: { id: subcategoryId } });
      if (!subcategory) {
        return res.status(400).json({ error: 'Sub-category not found' });
      }

      if (category && subcategory.categoryId !== category.id) {
        return res.status(400).json({ error: 'Sub-category does not belong to the selected category' });
      }

      if (!category) {
        category = await prisma.serviceCategory.findUnique({ where: { id: subcategory.categoryId } });
      }
    }

    const saved = await prisma.benefitConfig.update({
      where: { id: parsedId },
      data: { title, description, categoryId: category?.id || null, subcategoryId: subcategory?.id || null },
      include: { category: true, subcategory: true },
    });

    return res.json(mapBenefitConfigToResponse(saved));
  } catch (err) {
    console.error('PUT /api/benefit-configs/:id error', err);
    return res.status(500).json({ error: 'Failed to update benefit configuration' });
  }
});

// GET all benefits
app.get('/api/benefits', async (req, res) => {
  try {
    const { category, subcategory, benefitConfigId } = req.query;
    const parsedBenefitConfigId = parseIntegerId(benefitConfigId);

    const benefits = await prisma.benefit.findMany({
      where: {
        ...(category && { category }),
        ...(subcategory && { subcategory }),
        ...(parsedBenefitConfigId && { benefitConfigId: parsedBenefitConfigId }),
      },
      orderBy: { createdAt: 'desc' },
      include: { benefitConfig: { include: { category: true, subcategory: true } } },
    });

    res.json(benefits.map(mapBenefitToResponse));
  } catch (err) {
    console.error('GET /api/benefits error', err);
    res.status(500).json({ error: 'Failed to fetch benefits' });
  }
});

// CREATE benefit
app.post('/api/benefits', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, category, subcategory, description, image, benefitConfigId } = req.body ?? {};

    if (!title || !description || !image) {
      return res.status(400).json({
        error: 'title, description, and image are required'
      });
    }

    const parsedBenefitConfigId = parseIntegerId(benefitConfigId);
    if (!parsedBenefitConfigId) {
      return res.status(400).json({ error: 'benefitConfigId is required; please create the Benefit config first' });
    }

    const config = await prisma.benefitConfig.findUnique({
      where: { id: parsedBenefitConfigId },
      include: { category: true, subcategory: true },
    });

    if (!config) {
      return res.status(404).json({ error: 'Benefit configuration not found' });
    }

    const created = await prisma.benefit.create({
      data: {
        title,
        category: category || config.category?.name || null,
        subcategory: subcategory || config.subcategory?.name || null,
        description,
        image,
        benefitConfigId: config.id,
      },
      include: { benefitConfig: { include: { category: true, subcategory: true } } },
    });

    res.status(201).json(mapBenefitToResponse(created));
  } catch (err) {
    console.error('POST /api/benefits error', err);
    res.status(500).json({ error: 'Failed to create benefit' });
  }
});

// UPDATE benefit
app.put('/api/benefits/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid benefit id required' });
    }

    const { title, category, subcategory, description, image, benefitConfigId } = req.body ?? {};

    const parsedBenefitConfigId = parseIntegerId(benefitConfigId);
    if (!parsedBenefitConfigId) {
      return res.status(400).json({ error: 'benefitConfigId is required; please create the Benefit config first' });
    }

    const config = await prisma.benefitConfig.findUnique({
      where: { id: parsedBenefitConfigId },
      include: { category: true, subcategory: true },
    });

    if (!config) {
      return res.status(404).json({ error: 'Benefit configuration not found' });
    }

    const updated = await prisma.benefit.update({
      where: { id },
      data: {
        title,
        category: category || config.category?.name || null,
        subcategory: subcategory || config.subcategory?.name || null,
        description,
        image,
        benefitConfigId: config.id,
      },
      include: { benefitConfig: { include: { category: true, subcategory: true } } },
    });

    res.json(mapBenefitToResponse(updated));
  } catch (err) {
    console.error('PUT /api/benefits/:id error', err);
    res.status(500).json({ error: 'Failed to update benefit' });
  }
});

// DELETE benefit
app.delete('/api/benefits/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid benefit id required' });
    }

    await prisma.benefit.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/benefits/:id error', err);
    res.status(500).json({ error: 'Failed to delete benefit' });
  }
});

/* ===============================================
 * CONTACT BUTTON APIs
 * =============================================== */

// GET all contact buttons
app.get('/api/contact-buttons', async (_req, res) => {
  try {
    const buttons = await prisma.contactButton.findMany({ orderBy: { createdAt: 'desc' } });

    res.json(buttons.map(mapContactButtonToResponse));
  } catch (err) {
    console.error('GET /api/contact-buttons error', err);
    res.status(500).json({ error: 'Failed to fetch contact buttons' });
  }
});

// CREATE contact button
app.post('/api/contact-buttons', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description, image, category, subcategory } = req.body ?? {};

    if (!title || !image) {
      return res.status(400).json({ error: 'Title and image are required' });
    }

    const created = await prisma.contactButton.create({
      data: {
        title,
        description: description || null,
        image,
        category: category || null,
        subcategory: subcategory || null,
      },
    });

    res.status(201).json(mapContactButtonToResponse(created));
  } catch (err) {
    console.error('POST /api/contact-buttons error', err);
    res.status(500).json({ error: 'Failed to create contact button' });
  }
});

// UPDATE contact button
app.put('/api/contact-buttons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid contact button id required' });
    }

    const { title, description, image, category, subcategory } = req.body ?? {};

    const updated = await prisma.contactButton.update({
      where: { id },
      data: {
        title,
        description: description || null,
        image,
        category: category || null,
        subcategory: subcategory || null,
      },
    });

    res.json(mapContactButtonToResponse(updated));
  } catch (err) {
    console.error('PUT /api/contact-buttons/:id error', err);
    res.status(500).json({ error: 'Failed to update contact button' });
  }
});

// DELETE contact button
app.delete('/api/contact-buttons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid contact button id required' });
    }

    await prisma.contactButton.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/contact-buttons/:id error', err);
    res.status(500).json({ error: 'Failed to delete contact button' });
  }
});

/* ===============================================
 * SERVICE PROCESS APIs
 * =============================================== */

const mapServiceProcessToResponse = (process) => ({
  id: process.id,
  title: process.title,
  description: process.description,
  image: process.image,
  serviceId: process.serviceId || null,
  createdAt: process.createdAt,
  updatedAt: process.updatedAt,
});

// GET all service processes
app.get('/api/service-processes', async (req, res) => {
  try {
    const processes = await prisma.serviceProcess.findMany({
      where: req.query.serviceId ? { serviceId: req.query.serviceId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    res.json(processes.map(mapServiceProcessToResponse));
  } catch (err) {
    console.error('GET /api/service-processes error', err);
    res.status(500).json({ error: 'Failed to fetch service processes' });
  }
});

// CREATE service process
app.post('/api/service-processes', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description, image, serviceId } = req.body ?? {};

    if (!title || !description || !image) {
      return res.status(400).json({
        error: 'title, description, and image are required'
      });
    }

    if (serviceId) {
      const serviceExists = await prisma.serviceMenu.findUnique({
        where: { id: serviceId }
      });
      if (!serviceExists) {
        return res.status(404).json({ error: 'Related service not found' });
      }
    }

    const created = await prisma.serviceProcess.create({
      data: {
        title,
        description,
        image,
        serviceId: serviceId || null,
      },
    });

    res.status(201).json(mapServiceProcessToResponse(created));
  } catch (err) {
    console.error('POST /api/service-processes error', err);
    res.status(500).json({ error: 'Failed to create service process' });
  }
});

// UPDATE service process
app.put('/api/service-processes/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid service process id required' });
    }

    const { title, description, image, serviceId } = req.body ?? {};

    if (serviceId) {
      const serviceExists = await prisma.serviceMenu.findUnique({
        where: { id: serviceId }
      });
      if (!serviceExists) {
        return res.status(404).json({ error: 'Related service not found' });
      }
    }

    const updated = await prisma.serviceProcess.update({
      where: { id },
      data: {
        title,
        description,
        image,
        serviceId: serviceId === null ? null : serviceId,
      },
    });

    res.json(mapServiceProcessToResponse(updated));
  } catch (err) {
    console.error('PUT /api/service-processes/:id error', err);
    res.status(500).json({ error: 'Failed to update service process' });
  }
});

// DELETE service process
app.delete('/api/service-processes/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid service process id required' });
    }

    await prisma.serviceProcess.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/service-processes/:id error', err);
    res.status(500).json({ error: 'Failed to delete service process' });
  }
});

/* ===============================================
 * HIRE DEVELOPER APIs
 * =============================================== */

const mapHireDeveloperToResponse = (hireDev) => ({
  id: hireDev.id,
  title: hireDev.title,
  description: hireDev.description,
  heroImage: hireDev.heroImage,
  services: hireDev.services?.map(s => ({
    id: s.id,
    category: s.category,
    subcategory: s.subcategory || '',
    title: s.title,
    description: s.description,
    image: s.image,
  })) || [],
  createdAt: hireDev.createdAt,
  updatedAt: hireDev.updatedAt,
});

// GET hire developer config
app.get('/api/hire-developer', async (req, res) => {
  try {
    const hireDev = await prisma.hireDeveloper.findFirst({
      include: { services: true },
    });

    if (!hireDev) {
      return res.status(404).json({ error: 'Hire developer config not found' });
    }

    res.json(mapHireDeveloperToResponse(hireDev));
  } catch (err) {
    console.error('GET /api/hire-developer error', err);
    res.status(500).json({ error: 'Failed to fetch hire developer config' });
  }
});

// CREATE or UPDATE hire developer config
app.post('/api/hire-developer', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description, heroImage } = req.body ?? {};

    if (!title || !description || !heroImage) {
      return res.status(400).json({
        error: 'title, description, and heroImage are required'
      });
    }

    const existing = await prisma.hireDeveloper.findFirst();

    let result;
    if (existing) {
      result = await prisma.hireDeveloper.update({
        where: { id: existing.id },
        data: { title, description, heroImage },
        include: { services: true },
      });
    } else {
      result = await prisma.hireDeveloper.create({
        data: { title, description, heroImage },
        include: { services: true },
      });
    }

    res.json(mapHireDeveloperToResponse(result));
  } catch (err) {
    console.error('POST /api/hire-developer error', err);
    res.status(500).json({ error: 'Failed to save hire developer config' });
  }
});

/* ===============================================
 * HIRE SERVICE APIs
 * =============================================== */

const mapHireServiceToResponse = (service) => ({
  id: service.id,
  category: service.category || '',
  subcategory: service.subcategory || '',
  title: service.title,
  description: service.description,
  image: service.image,
  hireDeveloperId: service.hireDeveloperId,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
});

// GET all hire services
app.get('/api/hire-services', async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    const services = await prisma.hireService.findMany({
      where: {
        ...(category && { category }),
        ...(subcategory && { subcategory }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(services.map(mapHireServiceToResponse));
  } catch (err) {
    console.error('GET /api/hire-services error', err);
    res.status(500).json({ error: 'Failed to fetch hire services' });
  }
});

// CREATE hire service
app.post('/api/hire-services', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { category, subcategory, title, description, image, hireDeveloperId } = req.body ?? {};

    if (!title || !description || !image) {
      return res.status(400).json({
        error: 'title, description, and image are required'
      });
    }

    const created = await prisma.hireService.create({
      data: {
        category: category?.trim() || null,
        subcategory: subcategory?.trim() || null,
        title,
        description,
        image,
        hireDeveloperId: hireDeveloperId || null,
      },
    });

    res.status(201).json(mapHireServiceToResponse(created));
  } catch (err) {
    console.error('POST /api/hire-services error', err);
    res.status(500).json({ error: 'Failed to create hire service' });
  }
});

// UPDATE hire service
app.put('/api/hire-services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid hire service id required' });
    }

    const { category, subcategory, title, description, image, hireDeveloperId } = req.body ?? {};

    const updated = await prisma.hireService.update({
      where: { id },
      data: {
        category: category === undefined ? undefined : category?.trim() || null,
        subcategory: subcategory === undefined ? undefined : subcategory?.trim() || null,
        title,
        description,
        image,
        hireDeveloperId: hireDeveloperId === null ? null : hireDeveloperId,
      },
    });

    res.json(mapHireServiceToResponse(updated));
  } catch (err) {
    console.error('PUT /api/hire-services/:id error', err);
    res.status(500).json({ error: 'Failed to update hire service' });
  }
});

// DELETE hire service
app.delete('/api/hire-services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid hire service id required' });
    }

    await prisma.hireService.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-services/:id error', err);
    res.status(500).json({ error: 'Failed to delete hire service' });
  }
});

/* ===============================================
 * HIRE CONTACT BUTTON APIs
 * =============================================== */

const mapHireContactButtonToResponse = (button) => ({
  id: button.id,
  title: button.title,
  description: button.description || '',
  image: button.image || '',
  category: button.category || '',
  subcategory: button.subcategory || '',
  createdAt: button.createdAt,
  updatedAt: button.updatedAt,
});

// GET hire contact buttons (optional category/subcategory filters)
app.get('/api/hire-developer/contact-buttons', async (req, res) => {
  try {
    const { category, subcategory } = req.query ?? {};

    const buttons = await prisma.hireContactButton.findMany({
      where: {
        ...(category && { category }),
        ...(subcategory && { subcategory }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(buttons.map(mapHireContactButtonToResponse));
  } catch (err) {
    console.error('GET /api/hire-developer/contact-buttons error', err);
    res.status(500).json({ error: 'Failed to fetch hire contact buttons' });
  }
});

// CREATE hire contact button
app.post('/api/hire-developer/contact-buttons', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description, image, category, subcategory } = req.body ?? {};

    if (!title || !image) {
      return res.status(400).json({ error: 'Title and image are required' });
    }

    const created = await prisma.hireContactButton.create({
      data: {
        title,
        description: description || null,
        image,
        category: category || null,
        subcategory: subcategory || null,
      },
    });

    res.status(201).json(mapHireContactButtonToResponse(created));
  } catch (err) {
    console.error('POST /api/hire-developer/contact-buttons error', err);
    res.status(500).json({ error: 'Failed to create hire contact button' });
  }
});

// UPDATE hire contact button
app.put('/api/hire-developer/contact-buttons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid hire contact button id required' });
    }

    const { title, description, image, category, subcategory } = req.body ?? {};

    const updated = await prisma.hireContactButton.update({
      where: { id },
      data: {
        title,
        description: description || null,
        image,
        category: category || null,
        subcategory: subcategory || null,
      },
    });

    res.json(mapHireContactButtonToResponse(updated));
  } catch (err) {
    console.error('PUT /api/hire-developer/contact-buttons/:id error', err);
    res.status(500).json({ error: 'Failed to update hire contact button' });
  }
});

// DELETE hire contact button
app.delete('/api/hire-developer/contact-buttons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid hire contact button id required' });
    }

    await prisma.hireContactButton.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/contact-buttons/:id error', err);
    res.status(500).json({ error: 'Failed to delete hire contact button' });
  }
});

/* ===============================================
 * WHY CHOOSE APIs
 * =============================================== */

const mapWhyChooseToResponse = (whyChoose, includeServices = true) => ({
  id: whyChoose.id,
  category: whyChoose.category || '',
  subcategory: whyChoose.subcategory || '',
  heroTitle: whyChoose.heroTitle,
  heroDescription: whyChoose.heroDescription,
  heroImage: whyChoose.heroImage,
  tableTitle: whyChoose.tableTitle,
  tableDescription: whyChoose.tableDescription,
  ...(includeServices && {
    services: whyChoose.services?.map((s) => ({
      id: s.id,
      category: s.category,
      subcategory: s.subcategory || '',
      title: s.title,
      description: s.description,
    })) || [],
  }),
  createdAt: whyChoose.createdAt,
  updatedAt: whyChoose.updatedAt,
});

const resolveWhyChooseId = async (providedId) => {
  if (providedId !== undefined && providedId !== null) return parseIntegerId(providedId);
  return null;
};

// GET why choose config
app.get('/api/why-choose', async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    const whyChooseList = await prisma.whyChoose.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(subcategory && { subcategory: String(subcategory) }),
      },
      orderBy: { createdAt: 'desc' },
      include: { services: true },
    });

    res.json(whyChooseList.map((item) => mapWhyChooseToResponse(item)));
  } catch (err) {
    console.error('GET /api/why-choose error', err);
    res.status(500).json({ error: 'Failed to fetch why choose config' });
  }
});

// CREATE or UPDATE why choose config
app.post('/api/why-choose', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const {
      id,
      category,
      subcategory,
      heroTitle,
      heroDescription,
      heroImage,
      tableTitle,
      tableDescription
    } = req.body ?? {};

    const normalizedId = id ? parseIntegerId(id) : null;
    if (id && !normalizedId) {
      return res.status(400).json({ error: 'Valid why choose id required for updates' });
    }

    if (!category || !heroTitle || !heroDescription || !heroImage || !tableTitle || !tableDescription) {
      return res.status(400).json({
        error: 'Category, hero, and table fields are required'
      });
    }

    const baseData = {
      category,
      subcategory: subcategory?.trim() || null,
      heroTitle,
      heroDescription,
      heroImage,
      tableTitle,
      tableDescription,
    };

    let result;
    if (normalizedId) {
      result = await prisma.whyChoose.update({
        where: { id: normalizedId },
        data: baseData,
        include: { services: true },
      });
    } else {
      result = await prisma.whyChoose.create({
        data: baseData,
        include: { services: true },
      });
    }

    res.json(mapWhyChooseToResponse(result));
  } catch (err) {
    console.error('POST /api/why-choose error', err);
    res.status(500).json({ error: 'Failed to save why choose config' });
  }
});

/* ===============================================
 * WHY SERVICE APIs
 * =============================================== */

const mapWhyServiceToResponse = (service) => ({
  id: service.id,
  category: service.category,
  subcategory: service.subcategory || '',
  title: service.title,
  description: service.description,
  whyChooseId: service.whyChooseId,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
});

// GET all why services
app.get('/api/why-services', async (req, res) => {
  try {
    const { category, subcategory, whyChooseId } = req.query;
    const parsedWhyChooseId = parseIntegerId(whyChooseId);

    const services = await prisma.whyService.findMany({
      where: {
        ...(category && { category }),
        ...(subcategory && { subcategory }),
        ...(parsedWhyChooseId && { whyChooseId: parsedWhyChooseId }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(services.map(mapWhyServiceToResponse));
  } catch (err) {
    console.error('GET /api/why-services error', err);
    res.status(500).json({ error: 'Failed to fetch why services' });
  }
});

// CREATE why service
app.post('/api/why-services', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { category, subcategory, title, description, whyChooseId } = req.body ?? {};

    if (!category || !title || !description) {
      return res.status(400).json({
        error: 'category, title, and description are required'
      });
    }

    const resolvedWhyChooseId = await resolveWhyChooseId(whyChooseId);
    if (!resolvedWhyChooseId) {
      return res.status(400).json({
        error: 'whyChooseId is required; please create the Why Choose config first'
      });
    }

    const hasWhyChoose = await prisma.whyChoose.findUnique({ where: { id: resolvedWhyChooseId } });
    if (!hasWhyChoose) {
      return res.status(400).json({ error: 'whyChooseId does not exist' });
    }

    const created = await prisma.whyService.create({
      data: {
        category,
        subcategory: subcategory?.trim() || null,
        title,
        description,
        whyChooseId: resolvedWhyChooseId,
      },
    });

    res.status(201).json(mapWhyServiceToResponse(created));
  } catch (err) {
    console.error('POST /api/why-services error', err);
    res.status(500).json({ error: 'Failed to create why service' });
  }
});

// UPDATE why service
app.put('/api/why-services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid why service id required' });
    }

    const { category, subcategory, title, description, whyChooseId } = req.body ?? {};

    const data = {
      category,
      subcategory: subcategory === undefined ? undefined : subcategory?.trim() || null,
      title,
      description,
    };

    if (whyChooseId !== undefined) {
      const resolvedWhyChooseId = await resolveWhyChooseId(whyChooseId);
      if (!resolvedWhyChooseId) {
        return res.status(400).json({
          error: 'whyChooseId is required; please create the Why Choose config first'
        });
      }
      const hasWhyChoose = await prisma.whyChoose.findUnique({ where: { id: resolvedWhyChooseId } });
      if (!hasWhyChoose) {
        return res.status(400).json({ error: 'whyChooseId does not exist' });
      }

      data.whyChooseId = resolvedWhyChooseId;
    }

    const updated = await prisma.whyService.update({
      where: { id },
      data,
    });

    res.json(mapWhyServiceToResponse(updated));
  } catch (err) {
    console.error('PUT /api/why-services/:id error', err);
    res.status(500).json({ error: 'Failed to update why service' });
  }
});

// DELETE why service
app.delete('/api/why-services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid why service id required' });
    }

    await prisma.whyService.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/why-services/:id error', err);
    res.status(500).json({ error: 'Failed to delete why service' });
  }
});

/* ===============================================
 * WHY VEDX APIs
 * =============================================== */

const mapWhyVedxToResponse = (whyVedx) => ({
  id: whyVedx.id,
  heroTitle: whyVedx.heroTitle,
  heroDescription: whyVedx.heroDescription,
  categoryId: whyVedx.categoryId || null,
  subcategoryId: whyVedx.subcategoryId || null,
  categoryName: whyVedx.category?.name || '',
  subcategoryName: whyVedx.subcategory?.name || '',
  reasons: whyVedx.reasons?.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    image: r.image,
  })) || [],
  createdAt: whyVedx.createdAt,
  updatedAt: whyVedx.updatedAt,
});

const resolveWhyVedxId = async (providedId) => {
  const parsed = parseIntegerId(providedId);
  if (parsed) {
    const existing = await prisma.whyVedx.findUnique({ where: { id: parsed }, select: { id: true } });
    return existing?.id ?? null;
  }

  const existing = await prisma.whyVedx.findFirst({ select: { id: true } });
  return existing?.id ?? null;
};

// GET why vedx config
app.get('/api/why-vedx', async (req, res) => {
  try {
    const includeReasons = req.query.includeReasons === 'true';
    const whyVedx = await prisma.whyVedx.findMany({
      include: {
        ...(includeReasons
          ? { reasons: { include: { category: true, subcategory: true }, orderBy: { createdAt: 'desc' } } }
          : {}),
        category: true,
        subcategory: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(whyVedx.map(mapWhyVedxToResponse));
  } catch (err) {
    console.error('GET /api/why-vedx error', err);
    res.status(500).json({ error: 'Failed to fetch why VEDX config' });
  }
});

// CREATE or UPDATE why vedx config
app.post('/api/why-vedx', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { id, heroTitle, heroDescription } = req.body ?? {};
    const categoryId = parseIntegerId(req.body?.categoryId);
    const subcategoryId = parseIntegerId(req.body?.subcategoryId);

    if (!heroTitle || !heroDescription) {
      return res.status(400).json({
        error: 'heroTitle and heroDescription are required'
      });
    }

    let category = null;
    if (categoryId) {
      category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    let subcategory = null;
    if (subcategoryId) {
      subcategory = await prisma.serviceSubCategory.findUnique({ where: { id: subcategoryId } });
      if (!subcategory) {
        return res.status(400).json({ error: 'Sub-category not found' });
      }

      if (category && subcategory.categoryId !== category.id) {
        return res.status(400).json({ error: 'Sub-category does not belong to the selected category' });
      }

      if (!category) {
        category = await prisma.serviceCategory.findUnique({ where: { id: subcategory.categoryId } });
      }
    }

    let result;
    if (id) {
      const parsedId = parseIntegerId(id);
      if (!parsedId) return res.status(400).json({ error: 'Valid whyVedx id is required' });

      result = await prisma.whyVedx.update({
        where: { id: parsedId },
        data: {
          heroTitle,
          heroDescription,
          categoryId: category?.id || null,
          subcategoryId: subcategory?.id || null,
        },
        include: { reasons: true, category: true, subcategory: true },
      });
    } else {
      result = await prisma.whyVedx.create({
        data: {
          heroTitle,
          heroDescription,
          categoryId: category?.id || null,
          subcategoryId: subcategory?.id || null,
        },
        include: { reasons: true, category: true, subcategory: true },
      });
    }

    res.json(mapWhyVedxToResponse(result));
  } catch (err) {
    console.error('POST /api/why-vedx error', err);
    res.status(500).json({ error: 'Failed to save why VEDX config' });
  }
});

// DELETE why vedx config
app.delete('/api/why-vedx/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Valid whyVedx id required' });

    await prisma.whyVedx.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/why-vedx/:id error', err);
    res.status(500).json({ error: 'Failed to delete why VEDX config' });
  }
});

/* ===============================================
 * WHY VEDX REASON APIs
 * =============================================== */

const mapWhyVedxReasonToResponse = (reason) => ({
  id: reason.id,
  title: reason.title,
  description: reason.description || '',
  image: reason.image || null,
  categoryId: reason.categoryId || null,
  categoryName: reason.category?.name || reason.categoryName || reason.category || '',
  subcategoryId: reason.subcategoryId || null,
  subcategoryName: reason.subcategory?.name || reason.subcategoryName || reason.subcategory || '',
  whyVedxId: reason.whyVedxId,
  createdAt: reason.createdAt,
  updatedAt: reason.updatedAt,
});

// GET all why vedx reasons
app.get('/api/why-vedx-reasons', async (req, res) => {
  try {
    const parsedWhyVedxId = parseIntegerId(req.query?.whyVedxId);
    const categoryName = req.query?.category;
    const subcategoryName = req.query?.subcategory;

    const reasons = await prisma.whyVedxReason.findMany({
      where: {
        ...(parsedWhyVedxId ? { whyVedxId: parsedWhyVedxId } : {}),
        ...(categoryName ? { category: { name: categoryName } } : {}),
        ...(subcategoryName ? { subcategory: { name: subcategoryName } } : {}),
      },
      include: { category: true, subcategory: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reasons.map(mapWhyVedxReasonToResponse));
  } catch (err) {
    console.error('GET /api/why-vedx-reasons error', err);
    res.status(500).json({ error: 'Failed to fetch why VEDX reasons' });
  }
});

// CREATE why vedx reason
app.post('/api/why-vedx-reasons', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description, image, whyVedxId } = req.body ?? {};
    const categoryId = parseIntegerId(req.body?.categoryId);
    const subcategoryId = parseIntegerId(req.body?.subcategoryId);

    if (!title || !description || !image) {
      return res.status(400).json({
        error: 'title, description, and image are required'
      });
    }

    const resolvedWhyVedxId = await resolveWhyVedxId(whyVedxId);
    if (!resolvedWhyVedxId) {
      return res.status(400).json({
        error: 'whyVedxId is required; please create the Why VEDX config first'
      });
    }

    let category = null;
    if (categoryId) {
      category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    let subcategory = null;
    if (subcategoryId) {
      subcategory = await prisma.serviceSubCategory.findUnique({ where: { id: subcategoryId } });
      if (!subcategory) {
        return res.status(400).json({ error: 'Sub-category not found' });
      }

      if (category && subcategory.categoryId !== category.id) {
        return res.status(400).json({ error: 'Sub-category does not belong to the selected category' });
      }

      if (!category) {
        category = await prisma.serviceCategory.findUnique({ where: { id: subcategory.categoryId } });
      }
    }

    const created = await prisma.whyVedxReason.create({
      data: {
        title,
        description,
        image,
        whyVedxId: resolvedWhyVedxId,
        categoryId: category?.id || null,
        subcategoryId: subcategory?.id || null,
      },
      include: { category: true, subcategory: true },
    });

    res.status(201).json(mapWhyVedxReasonToResponse(created));
  } catch (err) {
    console.error('POST /api/why-vedx-reasons error', err);
    res.status(500).json({ error: 'Failed to create why VEDX reason' });
  }
});

// UPDATE why vedx reason
app.put('/api/why-vedx-reasons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid reason id required' });
    }

    const { title, description, image, whyVedxId } = req.body ?? {};
    const categoryId = parseIntegerId(req.body?.categoryId);
    const subcategoryId = parseIntegerId(req.body?.subcategoryId);

    const data = { title, description, image };

    if (whyVedxId !== undefined) {
      const resolvedWhyVedxId = await resolveWhyVedxId(whyVedxId);
      if (!resolvedWhyVedxId) {
        return res.status(400).json({
          error: 'whyVedxId is required; please create the Why VEDX config first'
        });
      }

      data.whyVedxId = resolvedWhyVedxId;
    }

    if (categoryId !== undefined) {
      if (categoryId === null || Number.isNaN(categoryId)) {
        data.categoryId = null;
      } else {
        const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
        if (!category) {
          return res.status(400).json({ error: 'Category not found' });
        }

        data.categoryId = category.id;
      }
    }

    if (subcategoryId !== undefined) {
      if (subcategoryId === null || Number.isNaN(subcategoryId)) {
        data.subcategoryId = null;
      } else {
        const subcategory = await prisma.serviceSubCategory.findUnique({ where: { id: subcategoryId } });
        if (!subcategory) {
          return res.status(400).json({ error: 'Sub-category not found' });
        }

        if (data.categoryId && subcategory.categoryId !== data.categoryId) {
          return res.status(400).json({ error: 'Sub-category does not belong to the selected category' });
        }

        if (!data.categoryId) {
          data.categoryId = subcategory.categoryId;
        }

        data.subcategoryId = subcategory.id;
      }
    }

    const updated = await prisma.whyVedxReason.update({
      where: { id },
      data,
      include: { category: true, subcategory: true },
    });

    res.json(mapWhyVedxReasonToResponse(updated));
  } catch (err) {
    console.error('PUT /api/why-vedx-reasons/:id error', err);
    res.status(500).json({ error: 'Failed to update why VEDX reason' });
  }
});

// DELETE why vedx reason
app.delete('/api/why-vedx-reasons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid reason id required' });
    }

    await prisma.whyVedxReason.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/why-vedx-reasons/:id error', err);
    res.status(500).json({ error: 'Failed to delete why VEDX reason' });
  }
});

/* ================================================
 * HOME: WHY VEDX SOLUTION APIs
 * ================================================ */

const mapHomeWhyVedxReasonToResponse = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description || '',
  image: item.image || null,
  whyVedxId: item.whyVedxId,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const validateHomeWhyVedxReasonInput = (body) => {
  const title = normalizeText(body?.title);
  const description = normalizeText(body?.description);
  const image = typeof body?.image === 'string' ? body.image : null;

  if (!title) return { error: 'title is required' };
  if (!description) return { error: 'description is required' };
  if (!image) return { error: 'image is required' };

  const imageError = validateImageUrl(image);
  if (imageError) return { error: imageError };

  return { title, description, image };
};

// GET all reasons (public)
app.get('/api/home/why-vedx-reasons', async (_req, res) => {
  try {
    const items = await prisma.whyVedxReason.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json(items.map(mapHomeWhyVedxReasonToResponse));
  } catch (err) {
    console.error('GET /api/home/why-vedx-reasons error', err);
    return res.status(500).json({ error: 'Failed to fetch reasons' });
  }
});

// GET single reason by id (public)
app.get('/api/home/why-vedx-reasons/:id', async (req, res) => {
  try {
    const id = parseIntegerId(req.params.id);
    if (!id) return res.status(400).json({ error: 'A valid id is required' });

    const item = await prisma.whyVedxReason.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Reason not found' });

    return res.json(mapHomeWhyVedxReasonToResponse(item));
  } catch (err) {
    console.error('GET /api/home/why-vedx-reasons/:id error', err);
    return res.status(500).json({ error: 'Failed to fetch reason' });
  }
});

// Admin: GET all reasons
app.get('/api/admin/home/why-vedx-reasons', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const items = await prisma.whyVedxReason.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ reasons: items.map(mapHomeWhyVedxReasonToResponse) });
  } catch (err) {
    console.error('GET /api/admin/home/why-vedx-reasons error', err);
    return res.status(500).json({ message: 'Unable to load reasons right now.' });
  }
});

// Admin: CREATE reason
app.post('/api/admin/home/why-vedx-reasons', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const validation = validateHomeWhyVedxReasonInput(req.body || {});
    if (validation.error) return res.status(400).json({ error: validation.error });

    const resolvedWhyVedxId = await resolveWhyVedxId(req.body?.whyVedxId);
    if (!resolvedWhyVedxId) {
      return res.status(400).json({
        error: 'whyVedxId is required; please create the Why VEDX config first',
      });
    }

    const created = await prisma.whyVedxReason.create({
      data: {
        title: validation.title,
        description: validation.description,
        image: validation.image,
        whyVedxId: resolvedWhyVedxId,
      },
    });

    return res.status(201).json({
      reason: mapHomeWhyVedxReasonToResponse(created),
      message: 'Reason created.',
    });
  } catch (err) {
    console.error('POST /api/admin/home/why-vedx-reasons error', err);
    return res.status(500).json({ error: 'Failed to create reason' });
  }
});

// Admin: UPDATE reason
app.put('/api/admin/home/why-vedx-reasons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) return res.status(400).json({ error: 'A valid id is required' });

    const existing = await prisma.whyVedxReason.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Reason not found' });

    const title = typeof req.body?.title === 'string' ? normalizeText(req.body.title) : undefined;
    const description =
      typeof req.body?.description === 'string' ? normalizeText(req.body.description) : undefined;
    const image = typeof req.body?.image === 'string' ? req.body.image : undefined;

    if (title !== undefined && !title) return res.status(400).json({ error: 'title is required' });
    if (description !== undefined && !description)
      return res.status(400).json({ error: 'description is required' });

    if (image !== undefined) {
      if (!image) return res.status(400).json({ error: 'image is required' });
      const imageError = validateImageUrl(image);
      if (imageError) return res.status(400).json({ error: imageError });
    }

    const data = {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(image !== undefined ? { image } : {}),
    };

    if (req.body?.whyVedxId !== undefined) {
      const resolvedWhyVedxId = await resolveWhyVedxId(req.body.whyVedxId);
      if (!resolvedWhyVedxId) {
        return res.status(400).json({
          error: 'whyVedxId is required; please create the Why VEDX config first',
        });
      }
      data.whyVedxId = resolvedWhyVedxId;
    }

    const updated = await prisma.whyVedxReason.update({
      where: { id },
      data,
    });

    return res.json({
      reason: mapHomeWhyVedxReasonToResponse(updated),
      message: 'Reason updated.',
    });
  } catch (err) {
    console.error('PUT /api/admin/home/why-vedx-reasons/:id error', err);
    return res.status(500).json({ error: 'Failed to update reason' });
  }
});

// Admin: DELETE reason
app.delete('/api/admin/home/why-vedx-reasons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) return res.status(400).json({ error: 'A valid id is required' });

    const existing = await prisma.whyVedxReason.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Reason not found' });

    await prisma.whyVedxReason.delete({ where: { id } });

    return res.json({ success: true, message: 'Reason deleted.' });
  } catch (err) {
    console.error('DELETE /api/admin/home/why-vedx-reasons/:id error', err);
    return res.status(500).json({ error: 'Failed to delete reason' });
  }
});

/* ============================================================
 * HIRE DEVELOPER – APIS
 * ============================================================
 */

/* ------------------------------
 * Helpers
 * ------------------------------ */
const requireIdParam = (req, res) => {
  const id = parseIntegerId(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Valid id is required' });
    return null;
  }
  return id;
};

/* ============================================================
 * 1. HireDeveloperService
 * ============================================================
 */

// GET all hire developer services (optional category filter)
app.get('/api/hire-developer/services', async (req, res) => {
  try {
    const { category } = req.query;

    const services = await prisma.hireDeveloperService.findMany({
      where: {
        ...(category && { category: String(category) }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(services);
  } catch (err) {
    console.error('GET /api/hire-developer/services error', err);
    res.status(500).json({ error: 'Failed to fetch hire developer services' });
  }
});

// CREATE hire developer service
app.post('/api/hire-developer/services', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const {
      category,
      subcategories,
      bannerTitle,
      bannerSubtitle,
      bannerImage,
      totalServices,
      totalProjects,
      totalClients,
      description,
      faqs,
    } = req.body;

    const service = await prisma.hireDeveloperService.create({
      data: {
        category: category?.trim() || null,
        subcategories: subcategories ?? [],
        bannerTitle: bannerTitle?.trim() || null,
        bannerSubtitle: bannerSubtitle?.trim() || null,
        bannerImage: bannerImage?.trim() || null,
        totalServices: Number(totalServices) || 0,
        totalProjects: Number(totalProjects) || 0,
        totalClients: Number(totalClients) || 0,
        description: description?.trim() || null,
        faqs: faqs ?? null,
      },
    });

    res.status(201).json(service);
  } catch (err) {
    console.error('POST /api/hire-developer/services error', err);
    res.status(500).json({ error: 'Failed to create hire developer service' });
  }
});

// UPDATE hire developer service
app.put('/api/hire-developer/services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const {
      category,
      subcategories,
      bannerTitle,
      bannerSubtitle,
      bannerImage,
      totalServices,
      totalProjects,
      totalClients,
      description,
      faqs,
    } = req.body;

    const updated = await prisma.hireDeveloperService.update({
      where: { id },
      data: {
        ...(category !== undefined && { category: category?.trim() || null }),
        ...(subcategories !== undefined && { subcategories }),
        bannerTitle: bannerTitle?.trim() || null,
        bannerSubtitle: bannerSubtitle?.trim() || null,
        bannerImage: bannerImage?.trim() || null,
        ...(totalServices !== undefined && {
          totalServices: Number(totalServices) || 0,
        }),
        ...(totalProjects !== undefined && {
          totalProjects: Number(totalProjects) || 0,
        }),
        ...(totalClients !== undefined && {
          totalClients: Number(totalClients) || 0,
        }),
        description: description?.trim() || null,
        ...(faqs !== undefined && { faqs }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire-developer/services/:id error', err);
    res.status(500).json({ error: 'Failed to update hire developer service' });
  }
});

// DELETE hire developer service
app.delete('/api/hire-developer/services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperService.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/services/:id error', err);
    res.status(500).json({ error: 'Failed to delete hire developer service' });
  }
});

/* ============================================================
 * 2. HireDeveloperTechnology
 * ============================================================
 */

// GET technologies (ordered by title)
app.get('/api/hire-developer/technologies', async (_req, res) => {
  try {
    const technologies = await prisma.hireDeveloperTechnology.findMany({
      orderBy: [
        { title: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(technologies);
  } catch (err) {
    console.error('GET /api/hire-developer/technologies error', err);
    res.status(500).json({ error: 'Failed to fetch technologies' });
  }
});

// CREATE technology
app.post('/api/hire-developer/technologies', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, image, items } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!image || !String(image).trim()) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const technology = await prisma.hireDeveloperTechnology.create({
      data: {
        title: String(title).trim(),
        image: String(image).trim(),
        items: items ?? [],
      },
    });

    res.status(201).json(technology);
  } catch (err) {
    console.error('POST /api/hire-developer/technologies error', err);
    res.status(500).json({ error: 'Failed to create technology' });
  }
});

// UPDATE technology
app.put('/api/hire-developer/technologies/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const { title, image, items } = req.body;

    const updated = await prisma.hireDeveloperTechnology.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(image !== undefined && { image: String(image).trim() }),
        ...(items !== undefined && { items }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire-developer/technologies/:id error', err);
    res.status(500).json({ error: 'Failed to update technology' });
  }
});

// DELETE technology
app.delete('/api/hire-developer/technologies/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperTechnology.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/technologies/:id error', err);
    res.status(500).json({ error: 'Failed to delete technology' });
  }
});

/* ============================================================
 * 3. HireDeveloperBenefits (configs + cards)
 * ============================================================
 */

const mapHireBenefitConfig = (config) => ({
  id: config.id,
  title: config.title,
  description: config.description,
  category: config.category || '',
  subcategory: config.subcategory || '',
  createdAt: config.createdAt,
  updatedAt: config.updatedAt,
});

const mapHireBenefit = (benefit) => ({
  id: benefit.id,
  title: benefit.title,
  category: benefit.category || '',
  subcategory: benefit.subcategory || '',
  description: benefit.description,
  image: benefit.image,
  benefitConfigId: benefit.benefitConfigId || null,
  createdAt: benefit.createdAt,
  updatedAt: benefit.updatedAt,
});

// GET benefit configs
app.get('/api/hire-developer/benefit-configs', async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const configs = await prisma.hireDeveloperBenefitConfig.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(subcategory && { subcategory: String(subcategory) }),
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(configs.map(mapHireBenefitConfig));
  } catch (err) {
    console.error('GET /api/hire-developer/benefit-configs error', err);
    res.status(500).json({ error: 'Failed to fetch benefit configs' });
  }
});

// CREATE or UPDATE benefit config
app.post('/api/hire-developer/benefit-configs', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { id, title, description, category, subcategory } = req.body ?? {};
    const configId = id ? parseIntegerId(id) : null;

    if (!title || !String(title).trim() || !description || !String(description).trim()) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const payload = {
      title: String(title).trim(),
      description: String(description).trim(),
      category: category?.trim() || null,
      subcategory: subcategory?.trim() || null,
    };

    const saved = configId
      ? await prisma.hireDeveloperBenefitConfig.update({
          where: { id: configId },
          data: payload,
        })
      : await prisma.hireDeveloperBenefitConfig.create({ data: payload });

    res.json(mapHireBenefitConfig(saved));
  } catch (err) {
    console.error('POST /api/hire-developer/benefit-configs error', err);
    res.status(500).json({ error: 'Failed to save benefit config' });
  }
});

// GET benefits
app.get('/api/hire-developer/benefits', async (req, res) => {
  try {
    const { category, subcategory, benefitConfigId } = req.query;
    const parsedConfigId = parseIntegerId(benefitConfigId);

    const benefits = await prisma.hireDeveloperBenefit.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(subcategory && { subcategory: String(subcategory) }),
        ...(parsedConfigId && { benefitConfigId: parsedConfigId }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(benefits.map(mapHireBenefit));
  } catch (err) {
    console.error('GET /api/hire-developer/benefits error', err);
    res.status(500).json({ error: 'Failed to fetch benefits' });
  }
});

// CREATE benefit
app.post('/api/hire-developer/benefits', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, category, subcategory, description, image, benefitConfigId } = req.body ?? {};
    const parsedConfigId = parseIntegerId(benefitConfigId);

    if (!parsedConfigId) {
      return res.status(400).json({ error: 'benefitConfigId is required; please create a benefit config first' });
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!image || !String(image).trim()) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const config = await prisma.hireDeveloperBenefitConfig.findUnique({ where: { id: parsedConfigId } });
    if (!config) {
      return res.status(404).json({ error: 'Benefit config not found' });
    }

    const benefit = await prisma.hireDeveloperBenefit.create({
      data: {
        title: String(title).trim(),
        category: category?.trim() || null,
        subcategory: subcategory?.trim() || null,
        description: description?.trim() || null,
        image: String(image).trim(),
        benefitConfigId: parsedConfigId,
      },
    });

    res.status(201).json(mapHireBenefit(benefit));
  } catch (err) {
    console.error('POST /api/hire-developer/benefits error', err);
    res.status(500).json({ error: 'Failed to create benefit' });
  }
});

// UPDATE benefit
app.put('/api/hire-developer/benefits/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const { title, category, subcategory, description, image, benefitConfigId } = req.body ?? {};
    const parsedConfigId = parseIntegerId(benefitConfigId);

    if (benefitConfigId !== undefined && !parsedConfigId) {
      return res.status(400).json({ error: 'benefitConfigId is required' });
    }

    if (parsedConfigId) {
      const config = await prisma.hireDeveloperBenefitConfig.findUnique({ where: { id: parsedConfigId } });
      if (!config) {
        return res.status(404).json({ error: 'Benefit config not found' });
      }
    }

    const updated = await prisma.hireDeveloperBenefit.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        category: category?.trim() || null,
        subcategory: subcategory?.trim() || null,
        description: description?.trim() || null,
        ...(image !== undefined && { image: String(image).trim() }),
        ...(parsedConfigId && { benefitConfigId: parsedConfigId }),
      },
    });

    res.json(mapHireBenefit(updated));
  } catch (err) {
    console.error('PUT /api/hire-developer/benefits/:id error', err);
    res.status(500).json({ error: 'Failed to update benefit' });
  }
});

// DELETE benefit
app.delete('/api/hire-developer/benefits/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperBenefit.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/benefits/:id error', err);
    res.status(500).json({ error: 'Failed to delete benefit' });
  }
});

/* ============================================================
 * 4. HireDeveloperPricing
 * ============================================================
 */

// GET pricing (usually single or few entries)
app.get('/api/hire-developer/pricing', async (_req, res) => {
  try {
    const pricing = await prisma.hireDeveloperPricing.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(pricing);
  } catch (err) {
    console.error('GET /api/hire-developer/pricing error', err);
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
});

// CREATE pricing
app.post('/api/hire-developer/pricing', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const {
      title,
      subtitle,
      description,
      price,
      services,
      heroTitle,
      heroDescription,
      heroImage,
    } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!price || !String(price).trim()) {
      return res.status(400).json({ error: 'Price is required' });
    }

    const pricing = await prisma.hireDeveloperPricing.create({
      data: {
        title: String(title).trim(),
        subtitle: subtitle?.trim() || null,
        description: description?.trim() || null,
        price: String(price).trim(),
        services: services ?? [],
        heroTitle: heroTitle?.trim() || null,
        heroDescription: heroDescription?.trim() || null,
        heroImage: heroImage?.trim() || null,
      },
    });

    res.status(201).json(pricing);
  } catch (err) {
    console.error('POST /api/hire-developer/pricing error', err);
    res.status(500).json({ error: 'Failed to create pricing' });
  }
});

// UPDATE pricing
app.put('/api/hire-developer/pricing/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const {
      title,
      subtitle,
      description,
      price,
      services,
      heroTitle,
      heroDescription,
      heroImage,
    } = req.body;

    const updated = await prisma.hireDeveloperPricing.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        subtitle: subtitle?.trim() || null,
        description: description?.trim() || null,
        ...(price !== undefined && { price: String(price).trim() }),
        ...(services !== undefined && { services }),
        heroTitle: heroTitle?.trim() || null,
        heroDescription: heroDescription?.trim() || null,
        heroImage: heroImage?.trim() || null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire-developer/pricing/:id error', err);
    res.status(500).json({ error: 'Failed to update pricing' });
  }
});

// DELETE pricing
app.delete('/api/hire-developer/pricing/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperPricing.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/pricing/:id error', err);
    res.status(500).json({ error: 'Failed to delete pricing' });
  }
});

/* ============================================================
 * 5. HireDeveloperProcess
 * ============================================================
 */

// GET processes (optional category / subcategory)
app.get('/api/hire-developer/processes', async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    const processes = await prisma.hireDeveloperProcess.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(subcategory && { subcategory: String(subcategory) }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(processes);
  } catch (err) {
    console.error('GET /api/hire-developer/processes error', err);
    res.status(500).json({ error: 'Failed to fetch processes' });
  }
});

// CREATE process
app.post('/api/hire-developer/processes', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description, category, subcategory, image } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!image || !String(image).trim()) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const process = await prisma.hireDeveloperProcess.create({
      data: {
        title: String(title).trim(),
        description: description?.trim() || null,
        category: category?.trim() || null,
        subcategory: subcategory?.trim() || null,
        image: String(image).trim(),
      },
    });

    res.status(201).json(process);
  } catch (err) {
    console.error('POST /api/hire-developer/processes error', err);
    res.status(500).json({ error: 'Failed to create process' });
  }
});

// UPDATE process
app.put('/api/hire-developer/processes/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const { title, description, category, subcategory, image } = req.body;

    const updated = await prisma.hireDeveloperProcess.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        description: description?.trim() || null,
        ...(category !== undefined && { category: category?.trim() || null }),
        ...(subcategory !== undefined && { subcategory: subcategory?.trim() || null }),
        ...(image !== undefined && { image: String(image).trim() }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire-developer/processes/:id error', err);
    res.status(500).json({ error: 'Failed to update process' });
  }
});

// DELETE process
app.delete('/api/hire-developer/processes/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperProcess.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/processes/:id error', err);
    res.status(500).json({ error: 'Failed to delete process' });
  }
});

/* ============================================================
 * 7. HireDeveloperWhyVedx (configs + reasons)
 * ============================================================
 */

const mapHireWhyVedxConfig = (config, includeReasons = false) => ({
  id: config.id,
  category: config.category || '',
  subcategory: config.subcategory || '',
  heroTitle: config.heroTitle,
  heroDescription: config.heroDescription,
  ...(includeReasons && {
    reasons: (config.reasons || []).map((reason) => ({
      id: reason.id,
      title: reason.title,
      description: reason.description,
      image: reason.image,
      category: reason.category || '',
      subcategory: reason.subcategory || '',
      whyVedxConfigId: reason.whyVedxConfigId || null,
    })),
  }),
  createdAt: config.createdAt,
  updatedAt: config.updatedAt,
});

// GET why vedx configs
app.get('/api/hire-developer/why-vedx', async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const includeReasons = req.query.includeReasons === 'true';

    const configs = await prisma.hireDeveloperWhyVedxConfig.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(subcategory && { subcategory: String(subcategory) }),
      },
      include: includeReasons ? { reasons: { orderBy: { createdAt: 'desc' } } } : {},
      orderBy: { createdAt: 'desc' },
    });

    res.json(configs.map((config) => mapHireWhyVedxConfig(config, includeReasons)));
  } catch (err) {
    console.error('GET /api/hire-developer/why-vedx error', err);
    res.status(500).json({ error: 'Failed to fetch why VedX configs' });
  }
});

// CREATE or UPDATE why vedx config
app.post('/api/hire-developer/why-vedx', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { id, category, subcategory, heroTitle, heroDescription } = req.body ?? {};
    const configId = id ? parseIntegerId(id) : null;

    if (!heroTitle || !heroDescription) {
      return res.status(400).json({ error: 'Hero title and description are required' });
    }

    const payload = {
      category: category?.trim() || null,
      subcategory: subcategory?.trim() || null,
      heroTitle: String(heroTitle).trim(),
      heroDescription: String(heroDescription).trim(),
    };

    const saved = configId
      ? await prisma.hireDeveloperWhyVedxConfig.update({ where: { id: configId }, data: payload })
      : await prisma.hireDeveloperWhyVedxConfig.create({ data: payload });

    res.json(mapHireWhyVedxConfig(saved));
  } catch (err) {
    console.error('POST /api/hire-developer/why-vedx error', err);
    res.status(500).json({ error: 'Failed to save why VedX config' });
  }
});

// GET why vedx reasons
app.get('/api/hire-developer/why-vedx-reasons', async (req, res) => {
  try {
    const { whyVedxConfigId, category, subcategory } = req.query;
    const parsedConfigId = parseIntegerId(whyVedxConfigId);

    const reasons = await prisma.hireDeveloperWhyVedx.findMany({
      where: {
        ...(parsedConfigId && { whyVedxConfigId: parsedConfigId }),
        ...(category && { category: String(category) }),
        ...(subcategory && { subcategory: String(subcategory) }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reasons.map((reason) => ({
      id: reason.id,
      title: reason.title,
      description: reason.description,
      image: reason.image,
      category: reason.category || '',
      subcategory: reason.subcategory || '',
      whyVedxConfigId: reason.whyVedxConfigId || null,
      createdAt: reason.createdAt,
      updatedAt: reason.updatedAt,
    })));
  } catch (err) {
    console.error('GET /api/hire-developer/why-vedx-reasons error', err);
    res.status(500).json({ error: 'Failed to fetch why VedX reasons' });
  }
});

// CREATE why vedx reason
app.post('/api/hire-developer/why-vedx-reasons', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description, image, category, subcategory, whyVedxConfigId } = req.body ?? {};
    const parsedConfigId = parseIntegerId(whyVedxConfigId);

    if (!parsedConfigId) {
      return res.status(400).json({ error: 'whyVedxConfigId is required; please create a config first' });
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!image || !String(image).trim()) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const config = await prisma.hireDeveloperWhyVedxConfig.findUnique({ where: { id: parsedConfigId } });
    if (!config) {
      return res.status(404).json({ error: 'Why VedX config not found' });
    }

    const created = await prisma.hireDeveloperWhyVedx.create({
      data: {
        title: String(title).trim(),
        description: description?.trim() || null,
        image: String(image).trim(),
        category: category?.trim() || null,
        subcategory: subcategory?.trim() || null,
        whyVedxConfigId: parsedConfigId,
      },
    });

    res.status(201).json({
      id: created.id,
      title: created.title,
      description: created.description,
      image: created.image,
      category: created.category || '',
      subcategory: created.subcategory || '',
      whyVedxConfigId: created.whyVedxConfigId || null,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  } catch (err) {
    console.error('POST /api/hire-developer/why-vedx-reasons error', err);
    res.status(500).json({ error: 'Failed to create why VedX reason' });
  }
});

// UPDATE why vedx reason
app.put('/api/hire-developer/why-vedx-reasons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const { title, description, image, category, subcategory, whyVedxConfigId } = req.body ?? {};
    const parsedConfigId = parseIntegerId(whyVedxConfigId);

    if (whyVedxConfigId !== undefined && !parsedConfigId) {
      return res.status(400).json({ error: 'Valid whyVedxConfigId is required' });
    }

    if (parsedConfigId) {
      const config = await prisma.hireDeveloperWhyVedxConfig.findUnique({ where: { id: parsedConfigId } });
      if (!config) {
        return res.status(404).json({ error: 'Why VedX config not found' });
      }
    }

    const updated = await prisma.hireDeveloperWhyVedx.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        description: description?.trim() || null,
        ...(image !== undefined && { image: String(image).trim() }),
        ...(category !== undefined && { category: category?.trim() || null }),
        ...(subcategory !== undefined && { subcategory: subcategory?.trim() || null }),
        ...(parsedConfigId && { whyVedxConfigId: parsedConfigId }),
      },
    });

    res.json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      image: updated.image,
      category: updated.category || '',
      subcategory: updated.subcategory || '',
      whyVedxConfigId: updated.whyVedxConfigId || null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    console.error('PUT /api/hire-developer/why-vedx-reasons/:id error', err);
    res.status(500).json({ error: 'Failed to update why VedX reason' });
  }
});

// DELETE why vedx reason
app.delete('/api/hire-developer/why-vedx-reasons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperWhyVedx.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/why-vedx-reasons/:id error', err);
    res.status(500).json({ error: 'Failed to delete why VedX reason' });
  }
});

/* ============================================================
 * 8. HireDeveloperWhyChoose (configs + highlights)
 * ============================================================
 */

const mapHireWhyChooseConfig = (config, includeServices = false) => ({
  id: config.id,
  category: config.category || '',
  subcategory: config.subcategory || '',
  heroTitle: config.heroTitle,
  heroDescription: config.heroDescription,
  heroImage: config.heroImage,
  tableTitle: config.tableTitle,
  tableDescription: config.tableDescription,
  ...(includeServices && {
    services: (config.services || []).map((item) => ({
      id: item.id,
      category: item.category,
      subcategory: item.subcategory || '',
      title: item.title,
      description: item.description,
      whyChooseConfigId: item.whyChooseConfigId || null,
    })),
  }),
  createdAt: config.createdAt,
  updatedAt: config.updatedAt,
});

// GET why choose configs
app.get('/api/hire-developer/why-choose', async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const configs = await prisma.hireDeveloperWhyChooseConfig.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(subcategory && { subcategory: String(subcategory) }),
      },
      include: { services: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(configs.map((config) => mapHireWhyChooseConfig(config, true)));
  } catch (err) {
    console.error('GET /api/hire-developer/why-choose error', err);
    res.status(500).json({ error: 'Failed to fetch why choose configs' });
  }
});

// CREATE or UPDATE why choose config
app.post('/api/hire-developer/why-choose', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const {
      id,
      category,
      subcategory,
      heroTitle,
      heroDescription,
      heroImage,
      tableTitle,
      tableDescription,
    } = req.body ?? {};
    const configId = id ? parseIntegerId(id) : null;

    if (!category || !heroTitle || !heroDescription || !heroImage || !tableTitle || !tableDescription) {
      return res.status(400).json({ error: 'Category, hero, and table fields are required' });
    }

    const payload = {
      category: String(category).trim(),
      subcategory: subcategory?.trim() || null,
      heroTitle: String(heroTitle).trim(),
      heroDescription: String(heroDescription).trim(),
      heroImage: String(heroImage).trim(),
      tableTitle: String(tableTitle).trim(),
      tableDescription: String(tableDescription).trim(),
    };

    const saved = configId
      ? await prisma.hireDeveloperWhyChooseConfig.update({ where: { id: configId }, data: payload, include: { services: true } })
      : await prisma.hireDeveloperWhyChooseConfig.create({ data: payload, include: { services: true } });

    res.json(mapHireWhyChooseConfig(saved, true));
  } catch (err) {
    console.error('POST /api/hire-developer/why-choose error', err);
    res.status(500).json({ error: 'Failed to save why choose config' });
  }
});

// GET why choose highlights
app.get('/api/hire-developer/why-choose-services', async (req, res) => {
  try {
    const { category, subcategory, whyChooseConfigId } = req.query;
    const parsedConfigId = parseIntegerId(whyChooseConfigId);

    const services = await prisma.hireDeveloperWhyChoose.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(subcategory && { subcategory: String(subcategory) }),
        ...(parsedConfigId && { whyChooseConfigId: parsedConfigId }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(
      services.map((item) => ({
        id: item.id,
        category: item.category,
        subcategory: item.subcategory || '',
        title: item.title,
        description: item.description,
        whyChooseConfigId: item.whyChooseConfigId || null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
    );
  } catch (err) {
    console.error('GET /api/hire-developer/why-choose-services error', err);
    res.status(500).json({ error: 'Failed to fetch why choose highlights' });
  }
});

// CREATE why choose highlight
app.post('/api/hire-developer/why-choose-services', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { category, subcategory, title, description, whyChooseConfigId } = req.body ?? {};
    const parsedConfigId = parseIntegerId(whyChooseConfigId);

    if (!parsedConfigId) {
      return res.status(400).json({ error: 'whyChooseConfigId is required; please create the config first' });
    }
    if (!category || !String(category).trim() || !title || !String(title).trim()) {
      return res.status(400).json({ error: 'Category and title are required' });
    }

    const config = await prisma.hireDeveloperWhyChooseConfig.findUnique({ where: { id: parsedConfigId } });
    if (!config) {
      return res.status(404).json({ error: 'Why Choose config not found' });
    }

    const created = await prisma.hireDeveloperWhyChoose.create({
      data: {
        category: String(category).trim(),
        subcategory: subcategory?.trim() || null,
        title: String(title).trim(),
        description: description?.trim() || null,
        whyChooseConfigId: parsedConfigId,
      },
    });

    res.status(201).json({
      id: created.id,
      category: created.category,
      subcategory: created.subcategory || '',
      title: created.title,
      description: created.description,
      whyChooseConfigId: created.whyChooseConfigId || null,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  } catch (err) {
    console.error('POST /api/hire-developer/why-choose-services error', err);
    res.status(500).json({ error: 'Failed to create why choose highlight' });
  }
});

// UPDATE why choose highlight
app.put('/api/hire-developer/why-choose-services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const { category, subcategory, title, description, whyChooseConfigId } = req.body ?? {};
    const parsedConfigId = parseIntegerId(whyChooseConfigId);

    if (whyChooseConfigId !== undefined && !parsedConfigId) {
      return res.status(400).json({ error: 'Valid whyChooseConfigId is required' });
    }

    if (parsedConfigId) {
      const config = await prisma.hireDeveloperWhyChooseConfig.findUnique({ where: { id: parsedConfigId } });
      if (!config) {
        return res.status(404).json({ error: 'Why Choose config not found' });
      }
    }

    const updated = await prisma.hireDeveloperWhyChoose.update({
      where: { id },
      data: {
        ...(category !== undefined && { category: String(category).trim() }),
        ...(subcategory !== undefined && { subcategory: subcategory?.trim() || null }),
        ...(title !== undefined && { title: String(title).trim() }),
        description: description?.trim() || null,
        ...(parsedConfigId && { whyChooseConfigId: parsedConfigId }),
      },
    });

    res.json({
      id: updated.id,
      category: updated.category,
      subcategory: updated.subcategory || '',
      title: updated.title,
      description: updated.description,
      whyChooseConfigId: updated.whyChooseConfigId || null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    console.error('PUT /api/hire-developer/why-choose-services/:id error', err);
    res.status(500).json({ error: 'Failed to update why choose highlight' });
  }
});

// DELETE why choose highlight
app.delete('/api/hire-developer/why-choose-services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperWhyChoose.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/why-choose-services/:id error', err);
    res.status(500).json({ error: 'Failed to delete why choose highlight' });
  }
});

/* ============================================================
 * 9. HireDeveloperIndustry
 * ============================================================
 */

// GET industries
app.get('/api/hire-developer/industries', async (_req, res) => {
  try {
    const industries = await prisma.hireDeveloperIndustry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(industries);
  } catch (err) {
    console.error('GET /api/hire-developer/industries error', err);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});

// CREATE industry
app.post('/api/hire-developer/industries', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const {
      title,
      description,
      image,
      sectionTitle,
      sectionDescription,
    } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!image || !String(image).trim()) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const industry = await prisma.hireDeveloperIndustry.create({
      data: {
        title: String(title).trim(),
        description: description?.trim() || null,
        image: String(image).trim(),
        sectionTitle: sectionTitle?.trim() || null,
        sectionDescription: sectionDescription?.trim() || null,
      },
    });

    res.status(201).json(industry);
  } catch (err) {
    console.error('POST /api/hire-developer/industries error', err);
    res.status(500).json({ error: 'Failed to create industry' });
  }
});

// UPDATE industry
app.put('/api/hire-developer/industries/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const {
      title,
      description,
      image,
      sectionTitle,
      sectionDescription,
    } = req.body;

    const updated = await prisma.hireDeveloperIndustry.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        description: description?.trim() || null,
        ...(image !== undefined && { image: String(image).trim() }),
        sectionTitle: sectionTitle?.trim() || null,
        sectionDescription: sectionDescription?.trim() || null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire-developer/industries/:id error', err);
    res.status(500).json({ error: 'Failed to update industry' });
  }
});

// DELETE industry
app.delete('/api/hire-developer/industries/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperIndustry.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/industries/:id error', err);
    res.status(500).json({ error: 'Failed to delete industry' });
  }
});

/* ============================================================
 * 10. HireDeveloperTechSolution
 * ============================================================
 */

// GET tech solutions
app.get('/api/hire-developer/tech-solutions', async (_req, res) => {
  try {
    const solutions = await prisma.hireDeveloperTechSolution.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(solutions);
  } catch (err) {
    console.error('GET /api/hire-developer/tech-solutions error', err);
    res.status(500).json({ error: 'Failed to fetch tech solutions' });
  }
});

// CREATE tech solution
app.post('/api/hire-developer/tech-solutions', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const { title, description, sectionTitle, sectionDescription } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const solution = await prisma.hireDeveloperTechSolution.create({
      data: {
        title: String(title).trim(),
        description: description?.trim() || null,
        sectionTitle: sectionTitle?.trim() || null,
        sectionDescription: sectionDescription?.trim() || null,
      },
    });

    res.status(201).json(solution);
  } catch (err) {
    console.error('POST /api/hire-developer/tech-solutions error', err);
    res.status(500).json({ error: 'Failed to create tech solution' });
  }
});

// UPDATE tech solution
app.put('/api/hire-developer/tech-solutions/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const { title, description, sectionTitle, sectionDescription } = req.body;

    const updated = await prisma.hireDeveloperTechSolution.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        description: description?.trim() || null,
        sectionTitle: sectionTitle?.trim() || null,
        sectionDescription: sectionDescription?.trim() || null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire-developer/tech-solutions/:id error', err);
    res.status(500).json({ error: 'Failed to update tech solution' });
  }
});

// DELETE tech solution
app.delete('/api/hire-developer/tech-solutions/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperTechSolution.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/tech-solutions/:id error', err);
    res.status(500).json({ error: 'Failed to delete tech solution' });
  }
});

/* ============================================================
 * 11. HireDeveloperExpertise
 * ============================================================
 */

// GET expertise items
app.get('/api/hire-developer/expertise', async (_req, res) => {
  try {
    const expertise = await prisma.hireDeveloperExpertise.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(expertise);
  } catch (err) {
    console.error('GET /api/hire-developer/expertise error', err);
    res.status(500).json({ error: 'Failed to fetch expertise items' });
  }
});

// CREATE expertise
app.post('/api/hire-developer/expertise', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const {
      title,
      description,
      image,
      sectionTitle,
      sectionDescription,
    } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!image || !String(image).trim()) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const expertise = await prisma.hireDeveloperExpertise.create({
      data: {
        title: String(title).trim(),
        description: description?.trim() || null,
        image: String(image).trim(),
        sectionTitle: sectionTitle?.trim() || null,
        sectionDescription: sectionDescription?.trim() || null,
      },
    });

    res.status(201).json(expertise);
  } catch (err) {
    console.error('POST /api/hire-developer/expertise error', err);
    res.status(500).json({ error: 'Failed to create expertise item' });
  }
});

// UPDATE expertise
app.put('/api/hire-developer/expertise/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const {
      title,
      description,
      image,
      sectionTitle,
      sectionDescription,
    } = req.body;

    const updated = await prisma.hireDeveloperExpertise.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        description: description?.trim() || null,
        ...(image !== undefined && { image: String(image).trim() }),
        sectionTitle: sectionTitle?.trim() || null,
        sectionDescription: sectionDescription?.trim() || null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire-developer/expertise/:id error', err);
    res.status(500).json({ error: 'Failed to update expertise item' });
  }
});

// DELETE expertise
app.delete('/api/hire-developer/expertise/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperExpertise.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/expertise/:id error', err);
    res.status(500).json({ error: 'Failed to delete expertise item' });
  }
});

/* ============================================================
 * 12. HireDeveloperOurService (Slider)
 * ============================================================
 */

// GET our services (slider)
app.get('/api/hire-developer/our-services', async (_req, res) => {
  try {
    const services = await prisma.hireDeveloperOurService.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(services);
  } catch (err) {
    console.error('GET /api/hire-developer/our-services error', err);
    res.status(500).json({ error: 'Failed to fetch our services' });
  }
});

// CREATE our service
app.post('/api/hire-developer/our-services', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const {
      title,
      image,
      sliderTitle,
      sliderDescription,
      sliderImage,
    } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!image || !String(image).trim()) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const service = await prisma.hireDeveloperOurService.create({
      data: {
        title: String(title).trim(),
        image: String(image).trim(),
        sliderTitle: sliderTitle?.trim() || null,
        sliderDescription: sliderDescription?.trim() || null,
        sliderImage: sliderImage?.trim() || null,
      },
    });

    res.status(201).json(service);
  } catch (err) {
    console.error('POST /api/hire-developer/our-services error', err);
    res.status(500).json({ error: 'Failed to create our service' });
  }
});

// UPDATE our service
app.put('/api/hire-developer/our-services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    const {
      title,
      image,
      sliderTitle,
      sliderDescription,
      sliderImage,
    } = req.body;

    const updated = await prisma.hireDeveloperOurService.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(image !== undefined && { image: String(image).trim() }),
        sliderTitle: sliderTitle?.trim() || null,
        sliderDescription: sliderDescription?.trim() || null,
        sliderImage: sliderImage?.trim() || null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/hire-developer/our-services/:id error', err);
    res.status(500).json({ error: 'Failed to update our service' });
  }
});

// DELETE our service
app.delete('/api/hire-developer/our-services/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = requireIdParam(req, res);
    if (!id) return;

    await prisma.hireDeveloperOurService.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hire-developer/our-services/:id error', err);
    res.status(500).json({ error: 'Failed to delete our service' });
  }
});



const mapHomeWhyVedxReasonToResponses = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description || '',
  image: item.image || null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const validateHomeWhyVedxReasonInputs = (body) => {
  const title = normalizeText(body?.title);
  const description = normalizeText(body?.description);
  const image = typeof body?.image === 'string' ? body.image : null;

  if (!title) return { error: 'title is required' };
  if (!description) return { error: 'description is required' };
  if (!image) return { error: 'image is required' };

  const imageError = validateImageUrl(image);
  if (imageError) return { error: imageError };

  return { title, description, image };
};


// Admin: GET all reasons
app.get('/api/homes/why-vedx-reasons', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const items = await prisma.homeWhyVedxReason.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ reasons: items.map(mapHomeWhyVedxReasonToResponses) });
  } catch (err) {
    console.error('GET /api/homes/why-vedx-reasons error', err);
    return res.status(500).json({ message: 'Unable to load reasons right now.' });
  }
});

// Admin: CREATE reason
app.post('/api/homes/why-vedx-reasons', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const validation = validateHomeWhyVedxReasonInputs(req.body || {});
    if (validation.error) return res.status(400).json({ error: validation.error });

    const created = await prisma.homeWhyVedxReason.create({
      data: {
        title: validation.title,
        description: validation.description,
        image: validation.image,

      },
    });

    return res.status(201).json({
      reason: mapHomeWhyVedxReasonToResponses(created),
      message: 'Reason created.',
    });
  } catch (err) {
    console.error('POST /api/homes/why-vedx-reasons error', err);
    return res.status(500).json({ error: 'Failed to create reason' });
  }
});

// Admin: UPDATE reason
app.put('/api/homes/why-vedx-reasons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) return res.status(400).json({ error: 'A valid id is required' });

    const existing = await prisma.homeWhyVedxReason.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Reason not found' });

    const title = typeof req.body?.title === 'string' ? normalizeText(req.body.title) : undefined;
    const description =
      typeof req.body?.description === 'string' ? normalizeText(req.body.description) : undefined;
    const image = typeof req.body?.image === 'string' ? req.body.image : undefined;

    if (title !== undefined && !title) return res.status(400).json({ error: 'title is required' });
    if (description !== undefined && !description)
      return res.status(400).json({ error: 'description is required' });

    if (image !== undefined) {
      if (!image) return res.status(400).json({ error: 'image is required' });
      const imageError = validateImageUrl(image);
      if (imageError) return res.status(400).json({ error: imageError });
    }

    const data = {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(image !== undefined ? { image } : {}),
    };


    const updated = await prisma.homeWhyVedxReason.update({
      where: { id },
      data,
    });

    return res.json({
      reason: mapHomeWhyVedxReasonToResponses(updated),
      message: 'Reason updated.',
    });
  } catch (err) {
    console.error('PUT /api/homes/why-vedx-reasons/:id error', err);
    return res.status(500).json({ error: 'Failed to update reason' });
  }
});

// Admin: DELETE reason
app.delete('/api/homes/why-vedx-reasons/:id', async (req, res) => {
  try {
    const { admin, status, message } = await getAuthenticatedAdmin(req);
    if (!admin) return res.status(status).json({ message });

    const id = parseIntegerId(req.params.id);
    if (!id) return res.status(400).json({ error: 'A valid id is required' });

    const existing = await prisma.homeWhyVedxReason.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Reason not found' });

    await prisma.homeWhyVedxReason.delete({ where: { id } });

    return res.json({ success: true, message: 'Reason deleted.' });
  } catch (err) {
    console.error('DELETE /api/homes/why-vedx-reasons/:id error', err);
    return res.status(500).json({ error: 'Failed to delete reason' });
  }
});




/* -----------------------------------
 * ROOT + GRACEFUL SHUTDOWN
 * ----------------------------------- */

app.get('/', (_req, res) =>
  res.json({ status: 'ok', message: 'VEDX Solutions marketing API' })
);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`✅ API server listening on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
