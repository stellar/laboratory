import { useQuery } from "@tanstack/react-query";

/**
 * Fetch readme file from a GitHub repo.
 */
export const useGitHubReadmeText = ({
  repo,
  commit,
  isActive,
}: {
  repo: string;
  commit: string;
  isActive: boolean;
}) => {
  const query = useQuery<string | null>({
    queryKey: ["useGitHubReadmeText", repo, commit],
    queryFn: async () => {
      if (!repo || !commit) {
        return null;
      }

      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${repo}/${commit}/README.md`,
        );

        if (response.status !== 200) {
          return null;
        }

        return await response.text();
      } catch (e: any) {
        throw `Something went wrong fetching README file. ${e.message || e}.`;
      }
    },
    enabled: isActive,
  });

  return query;
};
