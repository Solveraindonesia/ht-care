# Task Instruction Checklist

This checklist tracks the implementation of the HT-Care System based on `AGENTS.md` and the provided documentation.

## Phase 1: Setup & Foundations
- [x] Initialize Next.js, Tailwind, shadcn/ui.
- [x] Setup Prisma & Supabase DB connection.
- [ ] Implement NextAuth (RBAC: Superadmin, Admin, Operator).
- [ ] Setup `next-intl` for ID/EN localization.

## Phase 2: Core UI & Layout
- [ ] Build global `DashboardLayout` component (Sidebar, Top Navigation).
- [ ] Implement Dark Mode toggle (`next-themes`).
- [ ] Implement Language Switcher in the header.
- [ ] Setup base `Dashboard` page with mock metric cards.

## Phase 3: Master Data HT
- [ ] Create API Routes for HT CRUD operations.
- [ ] Implement `Data HT` page (Table view using shadcn/ui).
- [ ] Implement Add HT Modal/Form (Zod Validation).
- [ ] Implement Edit HT Modal/Form.
- [ ] Implement Delete HT confirmation.
- [ ] Implement View QR functionality for individual HT units.

## Phase 4: Master Data Peminjam (Borrowers)
- [ ] Create API Routes for Borrower CRUD operations.
- [ ] Implement `Data Peminjam` page (Table view).
- [ ] Implement Add/Edit/Delete Modals for Borrowers.

## Phase 5: Transactions
- [ ] Create API Routes for Borrow (Scan Pinjam) and Return (Scan Kembali).
- [ ] Build `Scan Pinjam` page:
  - Add QR Scanner Component.
  - Add Manual ID Input fallback.
  - Link scanned HT to a Borrower ID.
- [ ] Build `Scan Kembali` page:
  - Add QR Scanner Component.
  - Form to record current condition upon return (Baik/Rusak).

## Phase 6: Reporting & Settings
- [ ] Implement `Riwayat Log` page to display transaction history.
- [ ] Implement `Dashboard` real-time metrics (Total, Tersedia, Dipinjam, Rusak) using TanStack Query.
- [ ] Build Settings Menu (General, Profile, Change Password).

## Phase 7: Polish & Testing
- [ ] Write unit tests for HT condition and status update utilities.
- [ ] Ensure responsive design works on mobile view.
- [ ] Run final production build and deploy.
