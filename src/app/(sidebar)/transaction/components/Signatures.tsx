import { FeeBumpTransaction, Transaction, xdr } from "@stellar/stellar-sdk";
import { Icon, Text } from "@stellar/design-system";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import {
  findKeyBySignatureHint,
  verifySignature,
} from "@/helpers/signatureHint";

import {
  Envelope,
  getRequiredSigners,
} from "@/helpers/checkRequiredSignatures";

import { Box } from "@/components/layout/Box";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import "../styles.scss";

const ENVELOPE_LABELS: Record<Envelope, string> = {
  outer: "Fee-bump envelope signatures",
  inner: "Inner transaction signatures",
};

type MatchStatus = "valid" | "invalid" | "unknown";

type ResolvedSignatureRow = {
  hint: string;
  signature: string;
  signerPubKey?: string;
  matchStatus: MatchStatus;
};

const resolveRows = (
  signatures: xdr.DecoratedSignature[],
  signers: string[],
  hashHex: string,
): ResolvedSignatureRow[] =>
  signatures.map((sig) => {
    const hint = sig.hint().toString("hex");
    const signature = sig.signature().toString("hex");
    const signerPubKey = findKeyBySignatureHint(hint, signers);

    let matchStatus: MatchStatus;
    if (!signerPubKey) {
      matchStatus = "unknown";
    } else if (verifySignature({ hint, signature }, signerPubKey, hashHex)) {
      matchStatus = "valid";
    } else {
      matchStatus = "invalid";
    }

    return { hint, signature, signerPubKey, matchStatus };
  });

export const Signatures = ({
  tx,
}: {
  tx: Transaction | FeeBumpTransaction | null;
}) => {
  if (!tx) {
    return null;
  }

  const isFeeBump = tx instanceof FeeBumpTransaction;

  const envelopes = getRequiredSigners(tx).map((env) => {
    const signatures =
      env.envelope === "outer"
        ? tx.signatures
        : (tx as FeeBumpTransaction).innerTransaction.signatures;
    const hashHex = env.hash.toString("hex");

    return {
      envelope: env.envelope,
      signers: env.signers,
      hashHex,
      signatures,
      rows: resolveRows(signatures, env.signers, hashHex),
    };
  });

  const hasAnyEnvelopeSig = envelopes.some((e) => e.signatures.length > 0);
  const hasUnknownSigner = envelopes.some((e) =>
    e.rows.some((r) => r.matchStatus === "unknown"),
  );

  if (!hasAnyEnvelopeSig) {
    return (
      <TransactionTabEmptyMessage title="No signatures">
        This transaction has no signatures.
      </TransactionTabEmptyMessage>
    );
  }

  return (
    <Box gap="lg" addlClassName="Signatures">
      {envelopes.map((env) =>
        env.rows.length === 0 ? null : (
          <EnvelopeSignaturesTable
            key={env.envelope}
            envelope={env.envelope}
            rows={env.rows}
            showLabel={isFeeBump}
          />
        ),
      )}

      {hasUnknownSigner && (
        <Text as="div" size="xs" weight="regular" addlClassName="info-message">
          Signatures from unrecognized signers detected. Submit to verify.
        </Text>
      )}
    </Box>
  );
};

const EnvelopeSignaturesTable = ({
  envelope,
  rows,
  showLabel,
}: {
  envelope: Envelope;
  rows: ResolvedSignatureRow[];
  showLabel: boolean;
}) => {
  return (
    <>
      {showLabel ? (
        <Text as="h3" size="sm" weight="medium">
          {ENVELOPE_LABELS[envelope]}
        </Text>
      ) : null}
      <Text as="div" size="xs" weight="regular">
        Cryptographic signatures that authorize this transaction. Each signature
        includes the signer’s public key, signature value, and hint.
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
          <tbody>
            {rows.map((row, index) => (
              <tr role="row" key={`${envelope}-${index}-${row.hint}`}>
                <td>
                  <SignatureCell>
                    {renderSigner(row.matchStatus, row.signerPubKey)}
                  </SignatureCell>
                </td>
                <td>
                  <SignatureCell isSignature={true}>
                    <code>{row.signature}</code>
                  </SignatureCell>
                </td>
                <td>
                  <SignatureCell>{row.hint}</SignatureCell>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
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

const renderSigner = (matchStatus: MatchStatus, signer?: string) => {
  if (matchStatus === "valid" && signer) {
    return (
      <Box
        gap="xs"
        direction="row"
        align="center"
        addlClassName="success-message"
      >
        <Icon.CheckCircle />
        <span>{shortenStellarAddress(signer)}</span>
      </Box>
    );
  }

  if (matchStatus === "invalid" && signer) {
    return (
      <Box
        gap="xs"
        direction="row"
        align="center"
        addlClassName="error-message"
      >
        <Icon.XCircle />
        <span>{shortenStellarAddress(signer)}</span>
      </Box>
    );
  }

  // "unknown" — signature did not match any signer derivable from the tx
  // envelope (likely an on-chain cosigner that the offline check cannot
  // see). Surface as informational, not as an error.
  return (
    <Box gap="xs" direction="row" align="center" addlClassName="info-message">
      <Icon.InfoCircle />
      <span>Unrecognized signer</span>
    </Box>
  );
};
