const textFontSizes = [
  {
    label: "8",
    value: "8pt",
  },
  {
    label: "9",
    value: "9pt",
  },
  {
    label: "10",
    value: "10pt",
  },
  {
    label: "11",
    value: "11pt",
  },
  {
    label: "12",
    value: "12pt",
  },
  {
    label: "14",
    value: "14pt",
  },
  {
    label: "18",
    value: "18pt",
  },
  {
    label: "24",
    value: "24pt",
  },
  {
    label: "36",
    value: "36pt",
  },
];

// Helper: Traverses the selection to find the first fontFamily mark.
const getFontSizeFromSelection = (state) => {
  const { from, to } = state.selection;
  const markType = state.schema.marks.fontSize;
  let fontSize = null;

  state.doc.nodesBetween(from, to, (node) => {
    if (node.marks && node.marks.length) {
      const mark = node.marks.find((m) => m.type === markType);
      if (mark) {
        fontSize = mark.attrs.fontSize;
        // Stop traversing early if a font is found.
        return false;
      }
    }
  });
  return fontSize;
};

const ProseMirrorPlugin2 = window.ProseMirrorPlugin;
const ProseMirrorPluginKey2 = window.ProseMirrorPluginKey;

// Create a plugin key for later access.
const fontSizeSelectionPluginKey = new ProseMirrorPluginKey2(
  "fontSizeSelection"
);

// Create the plugin.
const fontSizeSelectionPlugin = new ProseMirrorPlugin2({
  key: fontSizeSelectionPluginKey,
  state: {
    init(_config, state) {
      // Calculate the initial font value from the selection (if any).
      return getFontSizeFromSelection(state) || null;
    },
    apply(tr, value, oldState, newState) {
      // When the document changes or selection is updated, recalc the font.
      if (tr.docChanged || tr.selectionSet) {
        return getFontSizeFromSelection(newState) || null;
      }
      return value;
    },
  },
});

let defaultEditorFontSize = null;

const DropdownFontSizeMenu = ({ editorView, activeFont2 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [font, setFont] = useState(textFontSizes[0]);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const applyFontSize = (fontSize) => {
    return (state, dispatch) => {
      const { schema, selection } = state;
      const { from, to } = selection;
      const markType = schema.marks.fontSize;

      if (!markType) return false;

      const attrs = { fontSize };
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
    if (defaultEditorFontSize) setFont(defaultEditorFontSize);
  }, [defaultEditorFontSize]);

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Select Text Alignment"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <div
          id="defaultEditorFontSize"
          className={`border border-gray-400 rounded-md p-2 flex justify-between items-center justify ${
            defaultEditorFontSize ? "bg-gray-200" : ""
          }`}
        >
          <span id="textFontSize">
            {defaultEditorFontSize ? defaultEditorFontSize?.label : font.label}
          </span>
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
            {textFontSizes.map((textFont) => (
              <li
                key={textFont.value}
                className={`cursor-pointer hover:bg-gray-100 px-4 py-1 ${defaultEditorFontSize?.value === textFont.value ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  setFont(textFont);
                  defaultEditorFontSize = textFont;
                  applyFontSize(textFont.value)(
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

const renderReactFontSizeComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<DropdownFontSizeMenu editorView={editorView} />, container);
  return container;
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const fontSizeMenuItem = new MenuItem2({
  title: `Select Font Size`,
  run: (state, dispatch, editorView) => {
    const newFont = fontSizeSelectionPluginKey.getState(state); // Example selected font
    const tr = state.tr;
    console.log("newFont", newFont);
    // Set the font selection in the plugin state
    tr.setMeta(fontSizeSelectionPluginKey, newFont);
    // Dispatch the transaction to update the plugin state
    dispatch(tr);
    // Update the editor state so the plugin state is re-read and the component can re-render
    editorView.updateState(state); // This will trigger a re-render in ProseMirror and React
  },
  select: (state) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = fontSizeSelectionPluginKey.getState(state) || true;
    const selectedEditorFontSize = fontSizeSelectionPluginKey.getState(state);
    const fontSize = textFontSizes.find((font) => font.value === selectedEditorFontSize);

    const div = document.getElementById("textFontSize");
    if (div && selectedEditorFontSize) {
      div.textContent = fontSize?.label; // Change text content
      document.getElementById("defaultEditorFontSize")?.classList.add("bg-gray-200");
    }
    if (div && !selectedEditorFontSize) {
      div.textContent = "8"; // Change text content
      document.getElementById("defaultEditorFontSize")?.classList.remove("bg-gray-200");
    }
    return activeFont !== null;
  },
  render: (editorView) => renderReactFontSizeComponent(editorView),
  // active: (state) => {
  //   const selectedFontSize = fontSizeSelectionPluginKey.getState(state);
  //   return selectedFontSize ? true : false;
  // },
});
