import { useLayoutEffect, useState } from "react";
import "./styles.scss";

export const ExpandBox = ({
  children,
  isExpanded,
}: {
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
      className="ExpandBox"
      data-is-expanded={isExpanded}
      data-is-open={isOpen}
    >
      <div className="ExpandBox__inset">{children}</div>
    </div>
  );
};
