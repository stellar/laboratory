import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { delayedAction } from "@/helpers/delayedAction";

import "./styles.scss";

type DropdownProps = {
  children: React.ReactNode;
  isDropdownVisible: boolean;
  onClose: () => void;
  // [data-] attribute must be set on the trigger element
  triggerDataAttribute: string;
  addlClassName?: string;
  testId?: string;
};

export const Dropdown = ({
  children,
  isDropdownVisible,
  onClose,
  triggerDataAttribute,
  addlClassName,
  testId,
}: DropdownProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = useCallback((show: boolean) => {
    const delay = 100;

    if (show) {
      setIsActive(true);
      delayedAction({
        action: () => {
          setIsVisible(true);
        },
        delay,
      });
    } else {
      setIsVisible(false);
      delayedAction({
        action: () => {
          setIsActive(false);
        },
        delay,
      });
    }
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      // Ignore the dropdown
      if (dropdownRef?.current?.contains(event.target as Node)) {
        return;
      }

      // Ingnore the trigger element
      if ((event.target as any).dataset?.[triggerDataAttribute]) {
        return;
      }

      onClose();
    },
    [onClose, triggerDataAttribute],
  );

  // Update internal state when visible state changes from outside
  useEffect(() => {
    toggleDropdown(isDropdownVisible);
  }, [isDropdownVisible, toggleDropdown]);

  // Close dropdown when clicked outside
  useLayoutEffect(() => {
    if (isVisible) {
      document.addEventListener("pointerup", handleClickOutside);
    } else {
      document.removeEventListener("pointerup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [isVisible, handleClickOutside]);

  return (
    <div
      className={`Dropdown Floater__content Floater__content--light ${addlClassName || ""}`}
      data-is-active={isActive}
      data-is-visible={isVisible}
      ref={dropdownRef}
      data-testid={testId}
    >
      <div className="Dropdown__body">{children}</div>
    </div>
  );
};
