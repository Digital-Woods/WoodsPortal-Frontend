const getTextBGColorFromSelection = (state) => {
  const { from, to, empty } = state.selection;
  const markType = state.schema.marks.textBackgroundColor;
  let textBackgroundColor = null;

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

let defaultTextBGColor = " ";
let selectedTextBGColor = "";

const DropdownColorMenu2 = ({ editorView, icon }) => {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("");

  const applyTextBackgroundColor = (color) => {
    return (state, dispatch) => {
      const { schema, selection } = state;
      const { from, to } = selection;
      const markType = schema.marks.textBackgroundColor;

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
      applyTextBackgroundColor(color)(editorView.state, editorView.dispatch);
      const div = document.getElementById("text-bg-color-svg");
      if (div) {
        div.setAttribute("fill", color);
      }
    }
  }, [color]);

  return (
    <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
      <ProseMirrorMenuButton
        id="defaultEditorBGColor"
        title="Text Highlight"
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
            fill={defaultTextBGColor}
            id="text-bg-color-svg"
          />
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
      </ProseMirrorMenuButton>
      <ProseMirrorMenuOption>
        <ColorPicker
          color={color}
          setColor={setColor}
          setIsOpen={setOpen}
          defaultTextColor={defaultTextBGColor}
        />
      </ProseMirrorMenuOption>
    </ProseMirrorMenuPopup>
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
  run: () => {},
  select: (state) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = textBGColorPluginKey.getState(state) || true;
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
