import { useRef, useState, useEffect } from "react";

export const useIsEllipsisActive = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [isEllipsis, setIsEllipsis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setIsEllipsis(el.scrollWidth > el.clientWidth);
  }, [ref.current]);

  return { ref, isEllipsis };
};
