import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class UpdateTreatmentPlanDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'COMPLETED', 'PAUSED'])
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
