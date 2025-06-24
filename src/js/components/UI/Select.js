const { Controller } = ReactHookForm;

const Select = ({
  label,
  name = "",
  options = [],
  value = "",
  control,
  filled = null,
  onChangeSelect = null,
  setValue = null,
  size = "medium",
  className,
  apiEndPoint = null,
  optionlabel = "label",
  optionValue = "value",
  disabled = false,
  ...props
}) => {
  const getValue = (value) => {
    if (value && typeof value === "object") value.label;
    return value;
  };

  const handleChange = (value) => {
    if (onChangeSelect) {
      onChangeSelect(filled, value);
    }
    if (setValue) {
      const mValue = value.length > 0 ? value : "";
      setValue(filled.name, mValue);
    }
  };

  useEffect(() => {
    if (disabled && options.length === 1) {
      handleChange(options[0].value)
    }
  }, []);

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
      render={({ field }) =>
        apiEndPoint != null ? (
          <SelectApiData
            apiEndPoint={apiEndPoint}
            handleChange={handleChange}
            optionlabel={optionlabel}
            optionValue={optionValue}
            options={options}
          />
        ) : (
          <select
            {...field}
            onChange={(e) => {
              field.onChange(e);
              handleChange(e.target.value);
            }}
            value={getValue(field.value)}
            className={classNames(
              "w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2",
              heightClasses[size],
              className
            )}
            disabled={disabled}
          >
            <option
              value=""
              className="dark:placeholder-gray-400  dark:text-gray-200"
              selected="selected"
              disabled
              hidden
            >
              {label}
            </option>
            {options.map((option) => (
              <option
                key={getValue(option.value)}
                value={getValue(option.value)}
              >
                {option.label}
              </option>
            ))}
          </select>
        )
      }
    />
  );
};

const SelectApiData = ({
  apiEndPoint,
  handleChange,
  optionlabel,
  optionValue,
  options,
}) => {
  const [allOptions, setAllOptions] = useState(options);
  const [filtered, setfiltered] = useState([]);

  const [selected, setSelected] = useState([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const { setToaster } = useToaster();
  
  const { mutate: callAPI, isLoading } = useMutation({
    mutationKey: ["getOptionsData"],
    mutationFn: async () => {
      try {
        const response = await Client.form.options({
          API: apiEndPoint,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response) => {
      setAllOptions(response.data.results);
      // filterData(response.data.results)
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterData = (data) => {
    const filteredData = data.filter((opt) => {
      const matched = selected.find(
        (val) => val[optionValue] === opt[optionValue]
      );
      return !matched;
    });
    setfiltered(filteredData);
  };

  useEffect(() => {
    if (allOptions.length > 0) filterData(allOptions);
  }, [selected, allOptions]);

  const handleSelect = (value) => {
    // if (!selected.includes(value[optionValue])) {
    //   setSelected([...selected, value[optionValue]]);
    // }
    const filtered = selected.find(
      (item) => item[optionValue] === value[optionValue]
    );

    if (!filtered) {
      setSelected([...selected, value]);
      handleChange([...selected, value]);
    }
    setInput("");
    setShowDropdown(false);
  };

  const handleRemove = (value) => {
    const filtered = selected.filter(
      (item) => item[optionValue] !== value[optionValue]
    );
    setSelected(filtered);
    handleChange(filtered);
  };

  const handleRemoveAll = () => {
    setSelected([]);
    handleChange([]);
  };

  return (
    <div
      ref={wrapperRef}
      className="multiselected-dropdown relative w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 py-1"
    >
      <div
        className="flex flex-wrap items-center"
        onClick={(e) => {
          e.stopPropagation();
          if (allOptions.length < 1) callAPI();
          setShowDropdown((prev) => !prev);
        }}
      >
        <div className="flex gap-1 flex-wrap w-[calc(100%-40px)]">
          {selected.map((tag) => (
            <div
              key={tag[optionValue]}
              className="flex items-center bg-indigo-100 dark:bg-dark-300  border border-gray-300 rounded px-2 py-1 text-sm  dark:text-gray-300"
            >
              {tag[optionlabel]}
              <span
                className="ml-1 text-gray-600 hover:text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(tag);
                }}
                asChild={true}
              >
                &times;
              </span>
            </div>
          ))}
          <input
            className="flex-1 min-w-[100px] p-1 outline-none bg-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="w-[40px] h-full">
          <div class="w-px h-full bg-gray-300"></div>
          <div className="">
            <div className="ml-auto flex items-center space-x-1">
              <span
                className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAll();
                }}
                asChild={true}
              >
                &times;
              </span>
              <span
                className="text-gray-500 hover:text-blue-500 text-xl cursor-pointer"
                asChild={true}
              >
                ▾
              </span>
            </div>
          </div>
        </div>
      </div>
      {showDropdown && isLoading && (
        <div className="z-[16] absolute left-0 right-0 top-full mt-2 z-10 max-h-40 overflow-y-auto shadow rounded-md bg-cleanWhite transition-colors border dark:border-gray-600 dark:bg-gray-700">
          <div className="text-center">Loading...</div>
        </div>
      )}
      {showDropdown && filtered.length > 0 && !isLoading && (
        <div
          className={`z-[16] absolute bottom-full mb-2 left-0 right-0 mt-2 z-10 max-h-40 overflow-y-auto shadow rounded-md bg-cleanWhite transition-colors border dark:border-gray-600 dark:bg-gray-700`}
        >
          {filtered.map((opt) => (
            <div
              key={opt[optionValue]}
              className="px-3 py-2 hover:bg-indigo-100 dark:hover:bg-dark-300 cursor-pointer dark:text-gray-100"
              onClick={() => handleSelect(opt)}
            >
              {opt[optionlabel]}
            </div>
          ))}
        </div>
      )}
    </div>
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
