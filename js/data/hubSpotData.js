const hubSpotUserDetails = {
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
      primaryColor: primarycolor,
      secondaryColor: secondarycolor,
      brandName: baseCompanyOptions && baseCompanyOptions.companyName ? baseCompanyOptions.companyName : "CompanyName",
    },
    onboardStatus: true,
    templateName: "dw_office",
    activeStatus: true,
  },
  sideMenu: moduleText,
  sideBarOptions: sidebarCtaDetails,
};

const hubSpotTableData = {
  statusCode: "200",
  data: {
    results: objectList,
    total: '10',
  },
  statusMsg: "Record(s) has been successfully retrieved.",
};
