export function generateApiUrl({
  route,
  params = [],
  queryParams = null,
}) {
  const defaultParams = {
    hubId: getHubId(),
    portalId: getPortalId(),
  };
  params = { ...defaultParams, ...params };
  
  const url = route.replace(/:([a-zA-Z]+)/g, (_, key) => {
    if (key in params) {
      return encodeURIComponent(params[key]);
    }
    return encodeURIComponent(`missing-${key}`);
  });

  const queryString = new URLSearchParams(queryParams).toString();

  return queryString ? `${url}?${queryString}` : url;
}
