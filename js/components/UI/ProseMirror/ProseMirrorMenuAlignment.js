const alignments = [
  {
    label: "Left",
    value: "left",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Center",
    value: "center",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Right",
    value: "right",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`,
  },
];

// // Helper: Traverses the selection to find the first fontFamily mark.
// const getFontSizeFromSelection = (state) => {
//   const { from, to } = state.selection;
//   const markType = state.schema.marks.fontSize;
//   let fontSize = null;

//   state.doc.nodesBetween(from, to, (node) => {
//     if (node.marks && node.marks.length) {
//       const mark = node.marks.find((m) => m.type === markType);
//       if (mark) {
//         fontSize = mark.attrs.fontSize;
//         // Stop traversing early if a font is found.
//         return false;
//       }
//     }
//   });
//   return fontSize;
// };

// const ProseMirrorPlugin2 = window.ProseMirrorPlugin;
// const ProseMirrorPluginKey2 = window.ProseMirrorPluginKey;

// // Create a plugin key for later access.
// const fontSizeSelectionPluginKey = new ProseMirrorPluginKey2("fontSizeSelection");

// // Create the plugin.
// const fontSizeSelectionPlugin = new ProseMirrorPlugin2({
//   key: fontSizeSelectionPluginKey,
//   state: {
//     init(_config, state) {
//       // Calculate the initial font value from the selection (if any).
//       return getFontSizeFromSelection(state) || null;
//     },
//     apply(tr, value, oldState, newState) {
//       // When the document changes or selection is updated, recalc the font.
//       if (tr.docChanged || tr.selectionSet) {
//         return getFontSizeFromSelection(newState) || null;
//       }
//       return value;
//     },
//   },
// });

// let mEditorFontSize = "";

// const DropdownFontSizeMenu = ({ editorView, activeFont2 }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [font, setFont] = useState(textFontSizes[0]);

//   const dropdownButtonRef = useRef(null);
//   const dropdownMenuRef = useRef(null);

//   const toggleMenu = () => {
//     setIsOpen((prevState) => !prevState);
//   };

//   const applyFontSize = (fontSize) => {
//     return (state, dispatch) => {
//       const { schema, selection } = state;
//       const { from, to } = selection;
//       const nodeType = schema.nodes.paragraph;
  
//       if (dispatch) {
//         dispatch(state.tr.setBlockType(from, to, nodeType, { align }));
//       }
//       return true;
//     };
//   };
  

//   useEffect(() => {
//     if (mEditorFontSize) setFont(mEditorFontSize);
//   }, [mEditorFontSize]);

//   return (
//     <div className="relative inline-block">
//       <div
//         class="ProseMirror-icon"
//         title="Select Text Alignment"
//         ref={dropdownButtonRef}
//         onClick={toggleMenu}
//       >
//         <div id="textFontSize">
//           {/* {mEditorFontSize ? mEditorFontSize : font.label} */}
//           {/* <SvgRenderer svgContent={font.icon} /> */}
//           select A
//         </div>
//       </div>
//       {isOpen && (
//         <div
//           ref={dropdownMenuRef}
//           // className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white shadow-lg rounded w-48 z-10"
//           className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded z-10"
//         >
//           <ul class="space-y-2 text-gray-500 list-none list-inside dark:text-gray-400">
//             {textFontSizes.map((textFont) => (
//               <li
//                 key={textFont.value}
//                 className="cursor-pointer hover:bg-gray-200 px-4 py-1"
//                 onClick={() => {
//                   setFont(textFont);
//                   mEditorFontSize = textFont.label;
//                   applyFontSize(textFont.value)(
//                     editorView.state,
//                     editorView.dispatch
//                   );
//                 }}
//               >
//                 {textFont.label}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderReactFontSizeComponent = (editorView) => {
//   const container = document.createElement("div");
//   ReactDOM.render(<DropdownFontSizeMenu editorView={editorView} />, container);
//   return container;
// };

// const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

// const fontSizeMenuItem = new MenuItem2({
//   title: `Select Font Size`,
//   run: (state, dispatch, editorView) => {
//     const newFont = fontSizeSelectionPluginKey.getState(state); // Example selected font
//     const tr = state.tr;
//     console.log("newFont", newFont);
//     // Set the font selection in the plugin state
//     tr.setMeta(fontSizeSelectionPluginKey, newFont);
//     // Dispatch the transaction to update the plugin state
//     dispatch(tr);
//     // Update the editor state so the plugin state is re-read and the component can re-render
//     editorView.updateState(state); // This will trigger a re-render in ProseMirror and React
//   },
//   select: (state) => {
//     // Use plugin state for enabling/disabling this item
//     const activeFont = fontSizeSelectionPluginKey.getState(state) || true;
//     mEditorFontSize = fontSizeSelectionPluginKey.getState(state);
//     const div = document.getElementById("textFontSize");
//     if (div && mEditorFontSize) {
//       div.textContent = mEditorFontSize; // Change text content
//     }
//     return activeFont !== null;
//   },
//   render: (editorView) => renderReactFontSizeComponent(editorView),
//   active: (state) => {
//     const selectedFontSize = fontSizeSelectionPluginKey.getState(state);
//     return selectedFontSize ? true : false;
//   },
// });


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

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;


const renderReactAlignComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(
    <DropdownAlightMenu editorView={editorView} />,
    container
  );
  return container;
};
const alignmentDropdown = new MenuItem2({
  title: `Select Alignment`,
  run: () => {},
  select: (state) => true,
  render: (editorView) => renderReactAlignComponent(editorView),
});