const CheckboxField = ({ editRow, saveData, setValue, name, control, setSelectedValues, selectedValues = [] }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const handleCheckboxChange = (value) => {
      let updatedValues = [...selectedValues];
      if (updatedValues.includes(value)) {
        updatedValues = updatedValues.filter((item) => item !== value);
      } else {
        updatedValues.push(value);
      }
      setSelectedValues(updatedValues);
      setValue(name, updatedValues); 
      handleSave(updatedValues);
    };
  
    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  
    const handleSave = (updatedValues) => {
      const selectedLabels = updatedValues.map(
        (value) => editRow.options.find((option) => option.value === value)?.label
      );
  
      const savedData = {
        [editRow.key]: selectedLabels.join(";"),
      };
  
      return savedData;
    };
  
  
    // Close dropdown when clicking outside
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
  
    React.useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);
  
    return (
      <div className="relative">
        {/* Selected options display */}
        <div
          className="border relative dark:border-gray-600 rounded text-xs p-2 !pr-4 cursor-pointer flex flex-wrap gap-2"
          onClick={toggleDropdown}
        >
          {selectedValues.length > 0 ? (
            selectedValues.map((value) =>
              value && value !== "" ? (
                <span
                  key={value}
                  className="border border-secondary px-1 py-1 rounded"
                >
                  {
                    editRow.options.find((option) => option.value === value)
                      ?.label || value // Fallback to value if label is not found
                  }
                  <span
                    className="cursor-pointer inline ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(value);
                    }}
                  >
                    ✕
                  </span>
                </span>
              ) : null
            )
          ) : (
            <span className="text-gray-400">Select options...</span>
          )}
          <span className="ml-auto absolute top-1/2 right-1 transform -translate-y-1/2">
            <Chevron transform="rotate(270)"/>
          </span>
        </div>
  
        {/* Dropdown options */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute bg-white dark:bg-dark-200 border dark:border-gray-600 rounded shadow-md mt-2 z-10 w-full max-h-40 overflow-y-auto pb-8"
          >
            {editRow.options.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-2 hover:bg-gray-100 hover:dark:bg-dark-300"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };