"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  IconButton,
  CopyText,
  Icon,
  Link,
  Loader,
  Text,
} from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { BuildVerifiedBadge } from "@/components/BuildVerifiedBadge";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { FormattedTxEvent, formatTxEvents } from "@/helpers/formatTxEvents";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";
import { getBuildVerification } from "@/helpers/getBuildVerification";

import {
  RpcTxJsonResponseContractEventsJson,
  RpcTxJsonResponseTransactionEventsJson,
  BuildVerificationStatus,
} from "@/types/types";

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
  const { network } = useStore();

  const events = txEvents
    ? formatTxEvents({
        contractEvents: txEvents.contractEventsJson[0],
        transactionEvents: txEvents.transactionEventsJson,
      })
    : null;

  if (!events?.formattedContractEvents?.length) {
    // @TODO
    // Use <NoInfoLoadedView/> component when available
    return (
      <Text as="div" size="sm" weight="regular">
        There are no events in this transaction.
      </Text>
    );
  }

  return (
    <Box gap="lg" addlClassName="TransactionContracts">
      <TransactionCard
        id="ev-c"
        title="Contract Events"
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
          altText="Copy Contract Id"
          onClick={(e) => e.preventDefault()}
        />
      </CopyText>
    </div>
  );
};

// =============================================================================
// Local Components
// =============================================================================

const TransactionCard = ({
  events,
  rpcUrl,
}: {
  id: string;
  title: string;
  events: FormattedTxEvent[] | undefined;
  rpcUrl: string;
}) => {
  const { network } = useStore();

  const contractIds = getAllContractIdsFromEvents({
    events,
  });
  const [verifications, setVerifications] = useState<
    Record<string, BuildVerificationStatus>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchVerifications = useCallback(async () => {
    setIsLoading(true);

    const results = await Promise.all(
      contractIds.map(async (cid) => {
        const buildVerification = await getBuildVerification({
          contractId: cid,
          rpcUrl: rpcUrl,
          headers: getNetworkHeaders(network, "rpc"),
        });
        return { cid, buildVerification };
      }),
    );

    const verificationsMap = results.reduce(
      (acc, { cid, buildVerification }) => {
        acc[cid] = buildVerification;
        return acc;
      },
      {} as Record<string, BuildVerificationStatus>,
    );

    setVerifications(verificationsMap);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcUrl]);

  useEffect(() => {
    if (contractIds.length > 0) {
      fetchVerifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractIds.length]);

  return (
    <Box gap="lg">
      <DataTable
        hidePagination={contractIds.length <= 10}
        pageSize={10}
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
          build_verified: BuildVerificationStatus;
        }) => [
          {
            value: <ContractIdColumn>{vh.id}</ContractIdColumn>,
          },
          {
            value: (
              <div>
                {isLoading ? (
                  <Loader />
                ) : (
                  <BuildVerifiedBadge status={vh.build_verified} />
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
  const contractIds = new Set<string>();

  if (events) {
    events.forEach((event) => {
      contractIds.add(event.contractId);
    });
  }

  return Array.from(contractIds);
};
