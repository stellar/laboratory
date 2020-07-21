let linkBuilder = require('../../src/utilities/linkBuilder');

describe('linkBuilder', () => {
  describe('txSignerLink()', () => {
    it('returns the correct url', () => {
      expect(linkBuilder.txSignerLink('AG/eK0AAAAAAA='))
        .to.equal('#txsigner?xdr=AG%2FeK0AAAAAAA%3D');
    });
  });

  describe('txPostLink()', () => {
    it('returns the correct url', () => {
      expect(linkBuilder.txPostLink('AG/eK0AAAAAAA='))
        .to.equal('#txsubmitter?input=AG%2FeK0AAAAAAA%3D');
    });
  });

  describe('xdrViewer()', () => {
    it('returns the correct url', () => {
      expect(linkBuilder.xdrViewer('AG/eK0AAAAAAA=', 'TransactionEnvelope'))
        .to.equal('#xdr-viewer?input=AG%2FeK0AAAAAAA%3D&type=TransactionEnvelope');
    });
  });

  describe('feeBumpTxLink()', () => {
    it('returns the correct url', () => {
      expect(linkBuilder.feeBumpTxLink('AG/eK0AAAAAAA='))
        .to.equal('#txbuilder?params=eyJmZWVCdW1wQXR0cmlidXRlcyI6eyJpbm5lclR4WERSIjoiQUcvZUswQUFBQUFBQT0ifSwidHhUeXBlIjoiRkVFX0JVTVAifQ%3D%3D')
    });
  });

  describe('singleAccount()', () => {
    it('returns the correct url', () => {
      expect(linkBuilder.singleAccount('GAKRI33OWJLTCVGOPKAGTBUOLCRNF2GRX54K2OFNZWPX5Y3LQC2Q77IN'))
        .to.equal('#explorer?resource=accounts&endpoint=single&values=eyJhY2NvdW50X2lkIjoiR0FLUkkzM09XSkxUQ1ZHT1BLQUdUQlVPTENSTkYyR1JYNTRLMk9GTlpXUFg1WTNMUUMyUTc3SU4ifQ%3D%3D');
    });
  });

  describe('horizonUrlToExplorerLink()', () => {
    it('converts a simple horizon link to a endpoint explorer link', () => {
      expect(linkBuilder.horizonUrlToExplorerLink('https://horizon-testnet.stellar.org/ledgers/1173'))
        .to.equal('#explorer?resource=ledgers&endpoint=single&values=eyJsZWRnZXIiOiIxMTczIn0%3D');
    });

    it('converts a templated horizon link to a endpoint explorer link', () => {
      expect(linkBuilder.horizonUrlToExplorerLink('https://horizon-testnet.stellar.org/ledgers/1173/transactions{?cursor,limit,order}'))
        .to.equal('#explorer?resource=transactions&endpoint=for_ledger&values=eyJsZWRnZXIiOiIxMTczIn0%3D');
    });

    it('converts a non url into undefined', () => {
      expect(linkBuilder.horizonUrlToExplorerLink('lumens')).to.be.a('undefined');
    });
  });
});
