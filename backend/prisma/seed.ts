// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. CREATE CATEGORIES (only id and name as per your schema)
  console.log('📂 Creating categories...');
  
  const categories = [
    { id: '1', name: 'Products' },
    { id: '2', name: 'Services' },
    { id: '3', name: 'Jobs' },
    { id: '4', name: 'Real Estate' },
    { id: '5', name: 'Vehicles' },
    { id: '6', name: 'Electronics' },
    { id: '7', name: 'Furniture' },
    { id: '8', name: 'Clothing' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
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