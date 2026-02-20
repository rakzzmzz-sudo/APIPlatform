import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding payment methods for predefined users...');

  const predefinedUsers = [
    { email: 'admin@cpaas.com', name: 'Admin User' },
    { email: 'presales@cpaas.com', name: 'Presales User' },
    { email: 'sales@cpaas.com', name: 'Sales User' },
    { email: 'demo@example.com', name: 'Demo User' }
  ];

  for (const u of predefinedUsers) {
    // 1. Upsert User using email as ID
    // Note: In this environment, User ID is often the email string for mock auth
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { 
        full_name: u.name,
        balance: 50000 
      },
      create: {
        id: u.email, // Force ID to be email to match AuthContext
        email: u.email,
        full_name: u.name,
        balance: 50000,
        role: u.email.includes('admin') ? 'admin' : 'user'
      }
    });

    // 2. Upsert Payment Method
    const existingPM = await prisma.paymentMethod.findFirst({
      where: { user_id: user.id }
    });

    if (!existingPM) {
      await prisma.paymentMethod.create({
        data: {
          user_id: user.id,
          card_type: 'Visa',
          last_four: '8888',
          expiry_month: '12',
          expiry_year: '2028',
          cardholder_name: u.name,
          is_primary: true
        }
      });
      console.log(`✅ Payment method seeded for: ${u.email}`);
    } else {
      console.log(`✅ Payment method already exists for: ${u.email}`);
    }
  }

  console.log('🏁 Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
