import NextLink from "next/link";
import { Props as LinkProps, Link } from "@stellar/design-system";

/** Use `SdsLink` instead of `Link` from Stellar Design System to support client-side routing. `SdsLink` uses `next/link` internally. */
export const SdsLink = (props: LinkProps) => {
  return (
    <Link
      {...props}
      customAnchor={<NextLink href={props.href || ""} prefetch={true} />}
    >
      {props.children}
    </Link>
  );
};
