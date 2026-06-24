import { useQuery } from "@tanstack/react-query";
import {
  BASE_FEE,
  rpc as StellarRpc,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { NetworkHeaders } from "@/types/types";

// Default time (in seconds) the built transaction stays valid before its time
// bounds expire.
const DEFAULT_TX_TIMEOUT_SECONDS = 30;

export const useBuildRpcTransaction = ({
  publicKey,
  rpcUrl,
  headers,
  networkPassphrase,
  operation,
  timeoutInSeconds = DEFAULT_TX_TIMEOUT_SECONDS,
}: {
  publicKey: string | undefined;
  rpcUrl: string;
  headers: NetworkHeaders;
  networkPassphrase: string;
  operation: any;
  // How long the built transaction stays valid before its time bounds expire.
  // Must be generous enough to cover the manual sign + submit steps (including
  // hardware wallets); otherwise the user gets a txTooLate error on submit.
  timeoutInSeconds?: number;
}) => {
  const query = useQuery({
    queryKey: [
      "buildRpcTransaction",
      publicKey,
      operation,
      networkPassphrase,
      timeoutInSeconds,
      headers,
    ],
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
          .setTimeout(timeoutInSeconds)
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
