const ProseMirrorMenuPopup = ({ children, open, setOpen }) => {
  const dropdownMenuRef = useRef(null);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const handleClickOutside = (event) => {
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
    <div className="relative inline-block">
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

const ProseMirrorMenuButton = ({
  id,
  title,
  isActive,
  variant,
  children,
  toggleDropdown,
}) => {
  const classes = {
    root: "ProseMirror-icon",
  };

  const variantClasses = {
    default: "",
    outline: "border",
  };

  const classesName = classNames(
    classes.root, // Base classes
    variantClasses[variant] // Dynamic variant classes
  );

  return (
    <div
      onClick={toggleDropdown}
      title={title}
      className={classNames(classesName)}
    >
      <div id={id} className={`note-menuitem ${isActive ? "" : ""}`}>
        <div id={`${id}-icon`}>{children}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="#e8eaed"
        >
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>
      </div>
    </div>
  );
};

const ProseMirrorMenuOption = ({ children, open, dropdownMenuRef }) => {
  return (
    open && (
      <ul
        ref={dropdownMenuRef}
        className="absolute right-0 mt-1 transform border bg-white shadow-lg rounded-rounded overflow-hidden z-50 w-max"
      >
        {children}
      </ul>
    )
  );
};
