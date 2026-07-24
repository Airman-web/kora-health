# Kora Health Backend

The NestJS-based API service for Kora Health, a mobile-first physiotherapy telehealth platform for Rwanda.

## Tech Stack

- **Framework:** NestJS 11 (TypeScript)
- **ORM:** Prisma 6
- **Database:** PostgreSQL (hosted on Supabase)
- **Authentication:** JWT with bcrypt password hashing
- **Deployment:** Railway (production)

## Prerequisites

Before setting up locally, you need:

- Node.js version 20 or higher
- npm (comes with Node.js)
- Git
- A Supabase account (for the database)
- A code editor (VS Code recommended)

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Airman-web/kora-health.git
cd kora-health/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a Supabase project at [supabase.com](https://supabase.com) and copy the Session Pooler connection URL.

### 4. Configure environment variables

Create a file named `.env` inside the `backend/` folder with the following:

```env
DATABASE_URL="your_supabase_connection_url_here"
JWT_SECRET="a_long_random_secret_string_at_least_32_characters"
JWT_EXPIRES_IN="7d"
```

**Important:** Never commit this file. It is already in `.gitignore`.

### 5. Run database migrations

```bash
npx prisma migrate dev
```

This creates all 11 tables in your Supabase database and generates the Prisma Client.

### 6. Start the development server

```bash
npm run start:dev
```

The server runs at `http://localhost:3000`. Every code change auto-reloads the server.

## Available Scripts

- `npm run start:dev` - Run in development mode with hot reload
- `npm run start:prod` - Run compiled production build
- `npm run build` - Compile TypeScript to JavaScript
- `npm run lint` - Run ESLint checks
- `npx prisma studio` - Open a visual database browser
- `npx prisma migrate dev` - Create and apply a new migration

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user (Patient or Therapist)
- `POST /auth/login` - Login and receive a JWT token
- `GET /auth/me` - Get the current user's info (requires token)

### Treatment Plans (requires JWT)

- `POST /treatment-plans` - Create a new plan with exercises (Therapists only)
- `GET /treatment-plans` - List plans (therapist sees created plans, patient sees assigned)
- `GET /treatment-plans/:id` - Get one specific plan with exercises
- `PATCH /treatment-plans/:id` - Update a plan (Therapists only, owner only)
- `DELETE /treatment-plans/:id` - Delete a plan (Therapists only, owner only)

### Workout Sessions (requires JWT)

- `POST /workout-sessions` - Start a session with pre-pain log (Patients only)
- `PATCH /workout-sessions/:id/complete` - Complete a session with post-pain log (Patients only)
- `GET /workout-sessions` - List sessions (patient sees own, therapist sees patients')
- `GET /workout-sessions/:id` - Get one session with pain logs
- `GET /workout-sessions/pain-progress/:patientId` - Get pain time-series for a patient (Therapists only)

## Database Schema

11 models total, organized into 3 domains:

**Identity and profiles**
- User, PatientProfile, TherapistProfile

**Clinical treatment**
- TreatmentPlan, PrescribedExercise, WorkoutSession, PainLog

**Booking and payments (schema only, endpoints coming in v0.4)**
- Appointment, AvailabilitySlot, Payment, SessionFeedback

See `prisma/schema.prisma` for the complete data model.

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

Tokens expire after 7 days. Send `POST /auth/login` again to get a fresh one.

## Testing the API

The `api-tests/` folder contains VS Code REST Client `.http` files for testing every endpoint locally. Install the REST Client extension in VS Code to use them.

## Deployment

The backend is deployed on Railway. Deployment happens automatically when code is pushed to the `main` branch on GitHub.

**Deployment configuration:**
- `railway.toml` at the repo root defines build and start commands
- `nixpacks.toml` at the repo root forces Node 20 during builds

**Required environment variables in Railway:**
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Project Structure

backend/
├── src/
│ ├── auth/ Authentication module
│ │ ├── decorators/ Custom decorators (Roles, CurrentUser)
│ │ ├── dto/ Request validation classes
│ │ ├── guards/ JWT and Role guards
│ │ ├── strategies/ Passport JWT strategy
│ │ ├── auth.controller.ts
│ │ ├── auth.module.ts
│ │ └── auth.service.ts
│ ├── prisma/ Prisma service (database client)
│ ├── treatment-plans/ Treatment plan module
│ ├── workout-sessions/ Workout session and pain log module
│ ├── app.module.ts
│ └── main.ts Application entry point
├── prisma/
│ ├── schema.prisma Database schema definition
│ └── migrations/ Migration history
├── api-tests/ REST Client test files (local only)
├── .env Local environment variables (never committed)
└── package.json

## Contributing

This is a solo project by Atigbi Emmanuel Ayomiku for the Virtual Internship Simulation and for the course Introduction to Softwaere Engineering at the African Leadership University.

## License

Currently unlicensed. Contact the founder for reuse permissions.