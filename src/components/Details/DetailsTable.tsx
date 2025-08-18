import { renderCellContent } from "@/utils/DataMigration";
import { TableBody, TableRow, TableCell, Table, TableHeader, TableHead } from "../ui/Table";
import { formatKey } from "../ui/Table/DashboardTable";

export const DetailsTable = ({ item, path }: any) => {
  const tableHeaders =
    path === "/jobs"
      ? ["stage_name", "status", "start_date", "end_date"]
      : Object.keys(item || {}).filter(
          (key) =>
            ![
              "id",
              "createdAt",
              "archived",
              "updatedAt",
              "hs_lastmodifieddate",
              "hs_createdate",
              "hs_object_id",
            ].includes(key)
        );

  const tableRows =
    item && tableHeaders.length > 0 ? (
      <TableBody>
        {item[tableHeaders[0]] ? (
          <TableRow>
            {tableHeaders.map((header) => (
              <TableCell
                key={header}
                className="px-4 py-2 text-gray-900 dark:text-gray-100"
              >
                {renderCellContent(
                  // false,item[header]
                  {
                    companyAsMediator: false,
                    value: item[header],
                  }
                )}
              </TableCell>
            ))}
            <TableCell>
              <div className="bg-black w-fit p-1 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#EFEFEF"
                >
                  <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                </svg>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length + 1 || 1}
              className="text-center py-4 text-gray-500 dark:text-gray-400"
            >
              No data found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    ) : null;

  return (
    <Table className="w-full dark:bg-dark-300 my-8 bg-cleanWhite rounded-md">
      <TableHeader>
        {tableHeaders.length > 0 && (
          <TableRow>
            {tableHeaders.map((header) => (
              <TableHead
                key={header}
                className="px-4 py-2 font-semibold text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >
                {formatKey(header)}
              </TableHead>
            ))}

            <TableHead className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap font-semibold">
              <span>Report</span>
            </TableHead>
          </TableRow>
        )}
      </TableHeader>
      {tableRows}
    </Table>
  );
};
