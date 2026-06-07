# Add New HT Condition Options

Expand HT condition selections from just `GOOD` and `BROKEN` to support a richer set of conditions: Good (Baik), Light Damage (Rusak Ringan), Heavy Damage (Rusak Berat), Lost (Hilang), and Others (Lainnya).

## User Review Required

> [!IMPORTANT]
> - This requires updating the Prisma schema `HTCondition` enum and migrating the database.
> - We have already temporarily migrated the single existing `BROKEN` item in the database to `GOOD` to avoid database migration conflicts.
> - New conditions will be mapped to clean English constants in code (`LIGHT_DAMAGE`, `HEAVY_DAMAGE`, `LOST`, `OTHER`) and translated dynamically in UI.

## Proposed Changes

### 1. Database Schema

#### [MODIFY] [schema.prisma](file:///c:/Experience/solveraid/ht-care/ht-care/prisma/schema.prisma)
- Update `HTCondition` enum:
  ```prisma
  enum HTCondition {
    GOOD
    LIGHT_DAMAGE
    HEAVY_DAMAGE
    LOST
    OTHER
  }
  ```

---

### 2. Frontend Types & Validation

#### [MODIFY] [ht.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/types/ht.ts)
- Update `HT_CONDITIONS` array to include all five values:
  ```typescript
  export const HT_CONDITIONS = ['GOOD', 'LIGHT_DAMAGE', 'HEAVY_DAMAGE', 'LOST', 'OTHER'] as const
  ```

#### [MODIFY] [transaction.schema.ts](file:///c:/Experience/solveraid/ht-care/ht-care/src/schemas/transaction.schema.ts)
- Update `returnSchema` to allow all five conditions:
  ```typescript
  export const returnSchema = z.object({
    htCode: z.string().min(1, 'HT Code is required.'),
    returnCondition: z.enum(['GOOD', 'LIGHT_DAMAGE', 'HEAVY_DAMAGE', 'LOST', 'OTHER'], {
      message: 'Return condition is required.'
    })
  })
  ```

---

### 3. Internationalization (i18n)

#### [MODIFY] [ht.json (id)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/ht.json)
- Add new translations in `condition` key:
  ```json
  "condition": {
    "good": "Baik",
    "light_damage": "Rusak Ringan",
    "heavy_damage": "Rusak Berat",
    "lost": "Hilang",
    "other": "Lainnya"
  }
  ```

#### [MODIFY] [ht.json (en)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/ht.json)
- Add new translations in `condition` key:
  ```json
  "condition": {
    "good": "Good",
    "light_damage": "Light Damage",
    "heavy_damage": "Heavy Damage",
    "lost": "Lost",
    "other": "Other"
  }
  ```

#### [MODIFY] [transaction.json (id)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/id/transaction.json)
- Update tip message for returning conditions:
  ```json
  "returnTip": "Pilih kondisi HT saat pengembalian (Baik, Rusak Ringan, Rusak Berat, Hilang, dll)."
  ```

#### [MODIFY] [transaction.json (en)](file:///c:/Experience/solveraid/ht-care/ht-care/messages/en/transaction.json)
- Update tip message for returning conditions:
  ```json
  "returnTip": "Select the HT condition upon return (Good, Light Damage, Heavy Damage, Lost, etc)."
  ```

---

### 4. UI Components

#### [MODIFY] [status-badge.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/components/shared/status-badge.tsx)
- Redesign `HtConditionBadge` to render a unique color palette and icon for each condition:
  - `GOOD`: Green badge + CheckCircle2 icon
  - `LIGHT_DAMAGE`: Amber/Orange badge + AlertTriangle icon
  - `HEAVY_DAMAGE`: Red badge + CircleX icon
  - `LOST`: Purple badge + EyeOff icon
  - `OTHER`: Slate/Gray badge + HelpCircle icon

#### [MODIFY] [return-form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/return-form.tsx)
- Render the dropdown select items by mapping over `HT_CONDITIONS` dynamically:
  ```typescript
  {HT_CONDITIONS.map((cond) => (
    <SelectItem key={cond} value={cond}>
      {tHt(`condition.${cond.toLowerCase()}`)}
    </SelectItem>
  ))}
  ```

#### [MODIFY] [borrow-form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/features/transactions/borrow-form.tsx)
- Dynamically translate the condition label using `tHt(`condition.${htItem.condition.toLowerCase()}`)`.

#### [MODIFY] [form.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/ht-data/_components/form.tsx)
- Render the dropdown select items by mapping over `HT_CONDITIONS` dynamically.

#### [MODIFY] [columns.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/ht-data/_components/columns.tsx)
- Dynamically translate the condition label.

#### [MODIFY] [page.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/(dashboard)/ht-data/page.tsx)
- Dynamically fetch the condition translation in the search filter:
  ```typescript
  t(`condition.${item.condition.toLowerCase()}`)
  ```

---

## Verification Plan

### Automated Verification
- Run DB Migration: `npx prisma migrate dev --name add_condition_options` or push changes.
- Verify TypeScript compilation and linting:
  ```bash
  npm run lint
  npm run build
  ```

### Manual Verification
1. Navigate to **Master Data HT** (`/ht-data`):
   - Click "Tambah HT" or "Edit HT" and verify the condition dropdown contains all 5 options.
   - Save an item with "Rusak Ringan" and verify the new Amber badge is rendered properly.
   - Search for "Rusak Ringan" in the search box; confirm filtering works.
2. Navigate to **Scan Kembali** (`/scan-kembali`):
   - Scan an active borrowed HT.
   - Verify the return condition dropdown contains all 5 options.
   - Select "Hilang" and submit return; verify the HT item status returns to AVAILABLE and condition updates to `LOST` in master data.
