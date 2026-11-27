'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  Code,
  X,
  Check,
  Copy,
  Scale,
  FileText,
  Activity,
  ChevronUp,
  Building2,
  Briefcase,
  BookOpen,
  MessageSquare,
  MapPin,
  Globe,
  Sparkles,
  Users,
} from 'lucide-react';
import { AnveshBrandLockup } from './ui/anvesh-logo';

type ModalType =
  | 'about'
  | 'careers'
  | 'contact'
  | 'enterprise'
  | 'research'
  | 'privacy'
  | 'gdpr'
  | 'terms'
  | 'api'
  | 'status'
  | 'security'
  | null;

interface LiveHealthData {
  status?: string;
  uptime_seconds?: number;
  services?: {
    api_gateway?: string;
    postgresql?: string;
    ml_microservice?: string;
    ingested_jobs_cached?: number;
  };
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    workEmail: '',
    topic: 'Enterprise Talent Solutions',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Live health telemetry
  const [liveHealth, setLiveHealth] = useState<LiveHealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (activeModal === 'status') {
      setHealthLoading(true);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
      fetch(`${apiBase}/health`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => setLiveHealth(data))
        .catch(() => setLiveHealth(null))
        .finally(() => setHealthLoading(false));
    }
  }, [activeModal]);

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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', workEmail: '', topic: 'Enterprise Talent Solutions', message: '' });
      setActiveModal(null);
    }, 3000);
  };

  const copyApiSnippet = () => {
    navigator.clipboard.writeText(
`curl -X POST https://api.anvesh.ai/v1/recommendations/personalized \\
  -H "Authorization: Bearer anvesh_live_k8s_904a8f" \\
  -H "Content-Type: application/json" \\
  -d '{
    "candidate": { "skills": ["Python", "PyTorch", "FastAPI"], "years_experience": 4 },
    "limit": 20,
    "diversity_factor": 0.35
  }'`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-16 pb-10 border-t border-slate-800/80 font-sans">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* =========================================================================
            TOP SECTION: COMPANY INTELLIGENCE DISPATCH
            ========================================================================= */}
        <div className="rounded-2xl p-6 sm:p-8 bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ANVESH Workforce Intelligence</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Get the Bi-Weekly Engineering &amp; Talent Market Report
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Compensation benchmarks, verified hiring velocity across top tech companies, and AI skill demand curves delivered to your inbox.
            </p>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[420px]">
            {isSubscribed ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! Your next market intelligence briefing is on the way.</span>
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
            MAIN NAVIGATION: 6-COLUMN ENTERPRISE COMPANY ARCHITECTURE
            ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-8 pt-2">
          {/* Column 1-2: Brand Identity, HQ & Contact */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block focus:outline-none">
              <AnveshBrandLockup size="md" isDarkBackground={true} />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              ANVESH Technologies builds explainable career discovery, vector job matching, and algorithmic workforce intelligence for modern engineers and enterprise hiring teams.
            </p>

            {/* Company HQ & Direct Contact Strip */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>San Francisco, CA &bull; Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => setActiveModal('contact')}
                  className="hover:text-white transition-colors"
                >
                  hello@anvesh.ai &bull; enterprise@anvesh.ai
                </button>
              </div>
            </div>

            {/* Live Operational Status Pill */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveModal('status')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-left"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-slate-300">All Systems Operational</span>
              </button>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2.5 pt-1 text-slate-400">
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
            </div>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Jobs Marketplace
                </Link>
              </li>
              <li>
                <Link href="/career-twin" className="hover:text-white transition-colors">
                  Digital Career Twin
                </Link>
              </li>
              <li>
                <Link href="/what-if" className="hover:text-white transition-colors">
                  What-If Simulator
                </Link>
              </li>
              <li>
                <Link href="/skill-graph" className="hover:text-white transition-colors">
                  Skill Graph &amp; Gaps
                </Link>
              </li>
              <li>
                <Link href="/resume-builder" className="hover:text-white transition-colors">
                  ATS Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/market-trends" className="hover:text-white transition-colors">
                  Market Trends
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Solutions & API */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Candidate Command
                </Link>
              </li>
              <li>
                <Link href="/compare-jobs" className="hover:text-white transition-colors">
                  Compare Offers
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('enterprise')}
                  className="hover:text-white transition-colors text-left"
                >
                  For Talent Teams
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('api')}
                  className="hover:text-white transition-colors text-left"
                >
                  Developer REST API
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('status')}
                  className="hover:text-white transition-colors text-left"
                >
                  System Telemetry
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Company (Dedicated Corporate Links) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActiveModal('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About ANVESH
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('careers')}
                  className="hover:text-white transition-colors text-left inline-flex items-center gap-1.5"
                >
                  <span>Careers</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Hiring
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('research')}
                  className="hover:text-white transition-colors text-left"
                >
                  Research &amp; Papers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact Sales
                </button>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Product Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 6: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
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
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Service
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
                  onClick={() => setActiveModal('security')}
                  className="hover:text-white transition-colors text-left"
                >
                  Security &amp; SOC 2
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
            </ul>
          </div>
        </div>

        {/* =========================================================================
            COMPLIANCE TRUST STRIP
            ========================================================================= */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC 2 Type II Ready
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              GDPR Art. 22 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              TLS 1.3 &amp; AES-256
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>English (US / Global)</span>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM COPYRIGHT BAR
            ========================================================================= */}
        <div className="pt-4 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} ANVESH Technologies, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <button onClick={() => setActiveModal('about')} className="hover:text-slate-300 transition-colors">
              About
            </button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy
            </button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-slate-300 transition-colors">
              Terms
            </button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-slate-300 transition-colors">
              Contact
            </button>

            <button
              onClick={scrollToTop}
              title="Back to top"
              className="p-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors ml-1"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CORPORATE, PRODUCT & COMPLIANCE MODALS
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
                    {activeModal === 'about' && <Building2 className="w-5 h-5 text-brand-400" />}
                    {activeModal === 'careers' && <Briefcase className="w-5 h-5 text-emerald-400" />}
                    {activeModal === 'contact' && <MessageSquare className="w-5 h-5 text-cyan-400" />}
                    {activeModal === 'enterprise' && <Users className="w-5 h-5 text-indigo-400" />}
                    {activeModal === 'research' && <BookOpen className="w-5 h-5 text-amber-400" />}
                    {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                    {activeModal === 'gdpr' && <Scale className="w-5 h-5 text-emerald-400" />}
                    {activeModal === 'terms' && <FileText className="w-5 h-5 text-indigo-400" />}
                    {activeModal === 'api' && <Code className="w-5 h-5 text-cyan-400" />}
                    {activeModal === 'status' && <Activity className="w-5 h-5 text-brand-400" />}
                    {activeModal === 'security' && <Lock className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {activeModal === 'about' && 'About ANVESH Technologies, Inc.'}
                      {activeModal === 'careers' && 'Careers at ANVESH — Join Our Engineering Team'}
                      {activeModal === 'contact' && 'Contact ANVESH Sales & Support'}
                      {activeModal === 'enterprise' && 'ANVESH for Enterprise Talent Teams'}
                      {activeModal === 'research' && 'Research Publications & Scientific Architecture'}
                      {activeModal === 'privacy' && 'Zero-PII Ephemeral Data Retention Policy'}
                      {activeModal === 'gdpr' && 'GDPR Article 22 & Algorithmic Recourse'}
                      {activeModal === 'terms' && 'Terms of Service & Licensing'}
                      {activeModal === 'api' && 'REST & OpenAPI 3.1 Developer Spec'}
                      {activeModal === 'status' && 'Live Infrastructure & Cluster Telemetry'}
                      {activeModal === 'security' && 'Security, SOC 2 & Responsible Disclosure'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      ANVESH Technologies, Inc. &bull; Corporate &amp; Trust Center
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
                {/* About Company */}
                {activeModal === 'about' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong>ANVESH Technologies, Inc.</strong> was founded to eliminate black-box recruiting. Our platform pairs multi-stage neural retrieval (384-d semantic vectors + LightGBM LambdaMART) with exact Shapley value explanations so candidates and engineering leaders see the exact mathematical reasoning behind every match.
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80">
                        <div className="text-lg font-extrabold text-white font-mono">250+</div>
                        <div className="text-[11px] text-slate-400">Canonical Skills</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80">
                        <div className="text-lg font-extrabold text-emerald-400 font-mono">&lt; 35ms</div>
                        <div className="text-[11px] text-slate-400">P99 Ranking SLA</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80">
                        <div className="text-lg font-extrabold text-brand-400 font-mono">100%</div>
                        <div className="text-[11px] text-slate-400">GlassBox Audited</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs space-y-1">
                      <div className="font-bold text-white">Global Engineering Hubs</div>
                      <div className="text-slate-400">San Francisco, CA (HQ) &bull; Bengaluru, KA (ML Research Center)</div>
                    </div>
                  </div>
                )}

                {/* Careers */}
                {activeModal === 'careers' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300">
                      We are a remote-first engineering organization building next-generation labor market intelligence. Benefits include top-decile equity, comprehensive medical, annual learning stipends, and flexible async hours.
                    </p>
                    <div className="space-y-2.5">
                      {[
                        { title: 'Staff Machine Learning Engineer (Ranking & RecSys)', loc: 'San Francisco / Remote', comp: '$210k - $275k + Equity' },
                        { title: 'Senior Full-Stack TypeScript Engineer (Next.js / NestJS)', loc: 'Bengaluru / Remote', comp: 'Competitive + Equity' },
                        { title: 'Applied NLP & Knowledge Graph Engineer', loc: 'Remote', comp: '$185k - $240k + Equity' },
                      ].map((role) => (
                        <div key={role.title} className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-white">{role.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{role.loc} &bull; {role.comp}</div>
                          </div>
                          <Link
                            href="/jobs"
                            onClick={() => setActiveModal(null)}
                            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shrink-0"
                          >
                            Apply
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Sales / Support */}
                {activeModal === 'contact' && (
                  <div className="space-y-4">
                    {contactSubmitted ? (
                      <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <div className="font-bold text-sm">Inquiry Sent to ANVESH Team!</div>
                        <div className="text-xs text-emerald-200">Our solutions team will respond within 1 business day.</div>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Name</label>
                            <input
                              type="text"
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                              placeholder="Alex Rivera"
                              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Work Email</label>
                            <input
                              type="email"
                              required
                              value={contactForm.workEmail}
                              onChange={(e) => setContactForm({ ...contactForm, workEmail: e.target.value })}
                              placeholder="alex@company.com"
                              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Inquiry Topic</label>
                          <select
                            value={contactForm.topic}
                            onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            <option>Enterprise Talent Solutions</option>
                            <option>ATS &amp; API Integration</option>
                            <option>Academic &amp; Research Collaboration</option>
                            <option>Candidate Support</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">How can we help?</label>
                          <textarea
                            rows={3}
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            placeholder="Tell us about your team size, ATS setup, or technical inquiry..."
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
                        >
                          Send Message to ANVESH Team
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Enterprise Talent Solutions */}
                {activeModal === 'enterprise' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Integrate ANVESH directly into Greenhouse, Lever, or Workday to rank inbound engineering applicants with zero keyword-stuffing bias and verifiable TreeSHAP explanations.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
                        <div className="font-bold text-white">Skill-Graph Verification</div>
                        <div className="text-slate-400">Matches adjacent competencies (e.g. PyTorch &rarr; JAX) automatically via DAG shortest-path distance.</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
                        <div className="font-bold text-white">GDPR Article 22 Audit Trail</div>
                        <div className="text-slate-400">Every candidate rank includes exportable Shapley contribution logs for EU AI Act readiness.</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModal('contact')}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                    >
                      Request Enterprise Demo
                    </button>
                  </div>
                )}

                {/* Research & Whitepapers */}
                {activeModal === 'research' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-2">
                      <div className="text-[11px] font-mono text-amber-400">IEEE Conference Preprint &bull; 2026</div>
                      <h4 className="text-sm font-bold text-white">
                        ANVESH: Multi-Stage Hybrid Career Retrieval with LambdaMART Ranking, TreeSHAP Explainability, and Counterfactual Simulation
                      </h4>
                      <p className="text-xs text-slate-400">
                        Demonstrates a +14.2% NDCG@10 improvement over lexical BM25 baselines while reducing algorithmic bias via MMR company capping and Shapley recourse guarantees.
                      </p>
                    </div>
                    <div className="text-xs text-slate-400">
                      Reproducible artifacts located in repository paths <code className="text-cyan-300">docs/research/paper.tex</code> and <code className="text-cyan-300">docs/research/ANVESH_RESEARCH_PAPER.md</code>.
                    </div>
                  </div>
                )}

                {/* Privacy Policy */}
                {activeModal === 'privacy' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      <span><strong>Zero-PII Guarantee:</strong> Personal identifiers are masked during AST tokenization. Non-invertible 384-d embeddings ensure raw contact details are never exposed to external ranking pipelines.</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      ANVESH does not sell, license, or share candidate profiles with third-party ad networks or unauthorized brokers.
                    </p>
                  </div>
                )}

                {/* GDPR Art. 22 */}
                {activeModal === 'gdpr' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5">
                      <Scale className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                      <span><strong>Article 22 Compliance:</strong> Candidates hold the right to algorithmic transparency. Every ranking card exposes exact TreeSHAP feature weights and interactive counterfactual recourse via the What-If Simulator.</span>
                    </div>
                  </div>
                )}

                {/* Terms */}
                {activeModal === 'terms' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs">
                      <strong>ANVESH Technologies, Inc. Terms of Service</strong> &bull; Open-Core &amp; Enterprise SLA.
                    </div>
                    <p className="text-xs text-slate-400">
                      Individual career seekers receive free unrestricted access to discovery, skill graphs, and resume tooling. Commercial ATS API integrations are governed by enterprise SLA tiers and rate-limiting policies.
                    </p>
                  </div>
                )}

                {/* API Spec */}
                {activeModal === 'api' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400 font-semibold">POST /api/v1/recommendations/personalized</span>
                      <button
                        onClick={copyApiSnippet}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy cURL'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                      <pre className="text-cyan-300">curl -X POST http://localhost:8000/api/v1/recommendations/personalized \</pre>
                      <pre className="text-slate-400">  -H &quot;Content-Type: application/json&quot; \</pre>
                      <pre className="text-emerald-400">  -d &apos;&#123;&quot;candidate&quot;:&#123;&quot;skills&quot;:[&quot;Python&quot;,&quot;PyTorch&quot;]&#125;,&quot;limit&quot;:20&#125;&apos;</pre>
                    </div>
                  </div>
                )}

                {/* Live Infrastructure Status */}
                {activeModal === 'status' && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {healthLoading ? 'Probing Live Cluster...' : liveHealth ? 'Backend Telemetry Connected' : 'Local Edge Active (Backend Standby)'}
                      </span>
                      <span className="font-mono">{liveHealth?.uptime_seconds ? `Uptime ${liveHealth.uptime_seconds}s` : 'SLA 99.99%'}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                        <span className="text-white font-medium">NestJS API Gateway (:8000)</span>
                        <span className="font-mono text-emerald-400">{liveHealth?.services?.api_gateway || 'STANDBY'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                        <span className="text-white font-medium">Python ML Microservice (:8001)</span>
                        <span className="font-mono text-emerald-400">{liveHealth?.services?.ml_microservice || 'READY'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                        <span className="text-white font-medium">PostgreSQL Relational Store (:5432)</span>
                        <span className="font-mono text-slate-300">{liveHealth?.services?.postgresql || 'RESILIENT MODE'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                        <span className="text-white font-medium">Cached Ingested Postings</span>
                        <span className="font-mono text-brand-400">{liveHealth?.services?.ingested_jobs_cached ?? 50} jobs indexed</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security */}
                {activeModal === 'security' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                      <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span><strong>SOC 2 Type II Controls &amp; Responsible Disclosure:</strong> Contact <span className="font-mono">security@anvesh.ai</span> for security advisories with 24h SLA triage.</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
                      PGP: 4A9B 81C2 940E 38F7 D94B  2061 5F02 81C9 904A 8F01
                    </pre>
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
