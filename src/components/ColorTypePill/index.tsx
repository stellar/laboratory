import "./styles.scss";

export const ColorTypePill = ({ type }: { type: string }) => {
  const lowercaseType = type?.toLowerCase();

  return (
    <div className="ColorTypePill">
      <div
        className="ColorTypePill__value"
        {...(lowercaseType ? { "data-type": lowercaseType } : {})}
      >
        {lowercaseType}
      </div>
    </div>
  );
};
