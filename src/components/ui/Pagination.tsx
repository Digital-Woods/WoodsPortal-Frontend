import { useState, useEffect } from 'react';
import { Chevron } from '@/assets/icons/Chevron';
import { useAuth } from '@/state/use-auth';
import { useUpdateLink } from '@/utils/GenerateUrl';

export const Pagination = ({ apiResponse = null, numOfPages, currentPage:cPage, setCurrentPage, isFile = false }: any) => {
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);
  const [isFreeSubscription, setIsFreeSubscription] = useState<any>(true);

  const {filterParams} = useUpdateLink();

  const [currentPage, setCurrentPages] = useState(filterParams()?.page || 1);
  const [isFristTimeLoadData, setIsFristTimeLoadData] = useState<any>(true);

  const { subscriptionType, setPagination, getPagination }: any = useAuth();

  useEffect(() => {
    if(!isFristTimeLoadData) setCurrentPages(cPage)
    setIsFristTimeLoadData(false)
  }, [cPage]);

  useEffect(() => {
    if(subscriptionType === 'FREE' && !isFile) {
      setIsFreeSubscription(true)
    } else {
      setIsFreeSubscription(false)
    }
  }, [subscriptionType]);

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

  const setBefore = async () => {
    let paginationArray = [...(getPagination || [])]; // clone safely
    paginationArray.pop(); // remove last element

    const before = paginationArray[paginationArray.length - 1]

    await setPagination(paginationArray)
    await setCurrentPage(before)
  }

  const setAfter = async () => {
    const after = apiResponse?.data?.after
    let paginationArray = [...(getPagination || [])]; // clone safely

    await paginationArray.push(after)
    await setPagination(paginationArray)
    await setCurrentPage(after)
  }

  const onClickPreviousButton = () => {
    isFreeSubscription
      ? setBefore()
      : currentPage > 1 && setCurrentPage(currentPage - 1)
  }

  const onClickNextButton = () => {
    isFreeSubscription
      ? setAfter()
      : currentPage < numOfPages && setCurrentPage(currentPage + 1)
  }

  return (
    <div className="flex justify-end items-center py-6 px-2">
      <ul className="flex items-center space-x-2 !list-none">
        <div className="dark:bg-dark-500 bg-gray-200 p-2 rounded-md">
          <li
            className={`dark:text-white text-secondary ${((isFreeSubscription && getPagination.length === 0) || (!isFreeSubscription && currentPage === 1)) ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            onClick={() =>
              ((isFreeSubscription && getPagination.length > 0) || ((!isFreeSubscription && currentPage > 1)))
                ? onClickPreviousButton()
                : null
            }
          >
            <Chevron />
          </li>
        </div>
        {!isFreeSubscription && arrOfCurrButtons.map((data, index) => (
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
            className={`dark:text-white text-secondary ${((isFreeSubscription && !apiResponse?.data?.hasMore) || (!isFreeSubscription && currentPage === numOfPages))
              ? "cursor-not-allowed"
              : "cursor-pointer"
              }`}
            onClick={() =>
              ((isFreeSubscription && apiResponse?.data?.hasMore) || (!isFreeSubscription && currentPage < numOfPages))
                ? onClickNextButton()
                : null
            }
          >
            <Chevron className="rotate-180 origin-center -webkit-transform" />
          </li>
        </div>
      </ul>
    </div>
  );
};
