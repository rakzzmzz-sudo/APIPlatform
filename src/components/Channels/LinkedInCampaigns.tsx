import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Plus, Play, Pause, Trash2, Edit, Search, BarChart3,
  Calendar, TrendingUp, Linkedin, X, Users, Target, Briefcase,
  Share2, MessageCircle, ThumbsUp, Building2, Globe, FileText,
  PieChart, ArrowUpRight, CheckCircle, AlertCircle, Copy, Zap
} from 'lucide-react';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const statuses = ['running', 'paused', 'completed', 'draft'];
  const objectives = ['Brand Awareness', 'Lead Generation', 'Website Visits', 'Job Applications'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const objective = objectives[Math.floor(Math.random() * objectives.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const budget = Math.floor(Math.random() * 10000) + 2000;
    
    // Metrics
    const impressions = Math.floor(Math.random() * 500000) + 10000;
    const clicks = Math.floor(impressions * (Math.random() * 0.03 + 0.01)); // 1-4% CTR
    const leads = objective === 'Lead Generation' ? Math.floor(clicks * 0.15) : 0;
    const spent = status === 'draft' ? 0 : Math.floor(Math.random() * budget);
    
    data.push({
      id: `li_camp_${Math.random().toString(36).substr(2, 9)}`,
      name: `B2B ${industry} ${Math.floor(Math.random() * 4) + 1} Campaign`,
      description: `Targeting decision makers in ${industry}`,
      status: status,
      objective: objective,
      industry: industry,
      budget: budget,
      spent: spent,
      impressions: status === 'draft' ? 0 : impressions,
      clicks: status === 'draft' ? 0 : clicks,
      ctr: status === 'draft' ? 0 : ((clicks / impressions) * 100).toFixed(2),
      leads: leads,
      cpc: (spent / clicks).toFixed(2),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60) * 60 * 1000).toISOString()
    });
  }
  return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export default function LinkedInCampaigns() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'configuration'>('overview');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  
  // Advanced Features State
  const [audienceInsights, setAudienceInsights] = useState([
    { jobFunction: 'Decision Makers', percentage: 45, growth: '+12%' },
    { jobFunction: 'IT Engineering', percentage: 30, growth: '+5%' },
    { jobFunction: 'Business Dev', percentage: 15, growth: '+8%' },
    { jobFunction: 'Operations', percentage: 10, growth: '-2%' }
  ]);

  // Modal & Forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    objective: 'brand_awareness',
    sponsoredContent: false,
    textAds: false,
    messageAds: false,
    dynamicAds: false
  });

  // Load Initial Data
  useEffect(() => {
    // Initial data load
    setCampaigns(generateMockData(20));
    setLoading(false);
  }, []);

  // Live Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        // Update random campaign metrics
        setCampaigns(prev => prev.map(c => {
          if (c.status === 'running') {
            const newImpressions = Math.floor(Math.random() * 50);
            const newClicks = Math.floor(Math.random() * 5);
            return {
              ...c,
              impressions: c.impressions + newImpressions,
              clicks: c.clicks + newClicks,
              spent: c.spent + (Math.random() * 5),
              leads: c.objective === 'Lead Generation' && Math.random() > 0.8 ? c.leads + 1 : c.leads
            };
          }
          return c;
        }));
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived Stats
  const stats = useMemo(() => {
    return {
      totalImpressions: campaigns.reduce((acc, c) => acc + c.impressions, 0),
      totalClicks: campaigns.reduce((acc, c) => acc + c.clicks, 0),
      totalLeads: campaigns.reduce((acc, c) => acc + c.leads, 0),
      totalSpent: campaigns.reduce((acc, c) => acc + c.spent, 0),
      avgCTR: campaigns.length ? (campaigns.reduce((acc, c) => acc + parseFloat(c.ctr || 0), 0) / campaigns.length).toFixed(1) : '0.0'
    };
  }, [campaigns]);

  const handleCreate = () => {
    setLoading(true);

      const newCamp = generateMockData(1)[0];
      newCamp.name = formData.name;
      newCamp.description = formData.description;
      newCamp.budget = parseFloat(formData.budget) || 2000;
      newCamp.status = 'running';
      newCamp.objective = formData.objective === 'brand_awareness' ? 'Brand Awareness' : 'Lead Generation'; // Simplified mapping
      newCamp.created_at = new Date().toISOString();
      
      setCampaigns(prev => [newCamp, ...prev]);
      setNotification({ type: 'success', message: 'Campaign created successfully' });
      setShowCreateModal(false);
      setLoading(false);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesSearch = campaign.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/30';
      case 'draft': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Sample Configuration
  const sampleConfig = {
    "platform": "linkedin",
    "api_version": "v2",
    "features": ["marketing_developer_platform", "ads_management", "lead_sync"],
    "permissions": ["r_ads", "w_ads", "r_organization_social"]
  };

  const sampleCode = `
// Node.js - Create LinkedIn Campaign
const axios = require('axios');

const createCampaign = async () => {
  const accessToken = 'YOUR_ACCESS_TOKEN';
  const accountId = 'urn:li:sponsoredAccount:123456789';

  try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/adCampaignsV2',
      {
        account: accountId,
        name: 'My New B2B Campaign',
        type: 'SPONSORED_UPDATES',
        status: 'ACTIVE',
        dailyBudget: { amount: '50.00', currencyCode: 'USD' },
        costType: 'CPC',
        targetingCriteria: { ... }
      },
      { headers: { Authorization: \`Bearer \${accessToken}\` } }
    );
    console.log('Campaign Created:', response.data);
  } catch (error) {
    console.error('Error creating campaign:', error.response.data);
  }
};

createCampaign();
  `;

  return (
    <div className="min-h-screen bg-[#012419] p-8 overflow-y-auto">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border ${
          notification.type === 'success'
            ? 'bg-green-500/20 border-green-500/50 text-green-400'
            : 'bg-red-500/20 border-red-500/50 text-red-400'
        } flex items-center gap-3 animate-slide-in`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Linkedin className="w-10 h-10 text-[#39FF14]" />
              LinkedIn Ads
            </h1>
            <p className="text-slate-400">B2B marketing and professional targeting</p>
          </div>
          <div className="flex gap-3">
             <button
               onClick={() => setIsLive(!isLive)}
               className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border ${
                 isLive 
                   ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/20' 
                   : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
               }`}
             >
               <Zap className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
               {isLive ? 'Stop Live Updates' : 'Start Live Updates'}
             </button>
             <button
               onClick={() => { setSelectedCampaign(null); setShowCreateModal(true); }}
               className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-[#39FF14]/25"
             >
               <Plus className="w-5 h-5" />
               New Campaign
             </button>
          </div>
       </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-slate-800">
           {[
            { id: 'overview', label: 'Overview' },
            { id: 'insights', label: 'Audience Insights' },
            { id: 'configuration', label: 'Configuration' }
          ].map(tab => (
             <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-[#39FF14] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#39FF14]/20'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6 hover:border-[#39FF14]/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Briefcase className="w-6 h-6 text-[#39FF14]" />
              </div>
              <TrendingUp className={`w-5 h-5 text-[#39FF14] ${isLive ? 'animate-pulse' : ''}`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{(stats.totalImpressions / 1000).toFixed(1)}k</div>
            <div className="text-slate-400 text-sm">Impressions</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Target className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalClicks.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Clicks</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all">
             <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalLeads.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Total Leads</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20/20 rounded-lg">
                <PieChart className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.avgCTR}%</div>
            <div className="text-slate-400 text-sm">Avg. CTR</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20/20 rounded-lg">
                <Building2 className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">RM {stats.totalSpent.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Total Spent</div>
          </div>
      </div>

      {activeTab === 'overview' && (
      <>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="running">Running</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-400 font-medium">Campaign Name</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Impressions</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Clicks</th>
                  <th className="text-right p-4 text-slate-400 font-medium">CTR</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Leads</th>
                   <th className="text-right p-4 text-slate-400 font-medium">CPC</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Spend</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan={9} className="p-8 text-center text-slate-400">Loading campaigns...</td></tr>
                ) : filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center">
                      <Linkedin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg mb-2">No LinkedIn campaigns found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                            <Briefcase className="w-5 h-5 text-[#39FF14]" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{campaign.name}</div>
                            <div className="text-slate-400 text-sm hidden md:block">{campaign.objective} • {campaign.industry}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-white font-mono">{campaign.impressions.toLocaleString()}</td>
                      <td className="p-4 text-right text-slate-300 font-mono">{campaign.clicks.toLocaleString()}</td>
                      <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.ctr}%</td>
                      <td className="p-4 text-right text-green-400 font-mono">{campaign.leads}</td>
                      <td className="p-4 text-right text-slate-300 font-mono">RM {campaign.cpc}</td>
                      <td className="p-4 text-right text-white font-mono">RM {campaign.spent.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}

      {activeTab === 'insights' && (
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Audience Breakdown */}
               <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <Users className="w-5 h-5 text-[#39FF14]" /> Audience Demographics
                  </h3>
                   <div className="space-y-4">
                     {audienceInsights.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#39FF14]/20/20 flex items-center justify-center text-[#39FF14] font-bold">
                                 {item.percentage}%
                              </div>
                              <div>
                                 <div className="text-white font-medium">{item.jobFunction}</div>
                                 <div className="text-xs text-slate-400">Job Function</div>
                              </div>
                           </div>
                           <div className={`text-sm font-medium ${item.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                              {item.growth}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Industry Benchmarks */}
               <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <BarChart3 className="w-5 h-5 text-[#39FF14]" /> Global Benchmarks
                  </h3>
                  <div className="p-6 bg-slate-900 rounded-lg border border-slate-800 mb-6">
                     <div className="text-center">
                        <p className="text-slate-400 mb-2">Avg. Cost Per Lead (Technology)</p>
                        <div className="text-4xl font-bold text-white mb-4">RM 45.20</div>
                        <div className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                           You are performing 15% better
                        </div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Average CTR</span>
                        <span className="text-white">0.4% - 0.9%</span>
                     </div>
                     <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-[#39FF14]/20 h-2 rounded-full" style={{ width: '65%' }}></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'configuration' && (
         <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">Sample Configuration</h3>
               <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-sm text-[#39FF14] overflow-x-auto">
                  <pre>{JSON.stringify(sampleConfig, null, 2)}</pre>
               </div>
               <button className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <Copy className="w-4 h-4" /> Copy Configuration
               </button>
             </div>

             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">Integration Example</h3>
               <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-sm text-green-300 overflow-x-auto">
                  <pre>{sampleCode.trim()}</pre>
               </div>
               <button className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <Copy className="w-4 h-4" /> Copy Code
               </button>
             </div>
          </div>
         </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Linkedin className="w-7 h-7 text-[#39FF14]" />
                {selectedCampaign ? 'Edit Campaign' : 'Create LinkedIn Campaign'}
              </h3>
              <button
                onClick={() => { setShowCreateModal(false); setSelectedCampaign(null); }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter campaign name"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter campaign description"
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Total Budget (RM)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Objective</label>
                <select
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                >
                  <option value="brand_awareness">Brand Awareness</option>
                  <option value="website_visits">Website Visits</option>
                  <option value="engagement">Engagement</option>
                  <option value="lead_generation">Lead Generation</option>
                  <option value="website_conversions">Website Conversions</option>
                  <option value="job_applicants">Job Applicants</option>
                </select>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">LinkedIn Ad Types</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sponsoredContent}
                      onChange={(e) => setFormData({ ...formData, sponsoredContent: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Sponsored Content</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.textAds}
                      onChange={(e) => setFormData({ ...formData, textAds: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Text Ads</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.messageAds}
                      onChange={(e) => setFormData({ ...formData, messageAds: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Message Ads (InMail)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dynamicAds}
                      onChange={(e) => setFormData({ ...formData, dynamicAds: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Dynamic Ads</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex gap-3 justify-end sticky bottom-0 bg-slate-800">
              <button
                onClick={() => { setShowCreateModal(false); setSelectedCampaign(null); }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black rounded-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {selectedCampaign ? 'Update Campaign' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
