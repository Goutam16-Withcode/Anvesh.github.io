'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Map,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Zap,
  Target,
  Trophy,
  Plus,
  GripVertical,
  Star,
  Tag,
  Layers,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Flame,
  TrendingUp,
  Calendar,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BarChart3,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────
type CardStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type Priority = 'CRITICAL' | 'HIGH' | 'RECOMMENDED';

interface KanbanCard {
  id: string;
  title: string;
  skill: string;
  category: string;
  status: CardStatus;
  priority: Priority;
  durationWeeks: number;
  resources: { title: string; type: string; url: string }[];
  targetOutcome: string;
  xp: number;
  expanded?: boolean;
}

interface KanbanColumn {
  id: CardStatus;
  label: string;
  color: string;
  icon: React.ReactNode;
}

// ─── Mock Data ────────────────────────────────────────────────────────
const INITIAL_CARDS: KanbanCard[] = [
  {
    id: 'c1',
    title: 'Master CUDA Kernel Optimization',
    skill: 'CUDA',
    category: 'AI Systems',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    durationWeeks: 4,
    xp: 500,
    targetOutcome: 'Reduce transformer inference latency by 3×',
    resources: [
      { title: 'CUDA Programming Guide', type: 'DOCS', url: '#' },
      { title: 'GPU Computing Gems', type: 'COURSE', url: '#' },
    ],
  },
  {
    id: 'c2',
    title: 'Build LightGBM LambdaMART Ranker',
    skill: 'LightGBM',
    category: 'ML Ranking',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    durationWeeks: 3,
    xp: 450,
    targetOutcome: 'Achieve NDCG@10 ≥ 0.94 on ranking benchmark',
    resources: [
      { title: 'LambdaMART Paper', type: 'PAPER', url: '#' },
      { title: 'LightGBM Official Docs', type: 'DOCS', url: '#' },
    ],
  },
  {
    id: 'c3',
    title: 'Deploy Qdrant HNSW Vector Index',
    skill: 'Qdrant',
    category: 'Vector DB',
    status: 'TODO',
    priority: 'CRITICAL',
    durationWeeks: 2,
    xp: 350,
    targetOutcome: 'Index 1M+ job embeddings with sub-2ms retrieval',
    resources: [
      { title: 'Qdrant Quickstart', type: 'DOCS', url: '#' },
      { title: 'HNSW Research Paper', type: 'PAPER', url: '#' },
    ],
  },
  {
    id: 'c4',
    title: 'Implement vLLM Inference Pipeline',
    skill: 'vLLM',
    category: 'LLM Serving',
    status: 'TODO',
    priority: 'HIGH',
    durationWeeks: 3,
    xp: 400,
    targetOutcome: 'Serve 70B LLM at 1000+ tokens/sec throughput',
    resources: [
      { title: 'vLLM GitHub', type: 'REPO', url: '#' },
      { title: 'PagedAttention Paper', type: 'PAPER', url: '#' },
    ],
  },
  {
    id: 'c5',
    title: 'FlashAttention-2 Integration',
    skill: 'FlashAttention',
    category: 'AI Optimization',
    status: 'TODO',
    priority: 'HIGH',
    durationWeeks: 2,
    xp: 300,
    targetOutcome: 'Cut transformer memory usage by 4× with exact attention',
    resources: [
      { title: 'FlashAttention-2 Paper', type: 'PAPER', url: '#' },
      { title: 'Tri Dao\'s Implementation', type: 'REPO', url: '#' },
    ],
  },
  {
    id: 'c6',
    title: 'Kubernetes Horizontal Pod Autoscaler',
    skill: 'Kubernetes',
    category: 'Infrastructure',
    status: 'TODO',
    priority: 'RECOMMENDED',
    durationWeeks: 2,
    xp: 200,
    targetOutcome: 'Configure HPA for ML inference pods under load',
    resources: [
      { title: 'K8s HPA Docs', type: 'DOCS', url: '#' },
      { title: 'Production Kubernetes', type: 'COURSE', url: '#' },
    ],
  },
  {
    id: 'c7',
    title: 'Hybrid BM25 + Dense Retrieval',
    skill: 'IR Systems',
    category: 'Search',
    status: 'TODO',
    priority: 'HIGH',
    durationWeeks: 3,
    xp: 380,
    targetOutcome: 'Achieve Recall@500 > 0.95 on evaluation set',
    resources: [
      { title: 'Pyserini BM25 Tutorial', type: 'DOCS', url: '#' },
      { title: 'Hybrid Retrieval Survey', type: 'PAPER', url: '#' },
    ],
  },
  {
    id: 'c8',
    title: 'LangGraph ReAct Agent',
    skill: 'LangGraph',
    category: 'AI Agents',
    status: 'DONE',
    priority: 'HIGH',
    durationWeeks: 3,
    xp: 420,
    targetOutcome: 'Multi-step agent with deterministic tool calling',
    resources: [
      { title: 'LangGraph Docs', type: 'DOCS', url: '#' },
      { title: 'ReAct Paper', type: 'PAPER', url: '#' },
    ],
  },
  {
    id: 'c9',
    title: 'TreeSHAP Explainability Pipeline',
    skill: 'SHAP',
    category: 'XAI',
    status: 'DONE',
    priority: 'CRITICAL',
    durationWeeks: 2,
    xp: 320,
    targetOutcome: 'Explain any LightGBM prediction with SHAP waterfall',
    resources: [
      { title: 'SHAP Library Docs', type: 'DOCS', url: '#' },
      { title: 'Interpretable ML Book', type: 'DOCS', url: '#' },
    ],
  },
];

const COLUMNS: KanbanColumn[] = [
  {
    id: 'TODO',
    label: 'To Learn',
    color: 'text-slate-600',
    icon: <Circle className="w-4 h-4" />,
  },
  {
    id: 'IN_PROGRESS',
    label: 'In Progress',
    color: 'text-brand-600',
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: 'DONE',
    label: 'Mastered',
    color: 'text-emerald-600',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; cls: string; dot: string }> = {
  CRITICAL: {
    label: 'Critical',
    cls: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  HIGH: {
    label: 'High',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  RECOMMENDED: {
    label: 'Recommended',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
};

const RESOURCE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  DOCS: { label: 'Docs', color: 'text-brand-600 bg-brand-50 border-brand-100' },
  COURSE: { label: 'Course', color: 'text-violet-600 bg-violet-50 border-violet-100' },
  PAPER: { label: 'Paper', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  REPO: { label: 'Repo', color: 'text-slate-600 bg-slate-50 border-slate-100' },
  LAB: { label: 'Lab', color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
};

function KanbanCardComponent({
  card,
  onMove,
  onToggleExpand,
}: {
  card: KanbanCard;
  onMove: (id: string, status: CardStatus) => void;
  onToggleExpand: (id: string) => void;
}) {
  const pCfg = PRIORITY_CONFIG[card.priority];

  const nextStatus: Record<CardStatus, CardStatus> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'DONE',
    DONE: 'TODO',
  };

  const statusBtn: Record<CardStatus, { label: string; icon: React.ReactNode; cls: string }> = {
    TODO: {
      label: 'Start',
      icon: <Play className="w-3 h-3" />,
      cls: 'bg-brand-600 text-white hover:bg-brand-700',
    },
    IN_PROGRESS: {
      label: 'Complete',
      icon: <CheckCircle2 className="w-3 h-3" />,
      cls: 'bg-emerald-600 text-white hover:bg-emerald-700',
    },
    DONE: {
      label: 'Redo',
      icon: <RotateCcw className="w-3 h-3" />,
      cls: 'bg-slate-200 text-slate-700 hover:bg-slate-300',
    },
  };

  const btn = statusBtn[card.status];

  return (
    <div
      className={cn(
        'bg-white border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md',
        card.status === 'DONE'
          ? 'border-emerald-100 opacity-80'
          : card.status === 'IN_PROGRESS'
          ? 'border-brand-200'
          : 'border-slate-100'
      )}
    >
      <div className="p-4">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
              {card.title}
            </div>
          </div>
          <button
            onClick={() => onToggleExpand(card.id)}
            className="text-slate-400 hover:text-slate-600 shrink-0 mt-0.5"
          >
            {card.expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border',
              pCfg.cls
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', pCfg.dot)} />
            {pCfg.label}
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <Tag className="w-2.5 h-2.5" />
            {card.skill}
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
            <Zap className="w-2.5 h-2.5" />
            {card.xp} XP
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {card.durationWeeks}w
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {card.category}
          </span>
        </div>

        {/* Expanded Content */}
        {card.expanded && (
          <div className="mb-3 space-y-3 border-t border-slate-100 pt-3">
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                <Target className="w-3 h-3 text-brand-500" />
                Target Outcome
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {card.targetOutcome}
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-brand-500" />
                Curated Resources
              </div>
              <div className="space-y-1">
                {card.resources.map((r, i) => {
                  const rCfg = RESOURCE_TYPE_CONFIG[r.type] ?? RESOURCE_TYPE_CONFIG.DOCS;
                  return (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-slate-700 hover:text-brand-600 group"
                    >
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-semibold border',
                          rCfg.color
                        )}
                      >
                        {rCfg.label}
                      </span>
                      <span className="group-hover:underline flex-1 truncate">{r.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onMove(card.id, nextStatus[card.status])}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
            btn.cls
          )}
        >
          {btn.icon}
          {btn.label}
        </button>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [cards, setCards] = useState<KanbanCard[]>(INITIAL_CARDS);
  const [filter, setFilter] = useState<Priority | 'ALL'>('ALL');

  const moveCard = (id: string, status: CardStatus) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const toggleExpand = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, expanded: !c.expanded } : c))
    );
  };

  const filteredCards = useMemo(
    () =>
      filter === 'ALL' ? cards : cards.filter((c) => c.priority === filter),
    [cards, filter]
  );

  const totalXP = cards.filter((c) => c.status === 'DONE').reduce((s, c) => s + c.xp, 0);
  const maxXP = cards.reduce((s, c) => s + c.xp, 0);
  const doneCount = cards.filter((c) => c.status === 'DONE').length;
  const inProgressCount = cards.filter((c) => c.status === 'IN_PROGRESS').length;
  const totalWeeks = cards
    .filter((c) => c.status !== 'DONE')
    .reduce((s, c) => s + c.durationWeeks, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-24">
        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-white border-b border-slate-100">
          <div className="absolute inset-0 bg-grid-slate opacity-40" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Link href="/dashboard" className="hover:text-brand-600 transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-medium">Learning Roadmap</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
                  <Map className="w-3.5 h-3.5" />
                  Personalized Career Roadmap
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Learning{' '}
                  <span className="gradient-text">Kanban Board</span>
                </h1>
                <p className="mt-2 text-slate-500 max-w-xl">
                  Your personalized upskilling roadmap with curated resources, XP tracking, and
                  milestone milestones — drag skills across columns to track progress.
                </p>
              </div>
              <Link href="/what-if">
                <Button className="bg-brand-600 hover:bg-brand-700 text-white shrink-0">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Simulate New Skills
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* ── Stats Bar ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'XP Earned',
                value: `${totalXP.toLocaleString()} / ${maxXP.toLocaleString()}`,
                icon: <Star className="w-5 h-5 text-amber-500 fill-amber-400" />,
                sub: `${Math.round((totalXP / maxXP) * 100)}% of total XP`,
                color: 'text-amber-600',
              },
              {
                label: 'Skills Mastered',
                value: `${doneCount} / ${cards.length}`,
                icon: <Trophy className="w-5 h-5 text-emerald-500" />,
                sub: `${inProgressCount} currently in progress`,
                color: 'text-emerald-600',
              },
              {
                label: 'Weeks Remaining',
                value: `~${totalWeeks}w`,
                icon: <Clock className="w-5 h-5 text-brand-500" />,
                sub: 'At 10 hrs/week effort',
                color: 'text-brand-600',
              },
              {
                label: 'Completion',
                value: `${Math.round((doneCount / cards.length) * 100)}%`,
                icon: <BarChart3 className="w-5 h-5 text-violet-500" />,
                sub: `${cards.length - doneCount} remaining`,
                color: 'text-violet-600',
              },
            ].map(({ label, value, icon, sub, color }) => (
              <div
                key={label}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  {icon}
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <div className={cn('text-xl font-black', color)}>{value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* ── XP Progress Bar ── */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-slate-900">Overall XP Progress</span>
              </div>
              <span className="text-sm font-bold text-amber-600">
                Level {Math.floor(totalXP / 500) + 1}
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
                style={{ width: `${(totalXP / maxXP) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1.5">
              <span>{totalXP.toLocaleString()} XP</span>
              <span>{maxXP.toLocaleString()} XP max</span>
            </div>
          </div>

          {/* ── Filter ── */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500 font-medium">Filter:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'RECOMMENDED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
                  filter === f
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:text-brand-600'
                )}
              >
                {f === 'ALL' ? 'All Skills' : PRIORITY_CONFIG[f].label}
              </button>
            ))}
          </div>

          {/* ── Kanban Board ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COLUMNS.map((col) => {
              const colCards = filteredCards.filter((c) => c.status === col.id);
              return (
                <div key={col.id} className="flex flex-col gap-3">
                  {/* Column Header */}
                  <div
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl border bg-white shadow-sm',
                      col.id === 'IN_PROGRESS'
                        ? 'border-brand-200 bg-brand-50'
                        : col.id === 'DONE'
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200'
                    )}
                  >
                    <div className={cn('flex items-center gap-2 font-bold text-sm', col.color)}>
                      {col.icon}
                      {col.label}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs font-bold"
                    >
                      {colCards.length}
                    </Badge>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3 min-h-[200px]">
                    {colCards.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                        <Circle className="w-8 h-8 opacity-30" />
                        <span className="text-xs">No items here</span>
                      </div>
                    )}
                    {colCards.map((card) => (
                      <KanbanCardComponent
                        key={card.id}
                        card={card}
                        onMove={moveCard}
                        onToggleExpand={toggleExpand}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Add Card Prompt ── */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-100 rounded-xl">
                <Plus className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900">
                  Add custom learning milestone
                </div>
                <div className="text-sm text-slate-500">
                  Use What-If simulator to discover new skills worth adding
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/skill-gap">
                <Button variant="outline" size="sm" className="border-brand-200 text-brand-700 hover:bg-brand-50">
                  <Target className="w-4 h-4 mr-1.5" />
                  Analyze Gaps
                </Button>
              </Link>
              <Link href="/what-if">
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white">
                  <Zap className="w-4 h-4 mr-1.5" />
                  What-If Sim
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
