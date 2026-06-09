# Task Tracker — Borrower Scan Requests & Admin Approval Workflow

- `[x]` Update database schema (`prisma/schema.prisma`)
- `[x]` Run `npx prisma db push` to sync database schema
- `[x]` Create request types and schemas (`src/types/request.ts` & `src/schemas/request.schema.ts`)
- `[x]` Implement backend API routes (`src/app/api/requests/...`)
  - `[x]` `/api/requests` (GET requests list)
  - `[x]` `/api/requests/borrow` (POST create borrow request)
  - `[x]` `/api/requests/return` (POST create return request)
  - `[x]` `/api/requests/[id]/approve` (POST approve request)
  - `[x]` `/api/requests/[id]/reject` (POST reject request)
- `[x]` Implement Axios service and TanStack Query hooks (`src/services/request.service.ts` & `src/hooks/use-requests.ts`)
- `[x]` Update route protection in middleware (`src/proxy.ts`)
- `[x]` Update translations (`messages/id/sidebar.json`, `messages/en/sidebar.json`, `messages/id/transaction.json`, `messages/en/transaction.json`)
- `[x]` Add sidebar links in layout components (`src/layouts/dashboard-layout.tsx` & `src/layouts/borrower-layout.tsx`)
- `[x]` Build Admin Request Review portal (`src/app/(dashboard)/borrower-requests/page.tsx`)
- `[x]` Build Borrower Scan portal (`src/app/(borrower)/borrower/scan/page.tsx`)
- `[x]` Build Borrower Requests Status portal (`src/app/(borrower)/borrower/requests/page.tsx`)
- `[x]` Run verification: `npm run build` and `npm run lint`
