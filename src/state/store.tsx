import { atom } from 'jotai';
import { checkHasAuthToken, getAuthSubscriptionType } from '@/data/client/auth-utils';
import { env } from "@/env";

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


export const fontState = atom<string>("Select");
export const isLoadingUploadingState = atom<boolean>(false);
export const uploadProgressState = atom<number>(0);
export const attachmentsState = atom<any[]>([]);
export const linkDataState = atom<any | null>(null);
export const nameState = atom<string>("");


export const themeModeState = atom<string>(localStorage.theme);
export const toasterState = atom<any>(null);


const pageLimit = env.VITE_TABLE_PAGE_LIMIT;
export const tableSortState = atom<string>("-hs_createdate");
export const tableLimitState = atom<number>(pageLimit);
export const tableAfterState = atom<string>("");
export const tablePageState = atom<number>(getAuthSubscriptionType() === "FREE" ?  ' ' : 1);
export const tableTotalItemsState = atom<number>(1);
export const tableNumOfPagesState = atom<number>(1);
export const tableCurrentPageState = atom<number>(1);
export const tableSearchState = atom<string>("");
export const tableFilterPropertyNameState = atom<string>("hs_pipeline");
export const tableFilterPropertyOperatorState = atom<string>("eq");
export const tableFilterPropertyValueState = atom<string>("");
export const tableIsPrimaryCompanyState = atom<boolean | null>(null);
export const tableViewState = atom<string | null>(null);
export const tableSelectedPipelineState = atom<string>("");
export const tableParamState = atom<Record<string, any>>({});
export const gridDataState = atom<any[]>([]);

