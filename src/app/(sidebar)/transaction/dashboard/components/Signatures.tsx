import { StrKey, TransactionBuilder } from "@stellar/stellar-sdk";
import { Icon, Link, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { getTxData } from "@/helpers/getTxData";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import {
  findKeyBySignatureHint,
  verifySignature,
} from "@/helpers/signatureHint";
import * as StellarXdr from "@/helpers/StellarXdr";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { Box } from "@/components/layout/Box";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import { RpcTxJsonResponse } from "@/types/types";

export const Signatures = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null;
}) => {
  const { transaction, feeBumpTx, signatures, operations, txHash } =
    getTxData(txDetails);
  const isXdrInit = useIsXdrInit();
  const { network } = useStore();

  const authEntries = getAuthEntries(operations);

  if (
    (!signatures || signatures.length === 0 || !txHash) &&
    authEntries.length === 0
  ) {
    return (
      <TransactionTabEmptyMessage title="No signatures">
        This transaction has no signatures.
      </TransactionTabEmptyMessage>
    );
  }

  const feeBumpInnerTxXdr =
    feeBumpTx?.tx?.inner_tx &&
    isXdrInit &&
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
    if (!signatures || signatures.length === 0) {
      return null;
    }

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

  const renderAuthEntriesTableBody = () => {
    return authEntries.map((entry, index) => {
      const rowKey = `auth-entry-row-${index}`;
      const isMatch = verifyAuthEntryPublicKey(entry.publicKey, entry.address);

      return (
        <tr role="row" key={rowKey}>
          <td>
            <SignatureCell>
              {renderSigner(isMatch, entry.address)}
            </SignatureCell>
          </td>
          <td>
            <SignatureCell isSignature={true}>
              <code>{entry.signature}</code>
            </SignatureCell>
          </td>
          <td>
            <SignatureCell>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `https://lab.stellar.org${buildContractExplorerHref(entry.contractId)}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                {shortenStellarAddress(entry.contractId)}
              </Link>
            </SignatureCell>
          </td>
        </tr>
      );
    });
  };

  return (
    <Box gap="lg" addlClassName="Signatures">
      {signatures && signatures.length > 0 && txHash && (
        <>
          <Text as="div" size="xs" weight="regular">
            Cryptographic signatures that authorize this transaction. Each
            signature includes the signer&apos;s public key, signature value,
            and hint.
          </Text>
          <div className="Signatures__gridTableContainer">
            <table>
              <thead>
                <tr>
                  <th>
                    <SignatureCell isHeader={true}>
                      Transaction signer
                    </SignatureCell>
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
        </>
      )}

      {authEntries.length > 0 && (
        <>
          <Text as="div" size="xs" weight="regular">
            Soroban authorization entry signatures.
          </Text>
          <div className="Signatures__gridTableContainer">
            <table>
              <thead>
                <tr>
                  <th>
                    <SignatureCell isHeader={true}>
                      Auth entry signer
                    </SignatureCell>
                  </th>
                  <th>
                    <SignatureCell isHeader={true}>Signature</SignatureCell>
                  </th>
                  <th>
                    <SignatureCell isHeader={true}>Contract</SignatureCell>
                  </th>
                </tr>
              </thead>
              <tbody>{renderAuthEntriesTableBody()}</tbody>
            </table>
          </div>
        </>
      )}
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
      addlClassName="Signatures__cell"
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

/**
 * Verifies that the public key bytes in an auth entry signature match the
 * credential address (G... key).
 */
const verifyAuthEntryPublicKey = (
  publicKeyHex: string,
  address: string,
): boolean => {
  try {
    const publicKeyBytes = Buffer.from(publicKeyHex, "hex");
    const derivedAddress = StrKey.encodeEd25519PublicKey(publicKeyBytes);
    return derivedAddress === address;
  } catch {
    return false;
  }
};

// Helper to extract auth entry signatures from operations
type AuthEntryInfo = {
  address: string;
  publicKey: string;
  signature: string;
  contractId: string;
};

const getAuthEntries = (operations: any[] | undefined): AuthEntryInfo[] => {
  if (!operations) {
    return [];
  }

  return operations
    .flatMap((op) => op?.body?.invoke_host_function?.auth ?? [])
    .map(parseAuthEntry)
    .filter((entry): entry is AuthEntryInfo => entry !== null);
};

const parseAuthEntry = (authEntry: any): AuthEntryInfo | null => {
  const creds = authEntry?.credentials?.address;
  const sigMap = creds?.signature?.vec?.[0]?.map;

  if (!Array.isArray(sigMap)) {
    return null;
  }

  const publicKey = sigMap.find(
    (item: any) => item?.key?.symbol === "public_key",
  )?.val?.bytes;
  const signature = sigMap.find(
    (item: any) => item?.key?.symbol === "signature",
  )?.val?.bytes;

  if (!signature || !publicKey) {
    return null;
  }

  const contractFn = authEntry?.root_invocation?.function?.contract_fn;

  return {
    address: creds.address || "",
    publicKey,
    signature,
    contractId: contractFn ? contractFn.contract_address : "-",
  };
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
