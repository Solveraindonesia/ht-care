# Redesign UI to Match Stitch Mockups

This plan outlines the steps to overhaul the UI of the HT-Care application to match the modern, professional design system generated via the Stitch MCP.

## Open Questions

> [!IMPORTANT]
> **Iconography:** The Stitch designs use `Material Symbols Outlined` via Google Fonts. However, the current project uses `lucide-react` (which is standard for `shadcn/ui`). Should we switch entirely to Material Symbols, or adapt the design to use the existing Lucide icons while matching the overall layout and colors? (I recommend sticking to Lucide to ensure seamless `shadcn/ui` integration, but I can switch if you prefer).

> [!WARNING]
> **Image Assets:** The Stitch login screen uses a specific hosted background image (`https://lh3.googleusercontent.com/aida/...`). Should I download this image and serve it locally from the `public` folder, or just use the external URL for now?

## Proposed Changes

### 1. Global Styling & Design Tokens
We need to import the Material Design 3 (M3) colors and fonts specified in the Stitch HTML.

#### [MODIFY] `src/app/globals.css`
- Add Google Fonts imports for `Inter` and `Material Symbols Outlined` (if approved).
- Define custom CSS variables for the color tokens (`--color-primary`, `--color-surface-container`, etc.) based on the Stitch config.
- Add utility classes like `.custom-shadow` (`box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05)`).

### 2. Login Page Redesign
The login page will be updated to a full-screen glassmorphic design over a corporate blue photographic background.

#### [MODIFY] `src/app/auth/login/page.tsx`
- Apply the background image and linear gradient overlay.
- Update the login card to use backdrop blur (`backdrop-filter: blur(16px)`), semi-transparent borders, and white text.
- Update inputs to have the floating icon look from the mockups.
- *Note: We will maintain the existing `next-auth` dynamic logic and `next-intl` translations.*

### 3. Dashboard Layout Redesign
The main application shell needs to reflect the new sidebar and header aesthetics.

#### [MODIFY] `src/layouts/dashboard-layout.tsx`
- **Sidebar:** Update background to `--color-sidebar` (`#1e3a8a`), change text to white/transparent white, and add the rounded hover states with left-border indicators for active items.
- **Header:** Implement the clean white (`surface-dim`) sticky header with search bar (mockup), notification/help icons, and user avatar.

### 4. Dashboard Page Redesign
The dashboard content will be updated to match the Stitch "Dashboard Utama".

#### [MODIFY] `src/app/(dashboard)/dashboard/page.tsx`
- **Stats Grid:** Update the 4 metric cards to use `surface-container-lowest` with specific left-border colors (Primary, Green, Orange, Red) and matching custom shadows.
- **Quick Actions:** Implement the two horizontal cards for "Scan QR Peminjaman" and "Scan QR Pengembalian" with the camera permission buttons.
- **Inventory Table:** Style the table to match the clean, rounded look with specific row hover colors (`surface-bright`).

## Verification Plan

### Automated Tests
- Run `npm run build` and `npm run lint` to ensure Tailwind classes are correctly parsed and no TypeScript errors are introduced.

### Manual Verification
- Start `npm run dev`.
- Verify the Login Page renders the glassmorphic card and background image.
- Verify the Dashboard Layout sidebar matches the new deep blue aesthetic.
- Verify the Dashboard stat cards and tables match the rounded, shadow-styled design from Stitch.
- Ensure Dark Mode still functions or degrades gracefully based on the new tokens.
