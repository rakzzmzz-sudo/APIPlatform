import React, { useState, useEffect } from 'react';
import {
  Play, Code, Zap, CheckCircle, ArrowRight, Copy, Key, Download,
  Terminal, Book, Rocket, Eye, EyeOff, RefreshCw, Check, X,
  Send, Phone, MessageSquare, Mail, Video, Globe, Settings,
  Database, Cloud, Lock, Shield, Activity, Sparkles, FileCode,
  Package, ExternalLink, ChevronRight, TestTube, Lightbulb, AlertCircle,
  Webhook, Code2, FileJson, PlayCircle, Wifi, Users, TrendingUp,
  Filter, Search, Clock, BarChart3, Bell, Radio
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

interface DeveloperProgress {
  id?: string;
  user_id: string;
  current_step: number;
  api_key_generated: boolean;
  sdk_downloaded: boolean;
  first_api_call: boolean;
  completed_tutorial: boolean;
  test_calls_made: number;
  last_activity: string;
}

interface ApiMethod {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  description: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  response: any;
}

interface ApiCategory {
  name: string;
  icon: any;
  color: string;
  apis: {
    name: string;
    description: string;
    methods: ApiMethod[];
  }[];
}

export default function GetStarted() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [selectedSDK, setSelectedSDK] = useState('javascript');
  const [testEndpoint, setTestEndpoint] = useState('sms');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [progress, setProgress] = useState<DeveloperProgress | null>(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab] = useState<'quickstart' | 'api-library' | 'playground' | 'resources'>('quickstart');
  const [selectedCategory, setSelectedCategory] = useState('messaging');
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [playgroundRequest, setPlaygroundRequest] = useState({
    method: 'POST',
    endpoint: '/v1/messages/sms',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: '+60123456789', from: 'YourBrand', message: 'Hello!' }, null, 2)
  });
  const [requestLog, setRequestLog] = useState<any[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const apiLibrary: Record<string, ApiCategory> = {
    messaging: {
      name: 'Messaging API',
      icon: MessageSquare,
      color: 'blue',
      apis: [
        {
          name: 'SMS API',
          description: 'Send and receive SMS messages globally',
          methods: [
            {
              name: 'Send SMS',
              method: 'POST' as const,
              endpoint: '/v1/messages/sms',
              description: 'Send an SMS message to a phone number',
              parameters: [
                { name: 'to', type: 'string', required: true, description: 'Recipient phone number in E.164 format' },
                { name: 'from', type: 'string', required: true, description: 'Sender ID or phone number' },
                { name: 'message', type: 'string', required: true, description: 'Message content (up to 1600 characters)' },
                { name: 'callback_url', type: 'string', required: false, description: 'Webhook URL for delivery receipts' }
              ],
              response: { messageId: 'msg_123', status: 'sent', cost: 0.05 }
            },
            {
              name: 'Get SMS Status',
              method: 'GET' as const,
              endpoint: '/v1/messages/sms/{messageId}',
              description: 'Retrieve the status of a sent SMS',
              parameters: [
                { name: 'messageId', type: 'string', required: true, description: 'Message ID returned from send request' }
              ],
              response: { messageId: 'msg_123', status: 'delivered', deliveredAt: '2024-01-02T10:30:00Z' }
            },
            {
              name: 'List SMS Messages',
              method: 'GET' as const,
              endpoint: '/v1/messages/sms',
              description: 'List all SMS messages with filtering',
              parameters: [
                { name: 'from', type: 'string', required: false, description: 'Filter by sender' },
                { name: 'to', type: 'string', required: false, description: 'Filter by recipient' },
                { name: 'status', type: 'string', required: false, description: 'Filter by status' },
                { name: 'limit', type: 'number', required: false, description: 'Number of results (1-100)' }
              ],
              response: { messages: [], totalCount: 0, hasMore: false }
            }
          ]
        },
        {
          name: 'Whatsapp API',
          description: 'Send messages via WhatsApp Business Platform',
          methods: [
            {
              name: 'Send WhatsApp Message',
              method: 'POST' as const,
              endpoint: '/v1/messages/whatsapp',
              description: 'Send a message through WhatsApp Business',
              parameters: [
                { name: 'to', type: 'string', required: true, description: 'Recipient WhatsApp number' },
                { name: 'template', type: 'string', required: false, description: 'Template name' },
                { name: 'message', type: 'string', required: false, description: 'Text message (if not using template)' },
                { name: 'media_url', type: 'string', required: false, description: 'URL for media attachment' }
              ],
              response: { messageId: 'wa_456', status: 'sent' }
            },
            {
              name: 'Send Template Message',
              method: 'POST' as const,
              endpoint: '/v1/messages/whatsapp/templates',
              description: 'Send a pre-approved WhatsApp template',
              parameters: [
                { name: 'to', type: 'string', required: true, description: 'Recipient number' },
                { name: 'template_name', type: 'string', required: true, description: 'Approved template name' },
                { name: 'language', type: 'string', required: true, description: 'Language code (e.g., en_US)' },
                { name: 'parameters', type: 'array', required: false, description: 'Template parameter values' }
              ],
              response: { messageId: 'wa_789', status: 'queued' }
            }
          ]
        },
        {
          name: 'RCS API',
          description: 'Rich Communication Services with rich media',
          methods: [
            {
              name: 'Send RCS Message',
              method: 'POST' as const,
              endpoint: '/v1/messages/rcs',
              description: 'Send rich media message via RCS',
              parameters: [
                { name: 'to', type: 'string', required: true, description: 'Recipient phone number' },
                { name: 'from', type: 'string', required: true, description: 'RCS agent ID' },
                { name: 'content', type: 'object', required: true, description: 'RCS message content' },
                { name: 'suggestions', type: 'array', required: false, description: 'Suggested replies/actions' }
              ],
              response: { messageId: 'rcs_321', status: 'sent' }
            }
          ]
        },
        {
          name: 'Email API',
          description: 'Transactional and marketing email delivery',
          methods: [
            {
              name: 'Send Email',
              method: 'POST' as const,
              endpoint: '/v1/messages/email',
              description: 'Send an email message',
              parameters: [
                { name: 'to', type: 'string', required: true, description: 'Recipient email address' },
                { name: 'from', type: 'string', required: true, description: 'Sender email address' },
                { name: 'subject', type: 'string', required: true, description: 'Email subject' },
                { name: 'html', type: 'string', required: false, description: 'HTML content' },
                { name: 'text', type: 'string', required: false, description: 'Plain text content' },
                { name: 'attachments', type: 'array', required: false, description: 'File attachments' }
              ],
              response: { emailId: 'email_654', status: 'queued' }
            }
          ]
        }
      ]
    },
    voice: {
      name: 'Voice API',
      icon: Phone,
      color: 'green',
      apis: [
        {
          name: 'Voice API',
          description: 'Make and receive voice calls with programmable features',
          methods: [
            {
              name: 'Make Outbound Call',
              method: 'POST' as const,
              endpoint: '/v1/calls',
              description: 'Initiate an outbound call',
              parameters: [
                { name: 'to', type: 'string', required: true, description: 'Destination phone number' },
                { name: 'from', type: 'string', required: true, description: 'Caller ID number' },
                { name: 'twiml_url', type: 'string', required: false, description: 'TwiML instructions URL' },
                { name: 'callback_url', type: 'string', required: false, description: 'Status callback webhook' }
              ],
              response: { callId: 'call_789', status: 'initiated' }
            },
            {
              name: 'Get Call Details',
              method: 'GET' as const,
              endpoint: '/v1/calls/{callId}',
              description: 'Retrieve call information and status',
              parameters: [
                { name: 'callId', type: 'string', required: true, description: 'Call identifier' }
              ],
              response: { callId: 'call_789', status: 'completed', duration: 120 }
            },
            {
              name: 'Modify Live Call',
              method: 'POST' as const,
              endpoint: '/v1/calls/{callId}',
              description: 'Modify an in-progress call',
              parameters: [
                { name: 'callId', type: 'string', required: true, description: 'Call identifier' },
                { name: 'action', type: 'string', required: true, description: 'Action: redirect, hangup, mute' },
                { name: 'twiml_url', type: 'string', required: false, description: 'New TwiML URL (for redirect)' }
              ],
              response: { callId: 'call_789', status: 'updated' }
            }
          ]
        },
        {
          name: 'SIP Trunking',
          description: 'Connect your PBX to the PSTN network',
          methods: [
            {
              name: 'Create SIP Trunk',
              method: 'POST' as const,
              endpoint: '/v1/sip/trunks',
              description: 'Provision a new SIP trunk',
              parameters: [
                { name: 'name', type: 'string', required: true, description: 'Trunk friendly name' },
                { name: 'domain', type: 'string', required: true, description: 'SIP domain' },
                { name: 'auth_type', type: 'string', required: true, description: 'Authentication method' }
              ],
              response: { trunkId: 'trunk_123', domain: 'customer.sip.maxis.com' }
            },
            {
              name: 'List SIP Trunks',
              method: 'GET' as const,
              endpoint: '/v1/sip/trunks',
              description: 'List all SIP trunks',
              parameters: [],
              response: { trunks: [] }
            }
          ]
        },
        {
          name: 'Cloud PBX',
          description: 'Manage virtual phone system',
          methods: [
            {
              name: 'Create Extension',
              method: 'POST' as const,
              endpoint: '/v1/pbx/extensions',
              description: 'Create a new phone extension',
              parameters: [
                { name: 'extension', type: 'string', required: true, description: 'Extension number' },
                { name: 'name', type: 'string', required: true, description: 'Extension name' },
                { name: 'features', type: 'object', required: false, description: 'Feature configuration' }
              ],
              response: { extensionId: 'ext_456', extension: '101' }
            }
          ]
        },
        {
          name: 'Number Management',
          description: 'Search, purchase, and manage phone numbers',
          methods: [
            {
              name: 'Search Available Numbers',
              method: 'GET' as const,
              endpoint: '/v1/numbers/available',
              description: 'Search for available phone numbers',
              parameters: [
                { name: 'country', type: 'string', required: true, description: 'Country code (e.g., MY)' },
                { name: 'type', type: 'string', required: false, description: 'Number type: local, mobile, tollfree' },
                { name: 'pattern', type: 'string', required: false, description: 'Pattern to match' }
              ],
              response: { numbers: ['+60123456789'], totalAvailable: 50 }
            },
            {
              name: 'Purchase Number',
              method: 'POST' as const,
              endpoint: '/v1/numbers',
              description: 'Purchase a phone number',
              parameters: [
                { name: 'phone_number', type: 'string', required: true, description: 'Number to purchase' },
                { name: 'friendly_name', type: 'string', required: false, description: 'Display name' }
              ],
              response: { numberId: 'num_789', phoneNumber: '+60123456789' }
            }
          ]
        }
      ]
    },
    video: {
      name: 'Video APIs',
      icon: Video,
      color: 'green',
      apis: [
        {
          name: 'Video Rooms',
          description: 'Create and manage video conferencing rooms',
          methods: [
            {
              name: 'Create Video Room',
              method: 'POST' as const,
              endpoint: '/v1/video/rooms',
              description: 'Create a new video room',
              parameters: [
                { name: 'name', type: 'string', required: true, description: 'Room name' },
                { name: 'max_participants', type: 'number', required: false, description: 'Maximum participants' },
                { name: 'recording', type: 'boolean', required: false, description: 'Enable recording' }
              ],
              response: { roomId: 'room_abc', roomUrl: 'https://meet.maxis.com/room/abc' }
            },
            {
              name: 'Generate Access Token',
              method: 'POST' as const,
              endpoint: '/v1/video/rooms/{roomId}/tokens',
              description: 'Generate participant access token',
              parameters: [
                { name: 'roomId', type: 'string', required: true, description: 'Room identifier' },
                { name: 'identity', type: 'string', required: true, description: 'Participant identity' },
                { name: 'ttl', type: 'number', required: false, description: 'Token validity in seconds' }
              ],
              response: { token: 'eyJ0eXAi...', expiresAt: '2024-01-02T12:00:00Z' }
            }
          ]
        },
        {
          name: 'Meeting AI',
          description: 'AI-powered meeting features',
          methods: [
            {
              name: 'Start Transcription',
              method: 'POST' as const,
              endpoint: '/v1/video/rooms/{roomId}/transcription',
              description: 'Enable AI transcription for a meeting',
              parameters: [
                { name: 'roomId', type: 'string', required: true, description: 'Room ID' },
                { name: 'language', type: 'string', required: false, description: 'Transcription language' }
              ],
              response: { transcriptionId: 'trans_123', status: 'active' }
            }
          ]
        }
      ]
    },
    verification: {
      name: 'Verification & Identity',
      icon: Shield,
      color: 'orange',
      apis: [
        {
          name: 'OTP Verification',
          description: 'One-time password verification',
          methods: [
            {
              name: 'Send Verification Code',
              method: 'POST' as const,
              endpoint: '/v1/verify/send',
              description: 'Send OTP to user',
              parameters: [
                { name: 'to', type: 'string', required: true, description: 'Phone or email' },
                { name: 'channel', type: 'string', required: true, description: 'sms, whatsapp, or email' },
                { name: 'code_length', type: 'number', required: false, description: 'OTP length (4-10)' }
              ],
              response: { verificationId: 'verify_123', status: 'pending' }
            },
            {
              name: 'Check Verification Code',
              method: 'POST' as const,
              endpoint: '/v1/verify/check',
              description: 'Verify the OTP code',
              parameters: [
                { name: 'verification_id', type: 'string', required: true, description: 'Verification ID' },
                { name: 'code', type: 'string', required: true, description: 'User-provided code' }
              ],
              response: { status: 'approved', valid: true }
            }
          ]
        },
        {
          name: 'Number Lookup',
          description: 'Phone number intelligence',
          methods: [
            {
              name: 'Lookup Phone Number',
              method: 'GET' as const,
              endpoint: '/v1/lookup/{phoneNumber}',
              description: 'Get phone number information',
              parameters: [
                { name: 'phoneNumber', type: 'string', required: true, description: 'Phone number to lookup' },
                { name: 'type', type: 'string', required: false, description: 'carrier, caller-name, or both' }
              ],
              response: { number: '+60123456789', carrier: 'Maxis', valid: true }
            }
          ]
        }
      ]
    },
    analytics: {
      name: 'Analytics & Insights',
      icon: BarChart3,
      color: 'green',
      apis: [
        {
          name: 'Usage Analytics',
          description: 'API usage and metrics',
          methods: [
            {
              name: 'Get Usage Statistics',
              method: 'GET' as const,
              endpoint: '/v1/analytics/usage',
              description: 'Retrieve usage statistics',
              parameters: [
                { name: 'start_date', type: 'string', required: true, description: 'Start date (ISO 8601)' },
                { name: 'end_date', type: 'string', required: true, description: 'End date (ISO 8601)' },
                { name: 'granularity', type: 'string', required: false, description: 'hour, day, or month' }
              ],
              response: { total_requests: 1000, total_cost: 50.0 }
            }
          ]
        },
        {
          name: 'Call Analytics',
          description: 'Voice call metrics and quality',
          methods: [
            {
              name: 'Get Call Metrics',
              method: 'GET' as const,
              endpoint: '/v1/analytics/calls',
              description: 'Retrieve call quality metrics',
              parameters: [
                { name: 'call_id', type: 'string', required: false, description: 'Specific call ID' },
                { name: 'date_range', type: 'string', required: false, description: 'Date range filter' }
              ],
              response: { averageDuration: 120, totalCalls: 500 }
            }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    if (user) {
      loadProgress();
      checkExistingApiKeys();
    }
  }, [user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadProgress = async () => {
    try {
      const { data, error } = await db
        .from('developer_progress')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProgress(data);
        setCurrentStep(data.current_step);
      } else {
        const newProgress = {
          user_id: user?.id || '',
          current_step: 1,
          api_key_generated: false,
          sdk_downloaded: false,
          first_api_call: false,
          completed_tutorial: false,
          test_calls_made: 0,
          last_activity: new Date().toISOString()
        };

        const { data: inserted, error: insertError } = await db
          .from('developer_progress')
          .insert(newProgress)
          .select()
          .single();

        if (!insertError && inserted) {
          setProgress(inserted);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const checkExistingApiKeys = async () => {
    try {
      const { data, error } = await db
        .from('api_keys')
        .select('api_key_prefix, key_name')
        .eq('tenant_id', user?.user_metadata?.tenant_id)
        .eq('status', 'active')
        .maybeSingle();

      if (data && data.api_key_prefix) {
        setApiKey(data.api_key_prefix + '_' + '•'.repeat(32));
        setApiSecret('sk_' + '•'.repeat(48));
      }
    } catch (error) {
      console.error('Error checking API keys:', error);
    }
  };

  const updateProgress = async (updates: Partial<DeveloperProgress>) => {
    if (!progress) return;

    try {
      const { error } = await db
        .from('developer_progress')
        .update({
          ...updates,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setProgress({ ...progress, ...updates });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const generateApiKeys = async () => {
    try {
      const keyPrefix = `mk_live_${Math.random().toString(36).substring(2, 10)}`;
      const fullKey = `${keyPrefix}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const newApiSecret = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      const { error } = await db
        .from('api_keys')
        .insert({
          tenant_id: user?.user_metadata?.tenant_id,
          key_name: 'Production API Key',
          key_description: 'API key for production use',
          api_key_hash: fullKey,
          api_key_prefix: keyPrefix,
          status: 'active',
          total_requests: 0
        });

      if (error) throw error;

      setApiKey(fullKey);
      setApiSecret(newApiSecret);
      await updateProgress({ api_key_generated: true, current_step: 3 });
      setCurrentStep(3);
      setNotification({ type: 'success', message: 'API keys generated successfully!' });
    } catch (error) {
      console.error('Error generating API keys:', error);
      setNotification({ type: 'error', message: 'Failed to generate API keys' });
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(''), 2000);
      setNotification({ type: 'success', message: 'Copied to clipboard!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to copy' });
    }
  };

  const testApiCall = async () => {
    if (!apiKey) {
      setNotification({ type: 'error', message: 'Please generate API keys first' });
      return;
    }

    setTesting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResponse = {
        success: true,
        messageId: `msg_${Date.now()}`,
        status: 'sent',
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random().toString(36).substring(7)}`
      };

      setTestResponse(mockResponse);

      const logEntry = {
        timestamp: new Date().toISOString(),
        method: playgroundRequest.method,
        endpoint: playgroundRequest.endpoint,
        status: 200,
        duration: Math.floor(Math.random() * 500) + 100
      };

      setRequestLog(prev => [logEntry, ...prev].slice(0, 10));

      const newTestCount = (progress?.test_calls_made || 0) + 1;
      await updateProgress({
        first_api_call: true,
        test_calls_made: newTestCount
      });

      setNotification({ type: 'success', message: 'API call successful!' });
    } catch (error) {
      setTestResponse({
        success: false,
        error: 'API call failed',
        message: 'Please check your credentials and try again'
      });
      setNotification({ type: 'error', message: 'API call failed' });
    } finally {
      setTesting(false);
    }
  };

  const getCodeExample = (method: ApiMethod) => {
    const examples: Record<string, string> = {
      javascript: `// Install SDK: npm install @maxis/communications-sdk
import { MaxisClient } from '@maxis/communications-sdk';

const client = new MaxisClient({
  apiKey: '${apiKey || 'your-api-key'}',
  apiSecret: '${apiSecret ? '••••••••' : 'your-api-secret'}'
});

// ${method.name}
const response = await client.${method.method.toLowerCase()}('${method.endpoint}', ${JSON.stringify(
  Object.fromEntries(method.parameters.slice(0, 3).map(p => [p.name, `<${p.type}>`])),
  null,
  2
)});

console.log(response);`,

      python: `# Install SDK: pip install maxis-communications
from maxis import MaxisClient

client = MaxisClient(
    api_key='${apiKey || 'your-api-key'}',
    api_secret='${apiSecret ? '••••••••' : 'your-api-secret'}'
)

# ${method.name}
response = client.${method.method.toLowerCase()}('${method.endpoint}', ${JSON.stringify(
  Object.fromEntries(method.parameters.slice(0, 3).map(p => [p.name, `<${p.type}>`]))
)})

print(response)`,

      curl: `# ${method.name}
curl -X ${method.method} 'https://api.maxis.com${method.endpoint}' \\
  -H 'Authorization: Bearer ${apiKey || 'your-api-key'}' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(
    Object.fromEntries(method.parameters.slice(0, 3).map(p => [p.name, `<${p.type}>`])),
    null,
    2
  )}'`
    };

    return examples[selectedSDK] || examples.javascript;
  };

  const quickStartSteps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up for a free account and get instant access to all communication APIs',
      status: 'completed',
      action: null
    },
    {
      number: 2,
      title: 'Generate API Credentials',
      description: 'Create your API key and secret to authenticate your requests',
      status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending',
      action: generateApiKeys
    },
    {
      number: 3,
      title: 'Explore API Library',
      description: 'Browse our comprehensive API documentation and examples',
      status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending',
      action: () => setActiveTab('api-library')
    },
    {
      number: 4,
      title: 'Test in Playground',
      description: 'Make your first API call in our interactive playground',
      status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending',
      action: () => setActiveTab('playground')
    },
    {
      number: 5,
      title: 'Go Live',
      description: 'Deploy to production and start building amazing experiences',
      status: currentStep === 5 ? 'completed' : 'pending',
      action: null
    }
  ];

  const sdkOptions = [
    { id: 'javascript', name: 'JavaScript', icon: '📦' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'curl', name: 'cURL', icon: '💻' }
  ];

  const completionPercentage = Math.min(100, (currentStep / 5) * 100);

  const filteredApis = Object.entries(apiLibrary).filter(([key, category]) =>
    searchQuery === '' ||
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.apis.some(api =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex-1 overflow-auto bg-[#012419] p-8">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border ${
          notification.type === 'success'
            ? 'bg-green-500/20 border-green-500/50 text-green-400'
            : 'bg-red-500/20 border-red-500/50 text-red-400'
        } flex items-center gap-3 animate-slide-in`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Rocket className="w-10 h-10 text-[#39FF14]" />
              Developer Hub
            </h1>
            <p className="text-slate-400 text-lg">Comprehensive API library and interactive playground</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">{completionPercentage.toFixed(0)}%</div>
            <div className="text-slate-400 text-sm">Complete</div>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-3 mb-8">
          <div
            className="bg-gradient-to-r from-[#39FF14] to-[#32e012] h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-700">
        {[
          { id: 'quickstart', label: 'Quick Start', icon: Zap },
          { id: 'api-library', label: 'API Library', icon: Book },
          { id: 'playground', label: 'API Playground', icon: TestTube },
          { id: 'resources', label: 'Resources', icon: Package }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#39FF14] border-[#39FF14]'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {activeTab === 'quickstart' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
              <div className="bg-[#39FF14]/20/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-[#39FF14]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Integration</h3>
              <p className="text-slate-400 text-sm">
                Simple REST APIs and SDKs for all major programming languages
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast & Reliable</h3>
              <p className="text-slate-400 text-sm">
                99.9% uptime with global infrastructure for low-latency delivery
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
              <div className="bg-[#39FF14]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#39FF14]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Production Ready</h3>
              <p className="text-slate-400 text-sm">
                Battle-tested at scale with enterprise-grade security and compliance
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Quick Start Guide
            </h2>

            <div className="space-y-6">
              {quickStartSteps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.status === 'completed'
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                      : step.status === 'current'
                      ? 'bg-[#39FF14]/20/20 text-[#39FF14] border-2 border-[#39FF14] animate-pulse'
                      : 'bg-slate-700/50 text-slate-500 border-2 border-slate-600'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{step.number}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.description}</p>
                  </div>
                  {step.status === 'current' && step.action && (
                    <button
                      onClick={step.action}
                      className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-[#39FF14]/25 self-start"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {apiKey && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Key className="w-6 h-6 text-yellow-400" />
                Your API Credentials
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={apiKey}
                      readOnly
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(apiKey, 'apiKey')}
                      className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      {copiedCode === 'apiKey' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">API Secret</label>
                  <div className="flex gap-2">
                    <input
                      type={showApiSecret ? 'text' : 'password'}
                      value={apiSecret}
                      readOnly
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowApiSecret(!showApiSecret)}
                      className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      {showApiSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiSecret, 'apiSecret')}
                      className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      {copiedCode === 'apiSecret' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <strong>Keep your API secret secure!</strong> Never commit it to version control or expose it in client-side code.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'api-library' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Book className="w-6 h-6 text-[#39FF14]" />
                  Complete API Reference
                </h2>
                <p className="text-slate-400">Browse all available APIs, methods, and parameters</p>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {Object.entries(apiLibrary).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedCategory === key
                        ? `bg-${category.color}-500/20 border-${category.color}-500 text-${category.color}-400`
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredApis.map(([categoryKey, category]) => {
            if (selectedCategory && selectedCategory !== categoryKey) return null;

            return (
              <div key={categoryKey} className="space-y-4">
                {category.apis.map((api, apiIndex) => (
                  <div key={apiIndex} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{api.name}</h3>
                          <p className="text-slate-400 text-sm">{api.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedApi(selectedApi === api.name ? '' : api.name)}
                          className="text-[#39FF14] hover:text-[#39FF14] transition-colors"
                        >
                          {selectedApi === api.name ? 'Hide' : 'Show'} Methods
                        </button>
                      </div>
                    </div>

                    {selectedApi === api.name && (
                      <div className="p-6 space-y-6">
                        {api.methods.map((method, methodIndex) => (
                          <div key={methodIndex} className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  method.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                                  method.method === 'POST' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                  method.method === 'PUT' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                  method.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                                  'bg-[#39FF14]/20 text-[#39FF14]'
                                }`}>
                                  {method.method}
                                </span>
                                <code className="text-[#39FF14] font-mono text-sm">{method.endpoint}</code>
                              </div>
                              <button
                                onClick={() => {
                                  setPlaygroundRequest({
                                    ...playgroundRequest,
                                    method: method.method,
                                    endpoint: method.endpoint
                                  });
                                  setActiveTab('playground');
                                }}
                                className="text-xs bg-[#39FF14] hover:bg-[#32e012] text-black px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Play className="w-3 h-3" />
                                Try it
                              </button>
                            </div>

                            <p className="text-slate-300 mb-4">{method.description}</p>

                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-white mb-3">Parameters</h4>
                              <div className="space-y-2">
                                {method.parameters.map((param, paramIndex) => (
                                  <div key={paramIndex} className="flex items-start gap-3 text-sm">
                                    <code className="text-[#39FF14] font-mono">{param.name}</code>
                                    <span className="text-slate-500">{param.type}</span>
                                    {param.required && (
                                      <span className="text-red-400 text-xs">required</span>
                                    )}
                                    <span className="text-slate-400 flex-1">{param.description}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-white mb-2">Example Response</h4>
                              <pre className="bg-[#012419] border border-slate-700 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto">
                                <code>{JSON.stringify(method.response, null, 2)}</code>
                              </pre>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-white">Code Example</h4>
                                <div className="flex gap-2">
                                  {sdkOptions.map((sdk) => (
                                    <button
                                      key={sdk.id}
                                      onClick={() => setSelectedSDK(sdk.id)}
                                      className={`px-3 py-1 rounded text-xs ${
                                        selectedSDK === sdk.id
                                          ? 'bg-[#39FF14] text-white'
                                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                      }`}
                                    >
                                      {sdk.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="relative">
                                <button
                                  onClick={() => copyToClipboard(getCodeExample(method), `code-${methodIndex}`)}
                                  className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors z-10"
                                >
                                  {copiedCode === `code-${methodIndex}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <pre className="bg-[#012419] border border-slate-700 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto pr-12">
                                  <code>{getCodeExample(method)}</code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'playground' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TestTube className="w-6 h-6 text-[#39FF14]" />
              <h2 className="text-2xl font-bold text-white">Advanced API Playground</h2>
            </div>
            <p className="text-slate-400">Test APIs with real-time request/response inspection and logging</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Request Builder</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Method</label>
                    <select
                      value={playgroundRequest.method}
                      onChange={(e) => setPlaygroundRequest({ ...playgroundRequest, method: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Endpoint</label>
                    <input
                      type="text"
                      value={playgroundRequest.endpoint}
                      onChange={(e) => setPlaygroundRequest({ ...playgroundRequest, endpoint: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#39FF14]"
                      placeholder="/v1/messages/sms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Request Body (JSON)</label>
                    <textarea
                      value={playgroundRequest.body}
                      onChange={(e) => setPlaygroundRequest({ ...playgroundRequest, body: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#39FF14] h-40"
                      placeholder='{ "key": "value" }'
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Webhook URL (Optional)</label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                      placeholder="https://your-app.com/webhook"
                    />
                  </div>

                  <button
                    onClick={testApiCall}
                    disabled={testing || !apiKey}
                    className="w-full bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#39FF14]/25 font-medium"
                  >
                    {testing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Request
                      </>
                    )}
                  </button>

                  {!apiKey && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-200">
                        Please generate API credentials from the Quick Start tab first
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  Request Log
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {requestLog.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">No requests yet</p>
                  ) : (
                    requestLog.map((log, index) => (
                      <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              log.status === 200 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {log.status}
                            </span>
                            <span className="text-[#39FF14] font-mono">{log.method}</span>
                            <span className="text-slate-400">{log.endpoint}</span>
                          </div>
                          <span className="text-slate-500">{log.duration}ms</span>
                        </div>
                        <div className="text-slate-500">{log.timestamp}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Response</h3>
                {testResponse ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {testResponse.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`font-medium ${testResponse.success ? 'text-green-400' : 'text-red-400'}`}>
                        {testResponse.success ? 'Success (200 OK)' : 'Error'}
                      </span>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 relative">
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(testResponse, null, 2), 'response')}
                        className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"
                      >
                        {copiedCode === 'response' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <pre className="text-sm text-slate-300 overflow-x-auto pr-12">
                        <code>{JSON.stringify(testResponse, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-lg p-12 text-center">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">No response yet</p>
                    <p className="text-slate-600 text-sm mt-2">Send a request to see the response</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-[#39FF14]" />
                  Webhook Simulator
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Set a webhook URL to receive delivery receipts and status updates in real-time
                </p>
                <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Radio className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-[#39FF14]/70">
                      <strong>Webhook Status:</strong> {webhookUrl ? 'Configured' : 'Not configured'}
                      {webhookUrl && (
                        <div className="mt-2 text-xs text-[#39FF14] font-mono break-all">{webhookUrl}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {progress && progress.test_calls_made > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-400 font-medium mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {progress.test_calls_made} API {progress.test_calls_made === 1 ? 'call' : 'calls'} made
                  </div>
                  <div className="text-green-200 text-sm">
                    Keep testing to explore all API capabilities!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#39FF14]" />
              Developer Resources
            </h2>
            <p className="text-slate-400">Everything you need to build, test, and scale your integration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Book, title: 'API Documentation', description: 'Complete API reference with examples', link: '#' },
              { icon: Terminal, title: 'Interactive Console', description: 'Test APIs directly in your browser', link: '#' },
              { icon: Code, title: 'Code Samples', description: 'Production-ready code snippets', link: '#' },
              { icon: Rocket, title: 'Quick Start Guides', description: 'Step-by-step integration tutorials', link: '#' },
              { icon: Activity, title: 'Status Dashboard', description: 'Real-time API status and metrics', link: '#' },
              { icon: Shield, title: 'Security Best Practices', description: 'Keep your integration secure', link: '#' },
              { icon: Database, title: 'Webhooks Guide', description: 'Handle real-time events', link: '#' },
              { icon: Lightbulb, title: 'Use Cases', description: 'Inspiration and examples', link: '#' },
              { icon: Globe, title: 'Global Coverage', description: 'Available countries and carriers', link: '#' }
            ].map((resource, index) => {
              const Icon = resource.icon;
              return (
                <a
                  key={index}
                  href={resource.link}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-slate-700/50 rounded-lg group-hover:bg-slate-700 transition-colors">
                      <Icon className="w-6 h-6 text-[#39FF14]" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-[#39FF14] transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#39FF14] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{resource.description}</p>
                </a>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Need Help Getting Started?</h2>
                <p className="text-slate-400">
                  Our support team is here to help you integrate and go live faster
                </p>
              </div>
              <button className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-[#39FF14]/25">
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
