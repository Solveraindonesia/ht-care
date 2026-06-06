# Documentation Generation Walkthrough

I have successfully generated all the requested documentation files to assist with the HT-Care website creation process. These files were created based on the technical rules provided in `AGENTS.md`, the tech stack (`package.json`), and the features observed in the dashboard mockups.

## What was created

All files are located in the `docs/` directory:

1. **[PRD.md](file:///c:/Experience/solveraid/ht-care/ht-care/docs/PRD.md)**: Product Requirements Document outlining the core features, target users, and key workflows (Dashboard, Master Data, Scanning, Logs).
2. **[ARCHITECTURE.md](file:///c:/Experience/solveraid/ht-care/ht-care/docs/ARCHITECTURE.md)**: Details the Next.js 16 setup, Clean Architecture folder structure, TanStack Query integration, and component rendering strategy.
3. **[DATABASE.md](file:///c:/Experience/solveraid/ht-care/ht-care/docs/DATABASE.md)**: Proposes the Prisma/Supabase schema for Users, HT_Items, Borrowers, and Transactions, mapping exactly to the fields in the mockups.
4. **[DESIGN.md](file:///c:/Experience/solveraid/ht-care/ht-care/docs/DESIGN.md)**: Translates the visual elements from the screenshots into Tailwind/shadcn guidelines, standardizing condition badges (Green/Red/Amber).
5. **[SECURITY.md](file:///c:/Experience/solveraid/ht-care/ht-care/docs/SECURITY.md)**: Establishes rules for NextAuth RBAC, Environment Variable protection, and Zod input validation.
6. **[TESTING.md](file:///c:/Experience/solveraid/ht-care/ht-care/docs/TESTING.md)**: Defines the Vitest/React Testing Library strategy, prioritizing critical business logic over generic UI components.
7. **[DEPLOYMENT.md](file:///c:/Experience/solveraid/ht-care/ht-care/docs/DEPLOYMENT.md)**: Outlines the deployment workflow (e.g., on Vercel), highlighting necessary `.env` variables and Prisma migration commands.
8. **[TASK_INSTRUCTION.md](file:///c:/Experience/solveraid/ht-care/ht-care/docs/TASK_INSTRUCTION.md)**: An actionable, step-by-step checklist based on `AGENTS.md` to track implementation progress.

## Validation

> [!NOTE]
> All guidelines within these documents strictly adhere to your rules: no hardcoded strings (using `next-intl`), explicit type-safety, usage of `axios` with React Query, and Tailwind usage.

You can now use `docs/TASK_INSTRUCTION.md` as your roadmap for the upcoming development phases.
