const Profile = ({ title, path }) => {
  const [isEditPersonalInfo, setIsEditPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = Recoil.useRecoilState(profileState);

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 max-md:p-3 lg:max-h-[calc(100vh-75px)] max-h-[calc(100vh-90px)] overflow-y-auto hide-scrollbar">
      <div className="px-6 pt-6">
        <h1 className="text-xl font-semibold dark:text-white mb-2">
          My Profile Settings
        </h1>
        <p className="text-primary leading-5 text-sm dark:text-white">
          Manage and update your profile settings
        </p>
      </div>
      <div className=" items-end grid lg:grid-cols-2 grid-cols-1 md:gap-4 gap-3 w-full">
        <div>
          <ProfileCard />
          <ProfileUpdate />
        </div>
        <div>
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};
