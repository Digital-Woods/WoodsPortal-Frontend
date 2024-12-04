const Profile = ({ title, path }) => {
  const [isEditPersonalInfo, setIsEditPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = Recoil.useRecoilState(profileState);

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="lg:w-[calc(100%_-350px)] w-full">
        <div className="px-6 pt-6">
          <h1 className="text-xl font-semibold dark:text-white mb-2">
            My Profile Settings
          </h1>
          <p className="text-primary leading-5 text-sm dark:text-white">
            Manage and update your profile settings
          </p>
        </div>

        <ProfileCard />
        <ProfileUpdate />
        <ChangePassword />
      </div>
    </div>
  );
};
