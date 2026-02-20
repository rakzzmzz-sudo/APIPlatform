import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { NewIntentModal, NewToolModal, NewConfigurationModal, CallDetailModal } from './VoiceAgentModals';
import VoiceAgentAnalytics from './VoiceAgentAnalytics';
import RapidaVoiceAI from './RapidaVoiceAI';
import {
  Phone, Play, Pause, PhoneOff, PhoneCall, Mic, Volume2, Users,
  TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Plus,
  Settings as SettingsIcon, Brain, MessageSquare, Zap, Activity,
  BarChart3, FileText, Edit2, Trash2, Eye, Download, Boxes, Radio,
  Network, TestTube, Server, Code, Workflow
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
  system_prompt?: string;
  created_at: string;
}

interface Call {
  id: string;
  call_sid: string;
  call_direction: string;
  from_number: string;
  to_number: string;
  call_status: string;
  started_at: string;
  ended_at: string | null;
  call_duration_seconds: number;
  turn_count: number;
  detected_intent: string | null;
  sentiment_overall: string | null;
  sentiment_score: number | null;
  functions_called: string[];
}

interface Transcript {
  id: string;
  turn_number: number;
  speaker: string;
  transcript_text: string;
  audio_duration_seconds: number;
  sentiment: string | null;
  detected_intent: string | null;
  intent_confidence: number | null;
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

interface Analytics {
  date: string;
  hour: number;
  total_calls: number;
  successful_calls: number;
  average_call_duration_seconds: number;
  average_sentiment_score: number;
}

interface LiveKitAgent {
  id: string;
  agent_name: string;
  agent_description: string;
  stt_provider: string;
  llm_provider: string;
  llm_model: string;
  tts_provider: string;
  enable_webrtc: boolean;
  enable_telephony: boolean;
  enable_turn_detection: boolean;
  enable_mcp: boolean;
  status: string;
}

interface LiveKitSession {
  id: string;
  session_type: string;
  participant_name: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  total_turns: number;
  interruptions_count: number;
  status: string;
}

interface LiveKitJob {
  id: string;
  job_type: string;
  job_priority: number;
  status: string;
  created_at: string;
  worker_id: string | null;
}

interface LiveKitWorker {
  id: string;
  worker_name: string;
  worker_type: string;
  max_concurrent_jobs: number;
  current_jobs: number;
  status: string;
  total_jobs_processed: number;
}

interface LiveKitTurnDetection {
  id: string;
  turn_number: number;
  speaker: string;
  confidence_score: number;
  pause_duration_ms: number;
  was_interruption: boolean;
  detected_at: string;
}

interface LiveKitMCPTool {
  id: string;
  tool_name: string;
  tool_description: string;
  mcp_server_url: string;
  total_calls: number;
  successful_calls: number;
  status: string;
}

interface LiveKitTestCase {
  id: string;
  test_name: string;
  test_type: string;
  last_result: string | null;
  last_score: number | null;
  total_runs: number;
  passed_runs: number;
  status: string;
}

interface LiveKitRPCCall {
  id: string;
  rpc_method: string;
  direction: string;
  latency_ms: number;
  status: string;
  called_at: string;
}

export default function VoiceAgent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dataLoading, setDataLoading] = useState(false);

  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);

  const [livekitAgents, setLivekitAgents] = useState<LiveKitAgent[]>([]);
  const [selectedLivekitAgent, setSelectedLivekitAgent] = useState<string | null>(null);
  const [livekitSessions, setLivekitSessions] = useState<LiveKitSession[]>([]);
  const [livekitJobs, setLivekitJobs] = useState<LiveKitJob[]>([]);
  const [livekitWorkers, setLivekitWorkers] = useState<LiveKitWorker[]>([]);
  const [livekitTurnDetections, setLivekitTurnDetections] = useState<LiveKitTurnDetection[]>([]);
  const [livekitMCPTools, setLivekitMCPTools] = useState<LiveKitMCPTool[]>([]);
  const [livekitTestCases, setLivekitTestCases] = useState<LiveKitTestCase[]>([]);
  const [livekitRPCCalls, setLivekitRPCCalls] = useState<LiveKitRPCCall[]>([]);

  const [showNewIntentModal, setShowNewIntentModal] = useState(false);
  const [showNewToolModal, setShowNewToolModal] = useState(false);
  const [showNewConfigModal, setShowNewConfigModal] = useState(false);
  const [showCallDetailModal, setShowCallDetailModal] = useState(false);
  const [editingIntent, setEditingIntent] = useState<any>(null);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [configurations, setConfigurations] = useState<any[]>([]);

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadAgentData();
    }
  }, [selectedAgent]);

  useEffect(() => {
    if (selectedCall) {
      loadTranscripts();
    }
  }, [selectedCall]);

  useEffect(() => {
    if (activeTab === 'livekit') {
      loadLivekitData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedLivekitAgent) {
      loadLivekitAgentDetails();
    }
  }, [selectedLivekitAgent]);

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
      loadCalls(),
      loadIntents(),
      loadTools(),
      loadAnalytics(),
      loadConfigurations()
    ]);
  };

  const loadCalls = async () => {
    if (!selectedAgent) return;
    try {
      const { data, error } = await db
        .from('voice_agent_calls')
        .select('*')
        .eq('agent_id', selectedAgent)
        .order('started_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setCalls(data || []);
    } catch (error) {
      console.error('Error loading calls:', error);
    }
  };

  const loadTranscripts = async () => {
    if (!selectedCall) return;
    try {
      const { data, error } = await db
        .from('voice_agent_transcripts')
        .select('*')
        .eq('call_id', selectedCall)
        .order('turn_number');
      if (error) throw error;
      setTranscripts(data || []);
    } catch (error) {
      console.error('Error loading transcripts:', error);
    }
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

  const loadAnalytics = async () => {
    if (!selectedAgent) return;
    try {
      const { data, error } = await db
        .from('voice_agent_analytics')
        .select('*')
        .eq('agent_id', selectedAgent)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false })
        .order('hour', { ascending: false });
      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadLivekitData = async () => {
    try {
      const { data, error } = await db
        .from('livekit_agents')
        .select('*')
        
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLivekitAgents(data || []);
      if (data && data.length > 0 && !selectedLivekitAgent) {
        setSelectedLivekitAgent(data[0].id);
      }
    } catch (error) {
      console.error('Error loading livekit agents:', error);
    }
  };

  const loadLivekitAgentDetails = async () => {
    if (!selectedLivekitAgent) return;
    await Promise.all([
      loadLivekitSessions(),
      loadLivekitJobs(),
      loadLivekitWorkers(),
      loadLivekitMCPTools(),
      loadLivekitTestCases()
    ]);
  };

  const loadLivekitSessions = async () => {
    if (!selectedLivekitAgent) return;
    try {
      const { data, error } = await db
        .from('livekit_sessions')
        .select('*')
        .eq('agent_id', selectedLivekitAgent)
        .order('started_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setLivekitSessions(data || []);
    } catch (error) {
      console.error('Error loading livekit sessions:', error);
    }
  };

  const loadLivekitJobs = async () => {
    try {
      const { data, error } = await db
        .from('livekit_jobs')
        .select('*')
        
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setLivekitJobs(data || []);
    } catch (error) {
      console.error('Error loading livekit jobs:', error);
    }
  };

  const loadLivekitWorkers = async () => {
    try {
      const { data, error } = await db
        .from('livekit_workers')
        .select('*')
        
        .order('worker_name');
      if (error) throw error;
      setLivekitWorkers(data || []);
    } catch (error) {
      console.error('Error loading livekit workers:', error);
    }
  };

  const loadLivekitMCPTools = async () => {
    if (!selectedLivekitAgent) return;
    try {
      const { data, error } = await db
        .from('livekit_mcp_tools')
        .select('*')
        .eq('agent_id', selectedLivekitAgent)
        .order('tool_name');
      if (error) throw error;
      setLivekitMCPTools(data || []);
    } catch (error) {
      console.error('Error loading livekit mcp tools:', error);
    }
  };

  const loadLivekitTestCases = async () => {
    if (!selectedLivekitAgent) return;
    try {
      const { data, error } = await db
        .from('livekit_test_cases')
        .select('*')
        .eq('agent_id', selectedLivekitAgent)
        .order('test_name');
      if (error) throw error;
      setLivekitTestCases(data || []);
    } catch (error) {
      console.error('Error loading livekit test cases:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading voice agents...</p>
        </div>
      </div>
    );
  }

  const currentAgent = agents.find(a => a.id === selectedAgent);
  const activeCalls = calls.filter(c => c.call_status === 'in_progress');
  const completedCalls = calls.filter(c => c.call_status === 'completed');
  const successRate = currentAgent && currentAgent.total_calls > 0
    ? ((currentAgent.successful_calls / currentAgent.total_calls) * 100).toFixed(1)
    : '0';

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Phone className="w-8 h-8 text-[#39FF14]" />
              AI Voice Agent
            </h1>
            <p className="text-gray-400">Conversational AI for voice calls with real-time speech processing</p>
            {currentAgent && (
              <div className="mt-3 flex items-center gap-4">
                <span className="text-sm text-gray-500">Current Agent:</span>
                <span className="text-[#39FF14] font-medium">{currentAgent.agent_name}</span>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  currentAgent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  currentAgent.status === 'testing' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {currentAgent.status}
                </span>
                {currentAgent.assigned_phone_numbers.length > 0 && (
                  <span className="text-gray-500 text-sm">
                    {currentAgent.assigned_phone_numbers.length} phone number(s)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Phone className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No voice agents found</h3>
          <p className="text-gray-400 mb-6">Create your first AI voice agent to handle calls</p>
          <button className="bg-[#39FF14] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#32e012] transition-colors">
            <Plus className="w-5 h-5 inline mr-2" />
            Create Voice Agent
          </button>
        </div>
      ) : (
        <>
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'calls' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              Call History ({calls.length})
            </button>
            <button
              onClick={() => setActiveTab('intents')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'intents' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Intents ({intents.length})
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'tools' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              Tools ({tools.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('configuration')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'configuration' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Configuration
            </button>
            <button
              onClick={() => setActiveTab('livekit')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'livekit' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Radio className="w-4 h-4" />
              LiveKit AI
            </button>
            <button
              onClick={() => setActiveTab('rapida')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'rapida' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Workflow className="w-4 h-4" />
              Rapida AI
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <PhoneCall className="w-8 h-8 text-white" />
                    <span className="text-white/80 text-sm">Total Calls</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{currentAgent?.total_calls || 0}</div>
                  <div className="text-white/70 text-sm mt-1">{activeCalls.length} active now</div>
                </div>

                <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-white" />
                    <span className="text-white/80 text-sm">Success Rate</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{successRate}%</div>
                  <div className="text-white/70 text-sm mt-1">{currentAgent?.successful_calls || 0} successful</div>
                </div>

                <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-white" />
                    <span className="text-white/80 text-sm">Avg Duration</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatDuration(currentAgent?.average_call_duration_seconds || 0)}
                  </div>
                  <div className="text-white/70 text-sm mt-1">minutes per call</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Brain className="w-8 h-8 text-white" />
                    <span className="text-white/80 text-sm">AI Model</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{currentAgent?.ai_model || 'N/A'}</div>
                  <div className="text-white/70 text-sm mt-1">{currentAgent?.ai_provider}</div>
                </div>
              </div>

              {activeCalls.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-green-500" />
                    Active Calls
                  </h3>
                  <div className="space-y-3">
                    {activeCalls.map((call) => (
                      <div key={call.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-semibold">{call.from_number}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-[#39FF14]">{call.to_number}</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              Live
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{call.turn_count} turns</span>
                            <span>{Math.floor((Date.now() - new Date(call.started_at).getTime()) / 1000)}s elapsed</span>
                          </div>
                        </div>
                        <button className="text-red-400 hover:text-red-300 p-2">
                          <PhoneOff className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Voice & AI Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Voice Settings
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Provider:</span>
                        <span className="text-white font-medium">{currentAgent?.voice_provider}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Voice:</span>
                        <span className="text-white font-medium">{currentAgent?.voice_name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Language:</span>
                        <span className="text-white font-medium">{currentAgent?.voice_language}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Configuration
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Provider:</span>
                        <span className="text-white font-medium">{currentAgent?.ai_provider}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Model:</span>
                        <span className="text-white font-medium">{currentAgent?.ai_model}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Phone Numbers:</span>
                        <span className="text-white font-medium">{currentAgent?.assigned_phone_numbers.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Calls</h3>
                <div className="space-y-2">
                  {completedCalls.slice(0, 5).map((call) => (
                    <div
                      key={call.id}
                      onClick={() => {
                        setSelectedCall(call.id);
                        setActiveTab('calls');
                      }}
                      className="bg-gray-700 rounded-lg p-3 hover:bg-gray-650 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white">{call.from_number}</span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              call.call_direction === 'inbound' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-[#39FF14]/20 text-[#39FF14]'
                            }`}>
                              {call.call_direction}
                            </span>
                            {call.sentiment_overall && (
                              <span className={`px-2 py-1 text-xs rounded ${
                                call.sentiment_overall === 'positive' ? 'bg-green-500/20 text-green-400' :
                                call.sentiment_overall === 'negative' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {call.sentiment_overall}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{formatDuration(call.call_duration_seconds)}</span>
                            <span>{call.turn_count} turns</span>
                            <span>{new Date(call.started_at).toLocaleString()}</span>
                            {call.detected_intent && <span>Intent: {call.detected_intent}</span>}
                          </div>
                        </div>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calls' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Call History</h2>
                <div className="flex gap-2">
                  <select className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm">
                    <option>All Statuses</option>
                    <option>Completed</option>
                    <option>In Progress</option>
                    <option>Failed</option>
                  </select>
                  <select className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Call SID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Direction</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">From/To</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Duration</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Sentiment</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calls.map((call) => (
                      <tr key={call.id} className="border-t border-gray-700 hover:bg-gray-750">
                        <td className="px-4 py-3 text-sm text-gray-300 font-mono">{call.call_sid.substring(0, 16)}...</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded ${
                            call.call_direction === 'inbound' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-[#39FF14]/20 text-[#39FF14]'
                          }`}>
                            {call.call_direction}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          <div>{call.from_number}</div>
                          <div className="text-gray-500 text-xs">→ {call.to_number}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">{formatDuration(call.call_duration_seconds)}</td>
                        <td className="px-4 py-3 text-sm">
                          {call.sentiment_overall ? (
                            <span className={`px-2 py-1 text-xs rounded ${
                              call.sentiment_overall === 'positive' ? 'bg-green-500/20 text-green-400' :
                              call.sentiment_overall === 'negative' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {call.sentiment_overall}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded ${
                            call.call_status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            call.call_status === 'in_progress' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            call.call_status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {call.call_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">{new Date(call.started_at).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => {
                              setSelectedCall(call.id);
                              setShowCallDetailModal(true);
                            }}
                            className="text-[#39FF14] hover:text-[#39FF14]"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedCall && transcripts.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Call Transcript</h3>
                    <button
                      onClick={() => setSelectedCall(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {transcripts.map((transcript) => (
                      <div
                        key={transcript.id}
                        className={`p-4 rounded-lg ${
                          transcript.speaker === 'agent' ? 'bg-[#39FF14]/5 border-l-4 border-[#39FF14]' :
                          transcript.speaker === 'user' ? 'bg-gray-700' :
                          'bg-gray-750'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Turn {transcript.turn_number}</span>
                            <span className={`px-2 py-1 text-xs rounded font-semibold ${
                              transcript.speaker === 'agent' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                              transcript.speaker === 'user' ? 'bg-green-500/20 text-green-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {transcript.speaker}
                            </span>
                            {transcript.sentiment && (
                              <span className={`px-2 py-1 text-xs rounded ${
                                transcript.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                transcript.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {transcript.sentiment}
                              </span>
                            )}
                            {transcript.detected_intent && (
                              <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded">
                                Intent: {transcript.detected_intent}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{transcript.audio_duration_seconds.toFixed(1)}s</span>
                        </div>
                        <p className="text-white">{transcript.transcript_text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'intents' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Voice Intents</h2>
                <button
                  onClick={() => {
                    setEditingIntent(null);
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
                          <span className={`px-2 py-1 text-xs rounded ${
                            intent.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {intent.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            intent.action_type === 'speak' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            intent.action_type === 'transfer' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            intent.action_type === 'function_call' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {intent.action_type}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{intent.intent_description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-[#39FF14] hover:text-[#39FF14] p-2">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300 p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Training Phrases ({intent.training_phrases.length}):</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {intent.training_phrases.slice(0, 6).map((phrase, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded">
                            "{phrase}"
                          </span>
                        ))}
                        {intent.training_phrases.length > 6 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-sm rounded">
                            +{intent.training_phrases.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Function Calling Tools</h2>
                <button
                  onClick={() => {
                    setEditingTool(null);
                    setShowNewToolModal(true);
                  }}
                  className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Tool
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{tool.tool_name}</h3>
                          {tool.http_method && (
                            <span className={`px-2 py-1 text-xs rounded font-mono ${
                              tool.http_method === 'GET' ? 'bg-green-500/20 text-green-400' :
                              tool.http_method === 'POST' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                              'bg-[#39FF14]/20 text-[#39FF14]'
                            }`}>
                              {tool.http_method}
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded ${
                            tool.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {tool.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{tool.tool_description}</p>
                        {tool.api_url && (
                          <code className="text-xs text-[#39FF14] font-mono block bg-gray-900 p-2 rounded">
                            {tool.api_url}
                          </code>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-[#39FF14] hover:text-[#39FF14] p-2">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300 p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Called {tool.call_count} times</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && selectedAgent && (
            <VoiceAgentAnalytics agentId={selectedAgent} />
          )}

          {activeTab === 'configuration' && (
            <div className="space-y-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Agent Configurations</h2>
                <button
                  onClick={() => {
                    setEditingConfig(null);
                    setShowNewConfigModal(true);
                  }}
                  className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Configuration
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {configurations.map((config) => (
                  <div key={config.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{config.configuration_name}</h3>
                        <p className="text-sm text-gray-400">{config.conversation_style} style</p>
                      </div>
                      <div className="flex gap-2">
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
                      <div>
                        <span className="text-gray-400">Interruptions:</span>
                        <span className={`ml-2 ${config.enable_interruption_handling ? 'text-green-400' : 'text-gray-500'}`}>
                          {config.enable_interruption_handling ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Emotion Detection:</span>
                        <span className={`ml-2 ${config.enable_emotion_detection ? 'text-green-400' : 'text-gray-500'}`}>
                          {config.enable_emotion_detection ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Basic Agent Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name</label>
                    <input
                      type="text"
                      defaultValue={currentAgent?.agent_name}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      defaultValue={currentAgent?.status}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="testing">Testing</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Voice Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                      <option value="elevenlabs">ElevenLabs</option>
                      <option value="openai">OpenAI</option>
                      <option value="google">Google</option>
                      <option value="azure">Azure</option>
                      <option value="amazon">Amazon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es-ES">Spanish</option>
                      <option value="fr-FR">French</option>
                      <option value="de-DE">German</option>
                      <option value="zh-CN">Chinese</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Voice Model</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                      <option>Sarah - Professional</option>
                      <option>Alex - Sales</option>
                      <option>Emma - Scheduler</option>
                      <option>Marcus - Professional</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">AI Model Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      defaultValue="0.7"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">System Prompt</h3>
                <textarea
                  rows={8}
                  defaultValue={currentAgent?.system_prompt || ''}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono text-sm"
                  placeholder="Enter system prompt for the AI voice agent..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button className="bg-[#39FF14] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors">
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {activeTab === 'livekit' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <Radio className="w-7 h-7" />
                  LiveKit Voice AI Agent Framework
                </h2>
                <p className="text-[#39FF14]/80">
                  Flexible integrations with Assembly (STT), Gemini (LLM), and multiple TTS providers.
                  Built-in job scheduling, WebRTC support, telephony integration, and semantic turn detection.
                </p>
              </div>

              {livekitAgents.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 text-center">
                  <Radio className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No LiveKit agents configured</h3>
                  <p className="text-gray-400 mb-6">Create your first LiveKit voice AI agent with Assembly STT and Gemini LLM</p>
                  <button className="bg-[#39FF14] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#32e012] transition-colors">
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create LiveKit Agent
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select LiveKit Agent</label>
                    <select
                      value={selectedLivekitAgent || ''}
                      onChange={(e) => setSelectedLivekitAgent(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    >
                      {livekitAgents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.agent_name} - {agent.llm_model} ({agent.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedLivekitAgent && livekitAgents.find(a => a.id === selectedLivekitAgent) && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Mic className="w-8 h-8 text-white" />
                            <span className="text-white/80 text-sm">STT Provider</span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {livekitAgents.find(a => a.id === selectedLivekitAgent)?.stt_provider.toUpperCase()}
                          </div>
                          <div className="text-white/70 text-sm mt-1">Assembly API</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Brain className="w-8 h-8 text-white" />
                            <span className="text-white/80 text-sm">LLM Provider</span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {livekitAgents.find(a => a.id === selectedLivekitAgent)?.llm_provider.toUpperCase()}
                          </div>
                          <div className="text-white/70 text-sm mt-1">
                            {livekitAgents.find(a => a.id === selectedLivekitAgent)?.llm_model}
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Volume2 className="w-8 h-8 text-white" />
                            <span className="text-white/80 text-sm">TTS Provider</span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {livekitAgents.find(a => a.id === selectedLivekitAgent)?.tts_provider.toUpperCase()}
                          </div>
                          <div className="text-white/70 text-sm mt-1">Voice Synthesis</div>
                        </div>

                        <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Activity className="w-8 h-8 text-white" />
                            <span className="text-white/80 text-sm">Active Sessions</span>
                          </div>
                          <div className="text-3xl font-bold text-white">
                            {livekitSessions.filter(s => s.status === 'active').length}
                          </div>
                          <div className="text-white/70 text-sm mt-1">
                            {livekitSessions.length} total
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Network className="w-5 h-5 text-[#39FF14]" />
                            <h3 className="font-semibold text-white">Features Enabled</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 border-b border-gray-700">
                              <span className="text-gray-400">WebRTC:</span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                livekitAgents.find(a => a.id === selectedLivekitAgent)?.enable_webrtc
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {livekitAgents.find(a => a.id === selectedLivekitAgent)?.enable_webrtc ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-700">
                              <span className="text-gray-400">Telephony:</span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                livekitAgents.find(a => a.id === selectedLivekitAgent)?.enable_telephony
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {livekitAgents.find(a => a.id === selectedLivekitAgent)?.enable_telephony ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-700">
                              <span className="text-gray-400">Turn Detection:</span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                livekitAgents.find(a => a.id === selectedLivekitAgent)?.enable_turn_detection
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {livekitAgents.find(a => a.id === selectedLivekitAgent)?.enable_turn_detection ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-gray-400">MCP Support:</span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                livekitAgents.find(a => a.id === selectedLivekitAgent)?.enable_mcp
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {livekitAgents.find(a => a.id === selectedLivekitAgent)?.enable_mcp ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4 col-span-2">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Server className="w-5 h-5 text-green-400" />
                              <h3 className="font-semibold text-white">Workers</h3>
                            </div>
                            <span className="text-sm text-gray-400">{livekitWorkers.length} active</span>
                          </div>
                          <div className="space-y-2">
                            {livekitWorkers.slice(0, 3).map((worker) => (
                              <div key={worker.id} className="bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white font-medium">{worker.worker_name}</span>
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    worker.status === 'online' ? 'bg-green-500/20 text-green-400' :
                                    worker.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {worker.status}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span>{worker.worker_type} worker</span>
                                  <span>{worker.current_jobs}/{worker.max_concurrent_jobs} jobs</span>
                                  <span>{worker.total_jobs_processed} processed</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-[#39FF14]" />
                              <h3 className="font-semibold text-white">Recent Sessions</h3>
                            </div>
                            <span className="text-sm text-gray-400">{livekitSessions.length} total</span>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {livekitSessions.slice(0, 5).map((session) => (
                              <div key={session.id} className="bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white font-medium">{session.participant_name || 'Anonymous'}</span>
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    session.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                    session.status === 'ended' ? 'bg-gray-500/20 text-gray-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {session.status}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span className={`px-2 py-1 rounded ${
                                    session.session_type === 'webrtc' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                    session.session_type === 'telephony' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {session.session_type}
                                  </span>
                                  <span>{session.total_turns} turns</span>
                                  <span>{session.duration_seconds ? formatDuration(session.duration_seconds) : 'In progress'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Boxes className="w-5 h-5 text-yellow-400" />
                              <h3 className="font-semibold text-white">Job Queue</h3>
                            </div>
                            <span className="text-sm text-gray-400">{livekitJobs.length} jobs</span>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {livekitJobs.slice(0, 5).map((job) => (
                              <div key={job.id} className="bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    job.job_type === 'session' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                    job.job_type === 'telephony_call' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                    job.job_type === 'test' ? 'bg-green-500/20 text-green-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {job.job_type}
                                  </span>
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    job.status === 'running' ? 'bg-green-500/20 text-green-400' :
                                    job.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                    job.status === 'completed' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {job.status}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span>Priority: {job.job_priority}</span>
                                  <span>{new Date(job.created_at).toLocaleTimeString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Code className="w-5 h-5 text-[#39FF14]" />
                              <h3 className="font-semibold text-white">MCP Tools</h3>
                            </div>
                            <span className="text-sm text-gray-400">{livekitMCPTools.length} tools</span>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {livekitMCPTools.map((tool) => (
                              <div key={tool.id} className="bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white font-medium">{tool.tool_name}</span>
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    tool.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {tool.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{tool.tool_description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{tool.total_calls} calls</span>
                                  <span>{tool.successful_calls} success</span>
                                  <span>{tool.total_calls > 0 ? ((tool.successful_calls / tool.total_calls) * 100).toFixed(0) : 0}% rate</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <TestTube className="w-5 h-5 text-green-400" />
                              <h3 className="font-semibold text-white">Test Cases</h3>
                            </div>
                            <span className="text-sm text-gray-400">{livekitTestCases.length} tests</span>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {livekitTestCases.map((test) => (
                              <div key={test.id} className="bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white font-medium">{test.test_name}</span>
                                  {test.last_result && (
                                    <span className={`px-2 py-1 text-xs rounded ${
                                      test.last_result === 'passed' ? 'bg-green-500/20 text-green-400' :
                                      test.last_result === 'failed' ? 'bg-red-500/20 text-red-400' :
                                      'bg-gray-500/20 text-gray-400'
                                    }`}>
                                      {test.last_result}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span className={`px-2 py-1 rounded ${
                                    test.test_type === 'conversation' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                    test.test_type === 'integration' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {test.test_type}
                                  </span>
                                  <span>{test.passed_runs}/{test.total_runs} passed</span>
                                  {test.last_score && <span>Score: {test.last_score.toFixed(1)}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-white">LiveKit Features Overview</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-[#39FF14] mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Flexible Integrations
                            </h4>
                            <p className="text-sm text-gray-400">
                              Mix and match Assembly STT, Gemini LLM, and multiple TTS providers to suit your use case.
                            </p>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Job Scheduling
                            </h4>
                            <p className="text-sm text-gray-400">
                              Built-in task scheduling and distribution with dispatch APIs to connect end users to agents.
                            </p>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-[#39FF14] mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              WebRTC & Telephony
                            </h4>
                            <p className="text-sm text-gray-400">
                              Extensive WebRTC client support and seamless telephony integration for phone calls.
                            </p>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Semantic Turn Detection
                            </h4>
                            <p className="text-sm text-gray-400">
                              Transformer model to detect when a user is done with their turn, reducing interruptions.
                            </p>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-[#39FF14] mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              MCP Support
                            </h4>
                            <p className="text-sm text-gray-400">
                              Native support for Model Context Protocol. Integrate external tools and APIs seamlessly.
                            </p>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Testing Framework
                            </h4>
                            <p className="text-sm text-gray-400">
                              Built-in test framework with LLM judges to ensure your agent performs as expected.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'rapida' && (
            <RapidaVoiceAI />
          )}
        </>
      )}

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

      {selectedCall && (
        <CallDetailModal
          callId={selectedCall}
          isOpen={showCallDetailModal}
          onClose={() => {
            setShowCallDetailModal(false);
          }}
        />
      )}
    </div>
  );
}
