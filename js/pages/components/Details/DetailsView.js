const DetailsView = ({
  item,
  propertyName,
  showIframe,
  objectId,
  id,
  refetch,
}) => {
  const [iframeViewDialog, setIframeViewDialog] = useState(false);
  const [iframeUrls, setIframeUrls] = useState([]);
  const [currentIframeIndex, setCurrentIframeIndex] = useState(0);

  // Function to check if URL is an image
  const isImageUrl = (url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

    // Check if the URL ends with an image extension
    const hasImageExtension = imageExtensions.some((ext) =>
      url.toLowerCase().endsWith(ext)
    );

    // Check if the URL contains known patterns for image URLs
    const containsImagePattern =
      url.includes("images.unsplash.com") || url.includes("photo");

    // Return true if either condition is true
    return hasImageExtension || containsImagePattern;
  };

  const handleViewClick = (urls) => {
    const urlArray = urls.split(","); // Split the comma-separated URLs into an array
    setIframeUrls(urlArray);
    setCurrentIframeIndex(0); // Start with the first URL
    setIframeViewDialog(true);
  };

  const handleNext = () => {
    setCurrentIframeIndex((prevIndex) =>
      prevIndex < iframeUrls.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevious = () => {
    setCurrentIframeIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <div className="p-3 dark:bg-dark-300 bg-cleanWhite rounded-md mt-5 dark:text-white">
      <table className="dark:bg-[#2a2a2a]">
        {item.length > 0 &&
          item.map((value, index) =>
            value.key === propertyName && showIframe ? (
              <tr key={value.key}>
                <td className="py-2 pr-1 text-sm dark:text-white whitespace-nowrap align-top">
                  {value.label}:
                </td>
                <td className="py-2 pl-1 text-sm dark:text-white align-top">
                  {value.value ? (
                    <Button
                      className="bg-cleanWhite dark:bg-cleanWhite hover:bg-cleanWhite dark:text-primary"
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(value.value)}
                    >
                      View {value.label}
                    </Button>
                  ) : (
                    "--"
                  )}
                </td>
              </tr>
            ) : (
              <tr key={value.key}>
                <td className="py-2 pr-1 text-sm dark:text-white whitespace-nowrap align-top">
                  {value.label}:
                </td>
                <td className="py-2 pl-1 text-sm dark:text-white align-top break-all flex gap-2">
                  {value.isEditableField ? (
                    <DetailsViewUpdate
                      renderValue={renderCellContent(
                        value.value,
                        value,
                        null,
                        null,
                        null,
                        "details"
                      )}
                      value={value}
                      refetch={refetch}
                      id={id}
                      objectId={objectId}
                      item={item}
                    />
                  ) : (
                    renderCellContent(
                      value.value,
                      value,
                      null,
                      null,
                      null,
                      "details"
                    )
                  )}
                </td>
              </tr>
            )
          )}
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

      <Dialog open={iframeViewDialog}>
        <div className="bg-cleanWhite dark:bg-dark-100 dark:text-white rounded-md flex-col justify-start items-center inline-flex w-[90vw] h-[90vh]">
          <div className="flex justify-end w-[100%]">
            <div
              className="cursor-pointer text-primary dark:text-cleanWhite"
              onClick={() => setIframeViewDialog(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentcolor"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </div>
          </div>

          {/* Render image or iframe based on the URL extension */}
          {iframeUrls.length > 0 && isImageUrl(iframeUrls[0]) ? (
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 w-full h-full p-4 overflow-auto">
              {iframeUrls.map((url, index) => (
                <div key={index} className="flex justify-center items-start">
                  <img
                    src={url}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <iframe
              id="frame"
              src={iframeUrls[currentIframeIndex]}
              width="100%"
              height="100%"
            ></iframe>
          )}

          {iframeUrls.length > 1 &&
            !isImageUrl(iframeUrls[currentIframeIndex]) && (
              <div className="flex justify-between w-full p-4">
                <Button
                  className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:text-cleanWhite"
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentIframeIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:text-cleanWhite"
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentIframeIndex === iframeUrls.length - 1}
                >
                  Next
                </Button>
              </div>
            )}
        </div>
      </Dialog>
    </div>
  );
};
