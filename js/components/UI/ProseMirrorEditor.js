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
  const { baseSchema } = window.baseSchema;

  const setAlignment = (state, dispatch, nodeType, align) => {
    const { from, to } = state.selection;
    if (dispatch) {
      dispatch(state.tr.setBlockType(from, to, nodeType, { align }));
    }
    return true;
  };

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

  // Mark
  const underlineMark = {
    attrs: {
      align: { default: null },
    },
    parseDOM: [
      {
        // style: "text-align",
        // getAttrs: (value) => {
        //   if (value === "left" || value === "center" || value === "right") {
        //     return { align: value };
        //   }
        //   return null;
        // },
        tag: "u"
      },
    ],
    toDOM(mark) {
      // return ["span", { style: `text-align: ${mark.attrs.align || "left"};` }];
      return ["u", 0];
    },
  };

  useEffect(() => {
    const { EditorState } = window.ProseMirrorState;
    const { EditorView } = window.ProseMirrorView;
    const { Schema, DOMParser } = window.ProseMirrorModel;
    const { keymap, baseKeymap } = window.ProseMirrorKeymap;
    const { exampleSetup } = window.ProseMirrorExampleSetup;
    const { addListNodes } = window.addListNodes;
    // const { OrderedMap } = window.OrderedMap;

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

    const myNodes = {
      doc: { content: "block+" },
      paragraph: paragraphNode,
      text: { group: "inline" },
      // text: { inline: true },
      heading: {
        content: "text*",
        group: "block",
        toDOM: (node) => ["h" + node.attrs.level, 0],
        parseDOM: [
          { tag: "h1", attrs: { level: 1 } },
          { tag: "h2", attrs: { level: 2 } },
          { tag: "h3", attrs: { level: 3 } },
        ],
        attrs: { level: { default: 1 } },
      },
      hard_break: {
        inline: true,
        group: "inline",
        selectable: false,
        toDOM: () => ["br"],
        parseDOM: [{ tag: "br" }],
      },
      image: imageNodeSpec,
    };
    // const nodesWithList = addListNodes(schema.spec.nodes, "paragraph block*", "block");
    const nodes = baseSchema.spec.nodes.update("paragraph", paragraphNode);
    const nodesWithList = addListNodes(nodes, "paragraph block*", "block");

    const schema = new Schema({
      nodes: nodesWithList,
      marks: {
        alignment: underlineMark,
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
      },
    });
    setEditorSchema(schema);

    const customMenuItemTextLeft = new MenuItem({
      title: "Insert Text",
      run: (state, dispatch, view) => {
        setAlignment(state, dispatch, schema.nodes.paragraph, "left");
      },
      select: (state) => true, // Show this item always
      icon: {
        dom: (() => {
          const span = document.createElement("span");
          span.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>
    `;
          span.className = "custom-menu-icon";
          return span;
        })(),
      },
    });
    const customMenuItemTextCenter = new MenuItem({
      title: "Insert Text",
      run: (state, dispatch, view) => {
        setAlignment(state, dispatch, schema.nodes.paragraph, "center");
      },
      select: (state) => true, // Show this item always
      icon: {
        dom: (() => {
          const span = document.createElement("span");
          span.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>
    `;
          span.className = "custom-menu-icon";
          return span;
        })(),
      },
    });
    const customMenuItemTextRight = new MenuItem({
      title: "Underline Text",
      run: (state, dispatch, view) => {
        setAlignment(state, dispatch, schema.nodes.paragraph, "right");
      },
      select: (state) => true, // Show this item always
      icon: {
        dom: (() => {
          const span = document.createElement("span");
          span.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>
    `;
          span.className = "custom-menu-icon";
          return span;
        })(),
      },
    });

    const setAlignment = (state, dispatch, markType, align) => {
        const { from, to } = state.selection;
        if (dispatch) {
          dispatch(state.tr.addMark(from, to, markType.create({ align })));
        }
        return true;
    }
    const customMenuItemTextUnderline = new MenuItem({
      title: "Underline Text",
      run: (state, dispatch, view) => {
        setAlignment(state, dispatch, schema.marks.alignment, "center");
      },
      select: (state) => true, // Show this item always
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
    });

    const customExampleSetup = (schema) => {
      // const menu = buildMenuItems(schema).fullMenu;
      // menu[1][0].content.push(customMenuItemImage);
      // menu[1][0].content.shift();
      const menuItems = buildMenuItems(schema);
      menuItems.inlineMenu[0].push(customMenuItemTextUnderline);
      menuItems.inlineMenu[0].push(customMenuItemTextLeft);
      menuItems.inlineMenu[0].push(customMenuItemTextCenter);
      menuItems.inlineMenu[0].push(customMenuItemTextRight);
      menuItems.inlineMenu[0].push(customMenuItemImage);
      menuItems.inlineMenu[0].push(customMenuItemAttachment);
      const menu = menuItems.fullMenu;
      return exampleSetup({ schema, menuContent: menu });
    };

    // Create an initial document with some content
    const initialContent = document.createElement("div");
    // initialContent.innerHTML = `<p>Start typing!</p> <p><img src="https://prosemirror.net/img/picture.png" alt="Image" contenteditable="false"><img class="ProseMirror-separator" alt=""><br class="ProseMirror-trailingBreak"></p>`;
    initialContent.innerHTML = initialData;
    const initialDoc = DOMParser.fromSchema(schema).parse(initialContent);

    // Initialize the editor
    const editor = new EditorView(editorRef.current, {
      state: EditorState.create({
        doc: initialDoc,
        schema,
        plugins: [keymap(baseKeymap), ...customExampleSetup(schema)],
      }),
      dispatchTransaction(transaction) {
        const newState = editor.state.apply(transaction);
        editor.updateState(newState);
        setEditorContent(newState.doc.textContent); // Update editor content
        setPmState(newState);
      },
    });
    setPmView(editor);
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

  // const handleSubmit = () => {
  //   console.log(" editorContent", pmState.doc.content);
  //   console.log("getContentString", getContentString());
  // };

  const insertImage = (view, src) => {
    const { state, dispatch } = view;
    const { selection } = state;
    const position = selection.$cursor ? selection.$cursor.pos : selection.from;

    const transaction = state.tr.insert(
      position,
      state.schema.nodes.image.create({ src })
    );

    console.log("transaction", transaction);

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
      console.log("content", content);
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
