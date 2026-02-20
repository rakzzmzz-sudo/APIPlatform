'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, Download, TrendingUp, MessageSquare, Users, DollarSign,
  FileDown, Package, X, CheckCircle, Clock, Send, Eye, MousePointerClick,
  Phone, Video, Bot, Mail, Globe, Zap, Calendar, ChevronDown, RefreshCw,
  Filter, AlertCircle
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

// ── Platform catalog (all products in the app) ──────────────────────
const ALL_PLATFORMS = [
  { sku: 'SMS-001',    name: 'SMS API',        icon: MessageSquare, category: 'Messaging',  baseMessages: 480_000, baseRevenue: 106_680, deliveryRate: 99.2, color: '#39FF14' },
  { sku: 'WA-001',     name: 'WhatsApp API',   icon: MessageSquare, category: 'Social',     baseMessages: 390_000, baseRevenue: 104_010, deliveryRate: 98.8, color: '#25D366' },
  { sku: 'RCS-001',    name: 'RCS API',        icon: MessageSquare, category: 'Messaging',  baseMessages: 156_000, baseRevenue:  55_485, deliveryRate: 97.5, color: '#6366f1' },
  { sku: 'EMAIL-001',  name: 'Email API',      icon: Mail,          category: 'Messaging',  baseMessages:  78_000, baseRevenue:   3_465, deliveryRate: 96.5, color: '#f59e0b' },
  { sku: 'VOICE-001',  name: 'Voice API',      icon: Phone,         category: 'Voice',      baseMessages:  18_000, baseRevenue:  12_005, deliveryRate: 99.5, color: '#22d3ee' },
  { sku: 'VBOT-001',   name: 'Voice Bot',      icon: Bot,           category: 'Bot',        baseMessages:  12_000, baseRevenue:   5_988, deliveryRate: 97.8, color: '#a78bfa' },
  { sku: 'VIDEO-001',  name: 'Video API',      icon: Video,         category: 'Video',      baseMessages:   2_800, baseRevenue:   3_110, deliveryRate: 96.2, color: '#fb7185' },
  { sku: 'SIP-001',    name: 'SIP Trunk',      icon: Phone,         category: 'Voice',      baseMessages:   9_500, baseRevenue:   8_270, deliveryRate: 99.8, color: '#34d399' },
  { sku: 'DID-001',    name: 'DID Numbers',    icon: Globe,         category: 'Voice',      baseMessages:   3_200, baseRevenue:   4_800, deliveryRate: 100,  color: '#fbbf24' },
];

// Date-range scale factors (relative to 30-day base)
const SCALE: Record<string, number> = {
  '24hours': 1 / 30,
  '7days':   7 / 30,
  '30days':  1,
  '90days':  3,
};

function scaleNum(base: number, factor: number) {
  return Math.round(base * factor);
}

function customFactor(from: string, to: string) {
  if (!from || !to) return 1;
  const diff = (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 86400);
  return Math.max(0.01, diff / 30);
}

const DATE_LABELS: Record<string, string> = {
  '24hours': 'Last 24 Hours',
  '7days':   'Last 7 Days (Weekly)',
  '30days':  'Last 30 Days (Monthly)',
  '90days':  'Last 90 Days (Quarterly)',
  'custom':  'Custom Range',
};

function fmtNum(n: number) { return n.toLocaleString(); }
function fmtRM(n: number) { return `RM ${n.toLocaleString()}`; }

// ── Main ──────────────────────────────────────────────────────────
export default function Reports() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('30days');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [selectedSku, setSelectedSku] = useState('all');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [dbProducts, setDbProducts] = useState<{id:string;sku:string;name:string;category:string}[]>([]);

  useEffect(() => {
    if (user) {
      db.from('products').select('id,sku,name,category').eq('status','active').order('name')
        .then(({ data }) => { if (data) setDbProducts(data); });
    }
  }, [user]);

  // Scale factor reactive to date range
  const factor = useMemo(() => {
    if (dateRange === 'custom') return customFactor(customFrom, customTo);
    return SCALE[dateRange] ?? 1;
  }, [dateRange, customFrom, customTo]);

  // Computed platform stats
  const computedPlatforms = useMemo(() =>
    ALL_PLATFORMS.map(p => ({
      ...p,
      messages:     scaleNum(p.baseMessages, factor),
      revenue:      scaleNum(p.baseRevenue,  factor),
      deliveryRate: p.deliveryRate,
    })), [factor]);

  const platforms = selectedSku === 'all'
    ? computedPlatforms
    : computedPlatforms.filter(p => p.sku === selectedSku);

  // Top-line KPIs across filtered set
  const totalMessages = platforms.reduce((s,p) => s + p.messages, 0);
  const totalRevenue  = platforms.reduce((s,p) => s + p.revenue,  0);
  const avgDelivery   = platforms.length
    ? (platforms.reduce((s,p) => s + p.deliveryRate, 0) / platforms.length).toFixed(1)
    : '0.0';

  // Weekly breakdown (always 4 weeks, proportional)
  const weeklyData = useMemo(() => {
    const weights = [0.22, 0.25, 0.28, 0.25];
    return weights.map((w, i) => ({
      week: `Week ${i + 1}`,
      messages: scaleNum(totalMessages * w, 1),
      revenue:  scaleNum(totalRevenue  * w, 1),
    }));
  }, [totalMessages, totalRevenue]);

  // Monthly breakdown (last 3 months, rolling)
  const monthlyData = useMemo(() => {
    const now = new Date();
    return [-2,-1,0].map(offset => {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const label = d.toLocaleString('en-MY', { month: 'long', year: 'numeric' });
      const w = offset === 0 ? 0.38 : offset === -1 ? 0.35 : 0.27;
      return { month: label, messages: scaleNum(totalMessages * w, 1), revenue: scaleNum(totalRevenue * w, 1) };
    });
  }, [totalMessages, totalRevenue]);

  // ── PDF Export ──────────────────────────────────────────────────
  const generatePDF = () => {
    setIsGeneratingPDF(true);
    const title = selectedSku === 'all'
      ? 'Platform Reports & Analytics'
      : `${platforms[0]?.name || 'Product'} Performance Report`;
    const period = dateRange === 'custom'
      ? `${customFrom} to ${customTo}`
      : DATE_LABELS[dateRange];
    const now = new Date().toLocaleDateString('en-MY', { year:'numeric', month:'long', day:'numeric' });

    const platformRows = platforms.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>${fmtNum(p.messages)}</td>
        <td>${p.deliveryRate}%</td>
        <td>${fmtRM(p.revenue)}</td>
        <td>${(p.revenue / Math.max(1, p.messages)).toFixed(4)} RM/msg</td>
      </tr>`).join('');

    const weekRows = weeklyData.map(w => `
      <tr><td>${w.week}</td><td>${fmtNum(w.messages)}</td><td>${fmtRM(w.revenue)}</td></tr>`).join('');

    const monthRows = monthlyData.map(m => `
      <tr><td>${m.month}</td><td>${fmtNum(m.messages)}</td><td>${fmtRM(m.revenue)}</td></tr>`).join('');

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${title}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; margin: 36px; color: #1f2937; font-size: 13px; }
  h1 { color: #1f2937; font-size: 26px; margin-bottom: 4px; }
  .sub { color: #6b7280; font-size: 13px; margin-bottom: 32px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .kpi { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; background: #f9fafb; }
  .kpi-label { color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: .05em; margin-bottom: 6px; }
  .kpi-value { font-size: 22px; font-weight: 700; color: #111827; }
  .kpi-sub { font-size: 11px; color: #10b981; margin-top: 4px; font-weight: 600; }
  h2 { font-size: 16px; margin: 24px 0 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  th { background: #f3f4f6; padding: 10px 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 12px; }
  td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
  tr:hover td { background: #fafafa; }
  .accent { color: #059669; font-weight: 600; }
  .footer { margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 12px; color: #9ca3af; font-size: 11px; text-align: center; }
  @media print { .no-print { display: none; } body { margin: 20px; } }
</style></head><body>
<h1>${title}</h1>
<div class="sub">Period: <strong>${period}</strong> &nbsp;|&nbsp; Generated: ${now}</div>

<div class="kpi-grid">
  <div class="kpi"><div class="kpi-label">Total Messages</div><div class="kpi-value">${fmtNum(totalMessages)}</div><div class="kpi-sub">All platforms</div></div>
  <div class="kpi"><div class="kpi-label">Avg Delivery Rate</div><div class="kpi-value">${avgDelivery}%</div><div class="kpi-sub">Weighted average</div></div>
  <div class="kpi"><div class="kpi-label">Total Revenue</div><div class="kpi-value">${fmtRM(totalRevenue)}</div><div class="kpi-sub">Gross</div></div>
  <div class="kpi"><div class="kpi-label">Platforms</div><div class="kpi-value">${platforms.length}</div><div class="kpi-sub">Active channels</div></div>
</div>

<h2>Platform Performance</h2>
<table>
  <thead><tr><th>Platform</th><th>Category</th><th>Messages</th><th>Delivery Rate</th><th>Revenue (RM)</th><th>Cost per Msg</th></tr></thead>
  <tbody>${platformRows}</tbody>
</table>

<h2>Weekly Breakdown</h2>
<table>
  <thead><tr><th>Period</th><th>Messages</th><th>Revenue</th></tr></thead>
  <tbody>${weekRows}</tbody>
</table>

<h2>Monthly Breakdown (Last 3 Months)</h2>
<table>
  <thead><tr><th>Month</th><th>Messages</th><th>Revenue</th></tr></thead>
  <tbody>${monthRows}</tbody>
</table>

<h2>Key Insights</h2>
<ul>
  <li><strong>Top Platform by Volume:</strong> ${platforms.reduce((a,b) => b.messages > a.messages ? b : a, platforms[0])?.name || '-'}</li>
  <li><strong>Top Platform by Revenue:</strong> ${platforms.reduce((a,b) => b.revenue > a.revenue ? b : a, platforms[0])?.name || '-'}</li>
  <li><strong>Best Delivery Rate:</strong> ${[...platforms].sort((a,b) => b.deliveryRate - a.deliveryRate)[0]?.name || '-'} (${[...platforms].sort((a,b) => b.deliveryRate - a.deliveryRate)[0]?.deliveryRate || 0}%)</li>
  <li><strong>Total Revenue for Period:</strong> ${fmtRM(totalRevenue)}</li>
</ul>

<div class="footer">CPaaS Platform Analytics &mdash; &copy; ${new Date().getFullYear()} Maxis Communications. All rights reserved.</div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if (win) {
      win.onload = () => { setTimeout(() => { win.print(); setIsGeneratingPDF(false); }, 300); };
    } else {
      alert('Please allow pop-ups to export PDF');
      setIsGeneratingPDF(false);
    }
  };

  // ── CSV Export ──────────────────────────────────────────────────
  const exportCSV = () => {
    setIsExportingCSV(true);
    const period = dateRange === 'custom'
      ? `${customFrom} to ${customTo}`
      : DATE_LABELS[dateRange];

    const header = ['Platform', 'Category', 'Messages', 'Delivery Rate (%)', 'Revenue (RM)', 'Cost Per Message (RM)'];
    const rows   = platforms.map(p => [
      p.name, p.category, p.messages, p.deliveryRate,
      p.revenue, (p.revenue / Math.max(1, p.messages)).toFixed(4)
    ]);

    const weekHeader = ['Week', 'Messages', 'Revenue (RM)'];
    const weekRows   = weeklyData.map(w => [w.week, w.messages, w.revenue]);

    const monthHeader = ['Month', 'Messages', 'Revenue (RM)'];
    const monthRows   = monthlyData.map(m => [m.month, m.messages, m.revenue]);

    const toCSV = (arr: (string|number)[][]) =>
      arr.map(r => r.map(v => `"${v}"`).join(',')).join('\n');

    const csv = [
      `"Report Period","${period}"`,
      `"Generated","${new Date().toLocaleString()}"`,
      '',
      '"=== PLATFORM SUMMARY ==="',
      toCSV([header, ...rows]),
      '',
      '"=== WEEKLY BREAKDOWN ==="',
      toCSV([weekHeader, ...weekRows]),
      '',
      '"=== MONTHLY BREAKDOWN ==="',
      toCSV([monthHeader, ...monthRows]),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const slug = selectedSku === 'all' ? 'all-products' : selectedSku.toLowerCase();
    const date = new Date().toISOString().slice(0, 10);
    a.href = url; a.download = `cpaas-report-${slug}-${date}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    setIsExportingCSV(false);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#39FF14]/10 via-[#012419] to-[#012419] border-b border-[#024d30] px-8 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#39FF14]/15 rounded-2xl border border-[#39FF14]/20">
              <BarChart3 className="w-8 h-8 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">Reports & Analytics</h1>
              <p className="text-slate-400 mt-1 text-sm">
                {selectedSku === 'all'
                  ? `All ${ALL_PLATFORMS.length} platform channels`
                  : `${platforms[0]?.name || ''} — ${DATE_LABELS[dateRange]}`}
              </p>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={exportCSV}
              disabled={isExportingCSV}
              className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-black font-black px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-[#39FF14]/20"
            >
              {isExportingCSV ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExportingCSV ? 'Exporting…' : 'Export CSV'}
            </button>
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {isGeneratingPDF ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              {isGeneratingPDF ? 'Generating…' : 'Export PDF'}
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Total Messages', value: fmtNum(totalMessages), icon: Send, sub: 'all channels' },
            { label: 'Avg Delivery Rate', value: `${avgDelivery}%`, icon: CheckCircle, sub: 'weighted avg' },
            { label: 'Total Revenue', value: fmtRM(totalRevenue), icon: DollarSign, sub: 'gross' },
            { label: 'Active Channels', value: platforms.length, icon: Zap, sub: `of ${ALL_PLATFORMS.length} total` },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <Icon className="w-5 h-5 text-[#39FF14]" />
                  <span className="text-2xl font-black text-white">{k.value}</span>
                </div>
                <p className="text-white font-bold text-sm">{k.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{k.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-[#012419]/80 border-b border-[#024d30] px-8 py-4 flex flex-wrap gap-3 items-end">
        {/* Product selector */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Product</p>
          <select
            value={selectedSku}
            onChange={e => setSelectedSku(e.target.value)}
            className="bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none min-w-[180px]"
          >
            <option value="all">All Products</option>
            {ALL_PLATFORMS.map(p => <option key={p.sku} value={p.sku}>{p.name}</option>)}
          </select>
        </div>

        {/* Date range quick filters */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Period</p>
          <div className="flex gap-1">
            {(['24hours','7days','30days','90days','custom'] as const).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${dateRange === r ? 'bg-[#39FF14] text-black' : 'bg-[#024d30]/40 border border-[#024d30] text-slate-400 hover:text-white'}`}
              >
                {r === '24hours' ? '24H' : r === '7days' ? 'Weekly' : r === '30days' ? 'Monthly' : r === '90days' ? 'Quarterly' : 'Custom'}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date pickers */}
        {dateRange === 'custom' && (
          <div className="flex items-end gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">From</p>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                className="bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">To</p>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                className="bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none" />
            </div>
          </div>
        )}

        {/* Active filter label */}
        <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-xl">
          <Calendar className="w-4 h-4 text-[#39FF14]" />
          <span className="text-[#39FF14] text-xs font-black">
            {dateRange === 'custom'
              ? (customFrom && customTo ? `${customFrom} → ${customTo}` : 'Select dates')
              : DATE_LABELS[dateRange]}
          </span>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8">
        {/* Platform cards grid */}
        <div>
          <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#39FF14]" /> Platform Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {platforms.map(p => {
              const Icon = p.icon;
              const maxMsg = Math.max(...platforms.map(x => x.messages), 1);
              const pct = (p.messages / maxMsg) * 100;
              return (
                <div
                  key={p.sku}
                  onClick={() => setSelectedSku(selectedSku === p.sku ? 'all' : p.sku)}
                  className={`bg-[#012419]/80 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] ${selectedSku === p.sku ? 'border-[#39FF14]/60 shadow-lg shadow-[#39FF14]/10' : 'border-[#024d30] hover:border-[#39FF14]/20'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${p.color}20` }}>
                        <Icon className="w-4 h-4" style={{ color: p.color }} />
                      </div>
                      <div>
                        <p className="text-white font-black text-sm">{p.name}</p>
                        <p className="text-slate-500 text-[10px]">{p.category}</p>
                      </div>
                    </div>
                    <span className="text-[#39FF14] font-black text-sm">{fmtRM(p.revenue)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-[#024d30]/30 rounded-xl p-2.5">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Messages</p>
                      <p className="text-white font-black text-base">{fmtNum(p.messages)}</p>
                    </div>
                    <div className="bg-[#024d30]/30 rounded-xl p-2.5">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Delivery</p>
                      <p className="font-black text-base" style={{ color: p.deliveryRate >= 99 ? '#39FF14' : '#f59e0b' }}>{p.deliveryRate}%</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Volume share</span>
                      <span className="text-slate-400">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full performance table */}
        <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#024d30] flex items-center justify-between">
            <h2 className="text-white font-black text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#39FF14]" /> Detailed Breakdown
            </h2>
            <span className="text-slate-500 text-xs">{DATE_LABELS[dateRange] || 'Custom Range'}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#024d30]">
                  {['Platform','Category','Messages','Delivery Rate','Revenue','Cost/Msg'].map(h => (
                    <th key={h} className="text-left py-3 px-5 text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#024d30]">
                {platforms.map(p => (
                  <tr key={p.sku} className="hover:bg-[#024d30]/20 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="text-white font-bold text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-400 text-sm">{p.category}</td>
                    <td className="py-4 px-5 text-white font-semibold text-sm">{fmtNum(p.messages)}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm" style={{ color: p.deliveryRate >= 99 ? '#39FF14' : '#f59e0b' }}>{p.deliveryRate}%</span>
                        <div className="flex-1 bg-slate-900 rounded-full h-1.5 min-w-[60px]">
                          <div className="h-1.5 rounded-full" style={{ width: `${p.deliveryRate}%`, backgroundColor: p.deliveryRate >= 99 ? '#39FF14' : '#f59e0b' }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[#39FF14] font-black text-sm">{fmtRM(p.revenue)}</td>
                    <td className="py-4 px-5 text-slate-400 text-sm">RM {(p.revenue / Math.max(1, p.messages)).toFixed(4)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#024d30] bg-[#024d30]/20">
                  <td className="py-4 px-5 text-white font-black text-sm" colSpan={2}>TOTAL</td>
                  <td className="py-4 px-5 text-white font-black text-sm">{fmtNum(totalMessages)}</td>
                  <td className="py-4 px-5 text-[#39FF14] font-black text-sm">{avgDelivery}%</td>
                  <td className="py-4 px-5 text-[#39FF14] font-black text-sm">{fmtRM(totalRevenue)}</td>
                  <td className="py-4 px-5 text-slate-400 text-sm">RM {(totalRevenue / Math.max(1, totalMessages)).toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly + Monthly breakdown side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly */}
          <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
            <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#39FF14]" /> Weekly Breakdown
            </h3>
            <div className="space-y-3">
              {weeklyData.map((w, i) => {
                const maxW = Math.max(...weeklyData.map(x => x.messages), 1);
                const pct  = (w.messages / maxW) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300 font-semibold">{w.week}</span>
                      <div className="flex gap-4">
                        <span className="text-slate-400">{fmtNum(w.messages)}</span>
                        <span className="text-[#39FF14] font-black">{fmtRM(w.revenue)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#39FF14] to-[#32e012] h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly */}
          <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
            <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#39FF14]" /> Monthly Breakdown
            </h3>
            <div className="space-y-3">
              {monthlyData.map((m, i) => {
                const maxM = Math.max(...monthlyData.map(x => x.messages), 1);
                const pct  = (m.messages / maxM) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300 font-semibold">{m.month}</span>
                      <div className="flex gap-4">
                        <span className="text-slate-400">{fmtNum(m.messages)}</span>
                        <span className="text-[#39FF14] font-black">{fmtRM(m.revenue)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#39FF14] to-[#32e012] h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue vs Volume chart */}
        <div className="bg-[#012419]/80 border border-[#024d30] rounded-2xl p-6">
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#39FF14]" /> Revenue by Platform
          </h3>
          <div className="space-y-3">
            {[...platforms].sort((a,b) => b.revenue - a.revenue).map(p => {
              const maxR = Math.max(...platforms.map(x => x.revenue), 1);
              const pct  = (p.revenue / maxR) * 100;
              return (
                <div key={p.sku}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300 font-semibold">{p.name}</span>
                    <span className="text-[#39FF14] font-black">{fmtRM(p.revenue)}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
