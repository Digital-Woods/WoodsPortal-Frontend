const DetailsView = ({ item }) => {
  const [iframeViewDialog, setIframeViewDialog] = useState(false);
  return (
    <div className="p-3 dark:bg-dark-300 bg-cleanWhite rounded-md mt-5 dark:text-white">
      <table className=" dark:bg-[#2a2a2a] ">
        {item.length > 0 &&
          item.map((value, index) => (
            <tr key={value.key}>
              <td className="py-2 pr-1 text-sm dark:text-white  whitespace-nowrap align-top">{value.label}:</td>
              <td className="py-2 pl-1 text-sm dark:text-white   align-top">{renderCellContent(value.value, value, null, null, null, 'details')}</td>
            </tr>
          ))}
      </table>

      {/* {item.length > 0 &&
        item.map((value, index) => (
          <div
            key={value.key}
            className={`py-2 flex ${index === sortItems.length - 1 ? "" : ""}`}
          >
            <div className="text-sm font-semibold w-[200px]">
              {value.label}:
            </div>
            <div className="text-sm text-gray-500 ">
              {renderCellContent(value)}
            </div>
          </div>
        ))} */}

      {/* {item.iframe_url && (
        <div className={`py-2 flex`}>
          <div className="text-sm font-semibold w-[200px]">Document:</div>
          <div className="text-sm text-gray-500 ">
            <div className="flex justify-end">
              <Button
                className="bg-cleanWhite dark:bg-cleanWhite hover:bg-cleanWhite text-blue-important"
                variant="outline"
                size="lg"
                onClick={() => setIframeViewDialog(true)}
              >
                View
              </Button>
            </div>
          </div>
        </div>
      )} */}

        <div className={`py-2 flex`}>
          <div className="text-sm font-semibold w-[200px]">Document:</div>
          <div className="text-sm text-gray-500 ">
            <div className="flex justify-end">
              <Button
                className="bg-cleanWhite dark:bg-cleanWhite hover:bg-cleanWhite text-blue-important"
                variant="outline"
                size="lg"
                onClick={() => setIframeViewDialog(true)}
              >
                View
              </Button>
            </div>
          </div>
        </div>

      <Dialog open={iframeViewDialog}>
        <div className="bg-cleanWhite dark:bg-dark-100 dark:text-white rounded-md flex-col justify-start items-center inline-flex w-[90vw] h-[90vh]">
          <div className="flex justify-end w-[100%]">
            <div
              className="cursor-pointer"
              onClick={() => setIframeViewDialog(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </div>
          </div>
          <iframe
            id="frame"
            src="https://142289565.fs1.hubspotusercontent-eu1.net/hubfs/142289565/Data%20Types.pdf"
            width="100%"
            height="100%"
          ></iframe>
        </div>
      </Dialog>
    </div>
  );
};
