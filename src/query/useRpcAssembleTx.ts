import { useMutation } from "@tanstack/react-query";
import { rpc as StellarRpc, TransactionBuilder } from "@stellar/stellar-sdk";

import { PrepareRpcErrorResponse, PrepareRpcResponse } from "@/types/types";

type AssembleRpcTxProps = {
  transactionXdr: string;
  simulatedTx: StellarRpc.Api.SimulateTransactionResponse;
  networkPassphrase: string;
};

// RPC's assembleTransaction method requires manual simulation first
// Use this when you want more control over the simulation process
export const useRpcAssembleTx = () => {
  const mutation = useMutation<
    PrepareRpcResponse,
    PrepareRpcErrorResponse,
    AssembleRpcTxProps
  >({
    mutationFn: async ({
      transactionXdr,
      simulatedTx,
      networkPassphrase,
    }: AssembleRpcTxProps) => {
      try {
        if (!simulatedTx) {
          throw "Simulated transaction data is required for assembling the transaction.";
        }

        const transaction = TransactionBuilder.fromXDR(
          transactionXdr,
          networkPassphrase,
        );

        const assembledTx = StellarRpc.assembleTransaction(
          transaction,
          simulatedTx,
        ).build();

        return {
          transactionXdr: assembledTx.toXDR(),
        };
      } catch (e) {
        throw {
          result: e,
        };
      }
    },
  });

  return mutation;
};
