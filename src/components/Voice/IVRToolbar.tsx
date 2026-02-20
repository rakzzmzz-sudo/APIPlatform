"use client";

import React, { useState } from 'react';
import { useIVR } from '../../contexts/IVRContext';
import {
  Play, Hash, MessageCircle, Phone, GitBranch, Code, Shuffle,
  Globe, PhoneOff, Circle, ArrowRight, ArrowLeftRight,
  ZoomIn, ZoomOut, Maximize2, Undo2, Redo2, Save, Download,
  Upload, Search, AlertCircle, CheckCircle
} from 'lucide-react';
import { IVRNode, NodeType } from '../../types/ivr';

interface NodePaletteItem {
  type: NodeType;
  label: string;
  icon: React.ElementType;
  category: 'flow' | 'interaction' | 'logic' | 'integration';
}

const NODE_PALETTE: NodePaletteItem[] = [
  { type: 'start', label: 'Start', icon: Play, category: 'flow' },
  { type: 'setParams', label: 'Set Parameters', icon: Hash, category: 'flow' },
  { type: 'playMessage', label: 'Play Message', icon: MessageCircle, category: 'interaction' },
  { type: 'getDigits', label: 'Get Digits', icon: Hash, category: 'interaction' },
  { type: 'playMenu', label: 'Play Menu', icon: Phone, category: 'interaction' },
  { type: 'playConfirm', label: 'Confirmation', icon: ArrowLeftRight, category: 'interaction' },
  { type: 'runScript', label: 'Run Script', icon: Code, category: 'logic' },
  { type: 'switch', label: 'Switch', icon: Shuffle, category: 'logic' },
  { type: 'callAPI', label: 'API Call', icon: Globe, category: 'integration' },
  { type: 'endFlow', label: 'End Flow', icon: PhoneOff, category: 'flow' },
  { type: 'connector', label: 'Connector', icon: Circle, category: 'flow' },
  { type: 'jumperEntry', label: 'Jump Entry', icon: ArrowRight, category: 'flow' },
  { type: 'jumperExit', label: 'Jump Exit', icon: ArrowRight, category: 'flow' }
];

interface IVRToolbarProps {
  onSave?: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

export default function IVRToolbar({ onSave, onExport, onImport }: IVRToolbarProps) {
  const {
    viewport,
    setViewport,
    undo,
    redo,
    history,
    historyIndex,
    addNode,
    validate,
    validationErrors,
    getCurrentPage
  } = useIVR();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showValidation, setShowValidation] = useState(false);

  const currentPage = getCurrentPage();
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Filter nodes based on search and category
  const filteredNodes = NODE_PALETTE.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || node.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle node creation
  const handleAddNode = (type: NodeType) => {
    const baseNode: Partial<IVRNode> = {
      id: `node_${Date.now()}`,
      name: NODE_PALETTE.find(n => n.type === type)?.label || type,
      position: { x: 100, y: 100 },
      type
    };

    // Add type-specific defaults
    let newNode: IVRNode;

    switch (type) {
      case 'start':
        newNode = { ...baseNode, type: 'start' } as IVRNode;
        break;
      case 'setParams':
        newNode = {
          ...baseNode,
          type: 'setParams',
          parameters: {},
          variables: {}
        } as IVRNode;
        break;
      case 'playMessage':
        newNode = {
          ...baseNode,
          type: 'playMessage',
          messages: [],
          loop: 1,
          bargeIn: true
        } as IVRNode;
        break;
      case 'getDigits':
        newNode = {
          ...baseNode,
          type: 'getDigits',
          messages: [],
          resultVariable: 'userInput',
          minDigits: 1,
          maxDigits: 1,
          timeout: 5000,
          attempts: 3
        } as IVRNode;
        break;
      case 'playMenu':
        newNode = {
          ...baseNode,
          type: 'playMenu',
          messages: [],
          options: [],
          timeout: 5000,
          attempts: 3
        } as IVRNode;
        break;
      case 'playConfirm':
        newNode = {
          ...baseNode,
          type: 'playConfirm',
          messages: [],
          confirmKey: '1',
          cancelKey: '2',
          timeout: 5000
        } as IVRNode;
        break;
      case 'runScript':
        newNode = {
          ...baseNode,
          type: 'runScript',
          script: '// Enter JavaScript code here',
          variables: []
        } as IVRNode;
        break;
      case 'switch':
        newNode = {
          ...baseNode,
          type: 'switch',
          variable: '',
          conditions: [],
          defaultAction: ''
        } as IVRNode;
        break;
      case 'callAPI':
        newNode = {
          ...baseNode,
          type: 'callAPI',
          url: '',
          method: 'GET',
          responseVariable: 'apiResponse',
          timeout: 30000
        } as IVRNode;
        break;
      case 'endFlow':
        newNode = {
          ...baseNode,
          type: 'endFlow',
          endType: 'disconnect'
        } as IVRNode;
        break;
      case 'connector':
        newNode = {
          ...baseNode,
          type: 'connector'
        } as IVRNode;
        break;
      case 'jumperEntry':
        newNode = {
          ...baseNode,
          type: 'jumperEntry',
          jumperName: 'jumper1'
        } as IVRNode;
        break;
      case 'jumperExit':
        newNode = {
          ...baseNode,
          type: 'jumperExit',
          jumperName: 'jumper1'
        } as IVRNode;
        break;
      default:
        return;
    }

    addNode(newNode);
  };

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out' | 'fit') => {
    if (direction === 'fit') {
      setViewport({ zoom: 1, x: 0, y: 0 });
    } else {
      const delta = direction === 'in' ? 1.2 : 0.8;
      const newZoom = Math.max(0.25, Math.min(2, viewport.zoom * delta));
      setViewport({ zoom: newZoom });
    }
  };

  // Handle validation
  const handleValidate = () => {
    validate();
    setShowValidation(true);
    setTimeout(() => setShowValidation(false), 3000);
  };

  const errorCount = validationErrors.filter(e => e.type === 'error').length;
  const warningCount = validationErrors.filter(e => e.type === 'warning').length;

  return (
    <div className="w-80 h-full bg-slate-900 border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-white font-bold text-lg mb-3">IVR Workflow Builder</h3>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('fit')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={onSave}
            className="flex-1 px-3 py-2 rounded-lg bg-[#39FF14] hover:bg-[#32e012] text-black text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleValidate}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            title="Validate Flow"
          >
            <AlertCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onExport}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onImport}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            title="Import"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Validation Results */}
      {showValidation && validationErrors.length > 0 && (
        <div className="p-4 bg-white/5 border-b border-white/10">
          <div className="text-white font-semibold text-sm mb-2">Validation Results</div>
          {errorCount > 0 && (
            <div className="text-red-400 text-xs flex items-center gap-2 mb-1">
              <AlertCircle className="w-3 h-3" />
              {errorCount} error{errorCount !== 1 ? 's' : ''}
            </div>
          )}
          {warningCount > 0 && (
            <div className="text-yellow-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {showValidation && validationErrors.length === 0 && (
        <div className="p-4 bg-green-500/10 border-b border-green-500/20">
          <div className="text-green-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            No validation errors
          </div>
        </div>
      )}

      {/* Node Palette */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'flow', 'interaction', 'logic', 'integration'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#39FF14] text-black'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Node List */}
        <div className="space-y-2">
          {filteredNodes.map(node => {
            const Icon = node.icon;
            return (
              <button
                key={node.type}
                onClick={() => handleAddNode(node.type)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#39FF14]/50 transition-all group"
              >
                <div className="p-2 rounded-lg bg-[#39FF14]/20 text-[#39FF14] group-hover:bg-[#39FF14]/20">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-white text-sm font-medium">{node.label}</span>
              </button>
            );
          })}
        </div>

        {filteredNodes.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-8">
            No nodes match your search
          </div>
        )}
      </div>

      {/* Stats */}
      {currentPage && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Nodes</div>
              <div className="text-xl font-bold text-white">{currentPage.nodes.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Connections</div>
              <div className="text-xl font-bold text-white">{currentPage.connections.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
