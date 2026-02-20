import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Mail, MessageSquare, Phone, CheckCircle, Save } from 'lucide-react';

type EventType = {
  event_type: string;
  label: string;
  description: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  slack_enabled: boolean;
};

const defaultEvents: Omit<EventType, 'email_enabled' | 'sms_enabled' | 'push_enabled' | 'slack_enabled'>[] = [
  { event_type: 'campaign_started', label: 'Campaign Started', description: 'When a new campaign begins' },
  { event_type: 'campaign_completed', label: 'Campaign Completed', description: 'When a campaign finishes' },
  { event_type: 'campaign_failed', label: 'Campaign Failed', description: 'When a campaign encounters errors' },
  { event_type: 'low_balance', label: 'Low Balance', description: 'When account balance is running low' },
  { event_type: 'payment_received', label: 'Payment Received', description: 'When a payment is processed' },
  { event_type: 'api_key_created', label: 'API Key Created', description: 'When a new API key is generated' },
  { event_type: 'api_key_revoked', label: 'API Key Revoked', description: 'When an API key is revoked' },
  { event_type: 'webhook_failed', label: 'Webhook Failed', description: 'When a webhook delivery fails' },
  { event_type: 'security_alert', label: 'Security Alert', description: 'Security-related notifications' },
  { event_type: 'system_maintenance', label: 'System Maintenance', description: 'Scheduled maintenance notifications' }
];

export default function NotificationsSettings() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotificationPreferences();

      const channel = db
        .channel('notification-prefs-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'notification_preferences', filter: `user_id=eq.${user.id}` },
          () => loadNotificationPreferences()
        )
        .subscribe();

      return () => {
        db.removeChannel(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const loadNotificationPreferences = async () => {
    if (!user) return;

    const { data, error } = await db
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading notification preferences:', error);
      setEvents(defaultEvents.map(e => ({ ...e, email_enabled: true, sms_enabled: false, push_enabled: true, slack_enabled: false })));
    } else if (data && data.length > 0) {
      setEvents(data);
    } else {
      setEvents(defaultEvents.map(e => ({ ...e, email_enabled: true, sms_enabled: false, push_enabled: true, slack_enabled: false })));
    }
    setLoading(false);
  };

  const updateEvent = (eventType: string, channel: 'email_enabled' | 'sms_enabled' | 'push_enabled' | 'slack_enabled', value: boolean) => {
    setEvents(prev => prev.map(e =>
      e.event_type === eventType ? { ...e, [channel]: value } : e
    ));
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);

    for (const event of events) {
      await db
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          event_type: event.event_type,
          email_enabled: event.email_enabled,
          sms_enabled: event.sms_enabled,
          push_enabled: event.push_enabled,
          slack_enabled: event.slack_enabled,
          updated_at: new Date().toISOString()
        });
    }

    setSaved(true);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading notification settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
          <p className="text-slate-400">Control how you receive notifications for different events</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#024d30]">
                <th className="text-left py-4 px-4 text-slate-300 font-semibold">Event</th>
                <th className="text-center py-4 px-4 text-slate-300 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: '#40C706' }} />
                    Email
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-slate-300 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" style={{ color: '#40C706' }} />
                    SMS
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-slate-300 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" style={{ color: '#40C706' }} />
                    Push
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-slate-300 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: '#40C706' }} />
                    Slack
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event.event_type} className={`border-b border-[#024d30]/50 hover:bg-[#012419]/30 transition-colors ${index % 2 === 0 ? 'bg-[#012419]/10' : ''}`}>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{event.label}</p>
                      <p className="text-slate-400 text-sm">{event.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={event.email_enabled}
                        onChange={(e) => updateEvent(event.event_type, 'email_enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                    </label>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={event.sms_enabled}
                        onChange={(e) => updateEvent(event.event_type, 'sms_enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                    </label>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={event.push_enabled}
                        onChange={(e) => updateEvent(event.event_type, 'push_enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                    </label>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={event.slack_enabled}
                        onChange={(e) => updateEvent(event.event_type, 'slack_enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#39FF14]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#39FF14]/20 p-3 rounded-lg">
            <Bell className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div>
            <h4 className="text-[#39FF14] font-semibold mb-2">About Notifications</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Email notifications are sent to your registered email address</li>
              <li>• SMS notifications require a verified phone number</li>
              <li>• Push notifications require browser permissions</li>
              <li>• Slack notifications require a configured webhook</li>
              <li>• You can customize preferences for each event type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
