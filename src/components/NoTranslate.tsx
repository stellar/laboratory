/**
 * Wraps children in a span that signals to Google Translate that the
 * contents must not be translated. Use this around any technical Stellar
 * data (hashes, public keys, XDR strings, contract IDs, etc.) that would
 * become invalid or misleading if machine-translated.
 *
 * @example
 * <NoTranslate>{txHash}</NoTranslate>
 */
export const NoTranslate = ({ children }: { children: React.ReactNode }) => (
  <span className="notranslate">{children}</span>
);
