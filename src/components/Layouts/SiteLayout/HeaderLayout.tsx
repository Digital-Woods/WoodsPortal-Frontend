import { useState, useEffect, useRef } from 'react';
import { env } from "@/env";
import { useCollapsible } from '@/state/use-collapsible'
import { useAuth } from '@/state/use-auth';
import { getFirstName, getLastName, getEmail, profileInitial } from '@/utils/DataMigration';
import { HamburgerMenu } from '@/assets/icons/HamburgerMenu'
import { Breadcrumb } from '@/components/Layouts/SiteLayout/Breadcrumb'
import { Tooltip } from '@/components/ui/Tooltip'
import { SyncButton } from '@/components/ui/SyncButton'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { Link } from '@/components/ui/link';
import { NewAvater } from '@/assets/icons/NewAvater'
import { LogOutIcon } from '@/assets/icons/LogOutIcon'

let globalNavHeight = 0;
export const HeaderLayout = (props: any) => {
  // const { title, path, id = null } = props;
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<any | null>(null);
  const toggleButtonRef = useRef<any | null>(null);
  const navRef = useRef<any | null>(null);
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed } = useCollapsible();
  const { logoutDialog, setLogoutDialog } = useAuth();

  
  // const [logoutDialog, setLogoutDialog] = Recoil.useRecoilState(logoutDialogState);
  // const [personalInfo, setPersonalInfo] = Recoil.useRecoilState(profileState);


  // const loggedInDetails = useRecoilValue(userDetailsAtom);

  const firstName = getFirstName();
  const email = getEmail();

  // function getFirstName(loggedInDetails: any, me: any) {
  //   if (loggedInDetails && loggedInDetails.firstName) {
  //     return loggedInDetails.firstName;
  //   } else if (me && me.firstName) {
  //     return me.firstName;
  //   } else {
  //     return "";
  //   }
  // }

  // function getEmail(loggedInDetails: any, me: any) {
  //   if (loggedInDetails && loggedInDetails.email) {
  //     return loggedInDetails.email;
  //   } else if (me && me.email) {
  //     return me.email;
  //   } else {
  //     return "";
  //   }
  // }

  useEffect(() => {
    if (navRef.current) {
      globalNavHeight = navRef.current.offsetHeight;
    }
    document.documentElement.style.setProperty(
      "--nav-height",
      `${globalNavHeight}px`
    );
  }, [globalNavHeight]);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: any) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  const lastName = getLastName() || "";
  const initials = profileInitial(firstName, lastName);

  return (
    <nav ref={navRef} className={`before:bg-sidelayoutColor before:dark:bg-dark-300 after:bg-sidelayoutColor after:dark:bg-dark-300 after:hidden max-lg:after:block bg-sidelayoutColor dark:bg-dark-300 lg:px-0 px-3 flex gap-1 flex-col py-1 dark:bg-dark-200 z-[49] duration-300 fixed top-0 right-0 w-full nav-rounded ${sidebarCollapsed ? "lg:w-[calc(100%_-_75px)]" : "lg:w-[calc(100%_-_250px)]"
      }`}>
      <div className="flex justify-between text-end items-center">
        <div className="lg:hidden">
          <div className="cursor-pointer" onClick={toggleDrawer}>
            <p className="text-sidelayoutTextColor font-semibold  dark:text-white">
              <HamburgerMenu />
            </p>
          </div>
        </div>
        <div className="max-lg:hidden">
          <Breadcrumb {...props} />
        </div>
        <div>
          <div className="flex gap-2 items-center">

            <div className="text-sidelayoutTextColor  dark:border-white dark:text-white rounded-md hover:bg-gray-600 dark:hover:bg-dark-400">
              <Tooltip content={`Clear cache`}>
                <SyncButton />
              </Tooltip>
            </div>

            <div className="text-sidelayoutTextColor  dark:border-white dark:text-white  rounded-md hover:bg-gray-600 dark:hover:bg-dark-400">
              <ThemeSwitcher />
            </div>

            <div className="w-px h-6 bg-gray-600 dark:bg-dark-400"></div>

            <div
              className=" px-3 py-1 text-sidelayoutTextColor  dark:border-white dark:text-white rounded-md hover:bg-gray-600 dark:hover:bg-dark-400  cursor-pointer  profile-section mr-1"
              onClick={toggleDropdown}
              ref={toggleButtonRef}
            >
              <Tooltip position='left' content={`My profile`}>
                <div className="flex gap-2 items-center">
                  <div className="rounded-full h-[30px] w-[30px] flex items-center justify-center bg-gray-400 text-white text-xs font-medium">
                    {initials}
                  </div>
                  <div className="flex items-start flex-col">
                    <div className="font-medium text-xs dark:text-white break-all">
                      {firstName ? firstName : ""} {lastName ? lastName : ""}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>

          </div>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-8 border dark:border-gray-600 w-[280px] bg-cleanWhite rounded-md shadow-lg dark:bg-dark-400 z-[53]"
            >
              <div className="flex flex-col p-4">
                <div className="flex gap-2 items-center">
                  <div className="rounded-full h-[50px] w-[50px] flex items-center justify-center bg-gray-400 text-white text-lg font-medium">
                    {initials}
                  </div>
                  <div className=" flex items-start flex-col">
                    <div className="font-semibold dark:text-white break-all">
                      {firstName}
                    </div>
                    <p className="text-xs text-secondary dark:text-gray-400 break-all">
                      {email}
                    </p>
                  </div>
                </div>
              </div>
              <hr className="border-t border-gray-200 dark:border-gray-600" />
              <div className="flex flex-col gap-y-1  p-2">
                {env.VITE_DATA_SOURCE_SET === 'false' &&
                  <Link
                    to="/profile"
                    className="block hover:bg-gray-100 dark:hover:bg-dark-300 dark:hover:text-white px-3 py-2.5 rounded-md no-underline"
                    activeClassName="dark:bg-dark-300 dark:text-white bg-gray-100"
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="dark:text-white text-black">
                        <NewAvater />
                      </div>
                      <p
                        className={`
                       text-black text-sm font-medium dark:text-white`}
                      >
                        My Profile
                      </p>
                    </div>
                  </Link>
                }

                <div
                  className="block hover:bg-gray-100 dark:hover:bg-dark-300 dark:hover:text-white px-3 py-2.5 rounded-md no-underline cursor-pointer"
                  // activeClassName="dark:bg-dark-300 dark:text-white bg-gray-100"
                  onClick={() => setLogoutDialog(true)}
                >
                  <div className="flex items-center gap-x-4">
                    <div className="dark:text-white text-black" >
                      <LogOutIcon />
                    </div>
                    <p
                      className={`
                       text-black text-sm font-medium  dark:text-white`}
                    >
                      Logout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="lg:hidden">
        <Breadcrumb {...props} />
      </div>
    </nav>
  );
};
