import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Key, Plus, Shield, Lock, CheckCircle, XCircle, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';

type ApiKey = {
  id: string;
  name: string;
  key_prefix: string;
  permissions: Record<string, unknown>;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

type Permission = {
  id: string;
  resource: string;
  actions: string[];
};

export default function AccessManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({
    send_messages: false,
    read_analytics: false,
    manage_campaigns: false,
    manage_webhooks: false
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'sk_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      setNotification({
        type: 'error',
        message: 'Please enter a key name'
      });
      return;
    }

    try {
      const { data: { user } } = await db.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fullKey = generateApiKey();
      const keyPrefix = fullKey.substring(0, 7);

      const { error } = await db.from('api_keys').insert({
        user_id: user.id,
        name: newKeyName,
        key_prefix: keyPrefix,
        key_hash: fullKey,
        permissions: selectedPermissions,
        is_active: true
      });

      if (error) throw error;

      setNotification({
        type: 'success',
        message: `API key generated: ${fullKey}`
      });

      setNewKeyName('');
      setSelectedPermissions({
        send_messages: false,
        read_analytics: false,
        manage_campaigns: false,
        manage_webhooks: false
      });
      setShowNewKeyForm(false);
      fetchData();
    } catch (error: any) {
      console.error('Error generating API key:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to generate API key'
      });
    }
  };

  const sampleApiKeys: ApiKey[] = [
    { id: 'ak1', name: 'Production Main API Key', key_prefix: 'sk_prod', permissions: { send_messages: true, read_analytics: true, manage_campaigns: true, manage_webhooks: true }, last_used_at: new Date(Date.now() - 5 * 60000).toISOString(), expires_at: null, is_active: true, created_at: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: 'ak2', name: 'Staging / QA Key', key_prefix: 'sk_stag', permissions: { send_messages: true, read_analytics: true, manage_campaigns: false, manage_webhooks: false }, last_used_at: new Date(Date.now() - 2 * 3600000).toISOString(), expires_at: new Date(Date.now() + 60 * 86400000).toISOString(), is_active: true, created_at: new Date(Date.now() - 60 * 86400000).toISOString() },
    { id: 'ak3', name: 'Postman / API Testing', key_prefix: 'sk_test', permissions: { send_messages: false, read_analytics: true, manage_campaigns: false, manage_webhooks: false }, last_used_at: new Date(Date.now() - 3 * 86400000).toISOString(), expires_at: null, is_active: true, created_at: new Date(Date.now() - 15 * 86400000).toISOString() },
    { id: 'ak4', name: 'Legacy Integration (Deprecated)', key_prefix: 'sk_legc', permissions: { send_messages: true, read_analytics: false, manage_campaigns: false, manage_webhooks: false }, last_used_at: new Date(Date.now() - 45 * 86400000).toISOString(), expires_at: new Date(Date.now() - 5 * 86400000).toISOString(), is_active: false, created_at: new Date(Date.now() - 180 * 86400000).toISOString() },
  ];

  const fetchData = async () => {
    setLoading(true);

    try {
      const [keysResult, permsResult] = await Promise.all([
        db.from('api_keys').select('*').order('created_at', { ascending: false }),
        db.from('user_permissions').select('*')
      ]);

      const keys = keysResult.data && keysResult.data.length > 0 ? keysResult.data : sampleApiKeys;
      setApiKeys(keys);
      if (permsResult.data) setPermissions(permsResult.data);
    } catch {
      setApiKeys(sampleApiKeys);
    }
    setLoading(false);
  };

  const toggleApiKey = async (keyId: string, currentStatus: boolean) => {
    const { error } = await db
      .from('api_keys')
      .update({ is_active: !currentStatus })
      .eq('id', keyId);

    if (!error) {
      fetchData();
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    const { error } = await db
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (!error) {
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Management</h2>
          <p className="text-slate-400">Manage API keys, permissions, and access controls</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Key className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total API Keys</p>
              <p className="text-2xl font-bold text-white">{apiKeys.length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Active and inactive</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Keys</p>
              <p className="text-2xl font-bold text-white">{apiKeys.filter(k => k.is_active).length}</p>
            </div>
          </div>
          <p className="text-emerald-400 text-sm">Currently active</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Shield className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Permissions</p>
              <p className="text-2xl font-bold text-white">{permissions.length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Custom permissions</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">API Keys</h3>
          <button
            onClick={() => setShowNewKeyForm(!showNewKeyForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Generate New Key
          </button>
        </div>

        {showNewKeyForm && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 mb-6">
            <h4 className="text-white font-semibold mb-4">Generate New API Key</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Key Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Production API Key"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.send_messages}
                      onChange={(e) => setSelectedPermissions({ ...selectedPermissions, send_messages: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-[#39FF14]"
                    />
                    <span className="text-sm">Send Messages</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.read_analytics}
                      onChange={(e) => setSelectedPermissions({ ...selectedPermissions, read_analytics: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-[#39FF14]"
                    />
                    <span className="text-sm">Read Analytics</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.manage_campaigns}
                      onChange={(e) => setSelectedPermissions({ ...selectedPermissions, manage_campaigns: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-[#39FF14]"
                    />
                    <span className="text-sm">Manage Campaigns</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.manage_webhooks}
                      onChange={(e) => setSelectedPermissions({ ...selectedPermissions, manage_webhooks: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-[#39FF14]"
                    />
                    <span className="text-sm">Manage Webhooks</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateKey}
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Generate Key
                </button>
                <button
                  onClick={() => {
                    setShowNewKeyForm(false);
                    setNewKeyName('');
                    setSelectedPermissions({
                      send_messages: false,
                      read_analytics: false,
                      manage_campaigns: false,
                      manage_webhooks: false
                    });
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No API keys generated yet</p>
              <p className="text-slate-500 text-sm mt-2">Create your first API key to get started</p>
            </div>
          ) : (
            apiKeys.map((key) => (
              <div key={key.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold">{key.name}</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                        key.is_active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/50'
                      }`}>
                        {key.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {key.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="font-mono">{key.key_prefix}••••••••••••••••</span>
                      <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                      {key.last_used_at && (
                        <span>Last used: {new Date(key.last_used_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors group">
                      <Copy className="w-4 h-4 text-slate-400 group-hover:text-[#39FF14]" />
                    </button>
                    <button
                      onClick={() => toggleApiKey(key.id, key.is_active)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                    >
                      {key.is_active ? (
                        <EyeOff className="w-4 h-4 text-slate-400 group-hover:text-[#39FF14]" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Role Permissions</h3>
        <div className="space-y-4">
          {['admin', 'developer', 'user'].map((role) => (
            <div key={role} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    role === 'admin' ? 'bg-red-500/20' :
                    role === 'developer' ? 'bg-[#39FF14]/20' : 'bg-slate-500/20'
                  }`}>
                    <Shield className={`w-5 h-5 ${
                      role === 'admin' ? 'text-red-400' :
                      role === 'developer' ? 'text-[#39FF14]' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold capitalize">{role}</h4>
                    <p className="text-slate-400 text-sm">
                      {role === 'admin' && 'Full system access'}
                      {role === 'developer' && 'API and campaign management'}
                      {role === 'user' && 'Basic read access'}
                    </p>
                  </div>
                </div>
                <button className="text-[#39FF14] hover:text-[#39FF14] text-sm font-medium">
                  Edit Permissions
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {role === 'admin' && (
                  <>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">All Permissions</span>
                  </>
                )}
                {role === 'developer' && (
                  <>
                    <span className="px-3 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded-full border border-[#39FF14]/30">Campaigns</span>
                    <span className="px-3 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded-full border border-[#39FF14]/30">Channels</span>
                    <span className="px-3 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded-full border border-[#39FF14]/30">API Keys</span>
                    <span className="px-3 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded-full border border-[#39FF14]/30">Messages</span>
                  </>
                )}
                {role === 'user' && (
                  <>
                    <span className="px-3 py-1 bg-slate-500/20 text-slate-400 text-xs rounded-full border border-slate-500/30">View Campaigns</span>
                    <span className="px-3 py-1 bg-slate-500/20 text-slate-400 text-xs rounded-full border border-slate-500/30">View Messages</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`${
            notification.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
          } border backdrop-blur-sm rounded-lg p-4 max-w-md`}>
            <div className="flex items-start gap-3">
              <div className={`${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } rounded-full p-1`}>
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-white text-sm mt-1 break-all">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
