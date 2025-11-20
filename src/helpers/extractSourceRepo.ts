export const extractSourceRepo = async (
  wasmBytes: Buffer,
): Promise<string | null> => {
  try {
    const wasmBuffer = new Uint8Array(wasmBytes);
    const mod = await WebAssembly.compile(wasmBuffer);

    // Try different section names that might contain the "source_repo"
    const possibleSections = [
      "contractmetav0",
      "contractenvmetav0",
      "contractspecv0",
      "metadata",
      "custom",
    ];

    const MATCH_PROP = "source_repo";

    // Extract data from all these possible sections
    for (const sectionName of possibleSections) {
      const sections = WebAssembly.Module.customSections(mod, sectionName);

      if (sections.length > 0) {
        for (let i = 0; i < sections.length; i++) {
          // Get section data text
          const sectionData = new Uint8Array(sections[i]);
          const decoder = new TextDecoder();
          const sectionText = decoder.decode(sectionData);

          // Check if this section contains the prop
          if (sectionText.includes(MATCH_PROP)) {
            const regex = /github:[^%\0]+/;
            const match = sectionText.match(regex);
            // Return GitHub name and repo
            return match ? match[0].replace("github:", "") : null;
          }
        }
      }
    }

    return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};
