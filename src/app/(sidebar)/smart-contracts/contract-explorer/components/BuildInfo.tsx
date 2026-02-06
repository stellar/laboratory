import { Alert, Card, Link, Text } from "@stellar/design-system";
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
      <Box gap="lg">
        <Alert variant="warning" placement="inline">
          <div>
            This contract has no contract build verification configured,
            therefore its Build Info is not available.
          </div>

          <div>
            Verifying your contract’s build helps others understand and trust
            what it does, and improves transparency across the Stellar
            ecosystem. To verify, follow the setup instruction in the{" "}
            <Link href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md">
              Contract Build Verification SEP-55
            </Link>
            .
          </div>
        </Alert>

        <Card>
          <Box gap="lg" addlClassName="BuildInfoInstructions">
            <Text as="h3" size="md" weight="medium">
              Workflow setup and configuration
            </Text>

            <Box gap="xl" addlClassName="BuildInfoInstructions__details">
              <Box gap="md">
                <Text as="h4" size="sm" weight="medium">
                  Prerequisites
                </Text>

                <ul>
                  <li>
                    Create a GitHub Actions workflow file{" "}
                    <code>.github/workflows/release.yml</code> in your
                    repository.
                  </li>
                  <li>
                    Decide how the compilation workflow will be triggered. The
                    recommended way is to configure workflow activation on git
                    tag creation. This should simplify versioning and ensure
                    unique release names.
                  </li>
                </ul>
              </Box>

              <Box gap="md">
                <Text as="h4" size="sm" weight="medium">
                  Workflow permissions
                </Text>

                <Text as="div" size="sm">
                  In order to create a release, the workflow needs{" "}
                  <code>id-token: write</code>, <code>contents: write</code> and{" "}
                  <code>attestations: write</code> permissions. Default workflow
                  permissions for a repository can be found at{" "}
                  {'"Settings" -> "Actions" -> "Workflow permissions"'}.{" "}
                  {`It’s `}
                  important to specify permissions on the top level in the
                  workflow file itself:
                </Text>

                <pre>
                  {`permissions:
  id-token: write
  contents: write
  attestations: write`}
                </pre>
              </Box>

              <Text as="div" size="sm">
                For more information,{" "}
                <Link href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md#example-basic-workflow-using-stellar-cli">
                  see a basic workflow setup using the Stellar CLI
                </Link>
                .
              </Text>
            </Box>
          </Box>
        </Card>
      </Box>
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
