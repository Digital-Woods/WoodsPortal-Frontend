import { Button } from "./Button";
import { Dialog } from "./Dialog";

export const IframeViewDialog = ({
  open,
  onClose,
  iframeUrls = [],
  currentIframeIndex,
  handleNext,
  handlePrevious,
  isImageUrl,
}: any) => {
  const getEmbedUrl = (url: any) => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      if (url.includes('vimeo.com')) {
        const regExp = /(?:vimeo\.com\/)(?:channels\/|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
        const match = url.match(regExp);
        const videoId = match ? match[1] : null;
        return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
      }
      if (url.includes('drive.google.com')) {
        if (url.includes('/file/d/')) {
          const fileId = url.split('/file/d/')[1].split('/')[0];
          return `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }
      return url;
    } catch (e) {
      console.error('Error converting to embed URL:', e);
      return url;
    }
  };

  return (
    <Dialog open={open}>
      <div className="relative bg-cleanWhite dark:bg-dark-200 dark:text-white rounded-md flex-col justify-between flex w-[90vw] full-height-fix" >
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
              src={iframeUrls.length > 0 && getEmbedUrl(iframeUrls[currentIframeIndex])}
              width="100%"
              height="100%"
              title={`iframe-${currentIframeIndex}`}
              allowFullScreen
              allow="autoplay; fullscreen"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation allow-presentation"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        )}
        <div className="flex items-center gap-3 pt-4 justify-between  bg-cleanWhite dark:bg-dark-200 sticky bottom-0 w-full">
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

