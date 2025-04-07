const getTextColorFromSelection = (state) => {
  const { from, to, empty } = state.selection;
  const markType = state.schema.marks.textColor;
  let textColor = null;

  if (!markType) return null; // Ensure the mark exists

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
        textColor = mark.attrs.color;
        return false; // Stop early when we find the color
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

let defaultTextColor = "#000";
let selectedTextColor = "";

const DropdownColorMenu = ({ editorView, icon }) => {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("");

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
    if (color) {
      applyTextColor(color)(editorView.state, editorView.dispatch);
      const div = document.getElementById("text-color-svg");
      if (div) {
        div.setAttribute("fill", color);
      }
    }
  }, [color]);

  return (
    <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
      <ProseMirrorMenuButton
        id="defaultEditorColor"
        title="Text Color"
        isActive={defaultEditorFont}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
        >
          <path
            d="M80 0v-160h800V0H80Z"
            fill={defaultTextColor}
            id="text-color-svg"
          />
          <path
            d="M220-280 430-840h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"
            fill={defaultTextColor}
          />
        </svg>
      </ProseMirrorMenuButton>
      <ProseMirrorMenuOption>
        <ColorPicker
          color={color}
          setColor={setColor}
          setIsOpen={setOpen}
          defaultTextColor={defaultTextColor}
        />
      </ProseMirrorMenuOption>
    </ProseMirrorMenuPopup>
  );
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const renderReactComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<DropdownColorMenu editorView={editorView} />, container);
  return container;
};
const textColor = new MenuItem2({
  title: `Text color`,
  run: () => {},
  select: (state) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = textColorPluginKey.getState(state) || true;
    selectedTextColor = getTextColorFromSelection(state);
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
