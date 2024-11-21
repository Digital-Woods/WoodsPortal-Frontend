const HeaderLayout = ({ title, path, id = null }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const [logoutDialog, setLogoutDialog] = Recoil.useRecoilState(logoutDialogState);
  const { sidebarOpen, setSidebarOpen } = useCollapsible();
  const [personalInfo, setPersonalInfo] = Recoil.useRecoilState(profileState);

  const { me, getMe } = useMe();
  const loggedInDetails = useRecoilValue(userDetailsAtom);

  const firstName = getFirstName(loggedInDetails, me);
  const email = getEmail(loggedInDetails, me);

  function getFirstName(loggedInDetails, me) {
    if (loggedInDetails && loggedInDetails.firstName) {
      return loggedInDetails.firstName;
    } else if (me && me.firstName) {
      return me.firstName;
    } else {
      return "";
    }
  }

  function getEmail(loggedInDetails, me) {
    if (loggedInDetails && loggedInDetails.email) {
      return loggedInDetails.email;
    } else if (me && me.email) {
      return me.email;
    } else {
      return "";
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
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

  return (
    <nav className="flex bg-sidelayoutColor dark:bg-dark-300 justify-between items-center px-6 py-2 dark:bg-dark-200">
      {env.DATA_SOURCE_SET != true ? (
        <Breadcrumb id={id} title={title} path={path} />
      ) : (
        <div className="text-xs capitalize dark:text-cleanWhite">
          {title}
        </div>
      )}
      <div className="lg:hidden">
        <div className="cursor-pointer" onClick={toggleDrawer}>
          <p className="text-sidelayoutTextColor font-semibold  dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className="dark:fill-white fill-sidelayoutTextColor"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </p>
        </div>
      </div>

      <div>
        <div className="flex gap-4 ">
          {env.DATA_SOURCE_SET != true ? (
            <div className="bg-none border-[1px] border-sidelayoutTextColor rounded-full dark:bg-dark-400">
              <SyncButton />
            </div>
          ) : ('')
          }
          <div className="bg-none border-[1px] border-sidelayoutTextColor rounded-full dark:bg-dark-400">
            <ThemeSwitcher />
          </div>

          <div
            className=" bg-none border-[1px] border-sidelayoutTextColor rounded-full dark:bg-dark-400  cursor-pointer  profile-section"
            onClick={toggleDropdown}
            ref={toggleButtonRef}
          >
                <NewAvater  />
          </div>
        </div>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-8 mt-2 w-[280px] bg-cleanWhite rounded-md shadow-lg z-50 dark:bg-dark-400"
          >
            <div className="flex flex-col p-4">
              <div className="flex">
                <Avatar
                  src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                  alt="user photo"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-4 flex flex-col">
                  <div className="font-semibold dark:text-white break-all">
                    {firstName}
                  </div>
                  <p className="text-xs text-primary dark:text-gray-400 break-all">
                    {email}
                  </p>
                </div>
              </div>
            </div>
            <hr className="border-t border-gray-200 dark:border-gray-600" />
            <div className="flex flex-col gap-y-1  p-2">
              {env.DATA_SOURCE_SET === false &&
                <NavLink
                  to="/profile"
                  className="block hover:bg-gray-100 dark:hover:bg-dark-300 dark:hover:text-white px-3 py-2.5 rounded-md no-underline"
                  activeClassName="dark:bg-dark-300 dark:text-white bg-gray-100"
                >
                  <div className="flex items-center gap-x-4">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        className="dark:fill-white fill-black"
                      >
                        <path d="M392.15-492.31q-27.42 0-45.71-20.46-18.28-20.46-14.44-48l12.62-96.84q6.84-49.7 45.46-82.2 38.61-32.5 89.92-32.5t89.92 32.5q38.62 32.5 45.46 82.2L628-560.77q3.84 27.54-14.44 48-18.29 20.46-45.71 20.46h-175.7Zm-1.15-60h178l-13-96q-4-28-25.5-46t-50.5-18q-29 0-50.5 18t-25.5 46l-13 96Zm89 0ZM180-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q780-306 780-276.62v88.93H180Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q534.7-367.69 480-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240 0Z" />
                      </svg>
                    </div>
                    <p
                      className={`
                       text-black text-sm font-medium dark:text-white`}
                    >
                      My Profile
                    </p>
                  </div>
                </NavLink>
              }
              {/* 
              <NavLink
                to="/logout"
                className="block hover:bg-gray-100 dark:hover:bg-dark-300 dark:hover:text-white px-3 py-2.5 rounded-md no-underline "
                activeClassName="dark:bg-dark-300 dark:text-white bg-gray-100"
              >
                <div className="flex items-center gap-x-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      className="dark:fill-white fill-black"
                    >
                      <path d="M742.61-165q-109.07-9-209.69-57.58-100.61-48.58-182.19-130.34-81.57-81.77-129.15-181.7Q174-634.54 164-743.61q-2-21.17 12.29-36.78Q190.57-796 212-796h104.46q18.15 0 31.23 10.89 13.08 10.88 18.23 28.42L386.85-673q2.38 13.38-1.5 26.15-3.89 12.77-12.66 20.77l-92.38 89.93q22.3 41.84 49.46 78.77 27.15 36.92 59.51 69.06 31.95 31.94 69.03 59.17t80.08 49.54l94.76-92.54q8.39-8.77 19.24-11.7 10.84-2.92 24.23-.92l80.07 17.62q18.15 5 28.73 18.46 10.58 13.46 10.58 32V-213q0 21.43-16.11 35.71Q763.78-163 742.61-165ZM256.92-586.92l75.39-72.31q1.92-1.54 2.5-4.23.58-2.69-.19-5l-17.55-69.39q-.77-3.07-2.69-4.61-1.92-1.54-5-1.54H223q-2.31 0-3.85 1.54-1.53 1.54-1.53 3.85 3.07 38 13.42 75.8 10.34 37.81 25.88 75.89Zm334 331.69q35.87 15.78 75.01 23.97 39.15 8.18 72.68 12.03 2.31 0 3.85-1.54t1.54-3.85v-86.15q0-3.08-1.54-5t-4.61-2.69l-65-14.08q-2.31-.77-4.04-.19-1.73.58-3.66 2.5l-74.23 75Zm-334-331.69Zm334 331.69Z" />
                    </svg>
                  </div>
                  <p
                    className={`
                      text-black text-sm font-medium dark:text-white`}
                  >
                    Contact Info
                  </p>
                </div>
              </NavLink>

              <NavLink
                to="/logout"
                onClick={logout}
                className="block hover:bg-gray-100 dark:hover:bg-dark-300 dark:hover:text-white px-3 py-2.5 rounded-md no-underline"
                activeClassName="dark:bg-dark-300 dark:text-white bg-gray-100"
              >
                <div className="flex items-center gap-x-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      className="dark:fill-white fill-black"
                    >
                      <path d="M276.03-116q-26.64 0-45.34-18.84Q212-153.69 212-180.31v-359.38q0-26.62 18.84-45.47Q249.69-604 276.31-604H308v-96q0-71.6 50.27-121.8Q408.53-872 480.23-872q71.69 0 121.73 50.2Q652-771.6 652-700v96h31.69q26.62 0 45.47 18.84Q748-566.31 748-539.69v359.38q0 26.62-18.86 45.47Q710.29-116 683.65-116H276.03Zm.28-52h407.38q5.39 0 8.85-3.46t3.46-8.85v-359.38q0-5.39-3.46-8.85t-8.85-3.46H276.31q-5.39 0-8.85 3.46t-3.46 8.85v359.38q0 5.39 3.46 8.85t8.85 3.46Zm203.9-130q25.94 0 43.87-18.14Q542-334.27 542-360.21t-18.14-43.87Q505.73-422 479.79-422t-43.87 18.14Q418-385.73 418-359.79t18.14 43.87Q454.27-298 480.21-298ZM360-604h240v-96q0-50-35-85t-85-35q-50 0-85 35t-35 85v96Zm-96 436v-384 384Z" />
                    </svg>
                  </div>
                  <p
                    className={`
                       text-black text-sm font-medium dark:text-white`}
                  >
                    Security
                  </p>
                </div>
              </NavLink> */}

              <div
                className="block hover:bg-gray-100 dark:hover:bg-dark-300 dark:hover:text-white px-3 py-2.5 rounded-md no-underline cursor-pointer"
                // activeClassName="dark:bg-dark-300 dark:text-white bg-gray-100"
                onClick={() => setLogoutDialog(true)}
              >
                <div className="flex items-center gap-x-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      className="dark:fill-white fill-black"
                    >
                      <path d="M228.31-164q-27.01 0-45.66-18.65Q164-201.3 164-228.31v-503.38q0-27.01 18.65-45.66Q201.3-796 228.31-796h252.07v52H228.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v503.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h252.07v52H228.31Zm428.92-177.23-37.54-36.39L696.08-454H387.85v-52h308.23l-76.39-76.38 37.54-36.39L796-480 657.23-341.23Z" />
                    </svg>
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
    </nav>
  );
};
