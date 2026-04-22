"use client";

import { useState } from "react";
import { Button, Icon, Modal } from "@stellar/design-system";

import { TransactionBuildParams } from "@/store/createTransactionFlowStore";

import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";

import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import { Box } from "@/components/layout/Box";
import { PageHeader } from "@/components/layout/PageHeader";

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

/**
 * Shared header for transaction build steps with a Clear all action.
 *
 * @example
 * <BuildStepHeader
 *   heading="Submit transaction"
 *   headingAs="h1"
 *   activeStep="build"
 *   xdr={builtXdr}
 *   params={build.params}
 *   operations={build.classic.operations}
 *   onClearAll={resetAll}
 *   xdr={builtXdr}
 *   params={build.params}
 *   operations={build.classic.operations} />
 */
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
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);

  return (
    <Box
      gap="md"
      direction="row"
      justify="space-between"
      align="center"
      addlClassName="BuildTransaction__header"
    >
      <PageHeader heading={heading} as={headingAs} />

      <Box gap="sm" direction="row" justify="center" align="center">
        <Button
          size="md"
          variant="tertiary"
          data-testid="clear-all-button"
          onClick={() => setIsClearModalVisible(true)}
        >
          <Icon.RefreshCw01 />
        </Button>

        <Modal
          visible={isClearModalVisible}
          onClose={() => setIsClearModalVisible(false)}
        >
          <Modal.Heading>Clear everything?</Modal.Heading>
          <Modal.Body>
            This will remove all entered data in the form.
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="md"
              variant="tertiary"
              onClick={() => setIsClearModalVisible(false)}
            >
              Cancel
            </Button>
            <Button
              size="md"
              variant="error"
              onClick={() => {
                onClearAll();
                setIsClearModalVisible(false);
              }}
            >
              Clear all
            </Button>
          </Modal.Footer>
        </Modal>

        {showHeaderButtons && (
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
        )}
      </Box>
    </Box>
  );
};
