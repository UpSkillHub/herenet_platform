import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    // Count users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);
    
    // List all users
    const users = await prisma.user.findMany();
    console.log('Users:', users);
    
    // Create a test user if none exist
    if (userCount === 0) {
      console.log('No users found, creating test user...');
      const testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'test123',
          role: 'USER',
          status: 'PENDING'
        }
      });
      console.log('✅ Test user created:', testUser);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();