"use client";

import { useState, useEffect } from 'react';
import {
  PhoneIncoming, PhoneOutgoing, Mic, Play, Shield, MousePointerClick,
  MessageCircle, BarChart3, Settings, Search, Filter, Download,
  Clock, MoreVertical, Plus, CheckCircle, AlertCircle, Trash2,
  Volume2, Eye, Info, Headphones, Zap, ShieldCheck, Globe, CreditCard, UserPlus, Activity, X, Phone, Copy, Monitor
} from 'lucide-react';
import IVRBuilder from '../Voice/IVRBuilder';
import Dialpad from '../Voice/Dialpad';

export default function VoiceAPI() {
  const [activeTab, setActiveTab] = useState('inbound');
  const [isMounted, setIsMounted] = useState(false);
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [showOutboundModal, setShowOutboundModal] = useState(false);
  const [showDialpad, setShowDialpad] = useState(false);
  const [playingRecording, setPlayingRecording] = useState<number | null>(null);
  const [viewingFlow, setViewingFlow] = useState<any>(null);
  const [newInboundFlow, setNewInboundFlow] = useState({ alias: '', number: '', greeting: '', routing: '', hours: '' });
  const [newOutboundCampaign, setNewOutboundCampaign] = useState({ name: '', type: 'sales', contacts: 0, script: '', cps: 10, retries: 3 });
  const [viewingCampaign, setViewingCampaign] = useState<any>(null);
  const [showProxyModal, setShowProxyModal] = useState(false);
  const [viewingProxy, setViewingProxy] = useState<any>(null);
  const [newProxy, setNewProxy] = useState({ name: '', proxyNumber: '', userNumber: '', providerNumber: '', ttl: '1h' });
  const [proxies, setProxies] = useState([
    { id: 1, name: 'Uber Ride Session', proxyNumber: '+60 3-2001-0001', userNumber: '+60 12-3456-7890', providerNumber: '+60 11-8765-4321', ttl: '1h', status: 'active', calls: 12, duration: '45m 23s' },
    { id: 2, name: 'Food Delivery Order', proxyNumber: '+60 3-2001-0002', userNumber: '+60 12-3456-7891', providerNumber: '+60 11-9876-5432', ttl: '30m', status: 'active', calls: 5, duration: '18m 12s' },
    { id: 3, name: 'OTP Verification', proxyNumber: '+60 3-2001-0003', userNumber: '+60 13-7946-0958', providerNumber: '+60 14-7946-0123', ttl: '10m', status: 'expired', calls: 3, duration: '2m 45s' },
    { id: 4, name: 'Sales Outreach Campaign', proxyNumber: '+60 3-2001-0004', userNumber: '+60 12-1112-2222', providerNumber: '+60 19-9998-8888', ttl: '24h', status: 'active', calls: 28, duration: '2h 15m' },
    { id: 5, name: 'Real Estate Inquiry', proxyNumber: '+60 3-2001-0005', userNumber: '+60 17-7776-6666', providerNumber: '+60 16-4443-3333', ttl: '1h', status: 'active', calls: 8, duration: '32m 56s' }
  ]);
  const [showSDKModal, setShowSDKModal] = useState(false);
  const [selectedSDK, setSelectedSDK] = useState<'web' | 'android' | 'ios' | 'windows' | 'macos'>('web');
  
  // Call Whisper state
  const [showWhisperModal, setShowWhisperModal] = useState(false);
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [activeWhisperSession, setActiveWhisperSession] = useState<any>(null);
  const [whisperMode, setWhisperMode] = useState<'listen' | 'whisper' | 'barge'>('whisper');
  const [whisperSessions, setWhisperSessions] = useState([
    { id: 1, callId: 'CALL-2024-001', agentName: 'Sarah Chen', agentNumber: '+60 12-3456-7890', customerNumber: '+60 11-2233-4455', supervisorName: 'John Smith', mode: 'whisper', status: 'active', duration: '5m 23s', startTime: '14:32', notes: ['Customer asking about pricing', 'Escalation needed'] },
    { id: 2, callId: 'CALL-2024-002', agentName: 'Ahmad Rahman', agentNumber: '+60 13-5678-9012', customerNumber: '+60 12-8877-6655', supervisorName: 'Lisa Wong', mode: 'listen', status: 'active', duration: '2m 15s', startTime: '14:38', notes: ['Training session'] },
    { id: 3, callId: 'CALL-2024-003', agentName: 'Mei Ling', agentNumber: '+60 14-2345-6789', customerNumber: '+60 19-4433-2211', supervisorName: 'John Smith', mode: 'barge', status: 'active', duration: '8m 47s', startTime: '14:25', notes: ['Complex technical issue', 'Manager joined'] }
  ]);
  const [activeCalls, setActiveCalls] = useState([
    { callId: 'CALL-2024-004', agentName: 'David Tan', customerNumber: '+60 11-5566-7788', duration: '1m 12s', queue: 'Sales' },
    { callId: 'CALL-2024-005', agentName: 'Priya Kumar', customerNumber: '+60 12-9988-7766', duration: '3m 45s', queue: 'Support' },
    { callId: 'CALL-2024-006', agentName: 'Wei Zhang', customerNumber: '+60 13-3344-5566', duration: '0m 38s', queue: 'Billing' }
  ]);

  // Call Tracking state
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [viewingTrackingCampaign, setViewingTrackingCampaign] = useState<any>(null);
  const [newCampaign, setNewCampaign] = useState({ name: '', source: '', channel: '', trackingNumbers: '', goal: '' });
  const [trackingCampaigns, setTrackingCampaigns] = useState([
    { id: 1, name: 'Google PPC Q1 2024', trackingNumbers: ['+60 3-2100-0001', '+60 3-2100-0002'], source: 'Google Ads', channel: 'PPC', callCount: 892, conversions: 178, conversionRate: 20.0, avgDuration: '4m 32s', costPerLead: 18.50, totalRevenue: 45600, roi: 2.8, status: 'active', created: '2024-01-15' },
    { id: 2, name: 'Facebook Lead Gen', trackingNumbers: ['+60 3-2100-0003', '+60 3-2100-0004', '+60 3-2100-0005'], source: 'Facebook', channel: 'Social', callCount: 654, conversions: 124, conversionRate: 19.0, avgDuration: '3m 18s', costPerLead: 22.30, totalRevenue: 31200, roi: 2.1, status: 'active', created: '2024-01-20' },
    { id: 3, name: 'Organic SEO Traffic', trackingNumbers: ['+60 3-2100-0006'], source: 'Google Organic', channel: 'SEO', callCount: 1247, conversions: 287, conversionRate: 23.0, avgDuration: '5m 45s', costPerLead: 8.20, totalRevenue: 68400, roi: 4.5, status: 'active', created: '2024-01-10' },
    { id: 4, name: 'LinkedIn B2B Campaign', trackingNumbers: ['+60 3-2100-0007', '+60 3-2100-0008'], source: 'LinkedIn', channel: 'Social', callCount: 234, conversions: 45, conversionRate: 19.2, avgDuration: '6m 12s', costPerLead: 45.80, totalRevenue: 22500, roi: 1.8, status: 'paused', created: '2024-02-01' }
  ]);
  const [inboundFlows, setInboundFlows] = useState([
    { alias: 'Main Office Line', number: '+60 3-1234-5678', dest: 'Smart IVR Flow', active: 12, status: 'active', greeting: 'Welcome to Acme Corp', routing: 'IVR Menu' },
    { alias: 'Support Hotline', number: '+60 3-9876-5432', dest: 'Queue: Tier 1', active: 8, status: 'active', greeting: 'Thank you for calling support', routing: 'Agent Queue' },
    { alias: 'Sales Department', number: '+60 3-5555-1234', dest: 'Round Robin', active: 5, status: 'active', greeting: 'Sales team speaking', routing: 'Round Robin' },
    { alias: 'Emergency Hotline', number: '+60 3-9119-0000', dest: 'Priority Queue', active: 3, status: 'active', greeting: 'Emergency services', routing: 'Priority Routing' },
    { alias: 'Customer Service UK', number: '+44 20 7123 4567', dest: 'UK Support Team', active: 15, status: 'active', greeting: 'Hello, you\'ve reached UK support', routing: 'Skills-based' }
  ]);
  const [outboundCampaigns, setOutboundCampaigns] = useState([
    { name: 'Q1 Sales Promo', contacts: 1250, completed: 892, success: 487, status: 'active', avgDuration: '3m 45s', conversionRate: '54.6%' },
    { name: 'Customer Satisfaction Survey', contacts: 5000, completed: 3200, success: 2880, status: 'active', avgDuration: '2m 20s', conversionRate: '90.0%' },
    { name: 'Payment Reminder Campaign', contacts: 800, completed: 650, success: 520, status: 'completed', avgDuration: '1m 50s', conversionRate: '80.0%' },
    { name: 'New Product Launch', contacts: 2500, completed: 450, success: 180, status: 'active', avgDuration: '4m 10s', conversionRate: '40.0%' },
    { name: 'Appointment Reminders', contacts: 1500, completed: 1500, success: 1425, status: 'completed', avgDuration: '1m 15s', conversionRate: '95.0%' }
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tabs = [
    { id: 'inbound', label: 'Inbound Flows', icon: PhoneIncoming },
    { id: 'outbound', label: 'Outbound Campaign', icon: PhoneOutgoing },
    { id: 'recordings', label: 'Call Recordings', icon: Volume2 },
    { id: 'click2call', label: 'Click to Call', icon: MousePointerClick },
    { id: 'masking', label: 'Identity Protection', icon: ShieldCheck },
    { id: 'whisper', label: 'Call Whisper', icon: Headphones },
    { id: 'tracking', label: 'Call Tracking', icon: BarChart3 }
  ];

  if (!isMounted) return null;

  const renderInbound = () => {
    const handleDeleteFlow = (index: number) => {
      if (confirm('Are you sure you want to delete this inbound flow?')) {
        setInboundFlows(prev => prev.filter((_, i) => i !== index));
      }
    };

    const handleCreateFlow = () => {
      if (!newInboundFlow.alias || !newInboundFlow.number) {
        alert('Please fill in at least the flow name and number');
        return;
      }
      
      const flow = {
        alias: newInboundFlow.alias,
        number: newInboundFlow.number,
        greeting: newInboundFlow.greeting ||  'Welcome',
        routing: newInboundFlow.routing,
        active: 0,
        status: 'active' as const,
        dest: newInboundFlow.routing
      };
      
      setInboundFlows(prev => [...prev, flow]);
      setNewInboundFlow({ alias: '', number: '', greeting: '', routing: 'IVR Menu', hours: '' });
      setShowInboundModal(false);
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Flows', value: inboundFlows.length.toString(), change: '+2', color: 'from-[#39FF14]/20 to-[#32e012]/20' },
            { label: 'Active Calls', value: inboundFlows.reduce((sum, f) => sum + f.active, 0).toString(), change: '+15%', color: 'from-[#39FF14]/20 to-[#32e012]/20' },
            { label: 'Success Rate', value: '94.2%', change: '+2.1%', color: 'from-green-500/20 to-emerald-500/20' }
          ].map((stat, i) => (
            <div key={i} className={`glass-card p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 backdrop-blur-xl shadow-2xl`}>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PhoneIncoming className="w-5 h-5 text-[#39FF14]" />
              Active Inbound Flows
            </h3>
            <button 
              onClick={() => setShowInboundModal(true)}
              className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              New Inbound Flow
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Alias</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Virtual Number</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Greeting</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Routing Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Active Calls</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {inboundFlows.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-semibold text-white">{row.alias}</td>
                    <td className="px-6 py-4 text-sm font-mono text-[#39FF14]">{row.number}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{row.greeting}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <span className="px-2 py-1 bg-[#39FF14]/10 text-[#39FF14] rounded-lg text-xs font-semibold">
                        {row.routing}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{row.active}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                        row.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setViewingFlow(row)}
                          className="p-2 hover:bg-white/10 rounded-lg text-[#39FF14] transition-colors" 
                          title="View Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteFlow(i)}
                          className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Inbound Modal */}
        {showInboundModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                <h3 className="text-2xl font-bold text-white">Create New Inbound Flow</h3>
                <button onClick={() => setShowInboundModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Flow Name</label>
                  <input 
                    type="text" 
                    value={newInboundFlow.alias}
                    onChange={(e) => setNewInboundFlow(prev => ({ ...prev, alias: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14] transition-all" 
                    placeholder="e.g., Customer Support Line" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Virtual Number</label>
                  <input 
                    type="text" 
                    value={newInboundFlow.number}
                    onChange={(e) => setNewInboundFlow(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14] transition-all" 
                    placeholder="+60 3-XXXX-XXXX" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Greeting Message</label>
                  <textarea 
                    rows={3} 
                    value={newInboundFlow.greeting}
                    onChange={(e) => setNewInboundFlow(prev => ({ ...prev, greeting: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14] resize-none transition-all" 
                    placeholder="Thank you for calling..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Routing Type</label>
                  <select 
                    value={newInboundFlow.routing}
                    onChange={(e) => setNewInboundFlow(prev => ({ ...prev, routing: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14] transition-all"
                  >
                    <option value="IVR Menu">IVR Menu</option>
                    <option value="Agent Queue">Agent Queue</option>
                    <option value="Round Robin">Round Robin</option>
                    <option value="Skills-based">Skills-based</option>
                    <option value="Priority Routing">Priority Routing</option>
                    <option value="Direct Transfer">Direct Transfer</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowInboundModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all">
                    Cancel
                  </button>
                  <button onClick={handleCreateFlow} className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] transition-all">
                    Create Flow
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Flow Modal */}
        {viewingFlow && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10">
                <h3 className="text-2xl font-bold text-white">Flow Configuration</h3>
                <button onClick={() => setViewingFlow(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Flow Name</p>
                    <p className="text-white font-semibold">{viewingFlow.alias}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Virtual Number</p>
                    <p className="text-[#39FF14] font-mono">{viewingFlow.number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Routing Type</p>
                    <p className="text-white">{viewingFlow.routing}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      viewingFlow.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${viewingFlow.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                      {viewingFlow.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Greeting Message</p>
                  <p className="text-slate-300">{viewingFlow.greeting}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Calls</p>
                  <p className="text-2xl font-bold text-white">{viewingFlow.active}</p>
                </div>
                <button onClick={() => setViewingFlow(null)} className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-xl font-bold transition-all mt-4">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSmartIVR = () => (
    <div className="h-[calc(100vh-400px)] min-h-[600px]">
      <IVRBuilder />
    </div>
  );

  const renderRecording = () => {
    const recordings = [
      { id: 1, time: 'Today, 10:45 AM', dir: 'Inbound', from: '+1...4567', to: '+1...9901', dur: '5m 20s', sentiment: 'Positive' },
      { id: 2, time: 'Today, 10:30 AM', dir: 'Outbound', from: '+1...8822', to: '+44...1234', dur: '0m 45s', sentiment: 'Neutral' },
      { id: 3, time: 'Yesterday, 4:12 PM', dir: 'Inbound', from: '+60...7766', to: '+60...0000', dur: '12m 10s', sentiment: 'Negative' }
    ];

    const handlePlay = (recordingId: number) => {
      if (playingRecording === recordingId) {
        // Stop playing
        setPlayingRecording(null);
      } else {
        // Start playing
        setPlayingRecording(recordingId);
        // Simulate playback ending after a short time
        setTimeout(() => {
          setPlayingRecording(null);
        }, 3000);
      }
    };

    const handleDownload = (recording: typeof recordings[0]) => {
      // Create a mock audio blob and download it
      const content = `Call Recording\nTime: ${recording.time}\nDirection: ${recording.dir}\nFrom: ${recording.from}\nTo: ${recording.to}\nDuration: ${recording.dur}\nSentiment: ${recording.sentiment}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${recording.id}-${recording.time.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-white">Cloud Call Recordings</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by number..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-[#39FF14] outline-none w-64" />
            </div>
            <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Parties</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sentiment</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recordings.map((call) => (
                  <tr key={call.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-300">{call.time}</td>
                    <td className="px-6 py-4">
                      {call.dir === 'Inbound' 
                        ? <PhoneIncoming className="w-4 h-4 text-green-400" />
                        : <PhoneOutgoing className="w-4 h-4 text-[#39FF14]" />
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-white">{call.from}</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-white">{call.to}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{call.dur}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                        call.sentiment === 'Positive' ? 'bg-green-500/20 text-green-400' :
                        call.sentiment === 'Negative' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {call.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handlePlay(call.id)}
                          className={`transition-colors ${
                            playingRecording === call.id 
                              ? 'text-green-400 hover:text-green-300' 
                              : 'text-[#39FF14] hover:text-[#39FF14]'
                          }`}
                          title={playingRecording === call.id ? 'Stop' : 'Play'}
                        >
                          {playingRecording === call.id ? (
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                            </div>
                          ) : (
                            <Play className="w-4 h-4 fill-current" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleDownload(call)}
                          className="text-slate-400 hover:text-white transition-colors"
                          title="Download Recording"
                        >
                          <Download className="w-4 h-4" />
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
    );
  };

  const renderOutbound = () => {
    const handleDeleteCampaign = (index: number) => {
      if (confirm('Are you sure you want to delete this campaign?')) {
        setOutboundCampaigns(prev => prev.filter((_, i) => i !== index));
      }
    };

    const handleCreateCampaign = () => {
      if (!newOutboundCampaign.name) {
        alert('Please enter a campaign name');
        return;
      }
      
      const campaign = {
        name: newOutboundCampaign.name,
        contacts: newOutboundCampaign.contacts || 100,
        completed: 0,
        success: 0,
        avgDuration: '0m 0s',
        conversionRate: '0%',
        status: 'active' as const
      };
      
      setOutboundCampaigns(prev => [...prev, campaign]);
      setNewOutboundCampaign({ name: '', type: 'sales', contacts: 0, script: '', cps: 10, retries: 3 });
      setShowOutboundModal(false);
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Campaigns', value: outboundCampaigns.filter(c => c.status === 'active').length.toString(), change: '+2', color: 'from-[#39FF14]/20 to-[#32e012]/20' },
            { label: 'Calls Today', value: '2,450', change: '+18%', color: 'from-[#39FF14]/20 to-[#32e012]/20' },
            { label: 'Success Rate', value: '76.8%', change: '+3.2%', color: 'from-green-500/20 to-emerald-500/20' }
          ].map((stat, i) => (
            <div key={i} className={`glass-card p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 backdrop-blur-xl shadow-2xl`}>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Campaigns Table */}
        <div className="glass-card rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PhoneOutgoing className="w-5 h-5 text-[#39FF14]" />
              Outbound Campaigns
            </h3>
            <button 
              onClick={() => setShowOutboundModal(true)}
              className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-xl transition-all shadow-lg shadow-[#39FF14]/20 flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contacts</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Success</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {outboundCampaigns.map((campaign, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-semibold text-white">{campaign.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{campaign.contacts.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{campaign.completed.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{campaign.success.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-mono text-[#39FF14]">{campaign.avgDuration}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${parseFloat(campaign.conversionRate) >= 80 ? 'bg-green-500/20 text-green-400' : parseFloat(campaign.conversionRate) >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {campaign.conversionRate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                        campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setViewingCampaign(campaign)}
                          className="p-2 hover:bg-white/10 rounded-lg text-[#39FF14] transition-colors" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCampaign(i)}
                          className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Campaign Modal */}
        {showOutboundModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                <h3 className="text-2xl font-bold text-white">Create New Outbound Campaign</h3>
                <button onClick={() => setShowOutboundModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Campaign Name</label>
                  <input 
                    type="text" 
                    value={newOutboundCampaign.name}
                    onChange={(e) => setNewOutboundCampaign(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]" 
                    placeholder="e.g., Summer Promotion 2026" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Campaign Type</label>
                  <select 
                    value={newOutboundCampaign.type}
                    onChange={(e) => setNewOutboundCampaign(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  >
                    <option value="sales">Sales Outreach</option>
                    <option value="survey">Customer Survey</option>
                    <option value="reminder">Payment Reminder</option>
                    <option value="notification">Mass Notification</option>
                    <option value="appointment">Appointment Confirmation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Number of Contacts</label>
                  <input 
                    type="number" 
                    value={newOutboundCampaign.contacts || ''}
                    onChange={(e) => setNewOutboundCampaign(prev => ({ ...prev, contacts: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]" 
                    placeholder="100" 
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Message Script</label>
                  <textarea 
                    rows={4} 
                    value={newOutboundCampaign.script}
                    onChange={(e) => setNewOutboundCampaign(prev => ({ ...prev, script: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14] resize-none" 
                    placeholder="Hello, this is..." 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Call Rate (CPS)</label>
                    <input 
                      type="number" 
                      value={newOutboundCampaign.cps}
                      onChange={(e) => setNewOutboundCampaign(prev => ({ ...prev, cps: parseInt(e.target.value) || 10 }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]" 
                      min="1" 
                      max="50" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Max Retries</label>
                    <input 
                      type="number" 
                      value={newOutboundCampaign.retries}
                      onChange={(e) => setNewOutboundCampaign(prev => ({ ...prev, retries: parseInt(e.target.value) || 3 }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]" 
                      min="1" 
                      max="5" 
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowOutboundModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all">
                    Cancel
                  </button>
                  <button onClick={handleCreateCampaign} className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#39FF14]/20 transition-all">
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Campaign Modal */}
        {viewingCampaign && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10">
                <h3 className="text-2xl font-bold text-white">Campaign Details</h3>
                <button onClick={() => setViewingCampaign(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Campaign Name</p>
                    <p className="text-white font-semibold">{viewingCampaign.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      viewingCampaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${viewingCampaign.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                      {viewingCampaign.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Contacts</p>
                    <p className="text-2xl font-bold text-white">{viewingCampaign.contacts.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Completed</p>
                    <p className="text-2xl font-bold text-white">{viewingCampaign.completed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Success Count</p>
                    <p className="text-2xl font-bold text-green-400">{viewingCampaign.success.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Conversion Rate</p>
                    <p className={`text-2xl font-bold ${parseFloat(viewingCampaign.conversionRate) >= 80 ? 'text-green-400' : parseFloat(viewingCampaign.conversionRate) >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {viewingCampaign.conversionRate}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Average Call Duration</p>
                  <p className="text-lg font-mono text-[#39FF14]">{viewingCampaign.avgDuration}</p>
                </div>
                <button onClick={() => setViewingCampaign(null)} className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-xl font-bold transition-all mt-4">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMasking = () => {
    const handleCreateProxy = () => {
      if (!newProxy.name || !newProxy.proxyNumber) {
        alert('Please enter proxy name and number');
        return;
      }
      
      const proxy = {
        id: proxies.length + 1,
        name: newProxy.name,
        proxyNumber: newProxy.proxyNumber,
        userNumber: newProxy.userNumber,
        providerNumber: newProxy.providerNumber,
        ttl: newProxy.ttl,
        status: 'active' as const,
        calls: 0,
        duration: '0m 0s'
      };
      
      setProxies(prev => [...prev, proxy]);
      setNewProxy({ name: '', proxyNumber: '', userNumber: '', providerNumber: '', ttl: '1h' });
      setShowProxyModal(false);
    };

    const handleDeleteProxy = (index: number) => {
      if (confirm('Are you sure you want to delete this proxy?')) {
        setProxies(prev => prev.filter((_, i) => i !== index));
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-[#39FF14]/20 border border-white/20">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-black text-white tracking-tighter">Identity Protection</h2>
            <p className="text-slate-400 font-medium">Anonymize conversations between users and providers without exposing real phone numbers.</p>
          </div>
          <button
            onClick={() => setShowProxyModal(true)}
            className="bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#39FF14]/20 flex items-center gap-2 font-bold uppercase tracking-wider"
          >
            <Plus className="w-5 h-5" />
            Create Proxy
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Proxies', value: proxies.length.toString(), color: 'from-orange-500/20 to-red-500/20' },
            { label: 'Active Sessions', value: proxies.filter(p => p.status === 'active').length.toString(), color: 'from-green-500/20 to-emerald-500/20' },
            { label: 'Total Calls Today', value: proxies.reduce((sum, p) => sum + p.calls, 0).toString(), color: 'from-[#39FF14]/20 to-[#32e012]/20' },
            { label: 'Privacy Score', value: '98.2%', color: 'from-[#39FF14]/20 to-[#32e012]/20' }
          ].map((stat, i) => (
            <div key={i} className={`glass-card p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 backdrop-blur-xl shadow-2xl`}>
              <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Proxy List */}
        <div className="glass-card rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#39FF14]" />
              Active Proxy Sessions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Session Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Proxy Number</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User → Provider</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">TTL</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Calls</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {proxies.map((proxy, i) => (
                  <tr key={proxy.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-semibold text-white">{proxy.name}</td>
                    <td className="px-6 py-4 text-sm font-mono text-[#39FF14]">{proxy.proxyNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-[#39FF14]">{proxy.userNumber}</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-green-400">{proxy.providerNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded-lg text-xs font-semibold">
                        {proxy.ttl}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{proxy.calls}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">{proxy.duration}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                        proxy.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${proxy.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                        {proxy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewingProxy(proxy)}
                          className="p-2 hover:bg-white/10 rounded-lg text-[#39FF14] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProxy(i)}
                          className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Session TTL Config */}
        <div className="glass-card p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#39FF14]/20 rounded-2xl border border-[#39FF14]/20">
                <Headphones className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none mb-1">Session TTL Config</p>
                <p className="text-slate-500 text-sm">Define how long proxy numbers remain active.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
              {['10m', '30m', '1h', '24h', 'Custom'].map(t => (
                <button key={t} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${t === '1h' ? 'bg-[#39FF14] text-black' : 'text-slate-500 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Proxy Modal */}
        {showProxyModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                <h3 className="text-2xl font-bold text-white">Create New Proxy Session</h3>
                <button onClick={() => setShowProxyModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Session Name</label>
                  <input
                    type="text"
                    value={newProxy.name}
                    onChange={(e) => setNewProxy(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Delivery Order #12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Proxy Number</label>
                  <input
                    type="text"
                    value={newProxy.proxyNumber}
                    onChange={(e) => setNewProxy(prev => ({ ...prev, proxyNumber: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="+60 3-XXXX-XXXX"
                  />
                  <p className="text-xs text-slate-500 mt-2">The masked number that will be displayed to both parties</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">User Number</label>
                    <input
                      type="text"
                      value={newProxy.userNumber}
                      onChange={(e) => setNewProxy(prev => ({ ...prev, userNumber: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="+60 1X-XXXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Provider Number</label>
                    <input
                      type="text"
                      value={newProxy.providerNumber}
                      onChange={(e) => setNewProxy(prev => ({ ...prev, providerNumber: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="+60 1X-XXXX-XXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Time to Live (TTL)</label>
                  <select
                    value={newProxy.ttl}
                    onChange={(e) => setNewProxy(prev => ({ ...prev, ttl: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="10m">10 minutes</option>
                    <option value="30m">30 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="24h">24 hours</option>
                    <option value="7d">7 days</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowProxyModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all">
                    Cancel
                  </button>
                  <button onClick={handleCreateProxy} className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#39FF14]/20 transition-all">
                    Create Proxy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Proxy Modal */}
        {viewingProxy && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-red-500/10">
                <h3 className="text-2xl font-bold text-white">Proxy Session Details</h3>
                <button onClick={() => setViewingProxy(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Session Name</p>
                  <p className="text-white font-semibold text-lg">{viewingProxy.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Proxy Number</p>
                    <p className="text-[#39FF14] font-mono text-lg">{viewingProxy.proxyNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      viewingProxy.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${viewingProxy.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                      {viewingProxy.status}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Connection Mapping</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">User</p>
                      <p className="text-[#39FF14] font-mono text-sm">{viewingProxy.userNumber}</p>
                    </div>
                    <div className="text-slate-600">⟷</div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-slate-500 mb-1">Proxy</p>
                      <p className="text-[#39FF14] font-mono text-sm">{viewingProxy.proxyNumber}</p>
                    </div>
                    <div className="text-slate-600">⟷</div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-slate-500 mb-1">Provider</p>
                      <p className="text-green-400 font-mono text-sm">{viewingProxy.providerNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">TTL</p>
                    <p className="text-white font-semibold">{viewingProxy.ttl}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Calls</p>
                    <p className="text-white font-semibold">{viewingProxy.calls}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Duration</p>
                    <p className="text-white font-semibold font-mono">{viewingProxy.duration}</p>
                  </div>
                </div>
                <button onClick={() => setViewingProxy(null)} className="w-full bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-xl font-bold transition-all mt-4">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderClickToCall = () => {
    const sdkCode = {
      web: `<!-- Click to Call Web SDK -->
<script src="https://cdn.acmecpaas.com/c2c-sdk.js"></script>
<script>
  // Initialize Click to Call Widget
  const c2c = new ClickToCallSDK({
    apiKey: 'YOUR_API_KEY',
    phoneNumber: '+60-3-XXXX-XXXX',
    theme: 'glass', // 'standard' | 'glass' | 'neumorphic' | 'minimal'
    position: 'bottom-right',
    
    // Customization
    brandColor: '#8b5cf6',
    brandName: 'Acme Corp',
    greeting: 'Need help? Click to call us!',
    
    // CRM Integration
    onCallStart: (callData) => {
      console.log('Call started:', callData);
      // Log to CRM
    },
    onCallEnd: (callData) => {
      console.log('Call ended:', callData);
      // Update CRM record
    },
    
    // WebRTC Configuration (optional)
    enableWebRTC: true,
    stunServers: ['stun:stun.l.google.com:19302']
  });
  
  // Initialize the widget
  c2c.init();
  
  // Available methods:
  // c2c.show() - Show widget
  // c2c.hide() - Hide widget
  // c2c.call(number) - Initiate call
  // c2c.destroy() - Remove widget
</script>`,
      
      android: `// Click to Call Android SDK (Kotlin)
// Add to build.gradle
dependencies {
    implementation 'com.acmecpaas:clicktocall:1.0.0'
}

// Initialize in Application class
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        ClickToCall.initialize(
            context = this,
            config = ClickToCallConfig(
                apiKey = "YOUR_API_KEY",
                phoneNumber = "+60-3-XXXX-XXXX",
                theme = ClickToCallTheme.MATERIAL_YOU,
                brandColor = Color(0xFF8B5CF6)
            )
        )
    }
}

// In your Activity/Fragment
class MainActivity : AppCompatActivity() {
    private lateinit var c2c: ClickToCallWidget
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Create floating widget
        c2c = ClickToCallWidget(this)
        c2c.setCallbacks(object : CallCallback {
            override fun onCallStarted(call: CallData) {
                // Log to analytics
                logCallEvent("call_started", call)
            }
            
            override fun onCallEnded(call: CallData) {
                // Update CRM
                updateCRMRecord(call)
            }
        })
        
        // Show widget
        c2c.show()
    }
    
    // Programmatic call
    fun makeCall(number: String) {
        c2c.initiateCall(number)
    }
}`,
      
      ios: `// Click to Call iOS SDK (Swift)
// Add to Package.swift or Podfile
dependencies: [
    .package(url: "https://github.com/acmecpaas/clicktocall-ios", from: "1.0.0")
]

import ClickToCallSDK
import SwiftUI

@main
struct MyApp: App {
    init() {
        // Initialize SDK
        ClickToCall.shared.configure(
            apiKey: "YOUR_API_KEY",
            phoneNumber: "+60-3-XXXX-XXXX",
            config: C2CConfiguration(
                theme: .glassmorphism,
                brandColor: .green,
                position: .bottomTrailing
            )
        )
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .clickToCallWidget() // Add floating widget
        }
    }
}

// SwiftUI View Integration
struct ContentView: View {
    @StateObject private var c2c = ClickToCall.shared
    
    var body: some View {
        VStack {
            // Your content
            
            // Inline call button
            Button("Call Support") {
                c2c.initiateCall(number: "+60-3-1234-5678")
            }
        }
        .onCallEvent { event in
            switch event {
            case .started(let callData):
                // Analytics logging
                Analytics.log("call_started", data: callData)
            case .ended(let callData):
                // CRM update
                CRM.updateRecord(callData)
            }
        }
    }
}

// CallKit Integration
extension ClickToCall {
    func setupCallKit() {
        let provider = CXProvider(configuration: providerConfiguration)
        let controller = CXCallController()
        // CallKit integration handled automatically
    }
}`,
      
      windows: `// Click to Call Windows SDK (C#/.NET)
// Install via NuGet
// Install-Package AcmeCPaaS.ClickToCall

using AcmeCPaaS.ClickToCall;
using System.Windows;

namespace MyApp
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            
            // Initialize Click to Call SDK
            var config = new C2CConfiguration
            {
                ApiKey = "YOUR_API_KEY",
                PhoneNumber = "+60-3-XXXX-XXXX",
                Theme = C2CTheme.ModernFluent,
                BrandColor = Colors.Purple,
                Position = WidgetPosition.BottomRight
            };
            
            ClickToCallManager.Initialize(config);
            
            // Set up event handlers
            ClickToCallManager.OnCallStarted += (sender, args) =>
            {
                // Log to analytics
                Analytics.TrackEvent("CallStarted", args.CallData);
            };
            
            ClickToCallManager.OnCallEnded += (sender, args) =>
            {
                // Update CRM
                CRMService.UpdateContact(args.CallData);
            };
        }
    }
    
    // In your Window/UserControl
    public partial class MainWindow : Window
    {
        private ClickToCallWidget _widget;
        
        public MainWindow()
        {
            InitializeComponent();
            
            // Create floating widget
            _widget = new ClickToCallWidget();
            _widget.Show();
        }
        
        // Programmatic call
        private void CallButton_Click(object sender, RoutedEventArgs e)
        {
            ClickToCallManager.InitiateCall("+60-3-1234-5678");
        }
        
        // System tray integration
        private void SetupTrayIcon()
        {
            var trayIcon = new NotifyIcon
            {
                Icon = Resources.AppIcon,
                Visible = true
            };
            
            var menu = new ContextMenuStrip();
            menu.Items.Add("Quick Call", null, (s, e) => _widget.Show());
            trayIcon.ContextMenuStrip = menu;
        }
    }
}`,
      
      macos: `// Click to Call macOS SDK (Swift)
// Add via Swift Package Manager
dependencies: [
    .package(url: "https://github.com/acmecpaas/clicktocall-macos", from: "1.0.0")
]

import Cocoa
import ClickToCallSDK

@main
class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem?
    var c2cManager: ClickToCallManager?
    
    func applicationDidFinishLaunching(_ notification: Notification) {
        // Initialize SDK
        let config = C2CConfiguration(
            apiKey: "YOUR_API_KEY",
            phoneNumber: "+60-3-XXXX-XXXX",
            theme: .aqua,
            brandColor: .systemPurple
        )
        
        c2cManager = ClickToCallManager.shared
        c2cManager?.configure(with: config)
        
        // Menu bar integration
        setupMenuBar()
        
        // Event handlers
        c2cManager?.onCallStarted = { callData in
            // Analytics
            Analytics.track("call_started", properties: callData.dictionary)
        }
        
        c2cManager?.onCallEnded = { callData in
            // CRM update
            CRMService.shared.updateContact(with: callData)
        }
    }
    
    private func setupMenuBar() {
        statusItem = NSStatusBar.system.statusItem(
            withLength: NSStatusItem.squareLength
        )
        
        if let button = statusItem?.button {
            button.image = NSImage(systemSymbolName: "phone.fill", 
                                   accessibilityDescription: "Click to Call")
        }
        
        let menu = NSMenu()
        menu.addItem(NSMenuItem(
            title: "Quick Call",
            action: #selector(quickCall),
            keyEquivalent: "c"
        ))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(
            title: "Quit",
            action: #selector(NSApplication.terminate(_:)),
            keyEquivalent: "q"
        ))
        
        statusItem?.menu = menu
    }
    
    @objc func quickCall() {
        c2cManager?.showCallWidget()
    }
}

// SwiftUI View Integration
import SwiftUI

struct ContentView: View {
    @StateObject private var c2c = ClickToCallManager.shared
    
    var body: some View {
        VStack {
            Button("Call Support") {
                c2c.initiateCall(number: "+60-3-1234-5678")
            }
            .clickToCallButton(style: .primary)
        }
        .frame(minWidth: 400, minHeight: 300)
    }
}`
    };

    const handleCopyCode = (platform: string) => {
      const code = sdkCode[platform as keyof typeof sdkCode];
      navigator.clipboard.writeText(code);
    };

    const handleDownloadSDK = (platform: string) => {
      const fileNames = {
        web: 'clicktocall-web-sdk.js',
        android: 'clicktocall-android-sdk.aar',
        ios: 'ClickToCallSDK.xcframework.zip',
        windows: 'AcmeCPaaS.ClickToCall.nupkg',
        macos: 'ClickToCallSDK.xcframework.zip'
      };
      
      const code = sdkCode[platform as keyof typeof sdkCode];
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileNames[platform as keyof typeof fileNames];
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const platformInfo = {
      web: { name: 'Web / CRM', icon: Globe, color: 'text-[#39FF14]', bgColor: 'bg-[#39FF14]/20', borderColor: 'border-[#39FF14]/20' },
      android: { name: 'Android', icon: Phone, color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/20' },
      ios: { name: 'iOS', icon: Phone, color: 'text-[#39FF14]', bgColor: 'bg-[#39FF14]/20', borderColor: 'border-[#39FF14]/20' },
      windows: { name: 'Windows', icon: Monitor, color: 'text-[#39FF14]', bgColor: 'bg-[#39FF14]/20', borderColor: 'border-[#39FF14]/500/20' },
      macos: { name: 'macOS', icon: Monitor, color: 'text-[#39FF14]', bgColor: 'bg-[#39FF14]/20', borderColor: 'border-[#39FF14]/20' }
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl border-l-4 border-l-[#39FF14]">
              <h3 className="text-2xl font-black text-white mb-4">Widget Generator</h3>
              <p className="text-slate-400 mb-8">Generate a highly customizable floating button or inline element for your website.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Theme Interface</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Standard', 'Glass', 'Neumorphic', 'Minimal'].map(theme => (
                      <button key={theme} className={`py-3 rounded-xl border text-[10px] uppercase font-black transition-all ${theme === 'Glass' ? 'bg-[#39FF14]/20 border-[#39FF14]/50 text-[#39FF14]' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setShowSDKModal(true)}
                  className="w-full bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-[#39FF14]/20 hover:scale-[1.02] transition-transform"
                >
                  Generate Snippet
                </button>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#39FF14]" />
                Integration Guide
              </h4>
              <div className="space-y-3">
                {[
                  'Paste the <script> in your <head>',
                  'Initialize with your unique API Key',
                  'Customize callbacks for CRM logging',
                  'Enable WebRTC for browser-based audio'
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="w-6 h-6 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-xs font-black text-[#39FF14] flex-shrink-0">
                      {i+1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden p-0 flex flex-col items-center justify-center min-h-[500px] relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#39FF14]/10 via-transparent to-[#32e012]/10" />
            <div className="text-center space-y-4 px-8 z-10">
              <h4 className="text-xs font-black text-[#39FF14] uppercase tracking-[0.3em]">Live Preview</h4>
              <div className="w-64 h-96 bg-[#0a0a0a] rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center transform rotate-2">
                <div className="w-20 h-1 bg-slate-800 rounded-full absolute top-4" />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-[#39FF14] to-[#32e012] rounded-full mx-auto flex items-center justify-center shadow-lg shadow-[#39FF14]/20">
                    <PhoneIncoming className="w-8 h-8 text-white animate-bounce" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase">Calling Local Agent</p>
                    <p className="text-slate-500 text-[10px]">Your identity is protected</p>
                  </div>
                  <div className="pt-8 grid grid-cols-2 gap-2 w-full">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#39FF14] animate-[loading_2s_infinite]" />
                    </div>
                    <div className="h-2 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-4">Demo showing mobile widget interface</p>
            </div>
          </div>
        </div>

        {/* SDK Modal */}
        {showSDKModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                <h3 className="text-2xl font-bold text-white">Click to Call SDK Suite</h3>
                <button onClick={() => setShowSDKModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Platform Tabs */}
              <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex gap-2 overflow-x-auto">
                  {Object.entries(platformInfo).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedSDK(key as any)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                        selectedSDK === key
                          ? `${info.bgColor} ${info.color} border ${info.borderColor}`
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      <info.icon className="w-4 h-4" />
                      {info.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Display */}
              <div className="p-6">
                <div className="bg-[#012419] rounded-xl border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900">
                    <span className="text-sm font-mono text-slate-400">
                      {selectedSDK === 'web' && 'JavaScript/TypeScript'}
                      {selectedSDK === 'android' && 'Kotlin'}
                      {selectedSDK === 'ios' && 'Swift'}
                      {selectedSDK === 'windows' && 'C# / .NET'}
                      {selectedSDK === 'macos' && 'Swift'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyCode(selectedSDK)}
                        className="px-3 py-1.5 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        Copy Code
                      </button>
                      <button
                        onClick={() => handleDownloadSDK(selectedSDK)}
                        className="px-3 py-1.5 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Download SDK
                      </button>
                    </div>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                      <code>{sdkCode[selectedSDK]}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Features & Documentation */}
              <div className="p-6 border-t border-white/10 bg-white/5">
                <h4 className="text-lg font-bold text-white mb-4">SDK Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'Call Initiation',
                    'Status Tracking',
                    'Number Masking',
                    'Analytics Hooks',
                    'Theme Customization',
                    'Multi-language',
                    'CRM Integration',
                    'WebRTC Support'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWhisper = () => {
    const handleStartMonitoring = () => {
      setShowWhisperModal(true);
    };

    const handleSetupSupervisor = () => {
      setShowSupervisorModal(true);
    };

    const handleStartSession = (call: any) => {
      const newSession = {
        id: whisperSessions.length + 1,
        callId: call.callId,
        agentName: call.agentName,
        agentNumber: call.agentNumber || '+60 12-XXXX-XXXX',
        customerNumber: call.customerNumber,
        supervisorName: 'Current User',
        mode: whisperMode,
        status: 'active',
        duration: '0m 00s',
        startTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        notes: []
      };
      setWhisperSessions([...whisperSessions, newSession]);
      setActiveWhisperSession(newSession);
      setShowWhisperModal(false);
    };

    const handleEndSession = (sessionId: number) => {
      setWhisperSessions(whisperSessions.map(s => 
        s.id === sessionId ? { ...s, status: 'ended' } : s
      ));
      if (activeWhisperSession?.id === sessionId) {
        setActiveWhisperSession(null);
      }
    };

    const handleModeChange = (mode: 'listen' | 'whisper' | 'barge') => {
      setWhisperMode(mode);
      if (activeWhisperSession) {
        setWhisperSessions(whisperSessions.map(s =>
          s.id === activeWhisperSession.id ? { ...s, mode } : s
        ));
        setActiveWhisperSession({ ...activeWhisperSession, mode });
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Hero Section */}
        <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 backdrop-blur-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#39FF14]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-2xl">
                <Headphones className="w-5 h-5 text-[#39FF14]" />
                <span className="text-[#39FF14] font-black text-xs uppercase tracking-widest">Active Supervision</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9]">Real-time <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#32e012]">Call Coaching</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">Guide your agents without the customer hearing. Enable "Listen", "Whisper", or "Barge" modes for mission-critical customer support.</p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleStartMonitoring}
                  className="px-8 py-4 bg-[#39FF14] text-black rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg shadow-[#39FF14]/30 hover:bg-[#32e012] transition-all"
                >
                  Start Monitoring
                </button>
                <button 
                  onClick={handleSetupSupervisor}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all"
                >
                  Setup Supervisor
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 space-y-4">
              {[
                { label: 'Listen Mode', mode: 'listen' as const, icon: Volume2 },
                { label: 'Whisper Mode', mode: 'whisper' as const, icon: Mic },
                { label: 'Barge-In', mode: 'barge' as const, icon: Zap }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleModeChange(item.mode)}
                  className={`w-full p-5 rounded-3xl border transition-all duration-500 flex items-center justify-between ${whisperMode === item.mode ? 'bg-[#39FF14]/10 border-[#39FF14]/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${whisperMode === item.mode ? 'bg-[#39FF14] text-black' : 'bg-slate-800 text-slate-500'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${whisperMode === item.mode ? 'text-white' : 'text-slate-500'}`}>{item.label}</span>
                  </div>
                  {whisperMode === item.mode && <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="glass-card p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Active Whisper Sessions</h3>
            <span className="text-xs text-slate-400">{whisperSessions.filter(s => s.status === 'active').length} Active</span>
          </div>

          <div className="space-y-3">
            {whisperSessions.filter(s => s.status === 'active').map((session) => (
              <div key={session.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#39FF14]/20 flex items-center justify-center">
                      <Headphones className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{session.agentName}</p>
                      <p className="text-xs text-slate-400">{session.callId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      session.mode === 'listen' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      session.mode === 'whisper' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      'bg-[#39FF14]/20 text-[#39FF14]'
                    }`}>
                      {session.mode.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">{session.duration}</span>
                    <button
                      onClick={() => handleEndSession(session.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {session.notes.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-slate-500">Notes: {session.notes.join(', ')}</p>
                  </div>
                )}
              </div>
            ))}
            {whisperSessions.filter(s => s.status === 'active').length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No active whisper sessions. Click "Start Monitoring" to begin.
              </div>
            )}
          </div>
        </div>

        {/* Start Monitoring Modal */}
        {showWhisperModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Select Call to Monitor</h3>
                <button onClick={() => setShowWhisperModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {activeCalls.map((call, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{call.agentName}</p>
                          <p className="text-sm text-slate-400">{call.callId} • {call.queue} • {call.duration}</p>
                          <p className="text-xs text-slate-500">{call.customerNumber}</p>
                        </div>
                        <button
                          onClick={() => handleStartSession(call)}
                          className="px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg text-sm font-bold transition-all"
                        >
                          Monitor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Supervisor Modal */}
        {showSupervisorModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Supervisor Configuration</h3>
                <button onClick={() => setShowSupervisorModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Supervisor Name</label>
                  <input type="text" placeholder="John Smith" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Extension/Number</label>
                  <input type="text" placeholder="+60 12-XXXX-XXXX" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Assigned Agents</label>
                  <select multiple className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white h-32">
                    <option>Sarah Chen</option>
                    <option>Ahmad Rahman</option>
                    <option>Mei Ling</option>
                    <option>David Tan</option>
                    <option>Priya Kumar</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Default Mode</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <option value="listen">Listen Only</option>
                    <option value="whisper">Whisper to Agent</option>
                    <option value="barge">Barge-In (3-way)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowSupervisorModal(false)}
                    className="flex-1 px-4 py-3 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-xl font-bold transition-all"
                  >
                    Save Configuration
                  </button>
                  <button
                    onClick={() => setShowSupervisorModal(false)}
                    className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTracking = () => {
    const handleDownloadStats = () => {
      const csvContent = `Campaign Name,Source,Channel,Calls,Conversions,Conv Rate,Avg Duration,Cost Per Lead (MYR),Revenue (MYR),ROI\n${trackingCampaigns.map(c => 
        `${c.name},${c.source},${c.channel},${c.callCount},${c.conversions},${c.conversionRate}%,${c.avgDuration},RM ${c.costPerLead.toFixed(2)},RM ${c.totalRevenue.toLocaleString()},${c.roi}x`
      ).join('\n')}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `call-tracking-stats-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const handleScheduleEmail = () => {
      setShowTrackingModal(true);
    };

    const handleCreateCampaign = () => {
      if (newCampaign.name && newCampaign.source) {
        const campaign = {
          id: trackingCampaigns.length + 1,
          name: newCampaign.name,
          trackingNumbers: newCampaign.trackingNumbers.split(',').map(n => n.trim()).filter(n => n),
          source: newCampaign.source,
          channel: newCampaign.channel || 'Other',
          callCount: 0,
          conversions: 0,
          conversionRate: 0,
          avgDuration: '0m 00s',
          costPerLead: 0,
          totalRevenue: 0,
          roi: 0,
          status: 'active',
          created: new Date().toISOString().split('T')[0]
        };
        setTrackingCampaigns([...trackingCampaigns, campaign]);
        setNewCampaign({ name: '', source: '', channel: '', trackingNumbers: '', goal: '' });
        setShowCampaignModal(false);
      }
    };

    const handleDeleteCampaign = (id: number) => {
      setTrackingCampaigns(trackingCampaigns.filter(c => c.id !== id));
    };

    const totalStats = {
      totalCalls: trackingCampaigns.reduce((sum, c) => sum + c.callCount, 0),
      totalLeads: trackingCampaigns.reduce((sum, c) => sum + c.conversions, 0),
      avgConversionRate: (trackingCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / trackingCampaigns.length).toFixed(1),
      avgCostPerLead: (trackingCampaigns.reduce((sum, c) => sum + c.costPerLead, 0) / trackingCampaigns.length).toFixed(2)
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Calls Tracked', value: totalStats.totalCalls.toLocaleString(), icon: PhoneIncoming },
            { label: 'Attributed Leads', value: totalStats.totalLeads.toLocaleString(), icon: UserPlus },
            { label: 'Conversion Rate', value: `${totalStats.avgConversionRate}%`, icon: Zap },
            { label: 'Cost Per Lead', value: `RM ${totalStats.avgCostPerLead}`, icon: CreditCard }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:translate-y-[-2px] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                  <item.icon className="w-4 h-4 text-[#39FF14]" />
                </div>
                <BarChart3 className="w-4 h-4 text-slate-700" />
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">{item.label}</p>
              <p className="text-2xl font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Campaigns Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Tracking Campaigns</h3>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg font-bold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Campaigns List */}
        <div className="glass-card p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="space-y-3">
            {trackingCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-white">{campaign.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {campaign.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{campaign.source} • {campaign.channel}</span>
                      <span>{campaign.trackingNumbers.length} Number{campaign.trackingNumbers.length > 1 ? 's' : ''}</span>
                      <span>Created {campaign.created}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingTrackingCampaign(campaign)}
                      className="p-2 hover:bg-[#39FF14]/20 rounded-lg text-[#39FF14] transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Calls</p>
                    <p className="text-sm font-bold text-white">{campaign.callCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Conversions</p>
                    <p className="text-sm font-bold text-white">{campaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Conv Rate</p>
                    <p className="text-sm font-bold text-green-400">{campaign.conversionRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Avg Duration</p>
                    <p className="text-sm font-bold text-white">{campaign.avgDuration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Cost/Lead</p>
                    <p className="text-sm font-bold text-[#39FF14]">RM {campaign.costPerLead.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">ROI</p>
                    <p className="text-sm font-bold text-[#39FF14]">{campaign.roi}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics & Export Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">Attributed Source Performance</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
                <span className="text-[10px] text-slate-400 uppercase font-bold">Inbound Volume</span>
              </div>
            </div>
            <div className="p-10 h-64 flex items-end gap-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="flex-1 bg-[#39FF14]/20 hover:bg-[#39FF14]/40 transition-all rounded-t-sm" style={{ height: `${20 + Math.random() * 80}%` }} />
              ))}
            </div>
            <div className="p-6 bg-white/5 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1 underline decoration-[#39FF14]">PPC Google</p>
                <p className="text-lg font-black text-white">42%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1 underline decoration-[#39FF14]">Facebook Ads</p>
                <p className="text-lg font-black text-white">28%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1 underline decoration-green-500">Organic SEO</p>
                <p className="text-lg font-black text-white">30%</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-[#012419] to-[#024d30] border border-[#39FF14]/20 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
            <h4 className="text-2xl font-black mb-4 leading-tight">Export <br/>Advanced <br/>Report</h4>
            <p className="text-[#39FF14]/80 text-sm mb-8">Deep analytics including call heatmaps, agent performance ranking, and ROI attribution exportable in CSV, PDF, or JSON API.</p>
            <div className="space-y-3">
              <button 
                onClick={handleDownloadStats}
                className="w-full py-4 bg-white text-[#39FF14] rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-[#39FF14]/10 transition-all"
              >
                <Download className="w-4 h-4" /> Download Stats
              </button>
              <button 
                onClick={handleScheduleEmail}
                className="w-full py-4 bg-[#39FF14]/20 border border-[#39FF14]/20 text-[#39FF14] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#39FF14]/30 transition-all"
              >
                Schedule Email
              </button>
            </div>
          </div>
        </div>

        {/* Create Campaign Modal */}
        {showCampaignModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Create Tracking Campaign</h3>
                <button onClick={() => setShowCampaignModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Campaign Name</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="Q1 2024 Google PPC"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-400 mb-2 block">Source</label>
                    <input
                      type="text"
                      value={newCampaign.source}
                      onChange={(e) => setNewCampaign({ ...newCampaign, source: e.target.value })}
                      placeholder="Google Ads"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-400 mb-2 block">Channel</label>
                    <select
                      value={newCampaign.channel}
                      onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="">Select Channel</option>
                      <option value="PPC">PPC</option>
                      <option value="Social">Social Media</option>
                      <option value="SEO">SEO</option>
                      <option value="Email">Email</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Tracking Numbers (comma separated)</label>
                  <input
                    type="text"
                    value={newCampaign.trackingNumbers}
                    onChange={(e) => setNewCampaign({ ...newCampaign, trackingNumbers: e.target.value })}
                    placeholder="+60 3-2100-0001, +60 3-2100-0002"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Conversion Goal</label>
                  <input
                    type="text"
                    value={newCampaign.goal}
                    onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
                    placeholder="Sales, Lead Generation, etc."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateCampaign}
                    className="flex-1 px-4 py-3 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-xl font-bold transition-all"
                  >
                    Create Campaign
                  </button>
                  <button
                    onClick={() => setShowCampaignModal(false)}
                    className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Campaign Details Modal */}
        {viewingTrackingCampaign && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{viewingTrackingCampaign.name}</h3>
                <button onClick={() => setViewingTrackingCampaign(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Source</p>
                    <p className="text-lg font-bold text-white">{viewingTrackingCampaign.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Channel</p>
                    <p className="text-lg font-bold text-white">{viewingTrackingCampaign.channel}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">Tracking Numbers</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingTrackingCampaign.trackingNumbers.map((num: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded-full text-sm font-mono">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Calls</p>
                    <p className="text-2xl font-black text-white">{viewingTrackingCampaign.callCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Conversions</p>
                    <p className="text-2xl font-black text-green-400">{viewingTrackingCampaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Conv Rate</p>
                    <p className="text-2xl font-black text-[#39FF14]">{viewingTrackingCampaign.conversionRate}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Avg Duration</p>
                    <p className="text-lg font-bold text-white">{viewingTrackingCampaign.avgDuration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Cost Per Lead</p>
                    <p className="text-lg font-bold text-[#39FF14]">RM {viewingTrackingCampaign.costPerLead.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">ROI</p>
                    <p className="text-lg font-bold text-green-400">{viewingTrackingCampaign.roi}x</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-3xl font-black text-white">RM {viewingTrackingCampaign.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Email Modal */}
        {showTrackingModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Schedule Report Email</h3>
                <button onClick={() => setShowTrackingModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Email Address</label>
                  <input type="email" placeholder="reports@company.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Frequency</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Report Format</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowTrackingModal(false)}
                    className="flex-1 px-4 py-3 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-xl font-bold transition-all"
                  >
                    Schedule Report
                  </button>
                  <button
                    onClick={() => setShowTrackingModal(false)}
                    className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inbound': return renderInbound();
      case 'outbound': return renderOutbound();
      case 'ivr': return renderSmartIVR();
      case 'recordings': return renderRecording();
      case 'masking': return renderMasking();
      case 'click2call': return renderClickToCall();
      case 'whisper': return renderWhisper();
      case 'tracking': return renderTracking();
      default: return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-xl">
            <Zap className="w-10 h-10 text-[#39FF14] animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Module Under Construction</h2>
          <p className="text-slate-400 max-w-sm">We are currently implementing the premium glassy interface for this module. Stay tuned!</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#01140f] p-8 pb-20 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Voice API</h1>
            <p className="text-slate-400">Manage your voice communication infrastructure</p>
          </div>
          <button
            onClick={() => setShowDialpad(!showDialpad)}
            className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#39FF14]/30 flex items-center gap-2 transition-all"
          >
            <Phone className="w-5 h-5" />
            {showDialpad ? 'Close' : 'Open'} Dialpad
          </button>
        </div>



        {/* Main Content Area */}
        <div className="flex flex-col gap-6">
          {/* Horizontal Tab Navigation */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-glass-btn flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 group relative whitespace-nowrap ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#39FF14] to-[#32e012] text-white shadow-lg shadow-[#39FF14]/30 font-bold' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-black' : 'text-[#39FF14]'}`} />
                    <span className="text-sm font-semibold">{tab.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Content wrapper */}
          <div className="w-full">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Dialpad */}
      {showDialpad && <Dialpad onClose={() => setShowDialpad(false)} />}

      <style jsx>{`
        .glass-card {
          position: relative;
          overflow: hidden;
        }
        .glass-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          transform: skewX(-25deg);
          transition: 0.75s;
        }
        .glass-card:hover::before {
          left: 150%;
        }
        .nav-glass-btn {
          border: 1px solid rgba(255, 255, 255, 0);
        }
        .nav-glass-btn:hover {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
