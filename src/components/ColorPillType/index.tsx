import "./styles.scss";

export const ColorPillType = ({ type }: { type: string }) => {
  const lowercaseType = type?.toLowerCase();

  return (
    <div className="ColorPillType">
      <div
        className="ColorPillType__value"
        {...(lowercaseType ? { "data-type": lowercaseType } : {})}
      >
        {lowercaseType}
      </div>
    </div>
  );
};
