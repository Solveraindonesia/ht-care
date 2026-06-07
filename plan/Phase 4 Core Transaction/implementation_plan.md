# Phase 4: Core Transaction (Scan Pinjam & Scan Kembali)

Implement borrow and return transaction workflows with camera barcode scanning, manual input fallback, and strict business logic validation.

## User Review Required

> [!IMPORTANT]
> This plan introduces a **new package** (`html5-qrcode`) and creates **~20 new files** spanning API routes, types, schemas, services, hooks, feature components, pages, and i18n dictionaries. Please confirm before I proceed.

> [!WARNING]
> The `sonner` toast library is installed but not yet wired into the app. I will add `<Toaster />` to the root providers so toast notifications work globally.

## Open Questions

1. **Operator ID**: The `Transaction` model requires an `operator_id` (FK → User). Currently I'll pull the user ID from the NextAuth session. Is that correct, or should there be a separate operator selection?
2. **Available Borrowers**: The spec says "fetch only borrowers who DO NOT currently have an active borrowed HT". Should a borrower be able to borrow **multiple** HTs simultaneously, or strictly one at a time? I will implement **one at a time** per the spec.

---

## Proposed Changes

### 1. Dependency Installation

```bash
npm install html5-qrcode
```

---

### 2. Types (`src/types/`)

#### [NEW] [transaction.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/transaction.ts)
- `TransactionStatus` type (`'BORROWED' | 'RETURNED'`)
- `Transaction` interface (mapped from Prisma, with nested `htItem` and `borrower` info)
- `BorrowPayload` interface (`{ htId: string, borrowerId: string }`)
- `ReturnPayload` interface (`{ htCode: string, returnCondition: HtCondition }`)
- `ActiveTransaction` interface (enriched with HT and Borrower details for the return screen)

---

### 3. Zod Schemas (`src/schemas/`)

#### [NEW] [transaction.schema.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/schemas/transaction.schema.ts)
- `borrowSchema`: validates `{ htId: z.string(), borrowerId: z.string() }`
- `returnSchema`: validates `{ htCode: z.string(), returnCondition: z.enum(['GOOD', 'BROKEN']) }`

---

### 4. API Routes (`src/app/api/`)

#### [NEW] [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/borrowers/available/route.ts) — `GET /api/borrowers/available`
- Fetches borrowers who have **no** active transaction (`status: 'BORROWED'`).
- Uses Prisma `NOT` filter on the `transactions` relation.

#### [NEW] [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/ht/code/[code]/route.ts) — `GET /api/ht/code/:code`
- Finds an HT item by `ht_code` (or `barcode` as fallback).
- Returns the full HT item details.

#### [NEW] [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/active/[htCode]/route.ts) — `GET /api/transactions/active/:htCode`
- Finds the active transaction (`status: 'BORROWED'`) for a given HT code.
- Includes the HT item and Borrower relations.

#### [NEW] [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/borrow/route.ts) — `POST /api/transactions/borrow`
- Validates payload with `borrowSchema`.
- **Business logic**:
  1. Fetch the HT item. If `status !== 'AVAILABLE'`, return 400 error.
  2. Create a `Transaction` record (`status: BORROWED`, `borrow_time: now()`).
  3. Update `HT_Item.status` → `BORROWED`.
  4. Return the created transaction.
- Uses a Prisma `$transaction` for atomicity.

#### [NEW] [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/return/route.ts) — `POST /api/transactions/return`
- Validates payload with `returnSchema`.
- **Business logic**:
  1. Find the active transaction for the HT code. If none, return 400 error.
  2. Update the `Transaction` record (`status: RETURNED`, `return_time: now()`).
  3. Update `HT_Item.status` → `AVAILABLE` and `condition` → user-supplied value.
  4. Return the updated transaction.
- Uses a Prisma `$transaction` for atomicity.

---

### 5. Services (`src/services/`)

#### [NEW] [transaction.service.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/services/transaction.service.ts)
- `getHtByCode(code: string)`: `GET /api/ht/code/{code}`
- `getAvailableBorrowers()`: `GET /api/borrowers/available`
- `getActiveTransaction(htCode: string)`: `GET /api/transactions/active/{htCode}`
- `borrowHt(payload: BorrowPayload)`: `POST /api/transactions/borrow`
- `returnHt(payload: ReturnPayload)`: `POST /api/transactions/return`

All follow the existing pattern: axios → `unwrapApiResponse` → throw on error.

---

### 6. Hooks (`src/hooks/`)

#### [NEW] [use-transactions.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/hooks/use-transactions.ts)
- `useHtByCode(code: string)`: `useQuery` (enabled only when code is non-empty)
- `useAvailableBorrowers()`: `useQuery`
- `useActiveTransaction(htCode: string)`: `useQuery` (enabled only when code is non-empty)
- `useBorrowHt()`: `useMutation` → on success invalidates `['ht-items']`, `['borrowers']`, `['available-borrowers']`
- `useReturnHt()`: `useMutation` → on success invalidates `['ht-items']`, `['borrowers']`, `['available-borrowers']`

---

### 7. Feature Components (`src/features/transactions/`)

#### [NEW] [barcode-scanner.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/barcode-scanner.tsx)
- Wraps `html5-qrcode` in a `use client` component.
- Props: `onScanSuccess(code: string)`, `onScanError(error: string)`.
- Handles camera permission request flow.
- Includes start/stop controls.

#### [NEW] [scan-input.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/scan-input.tsx)
- Dual input UI: tab/toggle between "Camera" and "Manual Input".
- Camera tab renders `<BarcodeScanner>`.
- Manual tab renders an Input + Button for submitting an HT code.
- Calls `onCodeSubmit(code: string)` on either path.

#### [NEW] [borrow-form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/borrow-form.tsx)
- Displays HT info card (Code, Brand, Condition).
- Renders a `<Select>` dropdown populated by `useAvailableBorrowers()`.
- Submit button calls `useBorrowHt()` mutation.
- On success: toast success + reset scanner state.
- On failure: toast error.

#### [NEW] [return-form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/return-form.tsx)
- Displays active transaction card (HT Code, Brand, Borrower Name, Borrow Time).
- Renders a `<Select>` for return condition (`Baik` / `Rusak`).
- Submit button calls `useReturnHt()` mutation.
- On success: toast success + reset scanner state.
- On failure: toast error.

---

### 8. Pages (`src/app/(dashboard)/`)

#### [NEW] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/scan-pinjam/page.tsx)
- Orchestrates the Scan Pinjam workflow:
  1. `<ScanInput>` → receives HT code.
  2. `useHtByCode()` → fetches HT.
  3. IF HT is BORROWED → destructive toast, reset.
  4. IF HT is AVAILABLE → render `<BorrowForm>`.

#### [NEW] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/scan-kembali/page.tsx)
- Orchestrates the Scan Kembali workflow:
  1. `<ScanInput>` → receives HT code.
  2. `useActiveTransaction()` → fetches active transaction.
  3. IF no active transaction → destructive toast, reset.
  4. IF active → render `<ReturnForm>`.

---

### 9. Internationalization (`messages/`)

#### [NEW] [transaction.json (id)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/transaction.json) & [transaction.json (en)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/transaction.json)
- Keys for both Scan Pinjam & Scan Kembali:
  - `borrow.title`, `borrow.description`, `borrow.selectBorrower`, `borrow.submit`, `borrow.success`, `borrow.errorAlreadyBorrowed`, `borrow.errorGeneral`
  - `return.title`, `return.description`, `return.selectCondition`, `return.submit`, `return.success`, `return.errorNotBorrowed`, `return.errorGeneral`
  - `scanner.camera`, `scanner.manual`, `scanner.placeholder`, `scanner.submit`, `scanner.permissionDenied`, `scanner.startCamera`, `scanner.stopCamera`
  - `detail.htCode`, `detail.brandType`, `detail.condition`, `detail.status`, `detail.borrower`, `detail.borrowTime`

---

### 10. Global Wiring

#### [MODIFY] [layout.tsx or providers](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/layout.tsx)
- Add `<Toaster />` from `sonner` to the root layout so toast notifications work app-wide.

#### [MODIFY] i18n config
- Register the new `transaction` namespace in the `next-intl` message loading config.

---

## Verification Plan

### Automated Tests
```bash
npm run lint
npm run build
```

### Manual Verification
1. Navigate to `/scan-pinjam`:
   - Verify camera scanner requests permissions and reads barcodes.
   - Verify manual input fallback works.
   - Scan an AVAILABLE HT → confirm info card + borrower dropdown appears.
   - Scan a BORROWED HT → confirm destructive toast error appears.
   - Submit borrow → confirm HT status changes to BORROWED in the master data table.
2. Navigate to `/scan-kembali`:
   - Scan a BORROWED HT → confirm transaction details card + condition select appears.
   - Scan an AVAILABLE HT → confirm destructive toast error appears.
   - Submit return with "Rusak" → confirm HT status returns to AVAILABLE with condition BROKEN.
3. Verify i18n works for both ID and EN locales.
