import { contract } from "@stellar/stellar-sdk";
import { useQuery } from "@tanstack/react-query";

export const useContractClientFromRpc = ({
  contractId,
  networkPassphrase,
  rpcUrl,
}: {
  contractId: string;
  networkPassphrase: string;
  rpcUrl: string;
}) => {
  const query = useQuery<contract.Client | null>({
    queryKey: ["useClientFromRpc", contractId, networkPassphrase, rpcUrl],
    queryFn: async () => {
      try {
        const client = await contract.Client.from({
          contractId,
          networkPassphrase,
          rpcUrl,
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });

        return client;
      } catch (e: any) {
        let customMessage = e?.message || e;
        if (e.message.includes("Cannot destructure property 'length' of 'e'")) {
          customMessage = "There is no Wasm for this contract";
        }

        throw new Error(
          `error while fetching contract information: ${customMessage}`,
        );
      }
    },
    enabled: false,
  });

  return query;
};
