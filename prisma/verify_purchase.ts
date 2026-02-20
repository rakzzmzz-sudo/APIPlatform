import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userEmail = 'admin@cpaas.com'; // Likely user
  
  const subs = await prisma.userSubscription.findMany({ where: { user_id: userEmail } });
  const keys = await prisma.apiMarketplaceKey.findMany({ where: { user_id: userEmail } });
  const trans = await prisma.transaction.findMany({ where: { user_id: userEmail } });
  const orders = await prisma.order.findMany({ where: { user_id: userEmail } });

  console.log(`Summary for ${userEmail}:`);
  console.log(`- Subscriptions: ${subs.length}`);
  console.log(`- Marketplace Keys: ${keys.length}`);
  console.log(`- Transactions: ${trans.length}`);
  console.log(`- Orders: ${orders.length}`);

  if (subs.length > 0) {
      console.log('Last Subscription:', JSON.stringify(subs[subs.length-1], null, 2));
  }
}

main().finally(() => prisma.$disconnect());
