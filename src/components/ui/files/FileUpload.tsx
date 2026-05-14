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

import { getPortal, getAuthToken } from "@/data/client/auth-utils";
import { hubId } from "@/data/hubSpotData";
import axios from "axios";
import { env } from "@/env";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { getIcon } from "@/utils/GetIcon";
import { ALLOWED_FILE_MIME_TYPES } from "@/utils/constants";
import { ensureValidRefresh } from "@/data/client/token-store";

export const FileUpload = ({ fileId, refetch, folderId, onClose, setToaster, objectId, id }: any) => {
  // const { sync, setSync } = useSync();
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);
  const [isUploading, setIsUploading] = useState<any>(false);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const totalCount = selectedFile.length;
  const successCount = selectedFile.filter((f: any) => f?.status === "success")
    .length;
  const failedCount = selectedFile.filter((f: any) => f?.status === "failed")
    .length;
  const completedCount = successCount + failedCount;
  const remainingCount = Math.max(0, totalCount - completedCount);
  const hasUploadable = selectedFile.some(
    (f: any) => f?.status !== "success"
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showUploadStatus, setShowUploadStatus] = useState<boolean>(false);


  // Added by Suman
  const [uploadProgress, setUploadProgress] = useState<any>(0);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
const VITE_PUBLIC_REST_API_ENDPOINT = window?.hubSpotData?.developerOption === true ? window?.hubSpotData?.developerOptionTempUrl : env.VITE_PUBLIC_REST_API_ENDPOINT ?? '';

  const inputChange = (e: any) => {
    const filesList = Array.from(e.target.files || []);
    if (filesList.length === 0) return;

    setSelectedFile((prevValue: any) => [
      ...prevValue,
      ...filesList.map((file) => ({
        id: generateUniqueId(),
        filename: file.name,
        filetype: file.type,
        fileimage: null,
        file,
        status: "pending",
      })),
    ]);

    e.target.value = "";
  };

  const deleteSelectFile = (id: any) => {
    const result = selectedFile.filter((data: any) => data?.id !== id);
    setSelectedFile(result);
  };

  const portalId = getPortal()?.portalId
  const fileUploadSubmit = async (e: any) => {
    e.preventDefault();

    const uploadQueue = selectedFile.filter(
      (item: any) => item?.status !== "success"
    );

    if (uploadQueue.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    const parentFolder = folderId === fileId ? "obj-root" : folderId;
    const url = VITE_PUBLIC_REST_API_ENDPOINT+`/api/${hubId}/${portalId}/hubspot-object-files/${objectId}/${id}?parentFolderId=${parentFolder}`;

    setIsUploading(true);
    setShowUploadStatus(true);
    // counts are derived from item statuses

    const failed: any[] = [];
    const succeeded: any[] = [];

    for (const item of uploadQueue) {
      if (!item?.file) continue;
      setActiveUploadId(item.id);
      setUploadProgress(0);

      try {
        await ensureValidRefresh();
        const token = getAuthToken();

        const formData = new FormData();
        formData.append("file", item.file);

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
              setUploadProgress(percentCompleted);
            }
          },
        });

        if (response?.data) {
          succeeded.push(item);
          setFiles((prevValue: any) => [...prevValue, item]);
          setSelectedFile((prevValue: any) =>
            prevValue.map((f: any) =>
              f.id === item.id ? { ...f, status: "success" } : f
            )
          );
        } else {
          failed.push({ ...item, status: "failed" });
          setSelectedFile((prevValue: any) =>
            prevValue.map((f: any) =>
              f.id === item.id ? { ...f, status: "failed" } : f
            )
          );
        }
      } catch (error) {
        failed.push({ ...item, status: "failed" });
        setSelectedFile((prevValue: any) =>
          prevValue.map((f: any) =>
            f.id === item.id ? { ...f, status: "failed" } : f
          )
        );
      }
    }

    setIsUploading(false);
    setActiveUploadId(null);
    setUploadProgress(0);

    if (failed.length > 0) {
      setSelectedFile(failed);
      setToaster({
        message: `Uploaded ${succeeded.length} file(s). ${failed.length} failed.`,
        type: "error",
        show: true,
      });
      refetch();
      return;
    }

    setToaster({
      message: "Files uploaded successfully!",
      type: "success",
      show: true,
    });
    refetch();
    // setSync(true)

    return;
  };
useEffect(() => {
  selectedFile.length === 0 && setShowUploadStatus(false);
}, [selectedFile]);
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
                  {!isUploading && (
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
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={Array.from(ALLOWED_FILE_MIME_TYPES).join(",")}
                        id="fileupload"
                        className="CUSTOM-file-upload-input"
                        onChange={inputChange}
                        disabled={isUploading}
                        aria-label="Upload files"
                      />
                      <p>Drag and drop</p>
                      <p>or</p>
                      <label
                        htmlFor="fileupload"
                        className={`px-6 py-2 text-sm font-medium rounded-md !mt-3 ${isUploading ? `border border-gray-300 text-gray-300 dark:border-gray-300 dark:text-gray-300 cursor-not-allowed ...` : `border border-secondary text-secondary dark:border-white dark:text-white`}`}
                      >
                        Browse
                      </label>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-300 text-center">
                        Tip: Hold Ctrl (Windows) or Cmd (Mac) to select multiple
                        files in one selection.
                      </p>
                    </div>
                  </div>
                  )}
                  {/* max-h-[100px] overflow-y-scroll */}
                  {showUploadStatus && totalCount > 1 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                        <span>
                          Processed {completedCount} / {totalCount} · Remaining{" "}
                          {remainingCount} · Success {successCount} · Failed{" "}
                          {failedCount}
                        </span>
                        <span>
                          {totalCount === 0
                            ? 0
                            : Math.round((completedCount / totalCount) * 100)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-sm overflow-hidden h-2">
                        <div
                          className="h-2 bg-secondary dark:bg-dark-400 transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              totalCount === 0
                                ? 0
                                : Math.round((completedCount / totalCount) * 100)
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div className="kb-attach-box CUSTOM-file-list mb-3 scrollbar max-h-[240px] overflow-y-auto pr-2 flex flex-col gap-1">
                    {selectedFile.map((data: any) => {
                      const { id, filename, status } = data;
                      return (
                        <div
                          className={`CUSTOM-file-atc-box border rounded-sm p-2 flex-col ${
                            status === "failed"
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          key={id}
                        >
                          <div className="CUSTOM-file-detail flex items-center">
                            <div className="dark:text-white">{getIcon(filename)}</div>
                            <div
                              className={`mx-2 text-sm font-medium text-left truncate ${
                                status === "failed"
                                  ? "text-red-600 dark:text-red-300"
                                  : "dark:text-white"
                              }`}
                            >
                              {filename}
                            </div>
                            {status === "failed" && (
                              <span className="text-xs font-semibold text-red-600 dark:text-red-300 mr-2">
                                Failed
                              </span>
                            )}
                            <div className="CUSTOM-file-actions ml-auto">
                              {status === "success" ? (
                                <span className="text-xs font-semibold text-green-600 dark:text-green-300">
                                  Successful
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className={`CUSTOM-file-action-btn dark:text-white text-red-600 mr-0 outline-none focus:outline-none focus:ring-0 ${isUploading ? 'hidden':''}`}
                                  onClick={() => deleteSelectFile(id)}
                                  disabled={isUploading}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        {/* Progress Bar */}
                        <div className={`transition-all w-[100%] duration-300 ${isUploading && activeUploadId === id ? "opacity-100" : "opacity-0"} overflow-hidden`}>
                        {
                          isUploading && activeUploadId === id && uploadProgress < 90 ?                         
                          <div className="w-full bg-gray-200 rounded-sm overflow-hidden h-3 mt-2">
                            <div
                              className="h-3 bg-secondary dark:bg-dark-400 transition-all duration-300"
                              style={{ width: `${uploadProgress + 10}%` }}
                            ></div>
                          </div> : null
                        }
                        {
                          isUploading && activeUploadId === id && uploadProgress > 90  ? 
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
                      onClick={() => {onClose();setShowUploadStatus(false);}}
                      disabled={isUploading}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      disabled={!hasUploadable || isUploading}
                      isLoading={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
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
