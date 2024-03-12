import "./styles.scss";

export const ExpandBox = ({
  children,
  isExpanded,
}: {
  children: React.ReactNode;
  isExpanded: boolean;
}) => {
  return (
    <div className="ExpandBox" data-is-expanded={isExpanded}>
      <div className="ExpandBox__inset">{children}</div>
    </div>
  );
};
