import { HtmlParser } from '@/components/HtmlParser';
import DOMPurify from 'dompurify';
import { Dialog } from './Dialog';
import { useState } from 'react';
import { ShrinkIcon } from '@/assets/icons/ShrinkIcon';
import { ExpandIcon } from '@/assets/icons/ExpandIcon';
import { CloseIcon } from '@/assets/icons/closeIcon';
import { Button } from './Button';

export const ViewNote = ({
  note,
  dialogView = false
}: any) => {
  const [showDialog, setShowDialog] = useState(false);
  const [expandDialog, setExpandDialog] = useState(false);

  const noteViewConfig = {
    ADD_ATTR: ['target'],
    // ALLOWED_ATTR: ["style", "src", "width", "height", "alt"],
    // ALLOWED_TAGS: ["p", "a", "figure", "img", "br"],
    // ALLOW_DATA_ATTR: true, // If data attributes are required
    // KEEP_CONTENT: true // Keep empty tags
  };

  const expandToggleButton = () => {
    setExpandDialog(!expandDialog);
  };

  return (
    <>
      {dialogView ? (
        <Button size="xsm" onClick={() => setShowDialog(true)}>
          View Note
        </Button>
      ) : (
        <HtmlParser html={DOMPurify.sanitize(note, noteViewConfig)} className="ProseMirror" />
      )}

      <Dialog
        open={showDialog}
        onClose={setShowDialog}
        className={`p-0 relative mx-auto bg-white dark:bg-white overflow-y-auto max-h-[95vh] ${expandDialog
          ? "lg:w-[calc(100vw-25vw)] md:w-[calc(100vw-5vw)] w-[calc(100vw-20px)]"
          : "lg:w-[830px] md:w-[720px] w-[calc(100vw-28px)] "
          } `}
      >
        <div className="sticky top-0 z-50">
          <div className="flex justify-between items-center bg-[#516f90] p-4 sticky top-0 z-50">
            <div className="text-lg font-semibold text-white dark:text-white mb-0">
              Note
            </div>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                variant="outline"
                onClick={expandToggleButton}
                className="text-white dark:text-white cursor-pointer"
              >
                {expandDialog ? (
                  <div title="Shrink window">
                    <ShrinkIcon width="22px" height="22px" />
                  </div>
                ) : (
                  <div title="Make window expand">
                    <ExpandIcon width="22px" height="22px" />
                  </div>
                )}
              </button>
              <button
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="text-white dark:text-white"
              >
                <CloseIcon width="24px" height="24px" />
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 CUSTOM-modal-editor">
          <HtmlParser html={DOMPurify.sanitize(note, noteViewConfig)} className="ProseMirror" />
        </div>
      </Dialog>
    </>
  );
};
