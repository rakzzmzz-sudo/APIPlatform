
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding SMS data ...');

  // Clear existing SMS data
  console.log('Clearing existing SMS data...');
  try {
    await prisma.smsMessage.deleteMany({});
    await prisma.smsCampaign.deleteMany({});
    await prisma.smsTemplate.deleteMany({});
    await prisma.smsConfiguration.deleteMany({});
  } catch (error) {
    console.log('Error clearing data (might be empty):', error);
  }

  // SMS Campaigns
  console.log('Seeding SMS Campaigns...');
  const campaign1 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'TEst',
      status: 'paused',
      total_recipients: 10,
      sent_recipients: 1,
      insent_recipients: 0,
      duplicate_numbers: 0,
      success_rate: 100.0,
      route_type: 'promotional',
      sender_id: 'NRGDIC',
      message: 'Hello {{name}}, this is a test message!',
      recipient_source: 'paste',
      created_at: new Date('2025-12-28T10:03:11'),
    }
  });

  const campaign2 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Webinar Invitation Series',
      status: 'in_progress',
      total_recipients: 1850,
      sent_recipients: 1842,
      insent_recipients: 8,
      duplicate_numbers: 3,
      success_rate: 99.6,
      route_type: 'transactional',
      sender_id: 'MYBRAND',
      message: 'Hi {{name}}, join our exclusive webinar on {{date}} at {{time}}. Register now: {{link}}',
      recipient_source: 'upload',
      created_at: new Date('2025-12-28T08:52:38'),
    }
  });

  const campaign3 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Holiday Special Offers',
      status: 'in_progress',
      total_recipients: 4250,
      sent_recipients: 4238,
      insent_recipients: 12,
      duplicate_numbers: 5,
      success_rate: 99.7,
      route_type: 'promotional',
      sender_id: 'COMPANY',
      message: 'FLASH SALE! Get {{discount}}% off on all items. Use code {{promo_code}}. Shop now: {{shop_link}}',
      recipient_source: 'phonebook',
      created_at: new Date('2025-12-28T08:46:26'),
    }
  });

  const campaign4 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Security Update Notification',
      status: 'completed',
      total_recipients: 3420,
      sent_recipients: 3419,
      insent_recipients: 1,
      duplicate_numbers: 0,
      success_rate: 99.97,
      route_type: 'transactional',
      sender_id: 'NRGDIC',
      message: 'SECURITY ALERT: Please update your password immediately. Visit: {{link}}',
      recipient_source: 'paste',
      created_at: new Date('2025-06-22T09:30:42'),
    }
  });

  const campaign5 = await prisma.smsCampaign.create({
    data: {
      campaign_name: 'Subscription Renewal Reminder',
      status: 'completed',
      total_recipients: 2100,
      sent_recipients: 2098,
      insent_recipients: 2,
      duplicate_numbers: 1,
      success_rate: 99.9,
      route_type: 'transactional',
      sender_id: 'MYBRAND',
      message: 'Hi {{name}}, your subscription expires on {{date}}. Renew now to avoid interruption: {{link}}',
      recipient_source: 'upload',
      created_at: new Date('2025-06-22T09:28:48'),
    }
  });

  // SMS Messages (linked to campaigns)
  console.log('Seeding SMS Messages...');
  const phoneNumbers = [
    '+60123456789', '+60198765432', '+60112223344', '+60145556677',
    '+60167778899', '+60189990011', '+60132224455', '+60154446677'
  ];

  const statuses = ['delivered', 'delivered', 'delivered', 'sent', 'pending', 'delivered', 'failed', 'delivered'];

  for (let i = 0; i < phoneNumbers.length; i++) {
    const status = statuses[i];
    await prisma.smsMessage.create({
      data: {
        campaign_id: campaign2.id,
        phone_number: phoneNumbers[i],
        message: 'Hi, join our exclusive webinar on Feb 20 at 3PM. Register now: https://webinar.example.com',
        status,
        error_message: status === 'failed' ? 'Number unreachable' : null,
        sent_at: ['delivered', 'sent', 'failed'].includes(status) ? new Date('2025-12-28T08:55:00') : null,
        delivered_at: status === 'delivered' ? new Date('2025-12-28T08:55:15') : null,
      }
    });
  }

  // Add messages for campaign3 too
  const phones2 = ['+60171112233', '+60182223344', '+60193334455', '+60114445566', '+60125556677'];
  const statuses2 = ['delivered', 'delivered', 'sent', 'delivered', 'invalid'];
  for (let i = 0; i < phones2.length; i++) {
    const status = statuses2[i];
    await prisma.smsMessage.create({
      data: {
        campaign_id: campaign3.id,
        phone_number: phones2[i],
        message: 'FLASH SALE! Get 50% off on all items. Use code HOLIDAY50. Shop now: https://shop.example.com',
        status,
        error_message: status === 'invalid' ? 'Invalid phone number format' : null,
        sent_at: ['delivered', 'sent'].includes(status) ? new Date('2025-12-28T08:48:00') : null,
        delivered_at: status === 'delivered' ? new Date('2025-12-28T08:48:10') : null,
      }
    });
  }

  // SMS Templates
  console.log('Seeding SMS Templates...');
  const templates = [
    { name: 'Account Alert', category: 'alert', desc: 'Send security or account notifications', content: 'SECURITY ALERT: {{alert_type}} detected in your {{account_type}} account ({{account_id}}). If this wasn\'t you, please contact support immediately.', vars: JSON.stringify(['alert_type', 'account_type', 'account_id']) },
    { name: 'Appointment Reminder', category: 'reminder', desc: 'Remind customers about upcoming appointments', content: 'Hi {{customer_name}}! This is a reminder for your appointment on {{date}} at {{time}}. Location: {{location}}. Reply CONFIRM to confirm or call {{phone}} to reschedule.', vars: JSON.stringify(['customer_name', 'date', 'time', 'location', 'phone']) },
    { name: 'Booking Confirmation', category: 'confirmed', desc: 'Confirm a service or venue booking', content: 'Booking confirmed for {{customer_name}}! Your {{service_name}} is set for {{date}} at {{time}}. Booking ref: {{booking_ref}}. Questions? Contact {{support_phone}}.', vars: JSON.stringify(['customer_name', 'service_name', 'date', 'time', 'booking_ref', 'support_phone']) },
    { name: 'Delivery Update', category: 'notification', desc: 'Notify about delivery status', content: 'Hello {{customer_name}}! Your order {{order_id}} is out for delivery and will arrive by {{time}} today. Track: {{track_link}}. Delivery partner: {{partner_name}}.', vars: JSON.stringify(['customer_name', 'order_id', 'time', 'track_link', 'partner_name']) },
    { name: 'Flash Sale Alert', category: 'promotional', desc: 'Notify about time-sensitive sales', content: 'FLASH SALE! Get {{discount}}% off {{product_category}} for the next {{hours}} hours! Use code {{promo_code}} at checkout. Shop now: {{shop_link}}.', vars: JSON.stringify(['discount', 'product_category', 'hours', 'promo_code', 'shop_link']) },
    { name: 'Order Confirmation', category: 'confirmed', desc: 'Confirm customer order', content: 'Hi {{customer_name}}, your order #{{order_id}} has been confirmed! Estimated delivery: {{delivery_date}}. Total: {{amount}}. Track order: {{tracking_url}}. Thank you for shopping with us!', vars: JSON.stringify(['customer_name', 'order_id', 'delivery_date', 'amount', 'tracking_url']) },
    { name: 'OTP Verification', category: 'otp', desc: 'Send OTP code for authentication', content: 'Your verification code is: {{otp_code}}. Valid for {{validity}} minutes. DO NOT share this code with anyone. If you didn\'t request this, please ignore.', vars: JSON.stringify(['otp_code', 'validity']) },
    { name: 'Payment Received', category: 'alert', desc: 'Confirm payment receipt', content: 'Payment of {{currency}}{{amount}} received successfully! Transaction ID: {{transaction_id}}. Your account has been credited. Receipt: {{receipt_url}}. Thank you!', vars: JSON.stringify(['currency', 'amount', 'transaction_id', 'receipt_url']) },
    { name: 'Survey Request', category: 'survey', desc: 'Request customer feedback', content: 'Hi {{customer_name}}! We hope you enjoyed your experience with {{company_name}}. Please take 2 minutes to share your feedback: {{survey_url}}. Thank you!', vars: JSON.stringify(['customer_name', 'company_name', 'survey_url']) },
  ];

  for (const t of templates) {
    await prisma.smsTemplate.create({
      data: {
        template_name: t.name,
        category: t.category,
        description: t.desc,
        content: t.content,
        variables: t.vars,
      }
    });
  }

  // SMS Configurations (with JSON string fields)
  console.log('Seeding SMS Configurations...');
  const configs = [
    {
       gateway_name: 'Sinch SMS Gateway',
       provider: 'sinch',
       protocol: 'SMPP',
       status: 'inactive',
       is_active: false,
       is_default: false,
       smpp_config: JSON.stringify({ host: 'smpp.sinch.com', port: 2775, system_id: 'sinch_prod', bind_type: 'transceiver', encoding: 'UCS2', interface_version: '3.4' }),
       credentials: JSON.stringify({ password: '****' }),
       settings: JSON.stringify({ max_throughput: 50, rate_limit: 50 }),
    },
    {
       gateway_name: 'SMS5 HTTP Gateway',
       provider: 'sms5',
       protocol: 'HTTPS',
       status: 'inactive',
       is_active: false,
       is_default: false,
       http_config: JSON.stringify({ base_url: 'https://api.sms5.com', endpoint: '/v1/send', method: 'POST', content_type: 'application/json' }),
       credentials: JSON.stringify({ api_key: 'sk_test_****' }),
       settings: JSON.stringify({ max_throughput: 100, rate_limit: 100 }),
    },
    {
       gateway_name: 'Infobip SMPP Primary',
       provider: 'infobip',
       protocol: 'SMPP',
       status: 'active',
       is_active: true,
       is_default: true,
       smpp_config: JSON.stringify({ host: 'smpp.infobip.com', port: 2775, system_id: 'infobip_main', bind_type: 'transceiver', encoding: 'UCS2', interface_version: '3.4' }),
       credentials: JSON.stringify({ password: '****' }),
       settings: JSON.stringify({ max_throughput: 200, rate_limit: 200, validity_period: '24h', default_sender: 'NRGDIC' }),
    },
    {
       gateway_name: 'Twilio SMPP Backup',
       provider: 'twilio',
       protocol: 'SMPP',
       status: 'active',
       is_active: true,
       is_default: false,
       smpp_config: JSON.stringify({ host: 'smpp.twilio.com', port: 2775, system_id: 'twilio_backup', bind_type: 'transmitter', encoding: 'GSM7', interface_version: '3.4' }),
       credentials: JSON.stringify({ password: '****' }),
       settings: JSON.stringify({ max_throughput: 150, rate_limit: 150 }),
    }
  ];

  for(const c of configs) {
    await prisma.smsConfiguration.create({
        data: c
    });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
