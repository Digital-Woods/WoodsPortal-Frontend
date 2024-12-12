const DetailsView = ({
  item,
  propertyName,
  showIframe,
  objectId,
  id,
  refetch,
  permissions,
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
    const urlArray = urls.split(",").map((url) => url.trim()); // Split and trim the comma-separated URLs
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
    <div className="py-3 dark:bg-dark-300 bg-cleanWhite rounded-md mt-5 dark:text-white">
      <table className="w-full dark:bg-[#2a2a2a]">
        {item.length > 0 &&
          item.map((value, index) =>
            value.key === propertyName && showIframe ? (
              <tr key={value.key}>
                <td className="py-2 pr-1 text-sm dark:text-white whitespace-wrap lg:w-[250px] w-[150px] align-top">
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
                <td className="py-2 pr-1 text-sm dark:text-white  lg:w-[200px] w-[130px]  whitespace-wrap align-top">
                  {value.label}:
                </td>
                <td className="py-2 pl-1 text-sm dark:text-white break-all gap-2">
                  {value.isEditableField && (permissions && permissions.update) ? (
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

      {/* Iframe View Dialog Component */}
      <IframeViewDialog
        open={iframeViewDialog}
        onClose={() => setIframeViewDialog(false)}
        iframeUrls={iframeUrls}
        currentIframeIndex={currentIframeIndex}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        isImageUrl={isImageUrl}
      />

    </div>
  );
};
