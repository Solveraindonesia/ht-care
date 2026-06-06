# Implementation Plan: Phase 1 (NextAuth & next-intl)

## Goal
Implement Authentication using NextAuth with the Supabase Database (via Prisma), and initialize the `next-intl` dictionary structure for Indonesian and English.

## Open Questions
1. **NextAuth Adapter**: The prompt mentions "NextAuth with Supabase adapter based on the Prisma schema". Since you are using Prisma to define the schema, I propose using the **Prisma Adapter** (`@auth/prisma-adapter` or `@next-auth/prisma-adapter`) which will connect to your Supabase Postgres database. Is this correct, or did you specifically want to use the `@auth/supabase-adapter` alongside Prisma?
2. **Middleware Naming**: `AGENTS.md` specifies `proxy.ts # Next.js middleware (must be in src/ root)`. Next.js inherently only recognizes `middleware.ts` or `middleware.js` in the root (or `src/` root). Should I implement the logic inside `src/proxy.ts` and re-export it from `src/middleware.ts` so Next.js picks it up?

## Proposed Changes

### 1. Dependencies
- Install `next-auth` and `@next-auth/prisma-adapter` (or `@auth/prisma-adapter` for v5).
- Install `bcryptjs` and `@types/bcryptjs` for password hashing (since we are doing credential-based RBAC, or if we use OAuth, please clarify. I will assume Credentials and/or OAuth).

### 2. Database Schema (`prisma/schema.prisma`)
- Add standard NextAuth models: `Account`, `Session`, `User`, `VerificationToken`.
- Update `User` model to include a `role` field (Enum: `SUPERADMIN`, `ADMIN`, `OPERATOR`).
- Re-run `npx prisma generate` and `npx prisma db push` to sync the Supabase database.

### 3. NextAuth Configuration
#### [NEW] `src/lib/auth.ts`
- Define NextAuth configuration options (`authOptions`).
- Setup the Prisma Adapter.
- Add callbacks to inject the user's `role` and `id` into the JWT and session.

#### [NEW] `src/app/api/auth/[...nextauth]/route.ts`
- Implement the Next.js App Router API route for NextAuth.

### 4. Next-Intl Setup
#### [NEW] `messages/id/common.json` & `messages/id/auth.json`
#### [NEW] `messages/en/common.json` & `messages/en/auth.json`
- Create the initial dictionary files.

#### [NEW] `src/i18n/request.ts`
- Setup the configuration for `next-intl` (loading messages based on locale).

#### [NEW] `src/i18n/routing.ts`
- Configure supported locales (`id`, `en`) and default locale (`id`).

#### [MODIFY] `next.config.ts`
- Wrap the Next.js config with `withNextIntl()`.

### 5. Middleware (`src/proxy.ts` & `src/middleware.ts`)
#### [NEW] `src/proxy.ts`
- Combine `next-intl` middleware and `next-auth` middleware to handle both authentication checks and locale routing simultaneously.
#### [NEW] `src/middleware.ts`
- Re-export the middleware from `proxy.ts` to satisfy Next.js conventions.

## Verification Plan
1. Test Next.js compilation after integrating `next-auth` and `next-intl`.
2. Inspect the Prisma Studio (`npx prisma studio`) to verify that the `User`, `Session`, and `Account` tables are successfully created in Supabase.
3. Manually verify routing logic (e.g., navigating to `/id` and `/en` resolves properly).
