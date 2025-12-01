import { useQuery } from "@tanstack/react-query";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import { getAttesationResponse } from "@/helpers/getBuildVerification";

import { NetworkHeaders, WasmData } from "@/types/types";

export const useWasmGitHubAttestation = ({
  wasmHash,
  rpcUrl,
  isActive,
  headers = {},
}: {
  wasmHash: string;
  rpcUrl: string;
  isActive: boolean;
  headers?: NetworkHeaders;
}) => {
  const query = useQuery<WasmData | null | undefined>({
    queryKey: ["useWasmGitHubAttestation", wasmHash, rpcUrl],
    queryFn: async () => {
      if (!wasmHash || !rpcUrl) {
        return null;
      }

      try {
        const rpcServer = new StellarRpc.Server(rpcUrl, {
          headers: isEmptyObject(headers) ? undefined : { ...headers },
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });

        const attPayload = await getAttesationResponse({
          wasmHash,
          rpcServer,
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
    enabled: isActive,
  });

  return query;
};
