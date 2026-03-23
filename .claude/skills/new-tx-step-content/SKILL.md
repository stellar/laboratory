---
name: new-tx-step-content
description: Implementation guide for building a new step content component (Sign, Validate, Submit) in the single-page transaction flow. Invoke when creating or modifying any *StepContent component.
---

# New Transaction Step Content

## When to Use

Invoke this skill when:
- Creating a new step content component (SignStepContent, ValidateStepContent, SubmitStepContent)
- Modifying an existing step content component (SimulateStepContent)
- Wiring a step into the page layout

## Architecture

Each step content component is a **self-contained UI component** that:
1. **Reads** state from `useBuildFlowStore()`
2. **Writes** results back to the store via actions
3. Does **NOT** control navigation — the page calculates `isNextDisabled` and the footer handles Back/Next

```
Page (page.tsx)
├── determines steps[], isNextDisabled
├── renders active step content based on activeStep
├── TransactionFlowFooter (onNext, onBack, isNextDisabled)
└── TransactionStepper (steps, activeStep, highestCompletedStep)
```

## Component Template

```typescript
"use client";

import { useState } from "react";
import { Box } from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const [StepName]StepContent = () => {
  // 1. Cross-store: network from main store (read-only)
  const { network } = useStore();

  // 2. Flow store: step-specific state + actions
  const {
    build,
    [stepSlice],
    [setterActions],
  } = useBuildFlowStore();

  // 3. Local state for transient UI only (collapsed/expanded, tab selection)
  const [uiState, setUiState] = useState(initialValue);

  // 4. Action handlers — track event first, then call API, then write to store
  const onAction = async () => {
    trackEvent(TrackingEvent.TRANSACTION_[STEP]_[ACTION]);
    try {
      const result = await apiCall();
      setStoreField(result);
    } catch (e) {
      // Handle error
    }
  };

  return (
    <Box gap="md">
      {/* Step-specific UI */}
    </Box>
  );
};
```

## How isNextDisabled Works

The **page** (not the step content) calculates this by reading store state:

```typescript
// In page.tsx
const getIsNextDisabled = (): boolean => {
  if (activeStep === "build") {
    return isSoroban
      ? !(build.isValid.params && build.isValid.operations)
      : !currentXdr;
  }
  if (activeStep === "simulate") {
    return !simulate.simulationResultJson;
  }
  if (activeStep === "sign") {
    return !sign.signedXdr;
  }
  if (activeStep === "validate") {
    return !validate?.validatedXdr;
  }
  // submit step has no "Next" button
  return false;
};
```

When your step content writes a result to the store (e.g., `setSignedXdr(xdr)`), the page re-renders and `isNextDisabled` updates automatically.

## Store Data Model

Each step has a slice in `useBuildFlowStore()`:

| Step | Store slice | Key fields | Written by |
|------|------------|------------|------------|
| Build | `build` | `classic.xdr`, `soroban.xdr`, `isValid` | Params, ClassicOperation, SorobanOperation |
| Simulate | `simulate` | `simulationResultJson`, `authEntriesXdr`, `signedAuthEntriesXdr`, `assembledXdr` | SimulateStepContent |
| Sign | `sign` | `signedXdr` | SignStepContent |
| Validate | `validate` | `validatedXdr`, `validateResultJson` | ValidateStepContent |
| Submit | `submit` | `submitResultJson` | SubmitStepContent |

**Convention**: All XDR values are **base64 strings**. RPC results are **raw JSON strings**. Never store SDK object instances — parse lazily at point of use.

## Step-by-Step Implementation Checklist

### 1. Add store fields and actions (if not already present)
- Add fields to the step's slice in `createTransactionFlowStore.ts`
- Add setter actions (e.g., `setSignedXdr`, `setSubmitResult`)
- Add to `INITIAL_STATE` with sensible defaults
- Add to reset logic if applicable

### 2. Create the step content component
- File: `src/app/(sidebar)/transaction/build/components/[StepName]StepContent.tsx`
- Follow the component template above
- Read from `useBuildFlowStore()` for persisted state
- Read from `useStore()` for network config only
- Use `useState` only for transient UI state

### 3. Wire into page.tsx
- Add `{activeStep === "stepname" && <StepNameStepContent />}` to the render
- Add the step's `isNextDisabled` condition to `getIsNextDisabled()`
- Import the new component

### 4. Add tracking events
- Add new events to `TrackingEvent` enum in `src/metrics/tracking.ts`
- Convention: `TRANSACTION_[STEP]_[ACTION]` (e.g., `TRANSACTION_SIGN_SECRET_KEY_SUCCESS`)
- Call `trackEvent()` at the start of action handlers, before async operations

### 5. Commit progress
- After the component renders and basic functionality works, commit
- After store wiring and isNextDisabled logic works, commit
- After tracking events are added, commit

## Reference Components

| What you're building | Reference |
|---------------------|-----------|
| Sign step (4-tab: secret key, wallet, hardware, envelope) | `src/components/SignTransactionXdr/index.tsx` |
| Resource display | `src/app/(sidebar)/transaction/dashboard/components/ResourceProfiler.tsx` |
| Simulation result display | `src/app/(sidebar)/transaction/build/components/SimulateStepContent.tsx` |
| Submit + result display | `src/app/(sidebar)/transaction/submit/page.tsx` (legacy, reference only) |

## Complexity Guide

**Simple step** (SubmitStepContent — just a button + result display): implement directly, no subagents needed.

**Complex step** (SignStepContent — adapts existing SignTransactionXdr, wires auth + envelope signing): consider breaking into sub-tasks:
1. Basic component shell + store wiring
2. Adapt SignTransactionXdr integration
3. Handle edge cases (multi-sig, hardware wallets)
4. Tests

**Very complex step** (SimulateStepContent — simulation, auth extraction, auth signing cards, assembly): use subagents for independent sub-components, coordinate integration in the main agent.
