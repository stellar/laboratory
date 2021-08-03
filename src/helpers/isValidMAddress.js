export default function isValidMAddress(address = "") {
  return address.startsWith("M") && address.length === 69;
}
