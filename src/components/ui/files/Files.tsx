import { CautionCircle } from "@/assets/icons/CautionCircle";
import { IconPlus } from "@/assets/icons/IconPlus";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { Client } from "@/data/client";
import { getPortal } from "@/data/client/auth-utils";
import { recorBtnCustom } from "@/data/hubSpotData";
import { useSync } from "@/state/use-sync";
import { useQuery } from "@tanstack/react-query";

import { useState, useEffect } from "react";
import { Button } from "../Button";
import { Dialog } from "../Dialog";
import { Pagination } from "../Pagination";
import { FilesSkeleton } from "../skeletons/FilesSkeleton";
import { FileBreadcrumb } from "./FileBreadcrumb";
import { FileUpload } from "./FileUpload";
import { FolderUpload } from "./FolderUpload";
import { FileTable } from "./FileTable";
import { useToaster } from "@/state/use-toaster";
import { Input } from "../Form";
import { useAuth } from "@/state/use-auth";
import { useUpdateLink } from "@/utils/GenerateUrl";
import { isAuthenticateApp } from '@/data/client/token-store';
import { DashboardTableHeaderSkeleton } from "../skeletons/DashboardTableHeaderSkeleton";
import { DashboardTitleSkeleton } from "../skeletons/DashboardTitleSkeleton";
import { TableSkeleton } from "../skeletons/TableSkeleton";

export const Files = ({ tabName = '', fileId, path, objectId, id, permissions: mPermissions }: any) => {
  const [permissions, setPermissions] = useState(mPermissions);
  const [currentFiles, setCurrentFiles] = useState<any>({ child: [] });
  const [folderStack, setFolderStack] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<any>(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<any>(false);
  const [rightClickedFolder, setRightClickedFolder] = useState<any>(null);
  const [newFolderName, setNewFolderName] = useState<any>("");
  const [searchTerm, setSearchTerm] = useState<any>(""); // State for search term
  const { sync, setSync } = useSync();
  const { setToaster } = useToaster();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const itemsPerPage = 10;
  const portalId = getPortal()?.portalId;
  const { subscriptionType }: any = useAuth();
  const {updateLink, filterParams} = useUpdateLink();
  const [isFristTimeLoadData, setIsFristTimeLoadData] = useState<any>(true);

  const [totalFiles, setTotalFiles] = useState<any>(null);
  const [startIndex, setStartIndex] = useState<any>(null);
  const [endIndex, setEndIndex] = useState<any>(null);
  const [paginatedFiles, setPaginatedFiles] = useState<any>([]);
  const [numOfPages, setNumOfPages] = useState<any>(null);


  const findObjectById = (data: any, id: any) => {
    // Base case: if the current object matches the id, return it
    if (data?.id === id) {
      return data;
    }

    // If there are children, recursively search them
    if (data?.child && data?.child.length > 0) {
      for (let child of data?.child) {
        const result: any = findObjectById(child, id);
        if (result) {
          return result; // return as soon as a match is found
        }
      }
    }

    // If no match is found, return null
    return null;
  };

  useEffect(() => {
    setCurrentFiles({ child: [] });
    setFolderStack([]);

    if(isFristTimeLoadData) {
      const tab =  filterParams("tabs.files")
      setCurrentPage(tab?.page || 1);
      setSearchTerm(tab?.search || "");
    } else {
      setCurrentPage(1);
      setSearchTerm("");
    }

  }, [id, fileId, objectId]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["FilesData", fileId, objectId, id, portalId, sync],
    queryFn: async () =>
      await Client.files.all({
        objectId: objectId,
        id: id,
        portalId: portalId,
        cache: sync ? false : true,
        isPrimaryCompany: filterParams("tabs.files")?.isPrimaryCompany ? true : false,
      }),
    onSuccess: (data: any) => {
      setIsFristTimeLoadData(false)
      setPermissions(data?.configurations?.fileManager);
      if (data && data.data) {
        if (folderStack.length > 0 && currentFiles?.name != id) {
          const foundObject = findObjectById(data?.data, currentFiles?.id);
          setCurrentFiles(foundObject);
          const updatedFolderStack: any = updateFolderStack(
            folderStack,
            foundObject
          );
          setFolderStack(updatedFolderStack);
        } else {
          setCurrentFiles(data?.data);
          setFolderStack([data?.data]);
        }
      }
      setSync(false);
    },
    onError: (error: any) => {
      setSync(false);
      console.error("Error fetching file details:", error);
    },
    enabled: isAuthenticateApp(),
  });

  useEffect(() => {
    if (sync) {
      refetch();
    }
  }, [sync]);

  // useEffect(() => {
  //   refetch();
  // }, [id, fileId, objectId]);

  useEffect(() => {
    // Filter files based on search term
    const filteredFiles: any = (currentFiles?.child || [])
      .filter((file: any) =>
        file?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      // .sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt));
      .sort((a: any, b: any) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime());

    const total = filteredFiles.length
    const sIndex = (currentPage - 1) * itemsPerPage
    const eIndex = currentPage * itemsPerPage

    setTotalFiles(total);
    setStartIndex(sIndex);
    setEndIndex(eIndex);
    setPaginatedFiles(filteredFiles.slice(sIndex, eIndex));

    setNumOfPages(Math.ceil(total / itemsPerPage));
  }, [currentFiles, currentPage, searchTerm]);


  const toggleFolder = (folder: any) => {
    setFolderStack([...folderStack, folder]);
    setCurrentFiles(folder);
    setCurrentPage(1);
  };

  // Update folder stack
  const updateFolderStack = (folderStack: any, currentFolder: any) => {
    // Recursive function to find and update the folder
    const updateRecursive = (folders: any) => {
      return folders.map((folder: any) => {
        if (folder.id === currentFolder.id) {
          // Update the folder that matches the currentFolder ID
          return {
            ...folder, // Copy the current folder properties
            name: currentFolder?.name, // Update the name
            size: currentFolder?.size, // Update the size
            child: currentFolder?.child || folder?.child, // Update the children if provided
          };
        }

        // If not the current folder, check the children recursively
        if (folder?.child && folder?.child.length > 0) {
          return {
            ...folder,
            child: updateRecursive(folder?.child), // Recursively update children
          };
        }

        return folder; // Return folder as-is if no match and no children
      });
    };

    // Start recursion on the folderStack
    return updateRecursive(folderStack);
  };

  const handleBreadcrumbClick = (index: any) => {
    if (!Array.isArray(folderStack) || folderStack.length <= index) {
      return;
    }
    const updatedFolderStack = updateFolderStack(folderStack, currentFiles);
    // setFolderStack(updatedFolderStack);

    const selectedFolder = folderStack[index];

    setCurrentPage(1);
    setCurrentFiles(selectedFolder);
    setFolderStack(folderStack.slice(0, index + 1));
  };

  const createFolder = (folderName: any) => {
    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      type: "folder",
      child: [],
    };
    if (rightClickedFolder && rightClickedFolder?.child) {
      rightClickedFolder.child.push(newFolder);
    } else if (currentFiles && currentFiles?.child) {
      currentFiles?.child.push(newFolder);
    }
    setCurrentFiles({ ...currentFiles });
    setNewFolderName("");
    setIsCreateFolderOpen(false);
  };

  const closeContextMenu = () => {
    document.getElementById("contextMenu");
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOverlayClick = (e: any) => {
    if (e.target.id === "CUSTOM-dialog-overlay") {
      // Only close if clicked on the overlay
      closeDialog();
    }
  };

  const getCurrentFolderId = () => {
    return (currentFiles && currentFiles?.id) || "obj-root";
  };

  const onChangeSearch = (e: any) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)

    updateLink({
        s: e.target.value,
        p: 1
    }, "tabs.files")
  };


  // if (isLoading) {
  //   return <FilesSkeleton />;
  // }

  if (isLoading === true) {
    return (
      <div
      >
        <DashboardTitleSkeleton />
        <DashboardTableHeaderSkeleton/>
        <TableSkeleton />
      </div>
    );
  }


  if (error && !id && objectId == '0-2' && tabName === 'home' && !fileId) {
    return (
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle />
        </span>
        Primary Company not found.
      </div>
    )
  }


  if (error) {
    return (
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle />
        </span>
        {error?.response?.data?.errorMessage}
      </div>
    )
  }


  return (
    <div onClick={closeContextMenu}>
      <div className="rounded-lg mt-2 bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 !pb-0">
        <div className="flex justify-between mb-6 items-center max-sm:flex-col-reverse max-sm:items-end gap-2">
          <Input
            placeholder="Search..."
            height="semiMedium"
            value={searchTerm}
            onChange={(e: any) => onChangeSearch(e)}
            icon={SearchIcon}
          />
          {permissions && permissions?.create && (
            <div className="flex justify-end space-x-2">
              <Button
                variant={!recorBtnCustom ? 'default' : 'create'}
                onClick={() => setIsCreateFolderOpen(true)}
              >
                <span className="mr-2">
                  {" "}
                  <IconPlus className="!w-3 !h-3" />{" "}
                </span>{" "}
                New Folder
              </Button>

              <Button variant={!recorBtnCustom ? 'default' : 'create'} onClick={() => setIsDialogOpen(true)}>
                <span className="mr-2">
                  {" "}
                  <IconPlus className="!w-3 !h-3" />{" "}
                </span>{" "}
                New File
              </Button>
            </div>
          )}
        </div>

        <div className="flex md:flex-row flex-col-reverse justify-between gap-2 md:items-center ">
          <FileBreadcrumb
            id={id}
            folderStack={folderStack}
            onClick={handleBreadcrumbClick}
          />
        </div>

        <div className="text-xl font-semibold mb-4 dark:text-white break-words whitespace-normal overflow-hidden">
          {currentFiles && currentFiles?.name != id ? currentFiles?.name : "Home"}
        </div>

        <FileTable
          fileId={fileId}
          path={path}
          files={paginatedFiles} // Use paginatedFiles which is based on filteredFiles
          toggleFolder={toggleFolder}
          refetch={refetch}
          objectId={objectId}
          id={id}
          componentName="files"
        />
        {/* <ModuleFileTable/> */}

        <div className="flex md:flex-row flex-col gap-2 justify-between items-center ">
          <div className="flex items-center gap-x-2 pt-3 text-sm">
            <p className="text-secondary leading-5 text-sm dark:text-gray-300">
              Showing
            </p>
            <span className="border dark:text-white border-secondary font-medium w-8 h-8 flex items-center justify-center rounded-md dark:border-white">
              {paginatedFiles.length}
            </span>
            {subscriptionType != 'FREE' && (
              <>
                <span className="dark:text-white">/</span>
                <span className="rounded-md dark:text-white font-medium">
                  {totalFiles}
                </span>
                <p className="text-secondary font-normal text-sm dark:text-gray-300">
                  Results
                </p>
              </>
            )}
          </div>
          <Pagination
            numOfPages={numOfPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isFile={true}
            tabName="tabs.files"
          />
        </div>
      </div>

      <FolderUpload
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onCreate={createFolder}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        folderId={getCurrentFolderId()}
        fileId={fileId}
        refetch={refetch}
        setToaster={setToaster}
        objectId={objectId}
        id={id}
      />
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <div id="CUSTOM-dialog-overlay" onClick={handleOverlayClick}>
          <FileUpload
            folderId={getCurrentFolderId()}
            fileId={fileId}
            refetch={refetch}
            onClose={closeDialog}
            setToaster={setToaster}
            objectId={objectId}
            id={id}
          />
        </div>
      </Dialog>
    </div>
  );
};
