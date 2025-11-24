import { useQueries } from "@tanstack/react-query";
import { getBuildVerification } from "@/helpers/getBuildVerification";
import { BuildVerificationStatus } from "@/types/types";

export const useBuildVerification = ({
  contractIds,
  rpcUrl,
  headers,
}: {
  contractIds: string[];
  rpcUrl: string;
  headers: Record<string, string>;
}) => {
  const queries = useQueries({
    queries: contractIds.map((contractId) => ({
      queryKey: ["buildVerification", contractId, rpcUrl],
      queryFn: () =>
        getBuildVerification({
          contractId,
          rpcUrl,
          headers,
        }),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const verifications = queries.reduce(
    (acc, query, index) => {
      const contractId = contractIds[index];
      acc[contractId] = (query.data as BuildVerificationStatus) || "unverified";
      return acc;
    },
    {} as Record<string, BuildVerificationStatus>,
  );

  return {
    verifications,
    isLoading,
  };
};
