const IncreaseIndentMenu = ({ editorView }) => {
  const increaseIndentIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-120v-80h720v80H120Zm320-160v-80h400v80H440Zm0-160v-80h400v80H440Zm0-160v-80h400v80H440ZM120-760v-80h720v80H120Zm0 440v-320l160 160-160 160Z"/></svg>`;

  const applyIndentation = (state, dispatch) => {
    const { schema, selection } = state;
    const nodeType = schema.nodes.paragraph;
    const { from, to } = selection;

    let selectedAlign = null ; // Default if no padding is set
    let currentPaddingLeft = 40; // Default if no padding is set

    // Find the selected paragraph and check its existing padding
    state.doc.nodesBetween(from, to, (node) => {
      if (node.type === nodeType) {
        selectedAlign = node.attrs.align
        const existingPadding = parseInt(node.attrs.paddingLeft, 10) || 0;
        currentPaddingLeft = existingPadding > 0 ? existingPadding + 40 : 40; // Double padding each time
      }
    });

    let attrs = {
      paddingLeft: `${currentPaddingLeft}px`,
    }
    if(selectedAlign) attrs.align = selectedAlign;

    if (dispatch) {
      dispatch(
        state.tr.setBlockType(from, to, nodeType, attrs)
      );
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
        title="Increase indent"
        ref={IncreaseIndentMenu}
        onClick={() => {
          changeIndentation();
        }}
      >
        <div className={`note-menuitem`}>
          <div id="textAlignIcon">
            {/* <SvgRenderer svgContent={increaseIndentIcon} /> */}
            <IecreaseIndentIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const renderReactIncreaseIndentComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<IncreaseIndentMenu editorView={editorView} />, container);
  return container;
};

const proseMirrorMenuIncreaseIndent = new MenuItem2({
  title: `Increase indent`,
  run: () => {},
  select: (state) => {
    return true;
  },
  render: (editorView) => renderReactIncreaseIndentComponent(editorView),
});
