import { AnyObject } from "@/types/types";

export const parseAttestationPayload = (att: AnyObject) => {
  const payload = att.attestations[0].bundle.dsseEnvelope.payload;

  try {
    return JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
  } catch (e) {
    throw `Error decoding payload: ${e}`;
  }
};
