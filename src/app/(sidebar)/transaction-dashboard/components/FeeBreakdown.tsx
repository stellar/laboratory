import { useState } from "react";
import { Badge, Icon, Label, Text, Toggle } from "@stellar/design-system";
import { stringify } from "lossless-json";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { ExpandBox } from "@/components/ExpandBox";

import { formatNumber } from "@/helpers/formatNumber";
import { stroopsToLumens } from "@/helpers/stroopsToLumens";
import { getTxData } from "@/helpers/getTxData";

import { RpcTxJsonResponse } from "@/types/types";

export const FeeBreakdown = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null | undefined;
}) => {
  const [isStroops, setIsStroops] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!txDetails) {
    return null;
  }

  const { feeBreakdown } = getTxData(txDetails);

  if (!feeBreakdown) {
    return null;
  }

  const FeeType = ({
    title,
    badges,
    isBold,
  }: {
    title: string;
    badges?: string[];
    isBold?: boolean;
  }) => {
    return (
      <Box gap="sm" justify="center">
        <Text
          size="sm"
          as="div"
          weight="medium"
          addlClassName="FeeBreakdown__text"
          {...(isBold ? { "data-is-bold": true } : {})}
        >
          {title}
        </Text>

        {badges?.length ? (
          <Box gap="xs" wrap="wrap" direction="row">
            {badges.map((b, idx) => (
              <Badge key={`fee-badge-${idx}`} size="sm" variant="tertiary">
                {b}
              </Badge>
            ))}
          </Box>
        ) : null}
      </Box>
    );
  };

  const FeeAmount = ({
    fee,
    isBold,
    isRefund,
  }: {
    fee: string | number | undefined;
    isBold?: boolean;
    isRefund?: boolean;
  }) => {
    let value = "-";

    if (fee) {
      const stroops = typeof fee === "string" ? fee : stringify(fee);

      if (stroops) {
        value = isStroops
          ? `${formatNumber(BigInt(stroops.toString()))} stroops`
          : `${stroopsToLumens(stroops)} XLM`;

        if (isRefund) {
          value = `-${value}`;
        }
      }
    }

    return (
      <Text
        size="sm"
        as="div"
        weight="medium"
        addlClassName="FeeBreakdown__text"
        {...(isBold ? { "data-is-bold": true } : {})}
      >
        {value}
      </Text>
    );
  };

  return (
    <Box gap="md" addlClassName="FeeBreakdown">
      {/* Fees table details */}
      <div className="FeeBreakdown__gridTableContainer">
        <GridTable>
          {/* Header */}
          <GridTableRow isHeader={true}>
            <GridTableCell>Fee Type</GridTableCell>
            <GridTableCell>Proposed</GridTableCell>
            <GridTableCell>Refunded</GridTableCell>
            <GridTableCell>Final</GridTableCell>
          </GridTableRow>

          {/* Inclusion Fee */}
          <GridTableRow>
            <GridTableCell>
              <FeeType title="Inclusion Fee" isBold={true} />
            </GridTableCell>
            <GridTableCell>
              <FeeAmount fee={feeBreakdown.inclusionFee} />
            </GridTableCell>
            <GridTableCell>
              <FeeAmount
                fee={feeBreakdown.refundedInclusionFee}
                isRefund={true}
              />
            </GridTableCell>
            <GridTableCell>
              <FeeAmount fee={feeBreakdown.finalInclusionFee} isBold={true} />
            </GridTableCell>
          </GridTableRow>

          {/* Resource Fee */}
          <GridTableRow>
            <GridTableCell>
              <div
                className="FeeBreakdown__resourceFeeToggle"
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
                data-is-expanded={isExpanded}
              >
                <FeeType title="Resource Fee" isBold={true} />
                <Icon.ChevronRight />
              </div>
            </GridTableCell>
            <GridTableCell>
              <FeeAmount fee={feeBreakdown.maxResourceFee} />
            </GridTableCell>
            <GridTableCell>
              <FeeAmount
                fee={feeBreakdown.refundedResourceFee}
                isRefund={true}
              />
            </GridTableCell>
            <GridTableCell>
              <FeeAmount
                fee={feeBreakdown.finalResourceFeeCharged}
                isBold={true}
              />
            </GridTableCell>
          </GridTableRow>

          {/* Nested */}
          <ExpandBox offsetTop="custom" customValue="0" isExpanded={isExpanded}>
            {/* Refundable Fee */}
            <GridTableRow>
              <GridTableCell isNested={true}>
                <FeeType
                  title="Refundable Fee"
                  badges={["Rent", "Event", "Return Value"]}
                />
              </GridTableCell>
              <GridTableCell>
                <FeeAmount fee={feeBreakdown.refundable} />
              </GridTableCell>
              <GridTableCell>
                <FeeAmount
                  fee={feeBreakdown.refundedRefundable}
                  isRefund={true}
                />
              </GridTableCell>
              <GridTableCell>
                <FeeAmount fee={feeBreakdown.finalRefundable} isBold={true} />
              </GridTableCell>
            </GridTableRow>

            {/* Non-Refundable Fee */}
            <GridTableRow>
              <GridTableCell isNested={true}>
                <FeeType
                  title="Non-Refundable Fee"
                  badges={["Instructions", "Read", "Write", "Bandwidth"]}
                />
              </GridTableCell>
              <GridTableCell>
                <FeeAmount fee={feeBreakdown.nonRefundable} />
              </GridTableCell>
              <GridTableCell>
                <FeeAmount
                  fee={feeBreakdown.refundedNonRefundable}
                  isRefund={true}
                />
              </GridTableCell>
              <GridTableCell>
                <FeeAmount
                  fee={feeBreakdown.finalNonRefundable}
                  isBold={true}
                />
              </GridTableCell>
            </GridTableRow>
          </ExpandBox>

          {/* Total Fees */}
          <GridTableRow isHighlighted={true}>
            <GridTableCell>
              <FeeType title="Total Fees" isBold={true} />
            </GridTableCell>
            <GridTableCell>
              <FeeAmount fee={feeBreakdown.maxFee} isBold={true} />
            </GridTableCell>
            <GridTableCell>
              <FeeAmount
                fee={feeBreakdown.finalRefunded}
                isBold={true}
                isRefund={true}
              />
            </GridTableCell>
            <GridTableCell>
              <FeeAmount fee={feeBreakdown.finalFeeCharged} isBold={true} />
            </GridTableCell>
          </GridTableRow>
        </GridTable>
      </div>

      {/* Stroops toggle */}
      <Box gap="xs" direction="row" align="center" justify="right">
        <Label htmlFor="fees-stroops-toggle" size="sm">
          Change to Stroops
        </Label>
        <Toggle
          id="fees-stroops-toggle"
          checked={isStroops}
          fieldSize="sm"
          onChange={() => setIsStroops(!isStroops)}
        />
      </Box>

      {/* Footprint */}
      <ul className="FeeBreakdown__footprint">
        <li>
          Inclusion Fee: The maximum amount the submitter is willing to bid to
          get the transaction included in the ledger.
        </li>
        <li>Resource Fee: A fee required for smart contract transaction.</li>
        <li>
          Non-Refundable Resource Fee: Fixed portion of the resource fee based
          on CPU instructions, read/write bytes, and transaction size. This part
          is never refunded, regardless of actual usage.
        </li>
        <li>
          Refundable Resource Fee: Calculated from rent, event size, and return
          value size. This portion is pre-charged and partially refunded after
          execution based on actual usage.
        </li>
      </ul>

      {/* Learn more link */}
      <SdsLink
        href="https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering"
        icon={<Icon.LinkExternal01 />}
        size="xs"
      >
        Learn more about Fees
      </SdsLink>
    </Box>
  );
};

// =============================================================================
// Components
// =============================================================================
const GridTable = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => (
  <div className="FeeBreakdown__gridTable" role="table">
    {children}
  </div>
);

const GridTableRow = ({
  children,
  isHeader,
  isHighlighted,
}: {
  children: React.ReactElement[];
  isHeader?: boolean;
  isHighlighted?: boolean;
}) => (
  <div
    className="FeeBreakdown__gridTable__row"
    role="row"
    {...(isHeader ? { "data-is-header": true } : {})}
    {...(isHighlighted ? { "data-is-highlighted": true } : {})}
  >
    {children}
  </div>
);

const GridTableCell = ({
  children,
  isNested,
}: {
  children: React.ReactNode | React.ReactNode[] | null;
  isNested?: boolean;
}) => (
  <div
    className="FeeBreakdown__gridTable__cell"
    role="cell"
    {...(isNested ? { "data-is-nested": true } : {})}
  >
    {children}
  </div>
);
