
const { atom } = Recoil;

const isCollapsibleState = atom({
  key: "isCollapsibleState",
  default: false,
});

const isOpenState = atom({
  key: "isOpenState",
  default: false,
});

function useCollapsible() {
  const [sidebarCollapsed, setSidebarCollapsed] = Recoil.useRecoilState(isCollapsibleState);
  const [sidebarOpen, setSidebarOpen] = Recoil.useRecoilState(isOpenState);

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarOpen,
    setSidebarOpen,
  };
}
