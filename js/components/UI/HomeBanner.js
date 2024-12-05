const HomeBanner = ({ moduleBannerDetailsOption }) => {

  const { me } = useMe();
  const loggedInDetails = useRecoilValue(userDetailsAtom);

  let email = "no-email@example.com";
  let brandName = hubSpotUserDetails.hubspotPortals.portalSettings.brandName;

  if (loggedInDetails && loggedInDetails.email) {
    email = loggedInDetails.email;
  } else if (me && me.email) {
    email = me.email;
  }

  if (
    me &&
    me.hubspotPortals &&
    me.hubspotPortals.portalSettings &&
    me.hubspotPortals.portalSettings.brandName
  ) {
    brandName = me.hubspotPortals.portalSettings.brandName;
  }

  return (
    <div className={`bg-orange-100 mb-6 rounded-lg overflow-hidden shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)] bg-cover bg-[url('${moduleBannerDetailsOption.backgroundImage || ''}')] flex flex-col md:flex-row items-center md:items-start justify-between relative`}>
      {/* Text Content */}
      <div className={`bg-[${moduleStylesOptions.homeTabStyles.overlayer.color || '#2a2a2a'}]/${moduleStylesOptions.homeTabStyles.overlayer.opacity || '50'} w-full flex justify-center flex-col items-start md:min-h-[340px] p-6 md:p-10 `}>
        <div className="w-full">
          <h2
            className={`text-2xl md:text-3xl font-bold text-[${moduleStylesOptions.homeTabStyles.headingColor || '#2a2a2a'}] mb-2`}
          >
            {moduleBannerDetailsOption && moduleBannerDetailsOption.title
              ? moduleBannerDetailsOption.title
              : `Welcome ${getFirstName() || ''} ${getLastName() || ''}`}
          </h2>
          <p className={`text-[${moduleStylesOptions.homeTabStyles.descriptionColor || '#2a2a2a'}] mb-6`}>
            {moduleBannerDetailsOption.description}
          </p>
          <a href={moduleBannerDetailsOption.buttonUrl} target="_blank" className={`bg-[${moduleStylesOptions.homeTabStyles.buttonStyles.backgroundColor || '#14bba4'}] text-[${moduleStylesOptions.homeTabStyles.buttonStyles.textColor || '#ffffff'}] font-medium inline-block py-2 px-4 rounded hover:bg-[${moduleStylesOptions.homeTabStyles.buttonStyles.backgroundColor || '#14bba4'}]/90`}>
            {moduleBannerDetailsOption.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

