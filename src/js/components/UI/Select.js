const { Controller } = ReactHookForm;

const Select = ({ label, name='', options, value = "", control, filled = null, onChangeSelect = null, size = "medium", className, ...props }) => {
  const getValue = (value) => {
    if (value && typeof value === "object") value.label;
    return value;
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (onChangeSelect) onChangeSelect(filled, value);
  };

  const heightClasses = {
    small: "p-1.5 text-xs",
    semiMedium: "py-2",
    medium: "p-2 text-sm",
    large: "py-5",
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={value}
      render={({ field }) => (
        <select
          {...field}
          onChange={(e) => {
            field.onChange(e);
            handleChange(e)
          }}
          value={getValue(field.value)}
          className={classNames(
            "w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2",
            heightClasses[size],
            className
          )}
        >
          <option value="" className="dark:placeholder-gray-400  dark:text-gray-200" selected="selected" disabled hidden>
            {label}
          </option>
          {options.map((option) => (
            <option key={getValue(option.value)} value={getValue(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    />
  );
};

const CustomCheckboxSelect = ({ children, buttonText, spanText, showSpan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className=" inline-block" ref={dropdownRef}>
      <SelectSection
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        buttonText={buttonText}
        spanText={spanText}
        showSpan={showSpan}
      />
      {isOpen && children}
    </div>
  );
};

const SelectSection = ({
  setIsOpen,
  isOpen,
  buttonText,
  spanText,
  showSpan,
}) => {
  return (
    <SelectButton
      className="w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
    >
      {buttonText}
      {showSpan && (
        <span className="bg-lightblue rounded-md p-1 text-xs text-white">
          {spanText}
        </span>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="currentcolor"
      >
        <path
          d="M9 4.5L6 1.5L3 4.5"
          stroke="#2F2F33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 8.5L6 11.5L9 8.5"
          stroke="#2F2F33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SelectButton>
  );
};

const Options = React.forwardRef(({ children, className, right }, ref) => (
  <div
    className={classNames(
      "absolute text-sm w-64 px-3 py-2 bg-cleanWhite border dark:bg-dark-300 dark:text-white  shadow-lg mt-1 z-50 rounded-md",
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
      className={classNames("w-full rounded-md text-center py-2", className)}
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
