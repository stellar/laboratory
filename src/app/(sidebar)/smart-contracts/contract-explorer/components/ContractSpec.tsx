import { useEffect, useState } from "react";
import { Button, Icon } from "@stellar/design-system";
import { parse, stringify } from "lossless-json";

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
import { STELLAR_ASSET_CONTRACT } from "@/constants/stellarAssetContractData";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import {
  ContractSections,
  ContractSectionName,
  AnyObject,
} from "@/types/types";

export const ContractSpec = ({
  rpcUrl,
  wasmHash,
  isActive,
  isSourceStellarExpert,
  isSacType,
}: {
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
    contractspecv0: "json",
    sac: "json",
  });
  const [contractSections, setContractSections] =
    useState<ContractSections | null>();

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

    getContractData();
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

    return isXdrInit
      ? `${jsonData.map((d) => StellarXdr.encode("ScSpecEntry", stringify(d) || "")).join("\n\n")}`
      : "";
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
          : `// ${sectionName} \n\n${contractSections?.[sectionName].xdr?.join("\n\n")}`;
      case "text":
      default:
        return "";
    }
  };

  const renderSectionCodeEditor = ({
    sectionName,
    title,
    infoLink,
    height,
  }: {
    sectionName: ContractSectionName;
    title: string;
    infoLink: string;
    height?: string;
  }) => (
    <CodeEditor
      title={title}
      value={formatValue(sectionName) || ""}
      selectedLanguage={selectedFormat[sectionName]}
      fileName={`${wasmHash}-${sectionName}`}
      languages={["json", "xdr"]}
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
      {/* Sections */}
      {contractSections?.contractmetav0
        ? renderSectionCodeEditor({
            sectionName: "contractmetav0",
            title: "Contract Meta",
            infoLink:
              "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#contract-meta",
            height: "22",
          })
        : null}

      {contractSections?.contractenvmetav0
        ? renderSectionCodeEditor({
            sectionName: "contractenvmetav0",
            title: "Contract Env Meta",
            infoLink:
              "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#environment-meta",
            height: "15",
          })
        : null}

      {contractSections?.contractspecv0
        ? renderSectionCodeEditor({
            sectionName: "contractspecv0",
            title: "Contract Spec",
            infoLink:
              "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#contract-spec",
          })
        : null}

      {/* Stellar Asset Contract section */}
      {isSacType
        ? renderSectionCodeEditor({
            sectionName: "sac",
            title: "Contract Spec",
            infoLink:
              "https://developers.stellar.org/docs/tokens/stellar-asset-contract",
          })
        : null}

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

      {isSourceStellarExpert ? <PoweredByStellarExpert /> : null}
    </Box>
  );
};
