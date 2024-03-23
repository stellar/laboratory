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
    try {
      const muxedAccount = new MuxedAccount(
        new Account(baseAddress, "0"),
        muxedAccountId,
      );
      return {
        muxedAddress: muxedAccount.accountId(),
        errorMessage: "",
      };
    } catch (e: any) {
      return {
        muxedAddress: "",
        errorMessage: `Something went wrong. ${e.toString()}`,
      };
    }
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
        errorMessage: "",
      };
    } catch (e: any) {
      return {
        id: "",
        baseAddress: "",
        errorMessage: `Something went wrong. ${e.toString()}`,
      };
    }
  },
};
