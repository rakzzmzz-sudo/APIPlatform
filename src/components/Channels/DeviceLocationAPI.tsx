import { useState, useEffect, useMemo } from 'react';
import {
  MapPin, RefreshCw, CheckCircle, AlertTriangle,
  Navigation, X, Copy, Search, Trash2, Globe, Target,
  Activity, Zap, Layout, Smartphone, Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock Data Generator
const generateMockData = (count: number) => {
  const data = [];
  const cities = ['Kuala Lumpur', 'Petaling Jaya', 'Johor Bahru', 'Penang', 'Shah Alam'];
  const statuses = ['Located', 'Consent Pending', 'Failed', 'Located']; // Weighted towards success
  
  for (let i = 0; i < count; i++) {
    const isSuccess = Math.random() > 0.1;
    const status = isSuccess ? 'Located' : (Math.random() > 0.5 ? 'Consent Pending' : 'Failed');
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // Base coords for KL
    const lat = 3.1390 + (Math.random() - 0.5) * 0.1;
    const lng = 101.6869 + (Math.random() - 0.5) * 0.1;
    
    data.push({
      id: `req_${Math.random().toString(36).substr(2, 9)}`,
      phone_number: `+601${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
      status: status,
      latitude: isSuccess ? lat : null,
      longitude: isSuccess ? lng : null,
      accuracy_meters: isSuccess ? Math.floor(Math.random() * 50) + 5 : null,
      city: isSuccess ? city : '-',
      request_type: Math.random() > 0.3 ? 'Precise (GNSS)' : 'Coarse (Network)',
      response_time_ms: Math.floor(Math.random() * 800) + 200,
      request_timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60) * 60 * 1000).toISOString()
    });
  }
  return data.sort((a, b) => new Date(b.request_timestamp).getTime() - new Date(a.request_timestamp).getTime());
};

export default function DeviceLocationAPI() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'configuration'>('overview');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLive, setIsLive] = useState(false);

  // New Request Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newData, setNewData] = useState({
    phone_number: '',
    request_type: 'Precise (GNSS)'
  });
  const [submitting, setSubmitting] = useState(false);

  // Advanced Settings
  const [geofenceActive, setGeofenceActive] = useState(false);
  const [trackingMode, setTrackingMode] = useState(false);

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
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived Stats
  const stats = useMemo(() => {
    const total = requests.length;
    const located = requests.filter(r => r.status === 'Located').length;
    const rate = total > 0 ? Math.round((located / total) * 100) : 0;
    const avgAccuracy = Math.round(
      requests.filter(r => r.accuracy_meters).reduce((acc, curr) => acc + curr.accuracy_meters, 0) / (located || 1)
    );
    const avgLatency = Math.round(requests.reduce((acc, curr) => acc + curr.response_time_ms, 0) / (total || 1));
    return { total, rate, avgAccuracy, avgLatency };
  }, [requests]);

  const handleCreate = async () => {
    if (!newData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;
      const lat = 3.1390 + (Math.random() - 0.5) * 0.1;
      const lng = 101.6869 + (Math.random() - 0.5) * 0.1;
      const city = ['Kuala Lumpur', 'Petaling Jaya'][Math.floor(Math.random() * 2)];

      const newReq = {
        id: `req_${Date.now()}`,
        phone_number: newData.phone_number,
        status: isSuccess ? 'Located' : 'Failed',
        latitude: isSuccess ? lat : null,
        longitude: isSuccess ? lng : null,
        accuracy_meters: isSuccess ? Math.floor(Math.random() * 50) + 5 : null,
        city: isSuccess ? city : '-',
        request_type: newData.request_type,
        response_time_ms: Math.floor(Math.random() * 400) + 200,
        request_timestamp: new Date().toISOString()
      };

      setRequests(prev => [newReq, ...prev]);
      setNotification({ 
        type: isSuccess ? 'success' : 'error', 
        message: isSuccess ? 'Device located successfully' : 'Location request failed' 
      });
      setShowNewModal(false);
      setNewData({ phone_number: '', request_type: 'Precise (GNSS)' });
      setSubmitting(false);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this record?')) return;
    setRequests(prev => prev.filter(r => r.id !== id));
    setNotification({ type: 'success', message: 'Record deleted' });
  };

  const sampleConfig = {
    "base_url": "https://api.cpaas.com/v1/location",
    "auth_header": "Authorization: Bearer <YOUR_API_KEY>",
    "settings": {
       "consent_flow": "network_initiated",
       "cache_age": 300
    }
  };

  const sampleCode = `
// Node.js - Retrieve Location
const axios = require('axios');

async function locateDevice(phoneNumber) {
  try {
    const response = await axios.post('https://api.cpaas.com/v1/location/retrieve', {
      phone_number: phoneNumber,
      type: "precise"
    }, {
      headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
    });

    if (response.data.status === 'located') {
       console.log(\`Device at \${response.data.lat}, \${response.data.lng}\`);
       console.log(\`Accuracy: \${response.data.accuracy} meters\`);
    } else {
       console.log('Location status:', response.data.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
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
              <MapPin className="w-8 h-8 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Device Location</h1>
              <p className="text-slate-400 mt-1">Retrieve precise device coordinates or verify location against geofences.</p>
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
              className="bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#39FF14]/20"
            >
              <Navigation className="w-4 h-4" />
              Locate Device
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8 border-b border-slate-800">
           {[
            { id: 'overview', label: 'Overview' },
            { id: 'advanced', label: 'Live Map & Geofencing' },
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
               <Globe className="w-4 h-4" /> Total Requests
            </h3>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-white">{stats.total}</p>
               {isLive && <span className="text-xs text-green-400 animate-pulse">+1 just now</span>}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-green-500/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <CheckCircle className="w-4 h-4" /> Success Rate
            </h3>
            <p className="text-3xl font-bold text-green-400">{stats.rate}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[#39FF14]/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <Target className="w-4 h-4" /> Avg Accuracy
            </h3>
            <p className="text-3xl font-bold text-[#39FF14]">{stats.avgAccuracy} m</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-yellow-500/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
               <Zap className="w-4 h-4" /> Avg Latency
            </h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.avgLatency} ms</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <h3 className="text-lg font-bold text-white">Recent Locations</h3>
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
                      <th className="px-6 py-3">Coordinates</th>
                      <th className="px-6 py-3">Accuracy</th>
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
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No requests found.</td>
                      </tr>
                    ) : (
                      requests.slice(0, 15).map((req) => (
                        <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-3 text-slate-400 whitespace-nowrap">
                             {new Date(req.request_timestamp).toLocaleTimeString()} <span className="text-xs opacity-50">{new Date(req.request_timestamp).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-3 text-white font-mono">{req.phone_number}</td>
                          <td className="px-6 py-3">
                             {req.status === 'Located' ? (
                                <span className="text-[#39FF14] font-mono text-xs">{req.latitude?.toFixed(4)}, {req.longitude?.toFixed(4)}</span>
                             ) : (
                                <span className="text-red-400 text-xs italic">{req.status}</span>
                             )}
                          </td>
                          <td className="px-6 py-3 text-slate-300">
                             {req.accuracy_meters ? `${req.accuracy_meters}m` : '-'}
                          </td>
                          <td className="px-6 py-3">
                             <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400">{req.request_type}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Live Map Representation */}
                 <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-hidden">
                     <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Live Device Map</h3>
                        <div className="flex gap-2 text-xs">
                           <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-[#39FF14]"></span> Active</span>
                           <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Moving</span>
                        </div>
                     </div>
                     <div className="relative h-96 bg-[#012419] m-1 rounded-lg overflow-hidden group">
                        {/* Mock Map Texture */}
                        <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)',
                              backgroundSize: '20px 20px'
                        }}></div>
                        
                        {/* Mock Devices */}
                        {[...Array(8)].map((_, i) => (
                           <div 
                              key={i}
                              className="absolute w-3 h-3 bg-[#39FF14] rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)] transition-all duration-[3000ms] ease-in-out"
                              style={{
                                 top: `${20 + Math.random() * 60}%`,
                                 left: `${20 + Math.random() * 60}%`,
                              }}
                           >
                              <div className="absolute -top-6 -left-8 bg-slate-800 px-2 py-0.5 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                 Device_0{i+1}
                              </div>
                           </div>
                        ))}

                        {/* Geofence Zone */}
                        {geofenceActive && (
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#39FF14]/50 bg-[#39FF14]/10 rounded-full flex items-center justify-center animate-pulse">
                              <span className="text-[#39FF14] text-xs font-bold bg-slate-900/50 px-2 py-1 rounded">Restricted Zone</span>
                           </div>
                        )}
                     </div>
                 </div>

                 {/* Controls */}
                 <div className="space-y-6">
                     <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Geofencing</h3>
                        <div className="flex items-center justify-between p-4 bg-[#012419] rounded-lg border border-slate-800 mb-4">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#39FF14]/10 rounded-lg text-[#39FF14]">
                                 <Target className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-medium text-white">Active Monitor</h4>
                                 <p className="text-xs text-slate-400">Alert on zone entry/exit.</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setGeofenceActive(!geofenceActive)}
                             className={`w-12 h-6 rounded-full transition-colors relative ${
                               geofenceActive ? 'bg-[#39FF14]' : 'bg-slate-700'
                             }`}
                           >
                              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                 geofenceActive ? 'translate-x-6' : 'translate-x-0'
                              }`} />
                           </button>
                        </div>
                        <div className="text-xs text-slate-500">
                           <p>Current Zone: <strong>Kuala Lumpur Central</strong></p>
                           <p>Radius: <strong>5 km</strong></p>
                           <p>Tracked Devices: <strong>12</strong></p>
                        </div>
                     </div>

                     <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Tracking Mode</h3>
                        <div className="flex items-center justify-between p-4 bg-[#012419] rounded-lg border border-slate-800 mb-4">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#39FF14]/20/10 rounded-lg text-[#39FF14]">
                                 <Navigation className="w-5 h-5" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-medium text-white">Real-time Path</h4>
                                 <p className="text-xs text-slate-400">High frequency updates.</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setTrackingMode(!trackingMode)}
                             className={`w-12 h-6 rounded-full transition-colors relative ${
                               trackingMode ? 'bg-[#39FF14]' : 'bg-slate-700'
                             }`}
                           >
                              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                 trackingMode ? 'translate-x-6' : 'translate-x-0'
                              }`} />
                           </button>
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
                 <div className="bg-[#012419] p-4 rounded-lg border border-slate-800 font-mono text-sm text-[#39FF14] overflow-x-auto">
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
                     <Target className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">High Precision</h4>
                     <p className="text-sm text-slate-400">Get location accuracy down to 5-10 meters using GNSS/Network triangulation.</p>
                  </div>
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-[#39FF14]/30 transition-all">
                     <Globe className="w-6 h-6 text-[#39FF14] mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Global Coverage</h4>
                     <p className="text-sm text-slate-400">Locate devices across multiple countries and networks.</p>
                  </div>
                  <div className="p-4 bg-[#012419] border border-slate-800 rounded-lg group hover:border-green-500/30 transition-all">
                     <CheckCircle className="w-6 h-6 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-medium mb-1">Privacy First</h4>
                     <p className="text-sm text-slate-400">Built-in consent management flows to ensure compliance.</p>
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
               <h3 className="text-xl font-bold text-white">Locate Device</h3>
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
                  <label className="block text-sm font-medium text-slate-400 mb-1">Request Type</label>
                  <select
                     className="w-full bg-[#012419] border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                     value={newData.request_type}
                     onChange={(e) => setNewData({ ...newData, request_type: e.target.value })}
                  >
                     <option value="Precise (GNSS)">Precise (GNSS)</option>
                     <option value="Coarse (Network)">Coarse (Network)</option>
                     <option value="Geofence Check">Geofence Check</option>
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
                    {submitting ? 'Locating...' : 'Get Location'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
