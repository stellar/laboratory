"use client";

import { Loader, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";

import { useGetContractEvents } from "@/query/useGetContractEvents";
import { NetworkHeaders } from "@/types/types";

import { ContractActivityCard } from "./ContractActivityCard";

import "./styles.scss";

/**
 * Activity (events) tab content for the contract explorer.
 * Fetches and displays recent contract events with 5-second polling.
 *
 * @example
 * <ContractActivity
 *   isActive={activeTab === "contract-activity"}
 *   contractId="CABC..."
 *   rpcUrl="https://soroban-testnet.stellar.org"
 * />
 */
export const ContractActivity = ({
  isActive,
  contractId,
  rpcUrl,
  headers,
}: {
  isActive: boolean;
  contractId: string;
  rpcUrl: string;
  headers?: NetworkHeaders;
}) => {
  const {
    data: eventsData,
    error: eventsError,
    isLoading: isEventsLoading,
    isFetching: isEventsFetching,
  } = useGetContractEvents({
    contractId,
    rpcUrl,
    headers,
    isActive,
  });

  // Only show loader on initial load, not on refetches
  if (isEventsLoading || (!eventsData && isEventsFetching)) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  if (eventsError) {
    return <ErrorText errorMessage={eventsError.toString()} size="sm" />;
  }

  if (!eventsData?.events || eventsData.events.length === 0) {
    return (
      <Text as="div" size="sm">
        No recent events found for this contract.
      </Text>
    );
  }

  return (
    <div className="ContractActivity">
      <div className="ContractActivity__list">
        {eventsData.events.map((event) => (
          <ContractActivityCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
