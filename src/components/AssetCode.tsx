/**
 * Renders a Stellar asset code (USDC, EURC, etc.) as a non-translatable span.
 * Asset codes are technical identifiers that should never be translated by
 * browser translation engines like Google Translate.
 */
export const AssetCode = ({ children }: { children: React.ReactNode }) => (
  <span className="notranslate">{children}</span>
);
