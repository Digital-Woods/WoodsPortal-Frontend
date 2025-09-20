import { DecreaseIndentIcon } from "@/assets/icons/DecreaseIndentIcon";
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { createRoot } from 'react-dom/client';

const DecreaseIndentMenu = ({ editorView }: any) => {
  // const decreaseIndentIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#e8eaed"><path d="M120-120v-80h720v80H120Zm320-160v-80h400v80H440Zm0-160v-80h400v80H440Zm0-160v-80h400v80H440ZM120-760v-80h720v80H120Zm160 440L120-480l160-160v320Z"/></svg>`;

  const applyIndentation = (state: any, dispatch: any) => {
    const { schema, selection } = state;
    const nodeType = schema.nodes.paragraph;
    const { from, to } = selection;

    let selectedAlign = null; // Store alignment attribute if present
    let currentPaddingLeft = 0; // Default padding

    // Find the selected paragraph and check its existing padding
    state.doc.nodesBetween(from, to, (node: any) => {
      if (node.type === nodeType) {
        selectedAlign = node.attrs.align || null;
        const existingPadding = parseInt(node.attrs.paddingLeft, 10) || 0;
        currentPaddingLeft = existingPadding > 0 ? existingPadding - 40 : 0;
      }
    });

    // Construct attributes object
    let attrs: any = {};
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
        class="CUSTOM-ProseMirror-icon"
        title="Decrease indent"
        ref={DecreaseIndentMenu}
        onClick={() => {
          changeIndentation();
        }}
      >
        <div className={`CUSTOM-note-menuitem`}>
          <div id="textAlignIcon">
            {/* <SvgRenderer svgContent={decreaseIndentIcon} /> */}
            <DecreaseIndentIcon/>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderReactDecreaseIndentComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<DecreaseIndentMenu editorView={editorView} />, container);
  return container;
};

export const proseMirrorMenuDecreaseIndent = new MenuItem2({
  title: `Decrease indent`,
  run: () => {},
  select: (state: any) => {
    return true;
  },
  render: (editorView: any) => renderReactDecreaseIndentComponent(editorView),
});
