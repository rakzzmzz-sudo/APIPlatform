import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { NewIntentModal, NewToolModal, NewConfigurationModal, CallDetailModal } from './VoiceAgentModals';
import VoiceAgentAnalytics from './VoiceAgentAnalytics';
import {
  Phone, Play, Pause, PhoneOff, PhoneCall, Mic, Volume2, Users,
  TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Plus,
  Settings as SettingsIcon, Brain, MessageSquare, Zap, Activity,
  BarChart3, FileText, Edit2, Trash2, Eye, Download, Boxes, Radio,
  Network, TestTube, Server, Code, BookOpen, Tag, List, FileCode,
  Database, Book, Globe, Shield, MessageCircle, Ban
} from 'lucide-react';

interface VoiceAgent {
  id: string;
  agent_name: string;
  agent_description: string;
  status: string;
  voice_provider: string;
  voice_name: string;
  voice_language: string;
  ai_provider: string;
  ai_model: string;
  total_calls: number;
  successful_calls: number;
  average_call_duration_seconds: number;
  assigned_phone_numbers: string[];
  created_at: string;
}

interface Intent {
  id: string;
  intent_name: string;
  intent_display_name: string;
  intent_description: string;
  training_phrases: string[];
  action_type: string;
  is_active: boolean;
  priority: number;
}

interface Tool {
  id: string;
  tool_name: string;
  tool_description: string;
  http_method: string | null;
  api_url: string | null;
  is_active: boolean;
  call_count: number;
}

export default function VoiceAgentEnhanced() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [configurations, setConfigurations] = useState<any[]>([]);

  const [showNewIntentModal, setShowNewIntentModal] = useState(false);
  const [showNewToolModal, setShowNewToolModal] = useState(false);
  const [showNewConfigModal, setShowNewConfigModal] = useState(false);
  const [editingIntent, setEditingIntent] = useState<any>(null);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [editingConfig, setEditingConfig] = useState<any>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadAgentData();
    }
  }, [selectedAgent]);

  const loadAgents = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await db
        .from('voice_agents')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAgents(data || []);
      if (data && data.length > 0 && !selectedAgent) {
        setSelectedAgent(data[0].id);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const loadAgentData = async () => {
    if (!selectedAgent) return;
    await Promise.all([
      loadIntents(),
      loadTools(),
      loadConfigurations()
    ]);
  };

  const loadIntents = async () => {
    if (!selectedAgent) return;
    try {
      const { data, error } = await db
        .from('voice_agent_intents')
        .select('*')
        .eq('agent_id', selectedAgent)
        .order('priority', { ascending: false });
      if (error) throw error;
      setIntents(data || []);
    } catch (error) {
      console.error('Error loading intents:', error);
    }
  };

  const loadTools = async () => {
    if (!selectedAgent) return;
    try {
      const { data, error } = await db
        .from('voice_agent_tools')
        .select('*')
        .eq('agent_id', selectedAgent)
        .order('tool_name');
      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  };

  const loadConfigurations = async () => {
    if (!selectedAgent) return;
    try {
      const { data, error } = await db
        .from('voice_agent_configurations')
        .select('*')
        .eq('agent_id', selectedAgent)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setConfigurations(data || []);
    } catch (error) {
      console.error('Error loading configurations:', error);
    }
  };

  const currentAgent = agents.find(a => a.id === selectedAgent);

  const renderMainProcess = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Main Process</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveSubTab('task-flow')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-[#39FF14]/20/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#39FF14]" />
            </div>
            <h4 className="text-lg font-semibold text-white">Task Flow</h4>
          </div>
          <p className="text-sm text-gray-400">Design conversation flows and dialog paths for your voice agent</p>
        </button>

        <button
          onClick={() => setActiveSubTab('task-intent')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-[#39FF14]/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#39FF14]" />
            </div>
            <h4 className="text-lg font-semibold text-white">Task Intent</h4>
          </div>
          <p className="text-sm text-gray-400">Manage intents and training phrases for intent recognition</p>
        </button>
      </div>

      {activeSubTab === 'task-intent' && (
        <div className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-lg font-bold text-white">Voice Intents</h4>
            <button
              onClick={() => {
                setEditingIntent(null);
                setShowNewIntentModal(true);
              }}
              className="bg-[#39FF14] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
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
                    <h3 className="text-lg font-bold text-white mb-1">{intent.intent_display_name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{intent.intent_description}</p>
                    <div className="flex flex-wrap gap-2">
                      {intent.training_phrases.slice(0, 3).map((phrase, idx) => (
                        <span key={idx} className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${intent.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {intent.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => {
                        setEditingIntent(intent);
                        setShowNewIntentModal(true);
                      }}
                      className="text-[#39FF14] hover:text-[#39FF14] p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderKnowledgeBase = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Knowledge Base</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">Q&A Knowledge</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Question and answer pairs for specific queries</p>
          <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#32e012] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Q&A
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">Chit-Chat Base</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Casual conversation responses and personality</p>
          <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#32e012] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Chit-Chat
          </button>
        </div>
      </div>
    </div>
  );

  const renderConversationTag = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Conversation Tag</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-6 h-6 text-[#39FF14]" />
            <h4 className="text-lg font-semibold text-white">Conversation Tag</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Tag and categorize conversations</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-6 h-6 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Conversation SMS</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">SMS conversation tracking</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Ban className="w-6 h-6 text-red-400" />
            <h4 className="text-lg font-semibold text-white">Blacklist Rule</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Block specific patterns or numbers</p>
        </div>
      </div>
    </div>
  );

  const renderLexiconManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Lexicon Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-6 h-6 text-red-400" />
            <h4 className="text-lg font-semibold text-white">Stop Word</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Words to filter from processing</p>
          <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#32e012] transition-colors">
            Manage Stop Words
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileCode className="w-6 h-6 text-[#39FF14]" />
            <h4 className="text-lg font-semibold text-white">Synonym</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Define word equivalencies</p>
          <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#32e012] transition-colors">
            Manage Synonyms
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Boxes className="w-6 h-6 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Entity Management</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Custom entities and extraction</p>
          <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#32e012] transition-colors">
            Manage Entities
          </button>
        </div>
      </div>
    </div>
  );

  const renderReferenceMaterial = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Reference Material Knowledge</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-6 h-6 text-[#39FF14]" />
            <h4 className="text-lg font-semibold text-white">Attribute Management</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Manage custom attributes and fields</p>
          <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#32e012] transition-colors">
            Configure Attributes
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Book className="w-6 h-6 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Table Knowledge</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">Structured data reference tables</p>
          <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#32e012] transition-colors">
            Manage Tables
          </button>
        </div>
      </div>
    </div>
  );

  const renderBotSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Bot Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveSubTab('basic-info')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-[#39FF14]" />
            <h4 className="text-lg font-semibold text-white">Basic Information</h4>
          </div>
          <p className="text-sm text-gray-400">Agent name, description, and identity</p>
        </button>

        <button
          onClick={() => setActiveSubTab('guiding-prompt')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-6 h-6 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Guiding Prompt</h4>
          </div>
          <p className="text-sm text-gray-400">System prompts and personality</p>
        </button>

        <button
          onClick={() => setActiveSubTab('transfer-agent')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-[#39FF14]" />
            <h4 className="text-lg font-semibold text-white">Transfer To Agent</h4>
          </div>
          <p className="text-sm text-gray-400">Human handoff configuration</p>
        </button>

        <button
          onClick={() => setActiveSubTab('voice-config')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <Volume2 className="w-6 h-6 text-yellow-400" />
            <h4 className="text-lg font-semibold text-white">Voice Configuration</h4>
          </div>
          <p className="text-sm text-gray-400">Voice settings and parameters</p>
        </button>

        <button
          onClick={() => setActiveSubTab('knowledge-settings')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-[#39FF14]" />
            <h4 className="text-lg font-semibold text-white">Knowledge Settings</h4>
          </div>
          <p className="text-sm text-gray-400">Knowledge base configuration</p>
        </button>

        <button
          onClick={() => setActiveSubTab('advanced-settings')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <SettingsIcon className="w-6 h-6 text-red-400" />
            <h4 className="text-lg font-semibold text-white">Advanced Settings</h4>
          </div>
          <p className="text-sm text-gray-400">Advanced agent configuration</p>
        </button>

        <button
          onClick={() => setActiveSubTab('multi-language')}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6 text-[#39FF14]" />
            <h4 className="text-lg font-semibold text-white">Multiple Languages</h4>
          </div>
          <p className="text-sm text-gray-400">Multi-language support</p>
        </button>
      </div>

      {activeSubTab === 'voice-config' && (
        <div className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-lg font-bold text-white">Voice Agent Configurations</h4>
            <button
              onClick={() => {
                setEditingConfig(null);
                setShowNewConfigModal(true);
              }}
              className="bg-[#39FF14] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {configurations.map((config) => (
              <div key={config.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{config.configuration_name}</h3>
                    <p className="text-sm text-gray-400">{config.conversation_style} style</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingConfig(config);
                      setShowNewConfigModal(true);
                    }}
                    className="text-[#39FF14] hover:text-[#39FF14] p-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Max Turns:</span>
                    <span className="text-white ml-2">{config.max_conversation_turns}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Voice Speed:</span>
                    <span className="text-white ml-2">{config.voice_speed_multiplier}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Voice Agent Platform</h1>
        <p className="text-gray-400">Advanced AI-powered voice agent with comprehensive features</p>
      </div>

      {agents.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Voice Agent</label>
          <select
            value={selectedAgent || ''}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full md:w-64"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.agent_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-gray-900 rounded-lg shadow-lg">
        <div className="border-b border-gray-800 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setActiveSubTab('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('main-process');
                setActiveSubTab('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'main-process' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              Main Process
            </button>
            <button
              onClick={() => {
                setActiveTab('knowledge-base');
                setActiveSubTab('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'knowledge-base' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </button>
            <button
              onClick={() => {
                setActiveTab('conversation-tag');
                setActiveSubTab('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'conversation-tag' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Tag className="w-4 h-4" />
              Conversation Tag
            </button>
            <button
              onClick={() => {
                setActiveTab('lexicon');
                setActiveSubTab('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'lexicon' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
              Lexicon
            </button>
            <button
              onClick={() => {
                setActiveTab('reference-material');
                setActiveSubTab('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'reference-material' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Database className="w-4 h-4" />
              Reference Material
            </button>
            <button
              onClick={() => {
                setActiveTab('bot-settings');
                setActiveSubTab('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'bot-settings' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Bot Settings
            </button>
            <button
              onClick={() => {
                setActiveTab('analytics');
                setActiveSubTab('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Voice Agent Dashboard</h2>
              {currentAgent && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-400 mb-2">Total Calls</div>
                    <div className="text-3xl font-bold text-white">{currentAgent.total_calls}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-400 mb-2">Success Rate</div>
                    <div className="text-3xl font-bold text-green-400">
                      {currentAgent.total_calls > 0
                        ? ((currentAgent.successful_calls / currentAgent.total_calls) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-400 mb-2">Avg Duration</div>
                    <div className="text-3xl font-bold text-white">
                      {Math.floor(currentAgent.average_call_duration_seconds / 60)}m
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-400 mb-2">Status</div>
                    <div className={`text-xl font-bold ${
                      currentAgent.status === 'active' ? 'text-green-400' :
                      currentAgent.status === 'testing' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {currentAgent.status}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'main-process' && renderMainProcess()}
          {activeTab === 'knowledge-base' && renderKnowledgeBase()}
          {activeTab === 'conversation-tag' && renderConversationTag()}
          {activeTab === 'lexicon' && renderLexiconManagement()}
          {activeTab === 'reference-material' && renderReferenceMaterial()}
          {activeTab === 'bot-settings' && renderBotSettings()}
          {activeTab === 'analytics' && selectedAgent && <VoiceAgentAnalytics agentId={selectedAgent} />}
        </div>
      </div>

      {selectedAgent && (
        <>
          <NewIntentModal
            agentId={selectedAgent}
            isOpen={showNewIntentModal}
            onClose={() => {
              setShowNewIntentModal(false);
              setEditingIntent(null);
            }}
            onSave={() => {
              loadIntents();
            }}
            editingIntent={editingIntent}
          />

          <NewToolModal
            agentId={selectedAgent}
            isOpen={showNewToolModal}
            onClose={() => {
              setShowNewToolModal(false);
              setEditingTool(null);
            }}
            onSave={() => {
              loadTools();
            }}
            editingTool={editingTool}
          />

          <NewConfigurationModal
            agentId={selectedAgent}
            isOpen={showNewConfigModal}
            onClose={() => {
              setShowNewConfigModal(false);
              setEditingConfig(null);
            }}
            onSave={() => {
              loadConfigurations();
            }}
            editingConfig={editingConfig}
          />
        </>
      )}
    </div>
  );
}
