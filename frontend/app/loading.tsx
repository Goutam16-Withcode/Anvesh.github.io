import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Double Ring Loader */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
        </div>
        <div className="space-y-1 text-center">
          <div className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono">
            ANVESH Deterministic Engine
          </div>
          <div className="text-[11px] text-slate-500">
            Traversing canonical skill graph &amp; vector space...
          </div>
        </div>
      </div>
    </div>
  );
}
