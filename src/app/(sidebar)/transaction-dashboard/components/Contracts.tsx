"use client";

import React from "react";
import {
  IconButton,
  CopyText,
  Icon,
  Link,
  Loader,
} from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { BuildVerifiedBadge } from "@/components/BuildVerifiedBadge";
import { NoInfoLoadedView } from "@/components/NoInfoLoadedView";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { FormattedTxEvent, formatTxEvents } from "@/helpers/formatTxEvents";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";

import { useBuildVerification } from "@/query/useBuildVerification";

import {
  RpcTxJsonResponseContractEventsJson,
  BuildVerificationStatus,
} from "@/types/types";

export const Contracts = ({
  txEvents,
}: {
  txEvents:
    | {
        contractEventsJson?: RpcTxJsonResponseContractEventsJson;
      }
    | undefined;
}) => {
  const { network } = useStore();

  const events = txEvents
    ? formatTxEvents({
        contractEvents: txEvents.contractEventsJson?.[0],
      })
    : null;

  if (!events?.formattedContractEvents?.length) {
    return (
      <NoInfoLoadedView
        message={<>There are no contracts in this transaction.</>}
      />
    );
  }

  return (
    <Box gap="lg" addlClassName="TransactionContracts">
      <ContractsTable
        events={events.formattedContractEvents ?? undefined}
        rpcUrl={network.rpcUrl || ""}
      />
    </Box>
  );
};

const ContractIdColumn = ({ children }: { children: string }) => {
  return (
    <div className="TransactionContracts__contractId">
      <Link
        addlClassName="ContractLink--withIcon"
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `https://lab.stellar.org${buildContractExplorerHref(children)}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
      >
        {shortenStellarAddress(children)}
      </Link>

      <CopyText textToCopy={children}>
        <IconButton
          customSize="12px"
          icon={<Icon.Copy01 />}
          altText="Copy Contract ID"
          onClick={(e) => {
            e.preventDefault();
          }}
        />
      </CopyText>
    </div>
  );
};

// =============================================================================
// Local Components
// =============================================================================

const ContractsTable = ({
  events,
  rpcUrl,
}: {
  events: FormattedTxEvent[] | undefined;
  rpcUrl: string;
}) => {
  const { network } = useStore();

  const contractIds = getAllContractIdsFromEvents({
    events,
  });

  const { verifications, isLoading } = useBuildVerification({
    contractIds,
    rpcUrl,
    headers: getNetworkHeaders(network, "rpc"),
  });

  return (
    <Box gap="lg">
      <DataTable
        data-overflow={true}
        hidePagination={contractIds.length <= 10}
        pageSize={10}
        tableId="tx-contracts-summary"
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
          build_verified: BuildVerificationStatus;
        }) => [
          {
            value: <ContractIdColumn>{vh.id}</ContractIdColumn>,
            isOverflow: true,
          },
          {
            value: (
              <div>
                {isLoading ? (
                  <Loader />
                ) : (
                  <BuildVerifiedBadge
                    status={vh.build_verified}
                    disableMessage
                  />
                )}
              </div>
            ),
          },
        ]}
        cssGridTemplateColumns="minmax(210px, 1fr) minmax(210px, 1fr)"
      />
    </Box>
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
  // Remove redundant contract IDs
  const contractIds = new Set<string>();

  if (events) {
    events.forEach((event) => {
      contractIds.add(event.contractId);
    });
  }

  return Array.from(contractIds);
};
