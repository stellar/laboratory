import { useQuery } from "@tanstack/react-query";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { AnyObject, NetworkHeaders } from "@/types/types";

export const useWasmGitHubAttestation = ({
  wasmHash,
  sourceCodeLink,
  rpcUrl,
  isActive,
  headers = {},
}: {
  wasmHash: string;
  sourceCodeLink: string;
  rpcUrl: string;
  isActive: boolean;
  headers?: NetworkHeaders;
}) => {
  const query = useQuery({
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

        const wasm = await rpcServer.getContractWasmByHash(wasmHash, "hex");
        const sourceRepo = await extractSourceRepo(wasm);

        if (!sourceRepo) {
          return null;
        }

        const attestationUrl = `https://api.github.com/repos/${sourceRepo}/attestations/sha256:${wasmHash}`;
        const att = await fetch(attestationUrl);

        if (att.status !== 200) {
          return null;
        }

        const attResponse = await att.json();
        const attPayload = parseAttestationPayload(attResponse);

        // Validate wasm hash
        if (attPayload?.subject?.[0]?.digest?.sha256 !== wasmHash) {
          return null;
        }

        // Validate workflow file
        const workflowPath = attPayload?.predicate?.runDetails?.builder?.id
          .split(sourceRepo)?.[1]
          .split("@")?.[0];

        const fetchWorkflow = await fetch(`${sourceCodeLink}${workflowPath}`);

        if (fetchWorkflow.status !== 200) {
          return null;
        }

        // Validate source repo
        if (
          !(
            attPayload?.predicate?.buildDefinition?.resolvedDependencies?.[0]
              ?.uri || ""
          ).includes(sourceRepo)
        ) {
          return null;
        }

        const repository =
          attPayload?.predicate?.buildDefinition?.externalParameters?.workflow
            ?.repository;
        const gitCommit =
          attPayload?.predicate?.buildDefinition?.resolvedDependencies?.[0]
            ?.digest?.gitCommit;
        const invocationId =
          attPayload?.predicate?.runDetails?.metadata?.invocationId;
        const workflowFile =
          attPayload?.predicate?.buildDefinition?.externalParameters?.workflow
            ?.path;
        const commitUrl =
          repository && gitCommit ? `${repository}/tree/${gitCommit}` : "";

        return {
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

const extractSourceRepo = async (wasmBytes: Buffer): Promise<string | null> => {
  try {
    const mod = await WebAssembly.compile(wasmBytes);

    // Try different section names that might contain the "source_repo"
    const possibleSections = [
      "contractmetav0",
      "contractenvmetav0",
      "contractspecv0",
      "metadata",
      "custom",
    ];

    const MATCH_PROP = "source_repo";

    // Extract data from all these possible sections
    for (const sectionName of possibleSections) {
      const sections = WebAssembly.Module.customSections(mod, sectionName);

      if (sections.length > 0) {
        for (let i = 0; i < sections.length; i++) {
          // Get section data text
          const sectionData = new Uint8Array(sections[i]);
          const decoder = new TextDecoder();
          const sectionText = decoder.decode(sectionData);

          // Check if this section contains the prop
          if (sectionText.includes(MATCH_PROP)) {
            const regex = /github:[^%\0]+/;
            const match = sectionText.match(regex);
            // Return GitHub name and repo
            return match ? match[0].replace("github:", "") : null;
          }
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

const parseAttestationPayload = (att: AnyObject) => {
  const payload = att.attestations[0].bundle.dsseEnvelope.payload;

  try {
    return JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
  } catch (e) {
    throw `Error decoding payload: ${e}`;
  }
};
