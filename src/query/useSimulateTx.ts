import { useMutation } from "@tanstack/react-query";
import { AnyObject } from "@/types/types";

type SimulateTxProps = {
  rpcUrl: string;
  transactionXdr: string;
  instructionLeeway?: string;
};

export const useSimulateTx = () => {
  const mutation = useMutation({
    mutationFn: async ({
      rpcUrl,
      transactionXdr,
      instructionLeeway,
    }: SimulateTxProps) => {
      const res = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "simulateTransaction",
          params: {
            transaction: transactionXdr,
            ...(instructionLeeway
              ? {
                  resourceConfig: {
                    instructionLeeway: Number(instructionLeeway),
                  },
                }
              : {}),
          },
        }),
      });

      return await res.json();
    },
  });

  return {
    ...mutation,
    data: mutation.data as AnyObject,
    mutateAsync: async ({
      rpcUrl,
      transactionXdr,
      instructionLeeway,
    }: SimulateTxProps) => {
      try {
        await mutation.mutateAsync({
          rpcUrl,
          transactionXdr,
          instructionLeeway,
        });
      } catch (e) {
        // do nothing
      }
    },
  };
};
