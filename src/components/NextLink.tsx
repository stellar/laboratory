import { ComponentProps } from "react";
import Link from "next/link";

type LinkProps = ComponentProps<typeof Link> & {
  "sds-variant"?: "primary" | "secondary" | "error" | "success" | "warning";
};

/** `NextLink` is extended `next/link`. */
export const NextLink = (props: LinkProps) => {
  const externalLinkProps = (href: string) => {
    const isExternalLink = href?.startsWith("http") || href?.startsWith("//");

    return isExternalLink
      ? { rel: "noreferrer noopener", target: "_blank" }
      : {};
  };

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
