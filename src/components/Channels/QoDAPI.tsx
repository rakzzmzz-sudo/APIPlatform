import { useState, useEffect, useMemo } from 'react';
import {
  Zap, RefreshCw, CheckCircle, AlertTriangle,
  Activity, X, Copy, Search, Trash2, Gauge, Signal,
  Cpu, BarChart3, Sliders, PlayCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const profiles = ['gaming', 'video', 'voice', 'cloud-gaming'];
  const statuses = ['active', 'completed', 'active', 'failed']; // Weighted towards active/completed
  
  for (let i = 0; i < count; i++) {
    const profile = profiles[Math.floor(Math.random() * profiles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isFiveG = Math.random() > 0.3;
    
    // Realistic durations in minutes
    const duration = Math.floor(Math.random() * 120) + 10;
    
    // Latency based on profile
    let latency = 50;
    if (profile === 'gaming') latency = 20;
    if (profile === 'cloud-gaming') latency = 15;
    if (profile === 'voice') latency = 80;
    
    // Add some jitter
    const actualLatency = Math.max(5, latency + (Math.random() * 10 - 5));

    data.push({
      id: `qod_${Math.random().toString(36).substr(2, 9)}`,
      session_id: `ses_${Math.random().toString(36).substr(2, 12)}`,
      phone_number: `+601${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
      qos_profile: profile,
      status: status,
      target_latency_ms: latency,
      actual_latency_ms: Math.floor(actualLatency),
      target_bandwidth_mbps: profile === 'video' ? 50 : 10,
      actual_bandwidth_mbps: profile === 'video' ? Math.floor(45 + Math.random() * 10) : Math.floor(8 + Math.random() * 4),
      network_slice: isFiveG ? '5G-URLLC' : '4G-LTE',
      packet_loss: (Math.random() * 0.5).toFixed(2),
      request_timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60) * 60 * 1000).toISOString()
    });
  }
  return data.sort((a, b) => new Date(b.request_timestamp).getTime() - new Date(a.request_timestamp).getTime());
};

export default function QoDAPI() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'configuration'>('overview');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Advanced feature states
  const [turboMode, setTurboMode] = useState(false);
  const [sliceAllocation, setSliceAllocation] = useState({ gaming: 40, video: 30, voice: 30 });

  // New Session Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newData, setNewData] = useState({
    phone_number: '',
    qos_profile: 'gaming',
    duration: '60'
  });
  const [submitting, setSubmitting] = useState(false);

  // Initialize Data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSessions(generateMockData(50));
      setLoading(false);
    }, 800);
  }, []);

  // Live Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        const newSession = generateMockData(1)[0];
        newSession.request_timestamp = new Date().toISOString();
        setSessions(prev => [newSession, ...prev].slice(0, 100));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived Stats
  const stats = useMemo(() => {
    const total = sessions.length;
    const active = sessions.filter(s => s.status === 'active').length;
    const avgLatency = Math.round(sessions.reduce((acc, curr) => acc + curr.actual_latency_ms, 0) / (total || 1));
    const avgBandwidth = Math.round(sessions.reduce((acc, curr) => acc + curr.actual_bandwidth_mbps, 0) / (total || 1));
    return { total, active, avgLatency, avgBandwidth };
  }, [sessions]);

  const handleCreate = async () => {
    if (!newData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
       const isSuccess = Math.random() > 0.1;
       if (isSuccess) {
         const newSession = generateMockData(1)[0];
         newSession.phone_number = newData.phone_number;
         newSession.qos_profile = newData.qos_profile;
         newSession.status = 'active';
         newSession.request_timestamp = new Date().toISOString();
         
         setSessions(prev => [newSession, ...prev]);
         setNotification({ type: 'success', message: 'QoD session activated successfully' });
         setShowNewModal(false);
         setNewData({ phone_number: '', qos_profile: 'gaming', duration: '60' });
       } else {
         setNotification({ type: 'error', message: 'Failed to activate session (Simulated)' });
       }
       setSubmitting(false);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to terminate this session?')) return;
    setSessions(prev => prev.filter(s => s.id !== id));
    setNotification({ type: 'success', message: 'Session terminated' });
  };

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const sampleConfig = {
    "base_url": "https://api.cpaas.com/v1/qod",
    "auth_header": "Authorization: Bearer <YOUR_API_KEY>",
    "profiles": ["gaming", "video", "iot", "voice", "cloud-gaming"],
    "defaults": {
        "duration_sec": 3600,
        "fallback_behavior": "best_effort"
    }
  };

  const sampleCode = `
// Node.js - Create QoS Session
const axios = require('axios');

async function boostConnection(phoneNumber) {
  try {
    const response = await axios.post('https://api.cpaas.com/v1/qod/sessions', {
      phone_number: phoneNumber,
      profile: "gaming", // Optimized for low latency
      duration_seconds: 3600
    }, {
      headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
    });

    console.log('Session Active:', response.data.session_id);
    console.log('Target Latency:', response.data.target_latency, 'ms');
  } catch (error) {
    console.error('QoD Error:', error.message);
  }
}
  `;

  return (
    <div className="flex-1 bg-[#012419] overflow-y-auto">
      {/* Header */}
      <div className="bg-[#012419] border-b border-[#024d30] p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#39FF14]/10 rounded-xl border border-[#39FF14]/20">
              <Zap className="w-8 h-8 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Quality on Demand (QoD)</h1>
              <p className="text-slate-400 mt-1">Request guaranteed network performance for critical applications.</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button
               onClick={() => setIsLive(!isLive)}
               className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border ${
                 isLive 
                   ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' 
                   : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
               }`}
             >
               <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
               {isLive ? 'Stop Live Feed' : 'Start Live Feed'}
             </button>
             <button
              onClick={() => setShowNewModal(true)}
              className="bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#39FF14]/5"
            >
              <Zap className="w-4 h-4" />
              New Session
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8 border-b border-slate-800">
           {[
            { id: 'overview', label: 'Overview' },
            { id: 'advanced', label: 'Network Slicing' },
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
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {notification && (
          <div className={`p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {notification.message}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <Activity className="w-4 h-4" /> Total Sessions
            </h3>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-white">{stats.total}</p>
                {isLive && <span className="text-xs text-green-400 animate-pulse">+1</span>}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-green-500/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <CheckCircle className="w-4 h-4" /> Active Now
            </h3>
            <p className="text-3xl font-bold text-green-400">{stats.active}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <Gauge className="w-4 h-4" /> Avg Latency
            </h3>
            <p className="text-3xl font-bold text-[#39FF14]">{stats.avgLatency} ms</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-yellow-500/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <Signal className="w-4 h-4" /> Avg Bandwidth
            </h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.avgBandwidth} Mbps</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <h3 className="text-lg font-bold text-white">Recent Sessions</h3>
                    {isLive && <span className="flex items-center gap-1 text-xs text-red-400 font-mono"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>LIVE</span>}
                </div>
                 <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search session ID..."
                    className="bg-[#012419] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#39FF14] w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#012419] text-slate-400 font-medium">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Session ID</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Profile</th>
                      <th className="px-6 py-3">Network</th>
                      <th className="px-6 py-3">Latency</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400">Loading sessions...</td>
                      </tr>
                    ) : sessions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400">No sessions found.</td>
                      </tr>
                    ) : (
                      sessions.slice(0, 15).map((session) => (
                        <tr key={session.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-3 text-slate-400 whitespace-nowrap">
                             {new Date(session.request_timestamp).toLocaleTimeString()} <span className="text-xs opacity-50">{new Date(session.request_timestamp).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-3 text-white font-mono text-xs">{session.session_id}</td>
                          <td className="px-6 py-3 text-slate-300 font-mono">{session.phone_number}</td>
                          <td className="px-6 py-3">
                             <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                session.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                session.status === 'completed' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                             }`}>
                                {session.status.toUpperCase()}
                             </span>
                          </td>
                          <td className="px-6 py-3">
                             <span className="px-2 py-1 bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] rounded text-xs font-medium uppercase">{session.qos_profile}</span>
                          </td>
                           <td className="px-6 py-3">
                             <span className="text-slate-400 text-xs">{session.network_slice}</span>
                          </td>
                          <td className="px-6 py-3 text-[#39FF14] font-mono text-xs">
                             {session.actual_latency_ms} ms
                          </td>
                          <td className="px-6 py-3 text-right">
                             <button
                                onClick={() => handleDelete(session.id)}
                                className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded transition-colors"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Slice Simulator */}
                 <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                           <h3 className="text-lg font-bold text-white">Network Slice Allocation</h3>
                           <p className="text-sm text-slate-400">Simulate bandwidth prioritization per slice.</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#012419] rounded-lg border border-slate-800">
                           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                           <span className="text-xs text-green-400 font-mono">NETWORK: HEALTHY</span>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                       {/* Gaming Slice */}
                       <div>
                          <div className="flex justify-between text-sm mb-2">
                             <span className="flex items-center gap-2 text-[#39FF14]"><Cpu className="w-4 h-4" /> Gaming / VR</span>
                             <span className="text-white font-mono">{sliceAllocation.gaming}%</span>
                          </div>
                          <input 
                             type="range" min="0" max="100" 
                             value={sliceAllocation.gaming}
                             onChange={(e) => setSliceAllocation({...sliceAllocation, gaming: parseInt(e.target.value)})}
                             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
                          />
                       </div>
                       
                       {/* Video Slice */}
                       <div>
                          <div className="flex justify-between text-sm mb-2">
                             <span className="flex items-center gap-2 text-[#39FF14]"><PlayCircle className="w-4 h-4" /> HD Video</span>
                             <span className="text-white font-mono">{sliceAllocation.video}%</span>
                          </div>
                          <input 
                             type="range" min="0" max="100" 
                             value={sliceAllocation.video}
                             onChange={(e) => setSliceAllocation({...sliceAllocation, video: parseInt(e.target.value)})}
                             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                       </div>

                       {/* Voice Slice */}
                       <div>
                          <div className="flex justify-between text-sm mb-2">
                             <span className="flex items-center gap-2 text-[#39FF14]"><Signal className="w-4 h-4" /> Voice / VoIP</span>
                             <span className="text-white font-mono">{sliceAllocation.voice}%</span>
                          </div>
                          <input 
                             type="range" min="0" max="100" 
                             value={sliceAllocation.voice}
                             onChange={(e) => setSliceAllocation({...sliceAllocation, voice: parseInt(e.target.value)})}
                             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
                          />
                       </div>
                    </div>
                </div>

                 {/* Turbo Mode & Metrics */}
                 <div className="space-y-6">
                     <div className={`p-6 rounded-xl border transition-all duration-500 ${
                        turboMode 
                           ? 'bg-gradient-to-br from-[#39FF14]/10 to-[#39FF14]/5 border-[#39FF14]/50 shadow-[0_0_30px_rgba(57,255,20,0.1)]' 
                           : 'bg-slate-900 border-slate-800'
                     }`}>
                        <div className="flex items-center justify-between mb-4">
                           <h3 className={`text-lg font-bold ${turboMode ? 'text-white' : 'text-slate-200'}`}>Turbo Mode</h3>
                           <button 
                             onClick={() => setTurboMode(!turboMode)}
                             className={`w-14 h-8 rounded-full transition-colors relative ${
                               turboMode ? 'bg-green-500' : 'bg-slate-700'
                             }`}
                           >
                              <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                                 turboMode ? 'translate-x-6' : 'translate-x-0'
                              }`} />
                           </button>
                        </div>
                        <p className={`text-sm mb-4 ${turboMode ? 'text-[#39FF14]/80' : 'text-slate-400'}`}>
                           {turboMode 
                              ? 'Priority Routing ACTIVE. Latency minimized for all streams.' 
                              : 'Standard routing active. Enable Turbo for critical traffic.'}
                        </p>
                        {turboMode && (
                           <div className="flex items-center gap-2 text-xs font-mono text-green-300 animate-pulse">
                              <Zap className="w-3 h-3" /> LATENCY -45%
                           </div>
                        )}
                     </div>

                     <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-sm font-medium text-slate-400 mb-4">Real-time Quality</h3>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-300">Jitter</span>
                              <span className="text-white font-mono">2.4 ms</span>
                           </div>
                           <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full w-[15%]"></div>
                           </div>
                           
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-300">Packet Loss</span>
                              <span className="text-white font-mono">0.05 %</span>
                           </div>
                           <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full w-[2%]"></div>
                           </div>
                        </div>
                     </div>
                 </div>
              </div>
           </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'configuration' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Sample Configuration</h3>
                 <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-sm text-[#39FF14]/70 overflow-x-auto">
                    <pre>{JSON.stringify(sampleConfig, null, 2)}</pre>
                 </div>
                 <button className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" /> Copy Configuration
                 </button>
               </div>

               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Integration Example</h3>
                 <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-sm text-[#39FF14] overflow-x-auto">
                    <pre>{sampleCode.trim()}</pre>
                 </div>
                 <button className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" /> Copy Code
                 </button>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">API Features</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-[#39FF14]/30 transition-all">
                     <Gauge className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Latency Guarantee</h4>
                     <p className="text-sm text-slate-400">Ensure consistent low latency for gaming and real-time apps.</p>
                  </div>
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-[#39FF14]/30 transition-all">
                     <Signal className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Bandwidth Priority</h4>
                     <p className="text-sm text-slate-400">Reserve dedicated throughout during congestion.</p>
                  </div>
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-[#39FF14]/30 transition-all">
                     <RefreshCw className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Dynamic Control</h4>
                     <p className="text-sm text-slate-400">Start and stop QoS sessions programmatically on the fly.</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

       {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
               <h3 className="text-xl font-bold text-white">Start QoD Session</h3>
               <button onClick={() => setShowNewModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full bg-[#012419] border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="+1234567890"
                    value={newData.phone_number}
                    onChange={(e) => setNewData({ ...newData, phone_number: e.target.value })}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Profile</label>
                  <select
                     className="w-full bg-[#012419] border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                     value={newData.qos_profile}
                     onChange={(e) => setNewData({ ...newData, qos_profile: e.target.value })}
                  >
                     <option value="gaming">Gaming (Low Latency)</option>
                     <option value="video">Video Streaming (High BW)</option>
                     <option value="voice">Voice Call (Reliability)</option>
                     <option value="cloud-gaming">Cloud Gaming (Ultra Low Latency)</option>
                  </select>
               </div>
               <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowNewModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={submitting}
                    className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {submitting ? 'Creating...' : 'Create Session'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
