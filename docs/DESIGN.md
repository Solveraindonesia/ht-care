# UI/UX & Design Guidelines

## 1. Design Philosophy
The HT-Care Dashboard follows a clean, modern, and highly legible aesthetic suitable for fast-paced administrative environments. The design prioritizes clear data presentation, quick actionable buttons, and immediate visual feedback for inventory statuses.

## 2. Core Libraries & Systems
- **Framework**: Tailwind CSS v4.
- **Component Library**: shadcn/ui.
- **Icons**: Lucide React.
- **Class Merging**: `clsx` and `tailwind-merge` via the `cn()` utility.

## 3. Layout Structure
Based on the dashboard mockups:
- **Sidebar (Left)**: Deep blue background (`#1e3a8a` or similar primary brand color), white text. Contains navigation links (Dashboard, Data HT, Data Peminjam, Scan Pinjam, etc.), grouped by sections (MASTER DATA, TRANSAKSI). Bottom area houses User Profile and Logout.
- **Main Content (Right)**: White background, soft rounded edges for cards and tables.
- **Header**: Page Title (e.g., "Master Data HT") alongside primary action buttons (e.g., "+" Add Button).

## 4. Visual Language & Badges
To quickly convey status, the system uses specific colored pill badges:
- **Condition (Kondisi)**:
  - `Baik` (Good): Green background, green check icon.
  - `Rusak` (Broken): Red background, red cross icon.
- **Status**:
  - `Tersedia` (Available): Green pill.
  - `Dipinjam` (Borrowed): Orange/Amber pill.
- **Action Buttons**: Circular icon buttons with soft background tints (Blue for view/QR, Yellow for edit, Red for delete).

## 5. Theming & Dark Mode
- **Support**: Application MUST fully support Light and Dark modes.
- **Implementation**: Utilizes `next-themes`.
- **CSS Variables**: Colors are defined as CSS variables (e.g., `--background`, `--foreground`, `--primary`) in `globals.css`. 
- **Rule**: Avoid hardcoding hex codes in components; always use Tailwind semantic classes (e.g., `bg-primary`, `text-destructive`).

## 6. Responsive Design
Mobile-first approach utilizing standard Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px (Tablet view - sidebar may collapse to icons)
- `lg`: 1024px (Standard desktop)
- `xl`: 1280px (Large screens)

## 7. UI Text & Localization
- **Rule**: NEVER hardcode UI strings.
- **Tool**: Use `next-intl` translation helpers (e.g., `t('dashboard.title')`).
- **Languages**: Indonesian (`id`) as default, English (`en`) as secondary.
