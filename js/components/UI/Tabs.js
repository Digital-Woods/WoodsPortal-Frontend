const Tabs = ({ children, activeTab, setActiveTab = null, className }) => {
  const [selectedValue, setSelectedValue] = useState(activeTab);
  const handleTabClick = (value) => {
    setSelectedValue(value);
    if (setActiveTab != null) setActiveTab(value);
  };

  // Filter children to separate TabsList and content components
  const tabs = React.Children.toArray(children).filter(
    (child) => child.type === TabsList
  );
  const contents = React.Children.toArray(children).filter(
    (child) => child.type === TabsContent
  );

  // Throw error if structure is incorrect
  if (tabs.length !== 1 || contents.length !== children.length - 1) {
    throw new Error(
      "Tabs component requires exactly one TabsList and content for each tab trigger."
    );
  }

  // Map over tabs and contents to generate JSX elements
  const filteredTabls = tabs[0].props.children.filter(item => item !== null && item !== false && item !== undefined);
  const tabsList = React.Children.map(filteredTabls, (trigger) => (
    <TabsTrigger className="rounded-md"
      key={trigger.props.value}
      value={trigger.props.value}
      isActive={selectedValue === trigger.props.value}
      onClick={handleTabClick}
    >
      {trigger.props.children}
    </TabsTrigger>
  ));

  const tabContents = contents.map((content) => (
    <TabsContent
      key={content.props.value}
      hidden={selectedValue !== content.props.value}
    >
      {content.props.children}
    </TabsContent>
  ));

  return (
    <div className={`Tabs ${className}`}>
      <TabsList>{tabsList}</TabsList>
      {tabContents}
    </div>
  );
};

const TabsList = ({ children, className }) => (
  <ul
    className={`flex flex-wrap p-1 text-sm font-medium text-center  text-gray-500 dark:text-gray-400 TabsList ${className}`}
  >
    {children}
  </ul>
);

const TabsTrigger = ({ value, isActive, onClick, children }) => (
  <li
    className={`TabsTrigger ${isActive ? "active" : ""}`}
    role="tab"
    aria-selected={isActive}
    onClick={() => onClick(value)}
  >
    <button
      className={`inline-block px-4 py-2  rounded-md cursor-pointer rounded-md ${
        isActive
          ? "bg-cleanWhite dark:bg-dark-400 text-white"
          : "dark:bg-dark-300"
      }`}
      aria-current="page"
    >
      {children}
    </button>
  </li>
);

const TabsContent = ({ value, hidden, children }) => (
  <div
    className={`TabsContent ${hidden ? "hidden" : ""}`}
    role="tabpanel"
    aria-labelledby={`tab-${value}`}
  >
    {children}
  </div>
);
