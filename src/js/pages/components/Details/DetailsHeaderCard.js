const getDisplayData = (objectId, items) => {
  if (!Array.isArray(items) || items.length === 0) return {};

  const getUserCurrency = () => {
    return getUserDetails()?.companyCurrency || "USD";
  };

  const findValue = (key) => {
    const field = items.find((item) => item.key === key);
    if (!field || field.value === null || field.value === undefined) return "";
    
    if (key === "amount" && field.showCurrencySymbol) {
      return `${Currency(getUserCurrency())} ${field.value}`;
    }
    
    return typeof field.value === 'object' && field.value.label ? field.value.label : field.value;
  };

  switch (objectId) {
    case "0-1":
      return {
        primary: `${findValue("firstname")} ${findValue("lastname")}`.trim(),
        secondary: findValue("email") ? `${findValue("email")}` : null,
      };

    case "0-2":
      return {
        primary: findValue("name"),
        secondary:findValue("domain") ? findValue("domain") : null,
      };

    case "0-3":
      return {
        primary: findValue("dealname"),
        secondary: findValue("amount") ? `Amount: ${findValue("amount")}` : 'Amount: --',
        stage: `Stage: ${findValue("dealstage")}`,
      };

    case "0-5":
      return {
        primary: findValue("subject"),
        date: findValue("closedate") ? `Close date: ${formatDate(findValue("closedate"))}` : `Created date: ${formatDate(findValue("createdate"))}`,
        stage: `Status: ${findValue("hs_pipeline_stage")}`,
      };

    default:
      return { primary: findValue("name") };
  }
};

const DetailsHeaderCard = ({
  item,
  objectId,
}) => {
  const displayData = getDisplayData(objectId, item);

  return (
    <div
      className="relative min-h-36 rounded-lg w-full flex items-center justify-between overflow-hidden bg-custom-gradient"
    >
      <div className="relative flex flex-col justify-center p-4 text-detailsBannerTextColor z-10">
        <p className="text-2xl font-semibold mb-2">{displayData.primary}</p>
        {displayData.secondary && (
          <p className="text-xs font-normal text-detailsBannerTextColor line-clamp-2">
            {displayData.secondary}
          </p>
        )}
        {displayData.date && (
          <p className="text-xs text-detailsBannerTextColor mt-1">{displayData.date}</p>
        )}
        {displayData.stage && (
          <p className="text-xs text-detailsBannerTextColor mt-1">{displayData.stage}</p>
        )}
      </div>
    </div>
  );
};
