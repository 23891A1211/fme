
  # FindMyEvent – College Events & Communities Platform

  FindMyEvent is a React + TypeScript web app for discovering, organizing, and managing college events. It includes role‑based dashboards (Student, Organizer, Crew, Admin), event creation and registration flows, a community area, and an organizer verification workflow routed through the Admin dashboard.

  ## Core Features
  - **Role-based dashboards**: `student-dashboard`, `organizer-dashboard`, `crew-dashboard`, `admin-dashboard` with protected routes
  - **Organizer verification**: organizers submit details → admin reviews → approve/reject with real-time UI updates
  - **Events**: create, list, view details, manage attendees (scaffolded)
  - **Communities**: basic channels scaffolding for event discussions
  - **Auth & Theme**: simple auth context and dark/light theme

  ## Tech Stack
  - Vite + React (TypeScript)
  - Shadcn UI + Radix primitives + Lucide icons
  - Supabase (Auth + Database client). The app can work with a DB or fall back to safe mock paths

  ## Getting Started
  ### Prerequisites
  - Node.js 18+ (20 LTS recommended)
  - npm 9+

  ### Install
  ```bash
  npm i
  ```

  ### Environment
  Create `.env.local` with your Supabase project (public) keys:
  ```ini
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
  The client also supports `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

  ### Develop
  ```bash
  npm run dev
  ```
  The dev server runs on http://localhost:3000.

  ### Build
  ```bash
  npm run build
  npm run preview
  ```

  ## Routing & Access Control
  - All routes are defined in `src/components/Router.tsx` and protected via `src/components/ProtectedRoute.tsx`.
  - On login/session restore, the user role is resolved from the Supabase `users.role` (fallback to auth metadata). Admins route to `/admin-dashboard`.

  ## Organizer Verification Flow
  - Organizers submit verification from the `OrganizerDashboard`.
  - Admins see items under the Verifications tab and can Approve/Reject.
  - Cards update immediately (optimistic) and sync with the database.

  ## Deployment (Vercel)
  - The repo includes `vercel.json` with SPA rewrites so client routes work on refresh.
  - Set the same env vars in Vercel project settings and redeploy.

  ## Notes
  - Supabase integration lives in `src/utils/supabaseApi.ts` and `src/utils/supabaseClient.ts`.
  - The app gracefully falls back to mock data paths if certain tables aren’t present; connect your DB to unlock full functionality.
  