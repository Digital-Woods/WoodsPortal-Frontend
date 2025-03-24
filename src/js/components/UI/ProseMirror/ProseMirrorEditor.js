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
  // const fileInputRef = useRef(null);
  // const token = getAuthToken();
  // const [uploadedAttachments, setUploadedAttachments] = useState(attachments);
  // const [isLoadingUoloading, setisLoadingUoloading] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const [isOpenLinkPopup, setIsOpenLinkPopup] = useState(false);
  const linkPopupRef = useRef(null);

  const {
    isLoadingUoloading,
    setisLoadingUoloading,
    uploadProgress,
    setUploadProgress,
    uploadedAttachments,
    setUploadedAttachments,
  } = useEditor();

  // Plugin
  const editorRef = useRef(null);
  const [pmState, setPmState] = useState();
  const [pmView, setPmView] = useState();
  const [editorShema, setEditorSchema] = useState(null);
  const [initialDoc, setInitialDoc] = useState(null);
  const { DOMSerializer } = window.DOMSerializer;

  useEffect(() => {
    if (attachments.length > 0) setUploadedAttachments(attachments);
  }, [attachments]);

  const imageNodeSpec = {
    inline: false, // Defines the image as an inline node
    attrs: {
      src: {}, // The source URL of the image (required)
      width: { default: "" },
      height: { default: "" },
      // class: { default: "w-auto h-auto" },
      // alt: { default: null }, // Alternative text (optional)
      // title: { default: null }, // Title for the image (optional)
    },
    group: "block", // Belongs to the "inline" group
    draggable: false, // Makes the image draggable in the editor
    selectable: false, // Prevents text input in the same line
    parseDOM: [
      {
        tag: "img[src]", // Matches <img> elements with a `src` attribute
        getAttrs(dom) {
          return {
            src: dom.getAttribute("src"),
            width: dom.getAttribute("width") || "",
            height: dom.getAttribute("height") || "",
            // class: dom.getAttribute("class") || "w-auto h-auto",
            // alt: dom.getAttribute("alt"),
            // title: dom.getAttribute("title"),
          };
        },
      },
    ],
    toDOM(node) {
      return [
        "div", // Wrap in a `div` to enforce block behavior
        { class: "image-container" }, // Optional class for further styling
        [
          "img",
          {
            src: node.attrs.src,
            width: node.attrs.width,
            height: node.attrs.height,
          },
        ],
      ]; // Renders the image node as a block element
    },
  };

  useEffect(() => {
    setUploadedAttachments([]);
    const { Schema, DOMParser } = window.ProseMirrorModel;
    const { addListNodes } = window.addListNodes;
    const { baseSchema } = window.baseSchema;

    // const linkMark = {
    //   attrs: {
    //     href: {},
    //     title: { default: "" }, // Add title attribute
    //   },
    //   inclusive: false,
    //   parseDOM: [
    //     {
    //       tag: "a[href]",
    //       getAttrs(dom) {
    //         return {
    //           href: dom.getAttribute("href"),
    //           title: dom.getAttribute("title") || "",
    //         };
    //       },
    //     },
    //   ],
    //   toDOM(node) {
    //     return [
    //       "a",
    //       {
    //         href: node.attrs.href,
    //         title: node.attrs.title,
    //         target: "_blank",
    //         rel: "noopener noreferrer",
    //       },
    //       0, // This means the text inside will be editable
    //     ];
    //   },
    // };

    const linkMark = {
      attrs: {
        href: {},
        title: { default: "" },
        target: {},
      },
      inclusive: false,
      parseDOM: [
        {
          tag: "a[href]",
          getAttrs(dom) {
            return {
              href: dom.getAttribute("href"),
              title: dom.getAttribute("title") || dom.textContent, // Use text content if no title
              target: dom.getAttribute("target"),
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "a",
          {
            href: node.attrs.href,
            title: node.attrs.title,
            target: node.attrs.target,
          },
          0, // This means the text inside will be editable
        ];
      },
    };

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
            align: dom?.style?.textAlign || null,
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

    const nodes = baseSchema.spec.nodes
      .update("paragraph", paragraphNode)
      .addToEnd("image", imageNodeSpec);
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
        link: linkMark,
      },
    });
    setEditorSchema(schema);
  }, []);

  useEffect(() => {
    const { Schema, DOMParser } = window.ProseMirrorModel;
    if (!editorShema) return;
    // Create an initial document with some content
    const initialContent = document.createElement("div");
    // initialContent.innerHTML = `<p>Start typing!</p> <p><img src="https://prosemirror.net/img/picture.png" alt="Image" contenteditable="false"><img class="ProseMirror-separator" alt=""><br class="ProseMirror-trailingBreak"></p>`;
    initialContent.innerHTML = initialData;
    const mInitialDoc = DOMParser.fromSchema(editorShema).parse(initialContent);
    setInitialDoc(mInitialDoc);
  }, [editorShema]);

  // useEffect(() => {
  //   console.log("linkData", linkData)
  // }, [linkData]);

  useEffect(() => {
    if (!editorShema && !initialDoc) return;

    const { EditorState } = window.ProseMirrorState;
    const { EditorView } = window.ProseMirrorView;
    const { keymap, baseKeymap } = window.ProseMirrorKeymap;
    const { menuBar } = window.menuBar;
    const { liftListItem } = window.liftListItem;
    const { sinkListItem } = window.sinkListItem;
    const { chainCommands } = window.chainCommands;
    const { exitCode } = window.exitCode;
    const { splitBlock } = window.splitBlock;
    const { lift } = window.ProseMirrorLift;
    const { history, undo, redo } = window.ProseMirrorHistory;

    const schema = editorShema;

    const imageUploader = () => {
      return customMenuItemImage(
        imageUploadUrl,
        setisLoadingUoloading,
        setUploadProgress
      );
    };

    const attachmentUploader = () => {
      return customMenuItemAttachment(
        attachmentUploadUrl,
        attachmentUploadMethod,
        setUploadedAttachments,
        setisLoadingUoloading,
        setUploadProgress,
        setAttachmentId
      );
    };

    const menu = menuBar({
      content: [
        [boldItem, italicItem, underlineMenuItem],
        [fontMenuItem, fontSizeMenuItem],
        [textColor, textBGColor],
        [clearFormattingNoteMenuItem],
        [blockquoteItem],
        [alignmentDropdown],
        [listMenuItem],
        [insertLinkMenuItem],
        [imageUploader(), attachmentUploader()],
      ],
    });

    const customEnterHandler = (state, dispatch) => {
      const { schema, selection } = state;
      const { $from, $to } = selection;
      const tr = state.tr;

      if (!dispatch) return false;

      const parentNode = $from.node(-1);

      if (parentNode && parentNode.type.name === "blockquote") {
        if ($from.parent.textContent.length === 0) {
          lift(state, dispatch);
          return true;
        }
      }

      // Check if we are inside a list item
      const listItem = $from.node(-1);

      if ($from.parent.textContent.length === 0) {
        if (listItem && listItem.type.name === "list_item") {
          liftListItem(schema.nodes.list_item)(state, dispatch);
          // dispatch(tr);
          return true;
        }
      }
      if (listItem && listItem.type.name === "list_item") {
        tr.split($from.pos, 2); // Split inside the list item
      } else {
        tr.split($from.pos); // Regular split
      }

      // Preserve active marks (bold, italic, etc.)
      const activeMarks = state.storedMarks || $from.marks();
      activeMarks.forEach((mark) => {
        tr.addStoredMark(schema.marks[mark.type.name].create(mark.attrs));
      });

      dispatch(tr);
      return true;
    };

    // Initialize the editor
    const editor = new EditorView(editorRef.current, {
      state: EditorState.create({
        doc: initialDoc,
        schema,
        plugins: [
          history(), // Enables history tracking
          keymap({
            Enter: chainCommands(exitCode, customEnterHandler, splitBlock),
            Tab: (state, dispatch) => {
              return sinkListItem(state.schema.nodes.list_item)(
                state,
                dispatch
              );
            },
            "Shift-Enter": baseKeymap["Enter"], // Allow Shift+Enter to add a line break instead of a new list item
            "Mod-z": undo, // Ctrl + Z or Cmd + Z for undo
            "Mod-y": redo, // Ctrl + Y or Cmd + Shift + Z for redo
          }),
          keymap(baseKeymap),
          menu,
          fontSelectionPlugin,
          fontSizeSelectionPlugin,
          textColorPlugin,
          textBGColorPlugin,
        ],
      }),
      nodeViews: {
        image: ProseMirrorImageResize(),
      },
      dispatchTransaction(transaction) {
        const newState = editor.state.apply(transaction);
        editor.updateState(newState);
        setEditorContent(newState.doc.textContent); // Update editor content
        setPmState(newState);
      },
    });

    let isOpenLinkPopup = true;
    let isOpenLinkPopupId = "";

    const closeLinkPopup = () => {
      document.body.removeChild(linkPopupRef.current);
      linkPopupRef.current = null;
      isOpenLinkPopup = !isOpenLinkPopup;
    };

    const handleClickOutside = (event) => {
      if (
        linkPopupRef.current &&
        !linkPopupRef.current.contains(event.target)
      ) {
        closeLinkPopup();
      }
    };

    // Detect click on a link inside the editor
    editor.dom.addEventListener("click", (event) => {
      let target = event.target.closest("a"); // Find closest <a> element
      if (target) {
        event.preventDefault(); // Prevent default navigation

        if (!isOpenLinkPopup && linkPopupRef.current) {
          document.body.removeChild(linkPopupRef.current);
          linkPopupRef.current = null;
        }

        isOpenLinkPopup = !isOpenLinkPopup;

        setTimeout(() => {
          document.addEventListener("mousedown", handleClickOutside);
        }, 0);

        if (!isOpenLinkPopup) {
          const randomId = Math.floor(Math.random() * 10000000) + 1;
          target.id = `main-${randomId}`;
          target.classList.add("relative", "inline-block");
          const href = target.getAttribute("href");
          const title = target.getAttribute("title") || target.textContent;
          const target_b = target.getAttribute("target");

          let container = document.createElement("div");
          document.body.appendChild(container);

          linkPopupRef.current = container;

          ReactDOM.render(
            <ProseMirrorMenuInsertLinkPopUp
              randomId={randomId}
              editorView={editor}
              href={href}
              title={title}
              target={target_b}
              closeLinkPopup={closeLinkPopup}
            />,
            container
          );
        }
      }
    });

    // Cleanup on unmount
    return () => {
      editor.destroy();
    };
  }, [editorShema, initialDoc]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  useEffect(() => {
    if (pmState) {
      const { doc } = pmState;
      const isEmpty =
        doc.content.childCount === 1 && doc.textContent.trim() === "";
      const content = isEmpty ? "" : getContentString();

      setEditorContent(content);
    }
  }, [pmState?.doc.toJSON()]);

  return (
    <div>
      <div
        ref={editorRef}
        id="prosemirror-editor"
        className="text-[#000] prosemirror-editor dark:bg-white pt-3 rounded"
      ></div>

      <Attachments
        setUploadedAttachments={setUploadedAttachments}
        attachments={uploadedAttachments}
        objectId={objectId}
        id={id}
        isLoadingUoloading={isLoadingUoloading}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};
