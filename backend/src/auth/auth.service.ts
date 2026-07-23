import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Validate role-specific fields
    if (dto.role === 'PATIENT' && !dto.dateOfBirth) {
      throw new BadRequestException('Patient must provide dateOfBirth');
    }
    if (dto.role === 'THERAPIST' && !dto.licenseNumber) {
      throw new BadRequestException('Therapist must provide licenseNumber');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create User + Profile in a single transaction
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          role: dto.role,
        },
      });

      if (dto.role === 'PATIENT') {
        await tx.patientProfile.create({
          data: {
            userId: newUser.id,
            fullName: dto.fullName,
            dateOfBirth: new Date(dto.dateOfBirth!),
            phoneNumber: dto.phoneNumber,
          },
        });
      } else {
        await tx.therapistProfile.create({
          data: {
            userId: newUser.id,
            fullName: dto.fullName,
            licenseNumber: dto.licenseNumber!,
            specialty: dto.specialty,
          },
        });
      }

      return newUser;
    });

    // Return a JWT token
    const token = await this.signToken(user.id, user.email, user.role);
    return {
      user: { id: user.id, email: user.email, role: user.role },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.signToken(user.id, user.email, user.role);
    return {
      user: { id: user.id, email: user.email, role: user.role },
      token,
    };
  }

  private async signToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return this.jwtService.signAsync(payload);
  }
}
