import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Plus, Play, Pause, Trash2, Edit, Search, Filter, Send, BarChart3,
  Calendar, TrendingUp, Target, Copy, Download, RefreshCw, CheckCircle,
  XCircle, AlertCircle, Activity, Music, Film, Zap, Users, DollarSign,
  Eye, Heart, Share2, MessageCircle, Bookmark, Video, X, Hash, Sparkles
} from 'lucide-react';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const statuses = ['running', 'paused', 'completed', 'draft'];
  const videoFormats = ['Short (15s)', 'Medium (60s)', 'Long (3m)', 'Live'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const format = videoFormats[Math.floor(Math.random() * videoFormats.length)];
    const budget = Math.floor(Math.random() * 5000) + 500;
    
    // Metrics
    const views = Math.floor(Math.random() * 500000) + 10000;
    const likes = Math.floor(views * 0.15);
    const shares = Math.floor(views * 0.05);
    const comments = Math.floor(views * 0.02);
    
    data.push({
      id: `tt_camp_${Math.random().toString(36).substr(2, 9)}`,
      name: `TikTok Trend ${Math.floor(Math.random() * 10) + 1} Campaign`,
      description: `Viral campaign leveraging top hashtags`,
      status: status,
      videoFormat: format,
      budget: budget,
      spent: status === 'draft' ? 0 : Math.floor(Math.random() * budget),
      views: status === 'draft' ? 0 : views,
      likes: status === 'draft' ? 0 : likes,
      shares: status === 'draft' ? 0 : shares,
      comments: status === 'draft' ? 0 : comments,
      engagementRate: status === 'draft' ? 0 : ((likes + shares + comments) / views * 100).toFixed(2),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60) * 60 * 1000).toISOString()
    });
  }
  return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export default function TikTokCampaigns() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'configuration'>('overview');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  
  // Advanced Features State
  const [trendingHashtags, setTrendingHashtags] = useState([
    { tag: '#fyp', views: '12.5B', growth: '+15%' },
    { tag: '#viral', views: '8.2B', growth: '+10%' },
    { tag: '#tiktokmademebuyit', views: '5.1B', growth: '+25%' },
    { tag: '#dance', views: '4.8B', growth: '+5%' }
  ]);

  // Modal & Forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    videoFormat: 'short',
    duetEnabled: false,
    stitchEnabled: false,
    shopEnabled: false,
    creatorMarketplace: false,
    sparkAdsEnabled: false
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
            const newViews = Math.floor(Math.random() * 500);
            return {
              ...c,
              views: c.views + newViews,
              likes: c.likes + Math.floor(newViews * 0.15),
              shares: c.shares + Math.floor(newViews * 0.05),
              spent: c.spent + Math.floor(Math.random() * 5)
            };
          }
          return c;
        }));
        
        // Update Trending Hashtags randomly
        if (Math.random() > 0.7) {
           setTrendingHashtags(prev => prev.map(h => ({
              ...h,
              views: (parseFloat(h.views) + 0.1).toFixed(1) + 'B'
           })));
        }

      }, 1500); // Faster updates for TikTok "viral" feel
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived Stats
  const stats = useMemo(() => {
    return {
      totalViews: campaigns.reduce((acc, c) => acc + c.views, 0),
      totalLikes: campaigns.reduce((acc, c) => acc + c.likes, 0),
      totalShares: campaigns.reduce((acc, c) => acc + c.shares, 0),
      totalSpent: campaigns.reduce((acc, c) => acc + c.spent, 0),
      avgEngagement: campaigns.length ? (campaigns.reduce((acc, c) => acc + parseFloat(c.engagementRate || 0), 0) / campaigns.length).toFixed(2) : '0.00'
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
    "platform": "tiktok",
    "api_version": "v2",
    "features": ["ads_management", "video_upload", "analytics"],
    "permissions": ["ads.read", "ads.management", "video.publish"]
  };

  const sampleCode = `
// Node.js - Upload Video to TikTok
const fs = require('fs');
const request = require('request');

const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';
const OPEN_ID = 'YOUR_OPEN_ID';

const uploadVideo = (filePath) => {
  const url = \`https://open-api.tiktok.com/share/video/upload/?open_id=\${OPEN_ID}&access_token=\${ACCESS_TOKEN}\`;
  
  const formData = {
    video: fs.createReadStream(filePath)
  };

  request.post({url, formData}, (err, httpResponse, body) => {
    if (err) {
      return console.error('Upload failed:', err);
    }
    console.log('Upload successful! Server responded with:', body);
  });
};

uploadVideo('./cool_video.mp4');
  `;

  return (
    <div className="min-h-screen bg-[#012419] p-8 overflow-y-auto">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border ${
          notification.type === 'success'
            ? 'bg-green-500/20 border-green-500/50 text-green-400'
            : 'bg-slate-500/20 border-slate-500/50 text-slate-400'
        } flex items-center gap-3 animate-slide-in`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Music className="w-10 h-10 text-[#39FF14]" />
              TikTok
            </h1>
            <p className="text-slate-400">Manage and monitor your TikTok campaigns</p>
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
               <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
               {isLive ? 'Stop Live Feed' : 'Start Live Feed'}
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
            { id: 'advanced', label: 'Trending & AI Analysis' },
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
              <Activity className={`w-5 h-5 text-[#39FF14] ${isLive ? 'animate-pulse' : ''}`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalViews.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Total Views</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Heart className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Total Likes</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all">
             <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Share2 className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalShares.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Total Shares</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Zap className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.avgEngagement}%</div>
            <div className="text-slate-400 text-sm">Avg. Engagement</div>
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
                  <th className="text-right p-4 text-slate-400 font-medium">Likes</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Shares</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Eng. Rate</th>
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
                      <Music className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg mb-2">No TikTok campaigns found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                            <Film className="w-5 h-5 text-[#39FF14]" />
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
                      <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.likes.toLocaleString()}</td>
                      <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.shares.toLocaleString()}</td>
                      <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.engagementRate}%</td>
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
               {/* Trending Hashtags */}
               <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <Hash className="w-5 h-5 text-[#39FF14]" /> Trending Hashtags
                  </h3>
                  <div className="space-y-4">
                     {trendingHashtags.map((h, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-[#39FF14]/30 transition-all">
                           <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-white">{h.tag}</span>
                           </div>
                           <div className="text-right">
                              <div className="text-white font-mono font-bold">{h.views}</div>
                              <div className="text-xs text-[#39FF14]">{h.growth} this week</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* AI Content Analysis */}
               <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <Sparkles className="w-5 h-5 text-[#39FF14]" /> AI Content Predictor
                  </h3>
                   <div className="p-6 bg-slate-900 rounded-lg border border-slate-800 text-center mb-6">
                       <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#39FF14] mb-2">
                          High Viral Potential
                       </div>
                       <p className="text-slate-400">Based on your recent drafts, your next campaign has an 85% chance of trending.</p>
                   </div>
                   
                   <div className="space-y-4">
                       <h4 className="text-sm font-semibold text-slate-300">Recommended Actions</h4>
                       <div className="p-3 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg flex gap-3">
                          <CheckCircle className="w-5 h-5 text-[#39FF14] shrink-0" />
                          <span className="text-sm text-slate-300">Use trending music "Night Walker" to boost reach by 2x.</span>
                       </div>
                       <div className="p-3 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg flex gap-3">
                          <CheckCircle className="w-5 h-5 text-[#39FF14] shrink-0" />
                          <span className="text-sm text-slate-300">Keep video duration under 25s for higher retention.</span>
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
                <Music className="w-7 h-7 text-[#39FF14]" />
                {selectedCampaign ? 'Edit Campaign' : 'Create TikTok Campaign'}
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Video Format</label>
                <select
                  value={formData.videoFormat}
                  onChange={(e) => setFormData({ ...formData, videoFormat: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                >
                  <option value="short">Short (15-60 seconds)</option>
                  <option value="long">Long (1-3 minutes)</option>
                  <option value="live">Live Video</option>
                </select>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">TikTok Features</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.duetEnabled}
                      onChange={(e) => setFormData({ ...formData, duetEnabled: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Enable Duet</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.stitchEnabled}
                      onChange={(e) => setFormData({ ...formData, stitchEnabled: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Enable Stitch</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shopEnabled}
                      onChange={(e) => setFormData({ ...formData, shopEnabled: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">TikTok Shop Integration</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.creatorMarketplace}
                      onChange={(e) => setFormData({ ...formData, creatorMarketplace: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Creator Marketplace</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sparkAdsEnabled}
                      onChange={(e) => setFormData({ ...formData, sparkAdsEnabled: e.target.checked })}
                      className="w-5 h-5 bg-slate-900 border-slate-700 rounded text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-300">Spark Ads Enabled</span>
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
