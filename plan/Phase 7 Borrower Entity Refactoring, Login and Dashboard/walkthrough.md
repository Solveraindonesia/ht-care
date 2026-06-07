# Phase 7: Borrower Entity, Login & Dashboard — Walkthrough

## Summary
Successfully implemented the **Borrower Ecosystem** consisting of:
1. **Model & Validation Update**: Updated the `Borrower` model to support email and hashed passwords. Integrated these validation requirements into the client and server Zod schemas.
2. **Unified Credentials Auth**: NextAuth Credentials provider checks both the `User` and `Borrower` tables, returning the custom `'BORROWER'` role string when a borrower logs in.
3. **Middleware Protections (RBAC)**: NextAuth middleware restricts routing:
   - Authenticated borrowers are redirected from `/login` and admin paths directly to `/borrower/dashboard`.
   - Admin/Operators are redirected away from borrower portal paths (`/borrower/...`) directly to `/dashboard`.
   - Restricts borrower access to admin APIs.
4. **Polymorphic Settings APIs**: Transparently handles profile name and password updates on the `Borrower` database table when a borrower updates their settings.
5. **Borrower Portal Views**:
   - **Borrower Layout**: Highly polished, collapsible sidebar navigation matching the premium "ht-care" theme, complete with tooltips and responsive mobile menus.
   - **Dashboard**: Greeting banner showing metrics cards for personal loan history and the 5 most recent transactions.
   - **Loan History**: Filterable list of all personal loan transactions.
   - **Statistics**: Visual SVG monthly usage trend chart.
   - **Settings**: Fully reuses general, profile, and password subcomponents.

---

## Files Created & Modified

### Zod Validation Schemas
- [src/schemas/borrower.schema.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/schemas/borrower.schema.ts) [MODIFY]: Added email/password requirements using Zod v4 2-argument definitions for accurate type inference.

### Authentication & Router Middlewares
- [src/lib/auth.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/lib/auth.ts) [MODIFY]: Falls back to the `Borrower` table on check failure in the `User` table, returning a `BORROWER` role.
- [src/proxy.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/proxy.ts) [MODIFY]: Implemented role-based redirections and route restrictions.
- [src/app/login/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/login/page.tsx) [MODIFY]: Uses `getSession` to check authenticated role and routes to correct dashboard space.

### API Routes & Settings Polymorphism
- [src/app/api/users/profile/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/users/profile/route.ts) [MODIFY]: Updates borrower `full_name` if user is a borrower.
- [src/app/api/users/password/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/users/password/route.ts) [MODIFY]: Updates borrower password using `bcryptjs` compare/hash on borrower table.
- [src/app/api/transactions/history/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/history/route.ts) [MODIFY]: Filters records by `borrower_id` when caller is a borrower.
- [src/app/api/borrower/metrics/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/borrower/metrics/route.ts) [NEW]: Computes stats, recent logs, and trend counts for the authenticated borrower.

### Client Services & State Hooks
- [src/types/borrower-dashboard.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/borrower-dashboard.ts) [NEW]: Borrower portal dashboard types.
- [src/services/borrower-dashboard.service.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/services/borrower-dashboard.service.ts) [NEW]: Service layer calling `/api/borrower/metrics`.
- [src/hooks/use-borrower-dashboard.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/hooks/use-borrower-dashboard.ts) [NEW]: TanStack Query hook calling metrics service.

### Borrower Layout & Pages
- [src/layouts/borrower-layout.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/layouts/borrower-layout.tsx) [NEW]: Sidebar and top bar shell.
- [src/app/(borrower)/layout.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/layout.tsx) [NEW]: Layout routing wrapper.
- [src/app/(borrower)/borrower/dashboard/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/dashboard/page.tsx) [NEW]: Summary metrics cards and recent transaction tables.
- [src/app/(borrower)/borrower/history/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/history/page.tsx) [NEW]: Personal transaction list.
- [src/app/(borrower)/borrower/stats/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/stats/page.tsx) [NEW]: Personal monthly usage trend SVG line graph.
- [src/app/(borrower)/borrower/settings/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/settings/page.tsx) [NEW]: Reuses general, profile, and password settings tab contents.

### Master Data UI Refinements
- [src/app/(dashboard)/borrower-data/_components/form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/borrower-data/_components/form.tsx) [MODIFY]: Added email and password form fields.
- [src/app/(dashboard)/borrower-data/_components/columns.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/borrower-data/_components/columns.tsx) [MODIFY]: Added the email column to the data table.
- [src/components/shared/master-data-header.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/components/shared/master-data-header.tsx) [MODIFY]: Made `addLabel` and `onAdd` optional to enable reuse on search/history pages.

### Localization & Sidebar Configs
- [messages/id/sidebar.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/sidebar.json) & [messages/en/sidebar.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/sidebar.json) [MODIFY]: Added borrower navigation key mappings.
- [messages/id/borrower.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/borrower.json) & [messages/en/borrower.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/borrower.json) [MODIFY]: Added new validation, fields, columns, and borrower dashboard texts.

---

## Verification Results
- **Polymorphism Verification**: Profile and password settings updates route correctly through `/api/users/profile` and `/api/users/password` to either the `User` or `Borrower` table depending on the caller's role.
- **Unified Login redirection**: Borrower login routes to `/borrower/dashboard` while management login goes to `/dashboard`.
- **Middleware Security**: Non-borrower routes are completely isolated from borrowers.
- **Visual Design**: Dark mode and light mode visual elements rendering perfectly.
