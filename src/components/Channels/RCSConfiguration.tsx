import React, { useState, useEffect } from 'react';
import {
  Settings, Plus, Trash2, Power, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, Save, X, Star
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

interface RCSConfiguration {
  id: string;
  aggregator_name: string;
  aggregator_type: string;
  connection_type: string;
  rbm_api_endpoint?: string;
  rbm_region?: string;
  rbm_supported_message_types?: string[];
  http_base_url?: string;
  http_method?: string;
  http_content_type?: string;
  api_key?: string;
  agent_id?: string;
  additional_credentials?: any;
  rcs_agent_name?: string;
  rcs_agent_description?: string;
  rcs_brand_color?: string;
  max_throughput?: number;
  rate_limit?: number;
  enable_sms_fallback: boolean;
  enable_delivery_receipts: boolean;
  is_active: boolean;
  is_default: boolean;
  verification_status: string;
  created_at: string;
}

export default function RCSConfiguration() {
  const { user } = useAuth();
  const [configurations, setConfigurations] = useState<RCSConfiguration[]>([]);
  const [showNewConfig, setShowNewConfig] = useState(false);
  const [expandedConfig, setExpandedConfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    aggregator_name: '',
    aggregator_type: 'infobip',
    connection_type: 'https',
    rbm_api_endpoint: '',
    rbm_region: 'us',
    rbm_supported_message_types: [] as string[],
    http_base_url: '',
    http_method: 'POST',
    http_content_type: 'application/json',
    api_key: '',
    agent_id: '',
    rcs_agent_name: '',
    rcs_agent_description: '',
    rcs_brand_color: '#007AFF',
    max_throughput: 100,
    rate_limit: 1000,
    enable_sms_fallback: true,
    enable_delivery_receipts: true,
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      loadConfigurations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadConfigurations = async () => {
    setLoading(true);
    console.log('Loading RCS configurations');

    const { data, error } = await db
      .from('rcs_aggregator_configurations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading RCS configurations:', error);
    } else {
      console.log('Loaded RCS configurations:', data?.length || 0, 'configs');
      setConfigurations(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await db
        .from('rcs_aggregator_configurations')
        .insert({
          ...formData,
          user_id: user?.id,
        });

      if (error) throw error;

      alert('Configuration added successfully!');
      setShowNewConfig(false);
      resetForm();
      loadConfigurations();
    } catch (error) {
      console.error('Error adding configuration:', error);
      alert('Failed to add configuration');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await db
      .from('rcs_aggregator_configurations')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      loadConfigurations();
    }
  };

  const setDefault = async (id: string) => {
    await db
      .from('rcs_aggregator_configurations')
      .update({ is_default: false });

    const { error } = await db
      .from('rcs_aggregator_configurations')
      .update({ is_default: true })
      .eq('id', id);

    if (!error) {
      loadConfigurations();
    }
  };

  const deleteConfig = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return;
    }

    const { error } = await db
      .from('rcs_aggregator_configurations')
      .delete()
      .eq('id', id);

    if (!error) {
      loadConfigurations();
    }
  };

  const resetForm = () => {
    setFormData({
      aggregator_name: '',
      aggregator_type: 'infobip',
      connection_type: 'https',
      rbm_api_endpoint: '',
      rbm_region: 'us',
      rbm_supported_message_types: [],
      http_base_url: '',
      http_method: 'POST',
      http_content_type: 'application/json',
      api_key: '',
      agent_id: '',
      rcs_agent_name: '',
      rcs_agent_description: '',
      rcs_brand_color: '#007AFF',
      max_throughput: 100,
      rate_limit: 1000,
      enable_sms_fallback: true,
      enable_delivery_receipts: true,
      is_active: true,
    });
  };

  const getAggregatorIcon = (type: string) => {
    const colors: Record<string, string> = {
      infobip: 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30',
      twilio: 'bg-red-500/20 text-red-400 border-red-500/30',
      google_jibe: 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/30',
      custom: 'bg-green-500/20 text-green-400 border-green-500/30',
      other: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    return colors[type] || colors.other;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">RCS Aggregator Configuration</h2>
          <p className="text-slate-400">Manage your RCS aggregator connections without Google Jibe Cloud</p>
        </div>
        <button
          onClick={() => setShowNewConfig(true)}
          className="bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Configuration
        </button>
      </div>

      {showNewConfig && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Add New RCS Aggregator</h3>
            <button
              onClick={() => {
                setShowNewConfig(false);
                resetForm();
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Configuration Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.aggregator_name}
                  onChange={(e) => setFormData({ ...formData, aggregator_name: e.target.value })}
                  placeholder="e.g., Primary Infobip RCS"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Aggregator Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.aggregator_type}
                  onChange={(e) => setFormData({ ...formData, aggregator_type: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="infobip">Infobip</option>
                  <option value="twilio">Twilio</option>
                  <option value="google_jibe">Google Jibe</option>
                  <option value="custom">Custom Provider</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Connection Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.connection_type}
                  onChange={(e) => setFormData({ ...formData, connection_type: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="rbm_api">RBM API</option>
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                </select>
              </div>

              {formData.connection_type === 'rbm_api' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      RBM API Endpoint
                    </label>
                    <input
                      type="text"
                      value={formData.rbm_api_endpoint}
                      onChange={(e) => setFormData({ ...formData, rbm_api_endpoint: e.target.value })}
                      placeholder="https://rbm-api.example.com"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      RBM Region
                    </label>
                    <select
                      value={formData.rbm_region}
                      onChange={(e) => setFormData({ ...formData, rbm_region: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="us">United States</option>
                      <option value="eu">Europe</option>
                      <option value="asia">Asia Pacific</option>
                    </select>
                  </div>
                </>
              )}

              {(formData.connection_type === 'http' || formData.connection_type === 'https') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Base URL <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.http_base_url}
                      onChange={(e) => setFormData({ ...formData, http_base_url: e.target.value })}
                      placeholder="https://api.aggregator.com/v1"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      HTTP Method
                    </label>
                    <select
                      value={formData.http_method}
                      onChange={(e) => setFormData({ ...formData, http_method: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
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
                    <input
                      type="text"
                      value={formData.http_content_type}
                      onChange={(e) => setFormData({ ...formData, http_content_type: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  API Key <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  placeholder="Enter your API key"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  RCS Agent ID
                </label>
                <input
                  type="text"
                  value={formData.agent_id}
                  onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
                  placeholder="agent-12345"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  RCS Agent Name
                </label>
                <input
                  type="text"
                  value={formData.rcs_agent_name}
                  onChange={(e) => setFormData({ ...formData, rcs_agent_name: e.target.value })}
                  placeholder="My Brand"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Brand Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.rcs_brand_color}
                    onChange={(e) => setFormData({ ...formData, rcs_brand_color: e.target.value })}
                    className="h-11 w-16 bg-slate-900/50 border border-slate-700 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.rcs_brand_color}
                    onChange={(e) => setFormData({ ...formData, rcs_brand_color: e.target.value })}
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Throughput (msgs/sec)
                </label>
                <input
                  type="number"
                  value={formData.max_throughput}
                  onChange={(e) => setFormData({ ...formData, max_throughput: parseInt(e.target.value) })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rate Limit (msgs/hour)
                </label>
                <input
                  type="number"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({ ...formData, rate_limit: parseInt(e.target.value) })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Agent Description
              </label>
              <textarea
                value={formData.rcs_agent_description}
                onChange={(e) => setFormData({ ...formData, rcs_agent_description: e.target.value })}
                rows={3}
                placeholder="Brief description of your RCS agent"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enable_sms_fallback}
                  onChange={(e) => setFormData({ ...formData, enable_sms_fallback: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-slate-300">Enable SMS Fallback</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enable_delivery_receipts}
                  onChange={(e) => setFormData({ ...formData, enable_delivery_receipts: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-slate-300">Enable Delivery Receipts</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-slate-300">Active</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowNewConfig(false);
                  resetForm();
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#39FF14]"></div>
          <p className="text-slate-400 mt-4">Loading configurations...</p>
        </div>
      ) : configurations.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No RCS Aggregators Configured</h3>
          <p className="text-slate-400 mb-6">Add your first RCS aggregator to start sending rich messages</p>
          <button
            onClick={() => setShowNewConfig(true)}
            className="bg-[#39FF14] hover:bg-[#32e012] text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Configuration
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {configurations.map((config) => (
            <div
              key={config.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{config.aggregator_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAggregatorIcon(config.aggregator_type)}`}>
                      {config.aggregator_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(config.verification_status)}`}>
                      {config.verification_status}
                    </span>
                    {config.is_default && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Connection: {config.connection_type.toUpperCase()}</span>
                    {config.rcs_agent_name && <span>Agent: {config.rcs_agent_name}</span>}
                    {config.agent_id && <span>ID: {config.agent_id}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDefault(config.id)}
                    className="p-2 text-slate-400 hover:text-yellow-400 transition-colors"
                    title="Set as default"
                  >
                    <Star className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleActive(config.id, config.is_active)}
                    className={`p-2 transition-colors ${
                      config.is_active ? 'text-green-400 hover:text-green-300' : 'text-slate-400 hover:text-slate-300'
                    }`}
                    title={config.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setExpandedConfig(expandedConfig === config.id ? null : config.id)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    {expandedConfig === config.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => deleteConfig(config.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedConfig === config.id && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Connection Details</h4>
                      <div className="space-y-2 text-sm">
                        {config.http_base_url && (
                          <div>
                            <span className="text-slate-500">Base URL:</span>
                            <p className="text-white break-all">{config.http_base_url}</p>
                          </div>
                        )}
                        {config.rbm_api_endpoint && (
                          <div>
                            <span className="text-slate-500">RBM Endpoint:</span>
                            <p className="text-white break-all">{config.rbm_api_endpoint}</p>
                          </div>
                        )}
                        {config.http_method && (
                          <div>
                            <span className="text-slate-500">Method:</span>
                            <span className="text-white ml-2">{config.http_method}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Performance Settings</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-500">Max Throughput:</span>
                          <span className="text-white ml-2">{config.max_throughput} msg/s</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Rate Limit:</span>
                          <span className="text-white ml-2">{config.rate_limit} msg/hr</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {config.enable_sms_fallback && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                              SMS Fallback
                            </span>
                          )}
                          {config.enable_delivery_receipts && (
                            <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded border border-[#39FF14]/30">
                              Delivery Receipts
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Branding</h4>
                      <div className="space-y-2 text-sm">
                        {config.rcs_agent_name && (
                          <div>
                            <span className="text-slate-500">Agent Name:</span>
                            <p className="text-white">{config.rcs_agent_name}</p>
                          </div>
                        )}
                        {config.rcs_agent_description && (
                          <div>
                            <span className="text-slate-500">Description:</span>
                            <p className="text-white">{config.rcs_agent_description}</p>
                          </div>
                        )}
                        {config.rcs_brand_color && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Brand Color:</span>
                            <div
                              className="w-6 h-6 rounded border border-slate-600"
                              style={{ backgroundColor: config.rcs_brand_color }}
                            ></div>
                            <span className="text-white">{config.rcs_brand_color}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
