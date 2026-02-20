import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const keys = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'));
console.log('Available Prisma Models:');
console.log(JSON.stringify(keys, null, 2));
process.exit(0);
