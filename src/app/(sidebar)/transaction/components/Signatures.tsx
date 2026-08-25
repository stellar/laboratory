import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";
import { Icon, Text } from "@stellar/design-system";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import {
  Envelope,
  getRequiredSigners,
} from "@/helpers/checkRequiredSignatures";

import {
  MatchStatus,
  ResolvedSignatureRow,
  resolveSignatureRows,
} from "./resolveSignatureRows";

import { Box } from "@/components/layout/Box";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import "../styles.scss";

const ENVELOPE_LABELS: Record<Envelope, string> = {
  outer: "Fee-bump envelope signature",
  inner: "Inner transaction signature(s)",
};

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
    return {
      envelope: env.envelope,
      signers: env.signers,
      signatures,
      rows: resolveSignatureRows(signatures, env.signers, env.hash),
    };
  });

  const hasAnyEnvelopeSig = envelopes.some((e) => e.signatures.length > 0);

  if (!hasAnyEnvelopeSig) {
    return (
      <TransactionTabEmptyMessage title="No signatures">
        This transaction has no signatures.
      </TransactionTabEmptyMessage>
    );
  }

  return (
    <div className="Signatures">
      {envelopes.map((env) => {
        if (env.rows.length === 0) return null;

        return (
          <EnvelopeSignaturesTable
            key={env.envelope}
            envelope={env.envelope}
            rows={env.rows}
            showLabel={isFeeBump}
          />
        );
      })}
    </div>
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

      <div className="Signatures__gridTableContainer">
        <table>
          <thead>
            <tr>
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
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${envelope}-${index}-${row.hint}`}>
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
      <span>Existing signer (unverified)</span>
    </Box>
  );
};
