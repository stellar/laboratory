import { useRouter } from "next/navigation";
import { Button } from "@stellar/design-system";
import { Routes } from "@/constants/routes";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";
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
        xdr.updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);

        router.push(Routes.VIEW_XDR);
      }}
    >
      View in XDR viewer
    </Button>
  );
};
