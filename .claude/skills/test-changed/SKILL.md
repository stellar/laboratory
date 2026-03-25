---
name: test-changed
description: Run e2e and unit tests related to files changed on the current branch. Use after making code changes to verify nothing is broken.
---

## Run Tests for Changed Files

Run e2e and unit tests that are relevant to the files changed on the current branch.

### Test Configuration

- **Unit (Jest)**: Config in `jest.config.js`, path aliases via `moduleNameMapper`
- **E2E (Playwright)**: Config in `playwright.config.ts`, Chromium only, 20s timeout per test, 2 retries, 2 workers
- **E2E dev server**: Playwright starts `pnpm dev` automatically, but `reuseExistingServer: true` in non-CI — a stale server from another branch will cause false failures

### Steps

1. **Kill any stale dev server** on port 3000 before running e2e tests. Playwright's `reuseExistingServer` will pick up a server from a different branch otherwise, causing false failures (especially in worktrees):
   ```bash
   lsof -ti:3000 | xargs kill -9 2>/dev/null; true
   ```

2. **Find changed files** relative to `main`:
   ```bash
   git diff --name-only main...HEAD
   git diff --name-only          # unstaged
   git diff --name-only --cached # staged
   ```

3. **Map source changes to test files.** Use these rules:
   - `src/app/(sidebar)/transaction/build/**` -> `tests/e2e/buildTransaction.test.ts`, `tests/e2e/savedTransactions.test.ts`, `tests/e2e/urlParams.test.ts`
   - `src/app/(sidebar)/transaction/sign/**` -> `tests/e2e/signTransactionPage.test.ts`
   - `src/app/(sidebar)/transaction/submit/**` -> `tests/e2e/submitTransactionPage.test.ts`
   - `src/app/(sidebar)/transaction/simulate/**` -> `tests/e2e/simulateTransactionPage.test.ts`
   - `src/app/(sidebar)/transaction/fee-bump/**` -> `tests/e2e/feeBumpTransactionPage.test.ts`
   - `src/app/(sidebar)/account/fund/**` or `src/app/(sidebar)/account/create/**` -> `tests/e2e/fundAccountPage.test.ts`, `tests/e2e/createAccountPage.test.ts`
   - `src/app/(sidebar)/xdr/**` -> `tests/e2e/viewXdrToJsonPage.test.ts`, `tests/e2e/jsonToXdrPage.test.ts`
   - `src/app/(sidebar)/endpoints/**` -> `tests/e2e/endpointsPage*.test.ts`
   - `src/app/(sidebar)/smart-contracts/**` -> `tests/e2e/contractExplorer*.test.ts`
   - **Shared code — run ALL e2e tests:** `src/components/**`, `src/helpers/**`, `src/hooks/**`, `src/store/**`, `src/constants/**`, `src/types/**`, `src/validate/**`, `src/styles/**`, `src/middleware.ts`
   - `tests/e2e/mock/**` -> run ALL e2e tests that import from mock/
   - `tests/e2e/*.test.ts` changed directly -> run those tests
   - `tests/unit/**` changed -> run unit tests
   - If source files under `src/helpers/` or `src/validate/` changed, also check `tests/unit/` for matching unit tests

4. **If XDR encoding or transaction building logic changed** (e.g. `ClassicTransactionXdr.tsx`, `SorobanTransactionXdr.tsx`, `src/helpers/xdr/`), hardcoded hash/XDR values in tests may need updating. Flag this to the user before running tests.

5. **Run the identified tests:**
   - E2E: `npx playwright test <file1> <file2> ... --retries=0 --reporter=list`
   - Unit: `pnpm test:unit <file>`
   - If no specific tests identified, run the full suite: `pnpm test:e2e` and `pnpm test:unit`

6. **Report results.** Show pass/fail counts and list any failures with their error messages. For failures, read the relevant test code and source code to suggest fixes.
