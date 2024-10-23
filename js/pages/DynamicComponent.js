const { useState, useEffect } = React;
const { useQuery } = ReactQuery;

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
);


const DynamicComponent = ({ hubspotObjectTypeId, path, title }) => {
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("account");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const viewText =
    (activeTab === "account"
      ? `Table view of ${title}`
      : `List view of ${title}`
    )
      .charAt(0)
      .toUpperCase() +
    (activeTab === "account"
      ? `Table view of ${title}`
      : `List view of ${title}`
    )
      .slice(1)
      .toLowerCase();

  const objectTypeName = getParam("objectTypeName")
  const tableTitle = () => {
    return objectTypeName ? objectTypeName : title
  }

  const back = () => {
    window.location.hash = `${getParam("parentObjectTypeName")}/${getParam("parentObjectTypeId")}/${getParam("parentObjectRowId")}`;
  }

  return (
    <div className="dark:bg-dark-200  dark:text-white p-6">
      <div className="flex justify-between items-center relative">
        <div className="flex items-center">
          {objectTypeName &&
            <div className="pr-2 cursor-pointer" onClick={() => back()}>
              <BackIcon />
            </div>
          }
          <span className="text-xl font-semibold text-primary dark:text-white">
            {tableTitle()}
          </span>
          <p className="text-secondary  dark:text-white leading-5 text-sm">
            {viewText}
          </p>
        </div>

        {/* <div className="centered-tab border rounded-lg p-1 bg-cleanWhite dark:bg-dark-300 border-flatGray dark:border-gray-700 ">
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="rounded-md "
          >
            <TabsList>
              <TabsTrigger value="account">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="currentcolor"
                  className="dark:fill-white"
                >
                  <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z" />
                </svg>
              </TabsTrigger>
              <TabsTrigger value="password">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="currentcolor"
                  className="dark:fill-white"
                >
                  <path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" />
                </svg>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account"></TabsContent>
            <TabsContent value="password"></TabsContent>
          </Tabs>
        </div> */}

        {/* <div>
          <Button className="text-white">
            New Site <span className="ml-2"> + </span>{" "}
          </Button>
        </div> */}
      </div>

      {activeTab === "account" ? (
        <div>
          <div className="flex flex-col justify-end items-end py-6">
            {/* <div className="flex gap-x-4">
              <CustomCheckbox buttonText="Sites" spanText="3" showSpan={true} />
              <CustomCheckbox buttonText="Asset" spanText="3" showSpan={true} />
              <CustomCheckbox
                buttonText="Status"
                spanText="3"
                showSpan={true}
              />
              <CustomCheckbox
                buttonText="Job Type"
                spanText="3"
                showSpan={true}
              />
            </div> */}

            {/* <div className="w-[25%]">
              <Input
                className="dark:bg-dark-400"
                value={inputValue}
                onChange={handleInputChange}
              />
            </div> */}
          </div>

          {/* <DashboardTable path={path} inputValue={inputValue} /> */}
          <DashboardTable hubspotObjectTypeId={hubspotObjectTypeId} path={path} title={title} />
        </div>
      ) : (
        <div className="dark:text-white text-cleanWhite">
          Under Construction
        </div>
      )}
    </div>
  );
};
