const Checkbox = ({
    label,
    checked,
    onChange,
    number='0',
    labelClassName = 'font-medium text-sm',
    checkboxClassName = 'font-medium text-sm',
    containerClassName = 'font-medium text-sm'
  }) => {
    return (
      <div className={`flex justify-between items-center ${containerClassName}`}>
        <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`form-checkbox h-4 w-4 ${checkboxClassName}`}
        />
        {label && <label className={`ml-2  ${labelClassName}`}>{label}</label>}
        </div>
    
        {label && <label className={`ml-2 `}>{number}</label>}
      </div>
    );
  };