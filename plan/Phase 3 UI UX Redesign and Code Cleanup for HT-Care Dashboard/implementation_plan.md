# UI/UX Redesign and Code Cleanup for HT-Care Dashboard

This plan outlines the redesign of the HT Data and Borrower Data management pages to align with the "HT-Care Tactical Professional" design system from Stitch, as well as the creation of reusable components to clean up the code.

## User Review Required

> [!IMPORTANT]
> - I will modify the standard `table.tsx` from shadcn to use **zebra-striping** (striated lists) instead of row borders to match the Stitch design system.
> - I will create a reusable `DataTableContainer` component to wrap the tables, handling the Card styling, loading states, and empty states uniformly.

## Open Questions

> [!NOTE]
> - User confirmed: We will implement `@tanstack/react-table` for these tables.

## Proposed Changes

### 1. UI Adjustments (Stitch Design System)

According to the Stitch Design MD, the UI should use striated lists (zebra-striping), have soft rounded corners, and employ specific font sizes and weights for data.

#### [MODIFY] [table.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/components/ui/table.tsx)
- Update `TableRow` to remove `border-b` and apply `even:bg-muted/30 odd:bg-transparent` (or similar) to achieve zebra striping.
- Update `TableHead` to use sentence case with medium/bold weights (avoid uppercase), and match the typography scale `label-md` or `body-md` (Inter).
- Remove the outer borders from the table containers if any, focusing on the soft shadow `custom-shadow` from `globals.css`.

### 2. Reusable Components

Extract the duplicated table container, loading state, and empty state logic from the two master data pages into a shared reusable component.

#### [NEW] [data-table.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/components/shared/data-table.tsx)
- Create a reusable `DataTable` component using `@tanstack/react-table`.
- Accept `columns`, `data`, `isLoading`, and `searchKey` for standardizing the data presentation.
- Handle empty states and loading states natively within the table wrapper.

### 3. Tidy Up Master Data Pages

Refactor the feature components to use the new `DataTableLayout` and apply the design system's aesthetic guidelines (proper spacing, button variants, etc.).

#### [MODIFY] [borrower-master-data.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/%28dashboard%29/borrower-data/_components/borrower-master-data.tsx)
- Use `DataTable` with `@tanstack/react-table` columns definitions.
- Remove duplicated `isLoading` and `empty` checks from the table body.
- Ensure the Action buttons (Edit/Delete) use the correct ghost variants.

#### [MODIFY] [ht-master-data.tsx](file:///c:/Experience/solveraid/ht-care/ht-care/src/app/%28dashboard%29/ht-data/_components/ht-master-data.tsx)
- Use `DataTable` with `@tanstack/react-table` columns definitions.
- Remove duplicated `isLoading` and `empty` checks from the table body.
- Consolidate actions to look uniform.

## Verification Plan

### Manual Verification
- Run the Next.js development server.
- Verify that both `Borrower Data` and `HT Data` pages render properly with zebra-striped tables.
- Verify that Loading and Empty states still trigger properly.
- Confirm the new UI feels "Premium" and matches the soft shadows and styling expected.
