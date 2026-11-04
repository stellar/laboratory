import { Fragment } from "react";
import { CopyText, Icon, IconButton, Link, Text } from "@stellar/design-system";
import { BigNumber } from "bignumber.js";

import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import { formatAmount } from "@/helpers/formatAmount";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { getTransferEvents, TransferEvent } from "@/helpers/getTransferEvents";

import { STELLAR_EXPERT } from "@/constants/settings";
import { useStore } from "@/store/useStore";

import { RpcTxJsonResponse } from "@/types/types";

export const TokenSummary = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null | undefined;
}) => {
  type EventGroupsType = {
    native: {
      id: string;
      title: string;
      items: TransferEvent[];
    };
    asset: {
      id: string;
      title: string;
      items: TransferEvent[];
    };
  };

  const { network } = useStore();

  const getGroupedTransferEvents = () => {
    const formattedEvents = getTransferEvents(txDetails, network.passphrase);

    const groups: EventGroupsType = {
      asset: {
        id: "asset-ev",
        title: "Contract token transferred",
        items: [],
      },
      native: {
        id: "native-ev",
        title: "Native token (XLM) transferred",
        items: [],
      },
    };

    formattedEvents.forEach((event) => {
      if (event.assetCode === "XLM" && event.assetIssuer === "native") {
        groups.native.items.push(event);
      } else {
        groups.asset.items.push(event);
      }
    });

    // Return only groups with items
    return Object.values(groups).filter((group) => group.items.length);
  };

  const seNetwork = getStellarExpertNetwork(network.id);

  const formatAssetAddress = ({
    address,
    muxedId,
    muxedAddress,
    memo,
  }: {
    address: string;
    muxedId?: string;
    muxedAddress?: string;
    memo?: string;
  }) => {
    const isContractAddress = address.startsWith("C");
    // Show the muxed (M... or W...) recipient, but link to its base address
    const displayAddress = muxedAddress || address;

    return (
      <Box gap="xs">
        <Box
          gap="sm"
          direction="row"
          align="center"
          addlClassName="TransactionTokenSummary__address"
        >
          <Link
            href={`${STELLAR_EXPERT}/${seNetwork}/${isContractAddress ? "contract" : "account"}/${address}`}
            title={displayAddress}
          >
            {shortenStellarAddress(displayAddress)}
          </Link>

          <CopyText textToCopy={displayAddress} tooltipPlacement="top">
            <IconButton
              icon={<Icon.Copy01 />}
              altText="Copy address"
              customSize="0.75rem"
            />
          </CopyText>
        </Box>

        {muxedId ? (
          <Text as="div" size="xs" weight="regular">
            Muxed ID: {muxedId}
          </Text>
        ) : null}

        {memo ? (
          <Text as="div" size="xs" weight="regular">
            Memo: {memo}
          </Text>
        ) : null}
      </Box>
    );
  };

  const formatAssetAmount = (amount: string) => {
    return (
      <span className="TransactionTokenSummary__amount">
        {formatAmount(
          new BigNumber(amount).dividedBy(10_000_000).toNumber(),
          2,
        )}
      </span>
    );
  };

  const formatAsset = (code: string, issuer: string) => {
    if (!code || !issuer) {
      return null;
    }

    const assetString =
      code === "XLM" && issuer === "native" ? code : `${code}-${issuer}`;

    return (
      <Link
        href={`${STELLAR_EXPERT}/${seNetwork}/asset/${assetString}`}
        icon={<Icon.LinkExternal01 />}
        iconPosition="right"
      >
        {code}
      </Link>
    );
  };

  const groupedTransferEvents = getGroupedTransferEvents();

  if (!groupedTransferEvents.length) {
    return (
      <TransactionTabEmptyMessage title="No token summary">
        This transaction has no token transfers.
      </TransactionTabEmptyMessage>
    );
  }

  return (
    <Box gap="lg" addlClassName="TransactionTokenSummary">
      {groupedTransferEvents.map((ev) => (
        <Fragment key={ev.id}>
          <Box gap="md" data-testid={ev.id}>
            <Text as="div" size="xs" weight="regular">
              {ev.title}
            </Text>

            <DataTable
              tableId="tx-dash-token-summary-assets"
              tableData={ev.items}
              tableHeaders={[
                { id: "address-from", value: "From" },
                { id: "address-to", value: "To" },
                { id: "amount", value: "Amount" },
                { id: "asset", value: "Asset" },
              ]}
              formatDataRow={(ti: TransferEvent) => [
                {
                  value: formatAssetAddress({ address: ti.addressFrom }),
                  isOverflow: true,
                },
                {
                  value: formatAssetAddress({
                    address: ti.addressTo,
                    muxedId: ti.toMuxedId,
                    muxedAddress: ti.addressToMuxed,
                    memo: ti.toMemo,
                  }),
                  isOverflow: true,
                },
                { value: formatAssetAmount(ti.amount) },
                { value: formatAsset(ti.assetCode, ti.assetIssuer) },
              ]}
              cssGridTemplateColumns="minmax(210px, 1fr) minmax(210px, 1fr) minmax(160px, 1fr) minmax(110px, 1fr)"
              hidePagination={true}
            />
          </Box>
        </Fragment>
      ))}
    </Box>
  );
};
