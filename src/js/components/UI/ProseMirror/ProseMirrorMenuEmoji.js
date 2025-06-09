const Emoji = ({applyEmoji}) => {
  const pickerContainerRef = useRef(null);

  useEffect(() => {
    const pickerOptions = {
      onEmojiSelect: (emoji) => {
        applyEmoji(emoji.native)
      },
      theme: "light",
      previewPosition: "none",
      perLine:7,
      emojiSize: 18,
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
        <EmojiIcon/>
      </div>
      {isOpen && (
        <div
          ref={dropdownMenuRef}
          // className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white shadow-lg rounded w-48 z-10"
          className="emoji-picker-wrapper absolute md:left-[180px] max-sm:-right-[190px] transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded-sm z-10"
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
