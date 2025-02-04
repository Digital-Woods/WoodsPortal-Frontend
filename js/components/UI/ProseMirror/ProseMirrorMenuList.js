const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const listTypes = [
  {
    label: "Bullet",
    key: "bullet",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"/></svg>`,
  },
  {
    label: "Ordered",
    key: "ordered",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z"/></svg>`,
  },
];

const DropdownListMenu = ({ editorView }) => {
  const { wrapInList } = window.wrapInList;
  const { liftListItem } = window.liftListItem;

  const [isOpen, setIsOpen] = useState(false);
  const [textAlign, setTextAlign] = useState(listTypes[0]);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const isListActive = (state, nodeType) => {
    let { $from } = state.selection;
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type === nodeType) return true;
    }
    return false;
  };

  // Toggle Bullet List
  function toggleBulletList(state, dispatch) {
    const { schema, selection } = state;

    if (isListActive(state, schema.nodes.bullet_list)) {
      liftListItem(schema.nodes.list_item)(state, dispatch);
    } else {
      wrapInList(schema.nodes.bullet_list)(state, dispatch);
    }
  }

  // Toggle Ordered List
  function toggleOrderedList(state, dispatch) {
    const { schema, selection } = state;

    if (isListActive(state, schema.nodes.ordered_list)) {
      liftListItem(schema.nodes.list_item)(state, dispatch);
    } else {
      wrapInList(schema.nodes.ordered_list)(state, dispatch);
    }
  }

  useEffect(() => {
    if (textAlign && textAlign.key === "bullet")
      toggleBulletList(editorView.state, editorView.dispatch);
    if (textAlign && textAlign.key === "ordered")
      toggleOrderedList(editorView.state, editorView.dispatch);
  }, [textAlign]);

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Select Text Alignment"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <div id="textListIcon">
          <SvgRenderer svgContent={textAlign.icon} />
        </div>
      </div>
      {isOpen && (
        <div
          ref={dropdownMenuRef}
          // className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white shadow-lg rounded w-48 z-10"
          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded z-10"
        >
          <ul class="space-y-2 text-gray-500 list-none list-inside dark:text-gray-400">
            {listTypes.map((listType) => (
              <li
                key={listType.key}
                className="cursor-pointer hover:bg-gray-200 px-4 py-1"
                onClick={() => setTextAlign(listType)}
              >
                <SvgRenderer svgContent={listType.icon} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const renderReactListComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<DropdownListMenu editorView={editorView} />, container);
  return container;
};
const listMenuItem = new MenuItem2({
  title: `Select List`,
  run: () => {},
  select: (state) => true,
  render: (editorView) => renderReactListComponent(editorView),
});