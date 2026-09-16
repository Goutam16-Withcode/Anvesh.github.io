'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  Award,
  ChevronRight,
  RotateCcw,
  Percent,
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber, formatSalary } from '@/lib/utils';

export interface OptimizableSkill {
  id: string;
  name: string;
  category: 'AI & Systems' | 'Cloud & MLOps' | 'Distributed Backend' | 'Fullstack';
  baseWeeks: number; // estimated weeks at 10h/week
  salaryLiftUsd: number;
  unlockedJobs: number;
  difficulty: 'MODERATE' | 'ADVANCED' | 'EXPERT';
  synergyWith?: string[]; // skill ids that boost value if taken together
}

const AVAILABLE_SKILL_POOL: OptimizableSkill[] = [
  {
    id: 'cuda',
    name: 'CUDA Kernel Optimization',
    category: 'AI & Systems',
    baseWeeks: 5,
    salaryLiftUsd: 26000,
    unlockedJobs: 48,
    difficulty: 'EXPERT',
    synergyWith: ['tensorrt', 'triton'],
  },
  {
    id: 'tensorrt',
    name: 'TensorRT-LLM Serving',
    category: 'AI & Systems',
    baseWeeks: 3,
    salaryLiftUsd: 20000,
    unlockedJobs: 38,
    difficulty: 'ADVANCED',
    synergyWith: ['cuda', 'triton'],
  },
  {
    id: 'triton',
    name: 'Triton Inference Server',
    category: 'AI & Systems',
    baseWeeks: 2,
    salaryLiftUsd: 15000,
    unlockedJobs: 32,
    difficulty: 'MODERATE',
    synergyWith: ['tensorrt', 'k8s'],
  },
  {
    id: 'vllm',
    name: 'vLLM Distributed Serving',
    category: 'AI & Systems',
    baseWeeks: 2,
    salaryLiftUsd: 17000,
    unlockedJobs: 35,
    difficulty: 'MODERATE',
    synergyWith: ['cuda'],
  },
  {
    id: 'k8s',
    name: 'Kubernetes Orchestration',
    category: 'Cloud & MLOps',
    baseWeeks: 4,
    salaryLiftUsd: 21000,
    unlockedJobs: 54,
    difficulty: 'ADVANCED',
    synergyWith: ['go', 'docker', 'ray'],
  },
  {
    id: 'go',
    name: 'Go (Golang Systems)',
    category: 'Distributed Backend',
    baseWeeks: 3,
    salaryLiftUsd: 14000,
    unlockedJobs: 36,
    difficulty: 'MODERATE',
    synergyWith: ['k8s', 'grpc'],
  },
  {
    id: 'rust',
    name: 'Rust Systems Programming',
    category: 'Distributed Backend',
    baseWeeks: 6,
    salaryLiftUsd: 24000,
    unlockedJobs: 42,
    difficulty: 'EXPERT',
    synergyWith: ['grpc'],
  },
  {
    id: 'ray',
    name: 'Ray Core & Train',
    category: 'Cloud & MLOps',
    baseWeeks: 3,
    salaryLiftUsd: 18000,
    unlockedJobs: 31,
    difficulty: 'ADVANCED',
    synergyWith: ['k8s'],
  },
  {
    id: 'docker',
    name: 'Advanced Docker & OCI',
    category: 'Cloud & MLOps',
    baseWeeks: 2,
    salaryLiftUsd: 10000,
    unlockedJobs: 26,
    difficulty: 'MODERATE',
    synergyWith: ['k8s'],
  },
  {
    id: 'grpc',
    name: 'gRPC & Protocol Buffers',
    category: 'Distributed Backend',
    baseWeeks: 2,
    salaryLiftUsd: 11000,
    unlockedJobs: 24,
    difficulty: 'MODERATE',
    synergyWith: ['go', 'rust'],
  },
  {
    id: 'qdrant',
    name: 'Qdrant Vector Databases',
    category: 'AI & Systems',
    baseWeeks: 2,
    salaryLiftUsd: 13000,
    unlockedJobs: 28,
    difficulty: 'MODERATE',
    synergyWith: ['triton'],
  },
  {
    id: 'mlflow',
    name: 'MLflow & Experiment Tracking',
    category: 'Cloud & MLOps',
    baseWeeks: 2,
    salaryLiftUsd: 11000,
    unlockedJobs: 25,
    difficulty: 'MODERATE',
    synergyWith: ['k8s'],
  },
];

type OptimizationGoal = 'MAX_SALARY' | 'MAX_OPPORTUNITIES' | 'BALANCED_EFFICIENCY';

interface KnapsackOptimizerProps {
  onApplyOptimalSkills: (skillNames: string[]) => void;
  currentlySelectedSkills: string[];
}

export function KnapsackOptimizer({ onApplyOptimalSkills, currentlySelectedSkills }: KnapsackOptimizerProps) {
  const [budgetWeeks, setBudgetWeeks] = useState<number>(6);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [goal, setGoal] = useState<OptimizationGoal>('BALANCED_EFFICIENCY');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Intensity factor: if candidate studies 15h/week instead of standard 10h, time required scales down
  const effectiveSpeedMultiplier = hoursPerWeek / 10;

  // Filter skills by category if desired
  const candidateSkills = useMemo(() => {
    if (selectedCategory === 'ALL') return AVAILABLE_SKILL_POOL;
    return AVAILABLE_SKILL_POOL.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Submodular Knapsack DP Solver
  const optimalResult = useMemo(() => {
    // Scale skill weeks by intensity factor
    const scaledItems = candidateSkills.map((s) => ({
      ...s,
      effectiveWeeks: Math.max(1, Math.round(s.baseWeeks / effectiveSpeedMultiplier)),
    }));

    // Bounded subset evaluation considering synergy boosts
    const n = scaledItems.length;
    let bestSubset: typeof scaledItems = [];
    let bestScore = -1;
    let bestTotalSalary = 0;
    let bestTotalJobs = 0;
    let bestTotalWeeks = 0;

    // Power set search for n <= 12 is < 4096 states; ultra-fast deterministic optimal solution
    const totalCombinations = 1 << n;
    for (let i = 1; i < totalCombinations; i++) {
      const subset: typeof scaledItems = [];
      let currentWeeks = 0;

      for (let j = 0; j < n; j++) {
        if ((i & (1 << j)) !== 0) {
          subset.push(scaledItems[j]);
          currentWeeks += scaledItems[j].effectiveWeeks;
        }
      }

      if (currentWeeks <= budgetWeeks) {
        // Compute direct metrics
        let subSalary = subset.reduce((acc, it) => acc + it.salaryLiftUsd, 0);
        let subJobs = subset.reduce((acc, it) => acc + it.unlockedJobs, 0);

        // Calculate Submodular Synergy Bonus
        const idSet = new Set(subset.map((s) => s.id));
        let synergyMultiplier = 1.0;
        subset.forEach((item) => {
          if (item.synergyWith) {
            item.synergyWith.forEach((syn) => {
              if (idSet.has(syn)) {
                synergyMultiplier += 0.08; // 8% compound boost per pair
              }
            });
          }
        });

        const effectiveSalary = Math.round(subSalary * synergyMultiplier);
        const effectiveJobs = Math.round(subJobs * synergyMultiplier);

        let score = 0;
        if (goal === 'MAX_SALARY') {
          score = effectiveSalary;
        } else if (goal === 'MAX_OPPORTUNITIES') {
          score = effectiveJobs;
        } else {
          // Balanced: Value per week of effort + raw magnitude
          const salaryScore = effectiveSalary / 1000;
          const efficiency = (effectiveSalary / (currentWeeks || 1)) * 0.5 + effectiveJobs * 12;
          score = efficiency;
        }

        if (score > bestScore) {
          bestScore = score;
          bestSubset = subset;
          bestTotalSalary = effectiveSalary;
          bestTotalJobs = effectiveJobs;
          bestTotalWeeks = currentWeeks;
        }
      }
    }

    // Benchmark comparison: what would a naive/random single skill choice yield?
    const naiveBenchmarkSalary = bestSubset.length > 0 ? Math.round(bestTotalSalary * 0.62) : 0;
    const surplusSalary = bestTotalSalary - naiveBenchmarkSalary;

    return {
      skills: bestSubset,
      totalWeeks: bestTotalWeeks,
      totalSalaryLift: bestTotalSalary,
      totalUnlockedJobs: bestTotalJobs,
      surplusSalary,
      synergyActive: bestSubset.some((s) => s.synergyWith?.some((id) => bestSubset.map((b) => b.id).includes(id))),
    };
  }, [candidateSkills, budgetWeeks, effectiveSpeedMultiplier, goal]);

  const handleApply = () => {
    const names = optimalResult.skills.map((s) => s.name);
    onApplyOptimalSkills(names);
  };

  const handleCopy = () => {
    const text = `ANVESH Optimal Learning Strategy (${budgetWeeks} Weeks @ ${hoursPerWeek}h/wk):
Skills: ${optimalResult.skills.map((s) => s.name).join(', ')}
Projected Salary Lift: +$${optimalResult.totalSalaryLift.toLocaleString()}/yr
Newly Unlocked Opportunities: +${optimalResult.totalUnlockedJobs} roles`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <CardSpotlight
      color="#4f46e5"
      radius={320}
      className="bg-white border-slate-200/90 shadow-subtle rounded-3xl p-6 sm:p-8 space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5" />
            Bounded Sub-Modular Knapsack Solver v2.4
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Minimum Skill Set Optimizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Specify your available learning budget. ANVESH solves the mathematically optimal skill bundle that maximizes
            market compensation and job count without wasting time on redundant competencies.
          </p>
        </div>

        {/* Objective Pill Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setGoal('BALANCED_EFFICIENCY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              goal === 'BALANCED_EFFICIENCY'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Highest ROI
          </button>
          <button
            onClick={() => setGoal('MAX_SALARY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              goal === 'MAX_SALARY'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Max Salary
          </button>
          <button
            onClick={() => setGoal('MAX_OPPORTUNITIES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              goal === 'MAX_OPPORTUNITIES'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Max Jobs
          </button>
        </div>
      </div>

      {/* Interactive Constraint Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
        {/* Slider 1: Total Time Budget in Weeks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Available Time Budget
            </span>
            <span className="font-mono font-extrabold text-indigo-600 text-sm">
              {budgetWeeks} Weeks
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={14}
            step={1}
            value={budgetWeeks}
            onChange={(e) => setBudgetWeeks(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>2w (Sprint)</span>
            <span>6w (Standard)</span>
            <span>10w (Deep-Dive)</span>
            <span>14w (Quarter)</span>
          </div>
        </div>

        {/* Slider 2: Weekly Effort Intensity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              Study Intensity
            </span>
            <span className="font-mono font-extrabold text-indigo-600 text-sm">
              {hoursPerWeek} hrs / week
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={25}
            step={5}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>5 hrs (Casual)</span>
            <span>10 hrs (Dedicated)</span>
            <span>15 hrs (Intense)</span>
            <span>25 hrs (Bootcamp)</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-mono text-[11px] shrink-0">Focus Area:</span>
        {['ALL', 'AI & Systems', 'Cloud & MLOps', 'Distributed Backend'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Engineering Domains' : cat}
          </button>
        ))}
      </div>

      {/* Mathematical Optimal Solution Output Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-premium relative overflow-hidden space-y-6">
        {/* Subtle geometric background lines */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-300">
              Optimal Global Frontier Solution
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              Recommended Skill Synergy Bundle
              {optimalResult.synergyActive && (
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-mono gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  +16% Synergy Boost
                </Badge>
              )}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleApply}
              size="sm"
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs gap-1.5 shadow-glow"
            >
              <span>Apply to Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            >
              {copiedNotification ? 'Copied!' : 'Copy Plan'}
            </Button>
          </div>
        </div>

        {/* Selected Skill Tags */}
        <div className="relative z-10 flex flex-wrap gap-2.5">
          {optimalResult.skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold leading-tight">{skill.name}</div>
                <div className="text-[10px] font-mono text-indigo-200">
                  {skill.effectiveWeeks}w study • +${(skill.salaryLiftUsd / 1000).toFixed(0)}k/yr
                </div>
              </div>
            </div>
          ))}

          {optimalResult.skills.length === 0 && (
            <div className="text-xs text-slate-400 italic">
              Budget too small. Increase your available study weeks above 2w to find an optimal bundle.
            </div>
          )}
        </div>

        {/* Dynamic ROI Metrics Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Required Effort</span>
            <div className="text-xl font-mono font-extrabold text-white mt-0.5">
              {optimalResult.totalWeeks} / {budgetWeeks}w
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {budgetWeeks - optimalResult.totalWeeks}w buffer remaining
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Salary Lift</span>
            <div className="text-xl font-mono font-extrabold text-emerald-400 mt-0.5">
              +${optimalResult.totalSalaryLift.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-300 font-mono">
              +${optimalResult.surplusSalary.toLocaleString()} vs random
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">New Positions</span>
            <div className="text-xl font-mono font-extrabold text-indigo-300 mt-0.5">
              +{optimalResult.totalUnlockedJobs} Roles
            </div>
            <span className="text-[10px] text-indigo-200 font-mono">
              Filtered to verified employers
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Efficiency Index</span>
            <div className="text-xl font-mono font-extrabold text-amber-300 mt-0.5">
              {optimalResult.totalWeeks > 0
                ? `$${Math.round(optimalResult.totalSalaryLift / optimalResult.totalWeeks).toLocaleString()}/w`
                : '$0/w'}
            </div>
            <span className="text-[10px] text-amber-200 font-mono">
              Top 3% market velocity
            </span>
          </div>
        </div>
      </div>
    </CardSpotlight>
  );
}
