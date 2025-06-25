import { useState } from "react";
import { Asset, Avatar, Badge, Card, Icon } from "@stellar/design-system";
import { stringify } from "lossless-json";
import { BigNumber } from "bignumber.js";

import { Box } from "@/components/layout/Box";
import { InfoFieldItem } from "@/components/InfoFieldItem";
import { SdsLink } from "@/components/SdsLink";
import { NoInfoLoadedView } from "@/components/NoInfoLoadedView";
import { ExpandBox } from "@/components/ExpandBox";

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

  const [isFeeBreakdownOpen, setIsFeeBreakdownOpen] = useState(false);

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

  type FeeBreakdown = {
    transactionFee: string;
    refundableFee: string;
    nonRefundableFee: string;
    totalResourceFee: string;
    inclusionFee: string;
  };

  const getFeeBreakdown = (): FeeBreakdown | null => {
    const transactionFee = txDetails?.resultJson?.fee_charged;

    if (!transactionFee) {
      return null;
    }

    const {
      total_refundable_resource_fee_charged,
      total_non_refundable_resource_fee_charged,
    } = txDetails?.resultMetaJson?.v3?.soroban_meta?.ext?.v1 || {};

    const refundableFee = BigNumber(
      total_refundable_resource_fee_charged || 0,
    ).toString();

    const nonRefundableFee = BigNumber(
      total_non_refundable_resource_fee_charged || 0,
    ).toString();

    const totalResourceFee = BigNumber(refundableFee)
      .plus(nonRefundableFee)
      .toString();

    const inclusionFee = BigNumber(transactionFee)
      .minus(totalResourceFee)
      .toString();

    return {
      transactionFee,
      refundableFee,
      nonRefundableFee,
      totalResourceFee,
      inclusionFee,
    };
  };

  const formatData = () => {
    if (!txDetails || !transaction) {
      return null;
    }

    const baseProps = {
      isSorobanTx: IS_SOROBAN_TX,
      status: txDetails.status,
      transactionInfo: txDetails.txHash,
      sourceAccount: transaction.source_account,
      sequenceNumber: transaction.seq_num,
      processed: txDetails.createdAt,
    };

    const feeProps = {
      maxFee: transaction.fee,
      transactionFee: txDetails.resultJson.fee_charged,
    };

    const classicTxProps = {
      operations: operations.length,
      memo: transaction.memo,
    };

    return {
      ...baseProps,
      ...(IS_SOROBAN_TX ? {} : classicTxProps),
      ...feeProps,
      ...(IS_SOROBAN_TX ? { feeBreakdown: getFeeBreakdown() } : {}),
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
    if (!isDataLoaded) {
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

  const renderFee = (
    fee: string | number,
    badgeVariant: "tertiary" | "secondary" = "tertiary",
  ) => {
    if (!fee) {
      return null;
    }

    const stroops = fee;

    if (!stroops) {
      return null;
    }

    return (
      <Box gap="sm" direction="row" align="center" wrap="wrap">
        <Box gap="xs" direction="row" align="center">
          {stroopsToLumens(stroops.toString())} XLM{" "}
          <Asset
            variant="single"
            size="sm"
            sourceOne={{ image: STELLAR_LOGO_DATA_URI, altText: "XLM logo" }}
          />
        </Box>
        <Badge variant={badgeVariant} size="sm">
          {`${formatNumber(BigInt(fee))} stroops`}
        </Badge>
      </Box>
    );
  };

  const FeeBreakdownItem = ({
    label,
    fee,
    type,
    details,
    isCenterAligned = false,
  }: {
    label: string;
    fee: string;
    type: "solid" | "dotted";
    details?: string[];
    isCenterAligned?: boolean;
  }) => {
    return (
      <Box
        gap="xs"
        addlClassName="TransactionInfo__feeBreakdown__item"
        data-type={type}
        data-center-aligned={isCenterAligned}
      >
        <Box
          gap="xs"
          direction="row"
          align="center"
          justify={type === "solid" ? "center" : "left"}
          wrap="wrap"
        >
          <div className="TransactionInfo__feeBreakdown__item__label">
            {label}:
          </div>
          <div className="TransactionInfo__feeBreakdown__item__value">
            {renderFee(fee, type === "solid" ? "secondary" : "tertiary")}
          </div>
        </Box>

        {details ? (
          <div>
            {details.map((d, index) => (
              <div key={`${d.toLowerCase()}-${index}`}>{d}</div>
            ))}
          </div>
        ) : null}
      </Box>
    );
  };

  const renderFeeBreakdown = (feeBreakdown: FeeBreakdown) => {
    // TODO: add Inclusion and Resource fees info
    return (
      <div className="TransactionInfo__feeBreakdown">
        {/* Row 1 */}
        <div className="TransactionInfo__feeBreakdown__row" data-row="1">
          <FeeBreakdownItem
            label="Transaction Fee"
            fee={feeBreakdown.transactionFee}
            type="solid"
          />
        </div>

        {/* Row 2 */}
        <div className="TransactionInfo__feeBreakdown__row" data-row="2">
          <FeeBreakdownItem
            label="Total Resource Fee"
            fee={feeBreakdown.totalResourceFee}
            type="solid"
          />

          <FeeBreakdownItem
            label="Inclusion Fee"
            fee={feeBreakdown.inclusionFee}
            type="dotted"
            isCenterAligned={true}
          />
        </div>

        {/* Row 3 */}
        <div className="TransactionInfo__feeBreakdown__row" data-row="3">
          <FeeBreakdownItem
            label="Refundable"
            fee={feeBreakdown.refundableFee}
            type="dotted"
            details={["Instructions", "Read", "Write", "Bandwidth"]}
          />

          <FeeBreakdownItem
            label="Non-refundable"
            fee={feeBreakdown.nonRefundableFee}
            type="dotted"
            details={["Rent", "Events", "Return Value"]}
          />

          <FeeBreakdownItem
            label="Inclusion Fee"
            fee={feeBreakdown.inclusionFee}
            type="dotted"
            isCenterAligned={true}
          />
        </div>
      </div>
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
            infoText="Max Fee specified in the transaction itself – the maximum XLM amount the source account willing to pay. Each transaction sets a fee that is paid by the source account."
          />
        );
      case "transaction-fee":
        return (
          <Box
            gap="lg"
            key={`tx-info-${field.id}-wrapper`}
            addlClassName="TransactionInfo__txFeeWrapper"
            data-open={isFeeBreakdownOpen}
          >
            <InfoFieldItem
              key={`tx-info-${field.id}`}
              isValueLoaded={isDataLoaded}
              label={field.label}
              value={
                <Box gap="sm" direction="row" align="center" wrap="wrap">
                  {renderFee(formattedData?.transactionFee)}{" "}
                  {formattedData?.feeBreakdown ? (
                    <SdsLink
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        setIsFeeBreakdownOpen(!isFeeBreakdownOpen);
                      }}
                      icon={<Icon.ChevronRight />}
                      addlClassName="TransactionInfo__feeBreakdownLink"
                    >
                      See fee breakdown
                    </SdsLink>
                  ) : null}
                </Box>
              }
              infoText="Transaction Fee is what is actually charged during the transaction execution, which can be lower than the Max Fee specified. (Transaction Fee  = Resource Fee + Inclusion Fee)."
            />

            {formattedData?.feeBreakdown ? (
              <ExpandBox offsetTop="lg" isExpanded={isFeeBreakdownOpen}>
                {renderFeeBreakdown(formattedData.feeBreakdown)}
              </ExpandBox>
            ) : null}
          </Box>
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
