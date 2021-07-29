import { MutableRefObject, useEffect, useRef } from "react";

const useClickOutside = (
  onClickOutside: () => void
): MutableRefObject<HTMLDivElement | null> => {
  const domNode = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function wasClickOutside(event: MouseEvent) {
      if (!domNode.current?.contains(event.target as Node)) {
        // If it was, execute the function
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", wasClickOutside);

    return () => {
      document.removeEventListener("mousedown", wasClickOutside);
    };
  });

  return domNode;
};

export default useClickOutside;
