"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button, Card, Icon } from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import {
  SETTINGS_SUBMIT_METHOD,
  XDR_TYPE_TRANSACTION_ENVELOPE,
} from "@/constants/settings";
import { Routes } from "@/constants/routes";

import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";
import { useSubmitHorizonTx } from "@/query/useSubmitHorizonTx";

import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { TransactionHashReadOnlyField } from "@/components/TransactionHashReadOnlyField";
import { CodeEditor } from "@/components/CodeEditor";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { TxResponse } from "@/components/TxResponse";
import {
  RpcErrorResponse,
  HorizonErrorResponse,
} from "@/components/TxErrorResponse";
import { XdrLink } from "@/components/XdrLink";
import { TxHashLink } from "@/components/TxHashLink";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { getBlockExplorerLink } from "@/helpers/getBlockExplorerLink";
import { openUrl } from "@/helpers/openUrl";
import { delayedAction } from "@/helpers/delayedAction";
import { localStorageSettings } from "@/helpers/localStorageSettings";
import * as StellarXdr from "@/helpers/StellarXdr";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";

import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { BuildStepHeader } from "../build/components/BuildStepHeader";

const SUBMIT_OPTIONS = [
  {
    id: "rpc",
    title: "via RPC",
    description:
      "Submit the transaction via the Stellar RPC. Supports simulating Soroban invocations and all other transaction types.",
    note: "Not selectable because no RPC URL is configured",
  },
  {
    id: "horizon",
    title: "via Horizon",
    description:
      "Submit the transaction via the Horizon API. Does not support Soroban transactions that need simulating.",
  },
];

/**
 * Submit step content for the single-page transaction and fee bump flow.
 *
 * Reads the signed (or validated) XDR from the flow store, displays it
 * alongside the transaction hash and decoded JSON, then submits via RPC
 * or Horizon. On success, shows the result with block-explorer links.
 *
 * @example
 * {activeStep === "submit" && <SubmitStepContent />}
 */
export const SubmitStepContent = () => {
  const { network } = useStore();
  const { build, sign, validate, simulate, setSubmitResult, resetAll } =
    useBuildFlowStore();

  const [submitMethod, setSubmitMethod] = useState<"horizon" | "rpc" | string>(
    "",
  );
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const responseSuccessEl = useRef<HTMLDivElement | null>(null);
  const responseErrorEl = useRef<HTMLDivElement | null>(null);

  const {
    data: submitRpcResponse,
    mutate: submitRpc,
    error: submitRpcError,
    isPending: isSubmitRpcPending,
    isSuccess: isSubmitRpcSuccess,
    reset: resetSubmitRpc,
  } = useSubmitRpcTx();

  const {
    data: submitHorizonResponse,
    mutate: submitHorizon,
    error: submitHorizonError,
    isPending: isSubmitHorizonPending,
    isSuccess: isSubmitHorizonSuccess,
    reset: resetSubmitHorizon,
  } = useSubmitHorizonTx();

  // Derive the XDR to submit: validated > signed > assembled
  const xdrBlob =
    validate?.validatedXdr || sign.signedXdr || simulate?.assembledXdr || "";

  const isSoroban = Boolean(build.soroban.operation.operation_type);
  const isRpcAvailable = Boolean(network.rpcUrl);
  const isSubmitInProgress = isSubmitRpcPending || isSubmitHorizonPending;

  const IS_BLOCK_EXPLORER_ENABLED =
    network.id === "testnet" || network.id === "mainnet";

  const isSuccess = Boolean(
    (isSubmitRpcSuccess && submitRpcResponse) ||
      (isSubmitHorizonSuccess && submitHorizonResponse),
  );

  // Decode XDR to JSON for the transaction envelope display
  const getXdrJson = useCallback(() => {
    if (!xdrBlob) return null;

    try {
      const jsonString = StellarXdr.decode(
        XDR_TYPE_TRANSACTION_ENVELOPE,
        xdrBlob,
      );
      return {
        jsonString: JSON.stringify(JSON.parse(jsonString), null, 2),
        error: "",
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { jsonString: "", error: "Unable to decode XDR" };
    }
  }, [xdrBlob]);

  const [xdrJson, setXdrJson] = useState<{
    jsonString: string;
    error: string;
  } | null>(null);

  // Initialize XDR decoding
  useEffect(() => {
    const init = async () => {
      await StellarXdr.initialize();
      setXdrJson(getXdrJson());
    };
    init();
  }, [getXdrJson]);

  // Set default submit method — force RPC for Soroban operations since
  // Horizon doesn't support them.
  useEffect(() => {
    if (isSoroban && isRpcAvailable) {
      setSubmitMethod("rpc");
      return;
    }

    const localStorageMethod = localStorageSettings.get(SETTINGS_SUBMIT_METHOD);
    setSubmitMethod(localStorageMethod || "horizon");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRpcAvailable, isSoroban]);

  const isError = Boolean(submitRpcError || submitHorizonError);

  // Scroll to success/error response
  useScrollIntoView(isSuccess, responseSuccessEl);
  useScrollIntoView(isError, responseErrorEl);

  // Track submit events
  useEffect(() => {
    if (isSubmitRpcSuccess) {
      trackEvent(TrackingEvent.TRANSACTION_SUBMIT_SUCCESS, { method: "rpc" });
    }
  }, [isSubmitRpcSuccess]);

  useEffect(() => {
    if (isSubmitHorizonSuccess) {
      trackEvent(TrackingEvent.TRANSACTION_SUBMIT_SUCCESS, {
        method: "horizon",
      });
    }
  }, [isSubmitHorizonSuccess]);

  // Close dropdown when clicked outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef?.current?.contains(event.target as Node)) {
      return;
    }
    toggleDropdown(false);
  }, []);

  useLayoutEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener("pointerup", handleClickOutside);
    } else {
      document.removeEventListener("pointerup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [isDropdownVisible, handleClickOutside]);

  const toggleDropdown = (show: boolean) => {
    const delay = 100;

    if (show) {
      setIsDropdownActive(true);
      delayedAction({
        action: () => {
          setIsDropdownVisible(true);
        },
        delay,
      });
    } else {
      setIsDropdownVisible(false);
      delayedAction({
        action: () => {
          setIsDropdownActive(false);
        },
        delay,
      });
    }
  };

  const resetSubmitState = () => {
    if (submitRpcError || submitRpcResponse) {
      resetSubmitRpc();
    }
    if (submitHorizonError || submitHorizonResponse) {
      resetSubmitHorizon();
    }
  };

  const handleSubmit = () => {
    resetSubmitState();

    delayedAction({
      action: () => {
        if (submitMethod === "rpc") {
          submitRpc({
            rpcUrl: network.rpcUrl,
            transactionXdr: xdrBlob,
            networkPassphrase: network.passphrase,
            headers: getNetworkHeaders(network, submitMethod),
          });
        } else if (submitMethod === "horizon") {
          submitHorizon({
            horizonUrl: network.horizonUrl,
            transactionXdr: xdrBlob,
            networkPassphrase: network.passphrase,
            headers: getNetworkHeaders(network, submitMethod),
          });
        }
      },
      delay: 300,
    });
  };

  // Store submit result in flow store when successful
  useEffect(() => {
    if (isSubmitRpcSuccess && submitRpcResponse) {
      setSubmitResult(JSON.stringify(submitRpcResponse));
    }
  }, [isSubmitRpcSuccess, submitRpcResponse, setSubmitResult]);

  useEffect(() => {
    if (isSubmitHorizonSuccess && submitHorizonResponse) {
      setSubmitResult(JSON.stringify(submitHorizonResponse));
    }
  }, [isSubmitHorizonSuccess, submitHorizonResponse, setSubmitResult]);

  const getButtonLabel = () => {
    return (
      SUBMIT_OPTIONS.find((s) => s.id === submitMethod)?.title ||
      "Select submit method"
    );
  };

  const isSubmitDisabled = !submitMethod || !xdrBlob;

  const renderSuccess = () => {
    if (isSubmitRpcSuccess && submitRpcResponse && network.id) {
      return (
        <div ref={responseSuccessEl}>
          <ValidationResponseCard
            variant="success"
            title="Transaction submitted!"
            subtitle={`Transaction successfully submitted with ${submitRpcResponse.operationCount} operation(s)`}
            footerLeftEl={
              <Button
                size="md"
                variant="secondary"
                icon={<Icon.ArrowUpRight />}
                onClick={() => {
                  const href = buildEndpointHref(Routes.TRANSACTION_DASHBOARD, {
                    transactionHash: submitRpcResponse.hash,
                  });
                  // openUrl's sanitizeUrl breaks the encoding which prevents the
                  // dashboard page from parsing the hash out of the URL
                  window.open(
                    `${window.location.origin}${href}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                View in transaction dashboard
              </Button>
            }
            footerRightEl={
              IS_BLOCK_EXPLORER_ENABLED ? (
                <>
                  <Button
                    size="md"
                    variant="tertiary"
                    icon={<Icon.LinkExternal01 />}
                    iconPosition="right"
                    onClick={() => {
                      const BLOCK_EXPLORER_LINK =
                        getBlockExplorerLink("stellar.expert")[network.id];
                      openUrl(
                        `${BLOCK_EXPLORER_LINK}/tx/${submitRpcResponse.hash}`,
                      );
                    }}
                  >
                    View on Stellar.Expert
                  </Button>
                  <Button
                    size="md"
                    variant="tertiary"
                    icon={<Icon.LinkExternal01 />}
                    iconPosition="right"
                    onClick={() => {
                      const BLOCK_EXPLORER_LINK =
                        getBlockExplorerLink("stellarchain.io")[network.id];
                      openUrl(
                        `${BLOCK_EXPLORER_LINK}/transactions/${submitRpcResponse.hash}`,
                      );
                    }}
                  >
                    View on Stellarchain.io
                  </Button>
                </>
              ) : null
            }
            response={
              <Box gap="xs">
                <TxResponse
                  label="Hash:"
                  item={<TxHashLink txHash={submitRpcResponse.hash} />}
                />
                <TxResponse
                  label="Ledger number:"
                  value={submitRpcResponse.result.ledger.toString()}
                />
                <TxResponse
                  label="Envelope XDR:"
                  item={
                    <XdrLink
                      xdr={submitRpcResponse.result.envelopeXdr
                        .toXDR("base64")
                        .toString()}
                      type="TransactionEnvelope"
                    />
                  }
                />
                <TxResponse
                  label="Result XDR:"
                  item={
                    <XdrLink
                      xdr={submitRpcResponse.result.resultXdr
                        .toXDR("base64")
                        .toString()}
                      type="TransactionResult"
                    />
                  }
                />
                <TxResponse
                  label="Result Meta XDR:"
                  item={
                    <XdrLink
                      xdr={submitRpcResponse.result.resultMetaXdr
                        .toXDR("base64")
                        .toString()}
                      type="TransactionMeta"
                    />
                  }
                />
                <TxResponse label="Fee:" value={submitRpcResponse.fee} />
              </Box>
            }
          />
        </div>
      );
    }

    if (isSubmitHorizonSuccess && submitHorizonResponse) {
      return (
        <div ref={responseSuccessEl}>
          <ValidationResponseCard
            variant="success"
            title="Transaction submitted!"
            subtitle={`Transaction successfully submitted with ${submitHorizonResponse.operation_count} operation(s)`}
            footerLeftEl={
              <Button
                size="md"
                variant="secondary"
                onClick={() => {
                  const href = buildEndpointHref(Routes.TRANSACTION_DASHBOARD, {
                    transactionHash: submitHorizonResponse.hash,
                  });
                  // openUrl's sanitizeUrl breaks the encoding which prevents the
                  // dashboard page from parsing the hash out of the URL
                  window.open(
                    `${window.location.origin}${href}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                View in transaction dashboard
              </Button>
            }
            footerRightEl={
              IS_BLOCK_EXPLORER_ENABLED ? (
                <>
                  <Button
                    size="md"
                    variant="tertiary"
                    icon={<Icon.LinkExternal01 />}
                    iconPosition="right"
                    onClick={() => {
                      const BLOCK_EXPLORER_LINK =
                        getBlockExplorerLink("stellar.expert")[network.id];
                      openUrl(
                        `${BLOCK_EXPLORER_LINK}/tx/${submitHorizonResponse.hash}`,
                      );
                    }}
                  >
                    View on Stellar.Expert
                  </Button>
                  <Button
                    size="md"
                    variant="tertiary"
                    icon={<Icon.LinkExternal01 />}
                    iconPosition="right"
                    onClick={() => {
                      const BLOCK_EXPLORER_LINK =
                        getBlockExplorerLink("stellarchain.io")[network.id];
                      openUrl(
                        `${BLOCK_EXPLORER_LINK}/transactions/${submitHorizonResponse.hash}`,
                      );
                    }}
                  >
                    View on Stellarchain.io
                  </Button>
                </>
              ) : null
            }
            response={
              <Box gap="xs">
                <TxResponse
                  label="Hash:"
                  item={<TxHashLink txHash={submitHorizonResponse.hash} />}
                />
                <TxResponse
                  label="Ledger number:"
                  value={submitHorizonResponse.ledger}
                />
                <TxResponse
                  label="Envelope XDR:"
                  item={
                    <XdrLink
                      xdr={submitHorizonResponse.envelope_xdr}
                      type="TransactionEnvelope"
                    />
                  }
                />
                <TxResponse
                  label="Result XDR:"
                  item={
                    <XdrLink
                      xdr={submitHorizonResponse.result_xdr}
                      type="TransactionResult"
                    />
                  }
                />
                <TxResponse
                  label="Result Meta XDR:"
                  item={
                    <XdrLink
                      xdr={submitHorizonResponse.result_meta_xdr}
                      type="TransactionMeta"
                    />
                  }
                />
                <TxResponse
                  label="Fee charged:"
                  value={submitHorizonResponse.fee_charged}
                />
              </Box>
            }
          />
        </div>
      );
    }

    return null;
  };

  const renderError = () => {
    if (submitRpcError) {
      return (
        <div ref={responseErrorEl}>
          <RpcErrorResponse error={submitRpcError} />
        </div>
      );
    }

    if (submitHorizonError) {
      return (
        <div ref={responseErrorEl}>
          <HorizonErrorResponse error={submitHorizonError} />
        </div>
      );
    }

    return null;
  };

  return (
    <Box gap="md">
      <BuildStepHeader
        heading="Submit transaction"
        headingAs="h1"
        onClearAll={resetAll}
      />

      <Card>
        <Box gap="xl">
          <Box gap="md">
            <XdrPicker
              id="submit-tx-xdr"
              label="Base-64 encoded XDR"
              value={xdrBlob}
              error=""
              readOnly
              hasCopyButton
            />

            <TransactionHashReadOnlyField
              xdr={xdrBlob}
              networkPassphrase={network.passphrase}
            />

            {xdrJson?.jsonString ? (
              <CodeEditor
                title="Transaction envelope"
                value={xdrJson.jsonString}
                selectedLanguage="json"
              />
            ) : null}
          </Box>
          <Box gap="sm" direction="row" align="center" justify="left">
            <Button
              disabled={isSubmitDisabled}
              isLoading={isSubmitInProgress}
              size="md"
              variant="secondary"
              onClick={handleSubmit}
            >
              Submit transaction
            </Button>

            <div className="SubmitTx__dropdownContainer">
              <Button
                disabled={isSubmitInProgress}
                size="md"
                variant="tertiary"
                icon={<Icon.ChevronDown />}
                onClick={() => {
                  if (!isDropdownActive) {
                    toggleDropdown(true);
                  }
                }}
              >
                {getButtonLabel()}
              </Button>
              <div
                className="SubmitTx__floater Floater__content Floater__content--light"
                data-is-active={isDropdownActive}
                data-is-visible={isDropdownVisible}
                ref={dropdownRef}
                tabIndex={0}
              >
                <div className="SubmitTx__floater__body">
                  {SUBMIT_OPTIONS.map((s) => (
                    <div
                      key={`submit-method-${s.id}`}
                      className="SubmitTx__floater__item"
                      data-is-selected={s.id === submitMethod}
                      data-is-disabled={s.id === "rpc" && !isRpcAvailable}
                      onClick={() => {
                        if (s.id === "rpc" && !isRpcAvailable) {
                          return;
                        }

                        setSubmitMethod(s.id);
                        toggleDropdown(false);
                        resetSubmitState();

                        localStorageSettings.set({
                          key: SETTINGS_SUBMIT_METHOD,
                          value: s.id,
                        });
                      }}
                    >
                      <div className="SubmitTx__floater__item__title">
                        {s.title}
                        {s.id === submitMethod ? <Icon.Check /> : null}
                      </div>
                      <div className="SubmitTx__floater__item__description">
                        {s.description}
                      </div>
                      {s.note && s.id === "rpc" && !isRpcAvailable ? (
                        <div className="SubmitTx__floater__item__warning">
                          {s.note}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Box>
        </Box>
      </Card>

      {renderSuccess()}
      {renderError()}
    </Box>
  );
};
