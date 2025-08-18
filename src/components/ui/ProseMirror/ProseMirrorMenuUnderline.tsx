// const { toggleMark: toggleMark2 } = window.toggleMark;
// const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

// const underlineMenuItem = new MenuItem2({
//   title: "Underline",
//   // label: "U",
//   icon: {
//     dom: (() => {
//       const span = document.createElement("span");
//       span.innerHTML = `
//       <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>
// `;
//       span.className = "custom-menu-icon";
//       return span;
//     })(),
//   },
//   enable: (state) => toggleMark2(state.schema.marks.underline)(state),
//   // run: toggleMark2(schema.marks.underline),
//   run: (state, dispatch) => {
//     // toggleMark2(schema.marks.underline),
//     toggleMark2(state.schema.marks.underline)(state, dispatch);
//     // updateMenuState(editor); // Call function to update menu state
//   },
// });

import { useState, useRef } from 'react';
import {MenuItem as MenuItem2} from "prosemirror-menu"
import {toggleMark as toggleMark2} from "prosemirror-commands"
import { UnderlineIcon } from '@/assets/icons/UnderlineIcon';
import { createRoot } from 'react-dom/client';

const isUnderlineMarkActive = (state: any, markType: any) => {
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

const EditorUnderlineMenu = ({ editorView }: any) => {
  // const boldIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>`;
  const boldButtonRef = useRef(null);
  const [selectedEditorUnderline, setSelectedEditorUnderline] = useState(false);

  const toggleMenu = () => {
    const { state, dispatch } = editorView;
    setSelectedEditorUnderline(!selectedEditorUnderline);
    toggleMark2(state.schema.marks.underline)(state, dispatch);
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon"
        title="Underline"
        ref={boldButtonRef}
        onClick={toggleMenu}
      >
        <div
          id="selectedEditorUnderline"
          className={`note-menuitem ${selectedEditorUnderline ? "note-active-state" : ""}`}
        >
          {/* <SvgRenderer svgContent={boldIcon} /> */}
          <UnderlineIcon/>
        </div>
      </div>
    </div>
  );
};

const renderReactUnderlineComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<EditorUnderlineMenu editorView={editorView} />);
  return container;
};

export const underlineMenuItem = new MenuItem2({
  title: `Underline`,
  run: () => {},
  select: (state: any) => {
    const editorListButton = document.querySelector("#selectedEditorUnderline");
    if (editorListButton && isUnderlineMarkActive(state, state.schema.marks.underline)) {
      editorListButton.classList.add("note-active-state");
    } 
    if (editorListButton && !isUnderlineMarkActive(state, state.schema.marks.underline)) {
      editorListButton.classList.remove("note-active-state");
    }
    return true;
  },
  render: (editorView: any) => renderReactUnderlineComponent(editorView),
});
