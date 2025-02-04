const { toggleMark: toggleMark2 } = window.toggleMark;
const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const italicItem = new MenuItem2({
  title: "Italic",
  // label: "Italic",
  icon: {
    dom: (() => {
      const span = document.createElement("span");
      span.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>
`;
      span.className = "custom-menu-icon";
      return span;
    })(),
  },
  enable: (state) => toggleMark2(state.schema.marks.em)(state),
  // run: (state, dispatch) => toggleMark2(schema.marks.em)(state, dispatch),
  run: (state, dispatch) => {
    toggleMark2(state.schema.marks.em)(state, dispatch);
    // updateMenuState(editor); // Call function to update menu state
  },
});