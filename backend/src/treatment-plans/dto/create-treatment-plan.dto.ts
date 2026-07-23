import { IsString, IsOptional, IsArray, ValidateNested, IsInt, Min, IsDateString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrescribedExerciseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  targetSets: number;

  @IsInt()
  @Min(1)
  targetReps: number;

  @IsInt()
  @Min(0)
  restSeconds: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  frequencyPerWeek?: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;
}

export class CreateTreatmentPlanDto {
  @IsString()
  patientId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescribedExerciseDto)
  exercises: CreatePrescribedExerciseDto[];
}
