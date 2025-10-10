import { useState, useEffect } from 'react';
import { EmptyDeal } from '@/assets/icons/EmptyDeal';
import { EmptyIcon } from '@/assets/icons/EmptyIcon';
import { EmptyThree } from '@/assets/icons/EmptyThree';

export const EmptyMessageCard = ({
  name = "item",
  type = "row",
  className = "p-6",
  imgWidth='150px',
}: any) => {
  const [RandomComponent, setRandomComponent] = useState(
    <EmptyDeal width={imgWidth} height={imgWidth} key="deal" />
  );

  useEffect(() => {
    const components = [
      <EmptyDeal width={imgWidth} height={imgWidth} className={`dark:text-white`} key="deal" />,
      <EmptyIcon width={imgWidth} height={imgWidth} className={`dark:text-white`} key="icon" />,
      <EmptyThree width={imgWidth} height={imgWidth} className={`dark:text-white`} key="three" />,
    ];
    setRandomComponent(
      components[Math.floor(Math.random() * components.length)]
    );
  }, []);

  return (
    <div
      className={`w-fit max-w-[600px] mx-auto min-h-48 flex text-[#33475b] ${
        type === "row" ? "max-sm:flex-col" : "flex-col"
      } items-center justify-center text-center gap-2 dark:bg-dark-300 rounded-md ${className} `}
    >
      {/* Illustration */}
      <div style={{ width: imgWidth, height: imgWidth }} className={`flex items-center justify-center`}>
        {RandomComponent}
      </div>
      <div className="flex flex-col gap-2">
        {/* Title */}
        <div
          className={`md:text-xl ${
            type === "row" ? "text-start max-sm:text-center" : "text-center"
          } text-lg font-semibold dark:text-white capitalize`}
        >
          {name} not found
        </div>
        {/* Message */}
        <p
          className={`md:text-xs ${
            type === "row" ? "text-start max-sm:text-center" : "text-center"
          } text-xs dark:text-white font-thin`}
        >
          You haven’t created any {name.toLowerCase()} yet. Please create one to proceed. For help, check our documentation or contact support.
        </p>
          <ul
            className={`mt-3 text-xs dark:text-white font-thin ${
              type === "row"
                ? "list-disc  flex flex-col gap-1"
                : "list-disc "
            }`}
          >
            <span className="mb-1 text-start font-semibold block">Steps to Resolve:</span>
              <li className={type === "row" ? "text-start" : "text-start"}>
                <span className="inline-block font-semibold">Refresh Data:</span> Click the ‘Clear Cache’ button to update system data. This may fix issues with visibility of new records or associations.
              </li>
              <li className={type === "row" ? "text-start" : "text-start"}>
                <span className="inline-block font-semibold">Check Associations:</span> Ensure the necessary associations are correctly created for this operation.
              </li>
          </ul>
      </div>
    </div>
  );
};
