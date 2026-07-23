import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TreatmentPlansService } from './treatment-plans.service';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('treatment-plans')
@UseGuards(JwtAuthGuard)
export class TreatmentPlansController {
  constructor(private service: TreatmentPlansService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('THERAPIST')
  create(@CurrentUser() user: any, @Body() dto: CreateTreatmentPlanDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.service.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.findOne(user.id, user.role, id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('THERAPIST')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateTreatmentPlanDto) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('THERAPIST')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
