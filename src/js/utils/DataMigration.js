function profileInitial(firstName, lastName) {
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

function isDate(dateString) {
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

const formatDateString = (date) => {
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

const formatDate = (data, type = "date") => {
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

function isNull(data) {
  return !!(data === undefined || data === null || data === "");
}

function isObject(data) {
  if (data == null) return false;
  return typeof data === "object";
}
function isArray(data) {
  if (!Array.isArray(data)) return false;
  return data.every(item => typeof item === "object" && item !== null);
}

function isEmptyObject(data) {
  return Object.keys(data).length === 0;
}

const truncateString = (str, MAX_LENGTH = 40) => {
  if (str.length > MAX_LENGTH) {
    return {
      truncated: str.substring(0, MAX_LENGTH) + "...",
      isTruncated: true,
    };
  }
  return { truncated: str, isTruncated: false };
};

function isImage(value, key = "") {
  const imageExtensions = /\.(png|jpeg|jpg|gif|bmp|svg|webp|tiff|ico)$/i;
  return imageExtensions.test(value) || key.includes("image");
}

const keysToSkipList = (key) => {
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

const keysToSkipDetails = (key) => {
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

const keysToSkipAssociations = (key) => {
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

const checkEquipments = (value, title) => {
  if (title == "Equipments" || title == "Equipment" || title == "/assets")
    return value.replace("Asset", "Equipment");
  return value;
};

const checkEquipmentsName = (value, title) => {
  if (title == "Equipment")
    if (value == "Asset Name")
      return value.replace("Asset Name", "Equipment Name");
  if (value == "Asset Type")
    return value.replace("Asset Type", "Equipment Type");
  return value;
};

const filterAssociationsData = (obj) => {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) =>
        value.isPrimaryDisplayProperty === true ||
        value.isSecondaryDisplayProperty === true
    )
  );
  return filtered;
};

const objectToQueryParams = (params) => {
  if (!params || typeof params !== "object") {
    return ""; // Return an empty string if params is null, undefined, or not an object
  }

  return Object.entries(params)
    .map(([key, value]) =>
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


const sortData = (list, type = "list") => {
  if (type == "list" || type == "details") delete list.associations;
  const excludeKeys = ["hs_object_id", "hs_createdate", "hs_lastmodifieddate", "associations"];
  let data = list

  if (type === "list") {
    data = data.filter(item => !excludeKeys.includes(item.key));
    return data.sort((a, b) => a.tableDisplayOrder - b.tableDisplayOrder);
  }

  data = Object.entries(list)
    .filter(([key]) => !excludeKeys.includes(key))
    .map(([key, value]) => ({
      ...value,
      key
    }));

  return data.sort((a, b) => a.overviewDisplayOrder - b.overviewDisplayOrder);
}

const replaceQuestionMarkToRegex = (text) => {
  const replacedText = (text && typeof text === "string") ? text?.replace(/\?/g, "!") : text;
  return replacedText;
}

const replaceRegexToQuestionMark = (text) => {
  const replacedText = text?.replace(/\?/g, "!");
  return replacedText;
}

const truncatedText = (text, maxLength = 30) => {
  if (text) {
    const truncatedText =
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    return <span>{truncatedText}</span>;
  }
  return <span>{text}</span>;
};

function decodeAndStripHtml(html) {
  // Create a temporary element to decode HTML entities
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html; // Decodes &lt; and &gt; into < and >

  // Use DOMParser to strip out HTML tags
  const parser = new DOMParser();
  const doc = parser.parseFromString(tempElement.textContent, "text/html");

  return doc.body.textContent.trim(); // Return only plain text
}

const renderCellContent = ({
  companyAsMediator = false,
  value,
  column,
  itemId = null,
  path = null,
  hubspotObjectTypeId,
  type = "list",
  associationPath = "",
  detailsView = true,
  hoverRow,
  item,
  urlParam = null
}) => {
  if (column.hidden) return null;
  if (!column || value === undefined || value === null || !value) { // if value is undefined empty string then add empty
    return "--";
  }

  // Start - Set associations url in cookie
  const changeRoute = () => {
    if(type == "associations") {
      const newPath = path.replace(/^\/+/, "");
      setItemAsync(env.ASSOCIATION_VIEW_URL_KEY, JSON.stringify({
        name: newPath,
        path: associationPath,
        routeName: `/association/${newPath}`})
      );
    }
  }

  const setItemAsync = (key, value, days = env.COOKIE_EXPIRE) => {
    return new Promise((resolve) => {
      setCookie(key, value, days);
      resolve();
    });
  };
  // End - Set associations url in cookie

  if ( // if date then conver into date format
    column &&
    value != null &&
    (column.type == "datetime" ||
      column.key == "hs_createdate" ||
      column.key == "hs_lastmodifieddate" ||
      column.key == "createdate"
    )
  ) {
    const formatedDateTime = formatTimestampIST(isObject(value) ? value.label : value)
    return `${formatedDateTime.date} ${formatedDateTime.time}`
  }

  if ( // if date then conver into date format
    column &&
    value != null &&
    (column.type == "date" ||
      column.key == "hs_createdate" ||
      column.key == "hs_lastmodifieddate" ||
      column.key == "createdate"
    )
  ) {
    return formatDate(isObject(value) ? value.label : value);
  }

  if (
    column &&
    value != null &&
    (column.key === 'domain')
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
    column.key === "amount" && column.showCurrencySymbol
  ) {
    let find_currency_code;
    
    if (type == 'details') {
      find_currency_code = Array.isArray(item) ? item.find(i => i.key === "deal_currency_code") : null;
    } else {
      find_currency_code = item && item.deal_currency_code ? item.deal_currency_code : null;
    }
  
    if (find_currency_code && find_currency_code.value) {
      const currency = isObject(find_currency_code.value) ? find_currency_code.value.value : find_currency_code.value;
      return `${Currency(currency)} ${formatAmount(value)}`;
    }
  }
  
  if (column.showCurrencySymbol) { // if value is a currency symbol
    const myCurrency = getUserDetails()?.companyCurrency
    return `${Currency(myCurrency)} ${formatAmount(value)}`;
  }

  if ( // if primary display property then add open button
    !value &&
    (type == "associations" || type == "list" || type === 'homeList') &&
    column &&
    column.isPrimaryDisplayProperty &&
    detailsView
  ) {
    return (
      <div className="flex gap-1 relative items-center">
        <Link
          className="dark:text-white  text-secondary hover:underline underline-offset-4 font-semibold border-input rounded-md"
          to={`${path}/${hubspotObjectTypeId}/${itemId}?isPrimaryCompany=${companyAsMediator || false}`}
        >
          --
        </Link>
        <Link
          className={` text-secondary  dark:text-white`}
          to={`${path}/${hubspotObjectTypeId}/${itemId}?isPrimaryCompany=${companyAsMediator || false}`}
        >
          <OpenIcon />
        </Link>
      </div>
    );
  }

  if ((type === "list" || type === "associations" || type === 'homeList') && column?.fieldType === "html") {
    return (
      <div className="flex gap-1 relative justify-between">
        {truncatedText(decodeAndStripHtml(value || ""))}
      </div>
    );
  }

  if (type === "details" && column?.fieldType === "html") {
    return (
      <div className="flex gap-1 relative justify-between">
        {/* {isObject(value) ? value.label
            : ReactHtmlParser.default(DOMPurify.sanitize(value))} */}
        {decodeAndStripHtml(value || "")}
      </div>
    );
  }

  if (
    (type === "details" || type === "associations" || type === 'list' || type === 'homeList') &&
    (column?.fieldType === "checkbox")
  ) {
    if (Array.isArray(value) && value.length > 0) {
      const labels = value.map((item) => item.label).join(", ");
      return labels;
    }
    return "--";
  }

  if (type == "details") {
    return (
      <div className="flex gap-1 relative  justify-between">
        {isObject(value) ? value.label : value}
      </div>
    );
  }

  if (
    (type == "associations" || type == "list") &&
    column &&
    column.isPrimaryDisplayProperty &&
    associationPath &&
    detailsView
  ) {
    return (
      <div className="flex gap-1 relative group items-center">
        <Link
          className="dark:text-white text-secondary font-semibold border-input rounded-md hover:underline underline-offset-4"
          onClick={changeRoute}
          to={associationPath}
        >
          {truncatedText(isObject(value) ? value.label : value, "23")}
        </Link>
        <Link
          className={` text-secondary  dark:text-white`}
          to={associationPath}
        >
          <OpenIcon />
        </Link>
      </div>
    );
  }
  if (
    type == "list" &&
    column &&
    column.isPrimaryDisplayProperty &&
    detailsView
  ) {
    return (
      <div className="flex gap-1 min-w-[100px] relative items-center">
        <Link
          className="dark:text-white  text-secondary font-semibold border-input rounded-md hover:underline underline-offset-4"
          to={`${path}/${hubspotObjectTypeId}/${itemId}${urlParam ? urlParam : `?isPrimaryCompany=${companyAsMediator || false}`}`}
        >
          {truncatedText(isObject(value) ? value.label : value, '23')}
        </Link>
        <Link
          className={` text-secondary  dark:text-white`}
          to={`${path}/${hubspotObjectTypeId}/${itemId}${urlParam ? urlParam : `?isPrimaryCompany=${companyAsMediator || false}`}`}
        >
          <OpenIcon />
        </Link>
      </div>
    );
  }
  if (
    type == "homeList" &&
    column &&
    column.isPrimaryDisplayProperty &&
    detailsView
  ) {
    return (
      <div className="flex gap-1 relative items-center">
        <Link
          className="dark:text-white  text-secondary font-semibold border-input rounded-md hover:underline underline-offset-4"
          to={`${path}/${hubspotObjectTypeId}/${itemId}${urlParam ? urlParam : `?isPrimaryCompany=${companyAsMediator || false}`}`}
        >
          {truncatedText(isObject(value) ? value.label : value,'23')}
        </Link>
        <Link
          className={` text-secondary  dark:text-white`}
          to={`${path}/${hubspotObjectTypeId}/${itemId}${urlParam ? urlParam : `?isPrimaryCompany=${companyAsMediator || false}`}`}
        >
          <OpenIcon />
        </Link>
      </div>
    );
  }
  if (isArray(value) && value.length > 0) {
    const labels = value.map((item) => item.label).join(", ");
    return (
      // <Tooltip content={labels}>
      <span className="dark:text-white">{truncatedText(labels,'23')}</span>
      // </Tooltip>
    );
  }

  if (isObject(value)) return truncatedText(value.label,'23') || "--";

  const { truncated, isTruncated } = truncateString(value || "");

  if (type === 'list' || type === 'homeList') {
    return (
      // <Tooltip content={value}>
      <span className="dark:text-white">{truncatedText(value,'23')}</span>
      // </Tooltip>
    );
  } else {
    return truncatedText(value);
  }

};

function getFirstName() {
  const { me, getMe } = useMe();
  const loggedInDetails = useRecoilValue(userDetailsAtom);

  if (loggedInDetails && loggedInDetails.firstName) {
    return loggedInDetails.firstName;
  } else if (me && me.firstName) {
    return me.firstName;
  } else {
    return "";
  }
}

function getLastName() {
  const { me, getMe } = useMe();
  const loggedInDetails = useRecoilValue(userDetailsAtom);

  if (loggedInDetails && loggedInDetails.lastName) {
    return loggedInDetails.lastName;
  } else if (me && me.lastName) {
    return me.lastName;
  } else {
    return "";
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getIconType = (filename) => {
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

const getFileDetails = async (urlArray) => {
  const fileDetails = await Promise.all(
    urlArray.map(async (url) => {
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
        // Dropbox share links need modification for direct download
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

      // Default case: Attempt to get file size with a HEAD request
      return await fetchFileSize(url, name, type);
    })
  );

  return fileDetails;
};

// Helper function to fetch file size using HEAD request
const fetchFileSize = async (url, name, type) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const fileSize = response.headers.get("content-length");

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

const formatPath = (key) => {
  return key.replace(/\s+/g, "-").replace(/\b\w/g, (l) => l.toLowerCase());
};

// format custom object name

function formatCustomObjectLabel(label) {
  return label.replace(/^p_/, "").replace(/_$/, "").replace(/_/g, " ");
}

// format column labels

function formatColumnLabel(label) {
  return typeof label === "string" ? label.replace(/_/g, " ") : "";
}

function sortFormData(data) {
  return data.sort((a, b) => {
    // Define priority scores for sorting
    const getPriority = (item) => {
      if (item.customLabel.toLowerCase().includes("name")) return 1; // First
      if (item.primaryProperty || item.primaryDisplayProperty) return 2; // Second
      if (item.name === "hs_pipeline") return 3; // Third
      if (item.name === "hs_pipeline_stage") return 4; // Fourth
      if (
        (item.secondaryProperty || item.secondaryDisplayProperty) &&
        item.fieldType != "textarea"
      )
        return 5; // Fifth
      if (item.fieldType === "textarea") return 7; // Fifth
      return 6; // Default to others
    };

    // Compare by priority
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    return priorityA - priorityB; // Sort in ascending order of priority
  });
}


const escapeHTML = (str) => {
  return str.replace(/'/g, "\\'");
}
const formatAmount = (amount, locale = "en-US") => {
  if (isNaN(amount)) return "Invalid amount";

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    useGrouping: true,
  }).format(amount);
};