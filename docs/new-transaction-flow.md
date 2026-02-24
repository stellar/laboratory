# New Transaction Flow - Design Implementation

## Context

This document covers the new transaction flow redesign:

1. **Single-page transaction flow** - All 5 steps for Soroban (Build, Simulate,
   Validate, Sign, Submit) or 3 steps for Classic (Build, Sign, Submit) on one
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
conditionally rendered based on the active step — the `?step=` URL param updates
but there is no page navigation or reload between steps within a flow.

### Step variants

The Simulate step is Soroban-only. The Validate step is Soroban-only and
conditional — it only appears when the simulation returns auth entries that
require signing. The steps array updates dynamically after simulation completes.

| Variant                      | Build flow steps                                      | Import flow steps (replaces `"build"` with `"import"`) |
| ---------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| **Classic**                  | `["build", "sign", "submit"]`                         | `["import", "sign", "submit"]`                         |
| **Soroban, no auth entries** | `["build", "simulate", "sign", "submit"]`             | `["import", "simulate", "sign", "submit"]`             |
| **Soroban, auth entries**    | `["build", "simulate", "validate", "sign", "submit"]` | `["import", "simulate", "validate", "sign", "submit"]` |

```
Soroban (auth entries):     Soroban (no auth):   Classic:
┌───────────────────────┐   ┌───────────────┐   ┌───────────────┐
│  ● 1. Build           │   │ ● 1. Build.   │   │  ● 1. Build   │
│  ○ 2. Simulate        │   │ ○ 2. Simulate │   │  ○ 2. Sign    │
│  ○ 3. Validate        │   │ ○ 3. Sign     │   │  ○ 3. Submit  │
│  ○ 4. Sign            │   │ ○ 4. Submit   │   └───────────────┘
│  ○ 5. Submit          │   └───────────────┘
└───────────────────────┘
```

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
│  │                             │  │  ○ 3. Validate *†    │  │
│  │  activeStep === "simulate"  │  │  ○ 4. Sign           │  │
│  │    → <SimulateContent />    │  │  ○ 5. Submit         │  │
│  │    (Soroban only)           │  │  (* Soroban only)    │  │
│  │                             │  │  († only if auth     │  │
│  │                             │  │     entries present) │  │
│  │                             │  └──────────────────────┘  │
│  │                             │                            │
│  │  activeStep === "validate"  │                            │
│  │    → <ValidateContent />    │                            │
│  │    (Soroban, auth only)     │                            │
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
  reached (`null` when entering mid-flow via shared link)
- **Build flow and Import flow each own their own `steps` array** — they live on
  separate routes (`/transaction/build` → `BuildFlow`; `/transaction/import` →
  `ImportFlow`). Each `page.tsx` is self-contained.
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

### Shared link handling (MVP)

When a user opens a link that targets a specific step (whether from a legacy
route or shared from the new flow), previous steps are **disabled** in the
stepper. This is both a practical and UX decision:

1. **URL length limit** — Persisting XDR for all completed steps in the URL
   would easily exceed browser URL limits (~2KB). Only the current step's XDR is
   included in the shared link.
2. **Missing context** — The recipient doesn't have the intermediate state
   (build params, simulation result) that earlier steps produced.

Legacy routes (`/transaction/simulate`, `/transaction/sign`,
`/transaction/submit`) redirect to `/transaction/build?step=<step>&xdr=...`.

New-flow shared links use the `step` query param directly:

| URL                                        | Initial step | Previous steps                     |
| ------------------------------------------ | ------------ | ---------------------------------- |
| `/transaction/build?xdr=...`               | `"build"`    | None                               |
| `/transaction/build?step=simulate&xdr=...` | `"simulate"` | Build disabled                     |
| `/transaction/build?step=validate&xdr=...` | `"validate"` | Build, Simulate disabled           |
| `/transaction/build?step=sign&xdr=...`     | `"sign"`     | Build, Simulate, Validate disabled |
| `/transaction/build?step=submit&xdr=...`   | `"submit"`   | All previous disabled              |

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

### Save vs Share

URL sharing only includes the current step's XDR (URL length limit).
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

| Step     | Back button                  | Next button                                                          | Extra                          |
| -------- | ---------------------------- | -------------------------------------------------------------------- | ------------------------------ |
| Build    | —                            | "Next: Simulate transaction" (disabled until valid XDR)              | "Save transaction" icon button |
| Simulate | "Back: Build transaction"    | "Next: Validate" (disabled until simulation + auth signing complete) | N/A                            |
| Validate | "Back: Simulate transaction" | "Next: Sign transaction" (disabled until enforce sim passes)         | N/A                            |
| Sign     | "Back: Validate"             | "Next: Submit transaction" (disabled until signed)                   | N/A                            |
| Submit   | "Back: Sign transaction"     | — (submit button is in the step content)                             | N/A                            |

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

Shared hook used by both `BuildFlow` and `ImportFlow` to eliminate duplicated
step navigation logic.

### Step 5: Refactor main `page.tsx` as single-page flow

**Modify:** `src/app/(sidebar)/transaction/build/page.tsx`

This page now owns the Build flow end-to-end. `activeStep` lives in the Zustand
transaction store and is synced to the `?step=` query param via
`zustand-querystring`. `highestCompletedStep` is local state (session-only, not
URL-persisted).

New structure — `page.tsx` renders `<BuildFlow />` directly; the `<Tabs />`
component contains nav links, not local state:

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
  <BuildFlow />
</div>
```

**`BuildFlow` component** (new file `BuildFlow.tsx`) owns all build-specific
step logic. Step navigation is handled by `useTransactionFlow`:

```typescript
// BuildFlow.tsx
const { activeStep, setActiveStep } = useStore(transactionStore);
const isSoroban = /* derived from transaction type in build store */;
const hasAuthEntries = /* derived from simulation result in store */;
const steps: TransactionStepName[] = isSoroban
  ? hasAuthEntries
    ? ["build", "simulate", "validate", "sign", "submit"]
    : ["build", "simulate", "sign", "submit"]
  : ["build", "sign", "submit"];

const { highestCompletedStep, stepIndex, handleNext, handleBack, handleStepClick } =
  useTransactionFlow({
    steps,
    activeStep,
    setActiveStep,
    initialStep: activeStep === "build" ? "build" : null,
    //           ^ null = opened via shared link; previous steps disabled
  });

<div className="TransactionFlow__layout">
  <div className="TransactionFlow__content">
    {activeStep === "build" && <BuildStepContent />}
    {activeStep === "simulate" && <SimulateStepContent />}
    {activeStep === "validate" && <ValidateStepContent />}
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
- Keep "Add operation", save icon button, and share URL button

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

| Action     | File                                                                          |
| ---------- | ----------------------------------------------------------------------------- |
| **Create** | `src/hooks/useTransactionFlow.ts`                                             |
| **Create** | `src/components/TransactionStepper/index.tsx`                                 |
| **Create** | `src/components/TransactionStepper/styles.scss`                               |
| **Modify** | `src/components/Tabs/index.tsx` (add optional `href` mode for nav-link tabs)  |
| **Create** | `src/app/(sidebar)/transaction/build/components/BuildFlow.tsx`                |
| **Create** | `src/app/(sidebar)/transaction/build/components/TransactionFlowFooter.tsx`    |
| **Create** | `src/app/(sidebar)/transaction/build/styles.scss`                             |
| **Modify** | `src/app/(sidebar)/transaction/build/page.tsx` (renders BuildFlow + nav tabs) |
| **Modify** | `src/app/(sidebar)/transaction/build/components/Params.tsx`                   |
| **Modify** | `src/app/(sidebar)/transaction/build/components/ClassicOperation.tsx`         |
| **Modify** | `src/app/(sidebar)/transaction/build/components/SorobanOperation.tsx`         |
| **Modify** | `src/metrics/tracking.ts`                                                     |

## Part 1 Verification

- Tab navigation between Build and Import pages works
- Two-column layout with stepper on right; stepper hides on narrow screens
- "Clear all" resets both params and operations
- "Next: Simulate" advances to Simulate step (same page — URL updates to
  `?step=simulate`, no page reload)
- "Back: Build transaction" returns to Build step with form data preserved
- Stepper highlights active step; completed steps are clickable, future steps
  are not
- "Save transaction" opens save modal (available on Build)
- Loading a saved transaction restores full flow state and step position

---

# Part 2: Soroban Auth Entry Signing

## Context

When a Soroban transaction is simulated with `record` auth mode, the RPC
response may contain `SorobanAuthorizationEntry` values that require signing
before submission. This feature adds auth entry signing UI to the **Simulate
step** (step 2 of the single-page Soroban flow), between the simulation result
display and the footer navigation to the Validate step.

Auth signing lives in the Simulate step (not deferred to the Sign step) because:

1. **Auth entries are produced by simulation** — they don't exist before
   simulation runs
2. **`assembleTransaction` must happen before Sign step** — after auth entries
   are signed, `assembleTransaction(tx, simulationResult)` attaches the signed
   auth + resource data to produce the final XDR. The Sign step then signs this
   assembled envelope — a completely different operation
3. **Short expiration window** — auth entry signatures expire after ~12–60
   ledgers (~1–5 minutes)

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
                 Step 3: Validate (enforce-mode re-simulation)
                           | verifies auth signatures are valid
                           | returns final resource data (CAP-71)
                           | assembleTransaction(tx, enforceSimResult)
                           v
                 Step 4: Sign (sign the assembled tx envelope)
                           |
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
│                          │  [Next: Validate ->]                │  │
│                          │  Advances to Validate step (step 3) │  │
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
6. Set step as "valid" so the footer's "Next: Validate" button enables

**Store updates needed:**

- Add `authEntries: xdr.SorobanAuthorizationEntry[]` to simulate state
- Add `signedAuthEntries: xdr.SorobanAuthorizationEntry[]` to simulate state
- Add `assembledXdr: string` for rebuilt transaction XDR with signed auth

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
   work; "Next: Validate" advances to Validate step
2. **End-to-end**: Build → Simulate (record) → sign auth entries → Validate
   (enforce passes) → Sign (tx envelope) → Submit
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
- **Footer**: "Next: Submit transaction" (skip directly to Submit) + "Save
  transaction" icon button
- Users who want to add more signatures can click Back from Submit to reach the
  Sign step

### Invalid XDR

- Error alert at top with parse error details
- **Footer**: only a "Clear" button (returns to empty import input); no "Next"
  button since there is nothing valid to proceed with
- Stepper Import node shows a "!" error indicator

## Implementation Steps

### Step 1: Add `transaction.import` to `createStore.ts`

### Step 2: Create `ImportFlow` component

**New file:** `src/app/(sidebar)/transaction/import/components/ImportFlow.tsx`

Mirrors `BuildFlow` (same two-column layout, same `useTransactionFlow` hook) but
uses the import store. Key differences:

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
