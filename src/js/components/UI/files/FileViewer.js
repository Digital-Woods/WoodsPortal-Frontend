const FileViewer = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
    file?.data?.url
  )}`;

  if (!file) return null;

  const fileExtension = file?.data?.extension;

  const handleLoad = () => setLoading(false);

  const LoadingIcon = () => (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div
        className="w-14 h-14 rounded-full animate-spin
              border-y-4 border-solid border-t-transparent 
              "
      ></div>
    </div>
  );

  if (
    fileExtension === "mp3" ||
    fileExtension === "wav" ||
    fileExtension === "aac" ||
    fileExtension === "aiff" ||
    fileExtension === "flac" ||
    fileExtension === "ogg"
  ) {
    return (
      <div className="w-full  flex justify-center align-center relative">
        {loading && <LoadingIcon />}
        <audio controls className="w-full relative" onLoadedData={handleLoad}>
          <source src={file?.data?.url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  if (
    fileExtension === "mp4" ||
    fileExtension === "mov" ||
    fileExtension === "wmv" ||
    fileExtension === "mkv" ||
    fileExtension === "avi"
  ) {
    return (
      <div className="w-full flex justify-center ">
        {loading && <LoadingIcon />}
        <video
          playsInline
          webkit-playsinline
          controls
          className="w-auto relative"
          onLoadedData={handleLoad}>
          <source src={file?.data?.url} type="video/mp4" />
          Your browser does not support the video element.
        </video>
      </div>
    );
  }

  if (
    fileExtension === "doc" ||
    fileExtension === "docx" ||
    fileExtension === "ppt" ||
    fileExtension === "pptx" ||
    fileExtension === "xls" ||
    fileExtension === "xlsx"
  ) {
    return (
      <>
        {loading && <LoadingIcon />}
        <iframe
          src={officeViewerUrl}
          className="w-full h-full"
          onLoad={handleLoad}
          allowFullScreen
          allow="autoplay; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </>
    );
  }

  if (
    fileExtension === "jpg" ||
    fileExtension === "jpeg" ||
    fileExtension === "png" ||
    fileExtension === "gif" ||
    fileExtension === "webp" ||
    fileExtension === "bmp" ||
    fileExtension === "tiff" ||
    fileExtension === "svg"
  ) {
    return (
      <div className="w-full flex relative justify-center ">
        {loading && <LoadingIcon />}
        <img
          src={file?.data?.url}
          alt={file?.data?.name}
          className="h-full w-auto object-contain"
          onLoad={handleLoad}
          allowFullScreen
          allow="autoplay; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (fileExtension === "pdf") {
    return (<>
      {loading && <LoadingIcon />}
      <iframe
        src={file?.data?.url}
        className="w-full"
        onLoad={handleLoad}
        allowFullScreen
      />
    </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-red-500 font-semibold space-y-4">
      <div className="flex items-center justify-center w-24 h-24  bg-red-100 rounded-full">
        <svg
          height="60px"
          width="60px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 38.762 38.762"
          xmlSpace="preserve"
          fill="currentColor"
          className="text-red-500"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path d="M32.724,0H6.038C5.174,0,4.472,0.703,4.472,1.565v35.633c-0.001,0.861,0.701,1.564,1.566,1.564 h17.268c0.545,0,1.152-0.26,1.587-0.641c0.097-0.075,0.196-0.168,0.294-0.297l8.472-11.228c0.365-0.483,0.632-1.272,0.632-1.88 V1.565C34.291,0.703,33.587,0,32.724,0z M30.563,28.1l-5.69,7.544v-9.359h7.062L30.563,28.1z M32.723,24.719h-7.851 c-0.865,0-1.566,0.702-1.566,1.565v10.912H6.038V1.565h26.685C32.722,1.565,32.722,24.719,32.723,24.719z"></path>
            </g>
          </g>
        </svg>
      </div>
      <p className="text-lg">Unsupported file type</p>
    </div>
  );
};
