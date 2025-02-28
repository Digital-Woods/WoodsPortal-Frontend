// const { toggleMark: toggleMark2 } = window.toggleMark;
// const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

// const underlineMenuItem = new MenuItem2({
//   title: "Underline",
//   // label: "U",
//   icon: {
//     dom: (() => {
//       const span = document.createElement("span");
//       span.innerHTML = `
//       <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>
// `;
//       span.className = "custom-menu-icon";
//       return span;
//     })(),
//   },
//   enable: (state) => toggleMark2(state.schema.marks.underline)(state),
//   // run: toggleMark2(schema.marks.underline),
//   run: (state, dispatch) => {
//     // toggleMark2(schema.marks.underline),
//     toggleMark2(state.schema.marks.underline)(state, dispatch);
//     // updateMenuState(editor); // Call function to update menu state
//   },
// });

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;
const { toggleMark: toggleMark2 } = window.toggleMark;

const isUnderlineMarkActive = (state, markType) => {
  const { from, to, empty } = state.selection;
  if (empty) {
    return !!markType.isInSet(
      state.storedMarks || state.selection.$from.marks()
    );
  } else {
    let hasMark = false;
    state.doc.nodesBetween(from, to, (node) => {
      if (node.marks.some((mark) => mark.type === markType)) {
        hasMark = true;
      }
    });
    return hasMark;
  }
};

const EditorUnderlineMenu = ({ editorView }) => {
  const boldIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>`;
  const boldButtonRef = useRef(null);
  const [selectedEditorUnderline, setSelectedEditorUnderline] = useState(false);

  const toggleMenu = () => {
    const { state, dispatch } = editorView;
    setSelectedEditorUnderline(!selectedEditorUnderline);
    toggleMark2(state.schema.marks.underline)(state, dispatch);
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon"
        title="Underline"
        ref={boldButtonRef}
        onClick={toggleMenu}
      >
        <div
          id="selectedEditorUnderline"
          className={`note-menuitem ${selectedEditorUnderline ? "note-active-state" : ""}`}
        >
          <SvgRenderer svgContent={boldIcon} />
        </div>
      </div>
    </div>
  );
};

const renderReactUnderlineComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<EditorUnderlineMenu editorView={editorView} />, container);
  return container;
};

const underlineMenuItem = new MenuItem2({
  title: `Underline`,
  run: () => {},
  select: (state) => {
    const editorListButton = document.querySelector("#selectedEditorUnderline");
    if (editorListButton && isUnderlineMarkActive(state, state.schema.marks.underline)) {
      editorListButton.classList.add("note-active-state");
    } 
    if (editorListButton && !isUnderlineMarkActive(state, state.schema.marks.underline)) {
      editorListButton.classList.remove("note-active-state");
    }
    return true;
  },
  render: (editorView) => renderReactUnderlineComponent(editorView),
});
