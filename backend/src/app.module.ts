import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TreatmentPlansModule } from './treatment-plans/treatment-plans.module';
import { WorkoutSessionsModule } from './workout-sessions/workout-sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TreatmentPlansModule,
    WorkoutSessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
