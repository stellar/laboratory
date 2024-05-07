import { xdr, StrKey } from "@stellar/stellar-sdk";

// This function was meant to convert string keys representing muxed accounts
// `M...` to their ED25519 public account `G..` However since SEP23 hasn't been
// rolled out yet, we'll show whatever value we receive without doing any type
// of conversion. Once SEP23 is included in stellar-base, we can update this
// code to show the inner G account of muxed accounts, in the meantime we'll
// just return the same value we receive.
export default function convertMuxedAccountToEd25519Account(muxedAccount) {
  return muxedAccount;
}
