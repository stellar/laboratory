import { useMutation } from "@tanstack/react-query";
import { parse } from "lossless-json";
import {
  xdr,
  rpc as StellarRpc,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { delay } from "@/helpers/delay";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import * as StellarXdr from "@/helpers/StellarXdr";
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
        const rpcServer = new StellarRpc.Server(rpcUrl, {
          headers: isEmptyObject(headers) ? undefined : { ...headers },
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });
        const sentTx = await rpcServer.sendTransaction(transaction);

        await StellarXdr.initialize();

        if (sentTx.status !== "PENDING") {
          if (sentTx.errorResult) {
            const errorResult = parse(
              StellarXdr.decode(
                "TransactionResult",
                sentTx.errorResult?.toXDR("base64"),
              ),
            ) as xdr.TransactionResult;

            sentTx.errorResult = errorResult;
          }

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
