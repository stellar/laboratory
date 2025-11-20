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
  // TODO: remove
  console.log(">>> txDetails: ", txDetails);

  const { network } = useStore();

  const seNetwork = getStellarExpertNetwork(network.id);

  type TokenItem = {
    address: string;
    amount: string;
    amountType: "add" | "subtract";
    assetCode: string;
    assetIssuer: string;
  };

  // TODO: use real data
  const assetTokenList: TokenItem[] = [
    {
      address: "CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
      amount: "10605945663",
      assetCode: "USDC",
      amountType: "add",
      assetIssuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    },
    {
      address: "CA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      amount: "10605945663",
      amountType: "subtract",
      assetCode: "USDC",
      assetIssuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    },
  ];
  const nativeTokenList: TokenItem[] = [];

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

  const formatAssetAmount = (amount: string, type: "add" | "subtract") => {
    return (
      <span className="TransactionTokenSummary__amount" data-type={type}>
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

  if (!(assetTokenList.length || nativeTokenList.length)) {
    return (
      <TransactionTabEmptyMessage>
        No token transaction summary
      </TransactionTabEmptyMessage>
    );
  }

  return (
    <Box gap="lg" addlClassName="TransactionTokenSummary">
      {assetTokenList.length ? (
        <>
          <Box gap="md">
            <Text as="div" size="sm" weight="medium">
              Contract token transferred
            </Text>

            <DataTable
              tableId="tx-dash-token-summary-assets"
              tableData={assetTokenList}
              tableHeaders={[
                { id: "address", value: "Address" },
                { id: "amount", value: "Amount" },
                { id: "asset", value: "Asset" },
              ]}
              formatDataRow={(ti: TokenItem) => [
                { value: formatAssetAddress(ti.address), isOverflow: true },
                { value: formatAssetAmount(ti.amount, ti.amountType) },
                { value: formatAsset(ti.assetCode, ti.assetIssuer) },
              ]}
              cssGridTemplateColumns="minmax(210px, 2fr) minmax(160px, 1fr) minmax(110px, 1fr)"
              hidePagination={true}
            />
          </Box>
        </>
      ) : null}
    </Box>
  );
};
