import * as StellarXdr from "@/helpers/StellarXdr";
import { prettifyJsonString } from "@/helpers/prettifyJsonString";
import {
  CONTRACT_SECTIONS,
  ContractData,
  ContractSectionName,
} from "@/types/types";

export const getWasmContractData = async (wasmBytes: Buffer) => {
  try {
    const wasmBuffer = new Uint8Array(wasmBytes);
    const mod = await WebAssembly.compile(wasmBuffer);
    const result: Record<ContractSectionName, ContractData> = {
      contractmetav0: {},
      contractenvmetav0: {},
      contractspecv0: {},
      sac: {},
    };

    // Make sure the StellarXdr is available
    await StellarXdr.initialize();

    for (const sectionName of CONTRACT_SECTIONS) {
      const sections = WebAssembly.Module.customSections(mod, sectionName);

      if (sections.length > 0) {
        for (let i = 0; i < sections.length; i++) {
          const sectionData = sectionResult(sectionName, sections[i]);

          if (sectionData) {
            result[sectionName] = sectionData;
          }
        }
      }
    }

    return result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

const sectionResult = (
  sectionName: ContractSectionName,
  section: ArrayBuffer,
) => {
  const sectionData = new Uint8Array(section);
  const sectionXdr = Buffer.from(sectionData).toString("base64");
  const { json, xdr } = getJsonAndXdr(sectionName, sectionXdr);

  return {
    xdr,
    json,
    // TODO: add text format
  };
};

const TYPE_VARIANT: Record<ContractSectionName, string> = {
  contractenvmetav0: "ScEnvMetaEntry",
  contractmetav0: "ScMetaEntry",
  contractspecv0: "ScSpecEntry",
  sac: "SAC",
};

const getJsonAndXdr = (sectionName: ContractSectionName, xdr: string) => {
  try {
    const jsonStringArray = StellarXdr.decode_stream(
      TYPE_VARIANT[sectionName],
      xdr,
    );

    return {
      json: jsonStringArray.map((s) => prettifyJsonString(s)),
      xdr: jsonStringArray.map((s) =>
        StellarXdr.encode(TYPE_VARIANT[sectionName], s),
      ),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return { json: [], xdr: [] };
  }
};
