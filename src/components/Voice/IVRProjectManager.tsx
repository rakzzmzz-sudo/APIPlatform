"use client";

import React, { useState } from 'react';
import { useIVR } from '../../contexts/IVRContext';
import { Plus, Search, MoreVertical, Edit2, Copy, Trash2, Calendar, Activity } from 'lucide-react';
import { IVRProject } from '../../types/ivr';

interface IVRProjectManagerProps {
  onProjectSelect: (project: IVRProject) => void;
  onCreateNew: () => void;
}

export default function IVRProjectManager({ onProjectSelect, onCreateNew }: IVRProjectManagerProps) {
  // Sample IVR workflows for demonstration
  const [projects] = useState<IVRProject[]>([
    {
      id: 'ivr_sample_1',
      name: 'Customer Support Routing',
      description: 'Routes customers to appropriate departments based on their selection. Includes sales, support, and billing options.',
      pages: [
        {
          id: 'page_1',
          name: 'Main Menu',
          nodes: [
            { id: 'node_1', type: 'start', name: 'Start', position: { x: 100, y: 100 } },
            { id: 'node_2', type: 'playMenu', name: 'Main Menu', position: { x: 350, y: 100 }, messages: [], options: [], timeout: 5000, attempts: 3 },
            { id: 'node_3', type: 'endFlow', name: 'End Call', position: { x: 600, y: 100 }, endType: 'disconnect' }
          ],
          connections: [
            { id: 'conn_1', from: 'node_1', to: 'node_2' },
            { id: 'conn_2', from: 'node_2', to: 'node_3' }
          ]
        }
      ],
      variables: {},
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-17T14:30:00Z',
      status: 'active',
      version: 2
    },
    {
      id: 'ivr_sample_2',
      name: 'After Hours Support',
      description: 'Handles incoming calls outside business hours with AI-powered voicemail and emergency routing options.',
      pages: [
        {
          id: 'page_1',
          name: 'After Hours Flow',
          nodes: [
            { id: 'node_1', type: 'start', name: 'Start', position: { x: 100, y: 100 } },
            { id: 'node_2', type: 'playMessage', name: 'After Hours Message', position: { x: 350, y: 100 }, messages: [], loop: 1, bargeIn: true },
            { id: 'node_3', type: 'playConfirm', name: 'Emergency?', position: { x: 600, y: 100 }, messages: [], confirmKey: '1', cancelKey: '2', timeout: 5000 },
            { id: 'node_4', type: 'endFlow', name: 'Disconnect', position: { x: 850, y: 100 }, endType: 'disconnect' }
          ],
          connections: [
            { id: 'conn_1', from: 'node_1', to: 'node_2' },
            { id: 'conn_2', from: 'node_2', to: 'node_3' },
            { id: 'conn_3', from: 'node_3', to: 'node_4' }
          ]
        }
      ],
      variables: {},
      created_at: '2026-02-10T08:00:00Z',
      updated_at: '2026-02-16T16:45:00Z',
      status: 'active',
      version: 3
    },
    {
      id: 'ivr_sample_3',
      name: 'Account Verification Flow',
      description: 'Collects and verifies customer account information using DTMF input and API validation before routing to live agent.',
      pages: [
        {
          id: 'page_1',
          name: 'Verification',
          nodes: [
            { id: 'node_1', type: 'start', name: 'Start', position: { x: 100, y: 100 } },
            { id: 'node_2', type: 'getDigits', name: 'Get Account #', position: { x: 350, y: 100 }, messages: [], resultVariable: 'accountNumber', minDigits: 8, maxDigits: 10, timeout: 5000, attempts: 3 },
            { id: 'node_3', type: 'callAPI', name: 'Verify Account', position: { x: 600, y: 100 }, url: 'https://api.example.com/verify', method: 'POST', responseVariable: 'apiResponse', timeout: 30000 },
            { id: 'node_4', type: 'switch', name: 'Check Result', position: { x: 850, y: 100 }, variable: 'apiResponse', conditions: [], defaultAction: '' },
            { id: 'node_5', type: 'endFlow', name: 'Transfer to Agent', position: { x: 1100, y: 100 }, endType: 'transfer', transferNumber: '+1234567890' }
          ],
          connections: [
            { id: 'conn_1', from: 'node_1', to: 'node_2' },
            { id: 'conn_2', from: 'node_2', to: 'node_3' },
            { id: 'conn_3', from: 'node_3', to: 'node_4' },
            { id: 'conn_4', from: 'node_4', to: 'node_5' }
          ]
        }
      ],
      variables: { accountNumber: '', apiResponse: '' },
      created_at: '2026-02-12T12:00:00Z',
      updated_at: '2026-02-17T09:15:00Z',
      status: 'draft',
      version: 1
    },
    {
      id: 'ivr_sample_4',
      name: 'Multilingual Welcome',
      description: 'Detects caller language preference and routes to appropriate language-specific menu and support team.',
      pages: [
        {
          id: 'page_1',
          name: 'Language Selection',
          nodes: [
            { id: 'node_1', type: 'start', name: 'Start', position: { x: 100, y: 100 } },
            { id: 'node_2', type: 'playMenu', name: 'Language Menu', position: { x: 350, y: 100 }, messages: [], options: [], timeout: 5000, attempts: 3 },
            { id: 'node_3', type: 'runScript', name: 'Set Language', position: { x: 600, y: 100 }, script: '// Set language', variables: [] },
            { id: 'node_4', type: 'endFlow', name: 'Transfer', position: { x: 850, y: 100 }, endType: 'transfer' }
          ],
          connections: [
            { id: 'conn_1', from: 'node_1', to: 'node_2' },
            { id: 'conn_2', from: 'node_2', to: 'node_3' },
            { id: 'conn_3', from: 'node_3', to: 'node_4' }
          ]
        }
      ],
      variables: { selectedLanguage: 'en' },
      created_at: '2026-02-08T14:00:00Z',
      updated_at: '2026-02-17T11:20:00Z',
      status: 'active',
      version: 4
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">IVR Workflows</h2>
          <p className="text-slate-400">Manage your interactive voice response flows</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-wider shadow-lg shadow-[#39FF14]/30 flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Workflow
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
        />
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="glass-card p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#39FF14]/50 transition-all cursor-pointer group"
              onClick={() => onProjectSelect(project)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Nodes</div>
                  <div className="text-2xl font-bold text-white">
                    {project.pages.reduce((sum, page) => sum + page.nodes.length, 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Pages</div>
                  <div className="text-2xl font-bold text-white">{project.pages.length}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.updated_at).toLocaleDateString()}
                </div>
                <div
                  className={`px-2 py-1 rounded-full uppercase font-bold ${
                    project.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : project.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {project.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6 mx-auto">
            <Activity className="w-10 h-10 text-[#39FF14]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {searchTerm ? 'No workflows found' : 'No workflows yet'}
          </h3>
          <p className="text-slate-400 mb-6">
            {searchTerm
              ? 'Try adjusting your search term'
              : 'Create your first IVR workflow to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-wider shadow-lg shadow-[#39FF14]/30 flex items-center gap-2 transition-all mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create First Workflow
            </button>
          )}
        </div>
      )}
    </div>
  );
}
