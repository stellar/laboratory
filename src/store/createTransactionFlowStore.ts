import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { TransactionStepName } from "@/components/TransactionStepper";

// ============================================================================
// Types
// ============================================================================

interface TransactionFlowState {
  // Step navigation
  activeStep: TransactionStepName;
  highestCompletedStep: TransactionStepName | null;

  // Build / Import step output
  buildXdr: string;

  // Simulate step output
  simulationResultJson: string;
  authEntriesXdr: string[];
  signedAuthEntriesXdr: string[];

  // Sign step output
  assembledXdr: string;
  signedXdr: string;

  // Validate step output
  validateResultJson: string;
}

interface TransactionFlowActions {
  /** Set the active step (for stepper click / back navigation). */
  setActiveStep: (step: TransactionStepName) => void;

  /**
   * Advance to the next step. Updates both activeStep and
   * highestCompletedStep. The caller passes the ordered steps array so the
   * store itself has no opinion on which steps exist.
   */
  goToNextStep: (steps: TransactionStepName[]) => void;

  /**
   * Go back to the previous step. Only changes activeStep —
   * highestCompletedStep is not lowered.
   */
  goToPreviousStep: (steps: TransactionStepName[]) => void;

  /** Store the built XDR after a successful build. */
  setBuildXdr: (xdr: string) => void;

  /** Store simulation results (JSON string) from RPC. */
  setSimulationResult: (json: string) => void;

  /** Store raw auth entries XDR from simulation response. */
  setAuthEntriesXdr: (entries: string[]) => void;

  /** Store signed auth entries XDR after auth signing. */
  setSignedAuthEntriesXdr: (entries: string[]) => void;

  /** Store the assembled transaction XDR (post-simulation). */
  setAssembledXdr: (xdr: string) => void;

  /** Store the signed transaction envelope XDR. */
  setSignedXdr: (xdr: string) => void;

  /** Store validate step re-simulation result. */
  setValidateResult: (json: string) => void;

  /**
   * Reset all downstream data when the user modifies build params after
   * having progressed past the build step. Resets highestCompletedStep to
   * null and clears simulation, signing, and validation data.
   */
  resetDownstreamState: () => void;

  /** Full reset — returns everything to initial state. */
  resetAll: () => void;
}

type TransactionFlowStore = TransactionFlowState & TransactionFlowActions;

// ============================================================================
// Defaults
// ============================================================================

const INITIAL_STATE: TransactionFlowState = {
  activeStep: "build",
  highestCompletedStep: null,
  buildXdr: "",
  simulationResultJson: "",
  authEntriesXdr: [],
  signedAuthEntriesXdr: [],
  assembledXdr: "",
  signedXdr: "",
  validateResultJson: "",
};

// ============================================================================
// Safe sessionStorage wrapper
// ============================================================================

/**
 * Creates a safe sessionStorage adapter that falls back to in-memory storage
 * on write failure (QuotaExceededError, security restrictions) and resets to
 * default state on read failure (corrupted JSON).
 */
const createSafeSessionStorage = (): {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
} => {
  // In-memory fallback when sessionStorage is unavailable
  const fallback = new Map<string, string>();
  let useFallback = false;

  return {
    getItem(name: string): string | null {
      try {
        if (useFallback) {
          return fallback.get(name) ?? null;
        }
        return sessionStorage.getItem(name);
      } catch (error) {
        console.warn(
          "[TransactionFlowStore] Failed to read from sessionStorage, " +
            "resetting to default state:",
          error,
        );
        return null;
      }
    },

    setItem(name: string, value: string): void {
      try {
        if (useFallback) {
          fallback.set(name, value);
          return;
        }
        sessionStorage.setItem(name, value);
      } catch (error) {
        console.warn(
          "[TransactionFlowStore] Failed to write to sessionStorage, " +
            "falling back to in-memory storage:",
          error,
        );
        useFallback = true;
        fallback.set(name, value);
      }
    },

    removeItem(name: string): void {
      try {
        if (useFallback) {
          fallback.delete(name);
          return;
        }
        sessionStorage.removeItem(name);
      } catch {
        fallback.delete(name);
      }
    },
  };
};

// ============================================================================
// Store factories
// ============================================================================

/**
 * Creates a transaction flow store bound to a specific sessionStorage key.
 *
 * @param storageKey - sessionStorage key, e.g. "stellar_lab_tx_flow_build"
 * @param initialStep - The first step name, "build" or "import"
 * @returns Zustand hook for the transaction flow store
 *
 * @example
 * const useBuildFlowStore = createTransactionFlowStore(
 *   "stellar_lab_tx_flow_build",
 *   "build",
 * );
 */
const createTransactionFlowStore = (
  storageKey: string,
  initialStep: TransactionStepName,
) =>
  create<TransactionFlowStore>()(
    persist(
      immer((set) => ({
        // State
        ...INITIAL_STATE,
        activeStep: initialStep,

        // Actions
        setActiveStep: (step) =>
          set((state) => {
            state.activeStep = step;
          }),

        goToNextStep: (steps) =>
          set((state) => {
            const currentIndex = steps.indexOf(state.activeStep);
            if (currentIndex < steps.length - 1) {
              const nextStep = steps[currentIndex + 1];
              state.activeStep = nextStep;

              // Only raise highestCompletedStep, never lower it
              const highestIndex = state.highestCompletedStep
                ? steps.indexOf(state.highestCompletedStep)
                : -1;
              if (currentIndex > highestIndex) {
                state.highestCompletedStep = steps[currentIndex];
              }
            }
          }),

        goToPreviousStep: (steps) =>
          set((state) => {
            const currentIndex = steps.indexOf(state.activeStep);
            if (currentIndex > 0) {
              state.activeStep = steps[currentIndex - 1];
            }
          }),

        setBuildXdr: (xdr) =>
          set((state) => {
            state.buildXdr = xdr;
          }),

        setSimulationResult: (json) =>
          set((state) => {
            state.simulationResultJson = json;
          }),

        setAuthEntriesXdr: (entries) =>
          set((state) => {
            state.authEntriesXdr = entries;
          }),

        setSignedAuthEntriesXdr: (entries) =>
          set((state) => {
            state.signedAuthEntriesXdr = entries;
          }),

        setAssembledXdr: (xdr) =>
          set((state) => {
            state.assembledXdr = xdr;
          }),

        setSignedXdr: (xdr) =>
          set((state) => {
            state.signedXdr = xdr;
          }),

        setValidateResult: (json) =>
          set((state) => {
            state.validateResultJson = json;
          }),

        resetDownstreamState: () =>
          set((state) => {
            state.highestCompletedStep = null;
            state.simulationResultJson = "";
            state.authEntriesXdr = [];
            state.signedAuthEntriesXdr = [];
            state.assembledXdr = "";
            state.signedXdr = "";
            state.validateResultJson = "";
          }),

        resetAll: () =>
          set((state) => {
            Object.assign(state, {
              ...INITIAL_STATE,
              activeStep: initialStep,
            });
          }),
      })),
      {
        name: storageKey,
        storage: createJSONStorage(() => createSafeSessionStorage()),
        skipHydration: true,
      },
    ),
  );

// ============================================================================
// Exported store instances
// ============================================================================

/** Store for the Build flow (/transaction/build). */
export const useBuildFlowStore = createTransactionFlowStore(
  "stellar_lab_tx_flow_build",
  "build",
);

/** Store for the Import flow (/transaction/import). */
export const useImportFlowStore = createTransactionFlowStore(
  "stellar_lab_tx_flow_import",
  "import",
);
