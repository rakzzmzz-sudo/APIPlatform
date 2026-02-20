import { useState, useEffect, useMemo } from 'react';
import {
  Smartphone, RefreshCw, CheckCircle, AlertTriangle,
  Lock, X, Copy, Search, Trash2, Shield, Activity,
  BarChart3, Settings, Zap, Globe, Clock, ThumbsUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const networks = ['Maxis', 'Celcom', 'DiGi', 'U Mobile'];
  const methods = ['Network Auth', 'Silent OTP', 'Flash Call', 'SMS OTP'];
  
  for (let i = 0; i < count; i++) {
    const isVerified = Math.random() > 0.2; // 80% success rate
    const method = methods[Math.floor(Math.random() * methods.length)];
    
    // Latency depends on method
    let baseLatency = 100;
    if (method === 'SMS OTP') baseLatency = 5000;
    else if (method === 'Flash Call') baseLatency = 3000;
    
    data.push({
      id: `req_${Math.random().toString(36).substr(2, 9)}`,
      phone_number: `+601${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
      verification_method: method,
      is_verified: isVerified,
      match_score: isVerified ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40),
      network_name: networks[Math.floor(Math.random() * networks.length)],
      network_type: ['4G', '5G', 'LTE'][Math.floor(Math.random() * 3)],
      response_time_ms: Math.floor(Math.random() * 500) + baseLatency,
      request_timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60) * 60 * 1000).toISOString()
    });
  }
  return data.sort((a, b) => new Date(b.request_timestamp).getTime() - new Date(a.request_timestamp).getTime());
};

export default function NumberVerificationAPI() {
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
    verification_method: 'Network Auth'
  });
  const [submitting, setSubmitting] = useState(false);

  // Advanced Settings State
  const [allowFailover, setAllowFailover] = useState(true);
  const [voiceFallback, setVoiceFallback] = useState(false);
  const [geoLock, setGeoLock] = useState(false);

  // Initialize Data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRequests(generateMockData(50));
      setLoading(false);
    }, 800);
  }, []);

  // Live Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        const newReq = generateMockData(1)[0];
        newReq.request_timestamp = new Date().toISOString();
        setRequests(prev => [newReq, ...prev].slice(0, 100));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived Stats
  const stats = useMemo(() => {
    const total = requests.length;
    const verified = requests.filter(r => r.is_verified).length;
    const rate = total > 0 ? Math.round((verified / total) * 100) : 0;
    const avgScore = Math.round(requests.reduce((acc, curr) => acc + curr.match_score, 0) / (total || 1));
    const avgLatency = Math.round(requests.reduce((acc, curr) => acc + curr.response_time_ms, 0) / (total || 1));
    return { total, verified, rate, avgScore, avgLatency };
  }, [requests]);

  const handleCreate = async () => {
    if (!newData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const isVerified = Math.random() > 0.3;
      const networks = ['Maxis', 'Celcom', 'DiGi', 'U Mobile'];
      
      const newReq = {
        id: `req_${Date.now()}`,
        phone_number: newData.phone_number,
        verification_method: newData.verification_method,
        is_verified: isVerified,
        match_score: isVerified ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40),
        network_name: networks[Math.floor(Math.random() * networks.length)],
        network_type: '5G',
        response_time_ms: Math.floor(Math.random() * 200) + 100,
        request_timestamp: new Date().toISOString()
      };

      setRequests(prev => [newReq, ...prev]);
      setNotification({ 
        type: isVerified ? 'success' : 'error', 
        message: isVerified ? 'Number verified successfully' : 'Verification failed' 
      });
      setShowNewModal(false);
      setNewData({ phone_number: '', verification_method: 'Network Auth' });
      setSubmitting(false);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    setRequests(prev => prev.filter(r => r.id !== id));
    setNotification({ type: 'success', message: 'Record deleted' });
  };

  const sampleConfig = {
    "base_url": "https://api.cpaas.com/v1/number-verify",
    "auth_header": "Authorization: Bearer <YOUR_API_KEY>",
    "workflow": {
      "silent_auth_enabled": true,
      "fallback_channels": ["sms", "voice", "whatsapp"],
      "timeout_sec": 30
    }
  };

  const sampleCode = `
// Node.js - Seamless Verification
const axios = require('axios');

async function verifyNumber(phoneNumber) {
  try {
    // Step 1: Attempt Silent Network Auth
    const auth = await axios.post('https://api.cpaas.com/v1/number-verify/auth', {
      phone_number: phoneNumber,
      redirect_uri: 'https://myapp.com/callback'
    }, { headers: { 'Authorization': 'Bearer KEY' } });

    console.log('Auth URL:', auth.data.url);

    // Step 2: On Callback, validate token
    // ...
  } catch (error) {
    // Step 3: Fallback to OTP if silent auth fails
    console.log('Silent auth unavailable, falling back to SMS...');
    await sendSmsOtp(phoneNumber);
  }
}
  `;

  return (
    <div className="flex-1 bg-[#012419] overflow-y-auto">
      {/* Header */}
      <div className="bg-[#012419] border-b border-[#024d30] p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <Smartphone className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Number Verification</h1>
              <p className="text-slate-400 mt-1">Silent, secure phone number verification utilizing carrier networks.</p>
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
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20"
            >
              <RefreshCw className="w-4 h-4" />
              Verify Number
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8 border-b border-slate-800">
           {[
            { id: 'overview', label: 'Overview' },
            { id: 'advanced', label: 'Advanced Metrics' },
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
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-green-500/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <Activity className="w-4 h-4" /> Total Verifications
            </h3>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-white">{stats.total}</p>
               {isLive && <span className="text-xs text-green-400 animate-pulse">+1 just now</span>}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-green-500/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <ThumbsUp className="w-4 h-4" /> Success Rate
            </h3>
            <p className="text-3xl font-bold text-green-400">{stats.rate}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <Shield className="w-4 h-4" /> Avg Authenticity
            </h3>
            <p className="text-3xl font-bold text-[#39FF14]">{stats.avgScore}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <Zap className="w-4 h-4" /> Avg Latency
            </h3>
            <p className="text-3xl font-bold text-[#39FF14]">{stats.avgLatency} (ms)</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <h3 className="text-lg font-bold text-white">Recent Verifications</h3>
                   {isLive && <span className="flex items-center gap-1 text-xs text-red-400 font-mono"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>LIVE</span>}
                </div>
                 <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search phone number..."
                    className="bg-[#012419] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#012419] text-slate-400 font-medium">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Phone Number</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Network</th>
                      <th className="px-6 py-3">Method</th>
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
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No verifications found.</td>
                      </tr>
                    ) : (
                      requests.slice(0, 15).map((req) => (
                        <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-3 text-slate-400 whitespace-nowrap">
                             {new Date(req.request_timestamp).toLocaleTimeString()} <span className="text-xs opacity-50">{new Date(req.request_timestamp).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-3 text-white font-mono">{req.phone_number}</td>
                          <td className="px-6 py-3">
                             <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                req.is_verified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                             }`}>
                                {req.is_verified ? 'VERIFIED' : 'FAILED'}
                             </span>
                          </td>
                          <td className="px-6 py-3 text-slate-300">
                             {req.network_name || '-'}
                          </td>
                          <td className="px-6 py-3">
                             <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400">{req.verification_method}</span>
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
                 {/* Success Rate by Method */}
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                     <h3 className="text-lg font-bold text-white mb-6">Success Rate by Method</h3>
                     <div className="space-y-4">
                        {[
                           { m: 'Network Auth', v: 98, c: 'bg-green-500' },
                           { m: 'Silent OTP', v: 92, c: 'bg-[#39FF14]' },
                           { m: 'Flash Call', v: 85, c: 'bg-yellow-500' },
                           { m: 'SMS OTP', v: 78, c: 'bg-slate-500' }
                        ].map(item => (
                           <div key={item.m}>
                              <div className="flex justify-between text-sm mb-1">
                                 <span className="text-slate-300">{item.m}</span>
                                 <span className="text-white font-bold">{item.v}%</span>
                              </div>
                              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className={`h-full ${item.c}`} style={{ width: `${item.v}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                 </div>

                 {/* Advanced Settings */}
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Failover Logic</h3>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[#012419] rounded-lg border border-slate-800">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#39FF14]/20/10 rounded-lg text-[#39FF14]">
                                 <RefreshCw className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-medium text-white">Auto-Failover</h4>
                                 <p className="text-xs text-slate-400">Try next method if primary fails.</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setAllowFailover(!allowFailover)}
                             className={`w-12 h-6 rounded-full transition-colors relative ${
                               allowFailover ? 'bg-green-600' : 'bg-slate-700'
                             }`}
                           >
                              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                 allowFailover ? 'translate-x-6' : 'translate-x-0'
                              }`} />
                           </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#012419] rounded-lg border border-slate-800">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#39FF14]/10 rounded-lg text-[#39FF14]">
                                 <Smartphone className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-medium text-white">Voice Fallback</h4>
                                 <p className="text-xs text-slate-400">Use TTS call if SMS fails.</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setVoiceFallback(!voiceFallback)}
                             className={`w-12 h-6 rounded-full transition-colors relative ${
                               voiceFallback ? 'bg-green-600' : 'bg-slate-700'
                             }`}
                           >
                              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                 voiceFallback ? 'translate-x-6' : 'translate-x-0'
                              }`} />
                           </button>
                        </div>
                     </div>
                 </div>
              </div>

              {/* Geographic Performance */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-6">Regional Latency Map (Mock)</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                       { region: 'Kuala Lumpur', lat: '45ms' },
                       { region: 'Penang', lat: '120ms' },
                       { region: 'Johor Bahru', lat: '80ms' },
                       { region: 'Sabah/Sarawak', lat: '320ms' }
                    ].map(r => (
                       <div key={r.region} className="bg-[#012419] p-4 rounded-lg text-center border border-slate-800">
                          <div className="text-slate-400 text-sm mb-1">{r.region}</div>
                          <div className="text-xl font-bold text-white">{r.lat}</div>
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
                 <h3 className="text-lg font-bold text-white mb-4">Sample Configuration</h3>
                 <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-sm text-green-300 overflow-x-auto">
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
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-green-500/30 transition-all">
                     <Lock className="w-6 h-6 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Silent Auth</h4>
                     <p className="text-sm text-slate-400">Verify numbers without user interaction or SMS.</p>
                  </div>
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-[#39FF14]/30 transition-all">
                     <Shield className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Carrier Grade</h4>
                     <p className="text-sm text-slate-400">Direct integration with MNOs for high reliability.</p>
                  </div>
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-[#39FF14]/30 transition-all">
                     <CheckCircle className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Instant Results</h4>
                     <p className="text-sm text-slate-400">Get verification status in milliseconds.</p>
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
               <h3 className="text-xl font-bold text-white">New Verification</h3>
               <button onClick={() => setShowNewModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full bg-[#012419] border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    placeholder="+1234567890"
                    value={newData.phone_number}
                    onChange={(e) => setNewData({ ...newData, phone_number: e.target.value })}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Method</label>
                  <select
                     className="w-full bg-[#012419] border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                     value={newData.verification_method}
                     onChange={(e) => setNewData({ ...newData, verification_method: e.target.value })}
                  >
                     <option value="Network Auth">Network Authentication (Silent)</option>
                     <option value="Silent OTP">Silent OTP</option>
                     <option value="Flash Call">Flash Call</option>
                     <option value="SMS OTP">SMS OTP</option>
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
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {submitting ? 'Verifying...' : 'Verify Now'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
