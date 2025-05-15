import { StrKey } from "@stellar/stellar-sdk";
import { Asset, Icon, Text } from "@stellar/design-system";
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
import { parseJsonString } from "@/helpers/parseJsonString";
import * as StellarXdr from "@/helpers/StellarXdr";
import { delayedAction } from "@/helpers/delayedAction";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";

import { Routes } from "@/constants/routes";
import { useStore } from "@/store/useStore";

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
  const [xdrJson, setXdrJson] = useState("");
  const [xdr, setXdr] = useState("");
  const innerTx = tx.feeBump
    ? // @ts-expect-error fee bump tx has innerTx.
      tx.envelopeXdr.value().tx().innerTx().value().tx()
    : tx.envelopeXdr.value().tx();
  const sourceAccount = StrKey.encodeEd25519PublicKey(
    innerTx.sourceAccount().value(),
  );

  const goToAccount: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    delayedAction({
      action: () => {
        endpoints.updateParams({ account_id: sourceAccount });
        router.push(Routes.ENDPOINTS_ACCOUNTS_SINGLE);
      },
      delay: 100,
    });
  };

  const goToTransaction: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    delayedAction({
      action: () => {
        endpoints.updateParams({ transaction: tx.txHash });
        router.push(Routes.ENDPOINTS_TRANSACTIONS_SINGLE);
      },
      delay: 100,
    });
  };

  useEffect(() => {
    const parse = async () => {
      await StellarXdr.initialize();

      try {
        const envelopeXdr = tx.envelopeXdr.toXDR().toString("base64");
        const guesses = StellarXdr.guess(envelopeXdr);
        const json = JsonParse(
          StellarXdr.decode(guesses[0], envelopeXdr),
          null,
          parseNumberAndBigInt,
        );
        setXdrJson(json);
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
                  {tx.status === StellarRpc.Api.GetTransactionStatus.SUCCESS
                    ? "Successful"
                    : "Failed"}
                </Text>
                <Icon.CheckCircle size="xs" color="currentColor" />
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
                  <Asset
                    size="sm"
                    sourceOne={{
                      altText: "",
                      image: `https://id.lobstr.co/${sourceAccount}.png`,
                    }}
                    variant="single"
                  />
                  {sourceAccount}
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
              json={parseJsonString(xdrJson)}
              xdr={xdr}
              isCodeWrapped={isCodeWrapped}
            />
          ) : (
            <Text size="sm" as="p">
              Parsing…
            </Text>
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
