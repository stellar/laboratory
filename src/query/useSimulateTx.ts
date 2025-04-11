import { useMutation } from "@tanstack/react-query";
import { AnyObject, NetworkHeaders } from "@/types/types";

type SimulateTxProps = {
  rpcUrl: string;
  transactionXdr: string;
  instructionLeeway?: string;
  headers: NetworkHeaders;
  xdrFormat?: string;
};

export const useSimulateTx = () => {
  const mutation = useMutation({
    mutationFn: async ({
      rpcUrl,
      transactionXdr,
      instructionLeeway,
      headers,
      xdrFormat,
    }: SimulateTxProps) => {
      const res = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "simulateTransaction",
          params: {
            xdrFormat: xdrFormat || "base64",
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
      headers,
      xdrFormat,
    }: SimulateTxProps) => {
      try {
        await mutation.mutateAsync({
          rpcUrl,
          transactionXdr,
          instructionLeeway,
          headers,
          xdrFormat,
        });
      } catch (e) {
        // do nothing
      }
    },
  };
};
