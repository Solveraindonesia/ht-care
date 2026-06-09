# Borrower Scan Requests & Admin Approval Workflow — Walkthrough

## Summary
Successfully implemented the complete **Borrower Scan-to-Request** and **Admin Approval/Rejection Workflow** consisting of:

1. **Database Schema Update**: Added the `TransactionRequest` table (mapped to `transaction_requests`) with `RequestType` (`BORROW`, `RETURN`) and `RequestStatus` (`PENDING`, `APPROVED`, `REJECTED`) enums. Added relative relation mappings to `HT_Item`, `Borrower`, and `User`.
2. **Robust Validation Schemas**: Created Zod validations in `src/schemas/request.schema.ts` to enforce constraints for request creation, rejection note requirement, and return condition selection.
3. **Restful Backend API Endpoints**:
   - `GET /api/requests`: Retrieves requests list. Restricts output to only personal requests if logged in as a borrower; returns all requests for admins/operators.
   - `POST /api/requests/borrow`: Permits borrowers to request borrowing an HT. Enforces single active request and single active loan constraints.
   - `POST /api/requests/return`: Permits borrowers to request returning their currently borrowed HT.
   - `POST /api/requests/[id]/approve`: Permits admins/operators to approve requests atomically using `prisma.$transaction`. Handles return condition updates for completed return requests.
   - `POST /api/requests/[id]/reject`: Permits admins/operators to reject requests with a mandatory reasoning note.
4. **Client-side Service & TanStack Query Hooks**: Integrated `src/services/request.service.ts` and `src/hooks/use-requests.ts` with auto-invalidation logic for dashboard statistics, log histories, and status pages.
5. **Route Protection & Middlewares**: Updated `src/proxy.ts` to protect `/borrower-requests` (the admin review page) from borrower access.
6. **Polished Frontend User Portals**:
   - **Admin Approvals Page (`/borrower-requests`)**: Sleek, tabbed view (Pending, Approved, Rejected, All) displaying detailed tables with colored type and status badges. Modals allow entering approval notes, selecting HT return conditions, or typing mandatory rejection reasons.
   - **Borrower Scanner Page (`/borrower/scan`)**: Multi-mode scanner (Camera/Manual) which dynamically adapts based on borrower's active loan status. If they have no active loan, they can scan to borrow; if they have one, it displays active loan details and prompts scanning to return.
   - **Borrower Requests Page (`/borrower/requests`)**: Lists all requests made by the borrower, showing status, operator name, request type, and feedback notes.
7. **Sidebars Navigation & Internationalization**: Added translation keys and layout items for both Indonesian (`id`) and English (`en`) sidebars and transaction files.

---

## Files Created & Modified

### Database Schema
- [prisma/schema.prisma](file:///c:/Experience/solveraid/ht-care/ht-care/prisma/schema.prisma) [MODIFY]: Added `TransactionRequest` model and `RequestType`, `RequestStatus` enums.

### Zod Validation Schemas & Types
- [src/types/request.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/request.ts) [NEW]: Declared request type definitions.
- [src/schemas/request.schema.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/schemas/request.schema.ts) [NEW]: Created request input schemas.

### Backend API Routes
- [src/app/api/requests/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/route.ts) [NEW]: GET requests list.
- [src/app/api/requests/borrow/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/borrow/route.ts) [NEW]: POST create borrow request.
- [src/app/api/requests/return/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/return/route.ts) [NEW]: POST create return request.
- [src/app/api/requests/[id]/approve/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/[id]/approve/route.ts) [NEW]: POST approve request with transactional updates.
- [src/app/api/requests/[id]/reject/route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/requests/[id]/reject/route.ts) [NEW]: POST reject request with reason.

### Client Services & State Hooks
- [src/services/request.service.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/services/request.service.ts) [NEW]: Service endpoints.
- [src/hooks/use-requests.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/hooks/use-requests.ts) [NEW]: TanStack Query hooks.

### Middleware & Navigation Layouts
- [src/proxy.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/proxy.ts) [MODIFY]: Added `/borrower-requests` route block.
- [src/layouts/dashboard-layout.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/layouts/dashboard-layout.tsx) [MODIFY]: Integrated admin approvals sidebar link.
- [src/layouts/borrower-layout.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/layouts/borrower-layout.tsx) [MODIFY]: Integrated borrower scan and requests status sidebar links.

### Frontend UI Pages
- [src/app/(dashboard)/borrower-requests/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/borrower-requests/page.tsx) [NEW]: Admin Request Approvals portal.
- [src/app/(borrower)/borrower/scan/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/scan/page.tsx) [NEW]: Borrower Scan portal.
- [src/app/(borrower)/borrower/requests/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(borrower)/borrower/requests/page.tsx) [NEW]: Borrower requests list.

### Localization Strings
- [messages/id/sidebar.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/sidebar.json) & [messages/en/sidebar.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/sidebar.json) [MODIFY]: Added translation keys.
- [messages/id/transaction.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/transaction.json) & [messages/en/transaction.json](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/transaction.json) [MODIFY]: Appended `request` block strings.

---

## Verification Results

- **Database Synchronization**: Successfully synced database schema using `npx prisma db push`.
- **TypeScript & Production Compilation**: Ran `npm run build` which successfully finished compiling in **3.7 minutes** with **zero TypeScript type check errors**.
- **Unified Scan Routing**: Tested dynamic states on the borrower scan portal (automatically presenting borrow scan or return scan actions matching active loans).
- **Admin Approvals & Reject Note Requirement**: Validated the approve/reject flow with optional return condition selection and required rejection feedback.
