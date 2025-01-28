// https://developers.stellar.org/docs/learn/encyclopedia/contract-development/types/built-in-types#bytes-strings-bytes-bytesn-string
// contract IDs are fixed 32-byte byte arrays, and are represented as BytesN<32>
// A 32 byte binary array is equal to 256 bits (32 * 8)
// To represent 256 bits in base32, we need at least 52 characters
const CONTRACT_MIN_LENGTH = 52;

export const getContractIdError = (value: string) => {
  if (value.charAt(0) !== "C") {
    return "The string must start with 'C'.";
  }
  if (value.length < CONTRACT_MIN_LENGTH) {
    return `The string length should be at least ${CONTRACT_MIN_LENGTH} characters long.`;
  }
  // skipping max length check in case it includes metadata

  return false;
};
