import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

export const ProseMirrorMenuPopup = ({ children, open, setOpen }: any) => {
  const containerRef = useRef<any>(null);
  const dropdownMenuRef = useRef<any>(null);

  const toggleDropdown = (event: any) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const handleClickOutside = (event: any) => {
    if (
      containerRef.current &&
      containerRef.current.contains(event.target) // Ignore clicks inside this container
    ) {
      return;
    }
    if (
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === ProseMirrorMenuButton) {
          return React.cloneElement(child, { toggleDropdown });
        }
        if (child.type === ProseMirrorMenuOption) {
          return React.cloneElement(child, { open, dropdownMenuRef });
        }

        return child;
      })}
    </div>
  );
};

export const ProseMirrorMenuButton = ({
  id,
  title,
  isActive,
  variant,
  children,
  toggleDropdown,
}: any) => {
  const classesDynamicClassName = {
    root: "CUSTOM-ProseMirror-icon",
  };

  const variantDynamicClassName: any = {
    default: "",
    outline: "border",
  };

  const classesName: any = classNames(
    classesDynamicClassName.root, // Base classes
    variantDynamicClassName[variant] // Dynamic variant classes
  );

  return (
    <div
      onClick={toggleDropdown}
      title={title}
      className={classNames(classesName)}
    >
      <div id={id} className={`CUSTOM-note-menuitem ${isActive ? "" : ""}`}>
        <div id={`${id}-icon`}>{children}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="15px"
          viewBox="0 -960 960 960"
          width="15px"
          fill="#e8eaed"
        >
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>
      </div>
    </div>
  );
};

export const ProseMirrorMenuOption = ({ children, open, dropdownMenuRef }: any) => {
  const [position, setPosition] = useState<any>({ top: '100%', left: 0 });
  const menuRef = useRef<any>(null);

  useEffect(() => {
    if (!open) {
      setPosition({
        top: '100%',
        left: 0,
        right: 'auto',
      });
    }
  }, [open]);

  useEffect(() => {
    if (open && menuRef.current && dropdownMenuRef.current) {
      const menuElement = menuRef.current;
      const dropdownElement = dropdownMenuRef.current;

      const modalContainer = menuElement.closest('.popup-modal') || document.body;
      const containerRect = modalContainer.getBoundingClientRect();
      const buttonRect = dropdownElement.getBoundingClientRect();

      const relativeLeft = buttonRect.left - containerRect.left;

      const menuWidth = menuElement.offsetWidth;
      const availableSpaceRight = containerRect.width - (relativeLeft + menuWidth);

      // Default position (below and aligned left)
      let newPosition: any = {
        top: '100%',
        left: 0,
        right: 'auto'
      };

      // If not enough space on right, try aligning right
      if (availableSpaceRight < 0) {
        newPosition = {
          top: '100%',
          left: 'auto',
          right: 0
        };

        const availableSpaceLeft = relativeLeft;
        if (availableSpaceLeft < menuWidth) {
          newPosition = {
            top: '100%',
            left: -20,
            right: 'auto'
          };
        }
      }
      setPosition(newPosition);
    }
  }, [open]);


  return (
    open && (
      <ul
        ref={(node) => {
          menuRef.current = node;
          dropdownMenuRef.current = node;
        }}
        className={`absolute mt-1 border bg-white shadow-lg rounded-rounded overflow-hidden z-50 w-max transition-all duration-200 ease-in-out transform 
          ${open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}
        `}
        style={position}
      >
        {children}
      </ul>
    )
  );
};
