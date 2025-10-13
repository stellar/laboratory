"use client";

import { Fragment } from "react";
import { Text } from "@stellar/design-system";
import { stringify } from "lossless-json";

import { Box } from "@/components/layout/Box";
import { ScValPrettyJson } from "@/components/ScValPrettyJson";
import { formatTxEvents } from "@/helpers/formatTxEvents";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import {
  RpcTxJsonResponseContractEventsJson,
  RpcTxJsonResponseTransactionEventsJson,
} from "@/types/types";

export const Events = ({
  txEvents,
}: {
  txEvents:
    | {
        contractEventsJson: RpcTxJsonResponseContractEventsJson;
        transactionEventsJson: RpcTxJsonResponseTransactionEventsJson;
      }
    | undefined;
}) => {
  const isXdrInit = useIsXdrInit();

  if (!txEvents) {
    // TODO: handle no events case
    return <Box gap="lg">No events</Box>;
  }

  const events = formatTxEvents({
    contractEvents: txEvents.contractEventsJson[0],
    transactionEvents: txEvents.transactionEventsJson,
  });

  // TODO: style UI
  return (
    <Box gap="lg">
      {/* Contract Events */}
      <Box gap="lg">
        <Text as="h2" size="lg" weight="semi-bold">
          Contract Events
        </Text>
        <Box gap="md">
          {events.formattedContractEvents?.map((t, cIndex) => (
            <Fragment key={`ev-c-${cIndex}-${t.contractId}`}>
              <Box gap="sm">
                <Text as="h3" size="md">
                  {t.title}
                </Text>

                <Box gap="sm" direction="row">
                  <div>Contract ID:</div>
                  <div>{t.contractId}</div>
                </Box>

                <Box gap="xs">
                  <div>Topics</div>
                  {t.topics.map((to, tIndex) => (
                    <Box
                      key={`ev-c-${cIndex}-${t.contractId}-topic-${tIndex}`}
                      gap="sm"
                      direction="row"
                    >
                      <div>{to.label}:</div>
                      {/* TODO: handle array value */}
                      <div>{stringify(to.value)}</div>
                    </Box>
                  ))}
                </Box>
                <Box gap="sm">
                  <div>Data</div>
                  <ScValPrettyJson json={t.data} isReady={isXdrInit} />
                </Box>
              </Box>
              <div style={{ height: 1, borderBottom: "1px solid #ccc" }}></div>
            </Fragment>
          ))}
        </Box>
      </Box>

      {/* Transaction Events */}
      <Box gap="lg">
        <Text as="h2" size="lg" weight="semi-bold">
          Transaction Events
        </Text>
        <Box gap="md">
          {events.formattedTransactionEvents?.map((t, cIndex) => (
            <Fragment key={`ev-t-${cIndex}-${t.contractId}`}>
              <Box gap="sm">
                <Text as="h3" size="md">
                  {t.title}
                </Text>

                <Box gap="sm" direction="row">
                  <div>Contract ID:</div>
                  <div>{t.contractId}</div>
                </Box>

                <Box gap="xs">
                  <div>Topics</div>
                  {t.topics.map((to, tIndex) => (
                    <Box
                      key={`ev-t-${cIndex}-${t.contractId}-topic-${tIndex}`}
                      gap="sm"
                      direction="row"
                    >
                      <div>{to.label}:</div>
                      <div>{to.value}</div>
                    </Box>
                  ))}
                </Box>
                <Box gap="sm">
                  <div>Data</div>
                  <ScValPrettyJson json={t.data} isReady={isXdrInit} />
                </Box>
                <Box gap="sm">
                  <div>Stage</div>
                  <div>{t.stage}</div>
                </Box>
              </Box>
              <div style={{ height: 1, borderBottom: "1px solid #ccc" }}></div>
            </Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
