import { useEffect, useState } from "react";
import * as StellarXdr from "@/helpers/StellarXdr";

export const useIsXdrInit = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Stellar XDR init
    const init = async () => {
      await StellarXdr.init();
      setIsReady(true);
    };

    init();
  }, []);

  return isReady;
};
