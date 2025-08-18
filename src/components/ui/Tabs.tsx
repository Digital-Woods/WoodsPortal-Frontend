import React, { useState } from 'react';

export const Tabs = ({ children, activeTab, setActiveTab = null, className }: any) => {
  const [selectedValue, setSelectedValue] = useState(activeTab);
  const handleTabClick = (value: any) => {
    setSelectedValue(value);
    if (setActiveTab != null) setActiveTab(value);
  };

  // Filter children to separate TabsList and content components
  const tabs = React.Children.toArray(children).filter(
    (child: any) => child.type === TabsList
  );
  const contents = React.Children.toArray(children).filter(
    (child: any) => child.type === TabsContent
  );

  // Throw error if structure is incorrect
  if (tabs.length !== 1 || contents.length !== children.length - 1) {
    throw new Error(
      "Tabs component requires exactly one TabsList and content for each tab trigger."
    );
  }

  // Map over tabs and contents to generate JSX elements
  const filteredTabls = React.Children.toArray(tabs[0].props.children);
  const tabsList = React.Children.map(filteredTabls, (trigger: any) => (
    <TabsTrigger className="rounded-md"
      key={trigger.props.value}
      value={trigger.props.value}
      isActive={selectedValue === trigger.props.value}
      onClick={handleTabClick}
    >
      {trigger.props.children}
    </TabsTrigger>
  ));

  const tabContents = contents.map((content: any) => (
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

export const TabsList = ({ children, className }: any) => (
  <ul
    className={`flex flex-wrap p-1 text-sm font-medium text-center list-none text-gray-500 dark:text-gray-400 TabsList ${className}`}
  >
    {children}
  </ul>
);

export const TabsTrigger = ({ value, isActive, onClick, children }: any) => (
  <li
    className={`TabsTrigger ${isActive ? "active" : ""}`}
    role="tab"
    aria-selected={isActive}
    onClick={() => onClick(value)}
  >
    {/* <button
      className={`inline-block px-4 py-2  rounded-md cursor-pointer hover:bg-gray-50 rounded-md ${
        isActive
          ? "bg-cleanWhite dark:bg-dark-400 text-white"
          : "dark:bg-dark-300"
      }`}
      aria-current="page"
    >
      {children}
    </button> */}

    {/* hover color added to the buttons */}
    <button
  className={`inline-block px-4 py-2 rounded-md cursor-pointer mx-1 
    ${isActive
       ? "bg-cleanWhite dark:bg-dark-400 text-white" 
       : "hover:bg-gray-50 dark:hover:bg-dark-500 dark:bg-dark-300"}
  `}
  aria-current="page"
>
  {children}
</button>

  </li>
);

export const TabsContent = ({ value, hidden, children }: any) => (
  <div
    className={`TabsContent ${hidden ? "hidden" : ""}`}
    role="tabpanel"
    aria-labelledby={`tab-${value}`}
  >
    {children}
  </div>
);
