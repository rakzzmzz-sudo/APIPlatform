import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: any };

// Force reset if the client is stale (doesn't have the new models)
if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma) {
  const requiredModels = [
    'videoApiProduct',
    'meeting',
    'meetingParticipant',
    'meetingTranscript',
    'meetingActionItem',
    'meetingSummary',
    'meetingAnalytics',
    'meetingAIInsight',
    'emailCampaign',
    'emailTemplate',
    'emailContactList',
    'emailContact',
    'emailContactListMember',
    'emailAutomationSequence',
    'emailProviderConfig',
    'emailCampaignAnalytics',
    'emailSendingQuota',
    'emailCampaignRecipient',
    'product',
    'productTier',
    'paymentMethod',
    'transaction',
    'apiMarketplaceKey',
    'order',
    'userSubscription',
    'userOffer'
  ];
  
  const currentModels = Object.keys(globalForPrisma.prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  const isStale = requiredModels.some(model => !globalForPrisma.prisma[model]);
  
  if (isStale) {
    const missing = requiredModels.filter(m => !globalForPrisma.prisma[m]);
    // Log to a file we can read
    try {
      const fs = require('fs');
      fs.appendFileSync('prisma_debug.log', `${new Date().toISOString()} - Stale! Missing: ${missing.join(', ')}. Available: ${currentModels.length} models.\n`);
    } catch (e) {}
    
    // Nuke it
    if (globalForPrisma.prisma.$disconnect) {
      globalForPrisma.prisma.$disconnect();
    }
    globalForPrisma.prisma = undefined;
  } else {
    try {
      const fs = require('fs');
      fs.appendFileSync('prisma_debug.log', `${new Date().toISOString()} - Prisma OK. Available: ${currentModels.length} models.\n`);
    } catch (e) {}
  }
}

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
// Last schema update: 2026-02-17 (Added Meeting AI and Video API tables)
