import React from "react";
import "./styles.scss";

export const Box = ({
  gap,
  children,
  customValue,
  addlClassName,
}: (
  | { gap: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"; customValue?: undefined }
  | { gap: "custom"; customValue: string }
) & { children: React.ReactElement; addlClassName?: string }) => {
  return (
    <div
      className={`Box Box--${gap} ${addlClassName ?? ""}`}
      {...(gap === "custom" ? { gap: customValue } : {})}
    >
      {children}
    </div>
  );
};
