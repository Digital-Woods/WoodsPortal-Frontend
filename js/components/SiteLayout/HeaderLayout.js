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
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useResponsive();

  return (
    <nav className="bg-sidelayoutColor dark:bg-dark-300 md:px-6 px-3 flex gap-1 flex-col py-2 dark:bg-dark-200">
      <div className="flex justify-between text-end items-center">
        <div className="lg:hidden">
          <div className="cursor-pointer" onClick={toggleDrawer}>
            <p className="text-sidelayoutTextColor font-semibold  dark:text-white">
              <HamburgerMenu />
            </p>
          </div>
        </div>
        {isLargeScreen ?
          (env.DATA_SOURCE_SET !== true ? (
            <Breadcrumb id={id} title={title} path={path} />
          ) : (
            <div className="text-xs capitalize dark:text-cleanWhite">
              {title}
            </div>
          )) : <div>
          </div>}

        <div>
          <div className="flex gap-4 ">
            {env.DATA_SOURCE_SET != true ? (
              <div className="bg-none border-[1px] border-sidelayoutTextColor text-sidelayoutTextColor  dark:border-white dark:text-white rounded-full dark:bg-dark-400">
                <SyncButton />
              </div>
            ) : ('')
            }
            <div className="bg-none border-[1px] border-sidelayoutTextColor text-sidelayoutTextColor  dark:border-white dark:text-white  rounded-full dark:bg-dark-400">
              <ThemeSwitcher />
            </div>

            <div
              className=" bg-none border-[1px] p-3 border-sidelayoutTextColor text-sidelayoutTextColor  dark:border-white dark:text-white rounded-full dark:bg-dark-400  cursor-pointer  profile-section"
              onClick={toggleDropdown}
              ref={toggleButtonRef}
            >
              <NewAvater className='text-sidelayoutTextColor dark:text-white ' />
            </div>
          </div>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-8 mt-2 w-[280px] bg-cleanWhite rounded-md shadow-lg z-50 dark:bg-dark-400 z-[53]"
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
                      <div className="dark:text-white text-black">
                        <NewAvater/>
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

                <div
                  className="block hover:bg-gray-100 dark:hover:bg-dark-300 dark:hover:text-white px-3 py-2.5 rounded-md no-underline cursor-pointer"
                  // activeClassName="dark:bg-dark-300 dark:text-white bg-gray-100"
                  onClick={() => setLogoutDialog(true)}
                >
                  <div className="flex items-center gap-x-4">
                    <div  className="dark:text-white text-black" >
                      <LogOutIcon/>
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
      {!isLargeScreen &&
        (env.DATA_SOURCE_SET !== true ? (
          <Breadcrumb id={id} title={title} path={path} />
        ) : (
          <div className="text-xs capitalize dark:text-cleanWhite">
            {title}
          </div>
        ))}
    </nav>
  );
};
