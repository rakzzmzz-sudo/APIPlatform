import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Plus, Play, Pause, Trash2, Edit, Search, Filter, Send, BarChart3,
  Calendar, TrendingUp, Target, Copy, Download, RefreshCw, CheckCircle,
  XCircle, AlertCircle, Activity, Camera, Image, Zap, Users, DollarSign,
  Eye, Heart, Share2, MessageCircle, Bookmark, ShoppingBag, X,
  Smartphone, ThumbsUp, Smile,  PieChart, ArrowRight
} from 'lucide-react';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const statuses = ['running', 'paused', 'completed', 'draft'];
  const types = ['Story', 'Post', 'Reel', 'Carousel'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const budget = Math.floor(Math.random() * 5000) + 500;
    
    // Metrics
    const impressions = Math.floor(Math.random() * 50000) + 1000;
    const reach = Math.floor(impressions * 0.8);
    const likes = Math.floor(impressions * 0.1);
    const comments = Math.floor(likes * 0.05);
    const shares = Math.floor(likes * 0.02);
    
    data.push({
      id: `ig_camp_${Math.random().toString(36).substr(2, 9)}`,
      name: `Summer Sale ${type} Campaign ${2024 + i}`,
      description: `Promoting seasonal products via ${type}`,
      status: status,
      type: type,
      budget: budget,
      spent: status === 'draft' ? 0 : Math.floor(Math.random() * budget),
      impressions: status === 'draft' ? 0 : impressions,
      reach: status === 'draft' ? 0 : reach,
      likes: status === 'draft' ? 0 : likes,
      comments: status === 'draft' ? 0 : comments,
      shares: status === 'draft' ? 0 : shares,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60) * 60 * 1000).toISOString(),
      sentiment_score: Math.random() * 100
    });
  }
  return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export default function InstagramCampaigns() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'configuration'>('overview');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  
  // Advanced Features State
  const [sentimentData, setSentimentData] = useState({ positive: 65, neutral: 25, negative: 10 });
  const [abTestRunning, setAbTestRunning] = useState(false);

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
    shoppingEnabled: false,
    carouselPosts: true,
    guidesEnabled: false,
    influencerCollaboration: false,
    brandedContentAds: false
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
              impressions: c.impressions + Math.floor(Math.random() * 50),
              likes: c.likes + Math.floor(Math.random() * 10),
              comments: c.comments + (Math.random() > 0.7 ? 1 : 0)
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
      totalImpressions: campaigns.reduce((acc, c) => acc + c.impressions, 0),
      totalLikes: campaigns.reduce((acc, c) => acc + c.likes, 0),
      totalComments: campaigns.reduce((acc, c) => acc + c.comments, 0),
      activeCampaigns: campaigns.filter(c => c.status === 'running').length,
      avgEngagement: campaigns.length ? (campaigns.reduce((acc, c) => acc + c.likes + c.comments, 0) / campaigns.reduce((acc, c) => acc + (c.impressions || 1), 0) * 100).toFixed(2) : '0.00'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'completed': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'failed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Sample Configuration
  const sampleConfig = {
    "platform": "instagram",
    "api_version": "v18.0",
    "features": ["shopping", "reels", "stories", "direct_messages"],
    "permissions": ["instagram_basic", "instagram_content_publish", "instagram_manage_comments"]
  };

  const sampleCode = `
// Node.js - Publish Instagram Photo
const axios = require('axios');

async function publishPhoto(igUserId, imageUrl, caption) {
  try {
    // 1. Create Media Container
    const containerRes = await axios.post(\`https://graph.facebook.com/v18.0/\${igUserId}/media\`, {
      image_url: imageUrl,
      caption: caption,
      access_token: process.env.IG_ACCESS_TOKEN
    });

    const creationId = containerRes.data.id;

    // 2. Publish Media
    const publishRes = await axios.post(\`https://graph.facebook.com/v18.0/\${igUserId}/media_publish\`, {
      creation_id: creationId,
      access_token: process.env.IG_ACCESS_TOKEN
    });

    console.log('Published ID:', publishRes.data.id);
  } catch (error) {
    console.error('IG Publish Error:', error.response.data);
  }
}
  `;

  return (
    <div className="min-h-screen bg-[#012419] overflow-y-auto">
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

      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Camera className="w-10 h-10 text-[#39FF14]" />
              Instagram
            </h1>
            <p className="text-slate-400">Monitor engagement, manage campaigns, and analyze sentiment.</p>
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
              className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black shadow-lg hover:shadow-[#39FF14]/25"
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/30 transition-all">
             <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <p className="text-[#39FF14]"><Eye /></p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${isLive ? 'bg-green-500/20 text-green-400 animate-pulse' : 'bg-slate-700 text-slate-400'}`}>
                {isLive ? 'LIVE' : 'TOTAL'}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalImpressions.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Total Impressions</div>
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

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
             <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <MessageCircle className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalComments.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Comments Received</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/30 transition-all">
             <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#39FF14]" />
              </div>
              <span className="text-green-400 text-sm font-semibold">{stats.avgEngagement}%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">Engagement Rate</div>
            <div className="text-slate-400 text-sm">Avg per Impression</div>
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
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                    >
                      <option value="all">All Status</option>
                      <option value="running">Running</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
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
                      <th className="text-left p-4 text-slate-400 font-medium">Type</th>
                      <th className="text-right p-4 text-slate-400 font-medium">Impressions</th>
                      <th className="text-right p-4 text-slate-400 font-medium">Likes</th>
                      <th className="text-right p-4 text-slate-400 font-medium">Comments</th>
                      <th className="text-right p-4 text-slate-400 font-medium">Spent</th>
                      <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan={8} className="p-8 text-center text-slate-400">Loading campaigns...</td></tr>
                    ) : campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center">
                          <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400 text-lg mb-2">No Instagram campaigns found</p>
                        </td>
                      </tr>
                    ) : (
                      campaigns.filter(c => filterStatus === 'all' || c.status === filterStatus).map((campaign) => (
                        <tr key={campaign.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                                <Image className="w-5 h-5 text-[#39FF14]" />
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
                          <td className="p-4 text-slate-300">{campaign.type}</td>
                          <td className="p-4 text-right text-white font-mono">{campaign.impressions.toLocaleString()}</td>
                          <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.likes.toLocaleString()}</td>
                          <td className="p-4 text-right text-[#39FF14] font-mono">{campaign.comments.toLocaleString()}</td>
                          <td className="p-4 text-right text-white font-mono">RM {campaign.spent.toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors">
                              <BarChart3 className="w-4 h-4" />
                            </button>
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
                 {/* Sentiment Analysis */}
                 <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                       <Smile className="w-5 h-5 text-[#39FF14]" /> Audience Sentiment
                    </h3>
                    <div className="flex items-center justify-center gap-8 mb-6">
                       <div className="text-center">
                          <div className="text-3xl font-bold text-green-400">{sentimentData.positive}%</div>
                          <div className="text-sm text-slate-400">Positive</div>
                       </div>
                       <div className="text-center">
                          <div className="text-3xl font-bold text-slate-300">{sentimentData.neutral}%</div>
                          <div className="text-sm text-slate-400">Neutral</div>
                       </div>
                       <div className="text-center">
                          <div className="text-3xl font-bold text-slate-400">{sentimentData.negative}%</div>
                          <div className="text-sm text-slate-400">Negative</div>
                       </div>
                    </div>
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden flex">
                       <div className="h-full bg-green-500" style={{ width: `${sentimentData.positive}%` }}></div>
                       <div className="h-full bg-slate-400" style={{ width: `${sentimentData.neutral}%` }}></div>
                       <div className="h-full bg-slate-500" style={{ width: `${sentimentData.negative}%` }}></div>
                    </div>
                    <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                       <p className="text-sm text-slate-300 italic">"Love the new summer collection! 😍 Can't wait to buy."</p>
                       <div className="flex justify-between mt-2 text-xs">
                          <span className="text-slate-500">Just now</span>
                          <span className="text-green-400 font-bold">Positive (0.98)</span>
                       </div>
                    </div>
                 </div>

                 {/* A/B Testing */}
                 <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                       <PieChart className="w-5 h-5 text-[#39FF14]" /> A/B Testing Simulator
                    </h3>
                    <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                          <div>
                             <h4 className="text-white font-medium">Variant A (Carousel)</h4>
                             <p className="text-sm text-slate-400">CTR: <span className="text-white font-bold">2.4%</span></p>
                          </div>
                          <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                             <div className="h-full bg-[#39FF14]" style={{ width: '45%' }}></div>
                          </div>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                          <div>
                             <h4 className="text-white font-medium">Variant B (Reel)</h4>
                             <p className="text-sm text-slate-400">CTR: <span className="text-green-400 font-bold">4.1%</span></p>
                          </div>
                          <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                          </div>
                       </div>
                    </div>
                    <button 
                       onClick={() => setAbTestRunning(!abTestRunning)}
                       className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors ${
                          abTestRunning ? 'bg-[#39FF14]/20 text-[#39FF14] hover:bg-[#39FF14]/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                       }`}
                    >
                       {abTestRunning ? 'Stop Test' : 'Start New A/B Test'}
                    </button>
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

      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Camera className="w-7 h-7 text-[#39FF14]" />
                {selectedCampaign ? 'Edit Campaign' : 'Create Instagram Campaign'}
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
