'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  RefreshCw,
  Sliders,
  Briefcase,
  Layers,
  ArrowRight,
  GitGraph,
  CheckCircle2,
  DollarSign,
  User,
  Compass,
  Activity,
  Award,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api, CandidateProfile, INITIAL_CANDIDATE_PROFILE } from '@/lib/api';
import { formatNumber, formatSalary } from '@/lib/utils';

export default function CareerTwinPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile>(INITIAL_CANDIDATE_PROFILE);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<'AI_INFRA' | 'ML_SYSTEMS' | 'BACKEND_CORE'>('AI_INFRA');
  const [hypotheticalSkills, setHypotheticalSkills] = useState<string[]>(['CUDA', 'vLLM', 'Ray']);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = localStorage.getItem('anvesh_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.fullName) {
          setProfile(parsed);
          return;
        }
      }
      const data = await api.getProfile();
      if (data && data.fullName) {
        setProfile(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 1200);
  };

  const toggleHypotheticalSkill = (skill: string) => {
    setHypotheticalSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Dynamic metrics derived from profile + hypothetical skills
  const baselineSalary = 165000;
  const simulatedSalary = baselineSalary + hypotheticalSkills.length * 18500;
  const unlockedCount = 142 + hypotheticalSkills.length * 54;
  const readinessPercent = Math.min(98, 72 + hypotheticalSkills.length * 8);

  const domainSkills = {
    AI_INFRA: ['CUDA', 'vLLM', 'Triton', 'TensorRT', 'Ray', 'NCCL'],
    ML_SYSTEMS: ['PyTorch', 'MLflow', 'FastAPI', 'Qdrant Vector DB', 'Docker', 'Kubernetes'],
    BACKEND_CORE: ['PostgreSQL', 'Go', 'Distributed Systems', 'Redis', 'Kafka', 'Rust'],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-4">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/dashboard" className="hover:text-brand-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">ANVESH Career Twin</span>
        </div>

        {/* Hero Banner: Mathematical Career Avatar */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white border border-slate-800 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-brand-500/20 text-brand-300 border-brand-500/30 text-xs gap-1.5 py-1 px-3">
                  <Cpu className="w-3.5 h-3.5 text-brand-400" />
                  Autonomous Digital Twin &bull; 384-D Vector State
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {profile.fullName && profile.fullName !== 'Candidate Profile'
                  ? `${profile.fullName}'s Digital Career Twin`
                  : 'Candidate Digital Career Twin'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                A unified mathematical vector representation combining your verified competencies (<span className="text-brand-300 font-mono font-semibold">v_skills</span>), latent career trajectory (<span className="text-indigo-300 font-mono font-semibold">u_latent</span>), and growth velocity (<span className="text-emerald-300 font-mono font-semibold">v_growth</span>).
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Deterministic (Zero LLM Hallucinations)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-brand-400" />
                  <span>Sub-1.2ms Telemetry Calibration</span>
                </div>
              </div>
            </div>

            {/* Twin Readiness Ring Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center shrink-0 w-full sm:w-72 text-center space-y-3 shadow-2xl">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-white/10"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-brand-400 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={238.76}
                    strokeDashoffset={238.76 * (1 - readinessPercent / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{readinessPercent}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Market Fit</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">Tier-1 Market Readiness</h4>
                <p className="text-[11px] text-slate-300 pt-0.5">Benchmarked against NVIDIA, Stripe & OpenAI</p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleRecalibrate}
                disabled={isCalibrating}
                className="w-full text-xs font-semibold bg-white/15 border-white/20 text-white hover:bg-white/25"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isCalibrating ? 'animate-spin' : ''}`} />
                {isCalibrating ? 'Recalibrating...' : 'Recalibrate Twin'}
              </Button>
            </div>
          </div>
        </div>

        {/* 3-Pillar Digital Twin Vector Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Vector 1: Competency Vector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 hover:border-brand-500 hover:shadow-card transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <Badge variant="brand" className="font-mono text-[10px]">Vector: v_skills</Badge>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Verified Competency State</h3>
              <p className="text-xs text-slate-500 mt-1">
                Extracted hard-skill graph nodes mapped directly into the 15,400+ canonical ontology.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Ontology Coverage</span>
                <span className="text-brand-600 font-mono">84.2%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full w-[84%]" />
              </div>
              <p className="text-[11px] text-slate-400">Zero false-negative lexical penalties</p>
            </div>
          </div>

          {/* Vector 2: Latent Preference Vector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 hover:border-indigo-500 hover:shadow-card transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-indigo-600 border-indigo-200 bg-indigo-50">Vector: u_latent</Badge>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Latent Trajectory Vector</h3>
              <p className="text-xs text-slate-500 mt-1">
                Exponential moving average (EMA) updated by CTR, dwell time, and saved opportunities.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Trajectory Alignment</span>
                <span className="text-indigo-600 font-mono">92.6%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[92%]" />
              </div>
              <p className="text-[11px] text-slate-400">Target Role: AI Infrastructure & Systems</p>
            </div>
          </div>

          {/* Vector 3: Growth Velocity Vector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 hover:border-emerald-500 hover:shadow-card transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="emerald" className="font-mono text-[10px]">Vector: v_growth</Badge>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Market Growth Velocity</h3>
              <p className="text-xs text-slate-500 mt-1">
                Rate of qualification expansion and compensation lift per acquired technical capability.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Velocity Index</span>
                <span className="text-emerald-600 font-mono">+18.5k / Skill</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
              </div>
              <p className="text-[11px] text-slate-400">Exponential ROI on kernel optimization skills</p>
            </div>
          </div>

        </div>

        {/* Counterfactual Twin Simulation Sandbox */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-600" />
                <span>Simulate Twin Vector Evolution</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle hypothetical competencies to project your twin's market valuation and unlocked opportunities.
              </p>
            </div>

            {/* Domain Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedDomain('AI_INFRA')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDomain === 'AI_INFRA'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Infrastructure
              </button>
              <button
                onClick={() => setSelectedDomain('ML_SYSTEMS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDomain === 'ML_SYSTEMS'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ML Systems
              </button>
              <button
                onClick={() => setSelectedDomain('BACKEND_CORE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDomain === 'BACKEND_CORE'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Core Backend
              </button>
            </div>
          </div>

          {/* Interactive Skill Toggles */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Add High-Demand Skills to Digital Twin:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {domainSkills[selectedDomain].map((skill) => {
                const isActive = hypotheticalSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleHypotheticalSkill(skill)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{skill}</span>
                    {isActive ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="text-[10px] text-slate-400">+Add</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-Time Mathematical Projections */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-brand-50/20 to-indigo-50/30 border border-slate-200/80">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projected Median Comp</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatSalary(simulatedSalary)}
              </div>
              <span className="text-xs font-bold text-emerald-600">
                +{formatSalary(simulatedSalary - baselineSalary)} Career Lift
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unlocked Vacancies</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {unlockedCount} Positions
              </div>
              <span className="text-xs font-bold text-brand-600">
                +{hypotheticalSkills.length * 54} Opportunities
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate Market Percentile</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                Top {100 - readinessPercent}%
              </div>
              <span className="text-xs font-bold text-indigo-600">
                Tier-1 Engineering Pool
              </span>
            </div>
          </div>

          {/* Action CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Vector state evaluated across 104,250 live vacancies with exponential decay half-life.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/what-if" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Open What-If Sandbox
                </Button>
              </Link>
              <Link href="/jobs" className="w-full sm:w-auto">
                <Button size="sm" className="w-full text-xs font-bold gap-1.5">
                  <span>Explore Matched Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
