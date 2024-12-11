const Alert = ({ message, type, onClose, duration = 2000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 100 / (duration / 100), 0));
    }, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  const icon =
    type === "success" ? (
      <svg
        className="w-5 h-5 text-green-600"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.87669 5.83334L6.79903 9.07942C8.55721 10.1343 9.4363 10.6618 10.4021 10.6388C11.368 10.6158 12.221 10.0471 13.927 8.9098L18.1233 5.83334M8.33335 16.6667H11.6667C14.8094 16.6667 16.3807 16.6667 17.357 15.6904C18.3334 14.7141 18.3334 13.1427 18.3334 10C18.3334 6.85731 18.3334 5.28596 17.357 4.30965C16.3807 3.33334 14.8094 3.33334 11.6667 3.33334H8.33335C5.19066 3.33334 3.61931 3.33334 2.643 4.30965C1.66669 5.28596 1.66669 6.85731 1.66669 10C1.66669 13.1427 1.66669 14.7141 2.643 15.6904C3.61931 16.6667 5.19066 16.6667 8.33335 16.6667Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      <svg
        className="w-5 h-5 text-red-600"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11h2v5h-2zm0 6h2v2h-2z"
          fill="currentColor"
        />
      </svg>
    );

  // Map progress to a Tailwind class dynamically
  const getWidthClass = () => {
    if (progress > 90) return "w-full";
    if (progress > 80) return "w-4/5";
    if (progress > 70) return "w-3/4";
    if (progress > 60) return "w-3/5";
    if (progress > 50) return "w-1/2";
    if (progress > 40) return "w-2/5";
    if (progress > 30) return "w-1/3";
    if (progress > 20) return "w-1/4";
    if (progress > 10) return "w-1/5";
    return "w-0";
  };

  return (
    <div className="fixed z-[70] right-2 top-2 w-full max-w-md py-5 px-6 bg-cleanWhite text-gray-600 rounded-xl border border-gray-200 shadow-sm">
      <button
        type="button"
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-all duration-150"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 17L17 7M17 17L7 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="flex items-start space-x-3">
        {icon}
        <p className="text-base font-medium leading-relaxed">{message}</p>
      </div>
      <div className="w-full h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
        <div
          className={`h-full bg-blue-500 progress-bar ${getWidthClass()}`}
        ></div>
      </div>
    </div>
  );
};
