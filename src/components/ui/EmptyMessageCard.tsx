import { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import DOMPurify from 'dompurify';
import { EmptyDeal } from '@/assets/icons/EmptyDeal';
import { EmptyIcon } from '@/assets/icons/EmptyIcon';
import { EmptyThree } from '@/assets/icons/EmptyThree';

export const EmptyMessageCard = ({
  name = "item",
  type = "row",
  className = "p-6",
  bulletPoints = bulletPointData,
  imgWidth='150px',
}: any) => {
  const [RandomComponent, setRandomComponent] = useState(
    <EmptyDeal width={imgWidth} height={imgWidth} key="deal" />
  );

  useEffect(() => {
    const components = [
      <EmptyDeal className={`dark:text-white w-[${imgWidth}]`} key="deal" />,
      <EmptyIcon key="icon" className={`dark:text-white w-[${imgWidth}]`} />,
      <EmptyThree className={`dark:text-white w-[${imgWidth}]`} key="three" />,
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
      <div className={`md:min-w-[${imgWidth}] flex items-center justify-center`}>
        {RandomComponent}
      </div>
      <div className="flex flex-col gap-2">
        {/* Title */}
        <h2
          className={`md:text-xl ${
            type === "row" ? "text-start max-sm:text-center" : "text-center"
          } text-lg font-semibold dark:text-white capitalize`}
        >
          {name} not found
        </h2>
        {/* Message */}
        <p
          className={`md:text-xs ${
            type === "row" ? "text-start max-sm:text-center" : "text-center"
          } text-xs dark:text-white font-thin`}
        >
          You haven’t created any {name.toLowerCase()} yet. Please create one to proceed. For help, check our documentation or contact support.
        </p>
        {/* Bullet Points */}
        {bulletPoints.length > 0 && (
          <ul
            className={`mt-3 text-xs dark:text-white font-thin ${
              type === "row"
                ? "list-disc list-inside flex flex-col gap-1"
                : "list-disc list-inside"
            }`}
          >
            <span className="mb-1 text-start font-semibold block">Steps to Resolve:</span>
            {bulletPoints.map((point: any, index: any) => (
              <li
                key={index}
                className={type === "row" ? "text-start" : "text-start"}
              >
                {ReactHtmlParser.default(DOMPurify.sanitize(point))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
