'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnveshBrandLockup } from '@/components/ui/anvesh-logo';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ANVESH Client Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 selection:bg-brand-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10 p-8 rounded-3xl bg-white border border-slate-200 shadow-card">
        <div className="flex justify-center">
          <AnveshBrandLockup size="md" />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            Engine Encountered an Exception
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A client-side rendering issue occurred. No data or vector state was lost. You can reload the view or return safely to the dashboard.
          </p>
          {error.message && (
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-left font-mono text-[11px] text-rose-700 break-words mt-3">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto gap-2 text-xs font-bold px-5 py-2.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry View</span>
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full text-xs font-semibold px-5 py-2.5">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
