"use client";

import { useState } from "react";
import { Link, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { useStore } from "@/store/useStore";

import { Routes } from "@/constants/routes";
import { KNOWN_ASSETS } from "@/constants/knownAssets";

import { delayedAction } from "@/helpers/delayedAction";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

import { KnownAssetListRecord, SortDirection } from "@/types/types";

export const KnownAssetsList = () => {
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

  const renderContent = () => {
    // In case the user is on Known assets tab on Mainnet and switches to another network
    if (network.id !== "mainnet") {
      return (
        <div>
          <Text size="sm" as="p">
            The known assets list is only available on Mainnet at the moment.
            Please switch to Mainnet to view available assets.
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
      if (sortState.id === "entity" && sortState.direction === "desc") {
        return "Entity (Z-A)";
      }
      return "Entity (A-Z)";
    };

    return (
      <DataTable
        tableId="known-assets-list"
        tableData={KNOWN_ASSETS}
        tableHeaders={[
          { id: "assetCode", value: "Asset code", isSortable: true },
          { id: "entity", value: getEntityLabel(), isSortable: true },
          { id: "assetClass", value: "Asset class", isSortable: true },
          { id: "contract", value: "Contract ID", isSortable: false },
        ]}
        formatDataRow={(r: KnownAssetListRecord) => [
          { value: r.assetCode },
          { value: r.entity },
          { value: r.assetClass || "—" },
          {
            value: (
              <Link
                addlClassName="ContractLink--withIcon"
                onClick={() => handleNavigateToContractExplorer(r.contract)}
              >
                {shortenStellarAddress(r.contract)}
              </Link>
            ),
          },
        ]}
        cssGridTemplateColumns="1fr 1fr 1fr 1fr"
        hideFirstLastPageNav={true}
        hidePageCount={true}
        onSortChange={(id, direction) => setSortState({ id, direction })}
      />
    );
  };

  return <Box gap="lg">{renderContent()}</Box>;
};
