import React from "react";

import { WithInfoText } from "@/components/WithInfoText";
import { Tabs } from "@/components/Tabs";
import { Box } from "@/components/layout/Box";
import { PageHeader } from "@/components/layout/PageHeader";

import "./styles.scss";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
  isDisabled?: boolean;
};

type TabViewProps = {
  heading?: TabViewHeadingProps;
  tab1: Tab;
  tab2: Tab;
  tab3?: Tab;
  tab4?: Tab;
  tab5?: Tab;
  tab6?: Tab;
  onTabChange: (id: string) => void;
  activeTabId: string;
  rightElement?: React.ReactNode;
};

export const TabView = ({
  heading,
  onTabChange,
  activeTabId,
  rightElement,
  ...tabs
}: TabViewProps) => {
  const tabItems = Object.values(tabs).map((t) => ({
    id: t.id,
    label: t.label,
    isDisabled: t.isDisabled,
  }));

  const tabContent = Object.values(tabs).map((t) => ({
    id: t.id,
    content: t.content,
  }));

  return (
    <Box gap="lg" addlClassName="TabView">
      <div className="TabView__heading">
        {heading ? <TabViewHeading {...heading} /> : null}

        <div className="TabView__tabContainer">
          <Tabs
            tabs={tabItems}
            activeTabId={activeTabId}
            onChange={onTabChange}
          />
        </div>

        {rightElement ? (
          <div className="TabView__rightElement">{rightElement}</div>
        ) : null}
      </div>

      <div className="TabView__content">
        {tabContent.map((tc) => (
          <div key={tc.id} data-is-active={activeTabId === tc.id}>
            {tc.content}
          </div>
        ))}
      </div>
    </Box>
  );
};

type TabViewHeadingProps = (
  | {
      infoText: React.ReactNode | string;
      href?: undefined;
    }
  | {
      infoText?: undefined;
      href: string;
    }
  | { infoText?: undefined; href?: undefined }
) & {
  title: string;
  infoHoverText?: string;
};

const TabViewHeading = ({
  title,
  infoHoverText,
  infoText,
  href,
}: TabViewHeadingProps) => {
  const renderTitle = () => <PageHeader heading={title} />;

  if (href || infoText) {
    if (href) {
      return (
        <WithInfoText href={href} infoHoverText={infoHoverText}>
          {renderTitle()}
        </WithInfoText>
      );
    }

    return (
      <WithInfoText infoText={infoText} infoHoverText={infoHoverText}>
        {renderTitle()}
      </WithInfoText>
    );
  }

  return renderTitle();
};
