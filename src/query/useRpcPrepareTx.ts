import { useMutation } from "@tanstack/react-query";
import { rpc as StellarRpc, TransactionBuilder } from "@stellar/stellar-sdk";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import {
  NetworkHeaders,
  PrepareRpcErrorResponse,
  PrepareRpcResponse,
} from "@/types/types";

type PrepareRpcTxProps = {
  rpcUrl: string;
  transactionXdr: string;
  networkPassphrase: string;
  headers: NetworkHeaders;
};

// RPC's prepareTransaction method handles both
// simulating and assembling transactions
export const useRpcPrepareTx = () => {
  const mutation = useMutation<
    PrepareRpcResponse,
    PrepareRpcErrorResponse,
    PrepareRpcTxProps
  >({
    mutationFn: async ({
      rpcUrl,
      transactionXdr,
      networkPassphrase,
      headers,
    }: PrepareRpcTxProps) => {
      try {
        const transaction = TransactionBuilder.fromXdr(
          transactionXdr,
          networkPassphrase,
        );
        const rpcServer = new StellarRpc.Server(rpcUrl, {
          headers: isEmptyObject(headers) ? undefined : { ...headers },
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });
        // TODO: handle CAP-71 v2 auth flag
        const preparedTx = await rpcServer.prepareTransaction(transaction);

        return {
          transactionXdr: preparedTx.toXdr(),
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
