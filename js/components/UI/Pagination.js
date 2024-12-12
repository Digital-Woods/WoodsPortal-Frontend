const Pagination = ({ numOfPages, currentPage, setCurrentPage }) => {
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);

  useEffect(() => {
    let tempNumberOfButtons = [];
    const dots = "...";

    if (numOfPages <= 3) {
      // Show all pages if numOfPages is less than or equal to 3
      tempNumberOfButtons = Array.from({ length: numOfPages }, (_, i) => i + 1);
    } else if (currentPage === 1) {
      // If currentPage is the first page
      tempNumberOfButtons = [1, dots, numOfPages];
    } else if (currentPage === numOfPages) {
      // If currentPage is the last page
      tempNumberOfButtons = [1, dots, numOfPages];
    } else {
      // For pages in between
      tempNumberOfButtons = [1, dots, currentPage, dots, numOfPages];
    }

    setArrOfCurrButtons(tempNumberOfButtons);
  }, [currentPage, numOfPages]);

  return (
    <div className="flex justify-end items-center py-6 px-2">
      <ul className="flex items-center space-x-2">
        <div className="dark:bg-flatGray bg-gray-200 p-2 rounded-md">
          <li
            className={`dark:text-dark-200 ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            <Chevron />
          </li>
        </div>
        {arrOfCurrButtons.map((data, index) => (
          <li
            key={index}
            className={`cursor-pointer text-sm px-2 py-1 rounded-md text-sm ${currentPage === data
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
            className={`dark:text-dark-200 ${currentPage === numOfPages
                ? "cursor-not-allowed"
                : "cursor-pointer"
              }`}
            onClick={() =>
              currentPage < numOfPages && setCurrentPage(currentPage + 1)
            }
          >
            <Chevron transform="rotate(180)" />
          </li>
        </div>
      </ul>
    </div>
  );
};
