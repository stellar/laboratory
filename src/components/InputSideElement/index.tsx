import { Button } from "@stellar/design-system";
import "./styles.scss";

type InputSideElementProps = (
  | {
      variant: "text";
      onClick?: undefined;
      disabled?: undefined;
      title?: undefined;
      icon?: undefined;
    }
  | {
      variant: "button";
      onClick: () => void;
      disabled?: boolean;
      title?: string;
      icon?: React.ReactNode;
    }
) & {
  children?: string;
  placement: "left" | "right";
  isLoading?: boolean;
  addlClassName?: string;
};

export const InputSideElement = ({
  variant,
  children,
  onClick,
  disabled,
  title,
  placement = "right",
  isLoading,
  addlClassName,
  icon,
  ...props
}: InputSideElementProps) => {
  if (variant === "text") {
    return (
      <div
        className={`InputSideElement InputSideElement--text InputSideElement--${placement} ${addlClassName || ""}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`InputSideElement InputSideElement--${placement} ${addlClassName || ""}`}
      {...props}
    >
      <Button
        size="md"
        variant="tertiary"
        onClick={onClick}
        disabled={disabled}
        title={title}
        isLoading={isLoading}
        icon={icon}
      >
        {children}
      </Button>
    </div>
  );
};
