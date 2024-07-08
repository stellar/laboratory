import { useRouter } from "next/navigation";
import { Button } from "@stellar/design-system";
import { Routes } from "@/constants/routes";
import { useStore } from "@/store/useStore";

export const ViewInXdrButton = ({ xdrBlob }: { xdrBlob: string }) => {
  const { xdr } = useStore();
  const router = useRouter();

  return (
    <Button
      size="md"
      variant="tertiary"
      onClick={() => {
        xdr.updateXdrBlob(xdrBlob);
        xdr.updateXdrType("TransactionEnvelope");

        router.push(Routes.VIEW_XDR);
      }}
    >
      View in XDR viewer
    </Button>
  );
};
