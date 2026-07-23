import { IsEmail, IsString, MinLength, IsIn, IsOptional, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsIn(['PATIENT', 'THERAPIST'])
  role: 'PATIENT' | 'THERAPIST';

  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  // Patient-only fields
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  // Therapist-only fields
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  specialty?: string;
}
