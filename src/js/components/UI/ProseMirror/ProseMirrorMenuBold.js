const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;
const { toggleMark: toggleMark2 } = window.toggleMark;

const isBoldMarkActive = (state, markType) => {
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

const EditorBoldMenu = ({ editorView }) => {
  const boldButtonRef = useRef(null);
  const [selectedEditorBold, setSelectedEditorBold] = useState(false);

  const toggleMenu = () => {
    const { state, dispatch } = editorView;
    setSelectedEditorBold(!selectedEditorBold);
    // console.log('selectedEditorBold', selectedEditorBold)
    toggleMark2(state.schema.marks.strong)(state, dispatch);
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon"
        title="Bold"
        ref={boldButtonRef}
        onClick={toggleMenu}
      >
        <div
          id="selectedEditorBold"
          className={`note-menuitem  ${selectedEditorBold ? "note-active-state" : ""}`}
        >
          {/* <SvgRenderer svgContent={boldIcon} /> */}
          <BoldIcon/>
        </div>
      </div>
    </div>
  );
};

const renderReactBoldComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<EditorBoldMenu editorView={editorView} />, container);
  return container;
};

const boldItem = new MenuItem2({
  title: `Bold`,
  run: () => {},
  select: (state) => {
    const editorListButton = document.querySelector("#selectedEditorBold");
    if (editorListButton && isBoldMarkActive(state, state.schema.marks.strong)) {
      editorListButton.classList.add("note-active-state");
    } 
    if (editorListButton && !isBoldMarkActive(state, state.schema.marks.strong)) {
      editorListButton.classList.remove("note-active-state");
    }
    return true;
  },
  render: (editorView) => renderReactBoldComponent(editorView),
});
