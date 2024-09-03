import { useMutation } from "@tanstack/react-query";
import { Horizon, TransactionBuilder } from "@stellar/stellar-sdk";
import { SubmitHorizonError } from "@/types/types";

type SubmitHorizonTxProps = {
  horizonUrl: string;
  transactionXdr: string;
  networkPassphrase: string;
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
    }: SubmitHorizonTxProps) => {
      const transaction = TransactionBuilder.fromXDR(
        transactionXdr,
        networkPassphrase,
      );
      const horizonServer = new Horizon.Server(horizonUrl);
      return (await horizonServer.submitTransaction(
        transaction,
      )) as Horizon.HorizonApi.TransactionResponse;
    },
  });

  return mutation;
};
