
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { tiers: true }
  });

  console.log(`Verified ${products.length} products in database:`);
  products.forEach(p => {
    console.log(`- ${p.name} (${p.category}): ${p.tiers.length} tiers`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
