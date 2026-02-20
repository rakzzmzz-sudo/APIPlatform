import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Send, Upload, Users, Calendar, Save, X, Plus, Building2, Phone,
  CheckCircle, AlertCircle, Clock, FileText, Smartphone, Battery, Signal, Settings,
  Pause, Play, Edit, Trash2, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import WhatsAppConfiguration from '../Settings/WhatsAppConfiguration';

interface Campaign {
  id: string;
  user_id?: string;
  campaign_name: string;
  status: string;
  total_recipients: number;
  valid_numbers: number;
  invalid_numbers: number;
  duplicate_numbers: number;
  success_rate: number;
  sender_id?: string;
  message?: string;
  template_id?: string;
  media_url?: string;
  media_type?: string;
  recipient_source?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  phone_number: string;
  message: string;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
}

interface Template {
  id: string;
  name: string;
  body_content: string;
  category: string;
  language: string;
  description: string;
  header_type?: string;
  header_content?: string;
  footer_text?: string;
  buttons?: any[];
  variables: string[];
  use_case: string;
  is_default: boolean;
}

export default function BulkWhatsApp() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [activeView, setActiveView] = useState<'compose' | 'campaigns' | 'templates' | 'configuration'>('compose');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'paused'>('all');

  const [campaignName, setCampaignName] = useState('');
  const [messageType, setMessageType] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [recipientMode, setRecipientMode] = useState<'paste' | 'upload' | 'phonebook'>('paste');
  const [pastedNumbers, setPastedNumbers] = useState('');
  const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'document' | 'none'>('none');
  const [mediaInputMode, setMediaInputMode] = useState<'url' | 'upload'>('url');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [whatsappNumbers, setWhatsappNumbers] = useState<any[]>([]);
  const [whatsappConfigured, setWhatsappConfigured] = useState(false);
  const [stats, setStats] = useState({
    totalSent: 0,
    delivered: 0,
    pending: 0,
    failed: 0
  });

  const [numberValidation, setNumberValidation] = useState({
    valid: 0,
    duplicates: 0,
    invalid: 0
  });

  const [loading, setLoading] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'marketing',
    description: '',
    body_content: '',
    language: 'en_US',
    header_type: 'none',
    header_content: '',
    footer_text: '',
    buttons: [] as { text: string, type: 'PHONE_NUMBER' | 'URL' | 'QUICK_REPLY', value?: string }[],
    use_case: '',
    is_default: false
  });
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [campaignMessages, setCampaignMessages] = useState<Record<string, Message[]>>({});
  const [loadingMessages, setLoadingMessages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsMounted(true);
    // Load data regardless of user state for development resilience
    Promise.all([
      loadCampaigns(),
      loadTemplates(),
      loadWhatsAppNumbers()
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      loadCampaigns();
    }
  }, [statusFilter]);

  useEffect(() => {
    if (pastedNumbers) {
      validateNumbers(pastedNumbers);
    } else {
      setNumberValidation({ valid: 0, duplicates: 0, invalid: 0 });
    }
  }, [pastedNumbers]);

  const loadCampaigns = async () => {
    let query = db
      .from('whatsapp_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setCampaigns(data);
    }
  };

  const loadCampaignMessages = async (campaignId: string) => {
    setLoadingMessages(prev => ({ ...prev, [campaignId]: true }));

    const { data, error } = await db
      .from('whatsapp_messages')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      setCampaignMessages(prev => ({ ...prev, [campaignId]: data }));
    }

    setLoadingMessages(prev => ({ ...prev, [campaignId]: false }));
  };

  const toggleCampaignExpand = async (campaignId: string) => {
    if (expandedCampaign === campaignId) {
      setExpandedCampaign(null);
    } else {
      setExpandedCampaign(campaignId);
      if (!campaignMessages[campaignId]) {
        await loadCampaignMessages(campaignId);
      }
    }
  };

  const loadTemplates = async () => {
    const { data, error } = await db
      .from('whatsapp_templates')
      .select('*')
      .order('name');

    if (!error && data) {
      const parsedData = data.map((t: any) => {
        let vars = t.variables;
        if (typeof vars === 'string' && vars) {
          try {
            if (vars.startsWith('[') || vars.startsWith('{')) {
              vars = JSON.parse(vars);
            } else {
              vars = vars.split(',').map((v: string) => v.trim());
            }
          } catch (e) {
            console.error('Error parsing WhatsApp template variables:', e);
            vars = vars.split(',').map((v: string) => v.trim());
          }
        } else if (!vars) {
          vars = [];
        }

        let buttons = t.buttons;
        if (typeof buttons === 'string' && buttons) {
          try {
            buttons = JSON.parse(buttons);
          } catch (e) {
            console.error('Error parsing WhatsApp template buttons:', e);
            buttons = [];
          }
        } else if (!buttons) {
          buttons = [];
        }

        return { 
          ...t, 
          variables: Array.isArray(vars) ? vars : [vars],
          buttons: Array.isArray(buttons) ? buttons : []
        };
      });
      setTemplates(parsedData);
    }
  };

  // Compute stats reactively from loaded campaigns
  useEffect(() => {
    if (campaigns.length > 0) {
      const totalSent = campaigns.reduce((acc: number, c: any) => acc + (c.valid_numbers || 0), 0);
      const delivered = campaigns.filter((c: any) => c.status === 'completed' || c.status === 'in_progress').reduce((acc: number, c: any) => acc + (c.valid_numbers || 0), 0); 
      // Note: For WhatsApp, delivered usually comes from messages, but for aggregate we use valid_numbers
      const pending = campaigns.filter((c: any) => c.status === 'scheduled').reduce((acc: number, c: any) => acc + (c.valid_numbers || 0), 0);

      setStats({
        totalSent,
        delivered,
        pending,
        failed: totalSent - delivered - pending
      });
    } else {
      setStats({ totalSent: 0, delivered: 0, pending: 0, failed: 0 });
    }
  }, [campaigns]);

  const loadWhatsAppNumbers = async () => {
    const { data: configData } = await db
      .from('tenant_whatsapp_configs')
      .select('id, is_verified')
      .maybeSingle();

    if (configData && configData.is_verified) {
      setWhatsappConfigured(true);

      const { data: numbersData } = await db
        .from('tenant_whatsapp_numbers')
        .select('*')
        .eq('whatsapp_config_id', configData.id)
        .eq('is_active', true);

      if (numbersData) {
        setWhatsappNumbers(numbersData);
        if (numbersData.length > 0) {
          setSenderNumber(numbersData[0].phone_number);
        }
      }
    } else {
      setWhatsappConfigured(false);
    }
  };

  const validateNumbers = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const numbers = lines.map(line => line.trim());

    const phoneRegex = /^[\d\s+()-]{10,}$/;
    const validNums = numbers.filter(n => phoneRegex.test(n));
    const unique = new Set(validNums);
    const duplicates = validNums.length - unique.size;
    const invalid = numbers.length - validNums.length;

    setNumberValidation({
      valid: unique.size,
      duplicates,
      invalid
    });
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.body_content);
      if (template.header_type === 'image' && template.header_content) {
        setMediaUrl(template.header_content);
        setMediaType('image');
      } else {
        setMediaUrl('');
        setMediaType('none');
      }
    }
  };

  const handleSendCampaign = async () => {
    if (!campaignName || !messageType || !senderNumber || !message || !user) {
      alert('Please fill in all required fields');
      return;
    }

    if (numberValidation.valid === 0) {
      alert('Please add valid phone numbers');
      return;
    }

    try {
      const { data: campaign, error } = await db
        .from('whatsapp_campaigns')
        .insert({
          user_id: user.id,
          campaign_name: campaignName,
          message_type: messageType,
          sender_number: senderNumber,
          message,
          template_id: selectedTemplate || null,
          media_url: mediaUrl || null,
          media_type: mediaType !== 'none' ? mediaType : null,
          recipient_source: recipientMode,
          total_recipients: pastedNumbers.split('\n').filter(l => l.trim()).length,
          valid_numbers: numberValidation.valid,
          invalid_numbers: numberValidation.invalid,
          duplicate_numbers: numberValidation.duplicates,
          status: sendMode === 'now' ? 'in_progress' : 'scheduled',
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      alert('Campaign created successfully!');
      resetForm();
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    }
  };

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      const { error } = await db
        .from('whatsapp_campaigns')
        .update({ status: 'paused' })
        .eq('id', campaignId);

      if (error) throw error;

      alert('Campaign paused successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Error pausing campaign:', error);
      alert('Failed to pause campaign');
    }
  };

  const handleResumeCampaign = async (campaignId: string) => {
    try {
      const { error } = await db
        .from('whatsapp_campaigns')
        .update({ status: 'in_progress' })
        .eq('id', campaignId);

      if (error) throw error;

      alert('Campaign resumed successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Error resuming campaign:', error);
      alert('Failed to resume campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      const { error } = await db
        .from('whatsapp_campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      alert('Campaign deleted successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleSaveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.body_content || !user) {
      alert('Please fill in required fields (Name and Body Content)');
      return;
    }

    try {
      const variableRegex = /{{([^}]+)}}/g;
      const variables: string[] = [];
      let match;
      while ((match = variableRegex.exec(newTemplate.body_content)) !== null) {
        variables.push(match[1].trim());
      }

      const { error } = await db
        .from('whatsapp_templates')
        .insert({
          name: newTemplate.name,
          category: newTemplate.category,
          description: newTemplate.description,
          body_content: newTemplate.body_content,
          language: newTemplate.language,
          header_type: newTemplate.header_type,
          header_content: newTemplate.header_content,
          footer_text: newTemplate.footer_text,
          buttons: JSON.stringify(newTemplate.buttons),
          variables: JSON.stringify(variables),
          use_case: newTemplate.use_case,
          is_default: newTemplate.is_default
        });

      if (error) throw error;

      alert('Template saved successfully!');
      setShowTemplateModal(false);
      setNewTemplate({
        name: '',
        category: 'marketing',
        description: '',
        body_content: '',
        language: 'en_US',
        header_type: 'none',
        header_content: '',
        footer_text: '',
        buttons: [],
        use_case: '',
        is_default: false
      });
      loadTemplates();
    } catch (error) {
      console.error('Error saving WhatsApp template:', error);
      alert('Failed to save template');
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'read': return 'text-[#39FF14]';
      case 'delivered': return 'text-[#39FF14]';
      case 'sent': return 'text-[#39FF14]';
      case 'pending': return 'text-[#39FF14]';
      case 'failed': return 'text-[#39FF14]';
      default: return 'text-slate-400';
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const resetForm = () => {
    setCampaignName('');
    setMessageType('');
    setSenderNumber('');
    setSelectedTemplate('');
    setMessage('');
    setPastedNumbers('');
    setRecipientMode('paste');
    setPastedNumbers('');
    setSendMode('now');
    setMediaUrl('');
    setMediaType('none');
    setMediaInputMode('url');
    setUploadedFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setMediaUrl(base64String);
      setMediaType('image');
      setUploadedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = () => {
    setMediaUrl('');
    setMediaType('none');
    setUploadedFile(null);
  };

  const getCharCount = () => message.length;
  const getSMSCount = () => Math.ceil(message.length / 160) || 1;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'in_progress': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'scheduled': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'failed': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isMounted) return null;

  return (
    <div className="flex-1 overflow-auto bg-[#012419]" suppressHydrationWarning>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Sent</p>
                <p className="text-3xl font-bold text-white">{stats.totalSent.toLocaleString()}</p>
              </div>
              <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                <Send className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">All time messages</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Delivered</p>
                <p className="text-3xl font-bold text-white">{stats.delivered.toLocaleString()}</p>
              </div>
              <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <p className="text-[#39FF14] text-sm">{stats.totalSent ? Math.round((stats.delivered / stats.totalSent) * 100) : 0}% delivery rate</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-white">{stats.pending.toLocaleString()}</p>
              </div>
              <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">In queue</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Failed</p>
                <p className="text-3xl font-bold text-white">{stats.failed.toLocaleString()}</p>
              </div>
              <div className="bg-[#39FF14]/20 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-[#39FF14]" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">Requires attention</p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 mb-8 inline-flex">
          <button
            onClick={() => setActiveView('compose')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeView === 'compose'
                ? 'bg-[#39FF14] text-black font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveView('campaigns')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeView === 'campaigns'
                ? 'bg-[#39FF14] text-black font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveView('templates')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeView === 'templates'
                ? 'bg-[#39FF14] text-black font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveView('configuration')}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeView === 'configuration'
                ? 'bg-[#39FF14] text-black font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configuration
          </button>
        </div>

        {activeView === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {!loading && !whatsappConfigured && (
                <div className="bg-[#39FF14]/5 border border-[#39FF14]/30 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-[#39FF14] flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-[#39FF14] font-semibold text-lg mb-2">WhatsApp API Not Configured</h3>
                      <p className="text-slate-300 mb-4">
                        You need to configure your WhatsApp Business Account before sending messages.
                        Connect your Meta Business Account to start sending WhatsApp API campaigns.
                      </p>
                      <button
                        onClick={() => setActiveView('configuration')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg transition-all font-semibold"
                      >
                        <Settings className="w-4 h-4" />
                        Configure WhatsApp API Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Compose Whatsapp API Message</h2>
                  <button className="text-[#39FF14] hover:text-green-300 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Templates
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Campaign Name <span className="text-[#39FF14]">*</span>
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Enter campaign name"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Message Type <span className="text-[#39FF14]">*</span>
                      </label>
                      <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      >
                        <option value="">Select Message Type</option>
                        <option value="text">Text Message</option>
                        <option value="media">Media Message</option>
                        <option value="template">Template Message</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Sender Number <span className="text-[#39FF14]">*</span>
                      </label>
                      <select
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                        disabled={!whatsappConfigured || whatsappNumbers.length === 0}
                      >
                        <option value="">
                          {whatsappNumbers.length === 0
                            ? 'No numbers available - Configure WhatsApp'
                            : 'Select Sender Number'}
                        </option>
                        {whatsappNumbers.map((number) => (
                          <option key={number.id} value={number.phone_number}>
                            {number.display_phone_number || number.phone_number}
                            {number.verified_name && ` - ${number.verified_name}`}
                          </option>
                        ))}
                      </select>
                      {!loading && !whatsappConfigured && (
                        <p className="text-xs text-slate-400 mt-1">
                          Configure WhatsApp to see available numbers
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Message Template
                      </label>
                      <button
                        onClick={() => setActiveView('templates')}
                        className="text-[#39FF14] hover:text-slate-300 text-xs flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Browse Templates
                      </button>
                    </div>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="">Select Template</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Message <span className="text-[#39FF14]">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your Message"
                      rows={6}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Limit up to: 2400 | Characters: {getCharCount()} | Total SMS: {getSMSCount()}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Add Media (Image)
                      </label>
                      {mediaUrl && (
                        <button 
                          onClick={handleRemoveMedia}
                          className="text-[#39FF14] hover:text-red-300 text-xs flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Remove Media
                        </button>
                      )}
                    </div>
                    
                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setMediaInputMode('url')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          mediaInputMode === 'url'
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        URL
                      </button>
                      <button
                        onClick={() => setMediaInputMode('upload')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          mediaInputMode === 'upload'
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Upload File
                      </button>
                    </div>

                    {mediaInputMode === 'url' ? (
                      <>
                        <input
                          type="text"
                          value={uploadedFile ? '' : mediaUrl}
                          onChange={(e) => {
                            setMediaUrl(e.target.value);
                            if (e.target.value) setMediaType('image');
                            else setMediaType('none');
                            setUploadedFile(null);
                          }}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                        />
                        <p className="text-[10px] text-slate-500 mt-1 italic">
                          Provide a direct link to an image (JPEG, PNG, GIF, WebP)
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="whatsapp-image-upload"
                          />
                          <label htmlFor="whatsapp-image-upload" className="cursor-pointer">
                            {uploadedFile ? (
                              <div className="space-y-2">
                                <CheckCircle className="w-10 h-10 text-[#39FF14] mx-auto" />
                                <p className="text-white font-medium">{uploadedFile.name}</p>
                                <p className="text-slate-400 text-xs">
                                  {(uploadedFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="w-10 h-10 text-slate-500 mx-auto" />
                                <p className="text-slate-400">Click to select an image</p>
                                <p className="text-slate-500 text-xs">JPEG, PNG, GIF, WebP (Max 5MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                        {uploadedFile && mediaUrl && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-slate-700">
                            <img src={mediaUrl} alt="Preview" className="w-full h-32 object-cover" />
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Send messages to <span className="text-[#39FF14]">*</span>
                    </label>
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={recipientMode === 'paste'}
                          onChange={() => setRecipientMode('paste')}
                          className="w-4 h-4 text-[#39FF14]"
                        />
                        <span className="text-slate-300">Paste Numbers</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={recipientMode === 'upload'}
                          onChange={() => setRecipientMode('upload')}
                          className="w-4 h-4 text-[#39FF14]"
                        />
                        <span className="text-slate-300">Upload XLS or CSV</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={recipientMode === 'phonebook'}
                          onChange={() => setRecipientMode('phonebook')}
                          className="w-4 h-4 text-[#39FF14]"
                        />
                        <span className="text-slate-300">Choose From Phonebook</span>
                      </label>
                    </div>

                    {recipientMode === 'paste' && (
                      <>
                        <textarea
                          value={pastedNumbers}
                          onChange={(e) => setPastedNumbers(e.target.value)}
                          placeholder="Paste your numbers here"
                          rows={8}
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14]"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-500">
                            Limit up to: 150000 | Count: {pastedNumbers.split('\n').filter(l => l.trim()).length}
                          </p>
                          <div className="flex gap-4 text-xs">
                            <span className="text-[#39FF14]">● Valid Numbers: {numberValidation.valid}</span>
                            <span className="text-[#39FF14]">● Duplicates: {numberValidation.duplicates}</span>
                            <span className="text-[#39FF14]">● Invalid Numbers: {numberValidation.invalid}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {recipientMode === 'upload' && (
                      <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400 mb-2">Drop your XLS or CSV file here</p>
                        <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg">
                          Choose File
                        </button>
                      </div>
                    )}

                    {recipientMode === 'phonebook' && (
                      <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]">
                        <option value="">Select Phonebook</option>
                        <option value="customers">Customers</option>
                        <option value="leads">Leads</option>
                        <option value="subscribers">Subscribers</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={sendMode === 'now'}
                          onChange={() => setSendMode('now')}
                          className="w-4 h-4 text-[#39FF14]"
                        />
                        <span className="text-slate-300">Send Now <span className="text-[#39FF14]">*</span></span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={sendMode === 'schedule'}
                          onChange={() => setSendMode('schedule')}
                          className="w-4 h-4 text-[#39FF14]"
                        />
                        <span className="text-slate-300">Schedule</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendCampaign}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      Send Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Mobile Preview
                </h3>

                <div className="bg-slate-900 rounded-[2.5rem] p-4 border-4 border-slate-800 shadow-2xl">
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    <div className="bg-[#075e54] px-4 py-3 flex items-center justify-between border-b border-[#054d44]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <Users className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{senderNumber || 'Business Name'}</p>
                          <p className="text-[10px] text-green-200">online</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-white/70" />
                        <Signal className="w-3 h-3 text-white/70" />
                      </div>
                    </div>

                    <div className="h-[380px] bg-[#e5ddd5] p-3 overflow-y-auto relative border-x border-slate-100">
                      {/* Pattern Overlay Placeholder */}
                      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                      
                      <div className="text-center mb-4 relative z-10">
                        <span className="text-[10px] bg-[#dcf8c6] px-2 py-1 rounded shadow-sm text-slate-600">
                          {isMounted ? getCurrentTime() : '--:--'}
                        </span>
                      </div>

                      <div className="flex justify-start mb-4 relative z-10">
                        <div className="max-w-[85%]">
                          <div className="bg-white text-slate-800 rounded-lg rounded-tl-none px-3 py-2 shadow-sm relative">
                            <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent"></div>
                            {mediaUrl && mediaType === 'image' && (
                              <div className="mb-2 -mx-3 -mt-2 rounded-t-lg overflow-hidden border-b border-slate-100">
                                <img src={mediaUrl} alt="Media preview" className="w-full h-40 object-cover" />
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message || 'Hello! Type your message...'}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <p className="text-[9px] text-slate-400">{isMounted ? getCurrentTime() : '--:--'}</p>
                              <div className="flex">
                                <CheckCircle className="w-2 h-2 text-[#39FF14]" />
                                <CheckCircle className="w-2 h-2 text-[#39FF14] -ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f0f0f0] p-3 flex items-center gap-2">
                      <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center gap-2 h-9">
                        <span className="text-xs text-slate-400">Type a message</span>
                      </div>
                      <button className="bg-[#075e54] text-white p-2.5 rounded-full shadow-lg">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Characters:</span>
                    <span className="text-white font-medium">{getCharCount()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">SMS Parts:</span>
                    <span className="text-white font-medium">{getSMSCount()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Recipients:</span>
                    <span className="text-white font-medium">{numberValidation.valid}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Campaigns</h3>
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map(campaign => (
                    <div key={campaign.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{campaign.campaign_name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                          {campaign.status === 'completed' ? 'Completed' : campaign.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Sent: {campaign.valid_numbers?.toLocaleString() || 0}</span>
                        <span>Delivered: {campaign.valid_numbers?.toLocaleString() || 0}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{new Date(campaign.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                {campaigns.length > 3 && (
                  <button
                    onClick={() => setActiveView('campaigns')}
                    className="w-full mt-3 text-[#39FF14] hover:text-green-300 text-sm py-2"
                  >
                    View All
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'campaigns' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Campaign History</h2>
              <button
                onClick={() => setActiveView('compose')}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                New Campaign
              </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-1 mb-6 inline-flex">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  statusFilter === 'all'
                    ? 'bg-[#39FF14] text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  statusFilter === 'draft'
                    ? 'bg-[#39FF14] text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  statusFilter === 'scheduled'
                    ? 'bg-[#39FF14] text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  statusFilter === 'in_progress'
                    ? 'bg-[#39FF14] text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('paused')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  statusFilter === 'paused'
                    ? 'bg-[#39FF14] text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Paused
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  statusFilter === 'completed'
                    ? 'bg-[#39FF14] text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed
              </button>
            </div>
            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No campaigns found</p>
                <p className="text-slate-500 text-sm mb-4">Create your first WhatsApp campaign to get started</p>
                <button
                  onClick={() => setActiveView('compose')}
                  className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Create Campaign
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map(campaign => {
                  const messages = campaignMessages[campaign.id] || [];
                  const isExpanded = expandedCampaign === campaign.id;
                  const isLoadingMessages = loadingMessages[campaign.id];

                  const messageStats = messages.reduce((acc, msg) => {
                    acc[msg.status] = (acc[msg.status] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);

                  return (
                    <div key={campaign.id} className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {campaign.media_url && campaign.media_type === 'image' && (
                                <div className="w-10 h-10 rounded border border-slate-700 overflow-hidden flex-shrink-0">
                                  <img src={campaign.media_url} alt="Thumb" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div>
                                <h3 className="text-xl font-semibold text-white">{campaign.campaign_name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                                    {campaign.status}
                                  </span>
                                  {campaign.media_url && (
                                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                      <Upload className="w-3 h-3" /> Media Attached
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm">{new Date(campaign.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {campaign.status === 'in_progress' && (
                              <button
                                onClick={() => handlePauseCampaign(campaign.id)}
                                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                title="Pause Campaign"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            {campaign.status === 'paused' && (
                              <button
                                onClick={() => handleResumeCampaign(campaign.id)}
                                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                title="Resume Campaign"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                              title="Delete Campaign"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleCampaignExpand(campaign.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  View Details
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Total Recipients</p>
                            <p className="text-white text-lg font-semibold">{campaign.total_recipients.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Valid Numbers</p>
                            <p className="text-[#39FF14] text-lg font-semibold">{campaign.valid_numbers.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Status</p>
                            <p className="text-white text-lg font-semibold capitalize">{campaign.status.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Success Rate</p>
                            <p className="text-white text-lg font-semibold">
                              {campaign.total_recipients > 0 ? Math.round((campaign.valid_numbers / campaign.total_recipients) * 100) : 0}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-700 bg-slate-800/30 p-6">
                          {isLoadingMessages ? (
                            <div className="text-center py-8">
                              <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-spin" />
                              <p className="text-slate-400">Loading message details...</p>
                            </div>
                          ) : messages.length === 0 ? (
                            <div className="text-center py-8">
                              <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                              <p className="text-slate-400">No messages found for this campaign</p>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">Campaign Message Preview</h4>
                              </div>
                              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6 max-w-lg">
                                {campaign.media_url && campaign.media_type === 'image' && (
                                  <div className="mb-3 rounded-lg overflow-hidden border border-slate-700">
                                    <img src={campaign.media_url} alt="Campaign Media" className="w-full h-48 object-cover" />
                                  </div>
                                )}
                                <div className="p-2">
                                  <p className="text-sm text-white whitespace-pre-line">{campaign.message || 'No message content'}</p>
                                  {campaign.template_id && (
                                    <p className="text-[10px] text-slate-500 mt-2 italic">Template ID: {campaign.template_id}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">Message Details</h4>
                                <div className="flex gap-4 text-sm">
                                  <span className="flex items-center gap-1 text-[#39FF14]">
                                    <CheckCircle className="w-4 h-4" />
                                    Read: {messageStats.read || 0}
                                  </span>
                                  <span className="flex items-center gap-1 text-[#39FF14]">
                                    <CheckCircle className="w-4 h-4" />
                                    Delivered: {messageStats.delivered || 0}
                                  </span>
                                  <span className="flex items-center gap-1 text-[#39FF14]">
                                    <Send className="w-4 h-4" />
                                    Sent: {messageStats.sent || 0}
                                  </span>
                                  <span className="flex items-center gap-1 text-[#39FF14]">
                                    <Clock className="w-4 h-4" />
                                    Pending: {messageStats.pending || 0}
                                  </span>
                                  <span className="flex items-center gap-1 text-[#39FF14]">
                                    <AlertCircle className="w-4 h-4" />
                                    Failed: {messageStats.failed || 0}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead className="bg-slate-800/50 border-b border-slate-700">
                                      <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Phone Number</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Sent At</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Delivered At</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Read At</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Error</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                      {messages.map(message => (
                                        <tr key={message.id} className="hover:bg-slate-800/30 transition-colors">
                                          <td className="px-4 py-3 text-sm text-white font-mono">{message.phone_number}</td>
                                          <td className="px-4 py-3">
                                            <div className={`flex items-center gap-2 text-sm font-medium ${getMessageStatusColor(message.status)}`}>
                                              {getMessageStatusIcon(message.status)}
                                              <span className="capitalize">{message.status}</span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 text-sm text-slate-300">
                                            {message.sent_at ? new Date(message.sent_at).toLocaleString() : '-'}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-slate-300">
                                            {message.delivered_at ? new Date(message.delivered_at).toLocaleString() : '-'}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-slate-300">
                                            {message.read_at ? new Date(message.read_at).toLocaleString() : '-'}
                                          </td>
                                          <td className="px-4 py-3 text-sm">
                                            {message.error_message ? (
                                              <div className="flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-[#39FF14] flex-shrink-0 mt-0.5" />
                                                <span className="text-[#39FF14] text-xs">{message.error_message}</span>
                                              </div>
                                            ) : (
                                              <span className="text-slate-500">-</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {messages.length === 100 && (
                                  <div className="bg-slate-800/30 border-t border-slate-700 px-4 py-3 text-center">
                                    <p className="text-slate-400 text-sm">Showing first 100 messages</p>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeView === 'configuration' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <WhatsAppConfiguration onConfigUpdate={() => {
              loadWhatsAppNumbers();
              setActiveView('compose');
            }} />
          </div>
        )}

        {activeView === 'templates' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">WhatsApp Message Templates</h2>
              <button 
                onClick={() => setShowTemplateModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Create Template
              </button>
            </div>
            {templates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No templates found</p>
                <p className="text-slate-500 text-sm">Create your first template to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <div key={template.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 hover:border-green-500/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-bold text-lg">{template.name}</h3>
                      {template.is_default && (
                        <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded-full border border-[#39FF14]/30">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        template.category === 'promotional' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        template.category === 'transactional' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        template.category === 'marketing' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        template.category === 'otp' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        template.category === 'reminder' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {template.category}
                      </span>
                      <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
                        {template.language}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{template.description}</p>
                    {template.header_content && template.header_type === 'image' && (
                      <div className="mb-3 rounded overflow-hidden">
                        <img src={template.header_content} alt={template.name} className="w-full h-32 object-cover" />
                      </div>
                    )}
                    {template.header_content && template.header_type === 'text' && (
                      <div className="bg-slate-800 rounded p-2 mb-2">
                        <p className="text-white text-sm font-semibold">{template.header_content}</p>
                      </div>
                    )}
                    <div className="bg-slate-800 rounded p-3 mb-2">
                      <p className="text-slate-300 text-xs line-clamp-4 whitespace-pre-line">{template.body_content}</p>
                    </div>
                    {template.footer_text && (
                      <div className="mb-3">
                        <p className="text-slate-500 text-xs italic">{template.footer_text}</p>
                      </div>
                    )}
                    {template.buttons && template.buttons.length > 0 && (
                      <div className="mb-3">
                        <p className="text-slate-500 text-xs mb-1">Action Buttons:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.buttons.map((button: any, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded border border-[#39FF14]/30">
                              {button.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {template.variables && template.variables.length > 0 && (
                      <div className="mb-3">
                        <p className="text-slate-500 text-xs mb-1">Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
                              {variable}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-slate-500 text-xs mb-4 italic">{template.use_case}</p>
                    <button
                      onClick={() => {
                        setActiveView('compose');
                        handleTemplateChange(template.id);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Template Creation Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                <div>
                  <h3 className="text-xl font-bold text-white">Create WhatsApp Template</h3>
                  <p className="text-slate-400 text-sm">Design your message template for automated responses</p>
                </div>
                <button 
                  onClick={() => setShowTemplateModal(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form Side */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Template Name*</label>
                        <input
                          type="text"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                          placeholder="e.g. welcome_message"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Category*</label>
                        <select
                          value={newTemplate.category}
                          onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        >
                          <option value="marketing">Marketing</option>
                          <option value="utility">Utility</option>
                          <option value="authentication">Authentication</option>
                          <option value="promotional">Promotional</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Language*</label>
                        <select
                          value={newTemplate.language}
                          onChange={(e) => setNewTemplate({...newTemplate, language: e.target.value})}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        >
                          <option value="en_US">English (US)</option>
                          <option value="ms_MY">Malay (Malaysia)</option>
                          <option value="zh_CN">Chinese (Simplified)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Header Type</label>
                        <select
                          value={newTemplate.header_type}
                          onChange={(e) => setNewTemplate({...newTemplate, header_type: e.target.value as any})}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        >
                          <option value="none">None</option>
                          <option value="text">Text</option>
                          <option value="image">Image URL</option>
                        </select>
                      </div>
                    </div>

                    {newTemplate.header_type !== 'none' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          {newTemplate.header_type === 'text' ? 'Header Text' : 'Image URL'}
                        </label>
                        <input
                          type="text"
                          value={newTemplate.header_content}
                          onChange={(e) => setNewTemplate({...newTemplate, header_content: e.target.value})}
                          placeholder={newTemplate.header_type === 'text' ? 'Enter header text' : 'https://example.com/image.jpg'}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Body Content*</label>
                      <textarea
                        value={newTemplate.body_content}
                        onChange={(e) => setNewTemplate({...newTemplate, body_content: e.target.value})}
                        placeholder="Hello {{name}}, welcome to our service!"
                        rows={5}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                      />
                      <p className="text-xs text-slate-500 mt-2">Use double curly braces for variables, e.g., {'{{name}}'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Footer Text (Optional)</label>
                      <input
                        type="text"
                        value={newTemplate.footer_text}
                        onChange={(e) => setNewTemplate({...newTemplate, footer_text: e.target.value})}
                        placeholder="Reply STOP to opt out"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-300">Buttons (Max 3)</label>
                        {newTemplate.buttons.length < 3 && (
                          <button 
                            onClick={() => setNewTemplate({
                              ...newTemplate, 
                              buttons: [...newTemplate.buttons, { text: '', type: 'QUICK_REPLY' }]
                            })}
                            className="text-xs text-[#39FF14] hover:text-green-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Button
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {newTemplate.buttons.map((btn, idx) => (
                          <div key={idx} className="flex gap-3 items-start bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={btn.text}
                                onChange={(e) => {
                                  const btns = [...newTemplate.buttons];
                                  btns[idx].text = e.target.value;
                                  setNewTemplate({...newTemplate, buttons: btns});
                                }}
                                placeholder="Button Text"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none"
                              />
                              <div className="flex gap-2">
                                <select
                                  value={btn.type}
                                  onChange={(e) => {
                                    const btns = [...newTemplate.buttons];
                                    btns[idx].type = e.target.value as any;
                                    setNewTemplate({...newTemplate, buttons: btns});
                                  }}
                                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                >
                                  <option value="QUICK_REPLY">Quick Reply</option>
                                  <option value="URL">Visit Website</option>
                                  <option value="PHONE_NUMBER">Call Number</option>
                                </select>
                                {btn.type !== 'QUICK_REPLY' && (
                                  <input
                                    type="text"
                                    value={btn.value || ''}
                                    onChange={(e) => {
                                      const btns = [...newTemplate.buttons];
                                      btns[idx].value = e.target.value;
                                      setNewTemplate({...newTemplate, buttons: btns});
                                    }}
                                    placeholder={btn.type === 'URL' ? 'https://...' : '+1...'}
                                    className="flex-[2] bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                  />
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={() => setNewTemplate({
                                ...newTemplate, 
                                buttons: newTemplate.buttons.filter((_, i) => i !== idx)
                              })}
                              className="text-[#39FF14] hover:text-red-300 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview Side */}
                  <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700 flex flex-col items-center justify-center">
                    <p className="text-slate-400 text-sm mb-6">WhatsApp Message Preview</p>
                    <div className="w-full max-w-[320px] bg-slate-900 rounded-[2.5rem] p-4 border-4 border-slate-800 shadow-2xl scale-90 lg:scale-100 origin-top">
                      <div className="bg-white rounded-[2rem] overflow-hidden min-h-[400px]">
                        <div className="bg-[#075e54] px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">Business Name</p>
                              <p className="text-[10px] text-green-200">online</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 space-y-0.5 bg-[#e5ddd5] min-h-[340px]">
                          <div className="max-w-[85%] bg-white rounded-lg rounded-tl-none shadow-sm overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                            {newTemplate.header_type === 'image' && newTemplate.header_content && (
                              <div className="w-full h-32 overflow-hidden bg-slate-100">
                                <img src={newTemplate.header_content} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="p-2 space-y-1">
                              {newTemplate.header_type === 'text' && newTemplate.header_content && (
                                <p className="text-sm font-bold text-slate-900">{newTemplate.header_content}</p>
                              )}
                              <p className="text-sm text-slate-800 whitespace-pre-line">
                                {newTemplate.body_content || 'Body content preview will appear here...'}
                              </p>
                              {newTemplate.footer_text && (
                                <p className="text-[10px] text-slate-400">{newTemplate.footer_text}</p>
                              )}
                              <p className="text-[9px] text-slate-400 text-right mt-1">12:34 PM</p>
                            </div>

                            {newTemplate.buttons.length > 0 && (
                              <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/50">
                                {newTemplate.buttons.map((btn, i) => (
                                  <div key={i} className="py-2.5 px-3 flex items-center justify-center gap-2 text-[#00a884] text-sm font-medium">
                                    {btn.type === 'URL' && <Settings className="w-4 h-4 rotate-45" />}
                                    {btn.type === 'PHONE_NUMBER' && <Phone className="w-4 h-4" />}
                                    {btn.text || 'Button text'}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-bold"
                >
                  <Save className="w-5 h-5" />
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
