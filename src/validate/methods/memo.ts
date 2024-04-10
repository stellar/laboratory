import { capitalizeString } from "@/helpers/capitalizeString";
import { MemoType, MemoValue, xdr } from "@stellar/stellar-sdk";

export const memo = ({ type, value }: { type: MemoType; value: MemoValue }) => {
  switch (type) {
    case "text":
      // eslint-disable-next-line no-case-declarations
      const memoTextBytes = Buffer.byteLength(value as string, "utf8");

      if (memoTextBytes > 28) {
        return `Memo Text accepts a string of up to 28 bytes. ${memoTextBytes} bytes entered.`;
      }

      return false;
    case "id":
      if (!value?.toString().match(/^[0-9]*$/g) || Number(value) < 0) {
        return "Memo ID accepts a positive integer.";
      }

      // Checking UnsignedHyper
      if (value !== xdr.Uint64.fromString(value as string).toString()) {
        return `Memo ID is an unsigned 64-bit integer and the max valid
              value is 18446744073709551615`;
      }

      return false;
    case "hash":
    case "return":
      if (!value?.toString().match(/^[0-9a-f]{64}$/gi)) {
        return `Memo ${capitalizeString(type)} accepts a 32-byte hash in hexadecimal format (64 characters).`;
      }

      return false;
    default:
      return false;
  }
};
