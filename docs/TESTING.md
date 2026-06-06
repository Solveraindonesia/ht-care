# Testing Strategy

## 1. Overview
The testing approach for HT-Care is designed to ensure the stability of the core inventory logic, authentication flows, and data consistency. Testing prioritizes critical business operations over purely aesthetic UI rendering.

## 2. Tools & Frameworks
- **Unit & Integration Testing**: Vitest (Faster alternative to Jest, native ESM support).
- **Component Testing**: React Testing Library.
- **End-to-End (E2E)**: Playwright (Planned for future sprints).

## 3. Coverage Priorities
1. **Business Logic & Utilities (Highest Priority)**:
   - Status updates (e.g., HT changing from `Tersedia` to `Dipinjam`).
   - Condition updates (e.g., HT returning as `Rusak`).
   - Date and time formatting functions.
2. **API Endpoints & Database interactions**:
   - Ensure routes return standard `{ success, data, message }` payload.
   - Test happy paths and exact error handling (400, 401, 404, 500 status codes).
3. **UI Components (Medium Priority)**:
   - Reusable complex components (e.g., custom tables, forms with Zod validation).
   - Simple presentational components (buttons, badges) do not require extensive unit tests unless they contain heavy logic.

## 4. Writing Tests
- **Naming Convention**: Test files should be named `[name].test.ts` or `[name].test.tsx` and placed adjacent to the file they are testing or in a dedicated `__tests__` folder.
- **Mocking**: 
  - Mock Prisma calls for API tests.
  - Mock `next-intl` translation hooks in component tests to avoid missing string warnings.
  - Mock `next/navigation` hooks (useRouter) in client components.

## 5. CI/CD Integration
- Run `npm run lint` and `npm run test` on PR creation to prevent broken code from being merged into the `main` or `develop` branches.
