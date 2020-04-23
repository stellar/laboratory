import convert from  '../../src/utilities/convertMuxedAccountToEd25519Account';

describe('convertMuxedAccountToEd25519Account', () => {
    it('converts a M account to a G key', () => {
      expect(convert('MAAAAAAAAAAAAFHU4MODGMHQOYHMPCMPOZ3KIL3ZH34AUH4MH6UG2AJEBFWQOPSVR2RMK'))
        .to.equal('GD2OGHBTGDYHMDWHRGHXM5VEF54T56AKD6GD7KDNAESAS3IHHZKY46XI');
    });
    it('works with G accounts', () => {
        expect(convert('MAAAAAAAAAAAAFHU4MODGMHQOYHMPCMPOZ3KIL3ZH34AUH4MH6UG2AJEBFWQOPSVR2RMK'))
          .to.equal('GD2OGHBTGDYHMDWHRGHXM5VEF54T56AKD6GD7KDNAESAS3IHHZKY46XI');
    });
});