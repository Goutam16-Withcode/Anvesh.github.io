import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private userProfiles = new Map<string, any>();

  constructor(private readonly prisma: PrismaService) {
    this.userProfiles.set('demo@anvesh.ai', {
      user_id: 'usr_demo_001',
      email: 'demo@anvesh.ai',
      full_name: 'Goutam Anvesh',
      role_type: 'candidate',
      headline: 'Senior AI & Machine Learning Systems Engineer',
      years_of_experience: 4.5,
      location: 'San Francisco, CA (Remote)',
      preferred_work_mode: 'REMOTE',
      target_min_salary: 175000,
      extracted_skills: [
        { name: 'Python', canonical_id: 'skill_py_01', years: 4.5, verified: true, level: 'Expert' },
        { name: 'PyTorch', canonical_id: 'skill_pytorch_01', years: 3.5, verified: true, level: 'Advanced' },
        { name: 'FastAPI', canonical_id: 'skill_fastapi_01', years: 3.0, verified: true, level: 'Advanced' },
        { name: 'Vector Databases', canonical_id: 'skill_qdrant_01', years: 2.0, verified: true, level: 'Advanced' },
        { name: 'Docker', canonical_id: 'skill_docker_01', years: 3.0, verified: true, level: 'Intermediate' },
      ],
      education: [{ degree: 'B.Tech in Computer Science', institution: 'National Institute of Tech', year: 2022 }],
    });
  }

  async getProfile(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const user = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          profile: {
            include: {
              userSkills: {
                include: { skill: true },
              },
            },
          },
        },
      });

      if (user && user.profile) {
        return {
          user_id: user.id,
          email: user.email,
          full_name: user.fullName,
          role_type: user.roleType,
          headline: user.profile.headline || 'Software Engineer',
          years_of_experience: user.profile.yearsOfExperience || 3.0,
          location: user.profile.location || 'Remote',
          preferred_work_mode: user.profile.preferredWorkMode || 'REMOTE',
          target_min_salary: user.profile.targetMinSalary || 160000,
          extracted_skills: user.profile.userSkills.map((us) => ({
            name: us.skill.canonicalName,
            canonical_id: us.skill.id,
            years: us.yearsUsed,
            verified: us.isVerified,
            level: us.proficiencyLevel >= 4 ? 'Expert' : 'Advanced',
          })),
          education: user.profile.educationHistory || [
            { degree: 'B.Tech in Computer Science', institution: 'National Institute of Tech', year: 2022 },
          ],
        };
      }
    } catch (e: any) {
      this.logger.debug(`Database profile lookup fallback (${e.message})`);
    }

    return (
      this.userProfiles.get(normalizedEmail) || {
        user_id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: normalizedEmail,
        full_name: 'Candidate User',
        headline: 'Software Engineer & AI Enthusiast',
        years_of_experience: 3.0,
        preferred_work_mode: 'REMOTE',
        extracted_skills: [
          { name: 'Python', years: 3.0, verified: true, level: 'Advanced' },
          { name: 'FastAPI', years: 2.0, verified: true, level: 'Intermediate' },
          { name: 'SQL', years: 3.0, verified: true, level: 'Advanced' },
        ],
      }
    );
  }

  async updateProfile(email: string, updateData: any) {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (user) {
        await this.prisma.profile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            headline: updateData.headline,
            summary: updateData.summary,
            yearsOfExperience: updateData.years_of_experience ? Number(updateData.years_of_experience) : 3.0,
            location: updateData.location,
            preferredWorkMode: updateData.preferred_work_mode || 'REMOTE',
            targetMinSalary: updateData.target_min_salary ? Number(updateData.target_min_salary) : undefined,
          },
          update: {
            headline: updateData.headline,
            summary: updateData.summary,
            yearsOfExperience: updateData.years_of_experience ? Number(updateData.years_of_experience) : undefined,
            location: updateData.location,
            preferredWorkMode: updateData.preferred_work_mode,
            targetMinSalary: updateData.target_min_salary ? Number(updateData.target_min_salary) : undefined,
          },
        });
      }
    } catch (_) {}

    const existing = await this.getProfile(normalizedEmail);
    const updated = { ...existing, ...updateData, updated_at: new Date().toISOString() };
    this.userProfiles.set(normalizedEmail, updated);
    return updated;
  }
}
