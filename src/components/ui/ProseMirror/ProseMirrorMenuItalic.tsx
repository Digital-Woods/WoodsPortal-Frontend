// const { toggleMark: toggleMark2 } = window.toggleMark;
// const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

// const italicItem = new MenuItem2({
//   title: "Italic",
//   // label: "Italic",
//   icon: {
//     dom: (() => {
//       const span = document.createElement("span");
//       span.innerHTML = `
// <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>
// `;
//       span.className = "custom-menu-icon";
//       return span;
//     })(),
//   },
//   enable: (state) => toggleMark2(state.schema.marks.em)(state),
//   // run: (state, dispatch) => toggleMark2(schema.marks.em)(state, dispatch),
//   run: (state, dispatch) => {
//     toggleMark2(state.schema.marks.em)(state, dispatch);
//     // updateMenuState(editor); // Call function to update menu state
//   },
// });

import { useState, useRef } from 'react';
import {MenuItem as MenuItem2} from "prosemirror-menu"
import {toggleMark as toggleMark2} from "prosemirror-commands"
import { ItalicIcon } from '@/assets/icons/ItalicIcon';
import { createRoot } from 'react-dom/client';

const activeDynamicClassName = "note-active-state";

const isItalicMarkActive = (state: any, markType: any) => {
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

const EditorItalicMenu = ({ editorView }: any) => {
  // const boldIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>`;
  const boldButtonRef = useRef(null);
  const [selectedEditorItalic, setSelectedEditorItalic] = useState(false);

  const toggleMenu = () => {
    const { state, dispatch } = editorView;
    setSelectedEditorItalic(!selectedEditorItalic);
    toggleMark2(state.schema.marks.em)(state, dispatch);
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon"
        title="Italic"
        ref={boldButtonRef}
        onClick={toggleMenu}
      >
        <div
          id="selectedEditorItalic"
          className={`note-menuitem ${selectedEditorItalic ? activeDynamicClassName : ""}`}
        >
          {/* <SvgRenderer svgContent={boldIcon} /> */}
          <ItalicIcon/>
        </div>
      </div>
    </div>
  );
};

const renderReactItalicComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<EditorItalicMenu editorView={editorView} />);
  return container;
};

export const italicItem = new MenuItem2({
  title: `Italic`,
  run: () => {},
  select: (state: any) => {
    const editorListButton = document.querySelector("#selectedEditorItalic");
    if (editorListButton && isItalicMarkActive(state, state.schema.marks.em)) {
      editorListButton.classList.add(activeDynamicClassName);
    } 
    if (editorListButton && !isItalicMarkActive(state, state.schema.marks.em)) {
      editorListButton.classList.remove(activeDynamicClassName);
    }
    return true;
  },
  render: (editorView: any) => renderReactItalicComponent(editorView),
});
