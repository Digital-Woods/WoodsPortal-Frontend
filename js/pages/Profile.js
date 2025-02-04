const Profile = ({ title, path }) => {
  const [isEditPersonalInfo, setIsEditPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = Recoil.useRecoilState(profileState);
  const param = getQueryParamsFromCurrentUrl();
  const [userData, setUserData] = useState();
  const [userId, setUserId] = useState();
  const [userObjectId, setUserObjectId] = useState();
  const portalId = getPortal()?.portalId;
  const { sync, setSync } = useSync();

  const [activeTab, setActiveTab] = useState("password");


  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const fetchUserProfile = async (portalId) => {
    if (!portalId) return null;
    const response = await Client.user.profile({ portalId });
    return response?.data;
  };

  const { data: userNewData, error, isLoading, refetch } = useQuery({
    queryKey: ['userProfile', portalId],
    queryFn: () => fetchUserProfile(portalId),
    enabled: !!portalId,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
    onSuccess: (data) => {
      if (data) {
        sessionStorage.setItem('userProfile', JSON.stringify(data));
        setUserData(data);
        setUserId(data?.response?.hs_object_id?.value);
        setUserObjectId(data?.info?.objectTypeId);
      }
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
    }
  });

  useEffect(() => {
    if (userNewData) {
      setUserData(userNewData);
      setUserId(userNewData?.response?.hs_object_id?.value);
      setUserObjectId(userNewData?.info?.objectTypeId);
    }
  }, [portalId, sync]);
  const setActiveTabFucntion = (active) => {
    // setParam("t", active);
    setActiveTab(active);
  };
  return (
    <div className="bg-sidelayoutColor h-[calc(100vh-var(--nav-height))] dark:bg-dark-300 ">
      <div
        className={`dark:bg-dark-200  h-[calc(100vh-var(--nav-height))] rounded-tl-xl bg-cleanWhite dark:text-white md:px-4 md:pt-4 
       `}
      >
        <div
          className={` h-[calc(100vh-110px)] lg:h-[calc(100vh-90px)] hide-scrollbar overflow-y-auto`}
        >
          <div className="mb-4">
            <h1 className="text-xl font-semibold dark:text-white mb-2">
              My Profile
            </h1>
            <p className="leading-5 text-sm dark:text-white">
              Manage and update your profile settings
            </p>
          </div>
          <UserProfileCard userData={userData} />
          <div className={`w-full hide-scrollbar overflow-y-auto overflow-x-hidden`}>
            <div className={``}>
              <div className="border rounded-lg dark:border-none bg-graySecondary dark:bg-dark-300 border-flatGray w-fit  my-4">
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTabFucntion}
                  className="rounded-md "
                >
                  <TabsList>
                    <TabsTrigger className="rounded-md" value="password">
                      <p className="text-black dark:text-white">Password</p>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="password">
                  </TabsContent>
                </Tabs>
              </div>
              {activeTab === "password" && (
                <ChangePassword />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
