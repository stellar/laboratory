import { useQuery } from "@tanstack/react-query";
import { fetchTxSignatures } from "@/helpers/fetchTxSignatures";
import { NetworkHeaders } from "@/types/types";

export const useCheckTxSignatures = ({
  xdr,
  networkPassphrase,
  networkUrl,
  headers,
}: {
  xdr: string;
  networkPassphrase: string;
  networkUrl: string;
  headers: NetworkHeaders;
}) => {
  const query = useQuery({
    queryKey: ["tx", "signatures"],
    queryFn: async () => {
      try {
        return await fetchTxSignatures({
          txXdr: xdr,
          networkPassphrase,
          networkUrl,
          headers,
        });
      } catch (e) {
        throw new Error(
          `There was a problem checking transaction signatures: ${e}`,
        );
      }
    },
    enabled: false,
  });

  return query;
};
