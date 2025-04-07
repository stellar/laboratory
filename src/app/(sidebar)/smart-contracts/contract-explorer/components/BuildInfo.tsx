import { Alert, Link, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { renderWasmStatus } from "@/helpers/renderWasmStatus";
import { useWasmGitHubAttestation } from "@/query/useWasmGitHubAttestation";
import { useStore } from "@/store/useStore";

export const BuildInfo = ({
  wasmHash,
  sourceCodeLink,
  rpcUrl,
  isActive,
}: {
  wasmHash: string;
  sourceCodeLink: string;
  rpcUrl: string;
  isActive: boolean;
}) => {
  const { network } = useStore();

  const {
    data: wasmData,
    error: wasmError,
    isLoading: isWasmLoading,
    isFetching: isWasmFetching,
  } = useWasmGitHubAttestation({
    wasmHash,
    sourceCodeLink,
    rpcUrl,
    isActive: Boolean(isActive && rpcUrl && wasmHash),
    headers: getNetworkHeaders(network, "rpc"),
  });

  const wasmStatus = renderWasmStatus({
    wasmHash,
    rpcUrl,
    isLoading: isWasmFetching || isWasmLoading,
    error: wasmError,
  });

  if (wasmStatus) {
    return wasmStatus;
  }

  if (!wasmData) {
    return (
      <Alert variant="warning" placement="inline">
        We couldn’t get the validation info for this smart contract. You can
        learn more about the Contract Source Validation SEP{" "}
        <Link href="https://github.com/stellar/stellar-protocol/discussions/1573">
          here
        </Link>
        .
      </Alert>
    );
  }

  const renderLink = (url: string, text: string) => {
    if (!url || !text) {
      return null;
    }

    return <Link href={url}>{text}</Link>;
  };

  return (
    <Box gap="lg">
      <Text as="div" size="sm">
        This table contains information about the contract build. With the
        following information, you can verify the build that generated this
        smart contract.
      </Text>

      <div className="BuildInfo__data">
        <div className="BuildInfo__data__title">Build</div>

        <div className="BuildInfo__data__item">
          <div>Attestation</div>
          <div>
            {renderLink(
              wasmData.build.attestationUrl,
              wasmData.build.attestation,
            )}
          </div>
        </div>

        <div className="BuildInfo__data__item">
          <div>Commit</div>
          <div>
            {renderLink(wasmData.build.commitUrl, wasmData.build.commit)}
          </div>
        </div>

        <div className="BuildInfo__data__item">
          <div>Build Summary</div>
          <div>
            {renderLink(wasmData.build.summaryUrl, wasmData.build.summary)}
          </div>
        </div>

        <div className="BuildInfo__data__item">
          <div>Workflow File</div>
          <div>
            {renderLink(
              wasmData.build.workflowFileUrl,
              wasmData.build.workflowFile,
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};
