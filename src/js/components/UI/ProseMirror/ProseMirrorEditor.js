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
  menuConfig = {
    boldItem: true,
    italicItem: true,
    underlineMenuItem: true,
    fontMenuItem: true,
    fontSizeMenuItem: true,
    textColor: true,
    textBGColor: true,
    clearFormattingNoteMenuItem: true,
    blockquoteItem: true,
    alignmentDropdown: true,
    listMenuItem: true,
    insertLinkMenuItem: true,
    proseMirrorMenuDecreaseIndent: false,
    proseMirrorMenuIncreaseIndent: false,
    proseMirrorMenuEmoji: false,
    imageUploader: true,
    attachmentUploader: true,
  }
}) => {
  // Upload
  // const fileInputRef = useRef(null);
  // const token = getAuthToken();
  // const [uploadedAttachments, setUploadedAttachments] = useState(attachments);
  // const [isLoadingUoloading, setisLoadingUoloading] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const [isOpenLinkPopup, setIsOpenLinkPopup] = useState(false);

  const editorMenuConfig = {
    boldItem: menuConfig?.boldItem ?? true,
    italicItem: menuConfig?.italicItem ?? true,
    underlineMenuItem: menuConfig?.underlineMenuItem ?? true,
    fontMenuItem: menuConfig?.fontMenuItem ?? true,
    fontSizeMenuItem: menuConfig?.fontSizeMenuItem ?? true,
    textColor: menuConfig?.textColor ?? true,
    textBGColor: menuConfig?.textBGColor ?? true,
    clearFormattingNoteMenuItem: menuConfig?.clearFormattingNoteMenuItem ?? true,
    blockquoteItem: menuConfig?.blockquoteItem ?? true,
    alignmentDropdown: menuConfig?.alignmentDropdown ?? true,
    listMenuItem: menuConfig?.listMenuItem ?? true,
    insertLinkMenuItem: menuConfig?.insertLinkMenuItem ?? true,
    proseMirrorMenuDecreaseIndent: menuConfig?.proseMirrorMenuDecreaseIndent ?? true,
    proseMirrorMenuIncreaseIndent: menuConfig?.proseMirrorMenuIncreaseIndent ?? true,
    proseMirrorMenuEmoji: menuConfig?.proseMirrorMenuEmoji ?? true,
    imageUploader: menuConfig?.imageUploader ?? true,
    attachmentUploader: menuConfig?.attachmentUploader ?? true,
  }

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
  const [editorShema, setEditorSchema] = useState(null);
  const [initialDoc, setInitialDoc] = useState(null);
  const { DOMSerializer } = window.DOMSerializer;

  useEffect(() => {
    if (attachments.length > 0) {
      setUploadedAttachments(attachments);
    } else {
      setUploadedAttachments([]);
    }
  }, []);

  // const imageNodeSpec = {
  //   inline: false, // Defines the image as a block-level element
  //   attrs: {
  //     src: {}, // The source URL of the image (required)
  //     width: { default: "" }, // Width attribute (default empty)
  //     height: { default: "" }, // Height attribute (default empty)
  //     style: { default: "" }, // Added to capture styles like text alignment
  //   },
  //   group: "block", // Defines this node as part of the block group
  //   draggable: false, // Prevents dragging the node in the editor
  //   selectable: false, // Prevents text input in the same line
  //   parseDOM: [
  //     {
  //       tag: "figure, div.image-container", // Matches <figure> or <div> containers
  //       getAttrs(dom) {
  //         const img = dom.querySelector("img"); // Selects the inner <img> tag

  //         return {
  //           src: img ? img.getAttribute("src") : "",
  //           width: img ? img.getAttribute("width") || "" : "",
  //           height: img ? img.getAttribute("height") || "" : "",
  //           style: dom.getAttribute("style") || "", // Extracts container style like text-align
  //         };
  //       },
  //     },
  //   ],
  //   toDOM(node) {
  //     return [
  //       "div",
  //       { class: "image-container" }, // Apply style if available
  //       [
  //         "img",
  //         {
  //           src: node.attrs.src,
  //           width: node.attrs.width,
  //           height: node.attrs.height,
  //         },
  //       ],
  //     ];
  //   },
  // };

  const imageNodeSpec = {
    inline: false, // Defines the image as a block-level element
    attrs: {
      src: {}, // The source URL of the image (required)
      width: { default: "" }, // Image width
      height: { default: "" }, // Image height
      style: { default: "" }, // Style for alignment or other container-level styles
      wrap: { default: false }, // Boolean to check if image is wrapped with <figure>
    },
    group: "block",
    draggable: false,
    selectable: false,
    parseDOM: [
      // Image wrapped in a <figure> tag
      {
        tag: "figure",
        getAttrs(dom) {
          const img = dom.querySelector("img");
          return {
            src: img ? img.getAttribute("src") : "",
            width: img ? img.getAttribute("width") : "",
            height: img ? img.getAttribute("height") : "",
            style: dom.getAttribute("style") || "", // Capture figure's style (e.g., text-align)
            wrap: true, // Mark that the image is wrapped
          };
        },
      },
      // Image without <figure> wrapper
      {
        tag: "img",
        getAttrs(dom) {
          return {
            src: dom.getAttribute("src"),
            width: dom.getAttribute("width"),
            height: dom.getAttribute("height"),
            style: "", // No wrapper, so no additional style from <figure>
            wrap: false, // Not wrapped in a <figure>
          };
        },
      },
    ],
    toDOM(node) {
      // Render based on whether the image is wrapped or not
      if (node.attrs.wrap) {
        return [
          "figure",
          { style: node.attrs.style || "" }, // Apply text-align or other styles if present
          [
            "img",
            {
              src: node.attrs.src,
              width: node.attrs.width,
              height: node.attrs.height,
            },
          ],
        ];
      } else {
        return [
          "img",
          {
            src: node.attrs.src,
            width: node.attrs.width,
            height: node.attrs.height,
          },
        ];
      }
    },
  };

  useEffect(() => {
    // setUploadedAttachments([]);
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
        paddingLeft: { default: 0 }, // New attribute for padding
      },
      parseDOM: [
        {
          tag: "p",
          // getAttrs: (dom) => ({
          //   align: dom?.style?.textAlign || null,
          // }),
          getAttrs: (dom) => ({
            align: dom?.style?.textAlign || null,
            paddingLeft: dom?.style?.paddingLeft
            ? parseInt(dom.style.paddingLeft, 10) // Extract padding value as an integer
            : 0,
          }),
        },
      ],
      toDOM(node) {
        const { align, paddingLeft } = node.attrs;
        // console.log("node.attrs", node.attrs)
        // return ["p", { style: align ? `text-align: ${align};` : "" }, 0];
        return [
          "p",
          {
            style: `
              ${align ? `text-align: ${align};` : ""}
              ${paddingLeft ? `padding-left: ${paddingLeft}` : ""}
            `,
            // "data-mce-style": `padding-left: ${paddingLeft}px;`, // TinyMCE compatibility
          },
          0,
        ];
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

    const alignmentMark = {
      attrs: { align: { default: "left" } }, // Default alignment is 'left'
      parseDOM: [
        {
          style: "text-align",
          getAttrs: (value) => ({ align: value }),
        },
      ],
      toDOM: (mark) => ["span", { style: `text-align: ${mark.attrs.align};` }],
    };

    const nodes = baseSchema.spec.nodes
      .update("paragraph", paragraphNode)
      .addToEnd("image", imageNodeSpec);
    const nodesWithList = addListNodes(nodes, "paragraph block*", "block");

    const schema = new Schema({
      nodes: nodesWithList,
      marks: {
        link: linkMark,
        alignment: alignmentMark,
        em: {
          toDOM: () => ["em", 0],
          parseDOM: [{ tag: "em" }],
        },
        strong: {
          toDOM: () => ["strong", 0],
          parseDOM: [{ tag: "strong" }],
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
        }
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

    const menuBarContent =  [
      [
        editorMenuConfig.boldItem && boldItem,
        editorMenuConfig.italicItem && italicItem,
        editorMenuConfig.underlineMenuItem && underlineMenuItem,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.fontMenuItem && fontMenuItem,
        editorMenuConfig.fontSizeMenuItem && fontSizeMenuItem,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.textColor && textColor,
        editorMenuConfig.textBGColor && textBGColor,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.clearFormattingNoteMenuItem && clearFormattingNoteMenuItem,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.blockquoteItem && blockquoteItem,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.alignmentDropdown && alignmentDropdown,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.listMenuItem && listMenuItem,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.insertLinkMenuItem && insertLinkMenuItem,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.proseMirrorMenuDecreaseIndent && proseMirrorMenuDecreaseIndent,
        editorMenuConfig.proseMirrorMenuIncreaseIndent && proseMirrorMenuIncreaseIndent,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.proseMirrorMenuEmoji && proseMirrorMenuEmoji,
      ].filter(Boolean), // Remove undefined/false items
      [
        editorMenuConfig.imageUploader && imageUploader(),
        editorMenuConfig.attachmentUploader && attachmentUploader(),
      ].filter(Boolean), // Remove undefined/false items
    ]

    const menu = menuBar({
      content:menuBarContent,
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
        image: ProseMirrorImageResizeView(),
        link: ProseMirrorLinkView,
      },
      dispatchTransaction(transaction) {
        const newState = editor.state.apply(transaction);
        editor.updateState(newState);
        setEditorContent(newState.doc.textContent); // Update editor content
        setPmState(newState);
      },
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
        className="text-[#000] prosemirror-editor dark:bg-white rounded border border-[#7fd1de] pt-0"
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
