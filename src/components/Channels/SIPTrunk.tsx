'use client';
import { useState, useEffect } from 'react';
import {
  Network, Plus, Edit, Trash2, Save, X, Shield, Settings,
  Activity, Phone, AlertTriangle, CheckCircle, Lock, Radio,
  RefreshCw, Wifi, Server, Globe, Zap, ChevronRight, Eye, EyeOff
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'trunks', label: 'Trunk Config', icon: Server },
  { id: 'inbound', label: 'Inbound Routes', icon: Phone },
  { id: 'outbound', label: 'Outbound Routes', icon: PhoneForwarded },
  { id: 'codecs', label: 'Codecs & Media', icon: Radio },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'nat', label: 'NAT & RTP', icon: Wifi },
  { id: 'advanced', label: 'Advanced', icon: Settings },
];

function PhoneForwarded(props: any) {
  return <Phone {...props} />;
}

const BADGE = (color: string, text: string) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{text}</span>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>{children}</div>
);

const Input = ({ label, ...props }: any) => (
  <div>
    {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
    <input className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 transition-all" {...props} />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div>
    {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14] transition-all" {...props}>
      {children}
    </select>
  </div>
);

const Toggle = ({ checked, onChange, label }: any) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#39FF14]' : 'bg-slate-700'}`} />
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </div>
    {label && <span className="text-sm text-slate-300">{label}</span>}
  </label>
);

const StatCard = ({ icon: Icon, label, value, sub, color = '#39FF14' }: any) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
      <div className="p-3 rounded-xl" style={{ background: `${color}20` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </Card>
);

const initialTrunks = [
  { id: '1', name: 'Primary PSTN', host: 'sip.telco.my', port: 5060, transport: 'UDP', username: 'trunk001', status: 'active', codecs: ['G.711a','G.729'], concurrent_calls: 30, cps: 10, registration: true, dtmf: 'RFC2833', created_at: '2026-01-15' },
  { id: '2', name: 'Backup Trunk', host: 'sip2.telco.my', port: 5061, transport: 'TLS', username: 'trunk002', status: 'standby', codecs: ['G.711u','Opus'], concurrent_calls: 10, cps: 5, registration: true, dtmf: 'SIP INFO', created_at: '2026-01-20' },
  { id: '3', name: 'International', host: 'int.sip.my', port: 5060, transport: 'UDP', username: 'trunk003', status: 'inactive', codecs: ['G.729','G.722'], concurrent_calls: 20, cps: 3, registration: false, dtmf: 'RFC2833', created_at: '2026-02-01' },
];

const initialInbound = [
  { id: '1', did: '+60331234567', description: 'Main Number', destination_type: 'IVR', destination: 'Main IVR', trunk_id: '1', active: true },
  { id: '2', did: '+60331234568', description: 'Support Line', destination_type: 'Extension', destination: '101', trunk_id: '1', active: true },
  { id: '3', did: '+60331234569', description: 'Sales Line', destination_type: 'Queue', destination: 'Sales Queue', trunk_id: '2', active: false },
];

const initialOutbound = [
  { id: '1', name: 'Emergency', pattern: '_000X', trunk_id: '1', priority: 1, prefix: '', active: true, failover_trunk_id: '' },
  { id: '2', name: 'Local MY', pattern: '_0[3-9]XXXXXXXX', trunk_id: '1', priority: 2, prefix: '', active: true, failover_trunk_id: '2' },
  { id: '3', name: 'International', pattern: '_00X.', trunk_id: '3', priority: 3, prefix: '', active: true, failover_trunk_id: '' },
];

const initialWhitelist = [
  { id: '1', ip: '203.0.113.10', description: 'Primary SIP Provider', active: true },
  { id: '2', ip: '203.0.113.20', description: 'Backup SIP Provider', active: true },
  { id: '3', ip: '10.0.0.0/8', description: 'Internal Office Network', active: true },
];

const TRUNKS_KEY = 'cpaas_sip_trunks';
const INBOUND_KEY = 'cpaas_sip_inbound_routes';

export default function SIPTrunk() {
  const [activeTab, setActiveTab] = useState('overview');
  const [trunks, setTrunks] = useState(initialTrunks);
  const [inboundRoutes, setInboundRoutes] = useState(initialInbound);
  const [outboundRoutes, setOutboundRoutes] = useState(initialOutbound);
  const [whitelist, setWhitelist] = useState(initialWhitelist);
  const [showTrunkModal, setShowTrunkModal] = useState(false);
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [showOutboundModal, setShowOutboundModal] = useState(false);
  const [showWhitelistModal, setShowWhitelistModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [codecs, setCodecs] = useState(['G.711a (PCMA)', 'G.711u (PCMU)', 'G.729', 'G.722', 'Opus', 'G.723.1', 'GSM']);
  const [enabledCodecs, setEnabledCodecs] = useState(['G.711a (PCMA)', 'G.711u (PCMU)', 'G.729', 'Opus']);

  // Load persisted trunks and DID-purchased inbound routes from localStorage
  useEffect(() => {
    try {
      const storedTrunks = JSON.parse(localStorage.getItem(TRUNKS_KEY) || 'null');
      if (storedTrunks && storedTrunks.length > 0) setTrunks(storedTrunks);
      const storedInbound = JSON.parse(localStorage.getItem(INBOUND_KEY) || 'null');
      if (storedInbound && storedInbound.length > 0) setInboundRoutes(storedInbound);
    } catch { /* ignore */ }
  }, []);

  // Persist trunks to localStorage so DID page can read them
  useEffect(() => {
    try { localStorage.setItem(TRUNKS_KEY, JSON.stringify(trunks)); } catch { /* ignore */ }
  }, [trunks]);

  // Persist inbound routes so DID page additions survive navigation
  useEffect(() => {
    try { localStorage.setItem(INBOUND_KEY, JSON.stringify(inboundRoutes)); } catch { /* ignore */ }
  }, [inboundRoutes]);
  const [sipSettings, setSipSettings] = useState({
    t38_enabled: true,
    prack_enabled: false,
    rtpTimeout: 30,
    sessionTimer: 1800,
    maxForwards: 70,
    userAgent: 'CPaaSPlatform/2.0',
    fromDomain: 'platform.local',
    stunServer: 'stun:stun.cloudflare.com:3478',
    rtpStart: 10000, rtpEnd: 20000,
    tlsEnabled: true,
    srtpEnabled: true,
    fail2banEnabled: true,
    fail2banMaxRetry: 5,
    fail2banBanTime: 3600,
    natMode: 'auto',
    dtmfMode: 'RFC2833',
    faxDetect: true,
    directMedia: false,
    trustRpid: true,
    sendRpid: true,
  });

  const activeTrunks = trunks.filter(t => t.status === 'active').length;
  const totalCalls = trunks.reduce((s, t) => s + t.concurrent_calls, 0);
  const totalCPS = trunks.reduce((s, t) => s + t.cps, 0);

  // ── Trunk Modal ──────────────────────────────────────────────
  const TrunkModal = () => {
    const [form, setForm] = useState(editingItem || {
      name: '', host: '', port: 5060, transport: 'UDP', username: '', password: '',
      concurrent_calls: 30, cps: 10, registration: true, dtmf: 'RFC2833', status: 'active',
    });
    const save = () => {
      if (editingItem) {
        setTrunks(trunks.map(t => t.id === editingItem.id ? { ...t, ...form } : t));
      } else {
        setTrunks([...trunks, { ...form, id: Date.now().toString(), codecs: ['G.711a'], created_at: new Date().toISOString().slice(0,10) }]);
      }
      setShowTrunkModal(false); setEditingItem(null);
    };
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#012419] border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} SIP Trunk</h2>
            <button onClick={() => { setShowTrunkModal(false); setEditingItem(null); }}><X className="w-6 h-6 text-slate-400 hover:text-white" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Trunk Name" placeholder="Primary PSTN" value={form.name} onChange={(e:any) => setForm({...form, name: e.target.value})} />
              <Select label="Status" value={form.status} onChange={(e:any) => setForm({...form, status: e.target.value})}>
                <option value="active">Active</option>
                <option value="standby">Standby</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2"><Input label="SIP Host / IP" placeholder="sip.provider.com" value={form.host} onChange={(e:any) => setForm({...form, host: e.target.value})} /></div>
              <Input label="Port" type="number" value={form.port} onChange={(e:any) => setForm({...form, port: parseInt(e.target.value)})} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Select label="Transport" value={form.transport} onChange={(e:any) => setForm({...form, transport: e.target.value})}>
                <option>UDP</option><option>TCP</option><option>TLS</option><option>WSS</option>
              </Select>
              <Input label="Username" placeholder="trunk001" value={form.username} onChange={(e:any) => setForm({...form, username: e.target.value})} />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm pr-10 focus:outline-none focus:border-[#39FF14]" placeholder="••••••••" value={form.password || ''} onChange={(e:any) => setForm({...form, password: e.target.value})} />
                  <button type="button" className="absolute right-3 top-2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Max Concurrent Calls" type="number" value={form.concurrent_calls} onChange={(e:any) => setForm({...form, concurrent_calls: parseInt(e.target.value)})} />
              <Input label="CPS (Calls/Sec)" type="number" value={form.cps} onChange={(e:any) => setForm({...form, cps: parseInt(e.target.value)})} />
              <Select label="DTMF Mode" value={form.dtmf} onChange={(e:any) => setForm({...form, dtmf: e.target.value})}>
                <option>RFC2833</option><option>SIP INFO</option><option>In-band</option><option>Auto</option>
              </Select>
            </div>
            <Toggle checked={form.registration} onChange={(e:any) => setForm({...form, registration: e.target.checked})} label="Enable Registration (Outbound trunk registers to provider)" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => { setShowTrunkModal(false); setEditingItem(null); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm">Cancel</button>
            <button onClick={save} className="px-6 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-xl font-semibold text-sm flex items-center gap-2"><Save className="w-4 h-4" />Save Trunk</button>
          </div>
        </div>
      </div>
    );
  };

  // ── Inbound Modal ────────────────────────────────────────────
  const InboundModal = () => {
    const [form, setForm] = useState(editingItem || { did: '', description: '', destination_type: 'Extension', destination: '', trunk_id: trunks[0]?.id || '', active: true });
    const save = () => {
      if (editingItem) setInboundRoutes(inboundRoutes.map(r => r.id === editingItem.id ? { ...r, ...form } : r));
      else setInboundRoutes([...inboundRoutes, { ...form, id: Date.now().toString() }]);
      setShowInboundModal(false); setEditingItem(null);
    };
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#012419] border border-slate-700 rounded-2xl p-6 max-w-lg w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} Inbound Route</h2>
            <button onClick={() => { setShowInboundModal(false); setEditingItem(null); }}><X className="w-6 h-6 text-slate-400 hover:text-white" /></button>
          </div>
          <div className="space-y-4">
            <Input label="DID / Phone Number" placeholder="+60331234567" value={form.did} onChange={(e:any) => setForm({...form, did: e.target.value})} />
            <Input label="Description" placeholder="Main Reception" value={form.description} onChange={(e:any) => setForm({...form, description: e.target.value})} />
            <Select label="SIP Trunk" value={form.trunk_id} onChange={(e:any) => setForm({...form, trunk_id: e.target.value})}>
              {trunks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Destination Type" value={form.destination_type} onChange={(e:any) => setForm({...form, destination_type: e.target.value})}>
                <option>Extension</option><option>IVR</option><option>Queue</option><option>Ring Group</option><option>Voicemail</option><option>External Number</option>
              </Select>
              <Input label="Destination" placeholder="101" value={form.destination} onChange={(e:any) => setForm({...form, destination: e.target.value})} />
            </div>
            <Toggle checked={form.active} onChange={(e:any) => setForm({...form, active: e.target.checked})} label="Route Active" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => { setShowInboundModal(false); setEditingItem(null); }} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm">Cancel</button>
            <button onClick={save} className="px-6 py-2 bg-[#39FF14] text-black rounded-xl font-semibold text-sm flex items-center gap-2"><Save className="w-4 h-4" />Save Route</button>
          </div>
        </div>
      </div>
    );
  };

  // ── Outbound Modal ───────────────────────────────────────────
  const OutboundModal = () => {
    const [form, setForm] = useState(editingItem || { name: '', pattern: '', trunk_id: trunks[0]?.id || '', priority: outboundRoutes.length + 1, prefix: '', active: true, failover_trunk_id: '' });
    const save = () => {
      if (editingItem) setOutboundRoutes(outboundRoutes.map(r => r.id === editingItem.id ? { ...r, ...form } : r));
      else setOutboundRoutes([...outboundRoutes, { ...form, id: Date.now().toString() }]);
      setShowOutboundModal(false); setEditingItem(null);
    };
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#012419] border border-slate-700 rounded-2xl p-6 max-w-lg w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} Outbound Route</h2>
            <button onClick={() => { setShowOutboundModal(false); setEditingItem(null); }}><X className="w-6 h-6 text-slate-400 hover:text-white" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Route Name" placeholder="Local Calls" value={form.name} onChange={(e:any) => setForm({...form, name: e.target.value})} />
              <Input label="Priority" type="number" value={form.priority} onChange={(e:any) => setForm({...form, priority: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Dial Pattern</label>
              <input className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#39FF14]" placeholder="_0[3-9]XXXXXXXX" value={form.pattern} onChange={(e:any) => setForm({...form, pattern: e.target.value})} />
              <p className="text-xs text-slate-500 mt-1">Use _ prefix, X=any digit, Z=1-9, N=2-9, [1-5]=range, .=wildcard</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Strip Digits Prefix" placeholder="0" value={form.prefix} onChange={(e:any) => setForm({...form, prefix: e.target.value})} />
              <Select label="Primary Trunk" value={form.trunk_id} onChange={(e:any) => setForm({...form, trunk_id: e.target.value})}>
                {trunks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Select>
            </div>
            <Select label="Failover Trunk (optional)" value={form.failover_trunk_id} onChange={(e:any) => setForm({...form, failover_trunk_id: e.target.value})}>
              <option value="">None</option>
              {trunks.filter(t => t.id !== form.trunk_id).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <Toggle checked={form.active} onChange={(e:any) => setForm({...form, active: e.target.checked})} label="Route Active" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => { setShowOutboundModal(false); setEditingItem(null); }} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm">Cancel</button>
            <button onClick={save} className="px-6 py-2 bg-[#39FF14] text-black rounded-xl font-semibold text-sm flex items-center gap-2"><Save className="w-4 h-4" />Save Route</button>
          </div>
        </div>
      </div>
    );
  };

  // ── Whitelist Modal ──────────────────────────────────────────
  const WhitelistModal = () => {
    const [form, setForm] = useState(editingItem || { ip: '', description: '', active: true });
    const save = () => {
      if (editingItem) setWhitelist(whitelist.map(w => w.id === editingItem.id ? { ...w, ...form } : w));
      else setWhitelist([...whitelist, { ...form, id: Date.now().toString() }]);
      setShowWhitelistModal(false); setEditingItem(null);
    };
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#012419] border border-slate-700 rounded-2xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} IP Whitelist</h2>
            <button onClick={() => { setShowWhitelistModal(false); setEditingItem(null); }}><X className="w-6 h-6 text-slate-400" /></button>
          </div>
          <div className="space-y-4">
            <Input label="IP Address / CIDR" placeholder="203.0.113.10 or 10.0.0.0/8" value={form.ip} onChange={(e:any) => setForm({...form, ip: e.target.value})} />
            <Input label="Description" placeholder="Primary SIP Provider" value={form.description} onChange={(e:any) => setForm({...form, description: e.target.value})} />
            <Toggle checked={form.active} onChange={(e:any) => setForm({...form, active: e.target.checked})} label="Active" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => { setShowWhitelistModal(false); setEditingItem(null); }} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm">Cancel</button>
            <button onClick={save} className="px-6 py-2 bg-[#39FF14] text-black rounded-xl font-semibold text-sm flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
          </div>
        </div>
      </div>
    );
  };

  // ── Tab renderers ─────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Network} label="Active Trunks" value={activeTrunks} sub={`${trunks.length} total configured`} />
        <StatCard icon={Phone} label="Max Conc. Calls" value={totalCalls} sub="across all trunks" color="#22c55e" />
        <StatCard icon={Zap} label="Max CPS" value={totalCPS} sub="calls per second" color="#f59e0b" />
        <StatCard icon={CheckCircle} label="SIP Registration" value={`${trunks.filter(t=>t.registration).length}/${trunks.length}`} sub="trunks registered" color="#3b82f6" />
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Trunk Status</h3>
        <div className="space-y-3">
          {trunks.map(trunk => (
            <div key={trunk.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${trunk.status === 'active' ? 'bg-[#39FF14] shadow-[0_0_6px_#39FF14]' : trunk.status === 'standby' ? 'bg-yellow-400' : 'bg-slate-600'}`} />
                <div>
                  <p className="font-semibold text-white">{trunk.name}</p>
                  <p className="text-sm text-slate-400">{trunk.host}:{trunk.port} · {trunk.transport}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span>Codecs: <strong className="text-white">{trunk.codecs.join(', ')}</strong></span>
                <span>CPS: <strong className="text-white">{trunk.cps}</strong></span>
                <span>Channels: <strong className="text-white">{trunk.concurrent_calls}</strong></span>
                {BADGE(trunk.status === 'active' ? 'bg-[#39FF14]/20 text-[#39FF14]' : trunk.status === 'standby' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400', trunk.status)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
          <dl className="space-y-3">
            {[
              ['Inbound DIDs', inboundRoutes.length],
              ['Outbound Routes', outboundRoutes.length],
              ['IP Whitelist Entries', whitelist.length],
              ['Enabled Codecs', enabledCodecs.length],
              ['TLS Enabled', sipSettings.tlsEnabled ? 'Yes' : 'No'],
              ['SRTP Enabled', sipSettings.srtpEnabled ? 'Yes' : 'No'],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex items-center justify-between py-1 border-b border-slate-800 last:border-0">
                <dt className="text-slate-400 text-sm">{k}</dt>
                <dd className="text-white font-semibold text-sm">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">SIP Diagnostics</h3>
          <div className="space-y-3">
            {trunks.map(trunk => (
              <div key={trunk.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{trunk.name}</p>
                  <p className="text-xs text-slate-500">{trunk.host}</p>
                </div>
                <button className="px-3 py-1 bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-xs rounded-lg hover:bg-[#39FF14]/20 transition-colors flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Ping
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTrunks = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-400">Manage SIP trunk connections to your PSTN carrier or VoIP provider</p>
        <button onClick={() => { setEditingItem(null); setShowTrunkModal(true); }} className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Trunk
        </button>
      </div>
      {trunks.map(trunk => (
        <Card key={trunk.id}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${trunk.status === 'active' ? 'bg-[#39FF14]/10' : trunk.status === 'standby' ? 'bg-yellow-500/10' : 'bg-slate-700/30'}`}>
                <Server className={`w-6 h-6 ${trunk.status === 'active' ? 'text-[#39FF14]' : trunk.status === 'standby' ? 'text-yellow-400' : 'text-slate-500'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{trunk.name}</h3>
                  {BADGE(trunk.status === 'active' ? 'bg-[#39FF14]/20 text-[#39FF14]' : trunk.status === 'standby' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400', trunk.status)}
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{trunk.host}:{trunk.port} · {trunk.transport} · User: {trunk.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(trunk); setShowTrunkModal(true); }} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"><Edit className="w-4 h-4" /></button>
              <button onClick={() => setTrunks(trunks.filter(t => t.id !== trunk.id))} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-slate-700/50">
            {[['Codecs', trunk.codecs.join(', ')], ['Max Channels', trunk.concurrent_calls], ['CPS', trunk.cps], ['DTMF', trunk.dtmf], ['Registration', trunk.registration ? 'Yes' : 'No']].map(([l, v]) => (
              <div key={String(l)}>
                <p className="text-xs text-slate-500 mb-1">{l}</p>
                <p className="text-sm font-semibold text-white">{String(v)}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderInbound = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-400">Map phone numbers (DIDs) to internal extensions, IVRs, or queues</p>
        <button onClick={() => { setEditingItem(null); setShowInboundModal(true); }} className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add DID Route
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              {['DID / Number', 'Description', 'Trunk', 'Destination', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {inboundRoutes.map(route => (
              <tr key={route.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-4 font-mono text-[#39FF14] font-semibold text-sm">{route.did}</td>
                <td className="py-4 px-4 text-slate-300 text-sm">{route.description}</td>
                <td className="py-4 px-4 text-slate-300 text-sm">{trunks.find(t => t.id === route.trunk_id)?.name || '–'}</td>
                <td className="py-4 px-4 text-sm"><span className="text-slate-500">{route.destination_type}:</span> <strong className="text-white">{route.destination}</strong></td>
                <td className="py-4 px-4">{BADGE(route.active ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-slate-700 text-slate-400', route.active ? 'Active' : 'Disabled')}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(route); setShowInboundModal(true); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setInboundRoutes(inboundRoutes.filter(r => r.id !== route.id))} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOutbound = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-400">Define dial plan patterns and route outgoing calls through trunks</p>
        <button onClick={() => { setEditingItem(null); setShowOutboundModal(true); }} className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Outbound Route
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              {['Priority', 'Route Name', 'Dial Pattern', 'Primary Trunk', 'Failover', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {[...outboundRoutes].sort((a, b) => a.priority - b.priority).map(route => (
              <tr key={route.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-4"><span className="w-8 h-8 rounded-lg bg-[#39FF14]/10 text-[#39FF14] font-bold text-sm flex items-center justify-center">{route.priority}</span></td>
                <td className="py-4 px-4 font-semibold text-white text-sm">{route.name}</td>
                <td className="py-4 px-4 font-mono text-slate-300 text-sm">{route.pattern}</td>
                <td className="py-4 px-4 text-slate-300 text-sm">{trunks.find(t => t.id === route.trunk_id)?.name || '–'}</td>
                <td className="py-4 px-4 text-slate-400 text-sm">{trunks.find(t => t.id === route.failover_trunk_id)?.name || '–'}</td>
                <td className="py-4 px-4">{BADGE(route.active ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-slate-700 text-slate-400', route.active ? 'Active' : 'Off')}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(route); setShowOutboundModal(true); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setOutboundRoutes(outboundRoutes.filter(r => r.id !== route.id))} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCodecs = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Codec Priority Order</h3>
          <p className="text-slate-400 text-sm mb-4">Drag to reorder. Codecs higher in the list are preferred during SIP negotiation.</p>
          <div className="space-y-2">
            {codecs.map((codec, i) => {
              const enabled = enabledCodecs.includes(codec);
              return (
                <div key={codec} className={`flex items-center justify-between p-3 rounded-lg border ${enabled ? 'border-[#39FF14]/30 bg-[#39FF14]/5' : 'border-slate-700 bg-slate-900/30'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-5">{i + 1}</span>
                    <span className={`font-mono text-sm font-semibold ${enabled ? 'text-white' : 'text-slate-500'}`}>{codec}</span>
                  </div>
                  <Toggle checked={enabled} onChange={() => setEnabledCodecs(enabled ? enabledCodecs.filter(c => c !== codec) : [...enabledCodecs, codec])} />
                </div>
              );
            })}
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">DTMF Settings</h3>
            <div className="space-y-4">
              <Select label="DTMF Mode" value={sipSettings.dtmfMode} onChange={(e: any) => setSipSettings({ ...sipSettings, dtmfMode: e.target.value })}>
                <option>RFC2833</option><option>SIP INFO</option><option>In-band</option><option>Auto</option>
              </Select>
              <Toggle checked={sipSettings.faxDetect} onChange={(e: any) => setSipSettings({ ...sipSettings, faxDetect: e.target.checked })} label="Enable T.38 Fax Detection" />
              <Toggle checked={sipSettings.t38_enabled} onChange={(e: any) => setSipSettings({ ...sipSettings, t38_enabled: e.target.checked })} label="T.38 Fax Relay" />
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Media Settings</h3>
            <div className="space-y-4">
              <Toggle checked={sipSettings.directMedia} onChange={(e:any) => setSipSettings({...sipSettings, directMedia: e.target.checked})} label="Direct Media (bypass media server)" />
              <Input label="RTP Timeout (seconds)" type="number" value={sipSettings.rtpTimeout} onChange={(e:any) => setSipSettings({...sipSettings, rtpTimeout: parseInt(e.target.value)})} />
              <Input label="Session Timer (seconds)" type="number" value={sipSettings.sessionTimer} onChange={(e:any) => setSipSettings({...sipSettings, sessionTimer: parseInt(e.target.value)})} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-1">IP Whitelist</h3>
          <p className="text-slate-400 text-sm mb-4">Only whitelisted IPs can send SIP traffic. Protects against unauthorized access.</p>
          <div className="space-y-2 mb-4">
            {whitelist.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="font-mono text-sm font-semibold text-white">{entry.ip}</p>
                  <p className="text-xs text-slate-400">{entry.description}</p>
                </div>
                <div className="flex gap-2">
                  {BADGE(entry.active ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-slate-700 text-slate-400', entry.active ? 'Active' : 'Off')}
                  <button onClick={() => { setEditingItem(entry); setShowWhitelistModal(true); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setWhitelist(whitelist.filter(w => w.id !== entry.id))} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setEditingItem(null); setShowWhitelistModal(true); }} className="w-full py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-[#39FF14] rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add IP
          </button>
        </Card>
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-[#39FF14]" /> Encryption</h3>
            <div className="space-y-4">
              <Toggle checked={sipSettings.tlsEnabled} onChange={(e:any) => setSipSettings({...sipSettings, tlsEnabled: e.target.checked})} label="TLS (SIP transport encryption)" />
              <Toggle checked={sipSettings.srtpEnabled} onChange={(e:any) => setSipSettings({...sipSettings, srtpEnabled: e.target.checked})} label="SRTP (Media encryption)" />
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" /> Fail2Ban Protection</h3>
            <div className="space-y-4">
              <Toggle checked={sipSettings.fail2banEnabled} onChange={(e:any) => setSipSettings({...sipSettings, fail2banEnabled: e.target.checked})} label="Enable Fail2Ban" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Max Failed Auth" type="number" value={sipSettings.fail2banMaxRetry} onChange={(e:any) => setSipSettings({...sipSettings, fail2banMaxRetry: parseInt(e.target.value)})} />
                <Input label="Ban Duration (sec)" type="number" value={sipSettings.fail2banBanTime} onChange={(e:any) => setSipSettings({...sipSettings, fail2banBanTime: parseInt(e.target.value)})} />
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Caller Identity</h3>
            <div className="space-y-3">
              <Toggle checked={sipSettings.trustRpid} onChange={(e:any) => setSipSettings({...sipSettings, trustRpid: e.target.checked})} label="Trust Remote-Party-ID header" />
              <Toggle checked={sipSettings.sendRpid} onChange={(e:any) => setSipSettings({...sipSettings, sendRpid: e.target.checked})} label="Send Remote-Party-ID header" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderNAT = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-[#39FF14]" /> NAT Traversal</h3>
          <div className="space-y-4">
            <Select label="NAT Mode" value={sipSettings.natMode} onChange={(e:any) => setSipSettings({...sipSettings, natMode: e.target.value})}>
              <option value="auto">Auto Detect</option>
              <option value="yes">Always (force NAT handling)</option>
              <option value="no">Disabled</option>
              <option value="force_rport">Force rport</option>
            </Select>
            <Input label="STUN Server" placeholder="stun:stun.cloudflare.com:3478" value={sipSettings.stunServer} onChange={(e:any) => setSipSettings({...sipSettings, stunServer: e.target.value})} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Wifi className="w-5 h-5 text-[#39FF14]" /> RTP Port Range</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="RTP Start Port" type="number" value={sipSettings.rtpStart} onChange={(e:any) => setSipSettings({...sipSettings, rtpStart: parseInt(e.target.value)})} />
              <Input label="RTP End Port" type="number" value={sipSettings.rtpEnd} onChange={(e:any) => setSipSettings({...sipSettings, rtpEnd: parseInt(e.target.value)})} />
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Total Ports Available</p>
              <p className="text-2xl font-bold text-white">{sipSettings.rtpEnd - sipSettings.rtpStart}</p>
              <p className="text-xs text-slate-500 mt-1">Supports up to ~{Math.floor((sipSettings.rtpEnd - sipSettings.rtpStart) / 2)} concurrent calls</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-xs text-yellow-400">⚠ Ensure these UDP ports are open on your firewall for media to flow correctly.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">SIP Protocol Settings</h3>
          <div className="space-y-4">
            <Input label="User-Agent Header" value={sipSettings.userAgent} onChange={(e:any) => setSipSettings({...sipSettings, userAgent: e.target.value})} />
            <Input label="From Domain" value={sipSettings.fromDomain} onChange={(e:any) => setSipSettings({...sipSettings, fromDomain: e.target.value})} />
            <Input label="Max Forwards" type="number" value={sipSettings.maxForwards} onChange={(e:any) => setSipSettings({...sipSettings, maxForwards: parseInt(e.target.value)})} />
            <Toggle checked={sipSettings.prack_enabled} onChange={(e:any) => setSipSettings({...sipSettings, prack_enabled: e.target.checked})} label="Enable PRACK (Reliable Provisional Responses)" />
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">SIP Trunk Ping Test</h3>
            <p className="text-slate-400 text-sm mb-4">Test connectivity to each SIP trunk by sending an OPTIONS ping.</p>
            <div className="space-y-3">
              {trunks.map(trunk => (
                <div key={trunk.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{trunk.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{trunk.host}:{trunk.port}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-xs rounded-lg hover:bg-[#39FF14]/20 transition-colors flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Send OPTIONS
                  </button>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">SIP Trace Capture</h3>
            <p className="text-slate-400 text-sm mb-4">Capture SIP signalling messages for debugging call issues.</p>
            <button className="w-full py-2.5 bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] rounded-xl text-sm font-semibold hover:bg-[#39FF14]/20 transition-colors flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" /> Start SIP Capture
            </button>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'trunks': return renderTrunks();
      case 'inbound': return renderInbound();
      case 'outbound': return renderOutbound();
      case 'codecs': return renderCodecs();
      case 'security': return renderSecurity();
      case 'nat': return renderNAT();
      case 'advanced': return renderAdvanced();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#39FF14]/10 via-[#012419] to-[#012419] border-b border-slate-800 px-8 py-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/10 rounded-2xl border border-[#39FF14]/20">
            <Network className="w-8 h-8 text-[#39FF14]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">SIP Trunk Manager</h1>
            <p className="text-slate-400 mt-1">Configure SIP trunking, routing, codecs, security, and advanced telephony options</p>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-slate-800 px-6 bg-[#012419]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${active ? 'border-[#39FF14] text-[#39FF14]' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        {renderTab()}
      </div>

      {/* Modals */}
      {showTrunkModal && <TrunkModal />}
      {showInboundModal && <InboundModal />}
      {showOutboundModal && <OutboundModal />}
      {showWhitelistModal && <WhitelistModal />}
    </div>
  );
}
