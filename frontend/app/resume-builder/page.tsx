'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  FileCode2,
  Download,
  Eye,
  Code2,
  ChevronRight,
  Sparkles,
  Copy,
  CheckCircle2,
  Layers,
  Zap,
  AlertCircle,
  Play,
  ChevronDown,
  FileText,
  Wand2,
  SplitSquareHorizontal,
  Monitor,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { registerLatexLanguage } from '@/lib/monaco-latex';

// ─── Dynamic Monaco Editor (SSR-safe) ───────────────────────────────
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading Editor…</span>
        </div>
      </div>
    ),
  }
);

// ─── LaTeX Templates ──────────────────────────────────────────────────
interface Template {
  id: string;
  name: string;
  description: string;
  badge: string;
  color: string;
  source: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'modern-ml',
    name: 'Modern ML Engineer',
    description: 'Clean two-column with skills sidebar — ATS optimized',
    badge: 'Most Popular',
    color: 'brand',
    source: `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{multicol}
\\usepackage{parskip}
\\usepackage{fontenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\setlength{\\parindent}{0pt}
\\hypersetup{colorlinks=true,urlcolor=blue}

\\begin{document}

%--- HEADER ---%
\\begin{center}
  {\\Huge\\bfseries Anvesh Kumar}\\\\[4pt]
  Senior ML Engineer \\textbar{} AI Systems Architect\\\\[4pt]
  \\href{mailto:anvesh@example.com}{anvesh@example.com} \\quad
  +91 98765 43210 \\quad
  \\href{https://linkedin.com/in/anvesh}{linkedin.com/in/anvesh} \\quad
  \\href{https://github.com/anvesh-ml}{github.com/anvesh-ml}
\\end{center}

\\vspace{4pt}

%--- SUMMARY ---%
\\section{Professional Summary}
ML Systems Engineer with 5+ years building production-grade recommendation engines,
vector databases, and LLM inference pipelines. Proven track record deploying
HNSW-indexed Qdrant collections achieving sub-2ms retrieval at 10M+ scale.
Deep expertise in PyTorch, CUDA kernel optimization, and distributed training.

%--- EXPERIENCE ---%
\\section{Work Experience}

\\textbf{Senior ML Engineer} \\hfill TechCorp AI | May 2021 -- Present\\\\
\\begin{itemize}[leftmargin=*,topsep=2pt,itemsep=1pt]
  \\item Designed LightGBM LambdaMART ranking pipeline achieving \\textbf{NDCG@10 = 0.942}
  \\item Optimized CUDA kernels reducing transformer inference latency by \\textbf{3.2×}
  \\item Built Qdrant HNSW vector store indexing \\textbf{50M+ job embeddings} with 1.2ms P99
  \\item Deployed multi-stage recommendation API serving \\textbf{2M+ daily requests}
\\end{itemize}

\\vspace{6pt}
\\textbf{ML Engineer} \\hfill StartupXYZ | Jan 2019 -- Apr 2021\\\\
\\begin{itemize}[leftmargin=*,topsep=2pt,itemsep=1pt]
  \\item Implemented hybrid BM25 + dense retrieval pipeline (\\textbf{Recall@500 = 0.94})
  \\item Deployed FastAPI microservice serving \\textbf{50k req/min} with P99 < 15ms
  \\item Reduced model inference cost by 40\\% via TensorRT FP16 quantization
\\end{itemize}

%--- EDUCATION ---%
\\section{Education}

\\textbf{B.Tech Computer Science \\& Engineering} \\hfill IIT Bombay | 2019\\\\
GPA: 9.2/10.0 \\textbar{} Specialization: AI \\& Machine Learning

%--- SKILLS ---%
\\section{Technical Skills}

\\begin{tabular}{@{}ll}
  \\textbf{Languages:} & Python, C++, TypeScript, Rust, CUDA \\\\
  \\textbf{ML Frameworks:} & PyTorch, JAX, Hugging Face Transformers, DeepSpeed \\\\
  \\textbf{Systems:} & TensorRT, vLLM, FlashAttention, Triton, ONNX \\\\
  \\textbf{Databases:} & Qdrant, PostgreSQL 16, Redis 7, DuckDB \\\\
  \\textbf{Infrastructure:} & Kubernetes, Docker, Terraform, MLflow, Celery \\\\
\\end{tabular}

%--- PROJECTS ---%
\\section{Key Projects}

\\textbf{ANVESH Career Intelligence Platform} \\hfill
\\href{https://github.com/anvesh-ml/anvesh}{github.com/anvesh-ml/anvesh}\\\\
Full-stack AI career recommendation engine with 15,400+ node skill ontology,
LightGBM LambdaMART ranker, Qdrant HNSW retrieval, and counterfactual What-If simulator.

\\vspace{4pt}
\\textbf{CUDA Flash-Attention Kernel}\\\\
Custom CUDA kernel achieving 4× speedup over standard attention on A100 GPUs.
Published as open-source with 1,200+ GitHub stars.

\\end{document}`,
  },
  {
    id: 'minimal-ats',
    name: 'Minimal ATS',
    description: 'Single-column, maximum ATS parse score',
    badge: 'ATS Score: 98%',
    color: 'emerald',
    source: `\\documentclass[11pt,letterpaper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}

\\titleformat{\\section}{\\normalsize\\bfseries\\uppercase}{}{0em}{}[\\hrule]
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{4pt}
\\pagestyle{empty}

\\begin{document}

%--- HEADER ---%
{\\Large\\bfseries Anvesh Kumar}\\\\
anvesh@example.com | +91 98765 43210 | linkedin.com/in/anvesh | github.com/anvesh-ml

%--- OBJECTIVE ---%
\\section{Summary}
Senior ML Systems Engineer specializing in production recommendation systems, GPU computing, and LLM inference optimization. 5+ years delivering measurable performance improvements at scale.

%--- EXPERIENCE ---%
\\section{Experience}

\\textbf{Senior ML Engineer}, TechCorp AI \\hfill May 2021 -- Present
\\begin{itemize}[leftmargin=1.5em,topsep=0pt,itemsep=0pt]
  \\item Built LightGBM ranking model achieving NDCG@10 = 0.942 on production dataset
  \\item Optimized CUDA kernels for transformer inference: 3.2x latency reduction
  \\item Indexed 50M job embeddings in Qdrant HNSW, P99 retrieval < 1.2ms
\\end{itemize}

\\textbf{ML Engineer}, StartupXYZ \\hfill January 2019 -- April 2021
\\begin{itemize}[leftmargin=1.5em,topsep=0pt,itemsep=0pt]
  \\item Deployed hybrid BM25 and dense retrieval achieving Recall at 500 = 0.94
  \\item FastAPI inference service: 50k requests per minute, P99 latency 15ms
\\end{itemize}

%--- SKILLS ---%
\\section{Skills}
Python, PyTorch, CUDA, TensorRT, vLLM, Kubernetes, Docker, Qdrant, PostgreSQL, Redis

%--- EDUCATION ---%
\\section{Education}

\\textbf{B.Tech Computer Science}, IIT Bombay \\hfill 2019 \\\\
GPA: 9.2/10, Specialization in Artificial Intelligence and Machine Learning

\\end{document}`,
  },
  {
    id: 'academic',
    name: 'Academic / Research',
    description: 'Publications, research, conference style',
    badge: 'Research',
    color: 'violet',
    source: `\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{biblatex}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\setlength{\\parindent}{0pt}

\\begin{document}

%--- HEADER ---%
\\begin{center}
  {\\LARGE Anvesh Kumar}\\\\[6pt]
  \\textit{PhD Researcher, ML Systems Group}\\\\[4pt]
  anvesh@university.edu \\quad | \\quad
  \\href{https://scholar.google.com/}{Google Scholar} \\quad | \\quad
  \\href{https://arxiv.org/}{arXiv: arxiv.org/a/anvesh}
\\end{center}

%--- RESEARCH INTERESTS ---%
\\section{Research Interests}
Large-scale recommendation systems, GPU kernel optimization, efficient transformers,
vector database indexing (HNSW), and counterfactual explainability.

%--- PUBLICATIONS ---%
\\section{Selected Publications}

\\begin{enumerate}[leftmargin=*,topsep=4pt]
  \\item \\textbf{Anvesh K.}, Smith J. "Hierarchical HNSW Indexing for Billion-Scale Job Retrieval."
  \\textit{NeurIPS 2025}. \\href{https://arxiv.org}{[PDF]}

  \\item \\textbf{Anvesh K.}, Lee M. "LambdaMART with SHAP Explainability for Career Recommendation."
  \\textit{RecSys 2024}. \\href{https://arxiv.org}{[PDF]}

  \\item \\textbf{Anvesh K.} "Counterfactual Simulation for Deterministic Career Intelligence."
  \\textit{ICML 2024 Workshop}. \\href{https://arxiv.org}{[PDF]}
\\end{enumerate}

%--- EDUCATION ---%
\\section{Education}

\\textbf{PhD Computer Science} \\hfill IIT Bombay | 2023 -- Present\\\\
Thesis: Deterministic Career Intelligence via Graph-Augmented Hybrid Recommendation\\\\
Advisor: Prof. Ramesh Sharma

\\vspace{4pt}
\\textbf{B.Tech Computer Science} \\hfill IIT Bombay | 2019\\\\
CGPA: 9.2/10, \\textit{Institute Gold Medal}

%--- EXPERIENCE ---%
\\section{Research Experience}

\\textbf{Research Intern} \\hfill Google DeepMind | Summer 2024\\\\
Worked on efficient HNSW graph construction for trillion-scale embedding retrieval.

%--- SKILLS ---%
\\section{Technical Skills}
Python, PyTorch, JAX, CUDA, C++, LaTeX, Qdrant, PostgreSQL, Git

\\end{document}`,
  },
];

// ─── LaTeX→HTML Live Renderer ──────────────────────────────────────────
function execAll(regex: RegExp, str: string): RegExpExecArray[] {
  const results: RegExpExecArray[] = [];
  const re = new RegExp(regex.source, regex.flags);
  let m: RegExpExecArray | null;
  while ((m = re.exec(str)) !== null) {
    results.push(m);
    if (!re.global) break;
  }
  return results;
}

function latexToHtml(latex: string): string {
  let html = latex;

  // Strip preamble (everything before \begin{document})
  const docMatch = html.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
  if (!docMatch) return '<p style="color:#94a3b8;font-style:italic;">Begin typing LaTeX above to see your resume preview…</p>';
  html = docMatch[1];

  // Comments
  html = html.replace(/%[^\n]*/g, '');

  // Section headings
  html = html.replace(/\\section\{([^}]+)\}/g, '<h2 class="ltx-section">$1</h2>');
  html = html.replace(/\\subsection\{([^}]+)\}/g, '<h3 class="ltx-subsection">$1</h3>');

  // Header / center
  html = html.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, (_, content) => {
    return `<div class="ltx-center">${content}</div>`;
  });

  // Enumerate / itemize
  html = html.replace(/\\begin\{enumerate\}[\s\S]*?\\end\{enumerate\}/g, (block) => {
    const items = execAll(/\\item\s*([\s\S]*?)(?=\\item|\\end\{enumerate\})/g, block);
    const lis = items.map((m) => `<li>${(m[1] || '').trim()}</li>`).join('');
    return `<ol class="ltx-ol">${lis}</ol>`;
  });
  html = html.replace(/\\begin\{itemize\}[\s\S]*?\\end\{itemize\}/g, (block) => {
    const items = execAll(/\\item\s*([\s\S]*?)(?=\\item|\\end\{itemize\})/g, block);
    const lis = items.map((m) => `<li>${(m[1] || '').trim()}</li>`).join('');
    return `<ul class="ltx-ul">${lis}</ul>`;
  });

  // Tabular
  html = html.replace(/\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}/g, (_, content) => {
    const rows = content.split('\\\\').filter((r: string) => r.trim());
    const trs = rows.map((row: string) => {
      const cells = row.split('&').map((c: string) =>
        `<td class="ltx-td">${c.trim()}</td>`
      ).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table class="ltx-table">${trs}</table>`;
  });

  // Text formatting
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
  html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
  html = html.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
  html = html.replace(/\\textbar\{\}/g, ' | ');
  html = html.replace(/\\textbar\s?/g, ' | ');
  html = html.replace(/\\textbackslash/g, '\\');
  html = html.replace(/\\&/g, '&amp;');
  html = html.replace(/\\%/g, '%');
  html = html.replace(/\\#/g, '#');
  html = html.replace(/\\\\(\s*)/g, '<br/>');
  html = html.replace(/\\hfill/g, '<span class="ltx-hfill"></span>');
  html = html.replace(/\\vspace\{[^}]*\}/g, '<div class="ltx-vspace"></div>');
  html = html.replace(/\\quad/g, '&emsp;');
  html = html.replace(/\\,/g, '&thinsp;');

  // Hyperlinks
  html = html.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" class="ltx-link">$2</a>');

  // Font sizes (simplified)
  html = html.replace(/\{\\Huge\\bfseries\s([^}]+)\}/g, '<span class="ltx-huge-bold">$1</span>');
  html = html.replace(/\{\\LARGE\s([^}]+)\}/g, '<span class="ltx-large">$1</span>');
  html = html.replace(/\{\\Large\\bfseries\s([^}]+)\}/g, '<span class="ltx-large-bold">$1</span>');
  html = html.replace(/\{\\large\\bfseries\s([^}]+)\}/g, '<span class="ltx-medium-bold">$1</span>');
  html = html.replace(/\{\\normalsize\\bfseries\\uppercase\s([^}]+)\}/g, '<span class="ltx-medium-bold">$1</span>');

  // Braces cleanup
  html = html.replace(/\{([^{}]*)\}/g, '$1');

  // \begin{...} / \end{...} cleanup
  html = html.replace(/\\begin\{[^}]+\}/g, '');
  html = html.replace(/\\end\{[^}]+\}/g, '');

  // Remaining commands
  html = html.replace(/\\[a-zA-Z]+\{?[^}]*\}?/g, '');

  // Paragraph breaks
  html = html.replace(/\n{2,}/g, '</p><p class="ltx-p">');

  return `<p class="ltx-p">${html}</p>`;
}

// ─── Preview Styles (injected into iframe) ──────────────────────────────
const PREVIEW_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1a1a1a;
    padding: 0.75in 0.75in;
    background: #fff;
    max-width: 8.5in;
    margin: 0 auto;
  }
  .ltx-center { text-align: center; margin-bottom: 10pt; }
  .ltx-section {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1.5px solid #1a1a1a;
    padding-bottom: 2pt;
    margin: 12pt 0 6pt 0;
    font-family: Arial, sans-serif;
  }
  .ltx-subsection {
    font-size: 11pt;
    font-weight: bold;
    margin: 8pt 0 4pt 0;
  }
  .ltx-ul, .ltx-ol {
    margin-left: 1.2em;
    margin-bottom: 6pt;
  }
  .ltx-ul li, .ltx-ol li {
    margin-bottom: 2pt;
    line-height: 1.4;
  }
  .ltx-hfill {
    display: inline-block;
    flex: 1;
  }
  p.ltx-p {
    margin-bottom: 6pt;
    line-height: 1.5;
  }
  .ltx-vspace { height: 6pt; }
  .ltx-table {
    border-collapse: collapse;
    margin-bottom: 6pt;
    width: 100%;
  }
  .ltx-td { padding: 1pt 8pt 1pt 0; vertical-align: top; }
  .ltx-link { color: #1e40af; text-decoration: none; }
  .ltx-link:hover { text-decoration: underline; }
  .ltx-huge-bold { font-size: 22pt; font-weight: bold; display: block; }
  .ltx-large { font-size: 16pt; display: block; }
  .ltx-large-bold { font-size: 15pt; font-weight: bold; display: block; }
  .ltx-medium-bold { font-size: 12pt; font-weight: bold; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  br { display: block; content: ''; }
  h2.ltx-section + br { display: none; }
`;

// ─── View modes ───────────────────────────────────────────────────────
type ViewMode = 'split' | 'editor' | 'preview';

const VIEW_MODES: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'split', label: 'Split', icon: <SplitSquareHorizontal className="w-4 h-4" /> },
  { id: 'editor', label: 'Editor', icon: <Code2 className="w-4 h-4" /> },
  { id: 'preview', label: 'Preview', icon: <Monitor className="w-4 h-4" /> },
];

// ─── Main Component ────────────────────────────────────────────────────
export default function ResumeBuilderPage() {
  const [source, setSource] = useState(TEMPLATES[0].source);
  const [previewHtml, setPreviewHtml] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-ml');
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [autoCompile, setAutoCompile] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const compileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live compilation with debounce
  const compile = useCallback((latex: string) => {
    setCompiling(true);
    setCompileError(null);
    try {
      const html = latexToHtml(latex);
      setPreviewHtml(html);
    } catch (err: any) {
      setCompileError(err?.message ?? 'Parse error');
    } finally {
      setCompiling(false);
    }
  }, []);

  const debouncedCompile = useCallback(
    (latex: string) => {
      if (!autoCompile) return;

      if (compileTimerRef.current !== null) {
        clearTimeout(compileTimerRef.current);
      }

      compileTimerRef.current = setTimeout(() => {
        compile(latex);
        compileTimerRef.current = null;
      }, 400);
    },
    [compile, autoCompile]
  );

  useEffect(() => {
    compile(source);

    return () => {
      if (compileTimerRef.current !== null) {
        clearTimeout(compileTimerRef.current);
        compileTimerRef.current = null;
      }
    };
  }, [compile, source]);

  const handleEditorChange = (value: string | undefined) => {
    const code = value ?? '';
    setSource(code);
    debouncedCompile(code);
  };

  // Inject preview into iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <style>${PREVIEW_CSS}</style>
    </head><body>${previewHtml}</body></html>`);
    doc.close();
  }, [previewHtml]);

  // Template switch
  const applyTemplate = (templateId: string) => {
    const t = TEMPLATES.find((t) => t.id === templateId);
    if (!t) return;
    setSelectedTemplate(templateId);
    setSource(t.source);
    compile(t.source);
    setShowTemplates(false);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // Download LaTeX source
  const downloadLatex = () => {
    const blob = new Blob([source], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  // Download PDF via browser print from iframe
  const downloadPdf = () => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.print();
  };

  // Line count
  const lineCount = source.split('\n').length;
  const charCount = source.length;

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate)!;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f1117] flex flex-col">
        {/* ── Top Bar ── */}
        <div className="border-b border-[#1e2433] bg-[#0d1117] flex items-center gap-4 px-4 py-2.5 flex-shrink-0 mt-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mr-2">
            <Link href="/profile" className="hover:text-slate-300 transition-colors">
              Profile
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-brand-400" />
              LaTeX Resume Builder
            </span>
          </div>

          <div className="h-5 w-px bg-[#1e2433]" />

          {/* Template Picker */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e2433] border border-[#2d3748] text-slate-300 hover:border-brand-500/50 text-sm transition-all duration-200"
            >
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              {currentTemplate.name}
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showTemplates && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#1a2035] border border-[#2d3748] rounded-xl shadow-2xl z-50 p-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.id)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150',
                      selectedTemplate === t.id
                        ? 'bg-brand-600/20 border border-brand-500/30'
                        : 'hover:bg-[#243050]'
                    )}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-slate-200">
                        {t.name}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                          t.color === 'brand'
                            ? 'bg-brand-500/20 text-brand-300'
                            : t.color === 'emerald'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-violet-500/20 text-violet-300'
                        )}
                      >
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{t.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compile Status */}
          <div className="flex items-center gap-2">
            {compiling ? (
              <span className="flex items-center gap-1.5 text-xs text-amber-400">
                <div className="w-2.5 h-2.5 border border-amber-400 border-t-transparent rounded-full animate-spin" />
                Compiling…
              </span>
            ) : compileError ? (
              <span className="flex items-center gap-1.5 text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                {compileError}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Compiled
              </span>
            )}
          </div>

          {/* Auto-compile toggle */}
          <button
            onClick={() => setAutoCompile(!autoCompile)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
              autoCompile
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-[#1e2433] text-slate-400 border-[#2d3748]'
            )}
          >
            <Zap className="w-3 h-3" />
            Auto
          </button>

          {!autoCompile && (
            <button
              onClick={() => compile(source)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              <Play className="w-3 h-3" />
              Compile
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-[#1e2433] border border-[#2d3748] rounded-lg p-1">
            {VIEW_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                  viewMode === m.id
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {m.icon}
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2433] border border-[#2d3748] text-slate-300 hover:border-slate-500 text-xs font-medium transition-all"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={downloadLatex}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2433] border border-[#2d3748] text-slate-300 hover:border-slate-500 text-xs font-medium transition-all"
            >
              <FileCode2 className="w-3.5 h-3.5 text-brand-400" />
              .tex
            </button>
            <button
              onClick={downloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Info Bar ── */}
        <div className="flex items-center gap-6 px-4 py-1.5 bg-[#0d1117] border-b border-[#1e2433] text-[11px] text-slate-500 flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            resume.tex
          </span>
          <span>{lineCount} lines</span>
          <span>{charCount} chars</span>
          <span className="flex items-center gap-1">
            <Wand2 className="w-3 h-3 text-brand-400" />
            LaTeX • ATS Optimized
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Preview Active
          </span>
        </div>

        {/* ── Editor + Preview Pane ── */}
        <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          {/* Editor */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div
              className={cn(
                'flex flex-col border-r border-[#1e2433]',
                viewMode === 'split' ? 'w-1/2' : 'w-full'
              )}
            >
              {/* Editor Header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#161b27] border-b border-[#1e2433]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-xs text-slate-500 ml-2">resume.tex — LaTeX Source</span>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 overflow-hidden">
                <MonacoEditor
                  height="100%"
                  defaultLanguage="latex"
                  value={source}
                  onChange={handleEditorChange}
                  theme="anvesh-dark"
                  beforeMount={(monaco) => registerLatexLanguage(monaco)}
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    fontLigatures: true,
                    lineHeight: 1.7,
                    minimap: { enabled: false },
                    wordWrap: 'on',
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    renderLineHighlight: 'gutter',
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: 'on',
                    bracketPairColorization: { enabled: true },
                    suggest: { showKeywords: true },
                    quickSuggestions: true,
                    tabSize: 2,
                    renderWhitespace: 'none',
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                      verticalScrollbarSize: 6,
                      horizontalScrollbarSize: 6,
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Preview Pane */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={cn(
                'flex flex-col bg-[#f0ede8]',
                viewMode === 'split' ? 'w-1/2' : 'w-full'
              )}
            >
              {/* Preview Header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#161b27] border-b border-[#1e2433]">
                <Eye className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-xs text-slate-400">Live Preview — A4 / Letter</span>
                <div className="ml-auto flex items-center gap-1">
                  <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    PDF Quality
                  </Badge>
                </div>
              </div>

              {/* Preview iframe (A4 paper feel) */}
              <div className="flex-1 overflow-auto bg-[#525659] p-6">
                <div className="bg-white shadow-2xl mx-auto" style={{ width: '794px', minHeight: '1123px' }}>
                  <iframe
                    ref={iframeRef}
                    title="Resume Preview"
                    style={{ width: '100%', height: '1123px', border: 'none', display: 'block' }}
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom Status Bar ── */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-brand-700 text-xs text-white/70 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span>ANVESH LaTeX Resume Builder</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              ATS Optimized
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Zero-PII Safe
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Ln {lineCount}</span>
            <span>LaTeX 2e</span>
            <span>UTF-8</span>
          </div>
        </div>
      </main>
    </>
  );
}
