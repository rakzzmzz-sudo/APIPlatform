import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import {
  Activity, Users, Phone, Star, TrendingUp, Plus, Trash2, Edit,
  ToggleLeft, ToggleRight, Target, Sparkles, MessageSquare,
  PhoneOutgoing, Play, Pause, Eye, Clock, CheckCircle, X,
  PhoneCall, Mic, MicOff, Volume2, VolumeX, Keyboard
} from 'lucide-react';

interface Customer {
  id: string;
  customer_id: string;
  customer_name: string;
  primary_phone: string;
  primary_email: string;
  preferred_channel: string;
  customer_tier: string;
  lifetime_value: string;
  total_interactions: number;
  preferred_agent_name: string | null;
  average_satisfaction: string;
}

interface QueueItem {
  id: string;
  channel_type: string;
  customer_name: string;
  customer_phone: string;
  queue_name: string;
  priority: number;
  wait_time_seconds: number;
  status: string;
  assigned_agent_name: string | null;
}

interface IVRMenu {
  id: string;
  menu_name: string;
  menu_description: string;
  greeting_text: string;
  is_active: boolean;
  timeout_seconds: number;
}

interface IVRMenuOption {
  id: string;
  ivr_menu_id: string;
  option_key: string;
  option_label: string;
  action_type: string;
  action_target: string | null;
  ai_intent: string | null;
  priority: number;
  is_active: boolean;
}

interface ACDRoutingRule {
  id: string;
  rule_name: string;
  rule_description: string;
  channel_type: string | null;
  routing_strategy: string;
  priority: number;
  target_queue: string | null;
  target_skill: string | null;
  overflow_action: string;
  overflow_threshold_seconds: number;
  is_active: boolean;
  conditions: any;
}

interface AgentSkill {
  id: string;
  agent_name: string;
  skill_name: string;
  skill_category: string;
  proficiency_level: number;
  is_active: boolean;
}

interface PriorityRule {
  id: string;
  priority_name: string;
  priority_description: string;
  priority_level: number;
  conditions: any;
  boost_percentage: number;
  is_active: boolean;
}

interface DialerCampaign {
  id: string;
  tenant_id: string;
  campaign_name: string;
  campaign_description: string;
  dialer_type: string;
  status: string;
  max_call_attempts?: number;
  retry_delay_minutes?: number;
  calling_hours_start?: string;
  calling_hours_end?: string;
  timezone?: string;
  scheduled_start_date?: string;
  scheduled_end_date?: string;
  script_template?: string;
  compliance_settings?: any;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
  total_contacts?: number;
  contacts_dialed?: number;
  contacts_reached?: number;
  contacts_converted?: number;
  average_talk_time_seconds?: number;
  abandon_rate?: number;
}

interface CallListItem {
  id: string;
  campaign_id: string;
  contact_name: string;
  phone_number: string;
  alternate_phone: string | null;
  email: string | null;
  customer_id: string | null;
  customer_tier: string;
  account_balance: number;
  status: string;
  priority: number;
  attempts: number;
  last_disposition: string | null;
  notes: string | null;
  last_payment_date: string | null;
}

interface DialerSession {
  id: string;
  campaign_id: string;
  agent_name: string;
  session_status: string;
  calls_presented: number;
  calls_answered: number;
  calls_converted: number;
  total_talk_time_seconds: number;
  started_at: string;
}

interface CallResult {
  id: string;
  campaign_id: string;
  phone_number: string;
  agent_name: string;
  disposition: string;
  sub_disposition: string | null;
  call_duration_seconds: number;
  talk_time_seconds: number;
  is_answered: boolean;
  is_converted: boolean;
  agent_notes: string | null;
  dialed_at: string;
}

export default function ContactCenterNew() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('unified-desktop');
  const [dataLoading, setDataLoading] = useState(false);
  const [userTenantId, setUserTenantId] = useState<string | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [ivrMenus, setIvrMenus] = useState<IVRMenu[]>([]);
  const [ivrOptions, setIvrOptions] = useState<IVRMenuOption[]>([]);
  const [acdRules, setAcdRules] = useState<ACDRoutingRule[]>([]);
  const [agentSkills, setAgentSkills] = useState<AgentSkill[]>([]);
  const [priorityRules, setPriorityRules] = useState<PriorityRule[]>([]);
  const [dialerCampaigns, setDialerCampaigns] = useState<DialerCampaign[]>([]);
  const [callLists, setCallLists] = useState<CallListItem[]>([]);
  const [dialerSessions, setDialerSessions] = useState<DialerSession[]>([]);
  const [callResults, setCallResults] = useState<CallResult[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const [showDialpad, setShowDialpad] = useState(false);
  const [showNewDialerModal, setShowNewDialerModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showACDRuleModal, setShowACDRuleModal] = useState(false);
  const [showAgentSkillModal, setShowAgentSkillModal] = useState(false);
  const [showPriorityRuleModal, setShowPriorityRuleModal] = useState(false);
  const [showIVRModal, setShowIVRModal] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editingACDRuleId, setEditingACDRuleId] = useState<string | null>(null);
  const [editingAgentSkillId, setEditingAgentSkillId] = useState<string | null>(null);
  const [editingPriorityRuleId, setEditingPriorityRuleId] = useState<string | null>(null);
  const [editingIVRId, setEditingIVRId] = useState<string | null>(null);
  const [editingDialerId, setEditingDialerId] = useState<string | null>(null);
  const [dialpadNumber, setDialpadNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const [newDialerForm, setNewDialerForm] = useState({
    campaign_name: '',
    campaign_description: '',
    dialer_type: 'predictive',
    max_call_attempts: 3,
    retry_delay_minutes: 30,
    calling_hours_start: '09:00',
    calling_hours_end: '18:00',
    timezone: 'Asia/Kuala_Lumpur',
    scheduled_start_date: '',
    scheduled_end_date: '',
    script_template: ''
  });

  const [newCustomerForm, setNewCustomerForm] = useState({
    customer_name: '',
    primary_phone: '',
    primary_email: '',
    secondary_phone: '',
    secondary_email: '',
    preferred_channel: 'voice',
    customer_tier: 'standard',
    company_name: '',
    job_title: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Malaysia',
    date_of_birth: '',
    notes: '',
    tags: '',
    preferred_language: 'English',
    timezone: 'Asia/Kuala_Lumpur',
    custom_field1: '',
    custom_field2: ''
  });

  const [newACDRuleForm, setNewACDRuleForm] = useState({
    rule_name: '',
    rule_description: '',
    channel_type: 'all',
    routing_strategy: 'round_robin',
    priority: 5,
    target_queue: '',
    target_skill: '',
    overflow_action: 'voicemail',
    overflow_threshold_seconds: 300,
    business_hours_only: false,
    customer_tier_filter: '',
    min_skill_level: 1,
    max_wait_time: 600,
    enable_callback: true,
    callback_threshold: 180,
    agent_selection_criteria: 'longest_idle',
    backup_queue: '',
    time_based_routing: false,
    time_start: '09:00',
    time_end: '18:00',
    days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  });

  const [newAgentSkillForm, setNewAgentSkillForm] = useState({
    agent_name: '',
    skill_name: '',
    skill_category: 'language',
    proficiency_level: 5,
    is_active: true
  });

  const [newPriorityRuleForm, setNewPriorityRuleForm] = useState({
    priority_name: '',
    priority_description: '',
    priority_level: 5,
    boost_percentage: 50,
    is_active: true,
    condition_type: 'customer_tier',
    condition_value: '',
    wait_time_minutes: 3,
    lifetime_value_min: 0,
    interaction_count_min: 0
  });

  const [newIVRForm, setNewIVRForm] = useState({
    menu_name: '',
    menu_description: '',
    greeting_text: '',
    greeting_audio_url: '',
    use_conversational_ai: false,
    ai_model: 'gpt-4',
    timeout_seconds: 10,
    max_retries: 3,
    invalid_option_message: 'Invalid option. Please try again.',
    timeout_message: 'We did not receive your response. Please try again.',
    is_active: true
  });

  const [ivrMenuOptions, setIvrMenuOptions] = useState<Array<{
    option_key: string;
    option_label: string;
    action_type: string;
    action_target: string;
    ai_intent: string;
    priority: number;
    is_active: boolean;
  }>>([]);

  useEffect(() => {
    if (user) {
      fetchUserTenantId();
    }
  }, [user]);

  useEffect(() => {
    if (userTenantId) {
      loadAllData();
    }
  }, [userTenantId]);

  const fetchUserTenantId = async () => {
    if (!user) return;

    const { data, error } = await db
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data && !error) {
      setUserTenantId(data.tenant_id);
    } else {
      console.error('Error fetching tenant_id:', error);
    }
  };

  const loadAllData = async () => {
    setDataLoading(true);

    try {
      await Promise.all([
        loadCustomers(),
        loadQueueItems(),
        loadIVRMenus(),
        loadIVROptions(),
        loadACDRules(),
        loadAgentSkills(),
        loadPriorityRules(),
        loadDialerCampaigns(),
        loadDialerSessions(),
        loadCallResults()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await db
        .from('cc_customer_context')
        .select('*')
        
        .order('total_interactions', { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Exception in loadCustomers:', error);
      setCustomers([]);
    }
  };

  const loadQueueItems = async () => {
    try {
      const { data, error } = await db
        .from('cc_unified_queues')
        .select('*')
        
        .order('priority', { ascending: false });
      if (error) throw error;
      setQueueItems(data || []);
    } catch (error) {
      console.error('Exception in loadQueueItems:', error);
      setQueueItems([]);
    }
  };

  const loadIVRMenus = async () => {
    try {
      const { data, error } = await db
        .from('cc_ivr_menus')
        .select('*')
        
        .order('menu_name');
      if (error) throw error;
      setIvrMenus(data || []);
    } catch (error) {
      console.error('Exception in loadIVRMenus:', error);
      setIvrMenus([]);
    }
  };

  const loadIVROptions = async () => {
    try {
      const { data, error } = await db
        .from('cc_ivr_menu_options')
        .select('*')
        
        .order('priority');
      if (error) throw error;
      setIvrOptions(data || []);
    } catch (error) {
      console.error('Exception in loadIVROptions:', error);
      setIvrOptions([]);
    }
  };

  const loadACDRules = async () => {
    try {
      const { data, error } = await db
        .from('cc_acd_routing_rules')
        .select('*')
        
        .order('priority', { ascending: false });
      if (error) throw error;
      setAcdRules(data || []);
    } catch (error) {
      console.error('Exception in loadACDRules:', error);
      setAcdRules([]);
    }
  };

  const loadAgentSkills = async () => {
    try {
      const { data, error } = await db
        .from('cc_agent_skills')
        .select('*')
        
        .order('agent_name');
      if (error) throw error;
      setAgentSkills(data || []);
    } catch (error) {
      console.error('Exception in loadAgentSkills:', error);
      setAgentSkills([]);
    }
  };

  const loadPriorityRules = async () => {
    try {
      const { data, error } = await db
        .from('cc_routing_priorities')
        .select('*')
        
        .order('priority_level', { ascending: false });
      if (error) throw error;
      setPriorityRules(data || []);
    } catch (error) {
      console.error('Exception in loadPriorityRules:', error);
      setPriorityRules([]);
    }
  };

  const loadDialerCampaigns = async () => {
    try {
      const { data, error } = await db
        .from('cc_dialer_campaigns')
        .select('*')
        
        .order('campaign_name');
      if (error) throw error;
      setDialerCampaigns(data || []);
      if (data && data.length > 0 && !selectedCampaign) {
        setSelectedCampaign(data[0].id);
        loadCallLists(data[0].id);
      }
    } catch (error) {
      console.error('Exception in loadDialerCampaigns:', error);
      setDialerCampaigns([]);
    }
  };

  const loadCallLists = async (campaignId: string) => {
    if (!campaignId) return;
    try {
      const { data, error } = await db
        .from('cc_dialer_call_lists')
        .select('*')
        
        .eq('campaign_id', campaignId)
        .order('priority', { ascending: false });
      if (error) throw error;
      setCallLists(data || []);
    } catch (error) {
      console.error('Exception in loadCallLists:', error);
      setCallLists([]);
    }
  };

  const loadDialerSessions = async () => {
    try {
      const { data, error } = await db
        .from('cc_dialer_sessions')
        .select('*')
        
        .eq('session_status', 'active')
        .order('started_at', { ascending: false });
      if (error) throw error;
      setDialerSessions(data || []);
    } catch (error) {
      console.error('Exception in loadDialerSessions:', error);
      setDialerSessions([]);
    }
  };

  const loadCallResults = async () => {
    try {
      const { data, error } = await db
        .from('cc_dialer_call_results')
        .select('*')
        
        .order('dialed_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setCallResults(data || []);
    } catch (error) {
      console.error('Exception in loadCallResults:', error);
      setCallResults([]);
    }
  };

  const handleDialpadClick = (digit: string) => {
    setDialpadNumber(prev => prev + digit);
  };

  const handleDialpadBackspace = () => {
    setDialpadNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialpadNumber) {
      setIsCallActive(true);
      setCallDuration(0);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setDialpadNumber('');
    setCallDuration(0);
    setIsMuted(false);
  };

  const handleCreateDialer = async () => {
    if (!userTenantId) {
      alert('Unable to determine tenant. Please try logging out and back in.');
      return;
    }

    try {
      if (editingDialerId) {
        const { error } = await db
          .from('cc_dialer_campaigns')
          .update({
            campaign_name: newDialerForm.campaign_name,
            campaign_description: newDialerForm.campaign_description,
            dialer_type: newDialerForm.dialer_type,
            max_call_attempts: newDialerForm.max_call_attempts,
            retry_delay_minutes: newDialerForm.retry_delay_minutes,
            calling_hours_start: newDialerForm.calling_hours_start,
            calling_hours_end: newDialerForm.calling_hours_end,
            timezone: newDialerForm.timezone,
            scheduled_start_date: newDialerForm.scheduled_start_date || null,
            scheduled_end_date: newDialerForm.scheduled_end_date || null,
            script_template: newDialerForm.script_template
          })
          .eq('id', editingDialerId);

        if (error) throw error;
      } else {
        const { data, error } = await db
          .from('cc_dialer_campaigns')
          .insert({
            tenant_id: userTenantId,
            campaign_name: newDialerForm.campaign_name,
            campaign_description: newDialerForm.campaign_description,
            dialer_type: newDialerForm.dialer_type,
            status: 'draft',
            max_call_attempts: newDialerForm.max_call_attempts,
            retry_delay_minutes: newDialerForm.retry_delay_minutes,
            calling_hours_start: newDialerForm.calling_hours_start,
            calling_hours_end: newDialerForm.calling_hours_end,
            timezone: newDialerForm.timezone,
            scheduled_start_date: newDialerForm.scheduled_start_date || null,
            scheduled_end_date: newDialerForm.scheduled_end_date || null,
            script_template: newDialerForm.script_template
          })
          .select()
          .single();

        if (error) throw error;
      }

      setShowNewDialerModal(false);
      setEditingDialerId(null);
      setNewDialerForm({
        campaign_name: '',
        campaign_description: '',
        dialer_type: 'predictive',
        max_call_attempts: 3,
        retry_delay_minutes: 30,
        calling_hours_start: '09:00',
        calling_hours_end: '18:00',
        timezone: 'Asia/Kuala_Lumpur',
        scheduled_start_date: '',
        scheduled_end_date: '',
        script_template: ''
      });

      await loadDialerCampaigns();
    } catch (error: any) {
      alert('Failed to save dialer campaign: ' + error.message);
      console.error('Error saving dialer campaign:', error);
    }
  };

  const getCampaignMetrics = (campaignId: string) => {
    const lists = callLists.filter(cl => cl.campaign_id === campaignId);
    const total = lists.length;
    const dialed = lists.filter(cl => cl.attempts > 0).length;
    const reached = lists.filter(cl => cl.status === 'completed' || cl.status === 'connected').length;
    const converted = lists.filter(cl => cl.last_disposition?.toLowerCase().includes('sale') || cl.last_disposition?.toLowerCase().includes('success')).length;

    return {
      total_contacts: total,
      contacts_dialed: dialed,
      contacts_reached: reached,
      contacts_converted: converted
    };
  };

  const toggleACDRule = async (id: string, currentState: boolean) => {
    const { error } = await db
      .from('cc_acd_routing_rules')
      .update({ is_active: !currentState })
      .eq('id', id);
    if (!error) loadACDRules();
    else alert('Failed to toggle rule: ' + error.message);
  };

  const togglePriorityRule = async (id: string, currentState: boolean) => {
    const { error } = await db
      .from('cc_routing_priorities')
      .update({ is_active: !currentState })
      .eq('id', id);
    if (!error) loadPriorityRules();
    else alert('Failed to toggle rule: ' + error.message);
  };

  const toggleAgentSkill = async (id: string, currentState: boolean) => {
    const { error } = await db
      .from('cc_agent_skills')
      .update({ is_active: !currentState })
      .eq('id', id);
    if (!error) loadAgentSkills();
    else alert('Failed to toggle skill: ' + error.message);
  };

  const addAgentSkill = () => {
    setEditingAgentSkillId(null);
    setNewAgentSkillForm({
      agent_name: '',
      skill_name: '',
      skill_category: 'language',
      proficiency_level: 5,
      is_active: true
    });
    setShowAgentSkillModal(true);
  };

  const editAgentSkill = (skill: AgentSkill) => {
    setEditingAgentSkillId(skill.id);
    setNewAgentSkillForm({
      agent_name: skill.agent_name,
      skill_name: skill.skill_name,
      skill_category: skill.skill_category,
      proficiency_level: skill.proficiency_level,
      is_active: skill.is_active
    });
    setShowAgentSkillModal(true);
  };

  const handleSaveAgentSkill = async () => {
    if (!newAgentSkillForm.agent_name || !newAgentSkillForm.skill_name) {
      alert('Please fill in Agent Name and Skill Name');
      return;
    }

    const defaultTenantId = '11111111-1111-1111-1111-111111111111';
    const defaultAgentId = '22222222-2222-2222-2222-222222222222';

    try {
      if (editingAgentSkillId) {
        const { error } = await db
          .from('cc_agent_skills')
          .update({
            agent_name: newAgentSkillForm.agent_name,
            skill_name: newAgentSkillForm.skill_name,
            skill_category: newAgentSkillForm.skill_category,
            proficiency_level: newAgentSkillForm.proficiency_level,
            is_active: newAgentSkillForm.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAgentSkillId);

        if (error) throw error;
      } else {
        const { error } = await db
          .from('cc_agent_skills')
          .insert({
            tenant_id: defaultTenantId,
            agent_id: defaultAgentId,
            agent_name: newAgentSkillForm.agent_name,
            skill_name: newAgentSkillForm.skill_name,
            skill_category: newAgentSkillForm.skill_category,
            proficiency_level: newAgentSkillForm.proficiency_level,
            is_active: newAgentSkillForm.is_active
          });

        if (error) throw error;
      }

      setShowAgentSkillModal(false);
      setEditingAgentSkillId(null);
      loadAgentSkills();
    } catch (error: any) {
      alert('Failed to save agent skill: ' + error.message);
    }
  };

  const deleteAgentSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const { error } = await db
        .from('cc_agent_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadAgentSkills();
    } catch (error: any) {
      alert('Failed to delete skill: ' + error.message);
    }
  };

  const addPriorityRule = () => {
    setEditingPriorityRuleId(null);
    setNewPriorityRuleForm({
      priority_name: '',
      priority_description: '',
      priority_level: 5,
      boost_percentage: 50,
      is_active: true,
      condition_type: 'customer_tier',
      condition_value: '',
      wait_time_minutes: 3,
      lifetime_value_min: 0,
      interaction_count_min: 0
    });
    setShowPriorityRuleModal(true);
  };

  const editPriorityRule = (rule: PriorityRule) => {
    setEditingPriorityRuleId(rule.id);

    const conditionType = rule.conditions.customer_tier ? 'customer_tier' :
                         rule.conditions.wait_time_minutes ? 'wait_time' :
                         rule.conditions.lifetime_value_min ? 'lifetime_value' :
                         rule.conditions.interaction_count_min ? 'interaction_count' : 'customer_tier';

    setNewPriorityRuleForm({
      priority_name: rule.priority_name,
      priority_description: rule.priority_description || '',
      priority_level: rule.priority_level,
      boost_percentage: rule.boost_percentage,
      is_active: rule.is_active,
      condition_type: conditionType,
      condition_value: rule.conditions.customer_tier || '',
      wait_time_minutes: rule.conditions.wait_time_minutes || 3,
      lifetime_value_min: rule.conditions.lifetime_value_min || 0,
      interaction_count_min: rule.conditions.interaction_count_min || 0
    });
    setShowPriorityRuleModal(true);
  };

  const handleSavePriorityRule = async () => {
    if (!newPriorityRuleForm.priority_name) {
      alert('Please fill in Priority Rule Name');
      return;
    }

    let conditions: any = {};

    switch (newPriorityRuleForm.condition_type) {
      case 'customer_tier':
        if (!newPriorityRuleForm.condition_value) {
          alert('Please select a customer tier');
          return;
        }
        conditions = { customer_tier: newPriorityRuleForm.condition_value };
        break;
      case 'wait_time':
        conditions = { wait_time_minutes: `>${newPriorityRuleForm.wait_time_minutes}` };
        break;
      case 'lifetime_value':
        conditions = { lifetime_value_min: newPriorityRuleForm.lifetime_value_min };
        break;
      case 'interaction_count':
        conditions = { interaction_count_min: newPriorityRuleForm.interaction_count_min };
        break;
    }

    try {
      if (editingPriorityRuleId) {
        const { error } = await db
          .from('cc_routing_priorities')
          .update({
            priority_name: newPriorityRuleForm.priority_name,
            priority_description: newPriorityRuleForm.priority_description,
            priority_level: newPriorityRuleForm.priority_level,
            boost_percentage: newPriorityRuleForm.boost_percentage,
            conditions: conditions,
            is_active: newPriorityRuleForm.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPriorityRuleId);

        if (error) throw error;
      } else {
        const { error } = await db
          .from('cc_routing_priorities')
          .insert({
            tenant_id: null,
            priority_name: newPriorityRuleForm.priority_name,
            priority_description: newPriorityRuleForm.priority_description,
            priority_level: newPriorityRuleForm.priority_level,
            boost_percentage: newPriorityRuleForm.boost_percentage,
            conditions: conditions,
            is_active: newPriorityRuleForm.is_active
          });

        if (error) throw error;
      }

      setShowPriorityRuleModal(false);
      setEditingPriorityRuleId(null);
      loadPriorityRules();
    } catch (error: any) {
      alert('Failed to save priority rule: ' + error.message);
    }
  };

  const deletePriorityRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this priority rule?')) return;

    try {
      const { error } = await db
        .from('cc_routing_priorities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadPriorityRules();
    } catch (error: any) {
      alert('Failed to delete priority rule: ' + error.message);
    }
  };

  const addIVR = () => {
    setEditingIVRId(null);
    setNewIVRForm({
      menu_name: '',
      menu_description: '',
      greeting_text: '',
      greeting_audio_url: '',
      use_conversational_ai: false,
      ai_model: 'gpt-4',
      timeout_seconds: 10,
      max_retries: 3,
      invalid_option_message: 'Invalid option. Please try again.',
      timeout_message: 'We did not receive your response. Please try again.',
      is_active: true
    });
    setIvrMenuOptions([]);
    setShowIVRModal(true);
  };

  const editIVR = async (menu: any) => {
    setEditingIVRId(menu.id);
    setNewIVRForm({
      menu_name: menu.menu_name,
      menu_description: menu.menu_description || '',
      greeting_text: menu.greeting_text,
      greeting_audio_url: menu.greeting_audio_url || '',
      use_conversational_ai: menu.use_conversational_ai || false,
      ai_model: menu.ai_model || 'gpt-4',
      timeout_seconds: menu.timeout_seconds || 10,
      max_retries: menu.max_retries || 3,
      invalid_option_message: menu.invalid_option_message || 'Invalid option. Please try again.',
      timeout_message: menu.timeout_message || 'We did not receive your response. Please try again.',
      is_active: menu.is_active
    });

    try {
      const { data, error } = await db
        .from('cc_ivr_menu_options')
        .select('*')
        .eq('ivr_menu_id', menu.id);

      if (error) throw error;

      const options = (data || []).map((opt: any) => ({
        option_key: opt.option_key,
        option_label: opt.option_label,
        action_type: opt.action_type,
        action_target: opt.action_target || '',
        ai_intent: opt.ai_intent || '',
        priority: opt.priority || 1,
        is_active: opt.is_active
      }));

      setIvrMenuOptions(options);
    } catch (error: any) {
      console.error('Failed to load IVR options:', error.message);
      setIvrMenuOptions([]);
    }

    setShowIVRModal(true);
  };

  const handleSaveIVR = async () => {
    if (!newIVRForm.menu_name || !newIVRForm.greeting_text) {
      alert('Please fill in Menu Name and Greeting Text');
      return;
    }

    if (ivrMenuOptions.length === 0) {
      alert('Please add at least one menu option');
      return;
    }

    try {
      let menuId = editingIVRId;

      if (editingIVRId) {
        const { error } = await db
          .from('cc_ivr_menus')
          .update({
            menu_name: newIVRForm.menu_name,
            menu_description: newIVRForm.menu_description,
            greeting_text: newIVRForm.greeting_text,
            greeting_audio_url: newIVRForm.greeting_audio_url || null,
            use_conversational_ai: newIVRForm.use_conversational_ai,
            ai_model: newIVRForm.ai_model,
            timeout_seconds: newIVRForm.timeout_seconds,
            max_retries: newIVRForm.max_retries,
            invalid_option_message: newIVRForm.invalid_option_message,
            timeout_message: newIVRForm.timeout_message,
            is_active: newIVRForm.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingIVRId);

        if (error) throw error;

        await db
          .from('cc_ivr_menu_options')
          .delete()
          .eq('ivr_menu_id', editingIVRId);
      } else {
        const { data, error } = await db
          .from('cc_ivr_menus')
          .insert({
            tenant_id: null,
            menu_name: newIVRForm.menu_name,
            menu_description: newIVRForm.menu_description,
            greeting_text: newIVRForm.greeting_text,
            greeting_audio_url: newIVRForm.greeting_audio_url || null,
            use_conversational_ai: newIVRForm.use_conversational_ai,
            ai_model: newIVRForm.ai_model,
            timeout_seconds: newIVRForm.timeout_seconds,
            max_retries: newIVRForm.max_retries,
            invalid_option_message: newIVRForm.invalid_option_message,
            timeout_message: newIVRForm.timeout_message,
            is_active: newIVRForm.is_active
          })
          .select()
          .single();

        if (error) throw error;
        menuId = data.id;
      }

      const optionsToInsert = ivrMenuOptions.map(opt => ({
        tenant_id: null,
        ivr_menu_id: menuId,
        option_key: opt.option_key,
        option_label: opt.option_label,
        action_type: opt.action_type,
        action_target: opt.action_target || null,
        ai_intent: opt.ai_intent || null,
        priority: opt.priority,
        is_active: opt.is_active
      }));

      const { error: optionsError } = await db
        .from('cc_ivr_menu_options')
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      setShowIVRModal(false);
      setEditingIVRId(null);
      setIvrMenuOptions([]);
      loadIVRMenus();
    } catch (error: any) {
      alert('Failed to save IVR menu: ' + error.message);
    }
  };

  const deleteIVR = async (id: string) => {
    if (!confirm('Are you sure you want to delete this IVR menu? This will also delete all associated menu options.')) return;

    try {
      await db
        .from('cc_ivr_menu_options')
        .delete()
        .eq('ivr_menu_id', id);

      const { error } = await db
        .from('cc_ivr_menus')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadIVRMenus();
    } catch (error: any) {
      alert('Failed to delete IVR menu: ' + error.message);
    }
  };

  const addIVROption = (type: 'traditional' | 'ai') => {
    if (type === 'traditional') {
      setIvrMenuOptions([...ivrMenuOptions, {
        option_key: String(ivrMenuOptions.filter(o => !o.option_key.startsWith('AI')).length + 1),
        option_label: '',
        action_type: 'transfer_queue',
        action_target: '',
        ai_intent: '',
        priority: 1,
        is_active: true
      }]);
    } else {
      setIvrMenuOptions([...ivrMenuOptions, {
        option_key: `AI_INTENT_${ivrMenuOptions.filter(o => o.option_key.startsWith('AI')).length + 1}`,
        option_label: '',
        action_type: 'ai_intent',
        action_target: '',
        ai_intent: '',
        priority: 1,
        is_active: true
      }]);
    }
  };

  const removeIVROption = (index: number) => {
    setIvrMenuOptions(ivrMenuOptions.filter((_, i) => i !== index));
  };

  const updateIVROption = (index: number, field: string, value: any) => {
    const updated = [...ivrMenuOptions];
    updated[index] = { ...updated[index], [field]: value };
    setIvrMenuOptions(updated);
  };

  const editDialer = (campaign: any) => {
    setEditingDialerId(campaign.id);
    setNewDialerForm({
      campaign_name: campaign.campaign_name,
      campaign_description: campaign.campaign_description || '',
      dialer_type: campaign.dialer_type,
      max_call_attempts: campaign.max_call_attempts,
      retry_delay_minutes: campaign.retry_delay_minutes,
      calling_hours_start: campaign.calling_hours_start || '09:00',
      calling_hours_end: campaign.calling_hours_end || '18:00',
      timezone: campaign.timezone || 'Asia/Kuala_Lumpur',
      scheduled_start_date: campaign.scheduled_start_date || '',
      scheduled_end_date: campaign.scheduled_end_date || '',
      script_template: campaign.script_template || ''
    });
    setShowNewDialerModal(true);
  };

  const deleteDialer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dialer campaign? This will also delete all associated call lists and sessions.')) return;

    try {
      await db
        .from('cc_outbound_call_lists')
        .delete()
        .eq('campaign_id', id);

      await db
        .from('cc_dialer_sessions')
        .delete()
        .eq('campaign_id', id);

      const { error } = await db
        .from('cc_outbound_dialers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (selectedCampaign === id) {
        setSelectedCampaign(null);
      }

      loadDialerCampaigns();
    } catch (error: any) {
      alert('Failed to delete dialer campaign: ' + error.message);
    }
  };

  const addCustomer = () => {
    setEditingCustomerId(null);
    resetCustomerForm();
    setShowCustomerModal(true);
  };

  const handleSaveCustomer = async () => {
    if (!newCustomerForm.customer_name || !newCustomerForm.primary_phone || !newCustomerForm.primary_email) {
      alert('Please fill in all required fields: Name, Phone, and Email');
      return;
    }

    if (!userTenantId) {
      alert('Unable to determine tenant. Please try logging out and back in.');
      return;
    }

    const tagsArray = newCustomerForm.tags ? newCustomerForm.tags.split(',').map(t => t.trim()) : [];
    const customFields: any = {};
    if (newCustomerForm.custom_field1) customFields.field1 = newCustomerForm.custom_field1;
    if (newCustomerForm.custom_field2) customFields.field2 = newCustomerForm.custom_field2;
    if (newCustomerForm.company_name) customFields.company_name = newCustomerForm.company_name;
    if (newCustomerForm.job_title) customFields.job_title = newCustomerForm.job_title;
    if (newCustomerForm.date_of_birth) customFields.date_of_birth = newCustomerForm.date_of_birth;
    if (newCustomerForm.preferred_language) customFields.preferred_language = newCustomerForm.preferred_language;
    if (newCustomerForm.timezone) customFields.timezone = newCustomerForm.timezone;
    if (newCustomerForm.notes) customFields.notes = newCustomerForm.notes;
    if (newCustomerForm.address_line1) {
      customFields.address = {
        line1: newCustomerForm.address_line1,
        line2: newCustomerForm.address_line2,
        city: newCustomerForm.city,
        state: newCustomerForm.state,
        postal_code: newCustomerForm.postal_code,
        country: newCustomerForm.country
      };
    }

    try {
      if (editingCustomerId) {
        const { error } = await db
          .from('cc_customer_context')
          .update({
            customer_name: newCustomerForm.customer_name,
            primary_phone: newCustomerForm.primary_phone,
            primary_email: newCustomerForm.primary_email,
            secondary_phone: newCustomerForm.secondary_phone || null,
            secondary_email: newCustomerForm.secondary_email || null,
            preferred_channel: newCustomerForm.preferred_channel,
            customer_tier: newCustomerForm.customer_tier,
            tags: tagsArray,
            custom_fields: customFields,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCustomerId);

        if (error) {
          alert('Failed to update customer: ' + error.message);
        } else {
          alert('Customer updated successfully!');
          setShowCustomerModal(false);
          setEditingCustomerId(null);
          resetCustomerForm();
          loadCustomers();
        }
      } else {
        const newCustomerId = `CUST-${String(customers.length + 100).padStart(5, '0')}`;
        const { error } = await db
          .from('cc_customer_context')
          .insert({
            tenant_id: userTenantId,
            customer_id: newCustomerId,
            customer_name: newCustomerForm.customer_name,
            primary_phone: newCustomerForm.primary_phone,
            primary_email: newCustomerForm.primary_email,
            secondary_phone: newCustomerForm.secondary_phone || null,
            secondary_email: newCustomerForm.secondary_email || null,
            preferred_channel: newCustomerForm.preferred_channel,
            customer_tier: newCustomerForm.customer_tier,
            lifetime_value: 0,
            total_interactions: 0,
            last_interaction_at: new Date().toISOString(),
            average_satisfaction: 0,
            tags: tagsArray,
            custom_fields: customFields
          });

        if (error) {
          alert('Failed to add customer: ' + error.message);
        } else {
          alert('Customer added successfully!');
          setShowCustomerModal(false);
          resetCustomerForm();
          loadCustomers();
        }
      }
    } catch (error) {
      alert('Failed to save customer. Please try again.');
    }
  };

  const resetCustomerForm = () => {
    setNewCustomerForm({
      customer_name: '',
      primary_phone: '',
      primary_email: '',
      secondary_phone: '',
      secondary_email: '',
      preferred_channel: 'voice',
      customer_tier: 'standard',
      company_name: '',
      job_title: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Malaysia',
      date_of_birth: '',
      notes: '',
      tags: '',
      preferred_language: 'English',
      timezone: 'Asia/Kuala_Lumpur',
      custom_field1: '',
      custom_field2: ''
    });
  };

  const editCustomer = async (customer: any) => {
    const customFields = customer.custom_fields || {};
    const address = customFields.address || {};
    const tagsString = Array.isArray(customer.tags) ? customer.tags.join(', ') : '';

    setNewCustomerForm({
      customer_name: customer.customer_name || '',
      primary_phone: customer.primary_phone || '',
      primary_email: customer.primary_email || '',
      secondary_phone: customer.secondary_phone || '',
      secondary_email: customer.secondary_email || '',
      preferred_channel: customer.preferred_channel || 'voice',
      customer_tier: customer.customer_tier || 'standard',
      company_name: customFields.company_name || '',
      job_title: customFields.job_title || '',
      address_line1: address.line1 || '',
      address_line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || 'Malaysia',
      date_of_birth: customFields.date_of_birth || '',
      notes: customFields.notes || '',
      tags: tagsString,
      preferred_language: customFields.preferred_language || 'English',
      timezone: customFields.timezone || 'Asia/Kuala_Lumpur',
      custom_field1: customFields.field1 || '',
      custom_field2: customFields.field2 || ''
    });

    setEditingCustomerId(customer.id);
    setShowCustomerModal(true);
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    const { error } = await db.from('cc_customer_context').delete().eq('id', id);
    if (!error) loadCustomers();
    else alert('Failed to delete customer: ' + error.message);
  };

  const handleSaveACDRule = async () => {
    if (!newACDRuleForm.rule_name) {
      alert('Please enter a rule name');
      return;
    }

    const conditions: any = {};
    if (newACDRuleForm.business_hours_only) {
      conditions.business_hours_only = true;
    }
    if (newACDRuleForm.customer_tier_filter) {
      conditions.customer_tier = newACDRuleForm.customer_tier_filter;
    }
    if (newACDRuleForm.min_skill_level > 1) {
      conditions.min_skill_level = newACDRuleForm.min_skill_level;
    }
    if (newACDRuleForm.max_wait_time !== 600) {
      conditions.max_wait_time = newACDRuleForm.max_wait_time;
    }
    if (newACDRuleForm.time_based_routing) {
      conditions.time_based = {
        enabled: true,
        start_time: newACDRuleForm.time_start,
        end_time: newACDRuleForm.time_end,
        days_of_week: newACDRuleForm.days_of_week
      };
    }
    if (newACDRuleForm.enable_callback) {
      conditions.callback = {
        enabled: true,
        threshold_seconds: newACDRuleForm.callback_threshold
      };
    }
    if (newACDRuleForm.agent_selection_criteria !== 'longest_idle') {
      conditions.agent_selection = newACDRuleForm.agent_selection_criteria;
    }
    if (newACDRuleForm.backup_queue) {
      conditions.backup_queue = newACDRuleForm.backup_queue;
    }

    const ruleData = {
      rule_name: newACDRuleForm.rule_name,
      rule_description: newACDRuleForm.rule_description,
      channel_type: newACDRuleForm.channel_type === 'all' ? null : newACDRuleForm.channel_type,
      routing_strategy: newACDRuleForm.routing_strategy,
      priority: newACDRuleForm.priority,
      target_queue: newACDRuleForm.target_queue || null,
      target_skill: newACDRuleForm.target_skill || null,
      overflow_action: newACDRuleForm.overflow_action,
      overflow_threshold_seconds: newACDRuleForm.overflow_threshold_seconds,
      conditions: Object.keys(conditions).length > 0 ? conditions : null
    };

    try {
      if (editingACDRuleId) {
        const { error } = await db
          .from('cc_acd_routing_rules')
          .update(ruleData)
          .eq('id', editingACDRuleId);

        if (error) {
          alert('Failed to update ACD rule: ' + error.message);
        } else {
          alert('ACD Routing Rule updated successfully!');
          setShowACDRuleModal(false);
          setEditingACDRuleId(null);
          resetACDRuleForm();
          loadACDRules();
        }
      } else {
        const { error } = await db
          .from('cc_acd_routing_rules')
          .insert({
            tenant_id: null,
            ...ruleData,
            is_active: true
          });

        if (error) {
          alert('Failed to create ACD rule: ' + error.message);
        } else {
          alert('ACD Routing Rule created successfully!');
          setShowACDRuleModal(false);
          resetACDRuleForm();
          loadACDRules();
        }
      }
    } catch (error) {
      alert('Failed to save ACD rule. Please try again.');
    }
  };

  const resetACDRuleForm = () => {
    setNewACDRuleForm({
      rule_name: '',
      rule_description: '',
      channel_type: 'all',
      routing_strategy: 'round_robin',
      priority: 5,
      target_queue: '',
      target_skill: '',
      overflow_action: 'voicemail',
      overflow_threshold_seconds: 300,
      business_hours_only: false,
      customer_tier_filter: '',
      min_skill_level: 1,
      max_wait_time: 600,
      enable_callback: true,
      callback_threshold: 180,
      agent_selection_criteria: 'longest_idle',
      backup_queue: '',
      time_based_routing: false,
      time_start: '09:00',
      time_end: '18:00',
      days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    });
  };

  const editACDRule = async (rule: ACDRoutingRule) => {
    const conditions = rule.conditions || {};
    const timeBased = conditions.time_based || {};
    const callback = conditions.callback || {};

    setNewACDRuleForm({
      rule_name: rule.rule_name || '',
      rule_description: rule.rule_description || '',
      channel_type: rule.channel_type || 'all',
      routing_strategy: rule.routing_strategy || 'round_robin',
      priority: rule.priority || 5,
      target_queue: rule.target_queue || '',
      target_skill: rule.target_skill || '',
      overflow_action: rule.overflow_action || 'voicemail',
      overflow_threshold_seconds: rule.overflow_threshold_seconds || 300,
      business_hours_only: conditions.business_hours_only || false,
      customer_tier_filter: conditions.customer_tier || '',
      min_skill_level: conditions.min_skill_level || 1,
      max_wait_time: conditions.max_wait_time || 600,
      enable_callback: callback.enabled || false,
      callback_threshold: callback.threshold_seconds || 180,
      agent_selection_criteria: conditions.agent_selection || 'longest_idle',
      backup_queue: conditions.backup_queue || '',
      time_based_routing: timeBased.enabled || false,
      time_start: timeBased.start_time || '09:00',
      time_end: timeBased.end_time || '18:00',
      days_of_week: timeBased.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    });

    setEditingACDRuleId(rule.id);
    setShowACDRuleModal(true);
  };

  const deleteACDRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ACD routing rule?')) return;
    const { error } = await db.from('cc_acd_routing_rules').delete().eq('id', id);
    if (!error) {
      loadACDRules();
      alert('ACD Routing Rule deleted successfully!');
    } else {
      alert('Failed to delete ACD rule: ' + error.message);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-[#39FF14]/20 text-[#39FF14]';
      case 'premium': return 'bg-[#39FF14]/20 text-[#39FF14]';
      case 'online': return 'text-brand-lime bg-green-500/10 border-green-500/20';
      case 'busy': return 'text-brand-lime bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'voice': return 'bg-[#39FF14]';
      case 'sms': return 'bg-green-600';
      case 'whatsapp': return 'bg-emerald-600';
      case 'chat': return 'bg-[#39FF14]';
      case 'email': return 'bg-[#39FF14]';
      default: return 'bg-gray-600';
    }
  };

  const getRoutingStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'skills_based': return 'bg-[#39FF14]/20 text-[#39FF14]';
      case 'priority_based': return 'bg-red-500/20 text-red-400';
      case 'sticky_agent': return 'bg-[#39FF14]/20 text-[#39FF14]';
      case 'round_robin': return 'bg-green-500/20 text-green-400';
      case 'away': return 'text-brand-lime bg-yellow-500/10 border-yellow-500/20';
      case 'least_busy': return 'bg-[#39FF14]/20 text-[#39FF14]';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSkillCategoryIcon = (category: string) => {
    switch (category) {
      case 'language': return '🌐';
      case 'department': return '🏢';
      case 'technical': return '🔧';
      case 'product': return '📦';
      case 'soft_skills': return '💼';
      case 'industry': return '🏭';
      case 'certification': return '🎓';
      default: return '⭐';
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
        <div className="text-gray-400">Loading contact center data...</div>
      </div>
    );
  }

  const groupedSkills = agentSkills.reduce((acc, skill) => {
    if (!acc[skill.agent_name]) acc[skill.agent_name] = [];
    acc[skill.agent_name].push(skill);
    return acc;
  }, {} as Record<string, AgentSkill[]>);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contact Center</h1>
            <p className="text-gray-400">Omnichannel unified desktop with intelligent routing</p>
            <div className="mt-2 text-sm text-gray-500">
              Current Tenant: <span className="text-[#39FF14] font-medium">Platform</span>
            </div>
          </div>
          <button
            onClick={() => setShowDialpad(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
          >
            <PhoneCall className="w-5 h-5" />
            Dialpad
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('unified-desktop')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'unified-desktop' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Unified Desktop
        </button>
        <button
          onClick={() => setActiveTab('customer-context')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'customer-context' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Customer Context
        </button>
        <button
          onClick={() => setActiveTab('acd-routing')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'acd-routing' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          ACD Routing
        </button>
        <button
          onClick={() => setActiveTab('agent-skills')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'agent-skills' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Star className="w-4 h-4 inline mr-2" />
          Agent Skills
        </button>
        <button
          onClick={() => setActiveTab('priority-routing')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'priority-routing' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Priority Routing
        </button>
        <button
          onClick={() => setActiveTab('ivr-config')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'ivr-config' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Phone className="w-4 h-4 inline mr-2" />
          IVR Configuration
        </button>
        <button
          onClick={() => setActiveTab('outbound-dialers')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'outbound-dialers' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <PhoneOutgoing className="w-4 h-4 inline mr-2" />
          Outbound Dialers
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
                <div className="text-2xl font-bold text-yellow-400">
                  {queueItems.filter(q => q.status === 'waiting').length}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Active</div>
                <div className="text-2xl font-bold text-green-400">
                  {queueItems.filter(q => q.status === 'assigned').length}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Avg Wait Time</div>
                <div className="text-2xl font-bold text-[#39FF14]">
                  {queueItems.length > 0
                    ? formatWaitTime(Math.floor(queueItems.reduce((acc, q) => acc + q.wait_time_seconds, 0) / queueItems.length))
                    : '0s'}
                </div>
              </div>
            </div>
          </div>

          {queueItems.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No items in queue</p>
            </div>
          ) : (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-750">
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full ${getChannelColor(item.channel_type)} text-white`}>
                          <span className="text-xs font-medium uppercase">{item.channel_type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{item.customer_name}</div>
                        <div className="text-gray-400 text-sm">{item.customer_phone}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{item.queue_name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          item.priority >= 8 ? 'bg-red-500/20 text-red-400' :
                          item.priority >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          P{item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{formatWaitTime(item.wait_time_seconds)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                          item.status === 'assigned' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{item.assigned_agent_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'customer-context' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Customer Context & History</h2>
            <button
              onClick={addCustomer}
              className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </button>
          </div>

          {customers.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">No customers found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-bold">{customer.customer_name}</h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getTierColor(customer.customer_tier)}`}>
                        {customer.customer_tier.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editCustomer(customer)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Edit Customer"
                      >
                        <Edit className="w-4 h-4 text-brand-lime" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Delete Customer"
                      >
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
                      <span className="text-gray-300 truncate ml-2">{customer.primary_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Channel:</span>
                      <span className="text-gray-300 uppercase">{customer.preferred_channel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interactions:</span>
                      <span className="text-white font-bold">{customer.total_interactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">LTV:</span>
                      <span className="text-green-400 font-bold">RM {parseFloat(customer.lifetime_value).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Satisfaction:</span>
                      <span className="text-yellow-400 font-bold">{parseFloat(customer.average_satisfaction).toFixed(1)} / 5.0</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'acd-routing' && (
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">ACD Routing Rules</h2>
              <p className="text-gray-400 text-sm">Automatic Call Distribution - Intelligent routing strategies</p>
            </div>
            <button
              onClick={() => {
                setEditingACDRuleId(null);
                resetACDRuleForm();
                setShowACDRuleModal(true);
              }}
              className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />Create Rule
            </button>
          </div>

          {acdRules.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No routing rules configured</p>
            </div>
          ) : (
            <div className="space-y-3">
              {acdRules.map((rule) => (
                <div key={rule.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-bold">{rule.rule_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoutingStrategyColor(rule.routing_strategy)}`}>
                          {rule.routing_strategy.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          rule.priority >= 8 ? 'bg-red-500/20 text-red-400' :
                          rule.priority >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          Priority {rule.priority}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{rule.rule_description}</p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        {rule.target_queue && (
                          <div>
                            <span className="text-gray-500">Queue:</span> <span className="text-[#39FF14]">{rule.target_queue}</span>
                          </div>
                        )}
                        {rule.target_skill && (
                          <div>
                            <span className="text-gray-500">Skill:</span> <span className="text-green-400">{rule.target_skill}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => editACDRule(rule)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Edit Rule"
                      >
                        <Edit className="w-4 h-4 text-brand-lime" />
                      </button>
                      <button
                        onClick={() => deleteACDRule(rule.id)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      <button onClick={() => toggleACDRule(rule.id, rule.is_active)}>
                        {rule.is_active ? (
                          <ToggleRight className="w-8 h-8 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'agent-skills' && (
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Agent Skills</h2>
              <p className="text-gray-400 text-sm">Skills-based routing - Language proficiencies and department expertise</p>
            </div>
            <button onClick={addAgentSkill} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />Add Skill
            </button>
          </div>

          {Object.keys(groupedSkills).length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No agent skills configured</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groupedSkills).map(([agentName, skills]) => (
                <div key={agentName} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-lg">{agentName}</h3>
                    <span className="text-gray-400 text-sm">{skills.length} skills</span>
                  </div>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <div key={skill.id} className="bg-gray-700 rounded p-3 flex justify-between items-center group hover:bg-gray-600 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getSkillCategoryIcon(skill.skill_category)}</span>
                          <div>
                            <div className="text-white text-sm font-medium">{skill.skill_name}</div>
                            <div className="text-gray-400 text-xs capitalize">{skill.skill_category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-yellow-400 font-bold text-sm">{skill.proficiency_level}/10</div>
                          <button
                            onClick={() => editAgentSkill(skill)}
                            className="p-1 hover:bg-[#39FF14] rounded transition-colors"
                            title="Edit Skill"
                          >
                            <Edit className="w-4 h-4 text-brand-lime" />
                          </button>
                          <button
                            onClick={() => deleteAgentSkill(skill.id)}
                            className="p-1 hover:bg-red-600 rounded transition-colors"
                            title="Delete Skill"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                          <button onClick={() => toggleAgentSkill(skill.id, skill.is_active)} title="Toggle Active Status">
                            {skill.is_active ? (
                              <ToggleRight className="w-6 h-6 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'priority-routing' && (
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Priority Routing Rules</h2>
              <p className="text-gray-400 text-sm">Automatically boost priority for VIP customers, high-value accounts, and urgent situations</p>
            </div>
            <button onClick={addPriorityRule} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />Create Priority Rule
            </button>
          </div>

          {priorityRules.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No priority rules configured</p>
            </div>
          ) : (
            <div className="space-y-3">
              {priorityRules.map((rule) => (
                <div key={rule.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-bold">{rule.priority_name}</h3>
                        <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold">
                          Level {rule.priority_level}/10
                        </span>
                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">
                          +{rule.boost_percentage}% Priority
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{rule.priority_description}</p>
                      <div className="text-xs text-gray-500">
                        Conditions: <span className="text-gray-400">{JSON.stringify(rule.conditions)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => editPriorityRule(rule)}
                        className="p-2 hover:bg-[#39FF14] rounded transition-colors"
                        title="Edit Rule"
                      >
                        <Edit className="w-4 h-4 text-brand-lime" />
                      </button>
                      <button
                        onClick={() => deletePriorityRule(rule.id)}
                        className="p-2 hover:bg-red-600 rounded transition-colors"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      <button onClick={() => togglePriorityRule(rule.id, rule.is_active)} title="Toggle Active Status">
                        {rule.is_active ? (
                          <ToggleRight className="w-8 h-8 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-600" />
                        )}
                      </button>
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">IVR Configuration</h2>
              <p className="text-gray-400 text-sm">Interactive Voice Response with traditional key press + Conversational AI</p>
            </div>
            <button onClick={addIVR} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />Configure New IVR
            </button>
          </div>

          {ivrMenus.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No IVR menus configured</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ivrMenus.map((menu) => {
                const menuOptions = ivrOptions.filter(opt => opt.ivr_menu_id === menu.id);
                const traditionalOptions = menuOptions.filter(opt => opt.option_key && !opt.option_key.startsWith('AI'));
                const aiOptions = menuOptions.filter(opt => opt.option_key && opt.option_key.startsWith('AI'));

                return (
                  <div key={menu.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{menu.menu_name}</h3>
                        <p className="text-gray-400 text-sm">{menu.menu_description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          menu.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {menu.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => editIVR(menu)}
                          className="p-2 hover:bg-[#39FF14] rounded transition-colors"
                          title="Edit IVR"
                        >
                          <Edit className="w-4 h-4 text-brand-lime" />
                        </button>
                        <button
                          onClick={() => deleteIVR(menu.id)}
                          className="p-2 hover:bg-red-600 rounded transition-colors"
                          title="Delete IVR"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-700 p-3 rounded mb-4">
                      <div className="text-sm text-gray-400 mb-1">Greeting Message:</div>
                      <div className="text-white">{menu.greeting_text}</div>
                      <div className="text-xs text-gray-500 mt-2">Timeout: {menu.timeout_seconds}s</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-5 h-5 text-brand-lime" />
                          <h4 className="text-white font-semibold">Traditional Key Press</h4>
                          <span className="text-xs text-gray-500">({traditionalOptions.length} options)</span>
                        </div>
                        <div className="space-y-2">
                          {traditionalOptions.length === 0 ? (
                            <div className="text-gray-500 text-sm">No traditional options</div>
                          ) : (
                            traditionalOptions.map((opt) => (
                              <div key={opt.id} className="bg-gray-700 p-2 rounded flex items-center gap-3">
                                <div className="bg-[#39FF14] text-white px-2 py-1 rounded font-bold text-sm min-w-[32px] text-center">
                                  {opt.option_key}
                                </div>
                                <div className="flex-1">
                                  <div className="text-white text-sm">{opt.option_label}</div>
                                  <div className="text-gray-400 text-xs">{opt.action_target || opt.action_type}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-brand-lime" />
                          <h4 className="text-white font-semibold">Conversational AI</h4>
                          <span className="text-xs text-gray-500">({aiOptions.length} intents)</span>
                        </div>
                        <div className="space-y-2">
                          {aiOptions.length === 0 ? (
                            <div className="text-gray-500 text-sm">No AI intents</div>
                          ) : (
                            aiOptions.map((opt) => (
                              <div key={opt.id} className="bg-gray-700 p-2 rounded flex items-center gap-3">
                                <div className="bg-[#39FF14] text-white px-2 py-1 rounded text-xs min-w-[32px] flex items-center justify-center">
                                  <MessageSquare className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-white text-sm">{opt.option_label}</div>
                                  <div className="text-gray-400 text-xs">Intent: {opt.ai_intent}</div>
                                  <div className="text-gray-500 text-xs">{opt.action_target || opt.action_type}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'outbound-dialers' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Outbound Dialer Management</h2>
              <p className="text-gray-400 text-sm">Automated dialers to maximize agent productivity - Predictive, Power, and Preview modes</p>
            </div>
            <button
              onClick={() => setShowNewDialerModal(true)}
              className="bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-[#32e012] hover:to-[#28b80f] transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Dialer
            </button>
          </div>

          {dialerCampaigns.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <PhoneOutgoing className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No dialer campaigns found</p>
              <p className="text-gray-500 text-sm mb-4">Create your first outbound dialer campaign to start calling</p>
              <button
                onClick={() => setShowNewDialerModal(true)}
                className="bg-[#39FF14] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dialerCampaigns.map((campaign) => {
                  const metrics = getCampaignMetrics(campaign.id);
                  return (
                    <div
                      key={campaign.id}
                      className={`bg-gray-800 rounded-lg p-4 transition-all ${
                        selectedCampaign === campaign.id ? 'ring-2 ring-[#39FF14]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            setSelectedCampaign(campaign.id);
                            loadCallLists(campaign.id);
                          }}
                        >
                          <h3 className="text-white font-bold">{campaign.campaign_name}</h3>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                            campaign.dialer_type === 'predictive' ? 'bg-red-500/20 text-red-400' :
                            campaign.dialer_type === 'power' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                            'bg-[#39FF14]/20 text-[#39FF14]'
                          }`}>
                            {campaign.dialer_type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {campaign.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editDialer(campaign);
                            }}
                            className="p-1.5 hover:bg-[#39FF14] rounded transition-colors"
                            title="Edit Campaign"
                          >
                            <Edit className="w-4 h-4 text-brand-lime" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDialer(campaign.id);
                            }}
                            className="p-1.5 hover:bg-red-600 rounded transition-colors"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-3">{campaign.campaign_description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Contacts:</span>
                          <span className="text-white font-bold">{metrics.total_contacts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Dialed:</span>
                          <span className="text-[#39FF14] font-bold">{metrics.contacts_dialed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reached:</span>
                          <span className="text-green-400 font-bold">{metrics.contacts_reached}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Converted:</span>
                          <span className="text-yellow-400 font-bold">{metrics.contacts_converted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Success Rate:</span>
                          <span className="text-[#39FF14] font-bold">
                            {metrics.contacts_dialed > 0 ? ((metrics.contacts_converted / metrics.contacts_dialed) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedCampaign && (
                <>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-bold text-lg mb-3">Active Sessions</h3>
                    {dialerSessions.filter(s => s.campaign_id === selectedCampaign).length === 0 ? (
                      <p className="text-gray-400 text-sm">No active sessions</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dialerSessions.filter(s => s.campaign_id === selectedCampaign).map((session) => (
                          <div key={session.id} className="bg-gray-700 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-white font-semibold">{session.agent_name}</div>
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                                <Play className="w-3 h-3" />
                                Active
                              </span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Presented:</span>
                                <span className="text-white">{session.calls_presented}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Answered:</span>
                                <span className="text-green-400 font-bold">{session.calls_answered}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Converted:</span>
                                <span className="text-yellow-400 font-bold">{session.calls_converted}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Talk Time:</span>
                                <span className="text-[#39FF14]">{Math.floor(session.total_talk_time_seconds / 60)}m</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Duration:</span>
                                <span className="text-gray-300">
                                  {Math.floor((Date.now() - new Date(session.started_at).getTime()) / 60000)}m
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-white font-bold text-lg">Call List</h3>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#39FF14] text-white rounded hover:bg-[#32e012] text-sm flex items-center gap-1">
                          <Plus className="w-4 h-4" />
                          Add Contact
                        </button>
                      </div>
                    </div>

                    {callLists.length === 0 ? (
                      <p className="text-gray-400 text-sm">No contacts in call list</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Contact</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Phone</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Tier</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Priority</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Status</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Attempts</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Last Result</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {callLists.map((item) => {
                              const campaign = dialerCampaigns.find(c => c.id === item.campaign_id);
                              return (
                                <tr key={item.id} className="hover:bg-gray-750">
                                  <td className="px-3 py-2">
                                    <div className="text-white text-sm font-medium">{item.contact_name}</div>
                                    {item.customer_id && (
                                      <div className="text-gray-400 text-xs">{item.customer_id}</div>
                                    )}
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="text-gray-300 text-sm">{item.phone_number}</div>
                                    {item.alternate_phone && (
                                      <div className="text-gray-500 text-xs">{item.alternate_phone}</div>
                                    )}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTierColor(item.customer_tier)}`}>
                                      {item.customer_tier.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      item.priority >= 8 ? 'bg-red-500/20 text-red-400' :
                                      item.priority >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-gray-500/20 text-gray-400'
                                    }`}>
                                      P{item.priority}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      item.status === 'pending' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                      item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                      item.status === 'callback_scheduled' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                                      item.status === 'no_answer' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-gray-500/20 text-gray-400'
                                    }`}>
                                      {item.status.replace('_', ' ')}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-gray-300 text-sm">{item.attempts}</td>
                                  <td className="px-3 py-2">
                                    <div className="text-gray-300 text-xs">{item.last_disposition || '-'}</div>
                                  </td>
                                  <td className="px-3 py-2">
                                    {campaign?.dialer_type === 'preview' ? (
                                      <button className="px-2 py-1 bg-[#39FF14] text-white rounded text-xs hover:bg-[#32e012] flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        Preview
                                      </button>
                                    ) : (
                                      <button className="px-2 py-1 bg-[#39FF14] text-white rounded text-xs hover:bg-[#32e012] flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        Call
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-bold text-lg mb-3">Recent Call Results</h3>
                    {callResults.filter(r => r.campaign_id === selectedCampaign).length === 0 ? (
                      <p className="text-gray-400 text-sm">No call results yet</p>
                    ) : (
                      <div className="space-y-2">
                        {callResults.filter(r => r.campaign_id === selectedCampaign).slice(0, 10).map((result) => (
                          <div key={result.id} className="bg-gray-700 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-white font-medium">{result.phone_number}</div>
                                <div className="text-gray-400 text-xs">{result.agent_name}</div>
                              </div>
                              <div className="text-right">
                                <div className={`text-xs font-bold ${
                                  result.is_converted ? 'text-green-400' :
                                  result.is_answered ? 'text-[#39FF14]' : 'text-gray-400'
                                }`}>
                                  {result.disposition}
                                </div>
                                {result.sub_disposition && (
                                  <div className="text-gray-500 text-xs">{result.sub_disposition}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.floor(result.talk_time_seconds / 60)}m {result.talk_time_seconds % 60}s
                              </div>
                              {result.is_converted && (
                                <div className="flex items-center gap-1 text-green-400">
                                  <CheckCircle className="w-3 h-3" />
                                  Converted
                                </div>
                              )}
                              <div className="text-gray-500">
                                {new Date(result.dialed_at).toLocaleTimeString()}
                              </div>
                            </div>
                            {result.agent_notes && (
                              <div className="mt-2 text-xs text-gray-300 bg-gray-800 rounded p-2">
                                {result.agent_notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {showDialpad && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-96 p-6 relative border border-gray-700">
            <button
              onClick={() => setShowDialpad(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-green-500" />
              Dialpad
            </h2>

            {isCallActive ? (
              <div className="mb-6">
                <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-xl p-6 text-center">
                  <div className="text-white text-sm mb-2">Calling</div>
                  <div className="text-white text-2xl font-bold mb-1">{dialpadNumber}</div>
                  <div className="text-white/80 text-lg">{Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}</div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-4 mb-6 min-h-[60px] flex items-center justify-center">
                <input
                  type="text"
                  value={dialpadNumber}
                  onChange={(e) => setDialpadNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-transparent text-white text-2xl text-center font-mono w-full outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDialpadClick(digit)}
                  disabled={isCallActive}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-2xl font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {digit}
                </button>
              ))}
            </div>

            {isCallActive ? (
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`${isMuted ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-1`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>
                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`${isSpeakerOn ? 'bg-[#39FF14]' : 'bg-gray-700'} hover:bg-gray-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-1`}
                >
                  {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                  <span className="text-xs">Speaker</span>
                </button>
                <button
                  onClick={() => setShowDialpad(true)}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-1"
                >
                  <Keyboard className="w-6 h-6" />
                  <span className="text-xs">Keypad</span>
                </button>
                <button
                  onClick={handleEndCall}
                  className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-1"
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                  <span className="text-xs">End</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                {dialpadNumber && (
                  <button
                    onClick={handleDialpadBackspace}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
                  >
                    ⌫ Delete
                  </button>
                )}
                <button
                  onClick={handleCall}
                  disabled={!dialpadNumber}
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showNewDialerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowNewDialerModal(false);
                setEditingDialerId(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <PhoneOutgoing className="w-6 h-6 text-brand-lime" />
              {editingDialerId ? 'Edit Dialer Campaign' : 'Create New Dialer Campaign'}
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name *</label>
                  <input
                    type="text"
                    value={newDialerForm.campaign_name}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, campaign_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="Q1 Sales Campaign"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dialer Type *</label>
                  <select
                    value={newDialerForm.dialer_type}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, dialer_type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="predictive">Predictive - High volume automated dialing</option>
                    <option value="power">Power - Progressive automated dialing</option>
                    <option value="preview">Preview - Agent reviews before calling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newDialerForm.campaign_description}
                  onChange={(e) => setNewDialerForm({ ...newDialerForm, campaign_description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-24"
                  placeholder="Describe the purpose and goals of this campaign..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Call Attempts</label>
                  <input
                    type="number"
                    value={newDialerForm.max_call_attempts}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, max_call_attempts: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Retry Delay (minutes)</label>
                  <input
                    type="number"
                    value={newDialerForm.retry_delay_minutes}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, retry_delay_minutes: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    min="15"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                  <select
                    value={newDialerForm.timezone}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, timezone: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (GMT+8)</option>
                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                    <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                    <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Calling Hours Start</label>
                  <input
                    type="time"
                    value={newDialerForm.calling_hours_start}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, calling_hours_start: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Calling Hours End</label>
                  <input
                    type="time"
                    value={newDialerForm.calling_hours_end}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, calling_hours_end: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newDialerForm.scheduled_start_date}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, scheduled_start_date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newDialerForm.scheduled_end_date}
                    onChange={(e) => setNewDialerForm({ ...newDialerForm, scheduled_end_date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Call Script Template</label>
                <textarea
                  value={newDialerForm.script_template}
                  onChange={(e) => setNewDialerForm({ ...newDialerForm, script_template: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-32 font-mono text-sm"
                  placeholder="Hello [CUSTOMER_NAME], this is [AGENT_NAME] from [COMPANY]..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowNewDialerModal(false);
                    setEditingDialerId(null);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDialer}
                  disabled={!newDialerForm.campaign_name}
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingDialerId ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowCustomerModal(false);
                setEditingCustomerId(null);
                resetCustomerForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-500" />
              {editingCustomerId ? 'Edit Customer' : 'Add New Customer'}
            </h2>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={newCustomerForm.customer_name}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, customer_name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Customer Tier *</label>
                    <select
                      value={newCustomerForm.customer_tier}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, customer_tier: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="vip">VIP</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={newCustomerForm.company_name}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, company_name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={newCustomerForm.job_title}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, job_title: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Sales Manager"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Phone *</label>
                    <input
                      type="tel"
                      value={newCustomerForm.primary_phone}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, primary_phone: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="+60123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Phone</label>
                    <input
                      type="tel"
                      value={newCustomerForm.secondary_phone}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, secondary_phone: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="+60198765432"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Email *</label>
                    <input
                      type="email"
                      value={newCustomerForm.primary_email}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, primary_email: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Email</label>
                    <input
                      type="email"
                      value={newCustomerForm.secondary_email}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, secondary_email: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="john@personal.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Channel</label>
                    <select
                      value={newCustomerForm.preferred_channel}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, preferred_channel: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="voice">Voice Call</option>
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="chat">Live Chat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Language</label>
                    <select
                      value={newCustomerForm.preferred_language}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, preferred_language: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="English">English</option>
                      <option value="Malay">Bahasa Malaysia</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address Line 1</label>
                    <input
                      type="text"
                      value={newCustomerForm.address_line1}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address_line1: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      value={newCustomerForm.address_line2}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address_line2: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Unit 456, Tower B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      value={newCustomerForm.city}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Kuala Lumpur"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State / Province</label>
                    <input
                      type="text"
                      value={newCustomerForm.state}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, state: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Wilayah Persekutuan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={newCustomerForm.postal_code}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, postal_code: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                    <select
                      value={newCustomerForm.country}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, country: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Malaysia">Malaysia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Vietnam">Vietnam</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={newCustomerForm.date_of_birth}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, date_of_birth: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      value={newCustomerForm.timezone}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, timezone: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (GMT+8)</option>
                      <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                      <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                      <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                      <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newCustomerForm.tags}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tags: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="high-value, tech-savvy, frequent-caller"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                    <textarea
                      value={newCustomerForm.notes}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 h-24"
                      placeholder="Additional notes about the customer..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Custom Field 1</label>
                    <input
                      type="text"
                      value={newCustomerForm.custom_field1}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, custom_field1: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Custom data..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Custom Field 2</label>
                    <input
                      type="text"
                      value={newCustomerForm.custom_field2}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, custom_field2: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Custom data..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowCustomerModal(false);
                    setEditingCustomerId(null);
                    resetCustomerForm();
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomer}
                  disabled={!newCustomerForm.customer_name || !newCustomerForm.primary_phone || !newCustomerForm.primary_email}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingCustomerId ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showACDRuleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowACDRuleModal(false);
                setEditingACDRuleId(null);
                resetACDRuleForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-brand-lime" />
              {editingACDRuleId ? 'Edit ACD Routing Rule' : 'Create ACD Routing Rule'}
            </h2>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rule Name *</label>
                    <input
                      type="text"
                      value={newACDRuleForm.rule_name}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, rule_name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="VIP Customer Priority Routing"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newACDRuleForm.rule_description}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, rule_description: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-20"
                      placeholder="Describe the purpose and behavior of this routing rule..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority Level *</label>
                    <select
                      value={newACDRuleForm.priority}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, priority: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="1">1 - Lowest</option>
                      <option value="2">2 - Low</option>
                      <option value="3">3 - Below Normal</option>
                      <option value="4">4 - Normal</option>
                      <option value="5">5 - Standard</option>
                      <option value="6">6 - Above Normal</option>
                      <option value="7">7 - High</option>
                      <option value="8">8 - Very High</option>
                      <option value="9">9 - Critical</option>
                      <option value="10">10 - Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Channel Type</label>
                    <select
                      value={newACDRuleForm.channel_type}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, channel_type: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="all">All Channels</option>
                      <option value="voice">Voice Calls</option>
                      <option value="chat">Live Chat</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Routing Strategy */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Routing Strategy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Strategy Type *</label>
                    <select
                      value={newACDRuleForm.routing_strategy}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, routing_strategy: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="round_robin">Round Robin - Distribute evenly</option>
                      <option value="least_active">Least Active - Route to least busy agent</option>
                      <option value="longest_idle">Longest Idle - Route to longest waiting agent</option>
                      <option value="skills_based">Skills-Based - Match by expertise</option>
                      <option value="priority_weighted">Priority Weighted - VIP gets priority</option>
                      <option value="predictive">Predictive - AI-based routing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Agent Selection</label>
                    <select
                      value={newACDRuleForm.agent_selection_criteria}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, agent_selection_criteria: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="longest_idle">Longest Idle Time</option>
                      <option value="most_skilled">Most Skilled</option>
                      <option value="best_satisfaction">Best Satisfaction Score</option>
                      <option value="random">Random Selection</option>
                      <option value="sequential">Sequential Order</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Target Queue</label>
                    <input
                      type="text"
                      value={newACDRuleForm.target_queue}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, target_queue: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="support_queue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Required Skill</label>
                    <input
                      type="text"
                      value={newACDRuleForm.target_skill}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, target_skill: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="technical_support"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Skill Level</label>
                    <select
                      value={newACDRuleForm.min_skill_level}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, min_skill_level: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="1">1 - Beginner</option>
                      <option value="2">2 - Intermediate</option>
                      <option value="3">3 - Advanced</option>
                      <option value="4">4 - Expert</option>
                      <option value="5">5 - Master</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Backup Queue</label>
                    <input
                      type="text"
                      value={newACDRuleForm.backup_queue}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, backup_queue: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="general_queue"
                    />
                  </div>
                </div>
              </div>

              {/* Overflow & Timing */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Overflow & Timing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Overflow Action</label>
                    <select
                      value={newACDRuleForm.overflow_action}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, overflow_action: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="voicemail">Send to Voicemail</option>
                      <option value="callback">Offer Callback</option>
                      <option value="queue">Hold in Queue</option>
                      <option value="redirect">Redirect to Another Queue</option>
                      <option value="disconnect">Disconnect with Message</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Overflow Threshold (seconds)</label>
                    <input
                      type="number"
                      value={newACDRuleForm.overflow_threshold_seconds}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, overflow_threshold_seconds: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      min="30"
                      step="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Wait Time (seconds)</label>
                    <input
                      type="number"
                      value={newACDRuleForm.max_wait_time}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, max_wait_time: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      min="60"
                      step="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Callback Threshold (seconds)</label>
                    <input
                      type="number"
                      value={newACDRuleForm.callback_threshold}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, callback_threshold: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      min="30"
                      step="30"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Conditions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Advanced Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Customer Tier Filter</label>
                    <select
                      value={newACDRuleForm.customer_tier_filter}
                      onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, customer_tier_filter: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="">All Tiers</option>
                      <option value="vip">VIP Only</option>
                      <option value="premium">Premium Only</option>
                      <option value="standard">Standard Only</option>
                      <option value="basic">Basic Only</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newACDRuleForm.business_hours_only}
                        onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, business_hours_only: e.target.checked })}
                        className="w-5 h-5 text-brand-lime bg-gray-800 border-gray-700 rounded focus:ring-brand-lime"
                      />
                      <span className="ml-3 text-gray-300">Business Hours Only</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newACDRuleForm.enable_callback}
                        onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, enable_callback: e.target.checked })}
                        className="w-5 h-5 text-[#39FF14] bg-gray-800 border-gray-700 rounded focus:ring-[#39FF14]"
                      />
                      <span className="ml-3 text-gray-300">Enable Callback Option</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newACDRuleForm.time_based_routing}
                        onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, time_based_routing: e.target.checked })}
                        className="w-5 h-5 text-[#39FF14] bg-gray-800 border-gray-700 rounded focus:ring-[#39FF14]"
                      />
                      <span className="ml-3 text-gray-300">Enable Time-Based Routing</span>
                    </label>
                  </div>
                </div>

                {newACDRuleForm.time_based_routing && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-3">Time-Based Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={newACDRuleForm.time_start}
                          onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, time_start: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                        <input
                          type="time"
                          value={newACDRuleForm.time_end}
                          onChange={(e) => setNewACDRuleForm({ ...newACDRuleForm, time_end: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Active Days</label>
                        <div className="flex flex-wrap gap-2">
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                            <label key={day} className="flex items-center cursor-pointer bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                              <input
                                type="checkbox"
                                checked={newACDRuleForm.days_of_week.includes(day)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewACDRuleForm({
                                      ...newACDRuleForm,
                                      days_of_week: [...newACDRuleForm.days_of_week, day]
                                    });
                                  } else {
                                    setNewACDRuleForm({
                                      ...newACDRuleForm,
                                      days_of_week: newACDRuleForm.days_of_week.filter(d => d !== day)
                                    });
                                  }
                                }}
                                className="w-4 h-4 text-[#39FF14] bg-gray-900 border-gray-700 rounded focus:ring-[#39FF14]"
                              />
                              <span className="ml-2 text-gray-300 capitalize text-sm">{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowACDRuleModal(false);
                    setEditingACDRuleId(null);
                    resetACDRuleForm();
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveACDRule}
                  disabled={!newACDRuleForm.rule_name}
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingACDRuleId ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAgentSkillModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowAgentSkillModal(false);
                setEditingAgentSkillId(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              {editingAgentSkillId ? 'Edit Agent Skill' : 'Add New Agent Skill'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name *</label>
                <input
                  type="text"
                  value={newAgentSkillForm.agent_name}
                  onChange={(e) => setNewAgentSkillForm({ ...newAgentSkillForm, agent_name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name *</label>
                <input
                  type="text"
                  value={newAgentSkillForm.skill_name}
                  onChange={(e) => setNewAgentSkillForm({ ...newAgentSkillForm, skill_name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="English, Technical Support, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Category</label>
                <select
                  value={newAgentSkillForm.skill_category}
                  onChange={(e) => setNewAgentSkillForm({ ...newAgentSkillForm, skill_category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="language">Language</option>
                  <option value="department">Department</option>
                  <option value="technical">Technical</option>
                  <option value="product">Product Knowledge</option>
                  <option value="soft_skills">Soft Skills</option>
                  <option value="industry">Industry Expertise</option>
                  <option value="certification">Certification</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proficiency Level: {newAgentSkillForm.proficiency_level}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newAgentSkillForm.proficiency_level}
                  onChange={(e) => setNewAgentSkillForm({ ...newAgentSkillForm, proficiency_level: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={newAgentSkillForm.is_active}
                  onChange={(e) => setNewAgentSkillForm({ ...newAgentSkillForm, is_active: e.target.checked })}
                  className="w-4 h-4 text-yellow-600 bg-gray-900 border-gray-700 rounded focus:ring-yellow-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-300">
                  Active (Available for skill-based routing)
                </label>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Skill Information</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Skills are used for intelligent routing to match customer needs with agent expertise</li>
                  <li>• Higher proficiency levels indicate deeper expertise in the skill area</li>
                  <li>• Inactive skills are not considered during routing but remain in the system</li>
                  <li>• You can assign multiple skills to each agent for comprehensive coverage</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowAgentSkillModal(false);
                  setEditingAgentSkillId(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAgentSkill}
                disabled={!newAgentSkillForm.agent_name || !newAgentSkillForm.skill_name}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingAgentSkillId ? 'Update Skill' : 'Add Skill'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPriorityRuleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowPriorityRuleModal(false);
                setEditingPriorityRuleId(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-500" />
              {editingPriorityRuleId ? 'Edit Priority Rule' : 'Create Priority Rule'}
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-400 mb-2">About Priority Routing</h3>
                <p className="text-sm text-gray-400">
                  Priority rules automatically boost the queue position for specific customers or situations.
                  Higher priority levels and boost percentages mean faster service.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rule Name *</label>
                  <input
                    type="text"
                    value={newPriorityRuleForm.priority_name}
                    onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, priority_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="VIP Customer Priority"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newPriorityRuleForm.priority_description}
                    onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, priority_description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 h-20"
                    placeholder="Describe when and why this priority boost should be applied..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority Level: {newPriorityRuleForm.priority_level}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newPriorityRuleForm.priority_level}
                    onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, priority_level: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Critical</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Boost Percentage: +{newPriorityRuleForm.boost_percentage}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={newPriorityRuleForm.boost_percentage}
                    onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, boost_percentage: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                    <span>200%</span>
                    <span>300%</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trigger Condition Type</label>
                  <select
                    value={newPriorityRuleForm.condition_type}
                    onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, condition_type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="customer_tier">Customer Tier</option>
                    <option value="wait_time">Wait Time (Minutes)</option>
                    <option value="lifetime_value">Lifetime Value (Minimum)</option>
                    <option value="interaction_count">Interaction Count (Minimum)</option>
                  </select>
                </div>

                {newPriorityRuleForm.condition_type === 'customer_tier' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Customer Tier *</label>
                    <select
                      value={newPriorityRuleForm.condition_value}
                      onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, condition_value: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Select Tier</option>
                      <option value="vip">VIP</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="premium">Premium</option>
                      <option value="standard">Standard</option>
                      <option value="basic">Basic</option>
                    </select>
                  </div>
                )}

                {newPriorityRuleForm.condition_type === 'wait_time' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Wait Time (Minutes): {newPriorityRuleForm.wait_time_minutes}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={newPriorityRuleForm.wait_time_minutes}
                      onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, wait_time_minutes: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Boost priority for customers waiting longer than this duration
                    </p>
                  </div>
                )}

                {newPriorityRuleForm.condition_type === 'lifetime_value' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Lifetime Value (RM)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={newPriorityRuleForm.lifetime_value_min}
                      onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, lifetime_value_min: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Boost priority for customers with lifetime value above this amount
                    </p>
                  </div>
                )}

                {newPriorityRuleForm.condition_type === 'interaction_count' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Interaction Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newPriorityRuleForm.interaction_count_min}
                      onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, interaction_count_min: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Boost priority for customers with this many or more interactions
                    </p>
                  </div>
                )}

                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="priority_is_active"
                    checked={newPriorityRuleForm.is_active}
                    onChange={(e) => setNewPriorityRuleForm({ ...newPriorityRuleForm, is_active: e.target.checked })}
                    className="w-4 h-4 text-red-600 bg-gray-900 border-gray-700 rounded focus:ring-red-500"
                  />
                  <label htmlFor="priority_is_active" className="text-sm text-gray-300">
                    Active (Apply this rule to incoming interactions)
                  </label>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Priority Rule Examples</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• <strong>VIP Customers:</strong> Priority Level 10, +200% boost for customer_tier = VIP</li>
                  <li>• <strong>Long Wait:</strong> Priority Level 7, +100% boost for wait_time greater than 3 minutes</li>
                  <li>• <strong>High Value:</strong> Priority Level 8, +150% boost for lifetime_value above RM 10,000</li>
                  <li>• <strong>Loyal Customers:</strong> Priority Level 6, +75% boost for interaction_count above 20</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowPriorityRuleModal(false);
                  setEditingPriorityRuleId(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePriorityRule}
                disabled={!newPriorityRuleForm.priority_name}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingPriorityRuleId ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showIVRModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full p-6 relative border border-gray-700 my-8">
            <button
              onClick={() => {
                setShowIVRModal(false);
                setEditingIVRId(null);
                setIvrMenuOptions([]);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-[#39FF14]" />
              {editingIVRId ? 'Edit IVR Configuration' : 'Create IVR Configuration'}
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#39FF14] mb-2">About IVR Configuration</h3>
                <p className="text-sm text-gray-400">
                  Configure Interactive Voice Response menus with traditional key press options and modern Conversational AI intents.
                  Customers can either press keys or speak naturally to navigate your system.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Menu Name *</label>
                  <input
                    type="text"
                    value={newIVRForm.menu_name}
                    onChange={(e) => setNewIVRForm({ ...newIVRForm, menu_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="Main Menu"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newIVRForm.menu_description}
                    onChange={(e) => setNewIVRForm({ ...newIVRForm, menu_description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-20"
                    placeholder="Primary customer service menu..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Greeting Message *</label>
                  <textarea
                    value={newIVRForm.greeting_text}
                    onChange={(e) => setNewIVRForm({ ...newIVRForm, greeting_text: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] h-24"
                    placeholder="Thank you for calling. Press 1 for sales, 2 for support, or just say what you need..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Greeting Audio URL (Optional)</label>
                  <input
                    type="text"
                    value={newIVRForm.greeting_audio_url}
                    onChange={(e) => setNewIVRForm({ ...newIVRForm, greeting_audio_url: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="https://example.com/audio/greeting.mp3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timeout (Seconds)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={newIVRForm.timeout_seconds}
                    onChange={(e) => setNewIVRForm({ ...newIVRForm, timeout_seconds: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Retries</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newIVRForm.max_retries}
                    onChange={(e) => setNewIVRForm({ ...newIVRForm, max_retries: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Invalid Option Message</label>
                  <input
                    type="text"
                    value={newIVRForm.invalid_option_message}
                    onChange={(e) => setNewIVRForm({ ...newIVRForm, invalid_option_message: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timeout Message</label>
                  <input
                    type="text"
                    value={newIVRForm.timeout_message}
                    onChange={(e) => setNewIVRForm({ ...newIVRForm, timeout_message: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ivr_use_ai"
                      checked={newIVRForm.use_conversational_ai}
                      onChange={(e) => setNewIVRForm({ ...newIVRForm, use_conversational_ai: e.target.checked })}
                      className="w-4 h-4 text-[#39FF14] bg-gray-900 border-gray-700 rounded focus:ring-[#39FF14]"
                    />
                    <label htmlFor="ivr_use_ai" className="text-sm text-gray-300">
                      Enable Conversational AI
                    </label>
                  </div>

                  {newIVRForm.use_conversational_ai && (
                    <div className="flex-1">
                      <select
                        value={newIVRForm.ai_model}
                        onChange={(e) => setNewIVRForm({ ...newIVRForm, ai_model: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3">Claude 3</option>
                        <option value="gemini-pro">Gemini Pro</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ivr_is_active"
                      checked={newIVRForm.is_active}
                      onChange={(e) => setNewIVRForm({ ...newIVRForm, is_active: e.target.checked })}
                      className="w-4 h-4 text-[#39FF14] bg-gray-900 border-gray-700 rounded focus:ring-[#39FF14]"
                    />
                    <label htmlFor="ivr_is_active" className="text-sm text-gray-300">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Menu Options</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addIVROption('traditional')}
                      className="px-3 py-1.5 bg-[#39FF14] hover:bg-[#32e012] text-white text-sm rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Key Press
                    </button>
                    {newIVRForm.use_conversational_ai && (
                      <button
                        onClick={() => addIVROption('ai')}
                        className="px-3 py-1.5 bg-[#39FF14] hover:bg-[#32e012] text-white text-sm rounded-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Add AI Intent
                      </button>
                    )}
                  </div>
                </div>

                {ivrMenuOptions.length === 0 ? (
                  <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <p className="text-gray-400">No menu options added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {ivrMenuOptions.map((option, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              {option.option_key.startsWith('AI') ? 'Intent Key' : 'Key Press'}
                            </label>
                            <input
                              type="text"
                              value={option.option_key}
                              onChange={(e) => updateIVROption(index, 'option_key', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                              placeholder={option.option_key.startsWith('AI') ? 'AI_INTENT_1' : '1'}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Label</label>
                            <input
                              type="text"
                              value={option.option_label}
                              onChange={(e) => updateIVROption(index, 'option_label', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                              placeholder="Sales Department"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Action Type</label>
                            <select
                              value={option.action_type}
                              onChange={(e) => updateIVROption(index, 'action_type', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                            >
                              <option value="transfer_queue">Transfer to Queue</option>
                              <option value="transfer_agent">Transfer to Agent</option>
                              <option value="voicemail">Voicemail</option>
                              <option value="callback">Request Callback</option>
                              <option value="submenu">Sub Menu</option>
                              <option value="hangup">Hang Up</option>
                              {option.option_key.startsWith('AI') && <option value="ai_intent">AI Intent</option>}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Target</label>
                            <input
                              type="text"
                              value={option.action_target}
                              onChange={(e) => updateIVROption(index, 'action_target', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                              placeholder="sales_queue"
                            />
                          </div>
                          {option.option_key.startsWith('AI') && (
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">AI Intent</label>
                              <input
                                type="text"
                                value={option.ai_intent}
                                onChange={(e) => updateIVROption(index, 'ai_intent', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                                placeholder="speak_to_sales"
                              />
                            </div>
                          )}
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={option.priority}
                              onChange={(e) => updateIVROption(index, 'priority', parseInt(e.target.value))}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="checkbox"
                                id={`option_active_${index}`}
                                checked={option.is_active}
                                onChange={(e) => updateIVROption(index, 'is_active', e.target.checked)}
                                className="w-4 h-4 text-[#39FF14] bg-gray-900 border-gray-700 rounded focus:ring-[#39FF14]"
                              />
                              <label htmlFor={`option_active_${index}`} className="text-xs text-gray-300">
                                Active
                              </label>
                            </div>
                            <button
                              onClick={() => removeIVROption(index)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                              title="Remove Option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowIVRModal(false);
                  setEditingIVRId(null);
                  setIvrMenuOptions([]);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveIVR}
                disabled={!newIVRForm.menu_name || !newIVRForm.greeting_text || ivrMenuOptions.length === 0}
                className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingIVRId ? 'Update IVR' : 'Create IVR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
