import { atom } from 'jotai';
import { checkHasAuthToken } from '@/data/client/auth-utils';



// Interfaces for Jotai atoms
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  hubId: string;
  templatename: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  hubspotDomain: string;
}

export interface Breadcrumb {
  label: string;
  path: string;
}

// Atom
export const isCollapsibleState = atom<boolean>(false);
export const isOpenState = atom<boolean>(false);

export const profileState = atom<UserProfile>({
  firstName: '',
  lastName: '',
  email: '',
  hubId: '',
  templatename: '',
  logo: '',
  primaryColor: '',
  secondaryColor: '',
  hubspotDomain: '',
});

export const authorizationState = atom<any>(checkHasAuthToken());
export const logoutDialogState = atom<boolean>(false);
export const routeState = atom<string[]>([]);

export const syncState = atom(false);
export const syncLoadingState = atom(false);
export const syncDisableState = atom(false);

export const breadcrumbState = atom<Breadcrumb[]>([]);