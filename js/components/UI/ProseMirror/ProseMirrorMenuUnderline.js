const { toggleMark: toggleMark2 } = window.toggleMark;
const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const underlineMenuItem = new MenuItem2({
  title: "Underline",
  // label: "U",
  icon: {
    dom: (() => {
      const span = document.createElement("span");
      span.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>
`;
      span.className = "custom-menu-icon";
      return span;
    })(),
  },
  enable: (state) => toggleMark2(state.schema.marks.underline)(state),
  // run: toggleMark2(schema.marks.underline),
  run: (state, dispatch) => {
    // toggleMark2(schema.marks.underline),
    toggleMark2(state.schema.marks.underline)(state, dispatch);
    // updateMenuState(editor); // Call function to update menu state
  },
});