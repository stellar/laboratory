import { useMutation } from "@tanstack/react-query";
import { SorobanRpc, TransactionBuilder } from "@stellar/stellar-sdk";
import { delay } from "@/helpers/delay";
import { SubmitRpcError, SubmitRpcResponse } from "@/types/types";

type SubmitRpcTxProps = {
  rpcServer: SorobanRpc.Server;
  transactionXdr: string;
  networkPassphrase: string;
};

export const useSubmitRpcTx = () => {
  const mutation = useMutation<
    SubmitRpcResponse,
    SubmitRpcError,
    SubmitRpcTxProps
  >({
    mutationFn: async ({
      rpcServer,
      transactionXdr,
      networkPassphrase,
    }: SubmitRpcTxProps) => {
      const transaction = TransactionBuilder.fromXDR(
        transactionXdr,
        networkPassphrase,
      );
      const sentTx = await rpcServer.sendTransaction(transaction);

      if (sentTx.status !== "PENDING") {
        throw { status: sentTx.status, result: sentTx };
      }

      let txResponse;
      const MAX_ATTEMPTS = 10;
      let attempts = 0;

      while (attempts++ < MAX_ATTEMPTS && txResponse?.status !== "SUCCESS") {
        txResponse = await rpcServer.getTransaction(sentTx.hash);

        switch (txResponse.status) {
          case "FAILED":
            throw { status: "FAILED", result: txResponse };
          case "NOT_FOUND":
            await delay(1000);
            continue;
          case "SUCCESS":
          default:
          // Do nothing
        }
      }

      if (attempts >= MAX_ATTEMPTS || txResponse?.status !== "SUCCESS") {
        throw { status: "TIMEOUT", result: txResponse };
      }

      const submittedTx = TransactionBuilder.fromXDR(
        txResponse.envelopeXdr,
        networkPassphrase,
      );
      // TS doesn't recognize operations property even though it is there
      const operations = (submittedTx as any)?.operations || ([] as any[]);

      return {
        hash: sentTx.hash,
        result: txResponse,
        operationCount: operations.length,
        fee: submittedTx.fee,
      };
    },
  });

  return mutation;
};
