import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Marketplace APIs as Products...');

  const marketplaceApis = [
    { id: 'omni-otp', name: 'Omnichannel OTP Verify', description: 'One-time password verification across multiple channels.' },
    { id: 'voice-concierge', name: 'AI Voice Concierge', description: 'Intelligent AI-powered voice assistant for your business.' },
    { id: 'video-kyc', name: 'Video KYC', description: 'Remote identity verification through high-quality video sessions.' },
    { id: 'device-loc', name: 'Device Location', description: 'Real-time geographic location retrieval for connected devices.' }
  ];

  for (const api of marketplaceApis) {
    await prisma.product.upsert({
      where: { id: api.id },
      update: {
        name: api.name,
        description: api.description
      },
      create: {
        id: api.id,
        name: api.name,
        description: api.description,
        sku: api.id.toUpperCase(),
        category: 'Marketplace API',
        icon: 'Package',
        status: 'active',
        features: '[]'
      }
    });
    console.log(`✅ Seeded product: ${api.name}`);
  }

  // Also seed some offers for the subagent to see
  console.log('🌱 Seeding sample offers...');
  
  const demoUserId = 'demo@example.com'; 
  const adminUserId = 'admin@cpaas.com';

  const users = [demoUserId, adminUserId];

  for (const userId of users) {
      await prisma.userOffer.upsert({
          where: { id: `offer-welcome-${userId}` },
          update: {},
          create: {
              id: `offer-welcome-${userId}`,
              user_id: userId,
              offer_name: 'Welcome Discount',
              description: 'Get 20% off your first Marketplace API subscription.',
              discount_percentage: 20,
              status: 'active',
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
      });
  }
  
  console.log('🏁 Seeding complete.');
}

main().finally(() => prisma.$disconnect());
