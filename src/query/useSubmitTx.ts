import { useMutation } from "@tanstack/react-query";

import { Horizon, FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";

export const useSubmitTx = (
  transaction: FeeBumpTransaction | Transaction,
  server: Horizon.Server,
) => {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await server.submitTransaction(transaction);

        return response;
      } catch (e) {
        throw new Error(
          `There was a problem fetching the latest transaction: ${e}`,
        );
      }
    },
  });
};
