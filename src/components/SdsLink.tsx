import NextLink from "next/link";
import { type Props as LinkProps, Link } from "@stellar/design-system";
import { MouseEventHandler } from "react";

/** Use `SdsLink` instead of `Link` from Stellar Design System to support client-side routing. `SdsLink` uses `next/link` internally. */
export const SdsLink = (props: LinkProps & { onClick?: MouseEventHandler }) => {
  return (
    <Link
      {...props}
      customAnchor={<NextLink href={props.href || ""} prefetch={true} />}
    >
      {props.children}
    </Link>
  );
};
