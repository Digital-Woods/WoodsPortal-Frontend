const { setMark } = window.setMark;

const insertLink = (state, dispatch, linkText, url, blank) => {
  const { schema, selection, tr } = state;
  const { from, to, empty } = selection;
  const linkType = schema.marks.link;

  const href = url;

  let text = linkText; // Default text if no selection
  if (!empty) {
    text = state.doc.textBetween(from, to, " ");
  }

  let title = text; // Use the text as the title

  let attrs = { href, title: title, ...{ target: blank ? "_blank" : "_self" } };

  if (dispatch) {
    if (empty) {
      // Insert new text with link
      tr.insertText(text, from);
      tr.addMark(from, from + text.length, linkType.create(attrs));
    } else {
      // Wrap existing selection with link
      tr.addMark(from, to, linkType.create(attrs));
    }
    dispatch(tr);
  }
  return true;
};

let testChange = "";

const PopupInsertLinkMenu = ({ editorView, href, title }) => {
  const [open, setOpen] = useState(false);
  const [isSetLinkText, setIsSetLinkText] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [url, setUrl] = useState("");
  const [blank, setBlank] = useState(true);

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  const { selection } = editorView.state;
  const { from, to } = selection;
  const selectedText = editorView.state.doc.textBetween(from, to, " ");

  const resetMenu = () => {
    setLinkText("");
    setIsSetLinkText(false);
    setUrl("");
    setBlank(true);
  };

  useEffect(() => {
    if (selectedText) {
      setLinkText(selectedText);
      setIsSetLinkText(true);
      setUrl("");
    } else {
      resetMenu();
    }
  }, [selectedText]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onChangeCheckbox = () => {
    setBlank((prev) => !prev);
  };

  const onSubmit = () => {
    insertLink(editorView.state, editorView.dispatch, linkText, url, blank);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
        <ProseMirrorMenuButton
          id="defaultEditorBGColor"
          title="Insert Link"
          isActive={defaultEditorFont}
        >
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="25px"
            height="25px"
            viewBox="0 0 22.000000 34.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,34.000000) scale(0.100000,-0.100000)"
              fill="#666666"
              stroke="none"
            >
              <path
                d="M56 275 c-12 -33 -7 -85 9 -85 11 0 15 11 15 41 0 39 1 40 33 37 29
-3 32 -6 35 -40 5 -56 24 -46 20 10 l-3 47 -51 3 c-40 2 -53 -1 -58 -13z"
              />
              <path
                d="M102 169 c4 -79 23 -81 23 -2 0 37 -4 58 -13 61 -10 3 -12 -11 -10
-59z"
              />
              <path
                d="M56 143 c-12 -12 -6 -81 8 -92 8 -7 34 -11 58 -9 l43 3 3 53 c2 31
-1 52 -7 52 -6 0 -11 -18 -11 -40 0 -39 -1 -40 -35 -40 -33 0 -35 2 -35 34 0
34 -11 52 -24 39z"
              />
            </g>
          </svg>
        </ProseMirrorMenuButton>
        <ProseMirrorMenuOption>
          <div className="space-y-2 px-2 note-dd-Select-menu list-none list-inside dark:text-gray-400">
            <h2 className="text-sm">Create Link</h2>
            <div>
              <label className="text-sm">Link text</label>
              <Input
                ref={inputRef}
                onClick={() => inputRef.current.focus()}
                height="medium"
                placeholder=""
                defaultValue={linkText}
                onChange={(e) => {
                  setLinkText(e.target.value);
                  if (e.target.value) {
                    setIsSetLinkText(true);
                  } else {
                    setIsSetLinkText(false);
                  }
                }}
                className="!bg-white !text-black !border-gray-200"
              />
            </div>

            <div>
              <label className="text-sm">Url</label>
              <Input
                ref={inputRef2}
                onClick={() => inputRef2.current.focus()}
                height="medium"
                placeholder=""
                defaultValue={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (!isSetLinkText) setLinkText(e.target.value);
                }}
                className="!bg-white !text-black !border-gray-200"
              />
            </div>

            <Checkbox
              label="Open in new tab"
              checked={blank}
              onChange={onChangeCheckbox}
            />

            <div className="flex gap-1">
              <Button
                size="sm"
                className="w-full"
                onClick={onSubmit}
                disabled={!linkText || !url}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  resetMenu();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ProseMirrorMenuOption>
      </ProseMirrorMenuPopup>
    </div>
  );
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const renderReactInsertLinkComponent = (editorView) => {
  // console.log("renderReactInsertLinkComponent", true)
  const container = document.createElement("div");
  ReactDOM.render(<PopupInsertLinkMenu editorView={editorView} />, container);
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

const insertLinkMenuItem = new MenuItem2({
  title: `Select Alignment`,
  run: (state, dispatch, view) => {},
  select: (state) => {
    return true;
  },
  render: (editorView) => renderReactInsertLinkComponent(editorView),
});
