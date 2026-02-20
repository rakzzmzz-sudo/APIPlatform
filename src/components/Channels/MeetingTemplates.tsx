import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import {
  FileText, Plus, Search, Eye, Edit2, Copy, Star,
  Coffee, DollarSign, TrendingUp, Code, Server,
  Briefcase, Users, MessageCircle, X, Check
} from 'lucide-react';

interface MeetingTemplate {
  id: string;
  template_name: string;
  template_description: string;
  template_category: string;
  icon_name: string;
  icon_color: string;
  is_default: boolean;
  is_system_template: boolean;
  sections_count: number;
  usage_count: number;
  created_at: string;
}

interface TemplateSection {
  id: string;
  section_title: string;
  section_description: string;
  section_order: number;
  section_type: string;
}

const categoryIcons: Record<string, any> = {
  casual: Coffee,
  sales: DollarSign,
  marketing: TrendingUp,
  technical: Code,
  it: Server,
  board: Briefcase,
  client: Users,
  friendly: MessageCircle,
};

const categoryColors: Record<string, string> = {
  casual: 'green',
  sales: 'red',
  marketing: 'purple',
  technical: 'blue',
  it: 'cyan',
  board: 'gray',
  client: 'blue',
  friendly: 'orange',
};

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  green: { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500' },
  red: { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500' },
  purple: { bg: 'bg-[#39FF14]/20', text: 'text-[#39FF14]', border: 'border-[#39FF14]' },
  blue: { bg: 'bg-[#39FF14]/20', text: 'text-[#39FF14]', border: 'border-[#39FF14]' },
  cyan: { bg: 'bg-[#39FF14]/20', text: 'text-[#39FF14]', border: 'border-[#39FF14]' },
  gray: { bg: 'bg-gray-600', text: 'text-gray-400', border: 'border-gray-600' },
  orange: { bg: 'bg-[#39FF14]/20', text: 'text-[#39FF14]', border: 'border-[#39FF14]' },
};

export default function MeetingTemplates() {
  const [templates, setTemplates] = useState<MeetingTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MeetingTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MeetingTemplate | null>(null);
  const [templateSections, setTemplateSections] = useState<TemplateSection[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'view' | 'edit'>('list');

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, searchQuery]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await db
        .from('meeting_templates')
        .select('*')
        .order('template_category')
        .order('template_name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.template_category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.template_name.toLowerCase().includes(query) ||
        t.template_description?.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const loadTemplateSections = async (templateId: string) => {
    try {
      const { data, error } = await db
        .from('meeting_template_sections')
        .select('*')
        .eq('template_id', templateId)
        .order('section_order');

      if (error) throw error;
      setTemplateSections(data || []);
    } catch (error) {
      console.error('Error loading template sections:', error);
    }
  };

  const handleViewTemplate = async (template: MeetingTemplate) => {
    setSelectedTemplate(template);
    await loadTemplateSections(template.id);
    setViewMode('view');
  };

  const handleEditTemplate = async (template: MeetingTemplate) => {
    setSelectedTemplate(template);
    await loadTemplateSections(template.id);
    setViewMode('edit');
  };

  const handleCopyTemplate = async (template: MeetingTemplate) => {
    console.log('Copying template:', template.template_name);
  };

  const categories = [
    { id: 'all', label: 'All Templates', icon: Star },
    { id: 'casual', label: 'Casual', icon: Coffee },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'it', label: 'It', icon: Server },
    { id: 'board', label: 'Board', icon: Briefcase },
    { id: 'client', label: 'Client', icon: Users },
    { id: 'friendly', label: 'Friendly', icon: MessageCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Templates...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'view' && selectedTemplate) {
    return (
      <div className="p-6">
        <button
          onClick={() => {
            setViewMode('list');
            setSelectedTemplate(null);
          }}
          className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
        >
          ← Back to Templates
        </button>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${colorClasses[selectedTemplate.icon_color].bg} rounded-lg flex items-center justify-center`}>
                {(() => {
                  const Icon = categoryIcons[selectedTemplate.template_category];
                  return Icon ? <Icon className="w-8 h-8 text-white" /> : <FileText className="w-8 h-8 text-white" />;
                })()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedTemplate.template_name}</h2>
                <p className="text-gray-400">{selectedTemplate.template_description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded capitalize">
                    {selectedTemplate.template_category}
                  </span>
                  {selectedTemplate.is_default && (
                    <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleEditTemplate(selectedTemplate)}
              className="bg-[#39FF14] text-white px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Template
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Template Sections ({templateSections.length})</h3>
            {templateSections.map((section) => (
              <div key={section.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{section.section_title}</h4>
                    {section.section_description && (
                      <p className="text-gray-400 text-sm">{section.section_description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded capitalize">
                        {section.section_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">Order: {section.section_order}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#012419] to-[#024d30] rounded-lg p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Meeting Templates
            </h1>
            <p className="text-[#39FF14]">
              Customize your meeting minutes documents
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-[#39FF14] px-6 py-3 rounded-lg font-semibold hover:bg-[#39FF14]/10 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#39FF14] w-5 h-5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = categoryIcons[template.template_category] || FileText;
          const colors = colorClasses[template.icon_color] || colorClasses.blue;

          return (
            <div
              key={template.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1">{template.template_name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded capitalize flex items-center gap-1">
                      {template.template_category === 'casual' && <Coffee className="w-3 h-3" />}
                      {template.template_category === 'sales' && <DollarSign className="w-3 h-3" />}
                      {template.template_category === 'marketing' && <TrendingUp className="w-3 h-3" />}
                      {template.template_category === 'technical' && <Code className="w-3 h-3" />}
                      {template.template_category === 'it' && <Server className="w-3 h-3" />}
                      {template.template_category === 'board' && <Briefcase className="w-3 h-3" />}
                      {template.template_category === 'client' && <Users className="w-3 h-3" />}
                      {template.template_category === 'friendly' && <MessageCircle className="w-3 h-3" />}
                      {template.template_category}
                    </span>
                    {template.is_default && (
                      <span className="px-2 py-0.5 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {template.template_description}
              </p>

              <div className="text-sm text-gray-500 mb-4">
                {template.sections_count} sections included
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewTemplate(template)}
                  className="flex-1 bg-[#39FF14]/20 text-[#39FF14] px-4 py-2 rounded-lg hover:bg-[#39FF14]/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="flex-1 bg-[#39FF14]/20 text-[#39FF14] px-4 py-2 rounded-lg hover:bg-[#39FF14]/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleCopyTemplate(template)}
                  className="bg-gray-700 text-gray-300 p-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Create your first meeting template to get started'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#39FF14] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#32e012] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Template</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sprint Planning Meeting"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the purpose of this template..."
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]">
                  <option value="casual">Casual</option>
                  <option value="sales">Sales</option>
                  <option value="marketing">Marketing</option>
                  <option value="technical">Technical</option>
                  <option value="it">IT</option>
                  <option value="board">Board</option>
                  <option value="client">Client</option>
                  <option value="friendly">Friendly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Set as default template</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                  }}
                  className="flex-1 bg-[#39FF14] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
