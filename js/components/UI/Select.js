const { useState, useRef, useEffect } = React;
const classNames = window.classNames;

const Select = ({ children, right }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <SelectSection setIsOpen={setIsOpen} isOpen={isOpen} />
      {isOpen && <Options right={right}>{children}</Options>}
    </div>
  );
};

const SelectSection = ({ setIsOpen, isOpen }) => {
  return (
    <SelectButton
      className="border border-2 rounded-md text-black px-5 py-2 flex items-center gap-x-2"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
    >
      Client
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
        <path d="M9 4.5L6 1.5L3 4.5" stroke="#2F2F33" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 8.5L6 11.5L9 8.5" stroke="#2F2F33" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </SelectButton>
  );
};

const Options = React.forwardRef(({ children, className, right }, ref) => (
  <div
    className={classNames(
      "absolute text-sm w-64 px-3 py-2 bg-white border shadow-lg mt-1 z-50 rounded-md",
      { "right-8": right },
      className
    )}
    ref={ref}
  >
    {children}
  </div>
));

const Option = React.forwardRef(({ children, className }, ref) => {
  return (
    <div
      as="button"
      className={classNames(
        "w-full rounded-md text-center py-2",
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  );
});

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const SelectButton = ({ children, setIsOpen, isOpen, ...props }) => {
  return (
    <button onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
    </button>
  );
};

const Items = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const Item = ({ as: Component, children, ...props }) => {
  return (
    <Component onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
    </Component>
  );
};

