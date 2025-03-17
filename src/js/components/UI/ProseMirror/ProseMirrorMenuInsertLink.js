const { setMark } = window.setMark;

const insertLink = (state, dispatch, linkText, url, blank) => {
  const { schema, selection, tr } = state;
  const { from, to, empty } = selection;
  const linkType = schema.marks.link;

  //  const {
  //   page,
  // } = useTable();

  // console.log("page", page)

  // Ask for a link URL
  // const url = prompt("Enter the link URL:");
  // if (!url) return false;

  // Apply the link mark
  // const linkMark = schema.marks.link.create({ href: `https://chatgpt.com` });
  // tr.addMark(from, to, linkMark);

  const href = url;
  // const selectedText = `https://chatgpt.com`;
  // const selectedText = state.doc.textBetween(from, to, " ");
  // console.log("selectedText", selectedText)

  let text = linkText; // Default text if no selection
  if (!empty) {
    text = state.doc.textBetween(from, to, " ");
  }

  let title = text; // Use the text as the title

  let attrs = { href, title: title, ...(blank && { target: "_blank" }) };

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

  // const title = `https://chatgpt.com`;

  // if (dispatch) {
  //   const tr = state.tr.addMark(from, to, linkType.create({ href, title }));
  //   console.log("tr", tr)
  //   dispatch(tr);
  // }
  return true;
};

let testChange = ""

const PopupInsertLinkMenu = ({ editorView, href, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSetLinkText, setIsSetLinkText] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [url, setUrl] = useState("");
  const [blank, setBlank] = useState(true);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  const { selection } = editorView.state;
  const { from, to } = selection;
  const selectedText = editorView.state.doc.textBetween(from, to, " ");


  // useEffect(() => {
  //   setUrl(href)
  //   setLinkText(title)
  //   if(href && title) setIsOpen(true);
  // }, [href, title]);

  // getRecoilSyncState().then((value) => console.log("syncDisableState:", value));

  // const { getLinkData } = useLinkData();

  // useEffect(() => {
  //   console.log("getLinkData", getLinkData())
  // }, [getLinkData()]);

  // useEffect(() => {
  //   console.log("getLinkData", getLinkData)
  // }, [getLinkData]);


  const resetMenu = () => {
    setLinkText("");
    setIsSetLinkText(false);
    setUrl("");
    setBlank(true);
  }

  useEffect(() => {
    if(selectedText) {
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

  const handleClickOutside = (event) => {
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(event.target) &&
      dropdownButtonRef.current &&
      !dropdownButtonRef.current.contains(event.target)
    ) {
      resetMenu();
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

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const onChangeCheckbox = () => {
    setBlank((prev) => !prev);
  };

  const onSubmit = () => {
    insertLink(editorView.state, editorView.dispatch, linkText, url, blank);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon"
        title="Insert Link"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
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
      </div>
      {isOpen && (
        <div
          ref={dropdownMenuRef}
          // className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white shadow-lg rounded w-48 z-10"
          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded-sm w-60 z-10"
        >
          <div class="space-y-2 px-2 note-dd-Select-menu list-none list-inside dark:text-gray-400">
            <h2 class="text-sm">Create Link</h2>
            <div>
              <label class="text-sm">Link text</label>
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
              />
            </div>

            <div>
              <label class="text-sm">Url</label>
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
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
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
  run: (state, dispatch, view) => {
    console.log("run", true)
    // insertLink(state, dispatch, "", "", true);
  },
  select: (state) => {
    return true;
  },
  render: (editorView) => renderReactInsertLinkComponent(editorView),
});
