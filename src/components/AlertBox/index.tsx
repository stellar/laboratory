import React, { useState } from "react";

import { Card, Icon, IconButton } from "@stellar/design-system";

import "./styles.scss";

export const AlertBox = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="AlertBox" data-is-visible={isVisible}>
      <Card noPadding>
        <div className="AlertBox__close-btn">
          <IconButton
            altText="Default"
            icon={<Icon.X />}
            onClick={() => setIsVisible(false)}
          />
        </div>
        <div className="AlertBox__inset">{children}</div>
      </Card>
    </div>
  );
};
