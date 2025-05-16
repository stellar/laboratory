import { StrKey } from "@stellar/stellar-sdk";
import { Icon, Loader, Profile, Text } from "@stellar/design-system";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { useEffect, useState, ReactNode, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { parseNumberAndBigInt, parse as JsonParse } from "lossless-json";

import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { SdsLink } from "@/components/SdsLink";

import { formatTimestamp } from "@/helpers/formatTimestamp";
import * as StellarXdr from "@/helpers/StellarXdr";
import { delayedAction } from "@/helpers/delayedAction";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";

import { Routes } from "@/constants/routes";
import { useStore } from "@/store/useStore";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";

const InfoField = ({ label, value }: { label: string; value: ReactNode }) => (
  <Box gap="xs" direction="row" align="center" addlClassName="InfoFieldItem">
    <div className="InfoFieldItem__label">{label}</div>
    <div className="InfoFieldItem__value">{value ?? "-"}</div>
  </Box>
);

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
  const innerTx = tx.feeBump
    ? // @ts-expect-error fee bump tx has innerTx.
      tx.envelopeXdr.value().tx().innerTx().value().tx()
    : tx.envelopeXdr.value().tx();
  const sourceAccount = StrKey.encodeEd25519PublicKey(
    innerTx.sourceAccount().value(),
  );
  const success = tx.status === StellarRpc.Api.GetTransactionStatus.SUCCESS;

  const goToAccount: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

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
        const envelopeXdr = tx.envelopeXdr.toXDR().toString("base64");
        const guesses = StellarXdr.guess(envelopeXdr);
        const json = JsonParse(
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
      <PageCard heading="Transaction Envelope">
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
            }
          />
          <InfoField
            label="Sequence number"
            value={innerTx.seqNum().toString()}
          />
          <InfoField label="Ledger" value={tx.latestLedger} />
          <InfoField
            label="Ledger closed at"
            value={formatTimestamp(tx.latestLedgerCloseTime * 1000)}
          />

          <InfoField
            label="Processed"
            value={formatTimestamp(tx.createdAt * 1000)}
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
