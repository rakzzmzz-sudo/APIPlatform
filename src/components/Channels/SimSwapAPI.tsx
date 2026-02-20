import { useState, useEffect, useMemo } from 'react';
import {
  Shield, RefreshCw, CheckCircle, AlertTriangle,
  Clock, X, Code, Copy, Smartphone, Search, Filter, Trash2,
  Activity, BarChart3, Settings, Zap, Globe, Lock, Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const providers = ['Maxis', 'Celcom', 'DiGi', 'U Mobile'];
  for (let i = 0; i < count; i++) {
    const isSwap = Math.random() > 0.85; // 15% swap chance
    data.push({
      id: `req_${Math.random().toString(36).substr(2, 9)}`,
      phone_number: `+601${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
      swap_detected: isSwap,
      fraud_score: isSwap ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 20),
      last_swap_date: isSwap ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString() : null,
      network_provider: providers[Math.floor(Math.random() * providers.length)],
      response_time_ms: Math.floor(Math.random() * 200) + 50,
      request_timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60) * 60 * 1000).toISOString()
    });
  }
  return data.sort((a, b) => new Date(b.request_timestamp).getTime() - new Date(a.request_timestamp).getTime());
};

export default function SimSwapAPI() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'configuration'>('overview');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLive, setIsLive] = useState(false);

  // New Request Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newData, setNewData] = useState({
    phone_number: '',
    lookback_days: '7'
  });
  const [submitting, setSubmitting] = useState(false);

  // Advanced Settings State
  const [riskThreshold, setRiskThreshold] = useState(70);
  const [autoBlock, setAutoBlock] = useState(true);
  const [notifyWebhook, setNotifyWebhook] = useState(false);

  // Initialize Data
  useEffect(() => {
    setLoading(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setRequests(generateMockData(50));
      setLoading(false);
    }, 800);
  }, []);

  // Live Simulation Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        const newReq = generateMockData(1)[0];
        // Override timestamp to be "now"
        newReq.request_timestamp = new Date().toISOString();
        setRequests(prev => [newReq, ...prev].slice(0, 100)); // Keep last 100
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived Stats
  const stats = useMemo(() => {
    const total = requests.length;
    const swaps = requests.filter(r => r.swap_detected).length;
    const avgScore = Math.round(requests.reduce((acc, curr) => acc + curr.fraud_score, 0) / (total || 1));
    const avgTime = Math.round(requests.reduce((acc, curr) => acc + curr.response_time_ms, 0) / (total || 1));
    return { total, swaps, avgScore, avgTime };
  }, [requests]);

  const handleCreate = async () => {
    if (!newData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const isSwap = Math.random() > 0.7;
      const newReq = {
        id: `req_${Date.now()}`,
        phone_number: newData.phone_number,
        swap_detected: isSwap,
        fraud_score: isSwap ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 20),
        last_swap_date: isSwap ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : null,
        network_provider: 'Maxis', // Mock
        response_time_ms: Math.floor(Math.random() * 150) + 50,
        request_timestamp: new Date().toISOString()
      };
      setRequests(prev => [newReq, ...prev]);
      setNotification({ type: 'success', message: 'Check completed successfully' });
      setShowNewModal(false);
      setNewData({ phone_number: '', lookback_days: '7' });
      setSubmitting(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    setRequests(prev => prev.filter(r => r.id !== id));
    setNotification({ type: 'success', message: 'Record deleted' });
  };

  const sampleConfig = {
    "base_url": "https://api.cpaas.com/v1/sim-swap",
    "auth_header": "Authorization: Bearer <YOUR_API_KEY>",
    "timeout_ms": 5000,
    "retry_policy": {
      "max_retries": 3,
      "backoff_factor": 2
    }
  };

  const sampleCode = `
// Node.js Example
const axios = require('axios');

async function checkSimSwap(phoneNumber) {
  try {
    const response = await axios.post('https://api.cpaas.com/v1/sim-swap/check', {
      phone_number: phoneNumber,
      lookback_hours: 168 // 7 days
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });

    if (response.data.swapped) {
      console.log('SIM Swap detected!');
    } else {
      console.log('SIM is safe.');
    }
  } catch (error) {
    console.error('Error checking SIM swap:', error);
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
              <Shield className="w-8 h-8 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">SIM Swap Detection</h1>
              <p className="text-slate-400 mt-1">Protect user accounts by detecting recent SIM card changes before sending OTPs.</p>
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
              className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#39FF14]/5"
            >
              <RefreshCw className="w-4 h-4" />
              Check Number
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8 border-b border-slate-800">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'advanced', label: 'Advanced Stats' },
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

        {/* Stats Summary - Visible on Overview and Advanced */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Total Checks
            </h3>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-white">{stats.total}</p>
               {isLive && <span className="text-xs text-green-400 animate-pulse">+1 just now</span>}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Swaps Detected
            </h3>
            <p className="text-3xl font-bold text-[#39FF14]">{stats.swaps}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Avg Risk Score
            </h3>
            <p className="text-3xl font-bold text-[#39FF14]">{stats.avgScore}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Avg Latency
            </h3>
            <p className="text-3xl font-bold text-[#39FF14]">{stats.avgTime} ms</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <h3 className="text-lg font-bold text-white">Recent Checks</h3>
                   {isLive && <span className="flex items-center gap-1 text-xs text-red-400 font-mono"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>LIVE</span>}
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search phone number..."
                    className="bg-[#012419] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#39FF14] w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#012419] text-slate-400 font-medium">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Phone Number</th>
                      <th className="px-6 py-3">Provider</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Risk Score</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading requests...</td>
                      </tr>
                    ) : requests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No requests found.</td>
                      </tr>
                    ) : (
                      requests.slice(0, 15).map((req) => (
                        <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-3 text-slate-400 whitespace-nowrap">
                             {new Date(req.request_timestamp).toLocaleTimeString()} <span className="text-xs opacity-50">{new Date(req.request_timestamp).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-3 text-white font-mono">{req.phone_number}</td>
                          <td className="px-6 py-3 text-slate-300">{req.network_provider}</td>
                          <td className="px-6 py-3">
                             <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                req.swap_detected ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                             }`}>
                                {req.swap_detected ? 'SWAP DETECTED' : 'SAFE'}
                             </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                               <div className="flex-1 w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${req.fraud_score > 70 ? 'bg-red-500' : req.fraud_score > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                    style={{ width: `${req.fraud_score}%` }}
                                  />
                               </div>
                               <span className="text-xs text-slate-400 w-6">{req.fraud_score}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right">
                             <button
                                onClick={() => handleDelete(req.id)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Distribution Chart Mock */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                   <h3 className="text-lg font-bold text-white mb-6">Risk Score Distribution</h3>
                   <div className="h-64 flex items-end justify-center gap-4 px-4">
                      {[10, 25, 45, 80, 50, 30, 15, 5].map((h, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div 
                              className={`w-full rounded-t-lg transition-all duration-500 ${i > 5 ? 'bg-red-500/80 group-hover:bg-red-400' : 'bg-[#39FF14]/50 group-hover:bg-[#39FF14]'}`}
                              style={{ height: `${h}%` }}
                            ></div>
                            <span className="text-xs text-slate-500">{i * 10}-{(i+1)*10}</span>
                         </div>
                      ))}
                   </div>
                   <div className="flex justify-between mt-4 text-xs text-slate-400 px-2">
                      <span>Low Risk (0-30)</span>
                      <span>Medium Risk (31-70)</span>
                      <span>High Risk (71-100)</span>
                   </div>
                </div>

                {/* Configuration Panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                   <h3 className="text-lg font-bold text-white mb-6">Advanced Risk Settings</h3>
                   <div className="space-y-6">
                      <div>
                         <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">Risk Threshold Score</label>
                            <span className="text-sm font-bold text-[#39FF14]">{riskThreshold}</span>
                         </div>
                         <input 
                           type="range" 
                           min="0" 
                           max="100" 
                           value={riskThreshold} 
                           onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                           className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                         />
                         <p className="text-xs text-slate-500 mt-2">Scores above this threshold will trigger high-risk alerts.</p>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#012419] rounded-lg border border-slate-800">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#39FF14]/10 rounded-lg text-[#39FF14]">
                               <Lock className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="text-sm font-medium text-white">Auto-Block Swapped Sims</h4>
                               <p className="text-xs text-slate-400">Automatically flag transactions from swapped numbers.</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => setAutoBlock(!autoBlock)}
                           className={`w-12 h-6 rounded-full transition-colors relative ${
                             autoBlock ? 'bg-[#39FF14]' : 'bg-slate-700'
                           }`}
                         >
                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                               autoBlock ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                         </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#012419] rounded-lg border border-slate-800">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#39FF14]/10 rounded-lg text-[#39FF14]">
                               <Bell className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="text-sm font-medium text-white">Real-time Webhook</h4>
                               <p className="text-xs text-slate-400">Send JSON payload to configured URL on detection.</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => setNotifyWebhook(!notifyWebhook)}
                           className={`w-12 h-6 rounded-full transition-colors relative ${
                             notifyWebhook ? 'bg-[#39FF14]' : 'bg-slate-700'
                           }`}
                         >
                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                               notifyWebhook ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                         </button>
                      </div>
                   </div>
                </div>
              </div>

              {/* Provider Performance Mock */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-6">Provider Latency (Real-time)</h3>
                 <div className="space-y-4">
                    {['Maxis', 'Celcom', 'DiGi', 'U Mobile'].map((provider) => (
                       <div key={provider} className="flex items-center gap-4">
                          <div className="w-24 text-sm font-medium text-slate-400">{provider}</div>
                          <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-[#39FF14] to-[#32e012] rounded-full transition-all duration-1000"
                               style={{ width: `${Math.random() * 40 + 20}%` }}
                             />
                          </div>
                          <div className="w-16 text-right text-sm font-mono text-[#39FF14]">
                             {Math.floor(Math.random() * 50 + 20)}ms
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'configuration' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">JSON Configuration</h3>
                    <div className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">v1.2.0</div>
                 </div>
                 <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-xs md:text-sm text-[#39FF14] overflow-x-auto">
                    <pre>{JSON.stringify(sampleConfig, null, 2)}</pre>
                 </div>
                 <button className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" /> Copy Configuration
                 </button>
               </div>

               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Integration Example</h3>
                    <div className="flex gap-2">
                       <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-xs">Node.js</span>
                       <span className="px-2 py-1 bg-slate-800 text-slate-500 border border-slate-700 rounded text-xs">Python</span>
                    </div>
                 </div>
                 <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-xs md:text-sm text-[#39FF14] overflow-x-auto">
                    <pre>{sampleCode.trim()}</pre>
                 </div>
                 <button className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" /> Copy Code
                 </button>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">API Capabilities</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-[#39FF14]/30 transition-colors">
                     <AlertTriangle className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Real-time Anomaly Detection</h4>
                     <p className="text-sm text-slate-400">Instantly flag transactions when a SIM swap event is detected within the timestamp window.</p>
                  </div>
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-[#39FF14]/30 transition-colors">
                     <Globe className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Global Carrier Coverage</h4>
                     <p className="text-sm text-slate-400">Connect to over 800+ mobile networks worldwide through a single unified API.</p>
                  </div>
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-green-500/30 transition-colors">
                     <Shield className="w-6 h-6 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Compliance Ready</h4>
                     <p className="text-sm text-slate-400">Fully compliant with GDPR and CCPA data privacy regulations for user tracking.</p>
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
               <h3 className="text-xl font-bold text-white">New SIM Check</h3>
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
                  <label className="block text-sm font-medium text-slate-400 mb-1">Lookback Period</label>
                  <select
                     className="w-full bg-[#012419] border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                     value={newData.lookback_days}
                     onChange={(e) => setNewData({ ...newData, lookback_days: e.target.value })}
                  >
                     <option value="1">24 Hours</option>
                     <option value="3">3 Days</option>
                     <option value="7">7 Days (Standard)</option>
                     <option value="15">15 Days</option>
                     <option value="30">30 Days</option>
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
                    className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-black py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {submitting ? 'Checking...' : 'Run Check'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
