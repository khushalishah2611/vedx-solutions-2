import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hashPassword = (value) => crypto.createHash('sha256').update(value).digest('hex');

const navigationItems = [
  { label: 'Home', path: '/', slug: 'home', order: 1 },
  { label: 'Services', path: '/services', slug: 'services', order: 2 },
  { label: 'Hire developers', path: '/hire-developers', slug: 'hire-developers', order: 3 },
  { label: 'Blogs', path: '/blogs', slug: 'blogs', order: 4 },
  { label: 'Careers', path: '/careers', slug: 'careers', order: 5 },
  { label: 'Contact', path: '/contact', slug: 'contact', order: 6 },
];

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
  {
    pageKey: 'hire-developers',
    navigationSlug: 'hire-developers',
    metaTitle: 'Hire Developers | Dedicated VedX Pods for Web & Mobile',
    metaDescription: 'Spin up VedX pods for mobile, web, and full-stack delivery with baked-in observability and quality.',
    keywords: 'hire developers, dedicated team, web developers, mobile developers',
    ogImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60',
    canonicalUrl: 'https://vedx.com/hire-developers',
  },
  {
    pageKey: 'blogs',
    navigationSlug: 'blogs',
    metaTitle: 'Insights & Blogs | VedX Solutions',
    metaDescription: 'Read VedX perspectives on resilient teams, AI products, and go-to-market playbooks.',
    keywords: 'VedX blogs, product delivery, AI teams, growth playbooks',
    ogImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=60',
    canonicalUrl: 'https://vedx.com/blogs',
  },
  {
    pageKey: 'careers',
    navigationSlug: 'careers',
    metaTitle: 'Careers at VedX Solutions | Build Products that Ship',
    metaDescription: 'Join VedX to design, build, and grow cloud-native and AI-driven products with global teams.',
    keywords: 'VedX careers, product design jobs, engineering jobs, remote teams',
    ogImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60',
    canonicalUrl: 'https://vedx.com/careers',
  },
  {
    pageKey: 'contact',
    navigationSlug: 'contact',
    metaTitle: 'Contact VedX Solutions | Start Your Next Product',
    metaDescription: 'Talk to VedX about launching a product pod, scaling delivery, or accelerating growth.',
    keywords: 'contact VedX, start project, growth consultation',
    ogImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=60',
    canonicalUrl: 'https://vedx.com/contact',
  },
];

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
  {
    name: 'Data and AI',
    slug: 'data-and-ai',
    description: 'Analytics, ML, and automation pipelines built for reliability.',
    services: [
      {
        title: 'Applied AI pods',
        slug: 'applied-ai-pods',
        summary: 'Cross-functional pods that deliver ML-backed product features.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=60',
        tags: ['ml', 'automation'],
      },
      {
        title: 'Data platform modernization',
        slug: 'data-platform-modernization',
        summary: 'Ingestion, governance, and lakehouse patterns tuned for scale.',
        imageUrl: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=60',
        tags: ['data-engineering', 'governance'],
      },
    ],
  },
];

const blogPosts = [
  {
    title: 'Building resilient delivery teams',
    slug: 'building-resilient-delivery-teams',
    summary: 'A playbook for pods that maintain velocity through change.',
    content:
      'Explore rituals, tooling, and metrics that keep delivery teams aligned even when requirements shift.',
    author: 'VedX Editorial',
    coverImage: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=60',
    status: 'PUBLISHED',
  },
  {
    title: 'From discovery to launch in four sprints',
    slug: 'discovery-to-launch-in-four-sprints',
    summary: 'A sprint-by-sprint breakdown of VedX launch engagements.',
    content:
      'See how we structure discovery, validation, build, and release phases to minimise risk while delivering outcomes.',
    author: 'VedX Delivery Office',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=60',
    status: 'REVIEW',
  },
];

const careerOpenings = [
  {
    title: 'Senior Product Designer',
    slug: 'senior-product-designer',
    location: 'Remote - India',
    department: 'Design',
    employmentType: 'FULL_TIME',
    description:
      'Partner with cross-functional squads to ship delightful experiences across web and mobile touchpoints.',
    requirements: ['5+ years of product design', 'Strong Figma and prototyping skills', 'Experience with design systems'],
  },
  {
    title: 'Lead Backend Engineer',
    slug: 'lead-backend-engineer',
    location: 'Bangalore',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    description:
      'Own distributed system design, coach engineers, and collaborate closely with product managers.',
    requirements: ['8+ years of backend experience', 'Node.js/Go or similar', 'Cloud-native architecture expertise'],
  },
];

const hireCatalog = [
  {
    name: 'Mobile app developers',
    slug: 'mobile-app-developers',
    description: 'Pods that specialise in native and cross-platform builds.',
    roles: [
      { title: 'Android developer', slug: 'android-developer', description: 'Native Android with Kotlin and modern tooling.' },
      { title: 'iOS developer', slug: 'ios-developer', description: 'Swift and SwiftUI specialists.' },
      { title: 'React Native developer', slug: 'react-native-developer', description: 'Cross-platform delivery with RN and Expo.' },
    ],
  },
  {
    name: 'Web app developers',
    slug: 'web-app-developers',
    description: 'Frontend and backend engineers for high-performing web apps.',
    roles: [
      { title: 'Full stack engineer', slug: 'full-stack-engineer', description: 'End-to-end delivery across frontend and backend.' },
      { title: 'Frontend specialist', slug: 'frontend-specialist', description: 'Modern UI stacks with accessibility baked in.' },
      { title: 'Backend specialist', slug: 'backend-specialist', description: 'API-first services with observability and security.' },
    ],
  },
];

const feedbacks = [
  {
    client: 'Priya Shah',
    role: 'VP of Marketing, Aethon Labs',
    quote: 'VEDX tripled our inbound opportunities within three months and gave us reporting our board loves.',
    highlight: '3x inbound pipeline growth',
    rating: 5,
  },
  {
    client: 'Chris Douglas',
    role: 'Head of Growth, Stratus AI',
    quote: 'The blend of strategy, creative, and data science is unmatched. They feel like an extension of our team.',
    highlight: 'Embedded growth pod',
    rating: 5,
  },
];

async function seedNavigation() {
  await prisma.navigationItem.createMany({ data: navigationItems, skipDuplicates: true });
}

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
        noIndex: page.noIndex ?? false,
        navigationId: navigation?.id ?? null,
      },
      create: {
        pageKey: page.pageKey,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        keywords: page.keywords,
        ogImage: page.ogImage,
        canonicalUrl: page.canonicalUrl,
        noIndex: page.noIndex ?? false,
        navigationId: navigation?.id ?? null,
      },
    });
  }
}

async function seedServices() {
  for (const category of serviceCategories) {
    const savedCategory = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: { description: category.description, name: category.name },
      create: { name: category.name, slug: category.slug, description: category.description },
    });

    for (const service of category.services) {
      await prisma.service.upsert({
        where: { slug: service.slug },
        update: {
          title: service.title,
          summary: service.summary,
          imageUrl: service.imageUrl,
          tags: service.tags,
          categoryId: savedCategory.id,
        },
        create: {
          title: service.title,
          slug: service.slug,
          summary: service.summary,
          imageUrl: service.imageUrl,
          tags: service.tags,
          categoryId: savedCategory.id,
        },
      });
    }
  }
}

async function seedBlogs() {
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        summary: post.summary,
        content: post.content,
        coverImage: post.coverImage,
        author: post.author,
        status: post.status,
        publishedAt: post.status === 'PUBLISHED' ? new Date() : null,
      },
      create: {
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        coverImage: post.coverImage,
        author: post.author,
        status: post.status,
        publishedAt: post.status === 'PUBLISHED' ? new Date() : null,
      },
    });
  }
}

async function seedCareers() {
  for (const opening of careerOpenings) {
    await prisma.careerOpening.upsert({
      where: { slug: opening.slug },
      update: {
        title: opening.title,
        department: opening.department,
        location: opening.location,
        employmentType: opening.employmentType,
        description: opening.description,
        requirements: opening.requirements,
        isOpen: true,
      },
      create: {
        title: opening.title,
        slug: opening.slug,
        department: opening.department,
        location: opening.location,
        employmentType: opening.employmentType,
        description: opening.description,
        requirements: opening.requirements,
      },
    });
  }
}

async function seedHireCatalog() {
  for (const category of hireCatalog) {
    const savedCategory = await prisma.hireCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: { name: category.name, slug: category.slug, description: category.description },
    });

    for (const role of category.roles) {
      await prisma.hireRole.upsert({
        where: { slug: role.slug },
        update: { title: role.title, description: role.description, hireCategoryId: savedCategory.id },
        create: { title: role.title, slug: role.slug, description: role.description, hireCategoryId: savedCategory.id },
      });
    }
  }
}

async function seedFeedbacks() {
  await prisma.clientFeedback.createMany({ data: feedbacks, skipDuplicates: true });
}

async function seedAdmin() {
  await prisma.adminUser.upsert({
    where: { email: 'admin@vedx.com' },
    update: {},
    create: {
      email: 'admin@vedx.com',
      name: 'VEDX Super Admin',
      passwordHash: hashPassword('Admin@123'),
      role: 'SUPER_ADMIN',
    },
  });
}

async function main() {
  await seedAdmin();
  await seedNavigation();
  await seedSeo();
  await seedServices();
  await seedBlogs();
  await seedCareers();
  await seedHireCatalog();
  await seedFeedbacks();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
