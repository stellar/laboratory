import React from "react";
import "./styles.scss";

type BoxProps = (
  | { gap: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"; customValue?: undefined }
  | { gap: "custom"; customValue: string }
) & {
  children: React.ReactElement | React.ReactElement[] | React.ReactNode;
  addlClassName?: string;
  direction?: "column" | "row" | "column-reverse" | "row-reverse";
  justify?:
    | "center"
    | "space-between"
    | "space-around"
    | "end"
    | "left"
    | "right"
    | "baseline";
  align?: "center" | "end" | "start" | "baseline" | "stretch";
  wrap?: "nowrap" | "wrap";
  onClick?: () => void;
};

export const Box = ({
  gap,
  children,
  customValue,
  addlClassName,
  direction = "column",
  justify = "baseline",
  align = "stretch",
  wrap,
  ...props
}: BoxProps & React.HTMLAttributes<HTMLDivElement>) => {
  const customStyle = {
    "--Box-direction": direction,
    "--Box-justify": justify,
    "--Box-align": align,
    ...(wrap ? { flexWrap: wrap } : {}),
    ...(gap === "custom" ? { gap: customValue } : {}),
  } as React.CSSProperties;

  return (
    <div
      className={`Box Box--${gap} ${addlClassName ?? ""}`}
      style={customStyle}
      {...props}
    >
      {children}
    </div>
  );
};
