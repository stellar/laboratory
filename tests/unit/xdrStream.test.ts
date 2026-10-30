import { joinXdrStream, normalizeXdrStream } from "@/helpers/xdrStream";

// Contract spec XDR copied from the contract spec page, where each entry was
// base64 encoded separately (note the `=` padding mid-string)
const PASTED_SPEC_XDR = `AAAAAgAAAC1TaW1wbGUgdW5pdC12YXJpYW50IGVudW0sIHVzZWQgYmVoaW5kIE9wdGlvbi4AAAAAAAAAAAAABE1vZGUAAAACAAAAAAAAAAAAAAAERmFzdAAAAAAAAAAAAAAABFNsb3c=AAAAAQAAACRTdHJ1Y3Qgd2l0aCBhIG5lc3RlZCBvcHRpb25hbCBmaWVsZC4AAAAAAAAABkNvbmZpZwAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdmZWVfYnBzAAAAA+gAAAAEAAAAAAAAADRPcHRpb25hbCB2ZWMgYXJnLiBSZXR1cm5zIHRoZSBsZW5ndGgsIG9yIDAgZm9yIE5vbmUuAAAAB3NldF9pZHMAAAAAAQAAAAAAAAADaWRzAAAAA+gAAAPqAAAABAAAAAEAAAAEAAAAAAAAADVPcHRpb25hbCBlbnVtIGFyZy4gUmV0dXJucyB0cnVlIHdoZW4gU29tZSB3YXMgcGFzc2VkLgAAAAAAAAhzZXRfbW9kZQAAAAEAAAAAAAAABG1vZGUAAAPoAAAH0AAAAARNb2RlAAAAAQAAAAE=

AAAAAAAAAEFSZWFkIGJhY2sgd2hhdCB3YXMgc3RvcmVkLCB0byB2ZXJpZnkgTm9uZSB2cyBTb21lIGFmdGVyIGludm9raW5nLgAAAAAAAApnZXRfY29uZmlnAAAAAAAAAAAAAQAAA+gAAAfQAAAABkNvbmZpZwAA

AAAAAAAAAIVSZXF1aXJlZCBzdHJ1Y3QgYXJnIHdpdGggYSBuZXN0ZWQgb3B0aW9uYWwgZmllbGQsIHBsdXMgYSB0b3AtbGV2ZWwKb3B0aW9uYWwgYXJnLiBSZXR1cm5zIHRoZSBjb25maWcgc28gc2ltdWxhdGlvbiBzaG93cyB3aGF0IGFycml2ZWQuAAAAAAAACnNldF9jb25maWcAAAAAAAIAAAAAAAAABmNvbmZpZwAAAAAH0AAAAAZDb25maWcAAAAAAAAAAAAEbm90ZQAAA+gAAAARAAAAAQAAB9AAAAAGQ29uZmlnAAA=AAAAAAAAADVDb25zdHJ1Y3RvciB3aXRoIGEgcmVxdWlyZWQgYW5kIGFuIG9wdGlvbmFsIGFyZ3VtZW50LgAAAAAAAA1fX2NvbnN0cnVjdG9yAAAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdmZWVfYnBzAAAAA+gAAAAEAAAAAA==`;

const toBytes = (base64: string) => [...Buffer.from(base64, "base64")];

describe("joinXdrStream", () => {
  it("concatenates bytes, not base64 strings", () => {
    // [0x00, 0x01] + [0x00, 0x02]
    expect(joinXdrStream(["AAE=", "AAI="])).toBe("AAEAAg==");
  });

  it("returns an empty string for no values", () => {
    expect(joinXdrStream([])).toBe("");
  });
});

describe("normalizeXdrStream", () => {
  it("returns a single base64 value unchanged", () => {
    expect(normalizeXdrStream("AAEAAg==")).toBe("AAEAAg==");
  });

  it("returns input with non-base64 characters unchanged", () => {
    expect(normalizeXdrStream("AAE=-AAI=")).toBe("AAE=-AAI=");
  });

  it("joins values separated by whitespace", () => {
    expect(normalizeXdrStream("AAE=\n\nAAI=")).toBe("AAEAAg==");
  });

  it("joins values glued after padding", () => {
    expect(normalizeXdrStream("AAE=AAI=")).toBe("AAEAAg==");
  });

  it("turns a pasted contract spec into one valid base64 stream", () => {
    const chunks = PASTED_SPEC_XDR.match(/[A-Za-z0-9+/]+={0,2}/g) || [];
    const normalized = normalizeXdrStream(PASTED_SPEC_XDR);

    expect(chunks).toHaveLength(5);
    expect(normalized).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    expect(toBytes(normalized)).toEqual(chunks.flatMap(toBytes));
  });
});
