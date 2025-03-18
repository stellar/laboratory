import { useMutation } from "@tanstack/react-query";
import { rpc as StellarRpc, TransactionBuilder } from "@stellar/stellar-sdk";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

type PrepareRpcTxProps = {
  rpcUrl: string;
  transactionXdr: string;
  networkPassphrase: string;
  headers: NetworkHeaders;
};

export const usePrepareRpcTx = () => {
  const mutation = useMutation<
    { envelopeXdr: string },
    { result: { errorResult: string } },
    PrepareRpcTxProps
  >({
    mutationFn: async ({
      rpcUrl,
      transactionXdr,
      networkPassphrase,
      headers,
    }: PrepareRpcTxProps) => {
      try {
        const transaction = TransactionBuilder.fromXDR(
          transactionXdr,
          networkPassphrase,
        );
        const rpcServer = new StellarRpc.Server(rpcUrl, {
          headers: isEmptyObject(headers) ? undefined : { ...headers },
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });
        const preparedTx = await rpcServer.prepareTransaction(transaction);

        return {
          envelopeXdr: preparedTx.toXDR(),
        };
      } catch (e) {
        throw {
          result: {
            errorResult: e,
          },
        };
      }
    },
  });

  return mutation;
};
