const TableDetails = ({
  tableAPI,
  companyAsMediator,
  objectId,
  path,
  id,
  propertyName,
  showIframe,
}) => {
  const { sync, setSync } = useSync();
  const { apiResponse, setApiResponse, setIsLoading, after, getTableParam } = useTable();

  const { mutate: getData, isLoading } = useMutation({
    mutationKey: ["TableData"],
    mutationFn: async (props) => {
      setIsLoading(true)
      const param = getTableParam(companyAsMediator);
      return await Client.objects.all({
        API_ENDPOINT: tableAPI,
        param: param
      });
    },

    onSuccess: (data) => {
      setApiResponse(data);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
      setSync(false);
    },
  });

  useEffect(() => {
    if (!apiResponse) {
      setIsLoading(true);
      getData();
    }
  }, [apiResponse]);

  useEffect(() => {
    if (sync) {
      getData();
    }
  }, [sync]);

  useEffect(() => {
     getData();
  }, [after]);

  return apiResponse ? (
    <ApiDetails
      objectId={objectId}
      path={path}
      id={id}
      propertyName={propertyName}
      showIframe={showIframe}
      preData={apiResponse}
    />
  ) : (
    <div>No data...</div>
  );
};
