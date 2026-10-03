'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ChevronRight,
  User,
  LogOut,
  LayoutDashboard,
  Menu as MenuIcon,
  X,
  FileText,
  GitGraph,
  Search,
  Cpu,
  TrendingUp,
  Terminal,
  Route,
  ShieldCheck,
  Activity,
  Layers,
  HelpCircle,
  Scale,
  BarChart3,
  Map,
  Shield,
} from 'lucide-react';
import { Button } from './ui/button';
import { Menu, MenuItem, ProductItem, HoveredLink } from './ui/navbar-menu';
import { ResizableFloatingNavbar } from './ui/floating-navbar';
import { useAuth } from '@/lib/auth-context';
import { AnveshBrandLockup } from './ui/anvesh-logo';
import { NotificationCenter } from './Notifications/NotificationCenter';

export function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, openAuthModal, logout } = useAuth();

  return (
    <>
      <ResizableFloatingNavbar>
        {/* Bespoke ANVESH Brand Lockup Logo */}
        <Link href="/" className="focus:outline-none shrink-0">
          <AnveshBrandLockup size="sm" />
        </Link>

        {/* Aceternity UI Floating Navbar Menu (Desktop) */}
        <div className="hidden lg:flex items-center justify-center">
          <Menu setActive={setActive}>
            {/* Menu Item 1: Discovery */}
            <MenuItem setActive={setActive} active={active} item="Discovery">
              <div className="grid grid-cols-2 gap-3 w-[480px]">
                <ProductItem
                  title="Live Jobs Catalog"
                  description="Explore 100k+ AI & Systems positions with 384-d semantic search"
                  href="/jobs"
                  icon={<Search className="w-4 h-4 text-brand-600" />}
                  badge="100k+ Live"
                />
                <ProductItem
                  title="What-If Simulation Suite"
                  description="Simulate prospective skill acquisition & salary lift"
                  href="/what-if"
                  icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
                  badge="+52.8%"
                />
                <ProductItem
                  title="Skill Gap Analyzer"
                  description="Deterministic vector distance & missing skills radar"
                  href="/skill-gap"
                  icon={<GitGraph className="w-4 h-4 text-indigo-600" />}
                  badge="Radar"
                />
                <ProductItem
                  title="Career Path Visualization"
                  description="Shortest mathematical graph transitions to target roles"
                  href="/career-path"
                  icon={<Route className="w-4 h-4 text-cyan-600" />}
                  badge="Graph DB"
                />
                <ProductItem
                  title="Compare Job Offers"
                  description="Side-by-side matrix: salary, skill fit, growth trajectory across 4 offers"
                  href="/compare-jobs"
                  icon={<Scale className="w-4 h-4 text-violet-600" />}
                  badge="Matrix"
                />
                <ProductItem
                  title="Market Trends"
                  description="Skill velocity index, salary curves, hiring hubs & remote share"
                  href="/market-trends"
                  icon={<BarChart3 className="w-4 h-4 text-cyan-600" />}
                  badge="Live Data"
                />
              </div>
            </MenuItem>

            {/* Menu Item 2: Capabilities */}
            <MenuItem setActive={setActive} active={active} item="Capabilities">
              <div className="grid grid-cols-2 gap-3 w-[480px]">
                <ProductItem
                  title="Candidate Profile & Resume"
                  description="Deterministic AST parser with verified skill manager"
                  href="/profile"
                  icon={<FileText className="w-4 h-4 text-slate-700" />}
                  badge="Profile"
                />
                <ProductItem
                  title="Autonomous Career Agent"
                  description="Tool-orchestrated LangChain assistant with verified traces"
                  href="/dashboard"
                  icon={<Terminal className="w-4 h-4 text-brand-600" />}
                  badge="Tools"
                />
                <ProductItem
                  title="Interactive Knowledge Graph"
                  description="Explore 15,400+ nodes, prerequisite DAGs and shortest bridge paths"
                  href="/skill-graph"
                  icon={<GitGraph className="w-4 h-4 text-indigo-600" />}
                  badge="2D Graph"
                />
                <ProductItem
                  title="MMR Diversity Engine"
                  description="Maximal Marginal Relevance with freshness decay scoring"
                  href="/jobs"
                  icon={<Layers className="w-4 h-4 text-cyan-600" />}
                />
                <ProductItem
                  title="Career Roadmap & Kanban"
                  description="Actionable upskilling board with XP tracking and curated resources"
                  href="/roadmap"
                  icon={<Map className="w-4 h-4 text-violet-600" />}
                  badge="Kanban"
                />
                <ProductItem
                  title="Resume PII Reviewer"
                  description="Zero-PII masker with entity detection and stealth mode"
                  href="/profile/review"
                  icon={<Shield className="w-4 h-4 text-rose-600" />}
                  badge="Zero-PII"
                />
              </div>
            </MenuItem>

            {/* Menu Item 3: Showcase & Security */}
            <MenuItem setActive={setActive} active={active} item="Showcase & Security">
              <div className="flex flex-col space-y-2 w-[240px] p-1">
                <HoveredLink href="/jobs" className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-brand-600" />
                  <span>Browse Jobs Catalog</span>
                </HoveredLink>
                <HoveredLink href="/what-if" className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>What-If Sandbox Studio</span>
                </HoveredLink>
                <HoveredLink href="/skill-gap" className="flex items-center gap-2">
                  <GitGraph className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Skill Gap Analyzer</span>
                </HoveredLink>
                <HoveredLink href="/career-path" className="flex items-center gap-2">
                  <Route className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Career Path Trajectory</span>
                </HoveredLink>
                <HoveredLink href="/compare-jobs" className="flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-violet-600" />
                  <span>Compare Job Offers</span>
                </HoveredLink>
                <HoveredLink href="/market-trends" className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Market Trends Dashboard</span>
                </HoveredLink>
                <HoveredLink href="/roadmap" className="flex items-center gap-2">
                  <Map className="w-3.5 h-3.5 text-violet-600" />
                  <span>Learning Roadmap Kanban</span>
                </HoveredLink>
                <HoveredLink href="/profile/review" className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-rose-600" />
                  <span>Resume PII Reviewer</span>
                </HoveredLink>
                <HoveredLink href="/profile" className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-700" />
                  <span>Profile & Resume Manager</span>
                </HoveredLink>
                <HoveredLink href="/#security" className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Enterprise Security & RBAC</span>
                </HoveredLink>
              </div>
            </MenuItem>
          </Menu>
        </div>

        {/* Auth & CTA Actions with Notification Center */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Real-Time Career Intelligence Notification Center */}
          <NotificationCenter />

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4 text-brand-600" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center overflow-hidden border border-brand-200">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    user.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAuthModal('login')}
                className="font-bold text-slate-700 border-slate-300 shadow-sm"
              >
                Sign In
              </Button>
              <Button
                variant="noise"
                size="sm"
                onClick={() => openAuthModal('signup')}
                className="gap-1.5 font-bold"
              >
                <span>Get Started</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger & Notification Bell */}
        <div className="flex lg:hidden items-center gap-2">
          <NotificationCenter />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </ResizableFloatingNavbar>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-20 inset-x-4 z-50 lg:hidden bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-3">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-brand-600 py-1 transition-colors flex items-center justify-between"
            >
              <span>Explore Jobs Catalog</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">100k+</span>
            </Link>
            <Link
              href="/what-if"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-brand-600 py-1 transition-colors flex items-center justify-between"
            >
              <span>What-If Simulation Studio</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Live ROI</span>
            </Link>
            <Link
              href="/skill-gap"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-brand-600 py-1 transition-colors flex items-center justify-between"
            >
              <span>Skill Gap Analyzer</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Radar</span>
            </Link>
            <Link
              href="/skill-graph"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-brand-600 py-1 transition-colors flex items-center justify-between"
            >
              <span>Skill & Role Knowledge Graph</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">2D DAG</span>
            </Link>
            <Link
              href="/career-path"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-brand-600 py-1 transition-colors flex items-center justify-between"
            >
              <span>Career Path Trajectory</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">Roadmap</span>
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-brand-600 py-1 transition-colors flex items-center justify-between"
            >
              <span>Candidate Profile & Resume</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">AST Parser</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-800 hover:text-brand-600 py-1 transition-colors flex items-center justify-between"
            >
              <span>Autonomous Agent Console</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">AI Agent</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {user ? (
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="noise" className="w-full justify-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-center text-red-600" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-center font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="noise"
                  className="w-full justify-center font-bold gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                >
                  <span>Get Started Free</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
