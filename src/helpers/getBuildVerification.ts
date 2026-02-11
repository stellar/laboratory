import { rpc as StellarRpc, Contract, xdr } from "@stellar/stellar-sdk";

import { isEmptyObject } from "@/helpers/isEmptyObject";

import {
  BuildVerificationStatus,
  BuildVerificationResponse,
} from "@/types/types";

export const getBuildVerification = async ({
  contractId,
  rpcUrl,
  headers = {},
}: {
  contractId: string;
  rpcUrl: string;
  headers?: Record<string, string>;
}): Promise<BuildVerificationStatus> => {
  try {
    const rpcServer = new StellarRpc.Server(rpcUrl, {
      headers: isEmptyObject(headers) ? undefined : { ...headers },
      allowHttp: new URL(rpcUrl).hostname === "localhost",
    });

    // First, check if it's a SAC
    const contractLedgerKey = new Contract(contractId).getFootprint();
    const ledgerEntries = await rpcServer.getLedgerEntries(contractLedgerKey);

    const executable = ledgerEntries.entries[0].val
      .contractData()
      ?.val()
      ?.instance()
      ?.executable();

    const contractType = executable?.switch()?.name;
    const isSAC =
      contractType ===
      xdr.ContractExecutableType.contractExecutableStellarAsset().name;

    if (isSAC) {
      // SACs don't have custom WASM, they're built_in
      return "built_in";
    }

    const wasmBuffer = await rpcServer.getContractWasmByContractId(contractId);
    const wasmHash = await computeWasmHash(new Uint8Array(wasmBuffer).buffer);

    const buildVerification = await getAttesationResponse({
      wasmHash,
      rpcServer,
    });

    return buildVerification?.status || "unverified";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return "unverified";
  }
};

export const getAttesationResponse = async ({
  wasmHash,
  rpcServer,
}: {
  wasmHash: string;
  rpcServer: StellarRpc.Server;
}): Promise<BuildVerificationResponse | null> => {
  try {
    const wasm = await rpcServer.getContractWasmByHash(wasmHash, "hex");
    const sourceRepo = await extractSourceRepo(wasm);

    if (!sourceRepo) {
      return {
        status: "unverified",
      };
    }

    const attestationUrl = `https://api.github.com/repos/${sourceRepo}/attestations/sha256:${wasmHash}`;

    const att = await fetch(attestationUrl);

    if (att.status !== 200) {
      return { status: "unverified" };
    }

    const attResponse = await att.json();
    const attPayload = parseAttestationPayload(attResponse);

    // Validate Wasm hash
    if (attPayload?.subject?.[0]?.digest?.sha256 !== wasmHash) {
      return { status: "unverified" };
    }

    // Validate source repo
    if (
      !(
        attPayload?.predicate?.buildDefinition?.resolvedDependencies?.[0]
          ?.uri || ""
      ).includes(sourceRepo)
    ) {
      return { status: "unverified" };
    }

    return {
      status: "verified",
      payload: attPayload,
      sourceRepo,
      attestationUrl,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

const extractSourceRepo = async (wasmBytes: Buffer): Promise<string | null> => {
  try {
    const wasmBuffer = new Uint8Array(wasmBytes);
    const mod = await WebAssembly.compile(wasmBuffer);

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
            // First try with the github: prefix (SEP-55 compliant)
            const regexWithPrefix = /github:[^%\0]+/;
            const matchWithPrefix = sectionText.match(regexWithPrefix);
            if (matchWithPrefix) {
              return matchWithPrefix[0].replace("github:", "");
            }
            
            // Fallback: try to extract without the prefix for existing contracts
            // Look for source_repo followed by owner/repo pattern (similar to github: prefixed version)
            // Match source_repo followed by common separators (colon/whitespace), then capture the value
            const regexWithoutPrefix = /source_repo[:\s]+([^%\0\s]+)/;
            const matchWithoutPrefix = sectionText.match(regexWithoutPrefix);
            if (matchWithoutPrefix) {
              // Extract and clean up the matched value
              const value = matchWithoutPrefix[1].trim();
              // Basic validation: should contain a slash and look like owner/repo
              if (value.includes('/')) {
                return value;
              }
            }
            
            return null;
          }
        }
      }
    }

    return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

const parseAttestationPayload = (att: any) => {
  const payload = att.attestations[0].bundle.dsseEnvelope.payload;

  try {
    return JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
  } catch (e) {
    throw `Error decoding payload: ${e}`;
  }
};

const computeWasmHash = async (wasmBuffer: ArrayBuffer): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", wasmBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
