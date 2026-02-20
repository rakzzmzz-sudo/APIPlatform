'use client';
import { useState, useEffect } from 'react';
import {
  Phone, Search, Globe, Plus, Edit, Trash2, Save, X, CheckCircle,
  ArrowRight, ShoppingCart, Network, Settings, Filter, Copy,
  PhoneIncoming, PhoneOutgoing, Shield, Zap, RefreshCw, Info,
  AlertTriangle, ExternalLink, Hash, MapPin, Star, Loader2
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

// ── Types ──────────────────────────────────────────────────────────
type DIDStatus = 'active' | 'pending' | 'suspended' | 'available';
type DIDType = 'local' | 'toll-free' | 'international' | 'mobile';

interface DIDNumber {
  id: string;
  number: string;
  country: string;
  countryCode: string;
  region: string;
  type: DIDType;
  status: DIDStatus;
  monthlyRate: number;
  setupFee: number;
  capabilities: { voice: boolean; sms: boolean; fax: boolean };
  trunkId?: string;
  trunkName?: string;
  destination?: string;
  destinationType?: string;
  purchasedAt?: string;
  expiresAt?: string;
  label?: string;
}

interface SIPTrunk {
  id: string;
  name: string;
  host: string;
  port: number;
  status: string;
}

// ── Shared storage keys (synced with SIPTrunk page) ──────────────
const DID_STORAGE_KEY = 'cpaas_did_numbers';
const INBOUND_STORAGE_KEY = 'cpaas_sip_inbound_routes';
const TRUNKS_STORAGE_KEY = 'cpaas_sip_trunks';

// ── Available DID inventory ───────────────────────────────────────
const DID_CATALOG: DIDNumber[] = [
  // Malaysia
  { id: 'c1', number: '+60331234100', country: 'Malaysia', countryCode: 'MY', region: 'Kuala Lumpur', type: 'local', status: 'available', monthlyRate: 15, setupFee: 0, capabilities: { voice: true, sms: true, fax: false } },
  { id: 'c2', number: '+60331234101', country: 'Malaysia', countryCode: 'MY', region: 'Kuala Lumpur', type: 'local', status: 'available', monthlyRate: 15, setupFee: 0, capabilities: { voice: true, sms: true, fax: false } },
  { id: 'c3', number: '+60331234102', country: 'Malaysia', countryCode: 'MY', region: 'Selangor', type: 'local', status: 'available', monthlyRate: 12, setupFee: 0, capabilities: { voice: true, sms: false, fax: false } },
  { id: 'c4', number: '+601800880001', country: 'Malaysia', countryCode: 'MY', region: 'National', type: 'toll-free', status: 'available', monthlyRate: 45, setupFee: 50, capabilities: { voice: true, sms: false, fax: false } },
  { id: 'c5', number: '+601800880002', country: 'Malaysia', countryCode: 'MY', region: 'National', type: 'toll-free', status: 'available', monthlyRate: 45, setupFee: 50, capabilities: { voice: true, sms: false, fax: false } },
  { id: 'c6', number: '+60111234567', country: 'Malaysia', countryCode: 'MY', region: 'Mobile', type: 'mobile', status: 'available', monthlyRate: 25, setupFee: 20, capabilities: { voice: true, sms: true, fax: false } },
  // Singapore
  { id: 'c7', number: '+6561234100', country: 'Singapore', countryCode: 'SG', region: 'Singapore', type: 'local', status: 'available', monthlyRate: 22, setupFee: 0, capabilities: { voice: true, sms: true, fax: false } },
  { id: 'c8', number: '+6561234101', country: 'Singapore', countryCode: 'SG', region: 'Singapore', type: 'local', status: 'available', monthlyRate: 22, setupFee: 0, capabilities: { voice: true, sms: true, fax: false } },
  { id: 'c9', number: '+6581234100', country: 'Singapore', countryCode: 'SG', region: 'Mobile', type: 'mobile', status: 'available', monthlyRate: 30, setupFee: 0, capabilities: { voice: true, sms: true, fax: false } },
  // USA
  { id: 'c10', number: '+12125550100', country: 'United States', countryCode: 'US', region: 'New York, NY', type: 'local', status: 'available', monthlyRate: 5, setupFee: 0, capabilities: { voice: true, sms: true, fax: true } },
  { id: 'c11', number: '+14155550100', country: 'United States', countryCode: 'US', region: 'San Francisco, CA', type: 'local', status: 'available', monthlyRate: 5, setupFee: 0, capabilities: { voice: true, sms: true, fax: true } },
  { id: 'c12', number: '+18005550100', country: 'United States', countryCode: 'US', region: 'National', type: 'toll-free', status: 'available', monthlyRate: 8, setupFee: 15, capabilities: { voice: true, sms: false, fax: false } },
  // UK
  { id: 'c13', number: '+442071234100', country: 'United Kingdom', countryCode: 'GB', region: 'London', type: 'local', status: 'available', monthlyRate: 6, setupFee: 0, capabilities: { voice: true, sms: false, fax: true } },
  { id: 'c14', number: '+441612345100', country: 'United Kingdom', countryCode: 'GB', region: 'Manchester', type: 'local', status: 'available', monthlyRate: 6, setupFee: 0, capabilities: { voice: true, sms: false, fax: false } },
  // Australia
  { id: 'c15', number: '+61291234100', country: 'Australia', countryCode: 'AU', region: 'Sydney, NSW', type: 'local', status: 'available', monthlyRate: 8, setupFee: 0, capabilities: { voice: true, sms: true, fax: false } },
  { id: 'c16', number: '+61381234100', country: 'Australia', countryCode: 'AU', region: 'Melbourne, VIC', type: 'local', status: 'available', monthlyRate: 8, setupFee: 0, capabilities: { voice: true, sms: true, fax: false } },
  // Indonesia
  { id: 'c17', number: '+622112345100', country: 'Indonesia', countryCode: 'ID', region: 'Jakarta', type: 'local', status: 'available', monthlyRate: 18, setupFee: 10, capabilities: { voice: true, sms: false, fax: false } },
  { id: 'c18', number: '+622212345100', country: 'Indonesia', countryCode: 'ID', region: 'Bandung', type: 'local', status: 'available', monthlyRate: 18, setupFee: 10, capabilities: { voice: true, sms: false, fax: false } },
  // Thailand
  { id: 'c19', number: '+6621234100', country: 'Thailand', countryCode: 'TH', region: 'Bangkok', type: 'local', status: 'available', monthlyRate: 15, setupFee: 5, capabilities: { voice: true, sms: false, fax: false } },
];

const defaultTrunks: SIPTrunk[] = [
  { id: '1', name: 'Primary PSTN', host: 'sip.telco.my', port: 5060, status: 'active' },
  { id: '2', name: 'Backup Trunk', host: 'sip2.telco.my', port: 5061, status: 'standby' },
  { id: '3', name: 'International', host: 'int.sip.my', port: 5060, status: 'inactive' },
];

const COUNTRIES = ['All', 'Malaysia', 'Singapore', 'United States', 'United Kingdom', 'Australia', 'Indonesia', 'Thailand'];
const TYPE_LABELS: Record<DIDType, string> = { local: 'Local', 'toll-free': 'Toll-Free', international: 'Intl', mobile: 'Mobile' };
const TYPE_COLORS: Record<DIDType, string> = {
  local: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'toll-free': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  international: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  mobile: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};
const STATUS_COLORS: Record<DIDStatus, string> = {
  active: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
  available: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const FLAG: Record<string, string> = { MY: '🇲🇾', SG: '🇸🇬', US: '🇺🇸', GB: '🇬🇧', AU: '🇦🇺', ID: '🇮🇩', TH: '🇹🇭' };

// ── Shared state helpers ──────────────────────────────────────────
function loadTrunks(): SIPTrunk[] {
  try { return JSON.parse(localStorage.getItem(TRUNKS_STORAGE_KEY) || '[]'); } catch { return []; }
}
function loadMyDIDs(): DIDNumber[] {
  try { return JSON.parse(localStorage.getItem(DID_STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveMyDIDs(dids: DIDNumber[]) {
  localStorage.setItem(DID_STORAGE_KEY, JSON.stringify(dids));
}
function pushInboundRoute(did: DIDNumber, trunk: SIPTrunk) {
  try {
    const existing = JSON.parse(localStorage.getItem(INBOUND_STORAGE_KEY) || '[]');
    const route = {
      id: `did_${did.id}_${Date.now()}`,
      did: did.number,
      description: did.label || `${did.region} DID`,
      destination_type: 'Extension',
      destination: '100',
      trunk_id: trunk.id,
      active: true,
      _source: 'did_manager',
    };
    existing.push(route);
    localStorage.setItem(INBOUND_STORAGE_KEY, JSON.stringify(existing));
  } catch { /* ignore */ }
}

// ── Badge helper ──────────────────────────────────────────────────
const Badge = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${className}`}>{children}</span>
);

// ── Capability pill ───────────────────────────────────────────────
const Cap = ({ on, label }: { on: boolean; label: string }) => (
  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${on ? 'bg-[#39FF14]/15 text-[#39FF14]' : 'bg-slate-800 text-slate-600'}`}>{label}</span>
);

// ── Purchase Modal ────────────────────────────────────────────────
function PurchaseModal({
  did, trunks, onConfirm, onClose, loading
}: {
  did: DIDNumber;
  trunks: SIPTrunk[];
  onConfirm: (did: DIDNumber, trunkId: string, label: string, dest: string, destType: string) => void;
  onClose: () => void;
  loading?: boolean;
}) {
  const [trunkId, setTrunkId] = useState(trunks[0]?.id || '');
  const [label, setLabel] = useState('');
  const [dest, setDest] = useState('100');
  const [destType, setDestType] = useState('Extension');
  const [step, setStep] = useState<'config' | 'confirm'>('config');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#011a12] border border-[#024d30] rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#024d30]">
          <h2 className="text-white font-black text-lg">
            {step === 'config' ? 'Configure DID' : 'Confirm Purchase'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#024d30] rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* DID Info */}
          <div className="bg-[#012419] border border-[#024d30] rounded-xl p-4 flex items-center gap-4">
            <span className="text-3xl">{FLAG[did.countryCode] || '🌍'}</span>
            <div className="flex-1">
              <p className="text-white font-black font-mono text-lg">{did.number}</p>
              <p className="text-slate-400 text-xs">{did.region} · {did.country}</p>
            </div>
            <div className="text-right">
              <p className="text-[#39FF14] font-black">RM {did.monthlyRate}/mo</p>
              {did.setupFee > 0 && <p className="text-slate-500 text-xs">+RM {did.setupFee} setup</p>}
            </div>
          </div>

          {step === 'config' && (
            <>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Number Label (optional)</label>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. Sales Hotline"
                  className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Assign SIP Trunk <span className="text-[#39FF14]">*</span></label>
                <select
                  value={trunkId}
                  onChange={e => setTrunkId(e.target.value)}
                  className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none"
                >
                  {trunks.length === 0 && <option value="">No trunks available — add one in SIP Trunk</option>}
                  {trunks.map(t => <option key={t.id} value={t.id}>{t.name} ({t.status})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Destination Type</label>
                  <select value={destType} onChange={e => setDestType(e.target.value)} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none">
                    {['Extension', 'IVR', 'Queue', 'Ring Group', 'Voicemail', 'External Number'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Destination</label>
                  <input type="text" value={dest} onChange={e => setDest(e.target.value)} placeholder="101 / IVR Name" className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" />
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-blue-300 text-xs">This DID will also appear as an <strong>Inbound Route</strong> in the SIP Trunk page for further configuration.</p>
              </div>
              <button
                onClick={() => setStep('confirm')}
                disabled={!trunkId}
                className="w-full py-3 bg-[#39FF14] hover:bg-[#32e012] text-black font-black rounded-xl text-sm uppercase tracking-widest transition-all disabled:opacity-40"
              >
                Review Order →
              </button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="space-y-2 text-sm">
                {[
                  ['Trunk', trunks.find(t => t.id === trunkId)?.name || '—'],
                  ['Destination', `${destType}: ${dest}`],
                  ['Label', label || '(none)'],
                  ['Monthly Cost', `RM ${did.monthlyRate}`],
                  ['Setup Fee', did.setupFee > 0 ? `RM ${did.setupFee}` : 'Free'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-[#024d30]">
                    <span className="text-slate-400">{k}</span>
                    <span className="text-white font-semibold">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 mt-1">
                  <span className="text-white font-black">Total Today</span>
                  <span className="text-[#39FF14] font-black text-lg">RM {did.monthlyRate + did.setupFee}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('config')} disabled={loading} className="flex-1 py-2.5 border border-[#024d30] text-slate-400 hover:text-white rounded-xl text-sm font-black uppercase tracking-widest disabled:opacity-40">← Back</button>
                <button
                  onClick={() => onConfirm(did, trunkId, label, dest, destType)}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#39FF14] hover:bg-[#32e012] text-black font-black rounded-xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding to Cart…</> : 'Confirm & Add to Cart'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Edit DID Modal ────────────────────────────────────────────────
function EditDIDModal({
  did, trunks, onSave, onClose
}: {
  did: DIDNumber;
  trunks: SIPTrunk[];
  onSave: (updated: DIDNumber) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...did });
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#011a12] border border-[#024d30] rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#024d30]">
          <h2 className="text-white font-black text-lg">Edit DID</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#024d30] rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Label</label>
            <input value={form.label || ''} onChange={e => setForm({ ...form, label: e.target.value })} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" placeholder="e.g. Support Line" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Assigned Trunk</label>
            <select value={form.trunkId || ''} onChange={e => {
              const t = trunks.find(x => x.id === e.target.value);
              setForm({ ...form, trunkId: e.target.value, trunkName: t?.name });
            }} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none">
              <option value="">None</option>
              {trunks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Destination Type</label>
            <select value={form.destinationType || 'Extension'} onChange={e => setForm({ ...form, destinationType: e.target.value })} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none">
              {['Extension', 'IVR', 'Queue', 'Ring Group', 'Voicemail', 'External Number'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Destination</label>
            <input value={form.destination || ''} onChange={e => setForm({ ...form, destination: e.target.value })} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" placeholder="101 / Main IVR" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as DIDStatus })} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none">
              {(['active', 'suspended'] as DIDStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 border border-[#024d30] text-slate-400 hover:text-white rounded-xl text-sm font-black">Cancel</button>
            <button onClick={() => onSave(form)} className="flex-1 py-2.5 bg-[#39FF14] hover:bg-[#32e012] text-black font-black rounded-xl text-sm flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
const TABS = [
  { id: 'browse', label: 'Browse Numbers', icon: Search },
  { id: 'my-numbers', label: 'My Numbers', icon: Hash },
  { id: 'analytics', label: 'Analytics', icon: Zap },
];

export default function DIDManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-numbers' | 'analytics'>('browse');
  const [myDIDs, setMyDIDs] = useState<DIDNumber[]>([]);
  const [trunks, setTrunks] = useState<SIPTrunk[]>(defaultTrunks);
  const [purchasingDID, setPurchasingDID] = useState<DIDNumber | null>(null);
  const [editingDID, setEditingDID] = useState<DIDNumber | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Browse filters
  const [country, setCountry] = useState('All');
  const [searchQ, setSearchQ] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | DIDType>('all');

  // Load from localStorage
  useEffect(() => {
    const stored = loadMyDIDs();
    if (stored.length > 0) setMyDIDs(stored);
    const storedTrunks = loadTrunks();
    if (storedTrunks.length > 0) setTrunks(storedTrunks);
  }, []);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const filteredCatalog = DID_CATALOG.filter(d => {
    const owned = myDIDs.some(m => m.number === d.number);
    if (owned) return false;
    if (country !== 'All' && d.country !== country) return false;
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (searchQ && !d.number.includes(searchQ) && !d.region.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const handlePurchase = async (did: DIDNumber, trunkId: string, label: string, dest: string, destType: string) => {
    if (!user) {
      setSuccessMsg('⚠ Please log in to add items to cart');
      return;
    }
    setAddingToCart(true);
    const trunk = trunks.find(t => t.id === trunkId);
    const totalPrice = did.monthlyRate + did.setupFee;

    try {
      const { error } = await db
        .from('cart_items')
        .insert({
          user_id: user.id,
          item_type: 'phone_number',
          item_data: JSON.stringify({
            phone_number: did.number,
            country_code: did.countryCode,
            region: did.region,
            number_type: TYPE_LABELS[did.type],
            monthly_cost: did.monthlyRate,
            setup_cost: did.setupFee,
            capabilities: did.capabilities,
            label: label || `${did.region} DID`,
            trunk_id: trunkId,
            trunk_name: trunk?.name || '',
            destination: dest,
            destination_type: destType,
          }),
          quantity: 1,
          unit_price: totalPrice,
          total_price: totalPrice,
        });

      if (error) throw error;

      // Also save to localStorage for the SIP Trunk inbound routes integration
      const purchased: DIDNumber = {
        ...did,
        status: 'pending',
        trunkId,
        trunkName: trunk?.name,
        label: label || `${did.region} DID`,
        destination: dest,
        destinationType: destType,
        purchasedAt: new Date().toISOString(),
      };
      const updated = [...myDIDs, purchased];
      setMyDIDs(updated);
      saveMyDIDs(updated);
      if (trunk) pushInboundRoute(purchased, trunk);

      setPurchasingDID(null);
      setSuccessMsg(`✓ ${did.number} added to cart!`);
      setActiveTab('my-numbers');
    } catch (err: any) {
      console.error('Cart add error:', err);
      setSuccessMsg(`✗ Failed to add to cart: ${err?.message || 'Unknown error'}`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRelease = (id: string) => {
    if (!confirm('Release this DID? This action cannot be undone.')) return;
    const updated = myDIDs.filter(d => d.id !== id);
    setMyDIDs(updated);
    saveMyDIDs(updated);
  };

  const handleEdit = (updated: DIDNumber) => {
    const updatedList = myDIDs.map(d => d.id === updated.id ? updated : d);
    setMyDIDs(updatedList);
    saveMyDIDs(updatedList);
    setEditingDID(null);
    setSuccessMsg('DID updated successfully');
  };

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num).catch(() => {});
  };

  const activeDIDs = myDIDs.filter(d => d.status === 'active').length;
  const monthlyCost = myDIDs.reduce((s, d) => s + d.monthlyRate, 0);

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#39FF14]/10 via-[#012419] to-[#012419] border-b border-[#024d30] px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/10 rounded-2xl border border-[#39FF14]/20">
              <Phone className="w-8 h-8 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">DID Management</h1>
              <p className="text-slate-400 mt-1 text-sm">Buy, manage, and route Direct Inward Dialing numbers with SIP trunk integration</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-black px-5 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-[#39FF14]/20"
          >
            <Plus className="w-4 h-4" /> Buy Number
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: 'My Numbers', value: myDIDs.length, icon: Hash, color: '#39FF14' },
            { label: 'Active', value: activeDIDs, icon: CheckCircle, color: '#39FF14' },
            { label: 'Countries', value: new Set(myDIDs.map(d => d.countryCode)).size, icon: Globe, color: '#818cf8' },
            { label: 'Monthly Cost', value: `RM ${monthlyCost}`, icon: ShoppingCart, color: '#f59e0b' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  <span className="text-2xl font-black text-white">{stat.value}</span>
                </div>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mx-8 mt-4 flex items-center gap-3 px-4 py-3 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-xl">
          <CheckCircle className="w-5 h-5 text-[#39FF14] shrink-0" />
          <p className="text-[#39FF14] text-sm font-bold">{successMsg}</p>
          {successMsg.includes('added to cart') && (
            <a href="/cart" className="ml-auto flex items-center gap-1 text-[#39FF14] text-xs font-black hover:underline">
              View Cart <ShoppingCart className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#024d30] px-6 bg-[#012419]/80 sticky top-0 z-10">
        <div className="flex gap-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? 'border-[#39FF14] text-[#39FF14]' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'my-numbers' && myDIDs.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-[10px]">{myDIDs.length}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* ── BROWSE TAB ── */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by number or region…"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-4 py-2.5 text-white text-sm outline-none pl-10"
                />
              </div>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none"
              >
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                {(['all', 'local', 'toll-free', 'mobile', 'international'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-[#39FF14] text-black' : 'bg-[#024d30]/40 text-slate-400 border border-[#024d30]'}`}
                  >
                    {t === 'all' ? 'All Types' : TYPE_LABELS[t as DIDType] || t}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-slate-500 text-sm"><span className="text-white font-bold">{filteredCatalog.length}</span> numbers available</p>

            {/* Number grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCatalog.map(did => (
                <div key={did.id} className="bg-[#012419]/80 border border-[#024d30] hover:border-[#39FF14]/40 rounded-2xl p-5 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{FLAG[did.countryCode] || '🌍'}</span>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{did.region}</p>
                        <Badge className={TYPE_COLORS[did.type]}>{TYPE_LABELS[did.type]}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#39FF14] font-black">RM {did.monthlyRate}<span className="text-slate-500 font-normal text-xs">/mo</span></p>
                      {did.setupFee > 0 && <p className="text-slate-500 text-[10px]">+RM {did.setupFee} setup</p>}
                    </div>
                  </div>

                  <p className="font-mono text-white text-xl font-black tracking-wider mb-3">{did.number}</p>

                  <div className="flex items-center gap-1.5 mb-4">
                    <Cap on={did.capabilities.voice} label="Voice" />
                    <Cap on={did.capabilities.sms} label="SMS" />
                    <Cap on={did.capabilities.fax} label="Fax" />
                  </div>

                  <button
                    onClick={() => setPurchasingDID(did)}
                    className="w-full py-2.5 bg-[#39FF14]/10 hover:bg-[#39FF14] text-[#39FF14] hover:text-black border border-[#39FF14]/20 hover:border-[#39FF14] rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Buy Number
                  </button>
                </div>
              ))}
            </div>

            {filteredCatalog.length === 0 && (
              <div className="text-center py-16">
                <Phone className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 font-bold">No numbers match your filters</p>
                <p className="text-slate-600 text-sm mt-1">Try changing the country or type filter</p>
              </div>
            )}
          </div>
        )}

        {/* ── MY NUMBERS TAB ── */}
        {activeTab === 'my-numbers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                Manage your purchased DID numbers and SIP trunk assignments.
                <a href="/sip-trunk" className="ml-2 text-[#39FF14] hover:underline text-xs">→ Configure SIP Trunks</a>
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
              >
                <Plus className="w-4 h-4" /> Buy More
              </button>
            </div>

            {myDIDs.length === 0 ? (
              <div className="text-center py-20">
                <Hash className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                <p className="text-white font-black text-xl mb-2">No DID numbers yet</p>
                <p className="text-slate-400 text-sm mb-6">Purchase your first DID number to get started</p>
                <button onClick={() => setActiveTab('browse')} className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest">
                  Browse Numbers
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#024d30]">
                      {['Number', 'Label', 'Country', 'Type', 'Trunk', 'Destination', 'Status', 'Monthly', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#024d30]">
                    {myDIDs.map(did => (
                      <tr key={did.id} className="hover:bg-[#024d30]/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[#39FF14] font-black text-sm">{did.number}</span>
                            <button onClick={() => copyNumber(did.number)} className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-0.5 text-slate-500 hover:text-[#39FF14] transition-all">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-300 text-sm">{did.label || '—'}</td>
                        <td className="py-4 px-4 text-sm">
                          <span className="flex items-center gap-1.5">
                            <span>{FLAG[did.countryCode] || '🌍'}</span>
                            <span className="text-slate-400 text-xs">{did.country}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4"><Badge className={TYPE_COLORS[did.type]}>{TYPE_LABELS[did.type]}</Badge></td>
                        <td className="py-4 px-4">
                          {did.trunkName ? (
                            <a href="/sip-trunk" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-bold">
                              <Network className="w-3 h-3" /> {did.trunkName}
                            </a>
                          ) : <span className="text-slate-600 text-xs">None</span>}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {did.destination ? (
                            <span><span className="text-slate-500">{did.destinationType}:</span> <strong className="text-white">{did.destination}</strong></span>
                          ) : <span className="text-slate-600 text-xs">—</span>}
                        </td>
                        <td className="py-4 px-4"><Badge className={STATUS_COLORS[did.status]}>{did.status}</Badge></td>
                        <td className="py-4 px-4 text-[#39FF14] font-black text-sm">RM {did.monthlyRate}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingDID(did)}
                              className="p-1.5 bg-[#024d30] hover:bg-[#39FF14]/20 text-slate-300 hover:text-[#39FF14] rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href="/sip-trunk"
                              className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all"
                              title="Configure in SIP Trunk"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleRelease(did.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                              title="Release number"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Numbers', value: myDIDs.length, icon: Hash, color: '#39FF14', sub: 'across all countries' },
                { label: 'Active', value: myDIDs.filter(d => d.status === 'active').length, icon: CheckCircle, color: '#39FF14', sub: 'in service' },
                { label: 'With SIP Trunk', value: myDIDs.filter(d => d.trunkId).length, icon: Network, color: '#818cf8', sub: 'trunk assigned' },
                { label: 'Monthly Spend', value: `RM ${monthlyCost}`, icon: ShoppingCart, color: '#f59e0b', sub: 'recurring' },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-[#024d30]/60 rounded-xl"><Icon className="w-5 h-5" style={{ color: stat.color }} /></div>
                      <span className="text-3xl font-black text-white">{stat.value}</span>
                    </div>
                    <p className="text-white font-bold text-sm">{stat.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{stat.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Numbers by country */}
            <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
              <h3 className="text-white font-black text-base mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-[#39FF14]" /> Numbers by Country</h3>
              {myDIDs.length === 0 ? (
                <p className="text-slate-500 text-sm">No numbers purchased yet.</p>
              ) : (
                <div className="space-y-3">
                  {Array.from(new Set(myDIDs.map(d => d.countryCode))).map(cc => {
                    const dids = myDIDs.filter(d => d.countryCode === cc);
                    return (
                      <div key={cc} className="flex items-center gap-4">
                        <span className="text-xl">{FLAG[cc] || '🌍'}</span>
                        <span className="text-slate-300 text-sm w-32">{dids[0].country}</span>
                        <div className="flex-1 bg-[#024d30]/40 rounded-full h-2">
                          <div className="bg-[#39FF14] h-2 rounded-full" style={{ width: `${(dids.length / myDIDs.length) * 100}%` }} />
                        </div>
                        <span className="text-white font-black text-sm w-6 text-right">{dids.length}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Trunk assignment */}
            <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
              <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-[#39FF14]" /> SIP Trunk Assignment
              </h3>
              {trunks.length === 0 ? (
                <p className="text-slate-500 text-sm">No SIP trunks configured. <a href="/sip-trunk" className="text-[#39FF14]">Add a trunk →</a></p>
              ) : (
                <div className="space-y-3">
                  {trunks.map(trunk => {
                    const assigned = myDIDs.filter(d => d.trunkId === trunk.id);
                    return (
                      <div key={trunk.id} className="flex items-center justify-between p-4 bg-[#024d30]/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${trunk.status === 'active' ? 'bg-[#39FF14]' : trunk.status === 'standby' ? 'bg-yellow-400' : 'bg-slate-600'}`} />
                          <div>
                            <p className="text-white font-bold text-sm">{trunk.name}</p>
                            <p className="text-slate-500 text-xs">{trunk.host}:{trunk.port}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-sm">{assigned.length} DID{assigned.length !== 1 ? 's' : ''}</span>
                          <a href="/sip-trunk" className="flex items-center gap-1 text-[#39FF14] text-xs font-black hover:underline">
                            Configure <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {purchasingDID && (
        <PurchaseModal
          did={purchasingDID}
          trunks={trunks}
          onConfirm={handlePurchase}
          onClose={() => setPurchasingDID(null)}
          loading={addingToCart}
        />
      )}
      {editingDID && (
        <EditDIDModal
          did={editingDID}
          trunks={trunks}
          onSave={handleEdit}
          onClose={() => setEditingDID(null)}
        />
      )}
    </div>
  );
}
