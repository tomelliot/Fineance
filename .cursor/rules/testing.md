# Testing Guidelines

If you are an LLM or agent, use `bun run test:agent` instead of `bun test` to prevent Vitest from running indefinitely in watch mode, so you can access the output and continue processing.

1. Use Vitest as the testing framework
   - Use `vi.fn()` instead of `jest.fn()`
   - Use `vi.mock()` instead of `jest.mock()`
   - Use `vi.spyOn()` instead of `jest.spyOn()`
   - Use `vi.clearAllMocks()` instead of `jest.clearAllMocks()`
   - Use `toBeDefined()` instead of `toBeInTheDocument()`
   - Import from 'vitest': `import { expect, vi } from 'vitest'`

2. Place test files in `__tests__` directory adjacent to the file being tested
3. Use `.test.ts` or `.test.tsx` extension for test files
4. Follow describe/it pattern for test organization
5. Use descriptive test names that explain the expected behavior
6. Mock external dependencies and complex objects
7. Test both success and error cases
8. Keep tests focused and atomic
9. Tests should have only one assert
10. Tests should be 10 - 20 lines long
11. Use beforeEach for common setup
12. Include type checking in TypeScript tests
13. Common Test Patterns
    - Use `vi.clearAllMocks()` in `beforeEach` blocks
    - Provide complete mock data including all required fields
    - Use test helper functions for common rendering patterns
    - Test component states: initial, loading, success, error
    - Test user interactions using `fireEvent` or `userEvent`
