import { rpc as StellarRpc, Contract, xdr } from "@stellar/stellar-sdk";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { computeWasmHash } from "@/helpers/computeWasmHash";
import { AnyObject } from "@/types/types";

export const getBuildVerification = async ({
  contractId,
  rpcUrl,
  headers = {},
}: {
  contractId: string;
  rpcUrl: string;
  headers?: Record<string, string>;
}): Promise<"built-in" | "verified" | "unverified"> => {
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
      // SACs don't have custom WASM, they're built-in
      return "built-in"; // or handle SAC verification differently
    }

    // Now safe to get WASM for non-SAC contracts
    const wasmBuffer = await rpcServer.getContractWasmByContractId(contractId);
    console.log("wasmBuffer: ", wasmBuffer);
    const wasmHash = await computeWasmHash(wasmBuffer);
    console.log("wasmHash: ", wasmHash);

    const wasm = await rpcServer.getContractWasmByHash(wasmHash, "hex");
    console.log("wasm ", wasm);
    const sourceRepo = await extractSourceRepo(wasm);

    console.log("sourceRepo: ", sourceRepo);

    if (!sourceRepo) {
      return "unverified";
    }

    const attestationUrl = `https://api.github.com/repos/${sourceRepo}/attestations/sha256:${wasmHash}`;

    console.log("attestationUrl: ", attestationUrl);

    const att = await fetch(attestationUrl);

    console.log("att: ", att);

    if (att.status !== 200) {
      return "unverified";
    }

    const attResponse = await att.json();

    console.log("attResponse: ", attResponse);
    // const attPayload = parseAttestationPayload(attResponse);

    return "verified";
    // Continue with your verification logic...
  } catch (e: any) {
    console.log("e: ", e);
    return "unverified";
  }
};

export const extractSourceRepo = async (
  wasmBytes: Buffer,
): Promise<string | null> => {
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
            const regex = /github:[^%\0]+/;
            const match = sectionText.match(regex);
            // Return GitHub name and repo
            return match ? match[0].replace("github:", "") : null;
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

export const parseAttestationPayload = (att: AnyObject) => {
  const payload = att.attestations[0].bundle.dsseEnvelope.payload;

  try {
    return JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
  } catch (e) {
    throw `Error decoding payload: ${e}`;
  }
};
