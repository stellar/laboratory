"use client";

import { useEffect, useState } from "react";
import { Button, Icon, Loader, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";

import { useGetContractEvents } from "@/query/useGetContractEvents";
import { NetworkHeaders } from "@/types/types";

import { ContractActivityCard } from "./ContractActivityCard";

import "./styles.scss";

const PAGE_SIZE = 20;

/**
 * Activity (events) tab content for the contract explorer.
 * Fetches and displays recent contract events with 5-second polling.
 * Includes a pause/resume button so users can freeze the feed to inspect events.
 * Paginated at 20 events per page.
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
  const [isPolling, setIsPolling] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: eventsData,
    error: eventsError,
    isLoading: isEventsLoading,
    isFetching: isEventsFetching,
    refetch,
  } = useGetContractEvents({
    contractId,
    rpcUrl,
    headers,
    isActive,
    isPolling,
  });

  const events = eventsData?.events ?? [];
  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));

  // Reset to page 1 when data changes (new events come in)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedEvents = events.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleTogglePolling = () => {
    if (isPolling) {
      setIsPolling(false);
    } else {
      refetch();
      setIsPolling(true);
    }
  };

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

  if (events.length === 0) {
    return (
      <Text as="div" size="sm">
        No recent events found for this contract.
      </Text>
    );
  }

  return (
    <div className="ContractActivity">
      <div className="ContractActivity__toolbar">
        <Button
          variant="tertiary"
          size="sm"
          icon={isPolling ? <Icon.PauseCircle /> : <Icon.PlayCircle />}
          onClick={handleTogglePolling}
        >
          {isPolling ? "Pause" : "Fetch & Resume"}
        </Button>

        {isPolling ? (
          <Text as="span" size="xs">
            Auto-refreshing every 5s
          </Text>
        ) : null}
      </div>

      <div className="ContractActivity__list">
        {paginatedEvents.map((event) => (
          <ContractActivityCard key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination — matches DataTable's pagination pattern */}
      {totalPages > 1 ? (
        <Box gap="xs" direction="row" align="center" justify="space-between">
          <Text as="span" size="xs">
            {events.length} events
          </Text>

          <Box gap="xs" direction="row" align="center">
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>

            <Button
              variant="tertiary"
              size="sm"
              icon={<Icon.ArrowLeft />}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />

            <div className="ContractActivity__pageCount">
              {`Page ${currentPage} of ${totalPages}`}
            </div>

            <Button
              variant="tertiary"
              size="sm"
              icon={<Icon.ArrowRight />}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            />

            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </Box>
        </Box>
      ) : null}
    </div>
  );
};
