# Kora Health

A mobile-first physiotherapy telehealth platform built for Rwanda.

Kora Health connects patients with licensed physiotherapists for remote rehabilitation, including video consultations, prescribed exercise plans, mandatory pain-scale tracking (0-10), MTN Mobile Money payments, WhatsApp appointment reminders, and optional AI-powered form checking that runs entirely on the patient's own device.

## Current Version: v0.3 (Alpha)

This release is a functional Minimum Viable Product covering the core clinical workflow: authentication, treatment plan management, workout logging, and pain progress tracking. Booking, video consultations, Mobile Money payments, WhatsApp reminders, and the AI form-checking feature are on the roadmap for later versions.

### What is included in v0.3

- Patient and Therapist registration and login with JWT authentication
- Role-based access control
- Therapists creating personalized treatment plans with prescribed exercises
- Patients viewing their assigned treatment plans
- Patients logging workout sessions with pre and post pain scores
- Therapists tracking patient pain reduction over time
- Deployed backend accessible via public API

### What is on the roadmap for v0.4 and beyond

- Appointment booking calendar
- Live video consultations via Jitsi
- MTN Mobile Money payments
- WhatsApp-based appointment reminders
- AI-powered exercise form checking via MediaPipe (client-side, privacy preserving)
- Full Next.js frontend interface
- Kinyarwanda and French language support

## Repository Structure

This is a monorepo containing both the backend and (soon) the frontend.

## Live Deployment

- **Backend API:** kora-health-production.up.railway.app

## Tech Stack

**Backend:** NestJS (TypeScript), Prisma ORM, PostgreSQL, JWT authentication, bcrypt password hashing
**Database:** Supabase (managed PostgreSQL)
**Deployment:** Railway (backend), Supabase (database)

## Documentation

- Backend setup and API reference: [backend/README.md](./backend/README.md)
- System design and requirements: Available in the project SRS document

## Founder

Atigbi Emmanuel Ayomiku
Software Engineering Student, African Leadership University
Kigali, Rwanda

## Status

Active development. Currently building v0.3 for private alpha testing with a Rwandan physiotherapy practice.

## Acknowledgment

This project was developed as part of the Virtual Internship Simulation (VIS) and for the course Introduction to Softwaere Engineering at African Leadership University.