import React, { useLayoutEffect, useState } from "react";
import "./styles.scss";

export const ExpandBox = ({
  children,
  isExpanded,
  offsetTop,
  customValue,
}: (
  | {
      offsetTop: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
      customValue?: undefined;
    }
  | { offsetTop: "custom"; customValue: string }
) & {
  children: React.ReactNode;
  isExpanded: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // We need a bit of delay to enable overflow visible when the section is expanded
  useLayoutEffect(() => {
    if (isExpanded) {
      const t = setTimeout(() => {
        setIsOpen(true);
        clearTimeout(t);
      }, 200);
    } else {
      setIsOpen(false);
    }
  }, [isExpanded]);

  return (
    <div
      className={`ExpandBox ExpandBox--${offsetTop}`}
      {...(offsetTop === "custom" ? { style: { marginTop: customValue } } : {})}
      data-is-expanded={isExpanded}
      data-is-open={isOpen}
    >
      <div className="ExpandBox__inset">{children}</div>
    </div>
  );
};
