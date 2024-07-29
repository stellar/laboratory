"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Text, Card, Input, Icon, Button } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { NextLink } from "@/components/NextLink";
import { Box } from "@/components/layout/Box";
import { Routes } from "@/constants/routes";
import { InputSideElement } from "@/components/InputSideElement";
import { SaveTransactionModal } from "@/components/SaveTransactionModal";

import { TRANSACTION_OPERATIONS } from "@/constants/transactionOperations";
import { formatTimestamp } from "@/helpers/formatTimestamp";
import { useStore } from "@/store/useStore";
import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";
import { arrayItem } from "@/helpers/arrayItem";

import { SavedTransaction } from "@/types/types";

export default function SavedTransactions() {
  const { network, transaction } = useStore();
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

  const handleViewInBuilder = (timestamp: number) => {
    const found = localStorageSavedTransactions
      .get()
      .find((t) => t.timestamp === timestamp);

    if (found) {
      router.push(Routes.BUILD_TRANSACTION);
      transaction.updateBuildActiveTab("params");
      transaction.setBuildParams(found.params);
      transaction.updateBuildOperations(found.operations);
    }
  };

  const SavedTxn = ({ txn }: { txn: SavedTransaction }) => {
    return (
      <Box gap="sm" addlClassName="PageBody__content">
        <Input
          id={`saved-txn-${txn.timestamp}`}
          fieldSize="md"
          value={txn.name}
          readOnly
          leftElement={
            <InputSideElement
              variant="text"
              placement="left"
              addlClassName="SavedTransactions__name__postMethod"
            >
              POST
            </InputSideElement>
          }
          rightElement={
            <InputSideElement
              variant="button"
              placement="right"
              onClick={() => {
                setCurrentTxnTimestamp(txn.timestamp);
              }}
              icon={<Icon.Edit05 />}
            />
          }
        />

        <>
          {txn.operations.length === 0
            ? null
            : txn.operations.map((o, idx) => (
                <Input
                  key={`saved-txn-${txn.timestamp}-op-${idx}`}
                  id={`saved-txn-${txn.timestamp}-op-${idx}`}
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

        <Box gap="lg" direction="row" align="center" justify="space-between">
          <Box gap="sm" direction="row">
            <Button
              size="md"
              variant="tertiary"
              type="button"
              onClick={() => handleViewInBuilder(txn.timestamp)}
            >
              View in builder
            </Button>
          </Box>

          <Box gap="sm" direction="row" align="center" justify="end">
            <Text
              as="div"
              size="xs"
            >{`Last saved ${formatTimestamp(txn.timestamp)}`}</Text>

            <Button
              size="md"
              variant="error"
              icon={<Icon.Trash01 />}
              type="button"
              onClick={() => {
                const allTxns = localStorageSavedTransactions.get();
                const indexToUpdate = allTxns.findIndex(
                  (t) => t.timestamp === txn.timestamp,
                );

                if (indexToUpdate >= 0) {
                  const updatedList = arrayItem.delete(allTxns, indexToUpdate);

                  localStorageSavedTransactions.set(updatedList);
                  updateSavedTxns();
                }
              }}
            ></Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box gap="md">
      <Box gap="md">
        <div className="PageHeader">
          <Text size="md" as="h1" weight="medium">
            Saved Transactions
          </Text>
        </div>

        <Card>
          <Box gap="md">
            <>
              {savedTxns.length === 0
                ? `There are no saved transactions on ${network.label} network.`
                : savedTxns.map((t) => (
                    <SavedTxn key={`txn-${t.timestamp}`} txn={t} />
                  ))}
            </>
          </Box>
        </Card>
      </Box>

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
        title="Looking for your saved endpoints?"
        placement="inline"
      >
        <NextLink href={`${Routes.ENDPOINTS_SAVED}`} sds-variant="primary">
          See saved endpoints
        </NextLink>
      </Alert>

      <SaveTransactionModal
        type="editName"
        isVisible={currentTxnTimestamp !== undefined}
        onClose={(isUpdate?: boolean) => {
          setCurrentTxnTimestamp(undefined);

          if (isUpdate) {
            updateSavedTxns();
          }
        }}
        txnTimestamp={currentTxnTimestamp}
      />
    </Box>
  );
}
