import { Chevron } from "@/assets/icons/Chevron";
import { CloseIcon } from "@/assets/icons/closeIcon";
import { OutlineSearch } from "@/assets/icons/OutlineSearch";
import { useState, useRef, useEffect } from "react";

export const CheckboxField = ({ editRow, saveData, setValue, name, control, setSelectedValues, selectedValues = [] }: any) => {
  const [isDropdownOpen, setDropdownOpen] = useState<any>(false);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const dropdownRef = useRef<any>(null);
  const searchInputRef = useRef<any>(null);

  // Handle checkbox state changes
  const handleCheckboxChange = (value: any) => {
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

  const handleSave = (updatedValues: any) => {
    const selectedLabels = updatedValues.map(
      (value: any) => editRow.options.find((option: any) => option.value === value)?.label
    );
    const savedData = {
      [editRow.key]: selectedLabels.join(';'),
    };
    return savedData;
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen((prev: any) => !prev);

  // Close dropdown when clicking outside
  const handleOutsideClick = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  // Search functionality
  const filteredOptions = editRow.options.filter((option: any) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      searchInputRef.current?.focus(); // Focus on search input when dropdown opens
    }
  }, [isDropdownOpen]);

  return (
    <div className="relative">
      {/* Selected options display */}
      <div
        className="border relative dark:border-gray-600 rounded text-xs p-2 !pr-4 cursor-pointer flex flex-wrap gap-2 items-center min-h-[43px]"
        onClick={toggleDropdown}
      >
        {selectedValues.length > 0 ? (
          selectedValues.map((value: any) =>
            value && value !== '' ? (
              <span
                key={value}
                className="border border-secondary px-1 py-1 rounded flex items-center"
              >
                {
                  editRow.options.find((option: any) => option.value === value)
                    ?.label || value // Fallback to value if label is not found
                }
                <span
                  className="cursor-pointer inline ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(value);
                  }}
                >
                  <CloseIcon className="w-4 h-4 text-blue-700" />
                </span>
              </span>
            ) : null
          )
        ) : (
          <span className="text-gray-400">Select options...</span>
        )}
        <span className="ml-auto absolute top-1/2 right-1 transform -translate-y-1/2">
          <Chevron transform={`${isDropdownOpen ? 'rotate(90)' : 'rotate(270)'}`}  className={`w-4 h-4 transition-transform -webkit-transform`} />
        </span>
      </div>

      {/* Dropdown options */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-200 border dark:border-gray-600 rounded shadow-md mt-2 z-10 w-full min-w-[275px] max-h-40 overflow-y-auto"
        >
          {/* Search input */}
          <div className="p-2">
            <div className="relative">
              <OutlineSearch className="absolute left-1 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-1 pl-8 pr-4 rounded-sm border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Dropdown options list */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option: any) => (
              <label
                key={option.value}
                className="flex items-center p-2 hover:bg-gray-100 hover:dark:bg-dark-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))
          ) : (
            <div className="p-2 text-gray-400">No options match your search.</div>
          )}
        </div>
      )}
    </div>
  );
};