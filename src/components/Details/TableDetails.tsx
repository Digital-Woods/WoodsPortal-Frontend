import { useSync } from "@/state/use-sync";
import { useTable } from "@/state/use-table";
import { useEffect } from "react";
import { ApiDetails } from "../ApiDetails";

export const TableDetails = ({ objectId, getData, states }: any) => {
  const { sync, setSync } = useSync();
  const { after } = useTable();

  const {
    setIsLoading,
    apiResponse,
  } = states;

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
      path={""}
      id={apiResponse?.data?.hs_object_id?.value}
      propertyName={""}
      showIframe={""}
      getPreData={getData}
      preData={apiResponse}
      states={states}
    />
  ) : (
    <div>No data...</div>
  );
};
