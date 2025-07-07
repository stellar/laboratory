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
  };
};
