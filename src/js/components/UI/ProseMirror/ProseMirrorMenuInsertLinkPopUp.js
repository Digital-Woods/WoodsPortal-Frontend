const findTextRange = (editor, searchText) => {
  const { doc } = editor.state;
  let startPos = -1;
  let endPos = -1;

  doc.descendants((node, pos) => {
    if (node.isText) {
      const text = node.text;
      const index = text.indexOf(searchText);

      if (index !== -1) {
        startPos = pos + index;
        endPos = startPos + searchText.length;
        return false; // Stop searching after finding the first match
      }
    }
  });

  return { from: startPos, to: endPos };
};

const insertEditLink = (
  editorView,
  state,
  dispatch,
  title,
  linkText,
  url,
  blank
) => {
  const { schema, selection, tr } = state;
  const linkType = schema.marks.link;

  const { from, to } = findTextRange(editorView, title);

  let href = url;
  let attrs = {
    href,
    title: linkText,
    ...{ target: blank ? "_blank" : "_self" },
  };

  if (dispatch) {
    tr.delete(from, to);
    tr.insertText(linkText, from);
    tr.addMark(from, from + linkText.length, linkType.create(attrs));
    dispatch(tr);
  }

  return true;
};

const ProseMirrorMenuInsertLinkPopUp = ({
  randomId,
  editorView,
  href,
  title,
  target,
  closeLinkPopup,
}) => {
  const [isSetLinkText, setIsSetLinkText] = useState(false);
  const [linkText, setLinkText] = useState(title);
  const [url, setUrl] = useState(href);
  const [blank, setBlank] = useState(target === '_self' ? false : true);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const resetMenu = () => {
    setLinkText("");
    setIsSetLinkText(false);
    setUrl("");
    setBlank(true);
  };

  const onChangeCheckbox = () => {
    setBlank((prev) => !prev);
  };

  const onSubmit = () => {
    insertEditLink(
      editorView,
      editorView.state,
      editorView.dispatch,
      title,
      linkText,
      url,
      blank
    );
    resetMenu();
    closeLinkPopup();
  };

  const removeEditLink = () => {
    const { state, dispatch } = editorView;
    const { schema, tr } = state;
    const linkType = schema.marks.link;

    const { from, to } = findTextRange(editorView, title);

    if (dispatch) {
      tr.removeMark(from, to, linkType); // Remove the link mark
      dispatch(tr);
    }
    resetMenu();
    closeLinkPopup();
    return true;
  };

  // Set Dynamic Position & Scroll
  const [popupPosition, setPopupPosition] = React.useState({ top: 0, left: 0 });

  const updatePopupPosition = () => {
    const mainButton = document.getElementById(`main-${randomId}`);
    if (mainButton) {
      const rect = mainButton.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    updatePopupPosition();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updatePopupPosition();
    };

    const scrollableDiv = document.getElementById("details-scrollable-container");
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [popupPosition]);

  return (
    <div
      id={`child-${randomId}`}
      ref={dropdownMenuRef}
      className={`absolute bg-white shadow-lg rounded-sm border z-10
      top-[${popupPosition.top}px] left-[${popupPosition.left}px]`}
    >
      <div class="space-y-2 px-2 note-dd-Select-menu list-none list-inside dark:text-gray-400">
        <h2 class="text-sm">Edit Link</h2>
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
            onClick={() => closeLinkPopup()}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="link"
            className="w-full"
            onClick={() => removeEditLink()}
          >
            Remove link
          </Button>
        </div>
      </div>
    </div>
  );
};
