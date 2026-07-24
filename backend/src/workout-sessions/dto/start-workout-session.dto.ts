import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class StartWorkoutSessionDto {
  @IsString()
  exerciseId: string;

  @IsInt()
  @Min(0)
  @Max(10)
  prePainScore: number;

  @IsOptional()
  @IsString()
  bodyLocation?: string;
}
