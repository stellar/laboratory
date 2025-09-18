import "./styles.scss";

type Tab = {
  id: string;
  label: string;
  isDisabled?: boolean;
};

export const Tabs = ({
  tabs,
  activeTabId,
  onChange,
  addlClassName,
}: {
  tabs: Tab[];
  activeTabId: string;
  onChange: (id: string) => void;
  addlClassName?: string;
}) => {
  return (
    <div className="Tabs">
      {tabs.map((t) => (
        <div
          key={t.id}
          className={`Tab ${addlClassName ?? ""}`}
          data-testid={`${t.id}`}
          data-is-active={t.id === activeTabId}
          {...{
            "data-is-disabled": t.isDisabled ?? undefined,
            onClick: !t.isDisabled ? () => onChange(t.id) : undefined,
          }}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
};
