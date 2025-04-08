import { Code, Loader, Text } from "@stellar/design-system";
import { CodeEditor } from "@/components/CodeEditor";
import { Box } from "@/components/layout/Box";
import { useGitHubReadmeText } from "@/query/useGitHubReadmeText";
import { ErrorText } from "@/components/ErrorText";

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

  return (
    <CodeEditor title="README.md" value={readmeText} selectedLanguage="text" />
  );
};
