function useMe() {
  if (isLivePreview()) {
    return {
      me: hubSpotUserDetails,
      isLoading: false,
      error: null,
      isAuthorized: null,
      getMe: null,
    };
  }else if (env.DATA_SOURCE_SET === true) {
    return {
      me: hubSpotUserDetails,
      isLoading: false,
      error: null,
      isAuthorized: null,
      getMe: null,
    };
  } else {
    const { isAuthorized } = useAuth();
    let response = null;

    const { data, isLoading, error, refetch } = ReactQuery.useQuery({
      queryKey: ["me_data"],
      queryFn: Client.users.me,
      staleTime: 10000,
      // queryFn: async () => Client.users.me,
      // enabled: isAuthorized
    });

    const getMe = () => {
      refetch();
    };

    if (data) {
      response = data.data;
      const portalSettings = response.portalSettings;
      setCookie(
        env.AUTH_PORTAL_KEY,
        JSON.stringify(portalSettings),
        env.COOKIE_EXPIRE
      );
      setCookie(env.AUTH_USER_KEY, JSON.stringify(response), env.COOKIE_EXPIRE);
    }

    return {
      me: response,
      isLoading,
      error,
      isAuthorized,
      getMe,
    };
  }
}


function useLogout() {
  const setAuthorization = Recoil.useSetRecoilState(authorizationAtom);
  const [logoutDialog, setLogoutDialog] = Recoil.useRecoilState(logoutDialogState);

  const mutation = ReactQuery.useMutation({
    mutationFn: Client.authentication.Logout,
    onSuccess: () => {
      removeAllCookies();
      setAuthorization(null);
      window.location.hash = "/login";
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
