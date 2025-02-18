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
        });

        return client;
      } catch (e: any) {
        throw `error while fetching contract information: ${e?.message ? e?.message : e}`;
      }
    },
    enabled: !!contractId && !!networkPassphrase && !!rpcUrl,
  });

  return query;
};
