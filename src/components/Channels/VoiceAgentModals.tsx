import { useState } from 'react';
import { db } from '../../lib/db';
import {
  X, Plus, Save, Trash2, AlertCircle, CheckCircle, Settings,
  Brain, MessageSquare, Zap, Clock, Volume2, Mic, Phone,
  Activity, TrendingUp, Users, BarChart3
} from 'lucide-react';

interface NewIntentModalProps {
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingIntent?: any;
}

export function NewIntentModal({ agentId, isOpen, onClose, onSave, editingIntent }: NewIntentModalProps) {
  const [formData, setFormData] = useState({
    intent_name: editingIntent?.intent_name || '',
    intent_display_name: editingIntent?.intent_display_name || '',
    intent_description: editingIntent?.intent_description || '',
    training_phrases: editingIntent?.training_phrases || [''],
    action_type: editingIntent?.action_type || 'respond',
    response_text: editingIntent?.response_text || '',
    priority: editingIntent?.priority || 5,
    is_active: editingIntent?.is_active !== undefined ? editingIntent.is_active : true
  });

  const handleSave = async () => {
    try {
      const intentData = {
        agent_id: agentId,
        ...formData,
        training_phrases: formData.training_phrases.filter((p: string) => p.trim() !== '')
      };

      if (editingIntent) {
        const { error } = await db
          .from('voice_agent_intents')
          .update(intentData)
          .eq('id', editingIntent.id);
        if (error) throw error;
      } else {
        const { error } = await db
          .from('voice_agent_intents')
          .insert(intentData);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      alert('Error saving intent: ' + error.message);
    }
  };

  const addTrainingPhrase = () => {
    setFormData({
      ...formData,
      training_phrases: [...formData.training_phrases, '']
    });
  };

  const updateTrainingPhrase = (index: number, value: string) => {
    const newPhrases = [...formData.training_phrases];
    newPhrases[index] = value;
    setFormData({ ...formData, training_phrases: newPhrases });
  };

  const removeTrainingPhrase = (index: number) => {
    const newPhrases = formData.training_phrases.filter((_: string, i: number) => i !== index);
    setFormData({ ...formData, training_phrases: newPhrases });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#39FF14]" />
              {editingIntent ? 'Edit Intent' : 'New Intent'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Intent Name (ID)
              </label>
              <input
                type="text"
                value={formData.intent_name}
                onChange={(e) => setFormData({ ...formData, intent_name: e.target.value })}
                placeholder="greeting_intent"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.intent_display_name}
                onChange={(e) => setFormData({ ...formData, intent_display_name: e.target.value })}
                placeholder="Greeting"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.intent_description}
              onChange={(e) => setFormData({ ...formData, intent_description: e.target.value })}
              placeholder="Describe what this intent handles..."
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-300">
                Training Phrases
              </label>
              <button
                onClick={addTrainingPhrase}
                className="text-[#39FF14] hover:text-[#39FF14] text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Phrase
              </button>
            </div>
            <div className="space-y-2">
              {formData.training_phrases.map((phrase: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={phrase}
                    onChange={(e) => updateTrainingPhrase(index, e.target.value)}
                    placeholder="Hello, Hi there, Good morning..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                  {formData.training_phrases.length > 1 && (
                    <button
                      onClick={() => removeTrainingPhrase(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Action Type
              </label>
              <select
                value={formData.action_type}
                onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
              >
                <option value="respond">Simple Response</option>
                <option value="function_call">Function Call</option>
                <option value="transfer">Transfer Call</option>
                <option value="end_call">End Call</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Priority (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
              />
            </div>
          </div>

          {formData.action_type === 'respond' && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Response Text
              </label>
              <textarea
                value={formData.response_text}
                onChange={(e) => setFormData({ ...formData, response_text: e.target.value })}
                placeholder="How can I help you today?"
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="intent-active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600"
            />
            <label htmlFor="intent-active" className="text-sm text-gray-300">
              Active
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 sticky bottom-0 bg-gray-800">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingIntent ? 'Save Changes' : 'Create Intent'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface NewToolModalProps {
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingTool?: any;
}

export function NewToolModal({ agentId, isOpen, onClose, onSave, editingTool }: NewToolModalProps) {
  const [formData, setFormData] = useState({
    tool_name: editingTool?.tool_name || '',
    tool_description: editingTool?.tool_description || '',
    http_method: editingTool?.http_method || 'POST',
    api_url: editingTool?.api_url || '',
    request_headers: editingTool?.request_headers || {},
    request_body_template: editingTool?.request_body_template || '',
    response_mapping: editingTool?.response_mapping || {},
    timeout_seconds: editingTool?.timeout_seconds || 30,
    retry_count: editingTool?.retry_count || 3,
    is_active: editingTool?.is_active !== undefined ? editingTool.is_active : true
  });

  const handleSave = async () => {
    try {
      const toolData = {
        agent_id: agentId,
        ...formData
      };

      if (editingTool) {
        const { error } = await db
          .from('voice_agent_tools')
          .update(toolData)
          .eq('id', editingTool.id);
        if (error) throw error;
      } else {
        const { error } = await db
          .from('voice_agent_tools')
          .insert(toolData);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      alert('Error saving tool: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              {editingTool ? 'Edit Tool' : 'New Tool'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Tool Name
            </label>
            <input
              type="text"
              value={formData.tool_name}
              onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
              placeholder="get_account_info"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.tool_description}
              onChange={(e) => setFormData({ ...formData, tool_description: e.target.value })}
              placeholder="Retrieves account information for the caller..."
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                HTTP Method
              </label>
              <select
                value={formData.http_method}
                onChange={(e) => setFormData({ ...formData, http_method: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Timeout (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={formData.timeout_seconds}
                onChange={(e) => setFormData({ ...formData, timeout_seconds: parseInt(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              API URL
            </label>
            <input
              type="text"
              value={formData.api_url}
              onChange={(e) => setFormData({ ...formData, api_url: e.target.value })}
              placeholder="https://api.example.com/accounts"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Request Body Template (JSON)
            </label>
            <textarea
              value={formData.request_body_template}
              onChange={(e) => setFormData({ ...formData, request_body_template: e.target.value })}
              placeholder='{"account_id": "{{account_id}}", "user_id": "{{user_id}}"}'
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Retry Count
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.retry_count}
                onChange={(e) => setFormData({ ...formData, retry_count: parseInt(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="tool-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <label htmlFor="tool-active" className="text-sm text-gray-300">
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 sticky bottom-0 bg-gray-800">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingTool ? 'Save Changes' : 'Create Tool'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface NewConfigurationModalProps {
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingConfig?: any;
}

export function NewConfigurationModal({ agentId, isOpen, onClose, onSave, editingConfig }: NewConfigurationModalProps) {
  const [formData, setFormData] = useState({
    configuration_name: editingConfig?.configuration_name || '',
    conversation_style: editingConfig?.conversation_style || 'professional',
    max_conversation_turns: editingConfig?.max_conversation_turns || 50,
    enable_interruption_handling: editingConfig?.enable_interruption_handling !== undefined ? editingConfig.enable_interruption_handling : true,
    enable_emotion_detection: editingConfig?.enable_emotion_detection !== undefined ? editingConfig.enable_emotion_detection : true,
    enable_background_noise_suppression: editingConfig?.enable_background_noise_suppression !== undefined ? editingConfig.enable_background_noise_suppression : true,
    silence_timeout_seconds: editingConfig?.silence_timeout_seconds || 3,
    voice_speed_multiplier: editingConfig?.voice_speed_multiplier || 1.0,
    voice_pitch_adjustment: editingConfig?.voice_pitch_adjustment || 0.0,
    enable_profanity_filter: editingConfig?.enable_profanity_filter !== undefined ? editingConfig.enable_profanity_filter : true,
    after_hours_message: editingConfig?.after_hours_message || '',
    personality_traits: editingConfig?.personality_traits || { friendly: 0.8, professional: 0.9, empathetic: 0.7, patient: 0.8 }
  });

  const handleSave = async () => {
    try {
      const configData = {
        agent_id: agentId,
        ...formData
      };

      if (editingConfig) {
        const { error } = await db
          .from('voice_agent_configurations')
          .update(configData)
          .eq('id', editingConfig.id);
        if (error) throw error;
      } else {
        const { error } = await db
          .from('voice_agent_configurations')
          .insert(configData);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      alert('Error saving configuration: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#39FF14]" />
              {editingConfig ? 'Edit Configuration' : 'New Configuration'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Configuration Name
            </label>
            <input
              type="text"
              value={formData.configuration_name}
              onChange={(e) => setFormData({ ...formData, configuration_name: e.target.value })}
              placeholder="Production Configuration"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
            />
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Conversation Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Conversation Style
                </label>
                <select
                  value={formData.conversation_style}
                  onChange={(e) => setFormData({ ...formData, conversation_style: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Max Conversation Turns
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={formData.max_conversation_turns}
                  onChange={(e) => setFormData({ ...formData, max_conversation_turns: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Voice Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Voice Speed (0.5 - 2.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="2.0"
                  value={formData.voice_speed_multiplier}
                  onChange={(e) => setFormData({ ...formData, voice_speed_multiplier: parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Voice Pitch (-5.0 to 5.0)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="-5.0"
                  max="5.0"
                  value={formData.voice_pitch_adjustment}
                  onChange={(e) => setFormData({ ...formData, voice_pitch_adjustment: parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Silence Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.silence_timeout_seconds}
                  onChange={(e) => setFormData({ ...formData, silence_timeout_seconds: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Feature Toggles</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enable_interruption_handling}
                  onChange={(e) => setFormData({ ...formData, enable_interruption_handling: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm text-gray-300">Enable Interruption Handling</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enable_emotion_detection}
                  onChange={(e) => setFormData({ ...formData, enable_emotion_detection: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm text-gray-300">Enable Emotion Detection</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enable_background_noise_suppression}
                  onChange={(e) => setFormData({ ...formData, enable_background_noise_suppression: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm text-gray-300">Enable Background Noise Suppression</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enable_profanity_filter}
                  onChange={(e) => setFormData({ ...formData, enable_profanity_filter: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm text-gray-300">Enable Profanity Filter</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              After Hours Message
            </label>
            <textarea
              value={formData.after_hours_message}
              onChange={(e) => setFormData({ ...formData, after_hours_message: e.target.value })}
              placeholder="Thank you for calling. Our business hours are..."
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 sticky bottom-0 bg-gray-800">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#39FF14] hover:bg-[#32e012] text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingConfig ? 'Save Changes' : 'Create Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface CallDetailModalProps {
  callId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CallDetailModal({ callId, isOpen, onClose }: CallDetailModalProps) {
  const [call, setCall] = useState<any>(null);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    if (isOpen && callId) {
      loadCallDetails();
    }
  });

  const loadCallDetails = async () => {
    setLoading(true);
    try {
      const [callRes, transcriptsRes, sentimentRes] = await Promise.all([
        db.from('voice_agent_calls').select('*').eq('id', callId).single(),
        db.from('voice_agent_transcripts').select('*').eq('call_id', callId).order('turn_number'),
        db.from('voice_agent_sentiment_analysis').select('*').eq('call_id', callId)
      ]);

      if (callRes.data) setCall(callRes.data);
      if (transcriptsRes.data) setTranscripts(transcriptsRes.data);
      if (sentimentRes.data) setSentiment(sentimentRes.data);
    } catch (error) {
      console.error('Error loading call details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Phone className="w-6 h-6 text-green-500" />
              Call Details
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="p-6 space-y-6">
            {call && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Status</div>
                  <div className={`text-sm font-semibold ${
                    call.call_status === 'completed' ? 'text-green-400' :
                    call.call_status === 'in_progress' ? 'text-[#39FF14]' : 'text-red-400'
                  }`}>
                    {call.call_status}
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Duration</div>
                  <div className="text-sm font-semibold text-white">
                    {Math.floor(call.call_duration_seconds / 60)}m {call.call_duration_seconds % 60}s
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Turns</div>
                  <div className="text-sm font-semibold text-white">{call.turn_count}</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Sentiment</div>
                  <div className={`text-sm font-semibold ${
                    call.sentiment_overall === 'positive' ? 'text-green-400' :
                    call.sentiment_overall === 'negative' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {call.sentiment_overall || 'N/A'}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Transcript
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transcripts.map((transcript) => (
                  <div
                    key={transcript.id}
                    className={`p-3 rounded-lg ${
                      transcript.speaker === 'agent' ? 'bg-[#39FF14]/10 border-l-4 border-[#39FF14]' :
                      'bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Turn {transcript.turn_number}</span>
                        <span className={`px-2 py-0.5 text-xs rounded font-semibold ${
                          transcript.speaker === 'agent' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {transcript.speaker}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{transcript.audio_duration_seconds.toFixed(1)}s</span>
                    </div>
                    <p className="text-white text-sm">{transcript.transcript_text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
