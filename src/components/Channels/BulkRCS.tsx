import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Send, Upload, Users, Calendar, Save, X,
  CheckCircle, AlertCircle, Clock, FileText, Smartphone, Battery, Signal, Settings,
  Pause, Play, Edit, Trash2, Filter, ChevronDown, ChevronUp, Plus
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import RCSConfiguration from './RCSConfiguration';

interface Campaign {
  id: string;
  user_id?: string;
  campaign_name: string;
  message_type?: string;
  sender_id?: string;
  message?: string;
  template_id?: string;
  recipient_source?: string;
  status: string;
  total_recipients: number;
  valid_numbers: number;
  invalid_numbers: number;
  duplicate_numbers: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  name: string;
  message_content: string;
  category: string;
  description: string;
  media_url?: string;
  media_type?: string;
  buttons?: any[];
  variables: string[];
  use_case: string;
  is_default: boolean;
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

export default function BulkRCS() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [activeView, setActiveView] = useState<'compose' | 'campaigns' | 'templates' | 'configuration'>('compose');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'paused'>('all');

  const [campaignName, setCampaignName] = useState('');
  const [messageType, setMessageType] = useState('');
  const [senderId, setSenderId] = useState('');
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
    category: 'promotional',
    description: '',
    message_content: '',
    media_url: '',
    buttons: [] as { text: string, url: string, type: 'url' | 'call' | 'reply' }[],
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
      loadTemplates()
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCampaigns();
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
      .from('rcs_campaigns')
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
      .from('rcs_messages')
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
      .from('rcs_templates')
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
            console.error('Error parsing RCS template variables:', e);
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
            console.error('Error parsing RCS template buttons:', e);
            buttons = [];
          }
        } else if (!Array.isArray(buttons)) {
          buttons = [];
        }
        
        return { ...t, variables: Array.isArray(vars) ? vars : [vars], buttons };
      });
      setTemplates(parsedData);
    }
  };

  // Compute stats reactively from loaded campaigns
  useEffect(() => {
    if (campaigns.length > 0) {
      const totalSent = campaigns.reduce((acc: number, c: any) => acc + (c.valid_numbers || 0), 0);
      const delivered = campaigns.filter((c: any) => c.status === 'completed').reduce((acc: number, c: any) => acc + (c.valid_numbers || 0), 0);
      const pending = campaigns.filter((c: any) => c.status === 'in_progress').reduce((acc: number, c: any) => acc + (c.valid_numbers || 0), 0);

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

  const handleSaveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.message_content) {
      alert('Please fill in Template Name and Content');
      return;
    }

    // Extract variables from content {{var}}
    const variableRegex = /{{([^}]+)}}/g;
    const variables: string[] = [];
    let match;
    while ((match = variableRegex.exec(newTemplate.message_content)) !== null) {
      variables.push(match[1].trim());
    }

    try {
      const { error } = await db
        .from('rcs_templates')
        .insert({
          name: newTemplate.name,
          category: newTemplate.category,
          description: newTemplate.description,
          message_content: newTemplate.message_content,
          media_url: newTemplate.media_url,
          buttons: JSON.stringify(newTemplate.buttons),
          variables: JSON.stringify(variables),
          use_case: newTemplate.use_case,
          is_default: newTemplate.is_default
        });

      if (error) throw error;

      alert('Template created successfully!');
      setShowTemplateModal(false);
      setNewTemplate({
        name: '',
        category: 'promotional',
        description: '',
        message_content: '',
        media_url: '',
        buttons: [],
        use_case: '',
        is_default: false
      });
      loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template');
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
      setMessage(template.message_content);
      if (template.media_url) {
        setMediaUrl(template.media_url);
        setMediaType(template.media_type as any || 'image');
      } else {
        setMediaUrl('');
        setMediaType('none');
      }
    }
  };

  const handleSendCampaign = async () => {
    if (!campaignName || !messageType || !senderId || !message || !user) {
      alert('Please fill in all required fields');
      return;
    }

    if (numberValidation.valid === 0) {
      alert('Please add valid phone numbers');
      return;
    }

    try {
      const { data: campaign, error } = await db
        .from('rcs_campaigns')
        .insert({
          user_id: user.id,
          campaign_name: campaignName,
          message_type: messageType,
          sender_id: senderId,
          message,
          template_id: selectedTemplate || null,
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
        .from('rcs_campaigns')
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
        .from('rcs_campaigns')
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
        .from('rcs_campaigns')
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

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-[#39FF14]';
      case 'sent': return 'text-[#39FF14]';
      case 'pending': return 'text-[#39FF14]';
      case 'failed': return 'text-[#39FF14]';
      default: return 'text-slate-400';
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
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
    setSenderId('');
    setSelectedTemplate('');
    setMessage('');
    setPastedNumbers('');
    setRecipientMode('paste');
    setSendMode('now');
    setMediaUrl('');
    setMediaType('none');
    setMediaInputMode('url');
    setUploadedFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

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
                ? 'bg-[#39FF14] text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveView('campaigns')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeView === 'campaigns'
                ? 'bg-[#39FF14] text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveView('templates')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeView === 'templates'
                ? 'bg-[#39FF14] text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveView('configuration')}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeView === 'configuration'
                ? 'bg-[#39FF14] text-black'
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
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Compose RCS API Message</h2>
                  <button className="text-[#39FF14] hover:text-[#32e012] text-sm flex items-center gap-2">
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
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="">Select Message Type</option>
                        <option value="text">Text Message</option>
                        <option value="card">Rich Card</option>
                        <option value="carousel">Carousel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Sender ID <span className="text-[#39FF14]">*</span>
                      </label>
                      <select
                        value={senderId}
                        onChange={(e) => setSenderId(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="">Select Sender ID</option>
                        <option value="NRGDIC">NRGDIC</option>
                        <option value="MYBRAND">MYBRAND</option>
                        <option value="COMPANY">COMPANY</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Message Template
                      </label>
                      <button
                        onClick={() => setActiveView('templates')}
                        className="text-[#39FF14] hover:text-[#39FF14] text-xs flex items-center gap-1"
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
                          className="text-[#39FF14] hover:text-slate-300 text-xs flex items-center gap-1"
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
                            ? 'bg-[#39FF14] text-black'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        URL
                      </button>
                      <button
                        onClick={() => setMediaInputMode('upload')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          mediaInputMode === 'upload'
                            ? 'bg-[#39FF14] text-black'
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
                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-[#39FF14] transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="rcs-image-upload"
                          />
                          <label htmlFor="rcs-image-upload" className="cursor-pointer">
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
                        <button className="bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg">
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
                      className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
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
                    <div className="bg-[#39FF14]/20 px-4 py-3 flex items-center justify-between border-b border-[#39FF14]/30">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{senderId || 'Business Chat'}</p>
                          <p className="text-[10px] text-[#39FF14]/80">RCS Verified Account</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Signal className="w-3 h-3 text-white" />
                        <Battery className="w-5 h-3 text-white" />
                      </div>
                    </div>

                    <div className="h-[380px] bg-[#f0f2f5] p-4 overflow-y-auto">
                      <div className="text-center mb-4">
                        <span className="text-[10px] bg-white/80 px-2 py-1 rounded-full text-slate-500 shadow-sm border border-slate-100">
                          {isMounted ? getCurrentTime() : '--:--'}
                        </span>
                      </div>

                      <div className="flex justify-start mb-4">
                        <div className="max-w-[85%]">
                          {messageType === 'card' && (
                            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 mb-2">
                              {mediaUrl && mediaType === 'image' ? (
                                <div className="h-32 bg-slate-200 overflow-hidden">
                                  <img src={mediaUrl} alt="Rich card" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="h-32 bg-slate-200 flex items-center justify-center">
                                  <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                              )}
                              <div className="p-3">
                                <h4 className="text-sm font-bold text-slate-800 mb-1">Rich Card Title</h4>
                                <p className="text-xs text-slate-600 mb-2">{message || 'Rich card content preview...'}</p>
                                <button className="w-full py-2 bg-[#39FF14]/10 text-[#39FF14] rounded-lg text-xs font-semibold border border-[#39FF14]/20">
                                  Action Button
                                </button>
                              </div>
                            </div>
                          )}

                          {messageType !== 'card' && (
                            <div className="bg-white text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200">
                              {mediaUrl && mediaType === 'image' && (
                                <div className="mb-2 -mx-4 -mt-3 rounded-t-2xl overflow-hidden">
                                  <img src={mediaUrl} alt="Media preview" className="w-full h-32 object-cover" />
                                </div>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{message || 'Type your message...'}</p>
                              <p className="text-[10px] text-slate-400 text-right mt-1">{isMounted ? getCurrentTime() : '--:--'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-t border-slate-200 p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full px-4 py-2">
                          <span className="text-xs text-slate-400">RCS Message</span>
                        </div>
                        <button className="bg-[#39FF14] text-black p-2 rounded-full">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
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
                    className="w-full mt-3 text-[#39FF14] hover:text-[#32e012] text-sm py-2"
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
                <p className="text-slate-500 text-sm mb-4">Create your first RCS campaign to get started</p>
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
                              <h3 className="text-xl font-semibold text-white">{campaign.campaign_name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                                {campaign.status}
                              </span>
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
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
                                <h4 className="text-lg font-semibold text-white">Message Details</h4>
                                <div className="flex gap-4 text-sm">
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

        {activeView === 'templates' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">RCS Message Templates</h2>
              <button 
                onClick={() => setShowTemplateModal(true)}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2"
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
                  <div key={template.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 hover:border-[#39FF14]/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-bold text-lg">{template.name}</h3>
                      {template.is_default && (
                        <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded-full border border-[#39FF14]/30">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        template.category === 'promotional' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        template.category === 'transactional' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        template.category === 'marketing' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        template.category === 'reminder' ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {template.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{template.description}</p>
                    {template.media_url && (
                      <div className="mb-3 rounded overflow-hidden bg-slate-800 flex items-center justify-center min-h-[128px]">
                        <img 
                          src={template.media_url} 
                          alt={template.name} 
                          className="w-full h-32 object-cover" 
                          onError={(e) => {
                            e.currentTarget.parentElement!.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="bg-slate-800 rounded p-3 mb-3">
                      <p className="text-slate-300 text-xs line-clamp-3 font-mono">{template.message_content}</p>
                    </div>
                    {Array.isArray(template.buttons) && template.buttons.length > 0 && (
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
                      className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900">
                <div>
                  <h3 className="text-xl font-bold text-white">Create New RCS Template</h3>
                  <p className="text-slate-400 text-sm">Design your Rich Communication Services template</p>
                </div>
                <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body calling flex-1 to scroll content if needed */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Left Panel: Form */}
                <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-800 space-y-6">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Template Name <span className="text-[#39FF14]">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39FF14]"
                        placeholder="e.g. Order Confirmation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                      <select
                        value={newTemplate.category}
                        onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="promotional">Promotional</option>
                        <option value="transactional">Transactional</option>
                        <option value="otp">OTP</option>
                        <option value="alert">Alert</option>
                        <option value="reminder">Reminder</option>
                        <option value="survey">Survey</option>
                      </select>
                    </div>
                  </div>

                  {/* Use Case & Toggle */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                     <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Use Case / Tag</label>
                      <input
                        type="text"
                        value={newTemplate.use_case}
                        onChange={(e) => setNewTemplate({ ...newTemplate, use_case: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39FF14]"
                        placeholder="e.g. Retail, Banking"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <div 
                        onClick={() => setNewTemplate({ ...newTemplate, is_default: !newTemplate.is_default })}
                        className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${newTemplate.is_default ? 'bg-[#39FF14]' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newTemplate.is_default ? 'left-7' : 'left-1'}`} />
                      </div>
                      <span className="text-sm text-slate-300 cursor-pointer" onClick={() => setNewTemplate({ ...newTemplate, is_default: !newTemplate.is_default })}>
                        Set as Default
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <input
                      type="text"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="Brief description of when to use this template"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Media URL (Optional)</label>
                    <input
                      type="text"
                      value={newTemplate.media_url}
                      onChange={(e) => setNewTemplate({ ...newTemplate, media_url: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39FF14]"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="border-t border-slate-800 pt-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                       Message Content <span className="text-[#39FF14]">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={newTemplate.message_content}
                        onChange={(e) => setNewTemplate({ ...newTemplate, message_content: e.target.value })}
                        rows={6}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] font-mono text-sm"
                        placeholder="Hi {{name}}, your order {{order_id}} has been shipped..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
                        {newTemplate.message_content.length} chars
                      </div>
                    </div>
                    
                    {/* Variable Chips */}
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-2">Click to insert variable:</p>
                      <div className="flex flex-wrap gap-2">
                        {['name', 'date', 'time', 'amount', 'link', 'otp', 'id'].map(v => (
                          <button
                            key={v}
                            onClick={() => setNewTemplate({ ...newTemplate, message_content: newTemplate.message_content + ` {{${v}}}` })}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#39FF14] text-[#39FF14] text-xs rounded transition-colors"
                          >
                            {`{{${v}}}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-4">
                    <div className="flex items-center justify-between mb-4">
                       <label className="block text-sm font-medium text-slate-300">
                         Actions / Buttons
                       </label>
                       <button
                         onClick={() => setNewTemplate({
                           ...newTemplate,
                           buttons: [...newTemplate.buttons, { text: 'New Button', url: '', type: 'url' }]
                         })}
                         className="text-[#39FF14] hover:text-[#32e012] text-xs font-medium flex items-center gap-1"
                       >
                         <Plus className="w-3 h-3" />
                         Add Button
                       </button>
                    </div>
                    
                    <div className="space-y-3">
                      {newTemplate.buttons.map((btn, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                           <div className="flex gap-2 mb-2">
                             <input
                               type="text"
                               value={btn.text}
                               onChange={(e) => {
                                 const newButtons = [...newTemplate.buttons];
                                 newButtons[idx].text = e.target.value;
                                 setNewTemplate({ ...newTemplate, buttons: newButtons });
                               }}
                               className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#39FF14] outline-none"
                               placeholder="Button Text"
                             />
                             <select
                               value={btn.type}
                               onChange={(e) => {
                                 const newButtons = [...newTemplate.buttons];
                                 newButtons[idx].type = e.target.value as any;
                                 setNewTemplate({ ...newTemplate, buttons: newButtons });
                               }}
                               className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#39FF14] outline-none"
                             >
                               <option value="url">URL</option>
                               <option value="call">Call</option>
                               <option value="reply">Reply</option>
                             </select>
                             <button
                               onClick={() => {
                                 const newButtons = [...newTemplate.buttons];
                                 newButtons.splice(idx, 1);
                                 setNewTemplate({ ...newTemplate, buttons: newButtons });
                               }}
                               className="text-slate-500 hover:text-[#39FF14] p-1"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                           {btn.type !== 'reply' && (
                             <input
                               type="text"
                               value={btn.url}
                               onChange={(e) => {
                                 const newButtons = [...newTemplate.buttons];
                                 newButtons[idx].url = e.target.value;
                                 setNewTemplate({ ...newTemplate, buttons: newButtons });
                               }}
                               className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#39FF14] outline-none placeholder-slate-600"
                               placeholder={btn.type === 'call' ? '+1234567890' : 'https://example.com'}
                             />
                           )}
                        </div>
                      ))}
                      {newTemplate.buttons.length === 0 && (
                        <p className="text-slate-500 text-xs italic text-center py-2">No buttons added</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Preview */}
                <div className="w-1/2 bg-[#012419] p-8 flex flex-col items-center justify-center border-l border-slate-800">
                  <h4 className="text-slate-500 text-sm mb-4 uppercase tracking-wider font-semibold">Live Preview</h4>
                  
                  {/* Phone Mockup */}
                  <div className="w-[300px] h-[580px] bg-slate-900 border-4 border-slate-800 rounded-[3rem] p-4 relative shadow-2xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-10"></div>
                    <div className="h-full bg-[#012419] rounded-[2.2rem] overflow-hidden flex flex-col">
                      {/* Mobile Header */}
                      <div className="bg-slate-900 p-4 pt-8 flex items-center gap-3 border-b border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-[#39FF14] flex items-center justify-center text-black font-bold text-xs">
                          {newTemplate.category === 'promotional' ? 'BR' : 'CP'}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">BrandName</p>
                          <p className="text-slate-500 text-[10px]">Just now via RCS</p>
                        </div>
                      </div>
                      
                      {/* Message Bubble */}
                      <div className="flex-1 p-4 bg-[#012419]/50 overflow-y-auto">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 mb-2 max-w-[90%]">
                          {newTemplate.media_url ? (
                             <div className="h-32 bg-slate-200 flex items-center justify-center overflow-hidden">
                               <img src={newTemplate.media_url} alt="Media" className="w-full h-full object-cover" />
                             </div>
                          ) : (
                             <div className="h-24 bg-slate-100 flex items-center justify-center border-b border-slate-100">
                               <FileText className="w-8 h-8 text-slate-300" />
                             </div>
                          )}
                          <div className="p-3">
                            <h4 className="text-sm font-bold text-slate-800 mb-1">{newTemplate.name || 'Card Title'}</h4>
                            <p className="text-xs text-slate-600 mb-3 whitespace-pre-wrap leading-relaxed">
                              {newTemplate.message_content || "Your message preview will appear here..."}
                            </p>
                            
                            <div className="space-y-2">
                              {newTemplate.buttons.map((btn, idx) => (
                                <div key={idx} className="w-full py-2 bg-[#39FF14]/90 text-black rounded-lg text-xs font-semibold border border-[#39FF14]/20 text-center shadow-sm">
                                  {btn.text}
                                </div>
                              ))}
                              {newTemplate.buttons.length === 0 && (
                                <div className="w-full py-2 bg-slate-50 text-slate-400 rounded-lg text-xs font-semibold border border-slate-100 text-center">
                                  Action Button
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 text-[10px] ml-1 mt-1">Delivered • R</p>
                      </div>

                       {/* Mobile Footer input mock */}
                       <div className="p-3 bg-slate-900 border-t border-slate-800">
                          <div className="h-8 bg-slate-800 border border-slate-700 rounded-full w-full flex items-center px-3">
                            <span className="text-slate-600 text-xs">Chat with BrandName</span>
                          </div>
                       </div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs mt-6">Preview represents how the message might appear on a mobile device.</p>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
                 <div className="text-xs text-slate-500">
                    <p>Fields marked with <span className="text-[#39FF14]">*</span> are required.</p>
                 </div>
                 <div className="flex gap-3">
                  <button 
                    onClick={() => setShowTemplateModal(false)}
                    className="px-6 py-2.5 text-slate-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveTemplate}
                    className="bg-[#39FF14] hover:bg-[#32e012] text-black px-8 py-2.5 rounded-lg font-medium shadow-lg shadow-[#39FF14]/20 hover:shadow-[#39FF14]/30 transition-all"
                  >
                    Save Template
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeView === 'configuration' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <RCSConfiguration />
          </div>
        )}
      </div>
    </div>
  );
}
