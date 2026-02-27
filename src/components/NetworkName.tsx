/**
 * Renders a Stellar network name (Mainnet, Testnet, Futurenet, etc.) as a
 * non-translatable span. Network names are proper nouns that should never be
 * translated by browser translation engines like Google Translate.
 */
export const NetworkName = ({ children }: { children: React.ReactNode }) => (
  <span className="notranslate">{children}</span>
);
