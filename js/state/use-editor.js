const fontState = Recoil.atom({
  key: "editorState",
  default: "Select",
});

function useEditor() {
  const [font, setFont] = Recoil.useRecoilState(fontState);


  return {
    font,
    setFont,
  };
}
