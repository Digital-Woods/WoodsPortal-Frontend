const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;
const { wrapIn } = window.wrapIn;

const blockquoteItem = new MenuItem2({
  title: "Wrap in Blockquote",
  // label: "Blockquote",
  icon: {
    dom: (() => {
      const span = document.createElement("span");
      span.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m228-240 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T458-480L320-240h-92Zm360 0 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T818-480L680-240h-92ZM320-500q25 0 42.5-17.5T380-560q0-25-17.5-42.5T320-620q-25 0-42.5 17.5T260-560q0 25 17.5 42.5T320-500Zm360 0q25 0 42.5-17.5T740-560q0-25-17.5-42.5T680-620q-25 0-42.5 17.5T620-560q0 25 17.5 42.5T680-500Zm0-60Zm-360 0Z"/></svg>
`;
      span.className = "custom-menu-icon";
      return span;
    })(),
  },
  enable: (state) => wrapIn(state.schema.nodes.blockquote)(state),
  // run: (state, dispatch) =>
  //   wrapIn(schema.nodes.blockquote)(state, dispatch),
  run: (state, dispatch) => {
    wrapIn(state.schema.nodes.blockquote)(state, dispatch);
    // updateMenuState(editor); // Call function to update menu state
  },
});