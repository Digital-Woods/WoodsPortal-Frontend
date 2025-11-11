import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

export const useNavHeight = () => {
  const router = useRouter();

  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector("nav");
      if (nav) {
        document.documentElement.style.setProperty(
          "--nav-height",
          `${nav.offsetHeight}px`
        );
      }
    };

    // Initial run
    updateNavHeight();

    // Run on every route change
    const unsubscribe = router.subscribe(() => {
      requestAnimationFrame(updateNavHeight);
    });

    // Optional: also run on resize
    window.addEventListener("resize", updateNavHeight);

    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", updateNavHeight);
    };
  }, [router]);
};
