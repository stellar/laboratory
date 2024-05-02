import { ErrorListCard } from "@/components/ErrorListCard";

export const BuildingError = ({ errorList }: { errorList: string[] }) => {
  if (errorList.length === 0) {
    return null;
  }

  return (
    <ErrorListCard title="Transaction building errors:" errorList={errorList} />
  );
};
