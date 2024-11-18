const HomeBanner = ({moduleBannerDetailsOption}) => {
  return (
    <div className={`bg-orange-100 mb-6 rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)] bg-cover bg-[url('${moduleBannerDetailsOption.backgroundImage || ''}')]  p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start justify-between relative`}>
      {/* Text Content */}
      <div className="w-1/2">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
         {moduleBannerDetailsOption.title}
        </h2>
        <p className="text-gray-700 mb-6">
          {moduleBannerDetailsOption.description}
        </p>
        <a href={moduleBannerDetailsOption.buttonUrl} target="_blank" className="bg-teal-500 text-white font-medium py-2 px-4 rounded hover:bg-teal-600">
          {moduleBannerDetailsOption.buttonText}
        </a>
      </div>
    </div>
  );
};

