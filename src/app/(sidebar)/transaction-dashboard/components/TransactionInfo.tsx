import { useState } from "react";
import { Asset, Avatar, Badge, Card, Icon, Link } from "@stellar/design-system";
import { stringify } from "lossless-json";

import { Box } from "@/components/layout/Box";
import { InfoFieldItem } from "@/components/InfoFieldItem";
import { SdsLink } from "@/components/SdsLink";
import { NoInfoLoadedView } from "@/components/NoInfoLoadedView";
import { ExpandBox } from "@/components/ExpandBox";

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
}: {
  txDetails: RpcTxJsonResponse | null;
}) => {
  const { network } = useStore();

  const [isFeeBreakdownExpanded, setIsFeeBreakdownExpanded] = useState(false);

  const isDataLoaded = Boolean(txDetails);
  const { feeBumpTx, transaction, operations, isSorobanTx, feeBreakdown } =
    getTxData(txDetails);

  const isTxNotFound = txDetails?.status === "NOT_FOUND";
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
    {
      id: "memo",
      label: "Memo",
    },
    ...(!isNoDataScreen && !isSorobanTx ? classicTxFields : []),
    ...(feeBumpTx
      ? [
          {
            id: "fee-source-account",
            label: "Fee Source Account",
          },
        ]
      : []),
    {
      id: "max-fee",
      label: "Max Fee",
    },
    {
      id: "transaction-fee",
      label: "Transaction Fee",
    },
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
        addlClassName="FeeBreakdown__item"
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
          <div className="FeeBreakdown__item__label">{label}:</div>
          <div className="FeeBreakdown__item__value">
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

  const renderFee = (
    fee: string | number,
    badgeVariant: "tertiary" | "secondary" = "tertiary",
    isTransactionFee?: boolean,
  ) => {
    if (!fee) {
      return null;
    }

    const stroops = typeof fee === "string" ? fee : stringify(fee);

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

        {isTransactionFee && feeBreakdown ? (
          <Link
            variant="primary"
            href="#"
            iconPosition="right"
            icon={<Icon.ChevronRight />}
            onClick={(e) => {
              e.preventDefault();
              setIsFeeBreakdownExpanded(!isFeeBreakdownExpanded);
            }}
            data-is-expanded={isFeeBreakdownExpanded}
          >
            See fee breakdown
          </Link>
        ) : null}
      </Box>
    );
  };

  const renderFeeBreakdown = () => {
    if (!feeBreakdown) {
      return null;
    }

    return (
      <Box gap="md" addlClassName="FeeBreakdown">
        {/* Row 1 */}
        <div className="FeeBreakdown__row" data-row="1">
          <FeeBreakdownItem
            label="Fee Proposed"
            fee={feeBreakdown.maxFee}
            type="solid"
          />
        </div>

        {/* Row 2 */}
        {feeBreakdown.maxResourceFee ? (
          <div className="FeeBreakdown__row" data-row="2">
            <FeeBreakdownItem
              label="Inclusion Fee"
              fee={feeBreakdown.inclusionFee}
              type="dotted"
              isCenterAligned={true}
            />
            <FeeBreakdownItem
              label="Resource Fee"
              fee={feeBreakdown.maxResourceFee}
              type="solid"
            />
          </div>
        ) : null}

        {/* Row 3 */}
        {feeBreakdown.refundable ? (
          <div className="FeeBreakdown__row" data-row="3">
            <FeeBreakdownItem
              label="Inclusion Fee"
              fee={feeBreakdown.inclusionFee}
              type="dotted"
              isCenterAligned={true}
            />
            <FeeBreakdownItem
              label="Refundable"
              fee={feeBreakdown.refundable}
              type="dotted"
              details={["cpu instructions", "storage read/write", "tx size"]}
            />
            <FeeBreakdownItem
              label="Non-Refundable"
              fee={feeBreakdown.nonRefundable}
              type="dotted"
              details={["return value", "storage rent", "events"]}
            />
          </div>
        ) : null}

        {/* Row 4 */}
        <div className="FeeBreakdown__title">
          <span>
            <Icon.ChevronUp /> Fee Proposed
          </span>
          <span>
            <Icon.ChevronDown /> Final Fee
          </span>
        </div>

        {/* Row 5 */}
        {feeBreakdown.finalInclusionFee ? (
          <div className="FeeBreakdown__row" data-row="5">
            <FeeBreakdownItem
              label="Inclusion Fee"
              fee={feeBreakdown.finalInclusionFee}
              type="dotted"
              isCenterAligned={true}
            />
            <FeeBreakdownItem
              label="Non-Refundable"
              fee={feeBreakdown.finalNonRefundable}
              type="dotted"
            />
            <FeeBreakdownItem
              label="Refundable"
              fee={feeBreakdown.finalRefundable}
              type="dotted"
            />
            <FeeBreakdownItem
              label="Refunded"
              fee={feeBreakdown.finalRefunded}
              type="dotted"
            />
          </div>
        ) : null}

        {/* Row 6 */}
        {feeBreakdown.finalInclusionFee &&
        feeBreakdown.finalResourceFeeCharged ? (
          <div className="FeeBreakdown__row" data-row="6">
            <FeeBreakdownItem
              label="Inclusion Fee"
              fee={feeBreakdown.finalInclusionFee}
              type="dotted"
              isCenterAligned={true}
            />
            <FeeBreakdownItem
              label="Resource Fee"
              fee={feeBreakdown.finalResourceFeeCharged}
              type="solid"
            />
            <FeeBreakdownItem
              label="Refunded"
              fee={feeBreakdown.finalRefunded}
              type="dotted"
            />
          </div>
        ) : null}

        {/* Row 7 */}
        <div className="FeeBreakdown__row" data-row="7">
          <FeeBreakdownItem
            label="Fee Charged"
            fee={feeBreakdown.finalFeeCharged}
            type="solid"
          />
          <FeeBreakdownItem
            label="Refunded"
            fee={feeBreakdown.finalRefunded}
            type="dotted"
          />
        </div>
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
          <Box gap="sm" key={`tx-info-${field.id}`}>
            <InfoFieldItem
              isValueLoaded={!isNoDataScreen}
              label={field.label}
              value={renderFee(formattedData?.transactionFee, "tertiary", true)}
            />
            {feeBreakdown ? (
              <ExpandBox offsetTop="sm" isExpanded={isFeeBreakdownExpanded}>
                {renderFeeBreakdown()}
              </ExpandBox>
            ) : null}
          </Box>
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
            <NoInfoLoadedView
              message={
                isTxNotFound ? (
                  <span>
                    Couldn’t find that transaction. Please make sure you’re
                    using the correct network, or the transaction is within the{" "}
                    <SdsLink href="https://developers.stellar.org/docs/data/apis/rpc#why-run-rpc">
                      retention window
                    </SdsLink>{" "}
                    of the RPC.
                  </span>
                ) : (
                  <>Load a transaction</>
                )
              }
              type={isTxNotFound ? "error" : "info"}
            />
          ) : null}
        </div>
      </Box>
    </Card>
  );
};
