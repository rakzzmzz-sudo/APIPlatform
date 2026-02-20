import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import {
  LayoutDashboard, MessageSquare, Network, BookOpen, Activity, Wrench,
  Webhook, Database, MessageCircle, Plug, Key, Users, Folder,
  Plus, ChevronRight, ChevronDown, Settings, Play, Pause, Eye,
  Edit2, Trash2, Download, Filter, Search, BarChart3, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, Zap, Brain, Mic,
  Volume2, Radio, Server, Shield, Code, FileText, Globe, Phone, X,
  Info, Copy, Maximize2, Check, Languages, StopCircle, Sparkles
} from 'lucide-react';

const AI_MODELS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'], description: 'GPT-4 from OpenAI has broad general knowledge and domain expertise', logo: '🤖' },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'], description: 'A faster, cheaper yet still very capable version of Claude', logo: '🔮' },
  { id: 'gemini', name: 'Gemini', models: ['gemini-pro', 'gemini-2.5-pro'], description: 'Gemini is Google latest family of large language models', logo: '💎' },
  { id: 'mistral', name: 'Mistral', models: ['mistral-large', 'mistral-medium', 'mistral-small'], description: 'Mistral specializes in creating fast, secure, open-source LLMs', logo: '🌪️' },
  { id: 'cohere', name: 'Cohere', models: ['command', 'command-light'], description: 'A smaller and faster version of Cohere\'s command model', logo: '🎯' },
  { id: 'huggingface', name: 'Hugging Face', models: ['custom'], description: 'Hugging Face is a machine learning platform and community', logo: '🤗' },
];

const STT_PROVIDERS = [
  { id: 'assemblyai', name: 'AssemblyAI', description: 'Industry-leading AI models for speech-to-text, speaker diarization, and audio intelligence', logo: '🎙️', features: ['real-time', 'diarization', 'sentiment', 'entity-detection', 'language-detection'] },
  { id: 'deepgram', name: 'Deepgram', description: 'Cutting-edge speech recognition services using advanced AI', logo: '🎤' },
  { id: 'openai', name: 'OpenAI Whisper', description: 'Robust speech recognition model from OpenAI', logo: '🤖' },
  { id: 'google', name: 'Google Cloud', description: 'Google Cloud Speech-to-Text services', logo: '🌐' },
  { id: 'azure', name: 'Azure', description: 'Azure Speech Services with advanced AI', logo: '🔷' },
];

const TTS_PROVIDERS = [
  { id: 'assemblyai', name: 'AssemblyAI', description: 'High-quality neural text-to-speech with natural voices and emotional range', logo: '🎙️' },
  { id: 'openai', name: 'OpenAI', description: 'OpenAI Text-to-Speech with natural voices', logo: '🤖' },
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'Premium AI voice generation with emotional intelligence', logo: '🎭' },
  { id: 'azure', name: 'Azure', description: 'Azure Text-to-Speech with neural voices', logo: '🔷' },
  { id: 'google', name: 'Google Cloud', description: 'Google Cloud Text-to-Speech services', logo: '🌐' },
];

const TELEPHONY_PROVIDERS = [
  { id: 'vonage', name: 'Vonage', description: 'Cloud communication platform that provides voice, messaging, and video solutions', logo: '📞' },
  { id: 'twilio', name: 'Twilio', description: 'Cloud communications platform for building SMS, voice, and messaging applications', logo: '☎️' },
  { id: 'exotel', name: 'Exotel', description: 'Cloud telephony platform offering voice and messaging services for businesses', logo: '📱' },
  { id: 'aws', name: 'AWS', description: 'Amazon Web Services offers a broad set of global cloud-based products', logo: '☁️' },
  { id: 'google', name: 'Google Cloud', description: 'Google Cloud offers a suite of cloud computing services', logo: '🌐' },
];

interface Message {
  role: 'system' | 'user';
  content: string;
}

interface Tool {
  name: string;
  description: string;
  action: string;
  retrievalSetting: 'hybrid' | 'semantic' | 'fulltext';
  topK: number;
  scoreThreshold: number;
  parameters: string;
}

export default function VoiceAgentPlatform() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPlayModal, setShowPlayModal] = useState(false);
  const [playingAgent, setPlayingAgent] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [createStep, setCreateStep] = useState(1);
  const [editStep, setEditStep] = useState(1);

  // Call simulation states
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTranscript, setCallTranscript] = useState<Array<{speaker: string, text: string, timestamp: string, sentiment?: string}>>([]);
  const [callSentiment, setCallSentiment] = useState<string>('neutral');
  const [recognizedEntities, setRecognizedEntities] = useState<Array<{type: string, value: string}>>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  // AssemblyAI configuration
  const [assemblyAIConfig, setAssemblyAIConfig] = useState({
    apiKey: '',
    realtimeEnabled: true,
    diarizationEnabled: true,
    sentimentEnabled: true,
    entityDetection: true,
    languageDetection: true,
    customVocabulary: []
  });

  const [newAgent, setNewAgent] = useState({
    agent_name: '',
    agent_description: '',
    tags: [] as string[],
    ai_model: 'gpt-4',
    ai_provider: 'openai',
    credential: '',
    stt_provider: 'assemblyai',
    tts_provider: 'assemblyai',
    telephony_provider: 'twilio',
    voice_provider: 'assemblyai',
    system_prompt: '',
    status: 'testing'
  });

  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: '' }
  ]);

  const [tools, setTools] = useState<Tool[]>([]);
  const [showToolModal, setShowToolModal] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>({
    name: 'knowledge_query',
    description: 'Use this tool to retrieve specific information or data from provided queries before responding.',
    action: 'knowledge_retrieval',
    retrievalSetting: 'hybrid',
    topK: 5,
    scoreThreshold: 0.5,
    parameters: JSON.stringify({
      properties: {
        context: {
          description: "Concise and searchable description of the users query or topic.",
          type: "string"
        },
        organizations: {
          description: "Names of organizations or companies mentioned in the content",
          type: "array"
        }
      }
    }, null, 2)
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const { data, error } = await db
        .from('voice_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
      if (data && data.length > 0) {
        setSelectedAgent(data[0]);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedSampleBots = async () => {
    const SAMPLE_BOTS = [
      { name: 'Salesforce Sales Assistant', description: 'AI assistant for Salesforce CRM - handles lead qualification, opportunity tracking, and sales pipeline management', agent_type: 'inbound', status: 'active', voice_type: 'female', language: 'en-US', greeting_message: 'Hello! I\'m your Salesforce assistant. I can help you manage leads, track opportunities, and update your sales pipeline. How can I assist you today?' },
      { name: 'ServiceNow IT Support Bot', description: 'AI assistant for ServiceNow ITSM - manages incident tickets, service requests, and IT service catalog', agent_type: 'blended', status: 'active', voice_type: 'neutral', language: 'en-US', greeting_message: 'Welcome to IT Support. I can help you create incidents, track service requests, or browse our IT service catalog. What do you need help with?' },
      { name: 'HubSpot Marketing Assistant', description: 'AI assistant for HubSpot - handles contact management, deal tracking, and marketing automation', agent_type: 'inbound', status: 'active', voice_type: 'female', language: 'en-US', greeting_message: 'Hi! I\'m your HubSpot marketing assistant. I can help with contact management, deal tracking, email campaigns, and marketing analytics. What would you like to do?' },
      { name: 'Microsoft Teams Collaboration Bot', description: 'AI assistant for Microsoft Teams - schedules meetings, manages tasks, and facilitates team collaboration', agent_type: 'inbound', status: 'active', voice_type: 'neutral', language: 'en-US', greeting_message: 'Hello! I\'m your Teams collaboration assistant. I can schedule meetings, create tasks, share files, and help coordinate with your team. How can I help?' },
      { name: 'Zoom Meeting Assistant', description: 'AI assistant for Zoom - schedules meetings, manages recordings, and provides meeting analytics', agent_type: 'inbound', status: 'active', voice_type: 'female', language: 'en-US', greeting_message: 'Welcome! I\'m your Zoom meeting assistant. I can schedule meetings, share meeting links, manage recordings, and provide analytics. What would you like to do?' },
      { name: 'Webex Enterprise Assistant', description: 'AI assistant for Cisco Webex - manages enterprise communication, meetings, and team collaboration', agent_type: 'blended', status: 'active', voice_type: 'neutral', language: 'en-US', greeting_message: 'Hello! I\'m your Webex assistant. I can help with meeting scheduling, team spaces, messaging, and enterprise communication. How may I assist you?' },
      { name: 'PBX Call Management Bot', description: 'AI assistant for traditional PBX systems - handles call routing, extensions, and voicemail', agent_type: 'inbound', status: 'active', voice_type: 'male', language: 'en-US', greeting_message: 'Thank you for calling. I\'m your PBX assistant. I can route you to extensions, manage voicemail, or answer questions about our services. How can I direct your call?' },
      { name: 'Genesys Contact Center Agent', description: 'AI assistant for Genesys Cloud - manages customer interactions, queue management, and agent assistance', agent_type: 'blended', status: 'active', voice_type: 'female', language: 'en-US', greeting_message: 'Welcome to customer service. I\'m your Genesys assistant. I can help route your call, provide information, or connect you with a specialist. How can I help you today?' },
      { name: 'NICE Workforce Assistant', description: 'AI assistant for NICE WFM - handles workforce optimization, scheduling, and performance management', agent_type: 'inbound', status: 'active', voice_type: 'neutral', language: 'en-US', greeting_message: 'Hello! I\'m your NICE workforce assistant. I can help with scheduling, time-off requests, performance metrics, and workforce planning. What do you need?' },
      { name: 'CUCM Call Manager Bot', description: 'AI assistant for Cisco Unified Call Manager - manages enterprise telephony and call routing', agent_type: 'inbound', status: 'active', voice_type: 'male', language: 'en-US', greeting_message: 'Welcome. I\'m your CUCM assistant. I can help with call routing, extension management, and telephony services. How may I direct your call?' },
      { name: 'UCCX Contact Center Bot', description: 'AI assistant for Cisco Unified Contact Center Express - handles IVR, queuing, and agent routing', agent_type: 'blended', status: 'active', voice_type: 'female', language: 'en-US', greeting_message: 'Thank you for calling. I\'m your UCCX contact center assistant. I can help route your call, provide self-service options, or connect you with an agent. How can I help?' },
      { name: 'UCCE Enterprise Agent', description: 'AI assistant for Cisco Unified Contact Center Enterprise - manages enterprise-scale omnichannel routing', agent_type: 'blended', status: 'active', voice_type: 'neutral', language: 'en-US', greeting_message: 'Welcome to enterprise customer service. I\'m your UCCE assistant, handling omnichannel routing and customer interactions. How can I assist you?' },
      { name: 'Talkdesk Cloud Agent', description: 'AI assistant for Talkdesk - manages cloud contact center operations and customer engagement', agent_type: 'blended', status: 'active', voice_type: 'female', language: 'en-US', greeting_message: 'Hello! I\'m your Talkdesk assistant. I can help with customer inquiries, route calls, provide analytics, and enhance your contact center experience. How may I help?' }
    ];

    setLoading(true);
    try {
      const botsToInsert = SAMPLE_BOTS.map(bot => ({
        name: bot.name,
        description: bot.description,
        agent_type: bot.agent_type,
        status: bot.status,
        voice_type: bot.voice_type,
        language: bot.language,
        greeting_message: bot.greeting_message,
        total_calls: Math.floor(Math.random() * 500),
        successful_calls: Math.floor(Math.random() * 400),
        avg_duration: Math.floor(Math.random() * 180) + 60,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await db.from('voice_agents').insert(botsToInsert);
      
      if (error) throw error;
      
      alert(`✅ Successfully created ${SAMPLE_BOTS.length} sample AI assistants!`);
      loadAgents();
    } catch (error) {
      console.error('Error seeding bots:', error);
      alert('Failed to create sample bots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    try {
      const { data: { user } } = await db.auth.getUser();
      if (!user) {
        alert('You must be logged in to create an agent');
        return;
      }

      setLoading(true);
      const { error } = await db
        .from('voice_agents')
        .insert([{
          name: newAgent.agent_name,
          description: newAgent.agent_description,
          status: newAgent.status,
          voice_type: newAgent.voice_provider === 'elevenlabs' ? 'female' : 'neutral',
          language: 'en-US',
          ai_model: newAgent.ai_model,
          prompts: JSON.stringify({ system: newAgent.system_prompt }),
          greeting_message: 'Hello! How can I help you today?',
          total_calls: 0,
          successful_calls: 0,
          avg_duration: 0,
          created_by: user.id,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      alert('Voice assistant created successfully!');
      setShowCreateModal(false);
      setCreateStep(1);
      setNewAgent({
        agent_name: '',
        agent_description: '',
        tags: [],
        ai_model: 'gpt-4',
        ai_provider: 'openai',
        credential: '',
        stt_provider: 'deepgram',
        tts_provider: 'elevenlabs',
        telephony_provider: 'twilio',
        voice_provider: 'elevenlabs',
        system_prompt: '',
        status: 'testing'
      });
      setMessages([{ role: 'system', content: '' }]);
      setTools([]);
      loadAgents();
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create voice assistant. Please check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (agent: any) => {
    setSelectedAgent(agent);
    setNewAgent({
      agent_name: agent.name || agent.agent_name || '',
      agent_description: agent.description || agent.agent_description || '',
      tags: [],
      ai_model: agent.ai_model || 'gpt-4',
      ai_provider: agent.ai_provider || 'openai',
      credential: '',
      stt_provider: agent.stt_provider || 'deepgram',
      tts_provider: agent.voice_provider || 'elevenlabs',
      telephony_provider: 'twilio',
      voice_provider: agent.voice_provider || 'elevenlabs',
      system_prompt: agent.prompts ? (typeof agent.prompts === 'string' ? JSON.parse(agent.prompts).system : agent.prompts.system) : '',
      status: agent.status || 'testing'
    });
    
    setMessages([{ role: 'system', content: agent.prompts ? (typeof agent.prompts === 'string' ? JSON.parse(agent.prompts).system : agent.prompts.system) : '' }]);
    
    if (agent.skills) {
      try {
        setTools(typeof agent.skills === 'string' ? JSON.parse(agent.skills) : agent.skills);
      } catch (e) {
        setTools([]);
      }
    } else {
      setTools([]);
    }
    
    setShowEditModal(true);
    setEditStep(1);
  };

  const handleUpdateAgent = async () => {
    try {
      if (!selectedAgent) return;
      setLoading(true);

      const { error } = await db
        .from('voice_agents')
        .update({
          name: newAgent.agent_name,
          description: newAgent.agent_description,
          status: newAgent.status,
          voice_type: newAgent.voice_provider === 'elevenlabs' ? 'female' : 'neutral',
          language: 'en-US',
          prompts: JSON.stringify({ system: newAgent.system_prompt }),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedAgent.id);

      if (error) throw error;

      alert('Voice assistant updated successfully!');
      setShowEditModal(false);
      setEditStep(1);
      setSelectedAgent(null);
      setNewAgent({
        agent_name: '',
        agent_description: '',
        tags: [],
        ai_model: 'gpt-4',
        ai_provider: 'openai',
        credential: '',
        stt_provider: 'deepgram',
        tts_provider: 'elevenlabs',
        telephony_provider: 'twilio',
        voice_provider: 'elevenlabs',
        system_prompt: '',
        status: 'testing'
      });
      setMessages([{ role: 'system', content: '' }]);
      setTools([]);
      loadAgents();
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('Failed to update voice assistant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgent = (agent: any) => {
    setPlayingAgent(agent);
    setShowPlayModal(true);
    setIsPlaying(false);
    setIsCallActive(false);
    setCallTranscript([]);
    setCallSentiment('neutral');
    setRecognizedEntities([]);
    setCallDuration(0);
    setCallStartTime(null);
  };

  const startCallSimulation = () => {
    if (!playingAgent) return;
    
    setIsCallActive(true);
    setCallStartTime(new Date());
    setCallTranscript([]);
    
    // Simulate call flow with realistic conversation
    const platformName = playingAgent.name.split(' ')[0]; // Extract platform name
    
    // Greeting from bot
    setTimeout(() => {
      const greeting = playingAgent.greeting_message || 'Hello, how can I assist you today?';
      addTranscriptEntry('Agent', greeting, 'positive');
      handlePlayVoice(greeting);
    }, 500);
    
    // Simulated user response
    setTimeout(() => {
      const userQuery = `I need help with ${platformName} configuration`;
      addTranscriptEntry('User', userQuery, 'neutral');
      
      // Detect entities in user query
      setRecognizedEntities([
        { type: 'platform', value: platformName },
        { type: 'intent', value: 'configuration_help' }
      ]);
    }, 3000);
    
    // Bot response
    setTimeout(() => {
      const response = `I'd be happy to help you with ${platformName} configuration. What specific aspect would you like to configure?`;
      addTranscriptEntry('Agent', response, 'positive');
      handlePlayVoice(response);
      setCallSentiment('positive');
    }, 5000);
    
    // User provides details
    setTimeout(() => {
      const userDetail = 'I want to set up a new connection and configure the API settings.';
      addTranscriptEntry('User', userDetail, 'neutral');
      
      // Update entities
      setRecognizedEntities(prev => [
        ...prev,
        { type: 'action', value: 'setup_connection' },
        { type: 'component', value: 'API settings' }
      ]);
    }, 8000);
    
    // Bot provides solution
    setTimeout(() => {
      const solution = `Perfect! To set up a new ${platformName} connection, I'll guide you through three steps: First, navigate to the integration settings. Second, enter your API credentials. Finally, test the connection. Would you like me to walk you through each step?`;
      addTranscriptEntry('Agent', solution, 'positive');
      handlePlayVoice(solution);
    }, 11000);
    
    // User confirms
    setTimeout(() => {
      addTranscriptEntry('User', 'Yes, that would be great!', 'positive');
      setCallSentiment('positive');
    }, 15000);
    
    // Bot continues
    setTimeout(() => {
      const instruction = 'Excellent! Let\'s start with step one. Please open your settings panel and look for the integrations tab...';
      addTranscriptEntry('Agent', instruction, 'positive');
      handlePlayVoice(instruction);
    }, 17000);
  };

  const endCallSimulation = () => {
    setIsCallActive(false);
    handleStopVoice();
    
    if (callStartTime) {
      const duration = Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000);
      setCallDuration(duration);
    }
  };

  const addTranscriptEntry = (speaker: string, text: string, sentiment: string = 'neutral') => {
    const timestamp = new Date().toLocaleTimeString();
    setCallTranscript(prev => [
      ...prev,
      { speaker, text, timestamp, sentiment }
    ]);
  };

  const handlePlayVoice = (text: string, language: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      if (isPlaying && currentUtterance) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentUtterance(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Text-to-speech is not supported in your browser.');
    }
  };

  const handleStopVoice = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  const addMessage = () => {
    setMessages([...messages, { role: 'user', content: '' }]);
  };

  const updateMessage = (index: number, field: 'role' | 'content', value: string) => {
    const updated = [...messages];
    updated[index] = { ...updated[index], [field]: value };
    setMessages(updated);
  };

  const removeMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  const addTool = () => {
    setTools([...tools, currentTool]);
    setShowToolModal(false);
    setCurrentTool({
      name: 'knowledge_query',
      description: 'Use this tool to retrieve specific information or data from provided queries before responding.',
      action: 'knowledge_retrieval',
      retrievalSetting: 'hybrid',
      topK: 5,
      scoreThreshold: 0.5,
      parameters: JSON.stringify({
        properties: {
          context: {
            description: "Concise and searchable description of the users query or topic.",
            type: "string"
          }
        }
      }, null, 2)
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !newAgent.tags.includes(tagInput.trim())) {
      setNewAgent({ ...newAgent, tags: [...newAgent.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewAgent({ ...newAgent, tags: newAgent.tags.filter(t => t !== tag) });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
    { id: 'assistants', label: 'Assistants', icon: MessageSquare, section: 'main', badge: 'beta' },
    { id: 'endpoints', label: 'Endpoints', icon: Network, section: 'main' },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen, section: 'main' },
    { id: 'models', label: 'Models', icon: Brain, section: 'main' },
  ];

  const observabilityItems = [
    { id: 'llm-logs', label: 'LLM logs', icon: Activity },
    { id: 'tool-logs', label: 'Tool logs', icon: Wrench },
    { id: 'webhook-logs', label: 'Webhook logs', icon: Webhook },
    { id: 'knowledge-logs', label: 'Knowledge logs', icon: Database },
    { id: 'conversation-logs', label: 'Conversation logs', icon: MessageCircle },
  ];

  const integrationItems = [
    { id: 'external-integrations', label: 'External integrations', icon: Plug },
    { id: 'credentials', label: 'Credentials', icon: Key },
  ];

  const organizationItems = [
    { id: 'users-teams', label: 'Users and Teams', icon: Users },
    { id: 'projects', label: 'Projects', icon: Folder },
  ];

  const renderCreateModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Setup Progress</h3>
            <p className="text-sm text-gray-600">Complete all steps to create new assistant</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  createStep >= 1 ? 'bg-[#39FF14] text-black' : 'bg-slate-700 text-slate-400'
                }`}>
                  {createStep > 1 ? <Check className="w-5 h-5" /> : '01'}
                </div>
                <div className={`w-0.5 h-16 ${createStep > 1 ? 'bg-[#39FF14]' : 'bg-slate-700'}`}></div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Step 1</h4>
                <p className="text-[#39FF14] font-semibold mb-1">Configuration</p>
                <p className="text-sm text-gray-600">Select the llm you want to use for your assistant.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  createStep >= 2 ? 'bg-[#39FF14] text-black' : 'bg-slate-700 text-slate-400'
                }`}>
                  {createStep > 2 ? <Check className="w-5 h-5" /> : '02'}
                </div>
                <div className={`w-0.5 h-16 ${createStep > 2 ? 'bg-[#39FF14]' : 'bg-slate-700'}`}></div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Step 2</h4>
                <p className={`font-semibold mb-1 ${createStep >= 2 ? 'text-[#39FF14]' : 'text-slate-400'}`}>Tools (optional)</p>
                <p className="text-sm text-gray-600">Let your assistant work with given differnt tools on behalf of you</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  createStep >= 3 ? 'bg-[#39FF14] text-black' : 'bg-slate-700 text-slate-400'
                }`}>
                  {createStep > 3 ? <Check className="w-5 h-5" /> : '03'}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Step 3</h4>
                <p className={`font-semibold mb-1 ${createStep >= 3 ? 'text-[#39FF14]' : 'text-slate-400'}`}>Profile</p>
                <p className="text-sm text-gray-600">Provide the name, a brief description, and relevant tags for your assistant to help identify and categorize it.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>Deployment</span>
                <ChevronRight className="w-4 h-4" />
                <span>Assistant</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Create-Assistant</span>
              </div>
            </div>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {createStep === 1 && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800">
                      Rapida Assistant enables you to deploy intelligent conversational agents across multiple channels.
                    </p>
                  </div>
                  <a href="#" className="text-sm text-yellow-700 hover:text-yellow-800 font-semibold whitespace-nowrap">
                    Read documentation →
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Provider Model</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newAgent.ai_provider}
                      onChange={(e) => {
                        const provider = AI_MODELS.find(m => m.id === e.target.value);
                        setNewAgent({
                          ...newAgent,
                          ai_provider: e.target.value,
                          ai_model: provider?.models[0] || ''
                        });
                      }}
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                    >
                      {AI_MODELS.map(model => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                    <select
                      value={newAgent.ai_model}
                      onChange={(e) => setNewAgent({ ...newAgent, ai_model: e.target.value })}
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                    >
                      {AI_MODELS.find(m => m.id === newAgent.ai_provider)?.models.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Credential</label>
                  <div className="flex gap-2">
                    <select
                      value={newAgent.credential}
                      onChange={(e) => setNewAgent({ ...newAgent, credential: e.target.value })}
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                    >
                      <option value="">Select credential</option>
                      <option value="default">Default Credential</option>
                    </select>
                    <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instruction</label>
                  {messages.map((message, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex gap-2 mb-2">
                        <select
                          value={message.role}
                          onChange={(e) => updateMessage(index, 'role', e.target.value)}
                          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm"
                        >
                          <option value="system">System</option>
                          <option value="user">User</option>
                        </select>
                        <div className="flex gap-2 ml-auto">
                          <button
                            onClick={() => removeMessage(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={message.content}
                        onChange={(e) => updateMessage(index, 'content', e.target.value)}
                        placeholder="Write your prompt here. enter {{variable}} to insert a variable."
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 min-h-32"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addMessage}
                    className="text-[#39FF14] hover:text-[#32e012] font-semibold text-sm flex items-center gap-2"
                  >
                    Add new message
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {createStep === 2 && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Configure Tools</h3>
                  {tools.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {tools.map((tool, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                <span>Action: {tool.action}</span>
                                <span>•</span>
                                <span>Retrieval: {tool.retrievalSetting}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setTools(tools.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setShowToolModal(true)}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:border-[#39FF14] hover:bg-[#39FF14]/5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#39FF14] font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Add Tool
                  </button>
                </div>
              </div>
            )}

            {createStep === 3 && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newAgent.agent_name}
                    onChange={(e) => setNewAgent({ ...newAgent, agent_name: e.target.value })}
                    placeholder="e.g., assistant-pay-tales-how"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                  />
                  <p className="text-sm text-gray-600 mt-1">Provide a name, that will appear in the assistant list and help identify it.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={newAgent.agent_description}
                    onChange={(e) => setNewAgent({ ...newAgent, agent_description: e.target.value })}
                    placeholder="What's the purpose of the assistant?"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 h-24"
                  />
                  <p className="text-sm text-gray-600 mt-1">Provide a description to explain what this assistant is about.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (Optional)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add tags"
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                    />
                  </div>
                  {newAgent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newAgent.tags.map((tag, index) => (
                        <span key={index} className="bg-[#39FF14]/20 text-[#39FF14] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-[#32e012]">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-600">Add tags to organize and locate items more efficiently. Separate tags with commas and press Enter to add them.</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-6 flex justify-between">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              {createStep > 1 && (
                <button
                  onClick={() => setCreateStep(createStep - 1)}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              {createStep < 3 ? (
                <button
                  onClick={() => setCreateStep(createStep + 1)}
                  className="px-6 py-2.5 bg-[#39FF14] text-black rounded-lg font-semibold hover:bg-[#32e012] flex items-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleCreateAgent}
                  className="px-6 py-2.5 bg-[#39FF14] text-black rounded-lg font-semibold hover:bg-[#32e012] flex items-center gap-2"
                >
                  Create assistant
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showToolModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Configure Assistant Tool</h3>
              <button onClick={() => setShowToolModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Action</label>
                <div className="space-y-2">
                  {[
                    { id: 'knowledge_retrieval', label: 'Knowledge Retrieval', checked: true },
                    { id: 'api_request', label: 'API Request' },
                    { id: 'endpoint_llm', label: 'Endpoint (LLM Call)' },
                    { id: 'put_on_hold', label: 'Put On Hold' },
                    { id: 'end_conversation', label: 'End Of Conversation' }
                  ].map((action) => (
                    <label key={action.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentTool.action === action.id}
                        onChange={() => setCurrentTool({ ...currentTool, action: action.id })}
                        className="w-4 h-4 text-[#39FF14]"
                      />
                      <span className="text-sm font-medium text-gray-900">{action.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Retrieval Setting</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'hybrid', label: 'Hybrid Search', desc: 'Execute full-text search and vector searches simultaneously, re-rank to select the best match for the user\'s query.' },
                    { id: 'semantic', label: 'Semantic Search', desc: 'Generate query embeddings and search for the text chunk most similar to its vector representation.' },
                    { id: 'fulltext', label: 'Full Text Search', desc: 'Index all terms in the document, allowing users to search any term and retrieve relevant text chunk containing those terms.' }
                  ].map((setting) => (
                    <button
                      key={setting.id}
                      onClick={() => setCurrentTool({ ...currentTool, retrievalSetting: setting.id as any })}
                      className={`text-left p-4 border-2 rounded-lg transition-all ${
                        currentTool.retrievalSetting === setting.id
                          ? 'border-[#39FF14] bg-[#39FF14]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1 text-sm">{setting.label}</div>
                      <p className="text-xs text-gray-600">{setting.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Top K</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={currentTool.topK}
                      onChange={(e) => setCurrentTool({ ...currentTool, topK: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold text-gray-900 w-8">{currentTool.topK}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Score Threshold</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={currentTool.scoreThreshold}
                      onChange={(e) => setCurrentTool({ ...currentTool, scoreThreshold: parseFloat(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold text-gray-900 w-8">{currentTool.scoreThreshold}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Tool Definition</label>
                  <button className="text-xs text-[#39FF14] hover:text-[#32e012]">Collapse</button>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-yellow-800">
                    Know more about knowledge tool definiation that can be supported by rapida
                    <a href="#" className="ml-2 text-yellow-700 hover:text-yellow-900 font-semibold">Read documentation →</a>
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={currentTool.name}
                      onChange={(e) => setCurrentTool({ ...currentTool, name: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={currentTool.description}
                      onChange={(e) => setCurrentTool({ ...currentTool, description: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parameters</label>
                    <textarea
                      value={currentTool.parameters}
                      onChange={(e) => setCurrentTool({ ...currentTool, parameters: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-green-400 font-mono text-sm h-48"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowToolModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addTool}
                className="px-6 py-2.5 bg-[#39FF14] text-black rounded-lg font-semibold hover:bg-[#32e012]"
              >
                Save tool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-green-500/50 transition-all">
          <div className="w-14 h-14 bg-[#39FF14]/20 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-7 h-7 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI Assistants</h3>
          <p className="text-gray-400 text-sm mb-4">
            Deploy domain-specific AI agents with custom skills, workflows, and multi-step reasoning.
          </p>
          <button
            onClick={() => setActiveSection('assistants')}
            className="text-green-400 font-semibold text-sm hover:text-green-300 transition-colors"
          >
            Learn more →
          </button>
        </div>

        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-[#39FF14]/50 transition-all">
          <div className="w-14 h-14 bg-[#39FF14]/20 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-[#39FF14]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Governance & Endpoints</h3>
          <p className="text-gray-400 text-sm mb-4">
            Secure API endpoints with fine-grained governance, audit trails, and enterprise-grade access control.
          </p>
          <button
            onClick={() => setActiveSection('endpoints')}
            className="text-[#39FF14] font-semibold text-sm hover:text-[#39FF14] transition-colors"
          >
            Learn more →
          </button>
        </div>

        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-[#39FF14]/50 transition-all">
          <div className="w-14 h-14 bg-[#39FF14]/20 rounded-lg flex items-center justify-center mb-4">
            <Brain className="w-7 h-7 text-[#39FF14]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Model Integration</h3>
          <p className="text-gray-400 text-sm mb-4">
            Bring your own model — support for OpenAI, Anthropic, and custom LLMs with fine-tuning capabilities.
          </p>
          <button
            onClick={() => setActiveSection('models')}
            className="text-[#39FF14] font-semibold text-sm hover:text-[#39FF14] transition-colors"
          >
            Learn more →
          </button>
        </div>

        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-[#39FF14]/50 transition-all">
          <div className="w-14 h-14 bg-[#39FF14]/20 rounded-lg flex items-center justify-center mb-4">
            <Activity className="w-7 h-7 text-[#39FF14]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Real-time Testing & Monitoring</h3>
          <p className="text-gray-400 text-sm mb-4">
            Instantly test AI agents and monitor performance in a live sandbox to iterate faster with confidence.
          </p>
          <button
            onClick={() => {
              setActiveSection('observability');
              setActiveSubSection('llm-logs');
            }}
            className="text-[#39FF14] font-semibold text-sm hover:text-[#39FF14] transition-colors"
          >
            Learn more →
          </button>
        </div>

        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-[#39FF14]/50 transition-all">
          <div className="w-14 h-14 bg-[#39FF14]/20 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="w-7 h-7 text-[#39FF14]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Conversational AI</h3>
          <p className="text-gray-400 text-sm mb-4">
            Context-aware, LLM-powered chat experiences that understand user intent and deliver accurate responses.
          </p>
          <button
            onClick={() => setActiveSection('assistants')}
            className="text-[#39FF14] font-semibold text-sm hover:text-[#39FF14] transition-colors"
          >
            Learn more →
          </button>
        </div>

        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-[#39FF14]/50 transition-all">
          <div className="w-14 h-14 bg-[#39FF14]/20 rounded-lg flex items-center justify-center mb-4">
            <Plug className="w-7 h-7 text-[#39FF14]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Enterprise Integrations</h3>
          <p className="text-gray-400 text-sm mb-4">
            Connect to CRM, databases, and third-party APIs with secure credential management.
          </p>
          <button
            onClick={() => {
              setActiveSection('integrations');
              setActiveSubSection('external-integrations');
            }}
            className="text-[#39FF14] font-semibold text-sm hover:text-[#39FF14] transition-colors"
          >
            Learn more →
          </button>
        </div>
      </div>

      {selectedAgent && (
        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30]">
          <h3 className="text-xl font-bold text-white mb-4">Active Agent Statistics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Total Calls</div>
              <div className="text-3xl font-bold text-white">{selectedAgent.total_calls || 0}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Success Rate</div>
              <div className="text-3xl font-bold text-green-400">
                {selectedAgent.total_calls > 0
                  ? ((selectedAgent.successful_calls / selectedAgent.total_calls) * 100).toFixed(1)
                  : 0}%
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Avg Duration</div>
              <div className="text-3xl font-bold text-white">
                {Math.floor((selectedAgent.avg_duration || 0) / 60)}m
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Status</div>
              <div className={`text-xl font-bold ${
                selectedAgent.status === 'active' ? 'text-green-400' :
                selectedAgent.status === 'testing' ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {selectedAgent.status}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAssistants = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-green-400" />
            AI Assistants
            <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium">BETA</span>
          </h2>
          <p className="text-gray-400">Manage and deploy intelligent voice assistants</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={seedSampleBots}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <Sparkles className="w-5 h-5" />
            Load Sample Bots
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Assistant
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-green-500/50 transition-all cursor-pointer"
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    agent.status === 'testing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{agent.description}</p>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">AI Model</div>
                    <div className="text-sm font-semibold text-white">{agent.ai_model || 'GPT-4'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Language</div>
                    <div className="text-sm font-semibold text-white">{agent.language}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Voice</div>
                    <div className="text-sm font-semibold text-white">{agent.voice_type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Calls</div>
                    <div className="text-sm font-semibold text-white">{agent.total_calls}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                    <div className="text-sm font-semibold text-green-400">
                      {agent.total_calls > 0
                        ? ((agent.successful_calls / agent.total_calls) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(agent);
                  }}
                  className="p-2 text-gray-400 hover:text-[#39FF14] hover:bg-[#024d30] rounded-lg transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAgent(agent);
                  }}
                  className="p-2 text-gray-400 hover:text-green-400 hover:bg-[#024d30] rounded-lg transition-all"
                  title="Test Voice Assistant"
                >
                  <Play className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#024d30] rounded-lg transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-[#39FF14]" />
          Integration Models
        </h2>
        <p className="text-gray-400">Available AI models and service providers for your voice assistants</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">AI Language Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_MODELS.map((model) => (
            <div key={model.id} className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-green-500/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{model.logo}</span>
                <div>
                  <h4 className="text-lg font-bold text-white">{model.name}</h4>
                  <p className="text-xs text-gray-500">{model.models.length} models available</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">{model.description}</p>
              <div className="flex flex-wrap gap-2">
                {model.models.map(m => (
                  <span key={m} className="px-2 py-1 bg-[#024d30] text-gray-300 rounded text-xs font-mono">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Speech-to-Text Providers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STT_PROVIDERS.map((provider) => (
            <div key={provider.id} className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-green-500/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{provider.logo}</span>
                <h4 className="text-lg font-bold text-white">{provider.name}</h4>
              </div>
              <p className="text-sm text-gray-400">{provider.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Text-to-Speech Providers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TTS_PROVIDERS.map((provider) => (
            <div key={provider.id} className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-green-500/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{provider.logo}</span>
                <h4 className="text-lg font-bold text-white">{provider.name}</h4>
              </div>
              <p className="text-sm text-gray-400">{provider.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Telephony Providers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TELEPHONY_PROVIDERS.map((provider) => (
            <div key={provider.id} className="bg-[#012419] rounded-xl p-6 border border-[#024d30] hover:border-green-500/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{provider.logo}</span>
                <h4 className="text-lg font-bold text-white">{provider.name}</h4>
              </div>
              <p className="text-sm text-gray-400">{provider.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEndpoints = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Network className="w-8 h-8 text-[#39FF14]" />
            API Endpoints
          </h2>
          <p className="text-gray-400">Secure API endpoints with governance and access control</p>
        </div>
        <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Endpoint
        </button>
      </div>

      <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30]">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2">Voice Agent API</h3>
          <p className="text-gray-400 text-sm">RESTful API for voice agent interactions</p>
        </div>
        <div className="space-y-4">
          <div className="bg-[#013221] rounded-lg p-4 border border-[#024d30]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">POST</span>
                <code className="text-[#39FF14]">/api/v1/agents/call</code>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Eye className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">Initiate a voice call with an AI agent</p>
          </div>

          <div className="bg-[#013221] rounded-lg p-4 border border-[#024d30]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs font-bold rounded">GET</span>
                <code className="text-[#39FF14]">/api/v1/agents/:id</code>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Eye className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">Get agent configuration and status</p>
          </div>

          <div className="bg-[#013221] rounded-lg p-4 border border-[#024d30]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">PUT</span>
                <code className="text-[#39FF14]">/api/v1/agents/:id</code>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Eye className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">Update agent configuration</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#012419] rounded-lg p-6 border border-[#024d30]">
          <div className="text-sm text-gray-400 mb-1">Total Requests</div>
          <div className="text-3xl font-bold text-white">12,458</div>
          <div className="text-xs text-green-400 mt-1">↑ 23% from last week</div>
        </div>
        <div className="bg-[#012419] rounded-lg p-6 border border-[#024d30]">
          <div className="text-sm text-gray-400 mb-1">Avg Response Time</div>
          <div className="text-3xl font-bold text-white">145ms</div>
          <div className="text-xs text-green-400 mt-1">↓ 12% faster</div>
        </div>
        <div className="bg-[#012419] rounded-lg p-6 border border-[#024d30]">
          <div className="text-sm text-gray-400 mb-1">Error Rate</div>
          <div className="text-3xl font-bold text-white">0.3%</div>
          <div className="text-xs text-green-400 mt-1">↓ 0.2% improvement</div>
        </div>
      </div>
    </div>
  );

  const renderKnowledge = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#39FF14]" />
            Knowledge Base
          </h2>
          <p className="text-gray-400">Manage training data and documentation for your AI agents</p>
        </div>
        <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Knowledge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#39FF14]/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#39FF14]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Documentation</h3>
              <p className="text-sm text-gray-400">24 documents</p>
            </div>
          </div>
          <button className="text-[#39FF14] font-semibold text-sm hover:text-[#39FF14]">
            View all →
          </button>
        </div>

        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">FAQs</h3>
              <p className="text-sm text-gray-400">156 questions</p>
            </div>
          </div>
          <button className="text-green-400 font-semibold text-sm hover:text-green-300">
            View all →
          </button>
        </div>

        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#39FF14]/20 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#39FF14]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Web Sources</h3>
              <p className="text-sm text-gray-400">12 websites</p>
            </div>
          </div>
          <button className="text-[#39FF14] font-semibold text-sm hover:text-[#39FF14]">
            View all →
          </button>
        </div>

        <div className="bg-[#012419] rounded-xl p-6 border border-[#024d30]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#39FF14]/20 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-[#39FF14]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">API Integrations</h3>
              <p className="text-sm text-gray-400">8 endpoints</p>
            </div>
          </div>
          <button className="text-[#39FF14] font-semibold text-sm hover:text-[#39FF14]">
            View all →
          </button>
        </div>
      </div>
    </div>
  );

  const renderObservability = () => {
    const content = {
      'llm-logs': (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">LLM Request Logs</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#012419] rounded-lg p-4 border border-[#024d30]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">GPT-4 Request</span>
                    <span className="text-xs text-gray-500">2 minutes ago</span>
                  </div>
                  <span className="text-[#39FF14] font-semibold">124ms</span>
                </div>
                <div className="text-sm text-gray-400">Tokens: 450 input / 230 output</div>
              </div>
            ))}
          </div>
        </div>
      ),
      'tool-logs': (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Tool Execution Logs</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#012419] rounded-lg p-4 border border-[#024d30]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-[#39FF14]" />
                    <span className="text-white font-medium">API Call Tool</span>
                    <span className="text-xs text-gray-500">5 minutes ago</span>
                  </div>
                  <span className="text-green-400 font-semibold">Success</span>
                </div>
                <div className="text-sm text-gray-400">Function: fetch_customer_data</div>
              </div>
            ))}
          </div>
        </div>
      ),
      'webhook-logs': (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Webhook Activity</h3>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#012419] rounded-lg p-4 border border-[#024d30]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Webhook className="w-5 h-5 text-[#39FF14]" />
                    <span className="text-white font-medium">Call Completed</span>
                    <span className="text-xs text-gray-500">10 minutes ago</span>
                  </div>
                  <span className="text-green-400 font-semibold">200 OK</span>
                </div>
                <div className="text-sm text-gray-400">Endpoint: https://api.example.com/webhook</div>
              </div>
            ))}
          </div>
        </div>
      ),
      'knowledge-logs': (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Knowledge Base Queries</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#012419] rounded-lg p-4 border border-[#024d30]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-[#39FF14]" />
                    <span className="text-white font-medium">Vector Search</span>
                    <span className="text-xs text-gray-500">3 minutes ago</span>
                  </div>
                  <span className="text-[#39FF14] font-semibold">45ms</span>
                </div>
                <div className="text-sm text-gray-400">Results: 5 documents retrieved</div>
              </div>
            ))}
          </div>
        </div>
      ),
      'conversation-logs': (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Conversation History</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#012419] rounded-lg p-4 border border-[#024d30]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Call Session #{1000 + i}</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <span className="text-green-400 font-semibold">Completed</span>
                </div>
                <div className="text-sm text-gray-400">Duration: 3m 24s • Turns: 12</div>
              </div>
            ))}
          </div>
        </div>
      ),
    };

    return content[activeSubSection as keyof typeof content] || content['llm-logs'];
  };

  const renderIntegrations = () => {
    const content = {
      'external-integrations': (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">External Integrations</h3>
              <p className="text-gray-400">Connect to external services and APIs</p>
            </div>
            <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Integration
            </button>
          </div>

          <div className="grid gap-4">
            {['Salesforce CRM', 'Zendesk', 'Slack', 'HubSpot'].map((service) => (
              <div key={service} className="bg-[#012419] rounded-lg p-6 border border-[#024d30] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#39FF14]/20 rounded-lg flex items-center justify-center">
                    <Plug className="w-6 h-6 text-[#39FF14]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{service}</h4>
                    <p className="text-sm text-gray-400">Connected</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-[#024d30] rounded-lg transition-all">
                    <Settings className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      'credentials': (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">API Credentials</h3>
              <p className="text-gray-400">Manage API keys and authentication</p>
            </div>
            <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Generate Key
            </button>
          </div>

          <div className="space-y-4">
            {['Production API Key', 'Development API Key', 'Test API Key'].map((key, i) => (
              <div key={key} className="bg-[#012419] rounded-lg p-6 border border-[#024d30]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-[#39FF14]" />
                    <h4 className="text-lg font-bold text-white">{key}</h4>
                  </div>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-[#013221] rounded p-3 font-mono text-sm text-gray-400 mb-3">
                  sk_live_••••••••••••••••{String(Math.random()).slice(2, 6)}
                </div>
                <div className="text-xs text-gray-500">Created {i + 1} months ago • Last used 2 days ago</div>
              </div>
            ))}
          </div>
        </div>
      ),
    };

    return content[activeSubSection as keyof typeof content] || content['external-integrations'];
  };

  const renderOrganizations = () => {
    const content = {
      'users-teams': (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Users and Teams</h3>
              <p className="text-gray-400">Manage team members and permissions</p>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Invite User
            </button>
          </div>

          <div className="space-y-4">
            {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name, i) => (
              <div key={name} className="bg-[#012419] rounded-lg p-6 border border-[#024d30] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#39FF14] to-[#32e012] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{name[0]}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{name}</h4>
                    <p className="text-sm text-gray-400">{['Admin', 'Developer', 'Developer'][i]}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm">Active</span>
              </div>
            ))}
          </div>
        </div>
      ),
      'projects': (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Projects</h3>
              <p className="text-gray-400">Organize your voice agents by project</p>
            </div>
            <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>

          <div className="grid gap-4">
            {['Customer Support', 'Sales Automation', 'Internal Tools'].map((project) => (
              <div key={project} className="bg-[#012419] rounded-lg p-6 border border-[#024d30]">
                <div className="flex items-center gap-3 mb-3">
                  <Folder className="w-6 h-6 text-[#39FF14]" />
                  <h4 className="text-lg font-bold text-white">{project}</h4>
                </div>
                <p className="text-gray-400 text-sm mb-4">3 agents • 2 team members</p>
                <div className="flex gap-2">
                  <button className="text-[#39FF14] hover:text-[#39FF14] text-sm font-semibold">
                    View agents →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    };

    return content[activeSubSection as keyof typeof content] || content['users-teams'];
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'assistants':
        return renderAssistants();
      case 'endpoints':
        return renderEndpoints();
      case 'knowledge':
        return renderKnowledge();
      case 'models':
        return renderModels();
      case 'observability':
        return renderObservability();
      case 'integrations':
        return renderIntegrations();
      case 'organizations':
        return renderOrganizations();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#013221]">
      <div className="bg-[#012419] border-b border-[#024d30]">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#024d30]">
          <h2 className="text-lg font-bold text-white">Voice Agent Platform</h2>
        </div>

        <div className="px-6 py-3 overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max">
            <div className="flex items-center gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setActiveSubSection('');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeSection === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:bg-[#024d30] hover:text-gray-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" style={{ color: activeSection === item.id ? '#fff' : '#40C706' }} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-[#024d30]"></div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Observability</span>
              {observabilityItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection('observability');
                    setActiveSubSection(item.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeSection === 'observability' && activeSubSection === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:bg-[#024d30] hover:text-gray-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" style={{ color: activeSection === 'observability' && activeSubSection === item.id ? '#fff' : '#40C706' }} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-[#024d30]"></div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Integrations</span>
              {integrationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection('integrations');
                    setActiveSubSection(item.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeSection === 'integrations' && activeSubSection === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:bg-[#024d30] hover:text-gray-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" style={{ color: activeSection === 'integrations' && activeSubSection === item.id ? '#fff' : '#40C706' }} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-[#024d30]"></div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Organizations</span>
              {organizationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection('organizations');
                    setActiveSubSection(item.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeSection === 'organizations' && activeSubSection === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:bg-[#024d30] hover:text-gray-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" style={{ color: activeSection === 'organizations' && activeSubSection === item.id ? '#fff' : '#40C706' }} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>

      {showCreateModal && renderCreateModal()}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Assistant</h2>
                <p className="text-sm text-gray-600 mt-1">Update your voice assistant configuration</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assistant Name</label>
                  <input
                    type="text"
                    value={newAgent.agent_name}
                    onChange={(e) => setNewAgent({ ...newAgent, agent_name: e.target.value })}
                    placeholder="Enter assistant name"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newAgent.agent_description}
                    onChange={(e) => setNewAgent({ ...newAgent, agent_description: e.target.value })}
                    placeholder="Describe your assistant"
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">AI Provider</label>
                    <select
                      value={newAgent.ai_provider}
                      onChange={(e) => setNewAgent({ ...newAgent, ai_provider: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                    >
                      {AI_MODELS.map(model => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">AI Model</label>
                    <select
                      value={newAgent.ai_model}
                      onChange={(e) => setNewAgent({ ...newAgent, ai_model: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                    >
                      {AI_MODELS.find(m => m.id === newAgent.ai_provider)?.models.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">STT Provider</label>
                    <select
                      value={newAgent.stt_provider}
                      onChange={(e) => setNewAgent({ ...newAgent, stt_provider: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                    >
                      {STT_PROVIDERS.map(provider => (
                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Voice Provider</label>
                    <select
                      value={newAgent.voice_provider}
                      onChange={(e) => setNewAgent({ ...newAgent, voice_provider: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                    >
                      {TTS_PROVIDERS.map(provider => (
                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={newAgent.status}
                    onChange={(e) => setNewAgent({ ...newAgent, status: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900"
                  >
                    <option value="testing">Testing</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">System Prompt</label>
                  <textarea
                    value={newAgent.system_prompt}
                    onChange={(e) => setNewAgent({ ...newAgent, system_prompt: e.target.value })}
                    placeholder="Enter system prompt for your assistant..."
                    rows={6}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAgent}
                className="px-6 py-2.5 bg-[#39FF14] text-black rounded-lg font-semibold hover:bg-[#32e012] flex items-center gap-2"
              >
                Update Assistant
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlayModal && playingAgent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{playingAgent.name}</h2>
                    <p className="text-green-100 text-sm">Voice Assistant Demo</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleStopVoice();
                    setShowPlayModal(false);
                    setPlayingAgent(null);
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="p-6 space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">System Configuration</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>AI Model:</strong> {playingAgent.ai_model || 'GPT-4'}</p>
                      <p><strong>Voice Type:</strong> {playingAgent.voice_type || 'Neutral'}</p>
                      <p><strong>Language:</strong> {playingAgent.language || 'English (US)'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-green-600" />
                  Voice Demonstrations
                </h3>

                <div className="space-y-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#39FF14]" />
                        <span className="font-medium text-gray-900">English (US)</span>
                      </div>
                      <button
                        onClick={() => handlePlayVoice(
                          playingAgent.greeting_message ||
                          playingAgent.system_prompt ||
                          'Hello! I am your AI voice assistant. How can I help you today?',
                          'en-US'
                        )}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                          isPlaying
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "{playingAgent.greeting_message || playingAgent.system_prompt || 'Hello! I am your AI voice assistant. How can I help you today?'}"
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#39FF14]" />
                        <span className="font-medium text-gray-900">Spanish (ES)</span>
                      </div>
                      <button
                        onClick={() => handlePlayVoice(
                          '¡Hola! Soy tu asistente de voz con inteligencia artificial. ¿En qué puedo ayudarte hoy?',
                          'es-ES'
                        )}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                          isPlaying
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "¡Hola! Soy tu asistente de voz con inteligencia artificial. ¿En qué puedo ayudarte hoy?"
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#39FF14]" />
                        <span className="font-medium text-gray-900">French (FR)</span>
                      </div>
                      <button
                        onClick={() => handlePlayVoice(
                          'Bonjour! Je suis votre assistant vocal intelligent. Comment puis-je vous aider aujourd\'hui?',
                          'fr-FR'
                        )}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                          isPlaying
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "Bonjour! Je suis votre assistant vocal intelligent. Comment puis-je vous aider aujourd'hui?"
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#39FF14]" />
                        <span className="font-medium text-gray-900">German (DE)</span>
                      </div>
                      <button
                        onClick={() => handlePlayVoice(
                          'Hallo! Ich bin Ihr KI-Sprachassistent. Wie kann ich Ihnen heute helfen?',
                          'de-DE'
                        )}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                          isPlaying
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "Hallo! Ich bin Ihr KI-Sprachassistent. Wie kann ich Ihnen heute helfen?"
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#39FF14]" />
                        <span className="font-medium text-gray-900">Chinese (Mandarin)</span>
                      </div>
                      <button
                        onClick={() => handlePlayVoice(
                          '您好！我是您的人工智能语音助手。今天我能为您做些什么？',
                          'zh-CN'
                        )}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                          isPlaying
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "您好！我是您的人工智能语音助手。今天我能为您做些什么？"
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#39FF14]" />
                        <span className="font-medium text-gray-900">Japanese</span>
                      </div>
                      <button
                        onClick={() => handlePlayVoice(
                          'こんにちは！私はあなたのAI音声アシスタントです。今日は何をお手伝いしましょうか？',
                          'ja-JP'
                        )}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                          isPlaying
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <StopCircle className="w-4 h-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "こんにちは！私はあなたのAI音声アシスタントです。今日は何をお手伝いしましょうか？"
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-[#39FF14]/80">
                    <p className="font-semibold mb-1">Demo Mode</p>
                    <p>This is a demonstration using your browser's built-in text-to-speech. In production, this assistant would use {playingAgent.voice_provider || 'ElevenLabs'} for high-quality, natural-sounding voices.</p>
                  </div>
                </div>
              </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end flex-shrink-0">
              <button
                onClick={() => {
                  handleStopVoice();
                  setShowPlayModal(false);
                  setPlayingAgent(null);
                }}
                className="px-6 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
              >
                Close Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
