"use client";

import { rpc as StellarRpc, xdr } from "@stellar/stellar-sdk";
import { Badge, Icon } from "@stellar/design-system";

import { SdsLink } from "@/components/SdsLink";
import { Routes } from "@/constants/routes";

import { ContractActivityJson } from "./ContractActivityJson";
import {
  formatRelativeTime,
  parseScVal,
  truncateHash,
  ParsedScVal,
} from "./helpers";

/**
 * Renders a single contract event as a card with header, data rows, and
 * collapsible JSON.
 *
 * @example
 * <ContractActivityCard event={eventResponse} />
 */
export const ContractActivityCard = ({
  event,
}: {
  event: StellarRpc.Api.EventResponse;
}) => {
  const txDashboardUrl = `${Routes.TRANSACTION_DASHBOARD}?txHash=${event.txHash}`;

  // Parse topics and value
  const topicRows: ParsedScVal[] = event.topic.map((t: xdr.ScVal) =>
    parseScVal(t),
  );
  const valueRow: ParsedScVal = parseScVal(event.value);

  // Build JSON for the collapsible viewer
  const eventJson = JSON.stringify(
    {
      id: event.id,
      type: event.type,
      ledger: event.ledger,
      ledgerClosedAt: event.ledgerClosedAt,
      contractId: event.contractId?.toString(),
      txHash: event.txHash,
      topic: event.topic.map((t: xdr.ScVal) => t.toXDR("base64")),
      value: event.value.toXDR("base64"),
    },
    null,
    2,
  );

  return (
    <div className="ContractActivity__card">
      {/* Header row */}
      <div className="ContractActivity__cardHeader">
        <SdsLink href={txDashboardUrl}>
          <Badge
            variant="secondary"
            size="sm"
            icon={<Icon.LinkExternal01 />}
            iconPosition="right"
          >
            {truncateHash(event.txHash)}
          </Badge>
        </SdsLink>

        <span className="ContractActivity__timestamp">
          {formatRelativeTime(event.ledgerClosedAt)}
        </span>
      </div>

      {/* Event body (gray box) */}
      <div className="ContractActivity__body">
        {/* Topics */}
        {topicRows.map((row, i) => (
          <EventDataRow key={`topic-${i}`} row={row} />
        ))}

        {/* Value */}
        <EventDataRow row={valueRow} />

        {/* Transaction hash */}
        <div className="ContractActivity__row">
          <span className="ContractActivity__rowLabel">trx hash</span>
          <span className="ContractActivity__rowValue">{event.txHash}</span>
        </div>
      </div>

      {/* Collapsible JSON */}
      <ContractActivityJson eventJson={eventJson} />
    </div>
  );
};

/**
 * Renders a single data row for a parsed ScVal (topic or value).
 */
const EventDataRow = ({ row }: { row: ParsedScVal }) => {
  return (
    <div className="ContractActivity__row">
      <span className="ContractActivity__rowLabel">{row.label}</span>
      <span className="ContractActivity__rowValue">
        {row.isAddress ? (
          <SdsLink
            href={`${Routes.SMART_CONTRACTS_CONTRACT_EXPLORER}?contractId=${row.displayValue}`}
            addlClassName="ContractActivity__addressLink"
          >
            {row.displayValue}
          </SdsLink>
        ) : (
          <span>{row.displayValue}</span>
        )}
        {row.typeAnnotation ? (
          <span className="ContractActivity__typeAnnotation">
            {row.typeAnnotation}
          </span>
        ) : null}
      </span>
    </div>
  );
};
