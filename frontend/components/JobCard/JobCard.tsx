'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { BookmarkButton } from './BookmarkButton';
import { MatchBreakdownBadge } from './MatchBreakdownBadge';
import { WhyNotDiagnosisModal } from './WhyNotDiagnosisModal';
import { Job } from '@/lib/api';
import { formatSalary } from '@/lib/utils';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
  onSelectJob?: (job: Job) => void;
  onSimulateSkills?: (missingSkills: string[]) => void;
}

export function JobCard({ job, onSelectJob, onSimulateSkills }: JobCardProps) {
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const matchPercent = Math.round(job.match_score * 100);

  return (
    <CardSpotlight
      color="#4f46e5"
      radius={260}
      className="bg-white border-slate-200/90 hover:border-brand-300 transition-all duration-300 shadow-subtle hover:shadow-md cursor-pointer select-none"
    >
      <div onClick={() => onSelectJob?.(job)} className="space-y-4">
        {/* Top Company & Meta Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/50 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shadow-2xs shrink-0">
              {job.company.name.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800 text-sm">{job.company.name}</span>
                {job.company.verified && (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified
                  </Badge>
                )}
                <span className="text-xs text-slate-400 font-mono">• {job.category}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug hover:text-brand-600 transition-colors">
                {job.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.company.location}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700 font-mono">
                  {job.work_mode.replace('_', ' ')}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-600">
                  {job.experience_level} ({job.experience_years_range[0]}-{job.experience_years_range[1]}y)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* LTR Match Pill */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-700 font-mono font-bold text-xs shadow-2xs">
                <span>{matchPercent}% Match</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">LTR Rank #{job.rank || 1}</div>
            </div>

            <BookmarkButton jobId={job.id} />
          </div>
        </div>

        {/* Salary & Description Snippet */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="text-sm font-extrabold font-mono text-slate-900">
            {formatSalary(job.min_salary)} - {formatSalary(job.max_salary)}{' '}
            <span className="text-xs font-normal text-slate-500">{job.currency} / yr</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Verified vs Missing Skills Breakdown Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {job.matched_skills.slice(0, 4).map((sk) => (
            <span
              key={sk}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-medium"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {sk}
            </span>
          ))}

          {job.missing_skills.map((sk) => (
            <span
              key={sk}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/80 text-[11px] font-medium"
            >
              <AlertCircle className="w-3 h-3 text-rose-500" />
              {sk}
            </span>
          ))}
        </div>

        {/* 4-Factor Ranking Breakdown Ribbon */}
        <MatchBreakdownBadge breakdown={job.breakdown} matchScore={job.match_score} />

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {job.missing_skills.length > 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulateSkills?.(job.missing_skills);
                }}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Simulate acquiring {job.missing_skills.slice(0, 2).join(', ')}
              </button>
            ) : (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Skills Matched
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDiagnosisOpen(true);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-all border border-slate-200/60"
              title="Inspect LightGBM SHAP feature contributions and gatekeeper diagnostics"
            >
              <ShieldAlert className="w-3 h-3 text-indigo-500" />
              <span>Why Not 100%?</span>
            </button>
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectJob?.(job);
            }}
            className="text-xs font-bold gap-1 h-8"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Explainable AI Rejection Diagnosis Modal */}
        <WhyNotDiagnosisModal
          job={job}
          isOpen={isDiagnosisOpen}
          onClose={() => setIsDiagnosisOpen(false)}
        />
      </div>
    </CardSpotlight>
  );
}
