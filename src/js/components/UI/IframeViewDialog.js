
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
      <div className="relative bg-cleanWhite dark:bg-dark-200 dark:text-white rounded-md flex-col justify-between flex w-[90vw] lg:h-[90vh] h-[90vh]">
        {/* Render image or iframe based on the URL extension */}
        {iframeUrls.length > 0 && isImageUrl(iframeUrls[0]) ? (
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 w-full h-auto overflow-auto">
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
          <div className=" h-full w-full">
            <iframe
              id="frame"
              src={iframeUrls[currentIframeIndex]}
              width="100%"
              height="100%"
              title={`iframe-${currentIframeIndex}`}
            ></iframe>
          </div>
        )}
        <div className="flex items-center gap-3 pt-4 justify-between">
          <Button
            variant='outline'
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
          {iframeUrls.length > 1 &&
            !isImageUrl(iframeUrls[currentIframeIndex]) && (
              <div className="flex justify-end gap-3">
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
      </div>
    </Dialog>
  );
};

