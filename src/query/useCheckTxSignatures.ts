import { useQuery } from "@tanstack/react-query";
import { fetchTxSignatures } from "@/helpers/fetchTxSignatures";

export const useCheckTxSignatures = ({
  xdr,
  networkPassphrase,
  networkUrl,
}: {
  xdr: string;
  networkPassphrase: string;
  networkUrl: string;
}) => {
  const query = useQuery({
    queryKey: ["tx", "signatures"],
    queryFn: async () => {
      try {
        return await fetchTxSignatures({
          txXdr: xdr,
          networkPassphrase,
          networkUrl,
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
