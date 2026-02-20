import { useState, useEffect } from 'react';
import {
  Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, ShoppingCart,
  Plus, Settings, TrendingUp, TrendingDown, Clock, DollarSign,
  PhoneIncoming, PhoneOutgoing, Play, Server, Network, Shield, Info,
  User, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import VoiceManagement from './VoiceManagement';

interface PhoneNumber {
  id: string;
  phone_number: string;
  number_type: string;
  status: string;
  business_name: string;
  business_location: string;
  usage_minutes: number;
  monthly_cost: number;
}

interface SIPTrunk {
  id: string;
  trunk_name: string;
  trunk_type: string;
  status: string;
  concurrent_channels: number;
  monthly_cost: number;
  per_minute_cost: number;
  inbound_enabled: boolean;
  outbound_enabled: boolean;
}

interface CallLog {
  id: string;
  call_direction: string;
  from_number: string;
  to_number: string;
  call_status: string;
  duration_seconds: number;
  cost: number;
  started_at: string;
}

interface AvailableNumber {
  id: string;
  phone_number: string;
  country_code: string;
  region: string;
  number_type: string;
  monthly_cost: number;
  setup_cost: number;
  capabilities?: any;
}

interface AvailableTrunk {
  id: string;
  trunk_name: string;
  trunk_type: string;
  concurrent_channels: number;
  monthly_cost: number;
  per_minute_cost: number;
  regions?: any;
}

export default function VoiceBot() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'numbers' | 'trunks' | 'marketplace' | 'ivr'>('dashboard');
  const [dialNumber, setDialNumber] = useState('');
  const [isDialing, setIsDialing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [sipTrunks, setSipTrunks] = useState<SIPTrunk[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [availableTrunks, setAvailableTrunks] = useState<AvailableTrunk[]>([]);

  const [stats, setStats] = useState({
    totalCalls: 0,
    avgDuration: '0:00',
    successRate: 0,
    costPerMinute: 0
  });

  const [loading, setLoading] = useState(true);
  const [purchaseModal, setPurchaseModal] = useState<{
    type: 'number' | 'trunk' | null;
    item: any;
  }>({ type: null, item: null });
  const [purchasing, setPurchasing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [configureModal, setConfigureModal] = useState<{
    type: 'number' | 'trunk' | null;
    item: any;
  }>({ type: null, item: null });

  useEffect(() => {
    if (user) {
      Promise.all([
        loadPhoneNumbers(),
        loadSIPTrunks(),
        loadCallLogs(),
        loadAvailableNumbers(),
        loadAvailableTrunks(),
        loadStats()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const loadPhoneNumbers = async () => {
    const { data, error } = await db
      .from('dids')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mappedData = data.map((did: any) => ({
        id: did.id,
        phone_number: did.phone_number,
        number_type: did.routing_type || 'local',
        status: did.is_active ? 'active' : 'inactive',
        business_name: did.friendly_name || 'N/A',
        business_location: 'Malaysia',
        usage_minutes: 0,
        monthly_cost: Number(did.monthly_cost) || 0
      }));
      setPhoneNumbers(mappedData);
    }
  };

  const loadSIPTrunks = async () => {
    const { data, error } = await db
      .from('sip_trunks')
      .select('*')
      .order('created_at', { ascending: false});

    if (!error && data) {
      const mappedData = data.map((trunk: any) => ({
        id: trunk.id,
        trunk_name: trunk.name,
        trunk_type: trunk.provider || 'standard',
        status: trunk.status,
        concurrent_channels: trunk.concurrent_calls_limit || 0,
        monthly_cost: Number(trunk.monthly_cost) || 0,
        per_minute_cost: Number(trunk.per_minute_cost) || 0,
        inbound_enabled: trunk.is_active || false,
        outbound_enabled: trunk.is_active || false
      }));
      setSipTrunks(mappedData);
    }
  };

  const loadCallLogs = async () => {
    if (!user) return;

    const { data, error } = await db
      .from('call_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setCallLogs(data);
    }
  };

  const loadAvailableNumbers = async () => {
    const { data, error } = await db
      .from('available_numbers')
      .select('*')
      .eq('is_available', true)
      .limit(20);

    if (!error && data) {
      setAvailableNumbers(data);
    }
  };

  const loadAvailableTrunks = async () => {
    const { data, error } = await db
      .from('available_trunks')
      .select('*')
      .eq('is_available', true);

    if (!error && data) {
      setAvailableTrunks(data);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    const { data: logs } = await db
      .from('call_logs')
      .select('*')
      .eq('user_id', user.id);

    if (logs) {
      const totalCalls = logs.length;
      const completedCalls = logs.filter((l: any) => l.call_status === 'completed');
      const totalDuration = completedCalls.reduce((acc: number, l: any) => acc + l.duration_seconds, 0);
      const avgDurationSeconds = completedCalls.length > 0 ? totalDuration / completedCalls.length : 0;
      const avgMinutes = Math.floor(avgDurationSeconds / 60);
      const avgSeconds = Math.floor(avgDurationSeconds % 60);
      const totalCost = logs.reduce((acc: number, l: any) => acc + Number(l.cost), 0);
      const totalMinutes = totalDuration / 60;

      setStats({
        totalCalls,
        avgDuration: `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`,
        successRate: totalCalls > 0 ? (completedCalls.length / totalCalls * 100) : 0,
        costPerMinute: totalMinutes > 0 ? totalCost / totalMinutes : 0
      });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handlePurchaseNumber = async () => {
    if (!purchaseModal.item || !user) return;

    setPurchasing(true);
    const number = purchaseModal.item;

    const totalPrice = Number(number.setup_cost) + Number(number.monthly_cost);

    const { error } = await db
      .from('cart_items')
      .insert({
        user_id: user.id,
        item_type: 'phone_number',
        item_data: number,
        quantity: 1,
        unit_price: totalPrice,
        total_price: totalPrice
      });

    setPurchasing(false);
    setPurchaseModal({ type: null, item: null });

    if (error) {
      setNotification({
        type: 'error',
        message: 'Failed to add to cart. Please try again.'
      });
    } else {
      setNotification({
        type: 'success',
        message: `${number.phone_number} added to cart!`
      });
    }
  };

  const handlePurchaseTrunk = async () => {
    if (!purchaseModal.item || !user) return;

    setPurchasing(true);
    const trunk = purchaseModal.item;

    const { error } = await db
      .from('cart_items')
      .insert({
        user_id: user.id,
        item_type: 'sip_trunk',
        item_data: trunk,
        quantity: 1,
        unit_price: trunk.monthly_cost,
        total_price: trunk.monthly_cost
      });

    setPurchasing(false);
    setPurchaseModal({ type: null, item: null });

    if (error) {
      setNotification({
        type: 'error',
        message: 'Failed to add to cart. Please try again.'
      });
    } else {
      setNotification({
        type: 'success',
        message: `${trunk.trunk_name} added to cart!`
      });
    }
  };

  const handleDialPad = (digit: string) => {
    setDialNumber(prev => prev + digit);
  };

  const handleCall = () => {
    if (dialNumber) {
      setIsDialing(true);
      setTimeout(() => setIsDialing(false), 3000);
    }
  };

  const handleHangup = () => {
    setIsDialing(false);
    setDialNumber('');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-brand-lime bg-green-500/20 border-green-500/30';
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'busy': return 'text-brand-lime bg-yellow-500/20 border-yellow-500/30';
      case 'no-answer': return 'text-brand-lime bg-[#39FF14]/20 border-[#39FF14]/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-brand-lime bg-green-500/20 border-green-500/30';
      case 'inactive': return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      case 'suspended': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getTodayCallCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return callLogs.filter(log => new Date(log.started_at) >= today).length;
  };

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">
      <div className="relative h-48 bg-gradient-to-r from-orange-500 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center px-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Voice Communications</h1>
              <p className="text-white/90 text-lg">PSTN Calling, Number Management & SIP Trunking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 mb-8 inline-flex">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('numbers')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'numbers' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phone Numbers
          </button>
          <button
            onClick={() => setActiveTab('trunks')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'trunks' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SIP Trunks
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'marketplace' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('ivr')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'ivr' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            IVR & Config
          </button>
        </div>

        {activeTab === 'ivr' && <VoiceManagement />}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Calls Today</p>
                    <p className="text-3xl font-bold text-white">{getTodayCallCount()}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <PhoneCall className="w-6 h-6 text-brand-lime" />
                  </div>
                </div>
                <p className="text-green-400 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +15%
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Average Duration</p>
                    <p className="text-3xl font-bold text-white">{stats.avgDuration}</p>
                  </div>
                  <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-brand-lime" />
                  </div>
                </div>
                <p className="text-brand-lime text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8%
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-white">{stats.successRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-brand-lime" />
                  </div>
                </div>
                <p className="text-brand-lime text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +1.2%
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Cost per Minute</p>
                    <p className="text-3xl font-bold text-white">RM {stats.costPerMinute.toFixed(2)}</p>
                  </div>
                  <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-brand-lime" />
                  </div>
                </div>
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  -5%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Call Analytics</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const inbound = Math.random() * 60 + 20;
                    const outbound = Math.random() * 50 + 10;
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col gap-1">
                          <div
                            className="w-full bg-green-500 rounded-t"
                            style={{ height: `${inbound * 2}px` }}
                          ></div>
                          <div
                            className="w-full bg-[#39FF14]/20 rounded-t"
                            style={{ height: `${outbound * 2}px` }}
                          ></div>
                        </div>
                        <span className="text-slate-400 text-xs">{day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-300 text-sm">Inbound Calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#39FF14]/20"></div>
                    <span className="text-slate-300 text-sm">Outbound Calls</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Voice Dialer</h2>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    value={dialNumber}
                    onChange={(e) => setDialNumber(e.target.value)}
                    placeholder="+60 3-XXXX-XXXX"
                    className="w-full bg-transparent text-white text-center text-xl outline-none"
                  />
                  <p className="text-center text-slate-500 text-sm mt-2">
                    {isDialing ? 'Calling...' : 'Ready to dial'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handleDialPad(digit)}
                      className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors"
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={isDialing ? handleHangup : handleCall}
                    className={`${
                      isDialing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                    } text-white p-4 rounded-full transition-colors`}
                  >
                    {isDialing ? <PhoneOff className="w-6 h-6" /> : <PhoneCall className="w-6 h-6" />}
                  </button>
                  <button className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors">
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Phone Numbers</h2>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Number
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 text-sm font-medium py-3">PHONE NUMBER</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">TYPE</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">STATUS</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">BUSINESS</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">USAGE</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phoneNumbers.slice(0, 5).map((number) => (
                      <tr key={number.id} className="border-b border-slate-700/50">
                        <td className="py-4 text-white font-medium">{number.phone_number}</td>
                        <td className="py-4 text-slate-300 capitalize">{number.number_type}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(number.status)}`}>
                            {number.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-white text-sm">{number.business_name}</p>
                            <p className="text-slate-400 text-xs">{number.business_location}</p>
                          </div>
                        </td>
                        <td className="py-4 text-slate-300">{number.usage_minutes} mins</td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button className="text-brand-lime hover:text-green-300">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="text-brand-lime hover:text-green-300">
                              <Play className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'numbers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Manage Phone Numbers (DIDs)</h2>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Numbers
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Total Numbers</p>
                <p className="text-3xl font-bold text-white">{phoneNumbers.length}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Active Numbers</p>
                <p className="text-3xl font-bold text-white">
                  {phoneNumbers.filter(n => n.status === 'active').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Monthly Cost</p>
                <p className="text-3xl font-bold text-white">
                  RM {phoneNumbers.reduce((acc, n) => acc + Number(n.monthly_cost), 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 text-sm font-medium py-3">PHONE NUMBER</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">TYPE</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">STATUS</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">BUSINESS</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">LOCATION</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">USAGE</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">MONTHLY COST</th>
                      <th className="text-left text-slate-400 text-sm font-medium py-3">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phoneNumbers.map((number) => (
                      <tr key={number.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 text-white font-medium">{number.phone_number}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#39FF14]/20/20 text-brand-lime border border-[#39FF14]/30 capitalize">
                            {number.number_type}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(number.status)}`}>
                            {number.status}
                          </span>
                        </td>
                        <td className="py-4 text-slate-300">{number.business_name}</td>
                        <td className="py-4 text-slate-300">{number.business_location}</td>
                        <td className="py-4 text-slate-300">{number.usage_minutes} mins</td>
                        <td className="py-4 text-white">RM {Number(number.monthly_cost).toFixed(2)}</td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfigureModal({ type: 'number', item: number })}
                              className="bg-[#39FF14] hover:bg-[#32e012] text-white px-3 py-1 rounded text-sm"
                            >
                              Configure
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                              Release
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trunks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">SIP Trunks Management</h2>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy SIP Trunk
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Total Trunks</p>
                <p className="text-3xl font-bold text-white">{sipTrunks.length}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Active Trunks</p>
                <p className="text-3xl font-bold text-white">
                  {sipTrunks.filter(t => t.status === 'active').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Total Channels</p>
                <p className="text-3xl font-bold text-white">
                  {sipTrunks.reduce((acc, t) => acc + t.concurrent_channels, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-2">Monthly Cost</p>
                <p className="text-3xl font-bold text-white">
                  RM {sipTrunks.reduce((acc, t) => acc + Number(t.monthly_cost), 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {sipTrunks.map((trunk) => (
                <div key={trunk.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Server className="w-6 h-6 text-brand-lime" />
                        <h3 className="text-xl font-semibold text-white">{trunk.trunk_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(trunk.status)}`}>
                          {trunk.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#39FF14]/20 text-brand-lime border border-[#39FF14]/30 capitalize">
                          {trunk.trunk_type}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Concurrent Channels</p>
                          <p className="text-white text-sm font-medium">{trunk.concurrent_channels}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Monthly Cost</p>
                          <p className="text-white text-sm font-medium">RM {Number(trunk.monthly_cost).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Per Minute Cost</p>
                          <p className="text-white text-sm font-medium">RM {Number(trunk.per_minute_cost).toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Inbound</p>
                          <p className="text-white text-sm font-medium">
                            {trunk.inbound_enabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Outbound</p>
                          <p className="text-white text-sm font-medium">
                            {trunk.outbound_enabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfigureModal({ type: 'trunk', item: trunk })}
                        className="bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Configure
                      </button>
                      <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Buy Phone Numbers (DIDs)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableNumbers.map((number) => (
                  <div key={number.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-white font-bold text-lg mb-1">{number.phone_number}</p>
                        <p className="text-slate-400 text-sm">{number.region}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#39FF14]/20/20 text-brand-lime border border-[#39FF14]/30 capitalize">
                        {number.number_type}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">Setup Cost:</span>
                        <span className="text-white font-medium">RM {Number(number.setup_cost).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">Monthly:</span>
                        <span className="text-white font-medium">RM {Number(number.monthly_cost).toFixed(2)}/mo</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setPurchaseModal({ type: 'number', item: number })}
                      className="w-full bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Purchase Number
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Buy SIP Trunks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableTrunks.map((trunk) => (
                  <div key={trunk.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-[#39FF14]/20 p-3 rounded-lg">
                        <Server className="w-6 h-6 text-brand-lime" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{trunk.trunk_name}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#39FF14]/20 text-brand-lime border border-[#39FF14]/30 capitalize">
                          {trunk.trunk_type}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">Channels:</span>
                        <span className="text-white font-medium">{trunk.concurrent_channels}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">Monthly:</span>
                        <span className="text-white font-medium">RM {Number(trunk.monthly_cost).toFixed(2)}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">Per Minute:</span>
                        <span className="text-white font-medium">RM {Number(trunk.per_minute_cost).toFixed(4)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setPurchaseModal({ type: 'trunk', item: trunk })}
                      className="w-full bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Purchase Trunk
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {purchaseModal.type && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">
              Confirm Purchase
            </h3>

            {purchaseModal.type === 'number' && (
              <div className="space-y-4 mb-6">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Phone Number</p>
                  <p className="text-white text-xl font-bold">{purchaseModal.item.phone_number}</p>
                  <p className="text-slate-400 text-sm mt-1">{purchaseModal.item.region}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Setup Cost</p>
                    <p className="text-white text-lg font-bold">RM {Number(purchaseModal.item.setup_cost).toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Monthly Cost</p>
                    <p className="text-white text-lg font-bold">RM {Number(purchaseModal.item.monthly_cost).toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                  <p className="text-brand-lime text-sm">
                    Total today: RM {(Number(purchaseModal.item.setup_cost) + Number(purchaseModal.item.monthly_cost)).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {purchaseModal.type === 'trunk' && (
              <div className="space-y-4 mb-6">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">SIP Trunk</p>
                  <p className="text-white text-xl font-bold">{purchaseModal.item.trunk_name}</p>
                  <p className="text-slate-400 text-sm mt-1">{purchaseModal.item.concurrent_channels} concurrent channels</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Monthly Cost</p>
                    <p className="text-white text-lg font-bold">RM {Number(purchaseModal.item.monthly_cost).toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Per Minute</p>
                    <p className="text-white text-lg font-bold">RM {Number(purchaseModal.item.per_minute_cost).toFixed(4)}</p>
                  </div>
                </div>
                <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                  <p className="text-[#39FF14] text-sm">
                    You will be charged RM {Number(purchaseModal.item.monthly_cost).toFixed(2)} monthly
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setPurchaseModal({ type: null, item: null })}
                disabled={purchasing}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={purchaseModal.type === 'number' ? handlePurchaseNumber : handlePurchaseTrunk}
                disabled={purchasing}
                className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {purchasing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Confirm Purchase
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {configureModal.type && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {configureModal.type === 'number' ? 'Configure Phone Number' : 'Configure SIP Trunk'}
              </h3>
              <button
                onClick={() => setConfigureModal({ type: null, item: null })}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {configureModal.type === 'number' && (
              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Phone Number</p>
                  <p className="text-white text-xl font-bold">{configureModal.item.phone_number}</p>
                  <p className="text-slate-400 text-sm mt-1">{configureModal.item.business_name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Friendly Name</label>
                  <input
                    type="text"
                    defaultValue={configureModal.item.business_name}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Routing Type</label>
                  <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]">
                    <option value="ivr">IVR Menu</option>
                    <option value="queue">Call Queue</option>
                    <option value="agent">Direct Agent</option>
                    <option value="voicemail">Voicemail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Routing Target</label>
                  <input
                    type="text"
                    placeholder="e.g., main-reception"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="recording" className="w-4 h-4" />
                  <label htmlFor="recording" className="text-sm text-slate-300">Enable Call Recording</label>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="transcription" className="w-4 h-4" />
                  <label htmlFor="transcription" className="text-sm text-slate-300">Enable Transcription</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setConfigureModal({ type: null, item: null })}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setConfigureModal({ type: null, item: null });
                      setNotification({ type: 'success', message: 'Phone number configuration saved!' });
                    }}
                    className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}

            {configureModal.type === 'trunk' && (
              <div className="space-y-6">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">SIP Trunk</p>
                  <p className="text-white text-xl font-bold">{configureModal.item.trunk_name}</p>
                  <p className="text-slate-400 text-sm mt-1">{configureModal.item.trunk_type}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Trunk Name</label>
                  <input
                    type="text"
                    defaultValue={configureModal.item.trunk_name}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="e.g., Primary SIP Trunk"
                  />
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-lime" />
                    Connectivity & Authentication
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Authentication Type
                      </label>
                      <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]">
                        <option value="registration">Registration-Based (Username/Password)</option>
                        <option value="ip-based">IP-Based (Peering)</option>
                      </select>
                      <p className="text-slate-500 text-xs mt-1">
                        Registration: PBX sends REGISTER with credentials. IP-Based: Authentication via static IP
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          SIP Server / Host
                        </label>
                        <input
                          type="text"
                          placeholder="sip.provider.com"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        />
                        <p className="text-slate-500 text-xs mt-1">FQDN or IP address</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          SIP Port
                        </label>
                        <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]">
                          <option value="5060">5060 (Standard)</option>
                          <option value="5061">5061 (TLS Encrypted)</option>
                          <option value="custom">Custom Port</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Transport Protocol
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 cursor-pointer hover:border-[#39FF14] transition-colors">
                          <input type="radio" name="transport" value="udp" id="udp" className="mr-2" defaultChecked />
                          <label htmlFor="udp" className="text-white font-medium cursor-pointer">UDP</label>
                          <p className="text-slate-500 text-xs mt-1">Preferred for voice (low latency)</p>
                        </div>
                        <div className="bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 cursor-pointer hover:border-[#39FF14] transition-colors">
                          <input type="radio" name="transport" value="tcp" id="tcp" className="mr-2" />
                          <label htmlFor="tcp" className="text-white font-medium cursor-pointer">TCP</label>
                          <p className="text-slate-500 text-xs mt-1">Reliable packet delivery</p>
                        </div>
                        <div className="bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 cursor-pointer hover:border-[#39FF14] transition-colors">
                          <input type="radio" name="transport" value="tls" id="tls" className="mr-2" />
                          <label htmlFor="tls" className="text-white font-medium cursor-pointer">TLS</label>
                          <p className="text-slate-500 text-xs mt-1">Encrypted signaling</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <input
                          type="text"
                          placeholder="auth_username"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-green-400" />
                    Media & Codecs
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Audio Codecs
                      </label>
                      <p className="text-slate-500 text-xs mb-3">
                        Select codecs supported by your provider in order of preference
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="g711-ulaw" className="w-4 h-4" defaultChecked />
                            <div>
                              <label htmlFor="g711-ulaw" className="text-white font-medium cursor-pointer">G.711 u-law</label>
                              <p className="text-slate-500 text-xs">Uncompressed, high quality (~80kbps bandwidth)</p>
                            </div>
                          </div>
                          <select className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="1">Priority 1</option>
                            <option value="2">Priority 2</option>
                            <option value="3">Priority 3</option>
                            <option value="4">Priority 4</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="g711-alaw" className="w-4 h-4" defaultChecked />
                            <div>
                              <label htmlFor="g711-alaw" className="text-white font-medium cursor-pointer">G.711 a-law</label>
                              <p className="text-slate-500 text-xs">Uncompressed, high quality (~80kbps bandwidth)</p>
                            </div>
                          </div>
                          <select className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="1">Priority 1</option>
                            <option value="2" selected>Priority 2</option>
                            <option value="3">Priority 3</option>
                            <option value="4">Priority 4</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="g729" className="w-4 h-4" />
                            <div>
                              <label htmlFor="g729" className="text-white font-medium cursor-pointer">G.729</label>
                              <p className="text-slate-500 text-xs">Compressed, good quality (~30kbps, more CPU intensive)</p>
                            </div>
                          </div>
                          <select className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="1">Priority 1</option>
                            <option value="2">Priority 2</option>
                            <option value="3" selected>Priority 3</option>
                            <option value="4">Priority 4</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="opus" className="w-4 h-4" />
                            <div>
                              <label htmlFor="opus" className="text-white font-medium cursor-pointer">Opus</label>
                              <p className="text-slate-500 text-xs">Modern codec, excellent quality and efficiency</p>
                            </div>
                          </div>
                          <select className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                            <option value="1">Priority 1</option>
                            <option value="2">Priority 2</option>
                            <option value="3">Priority 3</option>
                            <option value="4" selected>Priority 4</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        DTMF Mode
                      </label>
                      <p className="text-slate-500 text-xs mb-3">
                        Determines how key presses (digits) are transmitted
                      </p>
                      <div className="space-y-2">
                        <div className="bg-slate-900/50 border-2 border-[#39FF14] rounded-lg p-3 cursor-pointer">
                          <input type="radio" name="dtmf" value="rfc2833" id="rfc2833" className="mr-2" defaultChecked />
                          <label htmlFor="rfc2833" className="text-white font-medium cursor-pointer">RFC 2833 (AVT)</label>
                          <p className="text-slate-500 text-xs mt-1 ml-6">Out-of-band data packets - Most reliable and common standard</p>
                        </div>
                        <div className="bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 cursor-pointer hover:border-[#39FF14] transition-colors">
                          <input type="radio" name="dtmf" value="inband" id="inband" className="mr-2" />
                          <label htmlFor="inband" className="text-white font-medium cursor-pointer">In-band</label>
                          <p className="text-slate-500 text-xs mt-1 ml-6">Audio tones - Prone to errors with compressed codecs</p>
                        </div>
                        <div className="bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 cursor-pointer hover:border-[#39FF14] transition-colors">
                          <input type="radio" name="dtmf" value="sipinfo" id="sipinfo" className="mr-2" />
                          <label htmlFor="sipinfo" className="text-white font-medium cursor-pointer">SIP INFO</label>
                          <p className="text-slate-500 text-xs mt-1 ml-6">Via SIP signaling messages</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-brand-lime" />
                    Network & NAT Traversal
                  </h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Configure settings to ensure audio works in both directions when behind a firewall
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        NAT Handling
                      </label>
                      <p className="text-slate-500 text-xs mb-3">
                        Configure how the PBX handles Network Address Translation
                      </p>
                      <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]">
                        <option value="no">No - Disable NAT handling</option>
                        <option value="yes" selected>Yes - Enable NAT handling</option>
                        <option value="force">Force - Always use NAT, ignore SDP</option>
                        <option value="comedia">Comedia - Learn NAT from media</option>
                      </select>
                      <p className="text-slate-400 text-xs mt-2">
                        Recommended: Select "Yes" or "Force" when PBX is behind a router/firewall
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Public IP / External IP
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 203.0.113.45"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        />
                        <p className="text-slate-500 text-xs mt-1">Static public IP for RTP audio</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          STUN Server
                        </label>
                        <input
                          type="text"
                          placeholder="stun.example.com:3478"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                        />
                        <p className="text-slate-500 text-xs mt-1">Auto-discover public IP (optional)</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Keep-Alive / Qualify
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]">
                            <option value="no">Disabled</option>
                            <option value="yes" selected>Enabled</option>
                          </select>
                          <p className="text-slate-500 text-xs mt-1">Send periodic SIP OPTIONS</p>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="60"
                            defaultValue="60"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                          />
                          <p className="text-slate-500 text-xs mt-1">Interval in seconds</p>
                        </div>
                      </div>
                      <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-3 mt-3">
                        <p className="text-[#39FF14] text-xs flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Keep-Alive maintains the firewall port open and monitors trunk status. Recommended for NAT environments.</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        RTP Port Range
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="number"
                            placeholder="10000"
                            defaultValue="10000"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                          />
                          <p className="text-slate-500 text-xs mt-1">Start port</p>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="20000"
                            defaultValue="20000"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                          />
                          <p className="text-slate-500 text-xs mt-1">End port</p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs mt-2">
                        Port range for Real-time Transport Protocol (audio/video streams)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <PhoneIncoming className="w-5 h-5 text-green-400" />
                    Call Routing
                  </h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Configure how calls are routed through this trunk
                  </p>

                  <div className="space-y-6">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <h5 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                        <PhoneIncoming className="w-4 h-4 text-green-400" />
                        Inbound Routes (DID Management)
                      </h5>
                      <p className="text-slate-400 text-sm mb-4">
                        Match incoming calls based on DID number and route to destinations
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            DID Number Pattern
                          </label>
                          <input
                            type="text"
                            placeholder="+15550199 or +1555* for wildcard"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                          />
                          <p className="text-slate-500 text-xs mt-1">Enter specific DID or use * for pattern matching</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Route To Destination
                          </label>
                          <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500">
                            <option value="">Select destination type...</option>
                            <option value="extension">Extension</option>
                            <option value="ring_group">Ring Group</option>
                            <option value="ivr">IVR / Digital Receptionist</option>
                            <option value="queue">Call Queue</option>
                            <option value="voicemail">Voicemail</option>
                            <option value="external">External Number</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Destination Details
                          </label>
                          <input
                            type="text"
                            placeholder="Extension number, IVR ID, or Queue ID"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                          />
                          <p className="text-slate-500 text-xs mt-1">Specify the target destination</p>
                        </div>

                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                          + Add Inbound Route
                        </button>
                      </div>

                      <div className="mt-4 bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                        <p className="text-slate-400 text-xs font-medium mb-2">Configured Routes:</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">+15550199 → Extension 100</span>
                            <button className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">+1555* → IVR Main Menu</span>
                            <button className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <h5 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                        <PhoneOutgoing className="w-4 h-4 text-brand-lime" />
                        Outbound Routes (Dial Patterns)
                      </h5>
                      <p className="text-slate-400 text-sm mb-4">
                        Define rules for which outbound calls use this trunk
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Dial Rule Pattern
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 9|1NXXNXXXXXX or 00|."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                          />
                          <p className="text-slate-500 text-xs mt-1">
                            Pattern: prefix|match (e.g., 9|1NXXNXXXXXX for US calls starting with 9)
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Strip Digits
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              defaultValue="0"
                              min="0"
                              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                            />
                            <p className="text-slate-500 text-xs mt-1">Remove N leading digits</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Prepend Digits
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., 1 or 011"
                              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                            />
                            <p className="text-slate-500 text-xs mt-1">Add prefix before sending</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Route Priority
                          </label>
                          <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]">
                            <option value="1">1 - Highest Priority</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5 - Lowest Priority</option>
                          </select>
                          <p className="text-slate-500 text-xs mt-1">Higher priority routes are evaluated first</p>
                        </div>

                        <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-3">
                          <p className="text-[#39FF14] text-xs flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Example:</strong> User dials 91-555-0199, PBX strips "9" (1 digit) and sends 1-555-0199 to provider
                            </span>
                          </p>
                        </div>

                        <button className="w-full bg-[#39FF14] hover:bg-[#32e012] text-white py-2 rounded-lg transition-colors text-sm font-medium">
                          + Add Outbound Route
                        </button>
                      </div>

                      <div className="mt-4 bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                        <p className="text-slate-400 text-xs font-medium mb-2">Configured Routes:</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">9|1NXXNXXXXXX (Strip: 1) → US Calls</span>
                            <button className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">00|. (Strip: 2, Prepend: +) → International</span>
                            <button className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#39FF14]" />
                    Caller ID & Assertion
                  </h4>
                  <p className="text-slate-400 text-sm mb-4">
                    Configure caller identification and authentication headers for outbound calls
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Outbound Caller ID
                      </label>
                      <input
                        type="text"
                        placeholder="+1-555-0199"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                      <p className="text-slate-500 text-xs mt-1">
                        Global default number displayed when making outbound calls from this trunk
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <h5 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#39FF14]" />
                        P-Asserted-Identity (PAI)
                      </h5>
                      <p className="text-slate-400 text-sm mb-3">
                        Carrier-level authentication header for billing and identity verification
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="pai-enabled"
                            className="w-4 h-4 text-[#39FF14] bg-slate-900 border-slate-700 rounded focus:ring-[#39FF14]"
                          />
                          <label htmlFor="pai-enabled" className="text-sm text-slate-300">
                            Enable P-Asserted-Identity Header
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            PAI Number
                          </label>
                          <input
                            type="text"
                            placeholder="+1-555-0199"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                          />
                          <p className="text-slate-500 text-xs mt-1">
                            Number used to prove ownership for billing verification
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            PAI Domain
                          </label>
                          <input
                            type="text"
                            placeholder="sip.provider.com"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                          />
                          <p className="text-slate-500 text-xs mt-1">
                            SIP domain for the P-Asserted-Identity header
                          </p>
                        </div>

                        <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-3">
                          <p className="text-[#39FF14] text-xs flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              PAI is a "hidden" SIP header that carriers use to verify you own the caller ID number you're displaying. Required by most modern carriers for anti-spoofing compliance.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <h5 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        Remote-Party-ID (RPID)
                      </h5>
                      <p className="text-slate-400 text-sm mb-3">
                        Legacy authentication header for older SIP providers
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="rpid-enabled"
                            className="w-4 h-4 text-slate-500 bg-slate-900 border-slate-700 rounded focus:ring-slate-500"
                          />
                          <label htmlFor="rpid-enabled" className="text-sm text-slate-300">
                            Enable Remote-Party-ID Header
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            RPID Number
                          </label>
                          <input
                            type="text"
                            placeholder="+1-555-0199"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-slate-500"
                          />
                          <p className="text-slate-500 text-xs mt-1">
                            Number for legacy Remote-Party-ID header
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            RPID Privacy Setting
                          </label>
                          <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-slate-500">
                            <option value="off">Off (Full Disclosure)</option>
                            <option value="full">Full (Hide All Information)</option>
                            <option value="name">Name Only</option>
                            <option value="uri">URI Only</option>
                          </select>
                          <p className="text-slate-500 text-xs mt-1">
                            Privacy level for the Remote-Party-ID header
                          </p>
                        </div>

                        <div className="bg-slate-600/10 border border-slate-600/30 rounded-lg p-3">
                          <p className="text-slate-400 text-xs flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              RPID is an older standard similar to PAI. Some legacy carriers still require it. Most modern providers use PAI instead.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-3">
                      <p className="text-[#39FF14] text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Important:</strong> Ensure the caller ID numbers match the DIDs authorized by your carrier. Mismatched or unauthorized numbers may result in call rejection or carrier violations.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Capacity & Status</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Concurrent Channels</label>
                      <input
                        type="number"
                        defaultValue={configureModal.item.concurrent_channels}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                      <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="connected">Connected</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Call Direction</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <PhoneIncoming className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Inbound Calls</p>
                          <p className="text-slate-500 text-xs">Allow incoming calls through this trunk</p>
                        </div>
                      </div>
                      <input type="checkbox" id="inbound" defaultChecked={configureModal.item.inbound_enabled} className="w-5 h-5" />
                    </div>

                    <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <PhoneOutgoing className="w-5 h-5 text-[#39FF14]" />
                        <div>
                          <p className="text-white font-medium">Outbound Calls</p>
                          <p className="text-slate-500 text-xs">Allow outgoing calls through this trunk</p>
                        </div>
                      </div>
                      <input type="checkbox" id="outbound" defaultChecked={configureModal.item.outbound_enabled} className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => setConfigureModal({ type: null, item: null })}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setConfigureModal({ type: null, item: null });
                      setNotification({ type: 'success', message: 'SIP trunk configuration saved!' });
                    }}
                    className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`${
            notification.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
          } border backdrop-blur-sm rounded-lg p-4 max-w-md`}>
            <div className="flex items-start gap-3">
              <div className={`${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } rounded-full p-1`}>
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-white text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
