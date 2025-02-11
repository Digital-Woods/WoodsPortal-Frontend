const breadcrumbState = Recoil.atom({
  key: "breadcrumbState",
  default: [],
});

function useBreadcrumb() {
  const [breadcrumbs, setBreadcrumbs] = Recoil.useRecoilState(breadcrumbState);

  return {
    breadcrumbs,
    setBreadcrumbs
  };
}
