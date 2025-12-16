// const CloseIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     height="24px"
//     viewBox="0 -960 960 960"
//     width="24px"
//     className="fill-black dark:fill-white"
//   >
//     <path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z" />
//   </svg>
// );

import { Client } from "@/data/client";
import { getPortal, getAuthToken } from "@/data/client/auth-utils";
import { useMe } from "@/data/user";
import { hubId } from "@/data/hubSpotData";
import { useSync } from "@/state/use-sync";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { env } from "@/env";
import { useState } from "react";
import { Button } from "../Button";
import { getIcon } from "@/utils/GetIcon";
import { ALLOWED_FILE_MIME_TYPES, ENTERPRISE_ACCOUNT_MAX_FILE_SIZE, FREE_ACCOUNT_MAX_FILE_SIZE } from "@/utils/constants";
import { useAuth } from "@/state/use-auth";
import { toast } from "sonner";

export const FileUpload = ({ fileId, refetch, folderId, onClose, setToaster, objectId, id }: any) => {
  const { subscriptionType }: any = useAuth();
  // const { sync, setSync } = useSync();
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);
  const [isUploading, setIsUploading] = useState<any>(false);
  const { me } = useMe();



  // Added by Suman
  const [file, setFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<any>(0);
  const [uploadStatus, setUploadStatus] = useState<any>("");

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const inputChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeInBytes = file.size;
    const sizeInMB: any = (sizeInBytes / (1024 * 1024)).toFixed(2);

    if(subscriptionType === "FREE" && sizeInMB > FREE_ACCOUNT_MAX_FILE_SIZE) {
      toast.success("File is too large. Maximum allowed size is 20 MB. Please choose a smaller file");
      return
    } else if (subscriptionType != "FREE" && sizeInMB > ENTERPRISE_ACCOUNT_MAX_FILE_SIZE) {
      toast.success("File is too large. Maximum allowed size is 1 GB. Please choose a smaller file");
      return
    }

    setFile(file);
    let validFilesArray = [];
    validFilesArray.push(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile((prevValue: any) => [
        // ...prevValue,
        {
          id: generateUniqueId(),
          filename: file?.name,
          filetype: file?.type,
          fileimage: reader.result,
        },
      ]);
    };

    if (file) {
      reader.readAsDataURL(file);
    }

    if (validFilesArray.length > 0) {
      e.target.value = "";
    }



    return;

    // let validFilesArray = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      validFilesArray.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile((prevValue: any) => [
          ...prevValue,
          {
            id: generateUniqueId(),
            filename: file.name,
            filetype: file.type,
            fileimage: reader.result,
          },
        ]);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }

    if (validFilesArray.length > 0) {
      e.target.value = "";
    }
  };

  const deleteSelectFile = (id: any) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      const result = selectedFile.filter((data: any) => data?.id !== id);
      setSelectedFile(result);
    }
  };

  const portalId = getPortal()?.portalId
  const uploadFileMutation = useMutation({
    mutationFn: async (fileData: any) => {
      const parentFolder = folderId === fileId ? "obj-root" : folderId;

      const payload = {
        parentFolderId: parentFolder,
        fileName: fileData?.fileName,
        fileData: fileData?.fileData,
      };

      return await Client.files.uploadFile({
        objectId: objectId,
        id: id,
        portalId: portalId,
        fileData: payload
      });
    },
    onSuccess: (data:any) => {
      console.log(data,'dadada');
      setFiles((prevValue: any) => [...prevValue, ...selectedFile]);
      setSelectedFile([]);
      setIsUploading(false);
      setToaster({
        message: data?.statusMsg || "Files uploaded successfully!",
        type: "success",
        show: true,
      });
      refetch();
      // setSync(true)
      onClose();
    },
    onError: (error: any) => {
      setIsUploading(false);
      const errorMessage = error?.response?.data?.errorMessage;
      setToaster({
        message: errorMessage,
        type: "error",
        show: true,
      });
      onClose();
    },
  });

  const fileUploadSubmit = async (e: any) => {

    setIsUploading(true);
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const token = getAuthToken();

    const formData = new FormData();
    formData.append("file", file); // Append the selected file to FormData

    const parentFolder = folderId === fileId ? "obj-root" : folderId;
    const url = env.VITE_PUBLIC_REST_API_ENDPOINT+`/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}?parentFolderId=${parentFolder}`;

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent?.total) {
            const percentCompleted = Math.round(
              (progressEvent?.loaded * 100) / progressEvent?.total
            );
            setUploadProgress(percentCompleted); // Update the progress
          }
        },
      });

      setFiles((prevValue: any) => [...prevValue, ...selectedFile]);
      setSelectedFile([]);
      setIsUploading(false);
      setToaster({
        message: response.data?.statusMsg || "File uploaded successfully!",
        type: "success",
        show: true,
      });
      refetch();
      // setSync(true)
      onClose();
      // setUploadStatus("File uploaded successfully!");
    } catch (error: any) {
      setIsUploading(false);
      const errorMessage = error?.response?.data?.errorMessage;
      setToaster({
        message: errorMessage,
        type: "error",
        show: true,
      });
      onClose();
    }

    return;
    e.preventDefault();
    e.target.reset();

    if (selectedFile.length > 0) {
      setIsUploading(true);
      for (const file of selectedFile) {
        const fileData = {
          fileName: file.filename,
          fileData: file.fileimage.split(",")[1],
        };

        try {
          await uploadFileMutation.mutateAsync(fileData);
        } catch (err) {
          console.error("Error during file upload:", err);
        }
      }
    } else {
      alert("Please select a file");
    }
  };

  const deleteFile = (id: any) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      const result = files.filter((data: any) => data.id !== id);
      setFiles(result);
    }
  };

  // const truncateText = (text: any, maxLength: any) =>{
  //   if (text.length > maxLength) {
  //     return text.substring(0, maxLength) + "...";
  //   }
  //   return text;
  // }

  return (
    <div className="fileupload-view relative">
      <div className="row justify-center m-0">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="CUSTOM-kb-data-box lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)] flex flex-col justify-start p-4">
                <div className="CUSTOM-kb-modal-data-title">
                  <div className="CUSTOM-kb-data-title">
                    <div className="text-lg text-start font-semibold dark:text-white">File Upload</div>
                  </div>
                </div>
                <form onSubmit={fileUploadSubmit} className={`max-w-screen !mb-0  ${isUploading ? 'cursor-not-allowed ...':'cursor-auto'}`}>
                  <div className={`CUSTOM-kb-file-upload  ${isUploading ? 'cursor-not-allowed ...':'cursor-auto'}`}>
                    <div className={`CUSTOM-file-upload-box dark:bg-dark-300 dark:text-white ${isUploading ? 'cursor-not-allowed ...':'cursor-auto'}`}>
                      {/* <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="40px"
                          viewBox="0 -960 960 960"
                          width="40px"
                          className="fill-black dark:fill-white my-3"
                        >
                          <path d="..." />
                        </svg>
                      </div> */}
                      <input
                        type="file"
                        accept={Array.from(ALLOWED_FILE_MIME_TYPES).join(',')}
                        id="fileupload"
                        className="CUSTOM-file-upload-input"
                        onChange={inputChange}
                        disabled={isUploading}
                      />
                      <p> Drag and drop </p>
                      <p> or </p>
                      <p className={`px-6 py-2 text-sm font-medium rounded-md !mt-3 ${isUploading ? `border border-gray-300 text-gray-300 dark:border-gray-300 dark:text-gray-300 cursor-not-allowed ...`:`border border-secondary text-secondary dark:border-white dark:text-white`}`}>
                        Browse
                      </p>
                    </div>
                  </div>
                  {/* max-h-[100px] overflow-y-scroll */}
                  <div className="kb-attach-box mb-3  scrollbar">
                    {selectedFile.map((data: any) => {
                      const { id, filename } = data;
                      return (
                        <div
                          className="CUSTOM-file-atc-box border border-gray-300 rounded-sm shadow-md p-2 mb-2 flex-col"
                          key={id}
                        >
                          <div className="CUSTOM-file-detail flex items-center">
                            <div className="dark:text-white">{getIcon(filename)}</div>
                            <div className="mx-2 text-sm dark:text-white font-medium text-left truncate">
                              {filename}
                            </div>
                            <div className="CUSTOM-file-actions ml-auto">
                              <Button
                                type="button"
                                variant="link"
                                className={`CUSTOM-file-action-btn dark:text-white text-red-600 mr-0 ${isUploading ? 'hidden':''}`}
                                onClick={() => deleteSelectFile(id)}
                                disabled={isUploading}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        {/* Progress Bar */}
                        <div className={`transition-all w-[100%] duration-300 ${isUploading ? "opacity-100" : "opacity-0"} overflow-hidden`}>
                        {
                          isUploading && uploadProgress < 90 ?                         
                          <div className="w-full bg-gray-200 rounded-sm overflow-hidden h-3 mt-2">
                            <div
                              className="h-3 bg-secondary dark:bg-dark-400 transition-all duration-300"
                              style={{ width: `${uploadProgress + 10}%` }}
                            ></div>
                          </div> : null
                        }
                        {
                          isUploading && uploadProgress > 90  ? 
                          <div className="CUSTOM-meter">
                            <span className="dark:bg-dark-400"></span>
                          </div> : null
                        }
                        </div>

                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <Button
                      variant='outline'
                      onClick={onClose}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={selectedFile.length === 0 || isUploading}
                      isLoading={isUploading}
                    >
                      Upload
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};
