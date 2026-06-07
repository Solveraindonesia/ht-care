# Redesign Dashboard Page - Implementation Plan

The goal is to redesign the main dashboard page (`src/app/(dashboard)/dashboard/page.tsx`) to make it look premium, modern, and user-friendly, utilizing real-time dynamic data.

## Proposed Changes

We will restructure the dashboard page to load data from the `useReportData` query hook and present it using a modern layout following the design system tokens.

### 1. Translation System updates

#### [MODIFY] [report.json (id)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/report.json)
#### [MODIFY] [report.json (en)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/report.json)
Add translation keys for dashboard quick actions, section titles, and action descriptions:
- `dashboard.quickActions`: "Aksi Cepat" / "Quick Actions"
- `dashboard.viewAll`: "Lihat Semua" / "View All"
- `dashboard.scanBorrowTitle`: "Scan Pinjam" / "Scan Borrow"
- `dashboard.scanBorrowDesc`: "Pinjamkan unit HT dengan memindai QR Code." / "Issue an HT device to a borrower by scanning its QR code."
- `dashboard.scanReturnTitle`: "Scan Kembali" / "Scan Return"
- `dashboard.scanReturnDesc`: "Kembalikan unit HT ke gudang dan verifikasi kondisi." / "Return an HT device to the inventory and check its condition."
- `dashboard.addHtTitle`: "Tambah HT" / "Add HT"
- `dashboard.addHtDesc`: "Daftarkan unit HT baru ke sistem inventaris." / "Register a new HT device to the inventory database."
- `dashboard.addBorrowerTitle`: "Tambah Peminjam" / "Add Borrower"
- `dashboard.addBorrowerDesc`: "Daftarkan borrower/peminjam baru dari divisi." / "Register a new borrower from their respective department."

---

### 2. Dashboard Components

#### [NEW] [dashboard-actions.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/dashboard/_components/dashboard-actions.tsx)
Create a quick actions component with cards for Scan Pinjam, Scan Kembali, Tambah HT, and Tambah Peminjam.
- Use Lucide icons (`ScanLine`, `History`, `PlusCircle`, `UserPlus`).
- Apply premium hover states, HSL color tokens, and smooth CSS transitions.

#### [NEW] [dashboard-charts.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/dashboard/_components/dashboard-charts.tsx)
A dedicated dashboard chart component containing:
- **Trend Peminjaman**: SVG line chart based on `monthlyTrends`.
- **Distribusi Divisi**: SVG donut chart showing proportion of active loans by department.
- Clean design with soft backgrounds, gradients, tooltips/legend, and full light/dark mode support.

#### [MODIFY] [page.tsx (dashboard)](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/dashboard/page.tsx)
Refactor the main dashboard page:
- Replace static mock components with the `useReportData` hook.
- Use `<DashboardMetrics>` for dynamic stats.
- Embed `<DashboardActions>` for quick shortcuts.
- Embed `<DashboardCharts>` for trends & division distribution.
- Render dynamic `<RecentTransactions>` table with a "Lihat Semua" button linking to `/riwayat-log`.
- Handle loading skeletons and error alert states gracefully.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify that Next.js static page generation and type checking compile successfully without any error.

### Manual Verification
- Verify that statistics reflect the actual number of devices in the database.
- Confirm quick action buttons correctly navigate to their target paths.
- Check that the recent transactions table updates immediately after scanning a borrow or return.
- Test responsiveness and theme switching between Light and Dark modes.
