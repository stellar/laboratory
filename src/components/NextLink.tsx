import { ComponentProps } from "react";
import Link from "next/link";

type LinkProps = ComponentProps<typeof Link>;

/** `NextLink` is extended `next/link`. */
export const NextLink = (props: LinkProps) => {
  const externalLinkProps = (href: string) => {
    const isExternalLink = href?.startsWith("http") || href?.startsWith("//");

    return isExternalLink
      ? { rel: "noreferrer noopener", target: "_blank" }
      : {};
  };

  return <Link {...props} {...externalLinkProps(props.href.toString())} />;
};
