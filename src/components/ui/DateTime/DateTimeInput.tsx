import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { formatTimestampIST, parseISTToTimestamp } from '@/utils/DateTime';
import { DatePicker } from '@/components/ui/DateTime/DatePicker';
import { TimePicker } from '@/components/ui/DateTime/TimePicker';


const usePosition = (containerSelector = '.CUSTOM-object-create-form') => {
  const [position, setPosition] = useState('bottom');
  const ref = useRef<any>(null);

  useEffect(() => {
    const calculatePosition = () => {
      if (ref.current) {
        const inputRect = ref.current.getBoundingClientRect();
        const container = document.querySelector(containerSelector);
        
        if (!container) {
          setPosition('bottom');
          return;
        }

        const containerRect = container.getBoundingClientRect();
        
        const spaceAbove = inputRect.top - containerRect.top;
        const spaceBelow = containerRect.bottom - inputRect.bottom;

        if (spaceAbove > 340 && spaceAbove > spaceBelow) {
          setPosition('top');
        } else {
          setPosition('bottom');
        }
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('resize', calculatePosition);
    };
  }, [containerSelector]);

  return [position, ref];
};

export const DateTimeInput = React.forwardRef(
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
      time = true, // New prop to control time picker visibility
      ...rest
    }: any,
    ref: any
  ) => {
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [inputValueDate, setInputValueDate] = useState("");
    const [inputValueTime, setInputValueTime] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [position, positionRef] = usePosition('.CUSTOM-object-create-form');

    useEffect(() => {
      if (defaultValue) {
        const formatedDateTime = formatTimestampIST(defaultValue);
        setInputValueDate(formatedDateTime.date);
        if (time) {
          setInputValueTime(formatedDateTime?.time);
          setInputValue(formatedDateTime?.time ? `${formatedDateTime?.date} ${formatedDateTime?.time}` : formatedDateTime?.date);
        } else {
          setInputValue(formatedDateTime?.date);
        }
      }
    }, [defaultValue, time]);

    useEffect(() => {
      const value = parseISTToTimestamp(inputValue).toString();
      setValue(rest?.name, value === 'NaN' ? '' : value);
    }, [inputValue]);

    const handelChangeDate = (date: any) => {
      if (time) {
        const newDateTime = inputValueTime ? `${date} ${inputValueTime}` : date;
        setInputValue(newDateTime);
      } else {
        setInputValue(date);
      }
      setInputValueDate(date);
    };

    const handelChangeTime = (time: any) => {
      const newTime = `${time?.time} ${time?.timeZone}`;
      const newDateTime = `${inputValueDate} ${newTime}`;
      setInputValueTime(newTime);
      setInputValue(newDateTime);
    };

    const heightDynamicClassName: any = {
      small: "py-1",
      semiMedium: "py-2",
      medium: "py-2",
      large: "py-5",
    };

    const classesDynamicClassName = {
      root: "w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2",
      normal: "",
    };

    const rootClassName = classNames(
      classesDynamicClassName.root,
      {
        [classesDynamicClassName.normal]: variant === "normal",
      },
      Icon && "pl-8",
      heightDynamicClassName[height],
      className
    );
    delete rest.className;

    return (
      <div>
        <div className={time ? "flex max-sm:flex-col gap-2" : ""}>
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
              placeholder={dateFormat.toUpperCase()}
              className={rootClassName}
              value={inputValueDate}
              onClick={() => setOpenDatePicker(!openDatePicker)}
              readOnly
            />
            <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 z-50`} ref={positionRef}>
            <DatePicker
              defaultValue={defaultValue}
              dateFormat={dateFormat}
              setOpenDatePicker={setOpenDatePicker}
              openDatePicker={openDatePicker}
              handelChangeDate={handelChangeDate}
            />
            </div>
          </div>
          {time && (
          <div className="relative dark:bg-dark-300 flex items-center rounded-lg w-full">
            {Icon && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Icon className="h-6 w-6 text-gray-500" />
              </div>
            )}
              <input
                placeholder="HH:MM"
                className={rootClassName}
                value={inputValueTime}
                onClick={() => setOpenTimePicker(!openTimePicker)}
                readOnly
              />
          <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 z-50`} ref={positionRef}>
            <TimePicker
              defaultValue={defaultValue}
              setOpenTimePicker={setOpenTimePicker}
              openTimePicker={openTimePicker}
              handelChangeTime={handelChangeTime}
            />
          </div>
          </div>
          )}
        </div>
      </div>
    );
  }
);