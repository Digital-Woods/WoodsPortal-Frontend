const fakeUserDetails = {
  userId: userData && userData.id ? userData.id : 1,
  firstName:
    userData && userData.firstname ? userData.firstname : "No firstname",
  lastName: userData && userData.lastname ? userData.lastname : "No lastname",
  email: userData && userData.email ? userData.email : "No email",
  roles: [],
  authorities: [],
  hubspotPortals: {
    hubId: 1,
    subscriptionLevel: 1,
    hubspotDomain: "",
    hubspotSelectedDomain: "",
    portalSettings: {
      theme: "light",
      logo:
        baseCompanyOptions && baseCompanyOptions.logoImg
          ? baseCompanyOptions.logoImg
          : "",
      primaryColor: primarycolor,
      secondaryColor: secondarycolor,
      brandName:
        baseCompanyOptions && baseCompanyOptions.companyName
          ? baseCompanyOptions.companyName
          : "CompanyName",
    },
    onboardStatus: true,
    templateName: "dw_office",
    activeStatus: true,
  },
  sideMenu: sidebarMenuOptions,
  sideBarOptions: sidebarCtaDetails,
};

const fakeTableData = {
  statusCode: "200",
  data: {
    results: objectList,
    total: "10",
  },
  statusMsg: "Record(s) has been successfully retrieved.",
};

const bulletPointData = [
  '<span class="inline-block font-semibold">Refresh Data:</span> Click the ‘Clear Cache’ button to update system data. This may fix issues with visibility of new records or associations.',
  '<span class="inline-block font-semibold">Check Associations:</span> Ensure the necessary associations are correctly created for this operation.',
];
