const alignments = [
  {
    label: "Left",
    value: "left",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Center",
    value: "center",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Right",
    value: "right",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`,
  },
];

let selectedEditorAlignment = "";

const DropdownAlightMenu = ({ editorView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textAlign, setTextAlign] = useState(alignments[0]);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const applyAlignment = (state, dispatch, align) => {
    const { schema, selection } = state;
    const nodeType = schema.nodes.paragraph;
    const { from, to } = selection;

    if (dispatch) {
      dispatch(state.tr.setBlockType(from, to, nodeType, { align }));
    }
    setIsOpen(false)
    return true;
  };

  useEffect(() => {
    if (selectedEditorAlignment && textAlign)
      applyAlignment(editorView.state, editorView.dispatch, textAlign.value);
  }, [selectedEditorAlignment, textAlign]);

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Select Text Alignment"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        {/* <div id="textAlignIcon">
          <SvgRenderer svgContent={textAlign.icon} />
        </div> */}
        <div
          className={`border border-gray-400 rounded-md p-2 flex justify-between items-center justify ${
            selectedEditorAlignment ? "bg-gray-200" : ""
          }`}
        >
          <div id="textAlignIcon">
            <SvgRenderer svgContent={textAlign?.icon} />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M480-360 280-560h400L480-360Z" />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div
          ref={dropdownMenuRef}
          // className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white shadow-lg rounded w-48 z-10"
          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded z-10"
        >
          <ul class="space-y-2 text-gray-500 list-none list-inside dark:text-gray-400">
            {alignments.map((alignment) => (
              <li
                key={alignment.key}
                className="cursor-pointer hover:bg-gray-200 px-4 py-1"
                onClick={() => {
                  setTextAlign(alignment);
                  selectedEditorAlignment = alignment.icon;
                }}
              >
                <SvgRenderer svgContent={alignment.icon} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const renderReactAlignComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<DropdownAlightMenu editorView={editorView} />, container);
  return container;
};

function isAlignmentActive(state, alignValue) {
  const { selection } = state;
  const { $from } = selection;

  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.attrs.align === alignValue) {
      return true;
    }
  }
  return false;
}

const alignmentDropdown = new MenuItem2({
  title: `Select Alignment`,
  run: () => {},
  select: (state) => {
    const isAlignmentLeft = isAlignmentActive(state, "left");
    const isAlignmentCenter = isAlignmentActive(state, "center");
    const isAlignmentRight = isAlignmentActive(state, "right");
    const editorListButton = document.querySelector("#textListIcon");
    if (isAlignmentLeft) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`;
    }
    if (isAlignmentCenter) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`;
    }
    if (isAlignmentRight) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`;
    }
    return true;
  },
  render: (editorView) => renderReactAlignComponent(editorView),
});
