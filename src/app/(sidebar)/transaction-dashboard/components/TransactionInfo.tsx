import { Asset, Avatar, Badge, Card, Icon } from "@stellar/design-system";
import { stringify } from "lossless-json";

import { Box } from "@/components/layout/Box";
import { InfoFieldItem } from "@/components/InfoFieldItem";
import { SdsLink } from "@/components/SdsLink";
import { NoInfoLoadedView } from "@/components/NoInfoLoadedView";

import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { stellarExpertAccountLink } from "@/helpers/stellarExpertAccountLink";
import { stellarExpertTransactionLink } from "@/helpers/stellarExpertTransactionLink";
import { formatNumber } from "@/helpers/formatNumber";
import { stroopsToLumens } from "@/helpers/stroopsToLumens";
import { getTxData } from "@/helpers/getTxData";

import { STELLAR_LOGO_DATA_URI } from "@/constants/assets";
import { useStore } from "@/store/useStore";

import { AnyObject, RpcTxJsonResponse } from "@/types/types";

export const TransactionInfo = ({
  txDetails,
  isTxNotFound,
}: {
  txDetails: RpcTxJsonResponse | null;
  isTxNotFound: boolean;
}) => {
  const { network } = useStore();

  const isDataLoaded = Boolean(txDetails);
  const { feeBumpTx, transaction, operations, isSorobanTx } =
    getTxData(txDetails);

  const isNoDataScreen = !isDataLoaded || isTxNotFound;

  type InfoFieldItem = {
    id: string;
    label: string;
  };

  const classicTxFields: InfoFieldItem[] = [
    {
      id: "operations",
      label: "Operations",
    },
    {
      id: "memo",
      label: "Memo",
    },
  ];

  const INFO_FIELDS: InfoFieldItem[] = [
    {
      id: "status",
      label: "Status",
    },
    {
      id: "transaction-info",
      label: "Transaction Info",
    },
    {
      id: "source-account",
      label: "Source Account",
    },
    {
      id: "sequence-number",
      label: "Sequence Number",
    },
    {
      id: "processed",
      label: "Processed",
    },
    ...(!isNoDataScreen && !isSorobanTx ? classicTxFields : []),
    {
      id: "max-fee",
      label: "Max Fee",
    },
    {
      id: "transaction-fee",
      label: "Transaction Fee",
    },
    ...(feeBumpTx
      ? [
          {
            id: "fee-source-account",
            label: "Fee Source Account",
          },
        ]
      : []),
  ];

  const parseMemo = (memo?: string | AnyObject) => {
    if (!memo) {
      return null;
    }

    if (typeof memo === "string") {
      return memo;
    }

    const [type, value] = Object.entries(memo)[0];

    return `${value} (${type})`;
  };

  const formatData = () => {
    if (!txDetails) {
      return null;
    }

    const baseProps = {
      isSorobanTx,
      status: txDetails.status,
      transactionInfo: txDetails.txHash,
      sourceAccount: transaction?.source_account,
      sequenceNumber: transaction?.seq_num,
      processed:
        txDetails?.createdAt && txDetails.createdAt.toString() !== "0"
          ? txDetails.createdAt
          : null,
      memo: parseMemo(transaction?.memo),
    };

    const feeProps = {
      maxFee: feeBumpTx ? feeBumpTx.tx?.fee : transaction?.fee,
      transactionFee: txDetails?.resultJson?.fee_charged,
    };

    const classicTxProps = {
      operations: operations?.length,
    };

    return {
      ...baseProps,
      ...(isSorobanTx ? {} : classicTxProps),
      ...feeProps,
      ...(feeBumpTx
        ? {
            feeSourceAccount: feeBumpTx.tx?.fee_source,
          }
        : {}),
    };
  };

  const formattedData = formatData();

  const renderStatus = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Box gap="xs" direction="row" align="center" addlClassName="success">
            <Icon.CheckCircle />
            <span>Success</span>
          </Box>
        );
      case "FAILED":
        return (
          <Box gap="xs" direction="row" align="center" addlClassName="failed">
            <Icon.XCircle />
            <span>Failed</span>
          </Box>
        );
      case "NOT_FOUND":
        return (
          <Box gap="xs" direction="row" align="center">
            <Icon.MinusCircle />
            <span>Not Found</span>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderTxBadge = () => {
    if (isNoDataScreen) {
      return null;
    }

    return isSorobanTx ? (
      <Badge variant="secondary" size="sm">
        Soroban Transaction
      </Badge>
    ) : (
      <Badge variant="tertiary" size="sm">
        Classic Transaction
      </Badge>
    );
  };

  const renderAccount = (account: string) => {
    return account ? (
      <SdsLink href={stellarExpertAccountLink(account, network.id)}>
        <Avatar publicAddress={account} size="sm" />
        {account}
        <Icon.LinkExternal01 />
      </SdsLink>
    ) : null;
  };

  const renderFee = (fee: any) => {
    if (!fee) {
      return null;
    }

    const stroops = typeof fee === "string" ? fee : stringify(fee);

    if (!stroops) {
      return null;
    }

    return (
      <Box gap="sm" direction="row" align="center">
        <Box gap="xs" direction="row" align="center">
          {stroopsToLumens(stroops)} XLM{" "}
          <Asset
            variant="single"
            size="sm"
            sourceOne={{ image: STELLAR_LOGO_DATA_URI, altText: "XLM logo" }}
          />
        </Box>
        <Badge variant="tertiary" size="sm">
          {`${formatNumber(fee)} stroops`}
        </Badge>
      </Box>
    );
  };

  const renderInfoField = (field: InfoFieldItem) => {
    switch (field.id) {
      case "status":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={
              formattedData?.status ? renderStatus(formattedData.status) : null
            }
          />
        );
      case "transaction-info":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={
              formattedData?.transactionInfo ? (
                <SdsLink
                  href={stellarExpertTransactionLink(
                    formattedData.transactionInfo,
                    network.id,
                  )}
                >
                  {formattedData.transactionInfo}
                  <Icon.LinkExternal01 />
                </SdsLink>
              ) : null
            }
          />
        );
      case "source-account":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={renderAccount(formattedData?.sourceAccount)}
          />
        );
      case "sequence-number":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={
              typeof formattedData?.sequenceNumber === "string"
                ? formattedData.sequenceNumber
                : stringify(formattedData?.sequenceNumber)
            }
          />
        );
      case "processed":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={
              formattedData?.processed
                ? formatEpochToDate(formattedData.processed)
                : null
            }
          />
        );
      case "operations":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={formattedData?.operations}
          />
        );
      case "memo":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={formattedData?.memo}
          />
        );
      case "max-fee":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={renderFee(formattedData?.maxFee)}
          />
        );
      case "transaction-fee":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={renderFee(formattedData?.transactionFee)}
          />
          // TODO: Add fee breakdown
        );
      case "fee-source-account":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={!isNoDataScreen}
            label={field.label}
            value={renderAccount(formattedData?.feeSourceAccount)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <Box
        gap="lg"
        align={isNoDataScreen ? "stretch" : "start"}
        addlClassName="TransactionInfo"
      >
        <Box
          gap="sm"
          direction="row"
          align="center"
          addlClassName="TransactionInfo__badges"
          data-testid="transaction-info-badges"
        >
          {renderTxBadge()}
          {feeBumpTx ? (
            <Badge variant="primary" size="sm">
              Fee Bump Transaction
            </Badge>
          ) : null}
        </Box>

        <div className="ContractInfoWrapper" data-no-data={isNoDataScreen}>
          <Box
            gap="sm"
            addlClassName="ContractInfo"
            data-testid="transaction-info-container"
          >
            <>{INFO_FIELDS.map((f) => renderInfoField(f))}</>
          </Box>
          {isNoDataScreen ? (
            <NoInfoLoadedView message="Load a transaction" type="info" />
          ) : null}
        </div>
      </Box>
    </Card>
  );
};
