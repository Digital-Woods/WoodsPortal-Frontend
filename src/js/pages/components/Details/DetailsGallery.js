const DetailsGallery = ({ images, setGalleryDialog }) => {
  return (
    <div className="p-3 dark:bg-dark-300 bg-cleanWhite rounded-md mt-5 dark:text-white">
      <div className="text-sm font-semibold pb-5">Images</div>
      <div class="grid grid-cols-3 gap-4">
        {images.slice(0, 3).map((url, index) =>
          index === 2 ? (
            <div
              key={index}
              className={`relative items-center overflow-hidden bg-[url('${url}')] bg-no-repeat bg-center bg-cover cursor-pointer`}
              onClick={() => setGalleryDialog(true)}
            >
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="relative flex flex-col justify-center items-center px-4 text-white z-10 h-full">
                View More
              </div>
            </div>
          ) : (
            <img
              key={index}
              src={url}
              alt={`Image ${index + 1}`}
              className="w-full h-auto"
            />
          )
        )}
      </div>
    </div>
  );
};
