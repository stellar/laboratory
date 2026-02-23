# New Transaction Flow - Design Implementation

## Context

This document covers the new transaction flow redesign:

1. **Single-page transaction flow** - All 4 steps (Build, Simulate, Sign,
   Submit) on one page with a stepper
2. **Soroban Auth Entry Signing** - Sign authorization entries after simulation

**Figma Links:**

- Build page:
  https://www.figma.com/design/9j3YQ5URseAsn3j0tf2FFq/Laboratory?node-id=5698-142554&m=dev
- Auth signing:
  https://www.figma.com/design/9j3YQ5URseAsn3j0tf2FFq/Laboratory?node-id=5766-210139&m=dev
- Import page:
  https://www.figma.com/design/9j3YQ5URseAsn3j0tf2FFq/Laboratory?node-id=5766-236569&m=dev

## Architecture: Single-Page Flow

All transaction steps live on a **single page** (`/transaction/build`). The
stepper tracks which step is active and users can navigate back to any
previously completed step. Step content is conditionally rendered based on the
active step — no route changes between steps.

**The Simulate step is Soroban-only.** Classic transactions skip it entirely:

- **Soroban**: Build → Simulate → Sign → Submit (4 steps)
- **Classic**: Build → Sign → Submit (3 steps)

```
Soroban flow:                          Classic flow:
┌─────────────────────────┐            ┌─────────────────────────┐
│  ● 1. Build             │            │  ● 1. Build             │
│  ○ 2. Simulate          │            │  ○ 2. Sign              │
│  ○ 3. Sign              │            │  ○ 3. Submit            │
│  ○ 4. Submit            │            └─────────────────────────┘
└─────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│  /transaction/build                                         │
│                                                             │
│  [Tabs: New transaction | Import XDR]                       │
│                                                             │
│  ┌─────────────────────────────┐  ┌──────────────────────┐  │
│  │  Step content (left)        │  │ Stepper (right)      │  │
│  │                             │  │                      │  │
│  │  activeStep === "build"     │  │  ● 1. Build    ←     │  │
│  │    → <BuildContent />       │  │  ○ 2. Simulate *     │  │
│  │                             │  │  ○ 3. Sign           │  │
│  │  activeStep === "simulate"  │  │  ○ 4. Submit         │  │
│  │    → <SimulateContent />    │  │                      │  │
│  │    (Soroban only)           │  └──────────────────────┘  │
│  │                             │                            │
│  │  activeStep === "sign"      │                            │
│  │    → <SignContent />        │                            │
│  │                             │                            │
│  │  activeStep === "submit"    │                            │
│  │    → <SubmitContent />      │                            │
│  │                             │                            │
│  │  [← Back]    [Next →]       │                            │
│  └─────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

**Step state management:**

```typescript
type TransactionStepName = "build" | "simulate" | "sign" | "submit";
```

- `activeStep: TransactionStepName` — controls which content renders
- `highestCompletedStep: TransactionStepName | null` — tracks the furthest step
  reached (`null` when entering mid-flow via shared link)
- Step list depends on transaction type:
  - **Soroban**: `steps = ["build", "simulate", "sign", "submit"]`
  - **Classic**: `steps = ["build", "sign", "submit"]`
- Ordering is derived from position in the `steps` array:
  `const stepIndex = (s: TransactionStepName) => steps.indexOf(s)`
- Stepper only renders the applicable steps for the current transaction type
- "Next" advances to the next step in the applicable list and updates
  `highestCompletedStep`
- "Back" sets `activeStep` to previous step in the list (content is preserved in
  store)
- Clicking a completed step in the stepper sets `activeStep` to that step

**Shared link handling (MVP):**

When a user opens a link that targets a specific step (whether from a legacy
route or shared from the new flow), previous steps are **disabled** in the
stepper. This is both a practical and UX decision:

1. **URL length limit** — Persisting XDR for all completed steps in the URL
   would easily exceed browser URL limits (~2KB). Only the current step's XDR is
   included in the shared link. (@Iveta)
2. **Missing context** — The recipient doesn't have the intermediate state
   (build params, simulation result) that earlier steps produced.

Legacy routes (`/transaction/simulate`, `/transaction/sign`,
`/transaction/submit`) redirect to `/transaction/build?step=<step>&xdr=...`.

New-flow shared links use the `step` query param directly:

| URL                                        | Initial step | Previous steps           |
| ------------------------------------------ | ------------ | ------------------------ |
| `/transaction/build?xdr=...`               | `"build"`    | None                     |
| `/transaction/build?step=simulate&xdr=...` | `"simulate"` | Build disabled           |
| `/transaction/build?step=sign&xdr=...`     | `"sign"`     | Build, Simulate disabled |
| `/transaction/build?step=submit&xdr=...`   | `"submit"`   | All previous disabled    |

Legacy routes map to new-flow URLs:

| Legacy route                    | Redirects to                               |
| ------------------------------- | ------------------------------------------ |
| `/transaction/simulate?xdr=...` | `/transaction/build?step=simulate&xdr=...` |
| `/transaction/sign?xdr=...`     | `/transaction/build?step=sign&xdr=...`     |
| `/transaction/submit?xdr=...`   | `/transaction/build?step=submit&xdr=...`   |

When `step` is omitted, defaults to `"build"`.

This means `highestCompletedStep` starts at `null` (no previous steps
clickable), so the stepper only allows forward navigation from the entry point.
Users can start fresh to go through all steps from the beginning.

---

# Part 1: Build Step & Page Layout

## Screenshot Reference

The Figma design shows:

- **Tabs** at top: "New transaction" | "Import transaction XDR" (underline
  style)
- **Two-column layout**: form content (left, flex-1) + progress stepper (right,
  190px fixed)
- **Progress stepper**: 4 numbered steps connected by vertical lines
- **Title section**: "Build transaction" heading with "Clear all" link on right
- **Footer**: "Next: Simulate transaction" (disabled until valid) + "Save
  transaction" button

---

## Implementation Steps

### Step 1: Create `TransactionStepper` component

**New files:**

- `src/components/TransactionStepper/index.tsx`
- `src/components/TransactionStepper/styles.scss`

Reusable component showing transaction steps with:

- **State-driven** — no route navigation. Receives `steps`, `activeStep`, and
  `highestCompletedStep` as props
- **Dynamic step list**: Soroban = 4 steps (Build, Simulate, Sign, Submit);
  Classic = 3 steps (Build, Sign, Submit)
- Numbered circles (active: dark bg `--sds-clr-gray-12`, white text; completed:
  checkmark or filled; inactive: light border `--sds-clr-gray-06`)
- Vertical connector lines (24px height, 1px, `--sds-clr-gray-06`)
- A step is accessible if its index in `steps` is <= the index of
  `highestCompletedStep`. Accessible steps are clickable and call
  `onStepClick(stepName)`
- Future steps are visually disabled and not clickable
- Width: 190px

**Props:**

```typescript
{
  steps: TransactionStepName[];                          // e.g. ["build", "simulate", "sign", "submit"]
  activeStep: TransactionStepName;                       // current step
  highestCompletedStep: TransactionStepName | null;      // furthest step reached (null = none)
  onStepClick: (step: TransactionStepName) => void;
}
```

**No dependencies on:** `Routes`, `Link`, `usePathname` (purely presentational)

### Step 2: Create `ImportTransactionXdr` component (@TODO REMOVE)

**New file:**
`src/app/(sidebar)/transaction/build/components/ImportTransactionXdr.tsx`

Simple component with:

- Description text: "Paste a transaction envelope in XDR to import and continue
  the transaction flow."
- `XdrPicker` component (from `src/components/FormElements/XdrPicker.tsx`) for
  XDR input
- Validates with `validate.getXdrError()`
- Stores imported XDR value via callback prop (parent manages state)

### Step 3: Create `TransactionFlowFooter` component

**New file:**
`src/app/(sidebar)/transaction/build/components/TransactionFlowFooter.tsx`

Shared footer for all steps. Content changes based on `activeStep` and
transaction type:

**Soroban transactions** (4 steps):

| Step     | Back button                  | Next button                                                                  | Extra                          |
| -------- | ---------------------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| Build    | —                            | "Next: Simulate transaction" (disabled until valid XDR)                      | "Save transaction" icon button |
| Simulate | "Back: Build transaction"    | "Next: Sign transaction" (disabled until simulation + auth signing complete) | "Save transaction" icon button |
| Sign     | "Back: Simulate transaction" | "Next: Submit transaction" (disabled until signed)                           | "Save transaction" icon button |
| Submit   | "Back: Sign transaction"     | — (submit button is in the step content)                                     | "Save transaction" icon button |

**Classic transactions** (3 steps — no Simulate):

| Step   | Back button               | Next button                                         | Extra                          |
| ------ | ------------------------- | --------------------------------------------------- | ------------------------------ |
| Build  | —                         | "Next: Sign transaction" (disabled until valid XDR) | "Save transaction" icon button |
| Sign   | "Back: Build transaction" | "Next: Submit transaction" (disabled until signed)  | "Save transaction" icon button |
| Submit | "Back: Sign transaction"  | — (submit button is in the step content)            | "Save transaction" icon button |

The footer derives button labels from the `steps` array (next/previous step
names), so it adapts automatically.

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

- "Next" calls `onNext` which advances step state in parent
- "Back" calls `onBack` which sets `activeStep` to previous step
- No router navigation — purely state-driven

**Save transaction (all steps):**

> **@TODO:** Decide what state to persist on save. Two options under
> consideration:
>
> **A. Save build state only** — always restore to Build step. Simple, no
> stale-state issues. Simulation/signing is fast to redo.
>
> **B. Save full flow state** — restore to saved step, but mark simulation as
> stale on load (require re-simulate before proceeding).
>
> Pending confirmation on approach before implementing.

The "Save transaction" button is available on **every step**, not just Build.
Unlike URL sharing (which is limited to a single step's XDR), localStorage has
no size constraint.

**Reuses:** `SaveToLocalStorageModal` pattern from `ClassicOperation.tsx:544`,
`localStorageSavedTransactions` helper

### Step 4: Create page-level styles

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

### Step 5: Refactor main `page.tsx` as single-page flow

**Modify:** `src/app/(sidebar)/transaction/build/page.tsx`

This page now orchestrates all 4 steps. `activeStep` lives in the Zustand
transaction store and is synced to the `?step=` query param via
`zustand-querystring`. `highestCompletedStep` is local state (session-only, not
URL-persisted).

New structure:

```typescript
type TransactionStepName = "build" | "simulate" | "sign" | "submit";

// activeStep comes from Zustand store (synced to ?step= via zustand-querystring)
const { activeStep, setActiveStep } = useStore(transactionStore);

// Steps depend on transaction type (Soroban includes Simulate, Classic does not)
const isSoroban = /* derived from transaction type in store */;
const steps: TransactionStepName[] = isSoroban
  ? ["build", "simulate", "sign", "submit"]
  : ["build", "sign", "submit"];

// Helper: get index of a step in the current steps array
const stepIndex = (s: TransactionStepName) => steps.indexOf(s);

// highestCompletedStep is local — not in URL, not shareable
const [highestCompletedStep, setHighestCompletedStep] = useState<TransactionStepName | null>(
  activeStep === "build" ? "build" : null  // null = shared link, previous steps disabled
);

const handleNext = () => {
  const nextIdx = stepIndex(activeStep) + 1;
  if (nextIdx < steps.length) {
    const nextStep = steps[nextIdx];
    setActiveStep(nextStep);
    if (!highestCompletedStep || stepIndex(nextStep) > stepIndex(highestCompletedStep)) {
      setHighestCompletedStep(nextStep);
    }
  }
};
const handleBack = () => {
  const prevIdx = stepIndex(activeStep) - 1;
  if (prevIdx >= 0) setActiveStep(steps[prevIdx]);
};
const handleStepClick = (step: TransactionStepName) => {
  if (highestCompletedStep && stepIndex(step) <= stepIndex(highestCompletedStep)) {
    setActiveStep(step);
  }
};

<div className="TransactionFlow">
  {activeStep === "build" && (
    <Tabs tabs={["New transaction", "Import transaction XDR"]}
          activeTabId={activeTab} addlClassName="Tab--with-border" />
  )}

  <div className="TransactionFlow__layout">
    <div className="TransactionFlow__content">
      {activeStep === "build" && <BuildStepContent tab={activeTab} />}
      {activeStep === "simulate" && <SimulateStepContent />}
      {activeStep === "sign" && <SignStepContent />}
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
</div>
```

- Tab state managed with `useState`
- `currentXdr` derived from `transaction.build.classic.xdr` or
  `transaction.build.soroban.xdr`
- Each step's content is extracted into its own component (see below)
- Transaction data flows between steps via Zustand store (XDR, simulation
  result, signed XDR)
- **Shared links & legacy routes:** When a user opens a link targeting a
  mid-flow step (e.g., `/transaction/build?step=sign&xdr=...` or legacy
  `/transaction/sign?xdr=...`), the page opens at that step with previous steps
  disabled. Only the current step's XDR is in the URL to avoid hitting browser
  URL length limits. Legacy routes redirect to `/transaction/build`.

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
- Keep "Add operation", save icon button, and share URL button

**Modify:**
`src/app/(sidebar)/transaction/build/components/SorobanOperation.tsx`

- Remove "Clear operation" button (replaced by page-level "Clear all")

### Step 8: Add tracking events

**Modify:** `src/metrics/tracking.ts`

Add events:

- `TRANSACTION_BUILD_CLEAR_ALL` - for the new "Clear all" action
- `TRANSACTION_BUILD_TAB_CHANGE` - for tab switching
- `TRANSACTION_BUILD_NEXT_SIMULATE` - for the "Next: Simulate" button

---

## Part 1 Files Summary

| Action     | File                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| **Create** | `src/components/TransactionStepper/index.tsx`                              |
| **Create** | `src/components/TransactionStepper/styles.scss`                            |
| **Create** | `src/app/(sidebar)/transaction/build/components/ImportTransactionXdr.tsx`  |
| **Create** | `src/app/(sidebar)/transaction/build/components/TransactionFlowFooter.tsx` |
| **Create** | `src/app/(sidebar)/transaction/build/styles.scss`                          |
| **Modify** | `src/app/(sidebar)/transaction/build/page.tsx` (single-page orchestrator)  |
| **Modify** | `src/app/(sidebar)/transaction/build/components/Params.tsx`                |
| **Modify** | `src/app/(sidebar)/transaction/build/components/ClassicOperation.tsx`      |
| **Modify** | `src/app/(sidebar)/transaction/build/components/SorobanOperation.tsx`      |
| **Modify** | `src/metrics/tracking.ts`                                                  |

## Part 1 Verification

- Tab switching between "New transaction" and "Import transaction XDR"
- Two-column layout with stepper on right
- "Clear all" resets both params and operations
- "Next: Simulate" advances to Simulate step (same page, no route change)
- "Back: Build transaction" returns to Build step with form data preserved
- Stepper highlights active step; completed steps are clickable
- Clicking a completed step in stepper navigates back to that step
- "Save transaction" opens save modal (available on every step @TODO)
- Loading a saved transaction restores full flow state and step position
- Responsive: stepper hides on narrow screens

---

# Part 2: Soroban Auth Entry Signing

## Context

When a Soroban transaction is simulated with `record` auth mode, the RPC
response may contain `SorobanAuthorizationEntry` values that require signing
before submission. This feature adds auth entry signing UI to the **Simulate
step** (step 2 of the single-page flow), between the simulation result display
and the footer navigation to the Sign step.

## Flow

All steps happen on the same page (`/transaction/build`), driven by the stepper:

```
Step 1: Build -> Step 2: Simulate (with record auth mode)
                           | simulation returns auth entries
                           v
                          Show auth signing UI in Simulate step
                           | user signs auth entries
                           v
                 Step 3: Sign (sign the tx envelope)
                           |
                           v
                 Step 4: Submit
```

Users can click back to any previously completed step at any time.

## Simulate Step: Auth Entries Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Simulate Step (activeStep === 1)                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Transaction XDR input                                     │  │
│  │ Auth mode: [record ▼]  (default for Soroban, overridable) │  │
│  │ Instruction leeway: [optional]                            │  │
│  │                                      [Simulate] button    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│                    useSimulateTx(authMode: "record")            │
│                    POST simulateTransaction to RPC              │
│                              │                                  │
│                   ┌──────────┴──────────┐                       │
│                   │                     │                       │
│                   ▼                     ▼                       │
│           No auth entries        Auth entries found             │
│           (normal flow)          in results[].auth[]            │
│                   │                     │                       │
│                   ▼                     ▼                       │
│  ┌────────────────────┐  ┌──────────────────────────────────┐  │
│  │ Show result JSON   │  │ ┌ Success Alert ───────────────┐ │  │
│  │ Next: Sign tx ->   │  │ │ "Transaction simulation      │ │  │
│  └────────────────────┘  │ │  successful" + auth entries   │ │  │
│                          │ │  need validation message      │ │  │
│                          │ └──────────────────────────────-┘ │  │
│                          │                                    │  │
│                          │ ┌ Simulated Result ─────────────┐ │  │
│                          │ │ JSON code viewer (RPC response)│ │  │
│                          │ └───────────────────────────────-┘ │  │
│                          │                                    │  │
│                          │ [View resource usage and fees ▼]   │  │
│                          │                                    │  │
│                          │ ┌ Auth Signing Card ────────────┐ │  │
│                          │ │                                │ │  │
│                          │ │ "N authorization entries       │ │  │
│                          │ │  detected"    [View auth ▲]    │ │  │
│                          │ │───────────────────────────────-│ │  │
│                          │ │                                │ │  │
│                          │ │ (●) Sign all  ( ) Individually │ │  │
│                          │ │                                │ │  │
│                          │ │ ┌ Entry #1 [Unsigned] ──── ▼ ┐│ │  │
│                          │ │ └────────────────────────────┘│ │  │
│                          │ │ ┌ Entry #2 [Unsigned] ──── ▼ ┐│ │  │
│                          │ │ └────────────────────────────┘│ │  │
│                          │ │                                │ │  │
│                          │ │ Signatures (i)                 │ │  │
│                          │ │ [Secret key 0] [Wallet 0]      │ │  │
│                          │ │ [Hardware 0]  [Envelope 0]     │ │  │
│                          │ │                                │ │  │
│                          │ │ ┌─ Secret key input ─────────┐│ │  │
│                          │ │ │ [S... or hex]  [Use key ▼] ││ │  │
│                          │ │ │ [Add additional]  [Sign]   ││ │  │
│                          │ │ └────────────────────────────┘│ │  │
│                          │ └────────────────────────────────┘ │  │
│                          │                                    │  │
│                          │              │                     │  │
│                          │    user signs all entries           │  │
│                          │              │                     │  │
│                          │              ▼                     │  │
│                          │  assembleTransaction(tx, simResult) │  │
│                          │  Attach signed auth + resource data │  │
│                          │              │                     │  │
│                          │              ▼                     │  │
│                          │  [Next: Sign transaction ->]       │  │
│                          │  Advances to Sign step (step 3)    │  │
│                          │  Assembled XDR stored in Zustand    │  │
│                          └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (same page, step changes)
┌─────────────────────────────────────────────────────────────────┐
│  Sign Step (activeStep === 2)                                   │
│  Sign the transaction envelope (source account signature)       │
│  -> Next: Submit step                                           │
└─────────────────────────────────────────────────────────────────┘
```

### "Sign individually" mode detail

```
When user selects "Sign individually":
Each entry expands to show its own signing UI

┌ Entry #1 [Unsigned] ────────────────────── ▲ ┐
│  Signatures (i)                               │
│  [Secret key 0] [Wallet 0] [HW 0] [Env 0]    │
│  ┌─ Sign with secret key ──────────────────┐  │
│  │ [S... or hex preimage]   [Use key ▼]    │  │
│  │ [Add additional]  [Sign]                │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
┌ Entry #2 [Unsigned] ────────────────────── ▲ ┐
│  (different key can be used here)             │
│  [Secret key 0] [Wallet 0] [HW 0] [Env 0]    │
│  ┌─ Sign with secret key ──────────────────┐  │
│  │ [S... or hex preimage]   [Use key ▼]    │  │
│  │ [Add additional]  [Sign]                │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

## Design (from Figma)

After successful simulation, the page shows:

1. **Success alert** (green) - "Transaction simulation successful" + "This
   transaction contains **authorization entries** that need to be validated
   before submitting."
2. **Simulated result** - JSON code viewer with RPC response
3. **"View resource usage and fees(simulated)"** - collapsible section
4. **Auth entries signing card** (white card, border, rounded):
   - **Header section** (px-24 py-16):
     - "This transaction requires additional authorization signatures" (medium,
       14px)
     - "2 authorization entries detected" (regular, 14px, gray)
     - "View auth entries" button with chevron (right-aligned, bordered)
   - **Signing section** (border-top, p-24):
     - **Radio group**: "Sign all entries" (selected) | "Sign individually"
     - **Entry list** (collapsible accordion items):
       - "Entry #1 [Unsigned badge]" with chevron
       - "Entry #2 [Unsigned badge]" with chevron
     - **Signatures label** with info icon
     - **Signing method tabs** (underline style with count badges):
       - "Add secret key 0" | "Wallet extension 0" | "Hardware wallet 0" |
         "Transaction envelope 0"
     - **Secret key input area** (gray bg section):
       - Label: "Sign with secret key"
       - Input: placeholder "Secret key (starting with S) or hash preimage (in
         hex)"
       - Eye-off icon for masking
       - "Use secret key" button (attached right)
       - "Add additional" + "Sign" buttons below

## Implementation Steps

### Step 9: Add auth mode to Simulate step

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

### Step 10: Parse auth entries from simulation response

**New file:** `src/helpers/sorobanAuthUtils.ts`

Helper functions:

- `extractAuthEntries(simulationResult)` - Parse `results[].auth[]` from RPC
  response, returns `SorobanAuthorizationEntry[]` XDR objects
- `getAuthEntryInfo(entry: xdr.SorobanAuthorizationEntry)` - Extract
  human-readable info (credentials type, contract ID, function name)
- `isAuthRequired(simulationResult)` - Check if response contains auth entries
  that need signing

**Reuses:** `@stellar/stellar-sdk` xdr types, `SorobanAuthorizationEntry`

### Step 11: Create `SorobanAuthSigningCard` component

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

### Step 12: Create `AuthEntryItem` component

**New file:** `src/components/SorobanAuthSigning/AuthEntryItem.tsx`

Collapsible accordion item for a single auth entry:

- Header: "Entry #N" + status badge ("Unsigned" / "Signed")
- Expand/collapse with chevron icon
- When expanded: show auth entry details (credentials, contract, function)

### Step 13: Create `AuthSignatureInput` component

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

### Step 14: Wire auth signing into Simulate step

**Modify:**
`src/app/(sidebar)/transaction/build/components/SimulateStepContent.tsx`

After simulation succeeds and auth entries are detected:

1. Show success alert with auth entry message
2. Show simulation result JSON viewer
3. Show "View resource usage and fees" collapsible
4. Render `<SorobanAuthSigningCard>` with extracted auth entries
5. On auth entries signed: use `assembleTransaction(tx, simulationResult)` from
   `@stellar/stellar-sdk` to rebuild the transaction with signed auth entries
   and resource data attached
6. Set step as "valid" so the footer's "Next: Sign transaction" button enables →
   parent advances to Sign step

**Store updates needed:**

- Add `authEntries: xdr.SorobanAuthorizationEntry[]` to simulate state
- Add `signedAuthEntries: xdr.SorobanAuthorizationEntry[]` to simulate state
- Add `assembledXdr: string` for rebuilt transaction XDR with signed auth
- Store updated transaction XDR (with signed auth) for the Sign step to consume

### Step 15: Add tracking events for auth signing

**Modify:** `src/metrics/tracking.ts`

Add events:

- `TRANSACTION_SIMULATE_AUTH_SIGN_SECRET_KEY`
- `TRANSACTION_SIMULATE_AUTH_SIGN_WALLET`
- `TRANSACTION_SIMULATE_AUTH_SIGN_HARDWARE`
- `TRANSACTION_SIMULATE_AUTH_VIEW_ENTRIES`

---

## Auth Signing Files Summary

| Action     | File                                                                     |
| ---------- | ------------------------------------------------------------------------ |
| **Create** | `src/helpers/sorobanAuthUtils.ts`                                        |
| **Create** | `src/components/SorobanAuthSigning/index.tsx`                            |
| **Create** | `src/components/SorobanAuthSigning/styles.scss`                          |
| **Create** | `src/components/SorobanAuthSigning/AuthEntryItem.tsx`                    |
| **Create** | `src/components/SorobanAuthSigning/AuthSignatureInput.tsx`               |
| **Create** | `src/app/(sidebar)/transaction/build/components/SimulateStepContent.tsx` |
| **Create** | `src/app/(sidebar)/transaction/build/components/SignStepContent.tsx`     |
| **Create** | `src/app/(sidebar)/transaction/build/components/SubmitStepContent.tsx`   |
| **Modify** | `src/store/createStore.ts`                                               |
| **Modify** | `src/metrics/tracking.ts`                                                |

## Auth Signing Existing Code to Reuse

- `useSimulateTx` hook - already accepts `authMode` param
  (`src/query/useSimulateTx.ts`)
- `txHelper.secretKeySignature()` pattern (`src/helpers/txHelper.ts`)
- `validate.getSecretKeyError()`, `validate.getBipPathError()` (`src/validate/`)
- `useSignWithExtensionWallet` hook pattern
  (`src/hooks/useSignWithExtensionWallet.ts`)
- `MultiPicker` for multiple inputs
  (`src/components/FormElements/MultiPicker.tsx`)
- `Tabs` component for signing method tabs
- Sign page Overview.tsx as reference for signing UI patterns (~1021 lines)
- `@stellar/stellar-sdk` `authorizeEntry()` for signing auth entries
- `assembleTransaction()` from `@stellar/stellar-sdk` for rebuilding transaction
- Auth mode values already defined in `formComponentTemplateEndpoints.tsx`

## Auth Signing Verification

1. `pnpm lint:ts` / `pnpm lint` / `pnpm test:unit` - all pass
2. **Simulate step**:
   - Auth mode defaults to "record" for Soroban transactions
   - After simulation with auth entries: success alert, result viewer, auth
     signing card appear
   - "Sign all entries" signs all auth entries with provided key
   - "Sign individually" shows per-entry signing UI with different keys per
     entry
   - Entry badges update from "Unsigned" to "Signed"
   - Signing method tabs work (secret key, wallet, hardware, envelope)
   - After signing: "Next: Sign transaction" advances to Sign step (same page)
3. **End-to-end (single page)**: Build step -> Simulate step (record) -> Sign
   auth entries -> Sign tx envelope -> Submit step
4. **Step navigation**: Can click back to Build or Simulate step via stepper
   after reaching Sign step; form data is preserved

---

## Design Decisions (Resolved)

- **"Sign all entries"** = One signing input, applies the same key to all auth
  entries at once
- **"Sign individually"** = Each entry gets its own separate signing
  input/section, so different keys can be used for different entries (e.g.,
  entry #1 signed by key A, entry #2 signed by key B)
- **Transaction rebuild** = Use `assembleTransaction(tx, simulationResult)` from
  `@stellar/stellar-sdk` to attach signed auth entries and resource data
- **Auth signing UI location** = Directly in the Simulate step, below simulation
  results. Auth signing cannot be deferred to the Sign step because:
  1. **Auth entries are produced by simulation** — Recording Mode simulation
     returns the `SorobanAuthorizationEntry` objects that need signing; they
     don't exist before simulation runs.
  2. **`assembleTransaction` must happen before Sign step** — After auth entries
     are signed, `assembleTransaction(tx, simulationResult)` attaches the signed
     auth + resource data to produce the final transaction XDR. The Sign step
     then signs this assembled transaction envelope — a completely different
     operation.
  3. **Short expiration window** — Auth entry signatures expire after ~12–60
     ledgers (~1–5 minutes). Delaying auth signing to a later step risks
     expiration before submission.
- **Two distinct signing operations** (per
  [Stellar docs](https://developers.stellar.org/docs/build/guides/transactions/signing-soroban-invocations)):
  - **Auth entry signatures** (Method 2 / `authorizeEntry`) — authorize the
    specific contract invocation; produced at the Simulate step
  - **Transaction envelope signature** (Method 1) — authorizes the transaction
    submission; produced at the Sign step by signing the assembled XDR
- **Auth mode default** = `"record"` for Soroban transactions, with advanced
  override dropdown
- **Post-auth flow** = After signing auth entries → `assembleTransaction` →
  advance to Sign step (same page) to sign the assembled transaction envelope
- **Single-page architecture** = All steps on one page (`/transaction/build`),
  no route changes between steps. Users can navigate back to any completed step
  via the stepper.
- **Simulate is Soroban-only** = Classic transactions have 3 steps (Build → Sign
  → Submit). Soroban transactions have 4 steps (Build → Simulate → Sign →
  Submit). The stepper and footer adapt dynamically based on transaction type.
- **Save vs Share** = URL sharing only includes the current step's XDR (URL
  length limit). localStorage save captures the full flow state across all
  steps, enabling complete restore with all previous steps accessible.

---

# Part 3: Import Transaction
