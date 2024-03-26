import { MuxedAccountFieldType } from "@/types/types";

import { Account, MuxedAccount } from "stellar-sdk";

export const muxedAccount = {
  generate: ({
    baseAddress,
    muxedAccountId,
  }: {
    baseAddress: string;
    muxedAccountId: string;
  }): Partial<MuxedAccountFieldType> => {
    let muxedAddress = "";
    let error = "";
    
    try {
      const muxedAccount = new MuxedAccount(
        new Account(baseAddress, "0"),
        muxedAccountId,
      );
      
      muxedAddress = muxedAccount.accountId();
    } catch (e: any) {
      error = `Something went wrong. ${e.toString()}`;
    }
    
    return { muxedAddress, error }
  },
  parse: ({
    muxedAddress,
  }: {
    muxedAddress: string;
  }): Partial<MuxedAccountFieldType> => {
    try {
      const muxedAccount = MuxedAccount.fromAddress(muxedAddress, "0");
      const baseAddress = muxedAccount.baseAccount().accountId();
      const muxedAccountId = muxedAccount.id();

      if (!baseAddress) {
        throw new Error("Base account for this muxed account was not found.");
      }

      if (!muxedAccountId) {
        throw new Error(
          "Muxed account ID for this muxed account was not found.",
        );
      }

      return {
        id: muxedAccountId,
        baseAddress,
        error: "",
      };
    } catch (e: any) {
      return {
        id: "",
        baseAddress: "",
        error: `Something went wrong. ${e.toString()}`,
      };
    }
  },
};
