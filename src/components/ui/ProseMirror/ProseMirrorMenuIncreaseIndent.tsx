import { IncreaseIndentIcon } from "@/assets/icons/IncreaseIndentIcon";
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { createRoot } from 'react-dom/client';

const IncreaseIndentMenu = ({ editorView }: any) => {

  const applyIndentation = (state: any, dispatch: any) => {
    const { schema, selection } = state;
    const nodeType = schema.nodes.paragraph;
    const { from, to } = selection;

    let selectedAlign = null ; // Default if no padding is set
    let currentPaddingLeft = 40; // Default if no padding is set

    // Find the selected paragraph and check its existing padding
    state.doc.nodesBetween(from, to, (node: any) => {
      if (node.type === nodeType) {
        selectedAlign = node.attrs.align
        const existingPadding = parseInt(node.attrs.paddingLeft, 10) || 0;
        currentPaddingLeft = existingPadding > 0 ? existingPadding + 40 : 40; // Double padding each time
      }
    });

    let attrs: any = {
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
            <IncreaseIndentIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

const renderReactIncreaseIndentComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<IncreaseIndentMenu editorView={editorView} />);
  return container;
};

export const proseMirrorMenuIncreaseIndent = new MenuItem2({
  title: `Increase indent`,
  run: () => {},
  select: (state: any) => {
    return true;
  },
  render: (editorView: any) => renderReactIncreaseIndentComponent(editorView),
});
