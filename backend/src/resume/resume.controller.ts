import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResumeService } from './resume.service';

@ApiTags('Resume Intelligence & Parsing')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('parse')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parse uploaded resume and extract verified skill ontology AST' })
  @ApiResponse({ status: 200, description: 'Extracted competencies, experience duration, and confidence' })
  parseResume(@Body() body: any) {
    return this.resumeService.parseResume(body);
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload resume file and trigger deterministic extraction' })
  @ApiResponse({ status: 200, description: 'Parsed candidate profile' })
  uploadResume(@Body() body: any) {
    return this.resumeService.parseResume(body);
  }
}

