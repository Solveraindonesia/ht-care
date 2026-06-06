# System Architecture

## 1. High-Level Architecture
HT - Care is built as a full-stack Next.js application using the App Router, combining server-side rendering for performance/SEO and client-side interactivity for dashboard functionality.

## 2. Technology Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: 
  - Client State: Zustand
  - Server/API State: TanStack React Query (v5)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma Client (@prisma/adapter-pg)
- **Authentication**: NextAuth.js
- **Form Handling & Validation**: React Hook Form + Zod
- **Internationalization**: next-intl

## 3. Directory Structure (Clean Architecture)
```text
src/
├── app/            # Next.js App Router (Pages, Layouts, API Routes)
├── components/     # UI Components
│   ├── ui/         # shadcn/ui generated components
│   └── shared/     # Reusable custom components
├── contexts/       # React Contexts (Theme, Locale, Session - for rarely changing state)
├── features/       # Feature-driven modules (e.g., dashboard, pos, inventory)
├── hooks/          # Custom React hooks (including TanStack Query wrappers)
├── layouts/        # Page layout wrappers
├── lib/            # External library initialization (Prisma client, Supabase client)
├── providers/      # Global Providers (QueryClientProvider, ThemeProvider, IntlProvider)
├── schemas/        # Zod validation schemas
├── services/       # External API calls / Axios instances
├── types/          # Global TypeScript interfaces and types
└── utils/          # Pure helper functions (formatters, constants)
```

## 4. Data Flow
1. **Client -> Server Interaction**:
   - The UI uses TanStack Query (`useQuery`, `useMutation`) via custom hooks located in `src/hooks/`.
   - These hooks call Axios functions located in `src/services/`.
   - The Axios functions make requests to Next.js API Routes in `src/app/api/...`.
2. **Server -> Database Interaction**:
   - Next.js API Routes utilize Prisma Client (`src/lib/prisma.ts`) to interact with the Supabase PostgreSQL database.
   - API endpoints always return a unified response format: `{ success: boolean, data: T | null, message: string }`.

## 5. Rendering Strategy
- **Server Components (RSC)**: Default approach for pages and layouts to minimize client JS bundle size.
- **Client Components (`use client`)**: Used strictly for interactive elements (buttons, forms, stateful widgets, hooks, browser APIs).

## 6. Error Handling
- Async functions are wrapped in `try-catch` blocks.
- Server errors return appropriate HTTP status codes without leaking sensitive stack traces.
- Client-side error handling is managed via TanStack Query's error states and displayed via UI components (e.g., `sonner` toasts).
