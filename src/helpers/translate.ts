/**
 * Sets the Google Translate language cookie and reloads the page.
 *
 * The Google Translate engine reads the `googtrans` cookie on each page load
 * to determine the target language. Setting it on both the hostname-scoped and
 * the root-path cookie ensures it is picked up consistently across browsers.
 *
 * @param languageCode - BCP 47 language code (e.g. 'es', 'fr', 'pt', 'zh-CN')
 *
 * @example
 * selectLanguage('es'); // translates to Spanish and reloads
 */
export const selectLanguage = (languageCode: string): void => {
  const val = `/en/${languageCode}`;
  document.cookie = `googtrans=${val}; path=/; domain=${window.location.hostname}`;
  document.cookie = `googtrans=${val}; path=/`;
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
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname}; ${expire}`;
  document.cookie = `googtrans=/en/en; path=/; ${expire}`;
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
