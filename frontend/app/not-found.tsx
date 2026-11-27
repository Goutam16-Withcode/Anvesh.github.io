import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnveshBrandLockup } from '@/components/ui/anvesh-logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 selection:bg-brand-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-lg w-full text-center space-y-6 relative z-10 p-8 rounded-3xl bg-white border border-slate-200 shadow-card">
        <div className="flex justify-center">
          <AnveshBrandLockup size="md" />
        </div>

        <div className="space-y-3 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-mono font-bold">
            <span>HTTP 404 &bull; Vector Coordinate Not Mapped</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Route Not Found
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            The requested node does not exist in the active career navigation graph. Jump back to live discovery or counterfactual simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link
            href="/jobs"
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 transition-all text-left flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Explore Jobs</div>
              <div className="text-[11px] text-slate-500">Top MNCs &amp; Startups</div>
            </div>
          </Link>

          <Link
            href="/what-if"
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">What-If Simulator</div>
              <div className="text-[11px] text-slate-500">Model salary growth</div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full gap-2 text-xs font-bold px-6 py-2.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Home</span>
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full text-xs font-semibold px-6 py-2.5">
              <Compass className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
              <span>Open Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
