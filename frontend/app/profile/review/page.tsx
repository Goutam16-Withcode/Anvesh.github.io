'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
  Upload,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  Linkedin,
  Github,
  ExternalLink,
  Download,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  Tag,
  X,
  ZapOff,
  ShieldCheck,
  Info,
  Copy,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ─── Mock PII Entities ───────────────────────────────────────────────
interface PIIEntity {
  id: string;
  type: 'PHONE' | 'EMAIL' | 'ADDRESS' | 'NAME' | 'DATE' | 'LINKEDIN' | 'GITHUB' | 'URL';
  value: string;
  redacted: string;
  masked: boolean;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  line: number;
}

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  entities: string[]; // PIIEntity ids in this section
}

const MOCK_PII_ENTITIES: PIIEntity[] = [
  {
    id: 'e1',
    type: 'NAME',
    value: 'Anvesh Kumar Sharma',
    redacted: '[CANDIDATE_ID_7X3K]',
    masked: false,
    riskLevel: 'MEDIUM',
    line: 1,
  },
  {
    id: 'e2',
    type: 'EMAIL',
    value: 'anvesh.sharma@gmail.com',
    redacted: '[EMAIL_REDACTED]',
    masked: false,
    riskLevel: 'HIGH',
    line: 2,
  },
  {
    id: 'e3',
    type: 'PHONE',
    value: '+91-98765-43210',
    redacted: '[PHONE_REDACTED]',
    masked: false,
    riskLevel: 'HIGH',
    line: 3,
  },
  {
    id: 'e4',
    type: 'ADDRESS',
    value: 'Flat 4B, Koramangala, Bangalore - 560034',
    redacted: '[LOCATION_REDACTED]',
    masked: false,
    riskLevel: 'HIGH',
    line: 4,
  },
  {
    id: 'e5',
    type: 'LINKEDIN',
    value: 'linkedin.com/in/anvesh-sharma-ml',
    redacted: '[PROFILE_REDACTED]',
    masked: false,
    riskLevel: 'MEDIUM',
    line: 5,
  },
  {
    id: 'e6',
    type: 'GITHUB',
    value: 'github.com/anvesh-ml',
    redacted: '[PROFILE_REDACTED]',
    masked: false,
    riskLevel: 'LOW',
    line: 6,
  },
  {
    id: 'e7',
    type: 'DATE',
    value: 'May 2021',
    redacted: '[YEAR_REDACTED]',
    masked: false,
    riskLevel: 'LOW',
    line: 14,
  },
  {
    id: 'e8',
    type: 'DATE',
    value: 'June 2019',
    redacted: '[DATE_REDACTED]',
    masked: false,
    riskLevel: 'LOW',
    line: 22,
  },
];

const MOCK_SECTIONS: ResumeSection[] = [
  {
    id: 's1',
    title: 'Contact Information',
    entities: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'],
    content: `Anvesh Kumar Sharma
anvesh.sharma@gmail.com  ·  +91-98765-43210
Flat 4B, Koramangala, Bangalore - 560034
linkedin.com/in/anvesh-sharma-ml  ·  github.com/anvesh-ml`,
  },
  {
    id: 's2',
    title: 'Professional Summary',
    entities: [],
    content: `ML Systems Engineer with 5+ years building production-grade recommendation engines, vector databases, and LLM inference pipelines. Proven track record deploying HNSW-indexed Qdrant collections achieving sub-2ms retrieval at 10M+ scale. Deep expertise in PyTorch, CUDA kernel optimization, and distributed training with DeepSpeed ZeRO.`,
  },
  {
    id: 's3',
    title: 'Experience',
    entities: ['e7'],
    content: `Senior ML Engineer — TechCorp AI (May 2021 – Present)
• Designed LightGBM LambdaMART ranking pipeline achieving NDCG@10 = 0.942
• Optimized CUDA kernels reducing transformer inference latency by 3.2×
• Built Qdrant HNSW vector store indexing 50M+ job embeddings with 1.2ms P99

ML Engineer — StartupXYZ (2019 – 2021)
• Implemented hybrid BM25 + dense retrieval pipeline (Recall@500 = 0.94)
• Deployed FastAPI microservice serving 50k req/min with P99 < 15ms`,
  },
  {
    id: 's4',
    title: 'Education',
    entities: ['e8'],
    content: `B.Tech Computer Science & Engineering — IIT Bombay (June 2019)
GPA: 9.2 / 10.0 · Specialization: AI & Machine Learning`,
  },
  {
    id: 's5',
    title: 'Technical Skills',
    entities: [],
    content: `Languages: Python, C++, TypeScript, Rust
ML Frameworks: PyTorch, TensorFlow, JAX, Hugging Face Transformers
Systems: CUDA, TensorRT, vLLM, FlashAttention, DeepSpeed
Databases: Qdrant, PostgreSQL, Redis, DuckDB
Infrastructure: Kubernetes, Docker, Terraform, MLflow, Celery`,
  },
];

const ENTITY_CONFIG: Record<
  PIIEntity['type'],
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  NAME: {
    label: 'Full Name',
    icon: <User className="w-3.5 h-3.5" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  EMAIL: {
    label: 'Email',
    icon: <Mail className="w-3.5 h-3.5" />,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
  },
  PHONE: {
    label: 'Phone',
    icon: <Phone className="w-3.5 h-3.5" />,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
  },
  ADDRESS: {
    label: 'Address',
    icon: <MapPin className="w-3.5 h-3.5" />,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
  },
  LINKEDIN: {
    label: 'LinkedIn',
    icon: <Linkedin className="w-3.5 h-3.5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  GITHUB: {
    label: 'GitHub',
    icon: <Github className="w-3.5 h-3.5" />,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
  },
  DATE: {
    label: 'Date / Year',
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
  },
  URL: {
    label: 'URL',
    icon: <ExternalLink className="w-3.5 h-3.5" />,
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 border-cyan-200',
  },
};

const RISK_CONFIG = {
  HIGH: {
    label: 'High Risk',
    cls: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  MEDIUM: {
    label: 'Medium Risk',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  LOW: {
    label: 'Low Risk',
    cls: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export default function ProfileReviewPage() {
  const [entities, setEntities] = useState<PIIEntity[]>(MOCK_PII_ENTITIES);
  const [uploaded, setUploaded] = useState(true); // pre-loaded for demo
  const [dragging, setDragging] = useState(false);
  const [stealth, setStealth] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleEntity = (id: string) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === id ? { ...e, masked: !e.masked } : e))
    );
  };

  const toggleAll = (mask: boolean) => {
    setEntities((prev) => prev.map((e) => ({ ...e, masked: mask })));
  };

  const toggleStealth = () => {
    setStealth((s) => {
      const next = !s;
      setEntities((prev) => prev.map((e) => ({ ...e, masked: next })));
      return next;
    });
  };

  const maskedCount = entities.filter((e) => e.masked).length;
  const highRiskUnmasked = entities.filter(
    (e) => e.riskLevel === 'HIGH' && !e.masked
  ).length;

  const renderSectionContent = (section: ResumeSection) => {
    let text = section.content;
    // Replace entity values with redacted if masked
    entities
      .filter((e) => section.entities.includes(e.id))
      .forEach((entity) => {
        if (entity.masked) {
          text = text.replace(entity.value, entity.redacted);
        }
      });

    // Highlight remaining entity values
    const parts: React.ReactNode[] = [];
    let remaining = text;
    entities
      .filter((e) => section.entities.includes(e.id) && !e.masked)
      .forEach((entity) => {
        const idx = remaining.indexOf(entity.value);
        if (idx >= 0) {
          const config = ENTITY_CONFIG[entity.type];
          const before = remaining.slice(0, idx);
          const after = remaining.slice(idx + entity.value.length);
          remaining = before + `__PLACEHOLDER_${entity.id}__` + after;
        }
      });

    return remaining.split('\n').map((line, i) => (
      <div key={i} className="font-mono text-sm">
        {line
          .split(/(__PLACEHOLDER_\w+__)/)
          .map((part, j) => {
            const match = part.match(/__PLACEHOLDER_(\w+)__/);
            if (match) {
              const entity = entities.find((e) => e.id === match[1]);
              if (entity) {
                const config = ENTITY_CONFIG[entity.type];
                return (
                  <span
                    key={j}
                    className={cn(
                      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity',
                      config.bgColor,
                      config.color
                    )}
                    onClick={() => toggleEntity(entity.id)}
                    title={`Click to mask: ${entity.value}`}
                  >
                    {config.icon}
                    {entity.value}
                  </span>
                );
              }
            }
            return (
              <span key={j} className="text-slate-700">
                {part}
              </span>
            );
          })}
      </div>
    ));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setUploaded(true);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-24">
        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-white border-b border-slate-100">
          <div className="absolute inset-0 bg-grid-slate opacity-40" />
          <div className="absolute top-0 left-0 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Link href="/profile" className="hover:text-brand-600 transition-colors">
                Profile
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-medium">Resume Reviewer</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-3 py-1 text-xs font-semibold text-rose-700 mb-3">
                  <Shield className="w-3.5 h-3.5" />
                  Zero-PII Resume Inspector
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Resume{' '}
                  <span className="gradient-text">PII Masker</span>
                </h1>
                <p className="mt-2 text-slate-500 max-w-xl">
                  Inspect your resume for personally identifiable information. Toggle entities
                  to mask them before sharing with recruiters or uploading for vectorization.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={toggleStealth}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border',
                    stealth
                      ? 'bg-slate-900 text-white border-slate-800 shadow-lg'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
                  )}
                >
                  {stealth ? (
                    <Lock className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  {stealth ? '🛡️ Stealth Mode Active' : 'Enable Stealth Mode'}
                </button>
                <div className="text-xs text-center text-slate-400">
                  Masks all HIGH + MEDIUM risk PII
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Left: PII Control Panel ── */}
            <div className="lg:col-span-1 space-y-4">
              {/* Risk Summary */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-500" />
                  PII Risk Summary
                </h2>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(['HIGH', 'MEDIUM', 'LOW'] as const).map((risk) => {
                    const count = entities.filter((e) => e.riskLevel === risk).length;
                    const maskedN = entities.filter(
                      (e) => e.riskLevel === risk && e.masked
                    ).length;
                    const config = RISK_CONFIG[risk];
                    return (
                      <div
                        key={risk}
                        className={cn(
                          'rounded-xl border p-2.5 text-center',
                          config.cls
                        )}
                      >
                        <div className="text-lg font-bold">{count - maskedN}</div>
                        <div className="text-xs font-medium">{config.label}</div>
                        <div className="text-xs opacity-70">{maskedN} masked</div>
                      </div>
                    );
                  })}
                </div>

                {highRiskUnmasked > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 mb-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>{highRiskUnmasked} high-risk</strong> entities are still
                      exposed. Consider masking before sharing.
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAll(true)}
                    className="flex-1 text-xs border-slate-200"
                  >
                    <EyeOff className="w-3.5 h-3.5 mr-1" />
                    Mask All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAll(false)}
                    className="flex-1 text-xs border-slate-200"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Show All
                  </Button>
                </div>
              </div>

              {/* Entity Toggle List */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
                <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-600" />
                  Detected Entities
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {entities.length} found
                  </Badge>
                </h2>
                <div className="space-y-2">
                  {entities.map((entity) => {
                    const config = ENTITY_CONFIG[entity.type];
                    const riskCfg = RISK_CONFIG[entity.riskLevel];
                    return (
                      <div
                        key={entity.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                          entity.masked
                            ? 'bg-slate-50 border-slate-100 opacity-60'
                            : cn('border bg-white', config.bgColor)
                        )}
                        onClick={() => toggleEntity(entity.id)}
                      >
                        <div
                          className={cn(
                            'p-1.5 rounded-lg',
                            entity.masked
                              ? 'bg-slate-100 text-slate-400'
                              : cn('text-current', config.color)
                          )}
                        >
                          {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs font-semibold text-slate-600">
                              {config.label}
                            </span>
                            <span
                              className={cn(
                                'inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full text-[10px] font-medium border',
                                riskCfg.cls
                              )}
                            >
                              <span
                                className={cn(
                                  'w-1.5 h-1.5 rounded-full',
                                  riskCfg.dot
                                )}
                              />
                              {entity.riskLevel}
                            </span>
                          </div>
                          <div
                            className={cn(
                              'text-xs truncate font-mono',
                              entity.masked
                                ? 'text-slate-400 line-through'
                                : 'text-slate-700'
                            )}
                          >
                            {entity.masked ? entity.redacted : entity.value}
                          </div>
                        </div>
                        <div
                          className={cn(
                            'w-7 h-4 rounded-full transition-colors duration-200 flex items-center',
                            entity.masked ? 'bg-slate-300' : 'bg-brand-500'
                          )}
                        >
                          <div
                            className={cn(
                              'w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ml-0.5',
                              entity.masked ? '' : 'translate-x-3'
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Privacy Score */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Privacy Score
                  </div>
                  <div className="text-3xl font-black text-emerald-400">
                    {Math.round((maskedCount / entities.length) * 100)}%
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${(maskedCount / entities.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {maskedCount}/{entities.length} entities masked ·{' '}
                  {maskedCount === entities.length
                    ? '🛡️ Maximum anonymity'
                    : highRiskUnmasked > 0
                    ? '⚠️ High-risk PII exposed'
                    : '✅ Low risk exposure'}
                </p>
              </div>
            </div>

            {/* ── Right: Resume Preview ── */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" />
                  Resume Preview
                  <span className="text-xs text-slate-400 font-normal">
                    (Click highlighted text to mask)
                  </span>
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="text-xs border-slate-200"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy Masked
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Export PDF
                  </Button>
                </div>
              </div>

              {/* Upload Zone (shown if no file) */}
              {!uploaded && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={cn(
                    'flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200',
                    dragging
                      ? 'border-brand-400 bg-brand-50'
                      : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/30'
                  )}
                >
                  <Upload className="w-10 h-10 text-brand-400" />
                  <div className="text-center">
                    <div className="font-semibold text-slate-700">
                      Drop your resume here
                    </div>
                    <div className="text-sm text-slate-400">PDF, DOCX supported</div>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={() => setUploaded(true)}
                  />
                </div>
              )}

              {/* Resume Sections */}
              {uploaded && (
                <div className="space-y-3">
                  {MOCK_SECTIONS.map((section) => (
                    <div
                      key={section.id}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-card"
                    >
                      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-semibold text-sm text-slate-800">
                          {section.title}
                        </h3>
                        {section.entities.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-amber-50 text-amber-700 border border-amber-200"
                          >
                            {section.entities.filter(
                              (id) => !entities.find((e) => e.id === id)?.masked
                            ).length}{' '}
                            PII exposed
                          </Badge>
                        )}
                      </div>
                      <div className="px-5 py-4 space-y-1 leading-relaxed">
                        {renderSectionContent(section)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Info Banner */}
              <div className="flex items-start gap-3 p-4 bg-brand-50 border border-brand-100 rounded-xl">
                <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <p className="text-xs text-brand-700">
                  <strong>Zero-PII Guarantee:</strong> Masked data never leaves your device. ANVESH
                  generates a cryptographic candidate vector for recruiter discovery without storing
                  any unencrypted personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
