const primarycolor = "";
const secondarycolor = "";

const dataSourceSet = false;
const hubId = 48715351;
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
            "portalId": 242,
            "name": "manab_dev_test_account",
            "label": "Manab Dev Test Account",
            "portalUrl": "https://48715351.hs-sites.com",
            "twoFa": false,
            "activeStatus": true,
            "hubspotSync": true
        },
        {
            "portalId": 351,
            "name": "ping_pong",
            "label": "Ping Pong",
            "portalUrl": "https://49286120.hs-sites.com",
            "twoFa": false,
            "activeStatus": true,
            "hubspotSync": true
        },
        {
            "portalId": 352,
            "name": "new_hubspot_test_account",
            "label": "New Hubspot test account",
            "portalUrl": "https://dev.digitalwoods.net",
            "twoFa": false,
            "activeStatus": true,
            "hubspotSync": true
        },
        {
            "portalId": 503,
            "name": "mmm00001",
            "label": "MMM00001",
            "portalUrl": "https://dev-test-v1-dev-48715351-48715351.hs-sites.com",
            "twoFa": false,
            "activeStatus": true,
            "hubspotSync": true
        },
        {
            "portalId": 366,
            "name": "arindam_dev_test",
            "label": "Arindam Dev Test",
            "portalUrl": "https://49355802.hs-sites.com",
            "twoFa": false,
            "activeStatus": true,
            "hubspotSync": true
        },
        {
            "portalId": 434,
            "name": "tesss",
            "label": "Tesss",
            "portalUrl": "https://50188479.hs-sites.com",
            "twoFa": false,
            "activeStatus": true,
            "hubspotSync": true
        }
    ],
    "hubspots": [
        {
            "hubId": 48745110,
            "subscriptionLevel": 0,
            "twoFa": false,
            "activeStatus": true
        },
        {
            "hubId": 48715351,
            "subscriptionLevel": 0,
            "twoFa": false,
            "activeStatus": true
        },
        {
            "hubId": 48729186,
            "subscriptionLevel": 0,
            "twoFa": false,
            "activeStatus": true
        },
        {
            "hubId": 50188479,
            "subscriptionLevel": 0,
            "twoFa": false,
            "activeStatus": true
        },
        {
            "hubId": 49355802,
            "subscriptionLevel": 0,
            "twoFa": false,
            "activeStatus": true
        },
        {
            "hubId": 49286120,
            "subscriptionLevel": 0,
            "twoFa": false,
            "activeStatus": true
        },
        {
            "hubId": 140615827,
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
        "tabName": "User Home"
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": true,
        "hubspotObjectId": 4,
        "hubspotObjectTypeId": "0-3",
        "icon": "    <svg      viewBox=\"0 0 24 24\"      fill=\"currentColor\"      height=\"1em\"      width=\"1em\"      {...props}    >      <path fill=\"none\" d=\"M0 0h24v24H0z\" />      <path d=\"M19 7h5v2h-5V7zm-2 5h7v2h-7v-2zm3 5h4v2h-4v-2zM2 22a8 8 0 1116 0h-2a6 6 0 10-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z\" />    </svg>",
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "link"
            }
        ],
        "label": "Primary Company Deals",
        "listObjectName": "Primary Company Deals",
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
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": true,
        "hubspotObjectId": 4,
        "hubspotObjectTypeId": "0-3",
        "icon": "    <svg      viewBox=\"0 0 24 24\"      fill=\"currentColor\"      height=\"1em\"      width=\"1em\"      {...props}    >      <path fill=\"none\" d=\"M0 0h24v24H0z\" />      <path d=\"M19 7h5v2h-5V7zm-2 5h7v2h-7v-2zm3 5h4v2h-4v-2zM2 22a8 8 0 1116 0h-2a6 6 0 10-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z\" />    </svg>",
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "link"
            }
        ],
        "label": "Pipeline Primary Company Deals",
        "listObjectName": "Pipeline Primary Company Deals",
        "listObjectProperties": "dealname,dealstage,amount",
        "objectDescription": "",
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
        "pipeLineId": "default",
        "propertyName": null,
        "showIframe": false,
        "specPipeLine": true
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": false,
        "hubspotObjectId": 4,
        "hubspotObjectTypeId": "0-3",
        "icon": "    <svg      viewBox=\"0 0 24 24\"      fill=\"currentColor\"      height=\"1em\"      width=\"1em\"      {...props}    >      <path fill=\"none\" d=\"M0 0h24v24H0z\" />      <path d=\"M19 7h5v2h-5V7zm-2 5h7v2h-7v-2zm3 5h4v2h-4v-2zM2 22a8 8 0 1116 0h-2a6 6 0 10-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z\" />    </svg>",
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "link"
            }
        ],
        "label": "Direct Deals",
        "listObjectName": "Direct Deals",
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
        "label": "Primary Company Tickets",
        "listObjectName": "Primary Company Tickets",
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
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": false,
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
        "label": "Direct Tickets",
        "listObjectName": "Direct Tickets",
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
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": true,
        "hubspotObjectId": 4,
        "hubspotObjectTypeId": "0-2",
        "icon": "    <svg      xmlns=\"http://www.w3.org/2000/svg\"      viewBox=\"0 0 16 16\"      width=\"1em\"      height=\"1em\"      {...props}    >      <path        fill=\"none\"        stroke=\"currentColor\"        strokeLinejoin=\"round\"        d=\"M6 10h2.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1-.45-1-1s.45-1 1-1H10M8 4.5v1.167M8 9.5v2M13.5 5v8.5H3M2.5 11V2.5H12\"      ></path>    </svg>",
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "link"
            }
        ],
        "label": "Primary Companies",
        "listObjectName": "Primary Companies",
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
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": false,
        "hubspotObjectId": 4,
        "hubspotObjectTypeId": "0-2",
        "icon": "    <svg      xmlns=\"http://www.w3.org/2000/svg\"      viewBox=\"0 0 16 16\"      width=\"1em\"      height=\"1em\"      {...props}    >      <path        fill=\"none\"        stroke=\"currentColor\"        strokeLinejoin=\"round\"        d=\"M6 10h2.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1-.45-1-1s.45-1 1-1H10M8 4.5v1.167M8 9.5v2M13.5 5v8.5H3M2.5 11V2.5H12\"      ></path>    </svg>",
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "link"
            }
        ],
        "label": "Direct Companies",
        "listObjectName": "Direct Companies",
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
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": false,
        "hubspotObjectId": null,
        "hubspotObjectTypeId": "2-38796726",
        "icon": "    <svg      viewBox=\"0 0 24 24\"      fill=\"currentColor\"      height=\"1em\"      width=\"1em\"      {...props}    >      <path d=\"M20.315 4.319l-8.69 8.719-3.31-3.322-2.069 2.076 5.379 5.398 10.76-10.796zM5.849 14.689L0 19.682h24l-5.864-4.991h-3.2l-1.024.896h3.584l3.072 2.815H3.417l3.072-2.815h2.688l-.896-.896z\" />    </svg>",
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "link"
            }
        ],
        "label": "Sites",
        "listObjectName": "Sites",
        "listObjectProperties": null,
        "objectDescription": null,
        "objectType": "USER_DEFINED",
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
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": false,
        "hubspotObjectId": null,
        "hubspotObjectTypeId": "2-38796732",
        "icon": "    <svg      viewBox=\"0 0 24 24\"      fill=\"currentColor\"      height=\"1em\"      width=\"1em\"      {...props}    >      <path d=\"M20.315 4.319l-8.69 8.719-3.31-3.322-2.069 2.076 5.379 5.398 10.76-10.796zM5.849 14.689L0 19.682h24l-5.864-4.991h-3.2l-1.024.896h3.584l3.072 2.815H3.417l3.072-2.815h2.688l-.896-.896z\" />    </svg>",
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "link"
            }
        ],
        "label": "Jobs",
        "listObjectName": "Jobs",
        "listObjectProperties": null,
        "objectDescription": null,
        "objectType": "USER_DEFINED",
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
];
const moduleIframeListOptions: any = []
const sidebarListDataOption: any = [
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": true,
        "hubspotObjectId": 15,
        "hubspotObjectTypeId": "0-3",
        "icon": null,
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "button"
            }
        ],
        "label": "Deals Direct",
        "listObjectName": "Deals Direct",
        "listObjectProperties": "subject,hs_pipeline_stage,hs_pipeline",
        "objectType": "HUBSPOT_DEFINED",
        "pipeLineId": "0",
        "propertyName": null,
        "showIframe": false,
        "specPipeLine": false
    },
    {
        "associateObjectName": null,
        "associateObjectProperties": null,
        "companyAsMediator": false,
        "hubspotObjectId": 15,
        "hubspotObjectTypeId": "0-3",
        "icon": null,
        "iframeProperties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_value_show_as": "button"
            }
        ],
        "label": "Deals Normal",
        "listObjectName": "Deals Normal",
        "listObjectProperties": "subject,hs_pipeline_stage,hs_pipeline",
        "objectType": "HUBSPOT_DEFINED",
        "pipeLineId": "0",
        "propertyName": null,
        "showIframe": false,
        "specPipeLine": false
    }
]
const showSidebarListDataOption: any = true


const sidebarCtaDetails = [
    {
        title: "Test 1",
        buttonUrl: "Test 1",
        buttonText: "Test 1",
    }
];

const baseCompanyOptions = {
    logoImg: "https://48715364.fs1.hubspotusercontent-na1.net/hubfs/48715364/logo.fef91145.svg",
    companyName: "Digital Woods",
    smallLogo: "https://48715364.fs1.hubspotusercontent-na1.net/hubfs/48715364/logo.fef91145.svg",
    authPopupFormLogo: "https://48715364.fs1.hubspotusercontent-na1.net/hubfs/48715364/logo.fef91145.svg",
    welcomeMessage: "",
    createAccountBool: true,
    createAccountLink: `<a href={href} target="_blank" rel="noopener noreferrer">Signup</a>`
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
const enableDashboardCards = true;
const dashboardCards: any = [
    {
        "description": "<p data-start=\"247\" data-end=\"336\"><strong data-stringify-type=\"bold\">Welcome</strong><span>&nbsp;</span><strong data-stringify-type=\"bold\">to your Customer Portal Dashboard</strong></p>\n<p data-start=\"247\" data-end=\"336\"><span aria-label=\"&nbsp;\" data-stringify-type=\"paragraph-break\"></span><span>Use this portal to manage support tickets and coordinate any custom work with our team.</span></p>\n<p data-start=\"340\" data-end=\"424\">&nbsp;</p>",
        "properties": [
            {
                "button_name": "View",
                "on_click_action": "showIframe",
                "properties_value": "Label",
                "property_type": "company",
                "property_value_show_as": "simpleText"
            }
        ],
        "show_date": true,
        "show_title": true,
        "title": "",
        "view": "grid"
    }
];
const homeTabsDataTypeFilter = {
    "files": "all",
    "notes": "all",
    "tickets": "all"
};

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
    homeTabsDataTypeFilter
}