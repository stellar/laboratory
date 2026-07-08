import { FeeBumpTransaction, Transaction, xdr } from "@stellar/stellar-sdk";
import { Card, Icon, Text } from "@stellar/design-system";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import {
  findKeyBySignatureHint,
  verifySignature,
} from "@/helpers/signatureHint";
import {
  Envelope,
  getRequiredSigners,
} from "@/helpers/checkRequiredSignatures";
import { hasSorobanData } from "@/helpers/sorobanUtils";

import { Box } from "@/components/layout/Box";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import "../styles.scss";

const ENVELOPE_LABELS: Record<Envelope, string> = {
  outer: "Fee-bump envelope signature",
  inner: "Inner transaction signature(s)",
};

const hasMaxTimeSet = (tx: Transaction | FeeBumpTransaction): boolean => {
  const inner = tx instanceof FeeBumpTransaction ? tx.innerTransaction : tx;
  const max = inner.timeBounds?.maxTime;
  return Boolean(max) && max !== "0";
};

type MatchStatus = "valid" | "invalid" | "unknown";

type ResolvedSignatureRow = {
  hint: string;
  signature: string;
  signerPubKey?: string;
  matchStatus: MatchStatus;
};

type EnvelopeSummaryContext = {
  isSoroban: boolean;
  isSimulated: boolean;
  hasTimebound: boolean;
};

type EnvelopeSummary = {
  message: string;
  // Optional secondary caution (Soroban freshness, unrecognized signers).
  note?: string;
};

const getEnvelopeSummary = (
  rows: ResolvedSignatureRow[],
  requiredSigners: string[],
  ctx: EnvelopeSummaryContext,
): EnvelopeSummary => {
  const hasInvalid = rows.some((r) => r.matchStatus === "invalid");

  if (hasInvalid) {
    return {
      message:
        "Invalid signature(s) detected — they won’t be accepted at submission.",
    };
  }

  if (ctx.isSoroban && !ctx.isSimulated) {
    return {
      message:
        "This Soroban transaction needs simulation, which will invalidate the existing signature(s). Re-sign after simulating.",
    };
  }

  // Coverage check: every required signer (the distinct source accounts
  // derivable from the envelope) must have a *valid* signature present.
  // Validity alone isn't enough — a tx with two source accounts signed by
  // only one is still incomplete. requiredSigners is an offline lower bound,
  // so this can't see on-chain multisig cosigners (per the no-RPC trade-off).
  const validSignerKeys = new Set(
    rows.filter((r) => r.matchStatus === "valid").map((r) => r.signerPubKey),
  );
  const missing = requiredSigners.filter((s) => !validSignerKeys.has(s));
  const hasUnrecognized = rows.some((r) => r.matchStatus === "unknown");

  if (missing.length > 0) {
    // A multisig account is often signed by on-chain cosigners instead of the
    // account key, which surface here as unrecognized signatures.
    if (hasUnrecognized) {
      return {
        message:
          "Includes signature(s) from signers that can’t be verified offline (e.g. multisig cosigners). You can submit to verify.",
      };
    }
    return {
      message: `Couldn’t verify a signature for ${missing.join(", ")} offline. If it’s a multisig account, an existing signature may already cover it on-chain — you can submit to let the network verify, or add a signature first.`,
    };
  }

  // Every required signer has a valid signature. Surface Soroban freshness and
  // unrecognized-signer cautions as a secondary note, leaving the verdict crisp.
  const notes: string[] = [];
  if (ctx.isSoroban) {
    notes.push(
      ctx.hasTimebound
        ? "Soroban simulation is time-sensitive — submit soon, or re-simulate if it’s been a while."
        : "No timebounds set — submit soon, since Soroban footprint entries can expire.",
    );
  }
  if (hasUnrecognized) {
    notes.push(
      "Signature(s) from unverified existing signers were also found.",
    );
  }

  return {
    message: "All required signatures are included.",
    note: notes.length > 0 ? notes.join(" ") : undefined,
  };
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
  parsedTxType,
}: {
  tx: Transaction | FeeBumpTransaction | null;
  parsedTxType?: "classic" | "soroban" | null;
}) => {
  if (!tx) {
    return null;
  }

  const isFeeBump = tx instanceof FeeBumpTransaction;
  const isSoroban = parsedTxType === "soroban";
  const isSimulated = isSoroban && hasSorobanData(tx);
  const hasTimebound = hasMaxTimeSet(tx);

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

  if (!hasAnyEnvelopeSig) {
    return (
      <TransactionTabEmptyMessage title="No signatures">
        This transaction has no signatures.
      </TransactionTabEmptyMessage>
    );
  }

  return (
    <Box gap="lg" addlClassName="Signatures">
      {envelopes.map((env) => {
        if (env.rows.length === 0) return null;

        // Soroban semantics (simulation, timebounds) only apply to the inner
        // transaction envelope. For a fee-bump's outer envelope, that's just
        // the fee-source signature — treat it as classic.
        const isInnerOrPlain = env.envelope === "inner" || !isFeeBump;
        const summaryContext: EnvelopeSummaryContext = {
          isSoroban: isSoroban && isInnerOrPlain,
          isSimulated,
          hasTimebound,
        };

        return (
          <EnvelopeSignaturesTable
            key={env.envelope}
            envelope={env.envelope}
            rows={env.rows}
            requiredSigners={env.signers}
            showLabel={isFeeBump}
            summaryContext={summaryContext}
          />
        );
      })}
    </Box>
  );
};

const EnvelopeSignaturesTable = ({
  envelope,
  rows,
  requiredSigners,
  showLabel,
  summaryContext,
}: {
  envelope: Envelope;
  rows: ResolvedSignatureRow[];
  requiredSigners: string[];
  showLabel: boolean;
  summaryContext: EnvelopeSummaryContext;
}) => {
  const summary = getEnvelopeSummary(rows, requiredSigners, summaryContext);

  return (
    <Card>
      <Box gap="md">
        {showLabel ? (
          <Text as="h3" size="sm" weight="medium">
            {ENVELOPE_LABELS[envelope]}
          </Text>
        ) : null}
        <Text as="div" size="xs" weight="medium">
          {summary.message}
        </Text>
        {summary.note ? (
          <Text as="div" size="xs" addlClassName="Signatures__note">
            {summary.note}
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
      </Box>
    </Card>
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
