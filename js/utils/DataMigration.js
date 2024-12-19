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

const formatDate = (data) => {
  // if (isDate(data)) {
  const date = new Date(data);
  const formatted = formatDateString(date);
  const [datePart, timePart] = formatted.split(", ");
  const [day, month, year] = datePart.split("/");
  const formattedLocalDate = `${day}-${month}-${year} ${timePart.toLowerCase()}`;
  return formattedLocalDate;
  // }
  // return data;
};

function isNull(data) {
  return !!(data === undefined || data === null || data === "");
}

function isObject(data) {
  if(data == null) return false
  return typeof data === "object";
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
    Object.entries(obj).filter(([key, value]) =>
      value.isPrimaryDisplayProperty === true || value.isSecondaryDisplayProperty === true
    )
  );
  return filtered;
};

const sortData = (list, type = 'list') => {
  if (type == 'list' || type == 'details') delete list.associations
  if (type == 'associations') list = filterAssociationsData(list)
  let data = type != 'list' ? Object.keys(list).map(key => ({ ...list[key], key: key })) : list

  data = data.filter(item => item.key !== "hs_object_id" && item.key !== "associations");

  if (type == 'associations') data = data.filter(item => item.key !== "hs_pipeline_stage");

  // Sorting function
  data.sort((a, b) => {
    // 1. Key "hs_object_id" comes first
    if (a.key === "hs_object_id") return -1;
    if (b.key === "hs_object_id") return 1;

    // 2. "isPrimaryDisplayProperty: true" comes next
    if (a.isPrimaryDisplayProperty && !b.isPrimaryDisplayProperty) return -1;
    if (!a.isPrimaryDisplayProperty && b.isPrimaryDisplayProperty) return 1;

    // 3. "isSecondaryDisplayProperty: true" comes next
    if (a.isSecondaryDisplayProperty && !b.isSecondaryDisplayProperty) return -1;
    if (!a.isSecondaryDisplayProperty && b.isSecondaryDisplayProperty) return 1;

    // 4. Items where both "isPrimaryDisplayProperty" and "isSecondaryDisplayProperty" are false,
    // excluding "hs_object_id", "hs_createdate", and "hs_lastmodifieddate"
    const excludeKeys = ["hs_object_id", "hs_createdate", "hs_lastmodifieddate"];
    const aCondition = !a.isPrimaryDisplayProperty && !a.isSecondaryDisplayProperty && !excludeKeys.includes(a.key);
    const bCondition = !b.isPrimaryDisplayProperty && !b.isSecondaryDisplayProperty && !excludeKeys.includes(b.key);

    if (aCondition && !bCondition) return -1;
    if (!aCondition && bCondition) return 1;

    // 5. "key: hs_createdate" should come next
    if (a.key === "hs_createdate") return -1;
    if (b.key === "hs_createdate") return 1;

    // 6. "key: hs_lastmodifieddate" should come last
    if (a.key === "hs_lastmodifieddate") return -1;
    if (b.key === "hs_lastmodifieddate") return 1;

    // Maintain original order if no conditions matched
    return 0;
  });

  return data;
}

// const sortData = (item, viewType = "list", title = "") => {
//   if (!item || !isObject(item)) return [];

//   const fields = Object.keys(item);

//   const imageFields = [];
//   const simpleFields = [];
//   const objectFields = [];
//   const hsFields = [];
//   const nameFields = [];

//   fields.forEach((key) => {
//     switch (viewType) {
//       case "details":
//         if (keysToSkipDetails(key)) return;
//         break;
//       case "associations":
//         if (keysToSkipAssociations(key)) return;
//         break;
//       default:
//         if (keysToSkipList(key)) return;
//     }

//     const value = item[key];

//     if (
//       isObject(value) &&
//       value.associateWith &&
//       value.detailPageHidden == (viewType == "details")
//     ) {
//       return;
//     }

//     if (typeof value === "string" &&  (value, key)) {
//       imageFields.push({
//         name: key,
//         label: checkEquipments(
//           key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
//           title
//         ),
//         value: value,
//       });
//     } else if (key.startsWith("hs_")) {
//       hsFields.push({
//         name: key,
//         label: key
//           .replace(/^hs_/, "Hs ")
//           .replace(/_/g, " ")
//           .replace(/\b\w/g, (char) => char.toUpperCase()),
//         value: value,
//       });
//     } else if (isObject(value) && value.associateWith) {
//       objectFields.push({
//         name: key,
//         label: checkEquipments(value.headerLabel, title),
//         value: value.headerLabel,
//       });
//     } else if (isObject(value)) {
//       // Check if it's a field with a 'name' property and push accordingly
//       if (value.key) {
//         nameFields.push({
//           name: key,
//           label: checkEquipments(
//             value.key
//               .replace(/_/g, " ")
//               .replace(/\b\w/g, (char) => char.toUpperCase()),
//             title
//           ),
//           value: value.value,
//         });
//       } else {
//         // Skip objects that don't have a 'name' or similar property
//       }
//     } else {
//       simpleFields.push({
//         name: key,
//         label: checkEquipments(
//           key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
//           title
//         ),
//         value: value,
//       });
//     }
//   });

//   // Sort and concatenate
//   const sortedFields = [
//     ...imageFields,
//     ...nameFields,
//     ...simpleFields,
//     ...objectFields,
//     ...hsFields,
//   ];

//   return sortedFields;
// };

const renderCellContent = (value, column, itemId = null, path = null, hubspotObjectTypeId, type = 'list', associationPath = '', detailsView = true) => {
  if (!value) {
    return '--';
  }
  if ((type == 'associations' || type == 'list') && column && column.isPrimaryDisplayProperty && associationPath && detailsView) {
    return (
      <Link
        className="dark:text-white font-semibold border-input rounded-md"
        to={associationPath}
      >
        {isObject(value) ? value.label : value}
      </Link>
    )
  }
  if (type == 'list' && column && column.isPrimaryDisplayProperty && detailsView) {
    return (
      <Link
        className="dark:text-white font-semibold border-input rounded-md"
        to={`${path}/${hubspotObjectTypeId}/${itemId}`}
      >
        {isObject(value) ? value.label : value}
      </Link>
    )
  }
  if (column && value != null && (column.key == 'hs_createdate' || column.key == 'hs_lastmodifieddate'  || column.key == 'createdate')) {
    return formatDate(isObject(value) ? value.label : value);
  }
  if (isObject(value)) return value.label || '--';

  const { truncated, isTruncated } = truncateString(value || "");
  return type == 'list' && isTruncated ?
    <Tooltip right content={value}>
      <Link
        className="dark:text-white"
      >
        {truncated}
      </Link>
    </Tooltip>
    :
    value
}

// const renderCellContent = (value, itemId = null, path = null) => {
//   switch (true) {
//     case (isObject(value) && isEmptyObject(value)) || isNull(value):
//       return "-";

//     case isObject(value) && value.type === "link": {
//       const label = value.labels ? value.labels : value.featureName;
//       const { truncated, isTruncated } = truncateString(label.plural || "");

//       return isTruncated ? (
//         <Tooltip right content={label.plural}>
//           <Link
//             className="text-secondary font-bold border-input rounded-md"
//             to={`/${value.featureName}?filterPropertyName=associations.${value.associateWith}&filterOperator=EQ&filterValue=${itemId}`}
//           >
//             {truncated}
//           </Link>
//         </Tooltip>
//       ) : (
//         <Link
//           className="text-secondary font-bold border-input rounded-md"
//           to={`/${value.featureName}?filterPropertyName=associations.${value.associateWith}&filterOperator=EQ&filterValue=${itemId}`}
//         >
//           {label.plural}
//         </Link>
//       );
//     }

//     case isObject(value) && value.type === "primaryDisplayProperty": {
//       const { truncated, isTruncated } = truncateString(value.value || "");

//       return isTruncated ? (
//         <Tooltip content={value.value}>
//           <Link
//             className="text-secondary font-bold border-input rounded-md"
//             to={`${path}/${itemId}`}
//           >
//             {truncated}
//           </Link>
//         </Tooltip>
//       ) : (
//         <Link
//           className="text-secondary font-bold border-input rounded-md"
//           to={`${path}/${itemId}`}
//         >
//           {value.value}
//         </Link>
//       );
//     }

//     case isImage(value): {
//       let urlArray = typeof value === "string" ? value.split(",") : [];
//       return urlArray.length > 0 ? (
//         <img
//           src={urlArray[0]}
//           alt={urlArray[0]}
//           className="w-10 h-10 rounded"
//         />
//       ) : null;
//     }

//     case isDate(value):
//       return formatDate(value);

//     default: {
//       const cellContent = isObject(value)
//         ? JSON.stringify(value)
//         : String(value);
//       const { truncated, isTruncated } = truncateString(cellContent);

//       return isTruncated ? (
//         <Tooltip content={cellContent}>{truncated}</Tooltip>
//       ) : (
//         truncated
//       );
//     }
//   }
// };

// function setColorsFromMe() {
//   // Default colors
//   const defaultPrimaryColor = "#0000FF"; // Blue
//   const defaultSecondaryColor = "#000000"; // Black

//   // Retrieve user data using useMe hook
//   const { me } = useMe(); // Ensure this is called in a functional component or an appropriate hook

//   // Initialize colors with default values
//   let primaryColor = defaultPrimaryColor;
//   let secondaryColor = defaultSecondaryColor;

//   if (me && me.hubspotPortals && me.hubspotPortals.portalSettings) {
//     const portalSettings = me.hubspotPortals.portalSettings;

//     // Update colors if available in the portalSettings
//     if (portalSettings.primaryColor) {
//       primaryColor = portalSettings.primaryColor;
//     }
//     if (portalSettings.secondaryColor) {
//       secondaryColor = portalSettings.secondaryColor;
//     }
//   }

//   // Retrieve color parameters from URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const urlPrimaryColor = urlParams.get("primaryColor");
//   const urlSecondaryColor = urlParams.get("secondaryColor");

//   // Override defaults with URL parameters if they are present and valid
//   const finalPrimaryColor = urlPrimaryColor ? urlPrimaryColor : primaryColor;
//   const finalSecondaryColor = urlSecondaryColor
//     ? urlSecondaryColor
//     : secondaryColor;

//   // Apply the colors as CSS custom properties
//   document.documentElement.style.setProperty(
//     "--primary-color",
//     finalPrimaryColor
//   );
//   document.documentElement.style.setProperty(
//     "--secondary-color",
//     finalSecondaryColor
//   );
// }

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

const getIcon = (filename,width='24px',height='24px') => {
  const extension = filename.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={height}
          viewBox="0 -960 960 960"
          width={width}
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
          height={height}
          viewBox="0 -960 960 960"
          width={width}
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
          height={height}
          viewBox="0 -960 960 960"
          width={width}
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
          height={height}
          viewBox="0 -960 960 960"
          width={width}
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
          height={height}
          viewBox="0 -960 960 960"
          width={width}
          className="fill-primary dark:fill-white"
        >
          <path d="M228.31-164q-27.01 0-45.66-19Q164-202 164-228.31v-503.38Q164-758 182.65-777q18.65-19 45.66-19h503.38q27.01 0 45.66 19Q796-758 796-731.69v503.38Q796-202 777.35-183q-18.65 19-45.66 19H228.31Zm0-52h503.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-503.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H228.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v503.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM294-298h375.07L543.54-465.38 443.23-335.23l-62-78.31L294-298Zm-78 82v-528 528Z" />
        </svg>
      );
    case "svg":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={height}
          viewBox="0 -960 960 960"
          width={width}
          className="fill-primary dark:fill-white"
        >
          <path d="M440-501Zm0 354.07-86.61-77.84Q271.77-299 215.66-354.62q-56.12-55.61-90.77-101.57-34.66-45.96-49.77-86.43Q60-583.08 60-626q0-85.15 57.42-142.27 57.43-57.11 142.58-57.11 52.38 0 99 24.5t81 70.27q34.38-45.77 81-70.27 46.62-24.5 99-24.5 75.23 0 126.96 44.34 51.73 44.35 67.12 111.04H751q-13.77-44.61-50.31-70-36.54-25.39-80.69-25.39-49.85 0-88.19 27.5-38.35 27.5-72.27 77.89h-39.08q-33.69-50.77-73.38-78.08-39.7-27.31-87.08-27.31-57.77 0-98.88 39.7Q120-686 120-626q0 33.38 14 67.77 14 34.38 50 79.27 36 44.88 98 105.15T440-228q28.31-25.31 60.62-53.77 32.3-28.46 54.46-49.61l6.69 6.69L576.46-310l14.69 14.69 6.69 6.69q-22.76 21.16-54.26 48.93-31.5 27.77-59.43 53.07L440-146.93ZM714.61-290v-120h-120v-60h120v-120h60v120h120v60h-120v120h-60Z" />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={height}
          viewBox="0 -960 960 960"
          width={width}
          className="fill-primary dark:fill-white"
        >
          <path d="M178-212q-28.15 0-45.08-18.09Q116-248.17 116-274.04v-409.93q0-25.87 18.08-44.95Q152.16-748 180.31-748h195.61l96 96h308.77q24.85 0 40.31 14.85 15.46 14.84 20.54 37.15H451.38l-96-96H180.31q-5.39 0-8.85 3.46t-3.46 8.85v407.38q0 4.23 2.12 6.92 2.11 2.7 5.57 4.62L251-520.31h672.31l-78.85 264.62q-6.85 19.53-17.15 31.61Q817-212 795.08-212H178Zm51.54-52h562.23l62.46-204.31H290L229.54-264Zm0 0L290-468.31 229.54-264ZM168-600V-696v96Z" />
        </svg>
      );
  }
};

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
  const fileDetails = await Promise.all(urlArray.map(async (url) => {
    const name = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));
    const type = name.substring(name.lastIndexOf(".") + 1).toLowerCase();

    // Check for known document services and handle accordingly
    if (url.includes('docs.google.com')) {
      return {
        url,
        name: 'Google Docs',
        type: 'Google Docs',
        size: 'N/A'
      };
    } else if (url.includes('drive.google.com')) {
      return {
        url,
        name: 'Google Drive File',
        type: 'Google Drive File',
        size: 'N/A'
      };
    } else if (url.includes('dropbox.com')) {
      // Dropbox share links need modification for direct download
      const directUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      return await fetchFileSize(directUrl, name, type);
    } else if (url.includes('onedrive.live.com')) {
      return {
        url,
        name: 'OneDrive File',
        type: 'OneDrive File',
        size: 'N/A'
      };
    }

    // Default case: Attempt to get file size with a HEAD request
    return await fetchFileSize(url, name, type);
  }));

  return fileDetails;
};

// Helper function to fetch file size using HEAD request
const fetchFileSize = async (url, name, type) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const fileSize = response.headers.get('content-length');

    return {
      url,
      name,
      type,
      size: fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : 'Unknown size'
    };
  } catch (error) {
    console.error(`Error fetching file details for ${url}:`, error);
    return {
      url,
      name,
      type,
      size: 'Error fetching file size'
    };
  }
};

// format path 

const formatPath = (key) => {
  return key.replace(/\s+/g, '-').replace(/\b\w/g, (l) => l.toLowerCase());
};

// format custom object name 

function formatCustomObjectLabel(label) {
  return label.replace(/^p_/, '').replace(/_$/, '').replace(/_/g, ' ');
}

// format column labels 

function formatColumnLabel(label) {
  return typeof label === 'string' ? label.replace(/_/g, ' ') : '';
}

function sortFormData(data) {
  return data.sort((a, b) => {
    // Define priority scores for sorting
    const getPriority = (item) => {
      if (item.customLabel.toLowerCase().includes('name')) return 1; // First
      if (item.primaryProperty || item.primaryDisplayProperty) return 2; // Second
      if (item.name === 'hs_pipeline') return 3; // Third
      if (item.name === 'hs_pipeline_stage') return 4; // Fourth
      if ((item.secondaryProperty || item.secondaryDisplayProperty) && item.fieldType != 'textarea') return 5; // Fifth
      if (item.fieldType === 'textarea') return 7; // Fifth
      return 6; // Default to others
    };

    // Compare by priority
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    return priorityA - priorityB; // Sort in ascending order of priority
  });
}