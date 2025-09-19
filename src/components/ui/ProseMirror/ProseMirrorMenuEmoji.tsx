import { useState, useEffect, useRef } from 'react';
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { Picker } from 'emoji-mart'
import { EmojiIcon } from '@/assets/icons/EmojiIcon';
import { createRoot } from 'react-dom/client';

const Emoji = ({applyEmoji}: any) => {
  const pickerContainerRef = useRef<any>(null);

  useEffect(() => {
    const pickerOptions = {
      onEmojiSelect: (emoji: any) => {
        applyEmoji(emoji.native)
      },
      theme: "light",
      previewPosition: "none",
      perLine:7,
      emojiSize: 18,
    };
    const picker: any = new Picker(pickerOptions);
    pickerContainerRef.current.appendChild(picker);

    // Cleanup to remove the picker if the component unmounts
    return () => {
      if (pickerContainerRef.current) {
        pickerContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={pickerContainerRef} />;
};

const insertEmoji = (emoji: any) => (state: any, dispatch: any) => {
  const { from, to } = state.selection; // Get the current selection
  const tr = state?.tr?.replaceWith(
    from,
    to,
    state.schema.text(emoji) // Replace with emoji
  );

  if (dispatch) dispatch(tr); // Dispatch the transaction to update the document
  return true; // Indicate the command was executed
};


const PopupInsertEmojiMenu = ({ editorView, href, title }: any) => {
  const [isOpen, setIsOpen] = useState<any>(false);

  const dropdownButtonRef = useRef<any>(null);
  const dropdownMenuRef = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(event.target) &&
      dropdownButtonRef.current &&
      !dropdownButtonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prevState: any) => !prevState);
  };

  const applyEmoji = (emoji: any) => {
    insertEmoji(emoji)(editorView.state, editorView.dispatch); // Call insert function
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div
        className="CUSTOM-ProseMirror-icon CUSTOM-note-menuitem"
        title="Insert Link"
        ref={dropdownButtonRef}
        onClick={toggleMenu}
      >
        <EmojiIcon/>
      </div>
      {isOpen && (
        <div
          ref={dropdownMenuRef}
          // className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white shadow-lg rounded w-48 z-10"
          className="emoji-picker-wrapper absolute lg:left-0 max-md:left-[180px] max-sm:-right-[190px] transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded-sm z-10"
        >
            <Emoji applyEmoji={applyEmoji} />
        </div>
      )}
    </div>
  );
};

const renderReactEmojiComponent = (editorView: any) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<PopupInsertEmojiMenu editorView={editorView} />);
  return container;
};

export const proseMirrorMenuEmoji = new MenuItem2({
  title: `Insert emoji`,
  run: (state: any, dispatch: any, view: any) => {
  },
  select: (state: any) => {
    return true;
  },
  render: (editorView: any) => renderReactEmojiComponent(editorView),
});
