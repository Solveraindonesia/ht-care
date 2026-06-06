# Deployment Guide

## 1. Hosting Environment
The primary target environment for HT-Care is **Vercel** (or any standard Node.js hosting that supports Next.js Server-Side Rendering and App Router).

## 2. Prerequisites
- A Vercel Account.
- A Supabase Project (for PostgreSQL database).
- GitHub repository access.

## 3. Environment Variables Setup
In the hosting platform's environment settings (e.g., Vercel Dashboard), you must configure the following keys identically to your local `.env`:
```text
NEXT_PUBLIC_APP_NAME="HT - Care"
NEXT_PUBLIC_APP_URL="https://your-production-url.com"

# Database variables
DATABASE_URL="postgresql://..." # Transaction connection pooler
DIRECT_URL="postgresql://..."   # Direct connection for migrations

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://your-production-url.com"
```

## 4. Build and Deployment Commands
- **Install command**: `npm install`
- **Build command**: `npx prisma generate && npx prisma migrate deploy && next build`
  - *Note: `migrate deploy` is preferred in production over `db push` to maintain a strict migration history.*
- **Output Directory**: `.next`

## 5. Post-Deployment Checks
1. Verify the Next.js API Routes are reachable.
2. Confirm NextAuth login works correctly with the production `NEXTAUTH_URL`.
3. Check database connection by fetching the Master Data HT table.
4. Test image/QR uploads to ensure Supabase Storage (if used) has correct permissions.
