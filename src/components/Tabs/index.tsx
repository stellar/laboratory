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
}: {
  tabs: Tab[];
  activeTabId: string;
  onChange: (id: string) => void;
}) => {
  return (
    <div className="Tabs">
      {tabs.map((t) => (
        <div
          key={t.id}
          className="Tab"
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
