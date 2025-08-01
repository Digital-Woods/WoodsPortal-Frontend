// const { atom } = Recoil;

const authorizationAtom = Recoil.atom({
  key: "authorizationAtom",
  default: checkHasAuthToken(),
});

function useAuth() {
  const [isAuthorized, setAuthorized] = Recoil.useRecoilState(authorizationAtom);

  return {
    setToken: setAuthToken,
    getToken: getAuthToken,
    isAuthorized,
    authorize(token) {
      setAuthToken(token);
      setAuthorized(true);
    },
    unauthorize() {
      setAuthorized(false);
      removeAuthToken();
    },
  };
}

const userDetailsAtom = atom({
  key: "userDetailsAtom",
  default: null,
});
