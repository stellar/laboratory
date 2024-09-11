"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button, Card, Icon, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { useStore } from "@/store/useStore";

import * as StellarXdr from "@/helpers/StellarXdr";
import { delayedAction } from "@/helpers/delayedAction";
import { Routes } from "@/constants/routes";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";
import { useSubmitHorizonTx } from "@/query/useSubmitHorizonTx";

import { Box } from "@/components/layout/Box";
import { PrettyJson } from "@/components/PrettyJson";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { TxResponse } from "@/components/TxResponse";
import { SaveTransactionModal } from "@/components/SaveTransactionModal";

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

export default function SubmitTransaction() {
  const { network, xdr, transaction } = useStore();
  const { blob, updateXdrBlob } = xdr;

  const isXdrInit = useIsXdrInit();
  const router = useRouter();

  const [isSaveTxnModalVisible, setIsSaveTxnModalVisible] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [submitMethod, setSubmitMethod] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef?.current?.contains(event.target as Node)) {
      return;
    }

    toggleDropdown(false);
  }, []);

  // Set default submit method
  useEffect(() => {
    setSubmitMethod(isRpcAvailable ? "rpc" : "horizon");
    resetSubmitState();
    // Not including resetSubmitState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRpcAvailable]);

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
    if (submitMethod === "rpc") {
      submitRpc({
        rpcUrl: network.rpcUrl,
        transactionXdr: blob,
        networkPassphrase: network.passphrase,
      });
    } else if (submitMethod === "horizon") {
      submitHorizon({
        horizonUrl: network.horizonUrl,
        transactionXdr: blob,
        networkPassphrase: network.passphrase,
      });
    } else {
      // Do nothing
    }
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

  const renderSuccess = () => {
    if (isSubmitRpcSuccess && submitRpcResponse) {
      return (
        <ValidationResponseCard
          variant="success"
          title="Transaction submitted!"
          subtitle={`Transaction succeeded with ${submitRpcResponse.operationCount} operation(s)`}
          response={
            <Box gap="xs">
              <TxResponse label="Hash:" value={submitRpcResponse.hash} />
              <TxResponse
                label="Ledger number:"
                value={submitRpcResponse.result.ledger}
              />
              <TxResponse
                label="Envelope XDR:"
                value={submitRpcResponse.result.envelopeXdr
                  .toXDR("base64")
                  .toString()}
              />
              <TxResponse
                label="Result XDR:"
                value={submitRpcResponse.result.resultXdr
                  .toXDR("base64")
                  .toString()}
              />
              <TxResponse
                label="Result Meta XDR:"
                value={submitRpcResponse.result.resultMetaXdr
                  .toXDR("base64")
                  .toString()}
              />
              <TxResponse label="Fee:" value={submitRpcResponse.fee} />
            </Box>
          }
        />
      );
    }

    if (isSubmitHorizonSuccess && submitHorizonResponse) {
      return (
        <ValidationResponseCard
          variant="success"
          title="Transaction submitted!"
          subtitle={`Transaction succeeded with ${submitHorizonResponse.operation_count} operation(s)`}
          response={
            <Box gap="xs">
              <TxResponse label="Hash:" value={submitHorizonResponse.hash} />
              <TxResponse
                label="Ledger number:"
                value={submitHorizonResponse.ledger}
              />
              <TxResponse
                label="Envelope XDR:"
                value={submitHorizonResponse.envelope_xdr}
              />
              <TxResponse
                label="Result XDR:"
                value={submitHorizonResponse.result_xdr}
              />
              <TxResponse
                label="Result Meta XDR:"
                value={submitHorizonResponse.result_meta_xdr}
              />
              <TxResponse
                label="Fee charged:"
                value={submitHorizonResponse.fee_charged}
              />
            </Box>
          }
        />
      );
    }

    return null;
  };

  const renderError = () => {
    if (submitRpcError) {
      return <RpcErrorResponse error={submitRpcError} />;
    }

    if (submitHorizonError) {
      return <HorizonErrorResponse error={submitHorizonError} />;
    }

    return null;
  };

  return (
    <Box gap="md">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          Submit Transaction
        </Text>
      </div>
      <Card>
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
              <div className="PageBody__content PageBody__scrollable">
                <PrettyJson json={JSON.parse(xdrJson.jsonString)} />
              </div>
            ) : null}
          </>
        </Box>
      </Card>

      <>{renderSuccess()}</>
      <>{renderError()}</>

      <SaveTransactionModal
        type="save"
        page="submit"
        isVisible={isSaveTxnModalVisible}
        onClose={() => {
          setIsSaveTxnModalVisible(false);
        }}
        xdr={blob}
      />
    </Box>
  );
}
