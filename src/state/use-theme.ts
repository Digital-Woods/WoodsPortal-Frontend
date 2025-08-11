import { useAtom } from "jotai";
import { themeModeState} from '@/state/store';


export function useTheme() {
  const [themeMode, setThemeMode] = useAtom(themeModeState);

  return {
    themeMode,
    setThemeMode,
  };
}
