import { Floater } from "@stellar/design-system";

import "./styles.scss";

type FloaterDropdownProps = {
  triggerEl: React.ReactElement;
  children: React.ReactElement;
  hasActiveInsideClick?: boolean;
  offset?: number;
  addlClassName?: string;
};

export const FloaterDropdown = ({
  triggerEl,
  children,
  hasActiveInsideClick,
  offset,
  addlClassName,
}: FloaterDropdownProps) => {
  return (
    <Floater
      triggerEl={triggerEl}
      placement="bottom-end"
      hasActiveInsideClick={hasActiveInsideClick}
      isContrast={false}
      offset={offset}
    >
      <div className={`FloaterDropdown__content ${addlClassName || ""}`}>
        {children}
      </div>
    </Floater>
  );
};
