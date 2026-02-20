import { useState, useEffect } from 'react';
import {
  Phone, Mail, FileText, MessageSquare, Wifi, Shield, AlertTriangle,
  Plus, Edit, Trash2, Save, X, Check, Download, Send, PhoneForwarded,
  Server, Activity, Settings, Clock, CheckCircle, XCircle, RefreshCw
} from 'lucide-react';
import { db } from '../../lib/db';

interface VoicemailMessage {
  id: string;
  caller_id: string;
  caller_name: string | null;
  duration_seconds: number | null;
  transcription: string | null;
  is_read: boolean;
  is_urgent: boolean;
  created_at: string;
}

interface FaxMessage {
  id: string;
  direction: string;
  from_number: string;
  to_number: string;
  pages: number;
  status: string;
  pdf_url: string | null;
  created_at: string;
}

interface IPPhone {
  id: string;
  mac_address: string;
  phone_model: string;
  manufacturer: string;
  status: string;
  assigned_to: string | null;
  location: string | null;
  last_registered: string | null;
  auto_provisioned: boolean;
}

interface FailoverRule {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  forward_to_type: string;
  forward_to_number: string | null;
  is_active: boolean;
}

interface NumberPortRequest {
  id: string;
  request_type: string;
  phone_numbers: string[];
  current_carrier: string | null;
  status: string;
  scheduled_date: string | null;
  created_at: string;
}

interface SystemHealth {
  id: string;
  check_type: string;
  status: string;
  metric_value: number | null;
  metric_unit: string | null;
  checked_at: string;
}

export default function VoiceAPIAdvanced() {
  const [activeSection, setActiveSection] = useState('voicemail');
  const [loading, setLoading] = useState(true);

  const [voicemails, setVoicemails] = useState<VoicemailMessage[]>([]);
  const [faxMessages, setFaxMessages] = useState<FaxMessage[]>([]);
  const [ipPhones, setIPPhones] = useState<IPPhone[]>([]);
  const [failoverRules, setFailoverRules] = useState<FailoverRule[]>([]);
  const [portRequests, setPortRequests] = useState<NumberPortRequest[]>([]);
  const [healthChecks, setHealthChecks] = useState<SystemHealth[]>([]);

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showFailoverModal, setShowFailoverModal] = useState(false);
  const [showPortModal, setShowPortModal] = useState(false);
  const [showFaxModal, setShowFaxModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const sections = [
    { id: 'voicemail', label: 'Voicemail', icon: Mail, category: 'uc' },
    { id: 'fax', label: 'eFax', icon: FileText, category: 'uc' },
    { id: 'presence', label: 'IM & Presence', icon: MessageSquare, category: 'uc' },
    { id: 'provisioning', label: 'IP Phones', icon: Phone, category: 'admin' },
    { id: 'failover', label: 'Failover Rules', icon: PhoneForwarded, category: 'reliability' },
    { id: 'porting', label: 'Number Porting', icon: RefreshCw, category: 'reliability' },
    { id: 'health', label: 'System Health', icon: Activity, category: 'reliability' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vmRes, faxRes, phonesRes, failoverRes, portRes, healthRes] = await Promise.all([
        db.from('voicemail_messages').select('*').order('created_at', { ascending: false }).limit(50),
        db.from('fax_messages').select('*').order('created_at', { ascending: false }).limit(50),
        db.from('ip_phone_inventory').select('*').order('status'),
        db.from('failover_rules').select('*').order('priority'),
        db.from('number_port_requests').select('*').order('created_at', { ascending: false }),
        db.from('system_health_checks').select('*').order('checked_at', { ascending: false }).limit(10)
      ]);

      if (vmRes.data) setVoicemails(vmRes.data);
      if (faxRes.data) setFaxMessages(faxRes.data);
      if (phonesRes.data) setIPPhones(phonesRes.data);
      if (failoverRes.data) setFailoverRules(failoverRes.data);
      if (portRes.data) setPortRequests(portRes.data);
      if (healthRes.data) setHealthChecks(healthRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markVoicemailRead = async (id: string) => {
    try {
      await db.from('voicemail_messages').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', id);
      await loadData();
    } catch (error) {
      console.error('Error marking voicemail read:', error);
    }
  };

  const deleteVoicemail = async (id: string) => {
    if (!confirm('Delete this voicemail?')) return;
    try {
      await db.from('voicemail_messages').delete().eq('id', id);
      await loadData();
    } catch (error) {
      console.error('Error deleting voicemail:', error);
    }
  };

  const PhoneModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      mac_address: '',
      phone_model: 'T46S',
      manufacturer: 'Yealink',
      assigned_to: '',
      location: '',
      status: 'pending'
    });

    const handleSave = async () => {
      try {
        if (editingItem) {
          await db.from('ip_phone_inventory').update(formData).eq('id', editingItem.id);
        } else {
          await db.from('ip_phone_inventory').insert([{ ...formData, auto_provisioned: false }]);
        }
        await loadData();
        setShowPhoneModal(false);
        setEditingItem(null);
      } catch (error) {
        console.error('Error saving phone:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} IP Phone</h2>
            <button onClick={() => { setShowPhoneModal(false); setEditingItem(null); }} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">MAC Address</label>
                <input
                  type="text"
                  value={formData.mac_address}
                  onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  placeholder="00:1A:2B:3C:4D:5E"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturer</label>
                <select
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="Yealink">Yealink</option>
                  <option value="Cisco">Cisco</option>
                  <option value="Polycom">Polycom</option>
                  <option value="Grandstream">Grandstream</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Model</label>
                <input
                  type="text"
                  value={formData.phone_model}
                  onChange={(e) => setFormData({ ...formData, phone_model: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  placeholder="T46S"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="provisioning">Provisioning</option>
                  <option value="active">Active</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assigned To</label>
                <input
                  type="text"
                  value={formData.assigned_to || ''}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Employee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Office location"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => { setShowPhoneModal(false); setEditingItem(null); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Phone
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FailoverModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      name: '',
      description: '',
      trigger_type: 'internet_down',
      forward_to_type: 'mobile',
      forward_to_number: '',
      is_active: true
    });

    const handleSave = async () => {
      try {
        if (editingItem) {
          await db.from('failover_rules').update(formData).eq('id', editingItem.id);
        } else {
          await db.from('failover_rules').insert([{ ...formData, priority: 1 }]);
        }
        await loadData();
        setShowFailoverModal(false);
        setEditingItem(null);
      } catch (error) {
        console.error('Error saving failover rule:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} Failover Rule</h2>
            <button onClick={() => { setShowFailoverModal(false); setEditingItem(null); }} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rule Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                placeholder="Emergency Failover"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Trigger</label>
                <select
                  value={formData.trigger_type}
                  onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="internet_down">Internet Down</option>
                  <option value="office_closed">Office Closed</option>
                  <option value="manual">Manual</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Forward To</label>
                <select
                  value={formData.forward_to_type}
                  onChange={(e) => setFormData({ ...formData, forward_to_type: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="mobile">Mobile Number</option>
                  <option value="external">External Number</option>
                  <option value="voicemail">Voicemail</option>
                  <option value="service">Answering Service</option>
                </select>
              </div>
            </div>

            {formData.forward_to_type !== 'voicemail' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={formData.forward_to_number || ''}
                  onChange={(e) => setFormData({ ...formData, forward_to_number: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  placeholder="+60123456789"
                />
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-white">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => { setShowFailoverModal(false); setEditingItem(null); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg flex items-center gap-2 font-semibold"
            >
              <Save className="w-4 h-4" />
              Save Rule
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PortModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      request_type: 'port_in',
      phone_numbers: [''],
      current_carrier: '',
      new_carrier: 'Cloud PBX Service',
      account_number: '',
      pin_code: '',
      authorized_by: '',
      scheduled_date: ''
    });

    const handleSave = async () => {
      try {
        const payload = { ...formData, status: 'pending' };
        if (editingItem) {
          await db.from('number_port_requests').update(payload).eq('id', editingItem.id);
        } else {
          await db.from('number_port_requests').insert([payload]);
        }
        await loadData();
        setShowPortModal(false);
        setEditingItem(null);
      } catch (error) {
        console.error('Error saving port request:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'New'} Number Port Request</h2>
            <button onClick={() => { setShowPortModal(false); setEditingItem(null); }} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Request Type</label>
              <select
                value={formData.request_type}
                onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="port_in">Port In (Bring numbers to us)</option>
                <option value="port_out">Port Out (Move numbers away)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number(s)</label>
              <input
                type="text"
                value={formData.phone_numbers[0]}
                onChange={(e) => setFormData({ ...formData, phone_numbers: [e.target.value] })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                placeholder="+60331234567"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Carrier</label>
                <input
                  type="text"
                  value={formData.current_carrier}
                  onChange={(e) => setFormData({ ...formData, current_carrier: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Carrier</label>
                <input
                  type="text"
                  value={formData.new_carrier}
                  onChange={(e) => setFormData({ ...formData, new_carrier: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">PIN Code</label>
                <input
                  type="text"
                  value={formData.pin_code}
                  onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Authorized By</label>
                <input
                  type="text"
                  value={formData.authorized_by}
                  onChange={(e) => setFormData({ ...formData, authorized_by: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => { setShowPortModal(false); setEditingItem(null); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg flex items-center gap-2 font-semibold"
            >
              <Save className="w-4 h-4" />
              Submit Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FaxModal = () => {
    const [formData, setFormData] = useState({
      to_number: '',
      pages: 1,
      file: null
    });

    const handleSend = async () => {
      try {
        await db.from('fax_messages').insert([{
          direction: 'outbound',
          from_number: '+60331234567',
          to_number: formData.to_number,
          pages: formData.pages,
          status: 'sending',
          pdf_url: 'https://example.com/fax/outbound.pdf'
        }]);
        await loadData();
        setShowFaxModal(false);
      } catch (error) {
        console.error('Error sending fax:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-xl p-6 max-w-lg w-full border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Send Fax</h2>
            <button onClick={() => setShowFaxModal(false)} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">To Number</label>
              <input
                type="text"
                value={formData.to_number}
                onChange={(e) => setFormData({ ...formData, to_number: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                placeholder="+60123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Upload PDF</label>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF files only</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowFaxModal(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg flex items-center gap-2 font-semibold"
            >
              <Send className="w-4 h-4" />
              Send Fax
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderVoicemail = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400">Voicemail messages with transcription and email delivery</p>
        <div className="px-4 py-2 bg-[#39FF14]/20 text-[#39FF14] rounded-lg text-sm font-medium">
          {voicemails.filter(v => !v.is_read).length} Unread
        </div>
      </div>

      <div className="grid gap-4">
        {voicemails.map((vm) => (
          <div key={vm.id} className={`bg-slate-900 rounded-xl p-6 border ${vm.is_read ? 'border-slate-800' : 'border-[#39FF14]/50'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#39FF14]/20/20 rounded-lg">
                  <Mail className="w-6 h-6 text-[#39FF14]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{vm.caller_name || vm.caller_id}</h3>
                    {vm.is_urgent && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Urgent</span>}
                    {!vm.is_read && <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded">New</span>}
                  </div>
                  <div className="text-sm text-slate-400">{vm.caller_id} • {vm.duration_seconds}s • {new Date(vm.created_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-2">
                {!vm.is_read && (
                  <button
                    onClick={() => markVoicemailRead(vm.id)}
                    className="p-2 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteVoicemail(vm.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {vm.transcription && (
              <div className="bg-slate-800 rounded-lg p-4 mt-3">
                <p className="text-white text-sm leading-relaxed">{vm.transcription}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFax = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400">Send and receive faxes as PDF files via email</p>
        <button
          onClick={() => setShowFaxModal(true)}
          className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          <Send className="w-5 h-5" />
          Send Fax
        </button>
      </div>

      <div className="grid gap-4">
        {faxMessages.map((fax) => (
          <div key={fax.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${fax.direction === 'inbound' ? 'bg-green-500/20' : 'bg-[#39FF14]/20'}`}>
                  <FileText className={`w-6 h-6 ${fax.direction === 'inbound' ? 'text-green-400' : 'text-[#39FF14]'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white capitalize">{fax.direction}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      fax.status === 'sent' || fax.status === 'received' ? 'bg-green-500/20 text-green-400' :
                      fax.status === 'sending' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      fax.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {fax.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">
                    From: {fax.from_number} → To: {fax.to_number} • {fax.pages} page(s) • {new Date(fax.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg" title="Download PDF">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPresence = () => (
    <div className="space-y-6">
      <p className="text-slate-400">Team availability status and instant messaging</p>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-6">Team Presence</h2>
        <div className="space-y-3">
          {['Ahmad Ibrahim', 'Sarah Lee', 'David Chen', 'Lisa Wong', 'Michael Tan'].map((name, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#39FF14] to-[#32e012] rounded-full flex items-center justify-center text-black font-bold">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-semibold">{name}</div>
                  <div className="text-sm text-slate-400">Ext. {101 + i}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-[#39FF14]' : i % 3 === 1 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-slate-300">
                  {i % 3 === 0 ? 'Available' : i % 3 === 1 ? 'Away' : 'On Call'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Quick Chat</h2>
        <p className="text-slate-400 text-sm">Instant messaging feature - Coming soon</p>
      </div>
    </div>
  );

  const renderProvisioning = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400">Manage IP phones with zero-touch auto-provisioning</p>
        <button
          onClick={() => { setEditingItem(null); setShowPhoneModal(true); }}
          className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Phone
        </button>
      </div>

      <div className="grid gap-4">
        {ipPhones.map((phone) => (
          <div key={phone.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  phone.status === 'active' ? 'bg-green-500/20' :
                  phone.status === 'provisioning' ? 'bg-[#39FF14]/20' :
                  phone.status === 'offline' ? 'bg-red-500/20' :
                  'bg-slate-700'
                }`}>
                  <Phone className={`w-6 h-6 ${
                    phone.status === 'active' ? 'text-green-400' :
                    phone.status === 'provisioning' ? 'text-[#39FF14]' :
                    phone.status === 'offline' ? 'text-red-400' :
                    'text-slate-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">{phone.manufacturer} {phone.phone_model}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      phone.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      phone.status === 'provisioning' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      phone.status === 'offline' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {phone.status}
                    </span>
                    {phone.auto_provisioned && (
                      <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded">Auto-Provisioned</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400">
                    MAC: {phone.mac_address} • {phone.assigned_to ? `Assigned to: ${phone.assigned_to}` : 'Unassigned'}
                    {phone.location && ` • ${phone.location}`}
                  </div>
                  {phone.last_registered && (
                    <div className="text-xs text-slate-500 mt-1">
                      Last seen: {new Date(phone.last_registered).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingItem(phone); setShowPhoneModal(true); }}
                  className="p-2 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg" title="Provision">
                  <Wifi className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFailover = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400">Automatic call forwarding when systems are unavailable</p>
        <button
          onClick={() => { setEditingItem(null); setShowFailoverModal(true); }}
          className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Rule
        </button>
      </div>

      <div className="grid gap-4">
        {failoverRules.map((rule) => (
          <div key={rule.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${rule.is_active ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                  <PhoneForwarded className={`w-6 h-6 ${rule.is_active ? 'text-green-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">{rule.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rule.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {rule.description && <p className="text-sm text-slate-400 mb-2">{rule.description}</p>}
                  <div className="flex gap-6 text-sm text-slate-300">
                    <span>Trigger: <span className="capitalize">{rule.trigger_type.replace('_', ' ')}</span></span>
                    <span>Forward to: <span className="capitalize">{rule.forward_to_type}</span></span>
                    {rule.forward_to_number && <span className="font-mono">{rule.forward_to_number}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingItem(rule); setShowFailoverModal(true); }}
                  className="p-2 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPorting = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-400">Transfer phone numbers between carriers</p>
        <button
          onClick={() => { setEditingItem(null); setShowPortModal(true); }}
          className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Port Request
        </button>
      </div>

      <div className="grid gap-4">
        {portRequests.map((port) => (
          <div key={port.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  port.status === 'completed' ? 'bg-green-500/20' :
                  port.status === 'in_progress' ? 'bg-[#39FF14]/20' :
                  port.status === 'rejected' ? 'bg-red-500/20' :
                  'bg-slate-700'
                }`}>
                  <RefreshCw className={`w-6 h-6 ${
                    port.status === 'completed' ? 'text-green-400' :
                    port.status === 'in_progress' ? 'text-[#39FF14]' :
                    port.status === 'rejected' ? 'text-red-400' :
                    'text-slate-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-slate-400 uppercase">{port.request_type.replace('_', ' ')}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      port.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      port.status === 'in_progress' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      port.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {port.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-white font-mono mb-2">{port.phone_numbers.join(', ')}</div>
                  <div className="text-sm text-slate-400">
                    {port.current_carrier && `From: ${port.current_carrier}`}
                    {port.scheduled_date && ` • Scheduled: ${new Date(port.scheduled_date).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setEditingItem(port); setShowPortModal(true); }}
                className="p-2 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-6">
      <p className="text-slate-400">Real-time system monitoring and health metrics</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthChecks.slice(0, 4).map((check) => (
          <div key={check.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                check.status === 'healthy' ? 'bg-green-500/20' :
                check.status === 'degraded' ? 'bg-yellow-500/20' :
                'bg-red-500/20'
              }`}>
                {check.status === 'healthy' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : check.status === 'degraded' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <span className="text-sm font-medium text-slate-300 capitalize">{check.check_type.replace('_', ' ')}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {check.metric_value?.toFixed(1)}{check.metric_unit}
            </div>
            <div className={`text-xs font-medium ${
              check.status === 'healthy' ? 'text-green-400' :
              check.status === 'degraded' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {check.status}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-6">System Status History</h2>
        <div className="space-y-2">
          {healthChecks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                {check.status === 'healthy' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : check.status === 'degraded' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="text-white capitalize">{check.check_type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-300">{check.metric_value?.toFixed(1)}{check.metric_unit}</span>
                <span className="text-sm text-slate-400">{new Date(check.checked_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-[#012419] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading system features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#012419] p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Advanced Telephony Features</h1>
        <p className="text-slate-400">Unified Communications, Provisioning & Reliability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Unread Voicemails', value: voicemails.filter(v => !v.is_read).length.toString(), icon: Mail, color: 'from-[#39FF14]/40 to-[#32e012]/20' },
          { label: 'Active Phones', value: ipPhones.filter(p => p.status === 'active').length.toString(), icon: Phone, color: 'from-[#39FF14]/40 to-[#32e012]/20' },
          { label: 'Failover Rules', value: failoverRules.filter(f => f.is_active).length.toString(), icon: Shield, color: 'from-[#39FF14]/40 to-[#32e012]/20' },
          { label: 'System Health', value: healthChecks.filter(h => h.status === 'healthy').length + '/' + Math.min(healthChecks.length, 4), icon: Activity, color: 'from-[#39FF14]/40 to-[#32e012]/20' }
        ].map((stat, index) => (
          <div key={index} className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl w-fit mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="border-b border-slate-800 overflow-x-auto">
          <nav className="flex gap-2 min-w-max">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all whitespace-nowrap ${
                    activeSection === section.id
                      ? 'border-[#39FF14] text-[#39FF14]'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {activeSection === 'voicemail' && renderVoicemail()}
      {activeSection === 'fax' && renderFax()}
      {activeSection === 'presence' && renderPresence()}
      {activeSection === 'provisioning' && renderProvisioning()}
      {activeSection === 'failover' && renderFailover()}
      {activeSection === 'porting' && renderPorting()}
      {activeSection === 'health' && renderHealth()}

      {showPhoneModal && <PhoneModal />}
      {showFailoverModal && <FailoverModal />}
      {showPortModal && <PortModal />}
      {showFaxModal && <FaxModal />}
    </div>
  );
}
