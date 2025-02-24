// Helper: Traverses the selection to find the first fontFamily mark.
const getTextColorFromSelection = (state) => {
  const { from, to } = state.selection;
  const markType = state.schema.marks.textColor;
  let textColor = null;

  state.doc.nodesBetween(from, to, (node) => {
    if (node.marks && node.marks.length) {
      const mark = node.marks.find((m) => m.type === markType);
      if (mark) {
        textColor = mark.attrs.color;
        // Stop traversing early if a font is found.
        return false;
      }
    }
  });
  return textColor;
};

const ProseMirrorPlugin2 = window.ProseMirrorPlugin;
const ProseMirrorPluginKey2 = window.ProseMirrorPluginKey;

// Create a plugin key for later access.
const textColorPluginKey = new ProseMirrorPluginKey2("textColor");

// Create the plugin.
const textColorPlugin = new ProseMirrorPlugin2({
  key: textColorPluginKey,
  state: {
    init(_config, state) {
      // Calculate the initial font value from the selection (if any).
      return getTextColorFromSelection(state) || null;
    },
    apply(tr, value, oldState, newState) {
      // When the document changes or selection is updated, recalc the font.
      if (tr.docChanged || tr.selectionSet) {
        return getTextColorFromSelection(newState) || null;
      }
      return value;
    },
  },
});

const defaultTextColor = "#000";
let selectedTextColor = "";

const DropdownColorMenu = ({ editorView, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("");

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeMenuOnClickOutside = (event) => {
    if (
      dropdownButtonRef.current &&
      !dropdownButtonRef.current.contains(event.target) &&
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMenuOnClickOutside);
    return () => {
      document.removeEventListener("click", closeMenuOnClickOutside);
    };
  }, []);

  const applyTextColor = (color) => {
    return (state, dispatch) => {
      const { schema, selection } = state;
      const { from, to } = selection;
      const markType = schema.marks.textColor;

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
    if (color) applyTextColor(color)(editorView.state, editorView.dispatch);
  }, [color]);

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Text Color"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
        >
          <path d="M80 0v-160h800V0H80Z" fill={defaultTextColor} id="text-color-svg" />
          <path
            d="M220-280 430-840h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"
            fill="#e5e7eb"
          />
        </svg>

        {/* <span class="custom-menu-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M80 0v-160h800V0H80Zm140-280 210-560h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z" />
          </svg>
        </span> */}
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
          />
        </div>
      )}
    </div>
  );
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;


const renderReactComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<DropdownColorMenu editorView={editorView} />, container);
  return container;
};
const textColor = new MenuItem2({
  title: `Set text color`,
  run: (state, dispatch, editorView) => {
    const newFont = textColorPluginKey.getState(state); // Example selected font
    const tr = state.tr;
    // Set the font selection in the plugin state
    tr.setMeta(textColorPluginKey, newFont);
    // Dispatch the transaction to update the plugin state
    dispatch(tr);
    // Update the editor state so the plugin state is re-read and the component can re-render
    editorView.updateState(state); // This will trigger a re-render in ProseMirror and React
  },
  select: (state) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = textColorPluginKey.getState(state) || true;
    selectedTextColor = textColorPluginKey.getState(state);
    const div = document.getElementById("text-color-svg");
    if (div && selectedTextColor) {
      div.setAttribute("fill", selectedTextColor);
    }
    if (div && !selectedTextColor) {
      div.setAttribute("fill", defaultTextColor);
    }
    return activeFont !== null;
  },
  render: (editorView) => renderReactComponent(editorView),
});
