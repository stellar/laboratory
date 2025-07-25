import { useQuery } from "@tanstack/react-query";

/**
 * Fetch a file from a GitHub repo.
 */
export const useGitHubFile = ({
  repo,
  path,
  file,
  isActive,
}: {
  repo: string;
  path: string;
  file: string;
  isActive: boolean;
}) => {
  const query = useQuery<string | null>({
    queryKey: ["useGitHubFile", repo, path, file],
    queryFn: async () => {
      if (!repo || !path || !file) {
        return null;
      }

      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${repo}/${path}/${file}`,
        );

        if (response.status !== 200) {
          return null;
        }

        return await response.text();
      } catch (e: any) {
        throw `Something went wrong fetching file "${file}". ${e.message || e}.`;
      }
    },
    enabled: isActive,
  });

  return query;
};
