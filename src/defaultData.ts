const primarycolor = "";
const secondarycolor = "";

const dataSourceSet = false;
const hubId = 50316130;
const apiBaseUrlOption = ""
const userData: any = {
    "userId": 5949,
    "firstName": "Manab",
    "lastName": "Roy",
    "email": "manab@digitalwoods.io",
    "emailVerified": true,
    "roles": [],
    "authorities": [],
    "portals": [
        {
            "portalId": 627,
            "name": "WoodsportalDev",
            "label": "WoodsportalDev",
            "portalUrl": "https://50316130.hs-sites.com",
            "twoFa": false,
            "activeStatus": true,
            "hubspotSync": true
        }
    ],
    "hubspots": [
        {
            "hubId": 50316130,
            "subscriptionLevel": 0,
            "twoFa": false,
            "activeStatus": true
        }
    ]
};
const objectList: any = [];
const showCompanyNameOption = true;
const showSidebarCtaOption = true;
const addHomeTabOption = null
const sidebarMenuOptions = [
    {
        "homeCardsView": "grid",
        "icon": "    <svg      viewBox=\"0 0 1024 1024\"      fill=\"currentColor\"      height=\"1em\"      width=\"1em\"      {...props}    >      <path d=\"M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z\" />    </svg>",
        "tabName": "Dashboard"
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": true,
        "hubspotObjectId": 4,
        "hubspotObjectTypeId": "0-5",
        "icon": "    <svg      xmlns=\"http://www.w3.org/2000/svg\"      viewBox=\"0 0 16 16\"      width=\"1em\"      height=\"1em\"      {...props}    >      <path        fill=\"none\"        stroke=\"currentColor\"        strokeLinejoin=\"round\"        d=\"M6 10h2.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1-.45-1-1s.45-1 1-1H10M8 4.5v1.167M8 9.5v2M13.5 5v8.5H3M2.5 11V2.5H12\"      ></path>    </svg>",
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "link"
            }
        ],
        "label": "Organization Tickets",
        "listObjectName": "Organization Tickets",
        "listObjectProperties": "dealname,dealstage,amount",
        "objectDescription": null,
        "objectType": "HUBSPOT_DEFINED",
        "objectUserProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_type": "company",
                "property_value_show_as": "simpleText"
            }
        ],
        "objectUserPropertiesView": "grid",
        "pipeLineId": "0",
        "propertyName": null,
        "showIframe": false,
        "specPipeLine": false
    }
]
const moduleIframeListOptions: any = []
const sidebarListDataOption: any = []
const showSidebarListDataOption: any = []


const sidebarCtaDetails = [
    {
        title: "Test 1",
        buttonUrl: "Test 1",
        buttonText: "Test 1",
    }
];

const baseCompanyOptions = {
    logoImg: "https://www.koppert.com/content/_processed_/b/c/csm_Cherry-34_bf99ee21f6.jpg",
    companyName: "Test",
    smallLogo: "https://www.koppert.com/content/_processed_/b/c/csm_Cherry-34_bf99ee21f6.jpg",
    authPopupFormLogo: "https://www.koppert.com/content/_processed_/b/c/csm_Cherry-34_bf99ee21f6.jpg",
    welcomeMessage: "Tests Message"
};

const moduleStylesOptions = {
    "homeTabStyles": {
        "headingColor": "#2a2a2a",
        "descriptionColor": "#2a2a2a",
        "buttonStyles": {
            "backgroundColor": "",
            "textColor": ""
        },
        "overlayer": {
            "color": "",
            "opacity": "0"
        },
        "svgColor": {
            "color": "",
            "opacity": "100"
        }
    },
    "sidebarStyles": {
        "textColor": "#FFFFFF",
        "backgroundColor": "#2d3e50"
    },
    "detailsPageStyles": {
        "textColor": "#FFFFFF",
        "bannerColors": {
            "color1": "#2d3e50",
            "color2": "#fc5b36"
        }
    },
    "creatButtonStyles": {
        "backgroundColor": "",
        "textColor": ""
    },
    "rightTables": {
        "backgroundColor": "rgba(45, 62, 80, 0.08)",
        "cardBackgroundColor": "rgba(45, 62, 80, 0.13)",
        "textColor": "rgba(45, 62, 80, 1)"
    },
    "noteStyle": {
        "hsBg": "#efefef",
        "hsText": "#2a2a2a",
        "wpBg": "#FAFAFA",
        "wpText": "#999999"
    }
}
const sidebarCtaStyles = {
    backgroundColor: "{{ module.style.sidebar_cta.background_color.rgba }}",
    textColor: "{{ module.style.sidebar_cta.text_color.rgba }}",
    buttonBackgroundColor: "{{ module.sidebar_cta.button_background_color.rgba }}",
    buttonTextColor: "{{ module.style.sidebar_cta.button_text_color.rgba }}"
}

const hubSpotUserDetails = {
    hubspotPortals: {
        portalSettings: {
            logo: "https://www.koppert.com/content/_processed_/b/c/csm_Cherry-34_bf99ee21f6.jpg",
            authPopupFormLogo: "https://www.koppert.com/content/_processed_/b/c/csm_Cherry-34_bf99ee21f6.jpg",
            brandName: "Test Brand"
        }
    },
    sideBarOptions: [
        {
            title: "Test 1",
            buttonUrl: "Test 1",
            buttonText: "Test 1",
        }
    ]
}

const recorBtnCustom = false;
const enableDashboardCards = false;
const dashboardCards: any = [];
const homeTabsDataTypeFilter = null;
const developerMode = false;

export const defaultData = {
    dataSourceSet,
    apiBaseUrlOption,
    addHomeTabOption,
    moduleIframeListOptions,
    sidebarListDataOption,
    showSidebarListDataOption,
    primarycolor,
    secondarycolor,
    hubId,
    sidebarMenuOptions,
    sidebarCtaDetails,
    objectList,
    showCompanyNameOption,
    showSidebarCtaOption,
    baseCompanyOptions,
    moduleStylesOptions,
    sidebarCtaStyles,
    hubSpotUserDetails,
    userData,
    recorBtnCustom,
    enableDashboardCards,
    dashboardCards,
    homeTabsDataTypeFilter,
    developerMode
}