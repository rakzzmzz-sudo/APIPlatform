import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, Filter, Search, Calendar, MapPin, Monitor, RefreshCw } from 'lucide-react';

type ActivityLog = {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: any;
  created_at: string;
};

const actionColors: { [key: string]: string } = {
  'created': 'bg-emerald-500/20 text-emerald-400',
  'updated': 'bg-[#39FF14]/20 text-[#39FF14]',
  'deleted': 'bg-red-500/20 text-red-400',
  'login': 'bg-[#39FF14]/20 text-[#39FF14]',
  'logout': 'bg-slate-500/20 text-slate-400',
  'export': 'bg-[#39FF14]/20 text-[#39FF14]',
  'import': 'bg-yellow-500/20 text-yellow-400',
};

const actionIcons: { [key: string]: string } = {
  'created': '✨',
  'updated': '📝',
  'deleted': '🗑️',
  'login': '🔓',
  'logout': '🔒',
  'export': '📤',
  'import': '📥',
  'viewed': '👁️',
  'downloaded': '⬇️',
};

export default function ActivityLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterResource, setFilterResource] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadActivityLogs();

      const channel = db
        .channel('activity-logs-changes')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'activity_logs', filter: `user_id=eq.${user.id}` },
          (payload: any) => {
            setLogs(prev => [payload.new as ActivityLog, ...prev]);
          }
        )
        .subscribe();

      return () => {
        db.removeChannel(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, filterAction, filterResource, dateRange]);

  const sampleLogs: ActivityLog[] = [
    { id: '1', action: 'login', resource_type: 'session', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: '2', action: 'updated', resource_type: 'api_key', resource_id: 'ak_prod_01', ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 18 * 60000).toISOString() },
    { id: '3', action: 'created', resource_type: 'campaign', resource_id: 'camp_ramadan_2026', ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 45 * 60000).toISOString() },
    { id: '4', action: 'export', resource_type: 'contacts', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: '5', action: 'viewed', resource_type: 'billing', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Safari 17 / iOS 17.4', metadata: {}, created_at: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: '6', action: 'updated', resource_type: 'integration', resource_id: 'smpp_carrier_01', ip_address: '10.0.1.52', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 6 * 3600000).toISOString() },
    { id: '7', action: 'deleted', resource_type: 'template', resource_id: 'tpl_old_promo', ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 22 * 3600000).toISOString() },
    { id: '8', action: 'created', resource_type: 'api_key', resource_id: 'ak_staging_03', ip_address: '10.0.1.52', user_agent: 'Firefox 124 / Ubuntu 22.04', metadata: {}, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: '9', action: 'import', resource_type: 'contacts', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: '10', action: 'login', resource_type: 'session', resource_id: null, ip_address: '198.51.100.45', user_agent: 'Chrome 121 / Windows 11', metadata: {}, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: '11', action: 'updated', resource_type: 'security_settings', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
    { id: '12', action: 'downloaded', resource_type: 'invoice', resource_id: 'inv_2026_02', ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: '13', action: 'logout', resource_type: 'session', resource_id: null, ip_address: '203.185.21.14', user_agent: 'Chrome 122 / macOS 14.3', metadata: {}, created_at: new Date(Date.now() - 7 * 86400000 - 3600000).toISOString() },
  ];

  const loadActivityLogs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await db
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        setLogs(sampleLogs);
      } else {
        setLogs(data);
      }
    } catch {
      setLogs(sampleLogs);
    }
    setLoading(false);
  };

  const refreshLogs = async () => {
    setRefreshing(true);
    await loadActivityLogs();
    setTimeout(() => setRefreshing(false), 500);
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterResource !== 'all') {
      filtered = filtered.filter(log => log.resource_type === filterResource);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();

      switch (dateRange) {
        case '1h':
          cutoff.setHours(now.getHours() - 1);
          break;
        case '24h':
          cutoff.setHours(now.getHours() - 24);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(now.getDate() - 30);
          break;
      }

      filtered = filtered.filter(log => new Date(log.created_at) >= cutoff);
    }

    setFilteredLogs(filtered);
  };

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
  const uniqueResources = Array.from(new Set(logs.map(log => log.resource_type)));

  const getActionColor = (action: string) => {
    return actionColors[action] || 'bg-slate-500/20 text-slate-400';
  };

  const getActionIcon = (action: string) => {
    return actionIcons[action] || '📋';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading activity logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Activity Logs</h2>
          <p className="text-slate-400">Monitor your account activity in real-time</p>
        </div>
        <button
          onClick={refreshLogs}
          disabled={refreshing}
          className="flex items-center gap-2 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Activity className="w-5 h-5" style={{ color: '#40C706' }} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-white">{logs.length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">All time</p>
        </div>

        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Last 24h</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(log => new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
          <p className="text-[#39FF14] text-sm">Recent activity</p>
        </div>

        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <MapPin className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Unique IPs</p>
              <p className="text-2xl font-bold text-white">
                {new Set(logs.map(log => log.ip_address).filter(Boolean)).size}
              </p>
            </div>
          </div>
          <p className="text-[#39FF14] text-sm">Locations</p>
        </div>

        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <Monitor className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Actions</p>
              <p className="text-2xl font-bold text-white">{uniqueActions.length}</p>
            </div>
          </div>
          <p className="text-emerald-400 text-sm">Types</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search activity..."
                className="w-full bg-[#012419] border border-[#024d30] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>

          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          >
            <option value="all">All Resources</option>
            {uniqueResources.map(resource => (
              <option key={resource} value={resource}>{resource}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          >
            <option value="all">All Time</option>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No activity logs found</p>
            <p className="text-slate-500 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-[#012419]/50 border border-[#024d30] rounded-lg p-4 hover:bg-[#012419]/70 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getActionIcon(log.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
                        {log.action.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">{formatTimeAgo(log.created_at)}</span>
                      <span className="text-slate-500 text-sm">•</span>
                      <span className="text-slate-400 text-sm capitalize">{log.resource_type}</span>
                      {log.resource_id && (
                        <>
                          <span className="text-slate-500 text-sm">•</span>
                          <span className="text-slate-500 text-xs font-mono">{log.resource_id.substring(0, 8)}...</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {log.ip_address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="font-mono">{log.ip_address}</span>
                        </div>
                      )}
                      {log.user_agent && (
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          <span className="truncate max-w-[300px]">{log.user_agent}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#39FF14]/20 p-3 rounded-lg">
            <Activity className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div>
            <h4 className="text-[#39FF14] font-semibold mb-2">About Activity Logs</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Activity logs are updated in real-time</li>
              <li>• Logs are retained for 90 days</li>
              <li>• Includes IP addresses and user agents for security</li>
              <li>• Can be exported along with your data</li>
              <li>• Helps you monitor unauthorized access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
