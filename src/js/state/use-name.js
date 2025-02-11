
// const { atom } = Recoil;

const nameState = Recoil.atom({
  key: "nameState",
  default: "",
});

function useName() {
  const [yourName, setYourName] = Recoil.useRecoilState(nameState);

  return {
    yourName,
    setYourName
  };
}
