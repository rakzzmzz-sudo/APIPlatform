import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Plus, Play, Pause, Trash2, Edit, Search, Filter, BarChart3,
  Calendar, TrendingUp, Facebook, X, Users, Target, Eye,
  Heart, Share2, MessageCircle, ThumbsUp, ShoppingBag, Globe,
  Activity, Zap, MousePointer, Copy, CheckCircle, XCircle,
  DollarSign
} from 'lucide-react';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const statuses = ['running', 'paused', 'completed', 'draft'];
  const objectives = ['Engagement', 'Traffic', 'Leads', 'Sales'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const objective = objectives[Math.floor(Math.random() * objectives.length)];
    const budget = Math.floor(Math.random() * 10000) + 1000;
    
    // Metrics
    const reach = Math.floor(Math.random() * 100000) + 5000;
    const impressions = Math.floor(reach * 1.5);
    const clicks = Math.floor(reach * 0.05);
    const cpc = (Math.random() * 2 + 0.5).toFixed(2);
    
    data.push({
      id: `fb_camp_${Math.random().toString(36).substr(2, 9)}`,
      name: `Q${Math.floor(Math.random() * 4) + 1} ${objective} Campaign`,
      description: `Targeting lookalike audiences for ${objective.toLowerCase()}`,
      status: status,
      objective: objective,
      budget: budget,
      spent: status === 'draft' ? 0 : Math.floor(Math.random() * budget),
      reach: status === 'draft' ? 0 : reach,
      impressions: status === 'draft' ? 0 : impressions,
      clicks: status === 'draft' ? 0 : clicks,
      cpc: status === 'draft' ? 0 : cpc,
      ctr: status === 'draft' ? 0 : (clicks / impressions * 100).toFixed(2),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60) * 60 * 1000).toISOString()
    });
  }
  return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export default function FacebookCampaigns() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'configuration'>('overview');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  
  // Advanced Features State
  const [auctionData, setAuctionData] = useState({ bid: 1.50, winRate: 45, competitors: 12 });

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
    objective: 'engagement',
    boostedPosts: false,
    carouselAds: true,
    messengerAds: false,
    marketplaceAds: false
  });

  // Load Initial Data
  useEffect(() => {
    // Initial data load
    setCampaigns(generateMockData(25));
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
            return {
              ...c,
              impressions: c.impressions + Math.floor(Math.random() * 100),
              clicks: c.clicks + Math.floor(Math.random() * 5),
              spent: c.spent + Math.floor(Math.random() * 10)
            };
          }
          return c;
        }));
        
        // Update Auction Data
        setAuctionData(prev => ({
           bid: prev.bid + (Math.random() * 0.1 - 0.05),
           winRate: Math.min(100, Math.max(0, prev.winRate + (Math.random() * 5 - 2.5))),
           competitors: Math.max(1, prev.competitors + Math.floor(Math.random() * 3 - 1))
        }));

      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived Stats
  const stats = useMemo(() => {
    return {
      totalImpressions: campaigns.reduce((acc, c) => acc + c.impressions, 0),
      totalReach: campaigns.reduce((acc, c) => acc + c.reach, 0),
      totalClicks: campaigns.reduce((acc, c) => acc + c.clicks, 0),
      totalSpent: campaigns.reduce((acc, c) => acc + c.spent, 0),
      ctx: campaigns.length ? (campaigns.reduce((acc, c) => acc + parseFloat(c.ctr || 0), 0) / campaigns.length).toFixed(2) : '0.00',
      activeCampaigns: campaigns.filter(c => c.status === 'running').length
    };
  }, [campaigns]);

  const handleCreate = () => {
    setLoading(true);

      const newCamp = generateMockData(1)[0];
      newCamp.name = formData.name;
      newCamp.description = formData.description;
      newCamp.budget = parseFloat(formData.budget) || 2000;
      newCamp.status = 'running';
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
      case 'paused': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'completed': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'draft': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'scheduled': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Sample Configuration
  const sampleConfig = {
    "platform": "facebook",
    "api_version": "v18.0",
    "features": ["ads_management", "pages_read_engagement", "pages_manage_posts"],
    "permissions": ["business_management", "ads_management", "pages_show_list"]
  };

  const sampleCode = `
// Node.js - Create Facebook Ad Campaign
const bizSdk = require('facebook-nodejs-business-sdk');
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;

const access_token = 'YOUR_ACCESS_TOKEN';
const ad_account_id = 'act_YOUR_AD_ACCOUNT_ID';
const api = bizSdk.FacebookAdsApi.init(access_token);

async function createCampaign(name, objective) {
  const account = new AdAccount(ad_account_id);
  
  try {
    const campaign = await account.createCampaign([], {
      [Campaign.Fields.name]: name,
      [Campaign.Fields.objective]: objective,
      [Campaign.Fields.status]: Campaign.Status.paused,
      [Campaign.Fields.special_ad_categories]: []
    });
    
    console.log('Campaign Created:', campaign.id);
  } catch (error) {
    console.error('Error creating campaign:', error);
  }
}
  `;

  return (
    <div className="min-h-screen bg-[#012419] p-8">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg border ${
          notification.type === 'success'
            ? 'bg-green-500/20 border-green-500/50 text-green-400'
            : 'bg-slate-500/20 border-slate-500/50 text-slate-400'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Facebook className="w-10 h-10 text-[#39FF14]" />
            Facebook
          </h1>
          <p className="text-slate-400">Manage and monitor your Facebook campaigns</p>
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
               <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
               {isLive ? 'Stop Live Feed' : 'Start Live Feed'}
             </button>
             <button
              onClick={() => { setSelectedCampaign(null); setShowCreateModal(true); }}
              className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black rounded-lg transition-all flex items-center gap-2 font-medium"
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
            { id: 'advanced', label: 'Advanced Analytics' },
            { id: 'configuration', label: 'Configuration' }
          ].map(tab => (
             <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-[#39FF14] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#39FF14]'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>


      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#39FF14]/20 rounded-lg">
              <Eye className="w-6 h-6 text-[#39FF14]" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${isLive ? 'bg-green-500/20 text-green-400 animate-pulse' : 'bg-slate-700 text-slate-400'}`}>{isLive ? 'LIVE' : 'TOTAL'}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalImpressions.toLocaleString()}</div>
          <div className="text-slate-400 text-sm">Impressions</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <MousePointer className="w-6 h-6 text-[#39FF14]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{(stats.totalClicks).toLocaleString()}</div>
          <div className="text-slate-400 text-sm">Total Clicks</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#39FF14]/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-[#39FF14]" />
            </div>
            <span className="text-[#39FF14] text-sm font-semibold">LIVE</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.activeCampaigns}</div>
          <div className="text-slate-400 text-sm">Active Campaigns</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#39FF14]/20 rounded-lg">
              <Globe className="w-6 h-6 text-[#39FF14]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{(stats.totalReach / 1000).toFixed(1)}K</div>
          <div className="text-slate-400 text-sm">Reach</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#39FF14]/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#39FF14]" />
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-400 font-medium">Campaign Name</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Objective</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Impressions</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Clicks</th>
                  <th className="text-right p-4 text-slate-400 font-medium">CPC</th>
                  <th className="text-right p-4 text-slate-400 font-medium">CTR</th>
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
                      <Facebook className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg mb-2">No Facebook campaigns found</p>
                    </td>
                  </tr>
                ) : (
                  campaigns.filter(c => filterStatus === 'all' || c.status === filterStatus).map((campaign) => (
                    <tr key={campaign.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                            <Facebook className="w-5 h-5 text-[#39FF14]" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{campaign.name}</div>
                            <div className="text-slate-400 text-sm">{campaign.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{campaign.objective}</td>
                      <td className="p-4 text-right text-white font-mono">{campaign.impressions.toLocaleString()}</td>
                      <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.clicks.toLocaleString()}</td>
                      <td className="p-4 text-right text-slate-300 font-mono">RM {campaign.cpc}</td>
                      <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.ctr}%</td>
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

      {activeTab === 'advanced' && (
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Audience Demographics - Simulated */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                   <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#39FF14]" /> Audience Demographics
                   </h3>
                   <div className="space-y-4">
                      {[{age: '18-24', pct: 15}, {age: '25-34', pct: 45}, {age: '35-44', pct: 25}, {age: '45+', pct: 15}].map(d => (
                         <div key={d.age}>
                            <div className="flex justify-between text-sm mb-1 text-slate-300">
                               <span>Age {d.age}</span>
                               <span>{d.pct}%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                               <div className="bg-[#39FF14]/20 h-full" style={{width: `${d.pct}%`}}></div>
                            </div>
                         </div>
                      ))}
                   </div>
                   <div className="mt-6 pt-6 border-t border-slate-700 flex justify-center gap-8">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-[#39FF14] rounded-full"></div>
                          <span className="text-slate-300">Male (52%)</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-[#39FF14] rounded-full"></div>
                          <span className="text-slate-300">Female (48%)</span>
                       </div>
                   </div>
                </div>

                {/* Real-time Ad Auction */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                   <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#39FF14]" /> Real-time Ad Auction
                   </h3>
                   <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
                         <div className="text-2xl font-bold text-[#39FF14]">RM {auctionData.bid.toFixed(2)}</div>
                         <div className="text-xs text-slate-400">Current Bid</div>
                      </div>
                      <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
                         <div className="text-2xl font-bold text-[#39FF14]">{Math.floor(auctionData.winRate)}%</div>
                         <div className="text-xs text-slate-400">Win Rate</div>
                      </div>
                      <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
                         <div className="text-2xl font-bold text-slate-400">{auctionData.competitors}</div>
                         <div className="text-xs text-slate-400">Competitors</div>
                      </div>
                   </div>
                   <div className="relative h-32 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex items-end">
                      {/* Simulated Live Chart Bars */}
                      {Array.from({length: 20}).map((_, i) => (
                         <div 
                           key={i} 
                           className="flex-1 bg-[#39FF14]/10 hover:bg-[#39FF14]/30 transition-all border-t border-[#39FF14]/30"
                           style={{height: `${30 + Math.random() * 60}%`}}
                         ></div>
                      ))}
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
               <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-sm text-[#39FF14] overflow-x-auto">
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
                <Facebook className="w-7 h-7 text-[#39FF14]" />
                {selectedCampaign ? 'Edit Campaign' : 'Create Facebook Campaign'}
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Lifetime Budget (RM)</label>
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
                  <option value="engagement">Engagement</option>
                  <option value="brand_awareness">Brand Awareness</option>
                  <option value="reach">Reach</option>
                  <option value="traffic">Traffic</option>
                  <option value="conversions">Conversions</option>
                  <option value="lead_generation">Lead Generation</option>
                </select>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Facebook Features</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.boostedPosts}
                      onChange={(e) => setFormData({ ...formData, boostedPosts: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Boosted Posts</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.carouselAds}
                      onChange={(e) => setFormData({ ...formData, carouselAds: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Carousel Ads</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.messengerAds}
                      onChange={(e) => setFormData({ ...formData, messengerAds: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Messenger Ads</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketplaceAds}
                      onChange={(e) => setFormData({ ...formData, marketplaceAds: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Marketplace Ads</span>
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
