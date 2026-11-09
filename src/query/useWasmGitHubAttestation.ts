import { useQuery } from "@tanstack/react-query";

import { getAttestationResponseFromWasm } from "@/helpers/getBuildVerification";

import { BuildAttestation } from "@/types/types";

/**
 * Looks up the GitHub build attestation (SEP-55) for a contract's Wasm.
 *
 * Takes the Wasm bytes from `useWasmBinaryFromRpc` instead of downloading them
 * again. Keyed by Wasm hash only, since the hash fully determines the bytes.
 */
export const useWasmGitHubAttestation = ({
  wasmHash,
  wasmBinary,
}: {
  wasmHash: string;
  wasmBinary: Uint8Array | null | undefined;
}) => {
  // `wasmBinary` is left out of the query key on purpose: the hash identifies
  // the bytes, and hashing a large Uint8Array into the key every render is
  // wasteful
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  const query = useQuery({
    queryKey: ["useWasmGitHubAttestation", wasmHash],
    queryFn: async (): Promise<BuildAttestation | null> => {
      if (!wasmHash || !wasmBinary) {
        return null;
      }

      try {
        const attPayload = await getAttestationResponseFromWasm({
          wasmHash,
          wasm: wasmBinary,
        });

        if (
          !attPayload?.payload ||
          !attPayload.sourceRepo ||
          !attPayload.attestationUrl
        ) {
          return null;
        }

        const { sourceRepo, attestationUrl, payload } = attPayload;

        const repository =
          payload?.predicate?.buildDefinition?.externalParameters?.workflow
            ?.repository;
        const gitCommit =
          payload?.predicate?.buildDefinition?.resolvedDependencies?.[0]?.digest
            ?.gitCommit;
        const invocationId =
          payload?.predicate?.runDetails?.metadata?.invocationId;
        const workflowFile =
          payload?.predicate?.buildDefinition?.externalParameters?.workflow
            ?.path;
        const commitUrl =
          repository && gitCommit ? `${repository}/tree/${gitCommit}` : "";

        return {
          sourceRepo,
          build: {
            attestation: `api.github.com/repos/${sourceRepo}/…`,
            attestationUrl,
            commit: gitCommit || "",
            commitUrl,
            summary: invocationId ? invocationId.split(sourceRepo)[1] : "",
            summaryUrl: invocationId || "",
            workflowFile: workflowFile || "",
            workflowFileUrl:
              commitUrl && workflowFile ? `${commitUrl}/${workflowFile}` : "",
          },
        };
      } catch (e: any) {
        throw `Something went wrong getting Wasm Attestation from GitHub. ${e.message || e}`;
      }
    },
    enabled: Boolean(wasmHash && wasmBinary),
    // Attestations for a hash rarely change, and the GitHub API rate-limits
    // unauthenticated requests (60/hour), so don't re-check on every visit
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  return query;
};
