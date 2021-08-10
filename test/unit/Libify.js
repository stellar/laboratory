import { xdr, Transaction, Operation, Networks } from "stellar-sdk";
import Libify from "../../src/helpers/Libify";

describe("Libify.buildTransaction", () => {
  // eslint-disable-next-line no-undef
  context("when building a simple transaction", () => {
    const simpleTransaction = Libify.buildTransaction(
      {
        sourceAccount:
          "GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT",
        sequence: "321",
        fee: "42",
        memoType: "",
        memoContent: "",
      },
      [
        {
          id: 0,
          attributes: {
            destination:
              "GDCIK56SS6B3WEIY2GVPNI5GA7SLXVDUMLAPJBCVD3MYVUJQX2OLIFBX",
            startingBalance: "30",
          },
          name: "createAccount",
        },
      ],
      Networks.TESTNET,
    );
    expect(simpleTransaction.errors).to.deep.equal([]);
    const decodedTx = new Transaction(simpleTransaction.xdr, Networks.TESTNET);

    it("contains specified source account", () => {
      expect(decodedTx.source).to.equal(
        "GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT",
      );
    });

    it("contains specified sequence number", () => {
      expect(decodedTx.sequence).to.equal("321");
    });

    it("contains specified fee", () => {
      expect(decodedTx.fee).to.equal("42");
    });

    it("contains no memo", () => {
      expect(decodedTx.memo._type).to.equal("none");
    });

    it("contains one operation", () => {
      expect(decodedTx.operations.length).to.equal(1);
    });
  });

  // eslint-disable-next-line no-undef
  context("when building a large transaction", () => {
    const largeTransaction = Libify.buildTransaction(
      {
        sourceAccount:
          "GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT",
        sequence: "1",
        fee: "150",
        memoType: "MEMO_TEXT",
        memoContent: ":D",
      },
      [
        {
          id: 0,
          attributes: {
            destination:
              "GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT",
            startingBalance: "30",
            sourceAccount:
              "GACHREGNP75WHOD4NC5O2GGCX2HRENUKVDZCVK5OSHVGO6PIQ73AJI2E",
          },
          name: "createAccount",
        },
        {
          id: 1,
          name: "payment",
          attributes: {
            destination:
              "GDZMOE7AWFY5KDPZGWTT26J4XFKOHR626KMWSXHXAZHXIPRKO62KUPQX",
            asset: {
              type: "credit_alphanum4",
              code: "ABC",
              issuer:
                "GDZMOE7AWFY5KDPZGWTT26J4XFKOHR626KMWSXHXAZHXIPRKO62KUPQX",
            },
            amount: "50",
          },
        },
        {
          id: 2,
          name: "pathPaymentStrictSend",
          attributes: {
            destination:
              "GARYDU5S4E3HS2XOSDY5ELOCBGGXFLPFQHMO42JIWOMCR5QGFDHBNJEW",
            sendAsset: {
              type: "credit_alphanum12",
              code: "MONSTER",
              issuer:
                "GCOXOGREKTFJJJP2RTZHRHQC6IB7AHPSBQGUAVIMDMTQNJZSNLCJLT2G",
            },
            sendAmount: "5",
            path: [
              {
                type: "native",
              },
            ],
            destAsset: {
              type: "native",
            },
            destMin: "345678",
          },
        },
        {
          id: 3,
          name: "pathPaymentStrictReceive",
          attributes: {
            destination:
              "GARYDU5S4E3HS2XOSDY5ELOCBGGXFLPFQHMO42JIWOMCR5QGFDHBNJEW",
            sendAsset: {
              type: "credit_alphanum12",
              code: "MONSTER",
              issuer:
                "GCOXOGREKTFJJJP2RTZHRHQC6IB7AHPSBQGUAVIMDMTQNJZSNLCJLT2G",
            },
            sendMax: "5",
            path: [
              {
                type: "native",
              },
            ],
            destAsset: {
              type: "native",
            },
            destAmount: "456789",
          },
        },
        {
          id: 4,
          name: "manageSellOffer",
          attributes: {
            selling: {
              type: "native",
            },
            buying: {
              type: "credit_alphanum12",
              code: "ALLTHETHINGS",
              issuer:
                "GCVUWFL4USUCGHCPCOLPMORYCI5F37IM3CEIQM55IQ3ZNDSYCQIE2534",
            },
            amount: "0",
            price: "4.417",
            offerId: "0",
          },
        },
        {
          id: 5,
          name: "createPassiveSellOffer",
          attributes: {
            selling: {
              type: "native",
            },
            buying: {
              type: "credit_alphanum4",
              code: "GOOD",
              issuer:
                "GCVUWFL4USUCGHCPCOLPMORYCI5F37IM3CEIQM55IQ3ZNDSYCQIE2534",
            },
            amount: "5",
            price: "2",
          },
        },
        {
          id: 6,
          name: "setOptions",
          attributes: {
            inflationDest:
              "GAJNYCPCVHNM724OKKJ3UOPLLHP7LUEODUMXLE4RZ74OXAYENY5BV4CZ",
            setFlags: 1,
            clearFlags: 6,
            masterWeight: "1",
            lowThreshold: "2",
            medThreshold: "3",
            signer: {
              type: "ed25519PublicKey",
              content:
                "GA2IKCQR3WNN5W5446MU5UZZW7UIHWQN6UVJCAXRMRH4JV3QSOABQXI4",
              weight: "5",
            },
            homeDomain: "example.com",
          },
        },
        {
          id: 7,
          name: "changeTrust",
          attributes: {
            asset: {
              type: "credit_alphanum4",
              code: "123",
              issuer:
                "GB6I3Y3F24UMOJ326W3Z4AHRI3VKXNEFSDPZ7CCSHHYD5ML7RDEJYHJR",
            },
          },
        },
        {
          id: 8,
          name: "allowTrust",
          attributes: {
            trustor: "GB6I3Y3F24UMOJ326W3Z4AHRI3VKXNEFSDPZ7CCSHHYD5ML7RDEJYHJR",
            assetCode: "456",
            authorize: "1",
          },
        },
        {
          id: 9,
          name: "accountMerge",
          attributes: {
            destination:
              "GD4WIAWVK7TCHDLIVB7YQ3P45PGPPK4RD52FZVS52TJE3224R566G45L",
            sourceAccount:
              "GDNG66PN7A4OCNY2XOAWL4NVO6ALFRP2RCGOZ2WMGMHBZCWM5RXWVHPU",
          },
        },
        {
          id: 10,
          name: "manageData",
          attributes: {
            name: "wow",
            value: "such test",
          },
        },
        {
          id: 11,
          name: "manageBuyOffer",
          attributes: {
            selling: {
              type: "native",
            },
            buying: {
              type: "credit_alphanum12",
              code: "ALLTHETHINGS",
              issuer:
                "GCVUWFL4USUCGHCPCOLPMORYCI5F37IM3CEIQM55IQ3ZNDSYCQIE2534",
            },
            buyAmount: "0",
            price: "4.417",
            offerId: "0",
          },
        },
      ],
      Networks.TESTNET,
    );
    const decodedTx = xdr.TransactionEnvelope.fromXDR(
      largeTransaction.xdr,
      "base64",
    );
    const operations = decodedTx.value().tx().operations();
    const opAtIndex = (index) => Operation.fromXDRObject(operations[index]);

    describe("createAccount operation at index 0", () => {
      it("is of type createAccount", () => {
        expect(opAtIndex(0).type).to.equal("createAccount");
      });
      it("contains source account", () => {
        expect(opAtIndex(0)).to.have.property("source");
      });
      it("contains specified destination", () => {
        expect(opAtIndex(0).destination).to.equal(
          "GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT",
        );
      });
    });

    describe("payment operation at index 1", () => {
      it("is of type payment", () => {
        expect(opAtIndex(1).type).to.equal("payment");
      });
      it("contains no source account", () => {
        expect(opAtIndex(1)).to.not.have.property("source");
      });

      it("contains ABC credit", () => {
        expect(opAtIndex(1).asset.code).to.equal("ABC");
      });
    });

    describe("pathPaymentStrictSend operation at index 2", () => {
      it("is of type pathPaymentStrictSend", () => {
        expect(opAtIndex(2).type).to.equal("pathPaymentStrictSend");
      });
      it("contains native destination assset", () => {
        expect(opAtIndex(2).destAsset.code).to.equal("XLM");
      });
      it("contains MONSTER send asset", () => {
        expect(opAtIndex(2).sendAsset.code).to.equal("MONSTER");
      });
    });

    describe("pathPaymentStrictReceive operation at index 3", () => {
      it("is of type pathPaymentStrictReceive", () => {
        expect(opAtIndex(3).type).to.equal("pathPaymentStrictReceive");
      });
      it("contains native destination assset", () => {
        expect(opAtIndex(3).destAsset.code).to.equal("XLM");
      });
      it("contains MONSTER send asset", () => {
        expect(opAtIndex(3).sendAsset.code).to.equal("MONSTER");
      });
    });

    describe("manageSellOffer operation at index 4", () => {
      it("is of type manageSellOffer", () => {
        expect(opAtIndex(4).type).to.equal("manageSellOffer");
      });
      it("contains specified price", () => {
        expect(opAtIndex(4).price).to.equal("4.417");
      });
    });

    describe("manageBuyOffer operation at index 11", () => {
      it("is of type manageBuyOffer", () => {
        expect(opAtIndex(11).type).to.equal("manageBuyOffer");
      });
      it("contains specified price", () => {
        expect(opAtIndex(11).price).to.equal("4.417");
      });
    });

    describe("createPassiveSellOffer operation at index 5", () => {
      it("is of type createPassiveSellOffer", () => {
        expect(opAtIndex(5).type).to.equal("createPassiveSellOffer");
      });
      it("contains specified amount", () => {
        expect(opAtIndex(5).amount).to.equal("5.0000000");
      });
    });

    describe("setOptions operation at index 6", () => {
      it("is of type setOptions", () => {
        expect(opAtIndex(6).type).to.equal("setOptions");
      });
      it("contains specified clearFlags", () => {
        expect(opAtIndex(6).clearFlags).to.equal(6);
      });
      it("contains specified signer pubKey", () => {
        expect(opAtIndex(6).signer.ed25519PublicKey).to.equal(
          "GA2IKCQR3WNN5W5446MU5UZZW7UIHWQN6UVJCAXRMRH4JV3QSOABQXI4",
        );
      });
      it("contains specified homeDomain", () => {
        expect(opAtIndex(6).homeDomain).to.equal("example.com");
      });
      it("contains no high threshold", () => {
        expect(opAtIndex(6).highThreshold).to.be.a("undefined");
      });
    });

    describe("changeTrust operation at index 7", () => {
      it("is of type changeTrust", () => {
        expect(opAtIndex(7).type).to.equal("changeTrust");
      });
      it("contains specified asset issuer", () => {
        expect(opAtIndex(7).line.issuer).to.equal(
          "GB6I3Y3F24UMOJ326W3Z4AHRI3VKXNEFSDPZ7CCSHHYD5ML7RDEJYHJR",
        );
      });
    });

    describe("allowTrust operation at index 8", () => {
      it("is of type allowTrust", () => {
        expect(opAtIndex(8).type).to.equal("allowTrust");
      });
      it("contains true authorize flag", () => {
        expect(opAtIndex(8).authorize).to.equal(1);
      });
    });

    describe("accountMerge operation at index 9", () => {
      it("is of type accountMerge", () => {
        expect(opAtIndex(9).type).to.equal("accountMerge");
      });
      it("contains merge destination", () => {
        expect(opAtIndex(9).destination).to.equal(
          "GD4WIAWVK7TCHDLIVB7YQ3P45PGPPK4RD52FZVS52TJE3224R566G45L",
        );
      });
    });

    describe("manageData operation at index 10", () => {
      it("is of type manageData", () => {
        expect(opAtIndex(10).type).to.equal("manageData");
      });
      it("contains specified value in manageData value", () => {
        expect(opAtIndex(10).value.toString()).to.equal("such test");
      });
    });
  });
});
