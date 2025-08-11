
import { useState, useEffect } from 'react';
import { CloseIcon } from '@/assets/icons/closeIcon';
import { SuccessMessage } from '@/assets/icons/SuccessMessage';
import { ErrorMessage } from '@/assets/icons/ErrorMessage';

export const Toaster = ({ duration = 2000 }) => {
  const [progress, setProgress] = useState(100);
  const { toaster, setToaster } = useToaster();

  const onClose = () => {
    setToaster(null);
  };

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
    toaster?.type === "success" ? <SuccessMessage /> : <ErrorMessage />;

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
    toaster && (
      <div className="fixed z-[110] top-2 left-1/2 transform -translate-x-1/2 min-w-[300px] md:max-w-md py-5 px-6 bg-cleanWhite dark:bg-dark-300 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md backdrop-filter text-black dark:text-white rounded-md border border-secondary dark:border-gray-600 shadow-sm">
        <button
          type="button"
          className="absolute top-2 right-2 text-dark-200 dark:text-white hover:text-gray-600 transition-all duration-150"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <CloseIcon />
        </button>
        <div className="flex items-start space-x-3">
          <div className="min-w-[40px]">{icon}</div>
          <p className="text-sm font-semibold leading-relaxed">
            {toaster.message}
          </p>
        </div>
        <div className="w-full h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-full bg-blue-500 progress-bar ${getWidthClass()}`}
          ></div>
        </div>
      </div>
    )
  );
};
