# 🔮 ANVESH (अन्वेष) — Comprehensive Engineering Roadmap & Future Work

> **Single Source of Truth for Platform Evolution, Research Benchmarks, and Architectural Deliverables.**  
> *Target Standard: Tier-1 Product Engineering (Google DeepMind, Netflix RecSys, Stripe, LinkedIn)*

---

## 📊 High-Level Status Dashboard

```
Overall Architecture Completion:  52%
├── Frontend (Next.js 14 + Aceternity + Shadcn): 100% [All 13 pages complete — Compare Jobs, PII Reviewer, Roadmap Kanban, Market Trends]
├── API Gateway & Contracts (NestJS TypeScript): 40% [Controllers, DTOs, Swagger, Mock Heuristics Active]
├── Persistence Layer (PostgreSQL, Qdrant, Redis): 25% [Docker-compose Configured, Schemas Documented]
├── ML Pipelines (Embeddings, LightGBM, GraphSage): 15% [Mathematical Models Documented, Python Stubs Ready]
└── Production & MLOps (MLflow, Celery, Telemetry): 15% [Docker Stack Configured, Events Documented]
```

---

## 🗂️ Table of Contents
1. [🧠 Career Intelligence & Career Twin](#1--career-intelligence--career-twin)
2. [🎯 Recommendation Engine & Ranking](#2--recommendation-engine--ranking)
3. [🔬 Explainable AI & SHAP Diagnosis](#3--explainable-ai--shap-diagnosis)
4. [🕸️ Skill & Role Knowledge Graph](#4--skill--role-knowledge-graph)
5. [🔮 Counterfactual & What-If Simulation](#5--counterfactual--what-if-simulation)
6. [📊 Job Market Intelligence & Trends](#6--job-market-intelligence--trends)
7. [🤖 Autonomous AI Career Agent](#7--autonomous-ai-career-agent)
8. [📈 Personalization & Real-Time Telemetry](#8--personalization--real-time-telemetry)
9. [🧪 ML Research, Baselines & Offline Evaluation](#9--ml-research-baselines--offline-evaluation)
10. [🔐 Production Engineering, Persistence & MLOps](#10--production-engineering-persistence--mlops)
11. [🛡️ Responsible AI, Fairness & Zero-PII](#11--responsible-ai-fairness--zero-pii)
12. [💻 Advanced Frontend UI Deliverables](#12--advanced-frontend-ui-deliverables)
13. [⭐ Signature Products & Features Checklist](#13--signature-products--features-checklist)

---

## 1. 🧠 Career Intelligence & Career Twin

| Feature | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **ANVESH Career Twin** | ML / Frontend | `[ ] PLANNED` | Unified mathematical vector representation combining competency state ($\mathbf{v}_{\text{skills}}$), latent preference vector ($\mathbf{u}_{\text{latent}}$), and growth velocity ($\vec{v}_{\text{growth}}$). |
| **Personal Career Knowledge Graph** | Backend / ML | `[ ] PLANNED` | Subgraph extraction from verified resume AST mapping individual candidate nodes to canonical ontology. |
| **Dynamic Candidate Profile** | Frontend / API | `[x] COMPLETED` | Reactive client-side and API profile synchronization via `anvesh_profile_updated` event bus. |
| **Career Trajectory Modeling** | ML Engine | `[ ] PLANNED` | Markov chain and regression modeling predicting 1y, 3y, and 5y title and compensation trajectories. |
| **Target Role Modeling** | Backend / API | `[x] COMPLETED` | Target role schema definitions, core skill requirement mappings, and dynamic affinity scoring. |
| **Career Path Discovery** | Frontend / API | `[x] COMPLETED` | Multi-stage path tree visualization at `/career-path` showing progression steps. |
| **Role Transition Graph** | ML / Graph | `[ ] PLANNED` | NetworkX transition matrix computing probability distribution of transitions between disparate role families. |
| **Minimum Skill Set Optimizer** | Frontend / Algorithm | `[x] COMPLETED` | Bounded submodular 0/1 knapsack solver with compound synergy multipliers ($+16\%$ boost). |

---

## 2. 🎯 Recommendation Engine & Ranking

| Feature | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **Hybrid Retrieval (Dense + BM25)** | ML / Qdrant | `[ ] IN PROGRESS` | Parallel Qdrant HNSW 384-d dense cosine vector search combined with BM25 exact keyword match over 500 candidate pool. |
| **Skill-Based Retrieval Matrix** | Backend / ML | `[x] COMPLETED` | Exact and fuzzy skill intersection ratio ($\frac{\|S_{\text{user}} \cap S_{\text{req}}\|}{\|S_{\text{req}}\|}$). |
| **Graph-Based Retrieval Expansion** | ML / Graph | `[ ] PLANNED` | Candidate pool expansion via adjacent ontology nodes and prerequisite bridge traversal. |
| **Learning-to-Rank (LightGBM LambdaMART)** | ML Microservice | `[ ] IN PROGRESS` | Pairwise ranking model optimizing **NDCG@10 $\ge 0.94$** across 7 feature vectors with sub-10ms inference. |
| **Multi-Objective MMR Diversification** | Backend / Recs | `[x] COMPLETED` | Maximal Marginal Relevance penalizing redundant postings from the same employer (Cap: max 2). |
| **Recommendation Score Calibration** | ML Microservice | `[ ] PLANNED` | Platt scaling / Isotonic regression converting raw ranking scores into calibrated hiring probability percentages. |
| **Recommendation Confidence Estimation** | ML Microservice | `[ ] PLANNED` | Uncertainty estimation based on candidate vector variance and catalog posting density. |
| **Sequential Recommendation** | ML Microservice | `[ ] PLANNED` | GRU4Rec / SASRec transformer session modeling for in-session interaction sequences. |
| **Context-Aware Recommendation** | Backend API | `[ ] PLANNED` | Adjusting rank scores based on candidate remote/hybrid preferences, commute boundaries, and timezones. |

---

## 3. 🔬 Explainable AI & SHAP Diagnosis

| Feature | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **"Why This Job?" Breakdown** | Frontend / Recs | `[x] COMPLETED` | Multi-factor breakdown badge showing semantic similarity, required/preferred skill fit, and experience fit. |
| **"Why NOT This Job?" Diagnosis** | Frontend / Modal | `[x] COMPLETED` | Deterministic gatekeeper diagnosis auditing seniority delta, missing hard skills, and catalog freshness decay. |
| **TreeSHAP Feature Attribution** | ML / Frontend | `[x] COMPLETED` | Visual waterfall chart decomposing ranking score into exact positive gains and negative deductions. |
| **Evidence-Based Recommendation** | Backend API | `[ ] PLANNED` | Citing verified resume project bullet points as direct proof for matched competencies. |
| **Recommendation Audit Trail** | Backend / Database | `[ ] PLANNED` | Persistent audit logs in PostgreSQL tracking which model version and feature weights produced a given recommendation. |
| **Model Version Tracking** | MLOps / MLflow | `[ ] IN PROGRESS` | Model registry in MLflow tracking hyper-parameters, training runs, and offline NDCG benchmarks. |

---

## 4. 🕸️ Skill & Role Knowledge Graph

| Feature | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **15,400+ Node Skill Ontology** | Data / Taxonomy | `[x] COMPLETED` | Canonical ontology in `data/taxonomy/skills.json` and `roles.json` with category hierarchies. |
| **Skill Synonym & Alias Detection** | ML Microservice | `[ ] PLANNED` | Embedding cosine distance mapping arbitrary text variants (e.g. `k8s-operator`) to canonical nodes. |
| **Skill Prerequisite DAG** | ML / Graph | `[x] COMPLETED` | Directed acyclic graph enforcing learning order (e.g., `Python ➔ PyTorch ➔ CUDA`). |
| **Skill Dependency Detection** | ML / Graph | `[ ] PLANNED` | Automated dependency extraction from GitHub repositories and open-source project configs. |
| **Skill Transferability Analysis** | ML / Graph | `[ ] PLANNED` | Vector projection calculating angular distance between adjacent tech stacks (e.g. AWS $\leftrightarrow$ GCP). |
| **Bipartite Role $\leftrightarrow$ Skill Graph** | Data / Graph | `[x] COMPLETED` | Bi-directional relationships mapping which skills are non-negotiable for specific target roles. |
| **Graph Shortest-Path Trajectory** | Frontend / Graph | `[x] COMPLETED` | Interactive 2D SVG canvas at `/skill-graph` highlighting minimal bridge steps between roles. |

---

## 5. 🔮 Counterfactual & What-If Simulation

| Feature | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **What-If Skill Simulator** | Frontend / API | `[x] COMPLETED` | Real-time counterfactual simulation re-indexing opportunities and salary deltas upon adding skills. |
| **Skill Combination Simulator** | Frontend / What-If | `[x] COMPLETED` | Pre-configured accelerator bundles (AI Kernel Architect, Cloud-Native MLOps, Distributed Systems Lead). |
| **Minimum Skills to Unlock Role** | Frontend / Optimizer | `[x] COMPLETED` | Knapsack optimizer solving the minimal subset of skills needed within a given time budget. |
| **Salary Impact Counterfactual Simulation** | Backend / What-If | `[x] COMPLETED` | Quantifying exact median market compensation lift per added skill. |
| **Opportunity Expansion Simulation** | Backend / What-If | `[x] COMPLETED` | Calculating $\Delta N_{\text{opportunities}} = N_{\text{sim}} - N_{\text{baseline}}$ against 100k+ catalog vacancies. |
| **Time-to-Transition Estimation** | Frontend / Algorithm | `[x] COMPLETED` | Learning week estimator scaled by candidate's weekly effort intensity (hrs/week). |
| **Multi-Scenario Comparison (Scenario A vs B)** | Frontend | `[ ] PLANNED` | Split-screen sandbox comparing two distinct career paths side-by-side. |

---

## 6. 📊 Job Market Intelligence & Trends

| Feature | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **Skill Demand Velocity Index** | Data / Ingestion | `[ ] PLANNED` | Rolling 30-day aggregator calculating recruiter search spikes for emerging technologies. |
| **Emerging Skill Detection** | ML / Analytics | `[ ] PLANNED` | Anomaly detection flagging newly trending competencies (e.g. `DeepSeek-R1`, `vLLM`, `Triton`). |
| **Company Hiring Trend Heatmaps** | Frontend / Data | `[ ] PLANNED` | Employer hiring velocity trends categorized by engineering domain. |
| **Salary Distribution Curves** | Frontend / Analytics | `[ ] PLANNED` | Interactive bell curves displaying 25th, 50th, 75th, and 90th percentile compensation packages. |
| **Remote vs. Hybrid Market Share** | Frontend / Analytics | `[ ] PLANNED` | Macroeconomic analytics tracking remote flexibility across tier-1 tech hubs. |
| **MinHash LSH Job Deduplication** | Ingestion Pipeline | `[ ] PLANNED` | 128-permutation MinHash locality-sensitive hashing ($Jaccard > 0.88$) filtering out duplicate recruiter reposts. |
| **Catalog Freshness Exponential Decay** | Recs / Backend | `[x] COMPLETED` | Mathematical half-life decay modeling ($e^{-\lambda \cdot \Delta t}$) penalizing stale postings. |
| **Market Gap Detection** | ML / Analytics | `[ ] PLANNED` | Supply-demand mismatch indicator identifying high-paying roles with severe candidate shortages. |

---

## 7. 🤖 Autonomous AI Career Agent

| Feature | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **Deterministic Tool-Calling Architecture** | Backend / Agent | `[x] COMPLETED` | Simulated tool execution framework (`ontology_skill_graph_lookup`, `qdrant_vector_retrieval`). |
| **LangGraph ReAct Agent Orchestrator** | Backend / Agent | `[ ] IN PROGRESS` | Autonomous multi-step reasoning agent with structured state checkpointing in Redis. |
| **Career Research Tool Agent** | Backend / Agent | `[ ] PLANNED` | Tool querying real-time market salary oracles and compensation databases. |
| **Skill Gap Investigator Agent** | Backend / Agent | `[ ] PLANNED` | Tool comparing candidate AST against target role ontologies with verified remediation paths. |
| **Career Roadmap Synthesizer Agent** | Backend / Agent | `[ ] PLANNED` | Generates weekly milestone roadmaps with curated documentation, repos, and labs. |
| **Multi-Step Agent Planning & Memory** | Backend / Redis | `[ ] PLANNED` | Conversation history and session memory persisted across cross-page interactions. |
| **Embedded Interactive UI Responses** | Frontend / Chat | `[x] COMPLETED` | Chat interface in `/dashboard` returning actionable action pills (Open What-If, View Job, Explore Gap). |

---

## 8. 📈 Personalization & Real-Time Telemetry

| Feature | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **Implicit Interaction Event Bus** | Frontend / Telemetry | `[x] COMPLETED` | Captures clicks, bookmarks, dwell time, and dismissal actions. |
| **Real-Time Notification Center** | Frontend / UI | `[x] COMPLETED` | Ambient dark-glass notification popover with synthesized Web Audio dual-frequency chimes. |
| **Online Latent Vector Moving Average (EMA)** | Backend / Redis | `[ ] PLANNED` | Updates candidate 384-d preference vector in real-time ($\mathbf{u}_{t} = \alpha \mathbf{u}_{t-1} + (1 - \alpha) \mathbf{v}_{\text{job}}$). |
| **Company & Job-Family Affinity Scoring** | Backend / Recs | `[x] COMPLETED` | Heuristic affinity feature weights incorporated into LTR match breakdown. |
| **Zero-PII Session Telemetry** | Frontend / Auth | `[x] COMPLETED` | Memory buffer purge upon logout and anonymous cryptographic candidate IDs. |

---

## 9. 🧪 ML Research, Baselines & Offline Evaluation

| Experiment / Metric | Target Directory | Status | Technical Specification |
|---|---|:---:|---|
| **BM25 Inverted Index Baseline** | `ml/retrieval/` | `[ ] PLANNED` | Exact keyword matching baseline for ablation comparison. |
| **Dense Vector Retrieval Baseline** | `ml/retrieval/` | `[ ] PLANNED` | Pure Qdrant HNSW cosine similarity baseline. |
| **Hybrid Retrieval Evaluation** | `ml/experiments/` | `[ ] PLANNED` | Measuring Recall@500 and MRR comparing Dense vs BM25 vs Hybrid. |
| **LightGBM LambdaMART Offline Training** | `ml/ranking/` | `[ ] IN PROGRESS` | Training script using synthetic relevance pairs optimizing NDCG@10. |
| **Ablation Protocol Suite** | `ml/evaluation/` | `[ ] PLANNED` | Offline evaluation computing NDCG@K, Precision@K, Recall@K, MAP, and Diversity. |
| **Latency Benchmarking Harness** | `backend/tests/` | `[ ] PLANNED` | Sub-50ms end-to-end latency benchmarks under concurrent load. |

---

## 10. 🔐 Production Engineering, Persistence & MLOps

| Component | Technology | Status | Technical Specification |
|---|---|:---:|---|
| **Container Stack** | Docker Compose | `[x] COMPLETED` | Multi-container setup for PostgreSQL 16, Qdrant Vector DB, Redis 7, and MLflow. |
| **Relational Data Persistence** | PostgreSQL 16 | `[ ] IN PROGRESS` | Relational schemas for Users, Profiles, JobPostings, and InteractionEvents. |
| **Vector Store Collection Indexing** | Qdrant | `[ ] IN PROGRESS` | Collections for `jobs_collection` and `profiles_collection` with filterable payloads. |
| **Low-Latency Caching & Rate Limiting** | Redis 7 | `[ ] IN PROGRESS` | Session store and 15-minute recommendation result cache. |
| **NestJS API Gateway** | NestJS / Express | `[x] COMPLETED` | Active gateway on port 8000 with global prefix `/api/v1` and Swagger docs at `/api/docs`. |
| **Python ML Microservice** | FastAPI / Uvicorn | `[ ] IN PROGRESS` | High-throughput async model inference service running on internal port 8001. |
| **Async Background Ingestion Workers** | Celery / Redis | `[ ] PLANNED` | Periodic workers fetching syndication feeds, computing MinHash LSH, and updating Qdrant. |

---

## 11. 🛡️ Responsible AI, Fairness & Zero-PII

| Capability | Target Layer | Status | Technical Specification |
|---|---|:---:|---|
| **Zero-PII Redaction Pipeline** | Ingestion / Parser | `[ ] PLANNED` | Stripping phone numbers, physical addresses, emails, and graduation years before vectorization. |
| **Protected-Attribute Exclusion** | ML / Ranking | `[x] COMPLETED` | Eliminating gender, ethnicity, age, and demographic proxies from ranking feature vectors. |
| **Fairness & Disparate Impact Auditing** | ML / Evaluation | `[ ] PLANNED` | 4/5ths rule disparate impact evaluation scripts across demographic segments. |
| **Candidate Stealth Mode** | Frontend / Profile | `[ ] PLANNED` | Anonymous cryptographic vector profiles for recruiter discovery without employer tracking. |
| **User Data Deletion & Retention Controls** | Backend / API | `[ ] PLANNED` | GDPR/CCPA compliant self-service data purging endpoints. |

---

## 12. 💻 Advanced Frontend UI Deliverables

| Page / Component | Target Route | Status | Notes |
|---|---|:---:|---|
| **Flagship Landing Page** | `/` | `[x] COMPLETED` | Hero, Trust matrix, Bento features, How-it-works, FAQ, CTA, Footer. |
| **Unified Career Dashboard** | `/dashboard` | `[x] COMPLETED` | Recs rail, What-If preview, AI Agent conversation studio. |
| **Live Jobs Discovery Board** | `/jobs` | `[x] COMPLETED` | Filterable catalog, match breakdown badges, bookmarking. |
| **Why NOT This Job? Modal** | `/jobs` | `[x] COMPLETED` | Gatekeeper audit, TreeSHAP waterfall, counterfactual remediation. |
| **What-If Simulation Sandbox** | `/what-if` | `[x] COMPLETED` | ROI calculators, trajectory curves, unlocked roles. |
| **Minimum Skill Knapsack Optimizer** | `/what-if` | `[x] COMPLETED` | Bounded submodular knapsack solver with time/effort sliders. |
| **2D Interactive Knowledge Graph** | `/skill-graph` | `[x] COMPLETED` | SVG DAG canvas, shortest bridge trajectory, node inspector drawer. |
| **Skill Gap Analyzer** | `/skill-gap` | `[x] COMPLETED` | Multi-vector radar chart, competency matrix, missing skill priorities. |
| **Career Path Visualization** | `/career-path` | `[x] COMPLETED` | Milestone timeline, progression tree. |
| **Side-by-Side Job Comparison Matrix** | `/compare-jobs` | `[x] COMPLETED` | Comparing 2–4 job offers across comp, skills, growth trajectory, and ANVESH dimension scoring. |
| **Interactive Resume Reviewer & PII Masker**| `/profile/review` | `[x] COMPLETED` | Click-to-mask entity detection, stealth mode, privacy score meter, section-by-section preview. |
| **Personalized Career Roadmap & Kanban** | `/roadmap` | `[x] COMPLETED` | Actionable learning kanban with XP tracking, curated resources, level progression. |
| **Job Market Trends Dashboard** | `/market-trends` | `[x] COMPLETED` | Skill velocity index, salary distribution curves (P25–P90), hiring hubs, remote/hybrid share. |

---

## 13. ⭐ Signature Products & Features Checklist

- [ ] **ANVESH Career Twin**: Multi-vector digital avatar modeling real-time market value and velocity.
- [ ] **ANVESH Navigator**: Autonomous LangGraph career agent with verified deterministic tools.
- [x] **Counterfactual Career Simulator**: Mathematical market re-indexing without LLM hallucinations.
- [x] **Nexus Knapsack Optimizer**: Minimum skill set unlock solver under study constraints.
- [x] **GraphSphere Topology**: Interactive 2D knowledge graph explorer with shortest path traversal.
- [x] **GlassBox Diagnosis**: "Why NOT This Job?" gatekeeper audit and TreeSHAP explainability.
- [ ] **MinHash Job Integrity Filter**: Locality-sensitive hashing eliminating duplicate recruiter spam.
- [x] **Real-Time Telemetry Hub**: Dual-frequency Web Audio chimes and ambient live signals.
- [ ] **Zero-PII Confidential Discovery**: Unbiased vector hiring protecting candidate identity.

---

*Document Managed By ANVESH Product & AI Systems Engineering.*  
*Maintained at `e:\Anvesh\FUTURE.md`.*
