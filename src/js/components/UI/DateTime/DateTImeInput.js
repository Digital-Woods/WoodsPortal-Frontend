const DateTimeInput = React.forwardRef(
  (
    {
      className,
      type = "text",
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
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [inputValueDate, setInputValueDate] = useState("");
    const [inputValueTime, setInputValueTime] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
      if (defaultValue) {
        const formatedDateTime = formatTimestampIST(defaultValue);
        setInputValueDate(formatedDateTime.date);
        setInputValueTime(formatedDateTime.time);
        setInputValue(`${formatedDateTime.date} ${formatedDateTime.time}`);
      }
    }, [defaultValue]);

    useEffect(() => {
      setValue(rest.name, inputValue);
    }, [inputValue]);

    const handelChangeDate = (date) => {
      const newDateTime = `${date} ${inputValueTime}`;
      setInputValueDate(date);
      setInputValue(newDateTime);
    };

    const handelChangeTime = (time) => {
      const newTime = `${time.time} ${time.timeZone}`;
      const newDateTime = `${inputValueDate} ${newTime}`;
      setInputValueTime(newTime);
      setInputValue(newDateTime);
    };

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
        <div className={type === "datetime" ? "flex max-sm:flex-col gap-2" : ""}>
          <input
            className="hidden"
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
          />

          <div className="relative dark:bg-dark-300 flex items-center rounded-lg w-full">
            {Icon && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Icon className="h-6 w-6 text-gray-500" />
              </div>
            )}
            <input
              placeholder="MM:DD:YYYY"
              className={rootClassName}
              value={inputValueDate}
              // ref={ref}
              // {...Object.fromEntries(
              //   Object.entries(rest).filter(
              //     ([key]) =>
              //       key !== "dateFormat" &&
              //       key !== "type" &&
              //       key !== "defaultValue"
              //   )
              // )}
              onClick={() => setOpenDatePicker(!openDatePicker)}
            />
            <DatePicker
              defaultValue={defaultValue}
              dateFormat={dateFormat}
              setOpenDatePicker={setOpenDatePicker}
              openDatePicker={openDatePicker}
              handelChangeDate={handelChangeDate}
            />
          </div>
          <div className="relative dark:bg-dark-300 flex items-center rounded-lg w-full">
            {Icon && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Icon className="h-6 w-6 text-gray-500" />
              </div>
            )}
            {type === "datetime" && (
              <input
                placeholder="HH:MM"
                className={rootClassName}
                value={inputValueTime}
                // ref={ref}
                // {...Object.fromEntries(
                //   Object.entries(rest).filter(
                //     ([key]) =>
                //       key !== "dateFormat" &&
                //       key !== "type" &&
                //       key !== "defaultValue"
                //   )
                // )}
                onClick={() => setOpenTimePicker(!openDatePicker)}
              />
            )}
            <TimePicker
              defaultValue={defaultValue}
              setOpenTimePicker={setOpenTimePicker}
              openTimePicker={openTimePicker}
              handelChangeTime={handelChangeTime}
            />
          </div>
        </div>
      </div>
    );
  }
);
