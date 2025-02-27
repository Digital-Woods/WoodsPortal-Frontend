const textFonts = [
  {
    label: "Sans Serif",
    key: "sans-serif",
  },
  {
    label: "Serif",
    key: "serif",
  },
  {
    label: "Monospace",
    key: "monospace",
  },
  {
    label: "Georgia",
    key: "Georgia",
  },
  {
    label: "Tahoma",
    key: "Tahoma",
  },
  {
    label: "Trebuchet MS",
    key: "Trebuchet MS",
  },
  {
    label: "Verdana",
    key: "Verdana",
  },
];

// Helper: Traverses the selection to find the first fontFamily mark.
// const getFontFamilyFromSelection = (state) => {
//   const { from, to } = state.selection;
//   const markType = state.schema.marks.fontFamily;
//   let fontFamily = null;

//   state.doc.nodesBetween(from, to, (node) => {
//     if (node.marks && node.marks.length) {
//       const mark = node.marks.find((m) => m.type === markType);
//       if (mark) {
//         fontFamily = mark.attrs.font;
//         // Stop traversing early if a font is found.
//         return false;
//       }
//     }
//   });
//   return fontFamily;
// };

const getFontFamilyFromSelection = (state) => {
  const { from, to, empty } = state.selection;
  const markType = state.schema.marks.fontFamily;
  let fontFamily = null;

  if (!markType) return null; // Ensure the mark exists

  // If selection is empty (cursor position), check previous character
  if (empty && from > 0) {
    const prevNode = state.doc.nodeAt(from - 1);
    if (prevNode && prevNode.marks) {
      const mark = prevNode.marks.find((m) => m.type === markType);
      if (mark) {
        return mark.attrs.font;
      }
    }
  }

  // Normal selection case
  state.doc.nodesBetween(from, to, (node) => {
    if (node.marks && node.marks.length) {
      const mark = node.marks.find((m) => m.type === markType);
      if (mark) {
        fontFamily = mark.attrs.font;
        return false; // Stop early when we find a font
      }
    }
  });

  return fontFamily;
};

const ProseMirrorPlugin2 = window.ProseMirrorPlugin;
const ProseMirrorPluginKey2 = window.ProseMirrorPluginKey;

// Create a plugin key for later access.
const fontSelectionPluginKey = new ProseMirrorPluginKey2("fontSelection");

// Create the plugin.
const fontSelectionPlugin = new ProseMirrorPlugin2({
  key: fontSelectionPluginKey,
  state: {
    init(_config, state) {
      // Calculate the initial font value from the selection (if any).
      return getFontFamilyFromSelection(state) || null;
    },
    apply(tr, value, oldState, newState) {
      // When the document changes or selection is updated, recalc the font.
      if (tr.docChanged || tr.selectionSet) {
        return getFontFamilyFromSelection(newState) || null;
      }
      return value;
    },
  },
});

let defaultEditorFont = null;

const DropdownFontMenu = ({ editorView, activeFont2 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [font, setFont] = useState(textFonts[0]);

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

  const applyFontFamily = (font) => {
    return (state, dispatch) => {
      const { schema, selection } = state;
      const { from, to } = selection;
      const markType = schema.marks.fontFamily;

      if (!markType) return false;

      const attrs = { font };
      const tr = state.tr;

      if (selection.empty) {
        // Apply as stored mark if no selection
        tr.addStoredMark(markType.create(attrs));
      } else {
        // Apply to the selected range
        tr.addMark(from, to, markType.create(attrs));
      }

      if (dispatch) dispatch(tr);
      setIsOpen(false);
      return true;
    };
  };

  useEffect(() => {
    if (defaultEditorFont) setFont(defaultEditorFont);
  }, [defaultEditorFont]);

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Fonts"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <div
          id="defaultEditorFont"
          className={`min-w-[130px] note-font-dropdown-menu ${
            defaultEditorFont ? "note-active-state" : ""
          }`}
        >
          <span id="textFontIcon">
            {defaultEditorFont ? defaultEditorFont?.label : font.label}
          </span>
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
          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded z-10"
        >
          <ul class="space-y-2 note-dd-Select-menu list-none min-w-[105px] list-inside dark:text-gray-400">
            {textFonts.map((textFont) => (
              <li
                key={textFont.key}
                className={`cursor-pointer min-w-[130px] note-dd-Select-menu-options hover:bg-[#e5f5f8] dark:text-[#666666] py-1 ${defaultEditorFont?.key === textFont.key ? 'bg-gray-100' : 'bg-none'}`}
                onClick={() => {
                  setFont(textFont);
                  defaultEditorFont = textFont;
                  applyFontFamily(textFont.key)(
                    editorView.state,
                    editorView.dispatch
                  );
                }}
              >
                {textFont.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const renderReactFontComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<DropdownFontMenu editorView={editorView} />, container);
  return container;
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const fontMenuItem = new MenuItem2({
  title: `Fonts`,
  run: (state, dispatch, editorView) => {
    const newFont = fontSelectionPluginKey.getState(state); // Example selected font
    const tr = state.tr;
    console.log("newFont", newFont);
    // Set the font selection in the plugin state
    tr.setMeta(fontSelectionPluginKey, newFont);
    // Dispatch the transaction to update the plugin state
    dispatch(tr);
    // Update the editor state so the plugin state is re-read and the component can re-render
    editorView.updateState(state); // This will trigger a re-render in ProseMirror and React
  },
  select: (state) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = fontSelectionPluginKey.getState(state) || true;
    const selectedEditorFont = fontSelectionPluginKey.getState(state);
    const font = textFonts.find((font) => font.key === selectedEditorFont);

    // defaultEditorFont = font

    const div = document.getElementById("textFontIcon");
    if (div && selectedEditorFont) {
      div.textContent = font.label; // Change text content
      document.getElementById("defaultEditorFont")?.classList.add("note-active-state");
    }
    if (div && !selectedEditorFont) {
      div.textContent = "Sans Serif"; // Change text content
      document.getElementById("defaultEditorFont")?.classList.remove("note-active-state");
    }
    return activeFont !== null;
  },
  render: (editorView) => renderReactFontComponent(editorView),
  // active: (state) => {
  //   const selectedFont = fontSelectionPluginKey.getState(state);
  //   return selectedFont ? true : false;
  // },
});
