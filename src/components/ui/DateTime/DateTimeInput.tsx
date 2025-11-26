import React, { useEffect, useState } from 'react';

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TimeMenu } from './TimeMenu';
import { DateMenu } from './DateMenu';
import { Controller } from 'react-hook-form';
import { formatTimestampIST, parseISTToTimestamp } from '@/utils/DateTime';

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
      setValue,
      time = true, // New prop to control time picker visibility
      isAssociations,
      ...rest
    }: any,
    ref: any
  ) => {
    const [inputValueDate, setInputValueDate] = useState("");
    const [inputValueTime, setInputValueTime] = useState("");

    useEffect(() => {
      if (defaultValue) {
        const formatedDateTime = formatTimestampIST(defaultValue);
        setInputValueDate(formatedDateTime.date);
        if (time) {
          setInputValueTime(formatedDateTime?.time);
        }
      }
    }, [defaultValue, time]);

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
        const value = parseISTToTimestamp(inputValue).toString();
        field.onChange(value);
      }
    }

    const handleSelectTime = (time: any, field?: { onChange: (value: any) => void }) => {
      let inputValue: string = ""
      const newTime = `${time?.time} ${time?.timeZone}`;
      const newDateTime = `${inputValueDate} ${newTime}`;

      setInputValueTime(newTime);
      inputValue = newDateTime;

      if (field) {
        const value = parseISTToTimestamp(inputValue).toString();
        field.onChange(value);
      }
    }

    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
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
                defaultValue={defaultValue}
                dateFormat={dateFormat}
                isStringValue={isStringValue}
                setValue={setValue}
                field={field}
                handleSelect={handleSelectDate}
                isAssociations={isAssociations}
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
                  defaultValue={defaultValue}
                  dateFormat={dateFormat}
                  isStringValue={isStringValue}
                  setValue={setValue}
                  field={field}
                  handleSelect={handleSelectTime}
                  isAssociations={isAssociations}
                />
              </div>
            )}
          </div>
        }
      />
    );
  })
