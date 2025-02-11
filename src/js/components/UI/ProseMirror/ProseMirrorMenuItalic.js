// const { toggleMark: toggleMark2 } = window.toggleMark;
// const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

// const italicItem = new MenuItem2({
//   title: "Italic",
//   // label: "Italic",
//   icon: {
//     dom: (() => {
//       const span = document.createElement("span");
//       span.innerHTML = `
// <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>
// `;
//       span.className = "custom-menu-icon";
//       return span;
//     })(),
//   },
//   enable: (state) => toggleMark2(state.schema.marks.em)(state),
//   // run: (state, dispatch) => toggleMark2(schema.marks.em)(state, dispatch),
//   run: (state, dispatch) => {
//     toggleMark2(state.schema.marks.em)(state, dispatch);
//     // updateMenuState(editor); // Call function to update menu state
//   },
// });

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;
const { toggleMark: toggleMark2 } = window.toggleMark;

const isMarkActive = (state, markType) => {
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

const EditorItalicMenu = ({ editorView }) => {
  const boldIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>`;
  const boldButtonRef = useRef(null);
  const [selectedEditorItalic, setSelectedEditorItalic] = useState(false);

  const toggleMenu = () => {
    const { state, dispatch } = editorView;
    setSelectedEditorItalic(!selectedEditorItalic);
    toggleMark2(state.schema.marks.em)(state, dispatch);
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon"
        title="Select Text Bold"
        ref={boldButtonRef}
        onClick={toggleMenu}
      >
        <div
          id="selectedEditorItalic"
          className={` ${selectedEditorItalic ? "bg-gray-200" : ""}`}
        >
          <SvgRenderer svgContent={boldIcon} />
        </div>
      </div>
    </div>
  );
};

const renderReactItalicComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<EditorItalicMenu editorView={editorView} />, container);
  return container;
};

const italicItem = new MenuItem2({
  title: `Italic`,
  run: () => {},
  select: (state) => {
    const editorListButton = document.querySelector("#selectedEditorItalic");
    if (editorListButton && isMarkActive(state, state.schema.marks.em)) {
      editorListButton.classList.add("bg-gray-200");
    } 
    if (editorListButton && !isMarkActive(state, state.schema.marks.em)) {
      editorListButton.classList.remove("bg-gray-200");
    }
    return true;
  },
  render: (editorView) => renderReactItalicComponent(editorView),
});
