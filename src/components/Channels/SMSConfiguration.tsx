import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/db';
import {
  Settings, Plus, Trash2, Check, X, AlertCircle, Loader, Copy, Eye, EyeOff,
  Server, Globe, Radio, CheckCircle, Edit2
} from 'lucide-react';

type SMSAggregatorConfig = {
  id: string;
  gateway_name: string;
  provider: string;
  protocol: string;
  status: string;
  is_active?: boolean;
  is_default?: boolean;
  smpp_config?: any;
  http_config?: any;
  credentials?: any;
  settings?: any;
  created_at: string;
  updated_at: string;
};

export default function SMSConfiguration() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<SMSAggregatorConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SMSAggregatorConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedConfig, setExpandedConfig] = useState<string | null>(null);

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      console.log('Loading SMS configurations');

      const { data, error: configError } = await db
        .from('sms_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (configError) {
        console.error('Error loading SMS configurations:', configError);
        throw configError;
      }

      console.log('Loaded SMS configurations:', data?.length || 0, 'configs');
      // Parse JSON string fields back to objects
      const parsed = (data || []).map((c: any) => {
        const tryParse = (val: any) => {
          if (!val || typeof val !== 'string') return val;
          try { return JSON.parse(val); } catch { return val; }
        };
        return {
          ...c,
          smpp_config: tryParse(c.smpp_config),
          http_config: tryParse(c.http_config),
          credentials: tryParse(c.credentials),
          settings: tryParse(c.settings),
        };
      });
      setConfigs(parsed);
    } catch (err: any) {
      console.error('Error loading SMS configurations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (configId: string, currentStatus: boolean) => {
    const newActive = !currentStatus;
    const newStatus = newActive ? 'active' : 'inactive';
    try {
      const { error } = await db
        .from('sms_configurations')
        .update({ is_active: newActive, status: newStatus })
        .eq('id', configId);

      if (error) throw error;

      setConfigs(configs.map(c => c.id === configId ? { ...c, is_active: newActive, status: newStatus } : c));
      setSuccess('Configuration status updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating configuration:', err);
      setError(err.message);
    }
  };

  const handleSetDefault = async (configId: string) => {
    try {
      const { error } = await db
        .from('sms_configurations')
        .update({ is_default: true })
        .eq('id', configId);

      if (error) throw error;

      setConfigs(configs.map(c => ({ ...c, is_default: c.id === configId })));
      setSuccess('Default configuration updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error setting default:', err);
      setError(err.message);
    }
  };

  const handleDeleteConfig = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this SMS aggregator configuration?')) {
      return;
    }

    try {
      const { error } = await db
        .from('sms_configurations')
        .delete()
        .eq('id', configId);

      if (error) throw error;

      setConfigs(configs.filter(c => c.id !== configId));
      setSuccess('Configuration deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting configuration:', err);
      setError(err.message);
    }
  };

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'smpp':
        return <Radio className="w-5 h-5" />;
      case 'http':
      case 'https':
        return <Globe className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const getConnectionTypeBadge = (type: string) => {
    const colors = {
      smpp: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      http: 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/30',
      https: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getAggregatorTypeBadge = (type: string) => {
    const colors = {
      infobip: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      twilio: 'bg-red-500/20 text-red-400 border-red-500/30',
      custom: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      other: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-[#39FF14] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">SMS Aggregator Configuration</h2>
          <p className="text-slate-400">
            Configure SMS aggregators like Infobip, Twilio, or custom SMPP providers
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black rounded-lg hover:from-[#32e012] hover:to-[#28b80f] transition-all"
        >
          <Plus className="w-5 h-5" />
          New Configuration
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Error</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-300 text-sm">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Configuration Modal */}
      {showEditModal && editingConfig && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Edit SMS Aggregator Configuration</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingConfig(null);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Configuration Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Configuration Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={editingConfig.gateway_name}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                  placeholder="e.g., Infobip Production"
                />
              </div>

              {/* Aggregator Type & Connection Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Aggregator Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    defaultValue={editingConfig.provider}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="infobip">Infobip</option>
                    <option value="twilio">Twilio</option>
                    <option value="sinch">Sinch</option>
                    <option value="vonage">Vonage</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Connection Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    defaultValue={editingConfig.protocol}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="SMPP">SMPP</option>
                    <option value="HTTP">HTTP</option>
                    <option value="HTTPS">HTTPS</option>
                  </select>
                </div>
              </div>

              {/* Set as default */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-default"
                  defaultChecked={editingConfig.is_default}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#39FF14] focus:ring-[#39FF14]"
                />
                <label htmlFor="edit-default" className="text-sm text-slate-300">
                  Set as default aggregator
                </label>
              </div>

              {/* SMPP Configuration */}
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">SMPP Configuration</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Host <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={editingConfig.smpp_config?.host || ''}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="smpp.provider.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Port <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      defaultValue={editingConfig.smpp_config?.port || '2775'}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="2775"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    System ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={editingConfig.smpp_config?.system_id || ''}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                    placeholder="your_system_id"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      defaultValue={editingConfig.credentials?.password || ''}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="••••••••"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Bind Type</label>
                    <select
                      defaultValue={editingConfig.smpp_config?.bind_type || 'transceiver'}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="transceiver">Transceiver</option>
                      <option value="transmitter">Transmitter</option>
                      <option value="receiver">Receiver</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Encoding</label>
                    <select
                      defaultValue={editingConfig.smpp_config?.encoding || 'UCS2'}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="UCS2">UCS2</option>
                      <option value="GSM7">GSM7</option>
                      <option value="UTF-8">UTF-8</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Settings</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Max Throughput (msg/sec)
                    </label>
                    <input
                      type="number"
                      defaultValue={editingConfig.settings?.max_throughput || '100'}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Rate Limit (req/sec)
                    </label>
                    <input
                      type="number"
                      defaultValue={editingConfig.settings?.rate_limit || '100'}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    setSuccess('Configuration updated successfully!');
                    setShowEditModal(false);
                    setEditingConfig(null);
                    setTimeout(() => setSuccess(null), 3000);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black rounded-lg hover:from-[#32e012] hover:to-[#28b80f] transition-all font-medium"
                >
                  Save Configuration
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingConfig(null);
                  }}
                  className="px-8 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {configs.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
          <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No SMS Aggregator Configurations</h3>
          <p className="text-slate-400 mb-6">
            Add your first SMS aggregator to start sending messages via SMPP or HTTP/HTTPS
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black rounded-lg hover:from-[#32e012] hover:to-[#28b80f] transition-all"
          >
            Add Configuration
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {configs.map((config) => (
            <div key={config.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-3 bg-gradient-to-r ${
                    config.protocol === 'smpp' ? 'from-[#39FF14] to-[#32e012]' : 'from-[#39FF14] to-[#32e012]'
                  } rounded-lg`}>
                    {getConnectionTypeIcon(config.protocol)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{config.gateway_name}</h3>
                      {config.is_default && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getAggregatorTypeBadge(config.provider)}`}>
                        {config.provider?.toUpperCase() || 'N/A'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getConnectionTypeBadge(config.protocol)}`}>
                        {config.protocol?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(config.id, config.status === "active")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      config.status === "active"
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                        : 'bg-slate-700 text-slate-400 border border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    {config.status === "active" ? 'Active' : 'Inactive'}
                  </button>
                  {!config.is_default && (
                    <button
                      onClick={() => handleSetDefault(config.id)}
                      className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-all"
                      title="Set as default"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedConfig(expandedConfig === config.id ? null : config.id)}
                    className="p-2 text-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/20/10 rounded-lg transition-all"
                    title="View details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingConfig(config);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-all"
                    title="Edit configuration"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteConfig(config.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete configuration"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedConfig === config.id && (
                <div className="border-t border-slate-700 pt-4 mt-4 space-y-4">
                  {config.protocol?.toLowerCase() === 'smpp' && config.smpp_config && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Radio className="w-4 h-4" />
                        SMPP Configuration
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {config.smpp_config.host && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Host:</span>
                            <span className="text-white font-mono">{config.smpp_config.host}</span>
                          </div>
                        )}
                        {config.smpp_config.port && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Port:</span>
                            <span className="text-white font-mono">{config.smpp_config.port}</span>
                          </div>
                        )}
                        {config.smpp_config.system_id && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">System ID:</span>
                            <span className="text-white font-mono">{config.smpp_config.system_id}</span>
                          </div>
                        )}
                        {config.smpp_config.bind_type && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Bind Type:</span>
                            <span className="text-white capitalize">{config.smpp_config.bind_type}</span>
                          </div>
                        )}
                        {config.smpp_config.encoding && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Encoding:</span>
                            <span className="text-white">{config.smpp_config.encoding}</span>
                          </div>
                        )}
                        {config.smpp_config.interface_version && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Interface Version:</span>
                            <span className="text-white">{config.smpp_config.interface_version}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(['http', 'https'].includes(config.protocol?.toLowerCase() || '')) && config.http_config && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        HTTP/HTTPS Configuration
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {config.http_config.base_url && (
                          <div className="bg-slate-900/50 rounded-lg p-3 col-span-2">
                            <span className="text-slate-500 block mb-1">Base URL:</span>
                            <span className="text-white font-mono break-all">{config.http_config.base_url}</span>
                          </div>
                        )}
                        {config.http_config.endpoint && (
                          <div className="bg-slate-900/50 rounded-lg p-3 col-span-2">
                            <span className="text-slate-500 block mb-1">Endpoint:</span>
                            <span className="text-white font-mono">{config.http_config.endpoint}</span>
                          </div>
                        )}
                        {config.http_config.method && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Method:</span>
                            <span className="text-white">{config.http_config.method}</span>
                          </div>
                        )}
                        {config.http_config.content_type && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Content Type:</span>
                            <span className="text-white font-mono text-xs">{config.http_config.content_type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {config.settings && Object.keys(config.settings).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Additional Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {config.settings.max_throughput && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Max Throughput:</span>
                            <span className="text-white">{config.settings.max_throughput} msg/sec</span>
                          </div>
                        )}
                        {config.settings.rate_limit && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Rate Limit:</span>
                            <span className="text-white">{config.settings.rate_limit} req/sec</span>
                          </div>
                        )}
                        {config.settings.validity_period && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Validity Period:</span>
                            <span className="text-white">{config.settings.validity_period}</span>
                          </div>
                        )}
                        {config.settings.default_sender && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <span className="text-slate-500 block mb-1">Default Sender:</span>
                            <span className="text-white">{config.settings.default_sender}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
                    <span>Created: {new Date(config.created_at).toLocaleString()}</span>
                    <span>Updated: {new Date(config.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddConfigModal
          tenantId={user?.app_metadata?.tenant_id || user?.user_metadata?.tenant_id || ''}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadConfigurations();
            setSuccess('SMS aggregator configured successfully');
            setTimeout(() => setSuccess(null), 3000);
          }}
          onError={(err) => setError(err)}
        />
      )}
    </div>
  );
}

interface AddConfigModalProps {
  tenantId: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function AddConfigModal({ tenantId, onClose, onSuccess, onError }: AddConfigModalProps) {
  const [formData, setFormData] = useState({
    aggregatorName: '',
    aggregatorType: 'infobip' as 'infobip' | 'twilio' | 'custom' | 'other',
    connectionType: 'smpp' as 'smpp' | 'http' | 'https',
    isDefault: false,
    smppHost: '',
    smppPort: '2775',
    smppSystemId: '',
    smppPassword: '',
    smppBindType: 'transceiver',
    smppEncoding: 'UCS2',
    httpBaseUrl: '',
    httpEndpoint: '',
    httpMethod: 'POST',
    httpContentType: 'application/json',
    apiKey: '',
    maxThroughput: '100',
    rateLimit: '100',
  });
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    if (!formData.aggregatorName || !formData.aggregatorType) {
      onError('Please fill in all required fields');
      return;
    }

    if (formData.connectionType === 'smpp' && (!formData.smppHost || !formData.smppPort || !formData.smppSystemId)) {
      onError('Please fill in all SMPP configuration fields');
      return;
    }

    if ((formData.connectionType === 'http' || formData.connectionType === 'https') && !formData.httpBaseUrl) {
      onError('Please fill in the base URL for HTTP/HTTPS configuration');
      return;
    }

    setSaving(true);

    try {
      // Map form fields to actual Prisma column names
      const configData: any = {
        tenant_id: tenantId || null,
        gateway_name: formData.aggregatorName,
        provider: formData.aggregatorType,
        protocol: formData.connectionType.toUpperCase(),
        status: 'active',
        is_active: true,
        is_default: formData.isDefault,
      };

      if (formData.connectionType === 'smpp') {
        configData.smpp_config = JSON.stringify({
          host: formData.smppHost,
          port: parseInt(formData.smppPort),
          system_id: formData.smppSystemId,
          bind_type: formData.smppBindType,
          encoding: formData.smppEncoding,
          interface_version: '3.4',
          ton: 1,
          npi: 1,
        });
        configData.credentials = JSON.stringify({
          password: formData.smppPassword,
        });
      } else {
        configData.http_config = JSON.stringify({
          base_url: formData.httpBaseUrl,
          endpoint: formData.httpEndpoint,
          method: formData.httpMethod,
          content_type: formData.httpContentType,
          timeout: 30,
        });
        configData.credentials = JSON.stringify({
          api_key: formData.apiKey,
        });
      }

      configData.settings = JSON.stringify({
        max_throughput: parseInt(formData.maxThroughput),
        rate_limit: parseInt(formData.rateLimit),
      });

      const { error: insertError } = await db
        .from('sms_configurations')
        .insert(configData);

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: any) {
      console.error('Error saving configuration:', err);
      onError(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full p-6 my-8">
        <h2 className="text-2xl font-bold text-white mb-6">Add SMS Aggregator Configuration</h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Configuration Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.aggregatorName}
              onChange={(e) => setFormData({ ...formData, aggregatorName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
              placeholder="e.g., Infobip Production"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Aggregator Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.aggregatorType}
                onChange={(e) => setFormData({ ...formData, aggregatorType: e.target.value as any })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
              >
                <option value="infobip">Infobip</option>
                <option value="twilio">Twilio</option>
                <option value="custom">Custom</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Connection Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.connectionType}
                onChange={(e) => setFormData({ ...formData, connectionType: e.target.value as any })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
              >
                <option value="smpp">SMPP</option>
                <option value="http">HTTP</option>
                <option value="https">HTTPS</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 text-[#39FF14] rounded"
            />
            <label htmlFor="isDefault" className="text-sm text-slate-300 cursor-pointer">
              Set as default aggregator
            </label>
          </div>

          {formData.connectionType === 'smpp' ? (
            <>
              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">SMPP Configuration</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Host <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.smppHost}
                        onChange={(e) => setFormData({ ...formData, smppHost: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                        placeholder="smpp.provider.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Port <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.smppPort}
                        onChange={(e) => setFormData({ ...formData, smppPort: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                        placeholder="2775"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      System ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.smppSystemId}
                      onChange={(e) => setFormData({ ...formData, smppSystemId: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="your_system_id"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.smppPassword}
                        onChange={(e) => setFormData({ ...formData, smppPassword: e.target.value })}
                        className="w-full px-4 py-2 pr-10 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Bind Type
                      </label>
                      <select
                        value={formData.smppBindType}
                        onChange={(e) => setFormData({ ...formData, smppBindType: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="transceiver">Transceiver</option>
                        <option value="transmitter">Transmitter</option>
                        <option value="receiver">Receiver</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Encoding
                      </label>
                      <select
                        value={formData.smppEncoding}
                        onChange={(e) => setFormData({ ...formData, smppEncoding: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="UCS2">UCS2</option>
                        <option value="GSM7">GSM7</option>
                        <option value="UTF8">UTF8</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">HTTP/HTTPS Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Base URL <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.httpBaseUrl}
                      onChange={(e) => setFormData({ ...formData, httpBaseUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="https://api.provider.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Endpoint
                    </label>
                    <input
                      type="text"
                      value={formData.httpEndpoint}
                      onChange={(e) => setFormData({ ...formData, httpEndpoint: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="/sms/send"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Method
                      </label>
                      <select
                        value={formData.httpMethod}
                        onChange={(e) => setFormData({ ...formData, httpMethod: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="POST">POST</option>
                        <option value="GET">GET</option>
                        <option value="PUT">PUT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Content Type
                      </label>
                      <select
                        value={formData.httpContentType}
                        onChange={(e) => setFormData({ ...formData, httpContentType: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="application/json">application/json</option>
                        <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        className="w-full px-4 py-2 pr-10 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                        placeholder="your-api-key"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">Additional Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Throughput (msg/sec)
                </label>
                <input
                  type="number"
                  value={formData.maxThroughput}
                  onChange={(e) => setFormData({ ...formData, maxThroughput: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rate Limit (req/sec)
                </label>
                <input
                  type="number"
                  value={formData.rateLimit}
                  onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#39FF14]"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
