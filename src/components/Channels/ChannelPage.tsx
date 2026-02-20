import { useState } from 'react';
import {
  MessageSquare,
  Send,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Plus,
  Search,
  MoreVertical
} from 'lucide-react';

type Props = {
  channelName: string;
  channelIcon: typeof MessageSquare;
  channelColor: string;
};

type Campaign = {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'scheduled' | 'paused';
  sent: number;
  delivered: number;
  failed: number;
  cost: number;
  date: string;
};

export default function ChannelPage({ channelName, channelIcon: Icon, channelColor }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Sale Promotion',
      status: 'running',
      sent: 45230,
      delivered: 44891,
      failed: 339,
      cost: 678.45,
      date: '2024-01-15'
    },
    {
      id: '2',
      name: 'Product Launch Announcement',
      status: 'completed',
      sent: 23450,
      delivered: 23120,
      failed: 330,
      cost: 352.50,
      date: '2024-01-14'
    },
    {
      id: '3',
      name: 'Customer Satisfaction Survey',
      status: 'running',
      sent: 12890,
      delivered: 12654,
      failed: 236,
      cost: 193.35,
      date: '2024-01-13'
    },
    {
      id: '4',
      name: 'Weekly Newsletter',
      status: 'scheduled',
      sent: 0,
      delivered: 0,
      failed: 0,
      cost: 0,
      date: '2024-01-20'
    }
  ];

  const stats = {
    totalSent: campaigns.reduce((sum, c) => sum + c.sent, 0),
    totalDelivered: campaigns.reduce((sum, c) => sum + c.delivered, 0),
    deliveryRate: ((campaigns.reduce((sum, c) => sum + c.delivered, 0) / campaigns.reduce((sum, c) => sum + c.sent, 0)) * 100).toFixed(1),
    totalCost: campaigns.reduce((sum, c) => sum + c.cost, 0).toFixed(2)
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'running': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'completed': return 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/50';
      case 'scheduled': return 'bg-[#39FF14]/20 text-[#39FF14] border-amber-500/50';
      case 'paused': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#012419] p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`bg-gradient-to-r ${channelColor} p-4 rounded-2xl`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">{channelName}</h1>
            <p className="text-slate-400 text-lg">Manage and monitor your {channelName.toLowerCase()} campaigns</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Messages Sent</p>
              <p className="text-3xl font-bold text-white">{stats.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-[#39FF14]/20 p-3 rounded-xl">
              <Send className="w-5 h-5 text-[#39FF14]" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Total messages</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Delivery Rate</p>
              <p className="text-3xl font-bold text-white">{stats.deliveryRate}%</p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-emerald-400 text-sm">+2.3% from last week</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Active Campaigns</p>
              <p className="text-3xl font-bold text-white">{campaigns.filter(c => c.status === 'running').length}</p>
            </div>
            <div className="bg-[#39FF14]/20 p-3 rounded-xl">
              <Users className="w-5 h-5 text-[#39FF14]" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Currently running</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Cost</p>
              <p className="text-3xl font-bold text-white">RM {stats.totalCost}</p>
            </div>
            <div className="bg-[#39FF14]/20 p-3 rounded-xl">
              <DollarSign className="w-5 h-5 text-[#39FF14]" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">This month</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Campaigns</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14] w-64"
              />
            </div>
            <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all">
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Campaign Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Sent</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Delivered</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Failed</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Cost</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Date</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{campaign.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(campaign.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {campaign.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-white">{campaign.sent.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-emerald-400">{campaign.delivered.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-red-400">{campaign.failed.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-white">RM {campaign.cost.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Date(campaign.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
