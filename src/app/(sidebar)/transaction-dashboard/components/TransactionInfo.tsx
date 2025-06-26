import { Asset, Avatar, Badge, Card, Icon } from "@stellar/design-system";
import { stringify } from "lossless-json";

import { Box } from "@/components/layout/Box";
import { InfoFieldItem } from "@/components/InfoFieldItem";
import { SdsLink } from "@/components/SdsLink";
import { NoInfoLoadedView } from "@/components/NoInfoLoadedView";

import { isSorobanOperationType } from "@/helpers/sorobanUtils";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { stellarExpertAccountLink } from "@/helpers/stellarExpertAccountLink";
import { stellarExpertTransactionLink } from "@/helpers/stellarExpertTransactionLink";
import { formatNumber } from "@/helpers/formatNumber";
import { stroopsToLumens } from "@/helpers/stroopsToLumens";

import { STELLAR_LOGO_DATA_URI } from "@/constants/assets";
import { useStore } from "@/store/useStore";

import { RpcTxJsonResponse } from "@/types/types";

export const TransactionInfo = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null;
}) => {
  const { network } = useStore();

  const isDataLoaded = Boolean(txDetails);
  const transaction = txDetails?.envelopeJson?.tx?.tx;
  const operations = transaction?.operations;

  const isSorobanTx = () => {
    if (operations?.length > 1) {
      return false;
    }

    const firstTxOp = operations?.[0]?.body;
    const firstTxOpType = firstTxOp ? Object.keys(firstTxOp)[0] : null;

    return firstTxOpType ? isSorobanOperationType(firstTxOpType) : false;
  };

  const IS_SOROBAN_TX = isSorobanTx();

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
    ...(isDataLoaded && !IS_SOROBAN_TX ? classicTxFields : []),
    {
      id: "max-fee",
      label: "Max Fee",
    },
    {
      id: "transaction-fee",
      label: "Transaction Fee",
    },
  ];

  const formatData = () => {
    if (!txDetails) {
      return null;
    }

    const baseProps = {
      isSorobanTx: IS_SOROBAN_TX,
      status: txDetails.status,
      transactionInfo: txDetails.txHash,
      sourceAccount: transaction?.source_account,
      sequenceNumber: transaction?.seq_num,
      processed: txDetails?.createdAt,
    };

    const feeProps = {
      maxFee: transaction?.fee,
      transactionFee: txDetails?.resultJson?.fee_charged,
    };

    const classicTxProps = {
      operations: operations?.length,
      memo: transaction?.memo,
    };

    return {
      ...baseProps,
      ...(IS_SOROBAN_TX ? {} : classicTxProps),
      ...feeProps,
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
    if (!isDataLoaded || txDetails?.status === "NOT_FOUND") {
      return null;
    }

    return IS_SOROBAN_TX ? (
      <Badge variant="secondary" size="sm">
        Soroban Transaction
      </Badge>
    ) : (
      <Badge variant="tertiary" size="sm">
        Classic Transaction
      </Badge>
    );
  };

  const renderFee = (fee: any) => {
    if (!fee) {
      return null;
    }

    const stroops = stringify(fee);

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
            isValueLoaded={isDataLoaded}
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
            isValueLoaded={isDataLoaded}
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
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={
              formattedData?.sourceAccount ? (
                <SdsLink
                  href={stellarExpertAccountLink(
                    formattedData.sourceAccount,
                    network.id,
                  )}
                >
                  <Avatar
                    publicAddress={formattedData.sourceAccount}
                    size="sm"
                  />
                  {formattedData.sourceAccount}
                  <Icon.LinkExternal01 />
                </SdsLink>
              ) : null
            }
          />
        );
      case "sequence-number":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={stringify(formattedData?.sequenceNumber)}
          />
        );
      case "processed":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={isDataLoaded}
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
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={formattedData?.operations}
          />
        );
      case "memo":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={formattedData?.memo}
          />
        );
      case "max-fee":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={renderFee(formattedData?.maxFee)}
          />
        );
      case "transaction-fee":
        return (
          <InfoFieldItem
            key={`tx-info-${field.id}`}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={renderFee(formattedData?.transactionFee)}
          />
          // TODO: Add fee breakdown
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <Box
        gap="lg"
        align={isDataLoaded ? "start" : "stretch"}
        addlClassName="TransactionInfo"
      >
        {renderTxBadge()}

        <div className="ContractInfoWrapper" data-no-data={!isDataLoaded}>
          <Box
            gap="sm"
            addlClassName="ContractInfo"
            data-testid="transaction-info-container"
            data-no-data={!isDataLoaded}
          >
            <>{INFO_FIELDS.map((f) => renderInfoField(f))}</>
          </Box>
          {!isDataLoaded ? (
            <NoInfoLoadedView message={<>Load a transaction</>} />
          ) : null}
        </div>
      </Box>
    </Card>
  );
};
