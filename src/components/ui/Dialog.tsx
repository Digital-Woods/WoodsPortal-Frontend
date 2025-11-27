import React, { forwardRef } from "react";
import classNames from "classnames";

export const Dialog = forwardRef<HTMLDivElement, any>((props, ref) => {
  const classesDynamicClassName = {
    root: "bg-cleanWhite dark:bg-dark-200",
    normal: "",
  };

  const { open, onClose = null, className, ...rest } = props;

  const classesName2 = classNames(classesDynamicClassName.root, className);

  const showOverlay = () => {
    if (!open) return null;

    return (
      <div
        className="fixed z-[101] overflow-hidden"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500/35 backdrop-blur-2xl border border-gray-400/40 shadow-lg overflow-hidden"
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-20 w-screen flex items-center justify-center overflow-hidden">
          <div className="sm:p-0 min-h-[90vh] flex items-center popup-modal overflow-hidden">
            <div
              className="relative transform rounded-lg overflow-hidden"
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
