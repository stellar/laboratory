"use client";

import { useState } from "react";
import { Button, Icon, Modal } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { PageHeader } from "@/components/layout/PageHeader";

import "./styles.scss";

interface TransactionFlowHeaderProps {
  /** Step title displayed on the left. */
  heading: string;
  /** Semantic heading element for the page header. */
  headingAs?: "h1" | "h2";
  /** Optional right element */
  rightElement?: React.ReactElement | null;
  /** Callback for resetting the entire transaction build flow. */
  onClearAll: () => void;
}

export const TransactionFlowHeader = ({
  heading,
  headingAs,
  rightElement,
  onClearAll,
}: TransactionFlowHeaderProps) => {
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);

  return (
    <Box
      gap="md"
      direction="row"
      justify="space-between"
      align="center"
      addlClassName="TransactionFlowHeader"
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

        {rightElement && rightElement}
      </Box>
    </Box>
  );
};
