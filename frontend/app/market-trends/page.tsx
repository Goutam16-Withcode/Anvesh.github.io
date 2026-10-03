'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  Globe,
  DollarSign,
  Zap,
  Target,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Briefcase,
  Clock,
  Layers,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  Building,
  Filter,
  RefreshCw,
  Info,
  Award,
  Flame,
  Eye,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatSalary, formatNumber } from '@/lib/utils';

// ─── Mock Market Data ────────────────────────────────────────────────
interface SkillTrend {
  skill: string;
  category: string;
  demandScore: number;
  prevDemandScore: number;
  jobCount: number;
  avgSalary: number;
  growthRate: number; // % YoY
  trend: 'UP' | 'DOWN' | 'STABLE';
  emerging: boolean;
}

interface SalaryBand {
  title: string;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  count: number;
}

interface HiringHub {
  city: string;
  country: string;
  jobCount: number;
  avgSalary: number;
  topSkill: string;
  remote: boolean;
}

interface WorkModeShare {
  mode: string;
  percentage: number;
  yoyChange: number;
}

const SKILL_TRENDS: SkillTrend[] = [
  { skill: 'vLLM', category: 'LLM Serving', demandScore: 94, prevDemandScore: 62, jobCount: 3840, avgSalary: 285000, growthRate: +151, trend: 'UP', emerging: true },
  { skill: 'CUDA', category: 'GPU Computing', demandScore: 91, prevDemandScore: 84, jobCount: 12400, avgSalary: 310000, growthRate: +28, trend: 'UP', emerging: false },
  { skill: 'Qdrant', category: 'Vector DB', demandScore: 88, prevDemandScore: 54, jobCount: 5200, avgSalary: 265000, growthRate: +63, trend: 'UP', emerging: true },
  { skill: 'FlashAttention', category: 'AI Optimization', demandScore: 86, prevDemandScore: 41, jobCount: 2900, avgSalary: 295000, growthRate: +110, trend: 'UP', emerging: true },
  { skill: 'PyTorch', category: 'ML Frameworks', demandScore: 93, prevDemandScore: 90, jobCount: 38200, avgSalary: 255000, growthRate: +8, trend: 'UP', emerging: false },
  { skill: 'LightGBM', category: 'ML Ranking', demandScore: 72, prevDemandScore: 70, jobCount: 9800, avgSalary: 240000, growthRate: +4, trend: 'STABLE', emerging: false },
  { skill: 'Kubernetes', category: 'Infrastructure', demandScore: 85, prevDemandScore: 88, jobCount: 42000, avgSalary: 235000, growthRate: -3, trend: 'DOWN', emerging: false },
  { skill: 'DeepSpeed', category: 'Distributed ML', demandScore: 79, prevDemandScore: 52, jobCount: 3100, avgSalary: 302000, growthRate: +51, trend: 'UP', emerging: true },
  { skill: 'Triton Server', category: 'Inference', demandScore: 77, prevDemandScore: 49, jobCount: 2200, avgSalary: 290000, growthRate: +57, trend: 'UP', emerging: true },
  { skill: 'LangGraph', category: 'AI Agents', demandScore: 83, prevDemandScore: 38, jobCount: 4100, avgSalary: 275000, growthRate: +118, trend: 'UP', emerging: true },
  { skill: 'Terraform', category: 'IaC', demandScore: 80, prevDemandScore: 82, jobCount: 31000, avgSalary: 218000, growthRate: -2, trend: 'DOWN', emerging: false },
  { skill: 'MLflow', category: 'MLOps', demandScore: 68, prevDemandScore: 65, jobCount: 7200, avgSalary: 228000, growthRate: +6, trend: 'STABLE', emerging: false },
];

const SALARY_BANDS: SalaryBand[] = [
  { title: 'ML Engineer', p25: 160000, p50: 215000, p75: 275000, p90: 340000, count: 18200 },
  { title: 'Senior ML Engineer', p25: 210000, p50: 272000, p75: 340000, p90: 420000, count: 11400 },
  { title: 'AI Research Engineer', p25: 240000, p50: 310000, p75: 390000, p90: 480000, count: 4800 },
  { title: 'ML Platform Engineer', p25: 195000, p50: 258000, p75: 325000, p90: 400000, count: 6200 },
  { title: 'LLM Engineer', p25: 220000, p50: 295000, p75: 375000, p90: 460000, count: 3100 },
  { title: 'MLOps Engineer', p25: 175000, p50: 230000, p75: 290000, p90: 355000, count: 7800 },
];

const HIRING_HUBS: HiringHub[] = [
  { city: 'San Francisco', country: 'US', jobCount: 24300, avgSalary: 340000, topSkill: 'CUDA', remote: true },
  { city: 'New York', country: 'US', jobCount: 18100, avgSalary: 315000, topSkill: 'PyTorch', remote: true },
  { city: 'Seattle', country: 'US', jobCount: 15600, avgSalary: 305000, topSkill: 'Kubernetes', remote: true },
  { city: 'London', country: 'UK', jobCount: 9800, avgSalary: 210000, topSkill: 'LangGraph', remote: false },
  { city: 'Bangalore', country: 'IN', jobCount: 12400, avgSalary: 78000, topSkill: 'PyTorch', remote: false },
  { city: 'Berlin', country: 'DE', jobCount: 6200, avgSalary: 145000, topSkill: 'MLflow', remote: false },
  { city: 'Toronto', country: 'CA', jobCount: 5800, avgSalary: 185000, topSkill: 'vLLM', remote: true },
  { city: 'Singapore', country: 'SG', jobCount: 4100, avgSalary: 155000, topSkill: 'CUDA', remote: false },
];

const WORK_MODE_SHARES: WorkModeShare[] = [
  { mode: 'Remote', percentage: 41, yoyChange: +3 },
  { mode: 'Hybrid', percentage: 38, yoyChange: -2 },
  { mode: 'On-Site', percentage: 21, yoyChange: -1 },
];

// ─── Mini bar chart ──────────────────────────────────────────────────
function SalaryBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="relative h-5 flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 w-20 text-right shrink-0">
        {formatSalary(value)}
      </span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: 'UP' | 'DOWN' | 'STABLE' }) {
  if (trend === 'UP') return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
  if (trend === 'DOWN') return <ArrowDownRight className="w-4 h-4 text-rose-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

type CategoryFilter = string;
const ALL_CATEGORIES = ['ALL', ...Array.from(new Set(SKILL_TRENDS.map((s) => s.category)))];

export default function MarketTrendsPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [sortBy, setSortBy] = useState<'demandScore' | 'growthRate' | 'avgSalary'>('demandScore');
  const [showEmerging, setShowEmerging] = useState(false);
  const [activeSalaryRole, setActiveSalaryRole] = useState<string | null>(null);

  const filteredSkills = useMemo(() => {
    let list = categoryFilter === 'ALL'
      ? SKILL_TRENDS
      : SKILL_TRENDS.filter((s) => s.category === categoryFilter);
    if (showEmerging) list = list.filter((s) => s.emerging);
    return [...list].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [categoryFilter, sortBy, showEmerging]);

  const maxSalary = Math.max(...SALARY_BANDS.map((b) => b.p90));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-24">
        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-white border-b border-slate-100">
          <div className="absolute inset-0 bg-grid-slate opacity-40" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Link href="/dashboard" className="hover:text-brand-600 transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-medium">Market Trends</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1 text-xs font-semibold text-cyan-700 mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live Market Intelligence · Updated Oct 2026
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Job Market{' '}
                  <span className="gradient-text">Trends Dashboard</span>
                </h1>
                <p className="mt-2 text-slate-500 max-w-xl">
                  Skill demand velocity index, salary distribution curves, hiring hubs, and
                  remote-vs-hybrid market share — all updated from 100k+ live job postings.
                </p>
              </div>
              <Button variant="outline" className="border-slate-200 shrink-0 gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* ── Top KPI Row ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Active Job Postings',
                value: '142,800',
                sub: '+12% vs last month',
                icon: <Briefcase className="w-5 h-5 text-brand-500" />,
                up: true,
              },
              {
                label: 'Median AI Eng. Salary',
                value: '$272,000',
                sub: '+8.4% YoY',
                icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
                up: true,
              },
              {
                label: 'Emerging Skills Tracked',
                value: '234',
                sub: '47 new this month',
                icon: <Flame className="w-5 h-5 text-amber-500" />,
                up: true,
              },
              {
                label: 'Remote Job Share',
                value: '41%',
                sub: '+3% vs last year',
                icon: <Globe className="w-5 h-5 text-cyan-500" />,
                up: true,
              },
            ].map(({ label, value, sub, icon, up }) => (
              <div
                key={label}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card glass-card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
                  <div
                    className={cn(
                      'flex items-center gap-0.5 text-xs font-semibold',
                      up ? 'text-emerald-600' : 'text-rose-600'
                    )}
                  >
                    {up ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                <div className={cn('text-xs font-medium mt-1', up ? 'text-emerald-600' : 'text-rose-600')}>
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── Skill Demand Velocity ── */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h2 className="font-bold text-slate-900">Skill Demand Velocity Index</h2>
                  <Badge variant="secondary" className="text-xs">
                    {filteredSkills.length} skills
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowEmerging(!showEmerging)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                      showEmerging
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'
                    )}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Emerging Only
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-brand-300"
                  >
                    <option value="demandScore">Sort: Demand Score</option>
                    <option value="growthRate">Sort: Growth Rate</option>
                    <option value="avgSalary">Sort: Avg Salary</option>
                  </select>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mt-3">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all',
                      categoryFilter === cat
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:text-brand-600'
                    )}
                  >
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {filteredSkills.map((skill, idx) => {
                const delta = skill.demandScore - skill.prevDemandScore;
                return (
                  <div
                    key={skill.skill}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Rank */}
                    <div className="w-6 text-xs font-bold text-slate-400 text-center shrink-0">
                      {idx + 1}
                    </div>

                    {/* Skill Info */}
                    <div className="w-40 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 text-sm">
                          {skill.skill}
                        </span>
                        {skill.emerging && (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Flame className="w-2.5 h-2.5" />
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{skill.category}</div>
                    </div>

                    {/* Demand Bar */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Demand Score</span>
                        <span className="text-xs font-bold text-slate-900">
                          {skill.demandScore}/100
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-700',
                            skill.demandScore >= 90
                              ? 'bg-brand-600'
                              : skill.demandScore >= 75
                              ? 'bg-brand-400'
                              : skill.demandScore >= 60
                              ? 'bg-cyan-500'
                              : 'bg-slate-400'
                          )}
                          style={{ width: `${skill.demandScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Growth Rate */}
                    <div
                      className={cn(
                        'w-20 text-right text-sm font-bold shrink-0 flex items-center justify-end gap-0.5',
                        skill.growthRate > 0
                          ? 'text-emerald-600'
                          : skill.growthRate < 0
                          ? 'text-rose-500'
                          : 'text-slate-400'
                      )}
                    >
                      <TrendIcon trend={skill.trend} />
                      {skill.growthRate > 0 ? '+' : ''}
                      {skill.growthRate}%
                    </div>

                    {/* Job Count */}
                    <div className="w-24 text-right shrink-0">
                      <div className="text-sm font-semibold text-slate-700">
                        {formatNumber(skill.jobCount)}
                      </div>
                      <div className="text-xs text-slate-400">open roles</div>
                    </div>

                    {/* Avg Salary */}
                    <div className="w-28 text-right shrink-0">
                      <div className="text-sm font-bold text-emerald-600">
                        {formatSalary(skill.avgSalary)}
                      </div>
                      <div className="text-xs text-slate-400">avg salary</div>
                    </div>

                    {/* Action */}
                    <Link
                      href={`/skill-gap?role=${skill.skill}`}
                      className="shrink-0 p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Salary Distribution ── */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900">Salary Distribution Curves</h2>
              <Badge variant="secondary" className="text-xs ml-auto">US Market · USD Annual</Badge>
            </div>
            <div className="p-6 space-y-5">
              {SALARY_BANDS.map((band) => (
                <div
                  key={band.title}
                  className={cn(
                    'p-4 rounded-xl border cursor-pointer transition-all duration-200',
                    activeSalaryRole === band.title
                      ? 'border-brand-200 bg-brand-50'
                      : 'border-slate-100 hover:border-slate-200'
                  )}
                  onClick={() =>
                    setActiveSalaryRole(
                      activeSalaryRole === band.title ? null : band.title
                    )
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">
                        {band.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatNumber(band.count)} active roles
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-600">
                        {formatSalary(band.p50)}
                      </div>
                      <div className="text-xs text-slate-400">median (P50)</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { label: 'P25', value: band.p25, color: 'bg-slate-300' },
                      { label: 'P50', value: band.p50, color: 'bg-emerald-400' },
                      { label: 'P75', value: band.p75, color: 'bg-brand-400' },
                      { label: 'P90', value: band.p90, color: 'bg-violet-500' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500 w-6">
                          {label}
                        </span>
                        <SalaryBar value={value} max={maxSalary} color={color} />
                      </div>
                    ))}
                  </div>

                  {activeSalaryRole === band.title && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex gap-4 text-xs text-slate-500">
                      <span>
                        💡 Range:{' '}
                        <strong className="text-slate-700">
                          {formatSalary(band.p25)} – {formatSalary(band.p90)}
                        </strong>
                      </span>
                      <span>
                        📊 Spread:{' '}
                        <strong className="text-slate-700">
                          {formatSalary(band.p90 - band.p25)}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom Grid: Hubs + Work Mode ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hiring Hubs */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                <h2 className="font-bold text-slate-900">Top Hiring Hubs</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {HIRING_HUBS.map((hub, idx) => (
                  <div
                    key={hub.city}
                    className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="w-5 text-xs font-bold text-slate-400 text-center">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {hub.city}
                        </span>
                        <span className="text-xs text-slate-400">{hub.country}</span>
                        {hub.remote && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Globe className="w-2.5 h-2.5" />
                            Remote OK
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        Top skill: <strong className="text-slate-600">{hub.topSkill}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-700">
                        {formatNumber(hub.jobCount)}
                      </div>
                      <div className="text-xs text-slate-400">openings</div>
                    </div>
                    <div className="text-right w-24">
                      <div className="text-sm font-bold text-emerald-600">
                        {formatSalary(hub.avgSalary)}
                      </div>
                      <div className="text-xs text-slate-400">avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Mode Share */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-600" />
                <h2 className="font-bold text-slate-900">Work Mode Share</h2>
              </div>
              <div className="p-6 space-y-6">
                {WORK_MODE_SHARES.map((item) => {
                  const colors: Record<string, { bar: string; text: string; bg: string; border: string }> = {
                    Remote: { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                    Hybrid: { bar: 'bg-brand-500', text: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200' },
                    'On-Site': { bar: 'bg-slate-400', text: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' },
                  };
                  const c = colors[item.mode];
                  return (
                    <div key={item.mode}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {item.mode}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'text-xs font-bold',
                              item.yoyChange > 0 ? 'text-emerald-600' : 'text-rose-500'
                            )}
                          >
                            {item.yoyChange > 0 ? '+' : ''}{item.yoyChange}% YoY
                          </span>
                          <span className="text-sm font-black text-slate-900">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-700', c.bar)}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      Remote work demand has grown +3% YoY. AI engineering roles show 58%
                      remote availability vs. 41% overall market average.
                    </span>
                  </div>
                </div>
              </div>

              {/* Market Gap Detection */}
              <div className="px-6 pb-6">
                <div className="bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-rose-700">Market Gap Alert</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-2">
                    <strong>vLLM + CUDA</strong> shows severe candidate shortage
                    with 3,840 open roles and only ~800 qualified engineers globally.
                  </p>
                  <Link href="/what-if">
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors">
                      <Sparkles className="w-3.5 h-3.5" />
                      Simulate These Skills
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
