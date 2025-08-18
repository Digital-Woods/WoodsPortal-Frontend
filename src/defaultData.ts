export const primarycolor = "";
export const secondarycolor = "";
export const hubId = 48715351;
export const sidebarMenuOptions = [
    {
        label: 'Leads',
        hubspotObjectTypeId: '2-38796726',
        tabName: 'leads',
        icon: null,
        companyAsMediator: false,
        pipeLineId: 'pipeline-2',
        specPipeLine: 'custom',
        objectDescription: 'Leads from campaigns',
        objectUserProperties: {
            name: 'Lead Name',
            source: 'Lead Source',
        },
        objectUserPropertiesView: {
            name: true,
            source: false,
        },
        homeCardsView: ['conversion', 'history'],
    }
];

export const sidebarCtaDetails = [
    {
        title: "Test 1",
        buttonUrl: "Test 1",
        buttonText: "Test 1",
    }
];
export const objectList = [];
export const showCompanyNameOption = true;
export const showSidebarCtaOption = true;
export const baseCompanyOptions = {
    logoImg: "https://www.koppert.com/content/_processed_/b/c/csm_Cherry-34_bf99ee21f6.jpg",
    companyName: "Test",
    smallLogo: "https://www.koppert.com/content/_processed_/b/c/csm_Cherry-34_bf99ee21f6.jpg",
    authPopupFormLogo: "https://www.koppert.com/content/_processed_/b/c/csm_Cherry-34_bf99ee21f6.jpg",
    welcomeMessage: "Tests Message"
};

export const moduleStylesOptions = {
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
export const sidebarCtaStyles = {
    backgroundColor: "{{ module.style.sidebar_cta.background_color.rgba }}",
    textColor: "{{ module.style.sidebar_cta.text_color.rgba }}",
    buttonBackgroundColor: "{{ module.sidebar_cta.button_background_color.rgba }}",
    buttonTextColor: "{{ module.style.sidebar_cta.button_text_color.rgba }}"
}

export const hubSpotUserDetails = {
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

export const userData: any = {
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




// Side Menu Item Start

import { formatPath, formatCustomObjectLabel } from '@/utils/DataMigration';
import { getRouteMenuConfig, setRouteMenuConfig } from './data/client/auth-utils';

const menuIcon = `<svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 7h5v2h-5V7zm-2 5h7v2h-7v-2zm3 5h4v2h-4v-2zM2 22a8 8 0 1116 0h-2a6 6 0 10-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path></svg>`

const sideMenu: any = [
    {
        label: 'Contacts',
        hubspotObjectTypeId: '0-1',
        tabName: 'contacts',
        icon: 'user',
        companyAsMediator: false,
        pipeLineId: 'pipeline-1',
        specPipeLine: 'default',
        objectDescription: 'List of all contacts',
        objectUserProperties: {
            email: 'Email',
            phone: 'Phone',
        },
        objectUserPropertiesView: {
            email: true,
            phone: true,
        },
        homeCardsView: ['overview', 'activity'],
        children: [
            {
                label: 'Home',
                hubspotObjectTypeId: '0-1',
                tabName: 'home',
                icon: menuIcon,
                companyAsMediator: false,
                pipeLineId: 'pipeline-2',
                specPipeLine: 'custom',
                objectDescription: 'Leads from campaigns',
                objectUserProperties: {
                    name: 'Lead Name',
                    source: 'Lead Source',
                },
                objectUserPropertiesView: {
                    name: true,
                    source: false,
                },
                homeCardsView: ['conversion', 'history'],
            },
            {
                label: 'Leads',
                hubspotObjectTypeId: '2-38796726',
                tabName: 'leads',
                icon: menuIcon,
                companyAsMediator: false,
                pipeLineId: 'pipeline-2',
                specPipeLine: 'custom',
                objectDescription: 'Leads from campaigns',
                objectUserProperties: {
                    name: 'Lead Name',
                    source: 'Lead Source',
                },
                objectUserPropertiesView: {
                    name: true,
                    source: false,
                },
                homeCardsView: ['conversion', 'history'],
            },
            {
                label: 'Clients',
                hubspotObjectTypeId: '0-3',
                tabName: 'clients',
                icon: menuIcon,
                companyAsMediator: true,
                pipeLineId: 'pipeline-3',
                specPipeLine: 'enterprise',
                objectDescription: 'All paying clients',
                objectUserProperties: {
                    name: 'Client Name',
                    revenue: 'Annual Revenue',
                },
                objectUserPropertiesView: {
                    name: true,
                    revenue: true,
                },
                homeCardsView: ['stats', 'contracts'],
            }
        ]
    }
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

export const recorBtnCustom = false;
