const LogoSmall = ({ className }) => {

    const logoToDisplay = hubSpotUserDetails.hubspotPortals.portalSettings.logo;
  
    return (
      <div>
        <img src={logoToDisplay} alt="Logo" className={`h-auto ${className}`} />
      </div>
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
  