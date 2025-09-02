import { useEffect } from "react";
import { useToaster } from "@/state/use-toaster";
import { toast, Toaster as SonnerToaster } from "sonner";

export const Toaster = () => {
  const { toaster, setToaster } = useToaster();

  useEffect(() => {
    if (!toaster) return;

    if (toaster.type === "success") {
      toast.success(toaster.message);
    } else if (toaster.type === "error") {
      toast.error(toaster.message);
    } else {
      toast(toaster.message);
    }

    // clear state after firing toast so it won't re-trigger
    setToaster(null);
  }, [toaster, setToaster]);

  // Mount Sonner’s Toaster provider globally
  return <SonnerToaster richColors position="top-center" />;
};
