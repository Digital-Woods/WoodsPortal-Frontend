const MultiSelect = ({
  label,
  name,
  options = [],
  value = [], // Pre-selected values
  control,
  filled = null,
  onChangeSelect = null,
  size = "medium",
  className,
  ...props
}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    // Sync selected values with the initial value prop
    setSelectedValues(value);
  }, [value]);

  const handleChange = (selectedValue) => {
    let newValues;
    if (selectedValues.includes(selectedValue)) {
      newValues = selectedValues.filter((val) => val !== selectedValue);
    } else {
      newValues = [...selectedValues, selectedValue];
    }
    setSelectedValues(newValues);

    if (onChangeSelect) {
      onChangeSelect(filled, newValues);
    }
  };

  const heightClasses = {
    small: "p-1.5 text-xs",
    semiMedium: "py-2",
    medium: "p-2.5 text-sm",
    large: "py-5",
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={value} // Initialize controller with pre-selected values
      render={({ field }) => (
        <div className="relative">
          <div
            className={classNames(
              "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
              heightClasses[size],
              className
            )}
          >
            <div className="flex flex-wrap gap-2 p-2">
              {selectedValues.map((selected) => (
                <span
                  key={selected}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                >
                  {options.find((option) => option.value === selected)?.label}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute w-full bg-white shadow-lg z-10 rounded-md mt-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleChange(option.value)}
                className={classNames(
                  "p-2 hover:bg-blue-50 cursor-pointer",
                  selectedValues.includes(option.value) && "bg-blue-100"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)} // Ensure checkbox reflects selected state
                  onChange={() => handleChange(option.value)}
                  className="mr-2"
                />
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
};

