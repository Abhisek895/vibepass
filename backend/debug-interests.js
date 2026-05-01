const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const users = await prisma.user.findMany({
      select: { interests: true },
      take: 5
    });
    console.log('User Interests:', users);
    
    const count = await prisma.user.count();
    console.log('Total Users:', count);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
