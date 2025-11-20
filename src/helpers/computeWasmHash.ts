export const computeWasmHash = async (
  wasmBuffer: ArrayBuffer | Uint8Array,
): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", wasmBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
