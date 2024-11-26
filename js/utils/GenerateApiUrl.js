const generateApiUrl = ({
  route,
  params = [],
  queryParams = '',
}) => {

  let portalId;
  if (env.DATA_SOURCE_SET != true) {
    portalId = getPortal().portalId
  }

  const defaultParams = {
    hubId: hubId,
    portalId: portalId,
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
