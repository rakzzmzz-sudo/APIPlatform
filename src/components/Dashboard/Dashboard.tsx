"use client";

import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Platform, Campaign, Notification } from '../../types/database';
import {
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Globe,
  Bell,
  Clock
} from 'lucide-react';
import PlatformPerformance from '../Monitoring/PlatformPerformance';

export default function Dashboard() {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();

    let interval: number | undefined;
    if (isLive) {
      interval = window.setInterval(() => {
        loadDashboardData();
        setLastUpdate(new Date());
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  const loadDashboardData = async () => {
    try {
      const [platformsRes, campaignsRes, notificationsRes] = await Promise.all([
        db.from('platforms').select('*').eq('is_active', true),
        db.from('campaigns').select('*'),
        db.from('notifications').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      if (platformsRes.data) setPlatforms(platformsRes.data);
      if (campaignsRes.data) setCampaigns(campaignsRes.data);
      if (notificationsRes.data) setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalMessages = campaigns.reduce((sum, c) => sum + c.messages_sent, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'running' || c.status === 'scheduled').length;
  const activePlatforms = platforms.length;
  const averageSuccessRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + (c.success_rate || 0), 0) / campaigns.length
    : 96.0;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#012419]">
        <div className="text-slate-400 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#012419] p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-white">Multi-Platform Communications Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isLive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
              {isLive ? 'Live' : 'Pause'}
            </button>
            <div className="text-slate-400 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-lg">Real-time monitoring across all 15 communication platforms</p>
      </div>

      {notifications.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-slate-300 mb-3">
            <Bell className="w-5 h-5" />
            <h3 className="font-semibold">Recent Updates</h3>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start gap-2 text-sm">
                <span className="text-[#39FF14]">•</span>
                <span className="text-slate-400">{notification.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Messages</p>
              <p className="text-4xl font-bold text-white">{formatNumber(totalMessages)}</p>
            </div>
            <div className="bg-[#39FF14]/20 p-3 rounded-xl">
              <MessageSquare className="w-6 h-6 text-brand-lime" />
            </div>
          </div>
          <p className="text-green-400 text-sm">Across all platforms</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Active Campaigns</p>
              <p className="text-4xl font-bold text-white">{activeCampaigns}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-brand-lime" />
            </div>
          </div>
          <p className="text-green-400 text-sm">Running campaigns</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Average Success</p>
              <p className="text-4xl font-bold text-white">{averageSuccessRate.toFixed(1)}%</p>
            </div>
            <div className="bg-[#39FF14]/20 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-[#39FF14]" />
            </div>
          </div>
          <p className="text-green-400 text-sm">Delivery rate</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Platforms</p>
              <p className="text-4xl font-bold text-white">{activePlatforms}</p>
            </div>
            <div className="bg-[#39FF14]/20 p-3 rounded-xl">
              <Globe className="w-6 h-6 text-brand-lime" />
            </div>
          </div>
          <p className="text-green-400 text-sm">Active channels</p>
        </div>
      </div>

      <PlatformPerformance />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Platform Capabilities</h2>
        
        <div className="space-y-8">
          {/* Messaging & Social */}
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-lime" />
              Messaging & Social
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'WhatsApp', route: '/whatsapp', color: 'bg-green-500', volume: '2.5M', unit: 'Msgs', success: '99.8%', active: '12 Active', lastSync: 'Just now' },
                { name: 'SMS', route: '/sms', color: 'bg-[#39FF14]/20', volume: '1.2M', unit: 'Msgs', success: '98.5%', active: '8 Active', lastSync: '1 min ago' },
                { name: 'RCS', route: '/rcs', color: 'bg-[#39FF14]', volume: '850k', unit: 'Msgs', success: '99.2%', active: '5 Active', lastSync: '2 mins ago' },
                { name: 'Viber', route: '/viber', color: 'bg-[#39FF14]/60', volume: '420k', unit: 'Msgs', success: '99.5%', active: '3 Active', lastSync: '5 mins ago' },
                { name: 'WeChat', route: '/wechat', color: 'bg-green-600', volume: '350k', unit: 'Msgs', success: '99.1%', active: '4 Active', lastSync: '10 mins ago' },
                { name: 'TikTok', route: '/tiktok', color: 'bg-black', volume: '1.8M', unit: 'Views', success: '97.8%', active: '6 Campaigns', lastSync: 'Just now' },
                { name: 'Instagram', route: '/instagram', color: 'bg-[#39FF14]', volume: '2.1M', unit: 'Impressions', success: '98.2%', active: '9 Campaigns', lastSync: 'Just now' },
                { name: 'Facebook', route: '/facebook', color: 'bg-[#32e012]', volume: '3.2M', unit: 'Reach', success: '99.0%', active: '15 Campaigns', lastSync: '1 min ago' },
                { name: 'YouTube', route: '/youtube', color: 'bg-red-600', volume: '5.6M', unit: 'Views', success: '99.9%', active: '4 Campaigns', lastSync: 'Just now' },
                { name: 'LinkedIn', route: '/linkedin', color: 'bg-[#39FF14]/60', volume: '85k', unit: 'Clicks', success: '96.5%', active: '2 Campaigns', lastSync: '15 mins ago' },
                { name: 'Email', route: '/email', color: 'bg-[#39FF14]/60', volume: '4.5M', unit: 'Sent', success: '99.4%', active: '5 Campaigns', lastSync: '3 mins ago' },
                { name: 'LINE', route: '/line', color: 'bg-green-400', volume: '220k', unit: 'Msgs', success: '98.9%', active: '3 Active', lastSync: '12 mins ago' },
              ].map((item) => (
                <a key={item.name} href={item.route} className="bg-slate-800/50 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 p-5 rounded-xl transition-all group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                     <div className={`w-16 h-16 rounded-full ${item.color} blur-xl`}></div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${item.color}/20 flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      </div>
                      <span className="text-white font-semibold text-lg">{item.name}</span>
                    </div>
                    <div className="bg-slate-900/50 px-2 py-1 rounded text-xs text-slate-400 border border-slate-700/50">
                      {item.lastSync}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors">{item.volume}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">{item.unit}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-700/50">
                    <div>
                         <p className="text-slate-500 text-xs mb-0.5">Success Rate</p>
                         <p className={`font-semibold ${parseFloat(item.success) > 98 ? 'text-green-400' : 'text-yellow-400'}`}>{item.success}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-slate-500 text-xs mb-0.5">Status</p>
                         <p className="text-slate-200 font-medium text-sm">{item.active}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Voice, Video & AI */}
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-[#39FF14] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>
              </div>
              Voice, Video & AI
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Voice API', route: '/voice-api', volume: '450k', unit: 'Minutes', success: '99.9%', active: '24 Calls', lastSync: 'Live', color: 'bg-[#39FF14]' },
                { name: 'Video API', route: '/video-api', volume: '120k', unit: 'Minutes', success: '99.5%', active: '8 Sessions', lastSync: 'Live', color: 'bg-[#39FF14]' },
                { name: 'Contact Center', route: '/cc', volume: '1.5k', unit: 'Agents', success: '100%', active: '850 Online', lastSync: 'Just now', color: 'bg-[#39FF14]' },
                { name: 'AI Voice Agents', route: '/voice-agent', volume: '85k', unit: 'Interactions', success: '96.2%', active: '12 Bots', lastSync: '2 mins ago', color: 'bg-[#39FF14]' },
                { name: 'Chatbot Builder', route: '/chatbot', volume: '450k', unit: 'Messages', success: '98.8%', active: '15 Flows', lastSync: '5 mins ago', color: 'bg-[#39FF14]' },
                { name: 'Meetings AI', route: '/meetings-ai', volume: '1.2k', unit: 'Summaries', success: '99.1%', active: '5 Processing', lastSync: '10 mins ago', color: 'bg-[#39FF14]' },
              ].map((item) => (
                <a key={item.name} href={item.route} className="bg-slate-800/50 border border-slate-700 hover:border-[#39FF14]/50 hover:bg-slate-800 p-5 rounded-xl transition-all group relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0)] hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]">
                   <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                     <div className={`w-16 h-16 rounded-full ${item.color} blur-xl`}></div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${item.color}/20 flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      </div>
                      <span className="text-white font-semibold text-lg">{item.name}</span>
                    </div>
                    <div className="bg-slate-900/50 px-2 py-1 rounded text-xs text-slate-400 border border-slate-700/50">
                      {item.lastSync}
                    </div>
                  </div>
                   <div className="mb-4">
                    <p className="text-3xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors shadow-sm">{item.volume}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">{item.unit}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-700/50">
                    <div>
                         <p className="text-slate-500 text-xs mb-0.5">Success/Uptime</p>
                         <p className="text-green-400 font-semibold">{item.success}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-slate-500 text-xs mb-0.5">Active</p>
                         <p className="text-slate-200 font-medium text-sm">{item.active}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Network APIs (CAMARA) */}
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              Identity & Security (CAMARA)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'SIM Swap', route: '/sim-swap', volume: '15k', unit: 'Checks', success: '100%', active: '3 Apps', lastSync: 'Just now', color: 'bg-emerald-500' },
                { name: 'Number Verify', route: '/number-verification', volume: '22k', unit: 'Verifications', success: '99.5%', active: '5 Apps', lastSync: '1 min ago', color: 'bg-emerald-600' },
                { name: 'Device Location', route: '/device-location', volume: '8.5k', unit: 'Locates', success: '98.0%', active: '2 Apps', lastSync: '5 mins ago', color: 'bg-[#39FF14]/60' },
                { name: 'QoD', route: '/qod', volume: '1.2k', unit: 'Sessions', success: '99.9%', active: '15 Active', lastSync: 'Live', color: 'bg-[#39FF14]' },
              ].map((item) => (
                <a key={item.name} href={item.route} className="bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 p-5 rounded-xl transition-all group relative overflow-hidden">
                   <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                     <div className={`w-16 h-16 rounded-full ${item.color} blur-xl`}></div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${item.color}/20 flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      </div>
                      <span className="text-white font-semibold text-lg">{item.name}</span>
                    </div>
                    <div className="bg-slate-900/50 px-2 py-1 rounded text-xs text-slate-400 border border-slate-700/50">
                      {item.lastSync}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{item.volume}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">{item.unit}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-700/50">
                    <div>
                         <p className="text-slate-500 text-xs mb-0.5">Success Rate</p>
                         <p className="text-green-400 font-semibold">{item.success}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-slate-500 text-xs mb-0.5">Connected</p>
                         <p className="text-slate-200 font-medium text-sm">{item.active}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
