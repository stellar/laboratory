/**
 * Reusable CSS-grid table components for displaying key-value data in rows.
 * Used by network-limits, fee breakdown, simulate step resource display, etc.
 *
 * @example
 * <GridTable>
 *   <GridTableRow>
 *     <GridTableCell isHeader>Setting</GridTableCell>
 *     <GridTableCell isHeader>Value</GridTableCell>
 *   </GridTableRow>
 *   <GridTableRow>
 *     <GridTableCell isRowHeader>CPU instructions</GridTableCell>
 *     <GridTableCell>100,000</GridTableCell>
 *   </GridTableRow>
 * </GridTable>
 */

import "./styles.scss";

export const GridTable = ({
  children,
  addlClassName,
}: {
  children: React.ReactNode;
  addlClassName?: string;
}) => (
  <div
    className={`GridTable ${addlClassName || ""}`}
    role="table"
  >
    {children}
  </div>
);

export const GridTableRow = ({
  children,
  isEmpty,
  isHeader,
  isHighlighted,
  isSectionHeader,
}: {
  children: React.ReactNode;
  isEmpty?: boolean;
  isHeader?: boolean;
  isHighlighted?: boolean;
  isSectionHeader?: boolean;
}) => (
  <div
    className={`GridTable__row ${isEmpty ? "GridTable__row--empty" : ""} ${isSectionHeader ? "GridTable__row--section" : ""}`}
    role="row"
    {...(isHeader ? { "data-is-header": true } : {})}
    {...(isHighlighted ? { "data-is-highlighted": true } : {})}
  >
    {children}
  </div>
);

export const GridTableCell = ({
  children,
  isEmpty,
  isHeader,
  isRowHeader,
  isNested,
  addlClassName,
}: {
  children: React.ReactNode | React.ReactNode[] | null;
  isEmpty?: boolean;
  isHeader?: boolean;
  isRowHeader?: boolean;
  isNested?: boolean;
  addlClassName?: string;
}) => {
  let role: "cell" | "columnheader" | "rowheader" = "cell";

  if (isHeader) {
    role = "columnheader";
  }

  if (isRowHeader) {
    role = "rowheader";
  }

  return (
    <div
      className={`GridTable__cell ${isEmpty ? "GridTable__cell--empty" : ""} ${addlClassName || ""}`}
      role={role}
      {...(isNested ? { "data-is-nested": true } : {})}
    >
      {children}
    </div>
  );
};
