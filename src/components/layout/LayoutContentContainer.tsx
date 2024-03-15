import React from "react";

export const LayoutContentContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="LabLayout__container">
    <div className="LabLayout__content">{children}</div>
  </div>
);
