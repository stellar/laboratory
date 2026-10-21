"use client";

import { useState } from "react";
import { Card, Link, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { useStore } from "@/store/useStore";

import { Routes } from "@/constants/routes";
import { POPULAR_SOROBAN_CONTRACTS } from "@/constants/popularSorobanContracts";

import { delayedAction } from "@/helpers/delayedAction";

import { PopularContractListRecord, SortDirection } from "@/types/types";

type DefiListProps = {
  /** Free-text search, matched against contract ID and name */
  searchValue?: string;
};

export const DefiList = ({ searchValue = "" }: DefiListProps) => {
  const { network, smartContracts } = useStore();
  const router = useRouter();
  const [sortState, setSortState] = useState<{
    id: string;
    direction: SortDirection;
  }>({ id: "", direction: "default" });

  const handleNavigateToContractExplorer = (contractId: string) => {
    smartContracts.updateExplorerContractId(contractId);

    delayedAction({
      action: () => {
        router.push(Routes.SMART_CONTRACTS_CONTRACT_EXPLORER);
      },
      delay: 0,
    });
  };

  const query = searchValue.trim().toLowerCase();
  const filteredContracts = query
    ? POPULAR_SOROBAN_CONTRACTS.filter(
        (c) =>
          c.contract.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query),
      )
    : POPULAR_SOROBAN_CONTRACTS;

  const renderContent = () => {
    // in case where user is already on popular tab on mainnet and switches to testnet
    if (network.id === "testnet") {
      return (
        <div>
          <Text size="sm" as="p">
            The popular contract list is only available on Mainnet at the
            moment. Please switch to Mainnet to view available contracts.
          </Text>

          <Box gap="md" direction="row">
            <SwitchNetworkButtons
              includedNetworks={["mainnet"]}
              buttonSize="md"
              page="contract list"
            />
          </Box>
        </div>
      );
    }

    const getEntityLabel = () => {
      if (sortState.direction === "asc") {
        return "Entity (A-Z)";
      }
      if (sortState.direction === "desc") {
        return "Entity (Z-A)";
      }
      return "Entity (A-Z)";
    };

    // No matches: just the message, no table chrome
    if (filteredContracts.length === 0) {
      return (
        <Card>
          <Text size="sm" as="p" addlClassName="ContractList__emptyMessage">
            No contracts match your search
          </Text>
        </Card>
      );
    }

    return (
      <Card>
        <DataTable
          tableId="popular-contracts-list"
          tableData={filteredContracts}
          resetPageKey={query}
          tableHeaders={[
            { id: "contract", value: "Contract ID", isSortable: false },
            {
              id: "name",
              value: getEntityLabel(),
              isSortable: true,
            },
          ]}
          formatDataRow={(r: PopularContractListRecord) => [
            {
              value: (
                <Link
                  addlClassName="ContractLink--withIcon"
                  onClick={() => handleNavigateToContractExplorer(r.contract)}
                >
                  {r.contract}
                </Link>
              ),
            },
            { value: r.name },
          ]}
          cssGridTemplateColumns="minmax(210px, 3fr) minmax(210px, 1fr)"
          hideFirstLastPageNav={true}
          hidePageCount={true}
          isOutlined={true}
          onSortChange={(id, direction) => setSortState({ id, direction })}
        />
      </Card>
    );
  };

  return <Box gap="lg">{renderContent()}</Box>;
};
