import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userEmail = 'admin@cpaas.com';
  const productId = 'omni-otp';
  
  console.log('Attempting manual UserSubscription insert...');
  
  try {
    const sub = await prisma.userSubscription.create({
      data: {
        user_id: userEmail,
        product_id: productId,
        product_name: 'Omnichannel OTP Verify',
        status: 'active',
        billing_cycle: 'monthly',
        amount: 0.15,
        currency: 'MYR',
        started_at: new Date(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        auto_renew: true,
        usage_count: 0,
        usage_limit: 10000,
        license_key: 'TEST-KEY',
        license_type: 'premium',
        features: '{}',
        metadata: '{}'
      }
    });
    console.log('✅ Success!', sub);
  } catch (err: any) {
    console.error('❌ Failed!', err.message);
  }
}

main().finally(() => prisma.$disconnect());
