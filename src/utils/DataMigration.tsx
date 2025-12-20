import { useMe } from '@/data/user';
import { useAuth } from '@/state/use-auth';
import { Link } from '@/components/ui/link';
import { OpenIcon } from '@/assets/icons/OpenIcon';
import { env } from "@/env";
import { setCookie } from './cookie';
import { Currency } from './Currency';
import { getUserDetails } from '@/data/client/auth-utils';
import { formatTimestampIST } from './DateTime';
import { useMakeLink } from './GenerateUrl';

export function profileInitial(firstName: any, lastName: any) {
  const initials =
    firstName && lastName
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      : firstName
        ? firstName.charAt(0).toUpperCase()
        : lastName
          ? lastName.charAt(0).toUpperCase()
          : "U";
  return initials;
}

export function isDate(dateString: any) {
  // Regular expression to match the expected date format
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!regex.test(dateString)) {
    return false;
  }

  // Parse the date string and check if it's valid
  const date = new Date(dateString);
  const isValid = !isNaN(date.getTime());
  return isValid;
}

export const formatDateString = (date: any) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-GB", options);
};

export const formatDate = (data: any, type = "date") => {
  // Handle invalid or falsy date inputs
  if (!data || isNaN(new Date(data).getTime())) {
    return ""; // Return an empty string for invalid dates
  }

  const date = new Date(data);
  const formatted = formatDateString(date);
  const [datePart, timePart] = formatted.split(", ");
  const [day, month, year] = datePart.split("/");

  if (type === "date") {
    return `${day}-${month}-${year}`;
  } else if (type === "input") {
    return `${year}-${month}-${day}`;
  }
  return `${day}-${month}-${year} ${timePart.toLowerCase()}`;
};

export function isNull(data: any) {
  return !!(data === undefined || data === null || data === "");
}

export function isObject(data: any) {
  if (data == null) return false;
  return typeof data === "object";
}
export function isArray(data: any) {
  if (!Array.isArray(data)) return false;
  return data.every(item => typeof item === "object" && item !== null);
}

export function isEmptyObject(data: any) {
  return Object.keys(data).length === 0;
}

export const truncateString = (str: any, MAX_LENGTH = 40) => {
  if (str.length > MAX_LENGTH) {
    return {
      truncated: str.substring(0, MAX_LENGTH) + "...",
      isTruncated: true,
    };
  }
  return { truncated: str, isTruncated: false };
};

export function isImage(value: any, key = "") {
  const imageExtensions = /\.(png|jpeg|jpg|gif|bmp|svg|webp|tiff|ico)$/i;
  return imageExtensions.test(value) || key.includes("image");
}

export const keysToSkipList = (key: any) => {
  return !!(
    key.includes("id") ||
    key.includes("archived") ||
    key.includes("associations") ||
    key.includes("createdAt") ||
    key.includes("updatedAt") ||
    key.includes("hs") ||
    key.includes("files") ||
    key.includes("iframe")
  );
};

export const keysToSkipDetails = (key: any) => {
  return !!(
    key.includes("id") ||
    key.includes("archived") ||
    key.includes("associations") ||
    key.includes("createdAt") ||
    key.includes("updatedAt") ||
    key.includes("files") ||
    key.includes("image") ||
    key.includes("iframe")
  );
};

export const keysToSkipAssociations = (key: any) => {
  return !!(
    key.includes("id") ||
    key.includes("archived") ||
    key.includes("associations") ||
    key.includes("createdAt") ||
    key.includes("updatedAt") ||
    key.includes("hs") ||
    key.includes("files") ||
    key.includes("image")
  );
};

export const checkEquipments = (value: any, title: any) => {
  if (title == "Equipments" || title == "Equipment" || title == "/assets")
    return (value && typeof value === "string") ? value.replace("Asset", "Equipment") : "";
  return value;
};

export const checkEquipmentsName = (value: any, title: any) => {
  if (title == "Equipment")
    if (value == "Asset Name")
      return (value && typeof value === "string") ? value.replace("Asset Name", "Equipment Name") : "";
  if (value == "Asset Type")
    return (value && typeof value === "string") ? value.replace("Asset Type", "Equipment Type") : "";
  return value;
};

export const filterAssociationsData = (obj: any) => {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]: any) =>
        value?.isPrimaryDisplayProperty === true ||
        value?.isSecondaryDisplayProperty === true
    )
  );
  return filtered;
};

export const objectToQueryParams = (params: any) => {
  if (!params || typeof params !== "object") {
    return ""; // Return an empty string if params is null, undefined, or not an object
  }

  return Object.entries(params)
    .map(([key, value]: any) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

// const sortData = (list, type = "list", removeKeys = 'hs_object_id') => {
//   if (type == "list" || type == "details") delete list.associations;
//   let data =
//     type != "list"
//       ? Object.keys(list).map((key) => ({ ...list[key], key: key }))
//       : list;

//   data = data.filter(
//     (item) => item.key !== "hs_object_id" && item.key !== "associations"
//   );

//   // Sorting function
//   data.sort((a, b) => {
//     // 1. Key "hs_object_id" comes first
//     if (a.key === "hs_object_id") return -1;
//     if (b.key === "hs_object_id") return 1;

//     // 2. "isPrimaryDisplayProperty: true" comes next
//     if (a.isPrimaryDisplayProperty && !b.isPrimaryDisplayProperty) return -1;
//     if (!a.isPrimaryDisplayProperty && b.isPrimaryDisplayProperty) return 1;

//     // 3. "isSecondaryDisplayProperty: true" comes next
//     if (a.isSecondaryDisplayProperty && !b.isSecondaryDisplayProperty)
//       return -1;
//     if (!a.isSecondaryDisplayProperty && b.isSecondaryDisplayProperty) return 1;

//     // 4. Items where both "isPrimaryDisplayProperty" and "isSecondaryDisplayProperty" are false,
//     // excluding "hs_object_id", "hs_createdate", and "hs_lastmodifieddate"
//     const excludeKeys = [
//       "hs_object_id",
//       "hs_createdate",
//       "hs_lastmodifieddate",
//     ];
//     const aCondition =
//       !a.isPrimaryDisplayProperty &&
//       !a.isSecondaryDisplayProperty &&
//       !excludeKeys.includes(a.key);
//     const bCondition =
//       !b.isPrimaryDisplayProperty &&
//       !b.isSecondaryDisplayProperty &&
//       !excludeKeys.includes(b.key);

//     if (aCondition && !bCondition) return -1;
//     if (!aCondition && bCondition) return 1;

//     // 5. "key: hs_createdate" should come next
//     if (a.key === "hs_createdate") return -1;
//     if (b.key === "hs_createdate") return 1;

//     // 6. "key: hs_lastmodifieddate" should come last
//     if (a.key === "hs_lastmodifieddate") return -1;
//     if (b.key === "hs_lastmodifieddate") return 1;

//     // Maintain original order if no conditions matched
//     return 0;
//   });

//   return data;
// };


export const sortData = (list: any, type = "list") => {
  if (type == "list" || type == "details") delete list?.associations;
  const excludeKeys = ["hs_object_id", "hs_createdate", "hs_lastmodifieddate", "associations"];
  let data = list

  if (type === "list") {
    data = data.filter((item: any) => !excludeKeys.includes(item.key));
    return data.sort((a: any, b: any) => a?.tableDisplayOrder - b?.tableDisplayOrder);
  }

  data = Object.entries(list)
    .filter(([key]: any) => !excludeKeys.includes(key))
    .map(([key, value]: any) => ({
      ...value,
      key
    }));

  return data.sort((a: any, b: any) => a?.overviewDisplayOrder - b?.overviewDisplayOrder);
}

export const replaceQuestionMarkToRegex = (text: any) => {
  const replacedText = (text && typeof text === "string") ? text?.replace(/\?/g, "!") : text;
  return replacedText;
}

export const replaceRegexToQuestionMark = (text: any) => {
  const replacedText = (text && typeof text === "string") ? text?.replace(/\?/g, "!") : text;
  return replacedText;
}

export const truncatedText = (text: any, maxLength = 30) => {
  if (text) {
    const truncatedText =
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    return <span>{truncatedText}</span>;
  }
  return <span>{text}</span>;
};

export function decodeAndStripHtml(html: any) {
  // Create a temporary element to decode HTML entities
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html; // Decodes &lt; and &gt; into < and >

  // Use DOMParser to strip out HTML tags
  const parser = new DOMParser();
  const doc = parser.parseFromString(tempElement.textContent, "text/html");

  return doc.body.textContent.trim(); // Return only plain text
}

export function sanitizeForBase64(str = "") {
  const strConvert = str != null ? String(str) : "";
  return strConvert.replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u00A0\u00AD]/g, ' ')
    .replace(/[\u202A-\u202E]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[\/+*=%#]/g, '%23')
    .replace(/[^a-zA-Z0-9\s\-@#&!$%^()_.,':;]/g, '')
    .trim();
  // return btoa(unescape(encodeURIComponent(sanitized))); // if needed
}

// function formatValue(value: any) {
//   value = "2025-12-18T19:00:00Z"
//   value = 1766525400000
//   const rawValue = isObject(value) ? value?.label : value;

//   const isDateLike = typeof rawValue === "string" 

//   if (!isDateLike) {
//     const formatedDateTime = formatTimestampIST(rawValue);
//     // return truncatedText(
//     //   decodeAndStripHtml(`${formatedDateTime.date} ${formatedDateTime.time}`),
//     //   20
//     // );
//     return decodeAndStripHtml(`${formatedDateTime.date} ${formatedDateTime.time}`)
//   }

//   return isObject(value) ? value?.label : value;
// }

function formatValue(value: any) {
  const rawValue = isObject(value) ? value?.label : value;

  let timestamp: number | null = null;

  // Case 1: timestamp number
  if (typeof rawValue === "number" && rawValue > 100000000000) {
    timestamp = rawValue;
  }

  // Case 2: numeric timestamp string
  else if (
    typeof rawValue === "string" &&
    /^\d+$/.test(rawValue) &&
    rawValue.length >= 10
  ) {
    timestamp = Number(rawValue);
  }

  // Case 3: ISO / date string
  else if (typeof rawValue === "string") {
    const date = new Date(rawValue);
    if (!isNaN(date.getTime())) {
      timestamp = date.getTime();
    }
  }

  // If valid timestamp → format
  if (timestamp) {
    const formatedDateTime = formatTimestampIST(timestamp);
    // return truncatedText(
    //   decodeAndStripHtml(`${formatedDateTime.date} ${formatedDateTime.time}`),
    //   20
    // );
    return decodeAndStripHtml(`${formatedDateTime.date} ${formatedDateTime.time}`)
  }

  // Fallback
  return rawValue;
}


export const renderCellContent = ({
  makeLink = null,
  companyAsMediator = false,
  tableParam = null,
  defPermissions = null,
  value,
  column,
  itemId = null,
  path = null,
  associationLabel = '',
  hubspotObjectTypeId,
  type = "list",
  associationPath = "",
  detailsView = true,
  hoverRow,
  item,
  urlParam = null
}: any) => {
  if (column.hidden) return null;
  if (
  (type === "details" || type === "associations" || type === 'list' || type === 'homeList') &&
  (column?.fieldType === "booleancheckbox")
  ) {
    return (
      <div className="flex gap-1 relative  justify-between">
        {value === true || value === 'true' ? 'Yes' : 'No'}
      </div>
    )
  }

  if (!column || value === undefined || value === null || value === '') { // if value is undefined empty string then add empty
    return "--";
  }

  // Start - Set associations url in cookie
  const changeRoute = () => {
    if (type == "associations") {
      const newPath = path.replace(/^\/+/, "");
      setItemAsync(env.VITE_ASSOCIATION_VIEW_URL_KEY, JSON.stringify({
        name: newPath,
        path:  associationPath,
        routeName: `/association/${newPath}`
      })
      );
    }
  }

  const setItemAsync = (key: any, value: any, days: any = env.VITE_COOKIE_EXPIRE) => {
    return new Promise((resolve) => {
      setCookie(key, value);
      resolve();
    });
  };
  // End - Set associations url in cookie

  if ( // if date then conver into date format
    column &&
    value != null &&
    (column?.type == "datetime" ||
      column?.key == "hs_createdate" ||
      column?.key == "hs_lastmodifieddate" ||
      column?.key == "createdate"
    )
  ) {
    // const formatedDateTime = formatTimestampIST(isObject(value) ? value.label : value)
    // return truncatedText(decodeAndStripHtml(`${formatedDateTime.date} ${formatedDateTime.time}` || ""), 20)
    return formatValue(value)
  }

  if ( // if date then conver into date format
    column &&
    value != null &&
    (column?.type == "date" ||
      column?.key == "hs_createdate" ||
      column?.key == "hs_lastmodifieddate" ||
      column?.key == "createdate"
    )
  ) {
    return formatDate(isObject(value) ? value.label : value);
  }

  if (
    column &&
    value != null &&
    (column?.key === 'domain')
  ) {
    return (
      <a href={`https://${value}`} className="hover:underline flex items-center gap-1" target="_blank" rel="noreferrer">
        <span>
          {value}
        </span>
        <OpenIcon />
      </a>
    )
  }

  if (
    column &&
    (type == "details" ||
      type == "company" ||
      type == "homeList") &&
    value !== null &&
    typeof value === 'string' &&
    value.startsWith('https://')
  ) {
    const urls = value
      .split(',')
      .map(url => url.trim())
      .filter(url => url.startsWith('https://'));

    if (urls.length > 0) {
      return (
        <div className={`flex flex-wrap gap-1`}>
          {urls.map((url, idx) => (
            <a
              key={idx}
              href={url}
              className="hover:underline flex items-center flex-wrap gap-1"
              target="_blank"
              rel="noreferrer"
            >
              <span className="break-all inline-block">{url}</span>
              <OpenIcon />
            </a>
          ))}
        </div>
      );
    }
  }


  // if (
  //   column.key === "amount" && column.showCurrencySymbol
  // ) {
  //   let find_currency_code;
  //   if (type == 'details') {
  //     find_currency_code = item.find(item => item.key === "deal_currency_code");
  //   } else {
  //     find_currency_code = item.deal_currency_code;
  //   }
  //   const currency = isObject(find_currency_code.value) ? find_currency_code.value.value : find_currency_code.value
  //   return `${Currency(currency)} ${formatAmount(value)}`;
  // }
  if (
    column?.key === "amount" && column?.showCurrencySymbol
  ) {
    let find_currency_code;

    if (type == 'details') {
      find_currency_code = Array.isArray(item) ? item.find(i => i?.key === "deal_currency_code") : null;
    } else {
      find_currency_code = item && item?.deal_currency_code ? item?.deal_currency_code : null;
    }

    if (find_currency_code && find_currency_code?.value) {
      const currency = isObject(find_currency_code?.value) ? find_currency_code?.value.value : find_currency_code?.value;
      return `${Currency(currency)} ${formatAmount(value)}`;
    }
  }

  if (column?.showCurrencySymbol) { // if value is a currency symbol
    const myCurrency = getUserDetails()?.companyCurrency
    return `${Currency(myCurrency)} ${formatAmount(value)}`;
  }

  if ( // if primary display property then add open button
    !value &&
    (type == "associations" || type == "list" || type === 'homeList') &&
    column &&
    column?.isPrimaryDisplayProperty &&
    detailsView
  ) {
    return (
      <div className="flex gap-1 relative items-center">
        <Link
          className="dark:text-white  text-secondary hover:underline underline-offset-4 font-semibold border-input rounded-md"
          // to={`/${sanitizeForBase64(path)}/${hubspotObjectTypeId}/${itemId}?isPrimaryCompany=${companyAsMediator || false}`}
          to={makeLink({name: isObject(value) ? value.label : value, objectTypeId:hubspotObjectTypeId, recordId:itemId, associationLabel: associationLabel})}

        >
          --
        </Link>
        <Link
          className={` text-secondary  dark:text-white`}
          // to={`/${sanitizeForBase64(path)}/${hubspotObjectTypeId}/${itemId}?isPrimaryCompany=${companyAsMediator || false}`}
          to={makeLink({name: isObject(value) ? value.label : value, objectTypeId:hubspotObjectTypeId, recordId:itemId, associationLabel: associationLabel})}
        >
          <OpenIcon />
        </Link>
      </div>
    );
  }

  if ((type === "list" || type === "associations" || type === 'homeList') && column?.fieldType === "html") {
    return (
      <div className="flex gap-1 relative justify-between">
        {truncatedText(decodeAndStripHtml(value || ""), 23)}
      </div>
    );
  }

  if (type === "details" && column?.fieldType === "html") {
    return (
      <div className="flex gap-1 relative justify-between">
        {decodeAndStripHtml(value || "")}
      </div>
    );
  }

  if (type === "details" && column?.key === "hubspot_owner_id" && value) {
    return (
      <div className="flex gap-1 relative justify-between">
        {value?.firstname} {value?.lastname}
      </div>
    );
  }

  if (
    (type === "details" || type === "associations" || type === 'list' || type === 'homeList') &&
    (column?.fieldType === "checkbox")
  ) {
    if (Array.isArray(value) && value.length > 0) {
      const labels = value.map((item) => item?.label).join(", ");
      return labels;
    }
    return "--";
  }

  if (type == "details") {
    return (
      <div className="flex gap-1 relative  justify-between">
        {isObject(value) ? value?.label : value}
      </div>
    );
  }

  if (
    (type == "associations" || type == "list") &&
    column &&
    column?.isPrimaryDisplayProperty &&
    associationPath &&
    detailsView
  ) {
    return (
      <div className="flex gap-1 relative group items-center">
        <Link
          className="dark:text-white text-secondary font-semibold border-input rounded-md hover:underline underline-offset-4 line-clamp-1"
          onClick={changeRoute}
          // to={associationPath}
          to={makeLink({name: isObject(value) ? value?.label : value, objectTypeId:hubspotObjectTypeId, recordId:itemId, associationLabel: associationLabel})}

        >
          {truncatedText(isObject(value) ? value?.label : value, 23)}
        </Link>
        <Link
          className={` text-secondary  dark:text-white`}
          // to={associationPath}
          to={makeLink({name: isObject(value) ? value?.label : value, objectTypeId:hubspotObjectTypeId, recordId:itemId, associationLabel: associationLabel})}
        >
          <OpenIcon />
        </Link>
      </div>
    );
  }
  if (
    type == "list" &&
    column &&
    column?.isPrimaryDisplayProperty &&
    detailsView
  ) {
    return (
      <div className="flex gap-1 min-w-[100px] relative items-center">
        <Link
          className="dark:text-white  text-secondary font-semibold border-input rounded-md hover:underline underline-offset-4"
          // to={`/${sanitizeForBase64(path)}/${hubspotObjectTypeId}/${itemId}${urlParam ? urlParam : `?isPrimaryCompany=${companyAsMediator || false}`}`}
          to={makeLink({name: isObject(value) ? value.label : value, objectTypeId:hubspotObjectTypeId, recordId:itemId, associationLabel: associationLabel, tableParam: tableParam, defPermissions: defPermissions})}
        >
          {truncatedText(isObject(value) ? value.label : value, 23)}
        </Link>
        <Link
          className={` text-secondary  dark:text-white`}
          // to={`/${sanitizeForBase64(path)}/${hubspotObjectTypeId}/${itemId}${urlParam ? urlParam : `?isPrimaryCompany=${companyAsMediator || false}`}`}
          to={makeLink({name: isObject(value) ? value.label : value, objectTypeId:hubspotObjectTypeId, recordId:itemId, associationLabel: associationLabel, tableParam: tableParam, defPermissions: defPermissions})}
        >
          <OpenIcon /> 
        </Link>
      </div>
    );
  }
  if (
    type == "homeList" &&
    column &&
    column?.isPrimaryDisplayProperty &&
    detailsView
  ) {
    return (
      <div className="flex gap-1 relative items-center">
        <Link
          className="dark:text-white  text-secondary font-semibold border-input rounded-md hover:underline underline-offset-4 line-clamp-1"
          // to={`/${sanitizeForBase64(path)}/${hubspotObjectTypeId}/${itemId}${urlParam ? urlParam : `?isPrimaryCompany=${companyAsMediator || false}`}`}
          to={makeLink({name: isObject(value) ? value?.label : value, objectTypeId:hubspotObjectTypeId, recordId:itemId, associationLabel: associationLabel, isPC: companyAsMediator})}

        >
          {truncatedText(isObject(value) ? value.label : value, 23)}
        </Link>
        <Link
          className={` text-secondary  dark:text-white`}
          // to={`/${sanitizeForBase64(path)}/${hubspotObjectTypeId}/${itemId}${urlParam ? urlParam : `?isPrimaryCompany=${companyAsMediator || false}`}`}
          to={makeLink({name: isObject(value) ? value?.label : value, objectTypeId:hubspotObjectTypeId, recordId:itemId, associationLabel: associationLabel, isPC: companyAsMediator})}
        >
          <OpenIcon />
        </Link>
      </div>
    );
  }
  if (isArray(value) && value.length > 0) {
    const labels = value.map((item: any) => item?.label).join(", ");
    return (
      // <Tooltip content={labels}>
      <span className="dark:text-white">{truncatedText(labels, 23)}</span>
      // </Tooltip>
    );
  }

  if (isObject(value)) return truncatedText(value?.label, 23) || "--";

  const { truncated, isTruncated }: any = truncateString(value || "");

  if (type === 'list' || type === 'homeList') {
    return (
      // <Tooltip content={value}>
      <span className="dark:text-white">{truncatedText(value, 23)}</span>
      // </Tooltip>
    );
  } else {
    return truncatedText(value);
  }

};


export function getFirstName() {
  const { me } = useMe();
  const { profileDetails } = useAuth();

  return (
    profileDetails?.firstName ||
    me?.firstName ||
    profileDetails?.email ||
    ""
  );
}

export function getLastName() {
  const { me } = useMe();
  const { profileDetails } = useAuth();

  if (profileDetails && profileDetails?.lastName) {
    return profileDetails?.lastName;
  } else if (me && me?.lastName) {
    return me?.lastName;
  } else {
    return "";
  }
}

export function getEmail() {
  const { me } = useMe();
  const { profileDetails } = useAuth();

  if (profileDetails && profileDetails?.email) {
    return profileDetails?.email;
  } else if (me && me?.email) {
    return me?.email;
  } else {
    return "";
  }
}

export function wait(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getIconType = (filename: any) => {
  const extension = filename.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          className="fill-primary dark:fill-white"
        >
          <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
        </svg>
      );
    case "doc":
    case "docx":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          className="fill-primary dark:fill-white"
        >
          <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
        </svg>
      );
    case "xls":
    case "xlsx":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          className="fill-primary dark:Fill-white"
        >
          <path d="M510-530h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Zm-80 160h220v-60H430v60Zm-97.69 150Q302-220 281-241q-21-21-21-51.31v-535.38Q260-858 281-879q21-21 51.31-21H610l210 210v397.69Q820-262 799-241q-21 21-51.31 21H332.31Zm0-60h415.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-660L580-840H332.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85Zm-160 220Q142-60 121-81q-21-21-21-51.31V-660h60v527.69q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85H580v60H172.31ZM320-280v-560V-280Z" />
        </svg>
      );
    case "ppt":
    case "pptx":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          className="fill-primary dark:Fill-white"
        >
          <path d="M510-530h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Zm-80 160h220v-60H430v60Zm-97.69 150Q302-220 281-241q-21-21-21-51.31v-535.38Q260-858 281-879q21-21 51.31-21H610l210 210v397.69Q820-262 799-241q-21 21-51.31 21H332.31Zm0-60h415.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-660L580-840H332.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85Zm-160 220Q142-60 121-81q-21-21-21-51.31V-660h60v527.69q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85H580v60H172.31ZM320-280v-560V-280Z" />
        </svg>
      );
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          className="fill-primary dark:fill-white"
        >
          <path d="M228.31-164q-27.01 0-45.66-19Q164-202 164-228.31v-503.38Q164-758 182.65-777q18.65-19 45.66-19h503.38q27.01 0 45.66 19Q796-758 796-731.69v503.38Q796-202 777.35-183q-18.65 19-45.66 19H228.31Zm0-52h503.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-503.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H228.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v503.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM294-298h375.07L543.54-465.38 443.23-335.23l-62-78.31L294-298Zm-78 82v-528 528Z" />
        </svg>
      );
    case "svg":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          className="fill-primary dark:fill-white"
        >
          <path d="M440-501Zm0 354.07-86.61-77.84Q271.77-299 215.66-354.62q-56.12-55.61-90.77-101.57-34.66-45.96-49.77-86.43Q60-583.08 60-626q0-85.15 57.42-142.27 57.43-57.11 142.58-57.11 52.38 0 99 24.5t81 70.27q34.38-45.77 81-70.27 46.62-24.5 99-24.5 75.23 0 126.96 44.34 51.73 44.35 67.12 111.04H751q-13.77-44.61-50.31-70-36.54-25.39-80.69-25.39-49.85 0-88.19 27.5-38.35 27.5-72.27 77.89h-39.08q-33.69-50.77-73.38-78.08-39.7-27.31-87.08-27.31-57.77 0-98.88 39.7Q120-686 120-626q0 33.38 14 67.77 14 34.38 50 79.27 36 44.88 98 105.15T440-228q28.31-25.31 60.62-53.77 32.3-28.46 54.46-49.61l6.69 6.69L576.46-310l14.69 14.69 6.69 6.69q-22.76 21.16-54.26 48.93-31.5 27.77-59.43 53.07L440-146.93ZM714.61-290v-120h-120v-60h120v-120h60v120h120v60h-120v120h-60Z" />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          className="fill-primary dark:fill-white"
        >
          <path d="M178-212q-28.15 0-45.08-18.09Q116-248.17 116-274.04v-409.93q0-25.87 18.08-44.95Q152.16-748 180.31-748h195.61l96 96h308.77q24.85 0 40.31 14.85 15.46 14.84 20.54 37.15H451.38l-96-96H180.31q-5.39 0-8.85 3.46t-3.46 8.85v407.38q0 4.23 2.12 6.92 2.11 2.7 5.57 4.62L251-520.31h672.31l-78.85 264.62q-6.85 19.53-17.15 31.61Q817-212 795.08-212H178Zm51.54-52h562.23l62.46-204.31H290L229.54-264Zm0 0L290-468.31 229.54-264ZM168-600V-696v96Z" />
        </svg>
      );
  }
};

export const  getFileDetails = async (urlArray:any) => {
  const fileDetails = await Promise.all(
    urlArray.map(async (url:any) => {
    try {
      const name = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));
      const type = name.substring(name.lastIndexOf(".") + 1).toLowerCase();

      // Check for known document services and handle accordingly
      if (url.includes("docs.google.com")) {
        return {
          url,
          name: "Google Docs",
          type: "Google Docs",
          size: "N/A",
        };
      } else if (url.includes("drive.google.com")) {
        return {
          url,
          name: "Google Drive File",
          type: "Google Drive File",
          size: "N/A",
        };
      } else if (url.includes("dropbox.com")) {
        const directUrl = url.replace(
          "www.dropbox.com",
          "dl.dropboxusercontent.com"
        );
        return await fetchFileSize(directUrl, name, type);
      } else if (url.includes("onedrive.live.com")) {
        return {
          url,
          name: "OneDrive File",
          type: "OneDrive File",
          size: "N/A",
        };
      }

      return await fetchFileSize(url, name, type);
    } catch (error:any) {
      console.error(`Error processing URL ${url}:`, error);
      return {
        url,
        name: "Unknown",
        type: "Unknown",
        size: "N/A",
        error: error?.message
      };
    }
    })
  );

  return fileDetails;
};

// Helper export function to fetch file size using HEAD request
export const fetchFileSize = async (url: any, name: any, type: any) => {
  try {
    const response: any = await fetch(url, { method: "HEAD" });
    const fileSize: any = response.headers.get("content-length");

    return {
      url,
      name,
      type,
      size: fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : "Unknown size",
    };
  } catch (error) {
    console.error(`Error fetching file details for ${url}:`, error);
    return {
      url,
      name,
      type,
      size: "Error fetching file size",
    };
  }
};

// format path

export const formatPath = (key: any) => {
  // return (key && typeof key === "string") ? key.replace(/\s+/g, "-").replace(/\b\w/g, (l: any) => l.toLowerCase()) : "";
   if (!key || typeof key !== "string") return "";

  return key
    .replace(/\s+/g, "-")           // spaces → dashes
    .replace(/#/g, "%23")           // hash → -hash-
    .replace(/\b\w/g, (l: string) => l.toLowerCase()); // lowercase
};

// format custom object name

export function formatCustomObjectLabel(key = "") {
  // return (label && typeof label === "string") ? label.replace(/^p_/, "").replace(/_$/, "").replace(/_/g, " ") : "";
  if (!key || typeof key !== "string") return "";
  
  return key
    .replace(/-/g, " ")          // dashes → spaces
    .replace(/%23/g, "#")        // decode %23 → #
    .replace(/\b[a-z]/g, (l: string) => l.toUpperCase()); // lowercase → uppercase
}

// format column labels

export function formatColumnLabel(label: any) {
  return (label && typeof label === "string") ? label.replace(/_/g, " ") : "";
}

export function sortFormData(data: any) {
  return data.sort((a: any, b: any) => {
    // Define priority scores for sorting
    const getPriority = (item: any) => {
      if (item?.customLabel.toLowerCase().includes("name")) return 1; // First
      if (item?.primaryProperty || item?.primaryDisplayProperty) return 2; // Second
      if (item?.name === "hs_pipeline") return 3; // Third
      if (item?.name === "hs_pipeline_stage") return 4; // Fourth
      if (
        (item?.secondaryProperty || item?.secondaryDisplayProperty) &&
        item?.fieldType != "textarea"
      )
        return 5; // Fifth
      if (item?.fieldType === "textarea") return 7; // Fifth
      return 6; // Default to others
    };

    // Compare by priority
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    return priorityA - priorityB; // Sort in ascending order of priority
  });
}


export const escapeHTML = (str: any) => {
  return (str && typeof str === "string") ? str.replace(/'/g, "\\'") : "";
}
export const formatAmount = (amount: any, locale = "en-US") => {
  if (isNaN(amount)) return "Invalid amount";

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    useGrouping: true,
  }).format(amount);
};