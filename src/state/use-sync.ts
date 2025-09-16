import { useAtom } from 'jotai';
import {
  apiSyncState,
  syncState,
  syncLoadingState,
  syncDisableState,
} from '@/state/store';

export function useSync() {
  const [apiSync, setApiSyncStatus] = useAtom(apiSyncState);
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

  const setApiSync = (status: boolean) => {
    setLoader(status);
    setSyncStatus(status);
    setApiSyncStatus(status);
  };

  return {
    apiSync,
    setApiSync,
    sync,
    setSync,
    isSyncLoading,
    setIsSyncLoading,
    isSyncDisable,
    setSyncDisable,
  };
}
