const Pagination = ({ numOfPages, currentPage, setCurrentPage }) => {
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);

  useEffect(() => {
    let tempNumberOfButtons = [];
    const dotsInitial = "...";
    const dotsLeft = "... ";
    const dotsRight = " ...";

    if (numOfPages < 6) {
      tempNumberOfButtons = Array.from({ length: numOfPages }, (_, i) => i + 1);
    } else if (currentPage >= 1 && currentPage <= 3) {
      tempNumberOfButtons = [1, 2, 3, 4, dotsInitial, numOfPages];
    } else if (currentPage === 4) {
      const sliced = Array.from({ length: 5 }, (_, i) => i + 1);
      tempNumberOfButtons = [...sliced, dotsInitial, numOfPages];
    } else if (currentPage > 4 && currentPage < numOfPages - 2) {
      const sliced1 = [currentPage - 2, currentPage - 1];
      const sliced2 = [currentPage];
      tempNumberOfButtons = [
        1,
        dotsLeft,
        ...sliced1,
        ...sliced2,
        dotsRight,
        numOfPages,
      ];
    } else if (currentPage > numOfPages - 3) {
      const sliced = Array.from({ length: 4 }, (_, i) => numOfPages - 3 + i);
      tempNumberOfButtons = [1, dotsLeft, ...sliced];
    }

    setArrOfCurrButtons(tempNumberOfButtons);
  }, [currentPage, numOfPages]);

  return (
    <div className="flex justify-end items-center py-6 px-2">
      <ul className="flex items-center space-x-2">
        <div className="dark:bg-flatGray bg-gray-200 p-2 rounded-md">
          <li
            className={` ${
              currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="#2F2F33"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
        </div>
        {arrOfCurrButtons.map((data, index) => (
          <li
            key={index}
            className={`cursor-pointer px-4 py-2 rounded-md text-sm ${
              currentPage === data
                ? " bg-primary dark:bg-dark-400 text-white"
                : ""
            } ${data === "..." ? "cursor-default" : ""}`}
            onClick={() => data !== "..." && setCurrentPage(data)}
          >
            {data}
          </li>
        ))}
        <div className="dark:bg-flatGray bg-gray-200 p-2 rounded-md">
          <li
            className={` ${
              currentPage === numOfPages
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() =>
              currentPage < numOfPages && setCurrentPage(currentPage + 1)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              transform="rotate(180)"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="#2F2F33"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
        </div>
      </ul>
    </div>
  );
};
