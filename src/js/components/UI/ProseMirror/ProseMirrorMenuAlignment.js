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

// Update image alignment based on selection
// let transactionQueued = false;
const updateImageAlignment = (node, view, getPos, alignment) => {
  // if (transactionQueued) return;

  // transactionQueued = true;
  requestAnimationFrame(() => {
    const { state, dispatch } = view;
    const pos = getPos();

    if (pos === null || pos < 0 || pos >= state.doc.content.size) {
      console.error("Invalid position for node update");
      // transactionQueued = false;
      return;
    }

    let tr = state.tr;

    if (node.attrs.wrap) {
      // If the node is already wrapped, update the wrapping style for alignment
      const newAttrs = {
        ...node.attrs,
        wrap: true, // Maintain wrap attribute
        style: `text-align: ${alignment};`,
      };
      tr = tr.setNodeMarkup(pos, null, newAttrs);
    } else {
      // If not wrapped, wrap with a <div> and add style: text-align attribute
      const wrapperAttrs = {
        ...node.attrs,
        wrap: true, // Add wrap attribute to indicate it's wrapped
        style: `text-align: ${alignment};`,
      };

      tr = tr.replaceWith(
        pos,
        pos + node.nodeSize,
        state.schema.nodes.image.create(wrapperAttrs) // Replacing with wrapped image node
      );
    }

    tr = tr.setSelection(NodeSelection.create(tr.doc, pos)); // Keep selection in sync

    if (tr.docChanged) {
      dispatch(tr);
    }
    // transactionQueued = false;
  });
};

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

    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "image") {
        updateImageAlignment(node, editorView, () => pos, align);
        return true;
      }
    });

   
    let selectedPaddingLeft = null ; 

    state.doc.nodesBetween(from, to, (node) => {
      if (node.type === nodeType) {
        selectedPaddingLeft = node.attrs.paddingLeft
      }
    });

    let attrs = {
      align: align,
    }
    if(selectedPaddingLeft) attrs.paddingLeft = selectedPaddingLeft;


    if (dispatch) {
      dispatch(state.tr.setBlockType(from, to, nodeType, attrs));
    }

    setIsOpen(false);
    return true;
  };

  // useEffect(() => {
  //   if (defaultEditorAlignment && textAlign)
  //     applyAlignment(editorView.state, editorView.dispatch, textAlign.value);
  // }, [defaultEditorAlignment, textAlign]);

  const changeAlignment = (alignment) => {
    applyAlignment(editorView.state, editorView.dispatch, alignment.value);
  };

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
                className={`cursor-pointer note-dd-Select-menu-options hover:bg-[#e5f5f8]  py-1 ${
                  defaultEditorAlignment?.value === alignment.value
                    ? "bg-gray-100"
                    : "bg-none"
                }`}
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

function isImageSelected(state) {
  const { from } = state.selection;
  const node = state.doc.nodeAt(from);
  return node && node.type.name === "image" ? node : false;
}

const alignmentDropdown = new MenuItem2({
  title: `Select Alignment`,
  run: () => {},
  select: (state) => {
    let isAlignmentLeft = isAlignmentActive(state, "left");
    let isAlignmentCenter = isAlignmentActive(state, "center");
    let isAlignmentRight = isAlignmentActive(state, "right");
    let editorListButton = document.querySelector("#textAlignIcon");

    const imageNode = isImageSelected(state);
    if (imageNode) {
      const figureStyle = imageNode?.attrs?.style || "";
      isAlignmentLeft = figureStyle.includes("text-align: left;");
      isAlignmentCenter = figureStyle.includes("text-align: center;");
      isAlignmentRight = figureStyle.includes("text-align: right;");
    }

    if (isAlignmentLeft && editorListButton) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`;
      document
        .getElementById("defaultEditorAlignment")
        ?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[0];
    }
    if (isAlignmentCenter && editorListButton) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`;
      document
        .getElementById("defaultEditorAlignment")
        ?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[1];
    }
    if (isAlignmentRight && editorListButton) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`;
      document
        .getElementById("defaultEditorAlignment")
        ?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[2];
    }
    if (
      !isAlignmentLeft &&
      !isAlignmentCenter &&
      !isAlignmentRight &&
      editorListButton
    ) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`;
      document
        .getElementById("defaultEditorAlignment")
        ?.classList.remove("note-active-state");
      defaultEditorAlignment = "";
    }
    return true;
  },
  render: (editorView) => renderReactAlignComponent(editorView),
});
