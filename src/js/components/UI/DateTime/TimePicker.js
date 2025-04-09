const TimePicker = ({
  defaultValue,
  setOpenTimePicker,
  openTimePicker,
  handelChangeTime,
}) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openTimePicker);
  }, [openTimePicker]);

  useEffect(() => {
    const handleClickOutside = (e) => {
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

  return (
    <div className="relative" ref={ref}>
      {open && (
        <div className="absolute bottom-12 bg-white text-gray-800 rounded-lg shadow-lg w-50 z-50 h-[400px] transition-all duration-300 overflow-y-scroll text-center">
          <ul class="text-gray-900 ">
            {timeList.map((time) => (
              <li
                class="w-full px-4 py-2 cursor-pointer hover:bg-secondary"
                onClick={() => {
                  handelChangeTime(time)
                  setOpenTimePicker(false)
                }}
              >
                {time.time} {time.timeZone}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
