// const { atom } = Recoil;

const themeModeState = Recoil.atom({
  key: "themeModeState",
  default: localStorage.theme,
});

function useTheme() {
  const [themeMode, setThemeMode] = Recoil.useRecoilState(themeModeState);

  return {
    themeMode,
    setThemeMode
  };
}
