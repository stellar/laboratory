---
name: new-tx-flow
description: Context and conventions for working on the new single-page transaction build/import flow. Invoke before starting any task on /transaction/build or /transaction/import pages.
---

# New Transaction Flow

## Before Starting Work

1. Read the design doc: `docs/new-transaction-flow.md`
2. Check current progress in the Progress section below
3. Use related skills as needed:
   - `/new-tx-step-content` — when implementing a step content component
   - `/stellar-xdr-patterns` — when working with XDR encode/decode
   - `/zustand-store-patterns` — when adding store fields or debugging hydration
   - `/figma-to-code` — after pulling Figma designs via MCP
   - `/component-with-design-system` — when building UI components
   - `/commit-progress` — after completing each logical unit of work

## Architecture

- **Single-page flow**: All steps (Build, Simulate, Sign, Validate, Submit)
  render on one URL. `activeStep` controls which step content renders.
- **Store**: `useBuildFlowStore` from `src/store/createTransactionFlowStore.ts`
  — uses `persist(immer(...))` with sessionStorage. NOT `zustand-querystring`.
- **Rehydration**: `skipHydration: true` with module-scope `rehydrate()`. Never
  put rehydration in `useEffect` — child effects write to sessionStorage before
  parent effects, overwriting persisted data.
- **Network config**: Read from main store (`useStore`) as read-only dependency.
  Not duplicated into the flow store.

## UI Components

Use `@stellar/design-system` components. Check https://design-system.stellar.org/
for what's available before building custom UI.

Common components used in this flow:
- Layout: `Card`, `Box` (custom), `PageCard`, `PageHeader`
- Forms: `Input`, `Select`, `PositiveIntPicker`, `XdrPicker`, `MemoPicker`,
  `TimeBoundsPicker`, `MultiPicker`
- Feedback: `Alert`, `Text`, `Link`, `Icon`, `CopyText`
- Actions: `Button`
- Display: `CodeEditor` (for JSON/XDR display)

## Reference Components

When building new step content, reference these existing components for patterns:

| Pattern | Reference file |
|---------|---------------|
| Signing UI (4-tab: secret key, wallet, hardware, envelope) | `src/components/SignTransactionXdr/index.tsx` |
| Resource display | `src/app/(sidebar)/transaction/dashboard/components/ResourceProfiler.tsx` |
| Resource breakdown helper | `src/helpers/getTxResourceBreakdown.ts` |
| Auth entry signing SDK functions | `authorizeEntry()`, `assembleTransaction()` from `@stellar/stellar-sdk` |
| Existing simulate page (legacy, reference only) | `src/app/(sidebar)/transaction/simulate/page.tsx` |

## Data Model: Simulation vs. Post-Submission

`simulateTransaction` returns resource **budgets** (pre-flight):
- CPU instructions, memory bytes (`result.cost`)
- Footprint keys, diskReadBytes, writeBytes (`result.transactionData` XDR)
- `minResourceFee`

`getTransaction` returns actual **execution metrics** (post-submission) via
`diagnosticEventsJson` `core_metrics` — includes ~20 additional fields (entries
read/write, data/key/code I/O, events, invoke time) not available from simulation.

## Key Files

| Purpose | File |
|---------|------|
| Store | `src/store/createTransactionFlowStore.ts` |
| Build page | `src/app/(sidebar)/transaction/build/page.tsx` |
| Step navigation hook | `src/hooks/useTransactionFlow.ts` |
| Stepper | `src/components/TransactionStepper/index.tsx` |
| Footer | `src/components/TransactionFlowFooter/index.tsx` |
| Simulate step | `src/app/(sidebar)/transaction/build/components/SimulateStepContent.tsx` |

## Progress

### Part 1: Build Step & Page Layout — DONE
- TransactionStepper, TransactionFlowFooter, useTransactionFlow created
- Tabs extended with href mode
- page.tsx refactored as single-page flow
- Params, Operations, ClassicTransactionXdr, SorobanTransactionXdr wired up
- Session storage persistence working

### Part 2: Simulate & Auth Signing — IN PROGRESS
- SimulateStepContent created (XDR display, auth mode, instruction leeway,
  simulate button, result viewer, resource info, auth entry preview)
- TODO: SorobanAuthSigningCard, AuthEntryItem, AuthSignatureInput
- TODO: assembleTransaction after auth signing
- TODO: ValidateStepContent (enforce-mode re-simulation)
- TODO: SignStepContent, SubmitStepContent

### Part 3: Import Flow — NOT STARTED
