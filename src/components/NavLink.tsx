import NextLink from "next/link";
import { Props as LinkProps, Link } from "@stellar/design-system";

/** Use `NavLink` instead of `Link` from Stellar Design System to support client-side routing. `NavLink` uses `Link` from `next/link` internally. */
export const NavLink = (props: LinkProps) => {
  return (
    <Link {...props} customAnchor={<NextLink href={props.href || ""} />}>
      {props.children}
    </Link>
  );
};
