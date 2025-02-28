const alignments = [
  {
    label: "Left",
    value: "left",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Center",
    value: "center",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Right",
    value: "right",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`,
  },
];

let defaultEditorAlignment = null;

const DropdownAlightMenu = ({ editorView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textAlign, setTextAlign] = useState(alignments[0]);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(event.target) &&
      dropdownButtonRef.current &&
      !dropdownButtonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  // useEffect(() => {
  //   if (defaultEditorAlignment && textAlign)
  //     applyAlignment(editorView.state, editorView.dispatch, textAlign.value);
  // }, [defaultEditorAlignment, textAlign]);

  const changeAlignment = (alignment) => {
    applyAlignment(editorView.state, editorView.dispatch, alignment.value);
  }

  useEffect(() => {
    if (defaultEditorAlignment) setTextAlign(defaultEditorAlignment);
  }, [defaultEditorAlignment]);

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Text Alignment"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        {/* <div id="textAlignIcon">
          <SvgRenderer svgContent={textAlign.icon} />
        </div> */}
        <div
          id="defaultEditorAlignment"
          className={`note-menuitem ${
            defaultEditorAlignment ? "note-active-state" : ""
          }`}
        >
          <div id="textAlignIcon">
            <SvgRenderer svgContent={textAlign?.icon} />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
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
          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded-sm z-10"
        >
          <ul class="space-y-2 note-dd-Select-menu list-none list-inside dark:text-gray-400">
            {alignments.map((alignment) => (
              <li
                key={alignment.value}
                // className="cursor-pointer hover:note-active-state px-4 py-1"
                className={`cursor-pointer note-dd-Select-menu-options hover:bg-[#e5f5f8]  py-1 ${defaultEditorAlignment?.value === alignment.value ? 'bg-gray-100' : 'bg-none'}`}
                onClick={() => {
                  // setTextAlign(alignment);
                  changeAlignment(alignment);
                  defaultEditorAlignment = alignment;
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
    const editorListButton = document.querySelector("#textAlignIcon");

    if (isAlignmentLeft) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`;
      document.getElementById("defaultEditorAlignment")?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[0];
    }
    if (isAlignmentCenter) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`;
      document.getElementById("defaultEditorAlignment")?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[1];
    }
    if (isAlignmentRight) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`;
      document.getElementById("defaultEditorAlignment")?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[2];
    }
    if(!isAlignmentLeft && !isAlignmentCenter && !isAlignmentRight && editorListButton) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`;
      document.getElementById("defaultEditorAlignment")?.classList.remove("note-active-state");
      defaultEditorAlignment = "";
    }
    return true;
  },
  render: (editorView) => renderReactAlignComponent(editorView),
});
