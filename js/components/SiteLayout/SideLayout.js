const { useState } = React;

const NavLink = ({ to, className, activeClassName, children }) => {
  return (
    <NavLink
      to={to}
      className={`block hover:bg-primary p-3 hover:text-white rounded-md no-underline ${className}`}
      activeClassName={activeClassName}
    >
      {children}
    </NavLink>
  );
};

const SideLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      className={`w-${
        sidebarCollapsed ? "1/12" : "[24%]"
      } min-h-screen px-6 pt-6 pb-8 transition-width duration-300`}
    >
      <div>
        <div className="flex justify-between items-center mb-10">
          <div className="w-[60%] flex items-center">
            <Logo src="https://s3-media0.fl.yelpcdn.com/bphoto/dQaSKYTZdGzL7FNP3HcRCQ/348s.jpg" />
            <h1
              className={`text-xl font-semibold ml-4 ${
                sidebarCollapsed ? "hidden" : "block"
              }`}
            >
              STONBURY
            </h1>
          </div>
          <div className="cursor-pointer" onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="m480-193 85-85 57 56L480-80 338-222l57-56 85 85ZM193-480l85 85-56 57L80-480l142-142 56 57-85 85Zm574 0-85-85 56-57 142 142-142 142-56-57 85-85ZM480-767l-85 85-57-56 142-142 142 142-57 56-85-85Z" />
            </svg>
          </div>
        </div>
        <nav className="space-y-1">
          <NavLink
            to="/sites"
            className="block hover:bg-primary px-3 py-2.5 hover:text-white rounded-md no-underline"
            activeClassName="bg-primary text-white"
          >
            <div className="flex items-center gap-x-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="white"
                >
                  <path
                    d="M6.66667 2H2V6.66667H6.66667V2Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0002 2H9.3335V6.66667H14.0002V2Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0002 9.33337H9.3335V14H14.0002V9.33337Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.66667 9.33337H2V14H6.66667V9.33337Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={`${sidebarCollapsed ? "hidden" : ""}`}>Sites</p>
            </div>
          </NavLink>
          <NavLink
            to="/recoil-js"
            className="block hover:bg-primary  px-3 py-2.5 hover:text-white rounded-md no-underline"
            activeClassName="bg-primary text-white"
          >
            <div className="flex items-center gap-x-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="white"
                >
                  <path
                    d="M6.66667 2H2V6.66667H6.66667V2Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0002 2H9.3335V6.66667H14.0002V2Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0002 9.33337H9.3335V14H14.0002V9.33337Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.66667 9.33337H2V14H6.66667V9.33337Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={`${sidebarCollapsed ? "hidden" : ""}`}>Assets</p>
            </div>
          </NavLink>
          <NavLink
            to="/tanstack-query"
            className="block hover:bg-primary  px-3 py-2.5 hover:text-white rounded-md no-underline"
            activeClassName="bg-primary text-white"
          >
            <div className="flex items-center gap-x-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="white"
                >
                  <path
                    d="M6.66667 2H2V6.66667H6.66667V2Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0002 2H9.3335V6.66667H14.0002V2Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0002 9.33337H9.3335V14H14.0002V9.33337Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.66667 9.33337H2V14H6.66667V9.33337Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={`${sidebarCollapsed ? "hidden" : ""}`}>Jobs</p>
            </div>
          </NavLink>
          <div>
            <hr className="h-px my-1 bg-gray-100 border-0 dark:bg-gray-700" />
          </div>
          <NavLink
            to="/logout"
            className="block hover:bg-primary  px-3 py-2.5 hover:text-white rounded-md no-underline"
            activeClassName="bg-primary text-white"
          >
            <div className="flex items-center gap-x-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="white"
                >
                  <path
                    d="M6.66667 2H2V6.66667H6.66667V2Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0002 2H9.3335V6.66667H14.0002V2Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0002 9.33337H9.3335V14H14.0002V9.33337Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.66667 9.33337H2V14H6.66667V9.33337Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={`${sidebarCollapsed ? "hidden" : ""}`}>Log Out</p>
            </div>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};