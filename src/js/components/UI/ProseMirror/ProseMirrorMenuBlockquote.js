const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;
const { wrapIn } = window.wrapIn;

const blockquoteItem = new MenuItem2({
  title: "Wrap in Blockquote",
  // label: "Blockquote",
  icon: {
    dom: (() => {
      const span = document.createElement("span");
      span.innerHTML = `
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="24.000000pt" height="23.000000pt" viewBox="0 0 24.000000 23.000000"
        preserveAspectRatio="xMidYMid meet">
        <metadata>
        Created by potrace 1.10, written by Peter Selinger 2001-2011
        </metadata>
        <g transform="translate(0.000000,23.000000) scale(0.100000,-0.100000)"
        fill="#000000" stroke="none">
        <path d="M44 166 c-3 -7 -4 -35 -2 -62 3 -45 5 -49 31 -52 25 -3 27 -1 27 33
        0 28 -5 38 -20 42 -24 6 -26 21 -5 29 22 9 18 24 -5 24 -11 0 -23 -6 -26 -14z"/>
        <path d="M124 166 c-3 -7 -4 -35 -2 -62 3 -45 5 -49 31 -52 18 -2 29 2 33 12
        9 24 -4 66 -21 66 -8 0 -15 7 -15 15 0 8 7 15 15 15 8 0 15 5 15 10 0 15 -50
        12 -56 -4z"/>
        </g>
        </svg>
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
