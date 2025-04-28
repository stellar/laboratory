import { useEffect, useState } from "react";
import { Button, Icon } from "@stellar/design-system";

import { CodeEditor, SupportedLanguage } from "@/components/CodeEditor";
import { Box } from "@/components/layout/Box";
import { WithInfoText } from "@/components/WithInfoText";

import { useWasmBinaryFromRpc } from "@/query/useWasmBinaryFromRpc";

import { downloadFile } from "@/helpers/downloadFile";
import { renderWasmStatus } from "@/helpers/renderWasmStatus";
import { getWasmContractData } from "@/helpers/getWasmContractData";

import { ContractSections, ContractSectionName } from "@/types/types";

export const ContractSpec = ({
  rpcUrl,
  wasmHash,
  isActive,
}: {
  rpcUrl: string;
  wasmHash: string;
  isActive: boolean;
}) => {
  const [selectedFormat, setSelectedFormat] = useState<
    Record<ContractSectionName, SupportedLanguage>
  >({
    contractenvmetav0: "json",
    contractmetav0: "json",
    contractspecv0: "json",
  });
  const [contractSections, setContractSections] =
    useState<ContractSections | null>();

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

  useEffect(() => {
    const getContractData = async () => {
      if (wasmBinary) {
        const data = await getWasmContractData(wasmBinary);
        setContractSections(data);
      }
    };

    getContractData();
  }, [wasmBinary]);

  const wasmStatus = renderWasmStatus({
    wasmHash,
    rpcUrl,
    isLoading: isWasmBinaryLoading || isWasmBinaryFetching || !contractSections,
    error: wasmBinaryError,
  });

  if (wasmStatus) {
    return wasmStatus;
  }

  const formatValue = (sectionName: ContractSectionName) => {
    // Adding the first line as a comment with a section name. For example:
    // // contractspecv0
    switch (selectedFormat[sectionName]) {
      case "json":
        return `// ${sectionName} \n\n${contractSections?.[sectionName].json?.join(",\n\n")}`;
      case "xdr":
        return `// ${sectionName} \n\n${contractSections?.[sectionName].xdr?.join("\n\n")}`;
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
              "https://developers.stellar.org/docs/learn/encyclopedia/contract-development/stellar-contract#contract-meta",
            height: "22",
          })
        : null}

      {contractSections?.contractenvmetav0
        ? renderSectionCodeEditor({
            sectionName: "contractenvmetav0",
            title: "Contract Env Meta",
            infoLink:
              "https://developers.stellar.org/docs/learn/encyclopedia/contract-development/stellar-contract#environment-meta",
            height: "15",
          })
        : null}

      {contractSections?.contractspecv0
        ? renderSectionCodeEditor({
            sectionName: "contractspecv0",
            title: "Contract Spec",
            infoLink:
              "https://developers.stellar.org/docs/learn/encyclopedia/contract-development/stellar-contract#contract-spec",
          })
        : null}

      {/* Download Wasm button */}
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
    </Box>
  );
};
