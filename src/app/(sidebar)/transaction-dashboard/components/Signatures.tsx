import { TransactionBuilder } from "@stellar/stellar-sdk";
import { Icon, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { useStore } from "@/store/useStore";

import { getTxData } from "@/helpers/getTxData";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import {
  findKeyBySignatureHint,
  verifySignature,
} from "@/helpers/signatureHint";
import * as StellarXdr from "@/helpers/StellarXdr";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { RpcTxJsonResponse } from "@/types/types";

export const Signatures = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null;
}) => {
  const { transaction, feeBumpTx, signatures, txHash } = getTxData(txDetails);
  const isXdrInit = useIsXdrInit();
  const { network } = useStore();

  if (!signatures || signatures.length === 0 || !txHash) {
    return null;
  }

  const feeBumpInnerTxXdr =
    isXdrInit &&
    feeBumpTx.tx.inner_tx &&
    StellarXdr.encode(
      "TransactionEnvelope",
      JSON.stringify(feeBumpTx.tx.inner_tx),
    );

  const feeBumpInnerTxHash = feeBumpInnerTxXdr
    ? TransactionBuilder.fromXDR(feeBumpInnerTxXdr, network.passphrase)
        .hash()
        .toString("hex")
    : undefined;

  const possibleSigners = getPossibleSigners(
    signatures,
    transaction,
    feeBumpTx,
  );

  const renderTableBody = () => {
    return signatures.map(
      ({ hint, signature }: { hint: string; signature: string }) => {
        const rowKey = `table-row-${hint}`;

        const signerPubKey = findKeyBySignatureHint(hint, possibleSigners);

        const isVerified = verifySignature(
          { hint, signature },
          signerPubKey,
          feeBumpInnerTxHash ? feeBumpInnerTxHash : txHash,
        );

        return (
          <tr role="row" key={rowKey}>
            <td>
              <SignatureCell>
                {signerPubKey ? renderSigner(isVerified, signerPubKey) : "-"}
              </SignatureCell>
            </td>
            <td>
              <SignatureCell isSignature={true}>
                <code>{signature}</code>
              </SignatureCell>
            </td>
            <td>
              <SignatureCell>{hint}</SignatureCell>
            </td>
          </tr>
        );
      },
    );
  };

  return (
    <Box gap="md" addlClassName="Signatures">
      <div className="Signatures__gridTableContainer">
        <table role="table">
          <thead>
            <tr role="row">
              <th>
                <SignatureCell isHeader={true}>Signer</SignatureCell>
              </th>
              <th>
                <SignatureCell isHeader={true}>Signature</SignatureCell>
              </th>
              <th>
                <SignatureCell isHeader={true}>Hint</SignatureCell>
              </th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </Box>
  );
};

const SignatureCell = ({
  children,
  isHeader,
  isSignature,
}: {
  children: React.ReactNode;
  isHeader?: boolean;
  isSignature?: boolean;
}) => {
  return (
    <Text
      size="sm"
      as="div"
      weight="medium"
      addlClassName="Signatures__text"
      {...(isHeader ? { "data-is-header": true } : {})}
      {...(isSignature ? { "data-is-signature": true } : {})}
    >
      {children}
    </Text>
  );
};

const renderSigner = (isVerified: boolean, signer: string) => {
  return isVerified ? (
    <Box
      gap="xs"
      direction="row"
      align="center"
      addlClassName="success-message"
    >
      <Icon.CheckCircle />
      <span>{shortenStellarAddress(signer)}</span>
    </Box>
  ) : (
    <Box gap="xs" direction="row" align="center" addlClassName="error-message">
      <Icon.XCircle />
      <span>{shortenStellarAddress(signer)}</span>
    </Box>
  );
};

// Helper function to get possible signers
const getPossibleSigners = (
  signatures: any[] | undefined,
  transaction: any,
  feeBumpTx: any,
) => {
  if (!signatures || signatures.length === 0 || !transaction) {
    return [];
  }

  const allPossibleSigners: string[] = [];

  const addSigner = (key: string | undefined) => {
    if (key && !allPossibleSigners.includes(key)) {
      allPossibleSigners.push(key);
    }
  };

  // #1: Single signature case - only source account
  if (
    signatures.length === 1 &&
    findKeyBySignatureHint(signatures[0].hint, [transaction?.source_account])
  ) {
    addSigner(transaction?.source_account);
  }

  // #2: Fee bump transaction
  if (feeBumpTx?.tx?.fee_source) {
    addSigner(feeBumpTx?.tx?.fee_source);
  } else {
    // #3: Regular transaction - source account + operation sources
    addSigner(transaction.source_account);

    for (const operation of transaction.operations) {
      addSigner(operation.source || transaction.source_account);
    }

    // Soroban Transaction doesn't use extra signers
  }
  return allPossibleSigners;
};
