import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Profile & Candidate Intelligence')
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile and verified skill ontology' })
  @ApiResponse({ status: 200, description: 'Candidate profile data' })
  async getProfile(@Request() req: any) {
    const email = req.user?.email || 'demo@anvesh.ai';
    return this.usersService.getProfile(email);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile and verified skill ontology' })
  @ApiResponse({ status: 200, description: 'Candidate profile data' })
  async getMyProfile(@Request() req: any) {
    const email = req.user?.email || 'demo@anvesh.ai';
    return this.usersService.getProfile(email);
  }

  @Put()
  @ApiOperation({ summary: 'Update candidate profile preferences and skills' })
  async updateProfileDirect(@Request() req: any, @Body() body: any) {
    const email = req.user?.email || 'demo@anvesh.ai';
    return this.usersService.updateProfile(email, body);
  }

  @Put('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update candidate profile preferences and skills' })
  async updateProfile(@Request() req: any, @Body() body: any) {
    const email = req.user?.email || 'demo@anvesh.ai';
    return this.usersService.updateProfile(email, body);
  }
}
