import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CompleteWorkoutSessionDto {
  @IsInt()
  @Min(0)
  @Max(10)
  postPainScore: number;

  @IsInt()
  @Min(0)
  setsCompleted: number;

  @IsInt()
  @Min(0)
  repsCompleted: number;

  @IsInt()
  @Min(0)
  durationSeconds: number;

  @IsOptional()
  @IsString()
  patientNotes?: string;

  @IsOptional()
  @IsString()
  bodyLocation?: string;
}
