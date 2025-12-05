"use client";

import { Link, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { DataTable } from "@/components/DataTable";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { useStore } from "@/store/useStore";

import { Routes } from "@/constants/routes";
import { POPULAR_SOROBAN_CONTRACTS } from "@/constants/popularSorobanContracts";

import { delayedAction } from "@/helpers/delayedAction";

import { PopularContractListRecord } from "@/types/types";

export const PopularList = () => {
  const { network, smartContracts } = useStore();
  const router = useRouter();

  const handleNavigateToContractExplorer = (contractId: string) => {
    smartContracts.updateExplorerContractId(contractId);

    delayedAction({
      action: () => {
        router.push(Routes.SMART_CONTRACTS_CONTRACT_EXPLORER);
      },
      delay: 0,
    });
  };

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

    return (
      <DataTable
        tableId="popular-contracts-list"
        tableData={POPULAR_SOROBAN_CONTRACTS}
        tableHeaders={[
          { id: "contract", value: "Contract ID", isSortable: false },
          {
            id: "name",
            value: "Entity (A-Z)",
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
      />
    );
  };

  return (
    <Box gap="lg">
      <PageCard heading="Smart Contract List">{renderContent()}</PageCard>
    </Box>
  );
};
