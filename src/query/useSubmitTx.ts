import { useMutation } from "@tanstack/react-query";

import { Horizon, FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";
import { MemoType } from "@stellar/stellar-base";

export interface TransactionResponse
  extends Horizon.HorizonApi.SubmitTransactionResponse,
    Horizon.HorizonApi.BaseResponse<
      "account" | "ledger" | "operations" | "effects" | "succeeds" | "precedes"
    > {
  created_at: string;
  fee_meta_xdr: string;
  fee_charged: number | string;
  max_fee: number | string;
  id: string;
  memo_type: MemoType;
  memo?: string;
  memo_bytes?: string;
  operation_count: number;
  paging_token: string;
  signatures: string[];
  source_account: string;
  source_account_sequence: string;
  fee_account: string;
  inner_transaction?: Horizon.HorizonApi.InnerTransactionResponse;
  fee_bump_transaction?: Horizon.HorizonApi.FeeBumpTransactionResponse;
  preconditions?: Horizon.HorizonApi.TransactionPreconditions;
}

export const useSubmitTx = () => {
  return useMutation({
    mutationFn: async ({
      transaction,
      server,
    }: {
      transaction: Transaction | FeeBumpTransaction;
      server: Horizon.Server;
    }) => {
      const response = await server.submitTransaction(transaction);
      return response as TransactionResponse;
    },
    onSuccess: (response) => response,
    onError: (err) => err,
  });
};
