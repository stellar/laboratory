import { getAllSigsMessage } from "../../src/helpers/getAllSigsMessage";

describe("getAllSigsMessage", () => {
  it("returns an empty string when no signatures were added", () => {
    expect(
      getAllSigsMessage({
        secretKey: 0,
        extensionWallet: 0,
        hardwareWallet: 0,
        signature: 0,
      }),
    ).toBe("");
  });

  it("uses the singular form for a single signature", () => {
    expect(
      getAllSigsMessage({
        secretKey: 1,
        extensionWallet: 0,
        hardwareWallet: 0,
        signature: 0,
      }),
    ).toBe("1 secret key signature added");
  });

  it("uses the plural form for multiple signatures", () => {
    expect(
      getAllSigsMessage({
        secretKey: 2,
        extensionWallet: 0,
        hardwareWallet: 0,
        signature: 0,
      }),
    ).toBe("2 secret key signatures added");
  });

  it("labels hardware wallet signatures", () => {
    expect(
      getAllSigsMessage({
        secretKey: 0,
        extensionWallet: 0,
        hardwareWallet: 3,
        signature: 0,
      }),
    ).toBe("3 hardware wallet signatures added");
  });

  it("labels extension wallet signatures", () => {
    expect(
      getAllSigsMessage({
        secretKey: 0,
        extensionWallet: 1,
        hardwareWallet: 0,
        signature: 0,
      }),
    ).toBe("1 extension wallet signature added");
  });

  it("leaves the raw signature type unlabeled", () => {
    // The "signature" (transaction envelope) source has no label, leaving a
    // double space between the count and the word "signature".
    expect(
      getAllSigsMessage({
        secretKey: 0,
        extensionWallet: 0,
        hardwareWallet: 0,
        signature: 2,
      }),
    ).toBe("2  signatures added");
  });

  it("joins multiple signature sources in a fixed order", () => {
    expect(
      getAllSigsMessage({
        secretKey: 1,
        extensionWallet: 1,
        hardwareWallet: 2,
        signature: 1,
      }),
    ).toBe(
      "1 secret key signature, 2 hardware wallet signatures, 1 extension wallet signature, 1  signature added",
    );
  });
});
