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
