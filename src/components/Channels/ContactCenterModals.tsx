import { X, Plus, Trash2, Upload, Music, Phone, Users, Settings as SettingsIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/db';

interface CustomerModalProps {
  show: boolean;
  customer: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CustomerModal({ show, customer, onClose, onSubmit }: CustomerModalProps) {
  const [tags, setTags] = useState<string[]>(customer?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [customFields, setCustomFields] = useState<Record<string, any>>(customer?.custom_fields || {});
  const [customFieldKey, setCustomFieldKey] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      customer_name: formData.get('customer_name'),
      primary_phone: formData.get('primary_phone'),
      primary_email: formData.get('primary_email'),
      preferred_channel: formData.get('preferred_channel'),
      customer_tier: formData.get('customer_tier'),
      lifetime_value: formData.get('lifetime_value') || '0.00',
      total_interactions: parseInt(formData.get('total_interactions') as string) || 0,
      average_satisfaction: formData.get('average_satisfaction') || '0.0',
      preferred_agent_name: formData.get('preferred_agent_name') || null,
      notes: formData.get('notes') || '',
      tags: tags,
      custom_fields: customFields
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addCustomField = () => {
    if (customFieldKey.trim() && customFieldValue.trim()) {
      setCustomFields({...customFields, [customFieldKey.trim()]: customFieldValue.trim()});
      setCustomFieldKey('');
      setCustomFieldValue('');
    }
  };

  const removeCustomField = (key: string) => {
    const updated = {...customFields};
    delete updated[key];
    setCustomFields(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name *</label>
              <input
                name="customer_name"
                type="text"
                required
                defaultValue={customer?.customer_name}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
              <input
                name="primary_phone"
                type="text"
                required
                defaultValue={customer?.primary_phone}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="+60123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <input
                name="primary_email"
                type="email"
                required
                defaultValue={customer?.primary_email}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Channel</label>
              <select
                name="preferred_channel"
                defaultValue={customer?.preferred_channel || 'voice'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="voice">Voice</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="rcs">RCS</option>
                <option value="chat">Chat</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Customer Tier</label>
              <select
                name="customer_tier"
                defaultValue={customer?.customer_tier || 'standard'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Lifetime Value (RM)</label>
              <input
                name="lifetime_value"
                type="number"
                step="0.01"
                defaultValue={customer?.lifetime_value || '0.00'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Total Interactions</label>
              <input
                name="total_interactions"
                type="number"
                defaultValue={customer?.total_interactions || 0}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Avg Satisfaction (0-5)</label>
              <input
                name="average_satisfaction"
                type="number"
                step="0.1"
                min="0"
                max="5"
                defaultValue={customer?.average_satisfaction || '0.0'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="0.0"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Agent</label>
              <input
                name="preferred_agent_name"
                type="text"
                defaultValue={customer?.preferred_agent_name || ''}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Agent name (optional)"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <textarea
                name="notes"
                rows={3}
                defaultValue={customer?.notes || ''}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Add notes about this customer..."
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Add tag (e.g., vip, priority, follow-up)"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1 bg-[#39FF14] text-white rounded-full text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Custom Fields</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customFieldKey}
                onChange={(e) => setCustomFieldKey(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Field name (e.g., account_number)"
              />
              <input
                type="text"
                value={customFieldValue}
                onChange={(e) => setCustomFieldValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomField())}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Field value"
              />
              <button
                type="button"
                onClick={addCustomField}
                className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />Add
              </button>
            </div>
            {Object.keys(customFields).length > 0 && (
              <div className="space-y-2">
                {Object.entries(customFields).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                    <div className="flex-1">
                      <span className="text-gray-400 text-sm">{key}:</span>
                      <span className="text-white ml-2">{String(value)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomField(key)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]"
            >
              {customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ACDRuleModalProps {
  show: boolean;
  rule: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ACDRuleModal({ show, rule, onClose, onSubmit }: ACDRuleModalProps) {
  if (!show) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      rule_name: formData.get('rule_name'),
      rule_description: formData.get('rule_description'),
      channel_type: formData.get('channel_type'),
      routing_strategy: formData.get('routing_strategy'),
      priority: parseInt(formData.get('priority') as string) || 5,
      target_queue: formData.get('target_queue') || null,
      is_active: formData.get('is_active') === 'true'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {rule ? 'Edit ACD Routing Rule' : 'Create New ACD Routing Rule'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rule Name *</label>
            <input
              name="rule_name"
              type="text"
              required
              defaultValue={rule?.rule_name}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              placeholder="VIP Customer Routing"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="rule_description"
              rows={3}
              defaultValue={rule?.rule_description}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              placeholder="Route VIP customers to specialized agents"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Channel Type *</label>
              <select
                name="channel_type"
                required
                defaultValue={rule?.channel_type || 'voice'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="voice">Voice</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="rcs">RCS</option>
                <option value="chat">Chat</option>
                <option value="email">Email</option>
                <option value="all">All Channels</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Routing Strategy *</label>
              <select
                name="routing_strategy"
                required
                defaultValue={rule?.routing_strategy || 'round_robin'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="round_robin">Round Robin</option>
                <option value="longest_idle">Longest Idle</option>
                <option value="skill_based">Skill Based</option>
                <option value="priority_based">Priority Based</option>
                <option value="least_occupied">Least Occupied</option>
                <option value="most_skilled">Most Skilled</option>
                <option value="sticky_agent">Sticky Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority (1-10) *</label>
              <input
                name="priority"
                type="number"
                min="1"
                max="10"
                required
                defaultValue={rule?.priority || 5}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Queue</label>
              <input
                name="target_queue"
                type="text"
                defaultValue={rule?.target_queue || ''}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Support Queue (optional)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              name="is_active"
              defaultValue={rule?.is_active !== undefined ? String(rule.is_active) : 'true'}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]"
            >
              {rule ? 'Update Rule' : 'Create Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AgentSkillModalProps {
  show: boolean;
  skill: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AgentSkillModal({ show, skill, onClose, onSubmit }: AgentSkillModalProps) {
  const [routingConfig, setRoutingConfig] = useState(skill?.routing_config || {
    enable_skill_routing: true,
    minimum_proficiency: 5,
    allow_overflow: true,
    overflow_proficiency: 3
  });

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      agent_name: formData.get('agent_name'),
      skill_name: formData.get('skill_name'),
      skill_category: formData.get('skill_category'),
      proficiency_level: parseInt(formData.get('proficiency_level') as string) || 5,
      is_active: formData.get('is_active') === 'true',
      routing_config: routingConfig
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {skill ? 'Edit Agent Skill' : 'Add New Agent Skill'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name *</label>
              <input
                name="agent_name"
                type="text"
                required
                defaultValue={skill?.agent_name}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Agent name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name *</label>
              <input
                name="skill_name"
                type="text"
                required
                defaultValue={skill?.skill_name}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Technical Support"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                name="skill_category"
                required
                defaultValue={skill?.skill_category || 'technical'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="technical">Technical</option>
                <option value="language">Language</option>
                <option value="product">Product Knowledge</option>
                <option value="soft_skills">Soft Skills</option>
                <option value="sales">Sales</option>
                <option value="support">Customer Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Proficiency Level (1-10) *</label>
              <input
                name="proficiency_level"
                type="number"
                min="1"
                max="10"
                required
                defaultValue={skill?.proficiency_level || 5}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="5"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                name="is_active"
                defaultValue={skill?.is_active !== undefined ? String(skill.is_active) : 'true'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-bold text-white mb-4">Skill-Based Routing Configuration</h4>
            <div className="space-y-4 bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Enable Skill-Based Routing</div>
                  <div className="text-gray-400 text-sm">Route interactions based on this skill</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={routingConfig.enable_skill_routing}
                    onChange={(e) => setRoutingConfig({...routingConfig, enable_skill_routing: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Proficiency Required</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={routingConfig.minimum_proficiency}
                  onChange={(e) => setRoutingConfig({...routingConfig, minimum_proficiency: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 (Beginner)</span>
                  <span className="text-[#39FF14] font-bold">Level {routingConfig.minimum_proficiency}</span>
                  <span>10 (Expert)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Allow Overflow Routing</div>
                  <div className="text-gray-400 text-sm">Route to lower proficiency if no match found</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={routingConfig.allow_overflow}
                    onChange={(e) => setRoutingConfig({...routingConfig, allow_overflow: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                </label>
              </div>

              {routingConfig.allow_overflow && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Overflow Minimum Proficiency</label>
                  <input
                    type="range"
                    min="1"
                    max={routingConfig.minimum_proficiency}
                    value={routingConfig.overflow_proficiency}
                    onChange={(e) => setRoutingConfig({...routingConfig, overflow_proficiency: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span className="text-yellow-400 font-bold">Level {routingConfig.overflow_proficiency}</span>
                    <span>{routingConfig.minimum_proficiency}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]"
            >
              {skill ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PriorityRuleModalProps {
  show: boolean;
  priority: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function PriorityRuleModal({ show, priority, onClose, onSubmit }: PriorityRuleModalProps) {
  const [conditions, setConditions] = useState(priority?.conditions || []);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      priority_name: formData.get('priority_name'),
      priority_description: formData.get('priority_description'),
      priority_level: parseInt(formData.get('priority_level') as string) || 5,
      boost_percentage: parseInt(formData.get('boost_percentage') as string) || 0,
      is_active: formData.get('is_active') === 'true',
      conditions: conditions,
      escalation_enabled: formData.get('escalation_enabled') === 'true',
      escalation_threshold_seconds: parseInt(formData.get('escalation_threshold_seconds') as string) || 300,
      apply_to_channels: formData.get('apply_to_channels')
    });
  };

  const addCondition = () => {
    setConditions([...conditions, { field: 'customer_tier', operator: 'equals', value: 'vip' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_: any, i: number) => i !== index));
  };

  const updateCondition = (index: number, field: string, value: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [field]: value };
    setConditions(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {priority ? 'Edit Priority Rule' : 'Create New Priority Rule'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority Name *</label>
              <input
                name="priority_name"
                type="text"
                required
                defaultValue={priority?.priority_name}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="VIP Customer Priority"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="priority_description"
                rows={2}
                defaultValue={priority?.priority_description}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Boost priority for VIP tier customers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority Level (1-10) *</label>
              <input
                name="priority_level"
                type="number"
                min="1"
                max="10"
                required
                defaultValue={priority?.priority_level || 5}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Boost Percentage (%) *</label>
              <input
                name="boost_percentage"
                type="number"
                min="0"
                max="100"
                required
                defaultValue={priority?.boost_percentage || 0}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Apply to Channels</label>
              <select
                name="apply_to_channels"
                defaultValue={priority?.apply_to_channels || 'all'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Channels</option>
                <option value="voice">Voice Only</option>
                <option value="chat">Chat Only</option>
                <option value="email">Email Only</option>
                <option value="messaging">Messaging (SMS/WhatsApp/RCS)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                name="is_active"
                defaultValue={priority?.is_active !== undefined ? String(priority.is_active) : 'true'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-bold text-white">Priority Conditions</h4>
              <button
                type="button"
                onClick={addCondition}
                className="px-3 py-1 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />Add Condition
              </button>
            </div>
            <div className="space-y-2">
              {conditions.length === 0 ? (
                <div className="bg-gray-900 p-4 rounded-lg text-center text-gray-400">
                  No conditions set. Add conditions to define when this priority applies.
                </div>
              ) : (
                conditions.map((condition: any, index: number) => (
                  <div key={index} className="bg-gray-900 p-3 rounded-lg flex items-center gap-2">
                    <select
                      value={condition.field}
                      onChange={(e) => updateCondition(index, 'field', e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="customer_tier">Customer Tier</option>
                      <option value="wait_time">Wait Time</option>
                      <option value="interaction_count">Interaction Count</option>
                      <option value="lifetime_value">Lifetime Value</option>
                      <option value="channel">Channel Type</option>
                    </select>
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="equals">Equals</option>
                      <option value="not_equals">Not Equals</option>
                      <option value="greater_than">Greater Than</option>
                      <option value="less_than">Less Than</option>
                      <option value="contains">Contains</option>
                    </select>
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="p-2 hover:bg-gray-700 rounded text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-bold text-white mb-4">Escalation Settings</h4>
            <div className="space-y-4 bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Enable Auto-Escalation</div>
                  <div className="text-gray-400 text-sm">Automatically increase priority after threshold</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="escalation_enabled"
                    value="true"
                    defaultChecked={priority?.escalation_enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Escalation Threshold (seconds)</label>
                <input
                  name="escalation_threshold_seconds"
                  type="number"
                  min="0"
                  step="30"
                  defaultValue={priority?.escalation_threshold_seconds || 300}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="300"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Escalate priority after waiting this many seconds
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]"
            >
              {priority ? 'Update Rule' : 'Create Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface IVRConfigModalProps {
  show: boolean;
  ivr: any;
  tenantId: string | undefined;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function IVRConfigModal({ show, ivr, tenantId, onClose, onSubmit }: IVRConfigModalProps) {
  const [menuOptions, setMenuOptions] = useState(ivr?.menu_structure || []);
  const [callQueues, setCallQueues] = useState<any[]>([]);
  const [acdRules, setAcdRules] = useState<any[]>([]);
  const [agentSkills, setAgentSkills] = useState<any[]>([]);
  const [mohFiles, setMohFiles] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(ivr?.skill_routing?.required_skills || []);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (show) {
      fetchRelatedData();
    }
  }, [show]);

  const fetchRelatedData = async () => {
    const [queuesRes, rulesRes, skillsRes, mohRes] = await Promise.all([
      db.from('cc_call_queues').select('*'),
      db.from('cc_acd_rules').select('*'),
      tenantId ? db.from('cc_agent_skills').select('*').eq('tenant_id', tenantId).eq('is_active', true) : db.from('cc_agent_skills').select('*').eq('is_active', true),
      db.from('cc_music_on_hold').select('*')
    ]);

    if (queuesRes.data) setCallQueues(queuesRes.data);
    if (rulesRes.data) setAcdRules(rulesRes.data);
    if (skillsRes.data) setAgentSkills(skillsRes.data);
    if (mohRes.data) setMohFiles(mohRes.data);
  };

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      ivr_name: formData.get('ivr_name'),
      phone_number: formData.get('phone_number'),
      greeting_message: formData.get('greeting_message'),
      greeting_file_url: formData.get('greeting_file_url'),
      timeout_seconds: parseInt(formData.get('timeout_seconds') as string) || 30,
      max_retries: parseInt(formData.get('max_retries') as string) || 3,
      is_active: formData.get('is_active') === 'true',
      menu_structure: menuOptions,
      music_on_hold_id: formData.get('music_on_hold_id') || null,
      call_queue_id: formData.get('call_queue_id') || null,
      acd_rule_id: formData.get('acd_rule_id') || null,
      enable_skill_routing: formData.get('enable_skill_routing') === 'true',
      skill_routing: {
        enabled: formData.get('enable_skill_routing') === 'true',
        required_skills: selectedSkills,
        minimum_proficiency: parseInt(formData.get('minimum_proficiency') as string) || 5,
        allow_overflow: formData.get('allow_overflow') === 'true'
      },
      business_hours: {
        enabled: formData.get('business_hours_enabled') === 'true',
        timezone: formData.get('timezone'),
        schedule: {
          monday: { start: formData.get('mon_start'), end: formData.get('mon_end') },
          tuesday: { start: formData.get('tue_start'), end: formData.get('tue_end') },
          wednesday: { start: formData.get('wed_start'), end: formData.get('wed_end') },
          thursday: { start: formData.get('thu_start'), end: formData.get('thu_end') },
          friday: { start: formData.get('fri_start'), end: formData.get('fri_end') },
          saturday: { start: formData.get('sat_start'), end: formData.get('sat_end') },
          sunday: { start: formData.get('sun_start'), end: formData.get('sun_end') }
        }
      },
      fallback_action: formData.get('fallback_action'),
      fallback_destination: formData.get('fallback_destination')
    });
  };

  const addMenuOption = () => {
    setMenuOptions([...menuOptions, {
      digit: '',
      action: 'transfer',
      destination: '',
      description: ''
    }]);
  };

  const removeMenuOption = (index: number) => {
    setMenuOptions(menuOptions.filter((_: any, i: number) => i !== index));
  };

  const updateMenuOption = (index: number, field: string, value: string) => {
    const updated = [...menuOptions];
    updated[index] = { ...updated[index], [field]: value };
    setMenuOptions(updated);
  };

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {ivr ? 'Edit IVR Configuration' : 'Configure New IVR'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-2 mb-6 border-b border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 font-medium ${activeTab === 'basic' ? 'text-[#39FF14] border-b-2 border-[#39FF14]' : 'text-gray-400 hover:text-white'}`}
          >
            <SettingsIcon className="w-4 h-4 inline mr-2" />Basic Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 font-medium ${activeTab === 'menu' ? 'text-[#39FF14] border-b-2 border-[#39FF14]' : 'text-gray-400 hover:text-white'}`}
          >
            <Phone className="w-4 h-4 inline mr-2" />Menu Options
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('routing')}
            className={`px-4 py-2 font-medium ${activeTab === 'routing' ? 'text-[#39FF14] border-b-2 border-[#39FF14]' : 'text-gray-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4 inline mr-2" />Routing & Queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 font-medium ${activeTab === 'advanced' ? 'text-[#39FF14] border-b-2 border-[#39FF14]' : 'text-gray-400 hover:text-white'}`}
          >
            <Music className="w-4 h-4 inline mr-2" />Advanced
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">IVR Name *</label>
                  <input
                    name="ivr_name"
                    type="text"
                    required
                    defaultValue={ivr?.ivr_name}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="Main Customer Support"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                  <input
                    name="phone_number"
                    type="text"
                    required
                    defaultValue={ivr?.phone_number}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="+60123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Greeting Message</label>
                <textarea
                  name="greeting_message"
                  rows={3}
                  defaultValue={ivr?.greeting_message}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Welcome to our support center. Please select from the following options..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Greeting Audio File URL</label>
                <div className="flex gap-2">
                  <input
                    name="greeting_file_url"
                    type="text"
                    defaultValue={ivr?.greeting_file_url}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="https://example.com/greeting.mp3"
                  />
                  <button type="button" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />Upload
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timeout (seconds)</label>
                  <input
                    name="timeout_seconds"
                    type="number"
                    min="5"
                    max="120"
                    defaultValue={ivr?.timeout_seconds || 30}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Retries</label>
                  <input
                    name="max_retries"
                    type="number"
                    min="1"
                    max="10"
                    defaultValue={ivr?.max_retries || 3}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  name="is_active"
                  defaultValue={ivr?.is_active !== undefined ? String(ivr.is_active) : 'true'}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-white">IVR Menu Options</h4>
                <button
                  type="button"
                  onClick={addMenuOption}
                  className="px-3 py-1 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />Add Option
                </button>
              </div>

              <div className="space-y-3">
                {menuOptions.length === 0 ? (
                  <div className="bg-gray-900 p-4 rounded-lg text-center text-gray-400">
                    No menu options configured. Add options to create your IVR menu.
                  </div>
                ) : (
                  menuOptions.map((option: any, index: number) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Digit</label>
                            <input
                              type="text"
                              value={option.digit}
                              onChange={(e) => updateMenuOption(index, 'digit', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                              placeholder="1"
                              maxLength={1}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Action</label>
                            <select
                              value={option.action}
                              onChange={(e) => updateMenuOption(index, 'action', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                            >
                              <option value="transfer">Transfer</option>
                              <option value="queue">Queue</option>
                              <option value="voicemail">Voicemail</option>
                              <option value="submenu">Sub-menu</option>
                              <option value="hangup">Hangup</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Destination</label>
                            <input
                              type="text"
                              value={option.destination}
                              onChange={(e) => updateMenuOption(index, 'destination', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                              placeholder="ext:100"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Description</label>
                            <input
                              type="text"
                              value={option.description}
                              onChange={(e) => updateMenuOption(index, 'description', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                              placeholder="Sales Department"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMenuOption(index)}
                          className="p-2 hover:bg-gray-700 rounded text-red-400 mt-5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'routing' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Music on Hold</label>
                <select
                  name="music_on_hold_id"
                  defaultValue={ivr?.music_on_hold_id || ''}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">None</option>
                  {mohFiles.map((moh) => (
                    <option key={moh.id} value={moh.id}>{moh.file_name} - {moh.category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Call Queue</label>
                <select
                  name="call_queue_id"
                  defaultValue={ivr?.call_queue_id || ''}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">No Queue</option>
                  {callQueues.map((queue) => (
                    <option key={queue.id} value={queue.id}>{queue.queue_name} ({queue.routing_strategy})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ACD Rule</label>
                <select
                  name="acd_rule_id"
                  defaultValue={ivr?.acd_rule_id || ''}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">No ACD Rule</option>
                  {acdRules.map((rule) => (
                    <option key={rule.id} value={rule.id}>{rule.rule_name} - {rule.routing_strategy}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-white font-medium">Enable Skill-Based Routing</div>
                    <div className="text-gray-400 text-sm">Route calls based on agent skills</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="enable_skill_routing"
                      value="true"
                      defaultChecked={ivr?.skill_routing?.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                  </label>
                </div>

                <div className="space-y-4 bg-gray-900 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {agentSkills.map((skill) => (
                        <label key={skill.id} className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill.skill_name)}
                            onChange={() => toggleSkill(skill.skill_name)}
                            className="rounded text-[#39FF14]"
                          />
                          <span className="text-sm text-white">{skill.skill_name}</span>
                          <span className="text-xs text-gray-400">({skill.skill_category})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Proficiency Level</label>
                    <input
                      name="minimum_proficiency"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={ivr?.skill_routing?.minimum_proficiency || 5}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium text-sm">Allow Overflow</div>
                      <div className="text-gray-400 text-xs">Route to lower proficiency if no match</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="allow_overflow"
                        value="true"
                        defaultChecked={ivr?.skill_routing?.allow_overflow}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-white font-medium">Business Hours</div>
                    <div className="text-gray-400 text-sm">Configure operating hours</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="business_hours_enabled"
                      value="true"
                      defaultChecked={ivr?.business_hours?.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                  </label>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      name="timezone"
                      defaultValue={ivr?.business_hours?.timezone || 'Asia/Kuala_Lumpur'}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur (MYT)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                      <option value="Asia/Bangkok">Asia/Bangkok (ICT)</option>
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                      <div key={day} className="space-y-2">
                        <div className="text-xs font-medium text-gray-400">{day.slice(0, 3)}</div>
                        <input
                          name={`${day.slice(0, 3).toLowerCase()}_start`}
                          type="time"
                          defaultValue="09:00"
                          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs"
                        />
                        <input
                          name={`${day.slice(0, 3).toLowerCase()}_end`}
                          type="time"
                          defaultValue="18:00"
                          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-lg font-bold text-white mb-4">Fallback Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fallback Action</label>
                    <select
                      name="fallback_action"
                      defaultValue={ivr?.fallback_action || 'voicemail'}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="voicemail">Send to Voicemail</option>
                      <option value="transfer">Transfer</option>
                      <option value="hangup">Hangup</option>
                      <option value="callback">Schedule Callback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fallback Destination</label>
                    <input
                      name="fallback_destination"
                      type="text"
                      defaultValue={ivr?.fallback_destination}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      placeholder="+60123456789"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012]"
            >
              {ivr ? 'Update IVR' : 'Create IVR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
