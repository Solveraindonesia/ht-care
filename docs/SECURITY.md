# Security Best Practices

## 1. Authentication
- **System**: NextAuth.js is used to handle secure session management.
- **Sessions**: JWT-based session strategy should be utilized.
- **Middleware**: Next.js Middleware (`src/proxy.ts` or `src/middleware.ts`) enforces authentication checks on all protected routes. Unauthenticated users must be redirected to the login page.

## 2. Role-Based Access Control (RBAC)
- **Roles Defined**: Superadmin, Admin, Operator.
- **Enforcement**: Middleware and Server Components must verify the user's role before rendering sensitive data or allowing mutations. API Routes must validate the role before processing requests.
  - *Superadmin*: Full system access, manage other admins.
  - *Admin*: Manage Master Data, view all logs.
  - *Operator*: Primarily handles Scan Pinjam and Scan Kembali functions.

## 3. Data Protection & Secrets
- **API Keys**: Supabase service role keys (`SUPABASE_SERVICE_ROLE_KEY`) and Database URLs must NEVER be prefixed with `NEXT_PUBLIC_` and must NEVER reach the client bundle.
- **Environment**: Keep `.env` out of version control (`.gitignore` must include `.env`).
- **Database Rules**: Even though Prisma abstracts database interactions on the server, Supabase Row Level Security (RLS) policies should be configured as an additional safety net to prevent unauthorized direct database access.

## 4. Input Validation
- **Library**: Zod.
- **Rule**: All incoming data from client forms to API routes MUST be validated using a Zod schema before hitting the database. Do not trust client-side validation alone.

## 5. Error Handling & Logging
- **Information Leakage**: API routes must catch errors and return generic error messages (e.g., "Internal Server Error") to the client. Stack traces or raw Prisma error messages MUST NOT be exposed in production.
- **Sanitization**: Ensure inputs are sanitized by Prisma/React to prevent SQL Injection and XSS attacks.
