import { useMutation } from "@tanstack/react-query";
import { SorobanRpc, TransactionBuilder } from "@stellar/stellar-sdk";
import { delay } from "@/helpers/delay";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import {
  NetworkHeaders,
  SubmitRpcError,
  SubmitRpcResponse,
} from "@/types/types";

type SubmitRpcTxProps = {
  rpcUrl: string;
  transactionXdr: string;
  networkPassphrase: string;
  headers: NetworkHeaders;
};

export const useSubmitRpcTx = () => {
  const mutation = useMutation<
    SubmitRpcResponse,
    SubmitRpcError,
    SubmitRpcTxProps
  >({
    mutationFn: async ({
      rpcUrl,
      transactionXdr,
      networkPassphrase,
      headers,
    }: SubmitRpcTxProps) => {
      try {
        const transaction = TransactionBuilder.fromXDR(
          transactionXdr,
          networkPassphrase,
        );
        const rpcServer = new SorobanRpc.Server(rpcUrl, {
          headers: isEmptyObject(headers) ? undefined : { ...headers },
        });
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
      } catch (e) {
        throw {
          status: "ERROR",
          result: {
            status: "ERROR",
            latestLedger: "",
            latestLedgerCloseTime: "",
            errorResult: e,
          },
        };
      }
    },
  });

  return mutation;
};
