"use client";

import { useState } from "react";
import { Card, Icon, Link, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { Dropdown } from "@/components/Dropdown";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { useStore } from "@/store/useStore";

import { Routes } from "@/constants/routes";
import { KNOWN_ASSETS } from "@/constants/knownAssets";

import { delayedAction } from "@/helpers/delayedAction";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

import { KnownAssetListRecord, SortDirection } from "@/types/types";

type KnownAssetsListProps = {
  /** Assets to list (already filtered by the page's search / class filter) */
  assets?: KnownAssetListRecord[];
  /** Asset classes offered in the header dropdown */
  assetClasses?: string[];
  /** Selected asset class; empty string means all */
  assetClassFilter?: string;
  onAssetClassChange?: (assetClass: string) => void;
  /** Current search query; a change resets the table to page 1 */
  searchValue?: string;
};

export const KnownAssetsList = ({
  assets = KNOWN_ASSETS,
  assetClasses = [],
  assetClassFilter = "",
  onAssetClassChange,
  searchValue = "",
}: KnownAssetsListProps) => {
  const { network, smartContracts } = useStore();
  const router = useRouter();
  const [sortState, setSortState] = useState<{
    id: string;
    direction: SortDirection;
  }>({ id: "", direction: "default" });
  const [isClassDropdownVisible, setIsClassDropdownVisible] = useState(false);

  /** "Asset class" header: a dropdown to filter the list by class */
  const renderAssetClassHeader = () => (
    <div
      className="KnownAssetsList__classHeader"
      data-asset-class-trigger="true"
      onClick={() => setIsClassDropdownVisible(!isClassDropdownVisible)}
    >
      {assetClassFilter || "Asset class"}
      <Icon.ChevronDown />

      <Dropdown
        addlClassName="KnownAssetsList__classDropdown"
        isDropdownVisible={isClassDropdownVisible}
        onClose={() => setIsClassDropdownVisible(false)}
        triggerDataAttribute="assetClassTrigger"
        testId="known-assets-class-dropdown"
      >
        {["", ...assetClasses].map((c) => (
          <button
            key={c || "all"}
            type="button"
            className="KnownAssetsList__classOption"
            data-is-selected={assetClassFilter === c}
            onClick={(e) => {
              e.stopPropagation();
              onAssetClassChange?.(c);
              setIsClassDropdownVisible(false);
            }}
          >
            {c || "All asset classes"}
            {assetClassFilter === c ? <Icon.Check /> : null}
          </button>
        ))}
      </Dropdown>
    </div>
  );

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

    // No matches: just the message, no table chrome
    if (assets.length === 0) {
      return (
        <Card>
          <Text size="sm" as="p" addlClassName="ContractList__emptyMessage">
            No assets match your search
          </Text>
        </Card>
      );
    }

    return (
      <Card>
        <DataTable
          tableId="known-assets-list"
          tableData={assets}
          resetPageKey={`${searchValue}|${assetClassFilter}`}
          tableHeaders={[
            { id: "assetCode", value: "Asset code", isSortable: true },
            { id: "entity", value: getEntityLabel(), isSortable: true },
            {
              id: "assetClass",
              value: renderAssetClassHeader(),
              isSortable: false,
            },
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
          isOutlined={true}
          emptyMessage="No assets match your search"
          onSortChange={(id, direction) => setSortState({ id, direction })}
        />
      </Card>
    );
  };

  return <Box gap="lg">{renderContent()}</Box>;
};
