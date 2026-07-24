import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WorkoutSessionsService } from './workout-sessions.service';
import { StartWorkoutSessionDto } from './dto/start-workout-session.dto';
import { CompleteWorkoutSessionDto } from './dto/complete-workout-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('workout-sessions')
@UseGuards(JwtAuthGuard)
export class WorkoutSessionsController {
  constructor(private service: WorkoutSessionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('PATIENT')
  startSession(@CurrentUser() user: any, @Body() dto: StartWorkoutSessionDto) {
    return this.service.startSession(user.id, dto);
  }

  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @Roles('PATIENT')
  completeSession(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CompleteWorkoutSessionDto) {
    return this.service.completeSession(user.id, id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.service.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.findOne(user.id, user.role, id);
  }
  @Get('pain-progress/:patientId')
  @UseGuards(RolesGuard)
  @Roles('THERAPIST')
  getPainProgress(@CurrentUser() user: any, @Param('patientId') patientId: string) {
    return this.service.getPainProgress(user.id, patientId);
  }
}
