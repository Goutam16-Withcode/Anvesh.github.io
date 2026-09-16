'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  Route,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  Info,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export interface GraphNode {
  id: string;
  label: string;
  type: 'SKILL' | 'ROLE';
  category: 'AI_ML' | 'DEVOPS' | 'SYSTEMS' | 'BACKEND' | 'DATABASE';
  x: number;
  y: number;
  demandScore: number; // 1 to 10
  salaryLiftUsd: number;
  isVerified?: boolean;
  isTarget?: boolean;
  description: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'PREREQUISITE' | 'REQUIRED_FOR' | 'COMPLEMENTARY';
  weight?: number;
}

const INITIAL_NODES: GraphNode[] = [
  // Roles
  {
    id: 'role_ai_eng',
    label: 'AI Platform Engineer',
    type: 'ROLE',
    category: 'AI_ML',
    x: 650,
    y: 180,
    demandScore: 9.8,
    salaryLiftUsd: 48000,
    isTarget: true,
    description: 'Builds high-throughput GPU inference pipelines, kernel dispatchers, and distributed model serving.',
  },
  {
    id: 'role_mlops',
    label: 'Lead MLOps Architect',
    type: 'ROLE',
    category: 'DEVOPS',
    x: 620,
    y: 420,
    demandScore: 9.2,
    salaryLiftUsd: 38000,
    isTarget: false,
    description: 'Automates distributed model training workflows, model registries, and Kubernetes microservices.',
  },
  {
    id: 'role_backend_sr',
    label: 'Senior Backend Engineer',
    type: 'ROLE',
    category: 'BACKEND',
    x: 150,
    y: 300,
    demandScore: 7.8,
    salaryLiftUsd: 0,
    isVerified: true,
    description: 'Current verified candidate baseline: REST/gRPC microservices, relational DBs, and async queues.',
  },

  // Skills - Languages & Foundation
  {
    id: 'skill_python',
    label: 'Python 3.12',
    type: 'SKILL',
    category: 'BACKEND',
    x: 280,
    y: 260,
    demandScore: 9.0,
    salaryLiftUsd: 12000,
    isVerified: true,
    description: 'Core runtime language, typing, memory management, and asynchronous event loops.',
  },
  {
    id: 'skill_fastapi',
    label: 'FastAPI',
    type: 'SKILL',
    category: 'BACKEND',
    x: 320,
    y: 360,
    demandScore: 7.5,
    salaryLiftUsd: 10000,
    isVerified: true,
    description: 'High-performance async ASGI microservices framework and automatic OpenAPI generation.',
  },
  {
    id: 'skill_pytorch',
    label: 'PyTorch Core',
    type: 'SKILL',
    category: 'AI_ML',
    x: 420,
    y: 200,
    demandScore: 9.4,
    salaryLiftUsd: 22000,
    isVerified: true,
    description: 'Dynamic neural network graphs, automatic differentiation (autograd), and tensor operations.',
  },
  {
    id: 'skill_cuda',
    label: 'CUDA Kernels',
    type: 'SKILL',
    category: 'AI_ML',
    x: 540,
    y: 120,
    demandScore: 9.9,
    salaryLiftUsd: 32000,
    description: 'Hardware thread blocks, shared memory allocation, and custom low-level GPU acceleration.',
  },
  {
    id: 'skill_triton',
    label: 'Triton Server',
    type: 'SKILL',
    category: 'AI_ML',
    x: 550,
    y: 240,
    demandScore: 8.8,
    salaryLiftUsd: 20000,
    description: 'Dynamic batching, concurrent model execution, and BLS backend scheduling.',
  },
  {
    id: 'skill_vllm',
    label: 'vLLM PagedAttention',
    type: 'SKILL',
    category: 'AI_ML',
    x: 480,
    y: 80,
    demandScore: 9.6,
    salaryLiftUsd: 24000,
    description: 'KV cache virtual memory management and continuous batching for LLM decoding throughput.',
  },
  {
    id: 'skill_docker',
    label: 'Docker & OCI',
    type: 'SKILL',
    category: 'DEVOPS',
    x: 280,
    y: 440,
    demandScore: 7.8,
    salaryLiftUsd: 9000,
    isVerified: true,
    description: 'Multi-stage container builds, rootless execution, and layer caching optimization.',
  },
  {
    id: 'skill_k8s',
    label: 'Kubernetes (K8s)',
    type: 'SKILL',
    category: 'DEVOPS',
    x: 440,
    y: 420,
    demandScore: 9.3,
    salaryLiftUsd: 21000,
    description: 'Container orchestration, DaemonSets, Helm charts, and custom CRD operators.',
  },
  {
    id: 'skill_ray',
    label: 'Ray Distributed',
    type: 'SKILL',
    category: 'AI_ML',
    x: 520,
    y: 340,
    demandScore: 8.9,
    salaryLiftUsd: 23000,
    description: 'Unified compute engine for scaling distributed AI training, tuning, and batch serving.',
  },
  {
    id: 'skill_qdrant',
    label: 'Qdrant Vector DB',
    type: 'SKILL',
    category: 'DATABASE',
    x: 380,
    y: 110,
    demandScore: 8.6,
    salaryLiftUsd: 14000,
    description: 'HNSW vector indexing, payload filters, and dense similarity retrieval at scale.',
  },
  {
    id: 'skill_go',
    label: 'Go (Golang)',
    type: 'SKILL',
    category: 'SYSTEMS',
    x: 360,
    y: 490,
    demandScore: 8.2,
    salaryLiftUsd: 15000,
    description: 'Goroutines, channels, memory-safe high-throughput networking services.',
  },
];

const INITIAL_EDGES: GraphEdge[] = [
  // Candidate role foundation
  { id: 'e1', source: 'role_backend_sr', target: 'skill_python', type: 'REQUIRED_FOR' },
  { id: 'e2', source: 'role_backend_sr', target: 'skill_fastapi', type: 'REQUIRED_FOR' },
  { id: 'e3', source: 'role_backend_sr', target: 'skill_docker', type: 'REQUIRED_FOR' },

  // Skill Prerequisite chains
  { id: 'e4', source: 'skill_python', target: 'skill_pytorch', type: 'PREREQUISITE' },
  { id: 'e5', source: 'skill_pytorch', target: 'skill_cuda', type: 'PREREQUISITE' },
  { id: 'e6', source: 'skill_cuda', target: 'skill_vllm', type: 'COMPLEMENTARY' },
  { id: 'e7', source: 'skill_pytorch', target: 'skill_triton', type: 'PREREQUISITE' },
  { id: 'e8', source: 'skill_python', target: 'skill_qdrant', type: 'COMPLEMENTARY' },

  // Cloud & DevOps chains
  { id: 'e9', source: 'skill_docker', target: 'skill_k8s', type: 'PREREQUISITE' },
  { id: 'e10', source: 'skill_k8s', target: 'skill_go', type: 'COMPLEMENTARY' },
  { id: 'e11', source: 'skill_k8s', target: 'skill_ray', type: 'PREREQUISITE' },
  { id: 'e12', source: 'skill_pytorch', target: 'skill_ray', type: 'COMPLEMENTARY' },

  // Target Role Connections
  { id: 'e13', source: 'skill_cuda', target: 'role_ai_eng', type: 'REQUIRED_FOR' },
  { id: 'e14', source: 'skill_triton', target: 'role_ai_eng', type: 'REQUIRED_FOR' },
  { id: 'e15', source: 'skill_vllm', target: 'role_ai_eng', type: 'REQUIRED_FOR' },
  { id: 'e16', source: 'skill_k8s', target: 'role_mlops', type: 'REQUIRED_FOR' },
  { id: 'e17', source: 'skill_ray', target: 'role_mlops', type: 'REQUIRED_FOR' },
];

export function InteractiveKnowledgeGraph() {
  const router = useRouter();
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(INITIAL_NODES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [highlightShortestPath, setHighlightShortestPath] = useState<boolean>(true);

  // Shortest path sequence from Backend Sr -> AI Platform Eng
  const shortestPathNodeIds = useMemo(() => {
    return new Set(['role_backend_sr', 'skill_python', 'skill_pytorch', 'skill_cuda', 'role_ai_eng']);
  }, []);

  const shortestPathEdgeIds = useMemo(() => {
    return new Set(['e1', 'e4', 'e5', 'e13']);
  }, []);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchCat = selectedCategory === 'ALL' || node.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [nodes, selectedCategory, searchQuery]);

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking canvas background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'graph-canvas') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 40, y: 30 });
  };

  const getNodeColor = (node: GraphNode) => {
    if (node.type === 'ROLE') {
      return node.isTarget
        ? 'fill-indigo-600 stroke-indigo-300'
        : 'fill-slate-800 stroke-slate-600';
    }
    if (node.isVerified) {
      return 'fill-emerald-600 stroke-emerald-300';
    }
    if (shortestPathNodeIds.has(node.id) && highlightShortestPath) {
      return 'fill-amber-500 stroke-amber-200';
    }
    return 'fill-slate-700 stroke-slate-500';
  };

  return (
    <div className="relative rounded-3xl bg-slate-950 border border-slate-800 shadow-premium overflow-hidden flex flex-col h-[740px]">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-none">
        {/* Search & Domain Filter Bar */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-card pointer-events-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ontology nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/80 text-white placeholder-slate-500 text-xs rounded-xl pl-8 pr-3 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500 w-44 sm:w-56 font-sans"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1 border-l border-slate-800 pl-2">
            {['ALL', 'AI_ML', 'DEVOPS', 'SYSTEMS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Shortest Path Toggle & Canvas Controls */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-card pointer-events-auto self-end md:self-auto">
          <button
            onClick={() => setHighlightShortestPath((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              highlightShortestPath
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-glow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Shortest Bridge Path</span>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div
        id="graph-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden relative"
      >
        <svg
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Subtle Grid Background Pattern */}
          <defs>
            <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.4" />
            </pattern>
            {/* Arrowhead marker */}
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="16"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#475569" />
            </marker>
            <marker
              id="arrowhead-highlight"
              markerWidth="8"
              markerHeight="6"
              refX="16"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
            </marker>
          </defs>

          <rect width="2000" height="1500" fill="url(#graph-grid)" />

          {/* Render Edges */}
          <g className="edges-layer">
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                highlightShortestPath && shortestPathEdgeIds.has(edge.id);

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#f59e0b' : '#334155'}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={edge.type === 'COMPLEMENTARY' ? '4,4' : undefined}
                    markerEnd={isHighlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'}
                    className="transition-colors duration-300"
                  />
                  {isHighlighted && (
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="#f59e0b"
                      strokeWidth={6}
                      opacity={0.3}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Render Nodes */}
          <g className="nodes-layer">
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHighlighted =
                highlightShortestPath && shortestPathNodeIds.has(node.id);
              const isRole = node.type === 'ROLE';
              const radius = isRole ? 28 : Math.max(16, Math.round(node.demandScore * 2.2));

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      r={radius + 8}
                      className="fill-transparent stroke-indigo-400 stroke-2 animate-pulse"
                    />
                  )}

                  {/* Highlight Glow Ring */}
                  {isHighlighted && (
                    <circle
                      r={radius + 5}
                      className="fill-transparent stroke-amber-400/80 stroke-2"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={radius}
                    strokeWidth={2.5}
                    className={`${getNodeColor(node)} transition-all duration-300 group-hover:scale-105`}
                  />

                  {/* Node Label Text */}
                  <text
                    y={radius + 16}
                    textAnchor="middle"
                    className={`text-[11px] font-mono select-none font-bold transition-colors ${
                      isSelected
                        ? 'fill-white font-extrabold'
                        : isHighlighted
                        ? 'fill-amber-300'
                        : 'fill-slate-300 group-hover:fill-white'
                    }`}
                  >
                    {node.label}
                  </text>

                  {/* Type Indicator Icon or Monogram */}
                  <text
                    y={4}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-white pointer-events-none"
                  >
                    {isRole ? 'ROLE' : `${node.demandScore.toFixed(0)}★`}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Bottom Node Inspector Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-premium text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`text-[10px] font-mono ${
                  selectedNode.type === 'ROLE'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {selectedNode.type} &bull; {selectedNode.category}
              </Badge>

              {selectedNode.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified in Resume
                </span>
              )}

              {selectedNode.isTarget && (
                <span className="inline-flex items-center gap-1 text-[10px] text-indigo-400 font-mono font-bold">
                  <Target className="w-3 h-3" />
                  Candidate Target Role
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white leading-snug">
              {selectedNode.label}
            </h3>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Market Salary Lift</span>
              <div className="text-base font-mono font-extrabold text-emerald-400">
                +${selectedNode.salaryLiftUsd.toLocaleString()}/yr
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => {
                router.push(`/what-if?skills=${encodeURIComponent(selectedNode.label)}`);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 h-9 shadow-glow"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Simulate Node</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
