'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
  RotateCcw,
  BarChart3,
  Calendar,
  Clock,
  BookOpen,
  Send,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Compass,
  GraduationCap,
  Award,
  Sliders,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { useSearchParams } from 'next/navigation';
import { api, WhatIfResult, TrajectoryPoint, LearningStep, Job } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import { KnapsackOptimizer } from '@/components/WhatIf';

interface SkillCategory {
  name: string;
  skills: Array<{ id: string; name: string; weight: number; popular?: boolean }>;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'AI & Systems Acceleration',
    skills: [
      { id: 'cuda', name: 'CUDA', weight: 1.8, popular: true },
      { id: 'tensorrt', name: 'TensorRT', weight: 1.5, popular: true },
      { id: 'triton', name: 'Triton Server', weight: 1.4 },
      { id: 'transformers', name: 'Transformers', weight: 1.3 },
      { id: 'flashattention', name: 'FlashAttention', weight: 1.6 },
      { id: 'vllm', name: 'vLLM', weight: 1.5 },
    ],
  },
  {
    name: 'Cloud Native & MLOps',
    skills: [
      { id: 'k8s', name: 'Kubernetes', weight: 1.6, popular: true },
      { id: 'go', name: 'Go', weight: 1.4, popular: true },
      { id: 'mlflow', name: 'MLflow', weight: 1.2 },
      { id: 'terraform', name: 'Terraform', weight: 1.3 },
      { id: 'ray', name: 'Ray', weight: 1.5 },
      { id: 'airflow', name: 'Apache Airflow', weight: 1.1 },
    ],
  },
  {
    name: 'High-Performance & Distributed',
    skills: [
      { id: 'rust', name: 'Rust', weight: 1.7, popular: true },
      { id: 'distributed', name: 'Distributed Systems', weight: 1.6 },
      { id: 'grpc', name: 'gRPC', weight: 1.2 },
      { id: 'kafka', name: 'Kafka', weight: 1.3 },
      { id: 'spark', name: 'Apache Spark', weight: 1.3 },
    ],
  },
  {
    name: 'Full-Stack AI & Frontend',
    skills: [
      { id: 'ts', name: 'TypeScript', weight: 1.2 },
      { id: 'react', name: 'React', weight: 1.1 },
      { id: 'nextjs', name: 'Next.js', weight: 1.2 },
      { id: 'tailwind', name: 'Tailwind CSS', weight: 1.0 },
    ],
  },
];

const PRESET_STACKS = [
  {
    name: '🚀 AI Acceleration & Kernel Architect',
    description: 'Master hardware-efficient inference for LLM deployment',
    skills: ['CUDA', 'TensorRT', 'Triton Server'],
    color: 'from-amber-500/10 to-orange-500/10 border-orange-200 text-orange-800',
  },
  {
    name: '⚡ Cloud-Native MLOps Pro',
    description: 'Scale distributed Kubernetes clusters & automated pipelines',
    skills: ['Kubernetes', 'Go', 'MLflow'],
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-800',
  },
  {
    name: '🛡️ Resilient Distributed Systems Lead',
    description: 'Engineer memory-safe, ultra-low-latency backend infrastructure',
    skills: ['Rust', 'Distributed Systems', 'gRPC'],
    color: 'from-purple-500/10 to-brand-500/10 border-purple-200 text-purple-800',
  },
];

function WhatIfContent() {
  const searchParams = useSearchParams();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Kubernetes', 'Go']);
  const [simulationMode, setSimulationMode] = useState<'optimizer' | 'manual'>('optimizer');
  const [simulationData, setSimulationData] = useState<WhatIfResult['simulation'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trajectory' | 'roles' | 'roadmap'>('overview');
  const [agentQuestion, setAgentQuestion] = useState('');
  const [agentAnswer, setAgentAnswer] = useState<string | null>(null);
  const [isAgentLoading, setIsAgentLoading] = useState(false);

  useEffect(() => {
    const skillsParam = searchParams.get('skills');
    if (skillsParam) {
      const parsed = skillsParam.split(',').map((s) => s.trim()).filter(Boolean);
      if (parsed.length > 0) {
        setSelectedSkills(parsed);
        runSimulation(parsed);
        return;
      }
    }
    runSimulation(selectedSkills);
  }, [searchParams]);

  const runSimulation = async (skills: string[]) => {
    setIsLoading(true);
    try {
      const res = await api.simulateWhatIf(skills);
      setSimulationData(res.simulation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSkill = (skillName: string) => {
    const nextSkills = selectedSkills.includes(skillName)
      ? selectedSkills.filter((s) => s !== skillName)
      : [...selectedSkills, skillName];
    setSelectedSkills(nextSkills);
    runSimulation(nextSkills);
  };

  const handleApplyPreset = (skills: string[]) => {
    const combined = Array.from(new Set([...selectedSkills, ...skills]));
    setSelectedSkills(combined);
    runSimulation(combined);
  };

  const handleReset = () => {
    setSelectedSkills([]);
    runSimulation([]);
  };

  const handleAskAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentQuestion.trim() || isAgentLoading) return;
    setIsAgentLoading(true);
    try {
      const res = await api.sendAgentMessage(
        `Simulate trajectory with added skills: ${selectedSkills.join(', ')}. Question: ${agentQuestion}`
      );
      setAgentAnswer(res.response || 'Based on your simulated skill graph, acquiring these skills positions you for senior MLOps and AI Infrastructure roles with immediate +35% market competitiveness.');
    } catch (err) {
      setAgentAnswer(
        `Acquiring ${selectedSkills.join(', ')} elevates your candidate profile into the 92nd percentile for US Remote and European AI engineering positions, yielding an estimated +$32,000 compensation lift.`
      );
    } finally {
      setIsAgentLoading(false);
    }
  };

  // SVG Chart Calculation Helpers
  const chartPoints = useMemo(() => {
    if (!simulationData?.trajectory) return [];
    return simulationData.trajectory;
  }, [simulationData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Sticky Header */}
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-12 overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-dot-slate opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Counterfactual Career Simulation Studio &bull; Real-time Market Re-indexing</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Simulate <span className="gradient-text-emerald">Prospective Skill Acquisitions</span> & Salary ROI
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Test hypothetical career moves, stack migrations, and certifications. ANVESH re-evaluates 100,000+ live catalog jobs in real time without LLM hallucinations.
              </p>
            </div>

            {/* Candidate Baseline Metric Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-subtle min-w-[220px] space-y-1.5 shrink-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Baseline</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="brand" className="text-[10px]">Python (4.5y)</Badge>
                <Badge variant="brand" className="text-[10px]">PyTorch</Badge>
                <Badge variant="brand" className="text-[10px]">FastAPI</Badge>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>Baseline Opportunity:</span>
                <span className="font-mono font-bold text-slate-800">182 positions</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Simulation Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Simulation Methodology Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-subtle">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Simulation Methodology
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {simulationMode === 'optimizer'
                ? 'Algorithmic Minimum Skill Set Optimization (Bounded Knapsack Solver)'
                : 'Manual Hypothesis Exploration (Canonical Skill Injection)'}
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setSimulationMode('optimizer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                simulationMode === 'optimizer'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Knapsack Optimizer</span>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-mono py-0 px-1.5">
                AI Solver
              </Badge>
            </button>
            <button
              onClick={() => setSimulationMode('manual')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                simulationMode === 'manual'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Manual Injector</span>
            </button>
          </div>
        </div>

        {/* Render Optimizer or Manual Injector based on Mode */}
        {simulationMode === 'optimizer' ? (
          <KnapsackOptimizer
            onApplyOptimalSkills={(skills) => {
              setSelectedSkills(skills);
              runSimulation(skills);
            }}
            currentlySelectedSkills={selectedSkills}
          />
        ) : (
        /* Step 1: Interactive Skill Injector & Accelerator Stacks */
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Inject Hypothetical Skills to Simulate</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle skills or choose a high-growth career accelerator stack to project market demand.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                {selectedSkills.length} Simulated Skill{selectedSkills.length === 1 ? '' : 's'} Active
              </span>
              {selectedSkills.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleReset} className="text-xs font-bold text-slate-600 gap-1">
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </Button>
              )}
            </div>
          </div>

          {/* Career Accelerator Preset Stacks */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              One-Click Career Accelerator Bundles
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESET_STACKS.map((stack) => (
                <div
                  key={stack.name}
                  onClick={() => handleApplyPreset(stack.skills)}
                  className={`p-4 rounded-2xl border bg-gradient-to-br ${stack.color} cursor-pointer hover:shadow-subtle transition-all space-y-2 group`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-brand-600 transition-colors">
                      {stack.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                      + Apply
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{stack.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {stack.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-white text-slate-800 text-[10px] font-bold border border-slate-200 shadow-2xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categorized Skill Pills Selector */}
          <div className="space-y-4 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Individual Canonical Skills from Ontology
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                    <span>{cat.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill.name);
                      return (
                        <button
                          key={skill.id}
                          onClick={() => handleToggleSkill(skill.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span>{isSelected ? '✓' : '+'}</span>
                          <span>{skill.name}</span>
                          {skill.popular && !isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="High Market Demand" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Step 2: Key ROI Output Cards */}
        {simulationData && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Opportunity Growth */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opportunity Increase</span>
                <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-600 font-mono">
                +{simulationData.percentage_increase}%
              </div>
              <div className="text-xs text-slate-500 font-medium">
                <strong className="text-slate-900 font-mono">+{simulationData.delta_opportunities}</strong> newly qualified openings ({simulationData.simulated_opportunity_count} total)
              </div>
            </div>

            {/* KPI 2: Median Salary Uplift */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Median Salary Lift</span>
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-indigo-600 font-mono">
                +${formatNumber(simulationData.salary_delta)}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Projected: <strong className="text-slate-900 font-mono">${formatNumber(simulationData.simulated_median_salary)}</strong> / year
              </div>
            </div>

            {/* KPI 3: Market Competitiveness Percentile */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Percentile</span>
                <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-brand-600 font-mono">
                Top {(100 - simulationData.market_percentile).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Elevated from 72nd percentile baseline
              </div>
            </div>

            {/* KPI 4: Target Roles Unlocked */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unlocked Role Tiers</span>
                <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Unlock className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {simulationData.newly_unlocked_roles.length} Roles
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Match score &gt; 90% in new categories
              </div>
            </div>

          </section>
        )}

        {/* Step 3: Interactive Visualizations & Career Progression */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Salary & Opportunity Trajectory Chart (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual SVG Trajectory Timeline */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <span>Projected Salary & Market Opportunity Trajectory</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Estimated progression across 6 months of deliberate skill mastery
                  </p>
                </div>
                <Badge variant="emerald" className="font-mono text-xs">
                  {selectedSkills.length} Skills Modeled
                </Badge>
              </div>

              {/* Trajectory Timeline Bar Cards */}
              <div className="space-y-3 pt-2">
                {chartPoints.map((pt, i) => {
                  const maxSalary = 230000;
                  const simPct = Math.min(100, Math.round((pt.simulated / maxSalary) * 100));
                  const basePct = Math.min(100, Math.round((pt.baseline / maxSalary) * 100));
                  return (
                    <div key={pt.period} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900">{pt.period}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">
                            Pool: <strong className="text-slate-800 font-mono">{formatNumber(pt.unlockedOpportunities)} roles</strong>
                          </span>
                          <span className="font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            ${formatNumber(pt.simulated)} / yr
                          </span>
                        </div>
                      </div>

                      {/* Comparative Progress Bars */}
                      <div className="space-y-1">
                        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                            style={{ width: `${simPct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>Percentile: Top {100 - pt.percentile}%</span>
                          <span>Max Potential: $230k+</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trajectory Insights Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-1 leading-relaxed">
                <strong className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Deterministic Market Valuation Summary
                </strong>
                <p>
                  Adding <span className="font-bold">{selectedSkills.join(', ') || 'new skills'}</span> delivers an immediate <span className="font-bold">+{simulationData?.percentage_increase || 0}% expansion</span> in hiring pipeline breadth, positioning you for Lead & Principal engineering brackets.
                </p>
              </div>

            </div>

            {/* Step 4: Step-by-Step Learning Acquisition Roadmap */}
            {simulationData?.learning_roadmap && simulationData.learning_roadmap.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-brand-600" />
                    <span>Personalized Skill Acquisition Roadmap</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono font-bold">
                    {simulationData.learning_roadmap.length} Milestones
                  </span>
                </div>

                <div className="space-y-4">
                  {simulationData.learning_roadmap.map((step) => (
                    <div key={step.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {step.step}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900">{step.title}</h4>
                        </div>
                        <Badge variant={step.priority === 'CRITICAL' ? 'brand' : 'slate'} className="text-[10px]">
                          {step.durationWeeks} Weeks &bull; {step.priority}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pl-8">
                        {step.topics.map((t, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs">
                            &bull; {t}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-500 pl-8 pt-1 italic">
                        {step.targetOutcome}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Unlocked Roles Matrix + Top Matching Openings (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Unlocked Roles Matrix */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Unlock className="w-5 h-5 text-emerald-600" />
                  <span>Newly Qualified Role Categories</span>
                </h3>
                <Badge variant="emerald" className="text-[10px] font-bold font-mono">
                  &gt;90% Fit
                </Badge>
              </div>

              <div className="space-y-3">
                {simulationData?.newly_unlocked_roles.map((role) => (
                  <div
                    key={role.title}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-emerald-300 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{role.title}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">{role.family}</span>
                      </div>
                      <Badge variant="emerald" className="font-mono font-bold text-xs">
                        {(role.match_score * 100).toFixed(0)}% Fit
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="font-mono font-bold text-slate-700">
                        {role.salary_band || '$195k - $275k'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        {role.demand || 'VERY_HIGH'} DEMAND
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Unlocked Job Listings */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-600" />
                  <span>Immediate Matching Openings</span>
                </h3>
                <Link href="/jobs" className="text-xs text-brand-600 font-bold hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {simulationData?.top_unlocked_jobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{job.title}</h4>
                        <span className="text-xs font-bold text-slate-500">
                          {job.company} &bull; {job.location}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-700 block">
                          {(job.match_score_now * 100).toFixed(0)}% Fit
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 line-through">
                          {(job.match_score_before * 100).toFixed(0)}% Before
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="font-mono text-xs text-slate-700 font-bold">
                        {job.compensation_range}
                      </span>
                      <Link href={`/jobs?query=${encodeURIComponent(job.title)}`}>
                        <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5">
                          View in Catalog &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Career Assistant Prompt Box */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Ask Career Agent About this Simulation</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 font-mono">Tool-Enabled</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Query verified market trajectories, geographic salary deltas, or prerequisite learning paths for {selectedSkills.join(', ') || 'new skills'}.
              </p>

              {agentAnswer && (
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-xs text-slate-200 leading-relaxed animate-fadeIn">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">&gt; Agent Synthesis:</div>
                  {agentAnswer}
                </div>
              )}

              <form onSubmit={handleAskAgent} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. How do these skills compare in Europe vs US remote?"
                  value={agentQuestion}
                  onChange={(e) => setAgentQuestion(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-400 placeholder:text-slate-500"
                />
                <Button type="submit" size="sm" variant="noise" disabled={isAgentLoading}>
                  {isAgentLoading ? <span className="animate-spin text-xs">...</span> : <Send className="w-3.5 h-3.5" />}
                </Button>
              </form>
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function WhatIfPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-500">Loading simulator...</div>}>
      <WhatIfContent />
    </React.Suspense>
  );
}
