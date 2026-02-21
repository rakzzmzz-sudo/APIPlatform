import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding dashboard data...');

  // Clean up existing dashboard data
  await prisma.notification.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.platform.deleteMany();

  // 1. Create Platforms
  console.log('Creating platforms...');
  
  const pWhatsApp = await prisma.platform.create({
    data: {
      platform_name: 'whatsapp_business',
      platform_type: 'messaging',
      name: 'WhatsApp',
      icon: 'MessageSquare',
      color: 'bg-green-500',
      is_active: true,
      total_messages: 2500000,
      total_campaigns: 12,
      success_rate: 99.8,
    }
  });

  const pSms = await prisma.platform.create({
    data: {
      platform_name: 'sms_global',
      platform_type: 'messaging',
      name: 'SMS',
      icon: 'MessageSquare',
      color: 'bg-[#39FF14]/20',
      is_active: true,
      total_messages: 1200000,
      total_campaigns: 8,
      success_rate: 98.5,
    }
  });

  const pRcs = await prisma.platform.create({
    data: {
      platform_name: 'rcs_business',
      platform_type: 'messaging',
      name: 'RCS',
      icon: 'MessageSquare',
      color: 'bg-[#39FF14]',
      is_active: true,
      total_messages: 850000,
      total_campaigns: 5,
      success_rate: 99.2,
    }
  });

  const pVoice = await prisma.platform.create({
    data: {
      platform_name: 'voice_api',
      platform_type: 'voice',
      name: 'Voice API',
      icon: 'Phone',
      color: 'bg-[#39FF14]',
      is_active: true,
      total_messages: 450000,
      total_campaigns: 24,
      success_rate: 99.9,
    }
  });

  const pEmail = await prisma.platform.create({
    data: {
      platform_name: 'email_marketing',
      platform_type: 'email',
      name: 'Email',
      icon: 'Mail',
      color: 'bg-[#39FF14]/60',
      is_active: true,
      total_messages: 4500000,
      total_campaigns: 5,
      success_rate: 99.4,
    }
  });

  // 2. Create Campaigns
  console.log('Creating campaigns...');
  
  const platforms = [pWhatsApp, pSms, pRcs, pVoice, pEmail];
  
  for (const p of platforms) {
      // Create a running campaign for each platform
      await prisma.campaign.create({
          data: {
              campaign_name: `${p.name} - Summer Promo`,
              campaign_type: 'Marketing',
              status: 'running',
              platform_id: p.id,
              messages_sent: Math.floor(Math.random() * 50000) + 10000,
              messages_delivered: Math.floor(Math.random() * 45000) + 9000,
              messages_failed: Math.floor(Math.random() * 500),
              success_rate: p.success_rate - (Math.random() * 2), // slightly lower than platform avg
          }
      });
      // Create a completed campaign
      await prisma.campaign.create({
          data: {
              campaign_name: `${p.name} - Q1 Newsletter`,
              campaign_type: 'Newsletter',
              status: 'completed',
              platform_id: p.id,
              messages_sent: Math.floor(Math.random() * 200000) + 50000,
              messages_delivered: Math.floor(Math.random() * 190000) + 48000,
              messages_failed: Math.floor(Math.random() * 1000),
              success_rate: p.success_rate,
              completed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          }
      });
  }

  // 3. Create Notifications
  console.log('Creating notifications...');
  
  await prisma.notification.create({
    data: {
      message: 'WhatsApp Business API node 3 synced successfully.',
      type: 'system',
      read: false,
    }
  });
  
  await prisma.notification.create({
    data: {
      message: 'RCS Campaign "Flash Sale" completed with 99.2% delivery rate.',
      type: 'campaign',
      read: false,
    }
  });
  
  await prisma.notification.create({
    data: {
      message: 'New carrier integration (Vodafone) is now active.',
      type: 'integration',
      read: false,
    }
  });

  console.log('✅ Dashboard seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
