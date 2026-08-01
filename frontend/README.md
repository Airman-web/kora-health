# Kora Health Frontend

Next.js web application for the Kora Health platform.

**Live URL:** https://kora-health.vercel.app

## Tech stack

- Next.js 16 with App Router
- React 19
- Tailwind CSS 4
- Recharts (data visualization)
- Font Awesome (icons)
- Turbopack (dev server)

## Prerequisites

- Node.js 20+
- npm 10+
- A running Kora Health backend (locally or deployed)

## Environment variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production this points to your deployed backend URL.

## Installation

```bash
cd frontend
npm install
```

## Running locally

```bash
npm run dev
```

The app runs on `http://localhost:3001` with Turbopack for fast reload.

For production build:

```bash
npm run build
npm run start

## Project structure

frontend/
├── app/ # Next.js App Router pages
│ ├── layout.tsx # Root layout with Inter font
│ ├── page.tsx # Landing page
│ ├── globals.css # Global styles and Kora design tokens
│ ├── about/ # About page
│ ├── gallery/ # Gallery page
│ ├── login/ # Sign in
│ ├── register/ # Sign up (patient or therapist)
│ ├── patient/
│ │ ├── dashboard/ # Patient home
│ │ ├── workout/ # Guided exercise session
│ │ └── progress/ # Personal pain history
│ └── therapist/
│ ├── layout.tsx # Sidebar layout for therapist section
│ ├── dashboard/ # Therapist home
│ ├── patients/ # Patients list and detail
│ ├── plans/ # Treatment plans list and creation
│ └── settings/ # Settings (placeholder)
├── components/ # Shared React components
│ ├── Logo.tsx
│ ├── Icon.tsx
│ ├── PublicNav.tsx
│ ├── Footer.tsx
│ ├── AuthHeader.tsx
│ └── TherapistSidebar.tsx
├── lib/ # Client-side helpers
│ ├── api.ts # API client for the backend
│ └── auth.ts # Token and user management
└── public/
└── images/ # Static images used in the app


## Deployment (Vercel)

1. Import the GitHub repository into Vercel
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL` set to your deployed backend URL
4. Deploy

Vercel auto-deploys on every push to the `main` branch.
```


