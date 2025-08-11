import { useAtom } from 'jotai';
import {
  syncState,
  syncLoadingState,
  syncDisableState,
} from '@/state/store';

export function useSync() {
  const [sync, setSyncStatus] = useAtom(syncState);
  const [isSyncLoading, setLoader] = useAtom(syncLoadingState);
  const [isSyncDisable, setSyncDisable] = useAtom(syncDisableState);

  const setIsSyncLoading = (status: boolean) => {
    setLoader(status);
    setSyncStatus(status);
  };

  const setSync = (status: boolean) => {
    setLoader(status);
    setSyncStatus(status);
  };

  return {
    sync,
    setSync,
    isSyncLoading,
    setIsSyncLoading,
    isSyncDisable,
    setSyncDisable,
  };
}
