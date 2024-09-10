import { ComponentProps } from "react";
import Link from "next/link";
import { isExternalLink } from "@/helpers/isExternalLink";

type LinkProps = ComponentProps<typeof Link> & {
  "sds-variant"?: "primary" | "secondary" | "error" | "success" | "warning";
};

/** `NextLink` is extended `next/link`. */
export const NextLink = (props: LinkProps) => {
  const externalLinkProps = (href: string) =>
    isExternalLink(href)
      ? { rel: "noreferrer noopener", target: "_blank" }
      : {};

  return (
    <Link
      {...props}
      className={`${props.className || ""} ${
        props["sds-variant"] ? `Link Link--${props["sds-variant"]}` : ""
      }`}
      prefetch={props.prefetch !== undefined ? props.prefetch : true}
      {...externalLinkProps(props.href.toString())}
    />
  );
};
