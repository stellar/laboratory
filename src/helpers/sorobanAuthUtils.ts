type SimulationResponse = Record<string, any>;

/**
 * Extracts auth entries from the simulation response.
 * Auth entries live in result.results[].auth[] in the RPC response.
 */
export const extractAuthEntries = (
  responseData: SimulationResponse,
): string[] => {
  const authEntries: string[] = [];
  const results = responseData?.result?.results as
    | Array<{ auth?: string[] }>
    | undefined;

  if (Array.isArray(results)) {
    for (const r of results) {
      if (Array.isArray(r.auth)) {
        authEntries.push(...r.auth);
      }
    }
  }

  return authEntries;
};
