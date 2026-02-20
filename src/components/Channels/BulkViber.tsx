import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare, Send, Upload, Users, Calendar, Save, X,
  CheckCircle, AlertCircle, Clock, FileText, Smartphone, Settings,
  Pause, Play, Edit, Trash2, Filter, ChevronDown, ChevronUp, Phone, Plus,
  BarChart3, Zap, Activity, Globe, MessageCircle, Copy, Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock Data Generator
const generateMockCampaigns = (count: number) => {
  const data = [];
  const statuses = ['completed', 'in_progress', 'scheduled', 'draft', 'failed'];
  const types = ['text', 'image', 'video', 'file'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const total = Math.floor(Math.random() * 5000) + 500;
    const projectTime = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60) * 60 * 1000);

    // Metrics based on status
    let delivered = 0;
    let seen = 0;
    let failed = 0;
    
    if (status === 'completed') {
      delivered = Math.floor(total * (0.85 + Math.random() * 0.1));
      seen = Math.floor(delivered * (0.6 + Math.random() * 0.2));
      failed = total - delivered;
    } else if (status === 'in_progress') {
      delivered = Math.floor(total * (0.3 + Math.random() * 0.2));
      seen = Math.floor(delivered * (0.4 + Math.random() * 0.1));
      failed = Math.floor(total * 0.05);
    }

    data.push({
      id: `viber_${Math.random().toString(36).substr(2, 9)}`,
      campaign_name: `${type.charAt(0).toUpperCase() + type.slice(1)} Promo ${projectTime.toLocaleDateString()}`,
      status: status,
      message_type: type,
      total_recipients: total,
      valid_numbers: total,
      delivered: delivered,
      seen: seen,
      failed: failed,
      created_at: projectTime.toISOString(),
      scheduled_at: status === 'scheduled' ? new Date(Date.now() + 86400000).toISOString() : null
    });
  }
  return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const mockTemplates = [
  { id: 'mpl_1', name: 'Welcome Message', body_content: 'Welcome to our service! reply YES to subscribe.', category: 'Marketing' },
  { id: 'mpl_2', name: 'Order Confirmation', body_content: 'Your order #12345 has been confirmed.', category: 'Transactional' },
  { id: 'mpl_3', name: 'Appointment Reminder', body_content: 'Reminder: Your appointment is tomorrow at 10 AM.', category: 'Utility' }
];

export default function BulkViber() {
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
  const [pastedNumbers, setPastedNumbers] = useState('');

  // Advanced Features State
  const [deliverySpeed, setDeliverySpeed] = useState(50); // msgs/sec
  const [sessionType, setSessionType] = useState('business'); 

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
            const newDelivered = Math.floor(Math.random() * 5);
            const newSeen = Math.floor(Math.random() * 3);
            return {
              ...c,
              delivered: Math.min(c.total_recipients, c.delivered + newDelivered),
              seen: Math.min(c.total_recipients, c.seen + newSeen)
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
      seen: campaigns.reduce((acc, c) => acc + c.seen, 0),
      failed: campaigns.reduce((acc, c) => acc + c.failed, 0),
      deliveryRate: campaigns.length ? (campaigns.reduce((acc, c) => acc + (c.delivered / c.total_recipients), 0) / campaigns.length * 100).toFixed(1) : '0.0'
    };
  }, [campaigns]);

  const handleSend = () => {
    setLoading(true);

      const newCamp = {
        id: `viber_${Math.random().toString(36).substr(2, 9)}`,
        campaign_name: campaignName || 'New Campaign',
        status: 'in_progress',
        message_type: messageType,
        total_recipients: pastedNumbers.split('\n').length || 100,
        valid_numbers: pastedNumbers.split('\n').length || 100,
        delivered: 0,
        seen: 0,
        failed: 0,
        created_at: new Date().toISOString()
      };
      setCampaigns(prev => [newCamp, ...prev]);
      setNotification({ type: 'success', message: 'Campaign started successfully' });
      setCampaignName('');
      setMessage('');
      setPastedNumbers('');
      setActiveTab('overview');
      setLoading(false);
      setCampaigns(prev => [newCamp, ...prev]);
      setNotification({ type: 'success', message: 'Campaign started successfully' });
      setCampaignName('');
      setMessage('');
      setPastedNumbers('');
      setActiveTab('overview');
      setLoading(false);
  };

  // Sample Config
  const sampleConfig = {
    "auth_token": "445da6...-8ef...-...",
    "webhook_url": "https://your-domain.com/viber/webhook",
    "sender_name": "MyBrand",
    "avatar_url": "https://your-domain.com/avatar.jpg"
  };

  const sampleCode = `
// Node.js - Send Viber Message
const axios = require('axios');

async function sendViberMessage() {
  const response = await axios.post('https://chatapi.viber.com/pa/send_message', {
    receiver: "01234567890",
    min_api_version: 1,
    sender: {
      name: "MyBrand",
      avatar: "http://avatar.example.com"
    },
    tracking_data: "tracking_id_123",
    type: "text",
    text: "Hello from Viber Business API!"
  }, {
    headers: { 'X-Viber-Auth-Token': 'YOUR_AUTH_TOKEN' }
  });
  
  console.log(response.data);
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
            <Phone className="w-10 h-10 text-brand-lime" />
            Viber Business Messaging
          </h1>
          <p className="text-slate-400">Send bulk messages and manage high-volume Viber campaigns</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border ${
              isLive ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/20' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'Stop Live Feed' : 'Start Live Feed'}
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black rounded-lg transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-[#39FF14]/20"
          >
            <Plus className="w-5 h-5" />
            New Campaign
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
                ? 'text-[#39FF14] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#39FF14]'
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
                  <Send className="w-6 h-6 text-brand-lime" />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${isLive ? 'bg-green-500/20 text-brand-lime animate-pulse' : 'bg-slate-700 text-slate-400'}`}>
                  {isLive ? 'LIVE' : 'TOTAL'}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalSent.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Total Sent</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-brand-lime" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.delivered.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Delivered ({stats.deliveryRate}%)</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-[#39FF14]/20/20 rounded-lg">
                  <Eye className="w-6 h-6 text-brand-lime" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.seen.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Seen</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
               <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.failed.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Failed</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Recent Campaigns</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="text-left p-4 text-slate-400 font-medium">Campaign</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Recipients</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Delivered</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Seen</th>
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
                          campaign.status === 'completed' ? 'bg-green-500/20 text-brand-lime' :
                          campaign.status === 'in_progress' ? 'bg-[#39FF14]/20/20 text-brand-lime' :
                          campaign.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {campaign.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-300">{campaign.total_recipients.toLocaleString()}</td>
                      <td className="p-4 text-right text-brand-lime">{campaign.delivered.toLocaleString()}</td>
                      <td className="p-4 text-right text-brand-lime">{campaign.seen.toLocaleString()}</td>
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
              <h2 className="text-2xl font-bold text-white mb-6">Create New Campaign</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Name</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-[#39FF14] focus:outline-none"
                      placeholder="e.g. Summer Sale Promo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message Type</label>
                    <select
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-[#39FF14] focus:outline-none"
                    >
                      <option value="text">Text Message</option>
                      <option value="image">Image Message</option>
                      <option value="video">Video Message</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">Recipients (One per line)</label>
                   <textarea
                      value={pastedNumbers}
                      onChange={(e) => setPastedNumbers(e.target.value)}
                      rows={5}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-[#39FF14] focus:outline-none font-mono"
                      placeholder="+60123456789&#10;+60198765432"
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">Message Content</label>
                   <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-[#39FF14] focus:outline-none"
                      placeholder="Type your message here..."
                   />
                </div>

                <div className="flex justify-end pt-4">
                   <button
                      onClick={handleSend}
                      disabled={loading || !campaignName || !message}
                      className="px-8 py-4 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-[#39FF14]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      <Send className="w-5 h-5" />
                      {loading ? 'Sending...' : 'Launch Campaign'}
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
                <Zap className="w-5 h-5 text-yellow-400" /> Throughput Control
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-slate-300 mb-2">
                    <span>Delivery Speed</span>
                    <span className="text-[#39FF14] font-bold">{deliverySpeed} msgs/sec</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={deliverySpeed}
                    onChange={(e) => setDeliverySpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Adjust throughput to manage server load and carrier limits.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#39FF14]" /> Session Management
              </h3>
              <div className="space-y-4">
                 <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
                    <div>
                       <div className="text-white font-medium">Business Messages</div>
                       <div className="text-xs text-slate-400">Standard bulk messaging</div>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                 </div>
                 <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between opacity-50">
                    <div>
                       <div className="text-white font-medium">Transcoding Session</div>
                       <div className="text-xs text-slate-400">Video compression active</div>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-slate-600"></div>
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
               <h3 className="text-lg font-bold text-white mb-4">API Configuration</h3>
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
