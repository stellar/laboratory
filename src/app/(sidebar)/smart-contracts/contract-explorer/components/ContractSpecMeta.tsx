"use client";

import { useEffect, useState } from "react";
import { Button, Icon } from "@stellar/design-system";
import { parse, stringify } from "lossless-json";
import { parseContractMetadata } from "@stellar-expert/contract-wasm-interface-parser";

import { CodeEditor, SupportedLanguage } from "@/components/CodeEditor";
import { Box } from "@/components/layout/Box";
import { WithInfoText } from "@/components/WithInfoText";
import { PoweredByStellarExpert } from "@/components/PoweredByStellarExpert";

import { useWasmBinaryFromRpc } from "@/query/useWasmBinaryFromRpc";
import { useGitHubFile } from "@/query/useGitHubFile";

import * as StellarXdr from "@/helpers/StellarXdr";
import { downloadFile } from "@/helpers/downloadFile";
import { renderContractSpecViewStatus } from "@/helpers/renderContractSpecViewStatus";
import { getWasmContractData } from "@/helpers/getWasmContractData";
import { formatContractInterface } from "@/helpers/formatContractInterface";

import { STELLAR_ASSET_CONTRACT } from "@/constants/stellarAssetContractData";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import {
  ContractSections,
  ContractSectionName,
  AnyObject,
} from "@/types/types";

export const ContractSpecMeta = ({
  sectionsToShow,
  rpcUrl,
  wasmHash,
  isActive,
  isSourceStellarExpert,
  isSacType,
}: {
  sectionsToShow: ContractSectionName[];
  rpcUrl: string;
  wasmHash: string;
  isActive: boolean;
  isSourceStellarExpert: boolean;
  isSacType?: boolean;
}) => {
  const [selectedFormat, setSelectedFormat] = useState<
    Record<ContractSectionName, SupportedLanguage>
  >({
    contractenvmetav0: "json",
    contractmetav0: "json",
    contractspecv0: "interface",
    sac: "json",
  });
  const [contractSections, setContractSections] =
    useState<ContractSections | null>();
  const [contractInterfaceObj, setContractInterfaceObj] =
    useState<AnyObject | null>(null);

  const isXdrInit = useIsXdrInit();

  const {
    data: wasmBinary,
    error: wasmBinaryError,
    isLoading: isWasmBinaryLoading,
    isFetching: isWasmBinaryFetching,
  } = useWasmBinaryFromRpc({
    wasmHash,
    rpcUrl,
    isActive,
  });

  const {
    data: sacData,
    error: sacDataError,
    isFetching: isSacDataFetching,
    isLoading: isSacDataLoading,
  } = useGitHubFile({
    repo: STELLAR_ASSET_CONTRACT.contractSpecRepo,
    path: STELLAR_ASSET_CONTRACT.contractSpecPath,
    file: `${STELLAR_ASSET_CONTRACT.contractSpecFileName}.json`,
    isActive: Boolean(isActive && isSacType),
  });

  useEffect(() => {
    const getContractData = async () => {
      if (wasmBinary) {
        const data = await getWasmContractData(wasmBinary);
        setContractSections(data);
      }
    };

    const parseContractMeta = () => {
      try {
        const parsedContractMeta = parseContractMetadata(wasmBinary);
        setContractInterfaceObj(parsedContractMeta);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Do nothing
      }
    };

    getContractData();
    parseContractMeta();
  }, [wasmBinary]);

  const viewStatus = renderContractSpecViewStatus({
    wasmHash,
    rpcUrl,
    isLoading:
      isWasmBinaryLoading ||
      isWasmBinaryFetching ||
      isSacDataLoading ||
      isSacDataFetching ||
      (isSacType === false && !contractSections),
    error: wasmBinaryError || sacDataError,
    isSacType: Boolean(isSacType),
  });

  if (viewStatus) {
    return viewStatus;
  }

  const formatSacData = (
    dataString: string | null | undefined,
    type: "json" | "xdr",
  ) => {
    if (!dataString) {
      return "";
    }

    const jsonData = parse(dataString) as AnyObject[];

    if (type === "json") {
      return `${jsonData.map((d) => stringify(d, null, 2)).join(",\n\n")}`;
    }

    if (!isXdrInit) {
      return "";
    }

    // Encode each entry to XDR bytes, concatenate them, then base64 encode the result
    const xdrBuffers = jsonData.map((d) => {
      const base64 = StellarXdr.encode("ScSpecEntry", stringify(d) || "");
      // Decode base64 to bytes using browser-compatible atob
      const binaryString = atob(base64);
      const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
      return bytes;
    });

    // Concatenate all byte arrays
    const totalLength = xdrBuffers.reduce((acc, arr) => acc + arr.length, 0);
    const combinedBytes = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of xdrBuffers) {
      combinedBytes.set(buffer, offset);
      offset += buffer.length;
    }

    // Encode as base64 using browser-compatible btoa
    const binaryString = Array.from(
      combinedBytes,
      (byte) => String.fromCharCode(byte),
    ).join("");
    return btoa(binaryString);
  };

  const formatInterface = (obj: AnyObject | null) => {
    if (!obj) {
      return "";
    }

    try {
      return formatContractInterface(obj);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return "";
    }
  };

  const formatValue = (sectionName: ContractSectionName) => {
    switch (selectedFormat[sectionName]) {
      case "json":
        return isSacType
          ? formatSacData(sacData, "json")
          : // Adding the first line as a comment with a section name. For example:
            // // contractspecv0
            `// ${sectionName} \n\n${contractSections?.[sectionName].json?.join(",\n\n")}`;
      case "xdr":
        return isSacType
          ? formatSacData(sacData, "xdr")
          : // Use the raw XDR stream instead of individual entries
            `// ${sectionName} \n\n${contractSections?.[sectionName].xdrStream || ""}`;
      case "interface":
        return isSacType
          ? // We can’t get interface for SAC because there is no Wasm file to parse
            null
          : formatInterface(contractInterfaceObj);
      case "text":
      default:
        return "";
    }
  };

  const renderSectionCodeEditor = ({
    sectionName,
    title,
    infoLink,
    languages = ["json", "xdr"],
    height,
  }: {
    sectionName: ContractSectionName;
    title: string;
    infoLink: string;
    languages?: SupportedLanguage[];
    height?: string;
  }) => (
    <CodeEditor
      title={title}
      value={formatValue(sectionName) || ""}
      selectedLanguage={selectedFormat[sectionName]}
      fileName={`${wasmHash}-${sectionName}`}
      languages={languages}
      onLanguageChange={(newLanguage) => {
        setSelectedFormat({
          ...selectedFormat,
          [sectionName]: newLanguage,
        });
      }}
      infoLink={infoLink}
      heightInRem={height}
    />
  );

  return (
    <Box gap="lg">
      {/* Download Wasm button */}
      {!isSacType ? (
        <Box gap="xs" direction="column" align="end">
          <WithInfoText href="https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/contracts#wasm">
            <Button
              variant="tertiary"
              size="sm"
              icon={<Icon.Download01 />}
              iconPosition="left"
              disabled={!wasmBinary}
              onClick={(e) => {
                e.preventDefault();

                if (wasmBinary) {
                  downloadFile({
                    value: wasmBinary,
                    fileType: "application/octet-stream",
                    fileName: wasmHash,
                    fileExtension: "wasm",
                  });
                }
              }}
              isLoading={isWasmBinaryLoading || isWasmBinaryFetching}
            >
              Download Wasm
            </Button>
          </WithInfoText>
        </Box>
      ) : null}

      {/* Sections */}
      {sectionsToShow.includes("contractmetav0") &&
      contractSections?.contractmetav0
        ? renderSectionCodeEditor({
            sectionName: "contractmetav0",
            title: "Contract meta",
            infoLink:
              "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#contract-meta",
            height: "22",
          })
        : null}

      {sectionsToShow.includes("contractenvmetav0") &&
      contractSections?.contractenvmetav0
        ? renderSectionCodeEditor({
            sectionName: "contractenvmetav0",
            title: "Contract Env meta",
            infoLink:
              "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#environment-meta",
            height: "15",
          })
        : null}

      {sectionsToShow.includes("contractspecv0") &&
      contractSections?.contractspecv0
        ? renderSectionCodeEditor({
            sectionName: "contractspecv0",
            title: "Contract spec",
            infoLink:
              "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#contract-spec",
            languages: ["interface", "json", "xdr"],
            height: "60",
          })
        : null}

      {/* Stellar Asset Contract section */}
      {sectionsToShow.includes("sac") && isSacType
        ? renderSectionCodeEditor({
            sectionName: "sac",
            title: "Contract spec",
            infoLink:
              "https://developers.stellar.org/docs/tokens/stellar-asset-contract",
          })
        : null}

      {isSourceStellarExpert ? <PoweredByStellarExpert /> : null}
    </Box>
  );
};
