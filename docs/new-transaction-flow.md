# New Transaction Flow - Design Implementation

## Context

This document covers the new transaction flow redesign:

1. **Single-page transaction flow** - All 5 steps for Soroban (Build, Simulate,
   Sign, Validate, Submit) or 3 steps for Classic (Build, Sign, Submit) on one
   page with a stepper
2. **Soroban Auth Entry Signing** - Sign authorization entries after simulation
3. **Soroban Auth Validation** - Enforce-mode re-simulation after auth signing
   to verify auth signatures before envelope signing
   ([CAP-71](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md))

**Figma Links:**

- Build page:
  https://www.figma.com/design/9j3YQ5URseAsn3j0tf2FFq/Laboratory?node-id=5698-142554&m=dev
- Auth signing:
  https://www.figma.com/design/9j3YQ5URseAsn3j0tf2FFq/Laboratory?node-id=5766-210139&m=dev
- Import page:
  https://www.figma.com/design/9j3YQ5URseAsn3j0tf2FFq/Laboratory?node-id=5766-236569&m=dev

## Architecture: Single-Page Flow

Both flows live on dedicated pages that share the same layout and stepper:

- **`/transaction/build`** — New transaction (Build flow)
- **`/transaction/import`** — Import transaction XDR (Import flow)

The tabs at the top are navigation links (`<Link href="/transaction/import">`);
switching tabs is a page navigation, not local state. Within each page, all
steps are rendered on that single URL. The stepper tracks which step is active
and users can navigate back to any previously completed step. Step content is
conditionally rendered based on the active step. There is no page navigation or
reload between steps within a flow.

### Step variants

The Simulate step is Soroban-only. The Validate step is Soroban-only and
conditional — it only appears when the simulation returns auth entries that
require signing. The steps array updates dynamically after simulation completes.

| Variant                      | Build flow steps                                      | Import flow steps (replaces `"build"` with `"import"`)  |
| ---------------------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| **Classic**                  | `["build", "sign", "submit"]`                         | `["import", "sign", "submit"]`                          |
| **Soroban, no auth entries** | `["build", "simulate", "sign", "submit"]`             | `["import", "simulate", "sign", "submit"]`              |
| **Soroban, auth entries**    | `["build", "simulate", "sign", "validate", "submit"]` | `["import", "simulate",  "sign", "validate", "submit"]` |

### Page layout

```
┌─────────────────────────────────────────────────────────────┐
│  /transaction/build  (or /transaction/import)               │
│                                                             │
│  [Tabs: New transaction | Import XDR]  ← nav links          │
│                                                             │
│  ┌─────────────────────────────┐  ┌──────────────────────┐  │
│  │  Step content (left)        │  │ Stepper (right)      │  │
│  │                             │  │                      │  │
│  │  activeStep === "build"     │  │  ● 1. Build    ←     │  │
│  │    → <BuildContent />       │  │  ○ 2. Simulate *     │  │
│  │                             │  │  ○ 3. Sign           │  │
│  │  activeStep === "simulate"  │  │  ○ 4. Validate *†    │  │
│  │    → <SimulateContent />    │  │  ○ 5. Submit         │  │
│  │    (Soroban only)           │  │  (* Soroban only)    │  │
│  │                             │  │  († only if auth     │  │
│  │                             │  │     entries present) │  │
│  │                             │  └──────────────────────┘  │
│  │  activeStep === "sign"      │                            │
│  │    → <SignContent />        │                            │
│  │                             │                            │
│  │  activeStep === "validate"  │                            │
│  │    → <ValidateContent />    │                            │
│  │    (Soroban, auth only)     │                            │
│  │                             │                            │
│  │  activeStep === "submit"    │                            │
│  │    → <SubmitContent />      │                            │
│  │                             │                            │
│  │  [← Back]    [Next →]       │                            │
│  └─────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

### Step state management

```typescript
type TransactionStepName =
  | "build"
  | "import"
  | "simulate"
  | "validate"
  | "sign"
  | "submit";
```

- `activeStep: TransactionStepName` — controls which content renders
- `highestCompletedStep: TransactionStepName | null` — tracks the furthest step
  reached (`null` on fresh page load with no session state)
- **Build flow and Import flow each own their own `steps` array** — they live on
  separate routes (`/transaction/build` → `BuildTransaction`;
  `/transaction/import` → `ImportFlow`). Each `page.tsx` is self-contained.
- Steps are derived from the step variants table above; ordering uses array
  position: `const stepIndex = (s: TransactionStepName) => steps.indexOf(s)`
- Stepper only renders the applicable steps for the current transaction type
- **"Next" in the footer is the only way to advance to a step that has not yet
  been completed.** It advances to the next step in the applicable list and
  updates `highestCompletedStep`
- "Back" sets `activeStep` to previous step in the list (content is preserved in
  store)
- Clicking a step in the stepper only works for **already-completed steps** —
  users can navigate back to any completed step, but cannot skip forward.
  Forward navigation always goes through the "Next" footer button
- After a user has gone through all steps and then they decide to change a param
  during the Build transaction, a confirmation dialog will warn that simulation
  and signing progress will be lost. If confirmed, `highestCompletedStep` is
  reset and all downstream step data (simulation result, signed auth entries,
  assembled XDR) is cleared

### State Persistence Model

Flow state is stored in **`sessionStorage`**, not the URL. This is an
intentional departure from the `zustand-querystring` pattern used elsewhere in
the app.

**Why sessionStorage instead of URL params:**

The current codebase URL-persists build parameters, operation config, form
inputs, and transaction XDR. The new flow intentionally moves all of this out of
the URL — only network settings remain in the querystring.

The new flow introduces state that cannot fit in the URL:

- `simulationResult` — full RPC response JSON (5–50 KB)
- `signedAuthEntries` — XDR blobs (1–5 KB each)
- `assembledXdr` / `signedXdr` — base64 XDR strings (5–25 KB each)

Rather than splitting state across two persistence layers (some fields in URL,
some in sessionStorage), **all** transaction flow state — build params,
operations, XDR, simulation results, step navigation — lives in sessionStorage.
This avoids split-brain inconsistencies and keeps the URL clean.

**URL sharing vs. transaction sharing:** URL sharing is not supported for this
flow. However, **sharing partially-signed transactions** (e.g., for multi-sig
workflows) is a separate concern — that is handled by the Import flow, where
users paste XDR directly.

**What persists where:**

| Storage           | Scope                                                     | What it holds                                                                                                                    |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `sessionStorage`  | Current browser tab; survives refresh and back navigation | Full flow state: `activeStep`, `highestCompletedStep`, build params, XDR, simulation result, signed XDR                          |
| `localStorage`    | Cross-session; explicit user action                       | Saved transactions (via "Save transaction" button)                                                                               |
| URL (querystring) | App-wide, shareable                                       | Network settings only (network ID, Horizon URL, RPC URL, passphrase) — build params and XDR are **not** in the URL for this flow |

**Network settings remain in the URL** via the main store's existing querystring
sync. Network config is app-wide (used by XDR page, endpoints, smart contracts,
etc.), tiny in size, and genuinely useful to share ("here's Lab pointed at
testnet"). The transaction flow store reads `network` from the main store as a
read-only cross-store dependency — it is not duplicated into sessionStorage.

**Lifecycle:**

- State is **preserved** on page refresh and browser back/forward navigation
  within the same session
- State is **cleared** when the tab is closed (sessionStorage is tab-scoped)
- State is **cleared** by "Clear all" (explicit user action)
- Navigating between Build and Import tabs does **not** clear the other tab's
  state; each flow has its own session storage key
- **`beforeunload` warning (Nice to Have)**: When the flow store has unsaved
  state (i.e., the user has progressed past the initial step or modified build
  params), closing or navigating away from the tab triggers a browser
  confirmation dialog. This protects against accidental tab close (Cmd+W),
  browser crash recovery prompts, and mobile tab kills. The warning is
  suppressed after "Clear all" or when the flow is in its initial empty state.

**Implementation — Separate Zustand Store:**

Create a new `TransactionFlowStore`, completely separate from the main store.
The new flow store uses `persist(immer(...))` with sessionStorage — no
`zustand-querystring` involvement. The main store (with
`querystring(immer(...))`) continues to serve the rest of the app (XDR page,
endpoints, account, smart contracts, etc.) but is **not used for transaction
flow state**.

The only thing the flow reads from the main store is `network` config (needed
for signing and simulation). All transaction data — build params, operations,
XDR strings, simulation results, step navigation — lives exclusively in the flow
store.

```typescript
// New file: src/store/createTransactionFlowStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const useTransactionFlowStore = create<TransactionFlowState>()(
  persist(
    immer((set) => ({
      activeStep: "build",
      highestCompletedStep: null,
      buildParams: {
        /* ... */
      },
      operations: [],
      buildXdr: "",
      simulationResultJson: "",
      authEntriesXdr: [],
      signedAuthEntriesXdr: [],
      assembledXdr: "", // output of assembleTransaction(); passed to Sign step
      signedXdr: "",
      validateResultJson: "",
      // actions...
    })),
    {
      name: "stellar_lab_tx_flow_build", // or _import
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
```

Key design decisions:

- **Fully self-contained**: The flow store owns all transaction state. No
  transaction data in the main store's `querystring` sync. The only cross-store
  dependency is `network` (read-only from main store).
- **Two storage keys**: `stellar_lab_tx_flow_build` and
  `stellar_lab_tx_flow_import` for independent flow isolation
- **All SDK objects stored as base64 XDR strings** — never persist SDK object
  instances. Parse back to SDK objects lazily at point of use (e.g.,
  `xdr.SorobanAuthorizationEntry.fromXDR(str, 'base64')`)
- **Hydration**: Use `skipHydration: true` with `rehydrate()` in a client-side
  `useEffect` (sessionStorage is not available during SSR)
- **`highestCompletedStep`** is part of the persisted store (not component-local
  state), so browser back navigation correctly restores which steps are
  accessible in the stepper

**Error handling:**

All sessionStorage access must be wrapped in try-catch. The existing codebase
has no error handling around storage APIs — this flow must not repeat that
pattern.

- **Write failure** (QuotaExceededError, security restrictions): fall back to
  in-memory only. The flow still works within the tab, just won't survive
  refresh. Log a warning via console.
- **Read failure** (corrupted JSON, missing keys): reset to default state
  instead of crashing. Log a warning.
- **Private/incognito mode**: sessionStorage works in private mode on modern
  browsers (cleared on tab close, which is the same behavior as normal
  sessionStorage). Older browsers or restricted environments may throw — the
  try-catch fallback handles this.

**Backward compatibility with old URLs:**

Existing URLs with transaction state in query params (e.g.,
`?transaction.build.params.source_account=G...&transaction.build.classic.operations=...`)
will continue to work through a one-time migration handled at the **app level**
(e.g., in `StoreProvider` or root layout), so it catches any old bookmarked or
shared URL regardless of which route the user lands on:

1. On app initialization, check if the URL contains legacy `transaction.build.*`
   or `transaction.sign.*` query params
2. If found, parse them and write the values into the `TransactionFlowStore`
   (sessionStorage)
3. Redirect to the clean path (`/transaction/build` or `/transaction/import`)
   with no query params (replace state, no history entry)
4. The flow store now holds the migrated state; the user continues in the new
   single-page flow

This is a single centralized handler — individual pages do not need to know
about legacy URL formats.

This ensures bookmarked or shared URLs from before the migration still load
correctly.

### Save

localStorage save captures the full flow state across all steps, enabling
complete restore with all previous steps accessible. Save always restores to the
Build/Import step — simulation/signing is fast to redo.

---

# Part 1: Build Step & Page Layout

## Screenshot Reference

The Figma design shows:

- **Title section**: "Build transaction" heading with "Clear all" link on right
- **Footer**: "Next: Simulate transaction" (disabled until valid) + "Save
  transaction" button

---

## Implementation Steps

### Step 1: Create `TransactionStepper` component

**New files:**

- `src/components/TransactionStepper/index.tsx`
- `src/components/TransactionStepper/styles.scss`

Reusable, purely presentational component (no dependencies on `Routes`, `Link`,
`usePathname`). Receives `steps`, `activeStep`, and `highestCompletedStep` as
props. A step is accessible (clickable) if its index <= `highestCompletedStep`;
future steps are visually disabled.

**Props:**

```typescript
{
  steps: TransactionStepName[];
  activeStep: TransactionStepName;
  highestCompletedStep: TransactionStepName | null;      // null = none
  onStepClick: (step: TransactionStepName) => void;
}
```

### Step 2: Create `TransactionFlowFooter` component

**New file:**
`src/app/(sidebar)/transaction/build/components/TransactionFlowFooter.tsx`

Shared footer for all steps. The footer derives button labels from the `steps`
array (next/previous step names), so it adapts automatically to any step
variant. General rules:

- First step has no "Back" button
- Last step (Submit) has no "Next" button (submit button is in the step content)
- "Next" is disabled until the current step is valid (XDR built, simulation
  done, auth signed, envelope signed, etc.)
- Build/Import step shows a "Save transaction" icon button

**Full example (Soroban with auth entries, 5 steps):**

| Step     | Back button                  | Next button                                                                  | Extra                          |
| -------- | ---------------------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| Build    | —                            | "Next: Simulate transaction" (disabled until valid XDR)                      | "Save transaction" icon button |
| Simulate | "Back: Build transaction"    | "Next: Sign transaction" (disabled until simulation + auth signing complete) | N/A                            |
| Sign     | "Back: Simulate transaction" | "Next: Validate" (disabled until signed)                                     | N/A                            |
| Validate | "Back: Sign transaction      | "Next: Submit transaction" (disabled until enforce sim passes)               | N/A                            |
| Submit   | "Back: Validate"             | — (submit button is in the step content)                                     | N/A                            |

Shorter variants (4-step Soroban, 3-step Classic) follow the same pattern with
the applicable subset of steps.

**Props:**

```typescript
{
  steps: TransactionStepName[];       // for deriving next/prev labels
  activeStep: TransactionStepName;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
  xdr?: string;  // for save button on Build step
}
```

- No router navigation — purely state-driven

**Reuses:** `SaveToLocalStorageModal` pattern from `ClassicOperation.tsx:544`,
`localStorageSavedTransactions` helper

### Step 3: Create page-level styles

**New file:** `src/app/(sidebar)/transaction/build/styles.scss`

```
.BuildTransaction
  &__layout     -> flex row, gap 32px
  &__content    -> flex 1, min-width 0, flex column, gap 16px
  &__stepper    -> flex-shrink 0, padding-top 8px
  &__header     -> flex row, justify-between
  &__footer     -> padding-top 8px
  @media (max-width: 960px) -> stack columns, hide stepper
```

### Step 4: Create `useTransactionFlow` hook

**New file:** `src/hooks/useTransactionFlow.ts`

Shared hook used by both `BuildTransaction` and `ImportFlow` to eliminate
duplicated step navigation logic.

### Step 5: Refactor main `page.tsx` as single-page flow

Keep the existing flow `src/app/(sidebar)/transaction/build/page.tsx` under
another route.

**Modify:** `src/app/(sidebar)/transaction/build/page.tsx`

This page now owns the Build flow end-to-end. `activeStep` and
`highestCompletedStep` both live in the Zustand transaction store, persisted to
`sessionStorage`. Neither is synced to URL query params.

New structure — `page.tsx` renders `<BuildTransaction />` directly; the
`<Tabs />` component contains nav links, not local state:

> **Tabs component concern:** The existing `src/components/Tabs/index.tsx` uses
> `div` elements with `onClick` handlers — it has no `href` support. Extending
> it for nav-link mode is minimal and fully backward-compatible:
>
> ```typescript
> // Add href to Tab type
> type Tab = {
>   id: string;
>   label: string;
>   href?: string;        // new: render as <Link> when present
>   isDisabled?: boolean;
> };
>
> // In the component: derive active state from pathname when href is used
> const pathname = usePathname();
>
> // Render <Link> for href tabs, <div> for id-based tabs (unchanged)
> {href
>   ? <Link href={t.href} className={`Tab ${addlClassName}`} data-is-active={pathname === t.href}>{t.label}</Link>
>   : <div ... onClick={() => onChange(t.id)} data-is-active={t.id === activeTabId}>...}
> ```
>
> All 5 existing callers pass `id`/`activeTabId`/`onChange` and no `href` — they
> are unaffected. The `data-is-active` attribute and `.Tab` CSS class are the
> same for both render paths so styling requires no changes.

Both `page.tsx` files (Build and Import) render the same shell — only the active
tab and flow component differ:

```typescript
// page.tsx — Build flow page (Import page swaps activeTabHref and renders <ImportFlow />)
<div className="TransactionFlow">
  <Tabs
    tabs={[
      { label: "New transaction", href: "/transaction/build" },
      { label: "Import transaction XDR", href: "/transaction/import" },
    ]}
    activeTabHref="/transaction/build"
    addlClassName="Tab--with-border"
  />
  <BuildTransaction />
</div>
```

**`BuildTransaction` component** (new file `BuildTransaction.tsx`) owns all
build-specific step logic. Step navigation is handled by `useTransactionFlow`:

```typescript
// transaction/build/page.tsx
const { activeStep, setActiveStep } = useStore(transactionStore);
const isSoroban = /* derived from transaction type in build store */;
const hasAuthEntries = /* derived from simulation result in store */;

const getSteps = (): TransactionStepName[] => {
  if (!isSoroban) return ["build", "sign", "submit"];
  if (hasAuthEntries) return ["build", "simulate", "sign", "validate", "submit"];
  return ["build", "simulate", "sign", "submit"];
};
const steps = getSteps();

const { highestCompletedStep, stepIndex, handleNext, handleBack, handleStepClick } =
  useTransactionFlow({
    steps,
    activeStep,
    setActiveStep,
    // highestCompletedStep is restored from sessionStorage; null on first visit
  });

<div className="TransactionFlow__layout">
  <div className="TransactionFlow__content">
    {activeStep === "build" && <BuildStepContent />}
    {activeStep === "simulate" && <SimulateStepContent />}
    {activeStep === "sign" && <SignStepContent />}
    {activeStep === "validate" && <ValidateStepContent />}
    {activeStep === "submit" && <SubmitStepContent />}

    <TransactionFlowFooter
      steps={steps}
      activeStep={activeStep}
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={!isCurrentStepValid}
    />
  </div>
  <div className="TransactionFlow__stepper">
    <TransactionStepper
      steps={steps}
      activeStep={activeStep}
      highestCompletedStep={highestCompletedStep}
      onStepClick={handleStepClick}
    />
  </div>
</div>
```

- `currentXdr` derived from `transaction.build.classic.xdr` or
  `transaction.build.soroban.xdr`
- Each step's content is extracted into its own component (see below)
- Transaction data flows between steps via Zustand store (XDR, simulation
  result, signed XDR)

### Step 6: Modify `Params` component for "Clear all"

**Modify:** `src/app/(sidebar)/transaction/build/components/Params.tsx`

- Pass "Clear all" link as `rightElement` to `PageCard` (already supported)
- The "Clear all" action calls `transaction.resetBuild()` (resets params +
  operations)
- Remove the existing "Clear params" button at the bottom of Params

### Step 7: Clean up operation footer buttons

**Modify:**
`src/app/(sidebar)/transaction/build/components/ClassicOperation.tsx`

- Remove "Clear operations" button (replaced by page-level "Clear all")
- Keep "Add operation" and save icon button

**Modify:**
`src/app/(sidebar)/transaction/build/components/SorobanOperation.tsx`

- Remove "Clear operation" button (replaced by page-level "Clear all")

### Step 8: Add tracking events

**Modify:** `src/metrics/tracking.ts`

Add events:

- `TRANSACTION_BUILD_CLEAR_ALL` - for the new "Clear all" action
- `TRANSACTION_BUILD_NEXT_SIMULATE` - for the "Next: Simulate" button

---

## Part 1 Files Summary

| Action     | File                                                                                 |
| ---------- | ------------------------------------------------------------------------------------ |
| **Create** | `src/hooks/useTransactionFlow.ts`                                                    |
| **Create** | `src/components/TransactionStepper/index.tsx`                                        |
| **Create** | `src/components/TransactionStepper/styles.scss`                                      |
| **Create** | `src/app/(sidebar)/transaction/build/components/TransactionFlowFooter.tsx`           |
| **Modify** | `src/components/Tabs/index.tsx` (add optional `href` mode for nav-link tabs)         |
| **Modify** | `src/app/(sidebar)/transaction/build/page.tsx` (renders BuildTransaction + nav tabs) |
| **Modify** | `src/app/(sidebar)/transaction/build/components/Params.tsx`                          |
| **Modify** | `src/app/(sidebar)/transaction/build/components/ClassicOperation.tsx`                |
| **Modify** | `src/app/(sidebar)/transaction/build/components/SorobanOperation.tsx`                |
| **Modify** | `src/metrics/tracking.ts`                                                            |

## Part 1 Verification

- Tab navigation between Build and Import pages works
- Two-column layout with stepper on right; stepper hides on narrow screens
- "Clear all" resets both params and operations
- "Next: Simulate" advances to Simulate step (same page, no page reload; active
  step persisted to `sessionStorage`)
- "Back: Build transaction" returns to Build step with form data preserved
- Stepper highlights active step; completed steps are clickable, future steps
  are not
- "Save transaction" opens save modal (available on Build)
- Loading a saved transaction restores full flow state and step position

## Pre-launch Checklist

- [ ] Confirm `transaction.sign.importXdr` (`updateSignImportXdr`) is no longer
  needed in the new flow — the old build page used it to hand the XDR to the
  sign page via `router.push(Routes.SIGN_TRANSACTION)`. The new flow keeps
  everything on one page and reads the built XDR from `useBuildFlowStore`
  (`buildClassicXdr` / `buildSorobanXdr`) instead. Verify the sign step
  component reads from the flow store, not from `transaction.sign.importXdr`.
- [ ] Confirm `updateSignActiveView("overview")` is not needed — the old flow
  set this before navigating to the sign page. In the new single-page flow the
  sign step renders its own content directly.
- [ ] Confirm `TRANSACTION_BUILD_SIGN_IN_TX_SIGNER` tracking event is replaced
  or no longer applicable (signing is now a step transition, not a separate page
  navigation).
- [ ] Remove or deprecate `transaction.sign.importXdr` and
  `updateSignActiveView` from the old store once all flows are migrated.
- [ ] Remove `updateBuildXdr` from `ClassicTransactionXdr` — it writes to the
  old store (`transaction.build.xdr`) and is now redundant with
  `setBuildClassicXdr` from `useBuildFlowStore`. Still used by `saved/page.tsx`
  and `ContractStorage.tsx`, so the store method stays; just remove it from
  `ClassicTransactionXdr` once the new flow is fully wired.

---

# Part 2: Soroban Auth Entry Signing

## Context

When a Soroban transaction is simulated with `record` auth mode, the RPC
response may contain `SorobanAuthorizationEntry` values that require signing
before submission. This feature adds auth entry signing UI to the **Simulate
step** (step 2 of the single-page Soroban flow).

Auth signing lives in the Simulate step (not deferred to the Sign step) because:

1. **Auth entries are produced by simulation** — they don't exist before
   simulation runs
2. **`assembleTransaction` must happen before Sign step** — after auth entries
   are signed, `assembleTransaction(tx, simulationResult)` attaches the signed
   auth + resource data to produce the final XDR. The Sign step then signs this
   assembled envelope — a completely different operation
3. User sets `validUntilLedgerSeq`
   ([authorizeEntry code](https://github.com/stellar/js-stellar-base/blob/e3d6fc3351e7d242b374c7c6057668366364a279/src/auth.js#L50-L52))

**Two distinct signing operations** (per
[Stellar docs](https://developers.stellar.org/docs/build/guides/transactions/signing-soroban-invocations)):

- **Auth entry signatures** (Method 2 / `authorizeEntry`) — authorize the
  specific contract invocation; produced at the Simulate step
- **Transaction envelope signature** (Method 1) — authorizes the transaction
  submission; produced at the Sign step by signing the assembled XDR

## Flow

```
Step 1: Build -> Step 2: Simulate (record auth mode)
                           | simulation returns auth entries
                           v
                          Show auth signing UI in Simulate step
                           | user signs auth entries
                           | assembleTransaction(tx, recordSimResult)
                           v
                 Step 3: Sign (sign the assembled tx envelope)
                           |
                           v
                 Step 4: Validate (enforce-mode re-simulation)
                           | verifies auth signatures are valid
                           | returns final resource data (CAP-71)
                           | assembleTransaction(tx, enforceSimResult)
                           v
                 Step 5: Submit
```

## Simulate Step: Auth Entries Flow Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│  Simulate Step (activeStep === "simulate")                        │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │ Transaction XDR input                                     │    │
│  │ Auth mode: [record ▼]  (default for Soroban, overridable) │    │
│  │ Instruction leeway: [optional]                            │    │
│  │                                      [Simulate] button    │    │
│  └───────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ▼                                    │
│                    useSimulateTx(authMode: "record")              │
│                    POST simulateTransaction to RPC                │
│                              │                                    │
│                   ┌──────────┴──────────┐                         │
│                   │                     │                         │
│                   ▼                     ▼                         │
│           No auth entries        Auth entries found               │
│           (normal flow)          in results[].auth[]              │
│                   │                     │                         │
│                   ▼                     ▼                         │
│  ┌────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ Show result JSON   │  │ ┌ Success Alert ───────────────┐    │  │
│  │ Next: Sign tx ->   │  │ │ "Transaction simulation      │    │  │
│  └────────────────────┘  │ │  successful" + auth entries  │    │  │
│                          │ │  need validation message     │    │  │
│                          │ └─────────────────────────────-┘    │  │
│                          │                                     │  │
│                          │ ┌ Simulated Result ─────────────┐   │  │
│                          │ │ JSON code viewer (RPC res).   │   │  │
│                          │ └──────────────────────────────-┘   │  │
│                          │                                     │  │
│                          │ [View resource usage and fees ▼]    │  │
│                          │                                     │  │
│                          │ ┌ Auth Signing Card ────────────┐   │  │
│                          │ │                               │   │  │
│                          │ │ "N authorization entries      │   │  │
│                          │ │  detected"    [View auth ▲]   │   │  │
│                          │ │──────────────────────────────-│   │  │
│                          │ │                               │   │  │
│                          │ │ (●) Sign all ( ) Individually │   │  │
│                          │ │                               │   │  │
│                          │ │ ┌ Entry #1 [Unsigned] ──── ▼ ┐│   │  │
│                          │ │ └────────────────────────────┘│   │  │
│                          │ │ ┌ Entry #2 [Unsigned] ──── ▼ ┐│   │  │
│                          │ │ └────────────────────────────┘│   │  │
│                          │ │                               │   │  │
│                          │ │ Signatures (i)                │   │  │
│                          │ │ [Secret key 0] [Wallet 0]     │   │  │
│                          │ │ [Hardware 0]  [Envelope 0]    │   │  │
│                          │ │                               │   │  │
│                          │ │ ┌─ Secret key input ─────────┐│   │  │
│                          │ │ │ [S... or hex]  [Use key ▼] ││   │  │
│                          │ │ │ [Add additional]  [Sign]   ││   │  │
│                          │ │ └────────────────────────────┘│   │  │
│                          │ └───────────────────────────────┘   │  │
│                          │                                     │  │
│                          │              │                      │  │
│                          │    user signs all entries           │  │
│                          │              │                      │  │
│                          │              ▼                      │  │
│                          │  assembleTx(tx, simResult)          │  │
│                          │  Attach signed auth + resource data │  │
│                          │              │                      │  │
│                          │              ▼                      │  │
│                          │  [Next: Sign ->]                │  │
│                          │  Advances to Sign step (step 3) │  │
│                          │  Assembled XDR stored in Zustand    │  │
│                          └─────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### "Sign individually" mode detail

```
When user selects "Sign individually":
Each entry expands to show its own signing UI

┌ Entry #1 [Unsigned] ────────────────────── ▲──┐
│  Signatures (i)                               │
│  [Secret key 0] [Wallet 0] [HW 0] [Env 0]     │
│  ┌─ Sign with secret key ──────────────────┐  │
│  │ [S... or hex preimage]   [Use key ▼]    │  │
│  │ [Add additional]  [Sign]                │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
┌ Entry #2 [Unsigned] ────────────────────── ▲ ─┐
│  (different key can be used here)             │
│  [Secret key 0] [Wallet 0] [HW 0] [Env 0]     │
│  ┌─ Sign with secret key ──────────────────┐  │
│  │ [S... or hex preimage]   [Use key ▼]    │  │
│  │ [Add additional]  [Sign]                │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Add auth mode to Simulate step

**Create:**
`src/app/(sidebar)/transaction/build/components/SimulateStepContent.tsx`

Extract/adapt simulate page content into a step component:

- Default auth mode to `"record"` for Soroban transactions
- Add optional advanced dropdown to override: none / enforce / record /
  record_allow_nonroot
- Pass `authMode` to existing `useSimulateTx` hook (already supports it)
- Receives XDR from Zustand store (set during Build step)

**Modify:** `src/store/createStore.ts`

- Add `authMode: string` to `transaction.simulate` state (default: `"record"`)
- Add `updateSimulateAuthMode()` action

### Step 2: Parse auth entries from simulation response

**New file:** `src/helpers/sorobanAuthUtils.ts`

Helper functions:

- `extractAuthEntries(simulationResult)` - Parse `results[].auth[]` from RPC
  response, returns `SorobanAuthorizationEntry[]` XDR objects
- `getAuthEntryInfo(entry: xdr.SorobanAuthorizationEntry)` - Extract
  human-readable info (credentials type, contract ID, function name)
- `isAuthRequired(simulationResult)` - Check if response contains auth entries
  that need signing

### Step 3: Create `SorobanAuthSigningCard` component

**New files:**

- `src/components/SorobanAuthSigning/index.tsx`
- `src/components/SorobanAuthSigning/styles.scss`

Main card component that orchestrates auth entry signing. Placed in
`src/components/` for reusability, but auth entry signing only happens within
the Simulate step.

**Props:**

```typescript
{
  authEntries: xdr.SorobanAuthorizationEntry[];
  networkPassphrase: string;
  onAuthEntriesSigned: (signedEntries: xdr.SorobanAuthorizationEntry[]) => void;
}
```

**Sections:**

- Header: entry count + "View auth entries" toggle
- Radio: "Sign all entries" vs "Sign individually"
  - **Sign all entries**: One shared `AuthSignatureInput` below the entry list;
    signs all entries with the same key(s)
  - **Sign individually**: Each `AuthEntryItem` accordion expands to reveal its
    own `AuthSignatureInput`; different keys per entry
- Entry list (accordion items with Unsigned/Signed badges)
- When "Sign all": shared signing methods section below entry list (reuses
  patterns from sign page Overview.tsx)

### Step 4: Create `AuthEntryItem` component

**New file:** `src/components/SorobanAuthSigning/AuthEntryItem.tsx`

Collapsible accordion item for a single auth entry:

- Header: "Entry #N" + status badge ("Unsigned" / "Signed")
- Expand/collapse with chevron icon
- When expanded: show auth entry details (credentials, contract, function)

### Step 5: Create `AuthSignatureInput` component

**New file:** `src/components/SorobanAuthSigning/AuthSignatureInput.tsx`

Signing interface for auth entries (mirrors sign page patterns):

- **Tabs**: "Add secret key" | "Wallet extension" | "Hardware wallet" |
  "Transaction envelope"
- Each tab has a count badge showing number of signatures from that method
- **Secret key tab**: Input field + "Use secret key" dropdown + "Add
  additional" + "Sign" buttons
- **Signing logic**: Uses `authorizeEntry()` from `@stellar/stellar-sdk` to sign
  individual `SorobanAuthorizationEntry` objects

**Reuses patterns from:** `src/components/SignTransactionXdr/index.tsx` (944
lines — primary reference for tab UI, multi-picker inputs, signing method
structure)

- Same 4-tab layout: secret key, wallet extension, hardware wallet, signature
- `MultiPicker` for multiple secret key inputs
- `validate.getSecretKeyError()` for secret key validation
- Hardware wallet integration pattern (Ledger/Trezor via `txHelper`)
- Extension wallet pattern via `useSignWithExtensionWallet` (adapted)
- **Key difference**: `SignTransactionXdr` calls `tx.signatures.push()` to sign
  the transaction envelope. `AuthSignatureInput` calls `authorizeEntry()` from
  `@stellar/stellar-sdk` to sign individual `SorobanAuthorizationEntry` objects.
  The signing logic differs but the UI/input layer is the same pattern.

### Step 6: Wire auth signing into Simulate step

**Modify:**
`src/app/(sidebar)/transaction/build/components/SimulateStepContent.tsx`

After simulation succeeds and auth entries are detected:

1. Show success alert with auth entry message
2. Show simulation result JSON viewer
3. Show "View resource usage and fees" collapsible
4. Render `<SorobanAuthSigningCard>` with extracted auth entries
5. On auth entries signed: call `assembleTransaction(tx, simulationResult)` to
   rebuild the transaction with signed auth entries and resource data attached
6. Set step as "valid" so the footer's "Next: Sign" button enables

**Store updates needed:**

- Add `authEntries: xdr.SorobanAuthorizationEntry[]` to simulate state
- Add `signedAuthEntries: xdr.SorobanAuthorizationEntry[]` to simulate state
- Add `assembledXdr: string` — output of `assembleTransaction(tx, simResult)`
  with signed auth entries and resource data attached; this is what the Sign
  step consumes (`signedAuthEntries` stay in local component state and are not
  persisted)

### Step 7: Create `ValidateStepContent` component

**New file:**
`src/app/(sidebar)/transaction/build/components/ValidateStepContent.tsx`

Enforce-mode re-simulation step (only present in the steps array when simulation
returns auth entries).

[Stellar docs Method 2](https://developers.stellar.org/docs/build/guides/transactions/signing-soroban-invocations#how-it-works-1)
step 8 and
[CAP-71](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md):
attach signed auth entries and re-simulate in enforce mode to (1) verify auth
signatures are valid so the user knows auth is correct before committing a
fee-payer signature, and (2) obtain final resource data that
`assembleTransaction` needs to produce the correct XDR.

**What this step does:**

1. Takes the assembled XDR (with signed auth entries) from Zustand store
2. Runs `simulateTransaction` with `authMode: "enforce"` via `useSimulateTx`
3. On success: shows confirmation + final resource summary; calls
   `assembleTransaction(tx, enforceSimResult)` to produce the final XDR
4. On failure: shows error with details (invalid signature, expired entry,
   etc.) + "Back: Simulate transaction" to re-sign auth entries
5. Enables "Next: Sign transaction" when enforce sim passes

**Store updates needed:**

- Add `validateResult` (enforce-mode simulation result) to simulate state
- Store final assembled XDR for Sign step to consume

### Step 8: Add tracking events for auth signing

**Modify:** `src/metrics/tracking.ts`

Add events:

- `TRANSACTION_SIMULATE_AUTH_SIGN_SECRET_KEY`
- `TRANSACTION_SIMULATE_AUTH_SIGN_WALLET`
- `TRANSACTION_SIMULATE_AUTH_SIGN_HARDWARE`
- `TRANSACTION_SIMULATE_AUTH_VIEW_ENTRIES`
- `TRANSACTION_VALIDATE_AUTH_ENFORCE_SUCCESS`
- `TRANSACTION_VALIDATE_AUTH_ENFORCE_FAILURE`

---

## Part 2 Files Summary

| Action     | File                                                                     |
| ---------- | ------------------------------------------------------------------------ |
| **Create** | `src/helpers/sorobanAuthUtils.ts`                                        |
| **Create** | `src/components/SorobanAuthSigning/index.tsx`                            |
| **Create** | `src/components/SorobanAuthSigning/styles.scss`                          |
| **Create** | `src/components/SorobanAuthSigning/AuthEntryItem.tsx`                    |
| **Create** | `src/components/SorobanAuthSigning/AuthSignatureInput.tsx`               |
| **Create** | `src/app/(sidebar)/transaction/build/components/SimulateStepContent.tsx` |
| **Create** | `src/app/(sidebar)/transaction/build/components/SignStepContent.tsx`     |
| **Create** | `src/app/(sidebar)/transaction/build/components/ValidateStepContent.tsx` |
| **Create** | `src/app/(sidebar)/transaction/build/components/SubmitStepContent.tsx`   |
| **Modify** | `src/store/createStore.ts`                                               |
| **Modify** | `src/metrics/tracking.ts`                                                |

**Existing code to reuse:**

- `useSimulateTx` hook (`src/query/useSimulateTx.ts`) — already accepts
  `authMode` param
- `txHelper.secretKeySignature()` (`src/helpers/txHelper.ts`)
- `validate.getSecretKeyError()`, `validate.getBipPathError()` (`src/validate/`)
- `useSignWithExtensionWallet` hook (`src/hooks/useSignWithExtensionWallet.ts`)
- `MultiPicker` (`src/components/FormElements/MultiPicker.tsx`)
- `Tabs` component for signing method tabs
- Sign page `Overview.tsx` as reference for signing UI patterns (~1021 lines)
- `authorizeEntry()` and `assembleTransaction()` from `@stellar/stellar-sdk`
- Auth mode values already defined in `formComponentTemplateEndpoints.tsx`

## Part 2 Verification

1. **Simulate step**: Auth mode defaults to "record"; after simulation with auth
   entries: success alert, result viewer, auth signing card appear; "Sign all"
   and "Sign individually" modes work; entry badges update; signing method tabs
   work; "Next: Sign" advances to Sign step
2. **End-to-end**: Build → Simulate (record) → sign auth entries → Sign (tx
   envelope) → Validate (enforce passes) → Submit
3. **Step navigation**: Can click back to any completed step; form data
   preserved

---

# Part 3: Import Transaction

## Architecture

"Import transaction XDR" is a separate flow. It uses `"import"` as the first
step in place of `"build"`, with its **own Zustand store slice**. The step
arrays follow the same variants as the Build flow (see step variants table in
Architecture section). The stepper defaults to the Soroban variant until the
pasted XDR is parsed.

## Import Store

Add `transaction.import` to `createStore.ts`

```typescript
// inside the transaction: { ... } block
import: {
  importXdr: string;
  parsedTxType: "classic" | "soroban" | null;
  hasSignatures: boolean;
  parseError: string | null;
  activeStep: TransactionStepName;
  // actions
  updateImportXdr: (xdr: string) => void;
  setImportParsedType: (type: "classic" | "soroban" | null) => void;
  setImportActiveStep: (step: TransactionStepName) => void;
  resetImport: () => void;
};
```

`parsedTxType` drives which step array is active. `hasSignatures` affects the
footer next-step label and whether the Sign step pre-populates with existing
signatures.

## States

Once XDR is pasted, there are three possible states:

### Valid XDR without existing signatures

- Success alert at top
- Transaction info (parameters, operations) displayed in page body
- Stepper updates to correct variant based on `parsedTxType`
- **Footer**: derives next-step label from `steps` array:
  - Soroban → "Next: Simulate transaction"
  - Classic → "Next: Sign transaction"
  - Disabled until XDR parses successfully
- "Save transaction" icon button

### Valid XDR with existing signatures

- Success alert at top
- Transaction info displayed in page body
- Existing signatures shown in a signatures table
- Stepper reflects `parsedTxType`; Sign step is where additional signatures can
  be added (not a separate stepper node)
- **Footer**: "Next: Submit transaction" (skip directly to Submit) + "Add
  signature" + "Save transaction" icon button

### Invalid XDR

- Error alert at top with parse error details
- **Footer**: only a "Clear" button (returns to empty import input); no "Next"
  button since there is nothing valid to proceed with
- Stepper Import node shows a "!" error indicator

## Implementation Steps

### Step 1: Add `transaction.import` to `createStore.ts`

### Step 2: Create `ImportFlow` component

**New file:** `src/app/(sidebar)/transaction/import/components/ImportFlow.tsx`

Mirrors `BuildTransaction` (same two-column layout, same `useTransactionFlow`
hook) but uses the import store. Key differences:

- First step is `"import"` instead of `"build"`
- Steps derived from `parsedTxType` (from import store) instead of build store
- `initialStep` is always `"import"` (import flow always starts fresh)
- Renders `<ImportStepContent />` for the first step; all other step content
  components (`SimulateStepContent`, `ValidateStepContent`, `SignStepContent`,
  `SubmitStepContent`) are **shared** between both flows

### Step 3: Create `ImportStepContent` component

**New file:**
`src/app/(sidebar)/transaction/import/components/ImportStepContent.tsx`

The import-specific first step (renders when `activeStep === "import"`):

- `XdrPicker` input (from `src/components/FormElements/XdrPicker.tsx`) for XDR
  paste/input
- On change: parse with `validate.getXdrError()` +
  `TransactionBuilder.fromXDR()`
- On valid parse:
  - Detect tx type (Soroban vs Classic) → set `parsedTxType` in import store
  - Detect existing signatures → set `hasSignatures`
  - Show transaction info display (reuse `TransactionHashAndStatus` /
    `TransactionOperations` patterns from existing sign/submit pages)
  - Show signatures table if `hasSignatures`
- On invalid: set `parseError`, show error alert
- "Clear all" resets the import store

### Step 4: Create `/transaction/import` page

**New file:** `src/app/(sidebar)/transaction/import/page.tsx`

Same shell as `/transaction/build/page.tsx` but renders `<ImportFlow />` with
`activeTabHref="/transaction/import"`.

### Step 5: Add tracking events

**Modify:** `src/metrics/tracking.ts`

Add events:

- `TRANSACTION_IMPORT_XDR_PASTE`
- `TRANSACTION_IMPORT_XDR_VALID`
- `TRANSACTION_IMPORT_XDR_INVALID`
- `TRANSACTION_IMPORT_NEXT_SIMULATE`
- `TRANSACTION_IMPORT_NEXT_SIGN`
- `TRANSACTION_IMPORT_NEXT_SUBMIT`

## Import Files Summary

| Action     | File                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| **Create** | `src/app/(sidebar)/transaction/import/page.tsx`                         |
| **Create** | `src/app/(sidebar)/transaction/import/components/ImportFlow.tsx`        |
| **Reuses** | `src/hooks/useTransactionFlow.ts` (created in Part 1)                   |
| **Create** | `src/app/(sidebar)/transaction/import/components/ImportStepContent.tsx` |
| **Modify** | `src/store/createStore.ts` (wire import store into root store)          |
| **Modify** | `src/metrics/tracking.ts`                                               |
