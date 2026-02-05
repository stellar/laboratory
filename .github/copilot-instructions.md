# GitHub Copilot Instructions

## Project Overview

Stellar Laboratory provides developers a set of tools to try out and learn about
the Stellar network.

## Tech Stack

- **Framework**: Next.js without server components (use `'use client'` when
  necessary)
- **Language**: TypeScript
- **Styling**: Scss Modules
- **State Management**: Zustand and tanstack-query
- **Testing**: Jest, Playwright
- **Package Manager**: pnpm

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Prefer explicit return types for functions
- Use interfaces over types for object definitions
- Avoid `any` type; use `unknown` if type is truly unknown
- Use strict null checks

### React/Next.js

- Use functional components with hooks
- Prefer named exports over default exports for components
- Use Client Components by default
- Keep components small and focused on a single responsibility
- Place components in appropriate directories under `src/components/`

### Naming Conventions

- **Files**: PascalCase for components (`MyComponent.tsx`), camelCase for
  utilities (`myHelper.ts`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`fetchUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces/Types**: PascalCase with descriptive names (`UserProfile`,
  `ApiResponse`)

### File Organization

- Keep related files together (component + styles + tests)
- Place shared utilities in `src/helpers/`
- Place type definitions in `src/types/`
- Place constants in `src/constants/`
- Place hooks in `src/hooks/`
- Place tanstack query in `src/query`

## Coding Practices

### Error Handling

- Always handle errors explicitly
- Use try-catch blocks for async operations
- Provide user-friendly error messages
- Log errors appropriately for debugging

### Performance

- Memoize expensive computations with `useMemo`
- Memoize callback functions with `useCallback`
- Use dynamic imports for code splitting when appropriate
- Optimize images using Next.js Image component

### Accessibility

- Include proper ARIA labels
- Ensure keyboard navigation works
- Use semantic HTML elements
- Test with screen readers when possible

### Testing

- Write tests for all new features
- Place unit tests in `tests/unit/`
- Place e2e tests in `tests/e2e/`

## Project-Specific Guidelines

### [Feature/Module Name]

- [Specific guidelines for this feature]
- [Best practices or patterns to follow]

### API Integration

- [How to handle API calls]
- [Error handling patterns]
- [Authentication/authorization approach]

### State Management

- [When to use local vs global state]
- [Patterns for state updates]

## Common Patterns

### Component Pattern Example

```typescript
interface MyComponentProps {
  // Props interface
}

export const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
  // Hooks at the top

  // Event handlers

  // Render logic
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### API Call Pattern

```typescript
// Example pattern for API calls
try {
  const response = await fetch("/api/endpoint");
  if (!response.ok) {
    throw new Error("API call failed");
  }
  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle error
  console.error("Error:", error);
}
```

## Things to Avoid

- Don't use `var`; use `const` or `let`
- Don't mutate state directly
- Do not use inline styles
- Do not use hex color code; use
  [Stellar Design System's color variables](https://raw.githubusercontent.com/stellar/stellar-design-system/62a0500226f6da70a0a9e58c5f54d248396086e1/%40stellar/design-system/src/theme.scss)
- Don't commit console.logs
- Don't skip TypeScript type definitions
- Don't use magic numbers; define constants

## Documentation

- Add JSDoc comments for public APIs and complex functions
- Keep README.md updated with new features
- Document environment variables in `.env.example`

## Before Submitting Code

- [ ] Run linter and fix all issues
- [ ] Run tests and ensure they pass
- [ ] Check for TypeScript errors
- [ ] Test functionality locally
- [ ] Review your own code changes
- [ ] Update documentation if needed

## Additional Resources

- [Link to project documentation]
- [Link to design system]
- [Link to API documentation]

---

**Note**: These instructions are for GitHub Copilot to provide context-aware
suggestions. Update them as the project evolves.
