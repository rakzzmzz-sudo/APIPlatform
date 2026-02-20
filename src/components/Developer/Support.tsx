import { useState, useEffect } from 'react';
import {
  HelpCircle, MessageCircle, Mail, Phone, Clock, Search, ExternalLink,
  Plus, Send, Paperclip, X, Star, ThumbsUp, ThumbsDown, Filter, Download,
  AlertCircle, CheckCircle, XCircle, MessageSquare, BookOpen, FileText,
  Users, TrendingUp, Activity, Zap, Shield, User, Settings, RefreshCw,
  Eye, Tag, Calendar, Info, ChevronRight, ChevronDown, Video, Inbox,
  Archive, CheckCircle2, Circle, Clock3, AlertTriangle, Server, Wrench,
  GitBranch, Package, ShoppingCart, TrendingDown, BarChart3, PieChart,
  Target, Timer, Bell, Edit, Trash2, Save, FileCheck, Layers, Database,
  Monitor, Smartphone, Printer, HardDrive, Cpu, Network, CloudIcon
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  channel: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  assigned_agent_id: string | null;
  category: {
    name: string;
    icon: string;
  } | null;
  agent: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

interface SLAPolicy {
  id: string;
  policy_name: string;
  priority: string;
  response_time_minutes: number;
  resolution_time_minutes: number;
  is_active: boolean;
}

interface Incident {
  id: string;
  incident_number: string;
  ticket_id: string;
  severity: string;
  impact: string;
  urgency: string;
  affected_services: string[];
  incident_status: string;
  detected_at: string;
}

interface Problem {
  id: string;
  problem_number: string;
  title: string;
  description: string;
  problem_status: string;
  priority: string;
  related_incident_count: number;
  identified_at: string;
}

interface Change {
  id: string;
  change_number: string;
  title: string;
  description: string;
  change_type: string;
  risk_level: string;
  change_status: string;
  approval_status: string;
  scheduled_start: string;
  scheduled_end: string;
}

interface Asset {
  id: string;
  asset_tag: string;
  asset_name: string;
  asset_type: string;
  manufacturer: string;
  model: string;
  asset_status: string;
  location: string;
  purchase_date: string;
  warranty_expiry: string;
}

interface ServiceCatalogItem {
  id: string;
  service_name: string;
  service_code: string;
  description: string;
  service_category: string;
  approval_required: boolean;
  estimated_fulfillment_time_hours: number;
  is_active: boolean;
  icon: string;
}

export default function Support() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'incidents' | 'problems' | 'changes' | 'assets' | 'catalog' | 'sla' | 'reports'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // ITSM
  const [slaPolices, setSlaPolices] = useState<SLAPolicy[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [serviceCatalog, setServiceCatalog] = useState<ServiceCatalogItem[]>([]);

  // Modals
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [showNewProblemModal, setShowNewProblemModal] = useState(false);
  const [showNewChangeModal, setShowNewChangeModal] = useState(false);
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [showSLAModal, setShowSLAModal] = useState(false);

  // Forms
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category_id: ''
  });

  const [newIncident, setNewIncident] = useState({
    severity: 'medium',
    impact: 'medium',
    urgency: 'medium',
    affected_services: '',
    description: ''
  });

  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  const [newChange, setNewChange] = useState({
    title: '',
    description: '',
    change_type: 'standard',
    risk_level: 'low',
    impact: 'low',
    scheduled_start: '',
    scheduled_end: ''
  });

  const [newAsset, setNewAsset] = useState({
    asset_tag: '',
    asset_name: '',
    asset_type: 'laptop',
    manufacturer: '',
    model: '',
    location: '',
    purchase_date: ''
  });

  const [newSLA, setNewSLA] = useState({
    policy_name: '',
    priority: 'medium',
    response_time_minutes: 240,
    resolution_time_minutes: 2880
  });

  const [stats, setStats] = useState({
    openTickets: 0,
    criticalIncidents: 0,
    pendingChanges: 0,
    avgResolutionTime: 0,
    slaCompliance: 0,
    totalAssets: 0
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadTickets(),
        loadIncidents(),
        loadProblems(),
        loadChanges(),
        loadAssets(),
        loadServiceCatalog(),
        loadSLAPolicies(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading support data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTickets = async () => {
    const { data } = await db
      .from('support_tickets')
      .select(`
        *,
        category:support_categories(name, icon),
        agent:support_agents(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (data) setTickets(data);
  };

  const loadIncidents = async () => {
    const { data } = await db
      .from('itsm_incidents')
      .select('*')
      .order('detected_at', { ascending: false });

    if (data) setIncidents(data);
  };

  const loadProblems = async () => {
    const { data } = await db
      .from('itsm_problems')
      .select('*')
      .order('identified_at', { ascending: false });

    if (data) setProblems(data);
  };

  const loadChanges = async () => {
    const { data } = await db
      .from('itsm_changes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setChanges(data);
  };

  const loadAssets = async () => {
    const { data } = await db
      .from('itsm_assets')
      .select('*')
      .order('asset_name');

    if (data) setAssets(data);
  };

  const loadServiceCatalog = async () => {
    const { data } = await db
      .from('itsm_service_catalog')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (data) setServiceCatalog(data);
  };

  const loadSLAPolicies = async () => {
    const { data } = await db
      .from('itsm_sla_policies')
      .select('*')
      .eq('is_active', true)
      .order('priority');

    if (data) setSlaPolices(data);
  };

  const loadStats = async () => {
    const { data: ticketData } = await db
      .from('support_tickets')
      .select('status')
      .in('status', ['open', 'assigned', 'in_progress']);

    const { data: incidentData } = await db
      .from('itsm_incidents')
      .select('severity')
      .eq('severity', 'critical')
      .in('incident_status', ['new', 'investigating', 'in_progress']);

    const { data: changeData } = await db
      .from('itsm_changes')
      .select('approval_status')
      .eq('approval_status', 'pending');

    const { data: assetData } = await db
      .from('itsm_assets')
      .select('id');

    setStats({
      openTickets: ticketData?.length || 0,
      criticalIncidents: incidentData?.length || 0,
      pendingChanges: changeData?.length || 0,
      avgResolutionTime: 245,
      slaCompliance: 94.5,
      totalAssets: assetData?.length || 0
    });
  };

  const handleCreateIncident = async () => {
    const { data: { user: currentUser } } = await db.auth.getUser();
    if (!currentUser) return;

    const { data: tenantUser } = await db
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', currentUser.id)
      .single();

    const incidentNumber = `INC-${Date.now().toString().slice(-6)}`;

    const { error } = await db
      .from('itsm_incidents')
      .insert({
        tenant_id: tenantUser?.tenant_id || null,
        incident_number: incidentNumber,
        severity: newIncident.severity,
        impact: newIncident.impact,
        urgency: newIncident.urgency,
        affected_services: newIncident.affected_services.split(',').map(s => s.trim()),
        incident_status: 'new',
        created_by: currentUser.id
      });

    if (!error) {
      setShowNewIncidentModal(false);
      setNewIncident({ severity: 'medium', impact: 'medium', urgency: 'medium', affected_services: '', description: '' });
      loadIncidents();
      loadStats();
    }
  };

  const handleCreateProblem = async () => {
    const { data: { user: currentUser } } = await db.auth.getUser();
    if (!currentUser) return;

    const { data: tenantUser } = await db
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', currentUser.id)
      .single();

    const problemNumber = `PRB-${Date.now().toString().slice(-6)}`;

    const { error } = await db
      .from('itsm_problems')
      .insert({
        tenant_id: tenantUser?.tenant_id || null,
        problem_number: problemNumber,
        title: newProblem.title,
        description: newProblem.description,
        category: newProblem.category,
        priority: newProblem.priority,
        problem_status: 'identified',
        created_by: currentUser.id
      });

    if (!error) {
      setShowNewProblemModal(false);
      setNewProblem({ title: '', description: '', category: '', priority: 'medium' });
      loadProblems();
    }
  };

  const handleCreateChange = async () => {
    const { data: { user: currentUser } } = await db.auth.getUser();
    if (!currentUser) return;

    const { data: tenantUser } = await db
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', currentUser.id)
      .single();

    const changeNumber = `CHG-${Date.now().toString().slice(-6)}`;

    const { error } = await db
      .from('itsm_changes')
      .insert({
        tenant_id: tenantUser?.tenant_id || null,
        change_number: changeNumber,
        title: newChange.title,
        description: newChange.description,
        change_type: newChange.change_type,
        risk_level: newChange.risk_level,
        impact: newChange.impact,
        change_status: 'draft',
        approval_status: 'pending',
        scheduled_start: newChange.scheduled_start || null,
        scheduled_end: newChange.scheduled_end || null,
        requested_by: currentUser.id
      });

    if (!error) {
      setShowNewChangeModal(false);
      setNewChange({ title: '', description: '', change_type: 'standard', risk_level: 'low', impact: 'low', scheduled_start: '', scheduled_end: '' });
      loadChanges();
      loadStats();
    }
  };

  const handleCreateAsset = async () => {
    const { data: tenantUser } = await db
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user?.id)
      .single();

    const { error } = await db
      .from('itsm_assets')
      .insert({
        tenant_id: tenantUser?.tenant_id || null,
        asset_tag: newAsset.asset_tag,
        asset_name: newAsset.asset_name,
        asset_type: newAsset.asset_type,
        manufacturer: newAsset.manufacturer,
        model: newAsset.model,
        asset_status: 'in_stock',
        location: newAsset.location,
        purchase_date: newAsset.purchase_date || null
      });

    if (!error) {
      setShowNewAssetModal(false);
      setNewAsset({ asset_tag: '', asset_name: '', asset_type: 'laptop', manufacturer: '', model: '', location: '', purchase_date: '' });
      loadAssets();
      loadStats();
    }
  };

  const handleCreateSLA = async () => {
    const { data: tenantUser } = await db
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user?.id)
      .single();

    const { error } = await db
      .from('itsm_sla_policies')
      .insert({
        tenant_id: tenantUser?.tenant_id || null,
        policy_name: newSLA.policy_name,
        priority: newSLA.priority,
        response_time_minutes: newSLA.response_time_minutes,
        resolution_time_minutes: newSLA.resolution_time_minutes,
        business_hours_only: true,
        is_active: true
      });

    if (!error) {
      setShowSLAModal(false);
      setNewSLA({ policy_name: '', priority: 'medium', response_time_minutes: 240, resolution_time_minutes: 2880 });
      loadSLAPolicies();
    }
  };

  const handleCreateTicket = async () => {
    const { data: { user: currentUser } } = await db.auth.getUser();
    if (!currentUser) return;

    const { data: tenantUser } = await db
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', currentUser.id)
      .single();

    const ticketNumber = `TKT-${Math.floor(Math.random() * 900000 + 100000)}`;

    const { error } = await db
      .from('support_tickets')
      .insert({
        ticket_number: ticketNumber,
        tenant_id: tenantUser?.tenant_id || null,
        user_id: currentUser.id,
        subject: newTicket.subject,
        description: newTicket.description,
        status: 'open',
        priority: newTicket.priority,
        channel: 'web',
        category_id: newTicket.category_id || null
      });

    if (!error) {
      setShowNewTicketModal(false);
      setNewTicket({ subject: '', description: '', priority: 'medium', category_id: '' });
      loadTickets();
      loadStats();
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/30'
    };
    return colors[severity] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/30',
      new: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      investigating: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      in_progress: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
      closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      pending: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getAssetIcon = (type: string) => {
    const icons: Record<string, any> = {
      laptop: Monitor,
      server: Server,
      phone: Smartphone,
      printer: Printer,
      monitor: Monitor,
      switch: Network,
      storage: HardDrive
    };
    return icons[type] || Package;
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#012419]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading ITSM Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#012419] min-h-screen">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">IT Service Management</h1>
            <p className="text-xl text-slate-400">Comprehensive ITSM Platform with SLA Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewIncidentModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
              New Incident
            </button>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Ticket
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#39FF14]/20/20 rounded-lg">
                <Inbox className="w-6 h-6 text-[#39FF14]" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.openTickets}</div>
            </div>
            <div className="text-sm text-slate-400">Open Tickets</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.criticalIncidents}</div>
            </div>
            <div className="text-sm text-slate-400">Critical Incidents</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <GitBranch className="w-6 h-6 text-[#39FF14]" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.pendingChanges}</div>
            </div>
            <div className="text-sm text-slate-400">Pending Changes</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Timer className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.avgResolutionTime}</div>
            </div>
            <div className="text-sm text-slate-400">Avg Resolution (min)</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Target className="w-6 h-6 text-[#39FF14]" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.slaCompliance}%</div>
            </div>
            <div className="text-sm text-slate-400">SLA Compliance</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Package className="w-6 h-6 text-[#39FF14]" />
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalAssets}</div>
            </div>
            <div className="text-sm text-slate-400">Total Assets</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl mb-6">
        <div className="flex gap-2 p-4 overflow-x-auto">
          {[
            { id: 'overview', name: 'Overview', icon: Activity },
            { id: 'tickets', name: 'Tickets', icon: Inbox },
            { id: 'incidents', name: 'Incidents', icon: AlertCircle },
            { id: 'problems', name: 'Problems', icon: Wrench },
            { id: 'changes', name: 'Changes', icon: GitBranch },
            { id: 'assets', name: 'Assets', icon: Package },
            { id: 'catalog', name: 'Service Catalog', icon: ShoppingCart },
            { id: 'sla', name: 'SLA Management', icon: Target },
            { id: 'reports', name: 'Reports', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#39FF14] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Incidents */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Recent Incidents</h3>
                  <button
                    onClick={() => setActiveTab('incidents')}
                    className="text-[#39FF14] hover:text-[#39FF14] text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {incidents.slice(0, 5).map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">{incident.incident_number}</div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(incident.incident_status)}`}>
                            {incident.incident_status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">{formatDate(incident.detected_at)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Changes */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Upcoming Changes</h3>
                  <button
                    onClick={() => setActiveTab('changes')}
                    className="text-[#39FF14] hover:text-[#39FF14] text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {changes.filter(c => c.scheduled_start).slice(0, 5).map((change) => (
                    <div key={change.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">{change.title}</div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(change.risk_level)}`}>
                            {change.risk_level} risk
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(change.approval_status)}`}>
                            {change.approval_status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">{formatDate(change.scheduled_start)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Catalog Preview */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Service Catalog</h3>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-[#39FF14] hover:text-[#39FF14] text-sm"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {serviceCatalog.slice(0, 4).map((service) => (
                  <div key={service.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-[#39FF14] transition-all cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                        <ShoppingCart className="w-5 h-5 text-[#39FF14]" />
                      </div>
                      <div className="font-semibold text-white">{service.service_name}</div>
                    </div>
                    <div className="text-sm text-slate-400 mb-2">{service.service_category}</div>
                    <div className="text-xs text-slate-500">
                      Est. {service.estimated_fulfillment_time_hours}h
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Support Tickets</h3>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Ticket
              </button>
            </div>
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <Inbox className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-2">No tickets found</p>
                  <p className="text-slate-500 text-sm">Create a new ticket to get support</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all cursor-pointer"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageCircle className="w-6 h-6 text-[#39FF14]" />
                          <div>
                            <div className="text-lg font-semibold text-white">{ticket.subject}</div>
                            <div className="text-sm text-slate-400">{ticket.ticket_number} - Created {formatDate(ticket.created_at)}</div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{ticket.description.substring(0, 150)}{ticket.description.length > 150 ? '...' : ''}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getSeverityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {ticket.category?.name || 'General'}
                      </span>
                      {ticket.assigned_agent_id && ticket.agent && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {ticket.agent.full_name}
                        </span>
                      )}
                      {ticket.tags && ticket.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                          {ticket.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-900 rounded text-xs">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Incident Management</h3>
              <button
                onClick={() => setShowNewIncidentModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Incident
              </button>
            </div>
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                        <div>
                          <div className="text-lg font-semibold text-white">{incident.incident_number}</div>
                          <div className="text-sm text-slate-400">Detected {formatDate(incident.detected_at)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(incident.incident_status)}`}>
                        {incident.incident_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span>Impact: {incident.impact}</span>
                    <span>Urgency: {incident.urgency}</span>
                    {incident.affected_services && (
                      <span>Affected: {incident.affected_services.join(', ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Problem Management</h3>
              <button
                onClick={() => setShowNewProblemModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Problem
              </button>
            </div>
            <div className="space-y-3">
              {problems.map((problem) => (
                <div key={problem.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Wrench className="w-6 h-6 text-[#39FF14]" />
                        <div>
                          <div className="text-lg font-semibold text-white">{problem.problem_number}: {problem.title}</div>
                          <div className="text-sm text-slate-400">{problem.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getSeverityColor(problem.priority)}`}>
                        {problem.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(problem.problem_status)}`}>
                        {problem.problem_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span>Related Incidents: {problem.related_incident_count}</span>
                    <span>Identified: {formatDate(problem.identified_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'changes' && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Change Management</h3>
              <button
                onClick={() => setShowNewChangeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Change
              </button>
            </div>
            <div className="space-y-3">
              {changes.map((change) => (
                <div key={change.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <GitBranch className="w-6 h-6 text-[#39FF14]" />
                        <div>
                          <div className="text-lg font-semibold text-white">{change.change_number}: {change.title}</div>
                          <div className="text-sm text-slate-400">{change.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getSeverityColor(change.risk_level)}`}>
                        {change.risk_level} risk
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(change.approval_status)}`}>
                        {change.approval_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span>Type: {change.change_type}</span>
                    {change.scheduled_start && (
                      <>
                        <span>Scheduled: {formatDate(change.scheduled_start)}</span>
                        <span>to {formatDate(change.scheduled_end)}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">IT Asset Management</h3>
              <button
                onClick={() => setShowNewAssetModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => {
                const AssetIcon = getAssetIcon(asset.asset_type);
                return (
                  <div key={asset.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                        <AssetIcon className="w-8 h-8 text-[#39FF14]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-white mb-1">{asset.asset_name}</div>
                        <div className="text-sm text-slate-400">{asset.asset_tag}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(asset.asset_status)}`}>
                        {asset.asset_status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-slate-400">
                      <div><span className="text-slate-500">Type:</span> {asset.asset_type}</div>
                      <div><span className="text-slate-500">Manufacturer:</span> {asset.manufacturer}</div>
                      <div><span className="text-slate-500">Model:</span> {asset.model}</div>
                      <div><span className="text-slate-500">Location:</span> {asset.location}</div>
                      {asset.warranty_expiry && (
                        <div><span className="text-slate-500">Warranty:</span> {formatDate(asset.warranty_expiry)}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Service Catalog</h3>
              <p className="text-slate-400">Request IT services and support</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCatalog.map((service) => (
                <div key={service.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-[#39FF14] transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-[#39FF14]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-1">{service.service_name}</div>
                      <div className="text-xs text-slate-500">{service.service_code}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 mb-4">{service.description}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{service.service_category}</span>
                    <span className="text-xs text-[#39FF14]">
                      Est. {service.estimated_fulfillment_time_hours}h
                    </span>
                  </div>
                  {service.approval_required && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <span className="text-xs text-yellow-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Approval Required
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sla' && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">SLA Management</h3>
                <p className="text-slate-400">Service Level Agreement policies and tracking</p>
              </div>
              <button
                onClick={() => setShowSLAModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New SLA Policy
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slaPolices.map((sla) => (
                <div key={sla.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                        <Target className="w-6 h-6 text-[#39FF14]" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{sla.policy_name}</div>
                        <div className="text-sm text-slate-400">Priority: {sla.priority}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${sla.is_active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                      {sla.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-[#39FF14]" />
                        <span className="text-sm text-slate-400">Response Time</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {sla.response_time_minutes < 60
                          ? `${sla.response_time_minutes} min`
                          : `${(sla.response_time_minutes / 60).toFixed(1)} hr`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-slate-400">Resolution Time</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {sla.resolution_time_minutes < 60
                          ? `${sla.resolution_time_minutes} min`
                          : `${(sla.resolution_time_minutes / 60).toFixed(1)} hr`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">ITSM Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Average First Response Time</div>
                    <div className="text-2xl font-bold text-white">2.4 hours</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Average Resolution Time</div>
                    <div className="text-2xl font-bold text-white">{stats.avgResolutionTime} min</div>
                  </div>
                  <Clock className="w-8 h-8 text-[#39FF14]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">SLA Compliance Rate</div>
                    <div className="text-2xl font-bold text-white">{stats.slaCompliance}%</div>
                  </div>
                  <Target className="w-8 h-8 text-[#39FF14]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Customer Satisfaction</div>
                    <div className="text-2xl font-bold text-white">4.6/5.0</div>
                  </div>
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Change Success Rate</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Successful Changes</div>
                    <div className="text-2xl font-bold text-green-400">127</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Failed Changes</div>
                    <div className="text-2xl font-bold text-red-400">8</div>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Success Rate</div>
                    <div className="text-2xl font-bold text-white">94.1%</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewIncidentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Incident</h2>
              <button
                onClick={() => setShowNewIncidentModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Severity</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Impact</label>
                  <select
                    value={newIncident.impact}
                    onChange={(e) => setNewIncident({ ...newIncident, impact: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Urgency</label>
                  <select
                    value={newIncident.urgency}
                    onChange={(e) => setNewIncident({ ...newIncident, urgency: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Affected Services (comma separated)</label>
                <input
                  type="text"
                  value={newIncident.affected_services}
                  onChange={(e) => setNewIncident({ ...newIncident, affected_services: e.target.value })}
                  placeholder="e.g., Email Service, Database"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  placeholder="Describe the incident..."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateIncident}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Create Incident
                </button>
                <button
                  onClick={() => setShowNewIncidentModal(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewProblemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Problem</h2>
              <button
                onClick={() => setShowNewProblemModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                  placeholder="Problem title"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <input
                    type="text"
                    value={newProblem.category}
                    onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
                    placeholder="e.g., Network, Hardware"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select
                    value={newProblem.priority}
                    onChange={(e) => setNewProblem({ ...newProblem, priority: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newProblem.description}
                  onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                  placeholder="Describe the problem and root cause analysis..."
                  rows={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateProblem}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Create Problem
                </button>
                <button
                  onClick={() => setShowNewProblemModal(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewChangeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Change</h2>
              <button
                onClick={() => setShowNewChangeModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newChange.title}
                  onChange={(e) => setNewChange({ ...newChange, title: e.target.value })}
                  placeholder="Change title"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                  <select
                    value={newChange.change_type}
                    onChange={(e) => setNewChange({ ...newChange, change_type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="normal">Normal</option>
                    <option value="emergency">Emergency</option>
                    <option value="major">Major</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Risk Level</label>
                  <select
                    value={newChange.risk_level}
                    onChange={(e) => setNewChange({ ...newChange, risk_level: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Impact</label>
                  <select
                    value={newChange.impact}
                    onChange={(e) => setNewChange({ ...newChange, impact: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Scheduled Start</label>
                  <input
                    type="datetime-local"
                    value={newChange.scheduled_start}
                    onChange={(e) => setNewChange({ ...newChange, scheduled_start: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Scheduled End</label>
                  <input
                    type="datetime-local"
                    value={newChange.scheduled_end}
                    onChange={(e) => setNewChange({ ...newChange, scheduled_end: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newChange.description}
                  onChange={(e) => setNewChange({ ...newChange, description: e.target.value })}
                  placeholder="Describe the change..."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateChange}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Create Change
                </button>
                <button
                  onClick={() => setShowNewChangeModal(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewAssetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Asset</h2>
              <button
                onClick={() => setShowNewAssetModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Asset Tag</label>
                  <input
                    type="text"
                    value={newAsset.asset_tag}
                    onChange={(e) => setNewAsset({ ...newAsset, asset_tag: e.target.value })}
                    placeholder="e.g., LAPTOP-001"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Asset Name</label>
                  <input
                    type="text"
                    value={newAsset.asset_name}
                    onChange={(e) => setNewAsset({ ...newAsset, asset_name: e.target.value })}
                    placeholder="e.g., Dell Latitude 5520"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Asset Type</label>
                  <select
                    value={newAsset.asset_type}
                    onChange={(e) => setNewAsset({ ...newAsset, asset_type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Desktop</option>
                    <option value="server">Server</option>
                    <option value="phone">Mobile Phone</option>
                    <option value="tablet">Tablet</option>
                    <option value="monitor">Monitor</option>
                    <option value="printer">Printer</option>
                    <option value="switch">Network Switch</option>
                    <option value="router">Router</option>
                    <option value="storage">Storage Device</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturer</label>
                  <input
                    type="text"
                    value={newAsset.manufacturer}
                    onChange={(e) => setNewAsset({ ...newAsset, manufacturer: e.target.value })}
                    placeholder="e.g., Dell, HP, Apple"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Model</label>
                  <input
                    type="text"
                    value={newAsset.model}
                    onChange={(e) => setNewAsset({ ...newAsset, model: e.target.value })}
                    placeholder="Model number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={newAsset.purchase_date}
                    onChange={(e) => setNewAsset({ ...newAsset, purchase_date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <input
                  type="text"
                  value={newAsset.location}
                  onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                  placeholder="e.g., Floor 3 - Marketing"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateAsset}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Add Asset
                </button>
                <button
                  onClick={() => setShowNewAssetModal(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSLAModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create SLA Policy</h2>
              <button
                onClick={() => setShowSLAModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Policy Name</label>
                <input
                  type="text"
                  value={newSLA.policy_name}
                  onChange={(e) => setNewSLA({ ...newSLA, policy_name: e.target.value })}
                  placeholder="e.g., Premium Support SLA"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority Level</label>
                <select
                  value={newSLA.priority}
                  onChange={(e) => setNewSLA({ ...newSLA, priority: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Response Time (minutes)</label>
                  <input
                    type="number"
                    value={newSLA.response_time_minutes}
                    onChange={(e) => setNewSLA({ ...newSLA, response_time_minutes: parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Resolution Time (minutes)</label>
                  <input
                    type="number"
                    value={newSLA.resolution_time_minutes}
                    onChange={(e) => setNewSLA({ ...newSLA, resolution_time_minutes: parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateSLA}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Create Policy
                </button>
                <button
                  onClick={() => setShowSLAModal(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Support Ticket</h2>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={newTicket.category_id}
                    onChange={(e) => setNewTicket({ ...newTicket, category_id: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="">Select category...</option>
                    <option value="6dd4c7d3-7a75-494c-988d-ec849f38e645">Getting Started</option>
                    <option value="8b337fe1-8820-4ab2-bba2-3c8acbb53040">API Integration</option>
                    <option value="2a78d5aa-c7cd-49ef-97ae-e5b12e4be144">Billing & Payments</option>
                    <option value="476848ac-ef42-4757-b4a1-db54e14e6140">Account Management</option>
                    <option value="83f842bc-bbf6-4d12-a06a-3c1f969f5e2d">Technical Issues</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateTicket}
                  disabled={!newTicket.subject || !newTicket.description}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Create Ticket
                </button>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
