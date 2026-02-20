import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Phone, MessageSquare, Users, Settings, Zap, Star, Clock, TrendingUp, Plus, Edit, Trash2, Eye, Activity, PhoneCall, Calendar, Award, Video, BarChart2, Play, Pause, Webhook, X, Save, CheckCircle, XCircle } from 'lucide-react';
import CTIIntegrations from './CTIIntegrations';
import ContactCenter from './ContactCenter';

type ModalType = 'ivr' | 'acd' | 'skill' | 'priority' | 'assignment' | 'campaign' | 'callList' | 'forecast' | 'schedule' | 'evaluation' | null;

type FormData = Record<string, any>;

export default function ContactCenterEnhanced() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({});

  const openModal = (type: string | null, item: any = null) => {
    const modalType = type as ModalType;
    setModalType(modalType);
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData(getDefaultFormData(modalType));
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setEditingItem(null);
    setFormData({});
  };

  const getDefaultFormData = (type: ModalType): FormData => {
    switch (type) {
      case 'ivr':
        return {
          menu_name: '',
          menu_description: '',
          greeting_text: '',
          use_conversational_ai: false,
          ai_model: 'gpt-4',
          timeout_seconds: 5,
          max_retries: 3,
          is_active: true
        };
      case 'acd':
        return {
          rule_name: '',
          rule_description: '',
          channel_type: 'voice',
          routing_strategy: 'longest_idle',
          priority: 1,
          target_queue: 'General Support',
          is_active: true
        };
      case 'skill':
        return {
          agent_name: '',
          skill_name: '',
          skill_category: 'technical',
          proficiency_level: 3,
          is_active: true
        };
      case 'priority':
        return {
          priority_name: '',
          priority_description: '',
          priority_level: 1,
          boost_percentage: 10,
          is_active: true
        };
      case 'assignment':
        return {
          customer_name: '',
          agent_name: '',
          assignment_reason: 'manual',
          is_active: true
        };
      case 'campaign':
        return {
          campaign_name: '',
          campaign_description: '',
          dialer_type: 'preview',
          status: 'draft',
          target_agents: 5,
          max_call_attempts: 3
        };
      case 'callList':
        return {
          list_name: '',
          list_description: '',
          total_contacts: 0,
          status: 'active'
        };
      case 'forecast':
        return {
          forecast_date: new Date().toISOString().split('T')[0],
          hour_of_day: 9,
          predicted_volume: 100,
          predicted_aht_seconds: 300,
          confidence_score: 0.85
        };
      case 'schedule':
        return {
          agent_name: '',
          shift_date: new Date().toISOString().split('T')[0],
          shift_start_time: '09:00',
          shift_end_time: '17:00',
          schedule_status: 'scheduled'
        };
      case 'evaluation':
        return {
          agent_name: '',
          evaluator_name: '',
          evaluation_date: new Date().toISOString().split('T')[0],
          call_quality_score: 8,
          customer_service_score: 8,
          compliance_score: 9,
          overall_score: 8.3,
          status: 'completed'
        };
      default:
        return {};
    }
  };

  const getTableName = (type: ModalType): string => {
    const tables: Record<string, string> = {
      ivr: 'cc_ivr_menus',
      acd: 'cc_acd_routing_rules',
      skill: 'cc_agent_skills',
      priority: 'cc_routing_priorities',
      assignment: 'cc_sticky_agent_assignments',
      campaign: 'cc_dialer_campaigns',
      callList: 'cc_dialer_call_lists',
      forecast: 'cc_wem_forecasts',
      schedule: 'cc_wem_schedules',
      evaluation: 'cc_quality_evaluations'
    };
    return tables[type || ''] || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalType) return;

    const tableName = getTableName(modalType);
    const dataToSave = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingItem) {
        const { error } = await db
          .from(tableName)
          .update(dataToSave)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await db
          .from(tableName)
          .insert([dataToSave]);
        if (error) throw error;
      }
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const renderModalContent = () => {
    if (!modalType) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModal}>
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingItem ? 'Edit' : 'Create'} {getModalTitle(modalType)}
            </h3>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {renderFormFields()}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getModalTitle = (type: ModalType): string => {
    const titles: Record<string, string> = {
      ivr: 'IVR Menu',
      acd: 'ACD Routing Rule',
      skill: 'Agent Skill',
      priority: 'Routing Priority',
      assignment: 'Sticky Agent Assignment',
      campaign: 'Dialer Campaign',
      callList: 'Call List',
      forecast: 'Workforce Forecast',
      schedule: 'Agent Schedule',
      evaluation: 'Quality Evaluation'
    };
    return titles[type || ''] || '';
  };

  const renderFormFields = () => {
    switch (modalType) {
      case 'ivr':
        return (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Menu Name</label>
              <input
                type="text"
                value={formData.menu_name || ''}
                onChange={(e) => setFormData({ ...formData, menu_name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.menu_description || ''}
                onChange={(e) => setFormData({ ...formData, menu_description: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Greeting Text</label>
              <textarea
                value={formData.greeting_text || ''}
                onChange={(e) => setFormData({ ...formData, greeting_text: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                rows={3}
                required
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.use_conversational_ai || false}
                onChange={(e) => setFormData({ ...formData, use_conversational_ai: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Use Conversational AI</label>
            </div>
            {formData.use_conversational_ai && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">AI Model</label>
                <select
                  value={formData.ai_model || 'gpt-4'}
                  onChange={(e) => setFormData({ ...formData, ai_model: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Timeout (seconds)</label>
                <input
                  type="number"
                  value={formData.timeout_seconds || 5}
                  onChange={(e) => setFormData({ ...formData, timeout_seconds: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Max Retries</label>
                <input
                  type="number"
                  value={formData.max_retries || 3}
                  onChange={(e) => setFormData({ ...formData, max_retries: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Active</label>
            </div>
          </>
        );

      case 'acd':
        return (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Rule Name</label>
              <input
                type="text"
                value={formData.rule_name || ''}
                onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.rule_description || ''}
                onChange={(e) => setFormData({ ...formData, rule_description: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Channel Type</label>
              <select
                value={formData.channel_type || 'voice'}
                onChange={(e) => setFormData({ ...formData, channel_type: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              >
                <option value="voice">Voice</option>
                <option value="chat">Chat</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Routing Strategy</label>
              <select
                value={formData.routing_strategy || 'longest_idle'}
                onChange={(e) => setFormData({ ...formData, routing_strategy: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              >
                <option value="longest_idle">Longest Idle</option>
                <option value="round_robin">Round Robin</option>
                <option value="skill_based">Skill Based</option>
                <option value="least_utilized">Least Utilized</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Priority</label>
                <input
                  type="number"
                  value={formData.priority || 1}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Target Queue</label>
                <input
                  type="text"
                  value={formData.target_queue || ''}
                  onChange={(e) => setFormData({ ...formData, target_queue: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Active</label>
            </div>
          </>
        );

      case 'skill':
        return (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Agent Name</label>
              <input
                type="text"
                value={formData.agent_name || ''}
                onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Skill Name</label>
              <input
                type="text"
                value={formData.skill_name || ''}
                onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Skill Category</label>
              <select
                value={formData.skill_category || 'technical'}
                onChange={(e) => setFormData({ ...formData, skill_category: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              >
                <option value="technical">Technical</option>
                <option value="language">Language</option>
                <option value="product">Product</option>
                <option value="soft_skill">Soft Skill</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Proficiency Level (1-5)</label>
              <input
                type="number"
                value={formData.proficiency_level || 3}
                onChange={(e) => setFormData({ ...formData, proficiency_level: parseInt(e.target.value) })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                min="1"
                max="5"
                required
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Active</label>
            </div>
          </>
        );

      case 'priority':
        return (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Priority Name</label>
              <input
                type="text"
                value={formData.priority_name || ''}
                onChange={(e) => setFormData({ ...formData, priority_name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.priority_description || ''}
                onChange={(e) => setFormData({ ...formData, priority_description: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Priority Level</label>
                <input
                  type="number"
                  value={formData.priority_level || 1}
                  onChange={(e) => setFormData({ ...formData, priority_level: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Boost Percentage</label>
                <input
                  type="number"
                  value={formData.boost_percentage || 10}
                  onChange={(e) => setFormData({ ...formData, boost_percentage: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-gray-300 text-sm">Active</label>
            </div>
          </>
        );

      case 'campaign':
        return (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Campaign Name</label>
              <input
                type="text"
                value={formData.campaign_name || ''}
                onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.campaign_description || ''}
                onChange={(e) => setFormData({ ...formData, campaign_description: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Dialer Type</label>
              <select
                value={formData.dialer_type || 'preview'}
                onChange={(e) => setFormData({ ...formData, dialer_type: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              >
                <option value="preview">Preview</option>
                <option value="progressive">Progressive</option>
                <option value="predictive">Predictive</option>
                <option value="power">Power</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Target Agents</label>
                <input
                  type="number"
                  value={formData.target_agents || 5}
                  onChange={(e) => setFormData({ ...formData, target_agents: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Max Call Attempts</label>
                <input
                  type="number"
                  value={formData.max_call_attempts || 3}
                  onChange={(e) => setFormData({ ...formData, max_call_attempts: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </>
        );

      case 'evaluation':
        return (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Agent Name</label>
              <input
                type="text"
                value={formData.agent_name || ''}
                onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Evaluator Name</label>
              <input
                type="text"
                value={formData.evaluator_name || ''}
                onChange={(e) => setFormData({ ...formData, evaluator_name: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Evaluation Date</label>
              <input
                type="date"
                value={formData.evaluation_date || ''}
                onChange={(e) => setFormData({ ...formData, evaluation_date: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Call Quality (1-10)</label>
                <input
                  type="number"
                  value={formData.call_quality_score || 8}
                  onChange={(e) => setFormData({ ...formData, call_quality_score: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Service (1-10)</label>
                <input
                  type="number"
                  value={formData.customer_service_score || 8}
                  onChange={(e) => setFormData({ ...formData, customer_service_score: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Compliance (1-10)</label>
                <input
                  type="number"
                  value={formData.compliance_score || 9}
                  onChange={(e) => setFormData({ ...formData, compliance_score: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </>
        );

      default:
        return <div className="text-gray-400">Form not available for this type</div>;
    }
  };

  return (
    <>
      <ContactCenter onOpenModal={openModal} />
      {showModal && renderModalContent()}
    </>
  );
}
