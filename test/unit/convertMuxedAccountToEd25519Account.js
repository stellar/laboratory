import convert from  '../../src/utilities/convertMuxedAccountToEd25519Account';

describe('convertMuxedAccountToEd25519Account', () => {
    it('returns M accounts for now', () => {
      expect(convert('MAAAAAAAAAAAAFHU4MODGMHQOYHMPCMPOZ3KIL3ZH34AUH4MH6UG2AJEBFWQOPSVR2RMK'))
        .to.equal('MAAAAAAAAAAAAFHU4MODGMHQOYHMPCMPOZ3KIL3ZH34AUH4MH6UG2AJEBFWQOPSVR2RMK');
    });
    it('works with G accounts', () => {
        expect(convert('GD2OGHBTGDYHMDWHRGHXM5VEF54T56AKD6GD7KDNAESAS3IHHZKY46XI'))
          .to.equal('GD2OGHBTGDYHMDWHRGHXM5VEF54T56AKD6GD7KDNAESAS3IHHZKY46XI');
    });
});
