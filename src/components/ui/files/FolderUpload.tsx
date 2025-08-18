import { Client } from "@/data/client";
import { getPortal } from "@/data/client/auth-utils";
import { useMe } from "@/data/user";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../Button";
import { Dialog } from "../Dialog";

export const FolderUpload = ({
  isOpen,
  onClose,
  refetch,
  folderId,
  fileId,
  setToaster,
  objectId,
  id
}: any) => {
  // const { sync, setSync } = useSync();
  const { me } = useMe();
  const [newFolderName, setNewFolderName] = useState("");

  const portalId = getPortal()?.portalId

  const createFolderMutation = useMutation({
    mutationFn: async (payload) => {
      await Client.files.createAfolder({
        objectId: objectId,
        id: id,
        portalId: portalId,
        fileData: payload
      });
    },
    onSuccess: () => {
      setToaster({
        message: "Folder created successfully!",
        type: "success",
        show: true,
      });
      refetch();
      // setSync(true)
      setNewFolderName("");
      onClose(); // Close modal after folder creation
    },
    onError: (error) => {
      console.error("Error creating folder:", error);
      setToaster({
        message: "Error creating folder!",
        type: "error",
        show: true,
      });

      onClose();
    },
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") {
      setToaster({
        message: "Folder name cannot be empty!",
        type: "error",
        show: true,
      });
      return;
    }

    const parentFolder = fileId === folderId ? "obj-root" : folderId;
    const payload: any = {
      parentFolderId: parentFolder,
      folderName: newFolderName,
    };

    createFolderMutation.mutate(payload);
  };

  const isValidFolderName = (name: any) => {
    const regex = /^[a-zA-Z0-9 ]+$/;
    return regex.test(name);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => { } /* Disable closing on backdrop click */}
    >
      <div
        className="flex relative items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on modal content
      >
        <div className="bg-cleanWhite lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)] flex flex-col justify-start dark:bg-dark-200">
          <h3 className="text-lg text-start font-semibold mb-4 dark:text-white">
            New Folder
          </h3>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="w-full rounded-md bg-cleanWhite px-2 text-sm transition-colors border-2 dark:border-gray-600 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 py-2"
            placeholder="Folder Name"
          />
          {newFolderName && !isValidFolderName(newFolderName) &&
            <span className="mt-2 text-sm text-red-600 dark:text-red-500">Only allow letters, numbers, and spaces</span>
          }
          <div className="mt-4 flex items-center gap-3 justify-end">
            <Button
              className='dark:text-white'
              onClick={onClose}
              variant="outline"
              disabled={createFolderMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={
                createFolderMutation.isLoading || newFolderName.trim() === "" || !isValidFolderName(newFolderName)
              }
              isLoading={createFolderMutation.isLoading}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
