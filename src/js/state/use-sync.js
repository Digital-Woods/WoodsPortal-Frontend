const syncState = Recoil.atom({
  key: "syncState",
  default: false,
});

const syncLoadingState = Recoil.atom({
  key: "syncLoadingState",
  default: false,
});

const syncDisableState = Recoil.atom({
  key: "syncDisableState",
  default: false,
});

function useSync() {
  const [sync, setSyncStatus] = Recoil.useRecoilState(syncState);
  const [isSyncLoading, setLoader] = Recoil.useRecoilState(syncLoadingState);
  const [isSyncDisable, setSyncDisable] =
    Recoil.useRecoilState(syncDisableState);

  const setIsSyncLoading = (status) => {
    setLoader(status);
    setSyncStatus(status);
  };

  const setSync = (status) => {
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

const getRecoilSyncState = async () => {
  const snapshot = Recoil.snapshot_UNSTABLE();
  const value = await snapshot.getLoadable(syncDisableState).valueOrThrow();
  return value;
};

let setMySyncDisableAtom = null;

const RecoilSyncStore = () => {
  setMySyncDisableAtom = Recoil.useSetRecoilState(syncDisableState);
  return null; // No UI needed
};

const updateSyncDisableState = (newVal) => {
  if (syncDisableState) setMySyncDisableAtom(newVal);
};
