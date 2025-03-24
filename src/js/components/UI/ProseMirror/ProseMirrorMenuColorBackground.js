// Helper: Traverses the selection to find the first fontFamily mark.
// const getTextBGColorFromSelection = (state) => {
//   const { from, to } = state.selection;
//   const markType = state.schema.marks.textBackgroundColor;
//   let textBackgroundColor = null;

//   state.doc.nodesBetween(from, to, (node) => {
//     if (node.marks && node.marks.length) {
//       const mark = node.marks.find((m) => m.type === markType);
//       if (mark) {
//         textBackgroundColor = mark.attrs.color;
//         // Stop traversing early if a font is found.
//         return false;
//       }
//     }
//   });
//   return textBackgroundColor;
// };

const getTextBGColorFromSelection = (state) => {
  const { from, to, empty } = state.selection;
  const markType = state.schema.marks.textBackgroundColor;
  let textBackgroundColor = null;

  if (!markType) return null; // Ensure the mark exists

  // If selection is empty (cursor position), check previous character
  // if (empty && from > 0) {
  //   const prevNode = state.doc.nodeAt(from - 1);
  //   if (prevNode && prevNode.marks) {
  //     const mark = prevNode.marks.find((m) => m.type === markType);
  //     if (mark) {
  //       return mark.attrs.color;
  //     }
  //   }
  // }
  if (empty) {
    const storedMark = state.storedMarks?.find((m) => m.type === markType);

    if (storedMark) {
      return storedMark.attrs.color;
    }

    // Fallback: Check marks at cursor position
    const marksAtCursor = state.selection.$from.marks();
    const mark = marksAtCursor.find((m) => m.type === markType);
    if (mark) {
      return mark.attrs.color;
    }
  }

  // Normal selection case
  state.doc.nodesBetween(from, to, (node) => {
    if (node.marks && node.marks.length) {
      const mark = node.marks.find((m) => m.type === markType);
      if (mark) {
        textBackgroundColor = mark.attrs.color;
        return false; // Stop early when we find the color
      }
    }
  });

  return textBackgroundColor;
};


const ProseMirrorPlugin2 = window.ProseMirrorPlugin;
const ProseMirrorPluginKey2 = window.ProseMirrorPluginKey;

// Create a plugin key for later access.
const textBGColorPluginKey = new ProseMirrorPluginKey2("textColor");

// Create the plugin.
const textBGColorPlugin = new ProseMirrorPlugin2({
  key: textBGColorPluginKey,
  state: {
    init(_config, state) {
      // Calculate the initial font value from the selection (if any).
      return getTextBGColorFromSelection(state) || null;
    },
    apply(tr, value, oldState, newState) {
      // When the document changes or selection is updated, recalc the font.
      if (tr.docChanged || tr.selectionSet) {
        return getTextBGColorFromSelection(newState) || null;
      }
      return value;
    },
  },
});

let defaultTextBGColor = "#fff";
let selectedTextBGColor = "";

const DropdownColorMenu2 = ({ editorView, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("");

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

  const applyTextBackgroundColor = (color) => {
    return (state, dispatch) => {
      const { schema, selection } = state;
      const { from, to } = selection;
      const markType = schema.marks.textBackgroundColor;

      // console.log("markType", markType);

      if (!markType) return false;

      const attrs = { color };
      const tr = state.tr;

      if (selection.empty) {
        // Apply as stored mark if no selection
        tr.addStoredMark(markType.create(attrs));
      } else {
        // Apply to the selected range
        tr.addMark(from, to, markType.create(attrs));
      }

      if (dispatch) dispatch(tr);
      return true;
    };
  };

  useEffect(() => {
    if (color) {
      // console.log('color', color)
      applyTextBackgroundColor(color)(editorView.state, editorView.dispatch);
      const div = document.getElementById("text-bg-color-svg");
      if (div) {
        div.setAttribute("fill", color);
      }
    }
  }, [color]);

  return (
    <div className="">
      <div
        class="ProseMirror-icon note-menuitem"
        title="Text highlight"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <span class="custom-menu-icon">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#666666"
          >
            <path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z" />
          </svg> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
          >
            <path d="M80 0v-160h800V0H80Z"  fill={defaultTextBGColor} id="text-bg-color-svg" />
            <path
              d="M160-320h56l312-311-29-29-28-28-311 312v56Z"
              fill="#666666"
            />
            <path
              d="M80-240v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Z"
              fill="#666666"
            />
            <path d="M720-744l-56-56 56 56Z" fill="#666666" />
            <path d="M608-631l-29-29-28-28 57 57Z" fill="#666666" />
          </svg>
        </span>
      </div>
      {isOpen && (
        <div
          ref={dropdownMenuRef}
          // className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white shadow-lg rounded w-48 z-10"
          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded w-60 z-10"
        >
          <ColorPicker
            color={color}
            setColor={setColor}
            setIsOpen={setIsOpen}
            defaultTextColor={defaultTextBGColor}
          />
        </div>
      )}
    </div>
  );
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;


const renderReactComponent2 = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(
    <DropdownColorMenu2
      editorView={editorView}
      icon={`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#666666"><path d="M80 0v-160h800V0H80Zm140-280 210-560h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"/></svg>`}
    />,
    container
  );
  return container;
};
const textBGColor = new MenuItem2({
  title: `Text highlight`,
  // run: (state, dispatch, editorView) => {
  //   const newFont = textBGColorPluginKey.getState(state); // Example selected font
  //   const tr = state.tr;
  //   // Set the font selection in the plugin state
  //   tr.setMeta(textBGColorPluginKey, newFont);
  //   // Dispatch the transaction to update the plugin state
  //   dispatch(tr);
  //   // Update the editor state so the plugin state is re-read and the component can re-render
  //   editorView.updateState(state); // This will trigger a re-render in ProseMirror and React
  // },
  run: () => {},
  select: (state) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = textBGColorPluginKey.getState(state) || true;
    // selectedTextBGColor = textBGColorPluginKey.getState(state);
    selectedTextBGColor = getTextBGColorFromSelection(state);
    const div = document.getElementById("text-bg-color-svg");
    if (div && selectedTextBGColor) {
      div.setAttribute("fill", selectedTextBGColor);
    }
    if (div && !selectedTextBGColor) {
      div.setAttribute("fill", "#fff");
    }
    return activeFont !== null;
  },
  render: (editorView) => renderReactComponent2(editorView),
});
