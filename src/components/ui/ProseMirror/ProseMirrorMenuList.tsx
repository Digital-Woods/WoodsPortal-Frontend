import React, { useState, useEffect } from 'react';
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { wrapInList, liftListItem} from "prosemirror-schema-list"
import { SvgRenderer } from '@/utils/SvgRenderer';
import { createRoot } from 'react-dom/client';
import { ProseMirrorMenuPopup, ProseMirrorMenuButton, ProseMirrorMenuOption } from './ProseMirrorMenuPopup';

const activeDynamicClassName = "CUSTOM-note-active-state";

const listTypes = [
  {
    label: "Bullet",
    key: "bullet",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="14px" fill="#5f6368"><path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"/></svg>`,
  },
  {
    label: "Ordered",
    key: "ordered",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="14px" fill="#5f6368"><path d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z"/></svg>`,
  },
];

const isListActive = (state: any, nodeType: any) => {
  let { $from } = state.selection;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type === nodeType) return true;
  }
  return false;
};

let defaultEditorList: any = null;

const DropdownListMenu = ({ editorView }: any) => {
  const [open, setOpen] = React.useState(false);
  const [textList, setTextList] = useState(listTypes[0]);
  const [selectedEditorList, setSelectedEditorList] = useState("");

  const toggleListMenu = (listType: any) => {
    const { state, dispatch } = editorView;
    const { schema } = state;

    const isBulletList = isListActive(state, schema.nodes.bullet_list);
    const isOrderedList = isListActive(state, schema.nodes.ordered_list);
    const isAnyList = isBulletList || isOrderedList;

    // If already in a list, remove it first
    if (isAnyList) {
      liftListItem(schema.nodes.list_item)(state, dispatch);
    }

    // If not in the target list, wrap in the new list
    if (!isListActive(state, schema.nodes[listType.key + "_list"])) {
      wrapInList(schema.nodes[listType.key + "_list"])(
        editorView.state,
        editorView.dispatch
      );
    }

    setOpen(false);
  };

  useEffect(() => {
    if (defaultEditorList) setTextList(defaultEditorList);
  }, [defaultEditorList]);

  return (
    <div className="relative inline-block">
      <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
        <ProseMirrorMenuButton
          id="selectedEditorList"
          title="List styles"
          isActive={selectedEditorList}
        >
          <SvgRenderer svgContent={textList?.icon} />
        </ProseMirrorMenuButton>
        <ProseMirrorMenuOption>
          <ul className="space-y-2 CUSTOM-note-dd-Select-menu !list-none list-inside dark:text-gray-400">
            {listTypes.map((listType) => (
              <li
                key={listType.key}
                className={`cursor-pointer CUSTOM-note-dd-Select-menu-options hover:bg-[#e5f5f8] py-1 ${
                  defaultEditorList?.key === listType.key
                    ? "bg-gray-100"
                    : "bg-none"
                }`}
                onClick={() => {
                  // setTextList(listType);
                  toggleListMenu(listType);
                  setSelectedEditorList(listType.icon);
                  defaultEditorList = listType;
                }}
              >
                <SvgRenderer svgContent={listType.icon} />
              </li>
            ))}
          </ul>
        </ProseMirrorMenuOption>
      </ProseMirrorMenuPopup>
    </div>
  );
};

const renderReactListComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<DropdownListMenu editorView={editorView} />);
  return container;
};

export const listMenuItem = new MenuItem2({
  title: `List styles`,
  run: () => {},
  select: (state: any) => {
    const { schema, selection } = state;
    const isBulletList = isListActive(state, schema.nodes.bullet_list);
    const isOrderedList = isListActive(state, schema.nodes.ordered_list);
    const editorListButton: any = document.querySelector("#selectedEditorList-icon");

    if (editorListButton && isBulletList) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="14px" fill="#e8eaed"><path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"/></svg>`;
      document
        .getElementById("selectedEditorList")
        ?.classList.add(activeDynamicClassName);
      defaultEditorList = listTypes[0];
    }
    if (editorListButton && isOrderedList) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="14px" fill="#e8eaed"><path d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z"/></svg>`;
      document
        .getElementById("selectedEditorList")
        ?.classList.add(activeDynamicClassName);
      defaultEditorList = listTypes[1];
    }

    if (editorListButton && !isBulletList && !isOrderedList && editorListButton) {
      editorListButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="14px" fill="#e8eaed"><path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"/></svg>`;
      document
        .getElementById("selectedEditorList")
        ?.classList.remove(activeDynamicClassName);
      defaultEditorList = "";
    }

    return true;
  },
  render: (editorView: any) => renderReactListComponent(editorView),
});
