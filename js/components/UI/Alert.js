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
      <SuccessMessage />
    ) : (
      <ErrorMessage/>
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
    <div className="fixed z-[70] right-2 top-2 w-auto max-w-md py-5 px-6 bg-cleanWhite dark:bg-dark-300 text-gray-600 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
      <button
        type="button"
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-all duration-150"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <CloseIcon />
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
