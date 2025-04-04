const ProseMirrorMenuPopup = ({ children, open, setOpen }) => {
  const containerRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const handleClickOutside = (event) => {
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
  const [position, setPosition] = useState({ top: '100%', left: 0 });
  const menuRef = useRef(null);

useEffect(() => {
  if (open && menuRef.current && dropdownMenuRef.current) {
    const menuElement = menuRef.current;
    const dropdownElement = dropdownMenuRef.current;
    
    const modalContainer = menuElement.closest('.popup-modal') || document.body;
    const containerRect = modalContainer.getBoundingClientRect();
    const buttonRect = dropdownElement.getBoundingClientRect();
    
    const relativeLeft = buttonRect.left - containerRect.left;
    const relativeTop = buttonRect.bottom - containerRect.top;
    
    const menuWidth = menuElement.offsetWidth;
    const availableSpaceRight = containerRect.width - (relativeLeft + menuWidth);
    
    // Default position (below and aligned left)
    let newPosition = {
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
      
      // If aligning right would push it out of left boundary, adjust to stay within container
      const availableSpaceLeft = relativeLeft;
      if (availableSpaceLeft < menuWidth) {
        newPosition = {
          top: '100%',
          left: Math.max(0, containerRect.width - menuWidth),
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
        className="absolute mt-1 border bg-white shadow-lg rounded-rounded overflow-hidden z-50 w-max"
        style={position}
      >
        {children}
      </ul>
    )
  );
};
