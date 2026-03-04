---
name: staff-code-review
description:
  Performs an opinionated staff-engineer-level code review. Use when user says
  "review", "code review", "review my code", "review this PR", or "review these
  changes". Reads all changed files and delivers a structured review covering
  bugs, architecture, code quality, and nits.
---

# Staff Engineer Code Review

Perform a thorough, opinionated code review as a strong staff engineer.

## Step 1: Identify Changed Files

- Ask the user which files to review, or infer from git diff / branch context.
- Read every changed file in full. Do not review code you haven't read.
- Also read key imports, types, and related files for full context.

## Step 2: Analyze

Evaluate each file against these categories, in priority order:

### Bugs / Correctness (BLOCKING)

- Race conditions, off-by-one errors, null/undefined edge cases
- State synchronization issues (stale closures, missing dependency arrays)
- Error handling gaps (uncaught promises, raw string throws, swallowed errors)
- Security issues (injection, XSS, OWASP top 10)

### Stellar-Specific Security (BLOCKING)

These issues MUST be flagged as blocking and should prevent a merge/push:

- **`dangerouslySetInnerHTML`**: Flag ANY usage. This is an XSS vector and is
  strictly prohibited. Real funds are at stake.
- **Error silencing patterns**: Flag any of the following:
  - Empty `catch` blocks (`catch (e) {}` or `catch { }`)
  - `catch` blocks that only contain a comment but no error handling
  - `// @ts-ignore` or `// @ts-expect-error` without a detailed justification
  - `eslint-disable` comments without clear justification
  - `as any` type assertions that bypass type safety
  - Swallowing errors in Promise chains (`.catch(() => {})`,
    `.catch(() => null)`)
- **Sensitive data exposure**: Hardcoded private keys, secrets, or credentials
- **Unsafe `eval()` or `Function()` constructor usage**
- **Unvalidated user input** used in Stellar SDK calls (transaction building,
  signing, etc.)

### Test Coverage (BLOCKING)

When a **new component file** is added (a new `.tsx` file in `src/components/`
or a new page component):

- Check if corresponding test files exist in `tests/unit/` or `tests/e2e/`.
- If no tests are found, flag as blocking.
- Suggest what tests should be written (unit tests for logic, e2e tests for user
  flows).

### Design / Architecture

- Separation of concerns — is logic in the right layer?
- Naming — do names reflect domain concepts, not implementation details?
- Data flow — are there multiple sources of truth? Unnecessary prop drilling?
- Performance — unnecessary re-renders, missing memoization, wasteful polling?
- API design — are hook/function signatures intuitive and hard to misuse?

### Code Quality (WARNINGS)

- Use of `any` type (should use `unknown` or proper types)
- Missing JSDoc comments on new exported functions
- Missing input validation in new functions
- Inline `style={}` attributes (should use SCSS and design system)
- Direct Horizon API usage in new features (should use RPC)
- Missing error handling in async operations
- New external dependencies added without justification
- Components not using `@stellar/design-system` when equivalent components exist
- Manual editing of `src/constants/networkLimits.ts` (auto-generated file)
- Dead code, redundant checks, unreachable branches
- Fragile patterns (string splitting URLs, magic strings, silent failures)
- Consistency with existing codebase conventions
- Typos in identifiers and filenames

### Code Conventions (INFO)

- Import paths not using `@/` alias
- Naming convention violations (PascalCase for components, camelCase for
  helpers, `use` prefix for hooks)
- Missing TypeScript return types on functions
- Files exceeding ~300 lines (suggest splitting)
- Validation functions not following `get*Error()` pattern
- Minor readability improvements (extract variables, simplify expressions)

## Step 3: Deliver Review

Structure the review as:

1. **Overall assessment** — 2-3 sentence summary of the change and its quality.
2. **Findings by category** — each finding gets:
   - A numbered heading with severity tag (BLOCKING / WARNING / INFO)
   - The file and line reference
   - Code snippet showing the problem
   - Clear explanation of _why_ it's a problem
   - Concrete fix suggestion
3. **Summary table** — severity counts
4. **Blocking call** — explicitly state what must be fixed before merge vs what
   can be follow-ups.

## Principles

- Be direct. Don't soften feedback with filler phrases.
- Every finding must have a concrete "Fix:" or suggestion.
- Don't nitpick formatting or style that a linter/Prettier should catch.
- Don't suggest adding comments, docstrings, or type annotations unless they are
  genuinely needed for comprehension.
- Praise good decisions briefly (e.g., "Deleting X was the right call") but
  don't pad the review with compliments.
- Distinguish blocking issues from nice-to-haves. Not everything needs to be
  fixed in the same PR.
- Prioritize security findings above all else — this app handles real Stellar
  funds.
- When in doubt about whether something is a blocker, err on the side of caution
  and flag it.
- Consider the broader context: does this change interact with transaction
  building, signing, or submission? If so, apply extra scrutiny.
- Check that Zustand store changes maintain backward compatibility with existing
  URL querystring state.

## Examples

### Review staged changes

User says: "Review my changes"

Actions:

1. Run `git diff --staged` or check branch diff to identify changed files
2. Read all changed files and their key dependencies
3. Deliver structured review

### Review specific files

User says: "Review ContractInfo.tsx and useBackendEndpoint.ts"

Actions:

1. Read the specified files and their imports/types
2. Deliver structured review focused on those files
