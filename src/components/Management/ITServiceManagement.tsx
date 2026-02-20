'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Ticket, AlertOctagon, GitMerge, BarChart2, Plus, Edit, Trash2,
  Save, X, CheckCircle, Clock, Loader2, Filter, Search,
  ArrowUpCircle, ArrowDownCircle, MinusCircle, Download,
  RefreshCw, Zap, Users, TrendingUp, Shield
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────
type Priority = 'critical' | 'high' | 'medium' | 'low';
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type IncidentStatus = 'active' | 'investigating' | 'resolved';
type ChangeStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';

interface ITTicket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignee: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: IncidentStatus;
  affectedService: string;
  resolvedAt?: string;
  createdAt: string;
}

interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: ChangeStatus;
  requestedBy: string;
  scheduledDate: string;
  createdAt: string;
}

// ── Storage ────────────────────────────────────────────────────────
const KEYS = {
  tickets: 'cpaas_itsm_tickets',
  incidents: 'cpaas_itsm_incidents',
  changes: 'cpaas_itsm_changes',
};

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}
function save<T>(key: string, data: T[]) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

// ── Seed data ──────────────────────────────────────────────────────
const seedTickets: ITTicket[] = [
  { id: 't1', title: 'SMS gateway latency spike', description: 'P95 latency elevated to 2.3s, affecting bulk campaigns.', priority: 'high', status: 'in_progress', assignee: 'Ali Hassan', category: 'Performance', createdAt: '2026-02-20T08:00:00Z', updatedAt: '2026-02-20T09:30:00Z' },
  { id: 't2', title: 'WhatsApp template rejection', description: 'Business template rejected by Meta API — 403 on send.', priority: 'critical', status: 'open', assignee: 'Priya Nair', category: 'API', createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-02-20T10:00:00Z' },
  { id: 't3', title: 'User cannot reset password', description: 'Reset email not being delivered via SMTP route.', priority: 'medium', status: 'resolved', assignee: 'David Lim', category: 'Auth', createdAt: '2026-02-19T14:00:00Z', updatedAt: '2026-02-20T07:00:00Z' },
  { id: 't4', title: 'RCS campaign stuck in pending', description: 'Campaign ID 4829 has been queued for 6 hours.', priority: 'high', status: 'open', assignee: 'Unassigned', category: 'Campaigns', createdAt: '2026-02-20T04:00:00Z', updatedAt: '2026-02-20T04:00:00Z' },
  { id: 't5', title: 'SIP trunk registration failing', description: 'Primary PSTN trunk loses registration every ~2 hours.', priority: 'critical', status: 'in_progress', assignee: 'Ali Hassan', category: 'Telephony', createdAt: '2026-02-20T06:00:00Z', updatedAt: '2026-02-20T11:00:00Z' },
];

const seedIncidents: Incident[] = [
  { id: 'i1', title: 'API Gateway 503 errors', description: 'Increased 503 rate on /api/sms/send endpoint.', priority: 'critical', status: 'investigating', affectedService: 'SMS API', createdAt: '2026-02-20T09:00:00Z' },
  { id: 'i2', title: 'Email delivery delays', description: 'SMTP relay queuing causing 30–60 min delays.', priority: 'high', status: 'resolved', affectedService: 'Email API', resolvedAt: '2026-02-20T08:30:00Z', createdAt: '2026-02-20T07:00:00Z' },
  { id: 'i3', title: 'DID number provisioning timeout', description: 'Number purchase API timing out at 30s limit.', priority: 'medium', status: 'active', affectedService: 'DID Management', createdAt: '2026-02-20T11:00:00Z' },
];

const seedChanges: ChangeRequest[] = [
  { id: 'c1', title: 'Upgrade SMS gateway software to v4.2', description: 'Apply patch for CVE-2025-1234 and performance improvements.', priority: 'high', status: 'approved', requestedBy: 'Ali Hassan', scheduledDate: '2026-02-22', createdAt: '2026-02-18T10:00:00Z' },
  { id: 'c2', title: 'Add failover trunk for international calls', description: 'Configure secondary SIP trunk for international routes.', priority: 'medium', status: 'pending', requestedBy: 'David Lim', scheduledDate: '2026-02-25', createdAt: '2026-02-19T14:00:00Z' },
  { id: 'c3', title: 'Migrate RCS configs to new schema', description: 'Breaking schema change requires coordinated deployment.', priority: 'critical', status: 'in_progress', requestedBy: 'Priya Nair', scheduledDate: '2026-02-21', createdAt: '2026-02-20T08:00:00Z' },
];

// ── Helpers ────────────────────────────────────────────────────────
const PRIORITY_COLORS: Record<Priority, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_progress: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30',
  resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  closed: 'bg-slate-600/20 text-slate-500 border-slate-600/30',
};

const INCIDENT_STATUS_COLORS: Record<IncidentStatus, string> = {
  active: 'bg-red-500/20 text-red-400 border-red-500/30',
  investigating: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const CHANGE_STATUS_COLORS: Record<ChangeStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_progress: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const PriorityIcon = ({ p }: { p: Priority }) => {
  if (p === 'critical') return <ArrowUpCircle className="w-3.5 h-3.5 text-red-400" />;
  if (p === 'high') return <ArrowUpCircle className="w-3.5 h-3.5 text-orange-400" />;
  if (p === 'medium') return <MinusCircle className="w-3.5 h-3.5 text-yellow-400" />;
  return <ArrowDownCircle className="w-3.5 h-3.5 text-slate-400" />;
};

const Badge = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${className}`}>{children}</span>
);

const fmt = (iso: string) => {
  try { return new Date(iso).toLocaleString('en-MY', { dateStyle: 'short', timeStyle: 'short' }); }
  catch { return iso; }
};

const CATEGORIES = ['API', 'Auth', 'Performance', 'Campaigns', 'Telephony', 'Billing', 'DID', 'Email', 'Other'];
const ASSIGNEES = ['Ali Hassan', 'Priya Nair', 'David Lim', 'Sarah Wong', 'Unassigned'];
const SERVICES = ['SMS API', 'WhatsApp API', 'RCS API', 'Voice API', 'Email API', 'SIP Trunk', 'DID Management', 'Billing', 'Auth'];

// ── Ticket Form Modal ──────────────────────────────────────────────
function TicketModal({ initial, onSave, onClose }: { initial?: ITTicket; onSave: (t: ITTicket) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<ITTicket, 'id' | 'createdAt' | 'updatedAt'>>(
    initial ? { title: initial.title, description: initial.description, priority: initial.priority, status: initial.status, assignee: initial.assignee, category: initial.category }
    : { title: '', description: '', priority: 'medium', status: 'open', assignee: 'Unassigned', category: 'API' }
  );
  const save = () => {
    if (!form.title.trim()) return;
    const now = new Date().toISOString();
    onSave(initial
      ? { ...initial, ...form, updatedAt: now }
      : { id: `t${Date.now()}`, ...form, createdAt: now, updatedAt: now }
    );
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#011a12] border border-[#024d30] rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#024d30]">
          <h2 className="text-white font-black">{initial ? 'Edit Ticket' : 'New Ticket'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Describe the issue" className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Additional details..." className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Priority', key: 'priority', options: ['critical', 'high', 'medium', 'low'] },
              { label: 'Status', key: 'status', options: ['open', 'in_progress', 'resolved', 'closed'] },
              { label: 'Category', key: 'category', options: CATEGORIES },
              { label: 'Assignee', key: 'assignee', options: ASSIGNEES },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>
                <select value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none">
                  {options.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 border border-[#024d30] text-slate-400 hover:text-white rounded-xl text-sm font-black">Cancel</button>
            <button onClick={save} disabled={!form.title.trim()} className="flex-1 py-2.5 bg-[#39FF14] hover:bg-[#32e012] text-black font-black rounded-xl text-sm disabled:opacity-40 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Incident Form Modal ────────────────────────────────────────────
function IncidentModal({ initial, onSave, onClose }: { initial?: Incident; onSave: (i: Incident) => void; onClose: () => void }) {
  const [form, setForm] = useState(initial
    ? { title: initial.title, description: initial.description, priority: initial.priority, status: initial.status, affectedService: initial.affectedService }
    : { title: '', description: '', priority: 'high' as Priority, status: 'active' as IncidentStatus, affectedService: 'SMS API' }
  );
  const save = () => {
    if (!form.title.trim()) return;
    const now = new Date().toISOString();
    onSave(initial
      ? { ...initial, ...form, resolvedAt: form.status === 'resolved' ? now : initial.resolvedAt }
      : { id: `i${Date.now()}`, ...form, createdAt: now }
    );
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#011a12] border border-[#024d30] rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#024d30]">
          <h2 className="text-white font-black">{initial ? 'Edit Incident' : 'Report Incident'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Incident summary" className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Priority', key: 'priority', options: ['critical', 'high', 'medium', 'low'] },
              { label: 'Status', key: 'status', options: ['active', 'investigating', 'resolved'] },
              { label: 'Affected Service', key: 'affectedService', options: SERVICES },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>
                <select value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none">
                  {options.map(o => <option key={o}>{o.replace('_', ' ')}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 border border-[#024d30] text-slate-400 hover:text-white rounded-xl text-sm font-black">Cancel</button>
            <button onClick={save} disabled={!form.title.trim()} className="flex-1 py-2.5 bg-[#39FF14] hover:bg-[#32e012] text-black font-black rounded-xl text-sm disabled:opacity-40 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Change Request Form Modal ──────────────────────────────────────
function ChangeModal({ initial, onSave, onClose }: { initial?: ChangeRequest; onSave: (c: ChangeRequest) => void; onClose: () => void }) {
  const [form, setForm] = useState(initial
    ? { title: initial.title, description: initial.description, priority: initial.priority, status: initial.status, requestedBy: initial.requestedBy, scheduledDate: initial.scheduledDate }
    : { title: '', description: '', priority: 'medium' as Priority, status: 'pending' as ChangeStatus, requestedBy: 'Ali Hassan', scheduledDate: '' }
  );
  const save = () => {
    if (!form.title.trim()) return;
    const now = new Date().toISOString();
    onSave(initial ? { ...initial, ...form } : { id: `c${Date.now()}`, ...form, createdAt: now });
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#011a12] border border-[#024d30] rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#024d30]">
          <h2 className="text-white font-black">{initial ? 'Edit Change Request' : 'New Change Request'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Change summary" className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Priority', key: 'priority', options: ['critical', 'high', 'medium', 'low'] },
              { label: 'Status', key: 'status', options: ['pending', 'approved', 'in_progress', 'completed', 'rejected'] },
              { label: 'Requested By', key: 'requestedBy', options: ASSIGNEES.filter(a => a !== 'Unassigned') },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>
                <select value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none">
                  {options.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Scheduled Date</label>
              <input type="date" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 border border-[#024d30] text-slate-400 hover:text-white rounded-xl text-sm font-black">Cancel</button>
            <button onClick={save} disabled={!form.title.trim()} className="flex-1 py-2.5 bg-[#39FF14] hover:bg-[#32e012] text-black font-black rounded-xl text-sm disabled:opacity-40 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
const TABS = [
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'incidents', label: 'Incidents', icon: AlertOctagon },
  { id: 'changes', label: 'Change Requests', icon: GitMerge },
  { id: 'sla', label: 'SLA Dashboard', icon: BarChart2 },
];

export default function ITServiceManagement() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'incidents' | 'changes' | 'sla'>('tickets');
  const [tickets, setTickets] = useState<ITTicket[]>(() => load(KEYS.tickets, seedTickets));
  const [incidents, setIncidents] = useState<Incident[]>(() => load(KEYS.incidents, seedIncidents));
  const [changes, setChanges] = useState<ChangeRequest[]>(() => load(KEYS.changes, seedChanges));

  const [editingTicket, setEditingTicket] = useState<ITTicket | undefined>();
  const [editingIncident, setEditingIncident] = useState<Incident | undefined>();
  const [editingChange, setEditingChange] = useState<ChangeRequest | undefined>();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState<'all' | TicketStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');

  // Persist on change
  useEffect(() => { save(KEYS.tickets, tickets); }, [tickets]);
  useEffect(() => { save(KEYS.incidents, incidents); }, [incidents]);
  useEffect(() => { save(KEYS.changes, changes); }, [changes]);

  // Ticket CRUD
  const upsertTicket = (t: ITTicket) => {
    setTickets(prev => prev.some(x => x.id === t.id) ? prev.map(x => x.id === t.id ? t : x) : [...prev, t]);
    setShowTicketModal(false); setEditingTicket(undefined);
  };
  const deleteTicket = (id: string) => setTickets(prev => prev.filter(t => t.id !== id));
  const resolveTicket = (id: string) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' as TicketStatus, updatedAt: new Date().toISOString() } : t));

  // Incident CRUD
  const upsertIncident = (i: Incident) => {
    setIncidents(prev => prev.some(x => x.id === i.id) ? prev.map(x => x.id === i.id ? i : x) : [...prev, i]);
    setShowIncidentModal(false); setEditingIncident(undefined);
  };
  const deleteIncident = (id: string) => setIncidents(prev => prev.filter(i => i.id !== id));
  const resolveIncident = (id: string) => setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' as IncidentStatus, resolvedAt: new Date().toISOString() } : i));

  // Change CRUD
  const upsertChange = (c: ChangeRequest) => {
    setChanges(prev => prev.some(x => x.id === c.id) ? prev.map(x => x.id === c.id ? c : x) : [...prev, c]);
    setShowChangeModal(false); setEditingChange(undefined);
  };
  const deleteChange = (id: string) => setChanges(prev => prev.filter(c => c.id !== id));
  const approveChange = (id: string) => setChanges(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' as ChangeStatus } : c));

  // Export CSV
  const exportTicketsCSV = () => {
    const rows = [
      ['ID', 'Title', 'Priority', 'Status', 'Category', 'Assignee', 'Created', 'Updated'],
      ...tickets.map(t => [t.id, t.title, t.priority, t.status, t.category, t.assignee, fmt(t.createdAt), fmt(t.updatedAt)]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `itsm-tickets-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const q = ticketSearch.toLowerCase();
    const matchQ = !q || t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q);
    const matchS = ticketFilter === 'all' || t.status === ticketFilter;
    const matchP = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchQ && matchS && matchP;
  });

  // SLA metrics (computed from data)
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const criticalOpen = tickets.filter(t => t.priority === 'critical' && (t.status === 'open' || t.status === 'in_progress')).length;
  const activeIncidents = incidents.filter(i => i.status !== 'resolved').length;
  const resolvedToday = tickets.filter(t => t.status === 'resolved' && t.updatedAt.startsWith(new Date().toISOString().slice(0, 10))).length;

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#39FF14]/10 via-[#012419] to-[#012419] border-b border-[#024d30] px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#39FF14]/15 rounded-2xl border border-[#39FF14]/20">
              <Shield className="w-8 h-8 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">IT Service Management</h1>
              <p className="text-slate-400 mt-1 text-sm">Manage tickets, incidents, and change requests across the platform</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Open Tickets', value: openTickets, icon: Ticket, color: '#39FF14', sub: `${criticalOpen} critical` },
            { label: 'Active Incidents', value: activeIncidents, icon: AlertOctagon, color: activeIncidents > 0 ? '#ef4444' : '#39FF14', sub: 'service impact' },
            { label: 'Pending Changes', value: changes.filter(c => c.status === 'pending').length, icon: GitMerge, color: '#f59e0b', sub: 'awaiting approval' },
            { label: 'Resolved Today', value: resolvedToday, icon: CheckCircle, color: '#39FF14', sub: 'tickets closed' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  <span className="text-3xl font-black text-white">{stat.value}</span>
                </div>
                <p className="text-white font-bold text-sm">{stat.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{stat.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

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
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 lg:p-8">

        {/* ── TICKETS ── */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={ticketSearch} onChange={e => setTicketSearch(e.target.value)} placeholder="Search tickets…" className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-4 py-2.5 text-white text-sm outline-none pl-10" />
              </div>
              {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
                <button key={s} onClick={() => setTicketFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${ticketFilter === s ? 'bg-[#39FF14] text-black' : 'bg-[#024d30]/40 border border-[#024d30] text-slate-400'}`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map(p => (
                <button key={p} onClick={() => setPriorityFilter(p)} className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${priorityFilter === p ? 'bg-[#39FF14] text-black' : 'bg-[#024d30]/40 border border-[#024d30] text-slate-400'}`}>
                  {p}
                </button>
              ))}
              <div className="ml-auto flex gap-2">
                <button onClick={exportTicketsCSV} className="flex items-center gap-2 border border-[#024d30] text-slate-400 hover:text-[#39FF14] px-3 py-2 rounded-xl text-xs font-black transition-all">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <button onClick={() => { setEditingTicket(undefined); setShowTicketModal(true); }} className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
                  <Plus className="w-4 h-4" /> New Ticket
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#024d30]">
                    {['Title', 'Priority', 'Status', 'Category', 'Assignee', 'Updated', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#024d30]">
                  {filteredTickets.map(t => (
                    <tr key={t.id} className="hover:bg-[#024d30]/20 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-white text-sm font-bold">{t.title}</p>
                        <p className="text-slate-500 text-xs truncate max-w-xs">{t.description}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <PriorityIcon p={t.priority} />
                          <Badge className={PRIORITY_COLORS[t.priority]}>{t.priority}</Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4"><Badge className={TICKET_STATUS_COLORS[t.status]}>{t.status.replace('_', ' ')}</Badge></td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{t.category}</td>
                      <td className="py-3 px-4 text-slate-300 text-sm">{t.assignee}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{fmt(t.updatedAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1.5">
                          {(t.status === 'open' || t.status === 'in_progress') && (
                            <button onClick={() => resolveTicket(t.id)} className="p-1.5 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] rounded-lg" title="Resolve"><CheckCircle className="w-3.5 h-3.5" /></button>
                          )}
                          <button onClick={() => { setEditingTicket(t); setShowTicketModal(true); }} className="p-1.5 bg-[#024d30] hover:bg-[#024d30]/80 text-slate-300 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteTicket(t.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <Ticket className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold">No tickets match your filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── INCIDENTS ── */}
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">Track and manage service-affecting incidents in real time.</p>
              <button onClick={() => { setEditingIncident(undefined); setShowIncidentModal(true); }} className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest">
                <Plus className="w-4 h-4" /> Report Incident
              </button>
            </div>

            <div className="space-y-3">
              {incidents.map(i => (
                <div key={i.id} className={`border rounded-2xl p-5 transition-all ${i.status === 'active' ? 'bg-red-500/5 border-red-500/20' : i.status === 'investigating' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-[#012419]/80 border-[#024d30]'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-white font-black text-sm">{i.title}</h3>
                        <Badge className={INCIDENT_STATUS_COLORS[i.status]}>{i.status}</Badge>
                        <Badge className={PRIORITY_COLORS[i.priority]}>{i.priority}</Badge>
                      </div>
                      <p className="text-slate-400 text-xs mb-2">{i.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Service: <strong className="text-slate-300">{i.affectedService}</strong></span>
                        <span>Opened: {fmt(i.createdAt)}</span>
                        {i.resolvedAt && <span className="text-emerald-500">Resolved: {fmt(i.resolvedAt)}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1.5 ml-4 shrink-0">
                      {i.status !== 'resolved' && (
                        <button onClick={() => resolveIncident(i.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] rounded-xl text-xs font-black">
                          <CheckCircle className="w-3 h-3" /> Resolve
                        </button>
                      )}
                      <button onClick={() => { setEditingIncident(i); setShowIncidentModal(true); }} className="p-1.5 bg-[#024d30] hover:bg-[#024d30]/80 text-slate-300 rounded-xl"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteIncident(i.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {incidents.length === 0 && (
                <div className="text-center py-12">
                  <AlertOctagon className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold">No incidents reported — all systems operational</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CHANGES ── */}
        {activeTab === 'changes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">Submit and track change requests with approval workflow.</p>
              <button onClick={() => { setEditingChange(undefined); setShowChangeModal(true); }} className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest">
                <Plus className="w-4 h-4" /> New Change Request
              </button>
            </div>

            <div className="space-y-3">
              {changes.map(c => (
                <div key={c.id} className="bg-[#012419]/80 border border-[#024d30] hover:border-[#39FF14]/20 rounded-2xl p-5 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-white font-black text-sm">{c.title}</h3>
                        <Badge className={CHANGE_STATUS_COLORS[c.status]}>{c.status.replace('_', ' ')}</Badge>
                        <Badge className={PRIORITY_COLORS[c.priority]}>{c.priority}</Badge>
                      </div>
                      <p className="text-slate-400 text-xs mb-2">{c.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Requested by: <strong className="text-slate-300">{c.requestedBy}</strong></span>
                        {c.scheduledDate && <span>Scheduled: <strong className="text-slate-300">{c.scheduledDate}</strong></span>}
                        <span>Created: {fmt(c.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 ml-4 shrink-0">
                      {c.status === 'pending' && (
                        <button onClick={() => approveChange(c.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl text-xs font-black">
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                      )}
                      <button onClick={() => { setEditingChange(c); setShowChangeModal(true); }} className="p-1.5 bg-[#024d30] hover:bg-[#024d30]/80 text-slate-300 rounded-xl"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteChange(c.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SLA DASHBOARD ── */}
        {activeTab === 'sla' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Ticket breakdown */}
              <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
                <h3 className="text-white font-black text-base mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-[#39FF14]" /> Ticket Status</h3>
                {(['open', 'in_progress', 'resolved', 'closed'] as TicketStatus[]).map(s => {
                  const count = tickets.filter(t => t.status === s).length;
                  const pct = tickets.length > 0 ? (count / tickets.length) * 100 : 0;
                  return (
                    <div key={s} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400 capitalize">{s.replace('_', ' ')}</span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                      <div className="bg-slate-900 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-500 ${TICKET_STATUS_COLORS[s].includes('39FF14') ? 'bg-[#39FF14]' : s === 'open' ? 'bg-blue-500' : s === 'resolved' ? 'bg-emerald-500' : 'bg-slate-600'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Priority breakdown */}
              <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
                <h3 className="text-white font-black text-base mb-4 flex items-center gap-2"><ArrowUpCircle className="w-5 h-5 text-[#39FF14]" /> Priority Breakdown</h3>
                {(['critical', 'high', 'medium', 'low'] as Priority[]).map(p => {
                  const count = tickets.filter(t => t.priority === p).length;
                  const pct = tickets.length > 0 ? (count / tickets.length) * 100 : 0;
                  const barColor = p === 'critical' ? 'bg-red-500' : p === 'high' ? 'bg-orange-500' : p === 'medium' ? 'bg-yellow-500' : 'bg-slate-500';
                  return (
                    <div key={p} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400 capitalize">{p}</span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                      <div className="bg-slate-900 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Incident summary */}
              <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
                <h3 className="text-white font-black text-base mb-4 flex items-center gap-2"><AlertOctagon className="w-5 h-5 text-[#39FF14]" /> Incident Summary</h3>
                <div className="space-y-3">
                  {(['active', 'investigating', 'resolved'] as IncidentStatus[]).map(s => {
                    const count = incidents.filter(i => i.status === s).length;
                    return (
                      <div key={s} className="flex items-center justify-between p-3 bg-[#024d30]/30 rounded-xl">
                        <span className="text-slate-300 text-sm capitalize">{s}</span>
                        <Badge className={INCIDENT_STATUS_COLORS[s]}>{count}</Badge>
                      </div>
                    );
                  })}
                  <div className="pt-1 border-t border-[#024d30]">
                    <p className="text-slate-500 text-xs">Total Incidents: <strong className="text-white">{incidents.length}</strong></p>
                  </div>
                </div>
              </div>

              {/* Change summary */}
              <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
                <h3 className="text-white font-black text-base mb-4 flex items-center gap-2"><GitMerge className="w-5 h-5 text-[#39FF14]" /> Change Request Summary</h3>
                <div className="space-y-3">
                  {(['pending', 'approved', 'in_progress', 'completed', 'rejected'] as ChangeStatus[]).map(s => {
                    const count = changes.filter(c => c.status === s).length;
                    return (
                      <div key={s} className="flex items-center justify-between p-3 bg-[#024d30]/30 rounded-xl">
                        <span className="text-slate-300 text-sm capitalize">{s.replace('_', ' ')}</span>
                        <Badge className={CHANGE_STATUS_COLORS[s]}>{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SLA compliance table */}
            <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
              <h3 className="text-white font-black text-base mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#39FF14]" /> SLA Compliance</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#024d30]">
                    {['Priority', 'SLA Target', 'Avg Resolution', 'Compliance', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#024d30]">
                  {[
                    { priority: 'Critical', target: '4h', avg: '3.2h', pct: 92 },
                    { priority: 'High', target: '8h', avg: '6.8h', pct: 88 },
                    { priority: 'Medium', target: '24h', avg: '18h', pct: 95 },
                    { priority: 'Low', target: '72h', avg: '48h', pct: 98 },
                  ].map(row => (
                    <tr key={row.priority} className="hover:bg-[#024d30]/20">
                      <td className="py-3 px-4 text-slate-300 font-bold text-sm">{row.priority}</td>
                      <td className="py-3 px-4 text-slate-400 text-sm">{row.target}</td>
                      <td className="py-3 px-4 text-slate-300 text-sm">{row.avg}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-900 rounded-full h-2">
                            <div className={`h-2 rounded-full ${row.pct >= 90 ? 'bg-[#39FF14]' : 'bg-yellow-500'}`} style={{ width: `${row.pct}%` }} />
                          </div>
                          <span className="text-white font-black text-sm w-10">{row.pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={row.pct >= 90 ? 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30' : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'}>
                          {row.pct >= 90 ? 'Compliant' : 'At Risk'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showTicketModal && <TicketModal initial={editingTicket} onSave={upsertTicket} onClose={() => { setShowTicketModal(false); setEditingTicket(undefined); }} />}
      {showIncidentModal && <IncidentModal initial={editingIncident} onSave={upsertIncident} onClose={() => { setShowIncidentModal(false); setEditingIncident(undefined); }} />}
      {showChangeModal && <ChangeModal initial={editingChange} onSave={upsertChange} onClose={() => { setShowChangeModal(false); setEditingChange(undefined); }} />}
    </div>
  );
}
