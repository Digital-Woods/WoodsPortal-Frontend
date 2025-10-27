import { useState, useEffect } from 'react';
import {Plugin as ProseMirrorPlugin2, PluginKey as ProseMirrorPluginKey2} from "prosemirror-state"
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { AlfabateIcon } from '@/assets/icons/AlfabateIcon';
import { createRoot } from 'react-dom/client';
import { ProseMirrorMenuPopup, ProseMirrorMenuButton, ProseMirrorMenuOption } from './ProseMirrorMenuPopup';
import { ColorPicker } from '../ColorPicker';

const getTextColorFromSelection = (state: any) => {
  const { from, to, empty } = state.selection;
  const markType = state.schema.marks.textColor;
  let textColor = null;

  if (!markType) return null; // Ensure the mark exists

  if (empty) {
    const storedMark = state.storedMarks?.find((m: any) => m.type === markType);

    if (storedMark) {
      return storedMark.attrs.color;
    }

    // Fallback: Check marks at cursor position
    const marksAtCursor = state.selection.$from.marks();
    const mark = marksAtCursor.find((m: any) => m.type === markType);
    if (mark) {
      return mark.attrs.color;
    }
  }

  // Normal selection case
  state.doc.nodesBetween(from, to, (node: any) => {
    if (node.marks && node.marks.length) {
      const mark = node.marks.find((m: any) => m.type === markType);
      if (mark) {
        textColor = mark.attrs.color;
        return false; // Stop early when we find the color
      }
    }
  });

  return textColor;
};


// Create a plugin key for later access.
const textColorPluginKey = new ProseMirrorPluginKey2("textColor");

// Create the plugin.
export const textColorPlugin = new ProseMirrorPlugin2({
  key: textColorPluginKey,
  state: {
    init(_config: any, state: any) {
      // Calculate the initial font value from the selection (if any).
      return getTextColorFromSelection(state) || null;
    },
    apply(tr: any, value: any, oldState: any, newState: any) {
      // When the document changes or selection is updated, recalc the font.
      if (tr.docChanged || tr.selectionSet) {
        return getTextColorFromSelection(newState) || null;
      }
      return value;
    },
  },
});

let defaultTextColor = "#000";
let selectedTextColor = "";

const DropdownColorMenu = ({ editorView, icon }: any) => {
  const [open, setOpen] = useState<any>(false);
  const [color, setSelectedColor] = useState<any>("");

  const applyTextColor = (color: any, reset: boolean = false) => {
    return (state: any, dispatch: any) => {
      const { schema, selection } = state;
      const { from, to, empty } = selection;
      const markType = schema.marks.textColor;
      if (!markType) return false;

      const tr = state.tr;

      // RESET LOGIC — when reset=true
      if (reset && empty) {
        const $pos = selection.$from;
        const { parent, parentOffset } = $pos;

        // 1️⃣ Check if caret is inside a colored text node
        let insideColor = false;
        let nodeStart = 0;
        let nodeEnd = 0;

        parent.forEach((node: any, offset: number) => {
          if (
            offset <= parentOffset &&
            parentOffset <= offset + node.nodeSize &&
            node.marks?.some((m: any) => m.type === markType)
          ) {
            insideColor = true;
            nodeStart = from - parentOffset + offset;
            nodeEnd = nodeStart + node.nodeSize;
          }
        });

        if (insideColor) {
          tr.removeMark(nodeStart, nodeEnd, markType);
          tr.addMark(nodeStart, nodeEnd, markType.create({ color: "#000000" }));

          tr.removeStoredMark(markType);
          tr.addStoredMark(markType.create({ color: "#000000" }));

          if (dispatch) dispatch(tr);
          return true;
        }

        // 2️⃣ Fallback: caret after a colored node
        const nodeBefore = $pos.nodeBefore;
        if (nodeBefore) {
          const colorMark = (nodeBefore.marks || []).find(
            (m: any) => m.type === markType || m.type.name === markType.name
          );

          if (colorMark) {
            const start = from - nodeBefore.nodeSize;
            const end = from;

            tr.removeMark(start, end, markType);
            tr.addMark(start, end, markType.create({ color: "#000000" }));

            tr.removeStoredMark(markType);
            tr.addStoredMark(markType.create({ color: "#000000" }));

            if (dispatch) dispatch(tr);
            return true;
          }
        }

        // 3️⃣ Optional: caret before a colored node
        const nodeAfter = $pos.nodeAfter;
        if (nodeAfter) {
          const colorMark = (nodeAfter.marks || []).find(
            (m: any) => m.type === markType || m.type.name === markType.name
          );

          if (colorMark) {
            const start = from;
            const end = from + nodeAfter.nodeSize;

            tr.removeMark(start, end, markType);
            tr.addMark(start, end, markType.create({ color: "#000000" }));

            tr.removeStoredMark(markType);
            tr.addStoredMark(markType.create({ color: "#000000" }));

            if (dispatch) dispatch(tr);
            return true;
          }
        }
      }

      // NORMAL COLOR APPLY LOGIC
      const attrs = { color };
      if (empty) {
        tr.addStoredMark(markType.create(attrs));
      } else {
        tr.addMark(from, to, markType.create(attrs));
      }

      if (dispatch) dispatch(tr);
      return true;
    };
  };

  const setColor = (color: any, reset: boolean = false) => {
    if (color) {
      setSelectedColor(color)
      applyTextColor(color, reset)(editorView.state, editorView.dispatch);
      const div = document.getElementById("text-color-svg");
      if (div) {
        div.setAttribute("fill", color);
      }
    }
  }

  return (
    <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
      <ProseMirrorMenuButton
        id="defaultEditorColor"
        title="Text Color"
        isActive={defaultTextColor}
      >
        <AlfabateIcon color={defaultTextColor}/>
      </ProseMirrorMenuButton>
      <ProseMirrorMenuOption>
        <ColorPicker
          color={color}
          setColor={setColor}
          setIsOpen={setOpen}
          defaultTextColor={defaultTextColor}
        />
      </ProseMirrorMenuOption>
    </ProseMirrorMenuPopup>
  );
};

const renderReactComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<DropdownColorMenu editorView={editorView} />);
  return container;
};
export const textColor = new MenuItem2({
  title: `Text color`,
  run: () => {},
  select: (state: any) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = textColorPluginKey.getState(state) || true;
    selectedTextColor = getTextColorFromSelection(state);
    const div = document.getElementById("text-color-svg");
    if (div && selectedTextColor) {
      div.setAttribute("fill", selectedTextColor);
    }
    if (div && !selectedTextColor) {
      div.setAttribute("fill", defaultTextColor);
    }
    return activeFont !== null;
  },
  render: (editorView: any) => renderReactComponent(editorView),
});
