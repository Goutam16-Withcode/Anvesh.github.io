'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  FileText,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sliders,
  Sparkles,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Globe,
  DollarSign,
  TrendingUp,
  Search,
  Layers,
  GitGraph,
  Route,
  LayoutDashboard,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResumeDropzone } from '@/components/ResumeUpload';
import { SkillPill } from '@/components/SkillGraph';
import {
  api,
  CandidateProfile,
  INITIAL_CANDIDATE_PROFILE,
  MOCK_CANDIDATE_PROFILE,
  VerifiedSkill,
  WorkExperience,
  EducationEntry,
} from '@/lib/api';
import { formatNumber, formatSalary } from '@/lib/utils';

export default function ProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile>(INITIAL_CANDIDATE_PROFILE);
  const [activeTab, setActiveTab] = useState<'resume' | 'skills' | 'experience' | 'preferences'>('resume');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Skill Add State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<VerifiedSkill['proficiency']>('ADVANCED');
  const [newSkillCategory, setNewSkillCategory] = useState('Languages');

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

      // Check if logged in user exists
      const storedUser = localStorage.getItem('anvesh_user');
      let baseProfile = INITIAL_CANDIDATE_PROFILE;
      if (storedUser) {
        const u = JSON.parse(storedUser);
        baseProfile = {
          ...INITIAL_CANDIDATE_PROFILE,
          fullName: u.full_name || 'Candidate',
          email: u.email || '',
        };
      }

      const data = await api.getProfile();
      if (data && data.fullName && data.fullName !== 'Goutam Explorer') {
        setProfile(data);
      } else {
        setProfile(baseProfile);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadSampleProfile = () => {
    setProfile(MOCK_CANDIDATE_PROFILE);
    try {
      localStorage.setItem('anvesh_profile', JSON.stringify(MOCK_CANDIDATE_PROFILE));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('anvesh_profile_updated'));
      }
    } catch (_) {}
  };

  const handleResetProfile = () => {
    setProfile(INITIAL_CANDIDATE_PROFILE);
    try {
      localStorage.removeItem('anvesh_profile');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('anvesh_profile_updated'));
      }
    } catch (_) {}
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('anvesh_profile', JSON.stringify(profile));
      await api.updateProfile(profile);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('anvesh_profile_updated'));
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileExtracted = (parsedProfile: Partial<CandidateProfile>) => {
    setProfile((prev) => {
      const updated: CandidateProfile = {
        ...prev,
        ...parsedProfile,
        fullName: parsedProfile.fullName || prev.fullName,
        email: parsedProfile.email || prev.email,
        headline: parsedProfile.headline || prev.headline,
        location: parsedProfile.location || prev.location,
        yearsExperience: parsedProfile.yearsExperience || prev.yearsExperience,
        skills: parsedProfile.skills && parsedProfile.skills.length > 0 ? parsedProfile.skills : prev.skills,
        experience: parsedProfile.experience && parsedProfile.experience.length > 0 ? parsedProfile.experience : prev.experience,
        education: parsedProfile.education && parsedProfile.education.length > 0 ? parsedProfile.education : prev.education,
        resume: parsedProfile.resume || prev.resume,
      };

      try {
        localStorage.setItem('anvesh_profile', JSON.stringify(updated));
        const currentUser = localStorage.getItem('anvesh_user');
        if (currentUser) {
          const u = JSON.parse(currentUser);
          u.full_name = updated.fullName;
          u.email = updated.email;
          localStorage.setItem('anvesh_user', JSON.stringify(u));
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('anvesh_profile_updated'));
        }
      } catch (_) {}

      return updated;
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newSkill: VerifiedSkill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      years: 2,
      verified: true,
    };
    setProfile((prev) => {
      const updated = {
        ...prev,
        skills: [...prev.skills, newSkill],
      };
      try {
        localStorage.setItem('anvesh_profile', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        skills: prev.skills.filter((s) => s.name !== skillName),
      };
      try {
        localStorage.setItem('anvesh_profile', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleSkillsFromResume = (newSkills: string[]) => {
    const existing = profile.skills.map((s) => s.name);
    const added: VerifiedSkill[] = newSkills
      .filter((s) => !existing.includes(s))
      .map((s) => ({
        name: s,
        category: 'AI & ML',
        proficiency: 'ADVANCED',
        years: 3,
        verified: true,
      }));

    setProfile((prev) => {
      const updated = {
        ...prev,
        skills: [...prev.skills, ...added],
      };
      try {
        localStorage.setItem('anvesh_profile', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-8">
        {/* Profile Hero Header Card */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-white via-brand-50/20 to-indigo-50/30 border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0 border-2 border-white">
                {profile.fullName.substring(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {profile.fullName}
                  </h1>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-mono gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Candidate
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {profile.headline}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.location}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-slate-700 font-semibold">
                    {profile.yearsExperience} Yrs Exp
                  </span>
                  <span>•</span>
                  <span className="text-brand-600 font-mono font-bold">
                    Target: {profile.targetRole}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end md:self-center shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSampleProfile}
                className="text-xs font-semibold text-slate-700 hover:text-brand-600"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-500" />
                Fill Sample Demo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetProfile}
                className="text-xs text-slate-500 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="gap-1.5 font-bold text-xs"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Discovery Launchpad */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/jobs"
            className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-brand-500 hover:shadow-card transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Jobs Catalog</h4>
              <p className="text-[11px] text-slate-500">Live matched openings</p>
            </div>
          </Link>

          <Link
            href="/what-if"
            className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-card transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">What-If Suite</h4>
              <p className="text-[11px] text-slate-500">Simulate salary & skills</p>
            </div>
          </Link>

          <Link
            href="/skill-gap"
            className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500 hover:shadow-card transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <GitGraph className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Skill Gap Radar</h4>
              <p className="text-[11px] text-slate-500">Compare with target roles</p>
            </div>
          </Link>

          <Link
            href="/career-path"
            className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-cyan-500 hover:shadow-card transition-all flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">Career Trajectory</h4>
              <p className="text-[11px] text-slate-500">Explore roadmap graph</p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
          {[
            { id: 'resume', label: 'Resume & Deterministic Parsing', icon: FileText },
            { id: 'skills', label: `Verified Skills (${profile.skills.length})`, icon: ShieldCheck },
            { id: 'experience', label: 'Experience & Education', icon: Briefcase },
            { id: 'preferences', label: 'Career & Salary Preferences', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Resume & Deterministic Parsing */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            <ResumeDropzone
              currentResume={profile.resume}
              onSkillsExtracted={handleSkillsFromResume}
              onProfileExtracted={handleProfileExtracted}
            />
          </div>
        )}

        {/* Tab 2: Verified Skills Management */}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  Canonical Technical Skills Taxonomy
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your verified competencies. These skills directly drive your 384-d vector embeddings and LambdaMART ranking score.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60">
                {profile.skills.length} Verified Skills
              </span>
            </div>

            {/* Add New Skill Bar */}
            <form onSubmit={handleAddSkill} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-3">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Enter skill name (e.g. CUDA, Kubernetes, Rust, vLLM)..."
                className="text-xs h-9"
              />

              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="h-9 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shrink-0"
              >
                <option value="Languages">Languages</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Backend">Backend</option>
                <option value="Databases">Databases</option>
                <option value="DevOps">DevOps</option>
                <option value="Systems">Systems</option>
              </select>

              <select
                value={newSkillProficiency}
                onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                className="h-9 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shrink-0"
              >
                <option value="EXPERT">Expert</option>
                <option value="ADVANCED">Advanced</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="BEGINNER">Beginner</option>
              </select>

              <Button type="submit" size="sm" className="h-9 text-xs font-bold gap-1 shrink-0">
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </Button>
            </form>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {profile.skills.map((sk) => (
                <div
                  key={sk.name}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-brand-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 font-bold text-xs flex items-center justify-center border border-brand-200/60">
                      {sk.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{sk.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {sk.category} • <strong className="text-brand-600 font-semibold">{sk.proficiency}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk.name)}
                    className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Experience & Education Timeline */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {/* Experience List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-600" />
                    Professional Work Experience
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Extracted from resume with deterministic entity resolution and skill context mapping.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {profile.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{exp.role}</h4>
                        <p className="text-xs text-slate-600 font-medium">{exp.company} • {exp.location}</p>
                      </div>

                      <Badge variant="outline" className="font-mono text-xs self-start sm:self-center">
                        {exp.startDate} - {exp.endDate}
                      </Badge>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                      {exp.skillsUsed.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Education & Credentials
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {profile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 flex items-start justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{edu.degree} in {edu.field}</h4>
                      <p className="text-xs text-slate-600">{edu.institution} • Class of {edu.graduationYear}</p>
                      {edu.honors && (
                        <span className="text-[11px] text-amber-600 font-semibold font-mono mt-1 block">
                          ★ {edu.honors}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Career & Salary Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-600" />
                  Career Preferences & Search Calibration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize your salary thresholds, desired work mode, and target AI industry domains.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Salary Floor */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Minimum Base Compensation Floor
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="number"
                    value={profile.preferences.minSalaryUsd}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        preferences: { ...prev.preferences, minSalaryUsd: Number(e.target.value) },
                      }))
                    }
                    className="pl-9 font-mono font-bold"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Current Target Floor: {formatSalary(profile.preferences.minSalaryUsd)} / yr
                </p>
              </div>

              {/* Preferred Work Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Preferred Work Mode
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['REMOTE', 'HYBRID', 'ON_SITE', 'ANY'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: { ...prev.preferences, preferredWorkMode: mode as any },
                        }))
                      }
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        profile.preferences.preferredWorkMode === mode
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {mode.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Domains */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Target AI & Engineering Domains
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.preferences.targetDomains.map((domain) => (
                  <span
                    key={domain}
                    className="px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 text-xs font-medium"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* Save CTA */}
            <div className="pt-4 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving} className="font-bold text-xs gap-1.5">
                <Save className="w-4 h-4" />
                Save Preference Settings
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
