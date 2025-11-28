import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const hashPassword = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Sample navigation items
const navigationItems = [
  { label: 'Home', path: '/', slug: 'home', order: 1 },
  { label: 'Services', path: '/services', slug: 'services', order: 2 },
  { label: 'Hire developers', path: '/hire-developers', slug: 'hire-developers', order: 3 },
  { label: 'Blogs', path: '/blogs', slug: 'blogs', order: 4 },
  { label: 'Careers', path: '/careers', slug: 'careers', order: 5 },
  { label: 'Contact', path: '/contact', slug: 'contact', order: 6 },
];

async function seedNavigation() {
  const savedItems = [];
  for (const item of navigationItems) {
    const saved = await prisma.navigationItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
    savedItems.push(saved);
  }
  return savedItems;
}

// SEO pages
const seoPages = [
  {
    pageKey: 'home',
    navigationSlug: 'home',
    metaTitle: 'VedX Solutions | Product Engineering & Growth Pods',
    metaDescription:
      'VedX Solutions delivers cloud-native engineering, growth, and AI-driven automation through cross-functional pods.',
    keywords: 'VedX, product engineering, growth marketing, AI automation',
    ogImage: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=60',
    canonicalUrl: 'https://vedx.com/',
  },
  {
    pageKey: 'services',
    navigationSlug: 'services',
    metaTitle: 'Services | Cloud Native, Data, and AI by VedX Solutions',
    metaDescription: 'Explore VedX services across cloud-native platforms, composable commerce, data, and applied AI pods.',
    keywords: 'cloud native, data platform, applied AI, composable commerce',
    ogImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60',
    canonicalUrl: 'https://vedx.com/services',
  },
  // ... other SEO pages
];

async function seedSeo() {
  for (const page of seoPages) {
    const navigation = await prisma.navigationItem.findUnique({ where: { slug: page.navigationSlug } });

    await prisma.pageSeo.upsert({
      where: { pageKey: page.pageKey },
      update: {
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        keywords: page.keywords,
        ogImage: page.ogImage,
        canonicalUrl: page.canonicalUrl,
        navigationId: navigation?.id ?? null,
      },
      create: {
        pageKey: page.pageKey,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        keywords: page.keywords,
        ogImage: page.ogImage,
        canonicalUrl: page.canonicalUrl,
        navigationId: navigation?.id ?? null,
      },
    });
  }
}

// Example: Services
const serviceCategories = [
  {
    name: 'Engineering services',
    slug: 'engineering-services',
    description: 'Full-stack product delivery teams for modern applications.',
    services: [
      {
        title: 'Cloud native platforms',
        slug: 'cloud-native-platforms',
        summary: 'Microservices, observability, and SRE practices baked in.',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=60',
        tags: ['cloud', 'sre'],
      },
      {
        title: 'Composable commerce',
        slug: 'composable-commerce',
        summary: 'API-first commerce stacks that scale with catalog complexity.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=60',
        tags: ['ecommerce', 'headless'],
      },
    ],
  },
];

async function seedServices() {
  for (const category of serviceCategories) {
    const savedCategory = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: { name: category.name, slug: category.slug, description: category.description },
    });

    for (const service of category.services) {
      await prisma.service.upsert({
        where: { slug: service.slug },
        update: { ...service, categoryId: savedCategory.id },
        create: { ...service, categoryId: savedCategory.id },
      });
    }
  }
}

async function seedAdmin() {
  const email = 'khushalishah2611@gmail.com';
  const password = 'Admin@123';

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'VEDX Super Admin',
      passwordHash: hashPassword(password),
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('Admin seeded successfully');
}


async function main() {
  await seedAdmin();
  await seedNavigation();
  await seedSeo();
  await seedServices();
}

main()
  .then(async () => {
    console.log('Seed finished');
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('Seed failed', err);
    await prisma.$disconnect();
    process.exit(1);
  });
