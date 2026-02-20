import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, XCircle, Clock, Play, AlertTriangle, Code,
  RefreshCw, Plus, Trash2, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';

interface TestSuite {
  id: string;
  name: string;
  platform: string;
  tests: number;
  passed: number;
  failed: number;
  pending: number;
  lastRun: string;
  status: 'passing' | 'failing' | 'pending' | 'running';
}

const PLATFORMS = ['SMS', 'WhatsApp', 'RCS', 'Voice', 'Video', 'Email', 'SIP Trunk', 'DID', 'AI Bot'];

export default function FeatureValidation() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    { id: '1', name: 'SMS API Integration Tests', platform: 'SMS', tests: 45, passed: 43, failed: 2, pending: 0, lastRun: '2 hours ago', status: 'failing' },
    { id: '2', name: 'WhatsApp Message Delivery', platform: 'WhatsApp', tests: 32, passed: 32, failed: 0, pending: 0, lastRun: '1 hour ago', status: 'passing' },
    { id: '3', name: 'RCS Rich Media Tests', platform: 'RCS', tests: 28, passed: 26, failed: 0, pending: 2, lastRun: '3 hours ago', status: 'pending' },
    { id: '4', name: 'Voice Call Quality Tests', platform: 'Voice', tests: 18, passed: 18, failed: 0, pending: 0, lastRun: '30 minutes ago', status: 'passing' },
    { id: '5', name: 'Video Conferencing Tests', platform: 'Video', tests: 25, passed: 0, failed: 0, pending: 25, lastRun: 'Never', status: 'pending' },
  ]);
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSuite, setNewSuite] = useState({ name: '', platform: 'SMS', tests: '10' });
  const [filter, setFilter] = useState<'all' | 'passing' | 'failing' | 'pending'>('all');
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passing': return <CheckCircle className="w-5 h-5 text-[#39FF14]" />;
      case 'failing': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'running': return <Loader2 className="w-5 h-5 text-[#39FF14] animate-spin" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      passing: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30',
      failing: 'bg-red-500/15 text-red-400 border-red-500/30',
      pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
      running: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30',
    };
    return map[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  };

  const markRunning = (id: string) =>
    setTestSuites(prev => prev.map(s => s.id === id ? { ...s, status: 'running' as const } : s));

  const runSingleTest = (suiteId: string) => {
    // Cancel any existing timer for this suite
    const existing = timers.current.get(suiteId);
    if (existing) clearTimeout(existing);

    markRunning(suiteId);

    const timer = setTimeout(() => {
      setTestSuites(prev => prev.map(s => {
        if (s.id !== suiteId) return s;
        // Simulate realistic results: 1-2 random failures sometimes
        const failed = Math.random() > 0.8 ? Math.floor(Math.random() * 2) + 1 : 0;
        return {
          ...s,
          passed: s.tests - failed,
          failed,
          pending: 0,
          lastRun: 'Just now',
          status: (failed > 0 ? 'failing' : 'passing') as TestSuite['status'],
        };
      }));
      timers.current.delete(suiteId);
    }, 1800 + Math.random() * 1200);
    timers.current.set(suiteId, timer);
  };

  const runAllTests = () => {
    // Cancel all pending timers
    timers.current.forEach(t => clearTimeout(t));
    timers.current.clear();

    setTestSuites(prev => prev.map(s => ({ ...s, status: 'running' as const })));

    testSuites.forEach((suite, i) => {
      const delay = 1500 + i * 400;
      const timer = setTimeout(() => {
        setTestSuites(prev => prev.map(s => {
          if (s.id !== suite.id) return s;
          const failed = Math.random() > 0.85 ? Math.floor(Math.random() * 2) + 1 : 0;
          return {
            ...s,
            passed: s.tests - failed,
            failed,
            pending: 0,
            lastRun: 'Just now',
            status: (failed > 0 ? 'failing' : 'passing') as TestSuite['status'],
          };
        }));
        timers.current.delete(suite.id);
      }, delay);
      timers.current.set(suite.id, timer);
    });
  };

  const resetSuite = (suiteId: string) => {
    const existing = timers.current.get(suiteId);
    if (existing) clearTimeout(existing);
    setTestSuites(prev => prev.map(s =>
      s.id === suiteId ? { ...s, passed: 0, failed: 0, pending: s.tests, lastRun: 'Never', status: 'pending' } : s
    ));
  };

  const deleteSuite = (suiteId: string) => {
    const existing = timers.current.get(suiteId);
    if (existing) clearTimeout(existing);
    timers.current.delete(suiteId);
    setTestSuites(prev => prev.filter(s => s.id !== suiteId));
  };

  const addSuite = () => {
    if (!newSuite.name.trim()) return;
    const testCount = Math.max(1, parseInt(newSuite.tests) || 10);
    setTestSuites(prev => [...prev, {
      id: Date.now().toString(),
      name: newSuite.name.trim(),
      platform: newSuite.platform,
      tests: testCount,
      passed: 0,
      failed: 0,
      pending: testCount,
      lastRun: 'Never',
      status: 'pending',
    }]);
    setNewSuite({ name: '', platform: 'SMS', tests: '10' });
    setShowAddModal(false);
  };

  const toggleExpand = (id: string) =>
    setExpandedSuites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const totalTests = testSuites.reduce((s, x) => s + x.tests, 0);
  const totalPassed = testSuites.reduce((s, x) => s + x.passed, 0);
  const totalFailed = testSuites.reduce((s, x) => s + x.failed, 0);
  const totalPending = testSuites.reduce((s, x) => s + x.pending, 0);
  const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';
  const isAnyRunning = testSuites.some(s => s.status === 'running');

  const filtered = filter === 'all' ? testSuites : testSuites.filter(s => s.status === filter);

  return (
    <div className="flex-1 overflow-auto bg-[#012419]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#39FF14]/10 via-[#012419] to-[#012419] border-b border-[#024d30] px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#39FF14]/15 rounded-2xl border border-[#39FF14]/20">
              <Code className="w-8 h-8 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">Feature Validation</h1>
              <p className="text-slate-400 mt-1 text-sm">Automated testing and validation for all platform features</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#024d30] hover:bg-[#026040] border border-[#39FF14]/20 text-[#39FF14] px-4 py-2.5 rounded-xl font-black text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Add Suite
            </button>
            <button
              onClick={runAllTests}
              disabled={isAnyRunning}
              className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#39FF14]/20"
            >
              {isAnyRunning ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</> : <><Play className="w-4 h-4" /> Run All Tests</>}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Total Tests', value: totalTests, sub: 'across all suites', icon: Code, color: '#39FF14' },
            { label: 'Passed', value: totalPassed, sub: `${passRate}% pass rate`, icon: CheckCircle, color: '#39FF14' },
            { label: 'Failed', value: totalFailed, sub: totalFailed > 0 ? 'Requires attention' : 'All clear', icon: XCircle, color: totalFailed > 0 ? '#ef4444' : '#39FF14' },
            { label: 'Pending', value: totalPending, sub: 'Not yet run', icon: Clock, color: '#f59e0b' },
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

      <div className="p-6 lg:p-8 space-y-6">
        {/* Alert */}
        {totalFailed > 0 && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-black text-sm">Test Failures Detected</p>
              <p className="text-slate-400 text-sm mt-0.5">
                {totalFailed} test{totalFailed > 1 ? 's have' : ' has'} failed. Review before deploying to production.
              </p>
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex gap-2">
          {(['all', 'passing', 'failing', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#39FF14] text-black' : 'bg-[#024d30]/40 border border-[#024d30] text-slate-400 hover:text-white'}`}
            >
              {f === 'all' ? `All (${testSuites.length})` : `${f} (${testSuites.filter(s => s.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Suites */}
        <div className="space-y-4">
          {filtered.map(suite => {
            const expanded = expandedSuites.has(suite.id);
            const pct = suite.tests > 0 ? (suite.passed / suite.tests) * 100 : 0;
            return (
              <div key={suite.id} className="bg-[#012419]/80 border border-[#024d30] rounded-2xl overflow-hidden transition-all hover:border-[#39FF14]/20">
                {/* Header */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(suite.id)}>
                    {getStatusIcon(suite.status)}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-black text-base">{suite.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(suite.status)}`}>
                          {suite.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/50 text-slate-400 border border-slate-700">
                          {suite.platform}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">Last run: {suite.lastRun}</p>
                    </div>
                    <button className="ml-2 text-slate-500 shrink-0">
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => runSingleTest(suite.id)}
                      disabled={suite.status === 'running'}
                      className="flex items-center gap-1.5 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-xl font-black text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {suite.status === 'running' ? <><Loader2 className="w-3 h-3 animate-spin" /> Running…</> : <><Play className="w-3 h-3" /> Run</>}
                    </button>
                    <button
                      onClick={() => resetSuite(suite.id)}
                      disabled={suite.status === 'running'}
                      className="p-2 bg-[#024d30]/60 hover:bg-[#024d30] text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-40"
                      title="Reset suite"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSuite(suite.id)}
                      disabled={suite.status === 'running'}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all disabled:opacity-40"
                      title="Delete suite"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar always visible */}
                <div className="px-5 pb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-white font-bold">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ${suite.failed > 0 ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-[#39FF14] to-[#32e012]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded && (
                  <div className="border-t border-[#024d30] px-5 py-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Passed', value: suite.passed, color: 'text-[#39FF14]', bg: 'bg-[#39FF14]/10' },
                        { label: 'Failed', value: suite.failed, color: 'text-red-400', bg: 'bg-red-500/10' },
                        { label: 'Pending', value: suite.pending, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                      ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
                          <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                          <p className={`text-xs font-bold ${stat.color} opacity-70 mt-0.5`}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-500 text-xs mt-3">Total test cases: <strong className="text-slate-300">{suite.tests}</strong></p>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-14">
              <Code className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-bold">No suites match this filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Suite Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#011a12] border border-[#024d30] rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-black text-lg mb-4">Add Test Suite</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Suite Name *</label>
                <input
                  type="text"
                  value={newSuite.name}
                  onChange={e => setNewSuite(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Email Delivery Tests"
                  className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Platform</label>
                <select
                  value={newSuite.platform}
                  onChange={e => setNewSuite(p => ({ ...p, platform: e.target.value }))}
                  className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none"
                >
                  {PLATFORMS.map(pl => <option key={pl}>{pl}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Number of Tests</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={newSuite.tests}
                  onChange={e => setNewSuite(p => ({ ...p, tests: e.target.value }))}
                  className="w-full bg-[#012419] border border-[#024d30] focus:border-[#39FF14] rounded-xl px-3 py-2.5 text-white text-sm outline-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-[#024d30] text-slate-400 hover:text-white rounded-xl text-sm font-black">Cancel</button>
                <button onClick={addSuite} disabled={!newSuite.name.trim()} className="flex-1 py-2.5 bg-[#39FF14] hover:bg-[#32e012] text-black font-black rounded-xl text-sm disabled:opacity-40">
                  Add Suite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
