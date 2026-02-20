import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare, Send, Upload, Users, Calendar, Save, X,
  CheckCircle, AlertCircle, Clock, FileText, Smartphone, Settings,
  Pause, Play, Edit, Trash2, Filter, ChevronDown, ChevronUp, Plus,
  BarChart3, Zap, Activity, Globe, Copy, Eye, Music, Image as ImageIcon, Video, AppWindow
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock Data Generator
const generateMockCampaigns = (count: number) => {
  const data = [];
  const statuses = ['completed', 'in_progress', 'scheduled', 'draft', 'failed'];
  const types = ['text', 'image', 'video', 'news', 'miniprogram'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const total = Math.floor(Math.random() * 5000) + 500;
    const projectTime = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60) * 60 * 1000);

    // Metrics based on status
    let delivered = 0;
    let read = 0;
    let failed = 0;
    
    if (status === 'completed') {
      delivered = Math.floor(total * (0.9 + Math.random() * 0.08));
      read = Math.floor(delivered * (0.6 + Math.random() * 0.2));
      failed = total - delivered;
    } else if (status === 'in_progress') {
      delivered = Math.floor(total * (0.3 + Math.random() * 0.2));
      read = Math.floor(delivered * (0.4 + Math.random() * 0.1));
      failed = Math.floor(total * 0.02);
    }

    data.push({
      id: `wx_${Math.random().toString(36).substr(2, 9)}`,
      campaign_name: `${type === 'miniprogram' ? 'Mini Program' : type.charAt(0).toUpperCase() + type.slice(1)} Push ${projectTime.toLocaleDateString()}`,
      status: status,
      message_type: type,
      total_recipients: total,
      valid_numbers: total,
      delivered: delivered,
      read: read,
      failed: failed,
      created_at: projectTime.toISOString(),
      scheduled_at: status === 'scheduled' ? new Date(Date.now() + 86400000).toISOString() : null
    });
  }
  return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const mockTemplates = [
  { id: 'wx_1', name: 'Order Confirmation', body_content: 'Your order #12345 has been confirmed.', category: 'Transactional' },
  { id: 'wx_2', name: 'New Arrival Alert', body_content: 'Check out the new collection now!', category: 'Marketing' },
  { id: 'wx_3', name: 'Membership Update', body_content: 'Your membership tier has been upgraded.', category: 'Account' }
];

export default function BulkWeChat() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'compose' | 'advanced' | 'configuration'>('overview');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Compose State
  const [campaignName, setCampaignName] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [message, setMessage] = useState('');
  const [pastedIds, setPastedIds] = useState('');

  // Advanced Features State
  const [deliverySpeed, setDeliverySpeed] = useState(20); // msgs/sec
  const [appId, setAppId] = useState('');

  useEffect(() => {
    // Initial data load
    setCampaigns(generateMockCampaigns(15));
    setLoading(false);
  }, []);

  // Live Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setCampaigns(prev => prev.map(c => {
          if (c.status === 'in_progress') {
            const newDelivered = Math.floor(Math.random() * 8);
            const newRead = Math.floor(Math.random() * 5);
            return {
              ...c,
              delivered: Math.min(c.total_recipients, c.delivered + newDelivered),
              read: Math.min(c.total_recipients, c.read + newRead)
            };
          }
          return c;
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const stats = useMemo(() => {
    return {
      totalSent: campaigns.reduce((acc, c) => acc + c.total_recipients, 0),
      delivered: campaigns.reduce((acc, c) => acc + c.delivered, 0),
      read: campaigns.reduce((acc, c) => acc + c.read, 0),
      failed: campaigns.reduce((acc, c) => acc + c.failed, 0),
      readRate: campaigns.length ? (campaigns.reduce((acc, c) => c.delivered > 0 ? acc + (c.read / c.delivered) : acc, 0) / campaigns.length * 100).toFixed(1) : '0.0'
    };
  }, [campaigns]);

  const handleSend = () => {
    setLoading(true);

      const newCamp = {
        id: `wx_${Math.random().toString(36).substr(2, 9)}`,
        campaign_name: campaignName || 'New Campaign',
        status: 'in_progress',
        message_type: messageType,
        total_recipients: pastedIds.split('\n').length || 100,
        valid_numbers: pastedIds.split('\n').length || 100,
        delivered: 0,
        read: 0,
        failed: 0,
        created_at: new Date().toISOString()
      };
      setCampaigns(prev => [newCamp, ...prev]);
      setNotification({ type: 'success', message: 'Campaign broadcast started' });
      setCampaignName('');
      setMessage('');
      setPastedIds('');
      setActiveTab('overview');
      setLoading(false);
      setCampaigns(prev => [newCamp, ...prev]);
      setNotification({ type: 'success', message: 'Campaign broadcast started' });
      setCampaignName('');
      setMessage('');
      setPastedIds('');
      setActiveTab('overview');
      setLoading(false);
  };

  // Sample Config
  const sampleConfig = {
    "app_id": "wx888...",
    "app_secret": "e1a...", 
    "token": "my_wechat_token",
    "encoding_aes_key": "M5t..."
  };

  const sampleCode = `
// Node.js - Send WeChat Message (Official Account)
const axios = require('axios');

async function sendWeChatMessage() {
  const token = 'YOUR_ACCESS_TOKEN';
  const url = \`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=\${token}\`;

  await axios.post(url, {
    touser: 'OPENID',
    msgtype: 'text',
    text: {
      content: 'Hello from WeChat Official Account!'
    }
  });
  
  console.log('Message sent!');
}
  `;

  return (
    <div className="min-h-screen bg-[#012419] p-8">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg border ${
          notification.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
        } animate-in slide-in-from-top-2`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-green-500" />
            WeChat Official Account
          </h1>
          <p className="text-slate-400">Manage broadcasts and engage with your WeChat followers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border ${
              isLive ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'Stop Live Feed' : 'Start Live Feed'}
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black rounded-lg transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-green-500/25"
          >
            <Plus className="w-5 h-5" />
            New Broadcast
          </button>
        </div>
      </div>

      <div className="flex gap-6 mb-8 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'compose', label: 'Compose' },
          { id: 'advanced', label: 'Advanced Features' },
          { id: 'configuration', label: 'Configuration' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-green-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Send className="w-6 h-6 text-green-400" />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${isLive ? 'bg-green-500/20 text-green-400 animate-pulse' : 'bg-slate-700 text-slate-400'}`}>
                  {isLive ? 'LIVE' : 'TOTAL'}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalSent.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Targeted Users</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.delivered.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Delivered</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-[#39FF14]/20/20 rounded-lg">
                  <Eye className="w-6 h-6 text-[#39FF14]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.read.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Read ({stats.readRate}%)</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.failed.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Failed (Blocked)</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Recent Broadcasts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="text-left p-4 text-slate-400 font-medium">Broadcast Name</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Targeted</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Delivered</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Read</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(campaign => (
                    <tr key={campaign.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="font-medium text-white">{campaign.campaign_name}</div>
                        <div className="text-xs text-slate-500 uppercase">{campaign.message_type}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          campaign.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          campaign.status === 'in_progress' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                          campaign.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {campaign.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-300">{campaign.total_recipients.toLocaleString()}</td>
                      <td className="p-4 text-right text-emerald-300">{campaign.delivered.toLocaleString()}</td>
                      <td className="p-4 text-right text-[#39FF14]">{campaign.read.toLocaleString()}</td>
                      <td className="p-4 text-right text-slate-400">{new Date(campaign.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compose' && (
        <div className="max-w-4xl mx-auto space-y-6">
           <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Broadcast</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Broadcast Name</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      placeholder="e.g. Monthly Newsletter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message Type</label>
                    <select
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    >
                      <option value="text">Text Message</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="news">News / Article</option>
                      <option value="miniprogram">Mini Program</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">User OpenIDs (One per line)</label>
                   <textarea
                      value={pastedIds}
                      onChange={(e) => setPastedIds(e.target.value)}
                      rows={5}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none font-mono"
                      placeholder="oUpF8uMuAJO_M2pxb1Q9zNjWeS6o...&#10;oUpF8uMuAJO_M2pxb1Q9zNjWeS6p..."
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">Message Content</label>
                   <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      placeholder="Type your message here..."
                   />
                </div>

                <div className="flex justify-end pt-4">
                   <button
                      onClick={handleSend}
                      disabled={loading || !campaignName || !message}
                      className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-green-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      <Send className="w-5 h-5" />
                      {loading ? 'Sending...' : 'Send Broadcast'}
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" /> Messaging Options
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-slate-300 mb-2">
                    <span>Multicast Speed</span>
                    <span className="text-green-400 font-bold">{deliverySpeed} req/sec</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={deliverySpeed}
                    onChange={(e) => setDeliverySpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                </div>
                 <div className="flex items-center gap-3">
                   <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-green-500 focus:ring-green-500" />
                   <span className="text-sm text-slate-300">Target Specific Tags/Groups</span>
                 </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <AppWindow className="w-5 h-5 text-[#39FF14]" /> Mini Programs
              </h3>
              <div className="space-y-4">
                 <label className="block text-sm font-medium text-slate-300">Link Mini Program AppID</label>
                 <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="wx1234567890..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm font-mono focus:border-green-500 focus:outline-none"
                 />
                 <button className="text-sm text-green-400 hover:text-green-300 font-medium">
                    Configure Mini Program Settings &rarr;
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'configuration' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">Channel Configuration</h3>
               <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-sm text-[#39FF14] overflow-x-auto">
                  <pre>{JSON.stringify(sampleConfig, null, 2)}</pre>
               </div>
               <button className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <Copy className="w-4 h-4" /> Copy Configuration
               </button>
             </div>

             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">Node.js Example</h3>
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
    </div>
  );
}
