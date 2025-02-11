// const { atom } = Recoil;

const routeState = Recoil.atom({
  key: "routeState",
  default: [],
});

function useRoute() {
  const [routes, setRoutes] = Recoil.useRecoilState(routeState);

  return {
    routes,
    setRoutes
  };
}
