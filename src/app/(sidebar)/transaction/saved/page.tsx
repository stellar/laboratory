"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Input, Icon, Button } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { NextLink } from "@/components/NextLink";
import { Box } from "@/components/layout/Box";
import { Routes } from "@/constants/routes";
import { InputSideElement } from "@/components/InputSideElement";
import { ShareUrlButton } from "@/components/ShareUrlButton";
import { SavedItemTimestampAndDelete } from "@/components/SavedItemTimestampAndDelete";
import { PageCard } from "@/components/layout/PageCard";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";

import { useStore } from "@/store/useStore";
import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";
import { arrayItem } from "@/helpers/arrayItem";
import { isSorobanOperationType } from "@/helpers/sorobanUtils";

import { TRANSACTION_OPERATIONS } from "@/constants/transactionOperations";
import { SavedTransaction, SavedTransactionPage } from "@/types/types";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export default function SavedTransactions() {
  const { network } = useStore();
  const router = useRouter();

  const [savedTxns, setSavedTxns] = useState<SavedTransaction[]>([]);
  const [currentTxnTimestamp, setCurrentTxnTimestamp] = useState<
    number | undefined
  >();

  const updateSavedTxns = useCallback(() => {
    const txns = localStorageSavedTransactions
      .get()
      .filter((s) => s.network.id === network.id);
    setSavedTxns(txns);
  }, [network.id]);

  useEffect(() => {
    updateSavedTxns();
  }, [updateSavedTxns]);

  const findLocalStorageTx = (timestamp: number) => {
    return localStorageSavedTransactions
      .get()
      .find((t) => t.timestamp === timestamp);
  };

  const handleViewInBuilder = (timestamp: number) => {
    const found = findLocalStorageTx(timestamp);

    if (found) {
      const flowStore = useBuildFlowStore.getState();

      // Reset the flow store to a clean state before populating
      flowStore.resetAll();

      trackEvent(TrackingEvent.TRANSACTION_SAVED_VIEW_BUILDER);

      if (found.params) {
        flowStore.setBuildParams(found.params);
      }

      if (found.operations) {
        const isSorobanTx = isSorobanOperationType(
          found?.operations?.[0]?.operation_type,
        );

        if (isSorobanTx) {
          flowStore.setBuildSorobanOperation(found.operations[0]);
        } else {
          flowStore.setBuildClassicOperations(found.operations);
        }

        if (found.xdr) {
          if (isSorobanTx) {
            flowStore.setBuildSorobanXdr(found.xdr);
          } else {
            flowStore.setBuildClassicXdr(found.xdr);
          }
        }
      }

      router.push(Routes.BUILD_TRANSACTION);
    }
  };

  const handleViewInSubmitter = (timestamp: number) => {
    const found = findLocalStorageTx(timestamp);

    if (found) {
      const flowStore = useBuildFlowStore.getState();

      trackEvent(TrackingEvent.TRANSACTION_SAVED_VIEW_SUBMITTER);

      // Reset and seed the flow store at the submit step with the signed XDR
      flowStore.resetAll();

      if (found.xdr) {
        flowStore.setSignedXdr(found.xdr);
      }

      flowStore.setActiveStep("submit");
      useBuildFlowStore.setState({ highestCompletedStep: "sign" });

      router.push(Routes.BUILD_TRANSACTION);
    }
  };

  const renderActionButton = (id: number, page: SavedTransactionPage) => {
    switch (page) {
      case "build":
        return (
          <Button
            size="md"
            variant="tertiary"
            type="button"
            onClick={() => handleViewInBuilder(id)}
          >
            View in builder
          </Button>
        );
      case "submit":
        return (
          <Button
            size="md"
            variant="tertiary"
            type="button"
            onClick={() => handleViewInSubmitter(id)}
          >
            View in submitter
          </Button>
        );
      default:
        return null;
    }
  };

  const SavedTxn = ({ txn }: { txn: SavedTransaction }) => (
    <Box
      gap="sm"
      addlClassName="PageBody__content"
      data-testid="saved-transactions-item"
    >
      <Input
        id={`saved-txn-${txn.timestamp}`}
        data-testid="saved-transactions-name"
        fieldSize="md"
        value={txn.name}
        readOnly
        rightElement={
          <InputSideElement
            variant="button"
            placement="right"
            onClick={() => {
              setCurrentTxnTimestamp(txn.timestamp);
            }}
            icon={<Icon.Edit05 />}
            data-testid="saved-transactions-edit"
          />
        }
      />

      <>
        {!txn.operations || txn.operations.length === 0
          ? null
          : txn.operations.map((o, idx) => (
              <Input
                key={`saved-txn-${txn.timestamp}-op-${idx}`}
                id={`saved-txn-${txn.timestamp}-op-${idx}`}
                data-testid="saved-transactions-op"
                fieldSize="md"
                value={
                  TRANSACTION_OPERATIONS[o.operation_type]?.label ||
                  "Operation type not selected"
                }
                readOnly
                leftElement={idx + 1}
              />
            ))}
      </>

      <Box
        gap="lg"
        direction="row"
        align="center"
        justify="space-between"
        addlClassName="Endpoints__urlBar__footer"
      >
        <Box gap="sm" direction="row">
          <>
            {renderActionButton(txn.timestamp, txn.page)}
            {txn.shareableUrl ? (
              <ShareUrlButton shareableUrl={txn.shareableUrl} />
            ) : null}
          </>
        </Box>

        <Box gap="sm" direction="row" align="center" justify="end">
          <SavedItemTimestampAndDelete
            timestamp={txn.timestamp}
            onDelete={() => {
              const allTxns = localStorageSavedTransactions.get();
              const indexToUpdate = allTxns.findIndex(
                (t) => t.timestamp === txn.timestamp,
              );

              if (indexToUpdate >= 0) {
                const updatedList = arrayItem.delete(allTxns, indexToUpdate);

                localStorageSavedTransactions.set(updatedList);
                updateSavedTxns();

                trackEvent(TrackingEvent.TRANSACTION_SAVED_DELETE);
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box gap="md" data-testid="saved-transactions-container">
      <PageCard heading="Saved transactions">
        <Box gap="md">
          <>
            {savedTxns.length === 0
              ? `There are no saved transactions on ${network.label} network.`
              : savedTxns.map((t) => (
                  <SavedTxn key={`txn-${t.timestamp}`} txn={t} />
                ))}
          </>
        </Box>
      </PageCard>

      <Alert
        variant="primary"
        title="Looking for your other saved transactions?"
        placement="inline"
        icon={<Icon.Server06 />}
      >
        Switch your network in the top right to see your other saved
        transactions.
      </Alert>

      <Alert
        variant="primary"
        title="Looking for your saved requests?"
        placement="inline"
      >
        <NextLink href={`${Routes.SAVED_ENDPOINTS}`} sds-variant="primary">
          See saved requests
        </NextLink>
      </Alert>

      <SaveToLocalStorageModal
        type="editName"
        itemTitle="Transaction"
        itemTimestamp={currentTxnTimestamp}
        allSavedItems={localStorageSavedTransactions.get()}
        isVisible={currentTxnTimestamp !== undefined}
        onClose={(isUpdate?: boolean) => {
          setCurrentTxnTimestamp(undefined);

          if (isUpdate) {
            updateSavedTxns();
          }
        }}
        onUpdate={(updatedItems) => {
          localStorageSavedTransactions.set(updatedItems);

          trackEvent(TrackingEvent.TRANSACTION_SAVED_EDIT_SAVE);
        }}
      />
    </Box>
  );
}
