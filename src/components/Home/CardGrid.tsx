import React from "react";

import { NextLink } from "@/components/NextLink";

/**
 * A single r16 container whose cells are separated by 1px hairline dividers.
 *
 * Not composed from SDS `<Card>`: N cards would paint N independent borders, so
 * every seam would be 2px with a gap where the design has a single hairline.
 * Instead the container paints the divider colour and the cells paint over it,
 * so the 1px grid gap reads as a hairline — and stays correct when the grid
 * collapses at narrow widths.
 *
 * @example
 * <CardGrid columns={4} isBorderless>
 *   <CardGrid.Cell href={Routes.VIEW_XDR}>…</CardGrid.Cell>
 * </CardGrid>
 */
export const CardGrid = ({
  columns,
  isBorderless,
  children,
  addlClassName,
}: {
  /**
   * Number of columns at full width. 4 collapses to 2, then 1; 3 collapses
   * straight to 1 so no row is left with an empty slot.
   */
  columns: 3 | 4;
  /**
   * Drops the outer border and radius but keeps identical column math,
   * dividers, and cell padding. Link cells don't get the whole-cell hover, so
   * the caller decides its own hover treatment.
   */
  isBorderless?: boolean;
  children: React.ReactNode;
  addlClassName?: string;
}) => (
  <div
    className={`CardGrid ${addlClassName ?? ""}`}
    data-columns={columns}
    data-is-borderless={isBorderless || undefined}
  >
    {children}
  </div>
);

const CardGridCell = ({
  children,
  addlClassName,
  href,
  onClick,
}: {
  children: React.ReactNode;
  addlClassName?: string;
  /** When set, the whole cell becomes a link. */
  href?: string;
  onClick?: () => void;
}) => {
  const className = `CardGrid__cell ${addlClassName ?? ""}`;

  if (href) {
    return (
      <NextLink
        href={href}
        className={className}
        data-is-link="true"
        onClick={onClick}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};

CardGrid.Cell = CardGridCell;
