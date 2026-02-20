import { useState, useEffect } from 'react';
import {
  Mail, Send, Users, Calendar, BarChart3, Settings, Plus, Search, Filter,
  TrendingUp, Eye, MousePointer, UserX, AlertCircle, CheckCircle, Clock,
  Edit, Trash2, Copy, Play, Pause, FileText, Database, Zap, Target,
  RefreshCw, Download, Upload, Tag, Star, Globe, Smartphone, Laptop,
  ChevronRight, X
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

export default function EmailCampaigns() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'contacts' | 'automation' | 'analytics' | 'providers'>('campaigns');

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [contactLists, setContactLists] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [automationSequences, setAutomationSequences] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [campaignAnalytics, setCampaignAnalytics] = useState<any[]>([]);
  const [sendingQuotas, setSendingQuotas] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showImportContactsModal, setShowImportContactsModal] = useState(false);
  const [showContactSettingsModal, setShowContactSettingsModal] = useState(false);
  const [showCreateSequenceModal, setShowCreateSequenceModal] = useState(false);
  const [showEditSequenceModal, setShowEditSequenceModal] = useState(false);
  const [showViewSequenceModal, setShowViewSequenceModal] = useState(false);
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [showConfigureProviderModal, setShowConfigureProviderModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [selectedSequence, setSelectedSequence] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    campaign_name: '',
    campaign_type: 'regular',
    template_id: '',
    subject_line: '',
    preview_text: '',
    from_email: '',
    from_name: '',
    reply_to_email: '',
    selected_lists: [] as string[],
    schedule_type: 'send_now',
    scheduled_at: '',
    ab_test_enabled: false,
    ab_subject_variants: ['', ''],
    tags: ''
  });

  const [newTemplate, setNewTemplate] = useState({
    template_name: '',
    template_category: 'general',
    subject_line: '',
    preview_text: '',
    html_content: '',
    plain_text_content: '',
    template_variables: '',
    thumbnail_url: '',
    is_responsive: true
  });

  const [newContact, setNewContact] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    company: '',
    job_title: '',
    country: '',
    custom_fields: {} as Record<string, any>,
    tags: '',
    subscription_status: 'subscribed',
    selected_lists: [] as string[]
  });

  const [newSequence, setNewSequence] = useState({
    sequence_name: '',
    sequence_description: '',
    trigger_type: 'manual',
    trigger_event: '',
    entry_conditions: '',
    is_active: true,
    emails: [] as any[]
  });

  const [newProvider, setNewProvider] = useState({
    provider_name: '',
    provider_type: 'smtp',
    smtp_host: '',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    api_key: '',
    api_secret: '',
    sending_domain: '',
    from_email: '',
    from_name: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      Promise.all([
        loadCampaigns(),
        loadTemplates(),
        loadContactLists(),
        loadContacts(),
        loadAutomationSequences(),
        loadProviders(),
        loadCampaignAnalytics(),
        loadSendingQuotas()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadCampaigns = async () => {
    const { data, error } = await db
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const parsedData = data.map((c: any) => ({
        ...c,
        tags: typeof c.tags === 'string' ? JSON.parse(c.tags) : (c.tags || []),
        ab_test_config: typeof c.ab_test_config === 'string' ? JSON.parse(c.ab_test_config) : (c.ab_test_config || {})
      }));
      setCampaigns(parsedData);
    }
  };

  const loadTemplates = async () => {
    const { data, error } = await db
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const parsedData = data.map((t: any) => ({
        ...t,
        template_variables: typeof t.template_variables === 'string' ? JSON.parse(t.template_variables) : (t.template_variables || [])
      }));
      setTemplates(parsedData);
    }
  };

  const loadContactLists = async () => {
    const { data, error } = await db
      .from('email_contact_lists')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const parsedData = data.map((l: any) => ({
        ...l,
        tags: typeof l.tags === 'string' ? JSON.parse(l.tags) : (l.tags || [])
      }));
      setContactLists(parsedData);
    }
  };

  const loadContacts = async () => {
    const { data, error } = await db
      .from('email_contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      const parsedData = data.map((c: any) => ({
        ...c,
        tags: typeof c.tags === 'string' ? JSON.parse(c.tags) : (c.tags || []),
        custom_fields: typeof c.custom_fields === 'string' ? JSON.parse(c.custom_fields) : (c.custom_fields || {})
      }));
      setContacts(parsedData);
    }
  };

  const loadAutomationSequences = async () => {
    const { data, error } = await db
      .from('email_automation_sequences')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const parsedData = data.map((s: any) => ({
        ...s,
        entry_conditions: typeof s.entry_conditions === 'string' ? JSON.parse(s.entry_conditions) : (s.entry_conditions || {})
      }));
      setAutomationSequences(parsedData);
    }
  };

  const loadProviders = async () => {
    const { data, error } = await db
      .from('email_provider_configs')
      .select('*')
      .order('is_default', { ascending: false });

    if (!error && data) {
      setProviders(data);
    }
  };

  const loadCampaignAnalytics = async () => {
    const { data, error } = await db
      .from('email_campaign_analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(50);

    if (!error && data) {
      setCampaignAnalytics(data);
    }
  };

  const loadSendingQuotas = async () => {
    const { data, error} = await db
      .from('email_sending_quotas')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSendingQuotas(data);
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.campaign_name || !newCampaign.subject_line || !newCampaign.from_email) {
      setNotification({ type: 'error', message: 'Please fill in required fields' });
      return;
    }

    if (newCampaign.selected_lists.length === 0 && modalStep === 2) {
      setNotification({ type: 'error', message: 'Please select at least one contact list' });
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = newCampaign.tags
        ? newCampaign.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const { data: campaignData, error: campaignError } = await db
        .from('email_campaigns')
        .insert([{
          campaign_name: newCampaign.campaign_name,
          campaign_type: newCampaign.campaign_type,
          template_id: newCampaign.template_id || null,
          subject_line: newCampaign.subject_line,
          preview_text: newCampaign.preview_text || null,
          from_email: newCampaign.from_email,
          from_name: newCampaign.from_name || null,
          reply_to_email: newCampaign.reply_to_email || null,
          status: newCampaign.schedule_type === 'send_now' ? 'sending' : 'scheduled',
          scheduled_at: newCampaign.schedule_type === 'schedule' ? newCampaign.scheduled_at : null,
          ab_test_enabled: newCampaign.ab_test_enabled,
          ab_test_config: newCampaign.ab_test_enabled ? {
            subject_variants: newCampaign.ab_subject_variants.filter(v => v)
          } : null,
          tags: tagsArray,
          created_by: user?.id
        }])
        .select()
        .single();

      if (campaignError) throw campaignError;

      if (campaignData && newCampaign.selected_lists.length > 0) {
        const listsContacts = await Promise.all(
          newCampaign.selected_lists.map(async (listId) => {
            const { data } = await db
              .from('email_contact_list_members')
              .select('contact_id, email_contacts(email)')
              .eq('list_id', listId);
            return data || [];
          })
        );

        const allContacts = listsContacts.flat();
        const uniqueContacts = Array.from(
          new Map(allContacts.map(c => [c.contact_id, c])).values()
        );

        if (uniqueContacts.length > 0) {
          await db
            .from('email_campaign_recipients')
            .insert(
              uniqueContacts.map(contact => ({
                campaign_id: campaignData.id,
                contact_id: contact.contact_id,
                email: contact.email_contacts[0]?.email
              }))
            );

          await db
            .from('email_campaigns')
            .update({ total_recipients: uniqueContacts.length })
            .eq('id', campaignData.id);
        }
      }

      setNotification({ type: 'success', message: 'Campaign created successfully' });
      setShowCreateCampaignModal(false);
      setModalStep(1);
      setNewCampaign({
        campaign_name: '',
        campaign_type: 'regular',
        template_id: '',
        subject_line: '',
        preview_text: '',
        from_email: '',
        from_name: '',
        reply_to_email: '',
        selected_lists: [],
        schedule_type: 'send_now',
        scheduled_at: '',
        ab_test_enabled: false,
        ab_subject_variants: ['', ''],
        tags: ''
      });
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      setNotification({ type: 'error', message: 'Failed to create campaign' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.template_name || !newTemplate.subject_line || !newTemplate.html_content) {
      setNotification({ type: 'error', message: 'Please fill in required fields' });
      return;
    }

    setSubmitting(true);
    try {
      const variablesArray = newTemplate.template_variables
        ? newTemplate.template_variables.split(',').map(v => v.trim()).filter(v => v)
        : [];

      const { error } = await db
        .from('email_templates')
        .insert([{
          template_name: newTemplate.template_name,
          template_category: newTemplate.template_category,
          subject_line: newTemplate.subject_line,
          preview_text: newTemplate.preview_text || null,
          html_content: newTemplate.html_content,
          plain_text_content: newTemplate.plain_text_content || null,
          template_variables: variablesArray,
          thumbnail_url: newTemplate.thumbnail_url || null,
          is_responsive: newTemplate.is_responsive,
          created_by: user?.id
        }]);

      if (error) throw error;

      setNotification({ type: 'success', message: 'Template created successfully' });
      setShowCreateTemplateModal(false);
      setNewTemplate({
        template_name: '',
        template_category: 'general',
        subject_line: '',
        preview_text: '',
        html_content: '',
        plain_text_content: '',
        template_variables: '',
        thumbnail_url: '',
        is_responsive: true
      });
      loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      setNotification({ type: 'error', message: 'Failed to create template' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.email) {
      setNotification({ type: 'error', message: 'Please enter an email address' });
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = newContact.tags
        ? newContact.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const { data: contactData, error } = await db
        .from('email_contacts')
        .insert([{
          email: newContact.email,
          first_name: newContact.first_name || null,
          last_name: newContact.last_name || null,
          phone_number: newContact.phone_number || null,
          company: newContact.company || null,
          job_title: newContact.job_title || null,
          country: newContact.country || null,
          custom_fields: newContact.custom_fields,
          tags: tagsArray,
          subscription_status: newContact.subscription_status,
          source: 'manual'
        }])
        .select()
        .single();

      if (!error && contactData) {
        if (newContact.selected_lists.length > 0) {
          await db
            .from('email_contact_list_members')
            .insert(
              newContact.selected_lists.map(listId => ({
                list_id: listId,
                contact_id: contactData.id
              }))
            );
        }

        setNotification({ type: 'success', message: 'Contact added successfully' });
        setShowAddContactModal(false);
        setNewContact({
          email: '',
          first_name: '',
          last_name: '',
          phone_number: '',
          company: '',
          job_title: '',
          country: '',
          custom_fields: {},
          tags: '',
          subscription_status: 'subscribed',
          selected_lists: []
        });
        loadContacts();
      } else {
        setNotification({ type: 'error', message: error?.message || 'Failed to add contact' });
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      setNotification({ type: 'error', message: 'Failed to add contact' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportContacts = async () => {
    if (!importFile) {
      setNotification({ type: 'error', message: 'Please select a file to import' });
      return;
    }

    setSubmitting(true);
    try {
      const fileText = await importFile.text();
      const lines = fileText.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        setNotification({ type: 'error', message: 'CSV file must contain headers and at least one contact' });
        setSubmitting(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const emailIndex = headers.findIndex(h => h.toLowerCase() === 'email');

      if (emailIndex === -1) {
        setNotification({ type: 'error', message: 'CSV must contain an "email" column' });
        setSubmitting(false);
        return;
      }

      const contactsToImport = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const email = values[emailIndex];

        if (email && email.includes('@')) {
          const contactData: any = { email, source: 'import' };

          const firstNameIndex = headers.findIndex(h => h.toLowerCase() === 'first_name' || h.toLowerCase() === 'firstname');
          const lastNameIndex = headers.findIndex(h => h.toLowerCase() === 'last_name' || h.toLowerCase() === 'lastname');
          const companyIndex = headers.findIndex(h => h.toLowerCase() === 'company');
          const phoneIndex = headers.findIndex(h => h.toLowerCase() === 'phone' || h.toLowerCase() === 'phone_number');

          if (firstNameIndex !== -1) contactData.first_name = values[firstNameIndex] || null;
          if (lastNameIndex !== -1) contactData.last_name = values[lastNameIndex] || null;
          if (companyIndex !== -1) contactData.company = values[companyIndex] || null;
          if (phoneIndex !== -1) contactData.phone_number = values[phoneIndex] || null;

          contactsToImport.push(contactData);
        }
      }

      if (contactsToImport.length === 0) {
        setNotification({ type: 'error', message: 'No valid contacts found in CSV' });
        setSubmitting(false);
        return;
      }

      const { error } = await db
        .from('email_contacts')
        .insert(contactsToImport);

      if (!error) {
        setNotification({ type: 'success', message: `Successfully imported ${contactsToImport.length} contacts` });
        setShowImportContactsModal(false);
        setImportFile(null);
        loadContacts();
      } else {
        setNotification({ type: 'error', message: 'Failed to import contacts' });
      }
    } catch (error) {
      console.error('Error importing contacts:', error);
      setNotification({ type: 'error', message: 'Failed to import contacts' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateContactSettings = async () => {
    if (!selectedContact) return;

    setSubmitting(true);
    try {
      const { error } = await db
        .from('email_contacts')
        .update({
          subscription_status: selectedContact.subscription_status,
          tags: selectedContact.tags
        })
        .eq('id', selectedContact.id);

      if (!error) {
        setNotification({ type: 'success', message: 'Contact settings updated successfully' });
        setShowContactSettingsModal(false);
        setSelectedContact(null);
        loadContacts();
      } else {
        setNotification({ type: 'error', message: 'Failed to update contact settings' });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      setNotification({ type: 'error', message: 'Failed to update contact settings' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSequence = async () => {
    if (!newSequence.sequence_name) {
      setNotification({ type: 'error', message: 'Please enter a sequence name' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await db
        .from('email_automation_sequences')
        .insert([{
          sequence_name: newSequence.sequence_name,
          sequence_description: newSequence.sequence_description || null,
          trigger_type: newSequence.trigger_type,
          trigger_event: newSequence.trigger_event || null,
          entry_conditions: newSequence.entry_conditions ? JSON.parse(newSequence.entry_conditions) : null,
          is_active: newSequence.is_active
        }]);

      if (!error) {
        setNotification({ type: 'success', message: 'Automation sequence created successfully' });
        setShowCreateSequenceModal(false);
        setNewSequence({
          sequence_name: '',
          sequence_description: '',
          trigger_type: 'manual',
          trigger_event: '',
          entry_conditions: '',
          is_active: true,
          emails: []
        });
        loadAutomationSequences();
      } else {
        setNotification({ type: 'error', message: 'Failed to create sequence' });
      }
    } catch (error) {
      console.error('Error creating sequence:', error);
      setNotification({ type: 'error', message: 'Failed to create sequence' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePauseSequence = async (sequenceId: string, currentStatus: boolean) => {
    try {
      const { error } = await db
        .from('email_automation_sequences')
        .update({ is_active: !currentStatus })
        .eq('id', sequenceId);

      if (!error) {
        setNotification({
          type: 'success',
          message: `Sequence ${!currentStatus ? 'activated' : 'paused'} successfully`
        });
        loadAutomationSequences();
      } else {
        setNotification({ type: 'error', message: 'Failed to update sequence' });
      }
    } catch (error) {
      console.error('Error updating sequence:', error);
      setNotification({ type: 'error', message: 'Failed to update sequence' });
    }
  };

  const handleAddProvider = async () => {
    if (!newProvider.provider_name || !newProvider.from_email) {
      setNotification({ type: 'error', message: 'Please fill in required fields' });
      return;
    }

    if (newProvider.provider_type === 'smtp' && (!newProvider.smtp_host || !newProvider.smtp_username)) {
      setNotification({ type: 'error', message: 'Please fill in SMTP configuration' });
      return;
    }

    if (newProvider.provider_type === 'api' && !newProvider.api_key) {
      setNotification({ type: 'error', message: 'Please provide API key' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await db
        .from('email_provider_configs')
        .insert([{
          provider_name: newProvider.provider_name,
          provider_type: newProvider.provider_type,
          smtp_host: newProvider.provider_type === 'smtp' ? newProvider.smtp_host : null,
          smtp_port: newProvider.provider_type === 'smtp' ? parseInt(newProvider.smtp_port) : null,
          smtp_username: newProvider.provider_type === 'smtp' ? newProvider.smtp_username : null,
          smtp_password: newProvider.provider_type === 'smtp' ? newProvider.smtp_password : null,
          smtp_encryption: newProvider.provider_type === 'smtp' ? newProvider.smtp_encryption : null,
          api_key: newProvider.provider_type === 'api' ? newProvider.api_key : null,
          api_secret: newProvider.provider_type === 'api' ? newProvider.api_secret : null,
          sending_domain: newProvider.sending_domain || null,
          from_email: newProvider.from_email,
          from_name: newProvider.from_name || null,
          is_default: newProvider.is_default,
          is_verified: false
        }]);

      if (!error) {
        setNotification({ type: 'success', message: 'Email provider added successfully' });
        setShowAddProviderModal(false);
        setNewProvider({
          provider_name: '',
          provider_type: 'smtp',
          smtp_host: '',
          smtp_port: '587',
          smtp_username: '',
          smtp_password: '',
          smtp_encryption: 'tls',
          api_key: '',
          api_secret: '',
          sending_domain: '',
          from_email: '',
          from_name: '',
          is_default: false
        });
        loadProviders();
      } else {
        setNotification({ type: 'error', message: 'Failed to add provider' });
      }
    } catch (error) {
      console.error('Error adding provider:', error);
      setNotification({ type: 'error', message: 'Failed to add provider' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfigureProvider = async () => {
    if (!selectedProvider) return;

    setSubmitting(true);
    try {
      const { error } = await db
        .from('email_provider_configs')
        .update({
          is_active: selectedProvider.is_active,
          is_default: selectedProvider.is_default,
          daily_sending_limit: selectedProvider.daily_sending_limit
        })
        .eq('id', selectedProvider.id);

      if (!error) {
        setNotification({ type: 'success', message: 'Provider configured successfully' });
        setShowConfigureProviderModal(false);
        setSelectedProvider(null);
        loadProviders();
      } else {
        setNotification({ type: 'error', message: 'Failed to configure provider' });
      }
    } catch (error) {
      console.error('Error configuring provider:', error);
      setNotification({ type: 'error', message: 'Failed to configure provider' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestConnection = async (providerId: string) => {
    setTestingConnection(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const success = Math.random() > 0.3;

      await db
        .from('email_provider_configs')
        .update({
          is_verified: success,
          last_verified_at: success ? new Date().toISOString() : null
        })
        .eq('id', providerId);

      if (success) {
        setNotification({ type: 'success', message: 'Connection test successful' });
      } else {
        setNotification({ type: 'error', message: 'Connection test failed' });
      }

      loadProviders();
    } catch (error) {
      console.error('Error testing connection:', error);
      setNotification({ type: 'error', message: 'Connection test failed' });
    } finally {
      setTestingConnection(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.subject_line.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSent = campaigns.reduce((sum, c) => sum + (c.emails_sent || 0), 0);
  const totalDelivered = campaigns.reduce((sum, c) => sum + (c.emails_delivered || 0), 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + (c.emails_opened || 0), 0);
  const totalClicked = campaigns.reduce((sum, c) => sum + (c.emails_clicked || 0), 0);

  const avgOpenRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(2) : 0;
  const avgClickRate = totalDelivered > 0 ? ((totalClicked / totalDelivered) * 100).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39FF14]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Campaigns</h1>
          <p className="text-slate-400 mt-1">Create, manage, and analyze email marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateCampaignModal(true)}
          className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </div>



      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 inline-flex gap-1">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'campaigns' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'templates' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'contacts' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Contacts
        </button>
        <button
          onClick={() => setActiveTab('automation')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'automation' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Automation
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'analytics' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'providers' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Providers
        </button>
      </div>

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="sent">Sent</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{campaign.campaign_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                        campaign.status === 'sending' ? 'bg-[#39FF14]/20/20 text-[#39FF14] animate-pulse' :
                        campaign.status === 'scheduled' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                        campaign.status === 'draft' ? 'bg-slate-500/20 text-slate-400' :
                        campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {campaign.status.toUpperCase()}
                      </span>
                      {campaign.campaign_type === 'ab_test' && (
                        <span className="px-3 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded-full text-xs font-semibold">
                          A/B TEST
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 mb-1">
                      <Mail className="w-4 h-4 inline mr-2" />
                      {campaign.subject_line}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <span>From: {campaign.from_email}</span>
                      {campaign.scheduled_at && (
                        <>
                          <span>•</span>
                          <span>Scheduled: {new Date(campaign.scheduled_at).toLocaleString()}</span>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div>
                        <p className="text-slate-400 text-xs">Recipients</p>
                        <p className="text-white font-semibold">{campaign.total_recipients?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Sent</p>
                        <p className="text-white font-semibold">{campaign.emails_sent?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Delivered</p>
                        <p className="text-white font-semibold">{campaign.emails_delivered?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Opened</p>
                        <p className="text-white font-semibold">
                          {campaign.emails_opened?.toLocaleString() || 0}
                          {campaign.emails_delivered > 0 && (
                            <span className="text-green-400 text-xs ml-1">
                              ({((campaign.emails_opened / campaign.emails_delivered) * 100).toFixed(1)}%)
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Clicked</p>
                        <p className="text-white font-semibold">
                          {campaign.emails_clicked?.toLocaleString() || 0}
                          {campaign.emails_delivered > 0 && (
                            <span className="text-[#39FF14] text-xs ml-1">
                              ({((campaign.emails_clicked / campaign.emails_delivered) * 100).toFixed(1)}%)
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Bounced</p>
                        <p className="text-white font-semibold">{campaign.emails_bounced?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="View Details">
                      <BarChart3 className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Duplicate">
                      <Copy className="w-5 h-5 text-slate-400" />
                    </button>
                    {campaign.status === 'draft' && (
                      <button className="p-2 hover:bg-green-600 rounded-lg transition-colors" title="Send">
                        <Send className="w-5 h-5 text-green-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Email Templates</h2>
            <button
              onClick={() => setShowCreateTemplateModal(true)}
              className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-[#39FF14]/10 hover:text-[#39FF14] hover:border-[#39FF14]/50 transition-all">
                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-3 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-slate-600" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{template.template_name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    template.template_category === 'promotional' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                    template.template_category === 'transactional' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                    template.template_category === 'newsletter' ? 'bg-green-500/20 text-green-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {template.template_category}
                  </span>
                </div>

                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{template.subject_line}</p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Used {template.usage_count || 0} times</span>
                  <div className="flex gap-2">
                    <button className="hover:text-[#39FF14] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="hover:text-[#39FF14] transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="hover:text-[#39FF14] transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Contact Management</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportContactsModal(true)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Import
              </button>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Contact
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {contactLists.map((list) => (
              <div key={list.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{list.list_name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{list.list_description}</p>
                  </div>
                  <Database className="w-6 h-6 text-[#39FF14]" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-slate-400 text-xs">Total</p>
                    <p className="text-white font-semibold text-lg">{list.total_contacts?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Active</p>
                    <p className="text-green-400 font-semibold text-lg">{list.active_contacts?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Unsubscribed</p>
                    <p className="text-red-400 font-semibold text-lg">{list.unsubscribed_contacts?.toLocaleString()}</p>
                  </div>
                </div>

                {list.tags && list.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {list.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                    View Contacts
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Contacts</h3>
            <div className="space-y-2">
              {contacts.slice(0, 10).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#39FF14] to-[#32e012] rounded-full flex items-center justify-center text-white font-semibold">
                      {contact.first_name?.[0] || contact.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {contact.first_name} {contact.last_name}
                      </p>
                      <p className="text-slate-400 text-sm">{contact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {contact.company && (
                      <span className="text-slate-400 text-sm">{contact.company}</span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contact.subscription_status === 'subscribed' ? 'bg-green-500/20 text-green-400' :
                      contact.subscription_status === 'unsubscribed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {contact.subscription_status}
                    </span>
                    <button
                      onClick={() => { setSelectedContact(contact); setShowContactSettingsModal(true); }}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Manage contact"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Email Automation</h2>
            <button
              onClick={() => setShowCreateSequenceModal(true)}
              className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Sequence
            </button>
          </div>

          <div className="space-y-4">
            {automationSequences.map((sequence) => (
              <div key={sequence.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${sequence.is_active ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                      <Zap className={`w-6 h-6 ${sequence.is_active ? 'text-green-400' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{sequence.sequence_name}</h3>
                      <p className="text-slate-400 text-sm">{sequence.sequence_description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sequence.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {sequence.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <span className="px-3 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded-full text-xs font-semibold uppercase">
                      {sequence.trigger_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Total Subscribers</p>
                    <p className="text-white text-2xl font-bold">{sequence.total_subscribers?.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Active</p>
                    <p className="text-[#39FF14] text-2xl font-bold">{sequence.active_subscribers?.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Completed</p>
                    <p className="text-green-400 text-2xl font-bold">{sequence.completed_subscribers?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedSequence(sequence); setShowViewSequenceModal(true); }}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Sequence
                  </button>
                  <button
                    onClick={() => { setSelectedSequence(sequence); setShowEditSequenceModal(true); }}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handlePauseSequence(sequence.id, sequence.is_active)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      sequence.is_active
                        ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                        : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                    }`}
                  >
                    {sequence.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {sequence.is_active ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Campaign Analytics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Eye className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Average Open Rate</p>
                      <p className="text-white text-2xl font-bold">{avgOpenRate}%</p>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                      <MousePointer className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Average Click Rate</p>
                      <p className="text-white text-2xl font-bold">{avgClickRate}%</p>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#39FF14]" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#39FF14]/20/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Delivery Rate</p>
                      <p className="text-white text-2xl font-bold">
                        {totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#39FF14]" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Device Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-slate-400" />
                    <span className="text-white">Desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#39FF14] rounded-full" style={{ width: '58%' }}></div>
                    </div>
                    <span className="text-white font-semibold w-12 text-right">58%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                    <span className="text-white">Mobile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#39FF14] rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <span className="text-white font-semibold w-12 text-right">42%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Performing Campaigns</h3>
            <div className="space-y-3">
              {campaigns
                .filter(c => c.status === 'sent' && c.emails_delivered > 0)
                .sort((a, b) => (b.emails_opened / b.emails_delivered) - (a.emails_opened / a.emails_delivered))
                .slice(0, 5)
                .map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{campaign.campaign_name}</h4>
                      <p className="text-slate-400 text-sm">{campaign.subject_line}</p>
                    </div>
                    <div className="flex items-center gap-6 text-center">
                      <div>
                        <p className="text-slate-400 text-xs">Open Rate</p>
                        <p className="text-green-400 font-bold text-lg">
                          {((campaign.emails_opened / campaign.emails_delivered) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Click Rate</p>
                        <p className="text-[#39FF14] font-bold text-lg">
                          {((campaign.emails_clicked / campaign.emails_delivered) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Delivered</p>
                        <p className="text-white font-bold text-lg">{campaign.emails_delivered.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Email Providers</h2>
            <button
              onClick={() => setShowAddProviderModal(true)}
              className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Provider
            </button>
          </div>

          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${provider.is_active ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                      <Mail className={`w-6 h-6 ${provider.is_active ? 'text-green-400' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{provider.provider_name}</h3>
                      <p className="text-slate-400 text-sm">{provider.from_email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {provider.is_default && (
                      <span className="px-3 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded-full text-xs font-semibold">
                        DEFAULT
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      provider.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {provider.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-semibold uppercase">
                      {provider.provider_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {provider.smtp_host && (
                    <div>
                      <p className="text-slate-400 text-xs">SMTP Host</p>
                      <p className="text-white font-semibold">{provider.smtp_host}</p>
                    </div>
                  )}
                  {provider.smtp_port && (
                    <div>
                      <p className="text-slate-400 text-xs">Port</p>
                      <p className="text-white font-semibold">{provider.smtp_port}</p>
                    </div>
                  )}
                  {provider.daily_sending_limit && (
                    <div>
                      <p className="text-slate-400 text-xs">Daily Limit</p>
                      <p className="text-white font-semibold">{provider.daily_sending_limit.toLocaleString()}</p>
                    </div>
                  )}
                  {provider.monthly_sending_limit && (
                    <div>
                      <p className="text-slate-400 text-xs">Monthly Limit</p>
                      <p className="text-white font-semibold">{provider.monthly_sending_limit.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {sendingQuotas.filter(q => q.provider_config_id === provider.id).map((quota) => (
                  <div key={quota.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-slate-400 text-sm capitalize">{quota.quota_period} Usage</p>
                      <p className="text-white font-semibold">
                        {quota.emails_sent.toLocaleString()} / {quota.quota_limit.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (quota.emails_sent / quota.quota_limit) > 0.9 ? 'bg-red-500' :
                          (quota.emails_sent / quota.quota_limit) > 0.7 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((quota.emails_sent / quota.quota_limit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setSelectedProvider(provider); setShowConfigureProviderModal(true); }}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                  <button
                    onClick={() => handleTestConnection(provider.id)}
                    disabled={testingConnection}
                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
                    {testingConnection ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreateCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Email Campaign</h2>
                  <p className="text-slate-400 text-sm mt-1">Design and schedule your email marketing campaign</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateCampaignModal(false);
                    setModalStep(1);
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      modalStep >= step ? 'bg-[#39FF14] text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {step}
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${modalStep > step ? 'bg-[#39FF14]' : 'bg-slate-700'}`}></div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-2 text-xs">
                <span className={modalStep >= 1 ? 'text-[#39FF14]' : 'text-slate-500'}>Campaign Details</span>
                <span className={modalStep >= 2 ? 'text-[#39FF14]' : 'text-slate-500'}>Select Audience</span>
                <span className={modalStep >= 3 ? 'text-[#39FF14]' : 'text-slate-500'}>Schedule & Review</span>
              </div>
            </div>

            <div className="p-6">
              {modalStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Campaign Name *</label>
                      <input
                        type="text"
                        value={newCampaign.campaign_name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e.target.value })}
                        placeholder="Summer Sale 2024"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Campaign Type</label>
                      <select
                        value={newCampaign.campaign_type}
                        onChange={(e) => setNewCampaign({ ...newCampaign, campaign_type: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="regular">Regular Campaign</option>
                        <option value="ab_test">A/B Test Campaign</option>
                        <option value="automated">Automated</option>
                        <option value="drip">Drip Campaign</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Select Template (Optional)</label>
                    <select
                      value={newCampaign.template_id}
                      onChange={(e) => {
                        const templateId = e.target.value;
                        setNewCampaign({ ...newCampaign, template_id: templateId });
                        const template = templates.find(t => t.id === templateId);
                        if (template) {
                          setNewCampaign(prev => ({
                            ...prev,
                            subject_line: template.subject_line,
                            preview_text: template.preview_text || ''
                          }));
                        }
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="">Create from scratch</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.template_name} ({template.template_category})
                        </option>
                      ))}
                    </select>
                    <p className="text-slate-400 text-sm mt-1">Choose a template or design from scratch</p>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Subject Line *</label>
                    <input
                      type="text"
                      value={newCampaign.subject_line}
                      onChange={(e) => setNewCampaign({ ...newCampaign, subject_line: e.target.value })}
                      placeholder="Your exclusive offer awaits!"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Preview Text</label>
                    <input
                      type="text"
                      value={newCampaign.preview_text}
                      onChange={(e) => setNewCampaign({ ...newCampaign, preview_text: e.target.value })}
                      placeholder="Don't miss out on our biggest sale of the year"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    />
                    <p className="text-slate-400 text-sm mt-1">Displayed in email client preview pane</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">From Email *</label>
                      <input
                        type="email"
                        value={newCampaign.from_email}
                        onChange={(e) => setNewCampaign({ ...newCampaign, from_email: e.target.value })}
                        placeholder="newsletter@company.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">From Name</label>
                      <input
                        type="text"
                        value={newCampaign.from_name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, from_name: e.target.value })}
                        placeholder="Company Team"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Reply-To Email</label>
                      <input
                        type="email"
                        value={newCampaign.reply_to_email}
                        onChange={(e) => setNewCampaign({ ...newCampaign, reply_to_email: e.target.value })}
                        placeholder="support@company.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>
                  </div>

                  {newCampaign.campaign_type === 'ab_test' && (
                    <div className="border border-[#39FF14]/30 bg-[#39FF14]/10 rounded-lg p-4">
                      <label className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          checked={newCampaign.ab_test_enabled}
                          onChange={(e) => setNewCampaign({ ...newCampaign, ab_test_enabled: e.target.checked })}
                          className="w-5 h-5 rounded"
                        />
                        <span className="text-white font-medium">Enable A/B Testing</span>
                      </label>

                      {newCampaign.ab_test_enabled && (
                        <div className="space-y-3">
                          <p className="text-slate-300 text-sm">Test different subject lines to see which performs better:</p>
                          <div>
                            <label className="block text-white text-sm mb-1">Variant A (Original)</label>
                            <input
                              type="text"
                              value={newCampaign.ab_subject_variants[0]}
                              onChange={(e) => {
                                const variants = [...newCampaign.ab_subject_variants];
                                variants[0] = e.target.value;
                                setNewCampaign({ ...newCampaign, ab_subject_variants: variants });
                              }}
                              placeholder="First subject line option"
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                            />
                          </div>
                          <div>
                            <label className="block text-white text-sm mb-1">Variant B (Alternative)</label>
                            <input
                              type="text"
                              value={newCampaign.ab_subject_variants[1]}
                              onChange={(e) => {
                                const variants = [...newCampaign.ab_subject_variants];
                                variants[1] = e.target.value;
                                setNewCampaign({ ...newCampaign, ab_subject_variants: variants });
                              }}
                              placeholder="Second subject line option"
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-white font-medium mb-2">Tags</label>
                    <input
                      type="text"
                      value={newCampaign.tags}
                      onChange={(e) => setNewCampaign({ ...newCampaign, tags: e.target.value })}
                      placeholder="promotion, summer, sale"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    />
                    <p className="text-slate-400 text-sm mt-1">Comma-separated tags for organization</p>
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Select Contact Lists</h3>
                  <p className="text-slate-400 text-sm">Choose which contact lists will receive this campaign</p>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {contactLists.map((list) => (
                      <label
                        key={list.id}
                        className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-[#39FF14]/50 cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={newCampaign.selected_lists.includes(list.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCampaign({
                                ...newCampaign,
                                selected_lists: [...newCampaign.selected_lists, list.id]
                              });
                            } else {
                              setNewCampaign({
                                ...newCampaign,
                                selected_lists: newCampaign.selected_lists.filter(id => id !== list.id)
                              });
                            }
                          }}
                          className="w-5 h-5 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-semibold">{list.list_name}</h4>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-[#39FF14]" />
                              <span className="text-[#39FF14]">{list.total_contacts} contacts</span>
                            </div>
                          </div>
                          {list.list_description && (
                            <p className="text-slate-400 text-sm mt-1">{list.list_description}</p>
                          )}
                          {list.tags && list.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {list.tags.map((tag: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}

                    {contactLists.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">No contact lists found</p>
                        <p className="text-slate-500 text-sm mt-1">Create contact lists to send campaigns</p>
                      </div>
                    )}
                  </div>

                  {newCampaign.selected_lists.length > 0 && (
                    <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-[#39FF14] mb-1">
                        <Target className="w-5 h-5" />
                        <span className="font-semibold">Estimated Recipients</span>
                      </div>
                      <p className="text-white text-2xl font-bold">
                        {contactLists
                          .filter(list => newCampaign.selected_lists.includes(list.id))
                          .reduce((sum, list) => sum + (list.active_contacts || 0), 0)
                          .toLocaleString()}
                      </p>
                      <p className="text-slate-300 text-sm mt-1">
                        Active contacts across {newCampaign.selected_lists.length} selected lists
                      </p>
                    </div>
                  )}
                </div>
              )}

              {modalStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Schedule Campaign</h3>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer hover:border-[#39FF14]/50 transition-all">
                      <input
                        type="radio"
                        name="schedule_type"
                        value="send_now"
                        checked={newCampaign.schedule_type === 'send_now'}
                        onChange={(e) => setNewCampaign({ ...newCampaign, schedule_type: e.target.value })}
                        className="w-5 h-5 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-5 h-5 text-green-400" />
                          <span className="text-white font-semibold">Send Immediately</span>
                        </div>
                        <p className="text-slate-400 text-sm">Campaign will be sent as soon as it's created</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer hover:border-[#39FF14]/50 transition-all">
                      <input
                        type="radio"
                        name="schedule_type"
                        value="schedule"
                        checked={newCampaign.schedule_type === 'schedule'}
                        onChange={(e) => setNewCampaign({ ...newCampaign, schedule_type: e.target.value })}
                        className="w-5 h-5 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-5 h-5 text-[#39FF14]" />
                          <span className="text-white font-semibold">Schedule for Later</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">Choose a specific date and time to send</p>

                        {newCampaign.schedule_type === 'schedule' && (
                          <input
                            type="datetime-local"
                            value={newCampaign.scheduled_at}
                            onChange={(e) => setNewCampaign({ ...newCampaign, scheduled_at: e.target.value })}
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                          />
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Campaign Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Campaign Name</p>
                        <p className="text-white font-medium">{newCampaign.campaign_name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Type</p>
                        <p className="text-white font-medium capitalize">{newCampaign.campaign_type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Subject Line</p>
                        <p className="text-white font-medium">{newCampaign.subject_line || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">From</p>
                        <p className="text-white font-medium">{newCampaign.from_email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Lists Selected</p>
                        <p className="text-white font-medium">{newCampaign.selected_lists.length}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Total Recipients</p>
                        <p className="text-white font-medium">
                          {contactLists
                            .filter(list => newCampaign.selected_lists.includes(list.id))
                            .reduce((sum, list) => sum + (list.active_contacts || 0), 0)
                            .toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-[#39FF14] font-semibold mb-1">Before Sending</p>
                        <ul className="text-slate-300 space-y-1 list-disc list-inside">
                          <li>Ensure your content complies with email marketing regulations</li>
                          <li>Include an unsubscribe link in your email template</li>
                          <li>Test your email on different devices and email clients</li>
                          <li>Review all links and personalization variables</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {modalStep > 1 && (
                  <button
                    onClick={() => setModalStep(modalStep - 1)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowCreateCampaignModal(false);
                    setModalStep(1);
                  }}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>

                {modalStep < 3 ? (
                  <button
                    onClick={() => setModalStep(modalStep + 1)}
                    disabled={modalStep === 1 && (!newCampaign.campaign_name || !newCampaign.subject_line || !newCampaign.from_email)}
                    className="flex-1 px-6 py-3 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreateCampaign}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Creating Campaign...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Create Campaign
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Email Template</h2>
                  <p className="text-slate-400 text-sm mt-1">Design a reusable email template with rich content</p>
                </div>
                <button
                  onClick={() => setShowCreateTemplateModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={newTemplate.template_name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, template_name: e.target.value })}
                    placeholder="Welcome Email"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    value={newTemplate.template_category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, template_category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="general">General</option>
                    <option value="promotional">Promotional</option>
                    <option value="transactional">Transactional</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="welcome">Welcome</option>
                    <option value="abandoned_cart">Abandoned Cart</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Subject Line *</label>
                <input
                  type="text"
                  value={newTemplate.subject_line}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject_line: e.target.value })}
                  placeholder="Welcome to our platform!"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Preview Text</label>
                <input
                  type="text"
                  value={newTemplate.preview_text}
                  onChange={(e) => setNewTemplate({ ...newTemplate, preview_text: e.target.value })}
                  placeholder="Get started with your new account"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Shown in email client preview</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Thumbnail URL (Optional)</label>
                <input
                  type="url"
                  value={newTemplate.thumbnail_url}
                  onChange={(e) => setNewTemplate({ ...newTemplate, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/template-preview.jpg"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Image URL for template preview</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">HTML Content *</label>
                <textarea
                  value={newTemplate.html_content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, html_content: e.target.value })}
                  placeholder={`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to {{company_name}}!</h1>
    </div>
    <div class="content">
      <h2>Hello {{first_name}},</h2>
      <p>Thank you for joining us. We're excited to have you on board!</p>
      <p><a href="{{action_url}}" class="button">Get Started</a></p>
      <img src="https://via.placeholder.com/600x300" alt="Welcome" style="max-width: 100%; height: auto;">
    </div>
    <div class="footer">
      <p>&copy; 2024 {{company_name}}. All rights reserved.</p>
      <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`}
                  rows={15}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#39FF14] resize-none"
                />
                <p className="text-slate-400 text-sm mt-1">Full HTML email template with inline CSS for best compatibility</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Plain Text Content (Fallback)</label>
                <textarea
                  value={newTemplate.plain_text_content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, plain_text_content: e.target.value })}
                  placeholder="Plain text version for email clients that don't support HTML..."
                  rows={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] resize-none"
                />
                <p className="text-slate-400 text-sm mt-1">Plain text fallback for non-HTML email clients</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Template Variables</label>
                <input
                  type="text"
                  value={newTemplate.template_variables}
                  onChange={(e) => setNewTemplate({ ...newTemplate, template_variables: e.target.value })}
                  placeholder="first_name, last_name, company_name, action_url, unsubscribe_url"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Comma-separated list of merge variables (e.g., {`{{first_name}}`})</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTemplate.is_responsive}
                  onChange={(e) => setNewTemplate({ ...newTemplate, is_responsive: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <span className="text-white font-medium">Responsive Design</span>
                  <p className="text-slate-400 text-sm">Template adapts to mobile and desktop screens</p>
                </div>
              </label>

              <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/50 rounded-lg p-4">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#39FF14] font-semibold mb-1">Template Best Practices</p>
                    <ul className="text-slate-300 space-y-1 list-disc list-inside">
                      <li>Use inline CSS for styling (many email clients strip style tags)</li>
                      <li>Include image URLs from reliable hosting (avoid relative paths)</li>
                      <li>Test templates across different email clients</li>
                      <li>Keep width under 600px for best mobile compatibility</li>
                      <li>Always include alt text for images</li>
                      <li>Add unsubscribe link for compliance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateTemplateModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Creating Template...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Create Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add New Contact</h2>
                <button
                  onClick={() => { setShowAddContactModal(false); setNewContact({ email: '', first_name: '', last_name: '', phone_number: '', company: '', job_title: '', country: '', custom_fields: {}, tags: '', subscription_status: 'subscribed', selected_lists: [] }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-white font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={newContact.first_name}
                    onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                    placeholder="John"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newContact.last_name}
                    onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                    placeholder="Doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    placeholder="Company Name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Job Title</label>
                  <input
                    type="text"
                    value={newContact.job_title}
                    onChange={(e) => setNewContact({ ...newContact, job_title: e.target.value })}
                    placeholder="Marketing Manager"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newContact.phone_number}
                    onChange={(e) => setNewContact({ ...newContact, phone_number: e.target.value })}
                    placeholder="+60123456789"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Country</label>
                  <input
                    type="text"
                    value={newContact.country}
                    onChange={(e) => setNewContact({ ...newContact, country: e.target.value })}
                    placeholder="Malaysia"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Status</label>
                  <select
                    value={newContact.subscription_status}
                    onChange={(e) => setNewContact({ ...newContact, subscription_status: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="subscribed">Subscribed</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-white font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newContact.tags}
                    onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                    placeholder="customer, vip, newsletter"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-white font-medium mb-2">Add to Lists</label>
                  <div className="grid grid-cols-2 gap-2">
                    {contactLists.map((list) => (
                      <label key={list.id} className="flex items-center gap-2 p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer hover:border-[#39FF14] transition-colors">
                        <input
                          type="checkbox"
                          checked={newContact.selected_lists.includes(list.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewContact({ ...newContact, selected_lists: [...newContact.selected_lists, list.id] });
                            } else {
                              setNewContact({ ...newContact, selected_lists: newContact.selected_lists.filter(id => id !== list.id) });
                            }
                          }}
                          className="w-4 h-4 text-[#39FF14] bg-slate-700 border-slate-600 rounded focus:ring-[#39FF14]"
                        />
                        <span className="text-white text-sm">{list.list_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAddContactModal(false); setNewContact({ email: '', first_name: '', last_name: '', phone_number: '', company: '', job_title: '', country: '', custom_fields: {}, tags: '', subscription_status: 'subscribed', selected_lists: [] }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Adding Contact...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Contact
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportContactsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Import Contacts</h2>
                <button
                  onClick={() => { setShowImportContactsModal(false); setImportFile(null); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">CSV Format Instructions</h3>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• First row must contain headers</li>
                  <li>• Required column: email</li>
                  <li>• Optional columns: first_name, last_name, company, phone, phone_number</li>
                  <li>• All other columns will be ignored</li>
                </ul>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#39FF14] file:text-white hover:file:bg-[#32e012]"
                />
                {importFile && (
                  <p className="text-[#39FF14] text-sm mt-2">Selected: {importFile.name}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowImportContactsModal(false); setImportFile(null); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportContacts}
                  disabled={submitting || !importFile}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Import Contacts
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showContactSettingsModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Contact Settings</h2>
                <button
                  onClick={() => { setShowContactSettingsModal(false); setSelectedContact(null); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Contact</p>
                <p className="text-white font-semibold">{selectedContact.email}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {selectedContact.first_name} {selectedContact.last_name}
                </p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Subscription Status</label>
                <select
                  value={selectedContact.subscription_status}
                  onChange={(e) => setSelectedContact({ ...selectedContact, subscription_status: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={selectedContact.tags ? selectedContact.tags.join(', ') : ''}
                  onChange={(e) => setSelectedContact({ ...selectedContact, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                  placeholder="customer, vip, newsletter"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowContactSettingsModal(false); setSelectedContact(null); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateContactSettings}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Settings className="w-5 h-5" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateSequenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Create Automation Sequence</h2>
                <button
                  onClick={() => { setShowCreateSequenceModal(false); setNewSequence({ sequence_name: '', sequence_description: '', trigger_type: 'manual', trigger_event: '', entry_conditions: '', is_active: true, emails: [] }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Sequence Name *</label>
                <input
                  type="text"
                  value={newSequence.sequence_name}
                  onChange={(e) => setNewSequence({ ...newSequence, sequence_name: e.target.value })}
                  placeholder="Welcome Series"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  value={newSequence.sequence_description}
                  onChange={(e) => setNewSequence({ ...newSequence, sequence_description: e.target.value })}
                  placeholder="Describe your automation sequence..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Trigger Type</label>
                  <select
                    value={newSequence.trigger_type}
                    onChange={(e) => setNewSequence({ ...newSequence, trigger_type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="manual">Manual</option>
                    <option value="signup">On Signup</option>
                    <option value="purchase">On Purchase</option>
                    <option value="abandoned_cart">Abandoned Cart</option>
                    <option value="date_based">Date Based</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Status</label>
                  <select
                    value={newSequence.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setNewSequence({ ...newSequence, is_active: e.target.value === 'active' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCreateSequenceModal(false); setNewSequence({ sequence_name: '', sequence_description: '', trigger_type: 'manual', trigger_event: '', entry_conditions: '', is_active: true, emails: [] }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSequence}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Sequence
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewSequenceModal && selectedSequence && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{selectedSequence.sequence_name}</h2>
                <button
                  onClick={() => { setShowViewSequenceModal(false); setSelectedSequence(null); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Description</p>
                <p className="text-white">{selectedSequence.sequence_description || 'No description provided'}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Total Subscribers</p>
                  <p className="text-white text-2xl font-bold">{selectedSequence.total_subscribers || 0}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Active</p>
                  <p className="text-[#39FF14] text-2xl font-bold">{selectedSequence.active_subscribers || 0}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Completed</p>
                  <p className="text-green-400 text-2xl font-bold">{selectedSequence.completed_subscribers || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Sequence Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Trigger Type</span>
                    <span className="text-white font-medium capitalize">{selectedSequence.trigger_type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedSequence.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedSequence.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Created</span>
                    <span className="text-white">{new Date(selectedSequence.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowViewSequenceModal(false); setSelectedSequence(null); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => { setShowViewSequenceModal(false); setShowEditSequenceModal(true); }}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit Sequence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditSequenceModal && selectedSequence && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Edit Sequence</h2>
                <button
                  onClick={() => { setShowEditSequenceModal(false); setSelectedSequence(null); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Sequence Name</p>
                <p className="text-white font-semibold">{selectedSequence.sequence_name}</p>
              </div>

              <p className="text-slate-400 text-sm">Note: Full sequence editing will be available soon. For now, you can pause/activate sequences from the main list.</p>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditSequenceModal(false); setSelectedSequence(null); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddProviderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add Email Provider</h2>
                <button
                  onClick={() => { setShowAddProviderModal(false); setNewProvider({ provider_name: '', provider_type: 'smtp', smtp_host: '', smtp_port: '587', smtp_username: '', smtp_password: '', smtp_encryption: 'tls', api_key: '', api_secret: '', sending_domain: '', from_email: '', from_name: '', is_default: false }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Provider Name *</label>
                  <input
                    type="text"
                    value={newProvider.provider_name}
                    onChange={(e) => setNewProvider({ ...newProvider, provider_name: e.target.value })}
                    placeholder="My Email Provider"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Provider Type</label>
                  <select
                    value={newProvider.provider_type}
                    onChange={(e) => setNewProvider({ ...newProvider, provider_type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="smtp">SMTP</option>
                    <option value="api">API (SendGrid, Mailgun, etc.)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-white font-medium mb-2">From Email *</label>
                  <input
                    type="email"
                    value={newProvider.from_email}
                    onChange={(e) => setNewProvider({ ...newProvider, from_email: e.target.value })}
                    placeholder="noreply@yourdomain.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">From Name</label>
                  <input
                    type="text"
                    value={newProvider.from_name}
                    onChange={(e) => setNewProvider({ ...newProvider, from_name: e.target.value })}
                    placeholder="Your Company"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Sending Domain</label>
                  <input
                    type="text"
                    value={newProvider.sending_domain}
                    onChange={(e) => setNewProvider({ ...newProvider, sending_domain: e.target.value })}
                    placeholder="yourdomain.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
              </div>

              {newProvider.provider_type === 'smtp' && (
                <div className="space-y-4 border-t border-slate-700 pt-4">
                  <h3 className="text-white font-semibold">SMTP Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">SMTP Host *</label>
                      <input
                        type="text"
                        value={newProvider.smtp_host}
                        onChange={(e) => setNewProvider({ ...newProvider, smtp_host: e.target.value })}
                        placeholder="smtp.gmail.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">SMTP Port</label>
                      <input
                        type="number"
                        value={newProvider.smtp_port}
                        onChange={(e) => setNewProvider({ ...newProvider, smtp_port: e.target.value })}
                        placeholder="587"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Username *</label>
                      <input
                        type="text"
                        value={newProvider.smtp_username}
                        onChange={(e) => setNewProvider({ ...newProvider, smtp_username: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Password *</label>
                      <input
                        type="password"
                        value={newProvider.smtp_password}
                        onChange={(e) => setNewProvider({ ...newProvider, smtp_password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-white font-medium mb-2">Encryption</label>
                      <select
                        value={newProvider.smtp_encryption}
                        onChange={(e) => setNewProvider({ ...newProvider, smtp_encryption: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      >
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {newProvider.provider_type === 'api' && (
                <div className="space-y-4 border-t border-slate-700 pt-4">
                  <h3 className="text-white font-semibold">API Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">API Key *</label>
                      <input
                        type="password"
                        value={newProvider.api_key}
                        onChange={(e) => setNewProvider({ ...newProvider, api_key: e.target.value })}
                        placeholder="Your API key"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">API Secret (optional)</label>
                      <input
                        type="password"
                        value={newProvider.api_secret}
                        onChange={(e) => setNewProvider({ ...newProvider, api_secret: e.target.value })}
                        placeholder="Your API secret"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProvider.is_default}
                    onChange={(e) => setNewProvider({ ...newProvider, is_default: e.target.checked })}
                    className="w-4 h-4 text-[#39FF14] bg-slate-700 border-slate-600 rounded focus:ring-[#39FF14]"
                  />
                  <span className="text-white">Set as default provider</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAddProviderModal(false); setNewProvider({ provider_name: '', provider_type: 'smtp', smtp_host: '', smtp_port: '587', smtp_username: '', smtp_password: '', smtp_encryption: 'tls', api_key: '', api_secret: '', sending_domain: '', from_email: '', from_name: '', is_default: false }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProvider}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Adding Provider...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Provider
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfigureProviderModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Configure Provider</h2>
                <button
                  onClick={() => { setShowConfigureProviderModal(false); setSelectedProvider(null); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Provider</p>
                <p className="text-white font-semibold">{selectedProvider.provider_name}</p>
                <p className="text-slate-400 text-sm mt-1">{selectedProvider.from_email}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={selectedProvider.is_active}
                    onChange={(e) => setSelectedProvider({ ...selectedProvider, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#39FF14] bg-slate-700 border-slate-600 rounded focus:ring-[#39FF14]"
                  />
                  <span className="text-white">Provider is active</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedProvider.is_default}
                    onChange={(e) => setSelectedProvider({ ...selectedProvider, is_default: e.target.checked })}
                    className="w-4 h-4 text-[#39FF14] bg-slate-700 border-slate-600 rounded focus:ring-[#39FF14]"
                  />
                  <span className="text-white">Set as default provider</span>
                </label>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Daily Sending Limit</label>
                <input
                  type="number"
                  value={selectedProvider.daily_sending_limit || ''}
                  onChange={(e) => setSelectedProvider({ ...selectedProvider, daily_sending_limit: parseInt(e.target.value) || null })}
                  placeholder="1000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Maximum emails to send per day (leave empty for unlimited)</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowConfigureProviderModal(false); setSelectedProvider(null); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfigureProvider}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Settings className="w-5 h-5" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
