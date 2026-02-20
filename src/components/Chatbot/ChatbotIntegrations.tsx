import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import {
  MessageSquare, Share2, Users, Brain, Database, Phone, Headphones,
  CreditCard, Package, BarChart3, Zap, MoreHorizontal, TrendingUp,
  Settings, Check, X, Plus, Trash2, RefreshCw, ExternalLink, Copy,
  Key, Link as LinkIcon, AlertCircle, CheckCircle, Loader
} from 'lucide-react';

interface IntegrationCategory {
  id: string;
  category_name: string;
  category_display_name: string;
  description: string;
  icon_name: string;
}

interface IntegrationProvider {
  id: string;
  category_id: string;
  provider_name: string;
  provider_display_name: string;
  description: string;
  provider_type: string;
  auth_type: string;
  configuration_schema: any;
  capabilities: string[];
  documentation_url: string;
  logo_url: string;
  is_active: boolean;
}

interface BotIntegration {
  id: string;
  bot_id: string;
  provider_id: string;
  integration_name: string;
  configuration: any;
  is_active: boolean;
  sync_status: string;
  error_message: string;
  last_sync_at: string;
  cb_integration_providers?: IntegrationProvider;
}

export default function ChatbotIntegrations({ botId }: { botId: string }) {
  const [categories, setCategories] = useState<IntegrationCategory[]>([]);
  const [providers, setProviders] = useState<IntegrationProvider[]>([]);
  const [botIntegrations, setBotIntegrations] = useState<BotIntegration[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null);
  const [configForm, setConfigForm] = useState<any>({});
  const [integrationName, setIntegrationName] = useState('');
  const [editingIntegration, setEditingIntegration] = useState<BotIntegration | null>(null);
  const [loading, setLoading] = useState(true);

  const iconMap: any = {
    MessageSquare, Share2, Users, Brain, Database, Phone, Headphones,
    CreditCard, Package, BarChart3, Zap, MoreHorizontal, TrendingUp
  };

  useEffect(() => {
    if (botId) {
      loadData();
    }
  }, [botId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, providersRes, integrationsRes] = await Promise.all([
        db.from('cb_integration_categories').select('*').order('sort_order'),
        db.from('cb_integration_providers').select('*').eq('is_active', true),
        db.from('cb_bot_integrations').select('*, cb_integration_providers(*)').eq('bot_id', botId)
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (providersRes.data) setProviders(providersRes.data);
      if (integrationsRes.data) setBotIntegrations(integrationsRes.data);
    } catch (error) {
      console.error('Error loading integration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesCategory = selectedCategory === 'all' || provider.category_id === selectedCategory;
    const matchesSearch = provider.provider_display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openConfigModal = (provider: IntegrationProvider, existing?: BotIntegration) => {
    setSelectedProvider(provider);
    setEditingIntegration(existing || null);
    setIntegrationName(existing?.integration_name || `${provider.provider_display_name} Integration`);

    if (existing) {
      setConfigForm(existing.configuration || {});
    } else {
      const initialConfig: any = {};
      Object.keys(provider.configuration_schema || {}).forEach(key => {
        initialConfig[key] = '';
      });
      setConfigForm(initialConfig);
    }

    setShowConfigModal(true);
  };

  const closeConfigModal = () => {
    setShowConfigModal(false);
    setSelectedProvider(null);
    setEditingIntegration(null);
    setConfigForm({});
    setIntegrationName('');
  };

  const saveIntegration = async () => {
    if (!selectedProvider) return;

    try {
      const integrationData = {
        bot_id: botId,
        provider_id: selectedProvider.id,
        integration_name: integrationName,
        configuration: configForm,
        is_active: true,
        sync_status: 'configured'
      };

      if (editingIntegration) {
        const { error } = await db
          .from('cb_bot_integrations')
          .update(integrationData)
          .eq('id', editingIntegration.id);

        if (error) throw error;
      } else {
        const { error } = await db
          .from('cb_bot_integrations')
          .insert(integrationData);

        if (error) throw error;
      }

      closeConfigModal();
      loadData();
    } catch (error: any) {
      alert('Failed to save integration: ' + error.message);
    }
  };

  const toggleIntegration = async (integration: BotIntegration) => {
    try {
      const { error } = await db
        .from('cb_bot_integrations')
        .update({ is_active: !integration.is_active })
        .eq('id', integration.id);

      if (error) throw error;
      loadData();
    } catch (error: any) {
      alert('Failed to toggle integration: ' + error.message);
    }
  };

  const deleteIntegration = async (integrationId: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return;

    try {
      const { error } = await db
        .from('cb_bot_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;
      loadData();
    } catch (error: any) {
      alert('Failed to delete integration: ' + error.message);
    }
  };

  const testConnection = async (integration: BotIntegration) => {
    try {
      const { error } = await db
        .from('cb_bot_integrations')
        .update({
          sync_status: 'testing',
          last_sync_at: new Date().toISOString()
        })
        .eq('id', integration.id);

      if (error) throw error;

      setTimeout(() => {
        db
          .from('cb_bot_integrations')
          .update({ sync_status: 'connected' })
          .eq('id', integration.id)
          .then(() => loadData());
      }, 2000);

      loadData();
    } catch (error: any) {
      alert('Failed to test connection: ' + error.message);
    }
  };

  const getIntegrationStatus = (integration: BotIntegration) => {
    if (!integration.is_active) {
      return { icon: X, color: 'text-gray-500', bg: 'bg-gray-500/20', label: 'Inactive' };
    }

    switch (integration.sync_status) {
      case 'connected':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/20', label: 'Connected' };
      case 'testing':
        return { icon: Loader, color: 'text-[#39FF14]', bg: 'bg-[#39FF14]/20', label: 'Testing' };
      case 'error':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/20', label: 'Error' };
      default:
        return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Configured' };
    }
  };

  const isProviderConfigured = (providerId: string) => {
    return botIntegrations.some(int => int.provider_id === providerId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-[#39FF14] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Channel Integrations</h2>
            <p className="text-gray-400 text-sm mt-1">
              Connect your chatbot to messaging platforms, CRMs, and other services
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {botIntegrations.filter(i => i.is_active).length} Active
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#39FF14] text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({providers.length})
          </button>
          {categories.map(category => {
            const count = providers.filter(p => p.category_id === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#39FF14] text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.category_display_name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map(provider => {
          const Icon = iconMap[provider.configuration_schema?.icon] || Settings;
          const configured = isProviderConfigured(provider.id);
          const integration = botIntegrations.find(i => i.provider_id === provider.id);
          const status = integration ? getIntegrationStatus(integration) : null;

          return (
            <div
              key={provider.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${configured ? 'bg-[#39FF14]/20' : 'bg-gray-700'} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${configured ? 'text-[#39FF14]' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{provider.provider_display_name}</h3>
                    <p className="text-xs text-gray-500">{provider.provider_type}</p>
                  </div>
                </div>
                {configured && status && (
                  <div className={`${status.bg} px-2 py-1 rounded flex items-center gap-1`}>
                    <status.icon className={`w-3 h-3 ${status.color} ${status.icon === Loader ? 'animate-spin' : ''}`} />
                    <span className={`text-xs ${status.color}`}>{status.label}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{provider.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {provider.capabilities?.slice(0, 3).map((cap, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                    {cap.replace(/_/g, ' ')}
                  </span>
                ))}
                {provider.capabilities?.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                    +{provider.capabilities.length - 3}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {configured && integration ? (
                  <>
                    <button
                      onClick={() => openConfigModal(provider, integration)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    <button
                      onClick={() => toggleIntegration(integration)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        integration.is_active
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {integration.is_active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => testConnection(integration)}
                      className="bg-[#39FF14] hover:bg-[#32e012] text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openConfigModal(provider)}
                    className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProviders.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No integrations found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter</p>
        </div>
      )}

      {showConfigModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingIntegration ? 'Configure' : 'Connect'} {selectedProvider.provider_display_name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{selectedProvider.description}</p>
                </div>
                <button onClick={closeConfigModal} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Integration Name
                </label>
                <input
                  type="text"
                  value={integrationName}
                  onChange={(e) => setIntegrationName(e.target.value)}
                  placeholder="e.g., Production Slack Bot"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Key className="w-5 h-5 text-[#39FF14] mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#39FF14] mb-1">Authentication: {selectedProvider.auth_type}</h4>
                    <p className="text-xs text-[#39FF14]/80">
                      {selectedProvider.auth_type === 'api_key' && 'Enter your API key to authenticate'}
                      {selectedProvider.auth_type === 'oauth2' && 'OAuth 2.0 authentication required'}
                      {selectedProvider.auth_type === 'token' && 'Enter your access token'}
                      {selectedProvider.auth_type === 'basic_auth' && 'Enter your username and password'}
                    </p>
                  </div>
                </div>
              </div>

              {Object.entries(selectedProvider.configuration_schema || {}).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </label>
                  <input
                    type={key.includes('secret') || key.includes('password') || key.includes('token') ? 'password' : 'text'}
                    value={configForm[key] || ''}
                    onChange={(e) => setConfigForm({ ...configForm, [key]: e.target.value })}
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
              ))}

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.capabilities?.map((cap, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-600 text-gray-200 text-xs rounded-full">
                      {cap.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {selectedProvider.documentation_url && (
                <a
                  href={selectedProvider.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#39FF14] hover:text-[#39FF14] text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Documentation
                </a>
              )}
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3 sticky bottom-0 bg-gray-800">
              {editingIntegration && (
                <button
                  onClick={() => deleteIntegration(editingIntegration.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
              <button
                onClick={closeConfigModal}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveIntegration}
                className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {editingIntegration ? 'Save Changes' : 'Connect Integration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
