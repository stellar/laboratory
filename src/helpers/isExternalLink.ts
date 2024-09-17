export const isExternalLink = (href?: string) =>
  href?.startsWith("http") || href?.startsWith("//");
