import { Injectable } from '@nestjs/common';

@Injectable()
export class ResumeService {
  parseResume(payload?: any) {
    return {
      success: true,
      extracted_skills: [
        'Python',
        'PyTorch',
        'FastAPI',
        'Qdrant Vector DB',
        'Docker',
        'PostgreSQL',
        'TypeScript',
        'React',
      ],
      confidence_score: 98.4,
      experience_years: 4.5,
      headline: 'Senior AI & Machine Learning Systems Engineer',
      domain_proficiencies: [
        { category: 'AI Infrastructure', skills: ['PyTorch', 'Vector Databases', 'FastAPI'], confidence: 0.96 },
        { category: 'Backend Systems', skills: ['Python', 'PostgreSQL', 'Docker'], confidence: 0.94 },
        { category: 'Frontend & UI', skills: ['TypeScript', 'React'], confidence: 0.88 },
      ],
    };
  }
}
