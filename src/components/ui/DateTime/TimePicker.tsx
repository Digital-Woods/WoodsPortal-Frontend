import { useEffect, useState, useRef } from 'react';
import { calculateGMToffset, formatTimestampIST } from '@/utils/DateTime';
import { isObject } from '@/utils/DataMigration';

export const TimePicker = ({
  defaultValue,
  setOpenTimePicker,
  openTimePicker,
  handelChangeTime,
}: any) => {
  const ref = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [defaultTime, setDefaultTime] = useState("");

  useEffect(() => {
    setOpen(openTimePicker);
  }, [openTimePicker]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setOpenTimePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateHalfHourTimesWithGMT = () => {
    const times = [];

    for (let i = 0; i < 24 * 2; i++) {
      const hours = Math.floor(i / 2);
      const minutes = (i % 2) * 30;

      const date = new Date(Date.UTC(1970, 0, 1, hours - 5, minutes - 30)); // adjust to GMT+5:30

      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      const gmtOffset = calculateGMToffset(date); // e.g. "GMT+5:30"
      const formatted = { time: formatter.format(date), timeZone: gmtOffset };
      times.push(formatted);
    }

    return times;
  };
  const timeList = generateHalfHourTimesWithGMT();

  useEffect(() => {
    if (defaultValue) {
      const formatedDateTime = formatTimestampIST(defaultValue)
      setDefaultTime(formatedDateTime?.time || "")
    }
  }, [defaultValue])

  return (
    <div ref={ref}>
      <div className=" bg-white dark:bg-gray-700 rounded-md shadow-lg w-[100%] h-[325.91px] transition-all duration-300 overflow-y-scroll text-center">
        <ul className="text-gray-900 ">
          {timeList.map((time) => (
            <li
              className={`
                w-full px-4 py-2 cursor-pointer 
                text-gray-700 dark:text-white 
                hover:bg-gray-400 hover:text-white 
                text-[12px]
                ${`${time?.time} ${time?.timeZone}` === (isObject(defaultTime) ? `${defaultTime?.time} ${defaultTime?.timeZone}` : defaultTime ) ? "bg-gray-600 text-white" : ""}
              `}
              onClick={() => {
                handelChangeTime(time)
                setOpenTimePicker(false)
                setDefaultTime(time)
              }}
            >
              {time?.time} {time?.timeZone}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
