// contract IDs are fixed 32-byte byte arrays, and are represented as BytesN<32>
// https://developers.stellar.org/docs/learn/encyclopedia/contract-development/types/built-in-types#bytes-strings-bytes-bytesn-string
const CONTRACT_MAX_LENGTH = 66;
const CONTRACT_MIN_LENGTH = 32;

export const getContractIdError = (value: string) => {
  if (value.charAt(0) !== "C") {
    return "The string must start with 'C'.";
  } else if (value.length > CONTRACT_MAX_LENGTH) {
    return `The string length is too large.`;
  } else if (value.length < CONTRACT_MIN_LENGTH) {
    return `The string length should be at least ${CONTRACT_MIN_LENGTH} characters long.`;
  }

  return false;
};
