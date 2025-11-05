import { OpenIcon } from "@/assets/icons/OpenIcon";
import { getUserDetails } from "@/data/client/auth-utils";
import { Currency } from "@/utils/Currency";
import { formatAmount, formatDate } from "@/utils/DataMigration";

export const getDisplayData = (objectId: any, items: any) => {
  if (!Array.isArray(items) || items.length === 0) return {};

  const getUserCurrency = () => {
    return getUserDetails()?.companyCurrency || "USD";
  };

  const findValue = (key: any) => {
    const field = items.find((item) => item?.key === key);
    if (!field || field?.value === null || field?.value === undefined) return "";

    let currencyCode = getUserCurrency(); // Default currency

    if (key === "amount") {
      const currencyField = items.find((item) => item?.key === "deal_currency_code");
      if (currencyField && currencyField?.value) {
        currencyCode = typeof currencyField?.value === "object" ? currencyField?.value?.value : currencyField?.value;
      }

      if (field?.showCurrencySymbol) {
        return `${Currency(currencyCode)} ${formatAmount(field?.value)}`;
      }
    }

    return typeof field?.value === "object" && field?.value?.label ? field?.value?.label : field?.value;
  };

  // Determine primary value based on `isPrimaryDisplayProperty`
  const primaryItem = items.find((item: any) => item?.isPrimaryDisplayProperty);
  let primaryValue = primaryItem ? primaryItem?.value : null;

  switch (objectId) {
    case "0-1":
      return {
        primary: `${findValue("firstname")} ${findValue("lastname")}`.trim(),
        secondary: findValue("email") ? `${findValue("email")}` : null,
      };

    case "0-2":
      return {
        primary: primaryValue,
        domain: findValue("domain") || null,
      };

    case "0-3":
      return {
        primary: primaryValue,
        amount: findValue("amount") ? `Amount: ${findValue("amount")}` : "Amount: --",
        stage: `Stage: ${findValue("dealstage")}`,
      };

    case "0-5":
      return {
        primary: primaryValue,
        date: findValue("closedate") ? `Close date: ${formatDate(findValue("closedate"))}` : `Created date: ${findValue("createdate")?formatDate(findValue("createdate")): ' --'}`,
        stage: `Status: ${findValue("hs_pipeline_stage")}`,
      };

    default:
      return {
        primary: primaryValue || (items?.length > 0 ? items[0].value : ""),
      };
  }
};

export const DetailsHeaderCard = ({
  item,
  objectId,
}: any) => {
  const displayData = getDisplayData(objectId, item);

  return (
    <div
      className="relative min-h-36 rounded-lg w-full flex items-center justify-between overflow-hidden CUSTOM-bg-custom-gradient"
    >
      <div className="relative flex flex-col justify-center p-4 text-[var(--details-page-text-color)] z-10">
        <p className="text-2xl font-semibold mb-2">{displayData?.primary}</p>
        {displayData?.secondary && (
          <p className="text-xs font-normal text-[var(--details-page-text-color)] CUSTOM-line-clamp-2">
            {displayData?.secondary}
          </p>
        )}
        {displayData?.amount && (
          <p className="text-xs font-normal text-[var(--details-page-text-color)] CUSTOM-line-clamp-2">
            {displayData?.amount}
          </p>
        )}
        {displayData?.domain && (
          <p className="text-xs font-normal text-[var(--details-page-text-color)] CUSTOM-line-clamp-2">
            <a href={displayData?.domain ? `https://${displayData?.domain}` : ''} className="hover:underline flex items-center gap-1" target="_blank" rel="noreferrer">
              <span>
                {displayData?.domain}
              </span>
              <OpenIcon />
            </a>
          </p>
        )}
        {displayData?.date && (
          <p className="text-xs text-[var(--details-page-text-color)] mt-1">{displayData?.date}</p>
        )}
        {displayData?.stage && (
          <p className="text-xs text-[var(--details-page-text-color)] mt-1">{displayData?.stage}</p>
        )}
      </div>
    </div>
  );
};
