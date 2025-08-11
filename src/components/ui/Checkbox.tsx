export const Checkbox = ({
  label,
  checked,
  onChange,
  number = null,
  labelClassName = "font-medium text-sm",
  checkboxClassName = "font-medium text-sm",
  containerClassName = "font-medium text-sm",
}: any) => {
  return (
    <div className={`flex justify-between items-center cursor-pointer ${containerClassName}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`form-checkbox h-4 w-4 cursor-pointer ${checkboxClassName}`}
        />
        {label && <label className={`ml-2  ${labelClassName}`}>{label}</label>}
      </div>

      {label && number && <label className={`ml-2 `}>{number}</label>}
    </div>
  );
};
