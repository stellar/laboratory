import React from "react";
import "./styles.scss";

interface FieldNoteProps {
  variant?: "note" | "error";
  // TODO: remove "xs" once all form fields are updated
  size: "sm" | "md" | "lg" | "xs";
  children: string | React.ReactNode;
}

export const FieldNote: React.FC<FieldNoteProps> = ({
  variant = "note",
  size,
  children,
}: FieldNoteProps) => (
  <div className={`FieldNote FieldNote--${variant} FieldNote--${size}`}>
    {children}
  </div>
);
