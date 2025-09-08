import { useState, useRef } from 'react';
import {MenuItem as MenuItem2} from "prosemirror-menu"
import {toggleMark as toggleMark2} from "prosemirror-commands"
import { BoldIcon } from '@/assets/icons/BoldIcon';
import { createRoot } from 'react-dom/client';

const activeDynamicClassName = "note-active-state";

const isBoldMarkActive = (state: any, markType: any) => {
  const { from, to, empty } = state.selection;
  if (empty) {
    return !!markType.isInSet(
      state.storedMarks || state.selection.$from.marks()
    );
  } else {
    let hasMark = false;
    state.doc.nodesBetween(from, to, (node: any) => {
      if (node.marks.some((mark: any) => mark.type === markType)) {
        hasMark = true;
      }
    });
    return hasMark;
  }
};

const EditorBoldMenu = ({ editorView }: any) => {
  const boldButtonRef = useRef(null);
  const [selectedEditorBold, setSelectedEditorBold] = useState(false);

  const toggleMenu = () => {
    const { state, dispatch } = editorView;
    setSelectedEditorBold(!selectedEditorBold);
    // console.log('selectedEditorBold', selectedEditorBold)
    toggleMark2(state.schema.marks.strong)(state, dispatch);
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon"
        title="Bold"
        ref={boldButtonRef}
        onClick={toggleMenu}
      >
        <div
          id="selectedEditorBold"
          className={`note-menuitem  ${selectedEditorBold ? activeDynamicClassName : ""}`}
        >
          {/* <SvgRenderer svgContent={boldIcon} /> */}
          <BoldIcon/>
        </div>
      </div>
    </div>
  );
};

const renderReactBoldComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<EditorBoldMenu editorView={editorView} />);
  return container;
};

export const boldItem = new MenuItem2({
  title: `Bold`,
  run: () => {},
  select: (state: any) => {
    const editorListButton = document.querySelector("#selectedEditorBold");
    if (editorListButton && isBoldMarkActive(state, state.schema.marks.strong)) {
      editorListButton.classList.add(activeDynamicClassName);
    } 
    if (editorListButton && !isBoldMarkActive(state, state.schema.marks.strong)) {
      editorListButton.classList.remove(activeDynamicClassName);
    }
    return true;
  },
  render: (editorView: any) => renderReactBoldComponent(editorView),
});
