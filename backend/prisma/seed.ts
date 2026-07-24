// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. CREATE CATEGORIES (E-commerce categories)
  console.log('📂 Creating categories...');
  
  const categories = [
    { id: 'cat-electronics', name: 'Electronics' },
    { id: 'cat-fashion', name: 'Fashion' },
    { id: 'cat-home-living', name: 'Home & Living' },
    { id: 'cat-beauty-health', name: 'Beauty & Health' },
    { id: 'cat-sports-outdoors', name: 'Sports & Outdoors' },
    { id: 'cat-books-media', name: 'Books & Media' },
    { id: 'cat-toys-games', name: 'Toys & Games' },
    { id: 'cat-automotive', name: 'Automotive' },
    { id: 'cat-groceries', name: 'Groceries & Food' },
    { id: 'cat-phones-tablets', name: 'Phones & Tablets' },
    { id: 'cat-computers', name: 'Computers & Accessories' },
    { id: 'cat-appliances', name: 'Home Appliances' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: category,
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // 2. CREATE TEST USERS
  console.log('👤 Creating test users...');

  // Regular User
  await prisma.user.upsert({
    where: { email: 'john@gmail.com' },
    update: {
      password: await bcrypt.hash('123456', 10),
      isAdmin: false,
      status: 'approved',
    },
    create: {
      name: 'John Seller',
      email: 'john@gmail.com',
      password: await bcrypt.hash('123456', 10),
      phone: '0788123456',
      isAdmin: false,
      status: 'approved',
    }
  });

  // Admin User
  await prisma.user.upsert({
    where: { email: 'admin@herenet.com' },
    update: {
      password: await bcrypt.hash('admin123', 10),
      isAdmin: true,
      status: 'approved',
    },
    create: {
      name: 'Admin HereNet',
      email: 'admin@herenet.com',
      password: await bcrypt.hash('admin123', 10),
      phone: '0788123457',
      isAdmin: true,
      status: 'approved',
    }
  });
  console.log('✅ Created test users');

  console.log('\n🎉 Seed completed successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test Credentials:');
  console.log('→ User:  john@gmail.com / 123456  →  /dashboard');
  console.log('→ Admin: admin@herenet.com / admin123  →  /admin/dashboard');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });