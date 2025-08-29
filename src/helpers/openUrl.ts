import { sanitizeUrl } from "@/helpers/sanitizeUrl";

export const openUrl = (url: string) => {
  return window.open(sanitizeUrl(url), "_blank", "noopener,noreferrer");
};
