import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Plus, Play, Pause, Trash2, Edit, Search, BarChart3,
  Calendar, TrendingUp, Youtube, X, Eye, Heart, Share2,
  MessageCircle, Users, Clock, Video, Globe, Zap, Settings,
  CheckCircle, AlertCircle, Copy, ThumbsUp, ThumbsDown,
  Target, DollarSign
} from 'lucide-react';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const statuses = ['running', 'paused', 'completed', 'draft'];
  const strategies = ['Long Form', 'Shorts', 'Live Stream', 'Premiere'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const budget = Math.floor(Math.random() * 5000) + 500;
    
    // Metrics
    const views = Math.floor(Math.random() * 1000000) + 5000;
    const likes = Math.floor(views * 0.08);
    const dislikes = Math.floor(views * 0.005);
    const comments = Math.floor(views * 0.01);
    const shares = Math.floor(views * 0.02);
    const subscribersGained = Math.floor(views * 0.005);
    
    data.push({
      id: `yt_camp_${Math.random().toString(36).substr(2, 9)}`,
      name: `Tube Growth ${Math.floor(Math.random() * 20) + 1} Campaign`,
      description: `Targeting tech enthusiasts with ${strategy} content`,
      status: status,
      strategy: strategy,
      budget: budget,
      spent: status === 'draft' ? 0 : Math.floor(Math.random() * budget),
      views: status === 'draft' ? 0 : views,
      likes: status === 'draft' ? 0 : likes,
      dislikes: status === 'draft' ? 0 : dislikes,
      comments: status === 'draft' ? 0 : comments,
      shares: status === 'draft' ? 0 : shares,
      subscribersGained: status === 'draft' ? 0 : subscribersGained,
      ctr: (Math.random() * 10 + 2).toFixed(1), // 2% to 12% CTR
      avgViewDuration: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60) * 60 * 1000).toISOString()
    });
  }
  return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export default function YouTubeCampaigns() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'configuration'>('overview');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  
  // Advanced Features State
  const [keywordAnalysis, setKeywordAnalysis] = useState([
    { keyword: 'tech review', volume: 'High', competition: 'Medium', cpc: '$2.50' },
    { keyword: 'coding tutorial', volume: 'Medium', competition: 'Low', cpc: '$1.20' },
    { keyword: 'unboxing', volume: 'Very High', competition: 'High', cpc: '$3.00' },
    { keyword: 'gadget hacks', volume: 'High', competition: 'Medium', cpc: '$1.80' }
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
    contentStrategy: 'long_form',
    premiereEnabled: false,
    shortsEnabled: true,
    liveStreaming: false,
    monetizationEnabled: false
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
            const newViews = Math.floor(Math.random() * 100);
            return {
              ...c,
              views: c.views + newViews,
              likes: c.likes + Math.floor(newViews * 0.1),
              spent: c.spent + Math.floor(Math.random() * 3),
              subscribersGained: c.subscribersGained + (Math.random() > 0.8 ? 1 : 0)
            };
          }
          return c;
        }));
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived Stats
  const stats = useMemo(() => {
    return {
      totalViews: campaigns.reduce((acc, c) => acc + c.views, 0),
      totalSubscribers: campaigns.reduce((acc, c) => acc + c.subscribersGained, 0),
      totalSpent: campaigns.reduce((acc, c) => acc + c.spent, 0),
      avgCTR: campaigns.length ? (campaigns.reduce((acc, c) => acc + parseFloat(c.ctr || 0), 0) / campaigns.length).toFixed(1) : '0.0',
      totalLikes: campaigns.reduce((acc, c) => acc + c.likes, 0)
    };
  }, [campaigns]);

  const handleCreate = () => {
    setLoading(true);

      const newCamp = generateMockData(1)[0];
      newCamp.name = formData.name;
      newCamp.description = formData.description;
      newCamp.budget = parseFloat(formData.budget) || 1000;
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
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Sample Configuration
  const sampleConfig = {
    "platform": "youtube",
    "api_version": "v3",
    "features": ["analytics", "live_streaming", "content_id"],
    "scopes": ["https://www.googleapis.com/auth/youtube.force-ssl"]
  };

  const sampleCode = `
// Python - Create YouTube Live Broadcast
import google_auth_oauthlib.flow
import googleapiclient.discovery

def create_broadcast():
    youtube = googleapiclient.discovery.build("youtube", "v3", credentials=credentials)
    
    request = youtube.liveBroadcasts().insert(
        part="snippet,status",
        body={
          "snippet": {
            "title": "My New Broadcast",
            "scheduledStartTime": "2024-03-01T00:00:00Z"
          },
          "status": {
            "privacyStatus": "public"
          }
        }
    )
    response = request.execute()
    print(response)

create_broadcast()
  `;

  return (
    <div className="min-h-screen bg-[#012419] p-8 overflow-y-auto">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border ${
          notification.type === 'success'
            ? 'bg-green-500/20 border-green-500/50 text-green-400'
            : 'bg-slate-500/20 border-slate-500/50 text-slate-400'
        } flex items-center gap-3 animate-slide-in`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Youtube className="w-10 h-10 text-[#39FF14]" />
              YouTube Studio
            </h1>
            <p className="text-slate-400">Manage video campaigns and live streams</p>
          </div>
          <div className="flex gap-3">
             <button
               onClick={() => setIsLive(!isLive)}
               className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border ${
                isLive 
                   ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/20' 
                   : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
               } transition-all`}
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
            { id: 'advanced', label: 'SEO & Content Strategist' },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                  <Eye className="w-6 h-6 text-[#39FF14]" />
                </div>
              <TrendingUp className={`w-5 h-5 text-[#39FF14] ${isLive ? 'animate-pulse' : ''}`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{(stats.totalViews / 1000000).toFixed(2)}M</div>
            <div className="text-slate-400 text-sm">Total Views</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Users className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">+{stats.totalSubscribers.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Subs Gained</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
             <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Total Likes</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Target className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.avgCTR}%</div>
            <div className="text-slate-400 text-sm">Avg. CTR</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
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
                  <th className="text-right p-4 text-slate-400 font-medium">Views</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Subscribers</th>
                  <th className="text-right p-4 text-slate-400 font-medium">CTR</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Avg. View Dur.</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Spend</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan={8} className="p-8 text-center text-slate-400">Loading campaigns...</td></tr>
                ) : filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <Youtube className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg mb-2">No YouTube campaigns found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                            <Video className="w-5 h-5 text-[#39FF14]" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{campaign.name}</div>
                            <div className="text-slate-400 text-sm hidden md:block">{campaign.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-white font-mono">{campaign.views.toLocaleString()}</td>
                      <td className="p-4 text-right text-[#39FF14] font-mono">+{campaign.subscribersGained.toLocaleString()}</td>
                      <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.ctr}%</td>
                      <td className="p-4 text-right text-slate-300 font-mono">{campaign.avgViewDuration}</td>
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
               {/* Keyword Analysis */}
               <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <Search className="w-5 h-5 text-[#39FF14]" /> SEO Keyword Analysis
                  </h3>
                  <div className="space-y-4">
                     {keywordAnalysis.map((k, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-[#39FF14]/30 transition-all">
                           <div>
                              <div className="text-lg font-bold text-white mb-1">{k.keyword}</div>
                              <div className="text-xs text-slate-400 flex gap-2">
                                 <span className="text-green-400">Vol: {k.volume}</span>
                                 <span>•</span>
                                 <span className="text-[#39FF14]">Comp: {k.competition}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-white font-mono font-bold">{k.cpc}</div>
                              <div className="text-xs text-slate-500">CPC</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Content Strategy AI */}
               <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <Zap className="w-5 h-5 text-[#39FF14]" /> AI Content Strategist
                  </h3>
                   <div className="p-6 bg-slate-900 rounded-lg border border-slate-800 text-center mb-6">
                       <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#32e012] mb-2">
                          Excellent Score
                       </div>
                       <p className="text-slate-400">Your planned content matches 92% of current viewer interests.</p>
                   </div>
                   
                   <div className="space-y-4">
                       <h4 className="text-sm font-semibold text-slate-300">Optimization Tips</h4>
                       <div className="p-3 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg flex gap-3">
                          <CheckCircle className="w-5 h-5 text-[#39FF14] shrink-0" />
                          <span className="text-sm text-slate-300">Adding chapters to your video descriptions increases retention by 15%.</span>
                       </div>
                       <div className="p-3 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg flex gap-3">
                          <CheckCircle className="w-5 h-5 text-[#39FF14] shrink-0" />
                          <span className="text-sm text-slate-300">Posting Shorts between main uploads can boost subscribers by 20%.</span>
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
                 <Youtube className="w-7 h-7 text-[#39FF14]" />
                {selectedCampaign ? 'Edit Campaign' : 'Create YouTube Campaign'}
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Content Strategy</label>
                <select
                  value={formData.contentStrategy}
                  onChange={(e) => setFormData({ ...formData, contentStrategy: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                >
                  <option value="long_form">Long Form (8+ minutes)</option>
                  <option value="short_form">Short Form (2-8 minutes)</option>
                  <option value="shorts">YouTube Shorts (60 seconds)</option>
                  <option value="mixed">Mixed Strategy</option>
                </select>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">YouTube Features</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.premiereEnabled}
                      onChange={(e) => setFormData({ ...formData, premiereEnabled: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Premiere Videos</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shortsEnabled}
                      onChange={(e) => setFormData({ ...formData, shortsEnabled: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">YouTube Shorts</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.liveStreaming}
                      onChange={(e) => setFormData({ ...formData, liveStreaming: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Live Streaming</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.monetizationEnabled}
                      onChange={(e) => setFormData({ ...formData, monetizationEnabled: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Monetization</span>
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
