const DateTimeInput = React.forwardRef(
  (
    {
      className,
      type = "text",
      placeholder = "Search",
      height = "medium",
      icon: Icon = "",
      variant = "normal",
      defaultValue = "",
      dateFormat = "dd-mm-yyyy",
      setValue,
      ...rest
    },
    ref
  ) => {
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    useEffect(() => {
      if (defaultValue) setInputValue(formatDate(defaultValue));
    }, [defaultValue]);
    
    useEffect(() => {
      if (type === "date") setValue(rest.name, inputValue);
    }, [inputValue]);

    const heightClasses = {
      small: "py-1",
      semiMedium: "py-2",
      medium: "py-2",
      large: "py-5",
    };

    const classes = {
      root: "w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2",
      normal: "",
    };

    const rootClassName = classNames(
      classes.root,
      {
        [classes.normal]: variant === "normal",
      },
      Icon && "pl-8",
      heightClasses[height],
      className
    );
    delete rest.className;

    return (
      <div>
        <div className="relative dark:bg-dark-300 flex items-center rounded-lg max-sm:w-full">
          {Icon && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <Icon className="h-6 w-6 text-gray-500" />
            </div>
          )}
            <input
              placeholder={placeholder}
              className={rootClassName}
              value={inputValue}
              ref={ref}
              {...Object.fromEntries(
                Object.entries(rest).filter(
                  ([key]) =>
                    key !== "dateFormat" &&
                    key !== "type" &&
                    key !== "defaultValue"
                )
              )}
              onClick={() =>
                type === "date" ? setOpenDatePicker(!openDatePicker) : null
              }
            />
        </div>
        <DatePicker
          defaultValue={defaultValue}
          dateFormat={dateFormat}
          setOpenDatePicker={setOpenDatePicker}
          openDatePicker={openDatePicker}
          setInputValue={setInputValue}
        />
      </div>
    );
  }
);
