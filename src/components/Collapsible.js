import React from "react";

const hasChildren = (children) =>
  Array.isArray(children) ? children.some(Boolean) : Boolean(children);

export const Collapsible = ({ isOpen = false, children }) => {
  const [finalIsOpen, setIsOpen] = React.useState(isOpen);

  React.useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  return (
    <div
      className={`Collapsible ${
        finalIsOpen && hasChildren(children)
          ? "Collapsible__open"
          : "Collapsible__closed"
      }`}
    >
      {children}
    </div>
  );
};
