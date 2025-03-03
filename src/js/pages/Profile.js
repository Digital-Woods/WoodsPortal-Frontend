const Profile = ({ title, path }) => {
  const [isEditPersonalInfo, setIsEditPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = Recoil.useRecoilState(profileState);
  const param = getQueryParamsFromCurrentUrl();
  const [userData, setUserData] = useState();
  const [userId, setUserId] = useState();
  const [userObjectId, setUserObjectId] = useState();
  const [cacheEnabled, setCacheEnabled] = useState(true); 
  const portalId = getPortal()?.portalId;
  const { sync, setSync } = useSync();

  const [activeTab, setActiveTab] = useState("password");


  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const fetchUserProfile = async ({ portalId, cache }) => {
    if (!portalId) return null;
  
    const response = await Client.user.profile({ portalId, cache });
    return response?.data;
  };
  
  const { data: userNewData, error, isLoading, refetch } = useQuery({
    queryKey: ['userProfilePage', portalId, cacheEnabled],
    queryFn: () => fetchUserProfile({ portalId, cache: sync ? false : true }), 
    onSuccess: (data) => {
      if (data) {
        setUserData(data);
        setUserId(data?.response?.hs_object_id?.value);
        setUserObjectId(data?.info?.objectTypeId);
      }
      setSync(false);
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
      setSync(false);
    }
  });
  
  useEffect(() => {
    if (sync) {  
      refetch();
    }
  }, [sync]);
  
  const setActiveTabFucntion = (active) => {
    // setParam("t", active);
    setActiveTab(active);
  };

  return (
    <div className="bg-sidelayoutColor mt-[calc(var(--nav-height)-1px)] h-[calc(100vh-var(--nav-height))] dark:bg-dark-300">
      <div
        className={`dark:bg-dark-200 hide-scrollbar overflow-y-auto  h-[calc(100vh-var(--nav-height))] bg-cleanWhite dark:text-white md:px-4 px-3 `} >
        <div
          className={` md:pt-4 pt-3`}
        >
          <UserProfileCard userData={userData} isLoading={isLoading} />
          <div className={`w-full hide-scrollbar overflow-y-auto overflow-x-hidden md:mb-4 mb-3`}>
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
