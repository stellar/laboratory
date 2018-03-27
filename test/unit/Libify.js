import React from 'react';
import {xdr, Transaction, Operation} from 'stellar-sdk';
import Libify from '../../src/utilities/Libify';

describe('Libify.buildTransaction', () => {
  context('when building a simple transaction', () => {
    let simpleTransaction = Libify.buildTransaction({
      sourceAccount: 'GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT',
      sequence: '321',
      fee: '42',
      memoType: '',
      memoContent: ''
    }, [
      {
        id: 0,
        attributes: {
          destination: 'GDCIK56SS6B3WEIY2GVPNI5GA7SLXVDUMLAPJBCVD3MYVUJQX2OLIFBX',
          startingBalance: '30'
        },
        name: 'createAccount'
      }
    ]);
    let decodedTx = new Transaction(simpleTransaction.xdr);

    it('contains specified source account', () => {
      expect(decodedTx.source).to.equal('GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT');
    });

    it('contains specified sequence number', () => {
      expect(decodedTx.sequence).to.equal('321');
    });

    it('contains specified fee', () => {
      expect(decodedTx.fee).to.equal(42);
    });

    it('contains no memo', () => {
      expect(decodedTx.memo._type).to.equal('none');
    });

    it('contains one operation', () => {
      expect(decodedTx.operations.length).to.equal(1);
    });
  })

  context('when building a large transaction', () => {
    let largeTransaction = Libify.buildTransaction({
      sourceAccount: 'GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT',
      sequence: '1',
      fee: '150',
      memoType: 'MEMO_TEXT',
      memoContent: ':D'
    }, [
      {
        id: 0,
        attributes: {
          destination: 'GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT',
          startingBalance: '30',
          sourceAccount: 'GACHREGNP75WHOD4NC5O2GGCX2HRENUKVDZCVK5OSHVGO6PIQ73AJI2E'
        },
        name: 'createAccount'
      },
      {
        id: 1,
        name: 'payment',
        attributes: {
          destination: 'GDZMOE7AWFY5KDPZGWTT26J4XFKOHR626KMWSXHXAZHXIPRKO62KUPQX',
          asset: {
            type: 'credit_alphanum4',
            code: 'ABC',
            issuer: 'GDZMOE7AWFY5KDPZGWTT26J4XFKOHR626KMWSXHXAZHXIPRKO62KUPQX'
          },
          amount: '50'
        }
      },
      {
        id: 2,
        name: 'pathPayment',
        attributes: {
          destination: 'GARYDU5S4E3HS2XOSDY5ELOCBGGXFLPFQHMO42JIWOMCR5QGFDHBNJEW',
          sendAsset: {
            type: 'credit_alphanum12',
            code: 'MONSTER',
            issuer: 'GCOXOGREKTFJJJP2RTZHRHQC6IB7AHPSBQGUAVIMDMTQNJZSNLCJLT2G'
          },
          sendMax: '5',
          path: [
            {
              type: 'native'
            }
          ],
          destAsset: {
            type: 'native'
          },
          destAmount: '456789'
        }
      },
      {
        id: 3,
        name: 'manageOffer',
        attributes: {
          selling: {
            type: 'native'
          },
          buying: {
            type: 'credit_alphanum12',
            code: 'ALLTHETHINGS',
            issuer: 'GCVUWFL4USUCGHCPCOLPMORYCI5F37IM3CEIQM55IQ3ZNDSYCQIE2534'
          },
          amount: '0',
          price: '4.417',
          offerId: '0'
        }
      },
      {
        id: 4,
        name: 'createPassiveOffer',
        attributes: {
          selling: {
            type: 'native'
          },
          buying: {
            type: 'credit_alphanum4',
            code: 'GOOD',
            issuer: 'GCVUWFL4USUCGHCPCOLPMORYCI5F37IM3CEIQM55IQ3ZNDSYCQIE2534'
          },
          amount: '5',
          price: '2'
        }
      },
      {
        id: 5,
        name: 'setOptions',
        attributes: {
          inflationDest: 'GAJNYCPCVHNM724OKKJ3UOPLLHP7LUEODUMXLE4RZ74OXAYENY5BV4CZ',
          setFlags: 1,
          clearFlags: 6,
          masterWeight: '1',
          lowThreshold: '2',
          medThreshold: '3',
          signer: {
            type: 'ed25519PublicKey',
            content: 'GA2IKCQR3WNN5W5446MU5UZZW7UIHWQN6UVJCAXRMRH4JV3QSOABQXI4',
            weight: '5'
          },
          homeDomain: 'example.com'
        }
      },
      {
        id: 6,
        name: 'changeTrust',
        attributes: {
          asset: {
            type: 'credit_alphanum4',
            code: '123',
            issuer: 'GB6I3Y3F24UMOJ326W3Z4AHRI3VKXNEFSDPZ7CCSHHYD5ML7RDEJYHJR'
          }
        }
      },
      {
        id: 7,
        name: 'allowTrust',
        attributes: {
          trustor: 'GB6I3Y3F24UMOJ326W3Z4AHRI3VKXNEFSDPZ7CCSHHYD5ML7RDEJYHJR',
          assetCode: '456',
          authorize: 'true'
        }
      },
      {
        id: 8,
        name: 'accountMerge',
        attributes: {
          destination: 'GD4WIAWVK7TCHDLIVB7YQ3P45PGPPK4RD52FZVS52TJE3224R566G45L',
          sourceAccount: 'GDNG66PN7A4OCNY2XOAWL4NVO6ALFRP2RCGOZ2WMGMHBZCWM5RXWVHPU'
        }
      },
      {
        id: 9,
        name: 'inflation',
        attributes: {}
      },
      {
        id: 10,
        name: 'manageData',
        attributes: {
          name: 'wow',
          value: 'such test'
        }
      }
    ]);
    let decodedTx = xdr.TransactionEnvelope.fromXDR(largeTransaction.xdr, 'base64');
    let opAtIndex = (index) => {
      return Operation.fromXDRObject(decodedTx._attributes.tx._attributes.operations[index]);
    };

    describe('createAccount operation at index 0', () => {
      it('is of type createAccount', () => {
        expect(opAtIndex(0).type).to.equal('createAccount');
      })
      it('contains source account', () => {
        expect(opAtIndex(0)).to.have.property('source')
      })
      it('contains specified destination', () => {
        expect(opAtIndex(0).destination).to.equal('GCNZ6DLRLBDUUTXMGKHMCIG44I6VSZ4U6ACY6CSICK5DFVRATYJTAEVT')
      })
    })

    describe('payment operation at index 1', () => {
      it('is of type payment', () => {
        expect(opAtIndex(1).type).to.equal('payment');
      })
      it('contains no source account', () => {
        expect(opAtIndex(1)).to.not.have.property('source')
      })

      it('contains ABC credit', () => {
        expect(opAtIndex(1).asset.code).to.equal('ABC')
      })
    })

    describe('pathPayment operation at index 2', () => {
      it('is of type pathPayment', () => {
        expect(opAtIndex(2).type).to.equal('pathPayment');
      })
      it('contains native destination assset', () => {
        expect(opAtIndex(2).destAsset.code).to.equal('XLM')
      })
      it('contains MONSTER send asset', () => {
        expect(opAtIndex(2).sendAsset.code).to.equal('MONSTER')
      })
    })

    describe('manageOffer operation at index 3', () => {
      it('is of type manageOffer', () => {
        expect(opAtIndex(3).type).to.equal('manageOffer');
      })
      it('contains specified price', () => {
        expect(opAtIndex(3).price).to.equal('4.417')
      })
    })

    describe('createPassiveOffer operation at index 4', () => {
      it('is of type createPassiveOffer', () => {
        expect(opAtIndex(4).type).to.equal('createPassiveOffer');
      })
      it('contains specified amount', () => {
        expect(opAtIndex(4).amount).to.equal('5')
      })
    })

    describe('setOptions operation at index 5', () => {
      it('is of type setOptions', () => {
        expect(opAtIndex(5).type).to.equal('setOptions');
      })
      it('contains specified clearFlags', () => {
        expect(opAtIndex(5).clearFlags).to.equal(6)
      })
      it('contains specified signer pubKey', () => {
        expect(opAtIndex(5).signer.ed25519PublicKey).to.equal('GA2IKCQR3WNN5W5446MU5UZZW7UIHWQN6UVJCAXRMRH4JV3QSOABQXI4')
      })
      it('contains specified homeDomain', () => {
        expect(opAtIndex(5).homeDomain).to.equal('example.com')
      })
      it('contains no high threshold', () => {
        expect(opAtIndex(5).highThreshold).to.be.a('undefined')
      })
    })

    describe('changeTrust operation at index 6', () => {
      it('is of type changeTrust', () => {
        expect(opAtIndex(6).type).to.equal('changeTrust');
      })
      it('contains specified asset issuer', () => {
        expect(opAtIndex(6).line.issuer).to.equal('GB6I3Y3F24UMOJ326W3Z4AHRI3VKXNEFSDPZ7CCSHHYD5ML7RDEJYHJR')
      })
    })

    describe('allowTrust operation at index 7', () => {
      it('is of type allowTrust', () => {
        expect(opAtIndex(7).type).to.equal('allowTrust');
      })
      it('contains true authorize flag', () => {
        expect(opAtIndex(7).authorize).to.equal(true)
      })
    })

    describe('accountMerge operation at index 8', () => {
      it('is of type accountMerge', () => {
        expect(opAtIndex(8).type).to.equal('accountMerge');
      })
      it('contains merge destination', () => {
        expect(opAtIndex(8).destination).to.equal('GD4WIAWVK7TCHDLIVB7YQ3P45PGPPK4RD52FZVS52TJE3224R566G45L')
      })
    })

    describe('inflation operation at index 9', () => {
      it('is of type inflation', () => {
        expect(opAtIndex(9).type).to.equal('inflation');
      })
    })

    describe('manageData operation at index 10', () => {
      it('is of type manageData', () => {
        expect(opAtIndex(10).type).to.equal('manageData');
      })
      it('contains specified value in manageData value', () => {
        expect(opAtIndex(10).value.toString()).to.equal('such test')
      })
    })
  })
})
