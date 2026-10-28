const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const count = await prisma.user.count();
    const users = await prisma.user.findMany({ include: { profile: true } });
    console.log('User Count:', count, users);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
