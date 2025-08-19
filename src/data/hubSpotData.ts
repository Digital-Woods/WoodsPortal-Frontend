import { env } from "@/env";
import { defaultData } from '@/defaultData'
import { formatCustomObjectLabel, formatPath } from "@/utils/DataMigration";
import { getRouteMenuConfig, setRouteMenuConfig } from "./client/auth-utils";

export const isDevelopment = env.VITE_NODE_ENV === 'development'

export const dataSourceSet = isDevelopment ? defaultData.dataSourceSet : window?.hubSpotData?.dataSourceSet
export const hubId = isDevelopment ? defaultData.hubId : window?.hubSpotData?.hubId
export const apiBaseUrlOption = isDevelopment ? defaultData.apiBaseUrlOption : window?.hubSpotData?.apiBaseUrlOption
export const userData = isDevelopment ? defaultData.userData : window?.hubSpotData?.userData
export const objectList = isDevelopment ? defaultData.objectList : window?.hubSpotData?.objectList
export const showCompanyNameOption = isDevelopment ? defaultData.showCompanyNameOption : window?.hubSpotData?.showCompanyNameOption
export const showSidebarCtaOption = isDevelopment ? defaultData.showSidebarCtaOption : window?.hubSpotData?.showSidebarCtaOption
export const addHomeTabOption = isDevelopment ? defaultData.addHomeTabOption : window?.hubSpotData?.addHomeTabOption
export const sidebarMenuOptions = isDevelopment ? defaultData.sidebarMenuOptions : window?.hubSpotData?.sidebarMenuOptions
export const moduleIframeListOptions = isDevelopment ? defaultData.moduleIframeListOptions : window?.hubSpotData?.moduleIframeListOptions
export const sidebarListDataOption = isDevelopment ? defaultData.sidebarListDataOption : window?.hubSpotData?.sidebarListDataOption
export const showSidebarListDataOption = isDevelopment ? defaultData.showSidebarListDataOption : window?.hubSpotData?.showSidebarListDataOption
export const sidebarCtaDetails = isDevelopment ? defaultData.sidebarCtaDetails : window?.hubSpotData?.sidebarCtaDetails
export const baseCompanyOptions = isDevelopment ? defaultData.baseCompanyOptions : window?.hubSpotData?.baseCompanyOptions
export const enableDashboardCards = isDevelopment ? defaultData.enableDashboardCards : window?.hubSpotData?.enableDashboardCards
export const dashboardCards = isDevelopment ? defaultData.dashboardCards : window?.hubSpotData?.dashboardCards
export const homeTabsDataTypeFilter = isDevelopment ? defaultData.homeTabsDataTypeFilter : window?.hubSpotData?.homeTabsDataTypeFilter
export const moduleStylesOptions = isDevelopment ? defaultData.moduleStylesOptions : window?.hubSpotData?.moduleStylesOptions
export const recorBtnCustom = isDevelopment ? defaultData.recorBtnCustom : window?.hubSpotData?.recorBtnCustom
export const sidebarCtaStyles = isDevelopment ? defaultData.sidebarCtaStyles : window?.hubSpotData?.sidebarCtaStyles

// Side Menu Item Start
const sideMenu = [
  {
    name: "CONTACT",
    labels: {
      singular: "Contact",
      plural: "Contacts",
    },
    hubspotObjectId: 1,
    hubspotObjectTypeId: "0-1",
    children: sidebarMenuOptions,
  },
];

export const apiRoutes: any = sideMenu[0].children.map((menuItem: any) => ({
  hubspotObjectTypeId: `${menuItem.hubspotObjectTypeId}`,
  path: `/${formatPath(menuItem.tabName || menuItem.label)}`,
  title: formatCustomObjectLabel(menuItem.tabName || menuItem.label),
  icon: menuItem.icon,
  isRequiredAuth: true,
  isHeader: true,
  companyAsMediator: menuItem.companyAsMediator,
  pipeLineId: menuItem.pipeLineId,
  specPipeLine: menuItem.specPipeLine,
  objectDescription: menuItem.objectDescription,
  objectUserProperties: menuItem.objectUserProperties,
  homeCardsView: menuItem.homeCardsView,
  objectUserPropertiesView: menuItem.objectUserPropertiesView,
}));

const configs = getRouteMenuConfig() || {};
const key = sideMenu[0]?.children[1]?.tabName ? 'home' : sideMenu[0]?.children[1]?.hubspotObjectTypeId;
configs[key] = { ...configs[key], details: null };
setRouteMenuConfig(configs);
// Side Menu Item End

export const hubSpotUserDetails = {
  userId: (userData && userData.id) ? userData.id : 1,
  firstName: userData && userData.firstname ? userData.firstname : 'No firstname',
  lastName: userData && userData.lastname ? userData.lastname : 'No lastname',
  email: userData && userData.email ? userData.email : 'No email',
  roles: [],
  authorities: [],
  hubspotPortals: {
    hubId: 1,
    subscriptionLevel: 1,
    hubspotDomain: "",
    hubspotSelectedDomain: "",
    portalSettings: {
      theme: "light",
      logo: baseCompanyOptions && baseCompanyOptions.logoImg ? baseCompanyOptions.logoImg : baseCompanyOptions.smallLogo,
      smallLogo: baseCompanyOptions && baseCompanyOptions.smallLogo ? baseCompanyOptions.smallLogo : baseCompanyOptions.logoImg,
      authPopupFormLogo: baseCompanyOptions && baseCompanyOptions.authPopupFormLogo ? baseCompanyOptions.authPopupFormLogo : baseCompanyOptions.logoImg,
      primaryColor: defaultData.primarycolor,
      secondaryColor: defaultData.secondarycolor,
      brandName: baseCompanyOptions && baseCompanyOptions.companyName ? baseCompanyOptions.companyName : "CompanyName",
    },
    onboardStatus: true,
    templateName: "dw_office",
    activeStatus: true,
  },
  sideMenu: sidebarMenuOptions,
  sideBarOptions: sidebarCtaDetails,
};

export const hubSpotTableData = {
  statusCode: "200",
  data: {
    results: objectList,
    total: '10',
  },
  statusMsg: "Record(s) has been successfully retrieved.",
};
