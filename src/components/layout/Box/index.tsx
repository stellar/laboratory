import React from "react";
import "./styles.scss";

export const Box = ({
  gap,
  children,
  customValue,
  addlClassName,
  direction = "column",
  justify = "baseline",
  align = "stretch",
  ...props
}: (
  | { gap: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"; customValue?: undefined }
  | { gap: "custom"; customValue: string }
) & {
  children: React.ReactElement | React.ReactElement[] | null;
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
}) => {
  const customStyle = {
    "--Box-direction": direction,
    "--Box-justify": justify,
    "--Box-align": align,
  } as React.CSSProperties;

  return (
    <div
      className={`Box Box--${gap} ${addlClassName ?? ""}`}
      {...(gap === "custom" ? { gap: customValue } : {})}
      style={customStyle}
      {...props}
    >
      {children}
    </div>
  );
};
