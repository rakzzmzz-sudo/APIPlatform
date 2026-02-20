import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Lock, Bell, Globe, Clock, Key, AlertTriangle, CheckCircle } from 'lucide-react';

type SecuritySettings = {
  two_factor_enabled: boolean;
  ip_whitelist: string[];
  session_timeout: number;
  login_notifications: boolean;
  api_rate_limit: number;
  allowed_domains: string[];
};

export default function SecurityManagement() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SecuritySettings>({
    two_factor_enabled: false,
    ip_whitelist: [],
    session_timeout: 60,
    login_notifications: true,
    api_rate_limit: 1000,
    allowed_domains: ['*']
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newDomain, setNewDomain] = useState('');

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await db
      .from('security_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      // Table may not exist yet — use default settings silently
      const errMsg = error?.message || (typeof error === 'string' ? error : '');
      console.log('Security settings not available, using defaults:', errMsg);
    } else if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const updateSettings = async (updates: Partial<SecuritySettings>) => {
    if (!user) return;

    setSaving(true);
    const newSettings = { ...settings, ...updates };

    const { error } = await db
      .from('security_settings')
      .upsert({
        user_id: user.id,
        ...newSettings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      const errMsg = error?.message || (typeof error === 'string' ? error : '');
      console.log('Could not persist security settings (table may not exist):', errMsg);
      // Still update local state so UI reflects the change
    } else {
      setSettings(newSettings);
    }
    setSaving(false);
  };

  const addToWhitelist = () => {
    if (newIp && !settings.ip_whitelist.includes(newIp)) {
      updateSettings({ ip_whitelist: [...settings.ip_whitelist, newIp] });
      setNewIp('');
    }
  };

  const removeFromWhitelist = (ip: string) => {
    updateSettings({ ip_whitelist: settings.ip_whitelist.filter(i => i !== ip) });
  };

  const addDomain = () => {
    if (newDomain && !settings.allowed_domains.includes(newDomain)) {
      updateSettings({ allowed_domains: [...settings.allowed_domains, newDomain] });
      setNewDomain('');
    }
  };

  const removeDomain = (domain: string) => {
    updateSettings({ allowed_domains: settings.allowed_domains.filter(d => d !== domain) });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading security settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Security Management</h2>
        <p className="text-slate-400">Configure security settings and access controls</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-lg ${settings.two_factor_enabled ? 'bg-emerald-500/20' : 'bg-slate-500/20'}`}>
              <Shield className={`w-5 h-5 ${settings.two_factor_enabled ? 'text-emerald-400' : 'text-slate-400'}`} style={{ color: '#40C706' }} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">2FA Status</p>
              <p className="text-lg font-bold text-white">{settings.two_factor_enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
          <p className={`text-sm ${settings.two_factor_enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
            {settings.two_factor_enabled ? 'Protected' : 'Not protected'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Globe className="w-5 h-5 text-[#39FF14]" style={{ color: '#40C706' }} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">IP Whitelist</p>
              <p className="text-lg font-bold text-white">{settings.ip_whitelist.length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Allowed IPs</p>
        </div>

        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Key className="w-5 h-5 text-[#39FF14]" style={{ color: '#40C706' }} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">API Rate Limit</p>
              <p className="text-lg font-bold text-white">{settings.api_rate_limit}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Requests/hour</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Authentication Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#012419]/50 border border-[#024d30] rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-[#39FF14]/20 p-3 rounded-lg">
                <Shield className="w-5 h-5 text-[#39FF14]" style={{ color: '#40C706' }} />
              </div>
              <div>
                <h4 className="text-white font-semibold">Two-Factor Authentication</h4>
                <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.two_factor_enabled}
                onChange={(e) => updateSettings({ two_factor_enabled: e.target.checked })}
                className="sr-only peer"
                disabled={saving}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#012419]/50 border border-[#024d30] rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-[#39FF14]/20 p-3 rounded-lg">
                <Bell className="w-5 h-5 text-[#39FF14]" style={{ color: '#40C706' }} />
              </div>
              <div>
                <h4 className="text-white font-semibold">Login Notifications</h4>
                <p className="text-slate-400 text-sm">Get notified when someone logs into your account</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.login_notifications}
                onChange={(e) => updateSettings({ login_notifications: e.target.checked })}
                className="sr-only peer"
                disabled={saving}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
            </label>
          </div>

          <div className="p-4 bg-[#012419]/50 border border-[#024d30] rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#39FF14]/20 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-[#39FF14]" style={{ color: '#40C706' }} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">Session Timeout</h4>
                <p className="text-slate-400 text-sm">Automatically log out after period of inactivity</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="15"
                max="480"
                step="15"
                value={settings.session_timeout}
                onChange={(e) => updateSettings({ session_timeout: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                disabled={saving}
              />
              <span className="text-white font-semibold min-w-[80px]">{settings.session_timeout} min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">IP Whitelist</h3>

        <div className="mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newIp && !saving) {
                  addToWhitelist();
                }
              }}
              placeholder="Enter IP address (e.g., 192.168.1.1)"
              className="flex-1 bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            />
            <button
              onClick={addToWhitelist}
              disabled={!newIp || saving}
              className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {settings.ip_whitelist.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No IP addresses in whitelist</p>
          ) : (
            settings.ip_whitelist.map((ip) => (
              <div key={ip} className="flex items-center justify-between p-3 bg-[#012419]/50 border border-[#024d30] rounded-lg">
                <span className="text-white font-mono">{ip}</span>
                <button
                  onClick={() => removeFromWhitelist(ip)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                  disabled={saving}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">CORS Allowed Domains</h3>

        <div className="mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter domain (e.g., example.com)"
              className="flex-1 bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            />
            <button
              onClick={addDomain}
              disabled={!newDomain || saving}
              className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {settings.allowed_domains.map((domain) => (
            <div key={domain} className="flex items-center justify-between p-3 bg-[#012419]/50 border border-[#024d30] rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-400" style={{ color: '#40C706' }} />
                <span className="text-white font-mono">{domain}</span>
              </div>
              {domain !== '*' && (
                <button
                  onClick={() => removeDomain(domain)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                  disabled={saving}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#39FF14]/20 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div>
            <h4 className="text-[#39FF14] font-semibold mb-2">Security Best Practices</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Enable two-factor authentication for enhanced security</li>
              <li>• Use IP whitelisting if you access from fixed locations</li>
              <li>• Regularly rotate your API keys</li>
              <li>• Monitor login notifications for suspicious activity</li>
              <li>• Keep your session timeout reasonable for your use case</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
