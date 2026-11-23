import {
  Account,
  Asset,
  encodeMuxedContractAddress,
  MuxedAccount,
  Networks,
} from "@stellar/stellar-sdk";

import { getTransferEvents } from "../../src/helpers/getTransferEvents";
import { RpcTxJsonResponse } from "../../src/types/types";

const FROM = "GBQXC7ZQHOUAM5JBU5YEC7VE2AT3GUQKK5ACH47HM77CDC7QBU5VZEEV";
const ACCOUNT = "GC4NTEZTULYHWOCW6YSLZWAEED6ATRVX2BPKTSWZUKQKUJIMG3SLDMXU";
const CONTRACT = "CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ";
const PASSPHRASE = Networks.TESTNET;
const NATIVE_SAC = Asset.native().contractId(PASSPHRASE);

const transferEvent = (
  to: string,
  data: any,
  contractId: string = NATIVE_SAC,
) => ({
  contract_id: contractId,
  body: {
    v0: {
      topics: [
        { symbol: "transfer" },
        { address: FROM },
        { address: to },
        { string: "native" },
      ],
      data,
    },
  },
});

const txWithEvents = (events: any[]) =>
  ({ events: { contractEventsJson: [events] } }) as RpcTxJsonResponse;

const muxedData = (toMuxedId: any) => ({
  map: [
    { key: { symbol: "amount" }, val: { i128: "1000000" } },
    { key: { symbol: "to_muxed_id" }, val: toMuxedId },
  ],
});

describe("getTransferEvents", () => {
  it("reads a plain transfer with no muxed ID", () => {
    const [event] = getTransferEvents(
      txWithEvents([transferEvent(ACCOUNT, { i128: "250" })]),
      PASSPHRASE,
    );

    expect(event).toEqual({
      addressFrom: FROM,
      addressTo: ACCOUNT,
      amount: "250",
      assetCode: "XLM",
      assetIssuer: "native",
    });
  });

  it("builds an M address for a u64 ID on an account", () => {
    const [event] = getTransferEvents(
      txWithEvents([transferEvent(ACCOUNT, muxedData({ u64: "1" }))]),
      PASSPHRASE,
    );

    expect(event.addressTo).toBe(ACCOUNT);
    expect(event.toMuxedId).toBe("1");
    expect(event.addressToMuxed).toBe(
      new MuxedAccount(new Account(ACCOUNT, "0"), "1").accountId(),
    );
    expect(event.toMemo).toBeUndefined();
    expect(event.amount).toBe("1000000");
  });

  it("builds a W address for a u64 ID on a contract (CAP-84)", () => {
    const [event] = getTransferEvents(
      txWithEvents([transferEvent(CONTRACT, muxedData({ u64: "42" }))]),
      PASSPHRASE,
    );

    expect(event.addressTo).toBe(CONTRACT);
    expect(event.toMuxedId).toBe("42");
    expect(event.addressToMuxed).toBe(
      encodeMuxedContractAddress(CONTRACT, "42"),
    );
  });

  it("keeps a text or bytes ID (from a classic memo) as a memo", () => {
    const [textEvent, bytesEvent] = getTransferEvents(
      txWithEvents([
        transferEvent(ACCOUNT, muxedData({ string: "invoice 7" })),
        transferEvent(ACCOUNT, muxedData({ bytes: "abcd" })),
      ]),
      PASSPHRASE,
    );

    expect(textEvent.toMuxedId).toBeUndefined();
    expect(textEvent.addressToMuxed).toBeUndefined();
    expect(textEvent.toMemo).toBe("invoice 7");
    expect(bytesEvent.toMemo).toBe("abcd");
  });

  it("finds the amount by key, not by map position", () => {
    const [event] = getTransferEvents(
      txWithEvents([
        transferEvent(ACCOUNT, {
          map: [
            { key: { symbol: "to_muxed_id" }, val: { u64: "1" } },
            { key: { symbol: "amount" }, val: { i128: "77" } },
          ],
        }),
      ]),
      PASSPHRASE,
    );

    expect(event.amount).toBe("77");
  });

  it("leaves the asset empty when the emitter is not that asset's SAC", () => {
    const [event] = getTransferEvents(
      txWithEvents([transferEvent(ACCOUNT, { i128: "250" }, CONTRACT)]),
      PASSPHRASE,
    );

    expect(event.assetCode).toBe("");
    expect(event.assetIssuer).toBe("");
    expect(event.amount).toBe("250");
  });
});
