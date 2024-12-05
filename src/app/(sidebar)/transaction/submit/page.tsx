"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button, Icon, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { useStore } from "@/store/useStore";

import * as StellarXdr from "@/helpers/StellarXdr";
import { delayedAction } from "@/helpers/delayedAction";
import { openUrl } from "@/helpers/openUrl";
import { getBlockExplorerLink } from "@/helpers/getBlockExplorerLink";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { localStorageSubmitMethod } from "@/helpers/localStorageSubmitMethod";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";
import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";
import { shareableUrl } from "@/helpers/shareableUrl";

import { Routes } from "@/constants/routes";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";
import { useSubmitHorizonTx } from "@/query/useSubmitHorizonTx";

import { Box } from "@/components/layout/Box";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { TxResponse } from "@/components/TxResponse";
import { SdsLink } from "@/components/SdsLink";
import { TransactionHashReadOnlyField } from "@/components/TransactionHashReadOnlyField";
import { PageCard } from "@/components/layout/PageCard";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";

import {
  HorizonErrorResponse,
  RpcErrorResponse,
} from "./components/ErrorResponse";

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

const SETTING_KEY = "submitMethod";

export default function SubmitTransaction() {
  const { network, xdr, transaction } = useStore();
  const { blob, updateXdrBlob } = xdr;

  const isXdrInit = useIsXdrInit();
  const router = useRouter();

  const IS_BLOCK_EXPLORER_ENABLED =
    network.id === "testnet" || network.id === "mainnet";

  const [isSaveTxnModalVisible, setIsSaveTxnModalVisible] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [submitMethod, setSubmitMethod] = useState<"horizon" | "rpc" | string>(
    "",
  );

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

  const isRpcAvailable = Boolean(network.rpcUrl);
  const isSubmitInProgress = isSubmitRpcPending || isSubmitHorizonPending;

  const isSuccess = Boolean(
    (isSubmitRpcSuccess && submitRpcResponse) ||
      (isSubmitHorizonSuccess && submitHorizonResponse),
  );
  const isError = Boolean(submitRpcError || submitHorizonError);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef?.current?.contains(event.target as Node)) {
      return;
    }

    toggleDropdown(false);
  }, []);

  // Set default submit method
  useEffect(() => {
    const localStorageMethod = localStorageSubmitMethod.get(SETTING_KEY);

    if (localStorageMethod) {
      setSubmitMethod(localStorageMethod);
    } else {
      setSubmitMethod(isRpcAvailable ? "rpc" : "horizon");
    }

    resetSubmitState();
    // Not including resetSubmitState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRpcAvailable]);

  // Scroll to response
  useScrollIntoView(isSuccess, responseSuccessEl);
  useScrollIntoView(isError, responseErrorEl);

  // Close dropdown when clicked outside
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

  const resetSubmitState = () => {
    if (submitRpcError || submitRpcResponse) {
      resetSubmitRpc();
    }
    if (submitHorizonError || submitHorizonResponse) {
      resetSubmitHorizon();
    }
  };

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

  const handleSubmit = () => {
    resetSubmitState();

    delayedAction({
      action: () => {
        if (submitMethod === "rpc") {
          submitRpc({
            rpcUrl: network.rpcUrl,
            transactionXdr: blob,
            networkPassphrase: network.passphrase,
            headers: getNetworkHeaders(network, submitMethod),
          });
        } else if (submitMethod === "horizon") {
          submitHorizon({
            horizonUrl: network.horizonUrl,
            transactionXdr: blob,
            networkPassphrase: network.passphrase,
            headers: getNetworkHeaders(network, submitMethod),
          });
        } else {
          // Do nothing
        }
      },
      delay: 300,
    });
  };

  const onSimulateTx = () => {
    transaction.updateSimulateTriggerOnLaunch(true);

    // Adding delay to make sure the store will update
    delayedAction({
      action: () => {
        router.push(Routes.SIMULATE_TRANSACTION);
      },
      delay: 200,
    });
  };

  const onSaveTx = () => {
    setIsSaveTxnModalVisible(true);
  };

  const getXdrJson = () => {
    const xdrType = XDR_TYPE_TRANSACTION_ENVELOPE;

    if (!(isXdrInit && blob)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdrType, blob);

      return {
        jsonString: xdrJson,
        error: "",
      };
    } catch (e) {
      return {
        jsonString: "",
        error: `Unable to decode input as ${xdrType}`,
      };
    }
  };

  const getButtonLabel = () => {
    return (
      SUBMIT_OPTIONS.find((s) => s.id === submitMethod)?.title ||
      "Select submit method"
    );
  };

  const xdrJson = getXdrJson();

  const isSubmitDisabled = !submitMethod || !blob || Boolean(xdrJson?.error);

  const XdrLink = ({ xdr, type }: { xdr: string; type: string }) => (
    <SdsLink
      href={buildEndpointHref(Routes.VIEW_XDR, {
        blob: xdr,
        type: type,
      })}
      target="_blank"
      isUnderline
      variant="secondary"
    >
      {xdr}
    </SdsLink>
  );

  const renderSuccess = () => {
    if (isSubmitRpcSuccess && submitRpcResponse) {
      return (
        <div ref={responseSuccessEl}>
          <ValidationResponseCard
            variant="success"
            title="Transaction submitted!"
            subtitle={`Transaction succeeded with ${submitRpcResponse.operationCount} operation(s)`}
            note={<></>}
            footerLeftEl={
              IS_BLOCK_EXPLORER_ENABLED ? (
                <>
                  <Button
                    size="md"
                    variant="tertiary"
                    onClick={() => {
                      const BLOCK_EXPLORER_LINK =
                        getBlockExplorerLink("stellar.expert")[network.id];

                      openUrl(
                        `${BLOCK_EXPLORER_LINK}/tx/${submitRpcResponse.hash}`,
                      );
                    }}
                  >
                    View on stellar.expert
                  </Button>

                  <Button
                    size="md"
                    variant="tertiary"
                    onClick={() => {
                      const BLOCK_EXPLORER_LINK =
                        getBlockExplorerLink("stellarchain.io")[network.id];

                      openUrl(
                        `${BLOCK_EXPLORER_LINK}/transactions/${submitRpcResponse.hash}`,
                      );
                    }}
                  >
                    View on stellarchain.io
                  </Button>
                </>
              ) : null
            }
            response={
              <Box gap="xs">
                <TxResponse label="Hash:" value={submitRpcResponse.hash} />
                <TxResponse
                  label="Ledger number:"
                  value={submitRpcResponse.result.ledger}
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
            subtitle={`Transaction succeeded with ${submitHorizonResponse.operation_count} operation(s)`}
            note={<></>}
            footerLeftEl={
              IS_BLOCK_EXPLORER_ENABLED ? (
                <>
                  <Button
                    size="md"
                    variant="tertiary"
                    onClick={() => {
                      const BLOCK_EXPLORER_LINK =
                        getBlockExplorerLink("stellar.expert")[network.id];

                      openUrl(
                        `${BLOCK_EXPLORER_LINK}/tx/${submitHorizonResponse.hash}`,
                      );
                    }}
                  >
                    View on stellar.expert
                  </Button>

                  <Button
                    size="md"
                    variant="tertiary"
                    onClick={() => {
                      const BLOCK_EXPLORER_LINK =
                        getBlockExplorerLink("stellarchain.io")[network.id];

                      openUrl(
                        `${BLOCK_EXPLORER_LINK}/transactions/${submitHorizonResponse.hash}`,
                      );
                    }}
                  >
                    View on stellarchain.io
                  </Button>
                </>
              ) : null
            }
            response={
              <Box gap="xs">
                <TxResponse label="Hash:" value={submitHorizonResponse.hash} />
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
    <Box gap="md" data-testid="submit-tx-xdr">
      <PageCard heading="Submit Transaction">
        <Box gap="lg">
          <XdrPicker
            id="submit-tx-xdr"
            label="Input a base-64 encoded TransactionEnvelope:"
            value={blob}
            error={xdrJson?.error || ""}
            onChange={(e) => {
              updateXdrBlob(e.target.value);
              resetSubmitState();
            }}
            note="Enter a base-64 encoded XDR blob to decode."
            hasCopyButton
          />

          <TransactionHashReadOnlyField
            xdr={xdr.blob}
            networkPassphrase={network.passphrase}
          />

          <Box
            gap="lg"
            direction="row"
            align="center"
            justify="space-between"
            addlClassName="SubmitTx__buttons"
          >
            <Box gap="sm" direction="row" align="center" justify="left">
              <Button
                disabled={isSubmitDisabled}
                isLoading={isSubmitInProgress}
                size="md"
                variant={"secondary"}
                onClick={handleSubmit}
              >
                Submit transaction
              </Button>

              <div className="SubmitTx__dropdownContainer">
                <Button
                  disabled={isSubmitInProgress}
                  size="md"
                  variant={"tertiary"}
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
                  <div
                    className="SubmitTx__floater__body"
                    data-testid="submit-tx-methods-dropdown"
                  >
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

                          localStorageSubmitMethod.set({
                            key: SETTING_KEY,
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

            <Box gap="sm" direction="row" align="center" justify="end">
              <Button
                disabled={isSubmitDisabled || isSubmitInProgress}
                size="md"
                variant={"tertiary"}
                onClick={onSimulateTx}
              >
                Simulate transaction
              </Button>

              <Button
                disabled={isSubmitDisabled || isSubmitInProgress}
                size="md"
                variant={"tertiary"}
                onClick={onSaveTx}
                icon={<Icon.Save01 />}
              >
                Save transaction
              </Button>
            </Box>
          </Box>

          <>
            {xdrJson?.jsonString ? (
              <Box gap="sm" data-testid="submit-tx-envelope-json">
                <Text
                  size="sm"
                  as="h2"
                  weight="semi-bold"
                  addlClassName="PageBody__title"
                >
                  Transaction Envelope
                </Text>
                <div className="PageBody__content PageBody__scrollable">
                  <PrettyJsonTransaction
                    json={JSON.parse(xdrJson.jsonString)}
                    xdr={blob}
                  />
                </div>
              </Box>
            ) : null}
          </>
        </Box>
      </PageCard>

      <>{renderSuccess()}</>
      <>{renderError()}</>

      <SaveToLocalStorageModal
        type="save"
        itemTitle="Transaction"
        itemProps={{
          xdr: blob,
          page: "submit",
          shareableUrl: shareableUrl("transactions-save"),
        }}
        allSavedItems={localStorageSavedTransactions.get()}
        isVisible={isSaveTxnModalVisible}
        onClose={() => {
          setIsSaveTxnModalVisible(false);
        }}
        onUpdate={(updatedItems) => {
          localStorageSavedTransactions.set(updatedItems);
        }}
      />
    </Box>
  );
}
