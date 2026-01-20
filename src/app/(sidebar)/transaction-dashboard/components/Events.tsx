"use client";

import React, { useState } from "react";
import { Badge, Button, Card, Icon, Text } from "@stellar/design-system";
import { stringify } from "lossless-json";

import { Box } from "@/components/layout/Box";
import { ScValPrettyJson } from "@/components/ScValPrettyJson";
import { ExpandBox } from "@/components/ExpandBox";
import { CopyJsonPayloadButton } from "@/components/CopyJsonPayloadButton";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { FormattedTxEvent, formatTxEvents } from "@/helpers/formatTxEvents";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import {
  AnyObject,
  RpcTxJsonResponseContractEventsJson,
  RpcTxJsonResponseTransactionEventsJson,
} from "@/types/types";

export const Events = ({
  txEvents,
}: {
  txEvents:
    | {
        contractEventsJson?: RpcTxJsonResponseContractEventsJson;
        transactionEventsJson?: RpcTxJsonResponseTransactionEventsJson;
      }
    | undefined;
}) => {
  const isXdrInit = useIsXdrInit();

  const events = txEvents
    ? formatTxEvents({
        contractEvents: txEvents.contractEventsJson?.[0],
        transactionEvents: txEvents.transactionEventsJson,
      })
    : null;

  if (
    !(
      events?.formattedTransactionEvents?.length ||
      events?.formattedContractEvents?.length
    )
  ) {
    return (
      <TransactionTabEmptyMessage title="No events">
        This transaction has no events emitted.
      </TransactionTabEmptyMessage>
    );
  }

  const EventItem = ({ label, value }: { label: string; value: AnyObject }) => {
    return (
      <div className="TransactionEvents__item">
        <div className="TransactionEvents__item__label">{label}</div>
        <div className="TransactionEvents__item__value">
          <ScValPrettyJson
            json={value}
            isReady={isXdrInit}
            formatAsset={true}
          />
        </div>
      </div>
    );
  };

  const ContractIdBadge = ({ children }: { children: string }) => {
    return (
      <div
        className="TransactionEvents__badgeLink"
        onClick={(e) => {
          e.preventDefault();
          // No need to sanitize this URL because we built it
          window.open(
            `https://lab.stellar.org${buildContractExplorerHref(children)}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
        role="link"
      >
        <Badge
          variant="secondary"
          size="sm"
          icon={<Icon.LinkExternal01 />}
        >{`Contract ID: ${shortenStellarAddress(children)}`}</Badge>
      </div>
    );
  };

  const TransactionCard = ({
    id,
    title,
    events,
  }: {
    id: string;
    title: string;
    events: FormattedTxEvent[] | undefined;
  }) => {
    if (!events?.length) {
      return null;
    }

    return (
      <Box gap="lg">
        <ExpandSection title={title}>
          {events.map((t, cIndex) => (
            <div
              className="TransactionEvents__card"
              key={`${id}-${cIndex}-${t.contractId}`}
              data-testid={`${id}-item`}
            >
              <ContractIdBadge>{t.contractId}</ContractIdBadge>

              <div className="TransactionEvents__card TransactionEvents__card--inset TransactionEvents__card--data">
                {t.topics.map((to, tIndex) => (
                  <EventItem
                    key={`${id}-${cIndex}-${t.contractId}-topic-${tIndex}`}
                    label={to.label}
                    value={to.value}
                  />
                ))}

                <EventItem label="Data" value={t.data} />
              </div>

              <EventJson json={t.rawJson} />
            </div>
          ))}
        </ExpandSection>
      </Box>
    );
  };

  return (
    <Box gap="lg" addlClassName="TransactionEvents">
      <TransactionCard
        id="ev-c"
        title="Contract Events"
        events={events.formattedContractEvents}
      />

      <TransactionCard
        id="ev-t"
        title="Transaction Events"
        events={events.formattedTransactionEvents}
      />
    </Box>
  );
};

// =============================================================================
// Local Components
// =============================================================================
const ExpandSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card>
      <div
        className="ExpandToggle"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        data-is-expanded={isExpanded}
      >
        <Text as="h3" size="sm" weight="medium">
          {title}
        </Text>
        <Icon.ChevronRight />
      </div>

      <ExpandBox offsetTop="lg" isExpanded={isExpanded}>
        <Box gap="lg">{children}</Box>
      </ExpandBox>
    </Card>
  );
};

const EventJson = ({ json }: { json: AnyObject }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatJson = () => {
    try {
      return stringify(json, null, 2);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return "";
    }
  };

  const formattedJson = formatJson();

  if (!formattedJson) {
    return null;
  }

  return (
    <>
      <Button
        variant={isExpanded ? "secondary" : "tertiary"}
        size="sm"
        icon={<Icon.ChevronDown />}
        onClick={() => setIsExpanded(!isExpanded)}
        data-is-expanded={isExpanded}
      >
        View JSON
      </Button>

      <ExpandBox offsetTop="md" isExpanded={isExpanded}>
        <Box gap="md">
          <div className="TransactionEvents__card TransactionEvents__card--inset">
            <pre>{formattedJson}</pre>
          </div>
          <Box gap="sm" direction="row" justify="end">
            <CopyJsonPayloadButton size="sm" jsonString={formattedJson} />
          </Box>
        </Box>
      </ExpandBox>
    </>
  );
};
