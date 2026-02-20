import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Phone, MessageSquare, Users, Settings, Zap, Star, Clock, TrendingUp, Plus, Edit, Trash2, Eye, Activity, PhoneCall, Calendar, Award, Video, BarChart2, Play, Pause, Webhook } from 'lucide-react';
import CTIIntegrations from './CTIIntegrations';
import { CustomerModal, ACDRuleModal, AgentSkillModal, PriorityRuleModal, IVRConfigModal } from './ContactCenterModals';

type UnifiedQueueItem = {
  id: string;
  queue_name: string;
  channel_type: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  priority: number;
  status: string;
  wait_time_seconds: number;
  assigned_agent_name: string;
  entered_queue_at: string;
};

type CustomerContext = {
  id: string;
  customer_id: string;
  customer_name: string;
  primary_phone: string;
  primary_email: string;
  preferred_channel: string;
  customer_tier: string;
  lifetime_value: string;
  total_interactions: number;
  last_interaction_at: string;
  preferred_agent_name: string;
  average_satisfaction: string;
};

type IVRMenu = {
  id: string;
  menu_name: string;
  menu_description: string;
  greeting_text: string;
  use_conversational_ai: boolean;
  ai_model: string;
  is_active: boolean;
};

type ACDRule = {
  id: string;
  rule_name: string;
  rule_description: string;
  channel_type: string;
  routing_strategy: string;
  priority: number;
  target_queue: string;
  is_active: boolean;
};

type AgentSkill = {
  id: string;
  agent_name: string;
  skill_name: string;
  skill_category: string;
  proficiency_level: number;
  is_active: boolean;
};

type RoutingPriority = {
  id: string;
  priority_name: string;
  priority_description: string;
  priority_level: number;
  boost_percentage: number;
  is_active: boolean;
};

type AgentAssignment = {
  id: string;
  customer_name: string;
  agent_name: string;
  assignment_reason: string;
  last_interaction_at: string;
  total_interactions: number;
  is_active: boolean;
};

type DialerCampaign = {
  id: string;
  campaign_name: string;
  campaign_description: string;
  dialer_type: string;
  status: string;
  target_agents: number;
  max_call_attempts: number;
  created_at: string;
};

type CallList = {
  id: string;
  list_name: string;
  list_description: string;
  total_contacts: number;
  contacted_count: number;
  connected_count: number;
  conversion_count: number;
  status: string;
};

type WEMForecast = {
  id: string;
  forecast_name: string;
  forecast_date: string;
  predicted_volume: number;
  required_agents: number;
  status: string;
};

type WEMSchedule = {
  id: string;
  agent_name: string;
  schedule_date: string;
  shift_type: string;
  total_hours: number;
  status: string;
  adherence_percentage: number;
};

type QualityEvaluation = {
  id: string;
  agent_name: string;
  interaction_date: string;
  evaluation_type: string;
  score_percentage: number;
  passed: boolean;
  evaluator_name: string;
};

type ScreenRecording = {
  id: string;
  agent_name: string;
  recording_start_time: string;
  duration_seconds: number;
  status: string;
  access_level: string;
};

type ModalOpenFunction = (type: string, item?: any) => void;

interface ContactCenterProps {
  onOpenModal?: ModalOpenFunction;
}

export default function ContactCenter({ onOpenModal }: ContactCenterProps = {}) {
  const [activeTab, setActiveTab] = useState('unified-desktop');
  const [dataLoading, setDataLoading] = useState(false);

  const [queueItems, setQueueItems] = useState<UnifiedQueueItem[]>([]);
  const [customers, setCustomers] = useState<CustomerContext[]>([]);
  const [ivrMenus, setIvrMenus] = useState<IVRMenu[]>([]);
  const [acdRules, setAcdRules] = useState<ACDRule[]>([]);
  const [agentSkills, setAgentSkills] = useState<AgentSkill[]>([]);
  const [priorities, setPriorities] = useState<RoutingPriority[]>([]);
  const [assignments, setAssignments] = useState<AgentAssignment[]>([]);
  const [campaigns, setCampaigns] = useState<DialerCampaign[]>([]);
  const [callLists, setCallLists] = useState<CallList[]>([]);
  const [forecasts, setForecasts] = useState<WEMForecast[]>([]);
  const [schedules, setSchedules] = useState<WEMSchedule[]>([]);
  const [evaluations, setEvaluations] = useState<QualityEvaluation[]>([]);
  const [recordings, setRecordings] = useState<ScreenRecording[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerContext | null>(null);
  const [selectedIVR, setSelectedIVR] = useState<IVRMenu | null>(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerContext | null>(null);
  const [showACDModal, setShowACDModal] = useState(false);
  const [editingACDRule, setEditingACDRule] = useState<ACDRule | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<AgentSkill | null>(null);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [editingPriority, setEditingPriority] = useState<RoutingPriority | null>(null);
  const [showIVRModal, setShowIVRModal] = useState(false);
  const [editingIVR, setEditingIVR] = useState<IVRMenu | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    console.log('fetchAllData: starting data fetch');
    setDataLoading(true);
    try {
      await Promise.all([
        fetchQueueItems(),
        fetchCustomers(),
        fetchIVRMenus(),
        fetchACDRules(),
        fetchAgentSkills(),
        fetchPriorities(),
        fetchAssignments(),
        fetchCampaigns(),
        fetchCallLists(),
        fetchForecasts(),
        fetchSchedules(),
        fetchEvaluations(),
        fetchRecordings()
      ]);
      console.log('fetchAllData: all data fetched successfully');
    } catch (error) {
      console.error('fetchAllData: error during data fetch', error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchQueueItems = async () => {
    try {
      const { data, error } = await db
        .from('cc_unified_queues')
        .select('*')
        
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching queue items:', error);
        throw error;
      }

      console.log('Queue items fetched successfully:', { count: data?.length, data });
      setQueueItems(data || []);
    } catch (error) {
      console.error('Exception in fetchQueueItems:', error);
      setQueueItems([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await db
        .from('cc_customer_context')
        .select('*')
        
        .order('total_interactions', { ascending: false });
      if (error) throw error;
      console.log('Customers fetched:', data?.length);
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchIVRMenus = async () => {
    const { data } = await db
      .from('cc_ivr_menus')
      .select('*')
      .order('created_at', { ascending: false });
    setIvrMenus(data || []);
  };

  const fetchACDRules = async () => {
    const { data } = await db
      .from('cc_acd_routing_rules')
      .select('*')
      .order('priority', { ascending: false });
    setAcdRules(data || []);
  };

  const fetchAgentSkills = async () => {
    const { data } = await db
      .from('cc_agent_skills')
      .select('*')
      
      .order('agent_name');
    setAgentSkills(data || []);
  };

  const fetchPriorities = async () => {
    const { data } = await db
      .from('cc_routing_priorities')
      .select('*')
      .order('priority_level', { ascending: false });
    setPriorities(data || []);
  };

  const fetchAssignments = async () => {
    const { data } = await db
      .from('cc_agent_assignments')
      .select('*')
      
      .eq('is_active', true)
      .order('last_interaction_at', { ascending: false });
    setAssignments(data || []);
  };

  const fetchCampaigns = async () => {
    const { data } = await db
      .from('cc_dialer_campaigns')
      .select('*')
      
      .order('created_at', { ascending: false });
    setCampaigns(data || []);
  };

  const fetchCallLists = async () => {
    const { data } = await db
      .from('cc_call_lists')
      .select('*')
      
      .order('created_at', { ascending: false });
    setCallLists(data || []);
  };

  const fetchForecasts = async () => {
    const { data } = await db
      .from('cc_wem_forecasts')
      .select('*')
      
      .order('forecast_date', { ascending: false });
    setForecasts(data || []);
  };

  const fetchSchedules = async () => {
    const { data } = await db
      .from('cc_wem_schedules')
      .select('*')
      
      .order('schedule_date', { ascending: false });
    setSchedules(data || []);
  };

  const fetchEvaluations = async () => {
    const { data } = await db
      .from('cc_wem_quality_evaluations')
      .select('*')
      
      .order('interaction_date', { ascending: false });
    setEvaluations(data || []);
  };

  const fetchRecordings = async () => {
    const { data } = await db
      .from('cc_wem_screen_recordings')
      .select('*')
      
      .order('recording_start_time', { ascending: false });
    setRecordings(data || []);
  };

  const deleteItem = async (table: string, id: string, refreshFn: () => void) => {
    const { error } = await db.from(table).delete().eq('id', id);
    if (!error) refreshFn();
  };

  const toggleActive = async (table: string, id: string, currentStatus: boolean, refreshFn: () => void) => {
    const { error } = await db.from(table).update({ is_active: !currentStatus }).eq('id', id);
    if (!error) refreshFn();
  };

  const handleCustomerSubmit = async (data: any) => {
    try {
      if (editingCustomer) {
        const { error } = await db
          .from('cc_customer_context')
          .update({
            customer_name: data.customer_name,
            primary_phone: data.primary_phone,
            primary_email: data.primary_email,
            preferred_channel: data.preferred_channel,
            customer_tier: data.customer_tier,
            lifetime_value: data.lifetime_value,
            total_interactions: data.total_interactions,
            average_satisfaction: data.average_satisfaction,
            preferred_agent_name: data.preferred_agent_name,
            notes: data.notes || '',
            tags: data.tags || [],
            custom_fields: data.custom_fields || {}
          })
          .eq('id', editingCustomer.id);

        if (error) throw error;
        alert('Customer updated successfully!');
      } else {
        const customerCount = customers.length;
        const newCustomerId = `CUST-${String(customerCount + 1).padStart(3, '0')}`;

        const { error } = await db
          .from('cc_customer_context')
          .insert({
                  customer_id: newCustomerId,
            customer_name: data.customer_name,
            primary_phone: data.primary_phone,
            primary_email: data.primary_email,
            preferred_channel: data.preferred_channel,
            customer_tier: data.customer_tier,
            lifetime_value: data.lifetime_value || '0.00',
            total_interactions: data.total_interactions || 0,
            last_interaction_at: new Date().toISOString(),
            average_satisfaction: data.average_satisfaction || '0.0',
            preferred_agent_name: data.preferred_agent_name,
            notes: data.notes || '',
            tags: data.tags || [],
            custom_fields: data.custom_fields || {}
          });

        if (error) throw error;
        alert('Customer added successfully!');
      }

      setShowCustomerModal(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    }
  };

  const handleACDRuleSubmit = async (data: any) => {
    try {
      if (editingACDRule) {
        const { error } = await db
          .from('cc_acd_routing_rules')
          .update({
            rule_name: data.rule_name,
            rule_description: data.rule_description,
            channel_type: data.channel_type,
            routing_strategy: data.routing_strategy,
            priority: data.priority,
            target_queue: data.target_queue,
            is_active: data.is_active
          })
          .eq('id', editingACDRule.id);

        if (error) throw error;
        alert('ACD rule updated successfully!');
      } else {
        const { error } = await db
          .from('cc_acd_routing_rules')
          .insert({
            rule_name: data.rule_name,
            rule_description: data.rule_description,
            channel_type: data.channel_type,
            routing_strategy: data.routing_strategy,
            priority: data.priority,
            target_queue: data.target_queue,
            is_active: data.is_active,
            conditions: {},
            metadata: {}
          });

        if (error) throw error;
        alert('ACD rule created successfully!');
      }

      setShowACDModal(false);
      setEditingACDRule(null);
      fetchACDRules();
    } catch (error) {
      console.error('Error saving ACD rule:', error);
      alert('Failed to save ACD rule. Please try again.');
    }
  };

  const openEditCustomer = (customer: CustomerContext) => {
    setEditingCustomer(customer);
    setShowCustomerModal(true);
  };

  const openAddCustomer = () => {
    setEditingCustomer(null);
    setShowCustomerModal(true);
  };

  const openEditACDRule = (rule: ACDRule) => {
    setEditingACDRule(rule);
    setShowACDModal(true);
  };

  const openAddACDRule = () => {
    setEditingACDRule(null);
    setShowACDModal(true);
  };

  const handleSkillSubmit = async (data: any) => {
    try {
      if (editingSkill) {
        const { error } = await db
          .from('cc_agent_skills')
          .update({
            agent_name: data.agent_name,
            skill_name: data.skill_name,
            skill_category: data.skill_category,
            proficiency_level: data.proficiency_level,
            is_active: data.is_active,
            routing_config: data.routing_config
          })
          .eq('id', editingSkill.id);

        if (error) throw error;
        alert('Agent skill updated successfully!');
      } else {
        const { error } = await db
          .from('cc_agent_skills')
          .insert({
                  agent_name: data.agent_name,
            skill_name: data.skill_name,
            skill_category: data.skill_category,
            proficiency_level: data.proficiency_level,
            is_active: data.is_active,
            routing_config: data.routing_config
          });

        if (error) throw error;
        alert('Agent skill added successfully!');
      }

      setShowSkillModal(false);
      setEditingSkill(null);
      fetchAgentSkills();
    } catch (error) {
      console.error('Error saving agent skill:', error);
      alert('Failed to save agent skill. Please try again.');
    }
  };

  const handlePrioritySubmit = async (data: any) => {
    try {
      if (editingPriority) {
        const { error } = await db
          .from('cc_routing_priorities')
          .update({
            priority_name: data.priority_name,
            priority_description: data.priority_description,
            priority_level: data.priority_level,
            boost_percentage: data.boost_percentage,
            is_active: data.is_active,
            conditions: data.conditions,
            escalation_enabled: data.escalation_enabled,
            escalation_threshold_seconds: data.escalation_threshold_seconds,
            apply_to_channels: data.apply_to_channels
          })
          .eq('id', editingPriority.id);

        if (error) throw error;
        alert('Priority rule updated successfully!');
      } else {
        const { error } = await db
          .from('cc_routing_priorities')
          .insert({
            priority_name: data.priority_name,
            priority_description: data.priority_description,
            priority_level: data.priority_level,
            boost_percentage: data.boost_percentage,
            is_active: data.is_active,
            conditions: data.conditions,
            escalation_enabled: data.escalation_enabled,
            escalation_threshold_seconds: data.escalation_threshold_seconds,
            apply_to_channels: data.apply_to_channels
          });

        if (error) throw error;
        alert('Priority rule created successfully!');
      }

      setShowPriorityModal(false);
      setEditingPriority(null);
      fetchPriorities();
    } catch (error) {
      console.error('Error saving priority rule:', error);
      alert('Failed to save priority rule. Please try again.');
    }
  };

  const openEditSkill = (skill: AgentSkill) => {
    setEditingSkill(skill);
    setShowSkillModal(true);
  };

  const openAddSkill = () => {
    setEditingSkill(null);
    setShowSkillModal(true);
  };

  const openEditPriority = (priority: RoutingPriority) => {
    setEditingPriority(priority);
    setShowPriorityModal(true);
  };

  const openAddPriority = () => {
    setEditingPriority(null);
    setShowPriorityModal(true);
  };

  const handleIVRSubmit = async (data: any) => {
    try {
      if (editingIVR) {
        const { error } = await db
          .from('cc_ivr_menus')
          .update({
            ivr_name: data.ivr_name,
            phone_number: data.phone_number,
            greeting_message: data.greeting_message,
            greeting_file_url: data.greeting_file_url,
            timeout_seconds: data.timeout_seconds,
            max_retries: data.max_retries,
            is_active: data.is_active,
            menu_structure: data.menu_structure,
            music_on_hold_id: data.music_on_hold_id,
            call_queue_id: data.call_queue_id,
            acd_rule_id: data.acd_rule_id,
            skill_routing: data.skill_routing,
            business_hours: data.business_hours,
            fallback_action: data.fallback_action,
            fallback_destination: data.fallback_destination
          })
          .eq('id', editingIVR.id);

        if (error) throw error;
        alert('IVR configuration updated successfully!');
      } else {
        const { error } = await db
          .from('cc_ivr_menus')
          .insert({
            ivr_name: data.ivr_name,
            phone_number: data.phone_number,
            greeting_message: data.greeting_message,
            greeting_file_url: data.greeting_file_url,
            timeout_seconds: data.timeout_seconds,
            max_retries: data.max_retries,
            is_active: data.is_active,
            menu_structure: data.menu_structure,
            music_on_hold_id: data.music_on_hold_id,
            call_queue_id: data.call_queue_id,
            acd_rule_id: data.acd_rule_id,
            skill_routing: data.skill_routing,
            business_hours: data.business_hours,
            fallback_action: data.fallback_action,
            fallback_destination: data.fallback_destination
          });

        if (error) throw error;
        alert('IVR configuration created successfully!');
      }

      setShowIVRModal(false);
      setEditingIVR(null);
      fetchIVRMenus();
    } catch (error) {
      console.error('Error saving IVR configuration:', error);
      alert('Failed to save IVR configuration. Please try again.');
    }
  };

  const openEditIVR = (ivr: IVRMenu) => {
    setEditingIVR(ivr);
    setShowIVRModal(true);
  };

  const openAddIVR = () => {
    setEditingIVR(null);
    setShowIVRModal(true);
  };

  const toggleCampaignStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const { error } = await db.from('cc_dialer_campaigns').update({ status: newStatus }).eq('id', id);
    if (!error) fetchCampaigns();
  };

  const getDialerBadge = (type: string) => {
    const colors: Record<string, string> = {
      predictive: 'bg-red-500/20 text-red-400',
      power: 'bg-[#39FF14]/20 text-[#39FF14]',
      preview: 'bg-green-500/20 text-green-400'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400',
      paused: 'bg-yellow-500/20 text-yellow-400',
      draft: 'bg-gray-500/20 text-gray-400',
      completed: 'bg-[#39FF14]/20 text-[#39FF14]',
      scheduled: 'bg-[#39FF14]/20 text-[#39FF14]',
      in_progress: 'bg-[#39FF14]/20 text-[#39FF14]',
      available: 'bg-green-500/20 text-green-400',
      approved: 'bg-green-500/20 text-green-400',
      published: 'bg-[#39FF14]/20 text-[#39FF14]',
      confirmed: 'bg-green-500/20 text-green-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getChannelIcon = (channel: string) => {
    switch(channel) {
      case 'voice': return <Phone className="w-4 h-4" />;
      case 'whatsapp': case 'sms': case 'rcs': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch(channel) {
      case 'voice': return 'bg-[#39FF14]/20';
      case 'whatsapp': return 'bg-green-500';
      case 'sms': return 'bg-[#39FF14]/60';
      case 'rcs': return 'bg-[#39FF14]/60';
      case 'chat': return 'bg-[#39FF14]/60';
      case 'email': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'vip': return 'bg-[#39FF14]/20 text-[#39FF14]';
      case 'premium': return 'bg-[#39FF14]/20 text-[#39FF14]';
      case 'standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatWaitTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading contact center data for Platform...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Contact Center</h1>
        <p className="text-gray-400">Omnichannel unified desktop with intelligent routing</p>
        <div className="mt-2 text-sm text-gray-500">
          Current Tenant: <span className="text-[#39FF14] font-medium">Platform</span> (system)
        </div>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab('unified-desktop')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'unified-desktop' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Activity className="w-4 h-4 inline mr-2" />Unified Desktop
        </button>
        <button onClick={() => setActiveTab('customer-context')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'customer-context' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Users className="w-4 h-4 inline mr-2" />Customer Context
        </button>
        <button onClick={() => setActiveTab('ivr-config')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'ivr-config' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Phone className="w-4 h-4 inline mr-2" />IVR Configuration
        </button>
        <button onClick={() => setActiveTab('acd-routing')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'acd-routing' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Zap className="w-4 h-4 inline mr-2" />ACD Routing
        </button>
        <button onClick={() => setActiveTab('agent-skills')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'agent-skills' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Star className="w-4 h-4 inline mr-2" />Agent Skills
        </button>
        <button onClick={() => setActiveTab('priorities')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'priorities' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <TrendingUp className="w-4 h-4 inline mr-2" />Priority Rules
        </button>
        <button onClick={() => setActiveTab('sticky-routing')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'sticky-routing' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Clock className="w-4 h-4 inline mr-2" />Sticky Routing
        </button>
        <button onClick={() => setActiveTab('dialers')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'dialers' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <PhoneCall className="w-4 h-4 inline mr-2" />Dialers
        </button>
        <button onClick={() => setActiveTab('call-lists')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'call-lists' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Phone className="w-4 h-4 inline mr-2" />Call Lists
        </button>
        <button onClick={() => setActiveTab('forecasting')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'forecasting' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <BarChart2 className="w-4 h-4 inline mr-2" />Forecasting
        </button>
        <button onClick={() => setActiveTab('scheduling')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'scheduling' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Calendar className="w-4 h-4 inline mr-2" />Scheduling
        </button>
        <button onClick={() => setActiveTab('quality')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'quality' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Award className="w-4 h-4 inline mr-2" />Quality
        </button>
        <button onClick={() => setActiveTab('recordings')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'recordings' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Video className="w-4 h-4 inline mr-2" />Recordings
        </button>
        <button onClick={() => setActiveTab('cti-integrations')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'cti-integrations' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Webhook className="w-4 h-4 inline mr-2" />CTI & Integrations
        </button>
      </div>

      {activeTab === 'unified-desktop' && (
        <div>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Total in Queue</div>
                <div className="text-2xl font-bold text-white">{queueItems.length}</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Waiting</div>
                <div className="text-2xl font-bold text-yellow-400">{queueItems.filter(q => q.status === 'waiting').length}</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Active</div>
                <div className="text-2xl font-bold text-green-400">{queueItems.filter(q => q.status === 'assigned').length}</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Avg Wait Time</div>
                <div className="text-2xl font-bold text-[#39FF14]">{formatWaitTime(Math.floor(queueItems.reduce((acc, q) => acc + q.wait_time_seconds, 0) / (queueItems.length || 1)))}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Channel</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Queue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Wait Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {queueItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getChannelColor(item.channel_type)} text-white`}>
                        {getChannelIcon(item.channel_type)}
                        <span className="text-xs font-medium uppercase">{item.channel_type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{item.customer_name}</div>
                      <div className="text-gray-400 text-sm">{item.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{item.queue_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.priority >= 8 ? 'bg-red-500/20 text-red-400' : item.priority >= 5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        P{item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{formatWaitTime(item.wait_time_seconds)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' : item.status === 'assigned' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{item.assigned_agent_name || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => setSelectedCustomer(customers.find(c => c.customer_id === item.customer_id) || null)} className="p-1 hover:bg-gray-700 rounded">
                          <Eye className="w-4 h-4 text-[#39FF14]" />
                        </button>
                        <button onClick={() => deleteItem('cc_unified_queues', item.id, fetchQueueItems)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'customer-context' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Customer Context & History</h2>
            <button onClick={openAddCustomer} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Add Customer
            </button>
          </div>

          {customers.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">No customers found. Click "Add Customer" to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold">{customer.customer_name}</h3>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getTierColor(customer.customer_tier)}`}>
                      {customer.customer_tier.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => setSelectedCustomer(customer)} className="p-1 hover:bg-gray-700 rounded">
                      <Eye className="w-4 h-4 text-[#39FF14]" />
                    </button>
                    <button onClick={() => openEditCustomer(customer)} className="p-1 hover:bg-gray-700 rounded">
                      <Edit className="w-4 h-4 text-yellow-400" />
                    </button>
                    <button onClick={() => deleteItem('cc_customer_context', customer.id, fetchCustomers)} className="p-1 hover:bg-gray-700 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-gray-300">{customer.primary_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-gray-300">{customer.primary_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Preferred Channel:</span>
                    <span className="text-gray-300 uppercase">{customer.preferred_channel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Interactions:</span>
                    <span className="text-white font-bold">{customer.total_interactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lifetime Value:</span>
                    <span className="text-green-400 font-bold">RM {parseFloat(customer.lifetime_value).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Satisfaction:</span>
                    <span className="text-yellow-400 font-bold">{parseFloat(customer.average_satisfaction).toFixed(1)} / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Preferred Agent:</span>
                    <span className="text-gray-300">{customer.preferred_agent_name || '-'}</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ivr-config' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">IVR Menu Configuration</h2>
            <button onClick={openAddIVR} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Configure New IVR
            </button>
          </div>

          <div className="space-y-4">
            {ivrMenus.map((menu) => (
              <div key={menu.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-bold text-lg">{menu.menu_name}</h3>
                      {menu.use_conversational_ai && (
                        <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs font-medium">AI-Powered</span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${menu.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {menu.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{menu.menu_description}</p>
                    <div className="bg-gray-700 rounded p-3 mb-3">
                      <div className="text-gray-400 text-xs mb-1">Greeting Message:</div>
                      <div className="text-gray-300 text-sm">{menu.greeting_text}</div>
                    </div>
                    {menu.use_conversational_ai && (
                      <div className="text-sm text-gray-400">AI Model: <span className="text-[#39FF14]">{menu.ai_model}</span></div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => setSelectedIVR(menu)} className="p-2 hover:bg-gray-700 rounded">
                      <Eye className="w-4 h-4 text-[#39FF14]" />
                    </button>
                    <button onClick={() => openEditIVR(menu)} className="p-2 hover:bg-gray-700 rounded">
                      <Edit className="w-4 h-4 text-yellow-400" />
                    </button>
                    <button onClick={() => toggleActive('cc_ivr_menus', menu.id, menu.is_active, fetchIVRMenus)} className="p-2 hover:bg-gray-700 rounded">
                      <Zap className={`w-4 h-4 ${menu.is_active ? 'text-green-400' : 'text-gray-400'}`} />
                    </button>
                    <button onClick={() => deleteItem('cc_ivr_menus', menu.id, fetchIVRMenus)} className="p-2 hover:bg-gray-700 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'acd-routing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">ACD Routing Rules</h2>
            <button onClick={openAddACDRule} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Rule
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Rule Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Channel</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Strategy</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Target Queue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {acdRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{rule.rule_name}</div>
                      <div className="text-gray-400 text-sm">{rule.rule_description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 uppercase text-sm">{rule.channel_type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs font-medium">
                        {rule.routing_strategy.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-bold">P{rule.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{rule.target_queue || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${rule.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => openEditACDRule(rule)} className="p-1 hover:bg-gray-700 rounded">
                          <Edit className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button onClick={() => toggleActive('cc_acd_routing_rules', rule.id, rule.is_active, fetchACDRules)} className="p-1 hover:bg-gray-700 rounded">
                          <Zap className={`w-4 h-4 ${rule.is_active ? 'text-green-400' : 'text-gray-400'}`} />
                        </button>
                        <button onClick={() => deleteItem('cc_acd_routing_rules', rule.id, fetchACDRules)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'agent-skills' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Agent Skills Management</h2>
            <button onClick={openAddSkill} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Add Skill
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Skill</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Proficiency</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {agentSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white font-medium">{skill.agent_name}</td>
                    <td className="px-4 py-3 text-gray-300">{skill.skill_name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs font-medium uppercase">
                        {skill.skill_category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${skill.proficiency_level * 10}%` }}></div>
                        </div>
                        <span className="text-white font-bold text-sm">{skill.proficiency_level}/10</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${skill.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {skill.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => openEditSkill(skill)} className="p-1 hover:bg-gray-700 rounded">
                          <Edit className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button onClick={() => toggleActive('cc_agent_skills', skill.id, skill.is_active, fetchAgentSkills)} className="p-1 hover:bg-gray-700 rounded">
                          <Zap className={`w-4 h-4 ${skill.is_active ? 'text-green-400' : 'text-gray-400'}`} />
                        </button>
                        <button onClick={() => deleteItem('cc_agent_skills', skill.id, fetchAgentSkills)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'priorities' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Priority Routing Rules</h2>
            <button onClick={openAddPriority} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Priority Rule
            </button>
          </div>

          <div className="space-y-3">
            {priorities.map((priority) => (
              <div key={priority.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${priority.priority_level >= 8 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    P{priority.priority_level}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{priority.priority_name}</h3>
                    <p className="text-gray-400 text-sm">{priority.priority_description}</p>
                    <div className="mt-1">
                      <span className="text-xs text-gray-400">Boost: </span>
                      <span className="text-xs text-green-400 font-bold">+{priority.boost_percentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priority.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {priority.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => openEditPriority(priority)} className="p-2 hover:bg-gray-700 rounded">
                    <Edit className="w-4 h-4 text-yellow-400" />
                  </button>
                  <button onClick={() => toggleActive('cc_routing_priorities', priority.id, priority.is_active, fetchPriorities)} className="p-2 hover:bg-gray-700 rounded">
                    <Zap className={`w-4 h-4 ${priority.is_active ? 'text-green-400' : 'text-gray-400'}`} />
                  </button>
                  <button onClick={() => deleteItem('cc_routing_priorities', priority.id, fetchPriorities)} className="p-2 hover:bg-gray-700 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sticky-routing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Sticky Agent Assignments</h2>
            <button onClick={() => onOpenModal?.('assignment')} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Assignment
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Interactions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Last Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white font-medium">{assignment.customer_name}</td>
                    <td className="px-4 py-3 text-gray-300">{assignment.agent_name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs font-medium">
                        {assignment.assignment_reason.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-bold">{assignment.total_interactions}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {new Date(assignment.last_interaction_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${assignment.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {assignment.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => toggleActive('cc_agent_assignments', assignment.id, assignment.is_active, fetchAssignments)} className="p-1 hover:bg-gray-700 rounded">
                          <Zap className={`w-4 h-4 ${assignment.is_active ? 'text-green-400' : 'text-gray-400'}`} />
                        </button>
                        <button onClick={() => deleteItem('cc_agent_assignments', assignment.id, fetchAssignments)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'dialers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Outbound Dialer Campaigns</h2>
            <button onClick={() => onOpenModal?.('campaign')} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Campaign
            </button>
          </div>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-bold text-lg">{campaign.campaign_name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${getDialerBadge(campaign.dialer_type)}`}>
                        {campaign.dialer_type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{campaign.campaign_description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Target Agents</div>
                        <div className="text-white font-bold">{campaign.target_agents}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Max Attempts</div>
                        <div className="text-white font-bold">{campaign.max_call_attempts}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Created</div>
                        <div className="text-white">{new Date(campaign.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => toggleCampaignStatus(campaign.id, campaign.status)} className="p-2 hover:bg-gray-700 rounded">
                      {campaign.status === 'active' ? <Pause className="w-4 h-4 text-yellow-400" /> : <Play className="w-4 h-4 text-green-400" />}
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded">
                      <Settings className="w-4 h-4 text-[#39FF14]" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => deleteItem('cc_dialer_campaigns', campaign.id, fetchCampaigns)} className="p-2 hover:bg-gray-700 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'call-lists' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Call Lists</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create List
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callLists.map((list) => (
              <div key={list.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold">{list.list_name}</h3>
                    <p className="text-gray-400 text-sm">{list.list_description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(list.status)}`}>
                    {list.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-gray-400 text-xs">Total</div>
                    <div className="text-white font-bold text-lg">{list.total_contacts}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-gray-400 text-xs">Contacted</div>
                    <div className="text-[#39FF14] font-bold text-lg">{list.contacted_count}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-gray-400 text-xs">Connected</div>
                    <div className="text-green-400 font-bold text-lg">{list.connected_count}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-gray-400 text-xs">Conversions</div>
                    <div className="text-[#39FF14] font-bold text-lg">{list.conversion_count}</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <Eye className="w-4 h-4 text-[#39FF14]" />
                  </button>
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => deleteItem('cc_call_lists', list.id, fetchCallLists)} className="p-1 hover:bg-gray-700 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'forecasting' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Workforce Forecasting</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Forecast
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Forecast Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Volume</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Agents</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {forecasts.map((forecast) => (
                  <tr key={forecast.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white font-medium">{forecast.forecast_name}</td>
                    <td className="px-4 py-3 text-gray-300">{new Date(forecast.forecast_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-[#39FF14] font-bold">{forecast.predicted_volume.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-400 font-bold">{forecast.required_agents}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(forecast.status)}`}>
                        {forecast.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Eye className="w-4 h-4 text-[#39FF14]" />
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => deleteItem('cc_wem_forecasts', forecast.id, fetchForecasts)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'scheduling' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Agent Schedules</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Schedule
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Shift</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Adherence</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white font-medium">{schedule.agent_name}</td>
                    <td className="px-4 py-3 text-gray-300">{new Date(schedule.schedule_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs font-medium uppercase">
                        {schedule.shift_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{schedule.total_hours}h</td>
                    <td className="px-4 py-3">
                      {schedule.adherence_percentage ? (
                        <span className={`font-bold ${schedule.adherence_percentage >= 95 ? 'text-green-400' : schedule.adherence_percentage >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {schedule.adherence_percentage.toFixed(1)}%
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => deleteItem('cc_wem_schedules', schedule.id, fetchSchedules)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quality' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Quality Evaluations</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />New Evaluation
            </button>
          </div>
          <div className="space-y-3">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl ${evaluation.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {evaluation.score_percentage.toFixed(0)}%
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{evaluation.agent_name}</h3>
                    <div className="text-gray-400 text-sm">{new Date(evaluation.interaction_date).toLocaleString()}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${evaluation.evaluation_type === 'ai_auto' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-[#39FF14]/20 text-[#39FF14]'}`}>
                        {evaluation.evaluation_type === 'ai_auto' ? 'AI Auto' : 'Manual'}
                      </span>
                      {evaluation.evaluator_name && (
                        <span className="text-xs text-gray-400">by {evaluation.evaluator_name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-700 rounded">
                    <Eye className="w-4 h-4 text-[#39FF14]" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => deleteItem('cc_wem_quality_evaluations', evaluation.id, fetchEvaluations)} className="p-2 hover:bg-gray-700 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recordings' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Screen Recordings</h2>
          </div>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Recording Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recordings.map((recording) => (
                  <tr key={recording.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white font-medium">{recording.agent_name}</td>
                    <td className="px-4 py-3 text-gray-300">{new Date(recording.recording_start_time).toLocaleString()}</td>
                    <td className="px-4 py-3 text-white">{Math.floor(recording.duration_seconds / 60)}m {recording.duration_seconds % 60}s</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(recording.status)}`}>
                        {recording.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Play className="w-4 h-4 text-green-400" />
                        </button>
                        <button onClick={() => deleteItem('cc_wem_screen_recordings', recording.id, fetchRecordings)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cti-integrations' && <CTIIntegrations />}

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Customer Context - {selectedCustomer.customer_name}</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400">Customer ID:</div>
                  <div className="text-white font-medium">{selectedCustomer.customer_id}</div>
                </div>
                <div>
                  <div className="text-gray-400">Tier:</div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTierColor(selectedCustomer.customer_tier)}`}>
                    {selectedCustomer.customer_tier.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-gray-400">Phone:</div>
                  <div className="text-white">{selectedCustomer.primary_phone}</div>
                </div>
                <div>
                  <div className="text-gray-400">Email:</div>
                  <div className="text-white">{selectedCustomer.primary_email}</div>
                </div>
                <div>
                  <div className="text-gray-400">Preferred Channel:</div>
                  <div className="text-white uppercase">{selectedCustomer.preferred_channel}</div>
                </div>
                <div>
                  <div className="text-gray-400">Preferred Agent:</div>
                  <div className="text-white">{selectedCustomer.preferred_agent_name || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-400">Total Interactions:</div>
                  <div className="text-white font-bold">{selectedCustomer.total_interactions}</div>
                </div>
                <div>
                  <div className="text-gray-400">Lifetime Value:</div>
                  <div className="text-green-400 font-bold">RM {parseFloat(selectedCustomer.lifetime_value).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Average Satisfaction:</div>
                  <div className="text-yellow-400 font-bold">{parseFloat(selectedCustomer.average_satisfaction).toFixed(1)} / 5.0</div>
                </div>
                <div>
                  <div className="text-gray-400">Last Interaction:</div>
                  <div className="text-white">{new Date(selectedCustomer.last_interaction_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="mt-6 w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      )}

      <CustomerModal
        show={showCustomerModal}
        customer={editingCustomer}
        onClose={() => {
          setShowCustomerModal(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleCustomerSubmit}
      />

      <ACDRuleModal
        show={showACDModal}
        rule={editingACDRule}
        onClose={() => {
          setShowACDModal(false);
          setEditingACDRule(null);
        }}
        onSubmit={handleACDRuleSubmit}
      />

      <AgentSkillModal
        show={showSkillModal}
        skill={editingSkill}
        onClose={() => {
          setShowSkillModal(false);
          setEditingSkill(null);
        }}
        onSubmit={handleSkillSubmit}
      />

      <PriorityRuleModal
        show={showPriorityModal}
        priority={editingPriority}
        onClose={() => {
          setShowPriorityModal(false);
          setEditingPriority(null);
        }}
        onSubmit={handlePrioritySubmit}
      />

      <IVRConfigModal
        show={showIVRModal}
        ivr={editingIVR}
        tenantId={undefined}
        onClose={() => {
          setShowIVRModal(false);
          setEditingIVR(null);
        }}
        onSubmit={handleIVRSubmit}
      />
    </div>
  );
}
