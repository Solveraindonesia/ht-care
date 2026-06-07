# Phase 4: Core Transaction — Walkthrough

## Summary
Implemented the **Scan Pinjam (Borrow)** and **Scan Kembali (Return)** transaction features with camera barcode scanning, manual input fallback, and strict business logic validation. Build passes cleanly.

---

## Files Created (20 files)

### Types & Schemas
| File | Purpose |
|---|---|
| [transaction.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/transaction.ts) | `Transaction`, `ActiveTransaction`, `BorrowPayload`, `ReturnPayload` types |
| [transaction.schema.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/schemas/transaction.schema.ts) | Zod v4 schemas for borrow & return validation |

### API Routes
| Route | File |
|---|---|
| `GET /api/borrowers/available` | [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/borrowers/available/route.ts) |
| `GET /api/ht/code/[code]` | [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/ht/code/%5Bcode%5D/route.ts) |
| `GET /api/transactions/active/[htCode]` | [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/active/%5BhtCode%5D/route.ts) |
| `POST /api/transactions/borrow` | [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/borrow/route.ts) |
| `POST /api/transactions/return` | [route.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/api/transactions/return/route.ts) |

### Service & Hooks
| File | Purpose |
|---|---|
| [transaction.service.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/services/transaction.service.ts) | Axios calls for all transaction endpoints |
| [use-transactions.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/hooks/use-transactions.ts) | TanStack Query hooks with cache invalidation |

### Feature Components
| File | Purpose |
|---|---|
| [barcode-scanner.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/barcode-scanner.tsx) | html5-qrcode camera wrapper with permission handling |
| [scan-input.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/scan-input.tsx) | Dual-mode input (Camera / Manual toggle) |
| [borrow-form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/borrow-form.tsx) | HT info card + borrower selector + mutation |
| [return-form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/return-form.tsx) | Transaction info card + condition selector + mutation |

### Pages
| File | Purpose |
|---|---|
| [scan-pinjam/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/%28dashboard%29/scan-pinjam/page.tsx) | Borrow workflow orchestrator |
| [scan-kembali/page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/%28dashboard%29/scan-kembali/page.tsx) | Return workflow orchestrator |

### i18n
| File | Purpose |
|---|---|
| [transaction.json (ID)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/transaction.json) | Indonesian translations |
| [transaction.json (EN)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/transaction.json) | English translations |

---

## Files Modified (2 files)

| File | Change |
|---|---|
| [providers/index.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/providers/index.tsx) | Added `<Toaster />` from sonner |
| [i18n/request.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/i18n/request.ts) | Registered `transaction` namespace |

---

## Business Logic

### Borrow Flow
1. Scan/input HT code → fetch HT by code
2. If HT is **BORROWED** → error toast, reset
3. If HT is **AVAILABLE** → show info card + borrower dropdown (only borrowers without active borrows)
4. Submit → atomic Prisma `$transaction`: create Transaction record + set HT status to BORROWED

### Return Flow
1. Scan/input HT code → fetch active transaction
2. If **no active transaction** → error toast, reset
3. If found → show transaction details + condition selector (Baik/Rusak)
4. Submit → atomic Prisma `$transaction`: update Transaction (RETURNED + return_time) + set HT status to AVAILABLE + update condition

---

## Verification

- ✅ `npm run build` — compiled successfully, TypeScript passed, all 10 routes registered
- ✅ Fixed Zod v4 API: `z.enum()` uses `message` instead of `required_error`
- ✅ Fixed render-loop bug: moved toast/setState into `useEffect` with ref guards
