import { Alert, Link, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { WasmData } from "@/types/types";

export const BuildInfo = ({
  wasmData,
  isActive,
}: {
  wasmData: WasmData | null | undefined;
  isActive: boolean;
}) => {
  if (!isActive) {
    return null;
  }

  if (!wasmData) {
    return (
      <Alert variant="warning" placement="inline">
        <div>
          This contract has no contract build verification configured, therefore
          its Build Info is not available.
        </div>

        <div>
          Verifying your contract’s build helps others understand and trust what
          it does, and improves transparency across the Stellar ecosystem. To
          verify, follow the{" "}
          <Link href="https://stellar.expert/explorer/public/contract/validation">
            setup instructions on Stellar Expert
          </Link>
          . You can also learn more about{" "}
          <Link href="https://github.com/stellar/stellar-protocol/discussions/1573">
            Contract Source Validation SEP
          </Link>
          .
        </div>
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
