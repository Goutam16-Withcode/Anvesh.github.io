import { Injectable } from '@nestjs/common';

@Injectable()
export class CareerPathsService {
  getCareerTracks() {
    return [
      {
        id: 'track-ai-infra',
        name: 'AI Infrastructure & Acceleration',
        tagline: 'Scale training clusters, high-throughput inference engines, and custom GPU kernels',
        badge: 'HIGHEST MARKET DEMAND',
        nodes: [
          {
            id: 'node-current',
            title: 'Senior Software Engineer (Backend/Data)',
            roleTier: 'CURRENT',
            experienceYearsReq: '3 - 5 Years',
            salaryBand: '$145k - $185k',
            salaryMin: 145000,
            salaryMax: 185000,
            status: 'COMPLETED',
            readinessScore: 100,
            timeEstimateMonths: 'Completed',
            difficulty: 'ACCESSIBLE',
            coreCompetencies: ['REST/gRPC APIs', 'PostgreSQL Schema', 'Docker Orchestration'],
            requiredSkills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL'],
            milestones: [
              { id: 'm1', title: 'Led high-concurrency API refactor', completed: true, description: 'Reduced P99 latency by 45%', skillTag: 'FastAPI' },
              { id: 'm2', title: 'Managed production PostgreSQL replicas', completed: true, description: 'Implemented connection pooling', skillTag: 'PostgreSQL' },
            ],
            unlockedRoleCount: 18,
            nextNodes: ['node-bridge'],
          },
          {
            id: 'node-bridge',
            title: 'AI Systems & MLOps Platform Engineer',
            roleTier: 'BRIDGE',
            experienceYearsReq: '4 - 7 Years',
            salaryBand: '$180k - $235k',
            salaryMin: 180000,
            salaryMax: 235000,
            status: 'IN_PROGRESS',
            readinessScore: 82,
            timeEstimateMonths: '2 - 3 Months',
            difficulty: 'MODERATE',
            coreCompetencies: ['Vector DB Indexing', 'Model Serving (vLLM)', 'Distributed Caching'],
            requiredSkills: ['PyTorch', 'Qdrant Vector DB', 'Kubernetes', 'Ray'],
            milestones: [
              { id: 'm3', title: 'Deploy Qdrant vector retrieval cluster', completed: true, description: 'HNSW cosine indexing over 500k vectors', skillTag: 'Qdrant' },
              { id: 'm4', title: 'Automate vLLM multi-GPU inference worker', completed: false, description: 'Continuous batching and PagedAttention setup', skillTag: 'vLLM' },
            ],
            unlockedRoleCount: 42,
            nextNodes: ['node-target'],
          },
          {
            id: 'node-target',
            title: 'Lead AI Infrastructure Architect',
            roleTier: 'TARGET',
            experienceYearsReq: '6 - 9 Years',
            salaryBand: '$225k - $310k',
            salaryMin: 225000,
            salaryMax: 310000,
            status: 'UNLOCKED',
            readinessScore: 68,
            timeEstimateMonths: '5 - 7 Months',
            difficulty: 'CHALLENGING',
            coreCompetencies: ['Custom CUDA Kernels', 'NCCL Ring-AllReduce', 'Sub-millisecond Serving'],
            requiredSkills: ['CUDA', 'Triton', 'TensorRT-LLM', 'Distributed Systems'],
            milestones: [
              { id: 'm5', title: 'Author FP8 Triton kernel for attention layers', completed: false, description: 'Speed up decoding throughput by 2.3x', skillTag: 'Triton' },
            ],
            unlockedRoleCount: 78,
            nextNodes: [],
          },
        ],
      },
    ];
  }
}
