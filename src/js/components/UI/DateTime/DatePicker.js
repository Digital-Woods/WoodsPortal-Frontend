const DatePicker = ({
  defaultValue,
  dateFormat,
  setOpenDatePicker,
  openDatePicker,
  handelChangeDate,
}) => {
  const ref = useRef();
  const yearRefs = useRef({});
  const today = defaultValue ? new Date(defaultValue) : new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewDate, setViewDate] = useState(today);
  const [open, setOpen] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);

  useEffect(() => {
    setOpen(openDatePicker);
  }, [openDatePicker]);

  const setChangedDateValue = (value) => {
    setViewDate(value);
    handelChangeDate(formatDate(value));
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

  const handleDateClick = (dateObj) => {
    setSelectedDate(dateObj.date);
    setChangedDateValue(dateObj.date);
    setOpen(false);
    setOpenDatePicker(false);
    setShowYearSelect(false);
    setShowMonthSelect(false);
  };

  const handleYearClick = (year) => {
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

  const handleMonthClick = (monthIndex) => {
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
      {open && (
        <div className="absolute bottom-12 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-80 z-50 h-[400px] transition-all duration-300 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
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
                <ChevronLeftIcon className="text-gray-500" />
              </div>
            )}

            <div className="flex gap-2 items-center font-medium">
              <div
                onClick={() => {
                  setShowMonthSelect(!showMonthSelect);
                  setShowYearSelect(false);
                }}
                className="hover:text-primary flex items-center justify-center cursor-pointer"
              >
                {months[viewDate.getMonth()]}{" "}
                <ArrowDropDownIcon className="text-gray-500" />
              </div>
              <div
                onClick={() => {
                  setShowYearSelect(!showYearSelect);
                  setShowMonthSelect(false);
                }}
                className="hover:text-primary flex items-center justify-center cursor-pointer"
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
                <ChevronRightIcon className="text-gray-500" />
              </div>
            )}
          </div>

          {showYearSelect ? (
            <div className="grid grid-cols-4 gap-3 overflow-y-auto h-[88%]">
              {years.map((year) => (
                <div
                  ref={(el) => (yearRefs.current[year] = el)}
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`text-center py-2 cursor-pointer rounded-full ${
                    year === viewDate.getFullYear()
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {year}
                </div>
              ))}
            </div>
          ) : showMonthSelect ? (
            <div className="grid grid-cols-3 gap-3">
              {months.map((month, index) => (
                <div
                  key={index}
                  onClick={() => handleMonthClick(index)}
                  className={`text-center py-2 cursor-pointer rounded-full ${
                    index === viewDate.getMonth()
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {month}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2 font-medium">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
                {calendarDays.map((item, idx) => {
                  const isSelected =
                    selectedDate &&
                    item.date.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={idx}
                      className={`py-2 cursor-pointer rounded-full ${
                        isSelected
                          ? "bg-primary text-white"
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

              <div className="flex justify-between mt-2">
                <div
                  onClick={handleToday}
                  className="w-full mr-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-center cursor-pointer"
                >
                  Today
                </div>
                <div
                  onClick={handleClear}
                  className="w-full ml-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-center cursor-pointer"
                >
                  Clear
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
