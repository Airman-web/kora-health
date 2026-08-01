# Kora Health Backend

NestJS REST API for the Kora Health physiotherapy telehealth platform.

**Base URL (production):** https://kora-health-production.up.railway.app

## Tech stack

- NestJS 11 (TypeScript)
- Prisma 6 ORM
- PostgreSQL (via Supabase)
- JWT authentication with Passport
- bcrypt for password hashing

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database

## Environment variables

Create `backend/.env` with:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="a-long-random-secret-at-least-32-characters"
JWT_EXPIRES_IN="7d"
PORT=3000
```

## Installation

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
```

## Running locally

```bash
npm run start:dev
```

The server runs on `http://localhost:3000` with hot reload.

For production build:

```bash
npm run build
npm run start:prod
```

## Database schema

The database has 11 models managed by Prisma:

- **User** — authentication and role
- **PatientProfile** — patient information
- **TherapistProfile** — therapist information and credentials
- **TreatmentPlan** — plans prescribed by therapists for patients
- **PrescribedExercise** — exercises within a treatment plan
- **WorkoutSession** — patient's execution of a prescribed exercise
- **PainLog** — pain ratings before and after workouts
- **Appointment** — scheduled sessions (deferred)
- **AvailabilitySlot** — therapist availability (deferred)
- **Payment** — payment records (deferred)
- **SessionFeedback** — post-session feedback (deferred)

To view the current schema:

```bash
cat prisma/schema.prisma
```

To open Prisma Studio for browsing your data:

```bash
npx prisma studio
```

## API endpoints

### Authentication

- `POST /auth/register` — create a new account (patient or therapist)
- `POST /auth/login` — authenticate and receive a JWT token
- `GET /auth/me` — get the currently authenticated user (requires JWT)

### Treatment plans

- `POST /treatment-plans` — create a plan (therapist only)
- `GET /treatment-plans` — list plans for the current user
- `GET /treatment-plans/:id` — get one plan
- `GET /treatment-plans/exercises/:id` — get one exercise from a plan
- `GET /treatment-plans/patients` — list all registered patients (therapist only)
- `GET /treatment-plans/patients/:id/detail` — full patient detail with plans and workouts (therapist only)
- `PATCH /treatment-plans/:id` — update a plan (therapist only)
- `DELETE /treatment-plans/:id` — delete a plan (therapist only)

### Workout sessions

- `POST /workout-sessions` — start a workout with pre-workout pain rating
- `PATCH /workout-sessions/:id/complete` — complete the workout with post-workout pain
- `GET /workout-sessions` — list sessions for the current user
- `GET /workout-sessions/:id` — get one session
- `GET /workout-sessions/pain-progress/:patientId` — pain data for a patient (therapist only)
- `GET /workout-sessions/my-pain-progress` — pain data for the current patient

All non-auth endpoints require an `Authorization: Bearer <jwt>` header.

## Authorization

The API uses role-based access control:

- Patients can only see and modify their own data
- Therapists can only see patients who they've prescribed plans to
- All requests are authenticated via JWT (except `/auth/register` and `/auth/login`)

## Deployment (Railway)

The backend is configured for Railway deployment via `railway.toml` and
`nixpacks.toml` at the repository root.

Required Railway environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `PORT=8080`

After each git push, verify the deployment status in the Railway dashboard.
If Railway shows an "Update available" indicator, click it to trigger the
new deployment.

## Testing the API manually

Once running, you can test with curl:

**Register a patient:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "role": "PATIENT",
    "fullName": "Test User",
    "phoneNumber": "+250788000000",
    "dateOfBirth": "1990-01-01"
  }'
```

**Log in:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

Save the returned `token` and use it in subsequent requests:

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
