const Emoji = ({applyEmoji}) => {
  const pickerContainerRef = useRef(null);

  useEffect(() => {
    const pickerOptions = {
      onEmojiSelect: (emoji) => {
        applyEmoji(emoji.native)
      }
    };
    const picker = new EmojiMart.Picker(pickerOptions);
    pickerContainerRef.current.appendChild(picker);

    // Cleanup to remove the picker if the component unmounts
    return () => {
      if (pickerContainerRef.current) {
        pickerContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={pickerContainerRef} />;
};

const insertEmoji = (emoji) => (state, dispatch) => {
  const { from, to } = state.selection; // Get the current selection
  const tr = state.tr.replaceWith(
    from,
    to,
    state.schema.text(emoji) // Replace with emoji
  );

  if (dispatch) dispatch(tr); // Dispatch the transaction to update the document
  return true; // Indicate the command was executed
};


let testChange = "";

const PopupInsertEmojiMenu = ({ editorView, href, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

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

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const applyEmoji = (emoji) => {
    insertEmoji(emoji)(editorView.state, editorView.dispatch); // Call insert function
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon note-menuitem"
        title="Insert Link"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="25px"
          viewBox="0 -960 960 960"
          width="25px"
          fill="#e8eaed"
        >
          <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
        </svg>
      </div>
      {isOpen && (
        <div
          ref={dropdownMenuRef}
          // className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white shadow-lg rounded w-48 z-10"
          className="absolute left-[180px] transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded-sm z-10"
        >
            <Emoji applyEmoji={applyEmoji} />
        </div>
      )}
    </div>
  );
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const renderReactEmojiComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<PopupInsertEmojiMenu editorView={editorView} />, container);
  return container;
};

const proseMirrorMenuEmoji = new MenuItem2({
  title: `Insert emoji`,
  run: (state, dispatch, view) => {
  },
  select: (state) => {
    return true;
  },
  render: (editorView) => renderReactEmojiComponent(editorView),
});
