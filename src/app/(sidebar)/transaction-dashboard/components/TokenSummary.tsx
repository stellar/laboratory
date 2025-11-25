import { CopyText, Icon, IconButton, Link, Text } from "@stellar/design-system";
import { BigNumber } from "bignumber.js";

import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import { formatAmount } from "@/helpers/formatAmount";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";

import { STELLAR_EXPERT } from "@/constants/settings";
import { useStore } from "@/store/useStore";

import { RpcTxJsonResponse } from "@/types/types";

export const TokenSummary = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null | undefined;
}) => {
  type TokenItem = {
    addressFrom: string;
    addressTo: string;
    amount: string;
    assetCode: string;
    assetIssuer: string;
  };

  type EventGroupsType = {
    native: {
      title: string;
      items: TokenItem[];
    };
    asset: {
      title: string;
      items: TokenItem[];
    };
  };

  const getGroupedTransferEvents = () => {
    const formattedEvents = getTransferEvents(txDetails);

    const groups: EventGroupsType = {
      asset: {
        title: "Contract token transferred",
        items: [],
      },
      native: {
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

  const { network } = useStore();

  const seNetwork = getStellarExpertNetwork(network.id);

  const formatAssetAddress = (address: string) => {
    return (
      <Box
        gap="sm"
        direction="row"
        align="center"
        addlClassName="TransactionTokenSummary__address"
      >
        <Link href={`${STELLAR_EXPERT}/${seNetwork}/contract/${address}`}>
          {shortenStellarAddress(address)}
        </Link>

        <CopyText textToCopy={address} tooltipPlacement="top">
          <IconButton
            icon={<Icon.Copy01 />}
            altText="Copy address"
            customSize="1rem"
          />
        </CopyText>
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
      <TransactionTabEmptyMessage>
        There are no transfer events in this transaction
      </TransactionTabEmptyMessage>
    );
  }

  return (
    <Box gap="lg" addlClassName="TransactionTokenSummary">
      {groupedTransferEvents.map((ev) => (
        <>
          <Box gap="md">
            <Text as="div" size="sm" weight="medium">
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
              formatDataRow={(ti: TokenItem) => [
                { value: formatAssetAddress(ti.addressFrom), isOverflow: true },
                { value: formatAssetAddress(ti.addressTo), isOverflow: true },
                { value: formatAssetAmount(ti.amount) },
                { value: formatAsset(ti.assetCode, ti.assetIssuer) },
              ]}
              cssGridTemplateColumns="minmax(210px, 1fr) minmax(210px, 1fr) minmax(160px, 1fr) minmax(110px, 1fr)"
              hidePagination={true}
            />
          </Box>
        </>
      ))}
    </Box>
  );
};

const getTransferEvents = (data: RpcTxJsonResponse | null | undefined) => {
  const events = data?.events?.contractEventsJson;

  if (!events) {
    return [];
  }

  const contractEvents = Array.isArray(events[0])
    ? events.flatMap((group: any[]) => group)
    : events;

  return contractEvents
    .filter((event: any) => event?.body?.v0?.topics?.[0]?.symbol === "transfer")
    .map((ev: any) => {
      const addressFrom = ev.body.v0.topics[1].address;
      const addressTo = ev.body.v0.topics[2].address;
      const [assetCode, assetIssuer] = ev.body.v0.topics[3].string.split(":");

      return {
        addressFrom,
        addressTo,
        // Transfer event data type https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md#transfer-event
        amount: ev.body.v0.data?.i128 || ev.body.v0.data?.amount || "0",
        assetCode: assetCode === "native" ? "XLM" : assetCode,
        assetIssuer: assetCode === "native" ? "native" : assetIssuer,
      };
    });
};
