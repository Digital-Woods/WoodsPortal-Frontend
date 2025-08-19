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
        "tabName": "Dashboard"
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
const moduleIframeListOptions = null
const sidebarListDataOption = null
const showSidebarListDataOption = null


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
    homeTabStyles: {
        headingColor: "{{ module.style.home_tab_styles.home_tab_banner_text_color.color }}",
        descriptionColor: "{{ module.style.home_tab_styles.description_color.color }}",
        buttonStyles: {
            backgroundColor: "{{ module.style.home_tab_styles.button_styles.background_color.color }}",
            textColor: "{{ module.style.home_tab_styles.button_styles.text_color.color }}",
        },
        overlayer: {
            color: "{{ module.style.home_tab_styles.banner_overlayer_color.color }}",
            opacity: "{{ module.style.home_tab_styles.banner_overlayer_color.opacity }}",
        },
        svgColor: {
            color: "{{ module.style.home_tab_styles.user_card_svg_color.color }}",
            opacity: "{{ module.style.home_tab_styles.user_card_svg_color.opacity }}",
        }
    },
    sidebarStyles: {
        textColor: "{{ module.style.sidebar_styles.text_color.color }}",
        backgroundColor: "{{ module.style.sidebar_styles.sidebar_background_color.color }}",
    },
    detailsPageStyles: {
        textColor: "{{ module.style.details_page_styles.text_color.color }}",
        bannerColors: {
            color1: "{{ module.style.details_page_styles.banner_background_options.banner_color_1.color }}",
            color2: "{{ module.style.details_page_styles.banner_background_options.banner_color_2.color }}",
        }
    },
    creatButtonStyles: {
        backgroundColor: "{{ module.style.table_record_creation_button.background_color.color }}",
        textColor: "{{ module.style.table_record_creation_button.text_color.color }}",
    },
    rightTables: {
        backgroundColor: "{{ module.style.d_h_sidebar.background_color.rgba }}",
        cardBackgroundColor: "{{ module.style.d_h_sidebar.card_background_color.rgba }}",
        textColor: "{{ module.style.d_h_sidebar.text_color.rgba }}",
    },
    noteStyle: {
        hsBg: "{{ module.style.note_cards.hs_note_card_bg_color.color }}",
        hsText: "{{ module.style.note_cards.hs_note_ts_text_color.color }}",
        wpBg: "{{ module.style.note_cards.wp_note_card_bg_color.color }}",
        wpText: "{{ module.style.note_cards.wp_note_ts_text_color.color }}",
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