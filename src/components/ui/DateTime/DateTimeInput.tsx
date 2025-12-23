import React, { useEffect, useState } from 'react';

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TimeMenu } from './TimeMenu';
import { DateMenu } from './DateMenu';
import { Controller } from 'react-hook-form';
import { formatTimestampIST, normalizeToTimestamp, parseISTToTimestamp } from '@/utils/DateTime';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

// Main exported component
export const DateTimeInput = React.forwardRef(
  (
    {
      control = null,
      name = "",
      className,
      type = "text",
      height = "medium",
      icon: Icon = "",
      variant = "normal",
      defaultValue = "",
      dateFormat = "dd-mm-yyyy",
      isStringValue = true,
      setValue = null,
      time = true, // New prop to control time picker visibility
      isAssociations,
      panelRef = null,
      ...rest
    }: any,
    ref: any
  ) => {
    const [inputValueDate, setInputValueDate] = useState("");
    const [inputValueTime, setInputValueTime] = useState("");
    const value = normalizeToTimestamp(defaultValue)

    useEffect(() => {
      if (value) {
        const formatedDateTime = formatTimestampIST(value);
          setInputValueDate(formatedDateTime.date);
        if (time) {
          setInputValueTime(formatedDateTime?.time);
        }
        if(setValue) setValue(name, value);
      }
    }, [value, time]);

    const handleSelectDate = (date: any, field?: { onChange: (value: any) => void }) => {
      let inputValue: string = ""
      if (time) {
        const newDateTime = inputValueTime ? `${date} ${inputValueTime}` : date;
        inputValue = newDateTime;
      } else {
        inputValue = date;
      }

      setInputValueDate(date)


      if (field) {
        const value = Number(parseISTToTimestamp(inputValue).toString()) || null;
        field.onChange(value || "");
      }
    }

    const handleSelectTime = (time: any, field?: { onChange: (value: any) => void }) => {
      let inputValue: string = ""
      const newTime = `${time?.time || ""} ${time?.timeZone || ""}`;
      const newDateTime = `${inputValueDate} ${newTime || ""}`;

      setInputValueTime(newTime || "");
      inputValue = (inputValueDate && newTime) ? newDateTime : "";

      if (field) {
        const value =  Number(parseISTToTimestamp(inputValue).toString()) || null;
        field.onChange(value || "");
      }
    }

    return (
      <Controller
        control={control}
        name={name}
        defaultValue={value}
        render={({ field }: any) =>
          <div className={time ? "flex max-sm:flex-col gap-2" : ""}>
            <div className='w-full'>
              <DateMenu
                control={control}
                name={name}
                className={className}
                type={type}
                height={height}
                icon={Icon}
                variant={variant}
                defaultValue={value}
                dateFormat={dateFormat}
                isStringValue={isStringValue}
                setValue={setValue}
                field={field}
                handleSelect={handleSelectDate}
                isAssociations={isAssociations}
                panelRef={panelRef}
              />
            </div>
            {time && (
              <div className='w-full'>
                <TimeMenu
                  control={control}
                  name={name}
                  className={className}
                  type={type}
                  height={height}
                  icon={Icon}
                  variant={variant}
                  defaultValue={value}
                  dateFormat={dateFormat}
                  isStringValue={isStringValue}
                  setValue={setValue}
                  field={field}
                  handleSelect={handleSelectTime}
                  isAssociations={isAssociations}
                  panelRef={panelRef}
                />
              </div>
            )}
          </div>
        }
      />
    );
  })
