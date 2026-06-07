# Borrower Entity Refactoring, Login & Dashboard - Implementation Plan

Refactor the `Borrower` entity to support secure logins, configure NextAuth role-based access control, enforce middleware protections, and implement a dedicated, highly polished Borrower Dashboard with personal metrics, history, stats, and settings.

## User Review Required

> [!IMPORTANT]
> - **Unified Login Route**: Both Management (Admin/Operator) and Borrower users will share the unified `/login` page. The NextAuth `Credentials` provider will check the `User` table first, and fallback to checking the `Borrower` table, returning a role of `BORROWER` on success.
> - **Polymorphic Settings APIs**: The existing `/api/users/profile` and `/api/users/password` API routes will be updated to check the authenticated user's role. If the role is `BORROWER`, they will transparently read/write from the `Borrower` database table (updating `full_name` and password) rather than the `User` table. This allows the client-side `ProfileSettings` and `PasswordSettings` components to be reused seamlessly without modification.

## Open Questions

> [!NOTE]
> No outstanding questions exist. Database schemas and authentication flows are designed to be backwards-compatible with standard admin/operator dashboards.

## Proposed Changes

---

### 1. Database & Schema Updates

#### [MODIFY] [borrower.schema.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/schemas/borrower.schema.ts)
- Update `getBorrowerFormSchema(t, isEdit)` to validate `email` and conditionally validate `password` (required on create, optional with a minimum of 8 characters on edit).

#### [MODIFY] [form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/borrower-data/_components/form.tsx)
- Integrate form fields for `email` and `password`.
- Pass a conditional flag to the schema validation based on whether the form is in create or edit mode.

#### [MODIFY] [columns.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/borrower-data/_components/columns.tsx)
- Add the `email` column to the Borrower master data table.

---

### 2. Authentication, Redirects & Middleware

#### [MODIFY] [proxy.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/proxy.ts)
- Implement role-based route protection:
  - If role is `BORROWER`, block access to admin layouts (`/dashboard`, `/ht-data`, `/borrower-data`, etc.) and redirect them to `/borrower/dashboard`.
  - Block access to admin APIs (`/api/admin/...`, `/settings/admin/...`).
  - If role is non-borrower (e.g. `ADMIN`, `OPERATOR`), block access to `/borrower/...` paths and redirect to `/dashboard`.
  - Redirect already logged-in users away from `/login`.

#### [MODIFY] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/login/page.tsx)
- Update sign-in submission handler to fetch the session after credentials authorization and dynamically route borrowers to `/borrower/dashboard` and managers to `/dashboard`.

---

### 3. Settings & History API Routing Adaptations

#### [MODIFY] [profile route](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/users/profile/route.ts)
- Support updating the `Borrower` table (`full_name`) when the session user's role is `BORROWER`.

#### [MODIFY] [password route](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/users/password/route.ts)
- Support changing passwords on the `Borrower` table when the session user's role is `BORROWER`.

#### [MODIFY] [history route](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/history/route.ts)
- Filter returned transactions by `borrower_id` equal to the logged-in user's ID when the role is `BORROWER`.

---

### 4. Borrower Features, Dashboards & Layout

#### [NEW] [borrower-dashboard.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/borrower-dashboard.ts)
- Define types for borrower dashboard stats, recent transactions, and trends.

#### [NEW] [borrower-dashboard.service.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/services/borrower-dashboard.service.ts)
- Create Axios service fetching borrower metrics `/api/borrower/metrics`.

#### [NEW] [use-borrower-dashboard.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/hooks/use-borrower-dashboard.ts)
- Create TanStack Query hook calling the borrower metrics service.

#### [NEW] [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/borrower/metrics/route.ts)
- API endpoint calculating total borrowed, currently active, returned count, recent loans, and 6-month trends for the logged-in borrower.

#### [NEW] [borrower-layout.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/layouts/borrower-layout.tsx)
- Reusable page shell for borrowers featuring a collapsible sidebar, tooltips on hover, mobile slide-out sheets, header controls (language selector, theme toggle), and user profile widgets.

#### [NEW] [layout.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/layout.tsx)
- Standard Next.js route group layout referencing `<BorrowerLayout>`.

#### [NEW] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/dashboard/page.tsx)
- Main borrower page containing greetings, cards displaying personal borrowing statistics, and a listing of the 5 most recent transactions.

#### [NEW] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/history/page.tsx)
- Listing table showing all loans associated with the borrower, utilizing the existing DataTable component and filtering.

#### [NEW] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/stats/page.tsx)
- Analytical view displaying monthly borrowing trend charts (bar/line) representing borrower personal usage.

#### [NEW] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/settings/page.tsx)
- Reuses `GeneralSettings`, `ProfileSettings`, and `PasswordSettings` tabs.

---

### 5. Translation Keys

#### [MODIFY] [borrower.json (ID)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/borrower.json) & [borrower.json (EN)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/borrower.json)
- Add new translations for email/password fields and form validation.
- Add borrower dashboard specific text (welcome greetings, metrics cards, empty views, history titles).

#### [MODIFY] [sidebar.json (ID)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/sidebar.json) & [sidebar.json (EN)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/sidebar.json)
- Add new navigation keys representing Borrower menu links.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify standard type compilation and compilation consistency.

### Manual Verification
- Test `/login` with an admin account: verifies redirect to `/dashboard`.
- Test `/login` with a borrower account: verifies redirect to `/borrower/dashboard`.
- Verify middleware routes: Admin can't access `/borrower/...`, Borrower can't access `/dashboard` or management pages.
- Verify profile settings: updating a Borrower's name changes `full_name` in the database `Borrower` table and is correctly displayed.
