import { useEffect, useState, useRef } from 'react';
import { formatDate } from '@/utils/DateTime';
import { ArrowDropDownIcon } from '@/assets/icons/ArrowDropDownIcon';
import { ChevronLeftIcon } from '@/assets/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon';

export const DatePicker = ({
  defaultValue,
  dateFormat,
  setOpenDatePicker,
  openDatePicker,
  handelChangeDate,
}: any) => {
  const ref = useRef<any>(null);
  const yearRefs = useRef<any>({});
  const defaultDate = defaultValue ? new Date(defaultValue) : new Date();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<any>(defaultDate);
  const [viewDate, setViewDate] = useState<any>(defaultDate);
  const [open, setOpen] = useState<any>(false);
  const [showYearSelect, setShowYearSelect] = useState<any>(false);
  const [showMonthSelect, setShowMonthSelect] = useState<any>(false);

  useEffect(() => {
    setOpen(openDatePicker);
  }, [openDatePicker]);

  const setChangedDateValue = (value: any) => {
    setViewDate(value);
    const state = showYearSelect ? "year" : showMonthSelect ? "month" : "date";
    handelChangeDate(formatDate(value), state);
  };

  const months = [...Array(12)].map((_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );
  const years = Array.from({ length: 100 }, (_, i) => 1970 + i);

  const firstDay = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate();
  const prevMonthDays = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    0
  ).getDate();

  const totalCells = 42;
  const calendarDays = [];

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - firstDay + 1;

    if (i < firstDay) {
      calendarDays.push({
        day: prevMonthDays - firstDay + i + 1,
        date: new Date(
          viewDate.getFullYear(),
          viewDate.getMonth() - 1,
          prevMonthDays - firstDay + i + 1
        ),
        currentMonth: false,
      });
    } else if (dayNumber > daysInMonth) {
      calendarDays.push({
        day: dayNumber - daysInMonth,
        date: new Date(
          viewDate.getFullYear(),
          viewDate.getMonth() + 1,
          dayNumber - daysInMonth
        ),
        currentMonth: false,
      });
    } else {
      calendarDays.push({
        day: dayNumber,
        date: new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNumber),
        currentMonth: true,
      });
    }
  }

  const handleDateClick = (dateObj: any) => {
    setSelectedDate(dateObj.date);
    setChangedDateValue(dateObj.date);
    setOpen(false);
    setOpenDatePicker(false);
    setShowYearSelect(false);
    setShowMonthSelect(false);
  };

  const handleYearClick = (year: any) => {
    // const newDate = new Date(year, viewDate.getMonth(), 1);
    // setChangedDateValue(newDate);
    // setShowYearSelect(false);

    const newDate = new Date(
      year,
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    setChangedDateValue(newDate);
    setSelectedDate(newDate);
    setShowYearSelect(false);
    setShowMonthSelect(false);
  };

  const handleMonthClick = (monthIndex: any) => {
    const newDate = new Date(viewDate.getFullYear(), monthIndex, 1);
    setChangedDateValue(newDate);
    setShowMonthSelect(false);
  };

  const handleToday = () => {
    setSelectedDate(today);
    setChangedDateValue(today);
    handelChangeDate(formatDate(today));
    setOpen(false);
    setOpenDatePicker(false);
  };

  const handleClear = () => {
    setSelectedDate(null);
    handelChangeDate("");
    setOpen(false);
    setOpenDatePicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setOpenDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showYearSelect && yearRefs.current[viewDate.getFullYear()]) {
      yearRefs.current[viewDate.getFullYear()].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [showYearSelect, viewDate]);

  return (
    <div className="relative" ref={ref}>
      {/* <input
        readOnly
        className="bg-white border border-gray-300 rounded px-4 py-2 w-48 cursor-pointer"
        value={selectedDate ? selectedDate.toLocaleDateString("en-US") : ""}
        onClick={() => setOpen(!open)}
        placeholder="Select date"
      /> */}
      {/* {open && ( */}
        <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow-lg p-2 w-full min-w-[260px] h-[325.91px] transition-all duration-300 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            {showYearSelect || showMonthSelect ? (
              <div></div>
            ) : (
              <div
                className="rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  showYearSelect
                    ? setChangedDateValue(
                        new Date(
                          viewDate.getFullYear() - 12,
                          viewDate.getMonth(),
                          1
                        )
                      )
                    : showMonthSelect
                    ? setChangedDateValue(
                        new Date(
                          viewDate.getFullYear(),
                          viewDate.getMonth() - 1,
                          1
                        )
                      )
                    : setChangedDateValue(
                        new Date(
                          viewDate.getFullYear(),
                          viewDate.getMonth() - 1,
                          1
                        )
                      )
                }
              >
                <ChevronLeftIcon width = {"18px"} height = {"18px"} className="text-gray-500" />
              </div>
            )}

            <div className="flex gap-2 items-center font-medium">
              <div
                onClick={() => {
                  setShowMonthSelect(!showMonthSelect);
                  setShowYearSelect(false);
                }}
                className="hover:text-primary flex items-center justify-center cursor-pointer text-sm"
              >
                {months[viewDate.getMonth()]}{" "}
                <ArrowDropDownIcon className="text-gray-500" />
              </div>
              <div
                onClick={() => {
                  setShowYearSelect(!showYearSelect);
                  setShowMonthSelect(false);
                }}
                className="hover:text-primary flex items-center justify-center cursor-pointer text-sm"
              >
                {viewDate.getFullYear()}{" "}
                <ArrowDropDownIcon className="text-gray-500" />
              </div>
            </div>

            {showYearSelect || showMonthSelect ? (
              <div></div>
            ) : (
              <div
                className="rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  showYearSelect
                    ? setChangedDateValue(
                        new Date(
                          viewDate.getFullYear() + 12,
                          viewDate.getMonth(),
                          1
                        )
                      )
                    : showMonthSelect
                    ? setChangedDateValue(
                        new Date(
                          viewDate.getFullYear(),
                          viewDate.getMonth() + 1,
                          1
                        )
                      )
                    : setChangedDateValue(
                        new Date(
                          viewDate.getFullYear(),
                          viewDate.getMonth() + 1,
                          1
                        )
                      )
                }
              >
                <ChevronRightIcon width = {"18px"} height = {"18px"}  className="text-gray-500" />
              </div>
            )}
          </div>

          {showYearSelect ? (
            <div className="grid grid-cols-4 gap-2 overflow-y-auto h-[250px]">
              {years.map((year) => (
                <div
                  ref={(el: any) => (yearRefs.current[year] = el)}
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`text-center py-2 cursor-pointer rounded-full text-sm ${
                    year === viewDate.getFullYear()
                      ? "bg-gray-700 text-white dark:bg-white dark:text-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {year}
                </div>
              ))}
            </div>
          ) : showMonthSelect ? (
            <div className="h-[250px]">
            <div className="grid grid-cols-3 gap-1 overflow-y-auto ">
              {months.map((month, index) => (
                <div
                  key={index}
                  onClick={() => handleMonthClick(index)}
                  className={`text-center py-1 cursor-pointer rounded-full text-sm ${
                    index === viewDate.getMonth()
                      ? "bg-gray-700 text-white dark:bg-white dark:text-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {month}
                </div>
              ))}
            </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2 font-medium">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {calendarDays.map((item, idx) => {
                  const isSelected =
                    selectedDate &&
                    item.date.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={idx}
                      className={`py-2 cursor-pointer rounded-full ${
                        isSelected
                          ? "bg-gray-700 text-white dark:bg-white dark:text-gray-700"
                          : item.currentMonth
                          ? "hover:bg-gray-200"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleDateClick(item)}
                    >
                      {item.day}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <div
                  onClick={handleToday}
                  className="w-full mr-2 py-1 border border-input text-foreground dark:text-white bg-transparent shadow hover:bg-accent hover:text-accent-foreground dark:bg-dark-400 dark:hover:bg-dark-400 rounded text-center text-sm cursor-pointer"
                >
                  Today
                </div>
                <div
                  onClick={handleClear}
                  className="w-full ml-2 py-1 border border-input text-foreground dark:text-white bg-transparent shadow hover:bg-accent hover:text-accent-foreground dark:bg-dark-400 dark:hover:bg-dark-400 rounded text-center text-sm cursor-pointer"
                >
                  Clear
                </div>
              </div>
            </>
          )}
        </div>
      {/* )} */}
    </div>
  );
};
