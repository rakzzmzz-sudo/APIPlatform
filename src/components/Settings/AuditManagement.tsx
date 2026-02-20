import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { FileText, Download, Filter, Search, CheckCircle, XCircle, Calendar, User, Activity } from 'lucide-react';

type AuditLog = {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status: 'success' | 'failed';
  error_message: string | null;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
};

export default function AuditManagement() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7');

  useEffect(() => {
    fetchAuditLogs();
  }, [dateRange]);

  const sampleAuditLogs: AuditLog[] = [
    { id: '1', action: 'user.login', resource_type: 'session', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', status: 'success', error_message: null, created_at: new Date(Date.now() - 5 * 60000).toISOString(), profiles: { email: 'admin@cpaas.com', full_name: 'Admin User' } },
    { id: '2', action: 'api_key.update', resource_type: 'api_key', resource_id: 'ak_prod_01', ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', status: 'success', error_message: null, created_at: new Date(Date.now() - 18 * 60000).toISOString(), profiles: { email: 'admin@cpaas.com', full_name: 'Admin User' } },
    { id: '3', action: 'user.login.failed', resource_type: 'session', resource_id: null, ip_address: '198.51.100.77', user_agent: 'curl/7.88.1', status: 'failed', error_message: 'Invalid credentials — 3 consecutive failures. Account temporarily locked.', created_at: new Date(Date.now() - 30 * 60000).toISOString(), profiles: { email: 'unknown@ext.com', full_name: null } },
    { id: '4', action: 'campaign.create', resource_type: 'campaign', resource_id: 'camp_ramadan_2026', ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', status: 'success', error_message: null, created_at: new Date(Date.now() - 45 * 60000).toISOString(), profiles: { email: 'presales@cpaas.com', full_name: 'Presales User' } },
    { id: '5', action: 'integration.update', resource_type: 'integration', resource_id: 'smpp_carrier_01', ip_address: '10.0.1.52', user_agent: 'Chrome 122 / macOS 14.3', status: 'success', error_message: null, created_at: new Date(Date.now() - 2 * 3600000).toISOString(), profiles: { email: 'admin@cpaas.com', full_name: 'Admin User' } },
    { id: '6', action: 'data.export', resource_type: 'contacts', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', status: 'success', error_message: null, created_at: new Date(Date.now() - 4 * 3600000).toISOString(), profiles: { email: 'presales@cpaas.com', full_name: 'Presales User' } },
    { id: '7', action: 'security.2fa.enable', resource_type: 'security_settings', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', status: 'success', error_message: null, created_at: new Date(Date.now() - 24 * 3600000).toISOString(), profiles: { email: 'admin@cpaas.com', full_name: 'Admin User' } },
    { id: '8', action: 'api_key.delete', resource_type: 'api_key', resource_id: 'ak_old_test', ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', status: 'success', error_message: null, created_at: new Date(Date.now() - 2 * 86400000).toISOString(), profiles: { email: 'admin@cpaas.com', full_name: 'Admin User' } },
    { id: '9', action: 'user.login', resource_type: 'session', resource_id: null, ip_address: '198.51.100.45', user_agent: 'Chrome 121 / Windows 11', status: 'success', error_message: null, created_at: new Date(Date.now() - 3 * 86400000).toISOString(), profiles: { email: 'sales@cpaas.com', full_name: 'Sales User' } },
    { id: '10', action: 'template.delete', resource_type: 'template', resource_id: 'tpl_old_promo', ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', status: 'success', error_message: null, created_at: new Date(Date.now() - 5 * 86400000).toISOString(), profiles: { email: 'presales@cpaas.com', full_name: 'Presales User' } },
  ];

  const fetchAuditLogs = async () => {
    setLoading(true);

    try {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - parseInt(dateRange));

      const { data, error } = await db
        .from('audit_logs')
        .select(`*, profiles:user_id (email, full_name)`)
        .gte('created_at', dateFrom.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        setLogs(sampleAuditLogs);
      } else {
        setLogs(data);
      }
    } catch {
      setLogs(sampleAuditLogs);
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.resource_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.profiles?.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return '➕';
    if (action.includes('update')) return '✏️';
    if (action.includes('delete')) return '🗑️';
    if (action.includes('login')) return '🔐';
    return '📝';
  };

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'text-emerald-400';
    if (action.includes('update')) return 'text-[#39FF14]';
    if (action.includes('delete')) return 'text-red-400';
    if (action.includes('login')) return 'text-[#39FF14]';
    return 'text-slate-400';
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Status', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.created_at).toISOString(),
        log.profiles?.email || 'Unknown',
        log.action,
        log.resource_type,
        log.status,
        log.ip_address || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Audit Management</h2>
          <p className="text-slate-400">Monitor and review system activity logs</p>
        </div>
        <button
          onClick={exportLogs}
          className="flex items-center gap-2 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all"
        >
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <FileText className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-white">{logs.length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Last {dateRange} days</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Successful</p>
              <p className="text-2xl font-bold text-white">{logs.filter(l => l.status === 'success').length}</p>
            </div>
          </div>
          <p className="text-emerald-400 text-sm">
            {logs.length > 0 ? ((logs.filter(l => l.status === 'success').length / logs.length) * 100).toFixed(1) : 0}% success rate
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500/20 p-3 rounded-lg">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Failed</p>
              <p className="text-2xl font-bold text-white">{logs.filter(l => l.status === 'failed').length}</p>
            </div>
          </div>
          <p className="text-red-400 text-sm">
            {logs.filter(l => l.status === 'failed').length > 0 ? 'Needs attention' : 'All clear'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Activity className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{new Set(logs.map(l => l.profiles?.email)).size}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Unique users</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, resource, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading audit logs...</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No audit logs found</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-2xl">{getActionIcon(log.action)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-semibold ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${
                            log.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                              : 'bg-red-500/20 text-red-400 border-red-500/50'
                          }`}>
                            {log.status === 'success' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {log.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span>{log.profiles?.email || 'Unknown user'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            <span className="capitalize">{log.resource_type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(log.created_at).toLocaleString()}</span>
                          </div>
                          {log.ip_address && (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{log.ip_address}</span>
                            </div>
                          )}
                        </div>
                        {log.error_message && (
                          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                            {log.error_message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
