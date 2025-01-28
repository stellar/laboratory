// https://developers.stellar.org/docs/learn/encyclopedia/contract-development/types/built-in-types#bytes-strings-bytes-bytesn-string
// contract IDs are fixed 32-byte byte arrays, and are represented as BytesN<32>
// A 32 byte binary array is equal to 256 bits (32 * 8)
// To represent 256 bits in base32, we need 52 characters minimum (256/5 - 5 bits per character)
// With additional metadata, we need 56 characters maximum
const CONTRACT_MAX_LENGTH = 56;
const CONTRACT_MIN_LENGTH = 52;

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
