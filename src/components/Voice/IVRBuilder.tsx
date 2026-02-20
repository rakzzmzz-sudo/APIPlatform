"use client";

import React, { useState } from 'react';
import { IVRProvider, useIVR } from '../../contexts/IVRContext';
import IVRCanvas from './IVRCanvas';
import IVRToolbar from './IVRToolbar';
import IVRProperties from './IVRProperties';
import IVRProjectManager from './IVRProjectManager';
import { IVRNode, IVRProject } from '../../types/ivr';
import { X, Home } from 'lucide-react';

function BuilderContent() {
  const [mode, setMode] = useState<'list' | 'builder'>('list');
  const [selectedNode, setSelectedNode] = useState<IVRNode | null>(null);
  const { loadProject, createProject, project } = useIVR();

  const handleCreateNew = () => {
    createProject('New Workflow', 'Description of your workflow');
    setMode('builder');
  };

  const handleProjectSelect = (selectedProject: IVRProject) => {
    loadProject(selectedProject);
    setMode('builder');
  };

  const handleBackToList = () => {
    setMode('list');
    setSelectedNode(null);
  };

  const handleNodeDoubleClick = (node: IVRNode) => {
    setSelectedNode(node);
  };

  const handleCloseProperties = () => {
    setSelectedNode(null);
  };

  if (mode === 'list') {
    return (
      <div className="h-full bg-slate-900">
        <IVRProjectManager
          onProjectSelect={handleProjectSelect}
          onCreateNew={handleCreateNew}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-slate-900">
      {/* Toolbar */}
      <IVRToolbar />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-slate-800/50 border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to Projects</span>
          </button>
          
          <div className="text-center">
            <div className="text-white font-bold text-lg">
              {project?.name || 'Workflow Builder'}
            </div>
            <div className="text-slate-400 text-xs">
              {project?.description || 'Visual IVR Designer'}
            </div>
          </div>

          <div className="w-32" /> {/* Spacer */}
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <IVRCanvas onNodeDoubleClick={handleNodeDoubleClick} />
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <IVRProperties node={selectedNode} onClose={handleCloseProperties} />
      )}
    </div>
  );
}

export default function IVRBuilder() {
  return (
    <IVRProvider>
      <BuilderContent />
    </IVRProvider>
  );
}
