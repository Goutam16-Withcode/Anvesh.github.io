import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('feed')
  @ApiOperation({ summary: 'Get personalized multi-stage job recommendations (Hybrid + LTR + MMR)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recommendations' })
  @ApiQuery({ name: 'work_mode', required: false, type: String, description: 'Filter by REMOTE / HYBRID / ONSITE' })
  @ApiQuery({ name: 'diversity_factor', required: false, type: Number, description: 'MMR lambda diversity weight (0.0 - 1.0)' })
  @ApiResponse({ status: 200, description: 'Multi-stage recommendation feed with scoring breakdowns' })
  async getFeed(
    @Query('limit') limit?: number,
    @Query('work_mode') workMode?: string,
    @Query('diversity_factor') diversityFactor?: number,
  ) {
    return this.recommendationsService.getRecommendations({
      limit: limit ? Number(limit) : 20,
      work_mode: workMode,
      diversity_factor: diversityFactor ? Number(diversityFactor) : 0.35,
    });
  }

  @Post('personalized')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rank live catalog + ingested jobs against real candidate profile using LightGBM & MMR' })
  @ApiResponse({ status: 200, description: 'Personalized ranked feed with LinkedIn-grade attributes & TreeSHAP' })
  async getPersonalizedFeed(
    @Body()
    body: {
      candidate?: {
        headline?: string;
        skills?: string[];
        years_experience?: number;
        preferred_work_mode?: string;
      };
      limit?: number;
      work_mode?: string;
      diversity_factor?: number;
    },
  ) {
    return this.recommendationsService.getRecommendations({
      candidate: body?.candidate,
      limit: body?.limit ? Number(body.limit) : 25,
      work_mode: body?.work_mode,
      diversity_factor: body?.diversity_factor ?? 0.35,
    });
  }
}
