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
          <path d="M80 0v-160h800V0H80Z" fill="#e8eaed" id="text-color-svg" />
          <path
            d="M220-280 430-840h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"
            fill="#e8eaed"
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
  run: () => {},
  select: (state) => true,
  render: (editorView) => renderReactComponent(editorView),
});
