const ActionsDropdown = ({
  index,
  file,
  dropdownVisible,
  setDropdownVisible,
}) => {
  const toggleDropdown = (index) => {
    setDropdownVisible((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div>
      <button onClick={() => toggleDropdown(index)}>Actions</button>
      {dropdownVisible === index && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-dark-200 border rounded-lg shadow-lg z-50">
          <button onClick={() => console.log(`Download ${file.name}`)}>
            Download
          </button>
          <button
            className="text-red-600"
            onClick={() => console.log(`Trash ${file.name}`)}
          >
            Trash
          </button>
        </div>
      )}
    </div>
  );
};
