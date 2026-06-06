# Documentation Generation Plan

This plan outlines the creation of comprehensive documentation for the **HT - Care** (Inventory Management System) based on the provided `AGENTS.md`, `package.json`, and the dashboard mockups.

## Open Questions
- Should these documentation files be placed in the root directory, or would you prefer them inside a `docs/` folder to keep the root directory clean? (This plan assumes placing them in the root directory as per your prompt).

## Proposed Changes

### Project Root Directory

The following markdown files will be created in the root directory to assist with the website creation process.

#### [NEW] PRD.md
**Product Requirements Document**
- **Overview & Goals**: Streamline inventory operations for HT (Handy Talkies).
- **Target Audience**: Admins, Operators, Business Owners.
- **Features**: Dashboard, Master Data (HT & Borrowers), Transactions (Scan Borrow & Return), Reports.
- **References**: Extracted from UI screenshots (e.g., HT status tracking, borrower departments).

#### [NEW] ARCHITECTURE.md
**System Architecture**
- **Frontend/Backend**: Next.js 16 (App Router)
- **State Management**: Zustand (Client), TanStack React Query (Server State).
- **Styling**: Tailwind CSS v4, shadcn/ui.
- **Folder Structure**: Clean Architecture based on `AGENTS.md` rules.

#### [NEW] DATABASE.md
**Database Schema & Strategy**
- **Tech**: PostgreSQL via Supabase, managed by Prisma ORM.
- **Core Entities**: 
  - `User` (NextAuth)
  - `HT_Item` (ID, Merk/Tipe, Kondisi, Status)
  - `Borrower` (ID, Nama Lengkap, Departemen)
  - `Transaction` (Borrow/Return Logs)

#### [NEW] DESIGN.md
**UI/UX & Styling Guidelines**
- **System**: shadcn/ui components.
- **Layout**: Sidebar navigation (Dashboard, Master Data, Transaksi), Top metrics cards, Data tables.
- **Theming**: Dark Mode support, defined breakpoints, color scheme rules.

#### [NEW] SECURITY.md
**Security Best Practices**
- **Authentication**: NextAuth.js.
- **Authorization**: RBAC (Superadmin, Admin, Operator).
- **Environment & APIs**: Validating inputs with Zod, concealing Supabase secrets.

#### [NEW] TESTING.md
**Testing Strategy**
- **Frameworks**: Vitest, React Testing Library.
- **Coverage Focus**: Business logic, API endpoints, Utility functions.

#### [NEW] DEPLOYMENT.md
**Deployment Guide**
- **Hosting**: Standard Next.js deployment (e.g., Vercel).
- **Environment Setup**: Setting up `.env` for production.
- **Database CI/CD**: Running `prisma migrate deploy` during build.

#### [NEW] TASK_INSTRUCTION.md
**Implementation Checklist**
- Step-by-step checklist breaking down the `AGENTS.md` planned features into actionable tasks.

## Verification Plan

### Manual Verification
- Review the generated documents to ensure they align with the rules in `AGENTS.md`.
- Ensure all fields and concepts shown in the screenshots (like HT condition: "Baik/Rusak", Status: "Tersedia/Dipinjam") are captured in the Database and PRD docs.
