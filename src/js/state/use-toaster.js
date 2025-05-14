const toasterState = Recoil.atom({
  key: "toasterState",
  default: null,
});

function useToaster() {
  const [toaster, setToaster] = Recoil.useRecoilState(toasterState);

  return {
    toaster,
    setToaster,
  };
}
