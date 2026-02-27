"use client";

import { useEffect } from "react";

/**
 * Appends the Google Translate engine mount point to the document body after
 * mount, keeping it entirely outside React's reconciliation tree.
 *
 * Rendering this div in JSX would SSR it as `<div hidden>`, but the Translate
 * engine modifies it on the client (removes `hidden`, adds `class="skiptranslate"`,
 * injects an `<iframe>`). React's reconciler then sees a mismatch and throws a
 * recoverable hydration error. Creating the element imperatively in `useEffect`
 * means it is never in the server-rendered HTML, so React never tries to reconcile it.
 */
export const GoogleTranslateMountPoint = () => {
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "google_translate_element";
    document.body.appendChild(el);

    return () => {
      el.remove();
    };
  }, []);

  return null;
};
