import { useRef, useState } from "react";

export const useElementSize = () => {
  const [inputWidth, setInputWidth] = useState<number>();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const inputRef = (node: HTMLDivElement | null) => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    if (node) {
      setInputWidth(node.offsetWidth);

      resizeObserverRef.current = new ResizeObserver((entries) => {
        setInputWidth(entries[0].contentRect.width);
      });
      resizeObserverRef.current.observe(node);
    }
  };

  return { width: inputWidth, ref: inputRef };
};
