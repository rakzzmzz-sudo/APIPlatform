"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { IVRProject, IVRNode, Connection, IVRPage, CanvasViewport, ValidationError, IVRContextState } from '../types/ivr';
import { validateIVRFlow } from '../utils/ivrValidator';

interface IVRContextValue extends IVRContextState {
  // Project actions
  createProject: (name: string, description?: string) => void;
  loadProject: (project: IVRProject) => void;
  updateProject: (updates: Partial<IVRProject>) => void;
  
  // Page actions
  addPage: (name: string) => void;
  deletePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  
  // Node actions
  addNode: (node: IVRNode) => void;
  updateNode: (nodeId: string, updates: Partial<IVRNode>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;
  
  // Connection actions
  addConnection: (connection: Connection) => void;
  deleteConnection: (connectionId: string) => void;
  
  // Selection actions
  selectNode: (nodeId: string, multi?: boolean) => void;
  clearSelection: () => void;
  
  // Clipboard actions
  copy: () => void;
  paste: (position?: { x: number; y: number }) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  
  // Viewport actions
  setViewport: (viewport: Partial<CanvasViewport>) => void;
  
  // Validation
  validate: () => ValidationError[];
  
  // Utility
  getCurrentPage: () => IVRPage | null;
  getSelectedNodes: () => IVRNode[];
}

const IVRContext = createContext<IVRContextValue | null>(null);

export function useIVR() {
  const context = useContext(IVRContext);
  if (!context) {
    throw new Error('useIVR must be used within IVRProvider');
  }
  return context;
}

interface IVRProviderProps {
  children: ReactNode;
}

export function IVRProvider({ children }: IVRProviderProps) {
  const [state, setState] = useState<IVRContextState>({
    project: null,
    currentPage: null,
    selectedNodes: [],
    clipboard: [],
    history: [],
    historyIndex: -1,
    viewport: { x: 0, y: 0, zoom: 1 },
    validationErrors: []
  });

  const saveToHistory = useCallback((project: IVRProject) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(project)));
      return {
        ...prev,
        history: newHistory.slice(-50), // Keep last 50 history items
        historyIndex: Math.min(newHistory.length - 1, 49)
      };
    });
  }, []);

  const createProject = useCallback((name: string, description?: string) => {
    const newProject: IVRProject = {
      id: `project_${Date.now()}`,
      name,
      description,
      pages: [{
        id: `page_${Date.now()}`,
        name: 'Main',
        nodes: [],
        connections: []
      }],
      variables: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft',
      version: 1
    };
    
    setState(prev => ({
      ...prev,
      project: newProject,
      currentPage: newProject.pages[0].id,
      selectedNodes: [],
      history: [newProject],
      historyIndex: 0
    }));
  }, []);

  const loadProject = useCallback((project: IVRProject) => {
    setState(prev => ({
      ...prev,
      project,
      currentPage: project.pages[0]?.id || null,
      selectedNodes: [],
      history: [project],
      historyIndex: 0
    }));
  }, []);

  const updateProject = useCallback((updates: Partial<IVRProject>) => {
    setState(prev => {
      if (!prev.project) return prev;
      const updatedProject = {
        ...prev.project,
        ...updates,
        updated_at: new Date().toISOString()
      };
      saveToHistory(updatedProject);
      return { ...prev, project: updatedProject };
    });
  }, [saveToHistory]);

  const getCurrentPage = useCallback((): IVRPage | null => {
    if (!state.project || !state.currentPage) return null;
    return state.project.pages.find(p => p.id === state.currentPage) || null;
  }, [state.project, state.currentPage]);

  const addPage = useCallback((name: string) => {
    setState(prev => {
      if (!prev.project) return prev;
      
      const newPage: IVRPage = {
        id: `page_${Date.now()}`,
        name,
        nodes: [],
        connections: []
      };
      
      const updatedProject = {
        ...prev.project,
        pages: [...prev.project.pages, newPage],
        updated_at: new Date().toISOString()
      };
      
      saveToHistory(updatedProject);
      
      return {
        ...prev,
        project: updatedProject,
        currentPage: newPage.id
      };
    });
  }, [saveToHistory]);

  const deletePage = useCallback((pageId: string) => {
    setState(prev => {
      if (!prev.project || prev.project.pages.length <= 1) return prev;
      
      const updatedPages = prev.project.pages.filter(p => p.id !== pageId);
      const updatedProject = {
        ...prev.project,
        pages: updatedPages,
        updated_at: new Date().toISOString()
      };
      
      saveToHistory(updatedProject);
      
      return {
        ...prev,
        project: updatedProject,
        currentPage: prev.currentPage === pageId ? updatedPages[0].id : prev.currentPage
      };
    });
  }, [saveToHistory]);

  const setCurrentPage = useCallback((pageId: string) => {
    setState(prev => ({
      ...prev,
      currentPage: pageId,
      selectedNodes: []
    }));
  }, []);

  const addNode = useCallback((node: IVRNode) => {
    setState(prev => {
      if (!prev.project || !prev.currentPage) return prev;
      
      const updatedPages = prev.project.pages.map(page => {
        if (page.id !== prev.currentPage) return page;
        return {
          ...page,
          nodes: [...page.nodes, node]
        };
      });
      
      const updatedProject = {
        ...prev.project,
        pages: updatedPages,
        updated_at: new Date().toISOString()
      };
      
      saveToHistory(updatedProject);
      
      return { ...prev, project: updatedProject };
    });
  }, [saveToHistory]);

  const updateNode = useCallback((nodeId: string, updates: Partial<IVRNode>) => {
    setState(prev => {
      if (!prev.project || !prev.currentPage) return prev;
      
      const updatedPages = prev.project.pages.map(page => {
        if (page.id !== prev.currentPage) return page;
        return {
          ...page,
          nodes: page.nodes.map(node =>
            node.id === nodeId ? { ...node, ...updates } : node
          )
        };
      });
      
      const updatedProject = {
        ...prev.project,
        pages: updatedPages,
        updated_at: new Date().toISOString()
      };
      
      saveToHistory(updatedProject);
      
      return { ...prev, project: updatedProject };
    });
  }, [saveToHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    setState(prev => {
      if (!prev.project || !prev.currentPage) return prev;
      
      const updatedPages = prev.project.pages.map(page => {
        if (page.id !== prev.currentPage) return page;
        return {
          ...page,
          nodes: page.nodes.filter(n => n.id !== nodeId),
          connections: page.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
        };
      });
      
      const updatedProject = {
        ...prev.project,
        pages: updatedPages,
        updated_at: new Date().toISOString()
      };
      
      saveToHistory(updatedProject);
      
      return {
        ...prev,
        project: updatedProject,
        selectedNodes: prev.selectedNodes.filter(id => id !== nodeId)
      };
    });
  }, [saveToHistory]);

  const deleteNodes = useCallback((nodeIds: string[]) => {
    nodeIds.forEach(id => deleteNode(id));
  }, [deleteNode]);

  const addConnection = useCallback((connection: Connection) => {
    setState(prev => {
      if (!prev.project || !prev.currentPage) return prev;
      
      const updatedPages = prev.project.pages.map(page => {
        if (page.id !== prev.currentPage) return page;
        
        // Check if connection already exists
        const exists = page.connections.some(
          c => c.from === connection.from && c.to === connection.to
        );
        
        if (exists) return page;
        
        return {
          ...page,
          connections: [...page.connections, connection]
        };
      });
      
      const updatedProject = {
        ...prev.project,
        pages: updatedPages,
        updated_at: new Date().toISOString()
      };
      
      saveToHistory(updatedProject);
      
      return { ...prev, project: updatedProject };
    });
  }, [saveToHistory]);

  const deleteConnection = useCallback((connectionId: string) => {
    setState(prev => {
      if (!prev.project || !prev.currentPage) return prev;
      
      const updatedPages = prev.project.pages.map(page => {
        if (page.id !== prev.currentPage) return page;
        return {
          ...page,
          connections: page.connections.filter(c => c.id !== connectionId)
        };
      });
      
      const updatedProject = {
        ...prev.project,
        pages: updatedPages,
        updated_at: new Date().toISOString()
      };
      
      saveToHistory(updatedProject);
      
      return { ...prev, project: updatedProject };
    });
  }, [saveToHistory]);

  const selectNode = useCallback((nodeId: string, multi = false) => {
    setState(prev => {
      if (multi) {
        const isSelected = prev.selectedNodes.includes(nodeId);
        return {
          ...prev,
          selectedNodes: isSelected
            ? prev.selectedNodes.filter(id => id !== nodeId)
            : [...prev.selectedNodes, nodeId]
        };
      }
      return { ...prev, selectedNodes: [nodeId] };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedNodes: [] }));
  }, []);

  const copy = useCallback(() => {
    const currentPage = getCurrentPage();
    if (!currentPage) return;
    
    const selectedNodesData = currentPage.nodes.filter(n =>
      state.selectedNodes.includes(n.id)
    );
    
    setState(prev => ({ ...prev, clipboard: selectedNodesData }));
  }, [getCurrentPage, state.selectedNodes]);

  const paste = useCallback((position?: { x: number; y: number }) => {
    if (state.clipboard.length === 0) return;
    
    const offset = position || { x: 50, y: 50 };
    const newNodes = state.clipboard.map(node => ({
      ...node,
      id: `node_${Date.now()}_${Math.random()}`,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y
      }
    }));
    
    newNodes.forEach(node => addNode(node));
  }, [state.clipboard, addNode]);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev;
      const newIndex = prev.historyIndex - 1;
      return {
        ...prev,
        project: prev.history[newIndex],
        historyIndex: newIndex
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      const newIndex = prev.historyIndex + 1;
      return {
        ...prev,
        project: prev.history[newIndex],
        historyIndex: newIndex
      };
    });
  }, []);

  const setViewport = useCallback((viewport: Partial<CanvasViewport>) => {
    setState(prev => ({
      ...prev,
      viewport: { ...prev.viewport, ...viewport }
    }));
  }, []);

  const validate = useCallback((): ValidationError[] => {
    if (!state.project) return [];
    const errors = validateIVRFlow(state.project);
    setState(prev => ({ ...prev, validationErrors: errors }));
    return errors;
  }, [state.project]);

  const getSelectedNodes = useCallback((): IVRNode[] => {
    const currentPage = getCurrentPage();
    if (!currentPage) return [];
    return currentPage.nodes.filter(n => state.selectedNodes.includes(n.id));
  }, [getCurrentPage, state.selectedNodes]);

  const value: IVRContextValue = {
    ...state,
    createProject,
    loadProject,
    updateProject,
    addPage,
    deletePage,
    setCurrentPage,
    addNode,
    updateNode,
    deleteNode,
    deleteNodes,
    addConnection,
    deleteConnection,
    selectNode,
    clearSelection,
    copy,
    paste,
    undo,
    redo,
    setViewport,
    validate,
    getCurrentPage,
    getSelectedNodes
  };

  return <IVRContext.Provider value={value}>{children}</IVRContext.Provider>;
}
