import { useAtom } from "jotai";
import { nameState} from '@/state/store';

export function useName() {
  const [yourName, setYourName] = useAtom(nameState);

  return {
    yourName,
    setYourName
  };
}
