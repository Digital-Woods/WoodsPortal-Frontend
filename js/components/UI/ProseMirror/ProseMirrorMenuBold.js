const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;
const { toggleMark: toggleMark2 } = window.toggleMark;

const boldItem = new MenuItem2({
  title: "Bold",
  // label: "Bold",
  icon: {
    dom: (() => {
      const span = document.createElement("span");
      span.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>
`;
      span.className = "custom-menu-icon";
      return span;
    })(),
  },
  enable: (state) => toggleMark2(state.schema.marks.strong)(state),
  run: (state, dispatch) => {
    toggleMark2(state.schema.marks.strong)(state, dispatch);
    // updateMenuState(editor); // Call function to update menu state
  },
});