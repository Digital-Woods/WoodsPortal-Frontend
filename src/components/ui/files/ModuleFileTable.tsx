import React, { useState } from "react";
import { TableRow, TableCell } from "../Table";
import { FileDetailsModal } from "./FileDetailsModal";
import { getIconType } from "@/utils/DataMigration";

export const ModuleFileTable = ({ files }: any) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleRowClick = (file: any) => {
    let data: any = { data: {} }
    data.data = file;
    setSelectedFile(data);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  const handleDownload = (file: any, e: any) => {
    e.stopPropagation();
    window.open(file.url, "_blank");
  };

  const toggleDropdown = (index: any) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const renderFiles = (files: any) => {
    if (!files || files.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center text-gray-500">
            No files available
          </TableCell>
        </TableRow>
      );
    }

    return files.map((file: any, index: any) => (
      <React.Fragment key={file.url}>
        <TableRow
          className={`border-t relative cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-300`}
          onClick={() => handleRowClick(file)}
        >
          <TableCell className="px-4 py-2 text-xs">
            <div>{getIconType(file.type)}</div>
          </TableCell>
          <TableCell className="px-4 py-2 text-xs">
            <div className="dark:text-white">{file.name}</div>
          </TableCell>
          <TableCell className="px-4 py-2 text-left dark:text-white text-xs w-[100px]">
            <div>{file.type}</div>
          </TableCell>
          <TableCell className="px-4 py-2 text-left dark:text-white text-xs w-[100px]">
            <div>{file.size}</div>
          </TableCell>
          <TableCell className="px-4 py-2 text-right relative">
            <div className="relative">
              <button
                className="border border-gray-300 dark:text-white text-xs px-3 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(index);
                }}
              >
                Actions
              </button>
              {activeDropdown === index && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-dark-200 border rounded-lg shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(file);
                      toggleDropdown(index);
                    }}
                  >
                    Details
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-300"
                    onClick={(e) => handleDownload(file, e)}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      </React.Fragment>
    ));
  };

  return (
    <div className="table-container">
      <table className=" dark:bg-[#2a2a2a]  table-auto w-full mb-6">
        <thead className="bg-gray-100 text-left dark:bg-dark-200">
          <tr>
            <th className="px-4 py-2 text-xs dark:text-white"></th>
            <th className="px-4 py-2 text-xs dark:text-white">Name</th>
            <th className="px-4 py-2 text-xs dark:text-white text-left w-[100px]">File Type</th>
            <th className="px-4 py-2 text-xs dark:text-white text-left w-[100px]">Size</th>
            <th className="px-4 py-2 text-xs dark:text-white"></th>
          </tr>
        </thead>
        <tbody>{renderFiles(files)}</tbody>
      </table>

      {selectedFile && (
        <FileDetailsModal file={selectedFile} onClose={closeModal} />
      )}
    </div>
  );
};
