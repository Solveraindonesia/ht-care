# Implementation Plan: Phase 2 (Core UI & Layout)

## Goal
Restructure the Next.js App Router to support `next-intl` localization, implement the global `DashboardLayout`, and create the Dark Mode Toggle and Language Switcher components.

## User Review Required
> [!IMPORTANT]
> **App Router Restructure**: To fully support `next-intl` localization, the standard Next.js approach is to wrap all application pages inside a `[locale]` folder (e.g., `src/app/[locale]/layout.tsx`). I will be moving/refactoring the existing `layout.tsx` and `page.tsx` to accommodate this.

## Proposed Changes

### 1. Application Routing & Providers
#### [NEW] `src/providers/index.tsx`
- Aggregate all necessary providers:
  - `ThemeProvider` (from `next-themes`)
  - `NextIntlClientProvider` (for translations on client components)
  - `SessionProvider` (for NextAuth session context)
  - `QueryProvider` (for TanStack React Query)

#### [MODIFY] `src/app/layout.tsx` & `src/app/page.tsx`
- Refactor the current root layout to `src/app/[locale]/layout.tsx`.
- Wrap the `children` inside the global `Providers` component.
- Move the root page to `src/app/[locale]/page.tsx` (which will redirect to `/dashboard` or `/auth/login` depending on session state).

### 2. Dashboard Layout
#### [NEW] `src/layouts/dashboard-layout.tsx`
- Build a responsive layout based on the UI mockups.
- **Sidebar (Left)**: Fixed navigation with links to `Dashboard`, `Data HT`, `Data Peminjam`, `Scan Pinjam`, etc.
- **Main Content (Right)**: Scrollable area with a top header.

### 3. Shared Header Components
#### [NEW] `src/components/shared/theme-toggle.tsx`
- A dropdown or button utilizing `useTheme` from `next-themes` to switch between Light, Dark, and System modes.

#### [NEW] `src/components/shared/language-switcher.tsx`
- A dropdown component using `useRouter` and `usePathname` from `src/i18n/routing` to switch between `id` and `en` locales smoothly.

#### [NEW] `src/components/shared/user-profile.tsx`
- Displays the currently logged-in user (from NextAuth session) and provides a Logout button.

### 4. Base Dashboard Page
#### [NEW] `src/app/[locale]/(dashboard)/dashboard/page.tsx`
- Create the initial dashboard view.
- Implement 4 mock Metric Cards (Total HT, Tersedia di Gudang, Sedang Dipinjam, HT Rusak) using the `shadcn/ui` `Card` component.

## Verification Plan
### Manual Verification
1. Verify the `/id/dashboard` and `/en/dashboard` routes render correctly without middleware errors.
2. Ensure the Dark Mode toggle changes the CSS variables dynamically.
3. Switch the language and verify that the UI text updates instantly based on the dictionaries.
4. Check responsiveness to ensure the sidebar collapses or is hidden on smaller screens (mobile-first approach).
