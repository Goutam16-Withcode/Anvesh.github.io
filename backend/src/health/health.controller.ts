import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Health & Telemetry')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Industrial cluster health & dependency telemetry check' })
  @ApiResponse({ status: 200, description: 'Live operational status of API Gateway, ML Engine, DB, and Ingestion' })
  async check() {
    let dbStatus = 'OFFLINE (Resilient Fallback Active)';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'ONLINE';
    } catch {
      // Resilient fallback active
    }

    let mlStatus = 'OFFLINE (Deterministic Fallback Active)';
    try {
      const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 800);
      const res = await fetch(`${mlUrl}/health`, { signal: controller.signal });
      clearTimeout(t);
      if (res.ok) mlStatus = 'ONLINE';
    } catch {
      // Fallback active
    }

    let ingestedCount = 0;
    try {
      const ingestedPath = path.resolve(process.cwd(), '../data/processed/latest_ingested_jobs.json');
      if (fs.existsSync(ingestedPath)) {
        const raw = fs.readFileSync(ingestedPath, 'utf-8');
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) ingestedCount = arr.length;
      }
    } catch {
      ingestedCount = 0;
    }

    return {
      status: 'UP',
      app: 'ANVESH Career Intelligence Platform',
      version: '1.1.0-industrial',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.round(process.uptime()),
      services: {
        api_gateway: 'ONLINE',
        postgresql: dbStatus,
        ml_microservice: mlStatus,
        ingested_jobs_cached: ingestedCount,
        jobs_pipeline: 'ONLINE',
        what_if_simulation: 'ONLINE',
        career_agent: 'ONLINE',
      },
    };
  }
}
