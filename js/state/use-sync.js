const syncState = Recoil.atom({
  key: "syncState",
  default: false,
});

const syncLoadingState = Recoil.atom({
  key: "syncLoadingState",
  default: false,
});

function useSync() {
  const [sync, setSyncStatus] = Recoil.useRecoilState(syncState);
  const [isSyncLoading, setLoader] = Recoil.useRecoilState(syncLoadingState);

  const setIsSyncLoading = (status) => {
    console.log("setIsLoading", status)
    setLoader(status)
    setSyncStatus(status)
  }

  const setSync = (status) => {
    // console.log("setSync", status)
    setLoader(status)
    setSyncStatus(status)
  }

  return {
    sync,
    setSync,
    isSyncLoading,
    setIsSyncLoading,
  };
}
