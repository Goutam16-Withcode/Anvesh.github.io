import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkillGapService } from './skill-gap.service';

@ApiTags('Skill Gap Analysis')
@Controller('skill-gap')
export class SkillGapController {
  constructor(private readonly skillGapService: SkillGapService) {}

  @Get(':roleId')
  @ApiOperation({ summary: 'Compute multi-vector competency gap radar against a target role' })
  @ApiResponse({ status: 200, description: 'Competency radar matrix, missing skills, and curated curriculum' })
  getSkillGap(@Param('roleId') roleId: string) {
    return this.skillGapService.getSkillGap(roleId);
  }
}
