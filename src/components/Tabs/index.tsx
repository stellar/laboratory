import "./styles.scss";

type Tab = {
  id: string;
  label: string;
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
          data-is-active={t.id === activeTabId}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
};
