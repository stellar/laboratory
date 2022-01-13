import { clickToSelect } from "../helpers/clickToSelect";

interface EasySelectProps {
  children: React.ReactNode;
  plain?: boolean;
}

// Clicking an EasySelect element will select the contents
export const EasySelect = ({ children, plain, ...props }: EasySelectProps) => {
  let className = "EasySelect";
  if (plain) {
    className = `${className} EasySelect__plain`;
  }

  return (
    <span className={className} onClick={clickToSelect} {...props}>
      {children}
    </span>
  );
};
