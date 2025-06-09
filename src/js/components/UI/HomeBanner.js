const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good morning";
  if (hours < 18) return "Good afternoon";
  return "Good evening";
};

const formatGreetingDate = (date = new Date()) => {
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Function to get ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Covers 4th to 20th
    const suffixes = ["st", "nd", "rd"];
    return suffixes[(day % 10) - 1] || "th";
  };

  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);

  return formattedDate?.replace(/\d+/, `${day}${ordinalSuffix}`);
};

function replacePlaceholders(description, filteredDetails) {
  return description?.replace(/\*\*(\w+)\*\*/g, (match, key) => {
    const foundItem = filteredDetails.find(([k]) => k === key);
    return foundItem ? foundItem[1].value : '--';
  });
}
const HomeBanner = ({ moduleBannerDetailsOption, userData }) => {

  const { me } = useMe();
  const loggedInDetails = useRecoilValue(userDetailsAtom);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (userData?.response) {
      setUserDetails(userData.response);
    }
  }, [userData]);

  const description = moduleBannerDetailsOption?.description;
  const header = moduleBannerDetailsOption?.title;
  // Filter and sort user details
  const filteredDetails = Object.entries(userDetails).filter(
    ([key, value]) => value?.label && !["hs_object_id"].includes(key)
  );
  const updatedDescription = replacePlaceholders(description, filteredDetails);
  const updatedHeader = replacePlaceholders(header, filteredDetails);

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
      <div className={` h-full w-full flex justify-center flex-col items-start md:p-4 p-3 z-2 relative`}>
        <div className="w-full">
          <div className={`${moduleBannerDetailsOption.show_title || moduleBannerDetailsOption?.show_date ? 'mb-6' : 'mb-0'  }`}>
            {moduleBannerDetailsOption.show_title && 
            <h2 className={`text-xl md:text-2xl font-bold text-[${moduleStylesOptions.homeTabStyles.headingColor || '#2a2a2a'}] dark:text-white mb-1`}>
              {moduleBannerDetailsOption && moduleBannerDetailsOption.title ? (
                updatedHeader
              ) : (
                <span>
                  {getGreeting()}, <span className="text-primary dark:text-white dark:opacity-70">{getFirstName() || ''} {getLastName() || ''}</span>
                </span>
              )}
            </h2>
            }
            {moduleBannerDetailsOption?.show_date &&
            <p className={`opacity-70 text-[${moduleStylesOptions.homeTabStyles.descriptionColor || '#2a2a2a'}] dark:text-white text-sm`}>It’s {formatGreetingDate()}</p>
            }
          </div>
          <p className={`text-[${moduleStylesOptions.homeTabStyles.descriptionColor || '#2a2a2a'}] dark:text-white text-sm`}>
            {ReactHtmlParser.default(
              DOMPurify.sanitize(updatedDescription)
            )}
          </p>
        </div>
      </div>
  );
};

