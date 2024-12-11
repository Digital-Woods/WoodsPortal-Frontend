const Logo = ({ className }) => {
  const { me } = useMe();
  const [logoSrc, setLogoSrc] = useState("");

  useEffect(() => {
    const updateLogo = () => {
      const logoParam = getParam("logo");

      if (logoParam && logoParam !== "null" && isValidUrl(logoParam)) {
        setLogoSrc(logoParam);
      } else if (
        me &&
        me.hubspotPortals &&
        me.hubspotPortals.portalSettings &&
        me.hubspotPortals.portalSettings.logo &&
        isValidUrl(hubSpotUserDetails.hubspotPortals.portalSettings.logo)
      ) {
        setLogoSrc(hubSpotUserDetails.hubspotPortals.portalSettings.logo);
      } else {
        setLogoSrc("");
      }
    };

    updateLogo();

    // Handle URL changes (e.g., when using browser navigation)
    const handlePopState = () => {
      updateLogo();
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [me]); // Dependency array includes 'me' to rerun if 'me' changes

  const logoToDisplay =
    logoSrc ||
    hubSpotUserDetails.hubspotPortals.portalSettings.logo;

  return (
    <img src={logoToDisplay} alt="Logo" className={`${className} h-auto w-auto`} />
  );
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
