const setParam = (paramName, paramValue) => {
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
}

const getParam = (key) => {
    // Example URL
    const url = window.location.href;

    // Extract the hash part
    const hash = url.split('#')[1];

    // Extract query part from the hash
    const queryString = hash.split('?')[1];

    // Parse parameters from the query string
    const searchParams = new URLSearchParams(queryString);

    // Get the parameter value by name
    const value = searchParams.get(key);

    return value
}

const getParamHash = (string) => {
    const result = string.replace(/%23/g, '#');
    return result;
}

const setParamHash = (string) => {
    const result = string.replace(/#/g, '%23');
    return result;
}

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

const getQueryParamsFromCurrentUrl = () => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the URL has query parameters
    const queryString = currentUrl.includes("?") ? currentUrl.split("?")[1] : "";

    if (!queryString) return ""; // Return empty string if no query parameters

    const params = new URLSearchParams(queryString);
    const paramsObject = {};

    // Convert query parameters to an object
    params.forEach((value, key) => {
        paramsObject[key] = value;
    });

    // Remove unwanted keys
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
