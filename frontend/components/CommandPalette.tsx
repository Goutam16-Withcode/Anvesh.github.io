'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Briefcase,
  TrendingUp,
  Cpu,
  GitGraph,
  FileCode2,
  Scale,
  BarChart3,
  Map,
  Shield,
  LayoutDashboard,
  User,
  Globe,
  Building,
  Sparkles,
  ArrowRight,
  Command,
  X,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Market Shortcuts' | 'AI Intelligence';
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    id: 'jobs',
    title: 'Global Jobs Marketplace',
    subtitle: 'Top MNCs, AI Startups & Zero Ghost Jobs',
    category: 'Navigation',
    href: '/jobs',
    icon: <Briefcase className="w-4 h-4 text-brand-600" />,
    badge: 'Live Daily',
  },
  {
    id: 'dashboard',
    title: 'Candidate Command Dashboard',
    subtitle: 'Personal pipeline, AI career copilot & feed',
    category: 'Navigation',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'career-twin',
    title: 'Digital Career Twin (3-Pillar Vector)',
    subtitle: 'Interactive market-fit ring & latent projection dials',
    category: 'AI Intelligence',
    href: '/career-twin',
    icon: <Cpu className="w-4 h-4 text-emerald-600" />,
    badge: 'Neural Avatar',
  },
  {
    id: 'what-if',
    title: 'What-If Counterfactual Simulator',
    subtitle: 'Model salary lift & skill knapsack optimization',
    category: 'AI Intelligence',
    href: '/what-if',
    icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
    badge: 'Simulator',
  },
  {
    id: 'skill-graph',
    title: '2D Interactive Skill Graph',
    subtitle: 'Shortest skill bridge traversal across roles',
    category: 'AI Intelligence',
    href: '/skill-graph',
    icon: <GitGraph className="w-4 h-4 text-cyan-600" />,
  },
  {
    id: 'skill-gap',
    title: 'Skill Gap Radar & Curriculum',
    subtitle: 'Competency gap matrix & upskilling plan',
    category: 'AI Intelligence',
    href: '/skill-gap',
    icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'resume-builder',
    title: 'LaTeX ATS Resume Builder',
    subtitle: 'Monaco live LaTeX editor & instant PDF export',
    category: 'Navigation',
    href: '/resume-builder',
    icon: <FileCode2 className="w-4 h-4 text-slate-700" />,
  },
  {
    id: 'compare-jobs',
    title: 'Side-by-Side Offer Comparison Matrix',
    subtitle: 'Compare compensation, equity & skill fit',
    category: 'Navigation',
    href: '/compare-jobs',
    icon: <Scale className="w-4 h-4 text-amber-600" />,
  },
  {
    id: 'market-trends',
    title: 'Market Trends & Salary Percentiles',
    subtitle: 'Explore P25-P90 curves and rising skill velocity',
    category: 'Market Shortcuts',
    href: '/market-trends',
    icon: <BarChart3 className="w-4 h-4 text-purple-600" />,
  },
  {
    id: 'roadmap',
    title: 'Gamified Learning Roadmap Kanban',
    subtitle: 'Track XP milestones & upskilling tasks',
    category: 'Navigation',
    href: '/roadmap',
    icon: <Map className="w-4 h-4 text-teal-600" />,
  },
  {
    id: 'profile',
    title: 'Candidate Profile & Resume Parser',
    subtitle: 'Upload resume with real date & skill extraction',
    category: 'Navigation',
    href: '/profile',
    icon: <User className="w-4 h-4 text-brand-600" />,
  },
  {
    id: 'profile-review',
    title: 'Zero-PII Resume Redactor',
    subtitle: 'Mask sensitive identifiers before sharing vectors',
    category: 'Navigation',
    href: '/profile/review',
    icon: <Shield className="w-4 h-4 text-rose-600" />,
  },
  {
    id: 'shortcut-mnc',
    title: 'Filter: Top MNC Engineering Roles',
    subtitle: 'Google, NVIDIA, Microsoft, Stripe, Meta, Amazon',
    category: 'Market Shortcuts',
    href: '/jobs?query=NVIDIA',
    icon: <Building className="w-4 h-4 text-purple-600" />,
    badge: 'MNCs',
  },
  {
    id: 'shortcut-remote',
    title: 'Filter: Global Remote Openings',
    subtitle: 'Verified work-from-anywhere roles updated today',
    category: 'Market Shortcuts',
    href: '/jobs?work_mode=REMOTE',
    icon: <Globe className="w-4 h-4 text-cyan-600" />,
    badge: 'Remote',
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onCustomOpen = () => setOpen(true);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('anvesh_open_command_palette', onCustomOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('anvesh_open_command_palette', onCustomOpen);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PALETTE_ITEMS;
    return PALETTE_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, open]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.16 }}
            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="w-4 h-4 text-brand-600 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDownInput}
                placeholder="Jump to any ANVESH tool, job filter, or simulator..."
                className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[55vh] overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No matching features found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isActive = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => handleSelect(item.href)}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                        isActive ? 'bg-brand-50 border border-brand-200/80' : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{item.subtitle}</div>
                        </div>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-300'}`} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hint */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">&uarr;&darr;</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Enter</kbd>
                  Open
                </span>
              </div>
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Command className="w-3 h-3" /> ANVESH Spotlight
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
