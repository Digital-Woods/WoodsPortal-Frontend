import {
  atom,
  useRecoilState,
  useSetRecoilState,
  snapshot_UNSTABLE
} from 'recoil';

export const syncState = atom({
  key: "syncState",
  default: false,
});

export const syncLoadingState = atom({
  key: "syncLoadingState",
  default: false,
});

export const syncDisableState = atom({
  key: "syncDisableState",
  default: false,
});

function useSync() {
  export const [sync, setSyncStatus] = useRecoilState(syncState);
  export const [isSyncLoading, setLoader] = useRecoilState(syncLoadingState);
  export const [isSyncDisable, setSyncDisable] =
    useRecoilState(syncDisableState);

  export const setIsSyncLoading = (status: any) => {
    setLoader(status);
    setSyncStatus(status);
  };

  export const setSync = (status: any) => {
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

export const getRecoilSyncState = async () => {
  export const snapshot = snapshot_UNSTABLE();
  export const value = await snapshot.getLoadable(syncDisableState).valueOrThrow();
  return value;
};

let setMySyncDisableAtom = null;

export const RecoilSyncStore = () => {
  setMySyncDisableAtom = useSetRecoilState(syncDisableState);
  return null; // No UI needed
};

export const updateSyncDisableState = (newVal: any) => {
  if (syncDisableState) setMySyncDisableAtom = newVal;
};
