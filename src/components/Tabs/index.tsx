import Link from "next/link";
import { usePathname } from "next/navigation";

import "./styles.scss";

type Tab = {
  id: string;
  label: string;
  href?: string;
  isDisabled?: boolean;
};

export const Tabs = ({
  tabs,
  activeTabId,
  onChange,
  addlClassName,
}: {
  tabs: Tab[];
  activeTabId?: string;
  onChange?: (id: string) => void;
  addlClassName?: string;
}) => {
  const pathname = usePathname();

  return (
    <div className="Tabs">
      {tabs.map((t) => {
        const isActive = t.href ? pathname === t.href : t.id === activeTabId;
        const className = `Tab ${addlClassName ?? ""}`;

        if (t.href) {
          return (
            <Link
              key={t.id}
              href={t.href}
              className={`external-link ${className}`}
              data-testid={t.id}
              data-is-active={isActive}
              data-is-disabled={t.isDisabled ?? undefined}
            >
              {t.label}
            </Link>
          );
        }

        return (
          <div
            key={t.id}
            className={className}
            data-testid={t.id}
            data-is-active={isActive}
            {...{
              "data-is-disabled": t.isDisabled ?? undefined,
              onClick:
                !t.isDisabled && onChange ? () => onChange(t.id) : undefined,
            }}
          >
            {t.label}
          </div>
        );
      })}
    </div>
  );
};
