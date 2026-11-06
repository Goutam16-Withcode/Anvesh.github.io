import { Injectable } from '@nestjs/common';

@Injectable()
export class SkillGapService {
  getSkillGap(roleId: string = 'ai-platform-eng') {
    return {
      id: roleId,
      title: 'Senior AI Platform Engineer',
      level: 'L5 / Senior',
      companyTier: 'Tier-1 AI Labs (OpenAI, Anthropic, NVIDIA)',
      salaryRange: '$195k - $275k Base + Equity',
      matchScore: 0.82,
      marketDemand: 'CRITICAL',
      radarCompetencies: [
        { subject: 'Distributed Systems', candidateScore: 78, requiredScore: 92, fullMark: 100 },
        { subject: 'GPU Acceleration (CUDA)', candidateScore: 45, requiredScore: 88, fullMark: 100 },
        { subject: 'Vector DB & HNSW Retrieval', candidateScore: 95, requiredScore: 90, fullMark: 100 },
        { subject: 'Model Serving & Tracing', candidateScore: 82, requiredScore: 90, fullMark: 100 },
        { subject: 'Container Orchestration', candidateScore: 68, requiredScore: 85, fullMark: 100 },
        { subject: 'High-Throughput APIs', candidateScore: 92, requiredScore: 88, fullMark: 100 },
      ],
      missingSkills: [
        {
          skill: 'CUDA Programming',
          category: 'Kernel Optimization',
          priority: 'CRITICAL',
          candidateProficiency: 35,
          requiredProficiency: 85,
          estWeeksToAcquire: 6,
          salaryLiftContributionUsd: 28000,
          marketRelevanceScore: 98,
          targetOutcome: 'Profile GPU memory bandwidth and write custom FP8 GEMM kernels with Triton.',
          curatedResources: [
            {
              id: 'res_cuda_01',
              title: 'Fast GPU Kernels with OpenAI Triton',
              type: 'DOCS',
              provider: 'OpenAI Triton Docs',
              url: 'https://triton-lang.org',
              duration: '18 hours',
              rating: 4.9,
              isFree: true,
            },
            {
              id: 'res_cuda_02',
              title: 'Parallel Programming with CUDA & TensorRT',
              type: 'LAB',
              provider: 'NVIDIA Deep Learning Institute',
              url: 'https://www.nvidia.com/dli',
              duration: '24 hours',
              rating: 4.8,
              isFree: false,
            },
          ],
        },
        {
          skill: 'Kubernetes Orchestration',
          category: 'Cloud Infrastructure',
          priority: 'HIGH',
          candidateProficiency: 55,
          requiredProficiency: 82,
          estWeeksToAcquire: 3,
          salaryLiftContributionUsd: 14000,
          marketRelevanceScore: 91,
          targetOutcome: 'Configure Ray cluster operators and vLLM autoscalers on multi-node Kubernetes.',
          curatedResources: [
            {
              id: 'res_k8s_01',
              title: 'Kubernetes Production Operator Patterns',
              type: 'REPO',
              provider: 'Cloud Native Computing Foundation',
              url: 'https://github.com/kubernetes/kubernetes',
              duration: '12 hours',
              rating: 4.9,
              isFree: true,
            },
          ],
        },
      ],
      verifiedCandidateSkills: ['Python', 'PyTorch', 'FastAPI', 'Qdrant Vector DB', 'Docker', 'PostgreSQL'],
      benchmarkRoles: [
        { id: 'ai-platform-eng', title: 'Senior AI Platform Engineer', category: 'AI Infrastructure', matchScore: 0.82 },
        { id: 'mlops-eng', title: 'Lead MLOps Systems Engineer', category: 'ML Systems', matchScore: 0.89 },
        { id: 'distributed-eng', title: 'Distributed Inference Architect', category: 'Systems Engineering', matchScore: 0.74 },
      ],
    };
  }
}

