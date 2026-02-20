import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, Plus, Trash2, Check, X, AlertCircle, Loader, Copy, Eye, EyeOff, Building2, Phone, CheckCircle, XCircle, MessageSquare, AlertTriangle, Smartphone, Shield } from 'lucide-react';

type WhatsAppConfig = {
  id: string;
  tenant_id: string;
  business_account_id: string;
  access_token: string;
  webhook_url: string | null;
  webhook_token: string | null;
  is_verified: boolean;
  verified_at: string | null;
  config_data: any;
};

type WhatsAppNumber = {
  id: string;
  tenant_id: string;
  whatsapp_config_id: string;
  phone_number: string;
  display_phone_number: string | null;
  verified_name: string | null;
  code_verification_status: string;
  quality_rating: string;
  is_active: boolean;
  channel_name: string | null;
  phone_number_id: string | null;
};

type SampleConfig = {
  id: string;
  business_account_id: string;
  business_name: string;
  industry: string;
  description: string;
  is_verified: boolean;
  config_data: any;
  phone_numbers: any[];
};

interface WhatsappAPIConfigurationProps {
  onConfigUpdate?: () => void;
}

export default function WhatsappAPIConfiguration({ onConfigUpdate }: WhatsappAPIConfigurationProps = {}) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-config' | 'samples'>('my-config');
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([]);
  const [sampleConfigs, setSampleConfigs] = useState<SampleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadConfiguration();
      loadSampleConfigs();
  }, []);

  const loadConfiguration = async () => {
    try {
      const { data: configData, error: configError } = await db
        .from('tenant_whatsapp_configs')
        .select('*')
        
        .maybeSingle();

      if (configError) throw configError;

      setConfig(configData);

      if (configData) {
        const { data: numbersData, error: numbersError } = await db
          .from('tenant_whatsapp_numbers')
          .select('*')
          .eq('whatsapp_config_id', configData.id)
          .order('created_at', { ascending: false });

        if (numbersError) throw numbersError;
        setNumbers(numbersData || []);
      }
    } catch (err: any) {
      console.error('Error loading Whatsapp API configuration:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleConfigs = async () => {
    try {
      const { data: sampleConfigsData, error: samplesError } = await db
        .from('sample_whatsapp_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (samplesError) throw samplesError;

      if (sampleConfigsData) {
        const configsWithNumbers = await Promise.all(
          sampleConfigsData.map(async (config: any) => {
            const configData = typeof config.config_data === 'string' 
              ? JSON.parse(config.config_data) 
              : config.config_data;

            const { data: numbersData } = await db
              .from('sample_whatsapp_numbers')
              .select('*')
              .eq('config_id', config.id)
              .limit(5);

            return {
              ...config,
              config_data: configData,
              phone_numbers: numbersData || []
            };
          })
        );

        setSampleConfigs(configsWithNumbers);
      }
    } catch (err: any) {
      console.error('Error loading sample configurations:', err);
    }
  };

  const handleDeleteConfig = async () => {
    if (!config || !confirm('Are you sure you want to delete this WhatsApp configuration? All associated numbers will be removed.')) {
      return;
    }

    try {
      const { error } = await db
        .from('tenant_whatsapp_configs')
        .delete()
        .eq('id', config.id);

      if (error) throw error;

      setConfig(null);
      setNumbers([]);
      setSuccess('WhatsApp configuration deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting configuration:', err);
      setError(err.message);
    }
  };

  const handleDeleteNumber = async (numberId: string) => {
    if (!confirm('Are you sure you want to remove this number?')) {
      return;
    }

    try {
      const { error } = await db
        .from('tenant_whatsapp_numbers')
        .delete()
        .eq('id', numberId);

      if (error) throw error;

      setNumbers(numbers.filter(n => n.id !== numberId));
      setSuccess('Number removed successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting number:', err);
      setError(err.message);
    }
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
          <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Business Configuration</h2>
          <p className="text-slate-400">
            Configure your WhatsApp Business Account to send and receive messages
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

      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('my-config')}
          className={`px-4 py-3 font-medium transition-all ${
            activeTab === 'my-config'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Configuration
        </button>
        <button
          onClick={() => setActiveTab('samples')}
          className={`px-4 py-3 font-medium transition-all ${
            activeTab === 'samples'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sample Configurations ({sampleConfigs.length})
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
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
                <CheckCircle className="w-5 h-5 text-brand-lime flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-300 text-sm">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

{activeTab === 'my-config' ? (
        config ? (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-[#39FF14]/20 to-[#32e012]/20 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-brand-lime" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">WhatsApp Business Account</h3>
                    <p className="text-slate-400 text-sm">Account ID: {config.business_account_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {config.is_verified ? (
                    <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                      <Check className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/30">
                      <AlertCircle className="w-4 h-4" />
                      Not Verified
                    </span>
                  )}
                  <button
                    onClick={handleDeleteConfig}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete configuration"
                  >
                                      <AlertTriangle className="w-5 h-5 text-brand-lime" />
                  </button>
                </div>
              </div>

              {config.webhook_url && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Webhook Endpoint
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={config.webhook_url}
                        readOnly
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(config.webhook_url!);
                          setSuccess('Webhook URL copied to clipboard');
                          setTimeout(() => setSuccess(null), 2000);
                        }}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                        title="Copy URL"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {config.webhook_token && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Webhook Token
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          value={config.webhook_token}
                          readOnly
                          className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(config.webhook_token!);
                            setSuccess('Token copied to clipboard');
                            setTimeout(() => setSuccess(null), 2000);
                          }}
                          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                          title="Copy token"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Connected Numbers</h3>
              </div>

              {numbers.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No phone numbers connected yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {numbers.map((number) => (
                    <div
                      key={number.id}
                      className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-medium">
                            {number.display_phone_number || number.phone_number}
                          </span>
                          {number.is_active && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium border border-green-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {number.verified_name && (
                            <div>
                              <span className="text-slate-500">Verified Name:</span>
                              <span className="text-slate-300 ml-2">{number.verified_name}</span>
                            </div>
                          )}
                          {number.channel_name && (
                            <div>
                              <span className="text-slate-500">Channel:</span>
                              <span className="text-slate-300 ml-2">{number.channel_name}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-500">Quality:</span>
                            <span className={`ml-2 ${
                              number.quality_rating === 'GREEN' ? 'text-green-400' :
                              number.quality_rating === 'YELLOW' ? 'text-yellow-400' :
                              number.quality_rating === 'RED' ? 'text-red-400' :
                              'text-slate-400'
                            }`}>
                              {number.quality_rating}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Status:</span>
                            <span className="text-slate-300 ml-2">{number.code_verification_status}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNumber(number.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all ml-4"
                        title="Remove number"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No WhatsApp Configuration</h3>
            <p className="text-slate-400 mb-6">
              Connect your WhatsApp Business Account to start sending messages
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black rounded-lg hover:from-[#32e012] hover:to-[#28b80f] transition-all"
            >
              Add Configuration
            </button>
          </div>
        )
      ) : (
        <div className="space-y-6">
          {sampleConfigs.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Sample Configurations</h3>
              <p className="text-slate-400">Sample configurations will appear here</p>
            </div>
          ) : (
            sampleConfigs.map((sample) => (
              <div key={sample.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-[#39FF14]/20 to-[#32e012]/20 rounded-lg">
                        <Smartphone className="w-6 h-6 text-brand-lime" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{sample.business_name}</h3>
                      <p className="text-slate-400 text-sm">{sample.industry}</p>
                    </div>
                  </div>
                  {sample.is_verified && (
                    <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                      <Check className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-slate-300 mb-4">{sample.description}</p>

                {sample.config_data && (
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    {sample.config_data.email && (
                      <div>
                        <span className="text-slate-500">Email:</span>
                        <span className="text-slate-300 ml-2">{sample.config_data.email}</span>
                      </div>
                    )}
                    {sample.config_data.phone && (
                      <div>
                        <span className="text-slate-500">Phone:</span>
                        <span className="text-slate-300 ml-2">{sample.config_data.phone}</span>
                      </div>
                    )}
                    {sample.config_data.website && (
                      <div className="col-span-2">
                        <span className="text-slate-500">Website:</span>
                        <span className="text-slate-300 ml-2">{sample.config_data.website}</span>
                      </div>
                    )}
                  </div>
                )}

                {sample.phone_numbers.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Connected Numbers ({sample.phone_numbers.length})
                    </h4>
                    <div className="space-y-2">
                      {sample.phone_numbers.map((phone: any) => (
                        <div
                          key={phone.id}
                          className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium">
                              {phone.display_phone_number || phone.phone_number}
                            </span>
                            {phone.is_active && (
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium border border-green-500/30">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            {phone.verified_name && (
                              <div>
                                <span className="text-slate-500">Name:</span>
                                <span className="text-slate-300 ml-2">{phone.verified_name}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-500">Quality:</span>
                              <span className={`ml-2 ${
                                phone.quality_rating === 'HIGH' ? 'text-green-400' :
                                phone.quality_rating === 'MEDIUM' ? 'text-yellow-400' :
                                phone.quality_rating === 'LOW' ? 'text-red-400' :
                                'text-slate-400'
                              }`}>
                                {phone.quality_rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showAddModal && (
        <AddConfigModal
          tenantId={user?.app_metadata?.tenant_id || user?.user_metadata?.tenant_id || ''}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadConfiguration();
            setSuccess('WhatsApp Business Account configured successfully');
            setTimeout(() => setSuccess(null), 3000);
            if (onConfigUpdate) {
              setTimeout(() => onConfigUpdate(), 500);
            }
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
    businessAccountId: '',
    accessToken: '',
  });
  const [verifying, setVerifying] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const handleVerify = async () => {
    if (!formData.businessAccountId || !formData.accessToken) {
      onError('Please fill in all required fields');
      return;
    }

    setVerifying(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-whatsapp-business`;
      const headers = {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          businessAccountId: formData.businessAccountId,
          accessToken: formData.accessToken,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        onError(result.error || 'Failed to verify WhatsApp Business Account');
        setVerifying(false);
        return;
      }

      const webhookUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/whatsapp-webhook`;
      const webhookToken = crypto.randomUUID();

      const { data: configData, error: configError } = await db
        .from('tenant_whatsapp_configs')
        .insert({
          tenant_id: tenantId,
          business_account_id: formData.businessAccountId,
          access_token: formData.accessToken,
          webhook_url: webhookUrl,
          webhook_token: webhookToken,
          is_verified: true,
          verified_at: new Date().toISOString(),
          config_data: result.account,
        })
        .select()
        .single();

      if (configError) throw configError;

      if (result.phoneNumbers && result.phoneNumbers.length > 0) {
        const numbersToInsert = result.phoneNumbers.map((phone: any) => ({
          tenant_id: tenantId,
          whatsapp_config_id: configData.id,
          phone_number: phone.displayPhoneNumber,
          display_phone_number: phone.displayPhoneNumber,
          verified_name: phone.verifiedName,
          code_verification_status: phone.codeVerificationStatus,
          quality_rating: phone.qualityRating,
          phone_number_id: phone.id,
          is_active: true,
        }));

        const { error: numbersError } = await db
          .from('tenant_whatsapp_numbers')
          .insert(numbersToInsert);

        if (numbersError) {
          console.error('Error inserting phone numbers:', numbersError);
        }
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error verifying WhatsApp account:', err);
      onError(err.message || 'An error occurred during verification');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-white mb-6">WhatsApp Business Account ID</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              WhatsApp Business Account ID*
            </label>
            <input
              type="text"
              required
              value={formData.businessAccountId}
              onChange={(e) => setFormData({ ...formData, businessAccountId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Access Token*
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                required
                value={formData.accessToken}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                className="w-full px-4 py-2 pr-10 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="EABC..."
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={verifying}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying || !formData.businessAccountId || !formData.accessToken}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
