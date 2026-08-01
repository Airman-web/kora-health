# Kora Health

A mobile-first physiotherapy telehealth platform for Rwanda.

**Live application:** https://kora-health.vercel.app
**Backend API:** https://kora-health-production.up.railway.app
**Repository:** https://github.com/Airman-web/kora-health

Kora Health connects Rwandan patients with licensed physiotherapists remotely.
Therapists prescribe personalised exercise plans. Patients log pain before and
after every workout. Progress becomes measurable data both sides can see.

Rwanda has approximately 186 registered physiotherapists for a population of
14.4 million. This project closes that distance by moving guided rehabilitation
into the phone.

## Table of contents

- [Live demo](#live-demo)
- [Test credentials](#test-credentials)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Running the project locally](#running-the-project-locally)
- [Deployment](#deployment)
- [Deferred features](#deferred-features)
- [License](#license)

## Live demo

The application is deployed and publicly accessible:

- **Web app (users):** https://kora-health.vercel.app
- **API (developers):** https://kora-health-production.up.railway.app

## Test credentials

You can use these accounts to test the deployed app immediately:

**Patient account:**
- Email: `patient@kora.rw`
- Password: `TestPassword123`

**Therapist account:**
- Email: `therapist@kora.rw`
- Password: `TestPassword123`

New accounts can also be created directly at
[kora-health.vercel.app/register](https://kora-health.vercel.app/register).

## Features

### Patient side

- Register and log in with role selection
- View prescribed treatment plans on a personal dashboard
- Follow guided exercise sessions with pre and post pain rating (0-10 scale)
- Track pain progress over time through visual charts
- Access personal workout history

### Therapist side

- Register with license verification information
- View all registered patients in the platform
- Search patients by name or phone number
- View individual patient details with clinical history
- Create treatment plans with multiple prescribed exercises
- Configure exercise parameters: sets, reps, rest periods, weekly frequency
- Monitor patient adherence and pain progression
- View pain progression charts per patient

### System-wide

- JWT-based authentication with role-based access control
- Responsive design that works on mobile and desktop
- Real-time data updates through the API
- Secure password hashing with bcrypt

## Tech stack

**Backend**
- NestJS 11 (TypeScript)
- Prisma ORM
- PostgreSQL hosted on Supabase
- JSON Web Tokens for authentication
- Passport JWT strategy
- bcrypt for password hashing

**Frontend**
- Next.js 16 with App Router and Turbopack
- Tailwind CSS 4
- Recharts for data visualization
- Font Awesome for icons
- React 19

**Deployment**
- Backend: Railway
- Frontend: Vercel
- Database: Supabase (PostgreSQL)

## Architecture

┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ │ HTTPS │ │ Prisma │ │
│ Next.js │────────▶│ NestJS API │────────▶│ PostgreSQL │
│ (Vercel) │◀────────│ (Railway) │◀────────│ (Supabase) │
│ │ JSON │ │ │ │
└─────────────────┘ └──────────────────┘ └─────────────────┘
Frontend REST API Database


The frontend calls the backend REST API, authenticates users with JWT, and
renders the UI. The backend enforces role-based authorization on every
endpoint and stores all clinical data in PostgreSQL through Prisma.

## Project structure

kora-health/
├── backend/ # NestJS API
│ ├── prisma/
│ │ ├── schema.prisma # Database schema (11 models)
│ │ └── migrations/ # Migration history
│ ├── src/
│ │ ├── auth/ # Authentication module
│ │ ├── treatment-plans/ # Treatment plans module
│ │ ├── workout-sessions/ # Workout sessions module
│ │ ├── prisma/ # Prisma service (global)
│ │ ├── app.module.ts
│ │ └── main.ts
│ ├── package.json
│ └── README.md
├── frontend/ # Next.js web app
│ ├── app/ # App Router pages
│ │ ├── page.tsx # Landing page
│ │ ├── about/ # About page
│ │ ├── gallery/ # Gallery page
│ │ ├── login/ # Login page
│ │ ├── register/ # Register page
│ │ ├── patient/ # Patient dashboards and screens
│ │ └── therapist/ # Therapist dashboards and screens
│ ├── components/ # Shared React components
│ ├── lib/ # API client and auth helpers
│ ├── public/ # Static assets and images
│ └── package.json
├── shared/ # Shared type definitions
├── railway.toml # Railway deployment config
├── nixpacks.toml # Nixpacks build config
└── README.md # This file


## Getting started

### Prerequisites

You need the following installed on your machine:

- **Node.js** version 20 or higher
- **npm** version 10 or higher (comes with Node.js)
- **Git**
- A **PostgreSQL** database (locally or a free Supabase project)

Check your Node and npm versions:

```bash
node --version
npm --version
```

### Clone the repository

```bash
git clone https://github.com/Airman-web/kora-health.git
cd kora-health
```

## Environment variables

The backend and frontend each need their own `.env` files.

### Backend environment variables

Create `backend/.env` with the following:

```env
# PostgreSQL connection string from Supabase or local Postgres
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT settings
JWT_SECRET="your-long-random-secret-here-at-least-32-chars"
JWT_EXPIRES_IN="7d"

# Server port (optional, defaults to 3000)
PORT=3000
```

**How to get a Supabase DATABASE_URL:**

1. Sign up for free at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string under "Connection string" (URI format)
5. Paste it as `DATABASE_URL`

### Frontend environment variables

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

When running locally, this points to your local backend. In production it
points to the Railway URL.

## Running the project locally

Once you've cloned the repo and created both `.env` files, follow these steps in order.

### Step 1: Install backend dependencies

```bash
cd backend
npm install
```

### Step 2: Generate the Prisma client and run migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

This creates all 11 database tables in your Postgres instance.

### Step 3: Start the backend server

```bash
npm run start:dev
```

The backend will start on `http://localhost:3000`. You should see NestJS
console output listing all the mapped routes.

### Step 4: Install frontend dependencies

Open a new terminal (keep the backend running).

```bash
cd frontend
npm install
```

### Step 5: Start the frontend dev server

```bash
npm run dev
```

The frontend runs on `http://localhost:3001` using Turbopack.

### Step 6: Open the application

Visit `http://localhost:3001` in your browser. You should see the Kora Health
landing page.

To test the full flow:

1. Click **Get started** and register as a therapist
2. Log out and register a second account as a patient
3. Log back in as the therapist and create a treatment plan for the patient
4. Log back in as the patient and complete a workout with pain tracking
5. Log back in as the therapist to see the pain progression on the patient's detail page

## Deployment

### Deploying the backend to Railway

1. Push your code to a GitHub repository
2. Sign up at [railway.app](https://railway.app) and create a new project
3. Connect your GitHub repository
4. Set the following environment variables in Railway:
   - `DATABASE_URL` (your Supabase connection string)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `PORT=8080`
5. Railway auto-detects Nixpacks and builds using `nixpacks.toml` and `railway.toml`
6. After deployment, your API is available at `https://your-service.up.railway.app`

### Deploying the frontend to Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set the root directory to `frontend`
4. Add the environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-service.up.railway.app`
5. Deploy. Vercel handles the rest.

## Deferred features

The following features were part of the original SRS but were deferred to
focus the alpha submission on the core clinical loop. They are tracked as
next-version work:

- Video consultations through Jitsi
- MTN Mobile Money payment integration
- WhatsApp reminder notifications
- Client-side AI form-checking via MediaPipe
- Profile picture upload
- Dark mode toggle
- Account deletion self-service
- Multi-language support (English, Kinyarwanda, French)

## License

© 2026 Kora Health. All rights reserved.

Built by Atigbi Emmanuel Ayomiku, Year 2 Software Engineering student at
African Leadership University, Kigali, Rwanda.
