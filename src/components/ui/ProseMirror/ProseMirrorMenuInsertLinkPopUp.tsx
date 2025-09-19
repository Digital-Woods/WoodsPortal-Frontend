import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button';
import { Input } from '@/components/ui/Form';
import { Checkbox } from '../Checkbox';

const findTextRange = (editor: any, searchText: any) => {
  const { doc } = editor.state;
  let startPos = -1;
  let endPos = -1;

  doc.descendants((node: any, pos: any) => {
    if (node.isText) {
      const text = node.text;
      const index = text.indexOf(searchText);

      if (index !== -1) {
        startPos = pos + index;
        endPos = startPos + searchText.length;
        return false; // Stop searching after finding the first match
      }
    }
  });

  return { from: startPos, to: endPos };
};

const normalizeUrl = (text: any) => {
  if (!/^https?:\/\//i.test(text)) {
    return `http://${text}`;
  }
  return text;
}

const insertEditLink = (
  editorView: any,
  state: any,
  dispatch: any,
  title: any,
  linkText: any,
  url: any,
  blank: any
) => {
  const { schema, selection, tr }: any = state;
  const linkType: any = schema.marks.link;

  const { from, to }: any = findTextRange(editorView, title);

  let href = normalizeUrl(url);
  let attrs = {
    href,
    title: linkText,
    ...{ target: blank ? "_blank" : "_self" },
  };

  if (dispatch) {
    tr.delete(from, to);
    tr.insertText(linkText, from);
    tr.addMark(from, from + linkText.length, linkType.create(attrs));
    dispatch(tr);
  }

  return true;
};

export const ProseMirrorMenuInsertLinkPopUp = ({
  randomId,
  editorView,
  href,
  title,
  target,
  closeLinkPopup,
}: any) => {
  const [isSetLinkText, setIsSetLinkText] = useState<any>( title ? true : false);
  const [linkText, setLinkText] = useState<any>(title);
  const [url, setUrl] = useState<any>(href);
  const [blank, setBlank] = useState<any>(target === "_self" ? false : true);

  const dropdownButtonRef = useRef<any>(null);
  const dropdownMenuRef = useRef<any>(null);

  const inputRef = useRef<any>(null);
  const inputRef2 = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const resetMenu = () => {
    setLinkText("");
    setIsSetLinkText(false);
    setUrl("");
    setBlank(true);
  };

  const onChangeCheckbox = () => {
    setBlank((prev: any) => !prev);
  };

  const onSubmit = () => {
    insertEditLink(
      editorView,
      editorView.state,
      editorView.dispatch,
      title,
      linkText,
      url,
      blank
    );
    resetMenu();
    closeLinkPopup();
  };

  const removeEditLink = () => {
    const { state, dispatch } = editorView;
    const { schema, tr } = state;
    const linkType = schema.marks.link;

    const { from, to } = findTextRange(editorView, title);

    if (dispatch) {
      tr.removeMark(from, to, linkType); // Remove the link mark
      dispatch(tr);
    }
    resetMenu();
    closeLinkPopup();
    return true;
  };

  // Set Dynamic Position & Scroll
  const [popupPosition, setPopupPosition] = React.useState({ top: 0, left: 0 });

  const updatePopupPosition = () => {
    const mainButton = document.getElementById(`main-${randomId}`);
    if (mainButton) {
      const rect = mainButton.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    updatePopupPosition();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updatePopupPosition();
    };

    const scrollableDiv = document.getElementById(
      "details-scrollable-container"
    );
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [popupPosition]);

  return (
    <div
      id={`child-${randomId}`}
      ref={dropdownMenuRef}
      className={`absolute bg-white shadow-lg rounded-sm border z-[103]
      `}
      style={popupPosition}
    >
      <div className="space-y-2 px-2 CUSTOM-note-dd-Select-menu !list-none list-inside dark:text-gray-400">
        <div className="text-sm">Edit Link</div>
        <div>
          <label className="text-sm">Link text</label>
          <Input
            ref={inputRef}
            onClick={() => inputRef.current.focus()}
            height="medium"
            placeholder=""
            defaultValue={linkText}
            onChange={(e) => {
              setLinkText(e.target.value);
              if (e.target.value) {
                setIsSetLinkText(true);
              } else {
                setIsSetLinkText(false);
              }
            }}
            className="!bg-white !text-black !border-gray-200"
          />
        </div>

        <div>
          <label className="text-sm">Url</label>
          <Input
            ref={inputRef2}
            onClick={() => inputRef2.current.focus()}
            height="medium"
            placeholder=""
            defaultValue={url}
            onChange={(e: any) => {
              setUrl(e.target.value);
              if (!isSetLinkText) setLinkText(e.target.value);
            }}
            className="!bg-white !text-black !border-gray-200"
          />
        </div>

        <Checkbox
          label="Open in new tab"
          checked={blank}
          onChange={onChangeCheckbox}
        />

        <div className="flex gap-1">
          <Button
            size="sm"
            className="w-full"
            onClick={onSubmit}
            disabled={!linkText || !url}
          >
            Apply
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => closeLinkPopup()}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="link"
            className="w-full !text-secondary"
            onClick={() => removeEditLink()}
          >
            Remove link
          </Button>
        </div>
      </div>
    </div>
  );
};
