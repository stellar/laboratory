"use client";

import { ReactNode } from "react";
import Link from "next/link";

import { ProjectLogo, ThemeSwitch } from "@stellar/design-system";

import { MainNav } from "@/components/MainNav";
import { NetworkSelector } from "@/components/NetworkSelector";
import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { Hydration } from "@/components/Hydration";

export const LayoutMain = ({ children }: { children: ReactNode }) => {
  return (
    <div className="LabLayout">
      <div>
        <MaintenanceBanner />
        <div className="LabLayout__header">
          <header className="LabLayout__header__main">
            <ProjectLogo
              title="Laboratory"
              link="/"
              customAnchor={<Link href="/" prefetch={true} />}
            />

            <div className="LabLayout__header__settings">
              <Hydration>
                <ThemeSwitch storageKeyId="stellarTheme:Laboratory" />
              </Hydration>
              <NetworkSelector />
            </div>
          </header>
          <MainNav />
        </div>
      </div>

      <Hydration>{children}</Hydration>
    </div>
  );
};
