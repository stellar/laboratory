"use client";

import { useState } from "react";
import { Button, Icon } from "@stellar/design-system";

import { TransactionBuildParams } from "@/store/createTransactionFlowStore";

import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";

import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import { TransactionFlowHeader } from "@/components/TransactionFlowHeader";

import { TxnOperation } from "@/types/types";

interface BuildStepHeaderProps {
  /** Step title displayed on the left. */
  heading: string;
  /** Semantic heading element for the page header. */
  headingAs?: "h1" | "h2";
  /** The currently active step */
  activeStep?: string;
  /** Built XDR string, used for saving on the build/import step */
  xdr?: string;
  /** Transaction build params for saving */
  params?: TransactionBuildParams;
  /** Transaction operations for saving */
  operations?: TxnOperation[];
  /** Callback for resetting the entire transaction build flow. */
  onClearAll: () => void;
}

export const BuildStepHeader = ({
  heading,
  headingAs,
  activeStep = "",
  xdr,
  params,
  operations,
  onClearAll,
}: BuildStepHeaderProps) => {
  const showHeaderButtons = activeStep === "build" || activeStep === "import";
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  return (
    <TransactionFlowHeader
      heading={heading}
      headingAs={headingAs}
      onClearAll={onClearAll}
      rightElement={
        showHeaderButtons ? (
          <>
            <Button
              size="md"
              variant="tertiary"
              data-testid="save-to-local-storage-button"
              onClick={() => setIsSaveModalVisible(true)}
            >
              <Icon.Save01 />
            </Button>

            <SaveToLocalStorageModal
              type="save"
              itemTitle="Transaction"
              itemProps={{
                xdr: xdr || "",
                page: "build",
                ...(params ? { params } : {}),
                ...(operations ? { operations } : {}),
              }}
              allSavedItems={localStorageSavedTransactions.get()}
              isVisible={isSaveModalVisible}
              onClose={() => {
                setIsSaveModalVisible(false);
              }}
              onUpdate={(updatedItems) => {
                localStorageSavedTransactions.set(updatedItems);
              }}
            />
          </>
        ) : null
      }
    />
  );
};
