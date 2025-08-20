import { env } from "@/env";
import { hubId } from '@/data/hubSpotData'
import { getPortal } from "@/data/client/auth-utils";

export const generateApiUrl = ({
  route,
  params = [],
  queryParams = '',
}: any) => {

  let portalId;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId
  }

  const defaultParams = {
    hubId: hubId,
    portalId: portalId,
  };

  params = { ...defaultParams, ...params };

  const url = route.replace(/:([a-zA-Z]+)/g, (_: any, key: any) => {
    if (key in params) {
      return encodeURIComponent(params[key]);
    }
    return encodeURIComponent(`missing-${key}`);
  });

  const queryString = new URLSearchParams(queryParams).toString();

  return queryString ? `${url}?${queryString}` : url;
}
