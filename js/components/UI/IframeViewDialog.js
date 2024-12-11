
const IframeViewDialog = ({
  open,
  onClose,
  iframeUrls = [],
  currentIframeIndex,
  handleNext,
  handlePrevious,
  isImageUrl,
}) => {
  return (
    <Dialog open={open}>
      <div className="relative bg-cleanWhite dark:bg-dark-200 dark:text-white rounded-md flex-col justify-start items-center inline-flex w-[90vw] lg:h-[90vh] h-[85vh]">
        <div className="flex justify-end w-[100%] absolute -top-3 -right-3">
          <div
            className="cursor-pointer text-primary dark:text-cleanWhite"
            onClick={onClose}
          >
            <CloseIcon />
          </div>
        </div>

        {/* Render image or iframe based on the URL extension */}
        {iframeUrls.length > 0 && isImageUrl(iframeUrls[0]) ? (
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 w-full h-auto pt-4 overflow-auto">
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
          <div className="pt-4 h-full w-full">
            <iframe
              id="frame"
              src={iframeUrls[currentIframeIndex]}
              width="100%"
              height="100%"
              title={`iframe-${currentIframeIndex}`}
            ></iframe>
          </div>
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
  );
};

