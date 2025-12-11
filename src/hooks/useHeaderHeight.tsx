import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

type HeaderHeightContextType = {
  headerHeight: number;
  setHeaderRef: (ref: HTMLDivElement | null) => void;
};

const HeaderHeightContext = createContext<HeaderHeightContextType | undefined>(
  undefined,
);

export const HeaderHeightProvider = ({ children }: { children: ReactNode }) => {
  const [headerHeight, setHeaderHeight] = useState(52); // Default fallback
  const headerRef = useRef<HTMLDivElement | null>(null);

  const setHeaderRef = (ref: HTMLDivElement | null) => {
    headerRef.current = ref;
  };

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const updateHeight = () => {
      setHeaderHeight(headerElement.offsetHeight);
    };

    // Set initial height
    updateHeight();

    // Watch for changes
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(headerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <HeaderHeightContext.Provider value={{ headerHeight, setHeaderRef }}>
      {children}
    </HeaderHeightContext.Provider>
  );
};

export const useHeaderHeight = () => {
  const context = useContext(HeaderHeightContext);
  if (!context) {
    throw new Error("useHeaderHeight must be used within HeaderHeightProvider");
  }
  return context;
};
