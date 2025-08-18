import { useState, useEffect } from 'react';
import {Plugin as ProseMirrorPlugin2, PluginKey as ProseMirrorPluginKey2} from "prosemirror-state"
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { HighlightIcon } from '@/assets/icons/HighlightIcon';
import { createRoot } from 'react-dom/client';
import { ColorPicker } from '../ColorPicker';
import { ProseMirrorMenuPopup, ProseMirrorMenuButton, ProseMirrorMenuOption } from './ProseMirrorMenuPopup';

const getTextBGColorFromSelection = (state: any) => {
  const { from, to, empty } = state.selection;
  const markType = state.schema.marks.textBackgroundColor;
  let textBackgroundColor = null;

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
        textBackgroundColor = mark.attrs.color;
        return false; // Stop early when we find the color
      }
    }
  });

  return textBackgroundColor;
};

// Create a plugin key for later access.
const textBGColorPluginKey: any = new ProseMirrorPluginKey2("textColor");

// Create the plugin.
export const textBGColorPlugin = new ProseMirrorPlugin2({
  key: textBGColorPluginKey,
  state: {
    init(_config: any, state: any) {
      // Calculate the initial font value from the selection (if any).
      return getTextBGColorFromSelection(state) || null;
    },
    apply(tr: any, value: any, oldState: any, newState: any) {
      // When the document changes or selection is updated, recalc the font.
      if (tr.docChanged || tr.selectionSet) {
        return getTextBGColorFromSelection(newState) || null;
      }
      return value;
    },
  },
});

let defaultTextBGColor = " ";
let selectedTextBGColor = "";

const DropdownColorMenu2 = ({ editorView, icon }: any) => {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("");

  const applyTextBackgroundColor = (color: any) => {
    return (state: any, dispatch: any) => {
      const { schema, selection } = state;
      const { from, to } = selection;
      const markType = schema.marks.textBackgroundColor;

      if (!markType) return false;

      const attrs = { color };
      const tr = state.tr;

      if (selection.empty) {
        // Apply as stored mark if no selection
        tr.addStoredMark(markType.create(attrs));
      } else {
        // Apply to the selected range
        tr.addMark(from, to, markType.create(attrs));
      }

      if (dispatch) dispatch(tr);
      return true;
    };
  };

  useEffect(() => {
    if (color) {
      applyTextBackgroundColor(color)(editorView.state, editorView.dispatch);
      const div = document.getElementById("text-bg-color-svg");
      if (div) {
        div.setAttribute("fill", color);
      }
    }
  }, [color]);

  return (
    <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
      <ProseMirrorMenuButton
        id="defaultEditorBGColor"
        title="Text Highlight"
        isActive={defaultTextBGColor}
      >
        <HighlightIcon color={defaultTextBGColor}/>
      </ProseMirrorMenuButton>
      <ProseMirrorMenuOption>
        <ColorPicker
          color={color}
          setColor={setColor}
          setIsOpen={setOpen}
          defaultTextColor={defaultTextBGColor}
        />
      </ProseMirrorMenuOption>
    </ProseMirrorMenuPopup>
  );
};

const renderReactComponent2 = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(
    <DropdownColorMenu2
      editorView={editorView}
      icon={`<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#666666"><path d="M80 0v-160h800V0H80Zm140-280 210-560h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"/></svg>`}
    />
  );
  return container;
};
export const textBGColor = new MenuItem2({
  title: `Text highlight`,
  run: () => {},
  select: (state: any) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = textBGColorPluginKey.getState(state) || true;
    selectedTextBGColor = getTextBGColorFromSelection(state);
    const div = document.getElementById("text-bg-color-svg");
    if (div && selectedTextBGColor) {
      div.setAttribute("fill", selectedTextBGColor);
    }
    if (div && !selectedTextBGColor) {
      div.setAttribute("fill", "#fff");
    }
    return activeFont !== null;
  },
  render: (editorView: any) => renderReactComponent2(editorView),
});
