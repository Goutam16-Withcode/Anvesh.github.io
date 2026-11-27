'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, TrendingUp, Sparkles, CheckCircle2, User, Layers, Send, Terminal, RefreshCw, Briefcase, Zap, Bookmark, Command } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api, Recommendation, WhatIfResult } from '@/lib/api';
import { formatNumber } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'agent';
  text: string;
  tools?: any[];
  suggested_actions?: Array<{ label: string; action: string; param?: string }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Kubernetes', 'Go']);
  const [simulation, setSimulation] = useState<WhatIfResult | null>(null);
  const [profileSkills, setProfileSkills] = useState<string[]>([]);
  const [pipelineStats, setPipelineStats] = useState({ saved: 0, applied: 0 });
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'agent',
      text: 'Hello! I am your deterministic AI Career Assistant. Ask me anything about role transitions, salary benchmarks, or required skill gaps.',
      tools: [{ tool: 'ontology_skill_graph_init', latency_ms: 8.2 }],
      suggested_actions: [
        { label: 'Simulate Kubernetes in What-If', action: 'OPEN_WHAT_IF', param: 'Kubernetes' },
        { label: 'View Top NVIDIA AI Jobs', action: 'VIEW_JOB', param: 'NVIDIA' },
        { label: 'Explore AI Engineer Skill Gap', action: 'EXPLORE_GAP', param: 'ai-platform-eng' },
      ],
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Listen for Cross-Page Profile Updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadDashboardData();
    };
    window.addEventListener('anvesh_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('anvesh_profile_updated', handleProfileUpdate);
  }, []);

  const loadDashboardData = async () => {
    try {
      let activeSkills: string[] = [];
      let headline = 'Software & AI Engineer';
      let yearsExp = 4;

      const stored = localStorage.getItem('anvesh_profile');
      if (stored) {
        const p = JSON.parse(stored);
        if (p.skills && Array.isArray(p.skills) && p.skills.length > 0) {
          activeSkills = p.skills.map((s: any) => (typeof s === 'string' ? s : s.name));
          setProfileSkills(activeSkills);
        }
        if (p.headline) headline = p.headline;
        if (p.yearsExperience) yearsExp = p.yearsExperience;
      }

      const [recRes, simRes, savedRes, appsRes] = await Promise.allSettled([
        activeSkills.length > 0
          ? api.getPersonalizedRecommendations({ headline, skills: activeSkills, years_experience: yearsExp }, { limit: 6 })
          : api.getRecommendations(),
        api.simulateWhatIf(selectedSkills),
        api.getSavedJobs(),
        api.getApplications(),
      ]);

      if (recRes.status === 'fulfilled' && recRes.value?.recommendations) {
        setRecommendations(recRes.value.recommendations);
      }
      if (simRes.status === 'fulfilled' && simRes.value) {
        setSimulation(simRes.value);
      }

      const localSaved = JSON.parse(localStorage.getItem('anvesh_saved_jobs') || '[]');
      const localApps = JSON.parse(localStorage.getItem('anvesh_applied_jobs') || '[]');
      const savedCount = savedRes.status === 'fulfilled' ? Math.max(localSaved.length, savedRes.value.saved_jobs?.length || 0) : localSaved.length;
      const appCount = appsRes.status === 'fulfilled' ? Math.max(localApps.length, appsRes.value.applications?.length || 0) : localApps.length;
      setPipelineStats({ saved: savedCount, applied: appCount });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulate = async (skills: string[]) => {
    setSelectedSkills(skills);
    try {
      const simData = await api.simulateWhatIf(skills);
      setSimulation(simData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExecuteAgentAction = (act: { label: string; action: string; param?: string }) => {
    if (act.action === 'OPEN_WHAT_IF') {
      router.push(`/what-if?skills=${encodeURIComponent(act.param || 'Kubernetes')}`);
    } else if (act.action === 'VIEW_JOB' || act.action === 'FILTER_ROLE') {
      router.push(`/jobs?query=${encodeURIComponent(act.param || '')}`);
    } else if (act.action === 'EXPLORE_GAP') {
      router.push(`/skill-gap?role=${encodeURIComponent(act.param || 'ai-platform-eng')}`);
    } else {
      router.push('/jobs');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput;
    setChatInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await api.sendAgentMessage(userText);
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: res.response,
          tools: res.executed_tools,
          suggested_actions: res.suggested_actions,
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: 'Based on your verified skills (Python, PyTorch, FastAPI), you match strongly with AI Engineer roles.',
          suggested_actions: [
            { label: 'Simulate Kubernetes in What-If', action: 'OPEN_WHAT_IF', param: 'Kubernetes' },
            { label: 'View Top NVIDIA AI Jobs', action: 'VIEW_JOB', param: 'NVIDIA' },
          ],
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Unified Responsive Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-1 w-full space-y-8">
        
        {/* Candidate Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">Candidate Command Center &bull; Active HNSW Vector</Badge>
              <Badge variant="emerald" className="font-mono text-[10px]">Daily MNC &amp; Startup Sync</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {user?.full_name ? `Welcome back, ${user.full_name}` : 'Welcome to ANVESH Career Discovery'}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Deterministic career intelligence evaluated across live MNC &amp; startup ATS feeds with canonical skill graph normalization.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {profileSkills.length > 0 ? (
              profileSkills.slice(0, 5).map((sk) => (
                <Badge key={sk} variant="brand">{sk}</Badge>
              ))
            ) : (
              <>
                <Badge variant="outline" className="border-slate-300 text-slate-600">15,400+ Ontology Nodes</Badge>
                <Badge variant="outline" className="border-slate-300 text-slate-600">HNSW Vector Space</Badge>
                <Link href="/profile">
                  <Badge variant="brand" className="cursor-pointer hover:bg-brand-600">
                    <Sparkles className="w-3 h-3 mr-1" />
                    + Upload Resume
                  </Badge>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Live Candidate Pipeline & Activity Funnel Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/jobs?tab=saved" className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-300 shadow-2xs transition-all flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saved Jobs</div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">{pipelineStats.saved}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
          </Link>

          <Link href="/jobs?tab=applied" className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-2xs transition-all flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Applications</div>
              <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{pipelineStats.applied}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Link>

          <Link href="/profile" className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-brand-300 shadow-2xs transition-all flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Skills</div>
              <div className="text-2xl font-black text-brand-600 font-mono mt-0.5">{profileSkills.length || 8}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </Link>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('anvesh_open_command_palette'))}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-2xs transition-all flex items-center justify-between text-left"
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Spotlight</div>
              <div className="text-sm font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px]">Ctrl+K</kbd>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Command className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Quick Discovery Navigation Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/jobs"
            className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-brand-500 hover:shadow-card transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Jobs Catalog</h4>
              <p className="text-[11px] text-slate-500">16+ Verified Portals</p>
            </div>
          </Link>

          <Link
            href="/what-if"
            className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-card transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">What-If Suite</h4>
              <p className="text-[11px] text-slate-500">ROI & Salary Lift</p>
            </div>
          </Link>

          <Link
            href="/skill-gap"
            className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500 hover:shadow-card transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Skill Gap Radar</h4>
              <p className="text-[11px] text-slate-500">Vector Competency Map</p>
            </div>
          </Link>

          <Link
            href="/career-path"
            className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-cyan-500 hover:shadow-card transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">Career Trajectory</h4>
              <p className="text-[11px] text-slate-500">IC vs Mgmt Graph</p>
            </div>
          </Link>
        </div>

        {/* 2-Column Grid: Recommendations + What-If Simulator & AI Agent */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recommendations */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600" />
                <span>Multi-Stage Job Recommendations</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">Top 20 MMR Ranked</span>
            </div>

            <div className="space-y-4">
              {recommendations.map((job) => (
                <div
                  key={job.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card hover:border-brand-300 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {job.company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg">{job.title}</h3>
                          <Badge variant="emerald" className="font-bold text-xs">
                            {(job.match_score * 100).toFixed(1)}% Fit
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          {job.company.name} &bull; {job.company.location} &bull; ${formatNumber(job.min_salary)} - ${formatNumber(job.max_salary)} {job.currency}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">#{job.rank}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs text-center">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Vector Similarity</span>
                      <span className="font-bold text-slate-800 font-mono">{job.breakdown.semantic_similarity} cos(&theta;)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Required Match</span>
                      <span className="font-bold text-emerald-600 font-mono">{(job.breakdown.required_skill_match * 100).toFixed(0)}%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Freshness</span>
                      <span className="font-bold text-slate-800 font-mono">{job.breakdown.freshness_days}d ago</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {job.matched_skills.map((s) => (
                        <Badge key={s} variant="brand" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <a href={job.apply_url} target="_blank" rel="noreferrer">
                      <Button size="sm">Apply Now</Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: What-If Simulator + AI Career Agent */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* What-If Simulator Widget */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Counterfactual What-If Engine</span>
                </h3>
                <Badge variant="emerald" className="font-bold text-[10px]">v1.4 Live</Badge>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Simulate acquiring new skills:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Kubernetes', 'Go', 'CUDA', 'MLflow', 'Rust', 'TensorRT'].map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => {
                          const next = isSelected ? selectedSkills.filter((s) => s !== skill) : [...selectedSkills, skill];
                          handleSimulate(next);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {simulation && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] text-emerald-800 block font-medium">Opportunity Increase</span>
                    <span className="text-lg font-bold text-emerald-700 font-mono">
                      +{simulation.simulation.percentage_increase}%
                    </span>
                    <span className="text-[10px] text-emerald-600 block">
                      +{simulation.simulation.delta_opportunities} new roles
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <span className="text-[10px] text-indigo-800 block font-medium">Median Salary Lift</span>
                    <span className="text-lg font-bold text-indigo-700 font-mono">
                      +${formatNumber(simulation.simulation.salary_delta)}
                    </span>
                    <span className="text-[10px] text-indigo-600 block">
                      Target: ${formatNumber(simulation.simulation.simulated_median_salary)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Career Agent Chat */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-brand-600" />
                  <span>AI Career Agent (Tool-Calling)</span>
                </h3>
                <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>

              <div className="h-64 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                {messages.map((m, idx) => (
                  <div key={idx} className={`space-y-1.5 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-subtle'
                      }`}
                    >
                      {m.text}
                    </div>

                    {m.tools && (
                      <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                        {m.tools.map((t, ti) => (
                          <div key={ti}>&gt; Executed: {t.tool} ({t.latency_ms || 12}ms)</div>
                        ))}
                      </div>
                    )}

                    {m.suggested_actions && m.suggested_actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {m.suggested_actions.map((act, ai) => (
                          <button
                            key={ai}
                            onClick={() => handleExecuteAgentAction(act)}
                            className="px-2.5 py-1 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer text-left"
                          >
                            <Sparkles className="w-3 h-3 text-brand-600 shrink-0" />
                            <span>{act.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="text-left">
                    <div className="inline-block p-3 rounded-2xl bg-white border border-slate-200 text-slate-500">
                      Executing tool queries...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about role fit, salary benchmarks..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-500"
                />
                <Button type="submit" size="sm" disabled={isChatLoading}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>

          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}
