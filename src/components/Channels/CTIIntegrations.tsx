import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Zap, Webhook, Key, Workflow, Database, ExternalLink, Plus, Edit, Trash2, Eye, RefreshCw, CheckCircle, XCircle, Play, X, Copy, Check } from 'lucide-react';

type CRMIntegration = {
  id: string;
  integration_name: string;
  crm_provider: string;
  status: string;
  auth_type: string;
  api_endpoint: string;
  sync_enabled: boolean;
  is_active: boolean;
  created_at: string;
};

type WebhookConfiguration = {
  id: string;
  webhook_name: string;
  webhook_description: string;
  endpoint_url: string;
  http_method: string;
  status: string;
  total_triggers: number;
  success_count: number;
  failure_count: number;
  is_active: boolean;
};

type CRMSyncLog = {
  id: string;
  integration_id: string;
  sync_type: string;
  sync_direction: string;
  status: string;
  synced_data: any;
  error_message: string;
  created_at: string;
};

type WebhookLog = {
  id: string;
  webhook_id: string;
  event_type: string;
  request_url: string;
  request_method: string;
  response_status: number;
  status: string;
  created_at: string;
};

type APIKey = {
  id: string;
  key_name: string;
  key_description: string;
  api_key_prefix: string;
  status: string;
  total_requests: number;
  created_at: string;
};

type IntegrationWorkflow = {
  id: string;
  workflow_name: string;
  workflow_description: string;
  trigger_type: string;
  status: string;
  total_executions: number;
  success_count: number;
  failure_count: number;
  is_active: boolean;
};

export default function CTIIntegrations() {
  const [activeTab, setActiveTab] = useState('crm');
  const [loading, setLoading] = useState(true);

  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfiguration[]>([]);
  const [syncLogs, setSyncLogs] = useState<CRMSyncLog[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [workflows, setWorkflows] = useState<IntegrationWorkflow[]>([]);

  // Modal states
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false);
  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false);
  const [showGenerateKeyModal, setShowGenerateKeyModal] = useState(false);
  const [showCreateWorkflowModal, setShowCreateWorkflowModal] = useState(false);

  const [showEditIntegrationModal, setShowEditIntegrationModal] = useState(false);
  const [showEditWebhookModal, setShowEditWebhookModal] = useState(false);
  const [showEditWorkflowModal, setShowEditWorkflowModal] = useState(false);

  const [selectedIntegration, setSelectedIntegration] = useState<CRMIntegration | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfiguration | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<IntegrationWorkflow | null>(null);

  const [newKeyGenerated, setNewKeyGenerated] = useState<string>('');
  const [keyCopied, setKeyCopied] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchIntegrations(),
      fetchWebhooks(),
      fetchSyncLogs(),
      fetchWebhookLogs(),
      fetchAPIKeys(),
      fetchWorkflows()
    ]);
    setLoading(false);
  };

  const fetchIntegrations = async () => {
    const { data } = await db
      .from('crm_integrations')
      .select('*')
      .order('created_at', { ascending: false });
    setIntegrations(data || []);
  };

  const fetchWebhooks = async () => {
    const { data } = await db
      .from('webhook_configurations')
      .select('*')
      .order('created_at', { ascending: false });
    setWebhooks(data || []);
  };

  const fetchSyncLogs = async () => {
    const { data } = await db
      .from('crm_sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setSyncLogs(data || []);
  };

  const fetchWebhookLogs = async () => {
    const { data } = await db
      .from('webhook_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setWebhookLogs(data || []);
  };

  const fetchAPIKeys = async () => {
    const { data } = await db
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });
    setApiKeys(data || []);
  };

  const fetchWorkflows = async () => {
    const { data } = await db
      .from('integration_workflows')
      .select('*')
      .order('created_at', { ascending: false });
    setWorkflows(data || []);
  };

  const deleteItem = async (table: string, id: string, refreshFn: () => void) => {
    const { error } = await db.from(table).delete().eq('id', id);
    if (!error) refreshFn();
  };

  const toggleActive = async (table: string, id: string, currentStatus: boolean, refreshFn: () => void) => {
    const { error } = await db.from(table).update({ is_active: !currentStatus }).eq('id', id);
    if (!error) refreshFn();
  };

  const handleAddIntegration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await db.from('crm_integrations').insert({
      integration_name: formData.get('integration_name'),
      crm_provider: formData.get('crm_provider'),
      auth_type: formData.get('auth_type'),
      api_endpoint: formData.get('api_endpoint'),
      status: 'configuring',
      sync_enabled: false,
      is_active: false
    });

    if (!error) {
      setShowAddIntegrationModal(false);
      fetchIntegrations();
    }
  };

  const handleAddWebhook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await db.from('webhook_configurations').insert({
      webhook_name: formData.get('webhook_name'),
      webhook_description: formData.get('webhook_description'),
      endpoint_url: formData.get('endpoint_url'),
      http_method: formData.get('http_method'),
      status: 'inactive',
      total_triggers: 0,
      success_count: 0,
      failure_count: 0,
      is_active: false
    });

    if (!error) {
      setShowAddWebhookModal(false);
      fetchWebhooks();
    }
  };

  const handleGenerateKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newKey = 'sk_' + Array.from({ length: 32 }, () =>
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]
    ).join('');

    const prefix = newKey.substring(0, 10);

    const { error } = await db.from('api_keys').insert({
      key_name: formData.get('key_name'),
      key_description: formData.get('key_description'),
      api_key_prefix: prefix,
      api_key_hash: 'hash_' + newKey.substring(3, 35),
      status: 'active',
      total_requests: 0
    });

    if (!error) {
      setNewKeyGenerated(newKey);
      fetchAPIKeys();
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await db.from('integration_workflows').insert({
      workflow_name: formData.get('workflow_name'),
      workflow_description: formData.get('workflow_description'),
      trigger_type: formData.get('trigger_type'),
      actions: [{ action: 'custom', target: 'api' }],
      status: 'inactive',
      total_executions: 0,
      success_count: 0,
      failure_count: 0,
      is_active: false
    });

    if (!error) {
      setShowCreateWorkflowModal(false);
      fetchWorkflows();
    }
  };

  const handleEditIntegration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedIntegration) return;
    const formData = new FormData(e.currentTarget);

    const { error } = await db.from('crm_integrations').update({
      integration_name: formData.get('integration_name'),
      crm_provider: formData.get('crm_provider'),
      auth_type: formData.get('auth_type'),
      api_endpoint: formData.get('api_endpoint')
    }).eq('id', selectedIntegration.id);

    if (!error) {
      setShowEditIntegrationModal(false);
      setSelectedIntegration(null);
      fetchIntegrations();
    }
  };

  const handleEditWebhook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWebhook) return;
    const formData = new FormData(e.currentTarget);

    const { error } = await db.from('webhook_configurations').update({
      webhook_name: formData.get('webhook_name'),
      webhook_description: formData.get('webhook_description'),
      endpoint_url: formData.get('endpoint_url'),
      http_method: formData.get('http_method')
    }).eq('id', selectedWebhook.id);

    if (!error) {
      setShowEditWebhookModal(false);
      setSelectedWebhook(null);
      fetchWebhooks();
    }
  };

  const handleEditWorkflow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWorkflow) return;
    const formData = new FormData(e.currentTarget);

    const { error } = await db.from('integration_workflows').update({
      workflow_name: formData.get('workflow_name'),
      workflow_description: formData.get('workflow_description'),
      trigger_type: formData.get('trigger_type')
    }).eq('id', selectedWorkflow.id);

    if (!error) {
      setShowEditWorkflowModal(false);
      setSelectedWorkflow(null);
      fetchWorkflows();
    }
  };

  const openEditIntegration = (integration: CRMIntegration) => {
    setSelectedIntegration(integration);
    setShowEditIntegrationModal(true);
  };

  const openEditWebhook = (webhook: WebhookConfiguration) => {
    setSelectedWebhook(webhook);
    setShowEditWebhookModal(true);
  };

  const openEditWorkflow = (workflow: IntegrationWorkflow) => {
    setSelectedWorkflow(workflow);
    setShowEditWorkflowModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const getCRMProviderLogo = (provider: string) => {
    const logos: Record<string, string> = {
      salesforce: '☁️',
      hubspot: '🟠',
      zendesk: '💚',
      dynamics365: '🔷',
      zoho: '🟣',
      pipedrive: '🟢',
      freshdesk: '🟦'
    };
    return logos[provider] || '⚙️';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      error: 'bg-red-500/20 text-red-400',
      configuring: 'bg-yellow-500/20 text-yellow-400',
      success: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      retrying: 'bg-[#39FF14]/20 text-[#39FF14]'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getSyncSuccessRate = (syncCount: number, successCount: number) => {
    if (syncCount === 0) return 0;
    return ((successCount / syncCount) * 100).toFixed(1);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Loading integrations...</div></div>;
  }

  return (
    <div>
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab('crm')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'crm' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Database className="w-4 h-4 inline mr-2" />CRM Integrations
        </button>
        <button onClick={() => setActiveTab('webhooks')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'webhooks' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Webhook className="w-4 h-4 inline mr-2" />Webhooks
        </button>
        <button onClick={() => setActiveTab('sync-logs')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'sync-logs' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <RefreshCw className="w-4 h-4 inline mr-2" />Sync Logs
        </button>
        <button onClick={() => setActiveTab('webhook-logs')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'webhook-logs' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Zap className="w-4 h-4 inline mr-2" />Webhook Logs
        </button>
        <button onClick={() => setActiveTab('api-keys')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'api-keys' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Key className="w-4 h-4 inline mr-2" />API Keys
        </button>
        <button onClick={() => setActiveTab('workflows')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'workflows' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Workflow className="w-4 h-4 inline mr-2" />Workflows
        </button>
      </div>

      {activeTab === 'crm' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">CRM Integrations</h2>
            <button onClick={() => setShowAddIntegrationModal(true)} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Add Integration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{getCRMProviderLogo(integration.crm_provider)}</div>
                    <div>
                      <h3 className="text-white font-bold">{integration.integration_name}</h3>
                      <p className="text-gray-400 text-sm capitalize">{integration.crm_provider}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auth Type:</span>
                    <span className="text-white font-medium uppercase">{integration.auth_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auto Sync:</span>
                    <span className={integration.sync_enabled ? 'text-green-400' : 'text-red-400'}>
                      {integration.sync_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Endpoint:</span>
                    <ExternalLink className="w-3 h-3 text-[#39FF14]" />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 border-t border-gray-700 pt-3">
                  <button onClick={() => toggleActive('crm_integrations', integration.id, integration.is_active, fetchIntegrations)} className="p-2 hover:bg-gray-700 rounded">
                    {integration.is_active ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button onClick={() => openEditIntegration(integration)} className="p-2 hover:bg-gray-700 rounded">
                    <Edit className="w-4 h-4 text-[#39FF14]" />
                  </button>
                  <button onClick={() => deleteItem('crm_integrations', integration.id, fetchIntegrations)} className="p-2 hover:bg-gray-700 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Webhook Configurations</h2>
            <button onClick={() => setShowAddWebhookModal(true)} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Add Webhook
            </button>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Webhook className="w-5 h-5 text-[#39FF14]" />
                      <h3 className="text-white font-bold">{webhook.webhook_name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(webhook.status)}`}>
                        {webhook.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{webhook.webhook_description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Method</div>
                        <div className="text-white font-bold">{webhook.http_method}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Total Triggers</div>
                        <div className="text-[#39FF14] font-bold">{webhook.total_triggers}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Success</div>
                        <div className="text-green-400 font-bold">{webhook.success_count}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Success Rate</div>
                        <div className="text-[#39FF14] font-bold">{getSyncSuccessRate(webhook.total_triggers, webhook.success_count)}%</div>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-gray-900 rounded text-xs text-gray-400 font-mono truncate">
                      {webhook.endpoint_url}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 hover:bg-gray-700 rounded">
                      <Play className="w-4 h-4 text-green-400" />
                    </button>
                    <button onClick={() => toggleActive('webhook_configurations', webhook.id, webhook.is_active, fetchWebhooks)} className="p-2 hover:bg-gray-700 rounded">
                      {webhook.is_active ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                    </button>
                    <button onClick={() => openEditWebhook(webhook)} className="p-2 hover:bg-gray-700 rounded">
                      <Edit className="w-4 h-4 text-[#39FF14]" />
                    </button>
                    <button onClick={() => deleteItem('webhook_configurations', webhook.id, fetchWebhooks)} className="p-2 hover:bg-gray-700 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sync-logs' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">CRM Sync Logs</h2>
            <button onClick={fetchSyncLogs} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />Refresh
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Direction</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Details</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-gray-300 text-sm">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs font-medium uppercase">
                        {log.sync_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs font-medium uppercase">
                        {log.sync_direction}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm truncate max-w-xs">
                      {log.error_message || JSON.stringify(log.synced_data).substring(0, 50) + '...'}
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Eye className="w-4 h-4 text-[#39FF14]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'webhook-logs' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Webhook Execution Logs</h2>
            <button onClick={fetchWebhookLogs} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />Refresh
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Result</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {webhookLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-gray-300 text-sm">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-white font-medium">{log.event_type}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs font-medium">
                        {log.request_method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${log.response_status < 300 ? 'text-green-400' : log.response_status < 400 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {log.response_status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Eye className="w-4 h-4 text-[#39FF14]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'api-keys' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">API Keys</h2>
            <button onClick={() => setShowGenerateKeyModal(true)} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Generate Key
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold">{key.key_name}</h3>
                    <p className="text-gray-400 text-sm">{key.key_description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(key.status)}`}>
                    {key.status}
                  </span>
                </div>

                <div className="bg-gray-900 p-3 rounded mb-3">
                  <div className="text-gray-400 text-xs mb-1">API Key</div>
                  <div className="text-white font-mono text-sm">{key.api_key_prefix}••••••••••••••••</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <div className="text-gray-400">Total Requests</div>
                    <div className="text-white font-bold">{key.total_requests.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Created</div>
                    <div className="text-gray-300">{new Date(key.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 border-t border-gray-700 pt-3">
                  <button className="p-2 hover:bg-gray-700 rounded">
                    <Eye className="w-4 h-4 text-[#39FF14]" />
                  </button>
                  <button onClick={() => deleteItem('api_keys', key.id, fetchAPIKeys)} className="p-2 hover:bg-gray-700 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'workflows' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Integration Workflows</h2>
            <button onClick={() => setShowCreateWorkflowModal(true)} className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Workflow
            </button>
          </div>

          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Workflow className="w-5 h-5 text-[#39FF14]" />
                      <h3 className="text-white font-bold">{workflow.workflow_name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(workflow.status)}`}>
                        {workflow.status}
                      </span>
                      <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs font-medium uppercase">
                        {workflow.trigger_type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{workflow.workflow_description}</p>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Total Executions</div>
                        <div className="text-[#39FF14] font-bold">{workflow.total_executions}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Success</div>
                        <div className="text-green-400 font-bold">{workflow.success_count}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Success Rate</div>
                        <div className="text-[#39FF14] font-bold">{getSyncSuccessRate(workflow.total_executions, workflow.success_count)}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => toggleActive('integration_workflows', workflow.id, workflow.is_active, fetchWorkflows)} className="p-2 hover:bg-gray-700 rounded">
                      {workflow.is_active ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                    </button>
                    <button onClick={() => openEditWorkflow(workflow)} className="p-2 hover:bg-gray-700 rounded">
                      <Edit className="w-4 h-4 text-[#39FF14]" />
                    </button>
                    <button onClick={() => deleteItem('integration_workflows', workflow.id, fetchWorkflows)} className="p-2 hover:bg-gray-700 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddIntegrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add CRM Integration</h3>
              <button onClick={() => setShowAddIntegrationModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddIntegration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Integration Name</label>
                <input name="integration_name" type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="My CRM Integration" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CRM Provider</label>
                <select name="crm_provider" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option value="">Select Provider</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="zendesk">Zendesk</option>
                  <option value="dynamics365">Microsoft Dynamics 365</option>
                  <option value="zoho">Zoho CRM</option>
                  <option value="pipedrive">Pipedrive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Authentication Type</label>
                <select name="auth_type" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option value="oauth2">OAuth 2.0</option>
                  <option value="api_key">API Key</option>
                  <option value="basic">Basic Auth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API Endpoint</label>
                <input name="api_endpoint" type="url" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="https://api.example.com" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddIntegrationModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]">Add Integration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {showAddWebhookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add Webhook</h3>
              <button onClick={() => setShowAddWebhookModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddWebhook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Webhook Name</label>
                <input name="webhook_name" type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="My Webhook" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea name="webhook_description" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" rows={3} placeholder="Webhook description"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Endpoint URL</label>
                <input name="endpoint_url" type="url" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="https://api.example.com/webhook" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">HTTP Method</label>
                <select name="http_method" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="GET">GET</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddWebhookModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]">Add Webhook</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Key Modal */}
      {showGenerateKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Generate API Key</h3>
              <button onClick={() => { setShowGenerateKeyModal(false); setNewKeyGenerated(''); }} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {!newKeyGenerated ? (
              <form onSubmit={handleGenerateKey} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Key Name</label>
                  <input name="key_name" type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="Production API Key" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea name="key_description" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" rows={3} placeholder="Key description"></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setShowGenerateKeyModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]">Generate Key</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-green-400 font-medium mb-2">API Key Generated Successfully!</div>
                  <div className="text-sm text-gray-300 mb-4">Make sure to copy your API key now. You won't be able to see it again!</div>
                  <div className="bg-gray-900 p-3 rounded-lg font-mono text-sm text-white break-all mb-3">
                    {newKeyGenerated}
                  </div>
                  <button
                    onClick={() => copyToClipboard(newKeyGenerated)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]"
                  >
                    {keyCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {keyCopied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
                <button
                  onClick={() => { setShowGenerateKeyModal(false); setNewKeyGenerated(''); }}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateWorkflowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Create Workflow</h3>
              <button onClick={() => setShowCreateWorkflowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Workflow Name</label>
                <input name="workflow_name" type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="My Workflow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea name="workflow_description" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" rows={3} placeholder="Workflow description"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trigger Type</label>
                <select name="trigger_type" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option value="">Select Trigger</option>
                  <option value="call_completed">Call Completed</option>
                  <option value="call_missed">Call Missed</option>
                  <option value="sms_received">SMS Received</option>
                  <option value="contact_created">Contact Created</option>
                  <option value="contact_updated">Contact Updated</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowCreateWorkflowModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]">Create Workflow</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Integration Modal */}
      {showEditIntegrationModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Edit CRM Integration</h2>
              <button onClick={() => { setShowEditIntegrationModal(false); setSelectedIntegration(null); }} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditIntegration} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Integration Name</label>
                <input type="text" name="integration_name" required defaultValue={selectedIntegration.integration_name} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CRM Provider</label>
                <select name="crm_provider" required defaultValue={selectedIntegration.crm_provider} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option value="">Select Provider</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="zoho">Zoho CRM</option>
                  <option value="pipedrive">Pipedrive</option>
                  <option value="dynamics">Microsoft Dynamics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Authentication Type</label>
                <select name="auth_type" required defaultValue={selectedIntegration.auth_type} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option value="">Select Auth Type</option>
                  <option value="oauth2">OAuth 2.0</option>
                  <option value="api_key">API Key</option>
                  <option value="basic">Basic Auth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API Endpoint</label>
                <input type="url" name="api_endpoint" required defaultValue={selectedIntegration.api_endpoint} placeholder="https://api.example.com/v1" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => { setShowEditIntegrationModal(false); setSelectedIntegration(null); }} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]">Update Integration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Webhook Modal */}
      {showEditWebhookModal && selectedWebhook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Edit Webhook Configuration</h2>
              <button onClick={() => { setShowEditWebhookModal(false); setSelectedWebhook(null); }} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditWebhook} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Webhook Name</label>
                <input type="text" name="webhook_name" required defaultValue={selectedWebhook.webhook_name} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea name="webhook_description" required defaultValue={selectedWebhook.webhook_description} rows={3} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Endpoint URL</label>
                <input type="url" name="endpoint_url" required defaultValue={selectedWebhook.endpoint_url} placeholder="https://api.example.com/webhook" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">HTTP Method</label>
                <select name="http_method" required defaultValue={selectedWebhook.http_method} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => { setShowEditWebhookModal(false); setSelectedWebhook(null); }} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]">Update Webhook</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Workflow Modal */}
      {showEditWorkflowModal && selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Edit Integration Workflow</h2>
              <button onClick={() => { setShowEditWorkflowModal(false); setSelectedWorkflow(null); }} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditWorkflow} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Workflow Name</label>
                <input type="text" name="workflow_name" required defaultValue={selectedWorkflow.workflow_name} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea name="workflow_description" required defaultValue={selectedWorkflow.workflow_description} rows={3} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trigger Type</label>
                <select name="trigger_type" required defaultValue={selectedWorkflow.trigger_type} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                  <option value="">Select Trigger</option>
                  <option value="call_completed">Call Completed</option>
                  <option value="call_missed">Call Missed</option>
                  <option value="sms_received">SMS Received</option>
                  <option value="contact_created">Contact Created</option>
                  <option value="contact_updated">Contact Updated</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => { setShowEditWorkflowModal(false); setSelectedWorkflow(null); }} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]">Update Workflow</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
