import { useState, useEffect } from 'react';
import { Chevron } from '@/assets/icons/Chevron';

export const Pagination = ({ numOfPages, currentPage, setCurrentPage }: any) => {
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);

  useEffect(() => {
    if (!Number.isInteger(numOfPages) || numOfPages < 1) return;
  
    let tempNumberOfButtons: any = [];
    const dots = "...";
  
    if (numOfPages <= 3) {
      tempNumberOfButtons = Array.from({ length: numOfPages }, (_, i) => i + 1);
    } else if (currentPage === 1) {
      tempNumberOfButtons = [1, dots, numOfPages];
    } else if (currentPage === numOfPages) {
      tempNumberOfButtons = [1, dots, numOfPages];
    } else {
      tempNumberOfButtons = [1, dots, currentPage, dots, numOfPages];
    }
  
    setArrOfCurrButtons(tempNumberOfButtons);
  }, [currentPage, numOfPages]);  


  return (
    <div className="flex justify-end items-center py-6 px-2">
      <ul className="flex items-center space-x-2 list-none">
        <div className="dark:bg-dark-500 bg-gray-200 p-2 rounded-md">
          <li
            className={`dark:text-white text-secondary ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            <Chevron />
          </li>
        </div>
        {arrOfCurrButtons.map((data, index) => (
          <li
            key={index}
            className={`cursor-pointer text-sm px-2 py-1 rounded-md ${currentPage === data
                ? " bg-secondary dark:bg-dark-400 text-white"
                : ""
              } ${data === "..." ? "cursor-default" : ""}`}
            onClick={() => data !== "..." && setCurrentPage(data)}
          >
            {data}
          </li>
        ))}
        <div className="dark:bg-dark-500 bg-gray-200 p-2 rounded-md">
          <li
            className={`dark:text-white text-secondary ${currentPage === numOfPages
                ? "cursor-not-allowed"
                : "cursor-pointer"
              }`}
            onClick={() =>
              currentPage < numOfPages && setCurrentPage(currentPage + 1)
            }
          >
            <Chevron className="rotate-180 origin-center -webkit-transform" />
          </li>
        </div>
      </ul>
    </div>
  );
};
