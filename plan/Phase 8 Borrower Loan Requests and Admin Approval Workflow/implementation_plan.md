# Implementation Plan - Borrower Loan Requests & Admin Approval Workflow

Implement a workflow allowing **Borrowers** to submit scan-borrow and scan-return requests, and **Admins/Operators** to approve or reject these requests with custom feedback/notes.

## User Review Required

> [!IMPORTANT]
> **Database Schema Changes**:
> This feature introduces a new `TransactionRequest` table (mapped to `transaction_requests`) to track request type, status, note, and operator. We will run `npx prisma db push` to apply these schema updates.

> [!NOTE]
> **Workflow Flow**:
> 1. **Borrower Scan**:
>    - If the borrower doesn't have an active loan: Scanner allows scanning an HT to request a **Borrow**.
>    - If the borrower has an active loan: Displays the current HT and allows scanning it to request a **Return**.
> 2. **Admin/Operator Action**:
>    - A new page is added under `/borrower-requests` in the dashboard to review and approve/reject requests.
>    - Approving a borrow validates availability and performs an atomic transaction (updates HT status to `BORROWED`, creates `Transaction` record, and sets request status to `APPROVED`).
>    - Approving a return updates the active transaction to `RETURNED`, updates the HT status to `AVAILABLE` (assigning the condition selected by the operator), and sets request status to `APPROVED`.
>    - Rejecting a request updates its status to `REJECTED` and requires/captures a feedback reason (`note`).
> 3. **Borrower View**:
>    - Borrowers can track their requests on a dedicated page `/borrower/requests`.

---

## Proposed Changes

### Database Schema

#### [MODIFY] [schema.prisma](file:///c:/Experience/solveraid/ht-care/ht-care/prisma/schema.prisma)
- Add `RequestType` (`BORROW`, `RETURN`) and `RequestStatus` (`PENDING`, `APPROVED`, `REJECTED`) enums.
- Add the `TransactionRequest` model with relations to `HT_Item`, `Borrower`, and `User` (operator).

---

### Type Definitions & Validation Schemas

#### [NEW] [request.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/request.ts)
- Define `TransactionRequest` interface, status enums, and request types.

#### [NEW] [request.schema.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/schemas/request.schema.ts)
- Create Zod schemas for:
  - Submitting a request (`createRequestSchema`).
  - Admin approval/rejection (`approveRequestSchema`, `rejectRequestSchema`).

---

### Backend API Routes

#### [NEW] [/api/requests/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/route.ts)
- `GET`: If logged in as borrower, return only requests belonging to the borrower. If admin/operator, return all requests. Supports pagination/filtering by status.

#### [NEW] [/api/requests/borrow/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/borrow/route.ts)
- `POST`: Validates HT and borrower, verifies borrower has no pending requests or active loans, and creates a `BORROW` request in `PENDING` status.

#### [NEW] [/api/requests/return/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/return/route.ts)
- `POST`: Validates HT and borrower, verifies borrower has an active loan matching the HT and no pending requests, and creates a `RETURN` request in `PENDING` status.

#### [NEW] [/api/requests/[id]/approve/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/[id]/approve/route.ts)
- `POST`/`PUT`: Authenticates as admin/operator. Atomically approves the request:
  - If borrow: creates a `Transaction` (borrowed) and updates HT status to `BORROWED`.
  - If return: completes the active `Transaction` (returned) and updates HT status to `AVAILABLE` + updates HT condition.
  - Updates request status to `APPROVED` with optional operator note.

#### [NEW] [/api/requests/[id]/reject/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/[id]/reject/route.ts)
- `POST`/`PUT`: Authenticates as admin/operator. Rejects the request, updating status to `REJECTED` and storing the operator's note.

---

### Client Service & State Hooks

#### [NEW] [request.service.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/services/request.service.ts)
- Implement Axios service endpoints for fetching and mutation requests.

#### [NEW] [use-requests.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/hooks/use-requests.ts)
- Create TanStack Query hooks for managing queries (`useRequests`) and mutations (`useCreateBorrowRequest`, `useCreateReturnRequest`, `useApproveRequest`, `useRejectRequest`).

---

### Middleware Router

#### [MODIFY] [proxy.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/proxy.ts)
- Protect the `/borrower-requests` path so that borrowers are blocked and redirected to `/borrower/dashboard`.

---

### Localization Strings

#### [MODIFY] [sidebar.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/sidebar.json) & [sidebar.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/sidebar.json)
- Add labels for the new sidebar items: `"borrowerRequests"` and `"borrowerScan"` for borrowers, and `"borrowerRequestsAdmin"` (Persetujuan HT) for admins.

#### [MODIFY] [transaction.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/transaction.json) & [transaction.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/transaction.json)
- Add new sub-blocks for validation, requests list columns, scan workflow, status pill labels, dialog headers, and error descriptions.

---

### Frontend UI Components & Pages

#### [MODIFY] [dashboard-layout.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/layouts/dashboard-layout.tsx)
- Add the "Persetujuan HT" sidebar navigation link under the `transaction` section.

#### [MODIFY] [borrower-layout.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/layouts/borrower-layout.tsx)
- Add "Scan HT" and "Status Pengajuan" navigation links under the `main` section.

#### [NEW] [borrower-requests/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/borrower-requests/page.tsx) (Admin Portal)
- Admin portal to review pending requests. Shows lists and details.
- Modal dialogs for Approval (with return condition select for returns) and Rejection (with required feedback field).

#### [NEW] [borrower/scan/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/scan/page.tsx) (Borrower Scan Portal)
- Check active loan status.
- Show scanner for HT code.
- Provide "Submit Request" actions to easily send requests.

#### [NEW] [borrower/requests/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/requests/page.tsx) (Borrower Request Portal)
- Displays table/list of requests submitted by the logged-in borrower with their current status, notes, dates, and operator names.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm TypeScript compilation passes without errors.
- Run `npm run lint` to confirm codebase is clean.

### Manual Verification
- Log in as a borrower:
  - Verify access to `/borrower/scan` and `/borrower/requests`.
  - Scan/request to borrow an HT unit; verify it creates a pending request in `/borrower/requests`.
- Log in as an admin:
  - Verify access to `/borrower-requests`.
  - Verify ability to view pending requests, reject one with a note, and approve another with an optional note.
  - Check that approved requests update the HT status and transaction records.
- Verify status changes reflect immediately on the borrower request status page.
