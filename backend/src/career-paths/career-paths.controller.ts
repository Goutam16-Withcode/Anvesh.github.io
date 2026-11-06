import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CareerPathsService } from './career-paths.service';

@ApiTags('Career Paths & Milestones')
@Controller('career-paths')
export class CareerPathsController {
  constructor(private readonly careerPathsService: CareerPathsService) {}

  @Get()
  @ApiOperation({ summary: 'Get career tracks, bridge nodes, and milestone progressions' })
  @ApiResponse({ status: 200, description: 'Hierarchical career trajectory tracks' })
  getCareerTracks() {
    return {
      tracks: this.careerPathsService.getCareerTracks(),
    };
  }
}
