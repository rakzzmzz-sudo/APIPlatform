"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { IVRNode, Connection } from '../../types/ivr';
import { useIVR } from '../../contexts/IVRContext';
import {
  Play, Hash, MessageCircle, Phone, GitBranch, Code, Shuffle,
  Globe, PhoneOff, Circle, ArrowRight, ArrowLeftRight
} from 'lucide-react';

const GRID_SIZE = 20;
const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

interface NodeConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const NODE_CONFIGS: Record<string, NodeConfig> = {
  start: {
    icon: Play,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50'
  },
  setParams: {
    icon: Hash,
    color: 'text-[#39FF14]',
    bgColor: 'bg-[#39FF14]/20',
    borderColor: 'border-[#39FF14]/50'
  },
  playMessage: {
    icon: MessageCircle,
    color: 'text-[#39FF14]',
    bgColor: 'bg-[#39FF14]/20',
    borderColor: 'border-[#39FF14]/50'
  },
  getDigits: {
    icon: Hash,
    color: 'text-[#39FF14]',
    bgColor: 'bg-[#39FF14]/20',
    borderColor: 'border-[#39FF14]/50'
  },
  playMenu: {
    icon: Phone,
    color: 'text-[#39FF14]',
    bgColor: 'bg-[#39FF14]/20',
    borderColor: 'border-[#39FF14]/50'
  },
  playConfirm: {
    icon: ArrowLeftRight,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50'
  },
  runScript: {
    icon: Code,
    color: 'text-[#39FF14]',
    bgColor: 'bg-[#39FF14]/20',
    borderColor: 'border-[#39FF14]/50'
  },
  switch: {
    icon: Shuffle,
    color: 'text-[#39FF14]',
    bgColor: 'bg-[#39FF14]/20',
    borderColor: 'border-[#39FF14]/20'
  },
  callAPI: {
    icon: Globe,
    color: 'text-[#39FF14]',
    bgColor: 'bg-[#39FF14]/20',
    borderColor: 'border-[#39FF14]/50'
  },
  endFlow: {
    icon: PhoneOff,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50'
  },
  connector: {
    icon: Circle,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/20',
    borderColor: 'border-slate-500/50'
  },
  jumperEntry: {
    icon: ArrowRight,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/50'
  },
  jumperExit: {
    icon: ArrowRight,
    color: 'text-[#39FF14]',
    bgColor: 'bg-[#39FF14]/20',
    borderColor: 'border-amber-500/50'
  }
};

interface CanvasNodeProps {
  node: IVRNode;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  hasError: boolean;
}

function CanvasNode({ node, isSelected, onClick, onDoubleClick, hasError }: CanvasNodeProps) {
  const config = NODE_CONFIGS[node.type] || NODE_CONFIGS.connector;
  const Icon = config.icon;

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div
        className={`h-full rounded-xl border-2 backdrop-blur-sm ${config.bgColor} ${
          hasError ? 'border-red-500' : config.borderColor
        } ${isSelected ? 'shadow-lg shadow-[#39FF14]/20' : ''} flex items-center gap-3 px-4 relative`}
      >
        {/* Node Icon */}
        <div className={`p-2 rounded-lg ${config.bgColor} ${hasError ? 'text-red-400' : config.color}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Node Content */}
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm truncate">{node.name}</div>
          {node.description && (
            <div className="text-slate-400 text-xs truncate">{node.description}</div>
          )}
        </div>

        {/* Connection Point */}
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900" />
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900" />
      </div>
    </div>
  );
}

interface IVRCanvasProps {
  onNodeDoubleClick?: (node: IVRNode) => void;
}

export default function IVRCanvas({ onNodeDoubleClick }: IVRCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    getCurrentPage,
    selectedNodes,
    selectNode,
    clearSelection,
    viewport,
    setViewport,
    validationErrors
  } = useIVR();

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const currentPage = getCurrentPage();
  const nodes = currentPage?.nodes || [];
  const connections = currentPage?.connections || [];

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      clearSelection();
    }
  }, [viewport, clearSelection]);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isPanning) {
      setViewport({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart, setViewport]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setConnectionStart(null);
  }, []);

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.25, Math.min(2, viewport.zoom * delta));
    setViewport({ zoom: newZoom });
  }, [viewport.zoom, setViewport]);

  // Draw connections
  const renderConnections = () => {
    return connections.map(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);

      if (!fromNode || !toNode) return null;

      const x1 = fromNode.position.x + NODE_WIDTH + viewport.x;
      const y1 = fromNode.position.y + NODE_HEIGHT / 2 + viewport.y;
      const x2 = toNode.position.x + viewport.x;
      const y2 = toNode.position.y + NODE_HEIGHT / 2 + viewport.y;

      const midX = (x1 + x2) / 2;

      return (
        <svg
          key={conn.id}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#39FF14" />
            </marker>
          </defs>
          <path
            d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
            stroke="#39FF14"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
            opacity="0.6"
          />
          {conn.label && (
            <text
              x={midX}
              y={(y1 + y2) / 2 - 5}
              fill="#94a3b8"
              fontSize="12"
              textAnchor="middle"
            >
              {conn.label}
            </text>
          )}
        </svg>
      );
    });
  };

  // Draw grid
  const renderGrid = () => {
    if (!canvasRef.current) return null;
    
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    
    const lines = [];
    const offsetX = viewport.x % (GRID_SIZE * viewport.zoom);
    const offsetY = viewport.y % (GRID_SIZE * viewport.zoom);
    
    // Vertical lines
    for (let x = offsetX; x < width; x += GRID_SIZE * viewport.zoom) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={1}
        />
      );
    }
    
    // Horizontal lines
    for (let y = offsetY; y < height; y += GRID_SIZE * viewport.zoom) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={1}
        />
      );
    }
    
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {lines}
      </svg>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Grid */}
      {renderGrid()}

      {/* Connections */}
      {renderConnections()}

      {/* Nodes */}
      <div
        className="absolute"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          zIndex: 2
        }}
      >
        {nodes.map(node => {
          const hasError = validationErrors.some(err => err.nodeId === node.id && err.type === 'error');
          
          return (
            <CanvasNode
              key={node.id}
              node={node}
              isSelected={selectedNodes.includes(node.id)}
              onClick={() => selectNode(node.id, false)}
              onDoubleClick={() => onNodeDoubleClick?.(node)}
              hasError={hasError}
            />
          );
        })}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs font-mono border border-white/10">
        {Math.round(viewport.zoom * 100)}%
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-slate-600 text-lg font-bold mb-2">Empty Canvas</div>
            <div className="text-slate-700 text-sm">Drag nodes from the toolbar to get started</div>
          </div>
        </div>
      )}
    </div>
  );
}
