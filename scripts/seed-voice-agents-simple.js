// Simple Node.js script to seed voice agents with sample bots
// Run with: node scripts/seed-voice-agents-simple.js

const SAMPLE_BOTS = [
  {
    name: 'Salesforce Sales Assistant',
    description: 'AI assistant for Salesforce CRM - handles lead qualification, opportunity tracking, and sales pipeline management',
    agent_type: 'inbound',
    status: 'active',
    voice_type: 'female',
    language: 'en-US',
    greeting_message: 'Hello! I\'m your Salesforce assistant. I can help you manage leads, track opportunities, and update your sales pipeline. How can I assist you today?'
  },
  {
    name: 'ServiceNow IT Support Bot',
    description: 'AI assistant for ServiceNow ITSM - manages incident tickets, service requests, and IT service catalog',
    agent_type: 'blended',
    status: 'active',
    voice_type: 'neutral',
    language: 'en-US',
    greeting_message: 'Welcome to IT Support. I can help you create incidents, track service requests, or browse our IT service catalog. What do you need help with?'
  },
  {
    name: 'HubSpot Marketing Assistant',
    description: 'AI assistant for HubSpot - handles contact management, deal tracking, and marketing automation',
    agent_type: 'inbound',
    status: 'active',
    voice_type: 'female',
    language: 'en-US',
    greeting_message: 'Hi! I\'m your HubSpot marketing assistant. I can help with contact management, deal tracking, email campaigns, and marketing analytics. What would you like to do?'
  },
  {
    name: 'Microsoft Teams Collaboration Bot',
    description: 'AI assistant for Microsoft Teams - schedules meetings, manages tasks, and facilitates team collaboration',
    agent_type: 'inbound',
    status: 'active',
    voice_type: 'neutral',
    language: 'en-US',
    greeting_message: 'Hello! I\'m your Teams collaboration assistant. I can schedule meetings, create tasks, share files, and help coordinate with your team. How can I help?'
  },
  {
    name: 'Zoom Meeting Assistant',
    description: 'AI assistant for Zoom - schedules meetings, manages recordings, and provides meeting analytics',
    agent_type: 'inbound',
    status: 'active',
    voice_type: 'female',
    language: 'en-US',
    greeting_message: 'Welcome! I\'m your Zoom meeting assistant. I can schedule meetings, share meeting links, manage recordings, and provide analytics. What would you like to do?'
  },
  {
    name: 'Webex Enterprise Assistant',
    description: 'AI assistant for Cisco Webex - manages enterprise communication, meetings, and team collaboration',
    agent_type: 'blended',
    status: 'active',
    voice_type: 'neutral',
    language: 'en-US',
    greeting_message: 'Hello! I\'m your Webex assistant. I can help with meeting scheduling, team spaces, messaging, and enterprise communication. How may I assist you?'
  },
  {
    name: 'PBX Call Management Bot',
    description: 'AI assistant for traditional PBX systems - handles call routing, extensions, and voicemail',
    agent_type: 'inbound',
    status: 'active',
    voice_type: 'male',
    language: 'en-US',
    greeting_message: 'Thank you for calling. I\'m your PBX assistant. I can route you to extensions, manage voicemail, or answer questions about our services. How can I direct your call?'
  },
  {
    name: 'Genesys Contact Center Agent',
    description: 'AI assistant for Genesys Cloud - manages customer interactions, queue management, and agent assistance',
    agent_type: 'blended',
    status: 'active',
    voice_type: 'female',
    language: 'en-US',
    greeting_message: 'Welcome to customer service. I\'m your Genesys assistant. I can help route your call, provide information, or connect you with a specialist. How can I help you today?'
  },
  {
    name: 'NICE Workforce Assistant',
    description: 'AI assistant for NICE WFM - handles workforce optimization, scheduling, and performance management',
    agent_type: 'inbound',
    status: 'active',
    voice_type: 'neutral',
    language: 'en-US',
    greeting_message: 'Hello! I\'m your NICE workforce assistant. I can help with scheduling, time-off requests, performance metrics, and workforce planning. What do you need?'
  },
  {
    name: 'CUCM Call Manager Bot',
    description: 'AI assistant for Cisco Unified Call Manager - manages enterprise telephony and call routing',
    agent_type: 'inbound',
    status: 'active',
    voice_type: 'male',
    language: 'en-US',
    greeting_message: 'Welcome. I\'m your CUCM assistant. I can help with call routing, extension management, and telephony services. How may I direct your call?'
  },
  {
    name: 'UCCX Contact Center Bot',
    description: 'AI assistant for Cisco Unified Contact Center Express - handles IVR, queuing, and agent routing',
    agent_type: 'blended',
    status: 'active',
    voice_type: 'female',
    language: 'en-US',
    greeting_message: 'Thank you for calling. I\'m your UCCX contact center assistant. I can help route your call, provide self-service options, or connect you with an agent. How can I help?'
  },
  {
    name: 'UCCE Enterprise Agent',
    description: 'AI assistant for Cisco Unified Contact Center Enterprise - manages enterprise-scale omnichannel routing',
    agent_type: 'blended',
    status: 'active',
    voice_type: 'neutral',
    language: 'en-US',
    greeting_message: 'Welcome to enterprise customer service. I\'m your UCCE assistant, handling omnichannel routing and customer interactions. How can I assist you?'
  },
  {
    name: 'Talkdesk Cloud Agent',
    description: 'AI assistant for Talkdesk - manages cloud contact center operations and customer engagement',
    agent_type: 'blended',
    status: 'active',
    voice_type: 'female',
    language: 'en-US',
    greeting_message: 'Hello! I\'m your Talkdesk assistant. I can help with customer inquiries, route calls, provide analytics, and enhance your contact center experience. How may I help?'
  }
];

console.log('📋 Sample voice agents ready to be created:');
console.log(`Total bots: ${SAMPLE_BOTS.length}`);
SAMPLE_BOTS.forEach((bot, index) => {
  console.log(`${index + 1}. ${bot.name} (${bot.agent_type})`);
});

console.log('\n✨ Instructions:');
console.log('Use the Voice Agent Platform UI to create these bots, or integrate with your database directly.');
console.log('Each bot has pre-configured settings for its specific platform.');
