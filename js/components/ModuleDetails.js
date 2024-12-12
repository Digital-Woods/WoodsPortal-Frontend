const ModuleDetails = ({ path, id }) => {
  const [item, setItems] = useState(null);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [filesUrl, setFilesUrl] = useState([]);
  const [sortItems, setSortItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [galleryDialog, setGalleryDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let objList = hubSpotTableData.data.results || [];

  const headerPath = path.replace(/\//g, "");

  const result = objList.find((item) => item.name === headerPath);

  let listData = result ? result.results.rows : [];

  useEffect(() => {
    if (Array.isArray(objList) && objList.length > 0) {

      const idStr = String(id);
      let data = listData.find((item) => String(item.id) === idStr);
      if (data) {

        data = { data, statusCode: 200 };

        const structuredData = Object.keys(data.data).reduce((acc, key) => {
          if (key === 'files' || key === 'images') {
            return acc;
          }
          acc[key] = {
            isSecondaryDisplayProperty: false,
            label: formatLabel(key),
            value: data.data[key],
            isPrimaryDisplayProperty: false
          };
          return acc;
        }, {});

        
        const finalData = JSON.parse(
          JSON.stringify(sortData(structuredData, "details")) 
        );
        setSortItems(finalData);
        setItems(finalData);
        getImages(data.data);
        getFilesUrl(data.data);
      } else {
        console.error('No data found with matching ID');
      }
    } else {
      console.error('Error: objList is not a valid array');
    }

    setIsLoading(false);
  }, [objList, id]);

  const formatLabel = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalizes and removes underscores
  };

  const getImages = (data) => {
    if (data && data.images) {
      let urlArray = data.images.split(",");
      setImages(urlArray);
    } else {
      setImages([]);
    }
  };

  const getFilesUrl = (data) => {
    if (data && data.files) {
      let urlArray = data.files.split(",");
      setFilesUrl(urlArray);
    } else {
      setFilesUrl([]);
    }
  };


  useEffect(() => {
    if (filesUrl.length > 0) {
      const fetchFileDetails = async () => {
        const fileDetails = await getFileDetails(filesUrl);
        setFiles(fileDetails);
      };

      fetchFileDetails();
    }
  }, [filesUrl]);



  const goBack = () => {
    window.history.back();
  };



  if (!item) {
    return (
      <div className="w-full h-[calc(100vh_-110px)] flex flex-col items-center justify-center dark:text-white text-dark-300 bg-cleanWhite dark:bg-dark-200 md:text-2xl text-base font-semibold">
        Error fetching data
      </div>
    );
  }

  return (
    <div className="h-full dark:bg-dark-200 w-[100%] p-6">
      {isLoading && !item && <div className="loader-line"></div>}

      {item && (
        <div className=" flex flex-col gap-4">
          <div>
            <button onClick={goBack} className="text-primary dark:text-white flex items-center gap-2">
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                height="1rem"
                width="1rem"
              >
                <path d="M793 242H366v-74c0-6.7-7.7-10.4-12.9-6.3l-142 112a8 8 0 000 12.6l142 112c5.2 4.1 12.9.4 12.9-6.3v-74h415v470H175c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-28.7 64-64V306c0-35.3-28.7-64-64-64z" />
              </svg>
              <span className="text-sm font-semibold">
                Go Back
              </span>
            </button>
          </div>
          <div className="w-full pr-4">
            {/* <DetailsHeaderCard
              bgImageClass="bg-custom-bg"
              plantName="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed."
              date="17/01/2024"
              serviceName="AquaFlow Service"
              following="Following"
              path={path}
              item={item}
            /> */}

            <div className="border rounded-lg  bg-graySecondary dark:bg-dark-300 border-flatGray w-fit dark:border-gray-700 my-4">
              <Tabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="rounded-md "
              >
                <TabsList>
                  <TabsTrigger className="rounded-md" value="overview">
                    <p className="text-black dark:text-white">Overview</p>
                  </TabsTrigger>
                  <TabsTrigger className="rounded-md" value="files">
                    <p className="text-black dark:text-white">Files</p>
                  </TabsTrigger>
                  {/* <TabsTrigger className="rounded-md" value="notes">
                    <p className="text-black dark:text-white">Notes</p>
                  </TabsTrigger> */}
                  <TabsTrigger className="rounded-md" value="photos">
                    <p className="text-black dark:text-white">Photos</p>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview"></TabsContent>
                <TabsContent value="files"></TabsContent>
                {/* <TabsContent value="notes"><Notes /></TabsContent> */}
                <TabsContent value="photos"></TabsContent>
              </Tabs>
            </div>

            {(path === "/sites" || path === "/assets") && <DetailsMapsCard />}

            {path === "/jobs" && (
              <div className="col-span-4">
                <DetailsTable item={item} path={path} />
              </div>
            )}
            {sortItems && activeTab === "overview" && (
              <DetailsView item={item} sortItems={sortItems} />
            )}

            {
              activeTab === "files"
                ? env.DATA_SOURCE_SET !== true
                  ? <Files fileId={id} path={path} />
                  : <ModuleFileTable files={files} />
                : null
            }


            {/* {activeTab === "notes" && <Notes />} */}

            {activeTab === "photos" ? (
              images.length > 0 ? (
                <DetailsGallery
                  images={images}
                  setGalleryDialog={setGalleryDialog}
                />
              ) : (
                <div className="dark:text-white h-[60vh] flex items-center justify-center">
                  No Photos Found
                </div>
              )
            ) : null}

          </div>

          <Dialog
            open={galleryDialog}
            onClose={setGalleryDialog}
            className="w-[50%]"
          >
            <div className=" bg-cleanWhite dark:bg-dark-100 dark:text-white rounded-md flex-col justify-start items-center gap-6 inline-flex">
              <div className="grid grid-cols-2 gap-4">
                {images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-auto"
                  />
                ))}
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </div>
  );
};
