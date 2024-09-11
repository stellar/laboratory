import { Keypair } from "@stellar/stellar-sdk";

export const signatureHint = (value: string) => {
  // strkey encoding is using base32 encoding. Encoded public key consists of:
  //
  //  * 1 byte version byte (0x30 encoded as `G`)
  //  * 32 bytes public key
  //  * 2 bytes checksum
  //
  // Because base32 symbols are 5-bit, more than one symbol is needed to represent a single byte.
  // Signature Hint is the last 4 bytes of the public key. So we need to try to show as many 5-bit
  // chunks as possible included between bytes 30 and 33 (included).
  //
  // byte 1: ##### ###
  // byte 2:          ## ##### #
  // byte 3:                    #### ####
  // byte 4:                             # ##### ##
  // byte 5:                                       ### #####  <---------- 40 bits / full alignment
  // byte 6:                                                ##### ###
  // byte 7:                                                         ## ##### #
  //
  // .....
  //
  // byte 26: ##### ###
  // byte 27:          ## ##### #
  // byte 28:                    #### ####                    full b32 symbols
  // byte 29:                             # ##### ##    |--------------------------|
  // byte 30:                                       ### 48###                      |
  // byte 31:                  Signature Hint start |        49### 50#             |    Signature Hint end
  // byte 32:                                                         ## 51### 5   |    |
  // byte 33:                                                                   2### 53##
  // byte 34:                                                                            # 54### 55
  // byte 35:                                                                                      ### 56###

  const hintBytes = Buffer.from(value, "hex");
  const partialPublicKey = Buffer.concat([Buffer.alloc(28, 0), hintBytes]);

  const keypair = new Keypair({
    type: "ed25519",
    publicKey: partialPublicKey,
  });

  return `G${Buffer.alloc(46, "-").toString()}${keypair.publicKey().substring(47, 52)}${Buffer.alloc(4, "-").toString()}`;
};
