'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Check, 
  Compass
} from 'lucide-react';
import { ColourfulText } from './ui/colourful-text';

export function WhatIsSection() {
  return (
    <section id="platform" className="py-20 md:py-28 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/60 text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      
      {/* Soft Ambient Radial Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-gradient-to-r from-brand-100/40 via-indigo-100/30 to-emerald-100/30 blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-xs">
            <Compass className="w-4 h-4 text-brand-600 animate-spin-slow" />
            <span className="font-mono text-[11px] tracking-wide">अन्वेषण &bull; Inquiry &amp; Systematic Exploration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] flex items-center justify-center gap-3 flex-wrap">
            <span>What is</span>
            <ColourfulText text="ANVESH" />
            <span>?</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Derived from the Sanskrit word <strong className="text-slate-900 font-semibold">अन्वेषण (Anveṣaṇa)</strong> — meaning <strong className="text-brand-600 font-semibold">Inquiry, Deep Search &amp; Discovery</strong> — <span className="font-bold text-slate-900">ANVESH</span> is an AI career intelligence platform engineered to eliminate brittle keyword traps and black-box rejections in modern job search.
          </p>
        </div>

        {/* 2 Clean, Compact Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Legacy Job Portals (The Problem) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-7 sm:p-8 rounded-3xl bg-white border border-rose-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  Legacy Job Portals
                </span>
                <span className="text-xs font-mono font-medium text-rose-600/80 px-2.5 py-0.5 rounded-full bg-rose-50/60 border border-rose-100">
                  Brittle Search
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Keyword Matching &amp; Black-Box Reject Filters
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Traditional portals rely on exact string queries. If your resume says <code className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-mono text-xs border border-rose-200/60">&ldquo;K8s&rdquo;</code> instead of <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200">&ldquo;Kubernetes Orchestration&rdquo;</code>, naive ATS filters reject you automatically.
              </p>
            </div>

            {/* Short Bullet Points */}
            <ul className="space-y-3 pt-5 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <strong className="text-slate-900 font-semibold block text-xs">Zero Semantic Understanding:</strong>
                  <span className="text-slate-500 text-xs">Ignores adjacent engineering skills and transferable proficiencies.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <strong className="text-slate-900 font-semibold block text-xs">Ghost Jobs &amp; Promoted Spam:</strong>
                  <span className="text-slate-500 text-xs">Sponsored LinkedIn reposts open for 90+ days flood organic search.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <strong className="text-slate-900 font-semibold block text-xs">No Career Trajectory Insights:</strong>
                  <span className="text-slate-500 text-xs">No forward-looking insights or skill trajectory guidance.</span>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Card 2: ANVESH Platform (The Solution) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-brand-50/30 to-emerald-50/20 border-2 border-brand-200/90 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-extrabold shadow-xs">
                  ANVESH Platform
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                  Deterministic Engine
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Multi-Stage Recommendation &amp; Canonical Skill Graphs
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                ANVESH canonicalizes your skills into an ontological graph, retrieves candidates using dense vector similarity in Qdrant, ranks them with LightGBM, and diversifies via MMR.
              </p>
            </div>

            {/* Short Bullet Points */}
            <ul className="space-y-3 pt-5 border-t border-brand-100 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <strong className="text-slate-900 font-semibold block text-xs">15,400+ Skill Ontology:</strong>
                  <span className="text-slate-600 text-xs">Maps K8s &amp; Kubernetes to the same node.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <strong className="text-slate-900 font-semibold block text-xs">LightGBM Re-ranking:</strong>
                  <span className="text-slate-600 text-xs">TreeSHAP explainability without black boxes.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <strong className="text-slate-900 font-semibold block text-xs">Daily MNC &amp; Startup ATS Sync + What-If Simulator:</strong>
                  <span className="text-slate-600 text-xs">Day-by-day active openings across global hubs + live salary lift modeling.</span>
                </div>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* 4-Metric Proof Bar - Explicit Differentiation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-brand-600 font-mono">15,400+</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Ontology Nodes</div>
            <div className="text-[11px] text-slate-500 mt-0.5">vs. Naive keyword matches</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">&lt; 1.2ms</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Vector Search</div>
            <div className="text-[11px] text-slate-500 mt-0.5">vs. Slow manual boolean queries</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 font-mono">0%</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">LLM Hallucinations</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Strict schema-verified extraction</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-teal-600 font-mono">100%</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Explainable &amp; Deterministic</div>
            <div className="text-[11px] text-slate-500 mt-0.5">TreeSHAP vs. black-box ghosting</div>
          </div>
        </div>

      </div>
    </section>
  );
}
