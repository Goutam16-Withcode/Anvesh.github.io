'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  X,
  DollarSign,
  TrendingUp,
  Briefcase,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BarChart3,
  Layers,
  Zap,
  ShieldCheck,
  Globe,
  Building,
  Award,
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_JOBS_CATALOG, Job } from '@/lib/api';
import { formatSalary, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

// ─── Mock jobs to compare ───────────────────────────────────────────
const COMPARABLE_JOBS = MOCK_JOBS_CATALOG.slice(0, 8);

type DimKey =
  | 'salary'
  | 'match'
  | 'skills'
  | 'experience'
  | 'growth'
  | 'culture'
  | 'learning';

interface Dimension {
  key: DimKey;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const DIMENSIONS: Dimension[] = [
  {
    key: 'salary',
    label: 'Compensation',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Base salary & total comp range',
  },
  {
    key: 'match',
    label: 'Match Score',
    icon: <Target className="w-4 h-4" />,
    description: 'ANVESH ML fit score',
  },
  {
    key: 'skills',
    label: 'Skill Coverage',
    icon: <Layers className="w-4 h-4" />,
    description: 'Required vs your skill overlap',
  },
  {
    key: 'experience',
    label: 'Experience Fit',
    icon: <Briefcase className="w-4 h-4" />,
    description: 'Seniority alignment',
  },
  {
    key: 'growth',
    label: 'Growth Potential',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Career trajectory score',
  },
  {
    key: 'learning',
    label: 'Learning Value',
    icon: <BookOpen className="w-4 h-4" />,
    description: 'New skills you\'d acquire',
  },
];

function computeScore(job: Job, dim: DimKey): number {
  switch (dim) {
    case 'salary': {
      const mid = (job.min_salary + job.max_salary) / 2;
      return Math.min(100, (mid / 400000) * 100);
    }
    case 'match':
      return Math.round(job.match_score * 100);
    case 'skills':
      return Math.round(job.breakdown.required_skill_match * 100);
    case 'experience':
      return job.breakdown.experience_fit === 'EXCELLENT'
        ? 95
        : job.breakdown.experience_fit === 'GOOD'
        ? 75
        : 50;
    case 'growth': {
      const levelMap: Record<string, number> = {
        SENIOR: 82,
        LEAD: 90,
        PRINCIPAL: 95,
        MID: 68,
        ENTRY: 55,
      };
      return levelMap[job.experience_level] ?? 70;
    }
    case 'learning':
      return Math.min(100, job.preferred_skills.length * 12 + 40);
    default:
      return 50;
  }
}

function ScoreBar({
  value,
  color,
  animate,
}: {
  value: number;
  color: string;
  animate?: boolean;
}) {
  return (
    <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-700', color)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function WorkModePill({ mode }: { mode: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    REMOTE: {
      label: '🌐 Remote',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    HYBRID: {
      label: '⚡ Hybrid',
      cls: 'bg-brand-50 text-brand-700 border-brand-200',
    },
    ON_SITE: {
      label: '🏢 On-Site',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  };
  const { label, cls } = map[mode] ?? {
    label: mode,
    cls: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        cls
      )}
    >
      {label}
    </span>
  );
}

export default function CompareJobsPage() {
  const [selected, setSelected] = useState<string[]>(
    COMPARABLE_JOBS.slice(0, 3).map((j) => j.id)
  );
  const [highlight, setHighlight] = useState<string | null>(null);

  const selectedJobs = useMemo(
    () => selected.map((id) => COMPARABLE_JOBS.find((j) => j.id === id)!).filter(Boolean),
    [selected]
  );

  const addJob = (id: string) => {
    if (selected.length >= 4 || selected.includes(id)) return;
    setSelected([...selected, id]);
  };

  const removeJob = (id: string) => {
    setSelected(selected.filter((s) => s !== id));
  };

  const winner = useMemo(() => {
    if (selectedJobs.length < 2) return null;
    return selectedJobs.reduce((best, job) => {
      const totalScore = DIMENSIONS.reduce(
        (sum, d) => sum + computeScore(job, d.key),
        0
      );
      const bestScore = DIMENSIONS.reduce(
        (sum, d) => sum + computeScore(best, d.key),
        0
      );
      return totalScore > bestScore ? job : best;
    });
  }, [selectedJobs]);

  const colColors = [
    'bg-brand-600',
    'bg-violet-600',
    'bg-cyan-600',
    'bg-amber-500',
  ];
  const borderColors = [
    'border-brand-200 ring-brand-100',
    'border-violet-200 ring-violet-100',
    'border-cyan-200 ring-cyan-100',
    'border-amber-200 ring-amber-100',
  ];
  const barColors = [
    'bg-brand-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-amber-500',
  ];
  const textColors = [
    'text-brand-600',
    'text-violet-600',
    'text-cyan-600',
    'text-amber-600',
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-24">
        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-white border-b border-slate-100">
          <div className="absolute inset-0 bg-grid-slate opacity-40" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Link href="/jobs" className="hover:text-brand-600 transition-colors">
                Jobs
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-medium">Compare Jobs</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 text-xs font-semibold text-brand-700 mb-3">
                  <Scale className="w-3.5 h-3.5" />
                  Side-by-Side Comparison Matrix
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Compare{' '}
                  <span className="gradient-text">Job Offers</span>
                </h1>
                <p className="mt-2 text-slate-500 max-w-xl">
                  Evaluate up to 4 opportunities across compensation, skill fit, growth
                  trajectory, and learning value — powered by ANVESH ML scoring.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-slate-500">
                  {selected.length}/4 selected
                </span>
                {winner && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                    <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-700">
                      Best: {winner.title.split(' ').slice(0, 3).join(' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* ── Job Picker ── */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-600" />
              Add jobs to compare
            </h2>
            <div className="flex flex-wrap gap-2">
              {COMPARABLE_JOBS.map((job) => {
                const isSelected = selected.includes(job.id);
                const isFull = selected.length >= 4 && !isSelected;
                return (
                  <button
                    key={job.id}
                    onClick={() => (isSelected ? removeJob(job.id) : addJob(job.id))}
                    disabled={isFull}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200',
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : isFull
                        ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700'
                    )}
                  >
                    {isSelected ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {job.title.split(' ').slice(0, 4).join(' ')}
                    <span className="text-xs opacity-70">
                      @ {job.company.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedJobs.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Scale className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">Select jobs above to start comparing</p>
            </div>
          ) : (
            <>
              {/* ── Header Cards ── */}
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${selectedJobs.length}, 1fr)` }}
              >
                {selectedJobs.map((job, idx) => (
                  <div
                    key={job.id}
                    className={cn(
                      'relative bg-white border-2 rounded-2xl p-5 shadow-card transition-all duration-300',
                      winner?.id === job.id
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : borderColors[idx],
                      highlight === job.id ? 'ring-2' : ''
                    )}
                    onMouseEnter={() => setHighlight(job.id)}
                    onMouseLeave={() => setHighlight(null)}
                  >
                    {winner?.id === job.id && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-white" />
                        Best Overall
                      </div>
                    )}
                    <button
                      onClick={() => removeJob(job.id)}
                      className="absolute top-3 right-3 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-3', colColors[idx])}>
                      {idx + 1}
                    </div>

                    <div className="font-bold text-slate-900 text-base leading-tight mb-1">
                      {job.title}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-1 mb-3">
                      <Building className="w-3.5 h-3.5" />
                      {job.company.name}
                      {job.company.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-500 ml-0.5" />
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.company.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="font-semibold text-slate-800">
                          {formatSalary(job.min_salary)} – {formatSalary(job.max_salary)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <WorkModePill mode={job.work_mode} />
                        <span className="capitalize text-slate-500 text-xs">
                          {job.experience_level.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    {/* Overall score */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">ANVESH Match</span>
                        <span className={cn('text-sm font-bold', textColors[idx])}>
                          {Math.round(job.match_score * 100)}%
                        </span>
                      </div>
                      <ScoreBar
                        value={Math.round(job.match_score * 100)}
                        color={barColors[idx]}
                      />
                    </div>

                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90',
                        colColors[idx]
                      )}
                    >
                      Apply Now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>

              {/* ── Dimension Matrix ── */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-600" />
                  <h2 className="font-bold text-slate-900">Dimension-by-Dimension Analysis</h2>
                </div>

                <div className="divide-y divide-slate-50">
                  {DIMENSIONS.map((dim) => {
                    const scores = selectedJobs.map((j) => computeScore(j, dim.key));
                    const maxScore = Math.max(...scores);

                    return (
                      <div key={dim.key} className="px-6 py-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
                            {dim.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">
                              {dim.label}
                            </div>
                            <div className="text-xs text-slate-400">{dim.description}</div>
                          </div>
                        </div>

                        <div
                          className="grid gap-4"
                          style={{
                            gridTemplateColumns: `repeat(${selectedJobs.length}, 1fr)`,
                          }}
                        >
                          {selectedJobs.map((job, idx) => {
                            const score = scores[idx];
                            const isWinner = score === maxScore;
                            return (
                              <div key={job.id} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-500 truncate max-w-[120px]">
                                    {job.company.name}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {isWinner && selectedJobs.length > 1 && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    )}
                                    <span
                                      className={cn(
                                        'text-sm font-bold',
                                        isWinner && selectedJobs.length > 1
                                          ? 'text-emerald-600'
                                          : textColors[idx]
                                      )}
                                    >
                                      {dim.key === 'salary'
                                        ? formatSalary(
                                            Math.round(
                                              ((job.min_salary + job.max_salary) / 2)
                                            )
                                          )
                                        : `${Math.round(score)}%`}
                                    </span>
                                  </div>
                                </div>
                                <ScoreBar value={score} color={barColors[idx]} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Skill Overlap ── */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-600" />
                  <h2 className="font-bold text-slate-900">Skill Overlap Matrix</h2>
                </div>
                <div className="px-6 py-5">
                  {/* Matched skills per job */}
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${selectedJobs.length}, 1fr)`,
                    }}
                  >
                    {selectedJobs.map((job, idx) => (
                      <div key={job.id}>
                        <div
                          className={cn(
                            'text-xs font-bold mb-2 uppercase tracking-wide',
                            textColors[idx]
                          )}
                        >
                          {job.company.name}
                        </div>
                        <div className="space-y-1.5">
                          {job.required_skills.slice(0, 6).map((skill) => {
                            const isMatched = job.matched_skills.includes(skill);
                            return (
                              <div
                                key={skill}
                                className={cn(
                                  'flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg',
                                  isMatched
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-600'
                                )}
                              >
                                {isMatched ? (
                                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                                ) : (
                                  <XCircle className="w-3 h-3 shrink-0" />
                                )}
                                {skill}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Summary Table ── */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-600" />
                  <h2 className="font-bold text-slate-900">Quick Summary</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">
                          Attribute
                        </th>
                        {selectedJobs.map((job, idx) => (
                          <th
                            key={job.id}
                            className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                            style={{ color: barColors[idx].replace('bg-', '').split('-')[0] }}
                          >
                            <span className={textColors[idx]}>
                              {job.company.name}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        {
                          label: 'Role Title',
                          render: (j: Job) => (
                            <span className="font-medium text-slate-800 line-clamp-1">
                              {j.title}
                            </span>
                          ),
                        },
                        {
                          label: 'Salary Range',
                          render: (j: Job) => (
                            <span className="font-bold text-emerald-600">
                              {formatSalary(j.min_salary)} – {formatSalary(j.max_salary)}
                            </span>
                          ),
                        },
                        {
                          label: 'Work Mode',
                          render: (j: Job) => <WorkModePill mode={j.work_mode} />,
                        },
                        {
                          label: 'Experience',
                          render: (j: Job) => (
                            <span className="capitalize text-slate-700">
                              {j.experience_level.toLowerCase()} ({j.experience_years_range[0]}–
                              {j.experience_years_range[1]}y)
                            </span>
                          ),
                        },
                        {
                          label: 'Match Score',
                          render: (j: Job) => (
                            <span className="font-bold text-brand-600">
                              {Math.round(j.match_score * 100)}%
                            </span>
                          ),
                        },
                        {
                          label: 'Skill Fit',
                          render: (j: Job) => (
                            <span>
                              {Math.round(j.breakdown.required_skill_match * 100)}% required
                            </span>
                          ),
                        },
                        {
                          label: 'Missing Skills',
                          render: (j: Job) => (
                            <span className={j.missing_skills.length > 2 ? 'text-rose-600 font-medium' : 'text-emerald-600'}>
                              {j.missing_skills.length} gap{j.missing_skills.length !== 1 ? 's' : ''}
                            </span>
                          ),
                        },
                        {
                          label: 'Posted',
                          render: (j: Job) => (
                            <span className="text-slate-500">
                              {j.breakdown.freshness_days}d ago
                            </span>
                          ),
                        },
                      ].map(({ label, render }) => (
                        <tr key={label} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3 text-xs font-medium text-slate-500">
                            {label}
                          </td>
                          {selectedJobs.map((job) => (
                            <td key={job.id} className="px-4 py-3 text-sm">
                              {render(job)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── CTA ── */}
              {winner && (
                <div className="bg-gradient-to-br from-emerald-50 to-brand-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Star className="w-6 h-6 text-emerald-600 fill-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        🏆 Best Match: {winner.title}
                      </div>
                      <div className="text-sm text-slate-600">
                        At {winner.company.name} · {formatSalary(winner.min_salary)} –{' '}
                        {formatSalary(winner.max_salary)} ·{' '}
                        {Math.round(winner.match_score * 100)}% fit
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/what-if">
                      <Button variant="outline" className="border-brand-200 text-brand-700 hover:bg-brand-50">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Simulate Skills
                      </Button>
                    </Link>
                    <a href={winner.apply_url} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Apply to Winner
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
