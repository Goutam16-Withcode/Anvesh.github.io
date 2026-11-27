import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationStatus, InteractionType, JobsPipelineService } from './jobs-pipeline.service';

@ApiTags('Jobs Pipeline, ATS & Telemetry')
@Controller('jobs-pipeline')
export class JobsPipelineController {
  constructor(private readonly pipelineService: JobsPipelineService) {}

  @Get('saved')
  @ApiOperation({ summary: 'Get candidate saved jobs' })
  getSavedJobs() {
    return this.pipelineService.getSavedJobs();
  }

  @Post('saved/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle bookmark/save status on a job posting' })
  toggleSaveJob(@Param('jobId') jobId: string, @Body() body?: { folderName?: string }) {
    return this.pipelineService.toggleSaveJob(jobId, body?.folderName);
  }

  @Get('applications')
  @ApiOperation({ summary: 'Get candidate job application tracker pipeline' })
  getApplications() {
    return this.pipelineService.getApplications();
  }

  @Post('applications/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit Easy Apply or External Application for a job' })
  applyToJob(
    @Param('jobId') jobId: string,
    @Body() body?: { easyApply?: boolean; notes?: string },
  ) {
    return this.pipelineService.applyToJob(jobId, body);
  }

  @Patch('applications/:jobId/status')
  @ApiOperation({ summary: 'Update ATS application stage (APPLIED -> REVIEWING -> INTERVIEW -> OFFER)' })
  updateApplicationStatus(
    @Param('jobId') jobId: string,
    @Body() body: { status: ApplicationStatus },
  ) {
    return this.pipelineService.updateApplicationStatus(jobId, body.status);
  }

  @Post('interactions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log closed-loop interaction telemetry event (VIEW, CLICK, SAVE, APPLY, DISMISS)' })
  @ApiResponse({ status: 200, description: 'Telemetry event recorded' })
  logInteraction(
    @Body()
    body: {
      jobId: string;
      interactionType: InteractionType;
      rankPosition?: number;
      dwellTimeSeconds?: number;
    },
  ) {
    return this.pipelineService.logInteraction(body);
  }

  @Get('telemetry')
  @ApiOperation({ summary: 'Retrieve closed-loop user telemetry summary' })
  getTelemetrySummary() {
    return this.pipelineService.getTelemetrySummary();
  }
}
