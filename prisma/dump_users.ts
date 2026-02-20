import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users in DB:');
  users.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}`));
}

main().finally(() => prisma.$disconnect());
