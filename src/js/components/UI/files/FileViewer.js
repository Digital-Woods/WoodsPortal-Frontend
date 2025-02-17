const FileViewer = ({
    file,
}) => {
    const encodedFileUrl = encodeURIComponent(file?.data?.url);
    const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodedFileUrl}`;

    // const handleCopyLink = () => {
    //     navigator.clipboard
    //         .writeText(file.data.url)
    //         .then(() => {
    //             setCopyMessage("URL copied!");
    //             setTimeout(() => setCopyMessage(""), 2000);
    //         })
    //         .catch((err) => {
    //             console.error("Failed to copy: ", err);
    //         });
    // };

    // const handleDownload = () => {
    //     window.open(file.data.url, "_blank");
    // };
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 flex">
            {file?.data?.extension === "mp3" ||
                file?.data?.extension === "wav" ||
                file?.data?.extension === "aac" ||
                file?.data?.extension === "aiff" ||
                file?.data?.extension === "flac" ||
                file?.data?.extension === "ogg" ? (
                <audio controls className="w-full">
                    <source src={file?.data?.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            ) : file?.data?.extension === "mp4" ||
                file?.data?.extension === "mov" ||
                file?.data?.extension === "wmv" ||
                file?.data?.extension === "mkv" ||
                file?.data?.extension === "avi" ? (
                <video controls className="w-full h-[500px]">
                    <source src={file?.data?.url} type="video/mp4" />
                    Your browser does not support the video element.
                </video>
            ) : file?.data?.extension === "doc" ||
                file?.data?.extension === "docx" ||
                file?.data?.extension === "ppt" ||
                file?.data?.extension === "pptx" ||
                file?.data?.extension === "xls" ||
                file?.data?.extension === "xlsx"
                // ||
                // file?.data?.extension === "csv" ||
                // file?.data?.extension === "txt" 
                ? (
                    <iframe src={officeViewerUrl} className="h-[500px] w-[1600px]"></iframe>
                ) : file?.data?.extension === "jpg" ||
                    file?.data?.extension === "jpeg" ||
                    file?.data?.extension === "png" ||
                    file?.data?.extension === "gif" ||
                    file?.data?.extension === "webp" ||
                    file?.data?.extension === "bmp" ||
                    file?.data?.extension === "tiff" ||
                    file?.data?.extension === "pdf" ? (
                    <iframe src={file?.data?.url} className="h-[500px] w-[1600px]"></iframe>
                ) : (
                    <p className="text-red-500 font-semibold">Unsupported file type</p>
                )}

            <div className="w-1/2 p-4">
                <div className="text-blue-600 font-semibold text-lg mb-2">{file?.data?.name}</div>
                <div className="text-gray-600 text-sm mb-2">
                    <strong>Type:</strong> {file?.data?.type}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                    <strong>Size:</strong> {file?.data?.size}
                </div>
                <div className="text-gray-600 text-sm mb-4">
                    <strong>Extension:</strong> {file?.data?.extension}
                </div>
                <div className="flex space-x-2">
                    <button
                        // onClick={handleCopyLink()}
                        className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600">
                        Copy Link
                    </button>
                    <button
                        // onClick={handleDownload()}
                        className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600">
                        Download
                    </button>
                </div>
            </div>
        </div>
    );

}