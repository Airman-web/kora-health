import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';

@Injectable()
export class TreatmentPlansService {
  constructor(private prisma: PrismaService) {}

  async create(therapistUserId: string, dto: CreateTreatmentPlanDto) {
    // Get therapist profile
    const therapist = await this.prisma.therapistProfile.findUnique({
      where: { userId: therapistUserId },
    });

    if (!therapist) {
      throw new NotFoundException('Therapist profile not found');
    }

    // Verify the patient exists
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Create the plan and its exercises in a single transaction
    const plan = await this.prisma.treatmentPlan.create({
      data: {
        title: dto.title,
        description: dto.description,
        patientId: dto.patientId,
        therapistId: therapist.id,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        exercises: {
          create: dto.exercises.map((ex) => ({
            name: ex.name,
            description: ex.description,
            targetSets: ex.targetSets,
            targetReps: ex.targetReps,
            restSeconds: ex.restSeconds,
            frequencyPerWeek: ex.frequencyPerWeek ?? 3,
            videoUrl: ex.videoUrl,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return plan;
  }

  async findAll(userId: string, role: string) {
    if (role === 'THERAPIST') {
      const therapist = await this.prisma.therapistProfile.findUnique({
        where: { userId },
      });
      if (!therapist) throw new NotFoundException('Therapist profile not found');

      return this.prisma.treatmentPlan.findMany({
        where: { therapistId: therapist.id },
        include: {
          exercises: true,
          patient: {
            select: { id: true, fullName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Patient case
    const patient = await this.prisma.patientProfile.findUnique({
      where: { userId },
    });
    if (!patient) throw new NotFoundException('Patient profile not found');

    return this.prisma.treatmentPlan.findMany({
      where: { patientId: patient.id },
      include: {
        exercises: true,
        therapist: {
          select: { id: true, fullName: true, specialty: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, role: string, planId: string) {
    const plan = await this.prisma.treatmentPlan.findUnique({
      where: { id: planId },
      include: {
        exercises: true,
        patient: { select: { id: true, userId: true, fullName: true } },
        therapist: { select: { id: true, userId: true, fullName: true, specialty: true } },
      },
    });

    if (!plan) throw new NotFoundException('Treatment plan not found');

    // Authorization: only the patient it's assigned to or the therapist who created it can view
    if (role === 'PATIENT' && plan.patient.userId !== userId) {
      throw new ForbiddenException('You cannot view this treatment plan');
    }
    if (role === 'THERAPIST' && plan.therapist.userId !== userId) {
      throw new ForbiddenException('You cannot view this treatment plan');
    }

    return plan;
  }

  async update(therapistUserId: string, planId: string, dto: UpdateTreatmentPlanDto) {
    const plan = await this.prisma.treatmentPlan.findUnique({
      where: { id: planId },
      include: { therapist: true },
    });

    if (!plan) throw new NotFoundException('Treatment plan not found');
    if (plan.therapist.userId !== therapistUserId) {
      throw new ForbiddenException('Only the creating therapist can update this plan');
    }

    return this.prisma.treatmentPlan.update({
      where: { id: planId },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: { exercises: true },
    });
  }

  async remove(therapistUserId: string, planId: string) {
    const plan = await this.prisma.treatmentPlan.findUnique({
      where: { id: planId },
      include: { therapist: true },
    });

    if (!plan) throw new NotFoundException('Treatment plan not found');
    if (plan.therapist.userId !== therapistUserId) {
      throw new ForbiddenException('Only the creating therapist can delete this plan');
    }

    await this.prisma.treatmentPlan.delete({ where: { id: planId } });
    return { message: 'Treatment plan deleted' };
  }
}
