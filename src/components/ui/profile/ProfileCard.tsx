import { useMe } from "@/data/user";
import { hubSpotUserDetails } from "@/defaultData";
import { useAuth } from "@/state/use-auth";
import { getFirstName, getLastName, profileInitial } from "@/utils/DataMigration";

export const ProfileCard = () => {
  const { me } = useMe();
  const {profileDetails: loggedInDetails} = useAuth();

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

  const firstName = getFirstName() || "";
  const lastName = getLastName() || "";
  const initials = profileInitial(firstName, lastName);


  return (
    <div className="flex justify-between dark:bg-dark-300 p-5 bg-cleanWhite rounded-md mt-8">
      <div className="flex justify-between lg:gap-x-10 gap-4">
        <div className="rounded-full h-[80px] w-[80px] max-sm:w-[50px] max-sm:h-[50px] flex items-center justify-center bg-gray-400 text-white text-2xl font-medium">
          {initials}
        </div>

        <div className="flex flex-col justify-center space-y-1">
          <h1 className="text-2xl font-semibold dark:text-white">{`${getFirstName() || "N/A"
            } ${getLastName() || "N/A"}`}</h1>
          <p className="text-secondary dark:text-white font-medium text-sm">
            User, {brandName}
          </p>
          <p className="text-xs font-normal dark:text-white text-secondary">
            {email}
          </p>
        </div>
      </div>
    </div>
  );
};
