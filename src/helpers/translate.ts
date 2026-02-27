/**
 * Expires the googtrans cookie at every possible domain level.
 *
 * Google Translate's own script sets a googtrans cookie scoped to the
 * registrable domain (e.g. .stellar-ops.com) rather than the exact host.
 * We must expire it at every parent domain level so it doesn't survive a
 * language switch and cause the page to re-translate to the old language.
 */
const clearGoogTransCookies = (): void => {
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  const parts = window.location.hostname.split(".");

  for (let i = 0; i < parts.length - 1; i++) {
    const domain = parts.slice(i).join(".");
    document.cookie = `googtrans=; path=/; domain=${domain}; ${expire}`;
    document.cookie = `googtrans=; path=/; domain=.${domain}; ${expire}`;
  }

  // Also clear the host-only (no domain attribute) cookie
  document.cookie = `googtrans=; path=/; ${expire}`;
};

/**
 * Sets the Google Translate language cookie and reloads the page.
 *
 * Clears all existing googtrans cookies at every domain level first to
 * prevent stale cookies (set by Google Translate's own script at a parent
 * domain) from overriding the new selection on reload.
 *
 * @param languageCode - BCP 47 language code (e.g. 'es', 'fr', 'pt', 'zh-CN')
 *
 * @example
 * selectLanguage('es'); // translates to Spanish and reloads
 */
export const selectLanguage = (languageCode: string): void => {
  clearGoogTransCookies();
  document.cookie = `googtrans=/en/${languageCode}; path=/`;
  window.location.reload();
};

/**
 * Clears the Google Translate cookie and reloads the page, returning
 * the UI to English.
 *
 * @example
 * resetLanguage(); // returns to English and reloads
 */
export const resetLanguage = (): void => {
  clearGoogTransCookies();
  window.location.reload();
};

/**
 * Reads the active Google Translate language from the `googtrans` cookie.
 *
 * @returns The active language code (e.g. 'es') or 'en' if no translation
 *   cookie is set.
 *
 * @example
 * const lang = getActiveLanguage(); // 'es'
 */
export const getActiveLanguage = (): string => {
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return match ? match[1] : "en";
};
