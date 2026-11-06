import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ANVESH Database Seeder...');

  // 1. Seed Demo User & Profile
  const demoEmail = 'demo@anvesh.ai';
  const passwordHash = await bcrypt.hash('CandidatePass123!', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      hashedPassword: passwordHash,
      fullName: 'Goutam Anvesh',
      roleType: 'candidate',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      provider: 'local',
      profile: {
        create: {
          headline: 'Senior AI & Machine Learning Systems Engineer',
          summary: 'Specializing in deterministic retrieval, learning-to-rank systems, and GPU inference pipelines.',
          yearsOfExperience: 4.5,
          currentRole: 'Senior AI Platform Engineer',
          location: 'San Francisco, CA (Remote)',
          preferredWorkMode: 'REMOTE',
          targetMinSalary: 175000,
          educationHistory: [
            { degree: 'B.Tech in Computer Science', institution: 'National Institute of Tech', year: 2022 },
          ],
          experienceHistory: [
            {
              role: 'Machine Learning Infrastructure Engineer',
              company: 'Vanguard AI',
              duration: '2023 - Present',
              bullets: ['Deployed Qdrant HNSW vector cluster', 'Reduced P99 retrieval latency to 18ms'],
            },
          ],
        },
      },
    },
  });
  console.log(`✅ Demo User seeded: ${demoUser.email} (${demoUser.id})`);

  // 2. Seed Skills from taxonomy
  const skillsPath = path.resolve(process.cwd(), '../data/taxonomy/skills.json');
  if (fs.existsSync(skillsPath)) {
    const raw = fs.readFileSync(skillsPath, 'utf-8');
    const { skills } = JSON.parse(raw);

    for (const sk of skills) {
      await prisma.skill.upsert({
        where: { canonicalName: sk.name },
        update: {
          category: sk.category,
          aliases: sk.aliases || [],
        },
        create: {
          canonicalName: sk.name,
          category: sk.category,
          aliases: sk.aliases || [],
        },
      });
    }
    console.log(`✅ Seeded ${skills.length} canonical skills from taxonomy.`);
  }

  // 3. Seed Companies & Jobs
  const sampleJobsPath = path.resolve(process.cwd(), '../data/sample/sample_jobs.json');
  if (fs.existsSync(sampleJobsPath)) {
    const raw = fs.readFileSync(sampleJobsPath, 'utf-8');
    const jobs = JSON.parse(raw);

    for (const j of jobs) {
      const company = await prisma.company.upsert({
        where: { name: j.company },
        update: {},
        create: {
          name: j.company,
          location: j.location,
          websiteUrl: `https://${j.company.toLowerCase().replace(/\s+/g, '')}.com`,
        },
      });

      const job = await prisma.job.upsert({
        where: { dedupHash: `hash_${j.id}` },
        update: {},
        create: {
          companyId: company.id,
          title: j.title,
          description: j.description,
          employmentType: 'FULL_TIME',
          workMode: j.work_mode || 'REMOTE',
          location: j.location,
          minExperienceYears: j.min_experience_years || 2,
          maxExperienceYears: j.max_experience_years || 6,
          minSalary: j.min_salary || 150000,
          maxSalary: j.max_salary || 220000,
          currency: j.currency || 'USD',
          dedupHash: `hash_${j.id}`,
        },
      });

      // Link required skills
      if (j.required_skills && Array.isArray(j.required_skills)) {
        for (const skillName of j.required_skills) {
          const skill = await prisma.skill.findUnique({ where: { canonicalName: skillName } });
          if (skill) {
            await prisma.jobSkill.upsert({
              where: { jobId_skillId: { jobId: job.id, skillId: skill.id } },
              update: {},
              create: {
                jobId: job.id,
                skillId: skill.id,
                isMandatory: true,
                weight: 2,
              },
            });
          }
        }
      }
    }
    console.log(`✅ Seeded ${jobs.length} jobs with company and skill associations.`);
  }

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
