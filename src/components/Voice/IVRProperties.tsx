"use client";

import React, { useState } from 'react';
import { useIVR } from '../../contexts/IVRContext';
import { IVRNode } from '../../types/ivr';
import { X, AlertCircle } from 'lucide-react';

interface IVRPropertiesProps {
  node: IVRNode | null;
  onClose: () => void;
}

export default function IVRProperties({ node, onClose }: IVRPropertiesProps) {
  const { updateNode } = useIVR();
  const [localNode, setLocalNode] = useState<IVRNode | null>(node);

  if (!localNode) {
    return (
      <div className="w-80 h-full bg-slate-900 border-l border-white/10 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <div className="mb-2">No node selected</div>
          <div className="text-xs">Double-click a node to edit its properties</div>
        </div>
      </div>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    const updated = { ...localNode, [field]: value };
    setLocalNode(updated as IVRNode);
    updateNode(localNode.id, { [field]: value });
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-bold">Node Properties</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Properties */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Node Name
          </label>
          <input
            type="text"
            value={localNode.name}
            onChange={(e) => handleUpdate('name', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Description (Optional)
          </label>
          <textarea
            value={localNode.description || ''}
            onChange={(e) => handleUpdate('description', e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14] resize-none"
          />
        </div>

        {/* Type-Specific Properties */}
        {renderTypeSpecificProperties(localNode, handleUpdate)}
      </div>
    </div>
  );
}

function renderTypeSpecificProperties(node: IVRNode, handleUpdate: (field: string, value: any) => void) {
  switch (node.type) {
    case 'getDigits':
      return (
        <>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Result Variable
            </label>
            <input
              type="text"
              value={node.resultVariable}
              onChange={(e) => handleUpdate('resultVariable', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Min Digits
              </label>
              <input
                type="number"
                value={node.minDigits}
                onChange={(e) => handleUpdate('minDigits', parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Max Digits
              </label>
              <input
                type="number"
                value={node.maxDigits}
                onChange={(e) => handleUpdate('maxDigits', parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Timeout (ms)
            </label>
            <input
              type="number"
              value={node.timeout}
              onChange={(e) => handleUpdate('timeout', parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            />
          </div>
        </>
      );

    case 'runScript':
      return (
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            JavaScript Code
          </label>
          <textarea
            value={node.script}
            onChange={(e) => handleUpdate('script', e.target.value)}
            rows={10}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#39FF14] resize-none"
            placeholder="// Enter JavaScript code here"
          />
          <div className="mt-2 text-xs text-slate-500">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Use $variableName to access IVR variables
          </div>
        </div>
      );

    case 'switch':
      return (
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Variable to Switch On
          </label>
          <input
            type="text"
            value={node.variable}
            onChange={(e) => handleUpdate('variable', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            placeholder="$variableName"
          />
        </div>
      );

    case 'callAPI':
      return (
        <>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              API URL
            </label>
            <input
              type="url"
              value={node.url}
              onChange={(e) => handleUpdate('url', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              placeholder="https://api.example.com/endpoint"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              HTTP Method
            </label>
            <select
              value={node.method}
              onChange={(e) => handleUpdate('method', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Response Variable
            </label>
            <input
              type="text"
              value={node.responseVariable}
              onChange={(e) => handleUpdate('responseVariable', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            />
          </div>
        </>
      );

    case 'endFlow':
      return (
        <>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              End Type
            </label>
            <select
              value={node.endType}
              onChange={(e) => handleUpdate('endType', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              <option value="disconnect">Disconnect</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          {node.endType === 'transfer' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Transfer Number
              </label>
              <input
                type="tel"
                value={node.transferNumber || ''}
                onChange={(e) => handleUpdate('transferNumber', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                placeholder="+1234567890"
              />
            </div>
          )}
        </>
      );

    case 'jumperEntry':
    case 'jumperExit':
      return (
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Jumper Name
          </label>
          <input
            type="text"
            value={node.jumperName}
            onChange={(e) => handleUpdate('jumperName', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            placeholder="jumper1"
          />
        </div>
      );

    default:
      return (
        <div className="text-center text-slate-500 text-sm py-4">
          No additional properties for this node type
        </div>
      );
  }
}
