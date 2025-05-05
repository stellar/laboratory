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
import { useGitHubReadmeText } from "@/query/useGitHubReadmeText";
import { openUrl } from "@/helpers/openUrl";

export const SourceCode = ({
  isActive,
  repo,
  commit,
}: {
  isActive: boolean;
  repo: string;
  commit: string;
}) => {
  const {
    data: readmeText,
    error: readmeTextError,
    isLoading: isReadmeTextLoading,
    isFetching: isReadmeTextFetching,
  } = useGitHubReadmeText({ repo, commit, isActive });

  if (!repo) {
    return (
      <Alert variant="warning" placement="inline">
        <div>
          This contract has no contract build verification configured, therefore
          its Source Code is not available.
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
  );
};
