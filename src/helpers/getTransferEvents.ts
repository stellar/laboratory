import { muxedAccount } from "@/helpers/muxedAccount";

import { RpcTxJsonResponse } from "@/types/types";

export type TransferEvent = {
  addressFrom: string;
  addressTo: string;
  // u64 `to_muxed_id` and the M... or W... recipient it makes with
  // `addressTo` (CAP-67, CAP-84)
  toMuxedId?: string;
  addressToMuxed?: string;
  // Text or bytes `to_muxed_id`, mapped from a classic transaction memo
  toMemo?: string;
  amount: string;
  assetCode: string;
  assetIssuer: string;
};

const getMapValue = (data: any, key: string) =>
  data?.map?.find((entry: any) => entry?.key?.symbol === key)?.val;

/**
 * Reads the recipient's muxed ID from a transfer event's data. A u64 ID is
 * combined with the base `to` address into an M... (account) or W...
 * (contract) address. A text or bytes ID only comes from a classic memo, so
 * it's returned as a memo.
 *
 * @param data - Transfer event data as XDR-JSON
 * @param addressTo - Base `to` address from the event topics
 * @returns The muxed ID and recipient address, or memo, if any
 */
const getMuxedRecipient = (
  data: any,
  addressTo: string,
): Pick<TransferEvent, "toMuxedId" | "addressToMuxed" | "toMemo"> => {
  const toMuxedId = getMapValue(data, "to_muxed_id");

  if (toMuxedId?.u64 !== undefined) {
    const id = String(toMuxedId.u64);
    const { muxedAddress, error } = muxedAccount.generate({
      baseAddress: addressTo,
      muxedAccountId: id,
    });

    return {
      toMuxedId: id,
      ...(muxedAddress && !error ? { addressToMuxed: muxedAddress } : {}),
    };
  }

  const memo = toMuxedId?.string ?? toMuxedId?.bytes;

  return memo !== undefined ? { toMemo: String(memo) } : {};
};

/**
 * Gets token transfer events from a transaction's contract events, including
 * the recipient's muxed ID (`to_muxed_id`) when there is one.
 *
 * @param data - RPC `getTransaction` response as XDR-JSON
 * @returns One entry per `transfer` event
 */
export const getTransferEvents = (
  data: RpcTxJsonResponse | null | undefined,
): TransferEvent[] => {
  const events = data?.events?.contractEventsJson;

  if (!events) {
    return [];
  }

  const contractEvents = Array.isArray(events[0])
    ? events.flatMap((group: any[]) => group)
    : events;

  return contractEvents
    .filter((event: any) => event?.body?.v0?.topics?.[0]?.symbol === "transfer")
    .map((ev: any) => {
      const addressFrom = ev.body.v0.topics[1].address;
      const addressTo = ev.body.v0.topics[2].address;
      const data = ev.body.v0.data;

      const token = ev.body.v0.topics?.[3]?.string;

      let assetCode = "";
      let assetIssuer = "";

      if (token) {
        [assetCode, assetIssuer] = token.split(":");
      }

      return {
        addressFrom,
        addressTo,
        ...getMuxedRecipient(data, addressTo),
        // Transfer event data type https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md#transfer-event
        amount:
          getMapValue(data, "amount")?.i128 ||
          data?.i128 ||
          data?.amount ||
          "0",
        assetCode: assetCode === "native" ? "XLM" : assetCode,
        assetIssuer: assetCode === "native" ? "native" : assetIssuer,
      };
    });
};
