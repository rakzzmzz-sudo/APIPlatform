
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_VIDEO_PRODUCTS = [
  {
    product_name: 'Standard Video API',
    product_type: 'conferencing',
    industry: 'all',
    description: 'Perfect for small teams and simple video integrations.',
    features: JSON.stringify(['720p HD Video', 'Up to 10 participants', 'Chat support', 'Web SDK access']),
    monthly_price: 99.00,
    per_minute_price: 0.05,
    setup_fee: 0,
    max_participants: 10,
    storage_gb: 10,
    api_calls_limit: 10000,
    has_sdk: true,
    has_api: true
  },
  {
    product_name: 'Enterprise Video Suite',
    product_type: 'conferencing',
    industry: 'corporate',
    description: 'High-scale video solutions for large organizations.',
    features: JSON.stringify(['4K Ultra HD', 'Up to 1000 participants', 'White labeling', 'Advanced Analytics']),
    monthly_price: 499.00,
    per_minute_price: 0.02,
    setup_fee: 1000.00,
    max_participants: 1000,
    storage_gb: 500,
    api_calls_limit: 500000,
    has_sdk: true,
    has_api: true
  },
  {
    product_name: 'Telehealth Secure API',
    product_type: 'conferencing',
    industry: 'healthcare',
    description: 'HIPAA compliant video communication for healthcare providers.',
    features: JSON.stringify(['End-to-end Encryption', 'Waiting Room', 'BHR available', 'DICOM support']),
    monthly_price: 299.00,
    per_minute_price: 0.08,
    setup_fee: 250.00,
    max_participants: 4,
    storage_gb: 100,
    api_calls_limit: 50000,
    has_sdk: true,
    has_api: true
  }
];

const SAMPLE_TEMPLATES = [
  {
    template_name: 'Healthcare Consult',
    industry: 'healthcare',
    template_type: 'conferencing',
    description: 'Secure one-on-one medical consultation room.',
    features: JSON.stringify(['Encrypted', 'Waiting Room', 'File Sharing']),
    configuration: JSON.stringify({ participant_limit: 2, duration: 30, recording: true }),
    is_premium: true
  },
  {
    template_name: 'Virtual Classroom',
    industry: 'education',
    template_type: 'conferencing',
    description: 'Teacher-led classroom with controls for students.',
    features: JSON.stringify(['Polls', 'Raise Hand', 'Breakout Rooms']),
    configuration: JSON.stringify({ participant_limit: 50, duration: 60, recording: true }),
    is_premium: false
  }
];

const SAMPLE_CAPABILITIES = [
  // Core Features
  { capability_name: 'HD Video', description: 'Crystal clear high-definition video up to 4K resolution.', icon: 'Video', is_available: true, display_order: 1, category: 'Core' },
  { capability_name: 'Spatial Audio', description: 'Immersive 3D audio for realistic conversation feel.', icon: 'Mic', is_available: true, display_order: 2, category: 'Core' },
  { capability_name: 'Screen Share', description: 'Ultra-low latency screen sharing for collaborative work.', icon: 'Monitor', is_available: true, display_order: 3, category: 'Core' },
  
  // Advanced Features
  { capability_name: 'Cloud Recording', description: 'Safe and encrypted recording of all your video sessions.', icon: 'Camera', is_available: true, display_order: 10, category: 'Advanced' },
  { capability_name: 'Custom Branding', description: 'White-label the interface to match your corporate identity.', icon: 'Layout', is_available: true, display_order: 11, category: 'Advanced' },
  { capability_name: 'RTMP Streaming', description: 'Broadcast sessions to YouTube, Twitch, or custom RTMP targets.', icon: 'Radio', is_available: true, display_order: 12, category: 'Advanced' },
  
  // AI Features
  { capability_name: 'AI Transcription', description: 'Real-time multi-language transcription and closed captioning.', icon: 'Languages', is_available: true, display_order: 20, category: 'AI' },
  { capability_name: 'Smart Noise Cancellation', description: 'Suppress background noise and isolate human voice intelligently.', icon: 'Shield', is_available: true, display_order: 21, category: 'AI' },
  { capability_name: 'AI Meetings Summary', description: 'Generate structured summaries and action items automatically.', icon: 'Brain', is_available: true, display_order: 22, category: 'AI' },
  
  // Infrastructure
  { capability_name: 'Auto-Scaling SFU', description: 'Highly scalable Selective Forwarding Unit for 1000+ participants.', icon: 'Zap', is_available: true, display_order: 30, category: 'Infrastructure' },
  { capability_name: 'Global Mesh Network', description: 'Lowest possible latency with our worldwide edge network.', icon: 'Globe', is_available: true, display_order: 31, category: 'Infrastructure' }
];

async function main() {
  console.log('Seeding Video API data...');
  
  // Clear existing data to avoid duplicates
  await (prisma as any).videoApiProduct.deleteMany({});
  await (prisma as any).videoTemplate.deleteMany({});
  await (prisma as any).videoApiCapability.deleteMany({});
  await (prisma as any).videoApiPurchase.deleteMany({});
  console.log('Cleared existing Video API data.');

  // Seed Products
  const createdProducts = [];
  for (const product of SAMPLE_VIDEO_PRODUCTS) {
    const p = await (prisma as any).videoApiProduct.create({ data: product });
    createdProducts.push(p);
  }
  console.log('Seeded products.');
  
  // Seed Templates
  for (const template of SAMPLE_TEMPLATES) {
    await (prisma as any).videoTemplate.create({ data: template });
  }
  console.log('Seeded templates.');
  
  // Seed Capabilities
  for (const cap of SAMPLE_CAPABILITIES) {
    await (prisma as any).videoApiCapability.create({ data: cap });
  }
  console.log('Seeded capabilities.');

  const adminUserId = 'admin_user_id';
  
  if (createdProducts.length > 0) {
    await (prisma as any).videoApiPurchase.create({
      data: {
        user_id: adminUserId,
        product_id: createdProducts[0].id,
        api_key: `vapi_${Math.random().toString(36).substr(2, 9)}`,
        sdk_access_token: `vsdk_${Math.random().toString(36).substr(2, 9)}`,
        status: 'active',
        usage_minutes: 1250,
        storage_used_gb: 4.5,
        api_calls_used: 850
      }
    });
    console.log('Seeded initial purchase for admin user.');
  }

  console.log('Video API seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
