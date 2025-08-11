import { useAtom } from "jotai";
import { toasterState} from '@/state/store';

export function useToaster() {
  const [toaster, setToaster] = useAtom(toasterState);

  return {
    toaster,
    setToaster,
  };
}
