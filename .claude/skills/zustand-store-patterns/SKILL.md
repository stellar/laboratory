---
name: zustand-store-patterns
description: Reference for the two Zustand store patterns in Stellar Lab — main store (querystring) and transaction flow store (sessionStorage). Invoke when creating store slices, debugging hydration, or deciding where state belongs.
---

# Zustand Store Patterns

## Two Stores, Two Purposes

| | Main Store | Transaction Flow Store |
|---|---|---|
| **File** | `src/store/createStore.ts` | `src/store/createTransactionFlowStore.ts` |
| **Hook** | `useStore()` | `useBuildFlowStore()` |
| **Middleware** | `querystring(immer(...))` | `persist(immer(...))` |
| **Persists to** | URL querystring | sessionStorage |
| **Survives tab close** | Yes (URL) | No |
| **Survives refresh** | Yes (URL) | Yes (sessionStorage) |
| **Instance type** | New per provider mount | Singleton (module-level) |
| **Used by** | Entire app (~85 files) | Transaction build flow (~21 files) |

## When to Use Which

**Main store** (`useStore`): For state that is app-wide, URL-shareable, or used
outside the transaction flow. Network settings, XDR viewer state, endpoint
explorer state, account page state.

**Flow store** (`useBuildFlowStore`): For state within the single-page
transaction flow. Build params, operations, simulation results, signed XDR, step
navigation. This state is too large for URLs (simulation results can be 50KB+).

**Cross-store reads**: Components in the transaction flow read `network` from
the main store as a read-only dependency. Never duplicate network config into
the flow store.

```typescript
export const SimulateStepContent = () => {
  const { network } = useStore();              // Main store — network only
  const { build, simulate } = useBuildFlowStore(); // Flow store — tx state
};
```

## Main Store Pattern

### Middleware stack

```typescript
create<Store>()(
  querystring(
    immer((set) => ({ ... })),
    {
      url: options.url,
      select() { /* what to persist in URL */ },
    }
  )
);
```

### Hydration

Synchronous — URL is passed at creation time in `StoreProvider`:

```typescript
// src/store/StoreProvider.tsx
const [store] = useState(() => createStore({ url }));
```

No manual rehydration needed. Store re-creates on route change.

### Consumption

Via React Context (because instance is dynamic):

```typescript
import { useStore } from "@/store/useStore";

const { network } = useStore();
const network = useStore((s) => s.network); // selector form
```

## Transaction Flow Store Pattern

### Middleware stack

```typescript
create<TransactionFlowStore>()(
  persist(
    immer((set) => ({ ... })),
    {
      name: "stellar_lab_tx_flow_build",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,  // CRITICAL
    }
  )
);
```

### Hydration — The Critical Gotcha

**Never rehydrate in `useEffect`.** Child effects fire before parent effects and
will write default state to sessionStorage, overwriting persisted data.

```typescript
// WRONG — don't do this
useEffect(() => {
  useBuildFlowStore.persist.rehydrate();
}, []);

// CORRECT — module-scope rehydration (runs before any component mounts)
if (typeof window !== "undefined") {
  useBuildFlowStore.persist.rehydrate();
}
```

This runs at **module load time**, before React renders anything. The
`skipHydration: true` flag prevents Zustand's automatic rehydration (which
happens too late).

### Consumption

Direct import (singleton, no context needed):

```typescript
import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

const { build, simulate, setActiveStep } = useBuildFlowStore();
```

### Storage keys

- `stellar_lab_tx_flow_build` — Build flow state
- `stellar_lab_tx_flow_import` — Import flow state (independent)

Each flow has its own store instance and sessionStorage key. Navigating between
Build and Import tabs does not clear the other's state.

## Adding New State

### To the main store

1. Add the field + action to `createStore.ts`
2. If it should persist in URL, add to the `select()` config
3. Consume via `useStore()`

### To the flow store

1. Add the field to the appropriate slice (`build`, `simulate`, `sign`,
   `validate`, `submit`)
2. Add setter action(s) using Immer's mutable syntax:
   ```typescript
   setSignedXdr: (xdr: string) =>
     set((state) => {
       state.sign.signedXdr = xdr;
     }),
   ```
3. Add to `INITIAL_STATE` with a sensible default
4. Add to reset logic if the field should clear when the user goes back to Build
5. Consume via `useBuildFlowStore()`

### Data conventions

- **XDR values**: Always store as base64 strings, never SDK objects
- **RPC results**: Store as raw JSON strings (`JSON.stringify(result)`)
- **Step navigation**: `activeStep` and `highestCompletedStep` are persisted —
  they survive refresh
- **Validation state**: Can only raise `highestCompletedStep`, never lower it
  (except on explicit reset)

## Error Handling for sessionStorage

All sessionStorage access must be wrapped in try-catch:

- **Write failure** (QuotaExceededError): Fall back to in-memory only
- **Read failure** (corrupted JSON): Reset to default state
- **Private mode**: sessionStorage works but clears on tab close (same behavior)

## Key Files

| Purpose | File |
|---------|------|
| Main store | `src/store/createStore.ts` |
| Main store hook | `src/store/useStore.ts` |
| Store provider | `src/store/StoreProvider.tsx` |
| Flow store | `src/store/createTransactionFlowStore.ts` |
| Root layout | `src/app/layout.tsx` |
