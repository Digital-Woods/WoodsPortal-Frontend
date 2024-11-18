const { useRecoilValue } = Recoil;

const ProfileCard = () => {
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
    <div className="flex justify-between dark:bg-dark-300 p-5 bg-cleanWhite rounded-md mt-8">
      <div className="flex gap-x-10">
        <div className="w-[80px]">
          <img
            src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
            alt="Profile"
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col justify-center space-y-1">
          <h1 className="text-2xl font-semibold dark:text-white">{`${
            getFirstName() || "N/A"
          } ${getLastName() || "N/A"}`}</h1>
          <p className="text-primary dark:text-white font-medium text-sm">
            User, {brandName}
          </p>
          <p className="text-xs font-normal dark:text-white text-primary">
            {email}
          </p>
        </div>
      </div>
    </div>
  );
};
