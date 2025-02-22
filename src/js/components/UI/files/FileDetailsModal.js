const FileDetailsModal = ({ file, onClose }) => {
  const [expandDialog, setExpandDialog] = useState(true);
  const toggleExpandDialog = () => {
    setExpandDialog(!expandDialog);
  };
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(file.data.url)
      .then(() => {
        setCopyMessage("URL copied!");
        setTimeout(() => setCopyMessage(""), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const [copyMessage, setCopyMessage] = useState("");
  const handleDownload = () => {
    window.open(file.data.url, "_blank");
  };

  return (
    <Dialog
      open={file !== null}
      onClose={onClose}
      className={`!p-0 relative mx-auto bg-white overflow-y-auto transition-all  duration-500 ease-in-out ${
        expandDialog
          ? "lg:w-[95vw] md:w-[95vw] w-[calc(100vw-20px)] max-h-[85vh] h-[85vh]"
          : "lg:w-[780px]  md:w-[680px] w-[calc(100vw-28px)] h-auto"
      }`}
    >
      <div className="flex justify-between items-center bg-[#516f90] dark:bg-dark-300 dark:bg-dark-200 p-4">
        <h2 className="text-white font-medium text-lg">{file?.data.name}</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={toggleExpandDialog}
            className="text-white font-bold text-lg flex items-center"
          >
            {expandDialog ? (
              <ShrinkIcon width="22px" height="22px" />
            ) : (
              <ExpandIcon width="22px" height="22px" />
            )}
          </button>
          <button onClick={onClose} className="text-xl font-bold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className="fill-white"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        </div>
      </div>
      {file ? (
        <div
          className={`rounded-lg ${
            expandDialog ? "p-4" : "p-0"
          } flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6`}
        >
          {/* Left Section: File Preview */}
          <div
            className={`w-full ${
              expandDialog ? "md:w-4/5  md:h-[74vh]" : "md:w-1/2"
            }   p-4 flex justify-center`}
          >
            <FileViewer file={file} />
          </div>

          {/* Right Section: File Details */}
          <div
            className={`w-full ${expandDialog ? "md:w-1/5" : "md:w-1/2"}   p-4`}
          >
            <div className="dark:text-white text-secondary font-semibold text-lg mb-2">
              {file?.data?.name}
            </div>
            <div className="text-gray-600 text-sm mb-2">
              <strong>Type:</strong> {file?.data?.type}
            </div>
            <div className="text-gray-600 text-sm mb-2">
              <strong>Size:</strong> {file?.data?.size}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              <strong>Extension:</strong> {file?.data?.extension}
            </div>
            {/* btn group  */}
            <div className="flex space-x-2">
              <Button
                onClick={handleCopyLink}
                className="flex items-center"
                size="sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  className="fill-white mr-2"
                >
                  <path d="M362.31-260q-27.01 0-45.66-18.65Q298-297.3 298-324.31v-455.38q0-27.01 18.65-45.66Q335.3-844 362.31-844h359.38q27.01 0 45.66 18.65Q786-806.7 786-779.69v455.38q0 27.01-18.65 45.66Q748.7-260 721.69-260H362.31Zm0-52h359.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H362.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85Zm-124 176q-27.01 0-45.66-18.65Q174-173.3 174-200.31v-507.38h52v507.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h411.38v52H238.31ZM350-312v-480 480Z" />
                </svg>
                {copyMessage ? "Copied!" : "Copy Link"}
              </Button>
              <Button
                onClick={handleDownload}
                className="flex items-center"
                size="sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  className="fill-white mr-2"
                >
                  <path d="M240-212q-71.92 0-121.96-51.12Q68-314.23 68-386.15q0-74.39 52-126.54 52-52.16 123.92-45.62 16.54-78.15 80.31-131.8Q388-743.77 454-743.77q21.24 0 36.62 13.73Q506-716.31 506-693.77v270.62l66.23-67L609.38-453 480-323.62 350.62-453l37.15-37.15 66.23 67v-270.62q-70.61 11.62-118.31 65.96Q288-573.46 283-504h-43q-49.71 0-84.86 35.2-35.14 35.2-35.14 85t35.14 84.8q35.15 35 84.86 35h504q40.32 0 68.16-27.77 27.84-27.78 27.84-68Q840-400 812.16-428q-27.84-28-68.16-28h-72v-72q0-35.77-17-68.77-17-33-49-59.23v-60.31q54.15 28.08 86.08 78.61Q724-587.17 724-528v20h12.31q64.23-3.08 109.96 40.35Q892-424.23 892-361q0 62.92-43.54 105.96Q804.92-212 744-212H240Zm240-297.38Z" />
                </svg>
                Download
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
};
