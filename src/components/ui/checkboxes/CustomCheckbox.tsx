import { Checkbox } from "../Checkbox";
import { CustomCheckboxSelect, Options } from "../Select";

export const CustomCheckbox = ({children, buttonText, spanText, showSpan }: any) => {
  return (
    <div>
      <CustomCheckboxSelect buttonText={buttonText} spanText={spanText} showSpan={showSpan}>
        <Options>
          <div className="py-3 font-[500] text-lg">Client Filter</div>
          <hr className="py-1" />
          <div className="flex gap-x-3 py-2">
            <p className="text-xs text-secondary cursor-pointer">CustomCheckboxSelect all</p>
            <p className="text-xs text-secondary cursor-pointer">clear all</p>
          </div>
          <Option>
            <Checkbox label="Yokshire new housejbbb" />
          </Option>
          <Option>
            <Checkbox label="Yokshire new house" />
          </Option>
        </Options>
      </CustomCheckboxSelect>
    </div>
  );
};
