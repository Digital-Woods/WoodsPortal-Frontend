// const { atom } = Recoil;

const profileState = Recoil.atom({
  key: "profileState",
  default: {
    firstName: "",
    lastName: "",
    email: "",
    hubId: "",
    templatename: "",
    logo: "",
    primaryColor: "",
    secondaryColor: "",
    hubspotDomain: "",
    label: "",
  },
});
