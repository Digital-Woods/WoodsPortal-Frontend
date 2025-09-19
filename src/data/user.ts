import { Client } from '@/data/client/index'
import { useQuery, useMutation } from "@tanstack/react-query";
import { hubId } from '@/data/hubSpotData'
import { setCookie } from "@/utils/cookie";
import { env } from "@/env";
import { useAuth } from "@/state/use-auth";

// export function useMe() {
//   // if (isLivePreview()) {
//   //   return {
//   //     me: hubSpotUserDetails,
//   //     isLoading: false,
//   //     error: null,
//   //     isAuthorized: null,
//   //     getMe: null,
//   //   };
//   // }else if (env.DATA_SOURCE_SET === true) {
//   //   return {
//   //     me: hubSpotUserDetails,
//   //     isLoading: false,
//   //     error: null,
//   //     isAuthorized: null,
//   //     getMe: null,
//   //   };
//   // } else {
//     const { isAuthorized } = useAuth();
//     let response = null;

//     const { data, isLoading, error, refetch } : any = useQuery({
//       queryKey: ["me_data"],
//       queryFn: () => Client.users.me(hubId),
//       staleTime: 10000,
//       // queryFn: async () => Client.users.me,
//       // enabled: isAuthorized
//     });

//     const getMe = () => {
//       refetch();
//     };

//     if (data) {
//       response = data.data;
//       const portalSettings = response.portalSettings;
//       setCookie(
//         env.VITE_AUTH_PORTAL_KEY,
//         JSON.stringify(portalSettings),
//       );
//       setCookie(env.VITE_AUTH_USER_KEY, JSON.stringify(response));
//     }

//     return {
//       me: response,
//       isLoading,
//       error,
//       isAuthorized,
//       getMe,
//     };
//   // }
// }

export function useMe() {
  const { profileDetails, setProfileDetails } = useAuth();
  const { isAuthorized } = useAuth();

  const {
    data,
    isLoading,
    error,
    refetch,
  }: any = useQuery({
    queryKey: ["me_data"],
    queryFn: () => Client.users.me(),
    staleTime: 10000,
    enabled: isAuthorized && !profileDetails, // 👈 only run if no profileDetails
  });

  let response = null;

  // If profileDetails exists, just use it
  if (profileDetails) {
    response = profileDetails;
  } else if (data) {
    // If no profileDetails but API returned data → update
    setProfileDetails(data);
    response = data.data;

    const portalSettings = response.portalSettings;
    setCookie(env.VITE_AUTH_PORTAL_KEY, JSON.stringify(portalSettings));
    setCookie(env.VITE_AUTH_USER_KEY, JSON.stringify(response));
  }

  const getMe = () => {
    refetch();
  };

  return {
    me: response,
    isLoading,
    error,
    isAuthorized,
    getMe,
  };
}


export function useLogout() {
  const { unauthorize, setLogoutDialog } = useAuth();

  const mutation = useMutation({
    mutationFn: Client.authentication.Logout,
    onSuccess: () => {
      window.location.hash = "/login";
      unauthorize();
      setLogoutDialog(false);
    },
    onError: (err) => {
      console.error("Logout failed: ", err);
    },
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

const useSetColors = () => {
  const { me } = useMe();
  const applyColors = () => {
    // Default colors
    const defaultPrimaryColor = primarycolor ;
    const defaultSecondaryColor = secondarycolor;

    // Initialize colors with default values
    let primaryColor = defaultPrimaryColor;
    let secondaryColor = defaultSecondaryColor;

    // Check if 'me' object and portal settings are available
    if (me && me.hubspotPortals && me.hubspotPortals.portalSettings) {
      const portalSettings = me.hubspotPortals.portalSettings;

      // Update colors if available in the portalSettings
      if (portalSettings.primaryColor) {
        primaryColor = portalSettings.primaryColor;
      }
      if (portalSettings.secondaryColor) {
        secondaryColor = portalSettings.secondaryColor;
      }
    }

    // Retrieve color parameters from URL using getParam
    const urlPrimaryColor = getParam("primaryColor") || primaryColor;
    const urlSecondaryColor = getParam("secondaryColor") || secondaryColor;

    // Apply the colors as CSS custom properties
    document.documentElement.style.setProperty(
      "--primary-color",
      urlPrimaryColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      urlSecondaryColor
    );
  };
  useEffect(() => {
    // Initial color setup

      applyColors();

      // Handle URL changes (e.g., when using browser navigation)
      const handlePopState = () => {
        applyColors();
      };

      window.addEventListener("popstate", handlePopState);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
  }, [me]); // Dependency array includes 'me' to rerun if 'me' changes
};

const isEmailVerified = () => {
  const loggedInDetails = useRecoilValue(userDetailsAtom);
  const { me } = useMe();

  if (loggedInDetails && !loggedInDetails.isEmailVerified) {
    return false;
  } else if (me && !me.isEmailVerified) {
    return false;
  }
  return true;
};
