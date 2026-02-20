import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data in correct order (respecting foreign key constraints)
  console.log('Clearing existing data...');
  await prisma.rcsMessage.deleteMany();
  await prisma.rcsCampaign.deleteMany();
  await prisma.rcsTemplate.deleteMany();
  await prisma.smsMessage.deleteMany();
  await prisma.smsCampaign.deleteMany();
  await prisma.smsTemplate.deleteMany();
  await prisma.customerActivity.deleteMany();
  await prisma.customerNote.deleteMany();
  await prisma.customerSupportTicket.deleteMany();
  await prisma.customerInteraction.deleteMany();
  await prisma.customerRevenueMetric.deleteMany();
  await prisma.customerHealthScore.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.customerSegment.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.rcsAggregatorConfiguration.deleteMany();
  await prisma.sampleWhatsAppNumber.deleteMany();
  await prisma.sampleWhatsAppConfig.deleteMany();
  await prisma.productTier.deleteMany();
  await prisma.product.deleteMany();

  // Create Industries
  console.log('Creating industries...');
  const tech = await prisma.industry.create({
    data: { industry_name: 'Technology' }
  });
  const finance = await prisma.industry.create({
    data: { industry_name: 'Finance' }
  });
  const healthcare = await prisma.industry.create({
    data: { industry_name: 'Healthcare' }
  });
  const retail = await prisma.industry.create({
    data: { industry_name: 'Retail' }
  });
  const education = await prisma.industry.create({
    data: { industry_name: 'Education' }
  });

  // Create Customer Segments
  console.log('Creating customer segments...');
  const enterprise = await prisma.customerSegment.create({
    data: { segment_name: 'Enterprise' }
  });
  const midMarket = await prisma.customerSegment.create({
    data: { segment_name: 'Mid-Market' }
  });
  const smb = await prisma.customerSegment.create({
    data: { segment_name: 'SMB' }
  });

  // Create Customers
  console.log('Creating customers...');
  const customer1 = await prisma.customer.create({
    data: {
      company_name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      phone_number: '+60123456789',
      industry_id: tech.id,
      customer_segment_id: enterprise.id,
      website: 'https://techcorp.com',
      contract_value: 50000,
      customer_status: 'active',
      country: 'Malaysia',
      city: 'Kuala Lumpur',
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      company_name: 'FinanceHub Ltd',
      email: 'info@financehub.com',
      phone_number: '+60198765432',
      industry_id: finance.id,
      customer_segment_id: midMarket.id,
      website: 'https://financehub.com',
      contract_value: 35000,
      customer_status: 'active',
      country: 'Malaysia',
      city: 'Penang',
    }
  });

  const customer3 = await prisma.customer.create({
    data: {
      company_name: 'HealthCare Plus',
      email: 'admin@healthcareplus.com',
      phone_number: '+60187654321',
      industry_id: healthcare.id,
      customer_segment_id: enterprise.id,
      website: 'https://healthcareplus.com',
      contract_value: 75000,
      customer_status: 'active',
      country: 'Malaysia',
      city: 'Johor Bahru',
    }
  });

  // Create Customer Health Scores
  console.log('Creating health scores...');
  await prisma.customerHealthScore.create({
    data: {
      customer_id: customer1.id,
      health_score: 85,
      health_status: 'healthy',
      engagement_score: 90,
      satisfaction_score: 88,
      churn_risk_level: 'low',
      churn_probability: 10,
    }
  });

  await prisma.customerHealthScore.create({
    data: {
      customer_id: customer2.id,
      health_score: 72,
      health_status: 'at_risk',
      engagement_score: 65,
      satisfaction_score: 70,
      churn_risk_level: 'medium',
      churn_probability: 35,
    }
  });

  await prisma.customerHealthScore.create({
    data: {
      customer_id: customer3.id,
      health_score: 92,
      health_status: 'healthy',
      engagement_score: 95,
      satisfaction_score: 94,
      churn_risk_level: 'low',
      churn_probability: 5,
    }
  });

  // Create Customer Revenue Metrics
  console.log('Creating revenue metrics...');
  await prisma.customerRevenueMetric.create({
    data: {
      customer_id: customer1.id,
      monthly_recurring_revenue: 4167,
      annual_recurring_revenue: 50000,
      lifetime_value: 75000,
      total_revenue: 55000,
      total_orders: 24,
      average_order_value: 2292,
    }
  });

  await prisma.customerRevenueMetric.create({
    data: {
      customer_id: customer2.id,
      monthly_recurring_revenue: 2917,
      annual_recurring_revenue: 35000,
      lifetime_value: 52500,
      total_revenue: 38000,
      total_orders: 18,
      average_order_value: 2111,
    }
  });

  await prisma.customerRevenueMetric.create({
    data: {
      customer_id: customer3.id,
      monthly_recurring_revenue: 6250,
      annual_recurring_revenue: 75000,
      lifetime_value: 112500,
      total_revenue: 80000,
      total_orders: 30,
      average_order_value: 2667,
    }
  });

  // Create RCS Templates
  console.log('Creating RCS templates...');
  
  const rcsTemplate1 = await prisma.rcsTemplate.create({
    data: {
      name: 'Product Showcase',
      message_content: 'Check out our latest products with exclusive offers!',
      media_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      media_type: 'image',
      buttons: JSON.stringify([
        { text: 'View Products', action: 'open_url', url: 'https://example.com/products' },
        { text: 'Contact Us', action: 'dial', phone: '+60123456789' }
      ]),
      category: 'marketing',
      description: 'Rich card template for product promotions',
      variables: 'product_name,price,discount',
      use_case: 'Product launch and promotional campaigns',
      is_default: true
    }
  });

  const rcsTemplate2 = await prisma.rcsTemplate.create({
    data: {
      name: 'Order Confirmation',
      message_content: 'Your order #{{order_id}} has been confirmed. Expected delivery: {{delivery_date}}',
      category: 'transactional',
      description: 'Transaction confirmation template',
      variables: 'order_id,delivery_date,customer_name',
      use_case: 'E-commerce order confirmations',
      is_default: false
    }
  });

  const rcsTemplate3 = await prisma.rcsTemplate.create({
    data: {
      name: 'Appointment Reminder',
      message_content: 'Reminder: You have an appointment on {{date}} at {{time}}',
      buttons: JSON.stringify([
        { text: 'Confirm', action: 'reply', reply: 'CONFIRM' },
        { text: 'Reschedule', action: 'reply', reply: 'RESCHEDULE' },
        { text: 'Cancel', action: 'reply', reply: 'CANCEL' }
      ]),
      category: 'utility',
      description: 'Appointment reminder with action buttons',
      variables: 'date,time,location,doctor_name',
      use_case: 'Healthcare, salon, professional services',
      is_default: false
    }
  });

  const rcsTemplate4 = await prisma.rcsTemplate.create({
    data: {
      name: 'Flash Sale Alert',
      message_content: 'Limited time offer! Up to 50% off on selected items',
      media_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      media_type: 'image',
      category: 'marketing',
      description: 'Carousel template for product categories',
      variables: 'sale_name,discount,end_date',
      use_case: 'Multi-product promotional campaigns',
      is_default: false
    }
  });

  const rcsTemplate5 = await prisma.rcsTemplate.create({
    data: {
      name: 'Delivery Update',
      message_content: 'Your package is out for delivery! Track your order: {{tracking_url}}',
      buttons: JSON.stringify([
        { text: 'Track Now', action: 'open_url', url: '{{tracking_url}}' },
        { text: 'Contact Driver', action: 'dial', phone: '{{driver_phone}}' }
      ]),
      category: 'transactional',
      description: 'Delivery notification with tracking',
      variables: 'tracking_url,driver_phone,estimated_time',
      use_case: 'Logistics and delivery updates',
      is_default: false
    }
  });

  // Create SMS Templates
  console.log('Creating SMS templates...');
  const smsTemplate1 = await prisma.smsTemplate.create({
    data: {
      template_name: 'Welcome Message',
      category: 'Onboarding',
      description: 'Welcome new customers',
      content: 'Welcome to our service! We\'re excited to have you.',
      variables: 'customer_name',
      use_case: 'Customer Onboarding',
      is_default: true,
    }
  });

  const smsTemplate2 = await prisma.smsTemplate.create({
    data: {
      template_name: 'Order Confirmation',
      category: 'Transactional',
      description: 'Confirm customer orders',
      content: 'Your order #{{order_id}} confirmed. Total: ${{amount}}',
      variables: 'order_id,amount',
      use_case: 'E-commerce',
      is_default: false,
    }
  });

  const smsTemplate3 = await prisma.smsTemplate.create({
    data: {
      template_name: 'Appointment Reminder',
      category: 'Reminder',
      description: 'Remind customers of appointments',
      content: 'Reminder: Appointment on {{date}} at {{time}}',
      variables: 'date,time',
      use_case: 'Healthcare',
      is_default: false,
    }
  });

  const smsTemplate4 = await prisma.smsTemplate.create({
    data: {
      template_name: 'Payment Confirmation',
      category: 'Transactional',
      description: 'Confirm payment received',
      content: 'Payment of ${{amount}} received. Receipt: {{receipt_id}}',
      variables: 'amount,receipt_id',
      use_case: 'Finance',
      is_default: false,
    }
  });

  const smsTemplate5 = await prisma.smsTemplate.create({
    data: {
      template_name: 'Shipping Update',
      category: 'Notification',
      description: 'Package delivery notifications',
      content: 'Your package from {{vendor}} is out for delivery today!',
      variables: 'vendor',
      use_case: 'Logistics',
      is_default: false,
    }
  });

  // Create SMS Campaigns
  console.log('Creating SMS campaigns...');
  const smsCampaign1 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Summer Sale Promotion',
      status: 'completed',
      total_recipients: 5000,
      sent_recipients: 4925,
      insent_recipients: 75,
      duplicate_numbers: 50,
      success_rate: 98.5,
      route_type: 'Promotional',
      sender_id: 'MAXIS',
      message: 'Summer Sale! Get 50% off all items. Visit https://example.com',
      template_id: smsTemplate1.id,
      recipient_source: 'phonebook',
      created_by: 'admin',
    }
  });

  const smsCampaign2 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Order Updates',
      status: 'in_progress',
      total_recipients: 2500,
      sent_recipients: 1800,
      insent_recipients: 700,
      duplicate_numbers: 25,
      success_rate: 99.2,
      route_type: 'Transactional',
      sender_id: 'SHOPIFY',
      message: 'Your order shipped! Track at https://track.example.com',
      template_id: smsTemplate2.id,
      recipient_source: 'upload',
      created_by: 'admin',
    }
  });

  const smsCampaign3 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Holiday Greetings',
      status: 'scheduled',
      total_recipients: 8000,
      sent_recipients: 0,
      insent_recipients: 8000,
      duplicate_numbers: 80,
      success_rate: 0,
      route_type: 'Promotional',
      sender_id: 'MAXIS',
      message: 'Happy Holidays from our team! Special offers inside.',
      template_id: smsTemplate1.id,
      recipient_source: 'phonebook',
      created_by: 'admin',
    }
  });

  const smsCampaign4 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Payment Reminders',
      status: 'completed',
      total_recipients: 1200,
      sent_recipients: 1195,
      insent_recipients: 5,
      duplicate_numbers: 10,
      success_rate: 99.6,
      route_type: 'Transactional',
      sender_id: 'BILLING',
      message: 'Payment reminder: Invoice due in 3 days. Pay now to avoid late fees.',
      template_id: smsTemplate4.id,
      recipient_source: 'upload',
      created_by: 'admin',
    }
  });

  const smsCampaign5 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Flash Sale Alert',
      status: 'in_progress',
      total_recipients: 15000,
      sent_recipients: 9500,
      insent_recipients: 5500,
      duplicate_numbers: 150,
      success_rate: 97.8,
      route_type: 'Promotional',
      sender_id: 'SHOP24',
      message: '⚡ FLASH SALE! 70% OFF for next 2 hours only. Shop now!',
      template_id: smsTemplate5.id,
      recipient_source: 'phonebook',
      created_by: 'admin',
    }
  });

  // Create SMS Configurations
  console.log('Creating SMS configurations...');
  await prisma.smsConfiguration.create({
    data: {
      gateway_name: 'Twilio Primary',
      provider: 'Twilio',
      protocol: 'HTTP',
      status: 'active',
      is_active: true,
      is_default: true,
      http_config: JSON.stringify({
        endpoint: 'https://api.twilio.com/2010-04-01',
        method: 'POST',
        auth_type: 'basic'
      }),
      credentials: JSON.stringify({
        account_sid: 'AC***************',
        auth_token: '***************'
      }),
      settings: JSON.stringify({
        rate_limit: 100,
        retry_count: 3,
        timeout: 30
      }),
    }
  });

  await prisma.smsConfiguration.create({
    data: {
      gateway_name: 'MessageBird Backup',
      provider: 'MessageBird',
      protocol: 'HTTP',
      status: 'active',
      is_active: true,
      is_default: false,
      http_config: JSON.stringify({
        endpoint: 'https://rest.messagebird.com/messages',
        method: 'POST',
        auth_type: 'bearer'
      }),
      credentials: JSON.stringify({
        access_key: 'live_***************'
      }),
      settings: JSON.stringify({
        rate_limit: 150,
        retry_count: 2,
        timeout: 25
      }),
    }
  });

  await prisma.smsConfiguration.create({
    data: {
      gateway_name: 'Nexmo Enterprise',
      provider: 'Vonage (Nexmo)',
      protocol: 'SMPP',
      status: 'active',
      is_active: true,
      is_default: false,
      smpp_config: JSON.stringify({
        host: 'smpp.nexmo.com',
        port: 2775,
        system_type: 'default'
      }),
      credentials: JSON.stringify({
        system_id: 'nexmo_***',
        password: '***************'
      }),
      settings: JSON.stringify({
        window_size: 10,
        enquire_link_interval: 60,
        reconnect_interval: 5
      }),
    }
  });

  await prisma.smsConfiguration.create({
    data: {
      gateway_name: 'Plivo Regional',
      provider: 'Plivo',
      protocol: 'HTTP',
      status: 'inactive',
      is_active: false,
      is_default: false,
      http_config: JSON.stringify({
        endpoint: 'https://api.plivo.com/v1/Account',
        method: 'POST',
        auth_type: 'basic'
      }),
      credentials: JSON.stringify({
        auth_id: 'MA***************',
        auth_token: '***************'
      }),
      settings: JSON.stringify({
        rate_limit: 80,
        retry_count: 3,
        timeout: 20
      }),
    }
  });

  await prisma.smsConfiguration.create({
    data: {
      gateway_name: 'Sinch Global',
      provider: 'Sinch',
      protocol: 'HTTP',
      status: 'active',
      is_active: true,
      is_default: false,
      http_config: JSON.stringify({
        endpoint: 'https://sms.api.sinch.com/xms/v1',
        method: 'POST',
        auth_type: 'bearer'
      }),
      credentials: JSON.stringify({
        service_plan_id: '***************',
        api_token: '***************'
      }),
      settings: JSON.stringify({
        rate_limit: 120,
        retry_count: 2,
        timeout: 30
      }),
    }
  });

  // Create SMS Messages
  console.log('Creating SMS messages...');
  const phoneNumbers = [
    '+60123456789', '+60198765432', '+60187654321', '+60176543210',
    '+60165432109', '+60154321098', '+60143210987', '+60132109876',
  ];

  // Create messages for Campaign 1 with varied timestamps (0-90 days ago)
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 90); // 0-90 days ago
    const sentAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 24 * 60 * 60 * 1000);
    const deliveredAt = i % 5 !== 4 ? new Date(sentAt.getTime() + Math.random() * 2 * 60 * 60 * 1000) : null; // Delivered within 2 hours of sending
    
    await prisma.smsMessage.create({
      data: {
        campaign_id: smsCampaign1.id,
        phone_number: phoneNumbers[i % phoneNumbers.length],
        message: smsCampaign1.message || 'Sample message',
        status: ['delivered', 'delivered', 'delivered', 'sent', 'failed'][i % 5],
        error_message: i % 5 === 4 ? 'Invalid number' : null,
        sent_at: sentAt,
        delivered_at: deliveredAt,
      }
    });
  }

  // Create messages for Campaign 2 with recent timestamps (0-30 days ago)
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
    const sentAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 24 * 60 * 60 * 1000);
    const deliveredAt = i % 3 === 0 ? new Date(sentAt.getTime() + Math.random() * 2 * 60 * 60 * 1000) : null;
    
    await prisma.smsMessage.create({
      data: {
        campaign_id: smsCampaign2.id,
        phone_number: phoneNumbers[i % phoneNumbers.length],
        message: smsCampaign2.message || 'Sample message',
        status: ['delivered', 'sent', 'pending'][i % 3],
        sent_at: sentAt,
        delivered_at: deliveredAt,
      }
    });
  }
  
  // SMS Messages for Campaign 3 (Holiday Greetings - Scheduled)
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 15); // 0-15 days ago
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - daysAgo);
    sentDate.setHours(Math.floor(Math.random() * 24));
    sentDate.setMinutes(Math.floor(Math.random() * 60));
    
    const status = i < 28 ? 'delivered' : (i < 29 ? 'sent' : 'pending');
    const deliveredDate = status === 'delivered' ? new Date(sentDate.getTime() + Math.random() * 3600000) : null;
    
    await prisma.smsMessage.create({
      data: {
        campaign_id: smsCampaign3.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        message: smsCampaign3.message || '',
        status: status,
        sent_at: sentDate,
        delivered_at: deliveredDate,
      }
    });
  }

  // SMS Messages for Campaign 4 (Payment Reminders - Completed)
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 20) + 10; // 10-30 days ago
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - daysAgo);
    sentDate.setHours(Math.floor(Math.random() * 24));
    sentDate.setMinutes(Math.floor(Math.random() * 60));
    
    const status = i < 29 ? 'delivered' : 'sent';
    const deliveredDate = status === 'delivered' ? new Date(sentDate.getTime() + Math.random() * 3600000) : null;
    
    await prisma.smsMessage.create({
      data: {
        campaign_id: smsCampaign4.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        message: smsCampaign4.message || '',
        status: status,
        sent_at: sentDate,
        delivered_at: deliveredDate,
      }
    });
  }

  // Create messages for Campaign 5 (Flash Sale) - currently in progress
  for (let i = 0; i < 60; i++) {
    const hoursAgo = Math.floor(Math.random() * 48); // Last 48 hours
    const sentAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    const deliveredAt = i % 4 !== 3 ? new Date(sentAt.getTime() + Math.random() * 30 * 60 * 1000) : null;
    
    await prisma.smsMessage.create({
      data: {
        campaign_id: smsCampaign5.id,
        phone_number: phoneNumbers[i % phoneNumbers.length],
        message: smsCampaign5.message || '',
        status: ['delivered', 'delivered', 'sent', 'pending'][i % 4],
        sent_at: sentAt,
        delivered_at: deliveredAt,
      }
    });
  }

  // Create RCS Campaigns
  console.log('Creating RCS campaigns...');
  
  const rcsCampaign1 = await prisma.rcsCampaign.create({
    data: {
      campaign_name: 'Summer Sale 2024 - RCS',
      message_type: 'rich_card',
      sender_id: 'NRGDIC',
      message: 'Huge Summer Sale! Get up to 50% off on selected items. Shop now with rich interactive cards!',
      template_id: rcsTemplate1.id,
      recipient_source: 'paste',
      status: 'completed',
      total_recipients: 5000,
      valid_numbers: 4950,
      invalid_numbers: 30,
      duplicate_numbers: 20,
      created_by: 'admin',
    }
  });

  const rcsCampaign2 = await prisma.rcsCampaign.create({
    data: {
      campaign_name: 'Order Status Updates',
      message_type: 'text',
      sender_id: 'ORDERS',
      message: 'Your order has been confirmed and is being processed.',
      template_id: rcsTemplate2.id,
      recipient_source: 'phonebook',
      status: 'completed',
      total_recipients: 3500,
      valid_numbers: 3480,
      invalid_numbers: 15,
      duplicate_numbers: 5,
      created_by: 'admin',
    }
  });

  const rcsCampaign3 = await prisma.rcsCampaign.create({
    data: {
      campaign_name: 'Appointment Reminders',
      message_type: 'rich_card',
      sender_id: 'APPOINT',
      message: 'Reminder: You have an upcoming appointment. Please confirm or reschedule.',
      template_id: rcsTemplate3.id,
      recipient_source: 'paste',
      status: 'scheduled',
      total_recipients: 2500,
      valid_numbers: 2475,
      invalid_numbers: 20,
      duplicate_numbers: 5,
      created_by: 'admin',
    }
  });

  const rcsCampaign4 = await prisma.rcsCampaign.create({
    data: {
      campaign_name: 'Flash Sale Alert',
      message_type: 'carousel',
      sender_id: 'FLASH',
      message: 'Limited time flash sale! Browse deals across multiple categories.',
      template_id: rcsTemplate4.id,
      recipient_source: 'paste',
      status: 'in_progress',
      total_recipients: 4000,
      valid_numbers: 3970,
      invalid_numbers: 25,
      duplicate_numbers: 5,
      created_by: 'admin',
    }
  });

  const rcsCampaign5 = await prisma.rcsCampaign.create({
    data: {
      campaign_name: 'Delivery Notifications',
      message_type: 'text',
      sender_id: 'DELIVERY',
      message: 'Your package is out for delivery today. Track your order for real-time updates.',
      template_id: rcsTemplate5.id,
      recipient_source: 'upload',
      status: 'in_progress',
      total_recipients: 3000,
      valid_numbers: 2990,
      invalid_numbers: 8,
      duplicate_numbers: 2,
      created_by: 'admin',
    }
  });

  // Create RCS Messages
  console.log('Creating RCS messages...');
  
  // Messages for Campaign 1 (Summer Sale - Completed, 90 days ago)
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - daysAgo);
    sentDate.setHours(Math.floor(Math.random() * 24));
    sentDate.setMinutes(Math.floor(Math.random() * 60));
    
    const status = i < 48 ? 'delivered' : (i < 49 ? 'sent' : 'failed');
    const deliveredDate = status === 'delivered' ? new Date(sentDate.getTime() + Math.random() * 3600000) : null;
    const readDate = status === 'delivered' && i % 2 === 0 ? new Date(deliveredDate!.getTime() + Math.random() * 7200000) : null;
    
    await prisma.rcsMessage.create({
      data: {
        campaign_id: rcsCampaign1.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        message: rcsCampaign1.message || '',
        status: status,
        error_message: status === 'failed' ? 'RCS not supported' : null,
        sent_at: sentDate,
        delivered_at: deliveredDate,
        read_at: readDate,
        credits: 0.05,
      }
    });
  }

  // Messages for Campaign 2 (Order Updates - Completed, 30-60 days ago)
  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(Math.random() * 30) + 30;
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - daysAgo);
    sentDate.setHours(Math.floor(Math.random() * 24));
    sentDate.setMinutes(Math.floor(Math.random() * 60));
    
    const status = i < 39 ? 'delivered' : 'sent';
    const deliveredDate = status === 'delivered' ? new Date(sentDate.getTime() + Math.random() * 3600000) : null;
    const readDate = status === 'delivered' ? new Date(deliveredDate!.getTime() + Math.random() * 7200000) : null;
    
    await prisma.rcsMessage.create({
      data: {
        campaign_id: rcsCampaign2.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        message: rcsCampaign2.message || '',
        status: status,
        sent_at: sentDate,
        delivered_at: deliveredDate,
        read_at: readDate,
        credits: 0.04,
      }
    });
  }

  // Messages for Campaign 3 (Appointments - Scheduled, 0-15 days ago)
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 15);
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - daysAgo);
    sentDate.setHours(Math.floor(Math.random() * 24));
    sentDate.setMinutes(Math.floor(Math.random() * 60));
    
    const status = i < 28 ? 'delivered' : (i < 29 ? 'sent' : 'pending');
    const deliveredDate = status === 'delivered' ? new Date(sentDate.getTime() + Math.random() * 3600000) : null;
    const readDate = status === 'delivered' && i % 3 === 0 ? new Date(deliveredDate!.getTime() + Math.random() * 7200000) : null;
    
    await prisma.rcsMessage.create({
      data: {
        campaign_id: rcsCampaign3.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        message: rcsCampaign3.message || '',
        status: status,
        sent_at: sentDate,
        delivered_at: deliveredDate,
        read_at: readDate,
        credits: 0.05,
      }
    });
  }

  // Messages for Campaign 4 (Flash Sale - In Progress, last 48 hours)
  for (let i = 0; i < 50; i++) {
    const hoursAgo = Math.floor(Math.random() * 48);
    const sentDate = new Date();
    sentDate.setHours(sentDate.getHours() - hoursAgo);
    sentDate.setMinutes(Math.floor(Math.random() * 60));
    
    let status;
    if (i < 45) status = 'delivered';
    else if (i < 48) status = 'sent';
    else if (i < 49) status = 'pending';
    else status = 'failed';
    
    const deliveredDate = status === 'delivered' ? new Date(sentDate.getTime() + Math.random() * 3600000) : null;
    const readDate = status === 'delivered' && i % 2 === 0 ? new Date(deliveredDate!.getTime() + Math.random() * 3600000) : null;
    
    await prisma.rcsMessage.create({
      data: {
        campaign_id: rcsCampaign4.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        message: rcsCampaign4.message || '',
        status: status,
        error_message: status === 'failed' ? 'Network error' : null,
        sent_at: sentDate,
        delivered_at: deliveredDate,
        read_at: readDate,
        credits: 0.06,
      }
    });
  }

  // Messages for Campaign 5 (Delivery - In Progress, last 24 hours)
  for (let i = 0; i < 30; i++) {
    const hoursAgo = Math.floor(Math.random() * 24);
    const sentDate = new Date();
    sentDate.setHours(sentDate.getHours() - hoursAgo);
    sentDate.setMinutes(Math.floor(Math.random() * 60));
    
    let status;
    if (i < 27) status = 'delivered';
    else if (i < 29) status = 'sent';
    else status = 'pending';
    
    const deliveredDate = status === 'delivered' ? new Date(sentDate.getTime() + Math.random() * 1800000) : null;
    const readDate = status === 'delivered' ? new Date(deliveredDate!.getTime() + Math.random() * 3600000) : null;
    
    await prisma.rcsMessage.create({
      data: {
        campaign_id: rcsCampaign5.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        message: rcsCampaign5.message || '',
        status: status,
        sent_at: sentDate,
        delivered_at: deliveredDate,
        read_at: readDate,
        credits: 0.04,
      }
    });
  }

  // Create WhatsApp Templates
  console.log('Creating WhatsApp templates...');
  const waTemplate1 = await prisma.whatsAppTemplate.create({
    data: {
      name: 'Welcome Message',
      body_content: 'Welcome to our service, {{1}}! We are excited to have you on board.',
      category: 'MARKETING',
      language: 'en_US',
      description: 'Standard welcome message for new users',
      variables: 'customer_name',
      use_case: 'Onboarding',
      is_default: true
    }
  });

  const waTemplate2 = await prisma.whatsAppTemplate.create({
    data: {
      name: 'Order Confirmation',
      body_content: 'Your order #{{1}} has been confirmed. Total: {{2}}. Thank you for shopping with us!',
      category: 'TRANSACTIONAL',
      language: 'en_US',
      description: 'Order confirmation template',
      variables: 'order_id,total_amount',
      use_case: 'Sales',
      is_default: false
    }
  });

  const waTemplate3 = await prisma.whatsAppTemplate.create({
    data: {
      name: 'Two-Factor Authentication',
      body_content: 'Your verification code is {{1}}. This code will expire in 10 minutes.',
      category: 'OTP',
      language: 'en_US',
      description: 'Security verification code',
      variables: 'otp_code',
      use_case: 'Security',
      is_default: false
    }
  });

  // Create WhatsApp Config & Numbers
  console.log('Creating WhatsApp configuration...');
  const waConfig = await prisma.whatsAppConfig.create({
    data: {
      tenant_id: 'default_tenant',
      whatsapp_business_id: '1234567890',
      is_verified: true,
      status: 'active'
    }
  });

  await prisma.whatsAppNumber.create({
    data: {
      whatsapp_config_id: waConfig.id,
      phone_number: '+60123456789',
      is_active: true
    }
  });

  // Create WhatsApp Campaigns
  console.log('Creating WhatsApp campaigns...');
  const waCampaign1 = await prisma.whatsAppCampaign.create({
    data: {
      campaign_name: 'January Promotion',
      status: 'completed',
      total_recipients: 1000,
      valid_numbers: 980,
      invalid_numbers: 10,
      duplicate_numbers: 10,
      success_rate: 95.5,
      sender_id: '+60123456789',
      message: 'Exclusive 20% discount for our loyal customers!',
      template_id: waTemplate1.id,
      recipient_source: 'phonebook',
      created_by: 'admin'
    }
  });

  const waCampaign2 = await prisma.whatsAppCampaign.create({
    data: {
      campaign_name: 'Flash Sale (WhatsApp)',
      status: 'in_progress',
      total_recipients: 500,
      valid_numbers: 495,
      invalid_numbers: 2,
      duplicate_numbers: 3,
      success_rate: 0,
      sender_id: '+60123456789',
      message: 'Flash Sale starts now! Link: https://wa.me/shop',
      recipient_source: 'paste',
      created_by: 'admin'
    }
  });

  const waCampaign3 = await prisma.whatsAppCampaign.create({
    data: {
      campaign_name: 'Scheduled Update',
      status: 'scheduled',
      total_recipients: 200,
      valid_numbers: 200,
      invalid_numbers: 0,
      duplicate_numbers: 0,
      success_rate: 0,
      sender_id: '+60123456789',
      message: 'Hello! This is a scheduled update.',
      recipient_source: 'upload',
      created_by: 'admin'
    }
  });

  // Create WhatsApp Messages for Campaign 1 (100 messages)
  console.log('Creating WhatsApp messages...');
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - daysAgo);
    
    const status = i < 90 ? 'read' : (i < 95 ? 'delivered' : (i < 98 ? 'sent' : 'failed'));
    
    await prisma.whatsAppMessage.create({
      data: {
        campaign_id: waCampaign1.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        message: waCampaign1.message || 'Sample message',
        status: status,
        sent_at: sentDate,
        delivered_at: status !== 'sent' && status !== 'failed' ? new Date(sentDate.getTime() + 10000) : null,
        read_at: status === 'read' ? new Date(sentDate.getTime() + 60000) : null,
      }
    });
  }

  // Create WhatsApp Messages for Campaign 2 (50 messages)
  for (let i = 0; i < 50; i++) {
    const sentDate = new Date();
    sentDate.setMinutes(sentDate.getMinutes() - i * 10);
    
    const status = i < 40 ? 'delivered' : 'sent';
    
    await prisma.whatsAppMessage.create({
      data: {
        campaign_id: waCampaign2.id,
        phone_number: `+6012${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        message: waCampaign2.message || 'Sample message',
        status: status,
        sent_at: sentDate,
        delivered_at: status === 'delivered' ? new Date(sentDate.getTime() + 10000) : null,
      }
    });
  }

  // Create Notifications
  console.log('Creating notifications...');
  await prisma.notification.create({
    data: {
      message: 'New SMS campaign completed successfully',
      type: 'success',
      read: false,
    }
  });

  await prisma.notification.create({
    data: {
      message: 'RCS template approved',
      type: 'info',
      read: false,
    }
  });

  await prisma.notification.create({
    data: {
      message: 'Low balance warning: Please top up your account',
      type: 'warning',
      read: true,
    }
  });

  // Create Platforms
  console.log('Creating platforms...');
  await prisma.platform.create({
    data: {
      platform_name: 'SMS API',
      platform_type: 'sms',
      name: 'SMS API',
      icon: 'MessageSquare',
      color: '#10b981',
      is_active: true,
    }
  });

  await prisma.platform.create({
    data: {
      platform_name: 'RCS API',
      platform_type: 'rcs',
      name: 'RCS API',
      icon: 'MessageCircle',
      color: '#3b82f6',
      is_active: true,
    }
  });

  await prisma.platform.create({
    data: {
      platform_name: 'Whatsapp API',
      platform_type: 'whatsapp',
      name: 'Whatsapp API',
      icon: 'MessageCircle',
      color: '#25D366',
      is_active: true,
    }
  });

  // Create RCS Aggregator Configurations
  console.log('Creating RCS aggregator configurations...');
  await prisma.rcsAggregatorConfiguration.createMany({
    data: [
      {
        aggregator_name: 'Infobip Global',
        aggregator_type: 'infobip',
        connection_type: 'https',
        http_base_url: 'https://api.infobip.com',
        api_key: 'infobip_mock_key',
        is_active: true,
        is_default: true,
        verification_status: 'verified',
        rcs_agent_name: 'Infobip Agent',
        max_throughput: 100,
        rate_limit: 1000
      },
      {
        aggregator_name: 'Twilio RCS US',
        aggregator_type: 'twilio',
        connection_type: 'rbm_api',
        rbm_api_endpoint: 'https://rcs.twilio.com',
        rbm_region: 'us',
        api_key: 'twilio_rcs_secret_key',
        is_active: true,
        is_default: false,
        verification_status: 'verified',
        rcs_agent_name: 'Twilio Brand',
        max_throughput: 200,
        rate_limit: 5000
      },
      {
        aggregator_name: 'Google Jibe Cloud',
        aggregator_type: 'google_jibe',
        connection_type: 'rbm_api',
        rbm_api_endpoint: 'https://rbm.google.com',
        rbm_region: 'us',
        api_key: 'google_jibe_token',
        is_active: true,
        is_default: false,
        verification_status: 'pending',
        rcs_agent_name: 'Google Brand Agent'
      },
      {
        aggregator_name: 'Custom RCS Provider',
        aggregator_type: 'custom',
        connection_type: 'https',
        http_base_url: 'https://api.custom-rcs.com/v2',
        api_key: 'custom_provider_auth',
        is_active: false,
        is_default: false,
        verification_status: 'failed',
        rcs_agent_name: 'Experimental Agent'
      }
    ]
  });

  // Create WhatsApp Sample Configurations
  console.log('Creating WhatsApp sample configurations...');
  const sample1 = await prisma.sampleWhatsAppConfig.create({
    data: {
      business_account_id: 'sample_id_1',
      business_name: 'Global Retailer',
      industry: 'Retail',
      description: 'Used for global e-commerce campaigns',
      is_verified: true,
      config_data: JSON.stringify({ email: 'support@retail.com', website: 'https://retail.com' })
    }
  });

  const sample2 = await prisma.sampleWhatsAppConfig.create({
    data: {
      business_account_id: 'sample_id_2',
      business_name: 'Apex Banking',
      industry: 'Fintech',
      description: 'Business account for secure banking alerts and OTPs',
      is_verified: true,
      config_data: JSON.stringify({ email: 'alerts@apexbanks.com', website: 'https://apexbanks.com' })
    }
  });

  const sample3 = await prisma.sampleWhatsAppConfig.create({
    data: {
      business_account_id: 'sample_id_3',
      business_name: 'MediCare Connect',
      industry: 'Healthcare',
      description: 'Patient communication portal for clinics',
      is_verified: false,
      config_data: JSON.stringify({ email: 'patient-care@medicare.org', website: 'https://medicare.org' })
    }
  });

  const sample4 = await prisma.sampleWhatsAppConfig.create({
    data: {
      business_account_id: 'sample_id_4',
      business_name: 'Swift Logistics',
      industry: 'Logistics',
      description: 'Automated delivery tracking and driver communication',
      is_verified: true,
      config_data: JSON.stringify({ email: 'tracking@swift-log.com', website: 'https://swift-log.com' })
    }
  });

  await prisma.sampleWhatsAppNumber.createMany({
    data: [
      { config_id: sample1.id, phone_number: '+1234567890', display_phone_number: '+1 234-567-890', verified_name: 'Global Support', quality_rating: 'HIGH' },
      { config_id: sample1.id, phone_number: '+1987654321', display_phone_number: '+1 987-654-321', verified_name: 'Sales Desk', quality_rating: 'MEDIUM' },
      { config_id: sample2.id, phone_number: '+15551234', display_phone_number: '+1 555-1234', verified_name: 'Apex Security', quality_rating: 'HIGH' },
      { config_id: sample2.id, phone_number: '+15555678', display_phone_number: '+1 555-5678', verified_name: 'Apex Fraud Dept', quality_rating: 'HIGH' },
      { config_id: sample3.id, phone_number: '+14443210', display_phone_number: '+1 444-3210', verified_name: 'General Clinic', quality_rating: 'MEDIUM' },
      { config_id: sample4.id, phone_number: '+17770000', display_phone_number: '+1 777-0000', verified_name: 'Express Tracking', quality_rating: 'HIGH' }
    ]
  });

  // Create Products
  console.log('Creating products...');
  
  // Helper to create product with tiers
  const createProductWithTiers = async (
    sku: string, 
    name: string, 
    desc: string, 
    cat: string, 
    icon: string, 
    features: string[], 
    tiers: any[]
  ) => {
    const product = await prisma.product.create({
      data: {
        sku,
        name,
        description: desc,
        category: cat,
        icon,
        status: 'active',
        features: JSON.stringify(features),
      }
    });

    for (const tier of tiers) {
      await prisma.productTier.create({
        data: {
          product_id: product.id,
          ...tier,
          features: JSON.stringify(tier.features)
        }
      });
    }
  };

  // --- COMMUNICATION ---

  await createProductWithTiers(
    'PROD-SMS', 
    'SMS Messaging', 
    'Global SMS delivery with high throughput and reliability. Reach customers on any mobile phone.', 
    'Messaging', 
    'MessageSquare', 
    ['Global Reach (200+ countries)', 'High Throughput', 'Sender ID Customization', 'Real-time Delivery Reports', 'Smart Routing'],
    [
      { tier_name: 'Pay As You Go', tier_sku: 'SMS-PAYG', description: 'Flexible pricing for startups and small volumes.', price: 0.045, price_unit: 'segment', setup_fee: 0, features: { rate_limit: '10 MPS', support: 'Email' }, support_level: 'Standard', is_popular: false, sort_order: 1 },
      { tier_name: 'Growth', tier_sku: 'SMS-GROWTH', description: 'Committed volume for growing businesses.', price: 0.035, price_unit: 'segment', setup_fee: 0, features: { rate_limit: '50 MPS', support: 'Priority Email' }, support_level: 'Silver', is_popular: true, sort_order: 2 },
      { tier_name: 'Enterprise', tier_sku: 'SMS-ENT', description: 'High volume with dedicated throughput and support.', price: 0.025, price_unit: 'segment', setup_fee: 1000, features: { rate_limit: '1000+ MPS', support: '24/7 Dedicated' }, support_level: 'Platinum', is_popular: false, sort_order: 3 }
    ]
  );

  await createProductWithTiers(
    'PROD-RCS',
    'RCS Business Messaging',
    'Upgrade SMS to rich, interactive experiences with branding, carousels, and suggested actions.',
    'Messaging',
    'MessageCircle',
    ['Verified Sender', 'Rich Media Cards', 'Carousels', 'Suggested Actions', 'Read Receipts'],
    [
      { tier_name: 'Standard', tier_sku: 'RCS-STD', description: 'Basic RCS capabilities.', price: 0.05, price_unit: 'message', setup_fee: 0, features: { media_limit: '5MB', types: 'Basic Cards' }, support_level: 'Standard', is_popular: true, sort_order: 1 },
      { tier_name: 'Premium', tier_sku: 'RCS-PREM', description: 'Full rich media capabilities.', price: 0.07, price_unit: 'message', setup_fee: 500, features: { media_limit: '100MB', types: 'Carousels & Video' }, support_level: 'Gold', is_popular: false, sort_order: 2 }
    ]
  );

  await createProductWithTiers(
    'PROD-WA',
    'WhatsApp Business API',
    'Engage customers on the world\'s most popular chat app with secure, enterprise-grade messaging.',
    'Messaging',
    'MessageCircle',
    ['Template Management', 'Session Messages', 'Interactive Buttons', 'Verified Business Profile', 'End-to-End Encryption'],
    [
      { tier_name: 'Conversational', tier_sku: 'WA-CONV', description: 'Pay per conversation window (24h).', price: 0.005, price_unit: 'conversation', setup_fee: 0, features: { monthly_active_users: 'Unlimited', templates: 'Unlimited' }, support_level: 'Standard', is_popular: true, sort_order: 1 },
      { tier_name: 'Enterprise', tier_sku: 'WA-ENT', description: 'Volume discounts for high traffic.', price: 0.003, price_unit: 'conversation', setup_fee: 2000, features: { monthly_active_users: 'Unlimited', dedicated_throughput: 'Yes' }, support_level: 'Platinum', is_popular: false, sort_order: 2 }
    ]
  );

  await createProductWithTiers(
    'PROD-VOICE',
    'Voice API',
    'Build programmable voice flows, IVRs, and SIP trunking for your applications.',
    'Voice',
    'Phone',
    ['Programmable Voice', 'SIP Trunking', 'Call Recording', 'Text-to-Speech', 'Conference Calling'],
    [
      { tier_name: 'Pay As You Go', tier_sku: 'VOICE-PAYG', description: 'Standard voice rates.', price: 0.02, price_unit: 'minute', setup_fee: 0, features: { channels: 'Unlimited', recording: 'Included' }, support_level: 'Standard', is_popular: false, sort_order: 1 },
      { tier_name: 'SIP Trunking', tier_sku: 'VOICE-SIP', description: 'Connect your PBX to the cloud.', price: 15.00, price_unit: 'channel/mo', setup_fee: 50, features: { outbound_termination: 'Global', disaster_recovery: 'Yes' }, support_level: 'Gold', is_popular: true, sort_order: 2 }
    ]
  );

  await createProductWithTiers(
    'PROD-VIDEO',
    'Video API',
    'Embed high-quality real-time video and audio into your web and mobile apps.',
    'Video',
    'Video',
    ['WebRTC HD Video', 'Global Low Latency', 'Cloud Recording', 'Screen Sharing', 'Broadcasting'],
    [
      { tier_name: 'Developer', tier_sku: 'VID-DEV', description: 'For prototyping and small apps.', price: 0.004, price_unit: 'participant/min', setup_fee: 0, features: { resolution: '720p', recording: 'Pay-per-GB' }, support_level: 'Community', is_popular: false, sort_order: 1 },
      { tier_name: 'Pro', tier_sku: 'VID-PRO', description: 'For production applications.', price: 0.006, price_unit: 'participant/min', setup_fee: 0, features: { resolution: '1080p', recording: 'Included (100GB)' }, support_level: 'Gold', is_popular: true, sort_order: 2 }
    ]
  );

  await createProductWithTiers(
    'PROD-EMAIL',
    'Email API',
    'Deliver transactional and marketing emails with industry-leading deliverability.',
    'Email',
    'Mail',
    ['99% Deliverability', 'HTML Templates', 'Real-time Analytics', 'A/B Testing', 'Dedicated IP'],
    [
      { tier_name: 'Free', tier_sku: 'EMAIL-FREE', description: 'For testing and hobby projects.', price: 0, price_unit: 'month', setup_fee: 0, features: { limit: '100 emails/day', analytics: 'Basic' }, support_level: 'Community', is_popular: false, sort_order: 1 },
      { tier_name: 'Essentials', tier_sku: 'EMAIL-ESS', description: 'For growing businesses.', price: 29.00, price_unit: 'month', setup_fee: 0, features: { limit: '50,000 emails/mo', analytics: 'Advanced' }, support_level: 'Standard', is_popular: true, sort_order: 2 },
      { tier_name: 'Pro', tier_sku: 'EMAIL-PRO', description: 'High volume senders.', price: 149.00, price_unit: 'month', setup_fee: 0, features: { limit: '500,000 emails/mo', dedicated_ip: 'Included' }, support_level: 'Gold', is_popular: false, sort_order: 3 }
    ]
  );

  // --- AI & AUTOMATION ---

  await createProductWithTiers(
    'PROD-BOT',
    'AI Chatbot',
    'Automate customer support and engagement with intelligent, natural language chatbots.',
    'Bot',
    'Bot',
    ['Visual Flow Builder', 'NLP/NLU Engine', 'Multi-channel Deployment', 'Human Handover', 'Analytics'],
    [
      { tier_name: 'Starter', tier_sku: 'BOT-START', description: 'Rule-based bots.', price: 99.00, price_unit: 'month', setup_fee: 0, features: { bots: '1', messages: '1,000/mo' }, support_level: 'Standard', is_popular: false, sort_order: 1 },
      { tier_name: 'Professional', tier_sku: 'BOT-PRO', description: 'AI-powered conversational flows.', price: 499.00, price_unit: 'month', setup_fee: 500, features: { bots: '5', messages: '50,000/mo', nlp_engine: 'Advanced' }, support_level: 'Gold', is_popular: true, sort_order: 2 }
    ]
  );

  await createProductWithTiers(
    'PROD-VOICE-AGENT',
    'AI Voice Agent',
    'Build conversational IVRs and voice bots that understand and speak naturally.',
    'Bot',
    'Mic',
    ['Speech-to-Text', 'Neural Text-to-Speech', 'Intent Recognition', 'Sentiment Analysis', 'Real-time Processing'],
    [
      { tier_name: 'Standard', tier_sku: 'V-AGENT-STD', description: 'Pay per minute of conversation.', price: 0.08, price_unit: 'minute', setup_fee: 0, features: { languages: '10+', voices: 'Standard' }, support_level: 'Standard', is_popular: true, sort_order: 1 },
      { tier_name: 'Neural', tier_sku: 'V-AGENT-NEU', description: 'Ultra-realistic neural voices.', price: 0.12, price_unit: 'minute', setup_fee: 0, features: { languages: '50+', voices: 'Premium Neural' }, support_level: 'Gold', is_popular: false, sort_order: 2 }
    ]
  );

  await createProductWithTiers(
    'PROD-MEET-AI',
    'Meetings AI',
    'Add intelligent transcription, summarization, and insights to your video meetings.',
    'Bot',
    'Sparkles',
    ['Real-time Transcription', 'Speaker Diarization', 'Action Item Extraction', 'Topic Detection', 'Sentiment Analysis'],
    [
      { tier_name: 'API Access', tier_sku: 'MEET-API', description: 'Process meeting recordings.', price: 0.05, price_unit: 'audio minute', setup_fee: 0, features: { turn_around: 'Standard', export: 'JSON/TXT' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  // --- TELCO & IDENTITY (CAMARA) ---

  await createProductWithTiers(
    'PROD-SIM-SWAP',
    'SIM Swap Detection',
    'Check if a SIM card has been recently swapped to prevent account takeover fraud.',
    'Identity',
    'Shield',
    ['Real-time Check', 'Timestamp of Last Swap', 'Risk Scoring', 'Global Telco Coverage', 'API Integration'],
    [
      { tier_name: 'Per Lookup', tier_sku: 'SIM-LOOKUP', description: 'Pay per API call.', price: 0.10, price_unit: 'lookup', setup_fee: 0, features: { cache: 'No', SLA: '99.9%' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  await createProductWithTiers(
    'PROD-NUM-VERIFY',
    'Number Verification',
    'Verify phone number possession silently without SMS OTPs using telco network authentication.',
    'Identity',
    'CheckCircle',
    ['Silent Authentication', 'No UX Friction', 'Phishing Resistant', 'Mobile Data Verification', 'Instant Result'],
    [
      { tier_name: 'Volume Tier 1', tier_sku: 'NUM-V1', description: 'Up to 10k verifications/mo.', price: 0.08, price_unit: 'verification', setup_fee: 0, features: { bandwidth: 'Standard' }, support_level: 'Standard', is_popular: true, sort_order: 1 },
      { tier_name: 'Volume Tier 2', tier_sku: 'NUM-V2', description: '10k+ verifications/mo.', price: 0.06, price_unit: 'verification', setup_fee: 0, features: { bandwidth: 'High' }, support_level: 'Gold', is_popular: false, sort_order: 2 }
    ]
  );

  await createProductWithTiers(
    'PROD-DEV-LOC',
    'Device Location',
    'Verify device location against telco network data for fraud prevention and geofencing.',
    'Identity',
    'MapPin',
    ['Network Triangulation', 'Roaming Status', 'Country Check', 'Privacy Compliance', 'No App Required'],
    [
      { tier_name: 'Standard', tier_sku: 'LOC-STD', description: 'City-level precision.', price: 0.15, price_unit: 'lookup', setup_fee: 0, features: { precision: 'City', global: 'Yes' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  await createProductWithTiers(
    'PROD-QOD',
    'Quality on Demand',
    'Programmatically boost network quality for critical real-time applications like video calls or gaming.',
    'Identity',
    'Zap',
    ['Latency Reduction', 'Bandwidth Guarantee', 'Jitter Minimization', 'Example: Stable Video Calls', '5G Slicing Access'],
    [
      { tier_name: 'On Demand', tier_sku: 'QOD-OND', description: 'Pay per boosted session.', price: 0.50, price_unit: 'session (30m)', setup_fee: 0, features: { profile: 'Low Latency', duration: 'Fixed' }, support_level: 'Premium', is_popular: true, sort_order: 1 }
    ]
  );

  // --- SOCIAL PLATFORMS ---

  await createProductWithTiers(
    'PROD-TIKTOK',
    'TikTok for Business',
    'Create and manage TikTok marketing campaigns and ad integration.',
    'Social',
    'Music',
    ['Ad Management', 'Audience Targeting', 'Creative Tools', 'Performance Analytics', 'Pixel Tracking'],
    [
      { tier_name: 'Platform Access', tier_sku: 'TT-PLAT', description: 'Access to marketing API.', price: 49.00, price_unit: 'month', setup_fee: 0, features: { accounts: '5', sync_frequnecy: 'Daily' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  await createProductWithTiers(
    'PROD-INSTA',
    'Instagram Messaging',
    'Automate DMs, manage comments, and engage with followers on Instagram.',
    'Social',
    'Instagram',
    ['DM Automation', 'Story Replies', 'Comment Management', 'Quick Replies', 'Ice Breakers'],
    [
      { tier_name: 'Essentials', tier_sku: 'IG-ESS', description: 'Manage DMs and Comments.', price: 29.00, price_unit: 'month', setup_fee: 0, features: { handles: '1', automation: 'Basic' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  await createProductWithTiers(
    'PROD-FB',
    'Facebook Messenger',
    'Scale customer support and marketing on Facebook Messenger.',
    'Social',
    'Facebook',
    ['Chat Plugin', 'Broadcast API', 'Handover Protocol', 'Templates', 'Persistent Menu'],
    [
      { tier_name: 'Business', tier_sku: 'FB-BIZ', description: 'Full Messenger API access.', price: 39.00, price_unit: 'month', setup_fee: 0, features: { pages: 'Unlimited', conversations: 'Unlimited' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  await createProductWithTiers(
    'PROD-YT',
    'YouTube Integration',
    'Manage video content, comments, and analytics via API.',
    'Social',
    'Youtube',
    ['Upload API', 'Comment Moderation', 'Live Streaming Control', 'Deep Analytics', 'Rights Management'],
    [
      { tier_name: 'Creator', tier_sku: 'YT-CRE', description: 'Tools for channel management.', price: 19.00, price_unit: 'month', setup_fee: 0, features: { channels: '3', reporting: 'Weekly' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  await createProductWithTiers(
    'PROD-LI',
    'LinkedIn',
    'Automate professional networking and content publishing.',
    'Social',
    'Linkedin',
    ['Post Scheduling', 'Company Page Management', 'Analytics', 'Ad Management', 'Lead Gen Forms'],
    [
      { tier_name: 'Professional', tier_sku: 'LI-PRO', description: 'Company page tools.', price: 59.00, price_unit: 'month', setup_fee: 0, features: { pages: '1', users: '5' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  // --- ASIAN MESSAGING ---

  await createProductWithTiers(
    'PROD-VIBER',
    'Viber Business',
    'Reach audiences in Eastern Europe and Asia with Viber Business Messages.',
    'Messaging',
    'Phone',
    ['Transactional Messages', 'Promotional Messages', 'Rich Media', 'Two-way Chat', 'Session Management'],
    [
      { tier_name: 'Standard', tier_sku: 'VIB-STD', description: 'Pay per delivered message.', price: 0.02, price_unit: 'message', setup_fee: 0, features: { type: 'Service & Promo', ttl: 'Limited' }, support_level: 'Standard', is_popular: true, sort_order: 1 }
    ]
  );

  await createProductWithTiers(
    'PROD-LINE',
    'LINE Official Account',
    'Connect with customers in Japan, Thailand, and Taiwan via LINE.',
    'Messaging',
    'MessageCircle',
    ['Push Messages', 'Reply Messages', 'Rich Menus', 'Stickers', 'Multicast'],
    [
      { tier_name: 'Light', tier_sku: 'LINE-LGT', description: 'For small businesses.', price: 0, price_unit: 'month', setup_fee: 0, features: { messages: '500 free' }, support_level: 'Community', is_popular: false, sort_order: 1 },
      { tier_name: 'Standard', tier_sku: 'LINE-STD', description: 'For active accounts.', price: 50.00, price_unit: 'month', setup_fee: 0, features: { messages: '45,000 included' }, support_level: 'Gold', is_popular: true, sort_order: 2 }
    ]
  );

  await createProductWithTiers(
    'PROD-WECHAT',
    'WeChat Official Account',
    'The super-app for the Chinese market. Reach over 1 billion users.',
    'Messaging',
    'MessageSquare',
    ['Service Account', 'Subscription Account', 'Template Messages', 'Customer Service', 'Oauth2'],
    [
      { tier_name: 'Verified', tier_sku: 'WC-VER', description: 'Official verified account API.', price: 99.00, price_unit: 'year', setup_fee: 300, features: { type: 'Service Account', verification: 'Included' }, support_level: 'Premium', is_popular: true, sort_order: 1 }
    ]
  );

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('- 2 Industries');
  console.log('- 3 Segments');
  console.log('- 50 Customers');
  console.log('- 5 SMS Campaigns');
  console.log('- 5 SMS Templates');
  console.log('- 200 SMS Messages');
  console.log('- 5 SMS Gateway Configurations');
  console.log('- 5 RCS Templates');
  console.log('- 5 RCS Campaigns');
  console.log('- 200 RCS Messages');
  console.log('- 3 WhatsApp Campaigns');
  console.log('- 3 WhatsApp Templates');
  console.log('- 150 WhatsApp Messages');
  console.log('- 3 Platforms');
  console.log('- 3 Notifications');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
