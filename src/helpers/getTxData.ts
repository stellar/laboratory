import { BigNumber } from "bignumber.js";
import { isSorobanOperationType } from "@/helpers/sorobanUtils";
import { RpcTxJsonResponse } from "@/types/types";

export const getTxData = (txDetails: RpcTxJsonResponse | null) => {
  const feeBumpTx = txDetails?.envelopeJson?.tx_fee_bump;

  const transaction = feeBumpTx
    ? feeBumpTx.tx?.inner_tx?.tx?.tx
    : txDetails?.envelopeJson?.tx?.tx;
  const operations = transaction?.operations;

  const isSorobanTx = () => {
    if (operations?.length > 1) {
      return false;
    }

    const firstTxOp = operations?.[0]?.body;
    const firstTxOpType = firstTxOp ? Object.keys(firstTxOp)[0] : null;

    return firstTxOpType ? isSorobanOperationType(firstTxOpType) : false;
  };

  return {
    feeBumpTx,
    transaction,
    operations,
    isSorobanTx: isSorobanTx(),
    feeBreakdown: txDetails ? feeBreakdown(txDetails) : null,
  };
};

const feeBreakdown = (txDetails: RpcTxJsonResponse) => {
  // Proposed fees
  const maxFee =
    txDetails?.envelopeJson?.tx_fee_bump?.tx?.fee ||
    txDetails?.envelopeJson?.tx?.tx?.fee;
  const maxResourceFee =
    txDetails?.envelopeJson?.tx?.tx?.ext?.v1?.resource_fee ||
    txDetails?.envelopeJson?.tx_fee_bump?.tx?.inner_tx?.tx?.tx?.ext?.v1
      ?.resource_fee;
  // inclusionFee = maxFee - maxResourceFee
  const inclusionFee = BigNumber(maxFee)
    .minus(maxResourceFee || 0)
    .toString();
  const nonRefundable =
    txDetails?.resultMetaJson?.v3?.soroban_meta?.ext?.v1
      ?.total_non_refundable_resource_fee_charged;
  // refundable = maxResourceFee - nonRefundable
  const refundable =
    maxResourceFee && nonRefundable
      ? BigNumber(maxResourceFee).minus(nonRefundable).toString()
      : undefined;

  // Final fees
  const finalFeeCharged = txDetails?.resultJson?.fee_charged;
  const finalNonRefundable = nonRefundable;
  const finalRefundable =
    txDetails?.resultMetaJson?.v3?.soroban_meta?.ext?.v1
      ?.total_refundable_resource_fee_charged;
  // finalResourceFeeCharged = finalNonRefundable + finalRefundable
  const finalResourceFeeCharged =
    finalNonRefundable && finalRefundable
      ? BigNumber(finalNonRefundable).plus(finalRefundable).toString()
      : undefined;
  // finalInclusionFee = finalFeeCharged - finalResourceFeeCharged
  const finalInclusionFee = finalResourceFeeCharged
    ? BigNumber(finalFeeCharged).minus(finalResourceFeeCharged).toString()
    : undefined;
  // finalRefunded = maxFee - finalFeeCharged
  const finalRefunded = BigNumber(maxFee).minus(finalFeeCharged).toString();

  return {
    maxFee,
    maxResourceFee,
    inclusionFee,
    nonRefundable,
    refundable,
    finalFeeCharged,
    finalNonRefundable,
    finalRefundable,
    finalResourceFeeCharged,
    finalInclusionFee,
    finalRefunded,
  };
};
