import { useQuery } from "@tanstack/react-query";
import {
  BASE_FEE,
  rpc as StellarRpc,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { NetworkHeaders } from "@/types/types";

export const useBuildRpcTransaction = ({
  publicKey,
  rpcUrl,
  headers,
  networkPassphrase,
  operation,
}: {
  publicKey: string | undefined;
  rpcUrl: string;
  headers: NetworkHeaders;
  networkPassphrase: string;
  operation: any;
}) => {
  const query = useQuery({
    queryKey: ["buildRpcTransaction", publicKey, operation],
    queryFn: async () => {
      if (!publicKey) {
        throw "Public key is required.";
      }

      if (!operation) {
        throw "Operation is required.";
      }

      const rpcServer = new StellarRpc.Server(rpcUrl, {
        headers,
        allowHttp: new URL(rpcUrl).hostname === "localhost",
      });

      try {
        const account = await rpcServer.getAccount(publicKey);

        const transaction = new TransactionBuilder(account, {
          fee: BASE_FEE,
          networkPassphrase,
        })
          .addOperation(operation)
          .setTimeout(30)
          .build();

        const preparedTxn = await rpcServer.prepareTransaction(transaction);

        return {
          preparedTxn,
          preparedXdr: preparedTxn.toEnvelope().toXDR("base64"),
        };
      } catch (error) {
        throw `Error building RPC transaction: ${error}.`;
      }
    },
    enabled: Boolean(publicKey) && Boolean(operation),
  });

  return query;
};
