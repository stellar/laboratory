import { useMutation } from "@tanstack/react-query";
import { Horizon, TransactionBuilder } from "@stellar/stellar-sdk";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders, SubmitHorizonError } from "@/types/types";

type SubmitHorizonTxProps = {
  horizonUrl: string;
  transactionXdr: string;
  networkPassphrase: string;
  headers: NetworkHeaders;
};

export const useSubmitHorizonTx = () => {
  const mutation = useMutation<
    Horizon.HorizonApi.TransactionResponse,
    SubmitHorizonError,
    SubmitHorizonTxProps
  >({
    mutationFn: async ({
      horizonUrl,
      transactionXdr,
      networkPassphrase,
      headers,
    }: SubmitHorizonTxProps) => {
      const transaction = TransactionBuilder.fromXDR(
        transactionXdr,
        networkPassphrase,
      );
      const horizonServer = new Horizon.Server(horizonUrl, {
        headers: isEmptyObject(headers) ? undefined : { ...headers },
        allowHttp: new URL(horizonUrl).hostname === "localhost",
      });
      return (await horizonServer.submitTransaction(
        transaction,
      )) as Horizon.HorizonApi.TransactionResponse;
    },
  });

  return mutation;
};
