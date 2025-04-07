const DecreaseIndentMenu = ({ editorView }) => {
  const decreaseIndentIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-120v-80h720v80H120Zm320-160v-80h400v80H440Zm0-160v-80h400v80H440Zm0-160v-80h400v80H440ZM120-760v-80h720v80H120Zm160 440L120-480l160-160v320Z"/></svg>`;

  const applyIndentation = (state, dispatch) => {
    const { schema, selection } = state;
    const nodeType = schema.nodes.paragraph;
    const { from, to } = selection;

    let selectedAlign = null; // Store alignment attribute if present
    let currentPaddingLeft = 0; // Default padding

    // Find the selected paragraph and check its existing padding
    state.doc.nodesBetween(from, to, (node) => {
      if (node.type === nodeType) {
        selectedAlign = node.attrs.align || null;
        const existingPadding = parseInt(node.attrs.paddingLeft, 10) || 0;
        currentPaddingLeft = existingPadding > 0 ? existingPadding - 40 : 0;
      }
    });

    // Construct attributes object
    let attrs = {};
    if (currentPaddingLeft > 0) {
      attrs.paddingLeft = `${currentPaddingLeft}px`;
    } // Remove paddingLeft if it's 0
    if (selectedAlign) {
      attrs.align = selectedAlign;
    } // Keep existing alignment

    if (dispatch) {
      dispatch(state.tr.setBlockType(from, to, nodeType, attrs));
    }
    return true;
  };

  const changeIndentation = () => {
    applyIndentation(editorView.state, editorView.dispatch);
  };

  return (
    <div className="relative inline-block">
      <div
        class="ProseMirror-icon"
        title="Decrease indent"
        ref={DecreaseIndentMenu}
        onClick={() => {
          changeIndentation();
        }}
      >
        <div className={`note-menuitem`}>
          <div id="textAlignIcon">
            <SvgRenderer svgContent={decreaseIndentIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const renderReactDecreaseIndentComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<DecreaseIndentMenu editorView={editorView} />, container);
  return container;
};

const proseMirrorMenuDecreaseIndent = new MenuItem2({
  title: `Decrease indent`,
  run: () => {},
  select: (state) => {
    return true;
  },
  render: (editorView) => renderReactDecreaseIndentComponent(editorView),
});
