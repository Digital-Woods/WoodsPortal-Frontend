import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from 'react';
import { Client } from '@/data/client/index'
import { getPortal } from "@/data/client/auth-utils";
import { useSync } from "@/state/use-sync";
import { useQuery } from "@tanstack/react-query";
import { ChangePassword } from "@/components/ui/profile/ChangePassword";
import { UserProfileCard } from "@/components/ui/profile/UserProfileCard";
import { useAuth } from "@/state/use-auth";

const Profile = () => {
  const {profileDetails: personalInfo, setProfileDetails: setPersonalInfo} = useAuth();
  const [userData, setUserData] = useState<any>();
  const [userId, setUserId] = useState<any>();
  const [userObjectId, setUserObjectId] = useState<any>();
  const [cacheEnabled, setCacheEnabled] = useState<any>(true); 
  const portalId = getPortal()?.portalId;
  const { sync, setSync } = useSync();

  const [activeTab, setActiveTab] = useState<any>("password");


  const handlePersonalInfoChange = (e: any) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const fetchUserProfile = async ({ portalId, cache }: any) => {
    if (!portalId) return null;
  
    const response: any = await Client.user.profile({ portalId, cache });
    return response?.data;
  };
  
  const { data: userNewData, error, isLoading, refetch } = useQuery({
    queryKey: ['userProfilePage', portalId, cacheEnabled],
    queryFn: () => fetchUserProfile({ portalId, cache: sync ? false : true }), 
    onSuccess: (data: any) => {
      if (data) {
        setUserData(data);
        setUserId(data?.response?.hs_object_id?.value);
        setUserObjectId(data?.info?.objectTypeId);
      }
      setSync(false);
    },
    onError: (error: any) => {
      console.error("Error fetching profile:", error);
      setSync(false);
    }
  });
  
  useEffect(() => {
    if (sync) {  
      refetch();
    }
  }, [sync]);
  
  const setActiveTabFucntion = (active: any) => {
    // setParam("t", active);
    setActiveTab(active);
  };

  return (
    <div className="bg-[var(--sidebar-background-color)] mt-[calc(var(--nav-height)-1px)] h-[calc(100vh-var(--nav-height))] dark:bg-dark-300">
      <div
        className={`dark:bg-dark-200 CUSTOM-hide-scrollbar overflow-y-auto  h-[calc(100vh-var(--nav-height))] bg-cleanWhite dark:text-white md:px-4 px-3 `} >
        <div
          className={` md:pt-4 pt-3`}
        >
          <UserProfileCard userData={userData} isLoading={isLoading} />
          <div className={`w-full CUSTOM-hide-scrollbar overflow-y-auto overflow-x-hidden md:my-4 my-3`}>
            <div className={``}>
              {/* <div className="border rounded-lg dark:border-none bg-graySecondary dark:bg-dark-300 border-flatGray w-fit  my-4">
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
              {activeTab === "password" && ( */}
                <ChangePassword />
              {/* // )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile

export const Route = createFileRoute('/_auth/Profile')({
  component: Profile,
  beforeLoad: () => {
    return {
      layout: "MainLayout",
      requiresAuth: true,
    }
  },
})