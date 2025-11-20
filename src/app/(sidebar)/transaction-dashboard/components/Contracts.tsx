"use client";

import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Icon, Text } from "@stellar/design-system";
import { stringify } from "lossless-json";

import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { ExpandBox } from "@/components/ExpandBox";
import { CopyJsonPayloadButton } from "@/components/CopyJsonPayloadButton";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { FormattedTxEvent, formatTxEvents } from "@/helpers/formatTxEvents";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";
import { getBuildVerification } from "@/helpers/getBuildVerification";
import {
  AnyObject,
  RpcTxJsonResponseContractEventsJson,
  RpcTxJsonResponseTransactionEventsJson,
} from "@/types/types";

// useWasmGitHubAttestation
// Built-in Contract for SAC
// Have loading state once rendered

export const Contracts = ({
  txEvents,
}: {
  txEvents:
    | {
        contractEventsJson: RpcTxJsonResponseContractEventsJson;
        transactionEventsJson: RpcTxJsonResponseTransactionEventsJson;
      }
    | undefined;
}) => {
  const events = txEvents
    ? formatTxEvents({
        contractEvents: txEvents.contractEventsJson[0],
        transactionEvents: txEvents.transactionEventsJson,
      })
    : null;

  if (!events?.formattedContractEvents?.length) {
    return (
      <Text as="div" size="sm" weight="regular">
        There are no events in this transaction.
      </Text>
    );
  }

  const ContractIdColumn = ({ children }: { children: string }) => {
    return (
      <div
        className="TransactionContracts__contractId"
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
        ${shortenStellarAddress(children)}
        {/* <Badge
          variant="secondary"
          size="sm"
          icon={<Icon.LinkExternal01 />}
        >{`Contract ID: ${shortenStellarAddress(children)}`}</Badge> */}
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
    console.log("events: ", events);

    if (!events?.length) {
      return null;
    }

    const { network } = useStore();

    const contractIds = getAllContractIdsFromEvents({
      events,
    });

    const [verifications, setVerifications] = useState<
      Record<string, "built-in" | "verified" | "unverified">
    >({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const fetchVerifications = async () => {
        setIsLoading(true);

        const results = await Promise.all(
          contractIds.map(async (cid) => {
            const buildVerification = await getBuildVerification({
              contractId: cid,
              rpcUrl: network.rpcUrl || "",
              headers: getNetworkHeaders(network, "rpc"),
            });
            return { cid, buildVerification };
          }),
        );

        // Convert array to object for easy lookup
        const verificationsMap = results.reduce(
          (acc, { cid, buildVerification }) => {
            acc[cid] = buildVerification;
            return acc;
          },
          {} as Record<string, "built-in" | "verified" | "unverified">,
        );

        setVerifications(verificationsMap);
        setIsLoading(false);
      };

      if (contractIds.length > 0) {
        fetchVerifications();
      }
    }, [contractIds, network.rpcUrl]); // Dependencies

    return (
      <Box gap="lg">
        <DataTable
          tableId="contract-version-history"
          tableData={contractIds.map((cid) => ({
            id: cid,
            build_verified: verifications[cid] || "unverified",
          }))}
          tableHeaders={[
            { id: "address", value: "Address", isSortable: true },
            { id: "build_verified", value: "Build verified", isSortable: true },
          ]}
          formatDataRow={(vh: {
            id: string;
            build_verified: "built-in" | "verified" | "unverified";
          }) => [
            { value: <div>{shortenStellarAddress(vh.id)}</div> },
            { value: vh.build_verified },
          ]}
          cssGridTemplateColumns="minmax(210px, 1fr) minmax(210px, 1fr)"
        />
      </Box>
    );
  };

  return (
    <Box gap="lg" addlClassName="TransactionContracts">
      <TransactionCard
        id="ev-c"
        title="Contract Events"
        events={events.formattedContractEvents}
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
          <div className="TransactionContracts__card TransactionEvents__card--inset">
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

// =============================================================================
// Helper Function
// =============================================================================

const getAllContractIdsFromEvents = ({
  events,
}: {
  events: FormattedTxEvent[] | undefined;
}) => {
  console.log("getAllContractIdsFromEvents");
  const contractIds = new Set<string>();

  if (events) {
    events.forEach((event) => {
      contractIds.add(event.contractId);
    });
  }

  return Array.from(contractIds);
};
