import React, { useState, useEffect } from 'react';
import { env } from "@/env";
import { useSync } from '@/state/use-sync';
import { sortData, renderCellContent, wait } from '@/utils/DataMigration';
import { getParam } from '@/utils/param';
import { getPortal } from '@/data/client/auth-utils';
import { useMutation } from "@tanstack/react-query";
import { Client } from '@/data/client/index'
import { updateParamsFromUrl } from '@/utils/param'
import { EmptyMessageCard } from '@/components/ui/EmptyMessageCard'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { Pagination } from '@/components/ui/Pagination'
import { DashboardTableForm } from '@/components/ui/Table/DashboardTableForm'
import { HomeSidebarSkeleton } from '@/components/ui/skeletons/HomeSidebarSkeleton'
import { hubSpotUserDetails } from '@/data/hubSpotData'
import { Chevron } from '@/assets/icons/Chevron'
import { IconPlus } from '@/assets/icons/IconPlus'
import { useAuth } from '@/state/use-auth';
import { useMakeLink } from '@/utils/GenerateUrl';


export const SidebarTable = ({ hubspotObjectTypeId, path, inputValue, pipeLineId, specPipeLine, title, companyAsMediator, apis, detailsView = true, editView = false }: any) => {
  const { makeLink } = useMakeLink()
  const [showAddDialog, setShowAddDialog] = useState<any>(false);
  // const [showEditDialog, setShowEditDialog] = useState<any>(false);
  // const [showEditData, setShowEditData] = useState<any>(false);
  // const { BrowserRouter, Route, Switch, withRouter } = window.ReactRouterDOM;
  const [tableData, setTableData] = useState<any>([]);
  const [currentTableData, setCurrentTableData] = useState<any>([]);
  const [totalItems, setTotalItems] = useState<any>(0);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [tableHeader, setTableHeader] = useState<any>([]);
  const [after, setAfter] = useState<any>("");
  const [sortConfig, setSortConfig] = useState<any>("-hs_createdate");
  const [filterPropertyName, setFilterPropertyName] = useState<any>(null);
  const [filterOperator, setFilterOperator] = useState<any>(null);
  const [filterValue, setFilterValue] = useState<any>(null);
  // const [openModal, setOpenModal] = useState<any>(false);
  // const [modalData, setModalData] = useState<any>(null);
  const [numOfPages, setNumOfPages] = useState<any>(Math.ceil(totalItems / itemsPerPage));
  const { sync, setSync } = useSync();
  const [isExpanded, setIsExpanded] = useState<any>(false);
  const [hoverRow, setHoverRow] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [urlParam, setUrlParam] = useState<any>(null);
  const [singularModalTitle, setSingularModalTitle] = useState<any>(null);
  const { subscriptionType }: any = useAuth();

  useEffect(() => {
    setNumOfPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  useEffect(() => {
    const hash = location.hash; // Get the hash fragment
    const queryIndex = hash.indexOf("?"); // Find the start of the query string in the hash
    const queryParams: any = new URLSearchParams(hash.substring(queryIndex)); // Parse the query string

    setFilterPropertyName(queryParams.get("filterPropertyName"));
    setFilterOperator(queryParams.get("filterOperator"));
    setFilterValue(queryParams.get("filterValue"));
  }, [location.search]);

  const mapResponseData = (data: any) => {
    if (env.VITE_DATA_SOURCE_SET === true) {
      const results = data.data.results || [];

      const foundItem = results.find((item: any) => {
        return item.name === path ? path?.replace("/", "") : "";
      });
      setCurrentTableData(foundItem.results.rows);
      setTotalItems(foundItem.results.rows.length || 0);
      setItemsPerPage(foundItem.results.rows.length > 0 ? itemsPerPage : 0);
      if (foundItem.results.rows.length > 0) {
        setTableHeader(sortData(foundItem.results.columns));
      } else {
        setTableHeader([]);
      }

    } else {
      const results = data.data.results.rows || [];
      const columns = data.data.results.columns || [];
      setTableData(results);
      setTotalItems(data.data.total || 0);
      setItemsPerPage(results.length > 0 ? itemsPerPage : 0);
      setTableHeader(sortData(columns));
    }
  };
  const mediatorObjectTypeId = getParam("mediatorObjectTypeId")
  const mediatorObjectRecordId = getParam("mediatorObjectRecordId")
  const parentObjectTypeName = getParam("parentObjectTypeName")
  const objectTypeId = getParam("objectTypeId")
  const objectTypeName = getParam("objectTypeName")

  let portalId;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId
  }
  const { mutate: getData, data: tableAPiData, isLoading } = useMutation({
    mutationKey: ["TableData"],
    mutationFn: async (props) => {

      // const param: any = {
      //   limit: itemsPerPage || 10,
      //   page: currentPage,
      //   ...(after && after.length > 0 && { after }),
      //   sort: sortConfig,
      //   filterPropertyName: 'hs_pipeline',
      //   filterOperator: 'eq',
      //   filterValue: specPipeLine ? pipeLineId : '',
      //   cache: sync ? false : true,
      //   isPrimaryCompany: companyAsMediator ? companyAsMediator : false,
      // };
      let param: any = {};

      const baseParams: any = {
        sort: sortConfig,
        filterPropertyName: 'hs_pipeline',
        filterOperator: 'eq',
        filterValue: specPipeLine ? pipeLineId : '',
        cache: sync ? false : true,
        isPrimaryCompany: companyAsMediator ? companyAsMediator : false,
      };

      if (subscriptionType === "FREE") {
        param = {
          ...baseParams,
          ...({ after: currentPage }),
        };
      } else {
        param = {
          ...baseParams,
          ...({
            limit: itemsPerPage || 10,
            page: currentPage,
            ...(after && after.length > 0 && { after }),
          }),
        };
      }

      setUrlParam(param);
      if (companyAsMediator) param.mediatorObjectTypeId = '0-2';
      return await Client.objects.all({
        API_ENDPOINT: apis.tableAPI,
        param: updateParamsFromUrl(apis.tableAPI, param)
      });
    },

    onSuccess: (data: any) => {
      setSync(false); // Ensure sync state resets after fetching data
      if (data.statusCode === "200") {
        mapResponseData(data);
        setPermissions(data.configurations["object"]);
        setNumOfPages(Math.ceil(data.data.total / itemsPerPage));
      }
    },

    onError: (error: any) => {
      console.error("API Error:", error); // Log errors if API call fails
      setSync(false);
      setTableData([]);
      setPermissions(null);
    },
  });


  const handlePageChange = async (page: any) => {
    setCurrentPage(page);
    setAfter((page - 1) * itemsPerPage);// Adjust 'after' calculation
    await wait(100);
    getData();
  };

  useEffect(() => {
    if (env.VITE_DATA_SOURCE_SET === true) {
      setTableData(currentTableData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ));
    }
  }, [currentTableData, currentPage, itemsPerPage]);

  useEffect(() => {
    if (sync) getData();
  }, [sync]);

  useEffect(() => {
    getData();
  }, []);

  const toggleContent = () => {
    setIsExpanded((prev: any) => !prev);
  };
  const handleRowHover = (row: any) => {
    setHoverRow(row)
  };

  useEffect(() => {
    setSingularModalTitle(
      title.endsWith("s")
        ? title.slice(0, -1)
        : title
    )
  }, [title])

  return (
    <div className="bg-[var(--right-tables-background-color)] rounded-lg px-4 pt-2 w-full max-w-md dark:bg-dark-300">
      <div className="flex items-center justify-between gap-x-2 text-sm font-medium pt-3 pb-4">
        <div className="flex items-center gap-x-2">
          <div onClick={toggleContent} className="cursor-pointer ">
            <Tooltip id={"HomeToggleButton"} content={isExpanded ? 'Shrink' : 'Expand'}>
              <span className="text-secondary dark:!text-white">
                {isExpanded ? (
                  <Chevron className="rotate-[270deg] origin-center -webkit-transform" />
                ) : (
                  <Chevron className="rotate-180 origin-center -webkit-transform" />
                )}
              </span>
            </Tooltip>
          </div>
          <span>
            <span className="dark:!text-white text-secondary font-bold text-xs">{title}</span>
            <span className="ml-2 px-2 py-1 rounded-md bg-secondary dark:bg-white dark:text-dark-300 text-white text-xs">
              {totalItems}
            </span>
          </span>
        </div>
        {/* {isExpanded ? <IconMinus className='font-semibold fill-[var(--right-tables-text-color)] dark:fill-white' /> : <IconPlus className='font-semibold fill-[var(--right-tables-text-color)] dark:fill-white' />} */}
        {(permissions?.create) && (
          <div className="text-end cursor-pointer ">
            <Button className='font-semibold text-xs' variant="link" size='link' onClick={() => setShowAddDialog(true)}>
              <span className="mr-1">
                <IconPlus className="!w-3 !h-3" />
              </span>
              Add
            </Button>
          </div>
        )}
      </div>
      {isLoading && <div className={``}><HomeSidebarSkeleton /></div>}
      {!isLoading && tableData.length === 0 && (
        <div className="text-center p-5">
          <EmptyMessageCard name={hubSpotUserDetails.sideMenu[0].tabName === title ? 'item' : title} type='col' className='p-0' />
          {(tableAPiData && tableAPiData.data && tableAPiData.data.configurations && tableAPiData.data.configurations.association) &&
            <p className="text-secondary text-base md:text-2xl dark:text-gray-300 mt-3">
              {tableAPiData.data.configurations.associationMessage}
            </p>
          }
        </div>
      )}
      {!isLoading && tableData.length > 0 && (
        <React.Fragment>
          <ul className={`space-y-4 transition-all duration-300 ease-in-out ${isExpanded ? "max-h-auto" : "max-h-[270px] overflow-y-auto CUSTOM-hide-scrollbar"}`}>
            {tableData.map((item: any) => (
              <table key={item.id} className="flex items-start !text-[var(--right-tables-text-color)] !bg-[var(--right-tables-card-background-color)] dark:!text-white dark:!bg-dark-500 p-2 flex-col gap-1 border !border-transparent dark:!border-gray-600 rounded-md justify-between">
                {tableHeader.map((column: any) => (
                  <tr
                    key={column.value}
                    className=""
                    onMouseEnter={() => handleRowHover(item)}
                    onMouseLeave={() => handleRowHover(null)}
                  >
                    <td className="pr-1 text-xs whitespace-wrap md:w-[120px] w-[100px] align-top dark:!text-white !text-[var(--right-tables-text-color)] !p-[3px]">{column.value}: </td>

                    <td className="dark:!text-white text-xs whitespace-wrap  !text-[var(--right-tables-text-color)] break-all  !p-[3px]">
                      {renderCellContent(
                        // companyAsMediator,
                        // item[column.key],
                        // column,
                        // item.hs_object_id,
                        // path == '/association' ? `/${getParam('objectTypeName')}` : item[column.key],
                        // path == '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
                        // 'homeList',
                        // path == '/association' ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : '',
                        // detailsView,
                        // hoverRow
                        {
                          makeLink,
                          companyAsMediator: companyAsMediator,
                          value: item[column.key],
                          column: column,
                          itemId: item.hs_object_id,
                          path: path == '/association' ? `/${getParam('objectTypeName')}` : item[column.key],
                          hubspotObjectTypeId: path == '/association' ? getParam('objectTypeId') : hubspotObjectTypeId,
                          type: "homeList",
                          associationPath: path == '/association' ? `/${objectTypeName}/${objectTypeId}/${item.hs_object_id}?mediatorObjectTypeId=${mediatorObjectTypeId}&mediatorObjectRecordId=${mediatorObjectRecordId}` : '',
                          detailsView: detailsView,
                          hoverRow: hoverRow,
                          item: item,
                          urlParam: null,
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </table>

            ))}
          </ul>
        </React.Fragment>
      )}
      {tableData.length > 0 &&
        <div className="flex lg:flex-row flex-col justify-between items-center">
          {/* <div className="text-end">
                {env.DATA_SOURCE_SET != true &&
                  <Button variant='outline' size='sm' onClick={toggleContent}>{isExpanded ? "Show Less" : "Show More"}</Button>
                }
              </div> */}
          <Pagination
            apiResponse={tableAPiData}
            numOfPages={numOfPages || 0}
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
          />
        </div>
      }
      {showAddDialog && <DashboardTableForm componentName="sidebarTable" openModal={showAddDialog} setOpenModal={setShowAddDialog} title={singularModalTitle} path={path} portalId={portalId} hubspotObjectTypeId={hubspotObjectTypeId} apis={apis} refetch={getData} urlParam={urlParam} />}
    </div>
  );
};
