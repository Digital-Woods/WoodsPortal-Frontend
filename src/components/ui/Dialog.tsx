import React, { forwardRef } from "react";
import classNames from "classnames";

export const Dialog = forwardRef<HTMLDivElement, any>((props, ref) => {
  const classes = {
    root: "bg-cleanWhite p-4 sm:p-6 dark:bg-dark-200",
    normal: "",
  };

  const { open, onClose = null, className, ...rest } = props;

  const classesName2 = classNames(classes.root, className);

  const showOverlay = () => {
    if (!open) return null;

    return (
      <div
        className="fixed z-[101]"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-20 w-screen flex items-center justify-center overflow-y-auto">
          <div className="sm:p-0 min-h-[90vh] overflow-x-auto flex items-center popup-modal">
            <div
              className="relative transform overflow-hidden rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={classesName2} ref={ref} {...rest} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{showOverlay()}</>;
});
