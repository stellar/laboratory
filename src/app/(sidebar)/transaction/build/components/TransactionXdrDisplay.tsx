import { Button } from "@stellar/design-system";

import { SdsLink } from "@/components/SdsLink";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { Box } from "@/components/layout/Box";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";
import { Routes } from "@/constants/routes";

interface TransactionXdrDisplayProps {
  xdr: string;
  networkPassphrase: string;
  txnHash: string;
  dataTestId: string;
  onSignClick: () => void;
  onViewXdrClick: () => void;
}

export const TransactionXdrDisplay = ({
  xdr,
  networkPassphrase,
  txnHash,
  dataTestId,
  onSignClick,
  onViewXdrClick,
}: TransactionXdrDisplayProps) => (
  <ValidationResponseCard
    variant="success"
    title="Success! Transaction Envelope XDR:"
    response={
      <Box gap="xs" data-testid={dataTestId}>
        <div>
          <div>Network Passphrase:</div>
          <div>{networkPassphrase}</div>
        </div>
        <div>
          <div>Hash:</div>
          <div>{txnHash}</div>
        </div>
        <div>
          <div>XDR:</div>
          <div>{xdr}</div>
        </div>
      </Box>
    }
    note={
      <>
        In order for the transaction to make it into the ledger, a transaction
        must be successfully signed and submitted to the network. The Lab
        provides the{" "}
        <SdsLink href={Routes.SIGN_TRANSACTION}>Transaction Signer</SdsLink> for
        signing a transaction, and the{" "}
        <SdsLink href={Routes.SUBMIT_TRANSACTION}>
          Post Transaction endpoint
        </SdsLink>{" "}
        for submitting one to the network.
      </>
    }
    footerLeftEl={
      <>
        <Button size="md" variant="secondary" onClick={onSignClick}>
          Sign in Transaction Signer
        </Button>

        <ViewInXdrButton xdrBlob={xdr} callback={onViewXdrClick} />
      </>
    }
  />
);
