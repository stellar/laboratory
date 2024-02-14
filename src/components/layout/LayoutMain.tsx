"use client";

import { ReactNode } from "react";
import Link from "next/link";

import { ProjectLogo, ThemeSwitch } from "@stellar/design-system";

import { MainNav } from "@/components/MainNav";

export const LayoutMain = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="LabLayout__header">
        <header className="LabLayout__header__main">
          <ProjectLogo
            title="Laboratory"
            link="/"
            customAnchor={<Link href="/" />}
          />

          <div className="LabLayout__header__settings">
            <ThemeSwitch storageKeyId="stellarTheme:Laboratory" />
          </div>
        </header>
        <MainNav />
      </div>

      {children}
    </>
  );
};
