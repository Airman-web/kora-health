import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartWorkoutSessionDto } from './dto/start-workout-session.dto';
import { CompleteWorkoutSessionDto } from './dto/complete-workout-session.dto';

@Injectable()
export class WorkoutSessionsService {
  constructor(private prisma: PrismaService) {}

  async startSession(patientUserId: string, dto: StartWorkoutSessionDto) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { userId: patientUserId },
    });

    if (!patient) throw new NotFoundException('Patient profile not found');

    // Verify the exercise exists and is assigned to this patient
    const exercise = await this.prisma.prescribedExercise.findUnique({
      where: { id: dto.exerciseId },
      include: { plan: true },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');
    if (exercise.plan.patientId !== patient.id) {
      throw new ForbiddenException('This exercise is not assigned to you');
    }

    // Create the session and the pre-pain log in one transaction
    const session = await this.prisma.workoutSession.create({
      data: {
        patientId: patient.id,
        exerciseId: exercise.id,
        painLogs: {
          create: {
            score: dto.prePainScore,
            timing: 'PRE',
            bodyLocation: dto.bodyLocation,
          },
        },
      },
      include: {
        exercise: true,
        painLogs: true,
      },
    });

    return session;
  }

  async completeSession(patientUserId: string, sessionId: string, dto: CompleteWorkoutSessionDto) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { userId: patientUserId },
    });

    if (!patient) throw new NotFoundException('Patient profile not found');

    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: { painLogs: true },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.patientId !== patient.id) {
      throw new ForbiddenException('This session does not belong to you');
    }
    if (session.completedAt) {
      throw new BadRequestException('Session is already completed');
    }

    // Update session and add post-pain log in one transaction
    const updated = await this.prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        setsCompleted: dto.setsCompleted,
        repsCompleted: dto.repsCompleted,
        durationSeconds: dto.durationSeconds,
        patientNotes: dto.patientNotes,
        painLogs: {
          create: {
            score: dto.postPainScore,
            timing: 'POST',
            bodyLocation: dto.bodyLocation,
          },
        },
      },
      include: {
        exercise: true,
        painLogs: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return updated;
  }

  async findAll(userId: string, role: string) {
    if (role === 'PATIENT') {
      const patient = await this.prisma.patientProfile.findUnique({
        where: { userId },
      });
      if (!patient) throw new NotFoundException('Patient profile not found');

      return this.prisma.workoutSession.findMany({
        where: { patientId: patient.id },
        include: {
          exercise: { select: { id: true, name: true } },
          painLogs: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { startedAt: 'desc' },
      });
    }

    // Therapist case: return sessions for all their patients
    const therapist = await this.prisma.therapistProfile.findUnique({
      where: { userId },
    });
    if (!therapist) throw new NotFoundException('Therapist profile not found');

    // Get all plans by this therapist, then all sessions for exercises in those plans
    return this.prisma.workoutSession.findMany({
      where: {
        exercise: {
          plan: { therapistId: therapist.id },
        },
      },
      include: {
        patient: { select: { id: true, fullName: true } },
        exercise: { select: { id: true, name: true } },
        painLogs: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findOne(userId: string, role: string, sessionId: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        exercise: {
          include: {
            plan: { include: { therapist: { select: { userId: true } } } },
          },
        },
        patient: { select: { id: true, userId: true, fullName: true } },
        painLogs: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) throw new NotFoundException('Session not found');

    if (role === 'PATIENT' && session.patient.userId !== userId) {
      throw new ForbiddenException('This session does not belong to you');
    }
    if (role === 'THERAPIST' && session.exercise.plan.therapist.userId !== userId) {
      throw new ForbiddenException('This session is not from one of your patients');
    }

    return session;
  }

  async getPainProgress(therapistUserId: string, patientId: string) {
    const therapist = await this.prisma.therapistProfile.findUnique({
      where: { userId: therapistUserId },
    });
    if (!therapist) throw new NotFoundException('Therapist profile not found');

    // Verify this therapist has treated this patient
    const relationship = await this.prisma.treatmentPlan.findFirst({
      where: {
        therapistId: therapist.id,
        patientId,
      },
    });

    if (!relationship) {
      throw new ForbiddenException('You have not treated this patient');
    }

    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        patientId,
        completedAt: { not: null },
      },
      include: {
        exercise: { select: { name: true } },
        painLogs: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { startedAt: 'asc' },
    });

    // Format for a chart: [{ date, prePain, postPain, exerciseName }]
    return sessions.map((s) => {
      const prePain = s.painLogs.find((p) => p.timing === 'PRE')?.score ?? null;
      const postPain = s.painLogs.find((p) => p.timing === 'POST')?.score ?? null;
      return {
        sessionId: s.id,
        date: s.startedAt,
        exerciseName: s.exercise.name,
        prePain,
        postPain,
        painReduction: prePain !== null && postPain !== null ? prePain - postPain : null,
      };
    });
  }
}
