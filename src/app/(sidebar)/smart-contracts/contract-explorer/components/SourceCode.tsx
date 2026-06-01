import {
  Alert,
  Code,
  Link,
  Loader,
  Select,
  Text,
} from "@stellar/design-system";

import { CodeEditor } from "@/components/CodeEditor";
import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";
import { PoweredByStellarExpert } from "@/components/PoweredByStellarExpert";

import { useGitHubReadmeText } from "@/query/useGitHubReadmeText";
import { openUrl } from "@/helpers/openUrl";
import { NoInfoLoadedView } from "@/components/NoInfoLoadedView";

export const SourceCode = ({
  isActive,
  repo,
  commit,
  isSourceStellarExpert,
}: {
  isActive: boolean;
  repo: string;
  commit: string;
  isSourceStellarExpert: boolean;
}) => {
  const {
    data: readmeText,
    error: readmeTextError,
    isLoading: isReadmeTextLoading,
    isFetching: isReadmeTextFetching,
  } = useGitHubReadmeText({ repo, commit, isActive });

  if (!repo) {
    return (
      <NoInfoLoadedView
        message={
          <Box gap="sm" justify="center" align="center">
            <Text size="sm" weight="medium" as="div">
              No source code available
            </Text>
            <Text size="sm" weight="regular" as="div">
              This contract has not been build verified, so its source code is
              unavailable.
            </Text>
          </Box>
        }
      />
    );
  }

  if (isReadmeTextLoading || isReadmeTextFetching) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  if (readmeTextError) {
    return <ErrorText errorMessage={readmeTextError.toString()} size="sm" />;
  }

  if (!readmeText) {
    return (
      <Text as="div" size="sm">
        Couldn’t find <Code size="sm">README.md</Code> in this repository.
      </Text>
    );
  }

  type ContainerResource = "devcontainer" | "codeanywhere" | "github";

  const handleOpenInContainer = (resource: ContainerResource) => {
    if (!resource) {
      return;
    }

    let url = "";

    switch (resource) {
      case "devcontainer":
        url = `https://github.com/codespaces/new/${repo}/tree/${commit}`;
        break;
      case "codeanywhere":
        url = `https://app.codeanywhere.com/#https://github.com/${repo}/commit/${commit}`;
        break;
      case "github":
        url = `https://github.com/${repo}/tree/${commit}`;
        break;
      default:
      // Do nothing
    }

    if (!url) {
      return;
    }

    openUrl(url);
  };

  return (
    <Box gap="lg">
      <CodeEditor
        title="README.md"
        value={readmeText}
        selectedLanguage="text"
        customEl={
          <Select
            id="source-code-viewer"
            fieldSize="sm"
            onChange={(e) => {
              handleOpenInContainer(e.target.value as ContainerResource);
            }}
            value=""
          >
            <option value="" disabled={true}>
              Open in
            </option>
            <option value="devcontainer">Dev Container</option>
            <option value="codeanywhere">Codeanywhere</option>
            <option value="github">GitHub</option>
          </Select>
        }
      />

      {isSourceStellarExpert ? (
        <>
          <Alert variant="primary" placement="inline">
            Please note that the source code provided is from the{" "}
            <Link href="https://stellar.expert">Stellar.Expert</Link> API and
            not from contract build verification. This contract has no build
            verification configured. As such, it may not reflect the contract
            deployed on-chain.
          </Alert>

          <PoweredByStellarExpert />
        </>
      ) : null}
    </Box>
  );
};
