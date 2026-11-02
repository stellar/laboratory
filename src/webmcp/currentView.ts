import { Store } from "@/store/createStore";
import {
  useBuildFlowStore,
  useImportFlowStore,
} from "@/store/createTransactionFlowStore";
import { EmptyObj, Network } from "@/types/types";

/** Network info without custom header values (those can be API keys). */
export const summarizeNetwork = (network: Network | EmptyObj) => {
  if (!("id" in network)) {
    return { selected: false as const };
  }

  return {
    selected: true as const,
    id: network.id,
    label: network.label,
    passphrase: network.passphrase,
    rpcUrl: network.rpcUrl,
    horizonUrl: network.horizonUrl,
    hasCustomRpcHeader: Boolean(network.rpcHeaderName),
    hasCustomHorizonHeader: Boolean(network.horizonHeaderName),
  };
};

const omitEmpty = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== "" && v !== null,
    ),
  );

const parseJsonOrRaw = (value?: string) => {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const flowState = (
  flow: typeof useBuildFlowStore | typeof useImportFlowStore,
) => {
  const s = flow.getState();

  return omitEmpty({
    activeStep: s.activeStep,
    import: s.import
      ? omitEmpty({
          importXdr: s.import.importXdr,
          parsedTxType: s.import.parsedTxType,
          hasSignatures: s.import.hasSignatures,
          isSimulated: s.import.isSimulated,
          isFeeBump: s.import.isFeeBump,
          parseError: s.import.parseError,
        })
      : undefined,
    buildParams: s.build.params,
    classicOperations: s.build.classic.operations,
    classicXdr: s.build.classic.xdr,
    sorobanOperation: s.build.soroban.operation.operation_type
      ? s.build.soroban.operation
      : undefined,
    sorobanXdr: s.build.soroban.xdr,
    buildErrors:
      s.build.error.params.length || s.build.error.operations.length
        ? s.build.error
        : undefined,
    simulationResult: parseJsonOrRaw(s.simulate.simulationResultJson),
    assembledXdr: s.simulate.assembledXdr,
    signedXdr: s.sign.signedXdr,
    submitResult: parseJsonOrRaw(s.submit.submitResultJson),
  });
};

/**
 * Describes what the user has open in Lab right now, read from the stores.
 * Only fields that are useful to an agent are returned; the account page's
 * secret key and recovery phrase are never read.
 */
export const getCurrentView = (state: Store, pathname: string) => {
  const base = {
    page: pathname,
    network: summarizeNetwork(state.network),
  };

  const page = (() => {
    if (pathname.startsWith("/xdr/view") || pathname.startsWith("/xdr/to")) {
      return omitEmpty({
        description: pathname.startsWith("/xdr/view")
          ? "XDR viewer. Use lab_xdr_decode on `xdr` to read it."
          : "JSON to XDR converter.",
        xdr: state.xdr.blob,
        xdrType: state.xdr.type,
        json: state.xdr.jsonString,
      });
    }

    if (pathname.startsWith("/xdr/diff")) {
      return {
        description:
          "XDR diff. Its inputs are not shared with tools yet; ask the user to paste the two XDR values.",
      };
    }

    if (pathname.startsWith("/transaction/build")) {
      return {
        description:
          "Transaction builder flow (build → simulate → sign → submit).",
        ...flowState(useBuildFlowStore),
      };
    }

    if (
      pathname.startsWith("/transaction/import") ||
      pathname.startsWith("/transaction/cli-sign")
    ) {
      return {
        description: "Imported transaction flow.",
        ...flowState(useImportFlowStore),
      };
    }

    if (pathname.startsWith("/transaction/submit")) {
      return omitEmpty({
        description: "Submit transaction page.",
        xdr: state.xdr.blob,
      });
    }

    if (pathname.startsWith("/transaction/fee-bump")) {
      return {
        description: "Fee bump builder.",
        ...omitEmpty({ ...state.transaction.feeBump }),
      };
    }

    if (pathname.startsWith("/transaction/dashboard")) {
      return omitEmpty({
        description: "Transaction dashboard.",
        transactionHash: state.txDashboard.transactionHash,
      });
    }

    if (pathname.startsWith("/transactions-explorer/tx/")) {
      return {
        description: "Transaction explorer.",
        transactionHash: decodeURIComponent(pathname.split("/").pop() || ""),
      };
    }

    if (pathname.startsWith("/account")) {
      return omitEmpty({
        description:
          "Account tools. Only the public key is shared; secret keys never are.",
        publicKey: state.account.publicKey,
        muxedAccount:
          "id" in state.account.generatedMuxedAccount ||
          "id" in state.account.parsedMuxedAccount
            ? {
                generated: state.account.generatedMuxedAccount,
                parsed: state.account.parsedMuxedAccount,
              }
            : undefined,
      });
    }

    if (pathname.startsWith("/endpoints")) {
      return omitEmpty({
        description: "API explorer (RPC methods and Horizon endpoints).",
        endpoint: state.endpoints.currentEndpoint,
        params: Object.keys(state.endpoints.params).length
          ? state.endpoints.params
          : undefined,
      });
    }

    if (pathname.startsWith("/smart-contracts/contract-explorer")) {
      return omitEmpty({
        description: "Contract explorer.",
        contractId: state.smartContracts.explorer.contractId,
      });
    }

    const contractMatch = pathname.match(/^\/r\/([^/]+)\/contract\/([^/]+)/);

    if (contractMatch) {
      return {
        description: "Contract page.",
        contractNetwork: contractMatch[1],
        contractId: contractMatch[2],
      };
    }

    return {
      description:
        "This page has no state shared with tools yet. Ask the user what they are looking at.",
    };
  })();

  return { ...base, ...page };
};
