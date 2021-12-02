import { clickToSelect } from "../helpers/clickToSelect";

interface EasySelectProps {
  children: React.ReactNode;
  plain: boolean;
}

// Clicking an EasySelect element will select the contents
export const EasySelect = ({ children, plain }: EasySelectProps) => {
  let className = "EasySelect";
  if (plain) {
    className += " EasySelect__plain";
  }

  return (
    <span className={className} onClick={clickToSelect}>
      {children}
    </span>
  );
};
