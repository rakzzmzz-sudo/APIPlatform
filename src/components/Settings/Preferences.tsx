import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Globe, Clock, Calendar, DollarSign, Palette, Languages, Save, CheckCircle } from 'lucide-react';

type Preferences = {
  theme: string;
  language: string;
  timezone: string;
  date_format: string;
  time_format: string;
  currency: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
};

const themes = [
  { id: 'dark', name: 'Dark', description: 'Dark theme for low-light environments' },
  { id: 'light', name: 'Light', description: 'Light theme for bright environments' },
  { id: 'auto', name: 'Auto', description: 'Automatically switch based on system' }
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ms', name: 'Bahasa Malaysia', flag: '🇲🇾' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
];

const timezones = [
  'Asia/Kuala_Lumpur',
  'Asia/Singapore',
  'Asia/Bangkok',
  'Asia/Jakarta',
  'Asia/Manila',
  'UTC'
];

const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD MMM YYYY'];
const timeFormats = ['12h', '24h'];
const currencies = ['MYR', 'USD', 'SGD', 'EUR', 'GBP'];

const PREFS_STORAGE_KEY = 'cpaas_user_preferences';

// Applies the chosen theme immediately to the document
function applyTheme(theme: string) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effectiveTheme = theme === 'auto' ? (prefersDark ? 'dark' : 'light') : theme;

  root.setAttribute('data-theme', effectiveTheme);

  if (effectiveTheme === 'light') {
    root.style.setProperty('--bg-primary', '#f0fdf4');
    root.style.setProperty('--bg-secondary', '#dcfce7');
    root.style.setProperty('--bg-card', '#ffffff');
    root.style.setProperty('--bg-card-border', '#86efac');
    root.style.setProperty('--text-primary', '#052e16');
    root.style.setProperty('--text-secondary', '#166534');
    root.style.setProperty('--text-muted', '#4b7a5d');
    root.style.setProperty('--sidebar-bg', '#022c22');
    root.style.setProperty('--accent', '#39FF14');
    // Apply light background to main content area
    const mainEl = document.querySelector('main') as HTMLElement | null;
    const appEl = document.getElementById('__next') as HTMLElement | null;
    if (mainEl) mainEl.style.backgroundColor = '#f0fdf4';
    if (appEl) appEl.style.backgroundColor = '#f0fdf4';
  } else {
    // Dark (default)
    root.style.setProperty('--bg-primary', '#011a12');
    root.style.setProperty('--bg-secondary', '#012419');
    root.style.setProperty('--bg-card', '#012419');
    root.style.setProperty('--bg-card-border', '#024d30');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--text-secondary', '#94a3b8');
    root.style.setProperty('--text-muted', '#64748b');
    root.style.setProperty('--sidebar-bg', '#011a12');
    root.style.setProperty('--accent', '#39FF14');
    const mainEl = document.querySelector('main') as HTMLElement | null;
    const appEl = document.getElementById('__next') as HTMLElement | null;
    if (mainEl) mainEl.style.backgroundColor = '';
    if (appEl) appEl.style.backgroundColor = '';
  }
}

export default function Preferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'dark',
    language: 'en',
    timezone: 'Asia/Kuala_Lumpur',
    date_format: 'DD/MM/YYYY',
    time_format: '24h',
    currency: 'MYR',
    notifications_enabled: true,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    marketing_emails: false
  });
  const [loading, setLoading] = useState(false); // Don't block UI waiting for DB
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load from localStorage immediately (instant, no DB wait)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(prev => ({ ...prev, ...parsed }));
        if (parsed.theme) applyTheme(parsed.theme);
      }
    } catch {
      // ignore
    }
  }, []);

  // Apply theme in real time whenever it changes
  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme]);

  useEffect(() => {
    if (user) {
      loadPreferences();
      try {
        const channel = db
          .channel('preferences-changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'user_preferences', filter: `user_id=eq.${user.id}` },
            () => loadPreferences()
          )
          .subscribe();
        return () => { db.removeChannel(channel); };
      } catch {
        console.log('Realtime preferences sync not available');
      }
    }
  }, [user]);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await db
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        // Silently handle missing table — use defaults
        const errMsg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
        if (!errMsg || errMsg.includes('not found') || errMsg.includes('does not exist') || errMsg.includes('no rows')) {
          console.log('User preferences table not available, using defaults');
        } else {
          console.log('Could not load preferences, using defaults:', errMsg);
        }
        return;
      }

      if (data) {
        setPreferences(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.log('Error loading preferences, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };


  const updatePreference = (key: keyof Preferences, value: any) => {
    setPreferences(prev => {
      const next = { ...prev, [key]: value };
      // Persist to localStorage immediately so changes survive refresh
      try { localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const savePreferences = async () => {
    if (!user) return;
    setSaving(true);
    // Always persist to localStorage
    try { localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences)); } catch { /* ignore */ }
    try {
      const { error } = await db
        .from('user_preferences')
        .upsert({ user_id: user.id, ...preferences, updated_at: new Date().toISOString() });
      if (error) {
        console.log('Preferences saved to localStorage (DB not available):', error?.message || error);
      }
      setSaved(true);
    } catch (err) {
      console.log('Preferences saved to localStorage (DB not available):', err);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Preferences</h2>
          <p className="text-slate-400">Customize your experience</p>
        </div>
        <button
          onClick={savePreferences}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#39FF14]/20 p-3 rounded-lg">
            <Palette className="w-6 h-6" style={{ color: '#40C706' }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Appearance</h3>
            <p className="text-slate-400 text-sm">Customize the look and feel</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updatePreference('theme', theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.theme === theme.id
                      ? 'border-[#39FF14] bg-[#39FF14]/20'
                      : 'border-[#024d30] bg-[#012419]/50 hover:border-[#024d30]/80'
                  }`}
                >
                  <p className="text-white font-semibold mb-1">{theme.name}</p>
                  <p className="text-slate-400 text-xs">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#39FF14]/20 p-3 rounded-lg">
            <Languages className="w-6 h-6" style={{ color: '#40C706' }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Language & Region</h3>
            <p className="text-slate-400 text-sm">Set your language and regional preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => updatePreference('language', e.target.value)}
              className="w-full bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Clock className="w-4 h-4 inline mr-2" style={{ color: '#40C706' }} />
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => updatePreference('timezone', e.target.value)}
              className="w-full bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" style={{ color: '#40C706' }} />
              Date Format
            </label>
            <select
              value={preferences.date_format}
              onChange={(e) => updatePreference('date_format', e.target.value)}
              className="w-full bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              {dateFormats.map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Time Format</label>
            <select
              value={preferences.time_format}
              onChange={(e) => updatePreference('time_format', e.target.value)}
              className="w-full bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              {timeFormats.map((format) => (
                <option key={format} value={format}>
                  {format === '12h' ? '12-hour (AM/PM)' : '24-hour'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" style={{ color: '#40C706' }} />
              Currency
            </label>
            <select
              value={preferences.currency}
              onChange={(e) => updatePreference('currency', e.target.value)}
              className="w-full bg-[#012419] border border-[#024d30] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Notification Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#012419]/50 border border-[#024d30] rounded-lg">
            <div>
              <h4 className="text-white font-semibold">All Notifications</h4>
              <p className="text-slate-400 text-sm">Master control for all notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications_enabled}
                onChange={(e) => updatePreference('notifications_enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#012419]/50 border border-[#024d30] rounded-lg">
            <div>
              <h4 className="text-white font-semibold">Email Notifications</h4>
              <p className="text-slate-400 text-sm">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email_notifications}
                onChange={(e) => updatePreference('email_notifications', e.target.checked)}
                disabled={!preferences.notifications_enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14] disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#012419]/50 border border-[#024d30] rounded-lg">
            <div>
              <h4 className="text-white font-semibold">SMS Notifications</h4>
              <p className="text-slate-400 text-sm">Receive updates via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.sms_notifications}
                onChange={(e) => updatePreference('sms_notifications', e.target.checked)}
                disabled={!preferences.notifications_enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14] disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#012419]/50 border border-[#024d30] rounded-lg">
            <div>
              <h4 className="text-white font-semibold">Push Notifications</h4>
              <p className="text-slate-400 text-sm">Receive browser push notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.push_notifications}
                onChange={(e) => updatePreference('push_notifications', e.target.checked)}
                disabled={!preferences.notifications_enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14] disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#012419]/50 border border-[#024d30] rounded-lg">
            <div>
              <h4 className="text-white font-semibold">Marketing Emails</h4>
              <p className="text-slate-400 text-sm">Receive promotional and marketing content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.marketing_emails}
                onChange={(e) => updatePreference('marketing_emails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
