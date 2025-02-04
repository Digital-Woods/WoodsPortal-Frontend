const alignments = [
  {
    label: "Left",
    key: "left",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Center",
    key: "center",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Right",
    key: "right",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`,
  },
];

const DropdownAlightMenu = ({ editorView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textAlign, setTextAlign] = useState(alignments[0]);

  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const applyAlignment = (state, dispatch, align) => {
    const { schema, selection } = state;
    const nodeType = schema.nodes.paragraph;
    const { from, to } = selection;

    if (dispatch) {
      dispatch(state.tr.setBlockType(from, to, nodeType, { align }));
    }
    return true;
  };

  useEffect(() => {
    if (textAlign)
      applyAlignment(editorView.state, editorView.dispatch, textAlign.key);
  }, [textAlign]);

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Select Text Alignment"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <div id="textAlignIcon">
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
            {alignments.map((alignment) => (
              <li
                key={alignment.key}
                className="cursor-pointer hover:bg-gray-200 px-4 py-1"
                onClick={() => setTextAlign(alignment)}
              >
                <SvgRenderer svgContent={alignment.icon} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

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

const DropdownColorMenu2 = ({ editorView, icon }) => {
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

  const applyTextBackgroundColor = (color) => {
    return (state, dispatch) => {
      const { schema, selection } = state;
      const { from, to } = selection;
      const markType = schema.marks.textBackgroundColor;

      // console.log("markType", markType);

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
    if (color)
      applyTextBackgroundColor(color)(editorView.state, editorView.dispatch);
  }, [color]);

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Text BG Color"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <span class="custom-menu-icon">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#e8eaed"
          >
            <path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z" />
          </svg> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
          >
            <path d="M80 0v-160h800V0H80Z" fill="#fff" id="text-bg-color-svg" />
            <path
              d="M160-320h56l312-311-29-29-28-28-311 312v56Z"
              fill="#e8eaed"
            />
            <path
              d="M80-240v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Z"
              fill="#e8eaed"
            />
            <path d="M720-744l-56-56 56 56Z" fill="#e8eaed" />
            <path d="M608-631l-29-29-28-28 57 57Z" fill="#e8eaed" />
          </svg>
        </span>
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

const ProseMirrorEditor = ({
  initialData = "",
  attachments = [],
  setEditorContent,
  id = "new",
  imageUploadUrl,
  attachmentUploadUrl,
  attachmentUploadMethod = "POST",
  setAttachmentId = null,
  refetch = null,
  objectId,
  setIsUploading,
}) => {
  // Upload
  const fileInputRef = useRef(null);
  const token = getAuthToken();
  const [uploadedAttachments, setUploadedAttachments] = useState(attachments);
  const [isLoadingUoloading, setisLoadingUoloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Plugin
  const editorRef = useRef(null);
  const [pmState, setPmState] = useState();
  const [pmView, setPmView] = useState();
  const [editorShema, setEditorSchema] = useState();
  const { DOMSerializer } = window.DOMSerializer;
  const { buildMenuItems } = window.ProseMirrorBuildMenuItems;
  const { MenuItem } = window.ProseMirrorMenuItem;

  const { font, setFont } = useEditor();

  // const setAlignment = (state, dispatch, nodeType, align) => {
  //   const { from, to } = state.selection;
  //   if (dispatch) {
  //     dispatch(state.tr.setBlockType(from, to, nodeType, { align }));
  //   }
  //   return true;
  // };

  // Csustom Plugin API Call Start
  const uploadImage = async (pmView, file) => {
    setisLoadingUoloading(true);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file); // Append the selected file to FormData

    try {
      const response = await axios({
        method: "POST",
        url: imageUploadUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); // Update the progress
        },
      });

      const imageUrl = response.data.data.url;
      const imageName = response.data.data.name;

      insertImage(pmView, imageUrl);

      setUploadProgress(0);
      setisLoadingUoloading(false);
      setIsUploading(false);
      if (refetch) refetch();
    } catch (error) {
      setisLoadingUoloading(false);
      setIsUploading(false);
    }
  };
  const attachmentUpload = async (file) => {
    setisLoadingUoloading(true);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file); // Append the selected file to FormData

    try {
      const response = await axios({
        method: attachmentUploadMethod,
        url: attachmentUploadUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); // Update the progress
        },
      });

      setUploadedAttachments((prevAttachments) => [
        ...prevAttachments,
        response.data.data,
      ]);
      setUploadProgress(0);
      setisLoadingUoloading(false);
      setIsUploading(false);
      if (refetch) refetch();
    } catch (error) {
      setisLoadingUoloading(false);
      setIsUploading(false);
    }
  };
  // Csustom Plugin API Call End

  // Csustom Plugin Start
  const customMenuItemImage = new MenuItem({
    title: "Insert Image",
    run: (state, dispatch, view) => {
      // fileInputRef.current.click();
      //  Create a hidden file input element
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*"; // Accept only images (modify as needed)

      // Trigger the file selection dialog
      fileInput.click();

      // Handle the file selection
      fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (file) {
          uploadImage(view, file);
        }
      });
    },
    select: (state) => true, // Show this item always
    icon: {
      dom: (() => {
        const span = document.createElement("span");
        span.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>
  `;
        span.className = "custom-menu-icon";
        return span;
      })(),
    },
  });

  const customMenuItemAttachment = new MenuItem({
    title: "Add Attachment",
    run: (state, dispatch, view) => {
      // Create a hidden file input element
      const fileInput = document.createElement("input");
      fileInput.type = "file";

      // Trigger the file selection dialog
      fileInput.click();

      // Handle the file selection
      fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (file) {
          attachmentUpload(file);
        }
      });
    },
    select: (state) => true, // Show this item always
    icon: {
      dom: (() => {
        const span = document.createElement("span");
        span.innerHTML = `
         <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
        `;
        span.className = "custom-menu-icon";
        return span;
      })(),
    },
  });
  // Csustom Plugin End

  const imageNodeSpec = {
    inline: false, // Defines the image as an inline node
    attrs: {
      src: {}, // The source URL of the image (required)
      // alt: { default: null }, // Alternative text (optional)
      // title: { default: null }, // Title for the image (optional)
    },
    group: "block", // Belongs to the "inline" group
    draggable: true, // Makes the image draggable in the editor
    parseDOM: [
      {
        tag: "img[src]", // Matches <img> elements with a `src` attribute
        getAttrs(dom) {
          return {
            src: dom.getAttribute("src"),
            // alt: dom.getAttribute("alt"),
            // title: dom.getAttribute("title"),
          };
        },
      },
    ],
    toDOM(node) {
      return ["img", node.attrs]; // Renders the image node as an <img> element
    },
  };

  useEffect(() => {
    const { EditorState } = window.ProseMirrorState;
    const { EditorView } = window.ProseMirrorView;
    const { Schema, DOMParser } = window.ProseMirrorModel;
    const { keymap, baseKeymap } = window.ProseMirrorKeymap;
    const { exampleSetup } = window.ProseMirrorExampleSetup;
    const { Dropdown } = window.ProseMirrorMenuDropdown;
    const { addListNodes } = window.addListNodes;
    const { baseSchema } = window.baseSchema;
    const { toggleMark } = window.toggleMark;
    const { wrapIn } = window.wrapIn;
    const { menuBar } = window.menuBar;
    const { wrapInList } = window.wrapInList;
    const { liftListItem } = window.liftListItem;
    // Define schema

    const paragraphNode = {
      content: "inline*",
      group: "block",
      attrs: {
        align: { default: null },
      },
      parseDOM: [
        {
          tag: "p",
          getAttrs: (dom) => ({
            align: dom.style.textAlign || null,
          }),
        },
      ],
      toDOM(node) {
        const { align } = node.attrs;
        return ["p", { style: align ? `text-align: ${align};` : "" }, 0];
      },
    };

    // const myNodes = {
    //   doc: { content: "block+" },
    //   paragraph: paragraphNode,
    //   text: { group: "inline" },
    //   // text: { inline: true },
    //   heading: {
    //     content: "text*",
    //     group: "block",
    //     toDOM: (node) => ["h" + node.attrs.level, 0],
    //     parseDOM: [
    //       { tag: "h1", attrs: { level: 1 } },
    //       { tag: "h2", attrs: { level: 2 } },
    //       { tag: "h3", attrs: { level: 3 } },
    //     ],
    //     attrs: { level: { default: 1 } },
    //   },
    //   hard_break: {
    //     inline: true,
    //     group: "inline",
    //     selectable: false,
    //     toDOM: () => ["br"],
    //     parseDOM: [{ tag: "br" }],
    //   },
    //   image: imageNodeSpec,
    // };

    const nodes = baseSchema.spec.nodes.update("paragraph", paragraphNode);
    const nodesWithList = addListNodes(nodes, "paragraph block*", "block");

    const schema = new Schema({
      nodes: nodesWithList,
      marks: {
        // alignment: alignmentMark,
        strong: {
          toDOM: () => ["strong", 0],
          parseDOM: [{ tag: "strong" }],
        },
        em: {
          toDOM: () => ["em", 0],
          parseDOM: [{ tag: "em" }],
        },
        underline: {
          toDOM: () => ["u", 0],
          parseDOM: [{ tag: "u" }],
        },
        textColor: {
          attrs: { color: {} },
          parseDOM: [
            {
              style: "color",
              getAttrs: (value) => ({ color: value }),
            },
          ],
          toDOM: (mark) => ["span", { style: `color: ${mark.attrs.color}` }, 0],
        },
        textBackgroundColor: {
          attrs: { color: {} },
          parseDOM: [
            {
              style: "background-color",
              getAttrs: (value) => ({ color: value }),
            },
          ],
          toDOM: (mark) => [
            "span",
            { style: `background-color: ${mark.attrs.color}` },
            0,
          ],
        },
        fontSize: {
          attrs: { fontSize: {} },
          parseDOM: [
            {
              style: "font-size",
              getAttrs: (value) => ({ fontSize: value }),
            },
          ],
          toDOM: (mark) => [
            "span",
            { style: `font-size: ${mark.attrs.fontSize}` },
            0,
          ],
        },
        fontFamily: {
          attrs: { font: {} },
          parseDOM: [
            {
              style: "font-family",
              getAttrs: (value) => ({ font: value }),
            },
          ],
          toDOM: (mark) => [
            "span",
            { style: `font-family: ${mark.attrs.font}` },
            0,
          ],
        },
      },
    });
    setEditorSchema(schema);

    // Underline Menu
    // const toggleUnderline = (schema) => {
    //   return toggleMark(schema.marks.underline);
    // };
    // const customMenuItemTextUnderline = new MenuItem({
    //   title: "Underline Text",
    //   run: (state, dispatch, view) => {
    //     toggleUnderline(view.state.schema)(state, dispatch);
    //   },
    //   select: (state) => true, // Show this item always
    //   icon: {
    //     dom: (() => {
    //       const span = document.createElement("span");
    //       span.innerHTML = `
    //         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>
    //   `;
    //       span.className = "custom-menu-icon";
    //       return span;
    //     })(),
    //   },
    // });

    // Alignment Menu
    // const alignmentDropdown = () => {
    //   const alignments = [
    //     {
    //       label: "Left",
    //       key: "left",
    //       icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`,
    //     },
    //     {
    //       label: "Center",
    //       key: "center",
    //       icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`,
    //     },
    //     {
    //       label: "Right",
    //       key: "right",
    //       icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`,
    //     },
    //   ];

    //   const fontItems = alignments.map(
    //     (alignment) =>
    //       new MenuItem({
    //         title: alignment.label,
    //         run: (state, dispatch, view) => {
    //           setAlignment(
    //             state,
    //             dispatch,
    //             schema.nodes.paragraph,
    //             alignment.key
    //           );
    //         },
    //         select: (state) => true, // Show this item always
    //         icon: {
    //           dom: (() => {
    //             const span = document.createElement("span");
    //             span.innerHTML = alignment.icon;
    //             span.className = "custom-menu-icon";
    //             return span;
    //           })(),
    //         },
    //       })
    //   );

    //   return new Dropdown(fontItems, {
    //     label: "Alignment",
    //     title: "Select Alignment",
    //   });
    // };

    const renderReactAlignComponent = (editorView) => {
      const container = document.createElement("div");
      ReactDOM.render(
        <DropdownAlightMenu editorView={editorView} />,
        container
      );
      return container;
    };
    const alignmentDropdown = new MenuItem({
      title: `Select Alignment`,
      run: () => {},
      select: (state) => true,
      render: (editorView) => renderReactAlignComponent(editorView),
    });

    // // Font Menu
    // const applyFontFamily = (font) => {
    //   return (state, dispatch) => {
    //     const { schema, selection } = state;
    //     const { from, to } = selection;
    //     const markType = schema.marks.fontFamily;

    //     if (!markType) return false;

    //     const attrs = { font };
    //     const tr = state.tr;

    //     if (selection.empty) {
    //       // Apply as stored mark if no selection
    //       tr.addStoredMark(markType.create(attrs));
    //     } else {
    //       // Apply to the selected range
    //       tr.addMark(from, to, markType.create(attrs));
    //     }

    //     if (dispatch) dispatch(tr);
    //     return true;
    //   };
    // };
    // const fontDropdown = () => {
    //   const fonts = [
    //     {
    //       label: "Sans Serif",
    //       key: "sans-serif",
    //     },
    //     {
    //       label: "Serif",
    //       key: "serif",
    //     },
    //     {
    //       label: "Monospace",
    //       key: "monospace",
    //     },
    //     {
    //       label: "Georgia",
    //       key: "Georgia",
    //     },
    //     {
    //       label: "Tahoma",
    //       key: "Tahoma",
    //     },
    //     {
    //       label: "Trebuchet MS",
    //       key: "Trebuchet MS",
    //     },
    //     {
    //       label: "Verdana",
    //       key: "Verdana",
    //     },
    //   ];
    //   const fontItems = fonts.map(
    //     (font) =>
    //       new MenuItem({
    //         title: `Set font to ${font.label}`,
    //         label: font.label,
    //         run: (state, dispatch, view) => {
    //           applyFontFamily(font.key)(view.state, view.dispatch);
    //           return true;
    //         },
    //         enable: (state) => !state.selection.empty, // Enable if text is selected
    //       })
    //   );

    //   return new Dropdown(fontItems, { label: "Fonts", title: "Select Font" });
    // };

    // // Font Size Menu
    // const applyFontSize = (fontSize) => {
    //   return (state, dispatch) => {
    //     const { schema, selection } = state;
    //     const { from, to } = selection;
    //     const markType = schema.marks.fontSize;

    //     if (!markType) return false;

    //     const attrs = { fontSize };
    //     const tr = state.tr;

    //     if (selection.empty) {
    //       // Apply as stored mark if no selection
    //       tr.addStoredMark(markType.create(attrs));
    //     } else {
    //       // Apply to the selected range
    //       tr.addMark(from, to, markType.create(attrs));
    //     }

    //     if (dispatch) dispatch(tr);
    //     return true;
    //   };
    // };
    // const fontSizeDropdown = () => {
    //   const fontSizes = [
    //     {
    //       label: "8",
    //       value: "8pt",
    //     },
    //     {
    //       label: "9",
    //       value: "9pt",
    //     },
    //     {
    //       label: "10",
    //       value: "10pt",
    //     },
    //     {
    //       label: "11",
    //       value: "11pt",
    //     },
    //     {
    //       label: "12",
    //       value: "12pt",
    //     },
    //     {
    //       label: "14",
    //       value: "14pt",
    //     },
    //     {
    //       label: "18",
    //       value: "18pt",
    //     },
    //     {
    //       label: "24",
    //       value: "24pt",
    //     },
    //     {
    //       label: "36",
    //       value: "36pt",
    //     },
    //   ];
    //   const fontItems = fontSizes.map(
    //     (fontSize) =>
    //       new MenuItem({
    //         title: `Set font size to ${fontSize.label}`,
    //         label: fontSize.label,
    //         run: (state, dispatch, view) => {
    //           applyFontSize(fontSize.value)(view.state, view.dispatch);
    //           return true;
    //         },
    //         enable: (state) => !state.selection.empty, // Enable if text is selected
    //       })
    //   );

    //   return new Dropdown(fontItems, {
    //     label: "Font Size",
    //     title: "Select Font Size",
    //   });
    // };

    // Text Color Menu
    const renderReactComponent = (editorView) => {
      const container = document.createElement("div");
      ReactDOM.render(<DropdownColorMenu editorView={editorView} />, container);
      return container;
    };
    const textColor = new MenuItem({
      title: `Set text color`,
      run: () => {},
      select: (state) => true,
      render: (editorView) => renderReactComponent(editorView),
    });

    // Text Background Color Menu
    const renderReactComponent2 = (editorView) => {
      const container = document.createElement("div");
      ReactDOM.render(
        <DropdownColorMenu2
          editorView={editorView}
          icon={`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M80 0v-160h800V0H80Zm140-280 210-560h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"/></svg>`}
        />,
        container
      );
      return container;
    };
    const textBGColor = new MenuItem({
      title: `Set text bg color`,
      run: () => {},
      select: (state) => true,
      render: (editorView) => renderReactComponent2(editorView),
    });

    // const customExampleSetup = (schema) => {
    //   // const menu = buildMenuItems(schema).fullMenu;
    //   // menu[1][0].content.push(customMenuItemImage);
    //   // menu[1][0].content.shift();
    //   const menuItems = buildMenuItems(schema);
    //   menuItems.inlineMenu[0].push(customMenuItemTextUnderline);
    //   menuItems.inlineMenu[0].push(fontDropdown());
    //   menuItems.inlineMenu[0].push(fontSizeDropdown());
    //   menuItems.inlineMenu[0].push(alignmentDropdown());
    //   menuItems.inlineMenu[0].push(textColor);
    //   menuItems.inlineMenu[0].push(textBGColor);
    //   menuItems.inlineMenu[0].push(customMenuItemImage);
    //   menuItems.inlineMenu[0].push(customMenuItemAttachment);
    //   const menu = menuItems.fullMenu;
    //   return exampleSetup({ schema, menuContent: menu });
    // };

    // Create an initial document with some content
    const initialContent = document.createElement("div");
    // initialContent.innerHTML = `<p>Start typing!</p> <p><img src="https://prosemirror.net/img/picture.png" alt="Image" contenteditable="false"><img class="ProseMirror-separator" alt=""><br class="ProseMirror-trailingBreak"></p>`;
    initialContent.innerHTML = initialData;
    const initialDoc = DOMParser.fromSchema(schema).parse(initialContent);

    // c Menu
    const boldItem = new MenuItem({
      title: "Bold",
      // label: "Bold",
      icon: {
        dom: (() => {
          const span = document.createElement("span");
          span.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>
    `;
          span.className = "custom-menu-icon";
          return span;
        })(),
      },
      enable: (state) => toggleMark(schema.marks.strong)(state),
      run: (state, dispatch) => {
        toggleMark(schema.marks.strong)(state, dispatch);
        updateMenuState(editor); // Call function to update menu state
      },
    });

    const italicItem = new MenuItem({
      title: "Italic",
      // label: "Italic",
      icon: {
        dom: (() => {
          const span = document.createElement("span");
          span.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>
    `;
          span.className = "custom-menu-icon";
          return span;
        })(),
      },
      enable: (state) => toggleMark(schema.marks.em)(state),
      // run: (state, dispatch) => toggleMark(schema.marks.em)(state, dispatch),
      run: (state, dispatch) => {
        toggleMark(schema.marks.em)(state, dispatch);
        updateMenuState(editor); // Call function to update menu state
      },
    });

    const blockquoteItem = new MenuItem({
      title: "Wrap in Blockquote",
      // label: "Blockquote",
      icon: {
        dom: (() => {
          const span = document.createElement("span");
          span.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m228-240 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T458-480L320-240h-92Zm360 0 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T818-480L680-240h-92ZM320-500q25 0 42.5-17.5T380-560q0-25-17.5-42.5T320-620q-25 0-42.5 17.5T260-560q0 25 17.5 42.5T320-500Zm360 0q25 0 42.5-17.5T740-560q0-25-17.5-42.5T680-620q-25 0-42.5 17.5T620-560q0 25 17.5 42.5T680-500Zm0-60Zm-360 0Z"/></svg>
    `;
          span.className = "custom-menu-icon";
          return span;
        })(),
      },
      enable: (state) => wrapIn(schema.nodes.blockquote)(state),
      // run: (state, dispatch) =>
      //   wrapIn(schema.nodes.blockquote)(state, dispatch),
      run: (state, dispatch) => {
        wrapIn(schema.nodes.blockquote)(state, dispatch);
        updateMenuState(editor); // Call function to update menu state
      },
    });

    const underlineMenuItem = new MenuItem({
      title: "Underline",
      // label: "U",
      icon: {
        dom: (() => {
          const span = document.createElement("span");
          span.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>
    `;
          span.className = "custom-menu-icon";
          return span;
        })(),
      },
      enable: (state) => toggleMark(schema.marks.underline)(state),
      // run: toggleMark(schema.marks.underline),
      run: (state, dispatch) => {
        // toggleMark(schema.marks.underline),
        toggleMark(schema.marks.underline)(state, dispatch);
        updateMenuState(editor); // Call function to update menu state
      },
    });

    // Function to check if the selection is inside a specific list type
    function isListActive(state, nodeType) {
      let { $from } = state.selection;
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type === nodeType) return true;
      }
      return false;
    }

    // // Toggle Bullet List
    // function toggleBulletList(state, dispatch) {
    //   if (isListActive(state, schema.nodes.bullet_list)) {
    //     liftListItem(schema.nodes.list_item)(state, dispatch);
    //   } else {
    //     wrapInList(schema.nodes.bullet_list)(state, dispatch);
    //   }
    // }

    // // Toggle Ordered List
    // function toggleOrderedList(state, dispatch) {
    //   if (isListActive(state, schema.nodes.ordered_list)) {
    //     liftListItem(schema.nodes.list_item)(state, dispatch);
    //   } else {
    //     wrapInList(schema.nodes.ordered_list)(state, dispatch);
    //   }
    // }

    // // Toggleable Bullet List Menu Item
    // const bulletListMenuItem = new MenuItem({
    //   title: "Bullet List",
    //   // label: "• List",
    //   icon: {
    //     dom: (() => {
    //       const span = document.createElement("span");
    //       span.innerHTML = `
    //       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"/></svg>
    // `;
    //       span.className = "custom-menu-icon";
    //       return span;
    //     })(),
    //   },
    //   enable: (state) =>
    //     wrapInList(schema.nodes.bullet_list)(state) ||
    //     isListActive(state, schema.nodes.bullet_list),
    //   run: toggleBulletList,
    // });

    // // Toggleable Ordered List Menu Item
    // const orderedListMenuItem = new MenuItem({
    //   title: "Ordered List",
    //   // label: "1. List",
    //   icon: {
    //     dom: (() => {
    //       const span = document.createElement("span");
    //       span.innerHTML = `
    //       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z"/></svg>
    // `;
    //       span.className = "custom-menu-icon";
    //       return span;
    //     })(),
    //   },
    //   enable: (state) =>
    //     wrapInList(schema.nodes.ordered_list)(state) ||
    //     isListActive(state, schema.nodes.ordered_list),
    //   run: toggleOrderedList,
    // });

    // List
    const renderReactListComponent = (editorView) => {
      const container = document.createElement("div");
      ReactDOM.render(<DropdownListMenu editorView={editorView} />, container);
      return container;
    };
    const listMenuItem = new MenuItem({
      title: `Select List`,
      run: () => {},
      select: (state) => true,
      render: (editorView) => renderReactListComponent(editorView),
    });

    // List
    const getFontFamilyFromSelection = (state) => {
      const { from, to } = state.selection;
      const fontFamilyMark = state.schema.marks.fontFamily;
    
      let font = null;
    
      state.doc.nodesBetween(from, to, (node) => {
        if (node.marks) {
          const mark = node.marks.find((m) => m.type === fontFamilyMark);
          if (mark) {
            font = mark.attrs.font;
          }
        }
      });
    
      return font;
    };


    const menu = menuBar({
      content: [
        [boldItem, italicItem, underlineMenuItem],
        // [fontMenuItem, fontSizeDropdown()],
        [fontMenuItem],
        [textColor, textBGColor],
        [blockquoteItem],
        [alignmentDropdown],
        [listMenuItem],
        [customMenuItemImage, customMenuItemAttachment],
      ],
    });

    // Initialize the editor
    const editor = new EditorView(editorRef.current, {
      state: EditorState.create({
        doc: initialDoc,
        schema,
        // plugins: [keymap(baseKeymap), ...customExampleSetup(schema), menu],
        plugins: [keymap(baseKeymap), menu, fontSelectionPlugin],
      }),
      dispatchTransaction(transaction) {
        const newState = editor.state.apply(transaction);
        editor.updateState(newState);
        setEditorContent(newState.doc.textContent); // Update editor content
        setPmState(newState);
      },
    });
    editor.dom.addEventListener("mouseup", () => updateMenuState(editor));
    editor.dom.addEventListener("keyup", () => updateMenuState(editor));
    setPmView(editor);

    const isMarkActive = (state, markType) => {
      const { from, to, empty } = state.selection;
      if (empty) {
        return !!markType.isInSet(
          state.storedMarks || state.selection.$from.marks()
        );
      } else {
        let hasMark = false;
        state.doc.nodesBetween(from, to, (node) => {
          if (node.marks.some((mark) => mark.type === markType)) {
            hasMark = true;
          }
        });
        return hasMark;
      }
    };
    const updateMenuState = (view) => {
      // console.log('view', view)
      const { state } = view;

      // Filter Text color

      const { from, to } = state.selection;
      let selectedTextColor = "#fff";
      let selectedTextBGColor = "";
      let isBulletList = false;
      let isFont = false;

      // Extract text content and its associated styles
      state.doc.nodesBetween(from, to, (node) => {
        // console.log('node', node.type.schema.schema)
       
        if (node.type.name === "bullet_list") {
          isBulletList = true;
        }
        if (node.isText) {
          node.marks.forEach((mark) => {
            if (mark.type.name === "textColor") {
              selectedTextColor = mark.attrs.color;
            }
            if (mark.type.name === "textBackgroundColor") {
              selectedTextBGColor = mark.attrs.color;
            }
            if (mark.type.name === "fontFamily") {
              isFont = true;
            }
          });
        }
      });

      // Apply active class
      document.querySelectorAll(".ProseMirror-menuitem").forEach((item) => {
        // console.log('item.textContent.trim()', item.textContent.trim())
        if (item.querySelector("div")?.getAttribute("title") === "Bold") {
          if (isMarkActive(state, schema.marks.strong)) {
            item.style.backgroundColor = "#ddd"; // Active state color
          } else {
            item.style.backgroundColor = ""; // Default
          }
        }
        if (item.querySelector("div")?.getAttribute("title") === "Italic") {
          if (isMarkActive(state, schema.marks.em)) {
            item.style.backgroundColor = "#ddd"; // Active state color
          } else {
            item.style.backgroundColor = ""; // Default
          }
        }
        if (item.querySelector("div")?.getAttribute("title") === "Underline") {
          if (isMarkActive(state, schema.marks.underline)) {
            item.style.backgroundColor = "#ddd"; // Active state color
          } else {
            item.style.backgroundColor = ""; // Default
          }
        }

        if (
          item.querySelector("div")?.getAttribute("title") === "Set text color"
        ) {
          const colorSvg = document.querySelector("#text-color-svg");
          if (
            isMarkActive(state, schema.marks.textColor) &&
            colorSvg &&
            selectedTextColor
          ) {
            colorSvg.setAttribute("fill", selectedTextColor);
          } else {
            colorSvg.setAttribute("fill", "#000");
          }
        }

        if (
          item.querySelector("div")?.getAttribute("title") ===
          "Set text bg color"
        ) {
          const colorBgSvg = document.querySelector("#text-bg-color-svg");
          if (
            isMarkActive(state, schema.marks.textBackgroundColor) &&
            colorBgSvg &&
            selectedTextBGColor
          ) {
            colorBgSvg.setAttribute("fill", selectedTextBGColor);
          } else {
            colorBgSvg.setAttribute("fill", "#fff");
          }
        }

        if (
          item.querySelector("div")?.getAttribute("title") === "Select List"
        ) {
          const bulletListButton = document.querySelector(
            '.ProseMirror-menuitem div[title="Select List"]'
          );

          if (
            isListActive(state, schema.nodes.bullet_list) &&
            bulletListButton &&
            isBulletList
          ) {
            const newSvg = listTypes[0];

            const iconContainer =
              bulletListButton.querySelector("#textAlignIcon");

            if (iconContainer) {
              iconContainer.innerHTML = newSvg;
            }
            item.style.backgroundColor = "#ddd";
          } else {
            item.style.backgroundColor = "#fff";
          }
        }

        // if (
        //   item.querySelector("div")?.getAttribute("title") === "Select Font"
        // ) {
        //   const bulletListButton = document.querySelector(
        //     '.ProseMirror-menuitem div[title="Select Font"]'
        //   );

        //   if (
        //     isListActive(state, schema.nodes.bullet_list) &&
        //     bulletListButton &&
        //     isBulletList
        //   ) {
        //     const newSvg = listTypes[0];

        //     const iconContainer =
        //       bulletListButton.querySelector("#textAlignIcon");

        //     if (iconContainer) {
        //       iconContainer.innerHTML = newSvg;
        //     }
        //     item.style.backgroundColor = "#ddd";
        //   } else {
        //     item.style.backgroundColor = "#fff";
        //   }
        // }
      });

      // // Find Bold and Italic buttons using their title attributes
      // const boldButton = document.querySelector('.ProseMirror-menuitem div[title="Bold"]');
      // const italicButton = document.querySelector('.ProseMirror-menuitem div[title="Italic"]');

      // // Set active background color if bold is applied
      // if (boldButton) {
      //   boldButton.style.backgroundColor = isMarkActive(state, schema.marks.strong) ? "#ddd" : "";
      // }

      // // Set active background color if italic is applied
      // if (italicButton) {
      //   italicButton.style.backgroundColor = isMarkActive(state, schema.marks.em) ? "#ddd" : "";
      // }
    };
    // console.log("Editor initialized:", editor);

    // Cleanup on unmount
    return () => {
      editor.destroy();
    };
  }, []);

  const getContentString = () => {
    let fragment = DOMSerializer.fromSchema(editorShema).serializeFragment(
      pmState.doc.content
    );
    let tmp = document.createElement("div");
    tmp.appendChild(fragment);
    return tmp.innerHTML;
  };

  const insertImage = (view, src) => {
    const { state, dispatch } = view;
    const { selection } = state;
    const position = selection.$cursor ? selection.$cursor.pos : selection.from;

    const transaction = state.tr.insert(
      position,
      state.schema.nodes.image.create({ src })
    );

    // console.log("transaction", transaction);

    dispatch(transaction);
  };

  // const onInputChange = useCallback(
  //   (e) => {
  //     if (
  //       pmView?.state.selection.$from.parent.inlineContent &&
  //       e.target.files?.length
  //     ) {
  //       const file = e.target.files[0];
  //       insertImage(
  //         pmView,
  //         "https://48715351.fs1.hubspotusercontent-na1.net/hubfs/48715351/WoodsPortal/242/0-5/18255911574/Notes/1-Jan-17-2025-12-41-53-9842-PM.png"
  //       );
  //       pmView.focus();
  //     }
  //   },
  //   [pmView]
  // );

  useEffect(() => {
    if (pmState) {
      const content = getContentString();
      // console.log("content", content);
      setEditorContent(content);
    }
  }, [pmState?.doc.toJSON()]);

  return (
    <div>
      <div
        ref={editorRef}
        id="prosemirror-editor"
        className="prosemirror-editor"
      ></div>

      <Attachments
        setUploadedAttachments={setUploadedAttachments}
        attachments={uploadedAttachments}
        objectId={objectId}
        id={id}
        isLoadingUoloading={isLoadingUoloading}
        uploadProgress={uploadProgress}
      />

      {/* <input className="hidden" type="file" id="image-upload" ref={fileInputRef} onClick={onInputChange}/> */}

      {/* <button
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        onClick={handleSubmit}
      >
        Get Content
      </button> */}
    </div>
  );
};
