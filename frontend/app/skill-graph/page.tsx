'use client';

import React from 'react';
import Link from 'next/link';
import {
  GitGraph,
  Route,
  Target,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Cpu,
  Compass,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InteractiveKnowledgeGraph } from '@/components/SkillGraph';

export default function SkillGraphPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-10">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-white via-indigo-50/30 to-brand-50/40 border border-slate-200/80 shadow-subtle overflow-hidden">
          {/* Subtle Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold">
                <GitGraph className="w-3.5 h-3.5" />
                15,400+ Node Canonical Skill & Role Bipartite Graph
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Interactive Skill & Role Knowledge Graph
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Explore the topological web connecting foundational proficiencies, hardware acceleration kernels, and target leadership destinations. Compute deterministic shortest bridge paths with zero hallucination.
              </p>
            </div>

            {/* Benchmark KPI Widget */}
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-subtle shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Shortest Transition</span>
                <div className="text-2xl font-mono font-extrabold text-indigo-600">
                  4 Hops (3.5 Months)
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold font-mono">
                  +$48,000 / yr Projected Delta
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 font-bold text-sm">
                <Route className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive SVG Knowledge Graph Component */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Network Topology & Directed Prerequisite DAG
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Pan &bull; Zoom &bull; Click Node to Inspect &bull; Drag to Reorganize
            </span>
          </div>

          <InteractiveKnowledgeGraph />
        </section>

        {/* Transition Strategy Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Prerequisite Graph Sequencing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ANVESH prevents learning stalls by checking in-degree dependencies. Attempting CUDA kernel optimization without PyTorch tensors increases study drop-off by 68%.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              High-Centrality Bridge Nodes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nodes such as <strong className="text-slate-900">Kubernetes</strong> and <strong className="text-slate-900">Ray</strong> have high betweenness centrality, simultaneously qualifying candidates for MLOps, AI Infrastructure, and Cloud Platforms.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Sub-Modular Shortest Path
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The golden animated trajectory highlights the minimal topological path from your verified Backend role to AI Platform Engineer, maximizing market efficiency.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
