const ApiDetails = ({ path, objectId, id }) => {
  const [item, setItems] = useState(null);
  const [images, setImages] = useState([]);
  const [sortItems, setSortItems] = useState([]);
  const [associations, setAssociations] = useState({});
  const { me } = useMe();
  const [activeTab, setActiveTab] = useState("overview");

  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")

  const [galleryDialog, setGalleryDialog] = useState(false);
  const { error, isLoading } = useQuery({
    queryKey: ["DetailsData", path, id],
    queryFn: async () =>
      await Client.objects.byObjectId({
        path,
        objectId: objectId,
        id: id,
        mediatorObjectTypeId,
        mediatorObjectRecordId
      }),
    onSuccess: (data) => {
      const associations = data.data.associations
      setAssociations(associations);
      const details = data.data;
      const sortedItems = sortData(details, 'details');
      setItems(sortedItems);

      // if (data.data) {
      //   const finalData = JSON.parse(
      //     JSON.stringify(sortData(data.data, "details", path))
      //   );
      //   setSortItems(finalData);
      // }
      // if (data.data.associations) {
      //   const finalData = data.data.associations;
      //   setAssociations(finalData);
      // }
      // setItems(data.data);
      // getImages(data.data);
    },
  });

  const getImages = (data) => {
    if (data && data.image) {
      let urlArray = data.image.split(",");
      setImages(urlArray);
    }
    // setImages([]);
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-lightblue text-2xl font-semibold">
        Error fetching data
      </div>
    );
  }

  return (
    <div className="h-full dark:bg-dark-200 w-[100%] p-6">
      {isLoading && !item && <div className="loader-line"></div>}

      {item && (
        <div className=" flex ">
          <div className="w-[calc(100%_-350px)] pr-4">
            <DetailsHeaderCard
              bgImageClass="bg-custom-bg"
              date="17/01/2024"
              serviceName="AquaFlow Service"
              following="Following"
              path={path}
              item={item}
            />

            <div className="border rounded-lg  bg-graySecondary dark:bg-dark-300 border-flatGray w-fit dark:border-gray-700 my-4">
              <Tabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="rounded-md "
              >
                <TabsList>
                  <TabsTrigger value="overview">
                    <p className="text-black dark:text-white">Overview</p>
                  </TabsTrigger>
                  <TabsTrigger value="files">
                    <p className="text-black dark:text-white">Files</p>
                  </TabsTrigger>
                  <TabsTrigger value="notes">
                    <p className="text-black dark:text-white">Notes</p>
                  </TabsTrigger>
                  {/* <TabsTrigger value="photos">
                    <p className="text-black dark:text-white">Photos</p>
                  </TabsTrigger> */}
                </TabsList>

                <TabsContent value="overview"></TabsContent>
                <TabsContent value="files"></TabsContent>
                <TabsContent value="notes">{/* <Notes /> */}</TabsContent>
                {/* <TabsContent value="photos"></TabsContent> */}
              </Tabs>
            </div>

            {/* {(path === "/sites" || path === "/assets") && <DetailsMapsCard />} */}

            {/* {path === "/jobs" && (
              <div className="col-span-4">
                <DetailsTable item={item} path={path} />
              </div>
            )} */}
            {/* {sortItems && activeTab === "overview" && (
              <DetailsView item={item} sortItems={sortItems} />
            )} */}

            {activeTab === "overview" && (
              <DetailsView item={item}/>
            )}


            {activeTab === "files" && <Files fileId={id} path={path} objectId={objectId} id={id} />}

            {activeTab === "notes" && <Notes path={path} objectId={objectId} id={id} />}

            {images.length > 0 && activeTab === "photos" && (
              <DetailsGallery
                images={images}
                setGalleryDialog={setGalleryDialog}
              />
            )}
          </div>

          <div className="w-[350px]">
            <div className="max-h-[calc(100vh_-150px)] scrollbox pr-2 fixed w-[350px]">
              {associations &&
                Object.entries(associations).map(
                  ([key, association], index) => (
                    <DetailsAssociations
                      key={key}
                      association={association}
                      isActive={true}
                      parentObjectTypeName={path}
                      parentObjectTypeId={objectId}
                      parentObjectRowId={id}
                    />
                  )
                )}
            </div>
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
