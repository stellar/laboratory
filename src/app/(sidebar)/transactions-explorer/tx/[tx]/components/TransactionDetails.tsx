"use client";

import { StrKey, xdr as XDR, rpc as StellarRpc } from "@stellar/stellar-sdk";
import { Icon, Loader, Profile, Text, Tooltip } from "@stellar/design-system";
import { useEffect, useState, ReactNode, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { parseNumberAndBigInt, parse as jsonParse } from "lossless-json";

import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { SdsLink } from "@/components/SdsLink";

import { formatTimestamp } from "@/helpers/formatTimestamp";
import * as StellarXdr from "@/helpers/StellarXdr";
import { delayedAction } from "@/helpers/delayedAction";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";

import { Routes } from "@/constants/routes";
import { useStore } from "@/store/useStore";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { Stroop } from "./Stroop";

const InfoField = ({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) => (
  <Box gap="xs" direction="row" align="center" addlClassName="InfoFieldItem">
    <div className="InfoFieldItem__label">{label}</div>
    <div className="InfoFieldItem__value">{value ?? "-"}</div>
  </Box>
);

// Muxed (M...) source accounts are not rendered by this page, matching the
// pre-v17 behavior of only handling the ed25519 variant.
const encodeSourceAccount = (sourceAccount: XDR.MuxedAccount) =>
  XDR.isUnionVariant(sourceAccount, "keyTypeEd25519")
    ? StrKey.encodeEd25519PublicKey(sourceAccount.ed25519.toBytes())
    : null;

// An envelope is one of three variants. Handling all three means legacy v0
// envelopes render instead of throwing; v0 predates muxed accounts and carries
// a raw ed25519 key rather than a MuxedAccount.
const getEnvelopeDetails = (envelope: XDR.TransactionEnvelope) => {
  switch (envelope.type) {
    case "envelopeTypeTxV0":
      return {
        sourceAccount: StrKey.encodeEd25519PublicKey(
          envelope.v0.tx.sourceAccountEd25519.toBytes(),
        ),
        seqNum: envelope.v0.tx.seqNum,
        maxFee: envelope.v0.tx.fee,
      };
    case "envelopeTypeTx":
      return {
        sourceAccount: encodeSourceAccount(envelope.v1.tx.sourceAccount),
        seqNum: envelope.v1.tx.seqNum,
        maxFee: envelope.v1.tx.fee,
      };
    case "envelopeTypeTxFeeBump": {
      const innerTx = envelope.feeBump.tx.innerTx.v1.tx;

      return {
        sourceAccount: encodeSourceAccount(innerTx.sourceAccount),
        seqNum: innerTx.seqNum,
        maxFee: envelope.feeBump.tx.fee,
      };
    }
  }
};

export function TransactionDetails({
  tx,
}: {
  tx:
    | StellarRpc.Api.GetSuccessfulTransactionResponse
    | StellarRpc.Api.GetFailedTransactionResponse;
}) {
  const { endpoints } = useStore();
  const router = useRouter();
  const [isCodeWrapped, setIsCodeWrapped] = useState(false);
  const [xdrJson, setXdrJson] = useState<Record<string, unknown> | null>(null);
  const [xdr, setXdr] = useState("");
  const { sourceAccount, seqNum, maxFee } = getEnvelopeDetails(tx.envelopeXdr);
  const success = tx.status === StellarRpc.Api.GetTransactionStatus.SUCCESS;
  const feeCharged = tx.resultXdr.feeCharged;

  const maxFeeElement = (
    <Box align="center" direction="row" gap="xs">
      Max fee
      <Tooltip
        triggerEl={
          <div className="Label__infoButton" role="button">
            <Icon.InfoCircle />
          </div>
        }
      >
        Maximum fee specified in the transaction itself – the maximum XLM amount
        the source account willing to pay. Each transaction sets a fee that is
        paid by the source account. The more operations in the transaction, the
        greater the required fee.
      </Tooltip>
    </Box>
  );

  const feeChargedElement = (
    <Box align="center" direction="row" gap="xs">
      Fee charged
      <Tooltip
        triggerEl={
          <div className="Label__infoButton" role="button">
            <Icon.InfoCircle />
          </div>
        }
      >
        Actually charged fee which can be lower than the fee specified in the
        transaction. Each transaction sets a fee that is paid by the source
        account. The more operations in the transaction, the greater the
        required fee.
      </Tooltip>
    </Box>
  );

  const goToAccount: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!sourceAccount) {
      return;
    }

    endpoints.updateParams({ account_id: sourceAccount });

    delayedAction({
      action: () => {
        router.push(Routes.ENDPOINTS_ACCOUNTS_SINGLE);
      },
      delay: 100,
    });
  };

  const goToTransaction: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    endpoints.updateParams({ transaction: tx.txHash });

    delayedAction({
      action: () => {
        router.push(Routes.ENDPOINTS_TRANSACTIONS_SINGLE);
      },
      delay: 100,
    });
  };

  useIsXdrInit();

  useEffect(() => {
    const parse = async () => {
      try {
        const envelopeXdr = tx.envelopeXdr.toXdr("base64");
        const guesses = StellarXdr.guess(envelopeXdr);
        const json = jsonParse(
          StellarXdr.decode(guesses[0], envelopeXdr),
          null,
          parseNumberAndBigInt,
        );
        setXdrJson(json as Record<string, unknown>);
        setXdr(envelopeXdr);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // do nothing
      }
    };

    parse();
  }, [tx]);

  return (
    <Box gap="md" data-testid="explorer">
      <PageHeader heading="Transaction envelope" />
      <PageCard>
        <Box gap="xs" align="start">
          <InfoField
            label="Status"
            value={
              <Box
                direction="row"
                align="center"
                gap="xs"
                addlClassName={tx.status.toLowerCase()}
              >
                <Text size="xs" as="span">
                  {success ? "Successful" : "Failed"}
                </Text>
                {success ? (
                  <Icon.CheckCircle size="xs" color="currentColor" />
                ) : (
                  <Icon.XCircle size="xs" color="currentColor" />
                )}
              </Box>
            }
          />
          <InfoField
            label="Transaction"
            value={
              <SdsLink
                onClick={goToTransaction}
                href={buildEndpointHref(Routes.ENDPOINTS_TRANSACTIONS_SINGLE, {
                  transaction: tx.txHash,
                })}
              >
                <Box gap="xs" direction="row" align="center">
                  {tx.txHash}
                </Box>
              </SdsLink>
            }
          />
          <InfoField
            label="Source account"
            value={
              sourceAccount ? (
                <Box direction="row" gap="xs" align="center">
                  <SdsLink
                    onClick={goToAccount}
                    href={buildEndpointHref(Routes.ENDPOINTS_ACCOUNTS_SINGLE, {
                      account_id: sourceAccount,
                    })}
                  >
                    <Profile publicAddress={sourceAccount} size="sm" />
                  </SdsLink>
                </Box>
              ) : null
            }
          />
          <InfoField label="Sequence number" value={seqNum.toString()} />
          <InfoField label="Ledger" value={tx.latestLedger} />
          <InfoField
            label="Ledger closed at"
            value={formatTimestamp(tx.latestLedgerCloseTime * 1000)}
          />

          <InfoField
            label="Processed"
            value={formatTimestamp(tx.createdAt * 1000)}
          />

          <InfoField label={maxFeeElement} value={<Stroop amount={maxFee} />} />

          <InfoField
            label={feeChargedElement}
            value={<Stroop amount={feeCharged} />}
          />
        </Box>

        <div className="PageBody__content PageBody__scrollable">
          {xdrJson ? (
            <PrettyJsonTransaction
              json={xdrJson}
              xdr={xdr}
              isCodeWrapped={isCodeWrapped}
            />
          ) : (
            <Box gap="xs" align="center">
              <Loader />
            </Box>
          )}
        </div>
        <Box gap="md" direction="row" align="center">
          <JsonCodeWrapToggle
            isChecked={isCodeWrapped}
            onChange={(isChecked) => {
              setIsCodeWrapped(isChecked);
            }}
          />
        </Box>
      </PageCard>
    </Box>
  );
}
