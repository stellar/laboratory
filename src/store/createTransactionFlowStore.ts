import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MemoType } from "@stellar/stellar-sdk";

import { TransactionStepName } from "@/components/TransactionStepper";

import {
  AuthModeType,
  EmptyObj,
  TxnOperation,
  OpBuildingError,
  XdrFormatType,
} from "@/types/types";

// ============================================================================
// Types
// ============================================================================

export type WalletKit = {
  publicKey?: string;
  walletType?: string;
};

export type TransactionBuildParams = {
  source_account: string;
  fee: string;
  seq_num: string;
  cond: {
    time: {
      min_time: string;
      max_time: string;
    };
  };
  memo:
    | string
    | {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [T in Exclude<MemoType, "none">]?: string;
      }
    | EmptyObj;
};

type TransactionBuildParamsObj = {
  [K in keyof TransactionBuildParams]?: TransactionBuildParams[K];
};

interface TransactionFlowState {
  // Step navigation
  activeStep: TransactionStepName;
  highestCompletedStep: TransactionStepName | null;
  build: {
    classic: {
      operations: TxnOperation[];
      xdr: string;
    };
    soroban: {
      operation: TxnOperation;
      xdr: string;
    };
    // used for both classic and soroban
    params: TransactionBuildParams;
    error: {
      params: string[];
      operations: OpBuildingError[];
    };
    isValid: {
      params: boolean;
      operations: boolean;
    };
  };
  simulate: {
    xdrFormat: XdrFormatType;
    instructionLeeway?: string;
    authMode: AuthModeType;
    simulationResultJson?: string;
    authEntriesXdr?: string[];
    signedAuthEntriesXdr?: string[];
    assembledXdr?: string;
    isSimulationReadOnly?: boolean;
    isValid: boolean;
  };
  sign: {
    signedXdr: string;
  };
  /** Only present for Soroban transactions with auth entries. */
  validate?: {
    authMode: AuthModeType;
    validateResultJson?: string;
    validatedXdr?: string;
  };
  submit: {
    submitResultJson?: string;
  };
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
   * Mark a step as completed without changing activeStep. Used to
   * auto-enable stepper navigation when the current step becomes valid
   * before the user clicks Next.
   */
  markStepCompleted: (
    step: TransactionStepName,
    steps: TransactionStepName[],
  ) => void;

  setBuildParams: (params: TransactionBuildParamsObj) => void;

  setBuildSorobanOperation: (operation: TxnOperation) => void;
  setBuildSorobanXdr: (xdr: string) => void;

  setBuildClassicSingleOperation: (
    index: number,
    operation: TxnOperation,
  ) => void;
  setBuildClassicOperations: (operations: TxnOperation[]) => void;
  /** Store the built XDR after a successful build. */
  setBuildClassicXdr: (xdr: string) => void;

  setBuildParamsError: (error: string[]) => void;
  setBuildOperationsError: (error: OpBuildingError[]) => void;

  updateBuildIsValid: ({
    params,
    operations,
  }: {
    params?: boolean;
    operations?: boolean;
  }) => void;
  /** Store simulation results (JSON string) from RPC. */
  setSimulationResult: (json: string) => void;

  /** Store raw auth entries XDR from simulation response. */
  setAuthEntriesXdr: (entries: string[]) => void;

  /** Store signed auth entries XDR (base64) for per-entry badge display. */
  setSignedAuthEntriesXdr: (entries: string[]) => void;

  /** Store (or clear) the assembled transaction XDR (post-simulation). */
  setAssembledXdr: (xdr: string | undefined) => void;

  /** Store the signed transaction envelope XDR. */
  setSignedXdr: (xdr: string) => void;

  /** Set the XDR format for simulation output. */
  setSimulateXdrFormat: (format: XdrFormatType) => void;

  /** Set the instruction leeway for simulation. */
  setSimulateInstructionLeeway: (leeway: string | undefined) => void;

  /** Set the auth mode for simulation. */
  setSimulateAuthMode: (mode: AuthModeType) => void;

  /** Set whether the simulation is read-only. */
  setSimulationReadOnly: (readOnly: boolean) => void;

  /** Store validate step re-simulation result. */
  setValidateResult: (json: string) => void;

  /** Set the auth mode for the validate step. */
  setValidateAuthMode: (mode: AuthModeType) => void;

  /** Store (or clear) the validated transaction XDR. */
  setValidatedXdr: (xdr: string | undefined) => void;

  /** Store the submit result JSON. */
  setSubmitResult: (json: string) => void;

  /**
   * Reset all downstream data when the user modifies build params after
   * having progressed past the build step. Resets highestCompletedStep to
   * null and clears simulation, signing, and validation data.
   */
  resetDownstreamState: (
    from: TransactionStepName,
    steps: TransactionStepName[],
  ) => void;

  /** Full reset — returns everything to initial state. */
  resetAll: () => void;
}

type TransactionFlowStore = TransactionFlowState & TransactionFlowActions;

// ============================================================================
// Defaults
// ============================================================================

const initTransactionParamsState = {
  source_account: "",
  fee: "100",
  seq_num: "",
  cond: {
    time: {
      min_time: "",
      max_time: "",
    },
  },
  memo: {},
};

const initTransactionOperationState = {
  operation_type: "",
  params: {},
  source_account: "",
};

const initTransactionBuildState = {
  classic: {
    operations: [],
    xdr: "",
  },
  soroban: {
    operation: initTransactionOperationState,
    xdr: "",
  },
  params: initTransactionParamsState,
  error: {
    params: [],
    operations: [],
  },
  isValid: {
    params: false,
    operations: false,
  },
};

const initTransactionSimulateState = {
  xdrFormat: "base64" as XdrFormatType,
  instructionLeeway: undefined,
  authMode: "record" as AuthModeType,
  simulationResultJson: "",
  authEntriesXdr: undefined,
  signedAuthEntriesXdr: undefined,
  assembledXdr: undefined,
  isSimulationReadOnly: false,
  isValid: false,
};

const initTransactionSignState = {
  signedXdr: "",
};

const initTransactionSubmitState = {
  submitResultJson: "",
};

const INITIAL_TRANSACTION_STATE: TransactionFlowState = {
  activeStep: "build",
  highestCompletedStep: null,
  build: initTransactionBuildState,
  simulate: initTransactionSimulateState,
  sign: initTransactionSignState,
  // validate is omitted — only present for Soroban transactions with auth entries
  submit: initTransactionSubmitState,
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
        ...INITIAL_TRANSACTION_STATE,
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

        markStepCompleted: (step, steps) =>
          set((state) => {
            const stepIndex = steps.indexOf(step);
            const highestIndex = state.highestCompletedStep
              ? steps.indexOf(state.highestCompletedStep)
              : -1;
            if (stepIndex > highestIndex) {
              state.highestCompletedStep = step;
            }
          }),

        setBuildParams: (params) =>
          set((state) => {
            state.build.params = {
              ...state.build.params,
              ...params,
            };
          }),
        setBuildClassicSingleOperation: (index, operation) =>
          set((state) => {
            if (state.build.classic.operations.length > index) {
              state.build.classic.operations[index] = operation;
            }
          }),
        setBuildClassicOperations: (operations) =>
          set((state) => {
            state.build.classic.operations = operations;
          }),
        setBuildClassicXdr: (xdr) =>
          set((state) => {
            state.build.classic.xdr = xdr;
          }),
        setBuildSorobanOperation: (operation) =>
          set((state) => {
            state.build.soroban.operation = operation;
          }),
        setBuildSorobanXdr: (xdr) =>
          set((state) => {
            state.build.soroban.xdr = xdr;
          }),
        setBuildParamsError: (error) =>
          set((state) => {
            state.build.error.params = error;
          }),
        setBuildOperationsError: (error) =>
          set((state) => {
            state.build.error.operations = error;
          }),
        updateBuildIsValid: ({
          params,
          operations,
        }: {
          params?: boolean;
          operations?: boolean;
        }) =>
          set((state) => {
            if (params !== undefined) {
              state.build.isValid.params = params;
            }
            if (operations !== undefined) {
              state.build.isValid.operations = operations;
            }
          }),
        setSimulateXdrFormat: (format) =>
          set((state) => {
            state.simulate.xdrFormat = format;
          }),

        setSimulateInstructionLeeway: (leeway) =>
          set((state) => {
            state.simulate.instructionLeeway = leeway;
          }),

        setSimulateAuthMode: (mode) =>
          set((state) => {
            state.simulate.authMode = mode;
          }),

        setSimulationReadOnly: (readOnly) =>
          set((state) => {
            state.simulate.isSimulationReadOnly = readOnly;
          }),

        setSimulationResult: (json) =>
          set((state) => {
            state.simulate.simulationResultJson = json;
          }),

        setAuthEntriesXdr: (entries) =>
          set((state) => {
            state.simulate.authEntriesXdr = entries;
          }),

        setSignedAuthEntriesXdr: (entries) =>
          set((state) => {
            state.simulate.signedAuthEntriesXdr = entries;
          }),

        setAssembledXdr: (xdr) =>
          set((state) => {
            state.simulate.assembledXdr = xdr;
          }),

        setSignedXdr: (xdr) =>
          set((state) => {
            state.sign.signedXdr = xdr;
          }),

        setValidateResult: (json) =>
          set((state) => {
            if (!state.validate) {
              state.validate = { authMode: "enforce" };
            }
            state.validate.validateResultJson = json;
          }),

        setValidateAuthMode: (mode) =>
          set((state) => {
            if (!state.validate) {
              state.validate = { authMode: mode };
            } else {
              state.validate.authMode = mode;
            }
          }),

        setValidatedXdr: (xdr) =>
          set((state) => {
            if (!state.validate) {
              state.validate = { authMode: "enforce" };
            }
            state.validate.validatedXdr = xdr;
          }),

        setSubmitResult: (json) =>
          set((state) => {
            state.submit.submitResultJson = json;
            // Mark "submit" as completed so the stepper shows a checkmark
            state.highestCompletedStep = "submit";
          }),

        resetDownstreamState: (
          from: TransactionStepName,
          steps: TransactionStepName[],
        ) =>
          set((state) => {
            const fromIndex = steps.indexOf(from);
            state.highestCompletedStep = steps[fromIndex - 1] ?? null;
            if (fromIndex <= steps.indexOf("simulate")) {
              state.simulate = initTransactionSimulateState;
            }
            if (fromIndex <= steps.indexOf("sign")) {
              state.sign = initTransactionSignState;
            }
            const validateIndex = steps.indexOf("validate");
            if (validateIndex === -1 || fromIndex <= validateIndex) {
              state.validate = undefined;
            }
            if (fromIndex <= steps.indexOf("submit")) {
              state.submit = initTransactionSubmitState;
            }
          }),

        resetAll: () =>
          set((state) => {
            Object.assign(state, {
              ...INITIAL_TRANSACTION_STATE,
              activeStep: initialStep,
            });
          }),
      })),
      {
        name: storageKey,
        storage: createJSONStorage(() => sessionStorage),
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

// Rehydrate from sessionStorage eagerly at module-load time (client only).
// This must happen before any component renders, because child-component
// mount effects can call store actions that write default state back to
// sessionStorage — overwriting the previously persisted data.
if (typeof window !== "undefined") {
  useBuildFlowStore.persist.rehydrate();
}
