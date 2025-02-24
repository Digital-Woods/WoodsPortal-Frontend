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

const EditorBoldMenu = ({ editorView }) => {
  const boldIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>`;
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
          <SvgRenderer svgContent={boldIcon} />
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
    if (editorListButton && isMarkActive(state, state.schema.marks.strong)) {
      editorListButton.classList.add("note-active-state");
    } 
    if (editorListButton && !isMarkActive(state, state.schema.marks.strong)) {
      editorListButton.classList.remove("note-active-state");
    }
    return true;
  },
  render: (editorView) => renderReactBoldComponent(editorView),
});
