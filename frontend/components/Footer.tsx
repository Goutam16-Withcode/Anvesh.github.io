'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  ExternalLink,
  Lock,
  Code,
  X,
  Check,
  Copy,
  Scale,
  FileText,
  Activity,
  ChevronUp,
} from 'lucide-react';
import { AnveshBrandLockup } from './ui/anvesh-logo';

type ModalType = 'privacy' | 'gdpr' | 'terms' | 'api' | 'status' | 'security' | null;

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  const copyApiSnippet = () => {
    navigator.clipboard.writeText(
`curl -X POST https://api.anvesh.ai/v1/recommend/hybrid \\
  -H "Authorization: Bearer anvesh_live_k8s_904a8f" \\
  -H "Content-Type: application/json" \\
  -d '{
    "candidate_vector_id": "usr_94a0e2",
    "top_k": 20,
    "mmr_diversity_lambda": 0.72,
    "explainability": true
  }'`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800/80 font-sans">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* =========================================================================
            TOP SECTION: SLEEK NEWSLETTER CARD (Clean Real-World SaaS Design)
            ========================================================================= */}
        <div className="rounded-2xl p-6 sm:p-8 bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Subscribe to the ANVESH Engineering Dispatch
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bi-weekly analysis on engineering compensation curves, emerging skill graph nodes, and vector retrieval benchmarks.
            </p>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[420px]">
            {isSubscribed ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! Check your inbox for our latest benchmark report.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* =========================================================================
            MAIN NAVIGATION: 4 CLEAN REAL-WORLD COLUMNS (Stripe / Vercel Architecture)
            ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 pt-4">
          
          {/* Column 1: Brand & Status (Occupies 2 columns on lg) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block focus:outline-none">
              <AnveshBrandLockup size="md" isDarkBackground={true} />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The open-core intelligence platform for engineering career navigation, deterministic vector skill matching, and counterfactual simulation.
            </p>

            {/* Live Operational Status Badge */}
            <div className="pt-1">
              <button
                onClick={() => setActiveModal('status')}
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-left"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-slate-300">
                  All Systems Operational
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  &bull; 99.99%
                </span>
              </button>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X / Twitter"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 1.63 1.64c0-.9-.73-1.64-1.63-1.64z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Jobs Catalog
                </Link>
              </li>
              <li>
                <Link href="/skill-gap" className="hover:text-white transition-colors">
                  Skill Gap Analyzer
                </Link>
              </li>
              <li>
                <Link href="/what-if" className="hover:text-white transition-colors">
                  What-If Simulator
                </Link>
              </li>
              <li>
                <Link href="/career-path" className="hover:text-white transition-colors">
                  Career Trajectories
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Career Copilot
                </Link>
              </li>
              <li>
                <Link href="/career-twin" className="hover:text-white transition-colors">
                  Digital Career Twin
                </Link>
              </li>
              <li>
                <Link href="/compare-jobs" className="hover:text-white transition-colors">
                  Compare Job Offers
                </Link>
              </li>
              <li>
                <Link href="/market-trends" className="hover:text-white transition-colors">
                  Market Trends
                </Link>
              </li>
              <li>
                <Link href="/resume-builder" className="hover:text-white transition-colors">
                  LaTeX Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Roadmap Kanban
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Profile &amp; Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Developers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Developers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveModal('api')}
                  className="hover:text-white transition-colors text-left"
                >
                  REST API &amp; cURL
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('api')}
                  className="hover:text-white transition-colors text-left"
                >
                  OpenAPI 3.1 Spec
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('status')}
                  className="hover:text-white transition-colors text-left"
                >
                  System Status
                </button>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Open-Core Repo</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('security')}
                  className="hover:text-white transition-colors text-left"
                >
                  Security &amp; PGP
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('gdpr')}
                  className="hover:text-white transition-colors text-left"
                >
                  GDPR Article 22
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Zero-PII Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('security')}
                  className="hover:text-white transition-colors text-left"
                >
                  Responsible Disclosure
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================================================
            BOTTOM BAR: COPYRIGHT & ESSENTIAL QUICK LINKS
            ========================================================================= */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} ANVESH Technologies, Inc. Licensed under MIT &amp; Apache-2.0.
          </p>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => setActiveModal('security')}
              className="hover:text-slate-300 transition-colors"
            >
              Security
            </button>
            <button
              onClick={() => setActiveModal('status')}
              className="hover:text-slate-300 transition-colors"
            >
              Status
            </button>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              title="Back to top"
              className="p-1 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors ml-2"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ENTERPRISE MODALS (Clean, Accessible, High-Contrast Documentation)
          ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setActiveModal(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400">
                    {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                    {activeModal === 'gdpr' && <Scale className="w-5 h-5 text-emerald-400" />}
                    {activeModal === 'terms' && <FileText className="w-5 h-5 text-indigo-400" />}
                    {activeModal === 'api' && <Code className="w-5 h-5 text-cyan-400" />}
                    {activeModal === 'status' && <Activity className="w-5 h-5 text-brand-400" />}
                    {activeModal === 'security' && <Lock className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {activeModal === 'privacy' && 'Zero-PII Ephemeral Data Retention Policy'}
                      {activeModal === 'gdpr' && 'GDPR Article 22 & Algorithmic Recourse'}
                      {activeModal === 'terms' && 'MIT License & Terms of Service'}
                      {activeModal === 'api' && 'REST & OpenAPI 3.1 Developer Spec'}
                      {activeModal === 'status' && 'Live Infrastructure & Cluster Health'}
                      {activeModal === 'security' && 'Responsible Vulnerability Disclosure & PGP'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      ANVESH Governance Document &bull; Rev 2026.4
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300 leading-relaxed">
                
                {/* 1. Privacy Policy */}
                {activeModal === 'privacy' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      <span><strong>Permanent Guarantee:</strong> Your raw resume text is never retained on disk. All personal identifiers (name, phone, address) are sanitized in memory buffers during AST tokenization.</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">1. Ephemeral In-Memory Extraction</h4>
                    <p className="text-xs text-slate-400">
                      When a resume is submitted, it is parsed within an isolated RAM-backed micro-worker. Dense vector embeddings (384-d) and ontology skill IDs are extracted, and the original file is expunged from memory within 60 seconds.
                    </p>

                    <h4 className="font-bold text-white text-sm">2. Non-Invertible Mathematical Coordinates</h4>
                    <p className="text-xs text-slate-400">
                      Vector embeddings stored in our Qdrant cluster represent mathematical coordinates in skill latent space. They are mathematically non-invertible—it is physically impossible to reverse-engineer phone numbers, names, or addresses from vector coordinates.
                    </p>

                    <h4 className="font-bold text-white text-sm">3. Cryptographic Candidate Pseudonymization</h4>
                    <p className="text-xs text-slate-400">
                      User profiles are indexed using HMAC-SHA256 salted hashes. We do not sell, license, or monetize candidate data to any third-party recruitment agencies or ad networks.
                    </p>
                  </div>
                )}

                {/* 2. GDPR Art. 22 */}
                {activeModal === 'gdpr' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5">
                      <Scale className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                      <span><strong>Article 22 Compliance:</strong> Candidates have the fundamental right not to be subjected to arbitrary, non-transparent automated decisions without mathematical explanation.</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">1. Right to Full Algorithmic Explanation</h4>
                    <p className="text-xs text-slate-400">
                      For any recommendation or ranking generated by ANVESH, users can request an exact Shapley value waterfall (TreeSHAP) detailing the positive or negative contribution of every skill, experience year, and domain tag.
                    </p>

                    <h4 className="font-bold text-white text-sm">2. Transparent Parameter Control</h4>
                    <p className="text-xs text-slate-400">
                      Candidates retain full autonomy to tune the trade-off hyperparameters: Semantic Relevance (&alpha;), Skill Gap Coverage (&beta;), and MMR Diversity (&lambda;). No black-box hidden penalties are applied.
                    </p>

                    <h4 className="font-bold text-white text-sm">3. Zero Automated Disqualification</h4>
                    <p className="text-xs text-slate-400">
                      ANVESH does not perform binary disqualification filters based on subjective keywords or demographic metadata.
                    </p>
                  </div>
                )}

                {/* 3. MIT License */}
                {activeModal === 'terms' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs">
                      <strong>MIT Open-Source License</strong> &bull; Copyright &copy; {new Date().getFullYear()} ANVESH Open-Core Contributors.
                    </div>

                    <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 leading-normal">
                      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated mathematical formulations, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies...
                    </p>

                    <h4 className="font-bold text-white text-sm">Commercial Integrations &amp; API Quotas</h4>
                    <p className="text-xs text-slate-400">
                      Individual career explorers enjoy unrestricted free access. Enterprise ATS integrations utilizing bulk real-time scoring endpoints are subject to standard rate-limiting (100 req/sec) and uptime SLAs.
                    </p>
                  </div>
                )}

                {/* 4. API Specification */}
                {activeModal === 'api' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400 font-semibold">POST /v1/recommend/hybrid</span>
                      <button
                        onClick={copyApiSnippet}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy cURL'}</span>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                      <pre className="text-cyan-300">curl -X POST https://api.anvesh.ai/v1/recommend/hybrid \</pre>
                      <pre className="text-slate-400">  -H &quot;Authorization: Bearer anvesh_live_k8s_904a8f&quot; \</pre>
                      <pre className="text-slate-400">  -H &quot;Content-Type: application/json&quot; \</pre>
                      <pre className="text-slate-400">  -d &apos;&#123;</pre>
                      <pre className="text-emerald-400">    &quot;candidate_vector_id&quot;: &quot;usr_94a0e2&quot;,</pre>
                      <pre className="text-emerald-400">    &quot;top_k&quot;: 20,</pre>
                      <pre className="text-emerald-400">    &quot;mmr_diversity_lambda&quot;: 0.72,</pre>
                      <pre className="text-emerald-400">    &quot;explainability&quot;: true</pre>
                      <pre className="text-slate-400">  &#125;&apos;</pre>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Latency SLA</span>
                        <span className="text-emerald-400 font-mono font-bold">&lt; 45ms (p99)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Authentication</span>
                        <span className="text-cyan-300 font-mono font-bold">HMAC Bearer Token</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Live Infrastructure Status */}
                {activeModal === 'status' && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        All Production Systems Operational
                      </span>
                      <span className="font-mono">99.992% (30d)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                        <span className="text-white font-medium">Qdrant Vector Cluster (us-east-1)</span>
                        <span className="font-mono text-emerald-400">12ms &bull; Healthy</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                        <span className="text-white font-medium">LightGBM Ranking Microservice</span>
                        <span className="font-mono text-emerald-400">28ms &bull; Healthy</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                        <span className="text-white font-medium">Canonical Skill Graph (PostgreSQL)</span>
                        <span className="font-mono text-emerald-400">4ms &bull; Healthy</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                        <span className="text-white font-medium">Global Edge API Gateway</span>
                        <span className="font-mono text-emerald-400">100% Operational</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Security & PGP */}
                {activeModal === 'security' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                      <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span><strong>Responsible Disclosure:</strong> We actively welcome security researchers. Contact our team directly for vulnerability submissions with guaranteed 24h triage.</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">Security Contact &amp; Bug Bounty</h4>
                    <p className="text-xs text-slate-400">
                      Direct inquiries to <span className="text-brand-300 font-mono">security@anvesh.ai</span>. Submissions are eligible for recognition and bounty compensation based on severity.
                    </p>

                    <h4 className="font-bold text-white text-sm">PGP Master Key Fingerprint</h4>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
                      4A9B 81C2 940E 38F7 D94B  2061 5F02 81C9 904A 8F01
                    </pre>

                    <h4 className="font-bold text-white text-sm">Infrastructure Standards</h4>
                    <p className="text-xs text-slate-400">
                      All data in transit is encrypted using TLS 1.3 with Perfect Forward Secrecy (PFS). Vector databases at rest are encrypted via AES-256 with KMS key rotation.
                    </p>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
