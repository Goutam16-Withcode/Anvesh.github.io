import React from 'react';
import Link from 'next/link';
import { Compass, Search, Home, Briefcase, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnveshBrandLockup } from '@/components/ui/anvesh-logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <Link href="/">
            <AnveshBrandLockup size="md" />
          </Link>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono uppercase tracking-wider">
            <span>HTTP 404</span>
            <span>&bull;</span>
            <span>Trajectory Node Not Found</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Off the Career Graph
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            The page or resource you requested does not exist in our 15,400+ ontology nodes or has transitioned to a new trajectory.
          </p>
        </div>

        {/* Quick Recovery Navigation */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link href="/jobs" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/40 hover:bg-white/10 transition-all text-left flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Jobs Catalog</div>
              <div className="text-[10px] text-slate-400">100k+ Openings</div>
            </div>
          </Link>

          <Link href="/what-if" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all text-left flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">What-If Suite</div>
              <div className="text-[10px] text-slate-400">Simulate ROI</div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full gap-2 text-xs font-bold px-6 py-2.5">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full text-xs font-semibold bg-white/5 border-white/10 text-white hover:bg-white/10 px-6 py-2.5">
              <span>Candidate Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
