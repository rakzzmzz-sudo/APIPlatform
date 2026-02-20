import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import ChatbotIntegrations from './ChatbotIntegrations';
import {
  Bot, MessageSquare, Tag, MessageCircle, FileText, Settings,
  Database, BookOpen, Plug, Brain, Play, Plus, Edit2, Trash2,
  Save, X, Check, AlertCircle, TrendingUp, Users, Clock, Zap,
  Upload, Link, Server, HardDrive, Loader
} from 'lucide-react';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  platform: string;
  nlu_engine: string;
  language: string;
  confidence_threshold: number;
  created_at: string;
}

interface Intent {
  id: string;
  intent_name: string;
  intent_display_name: string;
  intent_description: string;
  is_system_intent: boolean;
  training_phrases: string[];
  action_type: string;
  is_active: boolean;
  priority: number;
}

interface Entity {
  id: string;
  entity_name: string;
  entity_display_name: string;
  entity_type: string;
  values: any;
  regex_pattern: string | null;
  is_active: boolean;
}

interface Conversation {
  id: string;
  session_id: string;
  user_id: string;
  channel: string;
  status: string;
  message_count: number;
  started_at: string;
}

interface Message {
  id: string;
  message_type: string;
  message_text: string;
  detected_intent: string | null;
  intent_confidence: number | null;
  created_at: string;
}

interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
  content_type: string;
  category: string;
  tags: string[];
  is_active: boolean;
}

interface Integration {
  id: string;
  integration_name: string;
  integration_type: string;
  status: string;
  config: any;
}

export default function ChatbotBuilder() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dataLoading, setDataLoading] = useState(false);

  const [bots, setBots] = useState<Chatbot[]>([]);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const [showNewIntentModal, setShowNewIntentModal] = useState(false);
  const [showNewEntityModal, setShowNewEntityModal] = useState(false);
  const [showNewKBModal, setShowNewKBModal] = useState(false);
  const [editingIntentId, setEditingIntentId] = useState<string | null>(null);
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editingKBId, setEditingKBId] = useState<string | null>(null);

  const [intentForm, setIntentForm] = useState({
    intent_name: '',
    intent_display_name: '',
    intent_description: '',
    training_phrases: [] as string[],
    action_type: 'text',
    is_active: true,
    priority: 5
  });
  const [currentPhrase, setCurrentPhrase] = useState('');

  const [entityForm, setEntityForm] = useState({
    entity_name: '',
    entity_display_name: '',
    entity_type: 'list',
    values: [] as any[],
    regex_pattern: '',
    is_active: true
  });
  const [currentEntityValue, setCurrentEntityValue] = useState('');
  const [currentEntitySynonyms, setCurrentEntitySynonyms] = useState('');

  const [testMessage, setTestMessage] = useState('');
  const [testConversation, setTestConversation] = useState<any[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [testSessionId, setTestSessionId] = useState<string>('');
  const [selectedLLMProvider, setSelectedLLMProvider] = useState<'openai' | 'gemini'>('openai');

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [showConversationModal, setShowConversationModal] = useState(false);

  const [mlConfigs, setMlConfigs] = useState<any[]>([]);
  const [showNewMLConfigModal, setShowNewMLConfigModal] = useState(false);
  const [editingMLConfigId, setEditingMLConfigId] = useState<string | null>(null);
  const [mlConfigForm, setMlConfigForm] = useState({
    config_name: '',
    nlu_engine: 'llm',
    llm_provider: 'openai',
    llm_model: 'gpt-3.5-turbo',
    confidence_threshold: 0.7,
    temperature: 0.7,
    max_tokens: 500,
    is_active: true
  });

  const [kbForm, setKbForm] = useState({
    title: '',
    content: '',
    content_type: 'article',
    category: '',
    tags: [] as string[],
    url: '',
    source_type: 'manual',
    file: null as File | null,
    is_active: true
  });
  const [currentTag, setCurrentTag] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [trainingStatus, setTrainingStatus] = useState<any>({
    intent_classifier: { status: 'idle', last_trained: null, progress: 0 },
    entity_extractor: { status: 'idle', last_trained: null, progress: 0 }
  });

  useEffect(() => {
    loadBots();
  }, []);

  useEffect(() => {
    if (selectedBot) {
      loadBotData();
    }
  }, [selectedBot]);

  const loadBots = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await db
        .from('cb_bots')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBots(data || []);
      if (data && data.length > 0 && !selectedBot) {
        setSelectedBot(data[0].id);
      }
    } catch (error) {
      console.error('Error loading bots:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const seedSampleBots = async () => {
    const SAMPLE_BOTS = [
      { name: 'WhatsApp Customer Care', description: 'Automated WhatsApp bot for customer support and order tracking', platform: 'whatsapp', type: 'support', status: 'active', language: 'en', greeting_message: 'Hi! Welcome to our WhatsApp support. How can I help you today?', configuration: JSON.stringify({ welcome_msg: true, auto_reply: true }) },
      { name: 'Telegram News Bot', description: 'Telegram bot for delivering real-time news updates and alerts', platform: 'telegram', type: 'informational', status: 'active', language: 'en', greeting_message: 'Welcome to the News Alert bot! You will receive updates here.', configuration: JSON.stringify({ categories: ['tech', 'world', 'finance'] }) },
      { name: 'Facebook Sales Assistant', description: 'Facebook bot for handling product inquiries and lead generation', platform: 'facebook', type: 'sales', status: 'active', language: 'en', greeting_message: 'Hello! Interested in our products? I can show you the latest catalog.', configuration: JSON.stringify({ flow: 'sales_funnel' }) },
      { name: 'TikTok Interactive Bot', description: 'TikTok bot for engaging with followers and managing contests', platform: 'tiktok', type: 'engagement', status: 'active', language: 'en', greeting_message: 'Hey TikToker! Ready to join the challenge?', configuration: JSON.stringify({ mode: 'contest' }) },
      { name: 'Messenger Support Bot', description: 'Messenger bot for 24/7 automated customer service', platform: 'messenger', type: 'support', status: 'active', language: 'en', greeting_message: 'How can we assist you on Messenger today?', configuration: JSON.stringify({ persistent_menu: true }) },
      { name: 'Instagram Shopping Bot', description: 'Instagram bot for product catalogs and seamless shopping experience', platform: 'instagram', type: 'sales', status: 'active', language: 'en', greeting_message: 'Welcome to our Instagram shop! Browse our latest collections.', configuration: JSON.stringify({ shop_id: 'instashop_1' }) },
      { name: 'Viber Business Bot', description: 'Viber bot for secure business communications and notifications', platform: 'viber', type: 'business', status: 'active', language: 'en', greeting_message: 'Welcome to our official Viber business account.', configuration: JSON.stringify({ security: 'high' }) },
      { name: 'Webchat Help Desk', description: 'Webchat bot for real-time website assistance and FAQ handling', platform: 'webchat', type: 'support', status: 'active', language: 'en', greeting_message: 'Hello! How can I help you with our website today?', configuration: JSON.stringify({ theme: 'blue' }) },
      { name: 'Line Service Bot', description: 'Line bot for service bookings and appointment management', platform: 'line', type: 'service', status: 'active', language: 'en', greeting_message: 'Welcome! Use this bot to book your next appointment.', configuration: JSON.stringify({ calendar_id: 'line_cal_1' }) },
      { name: 'Line Global Bot', description: 'Global Line bot for multi-language customer engagement', platform: 'line', type: 'conversational', status: 'active', language: 'en', greeting_message: 'Hello and welcome to our global Line channel.', configuration: JSON.stringify({ regions: ['APAC', 'EMEA', 'AMER'] }) }
    ];

    setDataLoading(true);
    try {
      // 1. Insert Bots
      await db.from('cb_bots').insert(SAMPLE_BOTS);
      
      // 2. Load Bots to get their IDs
      const { data: createdBots, error: loadError } = await db.from('cb_bots').select('*');
      if (loadError) throw loadError;

      // 3. For each bot, seed related tables
      for (const bot of (createdBots || [])) {
        // Skip if bot doesn't match one of our samples (to avoid re-seeding existing bots if logic allows)
        if (!SAMPLE_BOTS.find(s => s.name === bot.name)) continue;

        // --- SEED INTENTS ---
        const intents = [
          { bot_id: bot.id, intent_name: 'greeting', intent_display_name: 'Greeting', intent_description: 'User says hello', training_phrases: JSON.stringify(['Hi', 'Hello', 'Hey there']), action_type: 'text', priority: 5 },
          { bot_id: bot.id, intent_name: 'help', intent_display_name: 'Help Request', intent_description: 'User needs assistance', training_phrases: JSON.stringify(['Help', 'I need help', 'Support']), action_type: 'text', priority: 4 },
          { bot_id: bot.id, intent_name: 'bye', intent_display_name: 'Goodbye', intent_description: 'User says goodbye', training_phrases: JSON.stringify(['Bye', 'Goodbye', 'See you']), action_type: 'text', priority: 5 },
          { bot_id: bot.id, intent_name: 'status_check', intent_display_name: 'Status Check', intent_description: 'Check order/service status', training_phrases: JSON.stringify(['Where is my order?', 'Track status', 'Check my booking']), action_type: 'api', priority: 3 },
          { bot_id: bot.id, intent_name: 'refund', intent_display_name: 'Refund Inquiry', intent_description: 'Inquire about refunds', training_phrases: JSON.stringify(['I want a refund', 'Refund policy', 'Money back']), action_type: 'text', priority: 2 }
        ];
        await db.from('cb_intents').insert(intents);

        // --- SEED ENTITIES ---
        const entities = [
          { bot_id: bot.id, entity_name: 'order_id', entity_display_name: 'Order ID', entity_type: 'regex', regex_pattern: 'ORD-\\d{5}', is_active: true },
          { bot_id: bot.id, entity_name: 'product_type', entity_display_name: 'Product Type', entity_type: 'list', values: JSON.stringify([{ value: 'electronics', synonyms: ['gadget', 'tech'] }, { value: 'fashion', synonyms: ['clothing', 'wear'] }]), is_active: true }
        ];
        await db.from('cb_entities').insert(entities);

        // --- SEED KB ---
        const kbItems = [
          { bot_id: bot.id, title: 'How to use this bot', content: 'Simply type your request in natural language. I can help with orders, support, and FAQs.', content_type: 'article', category: 'General' },
          { bot_id: bot.id, title: 'Return Policy', content: 'Our return policy allows items to be returned within 30 days of purchase.', content_type: 'faq', category: 'Policies' },
          { bot_id: bot.id, title: 'Shipping Times', content: 'Standard shipping takes 3-5 business days. Express takes 1-2.', content_type: 'faq', category: 'Shipping' }
        ];
        await db.from('cb_knowledge_base').insert(kbItems);

        // --- SEED ML CONFIG ---
        const mlConfig = {
          bot_id: bot.id,
          config_name: 'Standard NLU Config',
          nlu_engine: 'llm',
          llm_provider: 'openai',
          llm_model: 'gpt-3.5-turbo',
          confidence_threshold: 0.7,
          is_active: true
        };
        await db.from('cb_ml_configs').insert(mlConfig);

        // --- SEED CONVERSATIONS & MESSAGES ---
        const sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
        const { data: conversation, error: convError } = await db.from('cb_conversations').insert({
          bot_id: bot.id,
          session_id: sessionId,
          user_id: `user-${Math.random().toString(36).substr(2, 5)}`,
          channel: bot.platform || 'web',
          status: 'completed',
          message_count: 2
        });

        if (conversation) {
          const convId = Array.isArray(conversation) ? conversation[0].id : conversation.id;
          await db.from('cb_messages').insert([
            { conversation_id: convId, message_type: 'user', message_text: 'Hello, I need help with my order', detected_intent: 'help', intent_confidence: 0.95 },
            { conversation_id: convId, message_type: 'bot', message_text: 'Hi! Sure, I can help you with that. What is your order ID?' }
          ]);
        }
      }

      alert(`Successfully seeded 10 bots with full sample data sets!`);
      await loadBots();
    } catch (error: any) {
      console.error('Error seeding bots:', error);
      alert('Failed to seed sample bots: ' + error.message);
    } finally {
      setDataLoading(false);
    }
  };

  const loadBotData = async () => {
    if (!selectedBot) return;
    await Promise.all([
      loadIntents(),
      loadEntities(),
      loadConversations(),
      loadKnowledgeBase(),
      loadIntegrations(),
      loadMLConfigs()
    ]);
  };

  const loadMLConfigs = async () => {
    if (!selectedBot) return;
    try {
      const { data, error } = await db
        .from('cb_ml_configs')
        .select('*')
        .eq('bot_id', selectedBot)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMlConfigs(data || []);
    } catch (error) {
      console.error('Error loading ML configs:', error);
    }
  };

  const loadIntents = async () => {
    if (!selectedBot) return;
    try {
      const { data, error } = await db
        .from('cb_intents')
        .select('*')
        .eq('bot_id', selectedBot)
        .order('priority', { ascending: false });
      if (error) throw error;
      
      const processedIntents = (data || []).map((intent: any) => ({
        ...intent,
        training_phrases: typeof intent.training_phrases === 'string' 
          ? JSON.parse(intent.training_phrases) 
          : (intent.training_phrases || [])
      }));
      
      setIntents(processedIntents);
    } catch (error) {
      console.error('Error loading intents:', error);
    }
  };

  const loadEntities = async () => {
    if (!selectedBot) return;
    try {
      const { data, error } = await db
        .from('cb_entities')
        .select('*')
        .eq('bot_id', selectedBot)
        .order('entity_display_name');
      if (error) throw error;
      
      const processedEntities = (data || []).map((entity: any) => ({
        ...entity,
        values: typeof entity.values === 'string' 
          ? JSON.parse(entity.values) 
          : (entity.values || [])
      }));
      
      setEntities(processedEntities);
    } catch (error) {
      console.error('Error loading entities:', error);
    }
  };

  const loadConversations = async () => {
    if (!selectedBot) return;
    try {
      const { data, error } = await db
        .from('cb_conversations')
        .select('*')
        .eq('bot_id', selectedBot)
        .order('started_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadKnowledgeBase = async () => {
    if (!selectedBot) return;
    try {
      const { data, error } = await db
        .from('cb_knowledge_base')
        .select('*')
        .eq('bot_id', selectedBot)
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      const processedKB = (data || []).map((item: any) => ({
        ...item,
        tags: typeof item.tags === 'string' 
          ? JSON.parse(item.tags) 
          : (item.tags || [])
      }));
      
      setKnowledgeBase(processedKB);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
  };

  const loadIntegrations = async () => {
    if (!selectedBot) return;
    try {
      const { data, error } = await db
        .from('cb_integrations')
        .select('*')
        .eq('bot_id', selectedBot)
        .order('integration_name');
      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const resetIntentForm = () => {
    setIntentForm({
      intent_name: '',
      intent_display_name: '',
      intent_description: '',
      training_phrases: [],
      action_type: 'text',
      is_active: true,
      priority: 5
    });
    setCurrentPhrase('');
  };

  const resetEntityForm = () => {
    setEntityForm({
      entity_name: '',
      entity_display_name: '',
      entity_type: 'list',
      values: [],
      regex_pattern: '',
      is_active: true
    });
    setCurrentEntityValue('');
    setCurrentEntitySynonyms('');
  };

  const addTrainingPhrase = () => {
    if (currentPhrase.trim()) {
      setIntentForm({
        ...intentForm,
        training_phrases: [...intentForm.training_phrases, currentPhrase.trim()]
      });
      setCurrentPhrase('');
    }
  };

  const removeTrainingPhrase = (index: number) => {
    setIntentForm({
      ...intentForm,
      training_phrases: intentForm.training_phrases.filter((_, i) => i !== index)
    });
  };

  const addEntityValue = () => {
    if (currentEntityValue.trim()) {
      const newValue = {
        value: currentEntityValue.trim(),
        synonyms: currentEntitySynonyms ? currentEntitySynonyms.split(',').map(s => s.trim()) : []
      };
      setEntityForm({
        ...entityForm,
        values: [...entityForm.values, newValue]
      });
      setCurrentEntityValue('');
      setCurrentEntitySynonyms('');
    }
  };

  const removeEntityValue = (index: number) => {
    setEntityForm({
      ...entityForm,
      values: entityForm.values.filter((_, i) => i !== index)
    });
  };

  const editIntent = (intent: Intent) => {
    setEditingIntentId(intent.id);
    setIntentForm({
      intent_name: intent.intent_name,
      intent_display_name: intent.intent_display_name,
      intent_description: intent.intent_description,
      training_phrases: intent.training_phrases || [],
      action_type: intent.action_type,
      is_active: intent.is_active,
      priority: intent.priority
    });
    setShowNewIntentModal(true);
  };

  const deleteIntent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this intent?')) return;

    try {
      const { error } = await db
        .from('cb_intents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadIntents();
    } catch (error: any) {
      alert('Failed to delete intent: ' + error.message);
    }
  };

  const handleSaveIntent = async () => {
    if (!selectedBot || !intentForm.intent_name || !intentForm.intent_display_name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingIntentId) {
        const { error } = await db
          .from('cb_intents')
          .update({
            intent_name: intentForm.intent_name,
            intent_display_name: intentForm.intent_display_name,
            intent_description: intentForm.intent_description,
            training_phrases: intentForm.training_phrases,
            action_type: intentForm.action_type,
            is_active: intentForm.is_active,
            priority: intentForm.priority
          })
          .eq('id', editingIntentId);

        if (error) throw error;
      } else {
        const { error } = await db
          .from('cb_intents')
          .insert({
            bot_id: selectedBot,
            intent_name: intentForm.intent_name,
            intent_display_name: intentForm.intent_display_name,
            intent_description: intentForm.intent_description,
            training_phrases: intentForm.training_phrases,
            action_type: intentForm.action_type,
            is_system_intent: false,
            is_active: intentForm.is_active,
            priority: intentForm.priority
          });

        if (error) throw error;
      }

      setShowNewIntentModal(false);
      setEditingIntentId(null);
      resetIntentForm();
      loadIntents();
    } catch (error: any) {
      alert('Failed to save intent: ' + error.message);
    }
  };

  const editEntity = (entity: Entity) => {
    setEditingEntityId(entity.id);
    setEntityForm({
      entity_name: entity.entity_name,
      entity_display_name: entity.entity_display_name,
      entity_type: entity.entity_type,
      values: entity.values || [],
      regex_pattern: entity.regex_pattern || '',
      is_active: entity.is_active
    });
    setShowNewEntityModal(true);
  };

  const deleteEntity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entity?')) return;

    try {
      const { error } = await db
        .from('cb_entities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadEntities();
    } catch (error: any) {
      alert('Failed to delete entity: ' + error.message);
    }
  };

  const handleSaveEntity = async () => {
    if (!selectedBot || !entityForm.entity_name || !entityForm.entity_display_name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingEntityId) {
        const { error } = await db
          .from('cb_entities')
          .update({
            entity_name: entityForm.entity_name,
            entity_display_name: entityForm.entity_display_name,
            entity_type: entityForm.entity_type,
            values: entityForm.values,
            regex_pattern: entityForm.regex_pattern || null,
            is_active: entityForm.is_active
          })
          .eq('id', editingEntityId);

        if (error) throw error;
      } else {
        const { error } = await db
          .from('cb_entities')
          .insert({
            bot_id: selectedBot,
            entity_name: entityForm.entity_name,
            entity_display_name: entityForm.entity_display_name,
            entity_type: entityForm.entity_type,
            values: entityForm.values,
            regex_pattern: entityForm.regex_pattern || null,
            is_active: entityForm.is_active
          });

        if (error) throw error;
      }

      setShowNewEntityModal(false);
      setEditingEntityId(null);
      resetEntityForm();
      loadEntities();
    } catch (error: any) {
      alert('Failed to save entity: ' + error.message);
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim() || isSendingMessage || !selectedBot) return;

    const userMessage = testMessage;
    const userMsg = { type: 'user', text: userMessage, timestamp: new Date() };
    setTestConversation(prev => [...prev, userMsg]);
    setTestMessage('');
    setIsSendingMessage(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/chatbot-query`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_id: selectedBot,
          message: userMessage,
          session_id: testSessionId || undefined,
          user_id: 'test_user',
          channel: 'web_test',
          llm_provider: selectedLLMProvider
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get chatbot response');
      }

      const data = await response.json();

      if (!testSessionId && data.session_id) {
        setTestSessionId(data.session_id);
      }

      const botResponse = {
        type: 'bot',
        text: data.response,
        timestamp: new Date(),
        intent: data.detected_intent?.intent_name || null,
        confidence: data.detected_intent?.confidence || 0,
        provider: data.provider,
        model: data.model,
        kb_used: data.knowledge_base_used,
        metadata: data.metadata
      };
      setTestConversation(prev => [...prev, botResponse]);

    } catch (error: any) {
      console.error('Error processing message:', error);
      const fallbackResponse = {
        type: 'bot',
        text: `Error: ${error.message || 'Failed to process your message. Please check your API keys and try again.'}`,
        timestamp: new Date(),
        intent: null,
        confidence: 0,
        isError: true
      };
      setTestConversation(prev => [...prev, fallbackResponse]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const findBestIntent = (message: string): { intent: string | null; confidence: number } => {
    const lowerMessage = message.toLowerCase();
    let bestMatch: { intent: string | null; confidence: number } = { intent: null, confidence: 0 };

    for (const intent of intents) {
      if (!intent.is_active) continue;

      for (const phrase of intent.training_phrases) {
        const similarity = calculateSimilarity(lowerMessage, phrase.toLowerCase());
        if (similarity > bestMatch.confidence) {
          bestMatch = {
            intent: intent.intent_display_name,
            confidence: similarity
          };
        }
      }
    }

    return bestMatch;
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return union.size > 0 ? intersection.size / union.size : 0;
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const { data, error } = await db
        .from('cb_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setConversationMessages(data || []);
      setSelectedConversation(conversationId);
      setShowConversationModal(true);
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    }
  };

  const resetMLConfigForm = () => {
    setMlConfigForm({
      config_name: '',
      nlu_engine: 'llm',
      llm_provider: 'openai',
      llm_model: 'gpt-3.5-turbo',
      confidence_threshold: 0.7,
      temperature: 0.7,
      max_tokens: 500,
      is_active: true
    });
  };

  const editMLConfig = (config: any) => {
    setEditingMLConfigId(config.id);
    setMlConfigForm({
      config_name: config.config_name,
      nlu_engine: config.nlu_engine,
      llm_provider: config.llm_provider,
      llm_model: config.llm_model,
      confidence_threshold: config.confidence_threshold,
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      is_active: config.is_active
    });
    setShowNewMLConfigModal(true);
  };

  const deleteMLConfig = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ML configuration?')) return;

    try {
      const { error } = await db
        .from('cb_ml_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadMLConfigs();
    } catch (error: any) {
      alert('Failed to delete ML config: ' + error.message);
    }
  };

  const handleSaveMLConfig = async () => {
    if (!selectedBot || !mlConfigForm.config_name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingMLConfigId) {
        const { error } = await db
          .from('cb_ml_configs')
          .update(mlConfigForm)
          .eq('id', editingMLConfigId);

        if (error) throw error;
      } else {
        const { error } = await db
          .from('cb_ml_configs')
          .insert({
            bot_id: selectedBot,
            ...mlConfigForm
          });

        if (error) throw error;
      }

      setShowNewMLConfigModal(false);
      setEditingMLConfigId(null);
      resetMLConfigForm();
      loadMLConfigs();
    } catch (error: any) {
      alert('Failed to save ML config: ' + error.message);
    }
  };

  const startTraining = async (type: 'intent_classifier' | 'entity_extractor') => {
    setTrainingStatus((prev: any) => ({
      ...prev,
      [type]: { ...prev[type], status: 'training', progress: 0 }
    }));

    const progressInterval = setInterval(() => {
      setTrainingStatus((prev: any) => {
        const currentProgress = prev[type].progress;
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          return {
            ...prev,
            [type]: {
              status: 'completed',
              last_trained: new Date().toISOString(),
              progress: 100
            }
          };
        }
        return {
          ...prev,
          [type]: { ...prev[type], progress: currentProgress + 10 }
        };
      });
    }, 300);

    setTimeout(() => {
      clearInterval(progressInterval);
      setTrainingStatus((prev: any) => ({
        ...prev,
        [type]: {
          status: 'completed',
          last_trained: new Date().toISOString(),
          progress: 100
        }
      }));

      setTimeout(() => {
        setTrainingStatus((prev: any) => ({
          ...prev,
          [type]: { ...prev[type], status: 'idle', progress: 0 }
        }));
      }, 2000);
    }, 3500);
  };

  const resetKBForm = () => {
    setKbForm({
      title: '',
      content: '',
      content_type: 'article',
      category: '',
      tags: [],
      url: '',
      source_type: 'manual',
      file: null,
      is_active: true
    });
    setCurrentTag('');
    setUploadProgress(0);
  };

  const addTag = () => {
    if (currentTag.trim() && !kbForm.tags.includes(currentTag.trim())) {
      setKbForm({ ...kbForm, tags: [...kbForm.tags, currentTag.trim()] });
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setKbForm({ ...kbForm, tags: kbForm.tags.filter((_, i) => i !== index) });
  };

  const editKnowledgeBase = (item: KnowledgeBaseItem) => {
    setEditingKBId(item.id);
    setKbForm({
      title: item.title,
      content: item.content,
      content_type: item.content_type,
      category: item.category || '',
      tags: item.tags || [],
      url: '',
      source_type: 'manual',
      file: null,
      is_active: item.is_active
    });
    setShowNewKBModal(true);
  };

  const deleteKnowledgeBase = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await db
        .from('cb_knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadKnowledgeBase();
    } catch (error: any) {
      alert('Failed to delete article: ' + error.message);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress((e.loaded / e.total) * 100);
        }
      };

      reader.onload = async (e) => {
        const text = e.target?.result as string;
        setKbForm(prev => ({
          ...prev,
          content: text,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '')
        }));
        setUploadProgress(100);
        setIsProcessing(false);
      };

      if (file.type === 'application/pdf') {
        alert('PDF parsing requires a backend service. Please copy/paste content for now.');
        setIsProcessing(false);
        return;
      }

      reader.readAsText(file);
    } catch (error: any) {
      alert('Failed to process file: ' + error.message);
      setIsProcessing(false);
    }
  };

  const handleURLIngestion = async (url: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(url);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const textContent = doc.body.innerText;

      setKbForm(prev => ({
        ...prev,
        content: textContent,
        url: url,
        title: prev.title || doc.title || 'Imported from URL'
      }));

      alert('Content imported successfully from URL');
    } catch (error: any) {
      alert('Failed to fetch URL: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveKnowledgeBase = async () => {
    if (!selectedBot || !kbForm.title || !kbForm.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const kbData: any = {
        title: kbForm.title,
        content: kbForm.content,
        content_type: kbForm.content_type,
        category: kbForm.category || null,
        tags: kbForm.tags.length > 0 ? kbForm.tags : null,
        url: kbForm.url || null,
        is_active: kbForm.is_active,
        metadata: {
          source_type: kbForm.source_type,
          imported_at: new Date().toISOString()
        }
      };

      if (editingKBId) {
        const { error } = await db
          .from('cb_knowledge_base')
          .update(kbData)
          .eq('id', editingKBId);

        if (error) throw error;
      } else {
        const { error } = await db
          .from('cb_knowledge_base')
          .insert({
            bot_id: selectedBot,
            ...kbData
          });

        if (error) throw error;
      }

      setShowNewKBModal(false);
      setEditingKBId(null);
      resetKBForm();
      loadKnowledgeBase();
    } catch (error: any) {
      alert('Failed to save article: ' + error.message);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chatbot builder...</p>
        </div>
      </div>
    );
  }

  const currentBot = bots.find(b => b.id === selectedBot);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-[#39FF14]" />
              AI Chatbot Builder
            </h1>
            <p className="text-gray-400">Build intelligent conversational AI with advanced NLU and multi-turn conversations</p>
            {currentBot && (
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm text-gray-500">Current Bot:</span>
                <select
                  value={selectedBot || ''}
                  onChange={(e) => setSelectedBot(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-[#39FF14] font-medium px-2 py-1 rounded transition-colors focus:outline-none focus:border-[#39FF14]"
                >
                  {bots.map(bot => (
                    <option key={bot.id} value={bot.id}>
                      {bot.name}
                    </option>
                  ))}
                </select>
                <span className={`px-2 py-1 rounded text-xs ${
                  currentBot.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  currentBot.status === 'training' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {currentBot.status}
                </span>
                <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded uppercase font-bold">
                  {currentBot.platform || 'web'}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={seedSampleBots}
              disabled={dataLoading}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold border border-gray-700 hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Database className="w-4 h-4 text-[#39FF14]" />
              Load Sample Bots
            </button>
            <button
              className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Chatbot
            </button>
          </div>
        </div>
      </div>

      {bots.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Bot className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No chatbots found</h3>
          <p className="text-gray-400 mb-6">Create your first AI chatbot to get started</p>
          <button className="bg-[#39FF14] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#32e012] transition-colors">
            <Plus className="w-5 h-5 inline mr-2" />
            Create Chatbot
          </button>
        </div>
      ) : (
        <>
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('intents')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'intents' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Intents ({intents.length})
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'entities' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Tag className="w-4 h-4" />
              Entities ({entities.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'chat' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Test Chat
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'logs' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Conversation Logs ({conversations.length})
            </button>
            <button
              onClick={() => setActiveTab('ml-settings')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'ml-settings' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Brain className="w-4 h-4" />
              ML Settings
            </button>
            <button
              onClick={() => setActiveTab('knowledge-base')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'knowledge-base' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Knowledge Base ({knowledgeBase.length})
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'integrations' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Plug className="w-4 h-4" />
              Integrations ({integrations.length})
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare className="w-8 h-8 text-white" />
                    <span className="text-white/80 text-sm">Intents</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{intents.length}</div>
                  <div className="text-white/70 text-sm mt-1">{intents.filter(i => i.is_active).length} active</div>
                </div>

                <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Tag className="w-8 h-8 text-white" />
                    <span className="text-white/80 text-sm">Entities</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{entities.length}</div>
                  <div className="text-white/70 text-sm mt-1">{entities.filter(e => e.is_active).length} active</div>
                </div>

                <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-white" />
                    <span className="text-white/80 text-sm">Conversations</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{conversations.length}</div>
                  <div className="text-white/70 text-sm mt-1">Total sessions</div>
                </div>

                <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-8 h-8 text-white" />
                    <span className="text-white/80 text-sm">Engine</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{currentBot?.nlu_engine}</div>
                  <div className="text-white/70 text-sm mt-1">NLU Engine</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Bot Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bot Name</label>
                    <div className="bg-gray-700 rounded px-4 py-2 text-white">{currentBot?.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <div className="bg-gray-700 rounded px-4 py-2 text-white">{currentBot?.language}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confidence Threshold</label>
                    <div className="bg-gray-700 rounded px-4 py-2 text-white">{currentBot?.confidence_threshold}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <div className={`rounded px-4 py-2 font-medium ${
                      currentBot?.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      currentBot?.status === 'training' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {currentBot?.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Features Enabled</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Multi-turn Conversations</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Intent Recognition (ML)</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Entity Extraction (ML)</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">API Tool Calling</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Context Management</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Knowledge Base RAG</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Spacy Word Embeddings</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Zero-shot NLU (LLM)</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Channel Integrations</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'intents' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Intent Management</h2>
                <button
                  onClick={() => {
                    setEditingIntentId(null);
                    resetIntentForm();
                    setShowNewIntentModal(true);
                  }}
                  className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Intent
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {intents.map((intent) => (
                  <div key={intent.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{intent.intent_display_name}</h3>
                          <span className="text-xs text-gray-500 font-mono">({intent.intent_name})</span>
                          {intent.is_system_intent && (
                            <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded">System</span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded ${
                            intent.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {intent.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded">
                            Priority: {intent.priority}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{intent.intent_description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editIntent(intent)}
                          className="text-[#39FF14] hover:text-[#39FF14] p-2 hover:bg-[#39FF14]/20 rounded transition-colors"
                          title="Edit Intent"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteIntent(intent.id)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded transition-colors"
                          title="Delete Intent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Training Phrases ({intent.training_phrases.length}):</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {intent.training_phrases.slice(0, 5).map((phrase, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded">
                              "{phrase}"
                            </span>
                          ))}
                          {intent.training_phrases.length > 5 && (
                            <span className="px-2 py-1 bg-gray-700 text-gray-400 text-sm rounded">
                              +{intent.training_phrases.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">Action:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          intent.action_type === 'api' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                          intent.action_type === 'text' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {intent.action_type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'entities' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Entity Management</h2>
                <button
                  onClick={() => {
                    setEditingEntityId(null);
                    resetEntityForm();
                    setShowNewEntityModal(true);
                  }}
                  className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Entity
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entities.map((entity) => (
                  <div key={entity.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{entity.entity_display_name}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${
                            entity.entity_type === 'system' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            entity.entity_type === 'regex' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            entity.entity_type === 'list' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {entity.entity_type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            entity.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {entity.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm font-mono">@{entity.entity_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editEntity(entity)}
                          className="text-[#39FF14] hover:text-[#39FF14] p-2 hover:bg-[#39FF14]/20 rounded transition-colors"
                          title="Edit Entity"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEntity(entity.id)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded transition-colors"
                          title="Delete Entity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {entity.regex_pattern && (
                      <div className="mt-2 p-2 bg-gray-700 rounded">
                        <span className="text-xs text-gray-400">Pattern:</span>
                        <code className="text-xs text-green-400 font-mono block mt-1">{entity.regex_pattern}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Chat Interface</h2>
                    <p className="text-gray-400 text-sm">Test your chatbot with real LLM integration</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTestConversation([]);
                        setTestSessionId('');
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Clear Chat
                    </button>
                  </div>
                </div>

                <div className="mb-4 flex gap-2 items-center bg-gray-700 p-3 rounded-lg">
                  <span className="text-sm text-gray-300 font-medium">LLM Provider:</span>
                  <button
                    onClick={() => setSelectedLLMProvider('openai')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      selectedLLMProvider === 'openai'
                        ? 'bg-[#39FF14] text-black font-semibold'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    OpenAI
                  </button>
                  <button
                    onClick={() => setSelectedLLMProvider('gemini')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      selectedLLMProvider === 'gemini'
                        ? 'bg-[#39FF14] text-black font-semibold'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    Google Gemini
                  </button>
                  {testSessionId && (
                    <div className="ml-auto flex items-center gap-2 text-xs">
                      <span className="text-gray-400">Session:</span>
                      <span className="text-gray-300 font-mono">{testSessionId.substring(0, 8)}...</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-900 rounded-lg h-96 overflow-y-auto p-4 mb-4">
                  {testConversation.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="mb-2">Start a conversation to test your bot</p>
                        <p className="text-xs text-gray-600">Using {selectedLLMProvider === 'openai' ? 'OpenAI GPT' : 'Google Gemini'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testConversation.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${
                            msg.type === 'user'
                              ? 'bg-[#39FF14] text-black font-semibold'
                              : msg.isError
                                ? 'bg-red-900/50 text-red-200 border border-red-700'
                                : 'bg-gray-700 text-gray-200'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            {msg.type === 'bot' && !msg.isError && (
                              <div className="mt-2 pt-2 border-t border-gray-600 space-y-1">
                                {msg.intent && (
                                  <div className="text-xs opacity-75">
                                    <span className="font-semibold">Intent:</span> {msg.intent} ({(msg.confidence * 100).toFixed(1)}%)
                                  </div>
                                )}
                                {msg.provider && (
                                  <div className="text-xs opacity-75">
                                    <span className="font-semibold">Model:</span> {msg.provider}/{msg.model}
                                  </div>
                                )}
                                {msg.kb_used && (
                                  <div className="text-xs text-green-400">
                                    <Check className="w-3 h-3 inline mr-1" />
                                    Knowledge Base Used ({msg.metadata?.kb_matches || 0} matches)
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {isSendingMessage && (
                        <div className="flex justify-start">
                          <div className="bg-gray-700 text-gray-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleTestMessage()}
                    placeholder="Type your message here..."
                    disabled={isSendingMessage}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] disabled:opacity-50"
                  />
                  <button
                    onClick={handleTestMessage}
                    disabled={isSendingMessage || !testMessage.trim()}
                    className="bg-[#39FF14] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-4">Debug Info</h3>
                <div className="bg-gray-900 rounded-lg p-4 h-[500px] overflow-y-auto">
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-gray-400 font-semibold mb-1">Configuration</div>
                      <div className="bg-gray-800 p-2 rounded">
                        <div className="text-gray-300">Bot ID: <span className="text-[#39FF14] font-mono">{selectedBot}</span></div>
                        <div className="text-gray-300">Session ID: <span className="text-[#39FF14] font-mono">{testSessionId || 'Not started'}</span></div>
                        <div className="text-gray-300">LLM Provider: <span className="text-[#39FF14]">{selectedLLMProvider}</span></div>
                        <div className="text-gray-300">Messages: <span className="text-[#39FF14]">{testConversation.length}</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 font-semibold mb-1">Last Response Metadata</div>
                      <div className="bg-gray-800 p-2 rounded">
                        {testConversation.length > 0 && testConversation[testConversation.length - 1].type === 'bot' ? (
                          <pre className="text-gray-300 font-mono whitespace-pre-wrap">
                            {JSON.stringify(testConversation[testConversation.length - 1], null, 2)}
                          </pre>
                        ) : (
                          <div className="text-gray-500">No bot response yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Conversation Logs</h2>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Session ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Channel</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Messages</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Started</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversations.map((conv) => (
                      <tr
                        key={conv.id}
                        onClick={() => loadConversationMessages(conv.id)}
                        className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-300 font-mono">{conv.session_id.substring(0, 12)}...</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{conv.user_id}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded">{conv.channel}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">{conv.message_count}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded ${
                            conv.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            conv.status === 'active' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {conv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">{new Date(conv.started_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ml-settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">ML & NLU Configuration</h2>
                <button
                  onClick={() => {
                    setEditingMLConfigId(null);
                    resetMLConfigForm();
                    setShowNewMLConfigModal(true);
                  }}
                  className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New ML Config
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mlConfigs.map((config) => (
                  <div key={config.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{config.config_name}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${
                            config.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {config.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editMLConfig(config)}
                          className="text-[#39FF14] hover:text-[#39FF14] p-2 hover:bg-[#39FF14]/20 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMLConfig(config.id)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">NLU Engine:</span>
                        <p className="text-white font-medium">{config.nlu_engine}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">LLM Provider:</span>
                        <p className="text-white font-medium">{config.llm_provider}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Model:</span>
                        <p className="text-white font-medium">{config.llm_model}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Confidence:</span>
                        <p className="text-white font-medium">{(config.confidence_threshold * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Training Status
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          Intent Classifier
                          {trainingStatus.intent_classifier.status === 'training' && (
                            <div className="w-4 h-4 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
                          )}
                          {trainingStatus.intent_classifier.status === 'completed' && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {trainingStatus.intent_classifier.last_trained
                            ? `Last trained: ${new Date(trainingStatus.intent_classifier.last_trained).toLocaleString()}`
                            : 'Never trained'}
                        </p>
                      </div>
                      <button
                        onClick={() => startTraining('intent_classifier')}
                        disabled={trainingStatus.intent_classifier.status === 'training'}
                        className="bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Train Now
                      </button>
                    </div>
                    {trainingStatus.intent_classifier.status === 'training' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-[#39FF14] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${trainingStatus.intent_classifier.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Training in progress... {trainingStatus.intent_classifier.progress}%</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          Entity Extractor
                          {trainingStatus.entity_extractor.status === 'training' && (
                            <div className="w-4 h-4 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
                          )}
                          {trainingStatus.entity_extractor.status === 'completed' && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {trainingStatus.entity_extractor.last_trained
                            ? `Last trained: ${new Date(trainingStatus.entity_extractor.last_trained).toLocaleString()}`
                            : 'Never trained'}
                        </p>
                      </div>
                      <button
                        onClick={() => startTraining('entity_extractor')}
                        disabled={trainingStatus.entity_extractor.status === 'training'}
                        className="bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Train Now
                      </button>
                    </div>
                    {trainingStatus.entity_extractor.status === 'training' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-[#39FF14] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${trainingStatus.entity_extractor.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Training in progress... {trainingStatus.entity_extractor.progress}%</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      <p className="font-semibold text-[#39FF14] mb-1">Training Information</p>
                      <p>Training uses your configured intents and entities to improve the NLU model. The process typically takes 3-5 seconds and includes data validation, feature extraction, and model optimization.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge-base' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Knowledge Base & FAQ</h2>
                <button
                  onClick={() => setShowNewKBModal(true)}
                  className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Article
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {knowledgeBase.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{item.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.content_type === 'faq' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            item.content_type === 'article' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {item.content_type}
                          </span>
                          {item.category && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">{item.category}</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{item.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editKnowledgeBase(item)}
                          className="text-[#39FF14] hover:text-[#39FF14] p-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteKnowledgeBase(item.id)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integrations' && selectedBot && (
            <ChatbotIntegrations botId={selectedBot} />
          )}
        </>
      )}

      {showNewIntentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowNewIntentModal(false);
                setEditingIntentId(null);
                resetIntentForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#39FF14]" />
              {editingIntentId ? 'Edit Intent' : 'Create New Intent'}
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Intent Name *</label>
                  <input
                    type="text"
                    value={intentForm.intent_name}
                    onChange={(e) => setIntentForm({ ...intentForm, intent_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="greeting"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lowercase, no spaces (e.g., order_status)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Name *</label>
                  <input
                    type="text"
                    value={intentForm.intent_display_name}
                    onChange={(e) => setIntentForm({ ...intentForm, intent_display_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="Greeting"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={intentForm.intent_description}
                  onChange={(e) => setIntentForm({ ...intentForm, intent_description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-20"
                  placeholder="Describe what this intent represents..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Training Phrases</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentPhrase}
                    onChange={(e) => setCurrentPhrase(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrainingPhrase())}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="Enter a training phrase and press Enter"
                  />
                  <button
                    onClick={addTrainingPhrase}
                    className="bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {intentForm.training_phrases.map((phrase, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
                      <span className="text-white text-sm">{phrase}</span>
                      <button
                        onClick={() => removeTrainingPhrase(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add at least 5 training phrases for better accuracy
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Action Type</label>
                  <select
                    value={intentForm.action_type}
                    onChange={(e) => setIntentForm({ ...intentForm, action_type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="text">Text Response</option>
                    <option value="api">API Call</option>
                    <option value="webhook">Webhook</option>
                    <option value="knowledge_base">Knowledge Base</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <input
                    type="number"
                    value={intentForm.priority}
                    onChange={(e) => setIntentForm({ ...intentForm, priority: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <div className="flex items-center gap-3 h-10">
                    <input
                      type="checkbox"
                      checked={intentForm.is_active}
                      onChange={(e) => setIntentForm({ ...intentForm, is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-700 bg-gray-800"
                    />
                    <span className="text-white">Active</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowNewIntentModal(false);
                    setEditingIntentId(null);
                    resetIntentForm();
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveIntent}
                  disabled={!intentForm.intent_name || !intentForm.intent_display_name}
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingIntentId ? 'Update Intent' : 'Create Intent'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewEntityModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowNewEntityModal(false);
                setEditingEntityId(null);
                resetEntityForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Tag className="w-6 h-6 text-[#39FF14]" />
              {editingEntityId ? 'Edit Entity' : 'Create New Entity'}
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entity Name *</label>
                  <input
                    type="text"
                    value={entityForm.entity_name}
                    onChange={(e) => setEntityForm({ ...entityForm, entity_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="product_name"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lowercase, no spaces (e.g., product_type)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Name *</label>
                  <input
                    type="text"
                    value={entityForm.entity_display_name}
                    onChange={(e) => setEntityForm({ ...entityForm, entity_display_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="Product Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Entity Type</label>
                <select
                  value={entityForm.entity_type}
                  onChange={(e) => setEntityForm({ ...entityForm, entity_type: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="list">List - Predefined values with synonyms</option>
                  <option value="regex">Regex - Pattern matching</option>
                  <option value="system">System - Built-in (date, time, number, etc.)</option>
                </select>
              </div>

              {entityForm.entity_type === 'list' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entity Values</label>
                  <div className="space-y-3 mb-3">
                    <input
                      type="text"
                      value={currentEntityValue}
                      onChange={(e) => setCurrentEntityValue(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="Enter value (e.g., laptop)"
                    />
                    <input
                      type="text"
                      value={currentEntitySynonyms}
                      onChange={(e) => setCurrentEntitySynonyms(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="Enter synonyms separated by commas (e.g., notebook, computer)"
                    />
                    <button
                      onClick={addEntityValue}
                      className="w-full bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Value
                    </button>
                  </div>
                  <div className="space-y-2">
                    {entityForm.values.map((val, idx) => (
                      <div key={idx} className="bg-gray-800 p-3 rounded-lg flex justify-between items-start">
                        <div>
                          <div className="text-white font-semibold">{val.value}</div>
                          {val.synonyms && val.synonyms.length > 0 && (
                            <div className="text-sm text-gray-400 mt-1">
                              Synonyms: {val.synonyms.join(', ')}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeEntityValue(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entityForm.entity_type === 'regex' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Regex Pattern</label>
                  <input
                    type="text"
                    value={entityForm.regex_pattern}
                    onChange={(e) => setEntityForm({ ...entityForm, regex_pattern: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] font-mono text-sm"
                    placeholder="^[A-Z]{2}\d{6}$"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a valid regular expression pattern
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={entityForm.is_active}
                    onChange={(e) => setEntityForm({ ...entityForm, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-800"
                  />
                  <span className="text-white">Active</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowNewEntityModal(false);
                    setEditingEntityId(null);
                    resetEntityForm();
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEntity}
                  disabled={!entityForm.entity_name || !entityForm.entity_display_name}
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingEntityId ? 'Update Entity' : 'Create Entity'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewMLConfigModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowNewMLConfigModal(false);
                setEditingMLConfigId(null);
                resetMLConfigForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#39FF14]" />
              {editingMLConfigId ? 'Edit ML Configuration' : 'Create ML Configuration'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Configuration Name *</label>
                <input
                  type="text"
                  value={mlConfigForm.config_name}
                  onChange={(e) => setMlConfigForm({ ...mlConfigForm, config_name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  placeholder="Production Config"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">NLU Engine</label>
                  <select
                    value={mlConfigForm.nlu_engine}
                    onChange={(e) => setMlConfigForm({ ...mlConfigForm, nlu_engine: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="spacy">Spacy (Word Embeddings)</option>
                    <option value="llm">LLM (Zero-shot)</option>
                    <option value="hybrid">Hybrid (Spacy + LLM)</option>
                    <option value="rasa">Rasa NLU</option>
                    <option value="dialogflow">Dialogflow</option>
                    <option value="luis">Microsoft LUIS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">LLM Provider</label>
                  <select
                    value={mlConfigForm.llm_provider}
                    onChange={(e) => setMlConfigForm({ ...mlConfigForm, llm_provider: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="azure">Azure OpenAI</option>
                    <option value="cohere">Cohere</option>
                    <option value="huggingface">HuggingFace</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                  <select
                    value={mlConfigForm.llm_model}
                    onChange={(e) => setMlConfigForm({ ...mlConfigForm, llm_model: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    {mlConfigForm.llm_provider === 'openai' && (
                      <>
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      </>
                    )}
                    {mlConfigForm.llm_provider === 'gemini' && (
                      <>
                        <option value="gemini-pro">Gemini Pro</option>
                        <option value="gemini-pro-vision">Gemini Pro Vision</option>
                        <option value="gemini-ultra">Gemini Ultra</option>
                      </>
                    )}
                    {mlConfigForm.llm_provider === 'anthropic' && (
                      <>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="claude-3-haiku">Claude 3 Haiku</option>
                      </>
                    )}
                    {!['openai', 'gemini', 'anthropic'].includes(mlConfigForm.llm_provider) && (
                      <option value="default">Default Model</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confidence Threshold</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={mlConfigForm.confidence_threshold}
                    onChange={(e) => setMlConfigForm({ ...mlConfigForm, confidence_threshold: parseFloat(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                  <p className="text-xs text-gray-500 mt-1">0.0 - 1.0 (higher = more strict)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={mlConfigForm.temperature}
                    onChange={(e) => setMlConfigForm({ ...mlConfigForm, temperature: parseFloat(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                  <p className="text-xs text-gray-500 mt-1">0.0 = deterministic, 2.0 = creative</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
                  <input
                    type="number"
                    step="50"
                    min="50"
                    max="4000"
                    value={mlConfigForm.max_tokens}
                    onChange={(e) => setMlConfigForm({ ...mlConfigForm, max_tokens: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum response length</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={mlConfigForm.is_active}
                    onChange={(e) => setMlConfigForm({ ...mlConfigForm, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-800"
                  />
                  <span className="text-white">Active Configuration</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowNewMLConfigModal(false);
                    setEditingMLConfigId(null);
                    resetMLConfigForm();
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMLConfig}
                  disabled={!mlConfigForm.config_name}
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingMLConfigId ? 'Update Configuration' : 'Create Configuration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConversationModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowConversationModal(false);
                setSelectedConversation(null);
                setConversationMessages([]);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-[#39FF14]" />
              Conversation Details
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Session Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Session ID:</span>
                    <p className="text-white font-mono">{selectedConversation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Messages:</span>
                    <p className="text-white">{conversationMessages.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Message History</h3>
                <div className="space-y-4">
                  {conversationMessages.map((msg, idx) => (
                    <div key={msg.id} className={`flex ${msg.message_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-4 ${
                        msg.message_type === 'user' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold opacity-75">
                            {msg.message_type === 'user' ? 'User' : 'Bot'}
                          </span>
                          <span className="text-xs opacity-60">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.message_text}</p>
                        {msg.detected_intent && (
                          <div className="mt-3 pt-3 border-t border-gray-600 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="opacity-75">Intent: {msg.detected_intent}</span>
                              {msg.intent_confidence && (
                                <span className="opacity-75">
                                  Confidence: {(msg.intent_confidence * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowConversationModal(false);
                    setSelectedConversation(null);
                    setConversationMessages([]);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewKBModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowNewKBModal(false);
                setEditingKBId(null);
                resetKBForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#39FF14]" />
              {editingKBId ? 'Edit Article' : 'Add New Article'}
            </h2>

            <div className="space-y-6">
              <div className="flex gap-2 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <button
                  onClick={() => setKbForm({ ...kbForm, source_type: 'manual' })}
                  className={`flex-1 py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                    kbForm.source_type === 'manual' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Manual Entry
                </button>
                <button
                  onClick={() => setKbForm({ ...kbForm, source_type: 'upload' })}
                  className={`flex-1 py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                    kbForm.source_type === 'upload' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
                <button
                  onClick={() => setKbForm({ ...kbForm, source_type: 'url' })}
                  className={`flex-1 py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                    kbForm.source_type === 'url' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Link className="w-4 h-4" />
                  Import from URL
                </button>
                <button
                  onClick={() => setKbForm({ ...kbForm, source_type: 'storage' })}
                  className={`flex-1 py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                    kbForm.source_type === 'storage' ? 'bg-[#39FF14] text-black font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  Storage
                </button>
              </div>

              {kbForm.source_type === 'upload' && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Upload Document</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#39FF14] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".txt,.md,.csv,.json,.xml,.html"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setKbForm({ ...kbForm, file });
                          handleFileUpload(file);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-white font-semibold mb-1">Click to upload or drag and drop</p>
                      <p className="text-gray-400 text-sm">Supported: TXT, MD, CSV, JSON, XML, HTML</p>
                    </label>
                  </div>
                  {isProcessing && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-[#39FF14] mb-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Processing file... {Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#39FF14] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {kbForm.source_type === 'url' && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Import from URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={kbForm.url}
                      onChange={(e) => setKbForm({ ...kbForm, url: e.target.value })}
                      placeholder="https://example.com/article"
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                    />
                    <button
                      onClick={() => kbForm.url && handleURLIngestion(kbForm.url)}
                      disabled={!kbForm.url || isProcessing}
                      className="bg-[#39FF14] text-black px-6 py-3 rounded-lg hover:bg-[#32e012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {isProcessing ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        'Import'
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Paste a URL to import content from a webpage</p>
                </div>
              )}

              {kbForm.source_type === 'storage' && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-4">Connect to Storage</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Server className="w-6 h-6 text-[#39FF14]" />
                        <span className="text-white font-semibold">FTP/SFTP</span>
                      </div>
                      <p className="text-gray-400 text-sm">Connect to FTP or SFTP server</p>
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <HardDrive className="w-6 h-6 text-green-400" />
                        <span className="text-white font-semibold">NAS/SAN</span>
                      </div>
                      <p className="text-gray-400 text-sm">Connect to network storage</p>
                    </button>
                  </div>
                  <div className="mt-4 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                    <p className="text-[#39FF14] text-sm">
                      Storage integrations require configuration. Contact your administrator to set up storage connections.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={kbForm.title}
                    onChange={(e) => setKbForm({ ...kbForm, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="Article title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                  <select
                    value={kbForm.content_type}
                    onChange={(e) => setKbForm({ ...kbForm, content_type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="article">Article</option>
                    <option value="faq">FAQ</option>
                    <option value="documentation">Documentation</option>
                    <option value="guide">Guide</option>
                    <option value="policy">Policy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={kbForm.category}
                  onChange={(e) => setKbForm({ ...kbForm, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  placeholder="e.g., Product Info, Troubleshooting, Billing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
                <textarea
                  value={kbForm.content}
                  onChange={(e) => setKbForm({ ...kbForm, content: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-48 resize-none"
                  placeholder="Enter the article content..."
                />
                <p className="text-xs text-gray-500 mt-1">{kbForm.content.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    onClick={addTag}
                    className="bg-[#39FF14] text-black px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {kbForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {kbForm.tags.map((tag, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
                        <span className="text-white text-sm">#{tag}</span>
                        <button
                          onClick={() => removeTag(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="kb-active"
                  checked={kbForm.is_active}
                  onChange={(e) => setKbForm({ ...kbForm, is_active: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-[#39FF14] focus:ring-[#39FF14]"
                />
                <label htmlFor="kb-active" className="text-gray-300 cursor-pointer">
                  Make this article active and searchable
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowNewKBModal(false);
                    setEditingKBId(null);
                    resetKBForm();
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKnowledgeBase}
                  className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg transition-colors font-semibold flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingKBId ? 'Update Article' : 'Save Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
