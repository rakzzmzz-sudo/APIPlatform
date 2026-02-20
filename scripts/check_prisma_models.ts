import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
console.log('Available Prisma Models:');
Object.keys(prisma).forEach(key => {
  if (!key.startsWith('_') && !key.startsWith('$')) {
    console.log(`- ${key}`);
  }
});

// Try to find where @prisma/client is coming from
try {
    // In ESM, we can't use require.resolve directly for modules without a main field or with exports
    // But we can try to find the node_modules path
    console.log('\nImport info:');
    // For ESM, we can use import.meta.resolve but it's experimental.
    // Let's just try to find the directory.
} catch (e) {}

process.exit(0);
