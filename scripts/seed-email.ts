import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting email seeding...');

  // Get or create a default user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@platform.com',
        full_name: 'Platform Admin',
        organization_name: 'CPaaS Corp',
        balance: 5000.0,
        role: 'admin'
      }
    });
  }

  // Clear existing data
  await prisma.emailCampaignRecipient.deleteMany();
  await prisma.emailCampaignAnalytics.deleteMany();
  await prisma.emailContactListMember.deleteMany();
  await prisma.emailContactList.deleteMany();
  await prisma.emailContact.deleteMany();
  await prisma.emailAutomationSequence.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.emailProviderConfig.deleteMany();
  await prisma.emailCampaign.deleteMany();
  await prisma.emailSendingQuota.deleteMany();

  // 1. Providers
  console.log('Seeding providers...');
  const provider = await prisma.emailProviderConfig.create({
    data: {
      provider_name: 'Enterprise SMTP',
      provider_type: 'smtp',
      smtp_host: 'smtp.sendgrid.net',
      smtp_port: 587,
      smtp_username: 'apikey',
      from_email: 'noreply@cpaas-platform.com',
      from_name: 'CPaaS Platform',
      is_default: true,
      is_verified: true,
      last_verified_at: new Date()
    }
  });

  // 2. Templates
  console.log('Seeding templates...');
  const templates = [];
  const templateStats = [
    { name: 'Minimalist Business', cat: 'Corporate', subject: 'Important Update Regarding Your Account' },
    { name: 'Dark Mode Tech', cat: 'Product', subject: 'New Feature Alert: AI-Powered Insights' },
    { name: 'Vibrant Marketing', cat: 'Promotional', subject: 'Flash Sale! Get 30% Off This Weekend' },
    { name: 'Clean Transactional', cat: 'System', subject: 'Your Order Confirmation' },
    { name: 'Modern Newsletter', cat: 'Newsletter', subject: 'Monthly Tech Roundup: February 2026' }
  ];

  for (const t of templateStats) {
    const template = await prisma.emailTemplate.create({
      data: {
        template_name: t.name,
        template_category: t.cat,
        subject_line: t.subject,
        html_content: `<html><body><h1>${t.name}</h1><p>Hello {{first_name}}, this is a sample email template for ${t.cat}.</p></body></html>`,
        template_variables: JSON.stringify(['first_name', 'last_name', 'company']),
        is_responsive: true,
        created_by: user.id
      }
    });
    templates.push(template);
  }

  // 3. Contacts & Lists
  console.log('Seeding contacts and lists...');
  const list = await prisma.emailContactList.create({
    data: {
      list_name: 'Main Newsletter List',
      description: 'Default list for newsletter subscribers',
      tags: JSON.stringify(['newsletter', 'general']),
      created_by: user.id
    }
  });

  const contacts = [];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.io', 'startup.ai'];
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'Chris', 'Anna'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];

  for (let i = 0; i < 50; i++) {
    const fn = firstNames[i % 10];
    const ln = lastNames[Math.floor(i / 5) % 10];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${domains[i % 5]}`;
    
    const contact = await prisma.emailContact.create({
      data: {
        email,
        first_name: fn,
        last_name: ln,
        company: i % 3 === 0 ? 'Enterprise Ltd' : (i % 3 === 1 ? 'Startup Inc' : 'BigCorp'),
        subscription_status: i % 15 === 0 ? 'unsubscribed' : 'subscribed',
        tags: JSON.stringify(['imported', i % 2 === 0 ? 'active' : 'idle']),
        source: 'seed'
      }
    });
    contacts.push(contact);

    await prisma.emailContactListMember.create({
      data: {
        list_id: list.id,
        contact_id: contact.id
      }
    });
  }

  // 4. Campaigns
  console.log('Seeding campaigns...');
  const statuses = ['sent', 'scheduled', 'draft', 'sending'];
  const campaignsList = [
    { name: 'Q1 Product Roadmap', type: 'regular', status: 'sent', date: -5 },
    { name: 'Welcome New Users', type: 'automation', status: 'sent', date: -10 },
    { name: 'Feb Recap Newsletter', type: 'regular', status: 'sent', date: -2 },
    { name: 'March 20% Promo', type: 'regular', status: 'scheduled', date: 5 },
    { name: 'Webinar Invite', type: 'regular', status: 'sending', date: 0 },
    { name: 'Feedback Survey', type: 'regular', status: 'sent', date: -15 },
    { name: 'AI Feature Launch', type: 'regular', status: 'sent', date: -8 },
    { name: 'Inactive User Recovery', type: 'automation', status: 'draft', date: 0 },
    { name: 'Server Update Alert', type: 'system', status: 'sent', date: -20 },
    { name: 'Annual Report 2025', type: 'regular', status: 'sent', date: -30 }
  ];

  for (let i = 0; i < campaignsList.length; i++) {
    const c = campaignsList[i];
    const date = new Date();
    date.setDate(date.getDate() + c.date);

    const campaign = await prisma.emailCampaign.create({
      data: {
        campaign_name: c.name,
        campaign_type: c.type,
        status: c.status,
        subject_line: `Update: ${c.name}`,
        template_id: templates[i % 5].id,
        from_email: provider.from_email,
        from_name: provider.from_name,
        scheduled_at: c.status === 'scheduled' ? date : null,
        started_at: c.status === 'sent' || c.status === 'sending' ? date : null,
        completed_at: c.status === 'sent' ? new Date(date.getTime() + 3600000) : null,
        total_recipients: Math.floor(Math.random() * 500) + 100,
        emails_sent: c.status === 'sent' ? 450 : (c.status === 'sending' ? 120 : 0),
        emails_delivered: c.status === 'sent' ? 445 : (c.status === 'sending' ? 118 : 0),
        emails_opened: c.status === 'sent' ? Math.floor(Math.random() * 200) + 50 : 0,
        emails_clicked: c.status === 'sent' ? Math.floor(Math.random() * 50) + 10 : 0,
        tags: JSON.stringify(['marketing', '2026']),
        created_by: user.id
      }
    });

    // 5. Analytics (if sent)
    if (c.status === 'sent') {
      for (let d = 0; d < 5; d++) {
        const adate = new Date(date);
        adate.setDate(date.getDate() + d);
        await prisma.emailCampaignAnalytics.create({
          data: {
            campaign_id: campaign.id,
            date: adate,
            emails_sent: Math.floor(campaign.emails_sent / 5),
            emails_delivered: Math.floor(campaign.emails_delivered / 5),
            emails_opened: Math.floor(campaign.emails_opened / 5),
            emails_clicked: Math.floor(campaign.emails_clicked / 5),
            emails_bounced: Math.floor(Math.random() * 5),
            unsubscribed: Math.floor(Math.random() * 2)
          }
        });
      }
    }
  }

  console.log('Email seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
