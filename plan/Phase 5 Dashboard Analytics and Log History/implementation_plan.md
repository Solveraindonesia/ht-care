# Phase 5: Dashboard Analytics and Log History (Riwayat Log)

Implement the Dashboard Analytics and Log History (Riwayat Log) modules. We will use the reference UI from the Stitch screen `ht-care Laporan & Analitik (Rounded)` for a premium, custom-designed Bento Grid layout with charts, styled tables, and export action blocks.

## User Review Required

> [!IMPORTANT]
> - **Stitch UI Reference Integration**: We will build the main Dashboard page to replicate the exact structure of the Stitch `Laporan & Analitik` screen:
>   - Page Header with date filter.
>   - Bento Grid featuring three analytical cards:
>     1. **Peminjaman (Monthly Trends)** with a smooth SVG line chart representation and percentage change.
>     2. **Distribusi Divisi (HT Usage by Dept)** with a pie chart visualization and a breakdown list (Security, Logistik, Teknik).
>     3. **Status Kondisi (Device Health)** with a vertical bar chart comparing "Baik" vs "Rusak" vs "Lainnya" (matching the updated condition options).
>   - A styled Recent Transactions table below the metrics.
>   - An Export Actions block at the bottom of the page.
> - **4 Summary Cards**: We will also integrate the requested 4 summary cards (Total HT, Available, Borrowed, Broken) at the top of the dashboard or inside a cohesive metrics section to display real-time numbers.

## Proposed Changes

### 1. Database & Types

#### [NEW] [dashboard.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/dashboard.ts)
- `DashboardMetrics` interface for stats counts:
  ```typescript
  export interface DashboardMetrics {
    total: number
    available: number
    borrowed: number
    broken: number
  }
  ```
- `DivisionDistribution` interface:
  ```typescript
  export interface DivisionDistribution {
    department: string
    count: number
    percentage: number
  }
  ```
- `DashboardData` wrapper:
  ```typescript
  export interface DashboardData {
    metrics: DashboardMetrics
    recentTransactions: TransactionHistoryItem[]
    divisionDistribution: DivisionDistribution[]
    monthlyTrends: { month: string; count: number }[]
  }
  ```

#### [MODIFY] [transaction.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/transaction.ts)
- Add `TransactionHistoryItem` interface:
  ```typescript
  export interface TransactionHistoryItem {
    id: string
    htCode: string
    brandType: string
    borrowerName: string
    borrowerCode: string
    department: string
    borrowTime: string
    returnTime: string | null
    status: TransactionStatus
  }
  ```

---

### 2. API Routes (`src/app/api/`)

#### [NEW] [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/dashboard/metrics/route.ts) — `GET /api/dashboard/metrics`
- Queries the database to calculate real-time analytics:
  - Metrics:
    - Total HT: count of all `hT_Item` records
    - Available: count where `status: 'AVAILABLE'`
    - Borrowed: count where `status: 'BORROWED'`
    - Broken: count where `condition` is `LIGHT_DAMAGE` or `HEAVY_DAMAGE`
  - Division Distribution: counts and calculates percentages of active borrows by `department`
  - Monthly Trends: last 6 months of transaction counts
- Returns the complete `DashboardData` payload.

#### [NEW] [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/history/route.ts) — `GET /api/transactions/history`
- Fetches all transactions from the database including `ht_item` and `borrower` relation models.
- Ordered by `createdAt` descending.
- Maps database records to `TransactionHistoryItem[]`.

---

### 3. Services & Hooks (`src/services/` & `src/hooks/`)

#### [NEW] [dashboard.service.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/services/dashboard.service.ts)
- `getDashboardData()`: calls `/api/dashboard/metrics`.

#### [MODIFY] [transaction.service.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/services/transaction.service.ts)
- Add `getTransactionHistory()`: calls `/api/transactions/history`.

#### [NEW] [use-dashboard.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/hooks/use-dashboard.ts)
- `useDashboardData()`: TanStack Query hook using query key `['dashboard-data']`.

#### [MODIFY] [use-transactions.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/hooks/use-transactions.ts)
- Add `useTransactionHistory()` hook using query key `['transaction-history']`.
- Update `useBorrowHt` and `useReturnHt` mutation success callbacks to invalidate `['dashboard-data']` and `['transaction-history']`.

---

### 4. Internationalization (i18n)

#### [MODIFY] [dashboard.json (id)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/dashboard.json) & [dashboard.json (en)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/dashboard.json)
- Add keys for the Stitch bento cards, table headers, and export block labels.

#### [MODIFY] [transaction.json (id)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/transaction.json) & [transaction.json (en)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/transaction.json)
- Add a nested `history` section for the Riwayat Log page.

---

### 5. Feature Components (`src/features/dashboard/`)

#### [NEW] [dashboard-metrics.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/dashboard/dashboard-metrics.tsx)
- Renders the 4 metrics cards with matching styles (Blue, Green, Orange, Red accents).

#### [NEW] [analytics-bento.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/dashboard/analytics-bento.tsx)
- Replicates the 3 Stitch bento cards using interactive/animated SVG/CSS charts:
  1. **Peminjaman Line Chart**: Renders a custom responsive SVG path using actual monthly counts, with high-quality gradients.
  2. **Distribusi Divisi Pie Chart**: Renders a circular donut chart representation with list legends showing real-time department usage stats.
  3. **Status Kondisi Bar Chart**: Renders 3 clean vertical bars representing: Good (Baik), Broken (Rusak), and Others (Lainnya).
- Support loading skeletons for visual continuity.

#### [NEW] [recent-transactions.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/dashboard/recent-transactions.tsx)
- Renders a table representing the latest transactions.
- Shows status badges (Green for `Returned`, Amber/Orange for `Borrowed`).
- Supports loading skeleton state.

#### [NEW] [export-actions.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/dashboard/export-actions.tsx)
- Renders the "Generate reports" block with PDF, Excel, and Print buttons exactly matching the Stitch UI design.

---

### 6. Pages (`src/app/(dashboard)/`)

#### [MODIFY] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/dashboard/page.tsx)
- Refactor to load dashboard data via `useDashboardData()` and render the components in the Stitch layout.

#### [NEW] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/riwayat-log/page.tsx)
- Complete transaction log history page.
- Utilizes `<DataTable>` to list all transactions.
- Columns: Transaction ID, HT Code, Brand / Type, Borrower, Borrow Time, Return Time, Status.

---

## Verification Plan

### Automated Verification
- Verify TypeScript compilation and linting:
  ```bash
  npm run build
  ```

### Manual Verification
1. Navigate to `/dashboard`:
   - Verify layout looks exactly like the Stitch Laporan & Analitik mock (curated bento grids, rounded corners, shadows).
   - Hover on charts/bars and verify micro-animations.
2. Navigate to `/riwayat-log`:
   - Verify logs table loads correctly with custom Status badges.
3. Test real-time invalidation:
   - Borrow/return an HT unit, and check if dashboard numbers and recent transaction logs update automatically.
