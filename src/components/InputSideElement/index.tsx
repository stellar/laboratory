import { Button } from "@stellar/design-system";
import "./styles.scss";

type InputSideElementProps = (
  | {
      variant: "text";
      onClick?: undefined;
      disabled?: undefined;
      title?: undefined;
    }
  | {
      variant: "button";
      onClick: () => void;
      disabled?: boolean;
      title?: string;
    }
) & {
  children: string;
  placement: "left" | "right";
};

export const InputSideElement = ({
  variant,
  children,
  onClick,
  disabled,
  title,
  placement = "right",
  ...props
}: InputSideElementProps) => {
  if (variant === "text") {
    return (
      <div
        className={`InputSideElement InputSideElement--text InputSideElement--${placement}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`InputSideElement InputSideElement--${placement}`}
      {...props}
    >
      <Button
        size="md"
        variant="tertiary"
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        {children}
      </Button>
    </div>
  );
};
