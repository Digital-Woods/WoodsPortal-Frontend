import React, { useState, useEffect } from 'react';
import {NodeSelection} from "prosemirror-state"
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { ProseMirrorMenuPopup, ProseMirrorMenuButton, ProseMirrorMenuOption } from './ProseMirrorMenuPopup';
import { SvgRenderer } from '@/utils/SvgRenderer';
import { createRoot } from 'react-dom/client';

const alignments = [
  {
    label: "Left",
    value: "left",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Center",
    value: "center",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`,
  },
  {
    label: "Right",
    value: "right",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`,
  },
];

let defaultEditorAlignment: any = null;

// Update image alignment based on selection
// let transactionQueued = false;
const updateImageAlignment = (node: any, view: any, getPos: any, alignment: any) => {
  // if (transactionQueued) return;

  // transactionQueued = true;
  requestAnimationFrame(() => {
    const { state, dispatch } = view;
    const pos = getPos();

    if (pos === null || pos < 0 || pos >= state.doc.content.size) {
      console.error("Invalid position for node update");
      // transactionQueued = false;
      return;
    }

    let tr = state?.tr;

    if (node.attrs.wrap) {
      // If the node is already wrapped, update the wrapping style for alignment
      const newAttrs = {
        ...node.attrs,
        wrap: true, // Maintain wrap attribute
        style: `text-align: ${alignment};`,
      };
      tr = tr?.setNodeMarkup(pos, null, newAttrs);
    } else {
      // If not wrapped, wrap with a <div> and add style: text-align attribute
      const wrapperAttrs = {
        ...node.attrs,
        wrap: true, // Add wrap attribute to indicate it's wrapped
        style: `text-align: ${alignment};`,
      };

      tr = tr?.replaceWith(
        pos,
        pos + node.nodeSize,
        state.schema.nodes.image.create(wrapperAttrs) // Replacing with wrapped image node
      );
    }

    tr = tr?.setSelection(NodeSelection.create(tr.doc, pos)); // Keep selection in sync

    if (tr.docChanged) {
      dispatch(tr);
    }
    // transactionQueued = false;
  });
};

const DropdownAlightMenu = ({ editorView }: any) => {
  const [open, setOpen] = React.useState(false);
  const [textAlign, setTextAlign] = useState(alignments[0]);

  const applyAlignment = (state: any, dispatch: any, align: any) => {
    const { schema, selection } = state;
    const nodeType = schema.nodes.paragraph;
    const { from, to } = selection;

    state.doc.nodesBetween(from, to, (node: any, pos: any) => {
      if (node.type.name === "image") {
        updateImageAlignment(node, editorView, () => pos, align);
        return true;
      }
    });

    let selectedPaddingLeft = null;

    state.doc.nodesBetween(from, to, (node: any) => {
      if (node.type === nodeType) {
        selectedPaddingLeft = node.attrs.paddingLeft;
      }
    });

    let attrs: any = {
      align: align,
    };
    if (selectedPaddingLeft) attrs.paddingLeft = selectedPaddingLeft;

    if (dispatch) {
      dispatch(state.tr.setBlockType(from, to, nodeType, attrs));
    }

    setOpen(false);
    return true;
  };

  const changeAlignment = (alignment: any) => {
    applyAlignment(editorView.state, editorView.dispatch, alignment.value);
  };

  useEffect(() => {
    if (defaultEditorAlignment) setTextAlign(defaultEditorAlignment);
  }, [defaultEditorAlignment]);

  return (
    <div className="relative inline-block">
      <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
        <ProseMirrorMenuButton
          id="defaultEditorAlignment"
          title="Text Alignment"
          isActive={defaultEditorAlignment}
        >
          <SvgRenderer svgContent={textAlign?.icon} />
        </ProseMirrorMenuButton>
        <ProseMirrorMenuOption>
          <ul className="space-y-2 note-dd-Select-menu !list-none list-inside dark:text-gray-400">
            {alignments.map((alignment) => (
              <li
                key={alignment.value}
                className={`cursor-pointer note-dd-Select-menu-options hover:bg-[#e5f5f8]  py-1 ${
                  defaultEditorAlignment?.value === alignment.value
                    ? "bg-gray-100"
                    : "bg-none"
                }`}
                onClick={() => {
                  changeAlignment(alignment);
                  defaultEditorAlignment = alignment;
                }}
              >
                <SvgRenderer svgContent={alignment.icon} />
              </li>
            ))}
          </ul>
        </ProseMirrorMenuOption>
      </ProseMirrorMenuPopup>
    </div>
  );
};


const renderReactAlignComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<DropdownAlightMenu editorView={editorView} />);
  return container;
};

function isAlignmentActive(state: any, alignValue: any) {
  const { selection } = state;
  const { $from } = selection;

  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.attrs.align === alignValue) {
      return true;
    }
  }
  return false;
}

function isImageSelected(state: any) {
  const { from } = state.selection;
  const node = state.doc.nodeAt(from);
  return node && node.type.name === "image" ? node : false;
}

export const alignmentDropdown = new MenuItem2({
  title: `Select Alignment`,
  run: () => {},
  select: (state: any) => {
    let isAlignmentLeft = isAlignmentActive(state, "left");
    let isAlignmentCenter = isAlignmentActive(state, "center");
    let isAlignmentRight = isAlignmentActive(state, "right");
    let editorListButton = document.querySelector(
      "#defaultEditorAlignment-icon"
    );

    const imageNode = isImageSelected(state);
    if (imageNode) {
      const figureStyle = imageNode?.attrs?.style || "";
      isAlignmentLeft = figureStyle.includes("text-align: left;");
      isAlignmentCenter = figureStyle.includes("text-align: center;");
      isAlignmentRight = figureStyle.includes("text-align: right;");
    }

    if (isAlignmentLeft && editorListButton) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`;
      document
        .getElementById("defaultEditorAlignment")
        ?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[0];
    }
    if (isAlignmentCenter && editorListButton) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>`;
      document
        .getElementById("defaultEditorAlignment")
        ?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[1];
    }
    if (isAlignmentRight && editorListButton) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#5f6368"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`;
      document
        .getElementById("defaultEditorAlignment")
        ?.classList.add("note-active-state");
      defaultEditorAlignment = alignments[2];
    }
    if (
      !isAlignmentLeft &&
      !isAlignmentCenter &&
      !isAlignmentRight &&
      editorListButton
    ) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#5f6368"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`;
      document
        .getElementById("defaultEditorAlignment")
        ?.classList.remove("note-active-state");
      defaultEditorAlignment = "";
    }
    return true;
  },
  render: (editorView: any) => renderReactAlignComponent(editorView),
});
