import { MuxedAccountFieldType } from "@/types/types";

import {
  Account,
  Address,
  encodeMuxedContractAddress,
  extractBaseAddress,
  MuxedAccount,
  StrKey,
  xdr,
} from "@stellar/stellar-sdk";

// Splits a CAP-84 muxed contract (W...) address into its base contract (C...)
// and ID
const parseMuxedContract = (muxedAddress: string) => {
  const { muxedContract } = xdr.expectUnionVariant(
    Address.fromString(muxedAddress).toScAddress(),
    "scAddressTypeMuxedContract",
  );

  return {
    baseAddress: extractBaseAddress(muxedAddress),
    id: muxedContract.id.toString(),
  };
};

export const muxedAccount = {
  generate: ({
    baseAddress,
    muxedAccountId,
  }: {
    baseAddress: string;
    muxedAccountId: string;
  }): Partial<MuxedAccountFieldType> => {
    let muxedAddress = "";
    let muxedBaseAddress = "";
    let muxedId = "";
    let error = "";

    try {
      // A C... base address makes a muxed contract (W...) address
      if (StrKey.isValidContract(baseAddress)) {
        muxedAddress = encodeMuxedContractAddress(baseAddress, muxedAccountId);

        const muxedContract = parseMuxedContract(muxedAddress);
        muxedBaseAddress = muxedContract.baseAddress;
        muxedId = muxedContract.id;
      } else {
        const muxedAccount = new MuxedAccount(
          new Account(baseAddress, "0"),
          muxedAccountId,
        );

        muxedAddress = muxedAccount.accountId();
        muxedBaseAddress = muxedAccount.baseAccount().accountId();
        muxedId = muxedAccount.id();
      }
    } catch (e: any) {
      error = `Something went wrong. ${e.toString()}`;
    }

    return { muxedAddress, baseAddress: muxedBaseAddress, id: muxedId, error };
  },
  parse: ({
    muxedAddress,
  }: {
    muxedAddress: string;
  }): Partial<MuxedAccountFieldType> => {
    let muxedAddressParsed = "";
    let baseAddress = "";
    let muxedAccountId = "";
    let error = "";

    try {
      if (StrKey.isValidMuxedContract(muxedAddress)) {
        const muxedContract = parseMuxedContract(muxedAddress);
        muxedAddressParsed = muxedAddress;
        baseAddress = muxedContract.baseAddress;
        muxedAccountId = muxedContract.id;
      } else {
        const muxedAccount = MuxedAccount.fromAddress(muxedAddress, "0");
        muxedAddressParsed = muxedAccount.accountId();
        baseAddress = muxedAccount.baseAccount().accountId();
        muxedAccountId = muxedAccount.id();
      }

      if (!baseAddress) {
        throw new Error("Base account for this muxed account was not found.");
      }

      if (!muxedAccountId) {
        throw new Error(
          "Muxed account ID for this muxed account was not found.",
        );
      }
    } catch (e: any) {
      error = `Something went wrong. ${e.toString()}`;
    }
    return {
      muxedAddress: muxedAddressParsed,
      baseAddress,
      id: muxedAccountId,
      error,
    };
  },
};
