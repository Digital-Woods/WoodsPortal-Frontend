import React, { useState, useEffect } from 'react';
import {Plugin as ProseMirrorPlugin2, PluginKey as ProseMirrorPluginKey2} from "prosemirror-state"
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { createRoot } from 'react-dom/client';
import { ProseMirrorMenuPopup, ProseMirrorMenuButton, ProseMirrorMenuOption } from './ProseMirrorMenuPopup';

const activeDynamicClassName = "CUSTOM-note-active-state";

const textFonts: any = [
  {
    label: "Sans Serif",
    key: "sans-serif",
  },
  {
    label: "Serif",
    key: "serif",
  },
  {
    label: "Monospace",
    key: "monospace",
  },
  {
    label: "Georgia",
    key: "Georgia",
  },
  {
    label: "Tahoma",
    key: "Tahoma",
  },
  {
    label: "Trebuchet MS",
    key: "Trebuchet MS",
  },
  {
    label: "Verdana",
    key: "Verdana",
  },
];

// Helper: Traverses the selection to find the first fontFamily mark.
// const getFontFamilyFromSelection = (state) => {
//   const { from, to } = state.selection;
//   const markType = state.schema.marks.fontFamily;
//   let fontFamily = null;

//   state.doc.nodesBetween(from, to, (node) => {
//     if (node.marks && node.marks.length) {
//       const mark = node.marks.find((m) => m.type === markType);
//       if (mark) {
//         fontFamily = mark.attrs.font;
//         // Stop traversing early if a font is found.
//         return false;
//       }
//     }
//   });
//   return fontFamily;
// };

const getFontFamilyFromSelection = (state: any) => {
  const { from, to, empty } = state.selection;
  const markType = state.schema.marks.fontFamily;
  let fontFamily = null;

  if (!markType) return null; // Ensure the mark exists

  // If selection is empty (cursor position), check previous character
  // if (empty && from > 0) {
  //   const prevNode = state.doc.nodeAt(from - 1);
  //   if (prevNode && prevNode.marks) {
  //     const mark = prevNode.marks.find((m) => m.type === markType);
  //     if (mark) {
  //       return mark.attrs.font;
  //     }
  //   }
  // }

  if (empty) {
    const storedMark = state.storedMarks?.find((m: any) => m.type === markType);

    if (storedMark) {
      return storedMark.attrs.font;
    }

    // Fallback: Check marks at cursor position
    const marksAtCursor = state.selection.$from.marks();
    const mark = marksAtCursor.find((m: any) => m.type === markType);
    if (mark) {
      return mark.attrs.font;
    }
  }

  // Normal selection case
  state.doc.nodesBetween(from, to, (node: any) => {
    if (node.marks && node.marks.length) {
      const mark = node.marks.find((m: any) => m.type === markType);
      if (mark) {
        fontFamily = mark.attrs.font;
        return false; // Stop early when we find a font
      }
    }
  });

  return fontFamily;
};

// Create a plugin key for later access.
const fontSelectionPluginKey = new ProseMirrorPluginKey2("fontSelection");

// Create the plugin.
export const fontSelectionPlugin = new ProseMirrorPlugin2({
  key: fontSelectionPluginKey,
  state: {
    init(_config: any, state: any) {
      // Calculate the initial font value from the selection (if any).
      return getFontFamilyFromSelection(state) || null;
    },
    apply(tr: any, value: any, oldState: any, newState: any) {
      // When the document changes or selection is updated, recalc the font.
      if (tr.docChanged || tr.selectionSet) {
        return getFontFamilyFromSelection(newState) || null;
      }
      return value;
    },
  },
});

let defaultEditorFont: any = null;

const DropdownFontMenu = ({ editorView, activeFont2 }: any) => {
  const [open, setOpen] = React.useState(false);
  const [font, setFont] = useState<any>(textFonts[0]);

  const applyFontFamily = (font: any) => {
    return (state: any, dispatch: any) => {
      const { schema, selection } = state;
      const { from, to } = selection;
      const markType = schema.marks.fontFamily;

      if (!markType) return false;

      const attrs = { font };
      const tr = state.tr;

      if (selection.empty) {
        // Apply as stored mark if no selection
        tr.addStoredMark(markType.create(attrs));
      } else {
        // Apply to the selected range
        tr.addMark(from, to, markType.create(attrs));
      }

      if (dispatch) dispatch(tr);
      setOpen(false);
      return true;
    };
  };

  useEffect(() => {
    if (defaultEditorFont) setFont(defaultEditorFont);
  }, [defaultEditorFont]);

  return (
    <div className="relative inline-block">
      <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
        <ProseMirrorMenuButton
          id="defaultEditorFont"
          title="Font Family"
          isActive={defaultEditorFont}
          variant="outline"
        >
          <span className={`block !text-[12px]  min-w-[85px] font-[${defaultEditorFont ? defaultEditorFont?.key : font.key}]`}>
           {defaultEditorFont ? defaultEditorFont?.label : font.label}
          </span>
        </ProseMirrorMenuButton>
        <ProseMirrorMenuOption>
          <ul className="space-y-2 CUSTOM-note-dd-Select-menu !list-none min-w-[105px] list-inside dark:text-gray-400">
            {textFonts.map((textFont: any) => (
              <li
                key={textFont.key}
                className={`cursor-pointer min-w-[100px] !text-[12px] font-[${textFont.key}] CUSTOM-note-dd-Select-menu-options hover:bg-[#e5f5f8] dark:text-[#666666] py-1 ${
                  defaultEditorFont?.key === textFont.key
                    ? "bg-gray-100"
                    : "bg-none"
                }`}
                onClick={() => {
                  setFont(textFont);
                  defaultEditorFont = textFont;
                  applyFontFamily(textFont.key)(
                    editorView.state,
                    editorView.dispatch
                  );
                }}
              >
                {textFont.label}
              </li>
            ))}
          </ul>
        </ProseMirrorMenuOption>
      </ProseMirrorMenuPopup>
    </div>
  );
};

const renderReactFontComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<DropdownFontMenu editorView={editorView} />);
  return container;
};

export const fontMenuItem = new MenuItem2({
  title: `Fonts`,
  // run: (state, dispatch, editorView) => {
  //   const newFont = fontSelectionPluginKey.getState(state); // Example selected font
  //   const tr = state.tr;
  //   console.log("newFont", newFont);
  //   // Set the font selection in the plugin state
  //   tr.setMeta(fontSelectionPluginKey, newFont);
  //   // Dispatch the transaction to update the plugin state
  //   dispatch(tr);
  //   // Update the editor state so the plugin state is re-read and the component can re-render
  //   editorView.updateState(state); // This will trigger a re-render in ProseMirror and React
  // },
  run: () => {},
  select: (state: any) => {
    // Use plugin state for enabling/disabling this item
    const activeFont = fontSelectionPluginKey.getState(state) || true;
    // const selectedEditorFont = fontSelectionPluginKey.getState(state);
    const selectedEditorFont = getFontFamilyFromSelection(state);
    const font = textFonts.find((font: any) => font.key === selectedEditorFont?.replace(/^"(.*)"$/, "$1"));

    defaultEditorFont = font

    const div = document.getElementById("defaultEditorFont-icon");
    document.getElementById("defaultEditorFont-icon")?.classList.add(...`!text-[12px] min-w-[85px] font-[${defaultEditorFont ? defaultEditorFont?.key : ''}]`.split(" "));
    if (div && selectedEditorFont && font) {
      div.textContent = font.label; // Change text content
      document
        .getElementById("defaultEditorFont")
        ?.classList.add(activeDynamicClassName);
    }
    if (div && !selectedEditorFont) {
      div.textContent = "Sans Serif"; // Change text content
      document
        .getElementById("defaultEditorFont")
        ?.classList.remove(activeDynamicClassName);
    }
    return activeFont !== null;
  },
  render: (editorView: any) => renderReactFontComponent(editorView),
  // active: (state) => {
  //   const selectedFont = fontSelectionPluginKey.getState(state);
  //   return selectedFont ? true : false;
  // },
});
