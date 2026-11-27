import { Module } from '@nestjs/common';
import { JobsPipelineController } from './jobs-pipeline.controller';
import { JobsPipelineService } from './jobs-pipeline.service';

@Module({
  controllers: [JobsPipelineController],
  providers: [JobsPipelineService],
  exports: [JobsPipelineService],
})
export class JobsPipelineModule {}
