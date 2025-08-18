import { useState, useEffect, useRef } from 'react';
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { LinkIcon } from '@/assets/icons/LinkIcon';
import { Input } from '@/components/ui/Form';
import { createRoot } from 'react-dom/client';
import { Button } from '../Button';
import { ProseMirrorMenuPopup, ProseMirrorMenuButton, ProseMirrorMenuOption } from './ProseMirrorMenuPopup';
import { Checkbox } from '../Checkbox';

const normalizeUrl = (text: any) => {
  if (!/^https?:\/\//i.test(text)) {
    return `http://${text}`;
  }
  return text;
}

const insertLink = (state: any, dispatch: any, linkText: any, url: any, blank: any) => {
  const { schema, selection, tr } = state;
  const { from, to, empty } = selection;
  const linkType = schema.marks.link;

  const href = normalizeUrl(url);

  let text = linkText; // Default text if no selection
  if (!empty) {
    text = state.doc.textBetween(from, to, " ");
  }

  let title = text; // Use the text as the title

  let attrs = { href, title: title, ...{ target: blank ? "_blank" : "_self" } };

  if (dispatch) {
    if (empty) {
      // Insert new text with link
      tr.insertText(text, from);
      tr.addMark(from, from + text.length, linkType.create(attrs));
    } else {
      // Wrap existing selection with link
      tr.addMark(from, to, linkType.create(attrs));
    }
    dispatch(tr);
  }
  return true;
};

let testChange: any = "";

const PopupInsertLinkMenu = ({ editorView, href, title }: any) => {
  const [open, setOpen] = useState<any>(false);
  const [isSetLinkText, setIsSetLinkText] = useState<any>(false);
  const [linkText, setLinkText] = useState<any>("");
  const [url, setUrl] = useState<any>("");
  const [blank, setBlank] = useState<any>(true);

  const inputRef = useRef<any>(null);
  const inputRef2 = useRef<any>(null);

  const { selection } = editorView.state;
  const { from, to } = selection;
  const selectedText = editorView.state.doc.textBetween(from, to, " ");

  const resetMenu = () => {
    setLinkText("");
    setIsSetLinkText(false);
    setUrl("");
    setBlank(true);
  };

  useEffect(() => {
    if (selectedText) {
      setLinkText(selectedText);
      setIsSetLinkText(true);
      setUrl("");
    } else {
      resetMenu();
    }
  }, [selectedText]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onChangeCheckbox = () => {
    setBlank((prev: any) => !prev);
  };

  const onSubmit = () => {
    insertLink(editorView.state, editorView.dispatch, linkText, url, blank);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <ProseMirrorMenuPopup open={open} setOpen={setOpen}>
        <ProseMirrorMenuButton
          id="linkText"
          title="Insert Link"
          isActive={linkText}
        >
        <LinkIcon/>
        </ProseMirrorMenuButton>
        <ProseMirrorMenuOption>
          <div className="space-y-2 px-2 note-dd-Select-menu list-none list-inside dark:text-gray-400">
            <h2 className="text-sm mb-0">Create Link</h2>
            <div>
              <label className="!text-xs">Link text</label>
              <Input
                ref={inputRef}
                onClick={() => inputRef.current.focus()}
                height="medium"
                placeholder=""
                defaultValue={linkText}
                onChange={(e: any) => {
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
              <label className="!text-xs">Url</label>
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
              labelClassName={`!text-xs`}
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
                onClick={() => {
                  resetMenu();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ProseMirrorMenuOption>
      </ProseMirrorMenuPopup>
    </div>
  );
};

const renderReactInsertLinkComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<PopupInsertLinkMenu editorView={editorView} />);
  return container;
};

export function isAlignmentActive(state: any, alignValue: any) {
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

export const insertLinkMenuItem = new MenuItem2({
  title: `Select Alignment`,
  run: (state: any, dispatch: any, view: any) => {},
  select: (state: any) => {
    return true;
  },
  render: (editorView: any) => renderReactInsertLinkComponent(editorView),
});
