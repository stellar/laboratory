import {
  Account,
  contract,
  encodeMuxedContractAddress,
  MuxedAccount,
} from "@stellar/stellar-sdk";

import { getAddressError } from "../../src/validate/methods/getAddressError";
import { getMuxedAddressError } from "../../src/validate/methods/getMuxedAddressError";
import { muxedAccount } from "../../src/helpers/muxedAccount";
import { STELLAR_ASSET_CONTRACT_SPEC } from "../../src/constants/stellarAssetContractSpec";

const ACCOUNT = "GDVOT2ALMUF3G54RBHNJUEV6LOAZCQQCARHEVNUPKGMVPWFC4PFN33QR";
const CONTRACT = "CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ";
const MUXED_ACCOUNT = new MuxedAccount(
  new Account(ACCOUNT, "0"),
  "2",
).accountId();
const MUXED_CONTRACT = encodeMuxedContractAddress(CONTRACT, "42");

describe("getAddressError (Soroban Address param)", () => {
  it.each([
    ["a G account", ACCOUNT],
    ["a C contract", CONTRACT],
    ["an empty optional value", ""],
  ])("accepts %s", (_label, value) => {
    expect(getAddressError(value)).toBe(false);
  });

  it.each([
    ["an M muxed account", MUXED_ACCOUNT],
    ["a W muxed contract", MUXED_CONTRACT],
  ])("rejects %s with a muxed-specific message", (_label, value) => {
    expect(getAddressError(value)).toMatch(/Muxed addresses/);
  });

  it("rejects an invalid address", () => {
    expect(getAddressError("GABC")).toBe("Invalid public key or contract ID.");
  });

  it("requires a value when isRequired is set", () => {
    expect(getAddressError("", true)).toBe("Address is required.");
  });
});

describe("getMuxedAddressError (Soroban MuxedAddress param)", () => {
  it.each([
    ["a G account", ACCOUNT],
    ["an M muxed account", MUXED_ACCOUNT],
    ["a C contract", CONTRACT],
    ["a W muxed contract", MUXED_CONTRACT],
    ["an empty optional value", ""],
  ])("accepts %s", (_label, value) => {
    expect(getMuxedAddressError(value)).toBe(false);
  });

  it("rejects an invalid address", () => {
    expect(getMuxedAddressError("WABC")).toMatch(/Invalid address/);
  });

  it("requires a value when isRequired is set", () => {
    expect(getMuxedAddressError("", true)).toBe("Address is required.");
  });
});

describe("muxedAccount", () => {
  it("generates an M address from a G base", () => {
    expect(
      muxedAccount.generate({ baseAddress: ACCOUNT, muxedAccountId: "2" }),
    ).toEqual({
      muxedAddress: MUXED_ACCOUNT,
      baseAddress: ACCOUNT,
      id: "2",
      error: "",
    });
  });

  it("generates a W address from a C base", () => {
    expect(
      muxedAccount.generate({ baseAddress: CONTRACT, muxedAccountId: "42" }),
    ).toEqual({
      muxedAddress: MUXED_CONTRACT,
      baseAddress: CONTRACT,
      id: "42",
      error: "",
    });
  });

  it("returns an error for a non-decimal ID", () => {
    const result = muxedAccount.generate({
      baseAddress: CONTRACT,
      muxedAccountId: "0x10",
    });

    expect(result.muxedAddress).toBe("");
    expect(result.error).toMatch(/^Something went wrong/);
  });

  it("parses an M address", () => {
    expect(muxedAccount.parse({ muxedAddress: MUXED_ACCOUNT })).toEqual({
      muxedAddress: MUXED_ACCOUNT,
      baseAddress: ACCOUNT,
      id: "2",
      error: "",
    });
  });

  it("parses a W address", () => {
    expect(muxedAccount.parse({ muxedAddress: MUXED_CONTRACT })).toEqual({
      muxedAddress: MUXED_CONTRACT,
      baseAddress: CONTRACT,
      id: "42",
      error: "",
    });
  });

  it("parses the max uint64 ID of a W address", () => {
    const maxId = "18446744073709551615";

    expect(
      muxedAccount.parse({
        muxedAddress: encodeMuxedContractAddress(CONTRACT, maxId),
      }).id,
    ).toBe(maxId);
  });
});

describe("STELLAR_ASSET_CONTRACT_SPEC", () => {
  const spec = new contract.Spec(STELLAR_ASSET_CONTRACT_SPEC);
  const inputTypes = (fnName: string) =>
    spec.getFunc(fnName).inputs.map((input) => input.type.type);

  it("types the `to` input of `transfer` as a MuxedAddress", () => {
    expect(inputTypes("transfer")).toEqual([
      "scSpecTypeAddress",
      "scSpecTypeMuxedAddress",
      "scSpecTypeI128",
    ]);
  });

  it("types the `to` input of `transfer_from` and `mint` as an Address", () => {
    expect(inputTypes("transfer_from")).toEqual([
      "scSpecTypeAddress",
      "scSpecTypeAddress",
      "scSpecTypeAddress",
      "scSpecTypeI128",
    ]);
    expect(inputTypes("mint")).toEqual(["scSpecTypeAddress", "scSpecTypeI128"]);
  });
});
