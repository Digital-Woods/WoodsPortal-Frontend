import { apiRoutes } from "@/data/hubSpotData";
import { formatPath } from "./DataMigration";

export const setParam = (paramName: any, paramValue: any) => {
  // Get the current URL
  const currentUrl = new URL(window.location.href);

  // Check if there's a hash in the URL
  if (currentUrl.hash) {
    // Extract the hash portion (e.g., "#/sites")
    const hashPart = currentUrl.hash.substring(1); // remove the "#" at the start
    const [path, queryString] = hashPart.split("?"); // Split any existing query string in the hash

    // Create a new URLSearchParams object from the existing query or start fresh
    const params = new URLSearchParams(queryString || "");

    // Set or add the new parameter
    params.set(paramName, paramValue);

    // Reassemble the URL with the updated hash and parameters
    currentUrl.hash = `${path}?${params.toString()}`;
  } else {
    // If there's no hash, simply add the parameter as a query
    currentUrl.searchParams.set(paramName, paramValue);
  }

  // Update the browser’s address bar without reloading the page
  window.history.replaceState({}, "", currentUrl);
};

export const getParam = (key: any) => {
  // Example URL
  const url = window.location.href;

  // Extract the hash part
  const hash = url.split("#")[1];

  // Extract query part from the hash
  const queryString = hash ? hash.split("?")[1] : "";

  // Parse parameters from the query string
  const searchParams = new URLSearchParams(queryString);

  // Get the parameter value by name
  const value = searchParams.get(key);

  return value;
};

export const getParamHash = (string: any) => {
  const result =
    string && typeof string === "string" ? string.replace(/%23/g, "#") : string;
  return result;
};

export const setParamHash = (string: any) => {
  const result =
    string && typeof string === "string" ? string.replace(/#/g, "%23") : string;
  return result;
};

// const isNotEmptyObject = (obj) => {
//     return Object.keys(obj).length > 0;
// }

// const getQueryParamsFromCurrentUrl = () => {
//     // Get the current URL
//     const currentUrl = window.location.href;

//     // Check if the URL has query parameters
//     const queryString = currentUrl.includes("?") ? currentUrl.split("?")[1] : "";

//     if (!queryString) return {}; // Return empty object if no query parameters

//     const params = new URLSearchParams(queryString);
//     const paramsObject = {};

//     // Convert query parameters to an object
//     params.forEach((value, key) => {
//         paramsObject[key] = value;
//     });
//     delete paramsObject?.b
//     delete paramsObject?.objectTypeName
//     delete paramsObject?.objectTypeId
//     delete paramsObject?.parentObjectTypeName

//     const mParams = new URLSearchParams(paramsObject);
//     console.log('mParams', mParams)

//     return isNotEmptyObject(mParams) ? `?${mParams}` : '';
// }

export const getQueryParamsFromCurrentUrl = () => {
  // Get the current URL
  const currentUrl = window.location.href;

  // Check if the URL has query parameters
  const queryString = currentUrl.includes("?") ? currentUrl.split("?")[1] : "";

  if (!queryString) return ""; // Return empty string if no query parameters

  const params = new URLSearchParams(queryString);
  const paramsObject: any = {};

  // Convert query parameters to an object
  params.forEach((value, key) => {
    paramsObject[key] = value;
  });

  // Remove unwanted keys
  delete paramsObject.t;
  delete paramsObject.b;
  delete paramsObject.objectTypeName;
  delete paramsObject.objectTypeId;
  delete paramsObject.parentObjectTypeName;

  // Convert the cleaned object back into a query string
  const filteredParams = new URLSearchParams(
    Object.entries(paramsObject).filter(([_, value]) => value !== undefined)
  );

  // Check if the filteredParams is not empty
  return filteredParams.toString() ? `?${filteredParams.toString()}` : "";
};

export const toQueryString = (params: any) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]: any) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : "";
};

export const addParam = (url: any, params = {}) => {
  // Convert params to query string
  const queryString = new URLSearchParams(params).toString();

  // Append query string to URL correctly
  const fullUrl = url.includes("?")
    ? `${url}&${queryString}`
    : `${url}?${queryString}`;
  return fullUrl;
};

// function mergeParamsWithObject(url, obj) {
//   const urlObj = new URL(url, window.location.origin); // Ensure URL parsing works
//   const urlParams = new URLSearchParams(urlObj.search);

//   // Create a new merged object (copy original object)
//   const mergedObj = { ...obj };

//   // Iterate over URL params and update/add them to the object
//   urlParams.forEach((value, key) => {
//     mergedObj[key] =
//       value === "true" ? true : value === "false" ? false : value;
//   });

//   return mergedObj;
// }

export function getQueryParamsToObject(url: any) {
  const params = new URLSearchParams(url);
  let obj: any = {};
  
  params.forEach((value, key) => {
      obj[key] = value;
  });

  return obj;
}


export function updateParamsFromUrl(apiUrl: any, params: any) {
    const url = new URL(apiUrl, "http://example.com"); // Base URL to parse query params
    const searchParams = new URLSearchParams(url.search);

    // Iterate over query parameters and update/add them to params object
    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}

export function removeAllParams(apiUrl: any) {
    const url = new URL(apiUrl, "http://example.com"); // Base URL to resolve relative paths
    return url.pathname; // Return only the path without query parameters
}



// function updateUrlWithParams(apiUrl, params) {
//     const url = new URL(apiUrl, "http://example.com"); // Base URL to resolve relative paths

//     // Clear existing search params
//     url.search = "";

//     // Append new parameters from the params object
//     Object.entries(params).forEach(([key, value]) => {
//         url.searchParams.append(key, value);
//     });

//     // Return the updated URL without the base URL
//     return url.pathname + url.search;
// }



export const getRouteMenu = (path: any) => {
  return apiRoutes.find((menu: any) =>  menu.path === path);
}