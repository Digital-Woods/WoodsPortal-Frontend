import { useAtom } from 'jotai';
import { authorizationState, logoutDialogState, profileState } from '@/state/store';
import { setAuthToken, getAuthToken, setAuthSubscriptionType, getAuthSubscriptionType, setPaginationData, getPaginationData, removeAuthToken  } from '@/data/client/auth-utils';

export function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationState);
  const [logoutDialog, setLogoutDialog] = useAtom(logoutDialogState);
  const [profileDetails, setProfileDetails] = useAtom(profileState);

  return {
    setToken: setAuthToken,
    getToken: getAuthToken,
    isAuthorized,
    authorize(token: any) {
      setAuthToken(token);
      setAuthorized(true);
    },
    unauthorize() {
      setAuthorized(false);
      removeAuthToken();
    },
    profileDetails,
    setProfileDetails,
    logoutDialog, 
    setLogoutDialog,
    setSubscriptionType: setAuthSubscriptionType,
    subscriptionType: getAuthSubscriptionType(),
    setPagination: setPaginationData,
    getPagination: getPaginationData(),
  };
}