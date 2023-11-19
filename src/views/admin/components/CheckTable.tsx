import React, { useEffect } from "react";
import CardMenu from "components/card/CardMenu";
import Checkbox from "components/checkbox";
import Card from "components/card";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

type RowObj = {
  name: [string, boolean];
  progress: string;
  quantity: number;
  date: string;
};

/*
  Table with checkboxes.
  Can be used for selecting models to upload.

  Uses @tanstack/react-table internally.
  Options:
    title: string - title of table
    tableColumns: string[] - column names
    tableData: any[] - data to display
    headless: boolean - whether to display header or not
    directSubmitOnClick: any - function to call when upload button is clicked
    selIndices: any - selected indices of checkbox items
    setSelIndices: any - method to change selected indices
*/
function CheckTable(props: { title: string, tableColumns: any, 
  tableData: any, headless?: boolean, directSubmitOnClick?: any, 
  selIndices?: any, setSelIndices?: any }) {
  const { title, tableColumns, tableData, headless, directSubmitOnClick, 
    selIndices, setSelIndices } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = [];
  for (let i = 0; i < tableColumns?.length ?? 0; i++) {
    const col = tableColumns[i];
    const value = columnHelper.accessor(col, {
      id: col,
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {col}
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    })
    columns.push(value)
  }
  useEffect(() => {
    if (tableData) {
      setData([...tableData])
    }
  }, [tableData])

  console.log("*********UPDATED***********" + title)
  console.log("*********DEFAULT DATA***********")
  const [data, setData] = React.useState(() => [...tableData]);
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  console.log("TABLE*******************************")
  console.log(data)

  const handleChange = (event: any) => {
    console.log('Checkbox was toggled, ' + event.target.value + ', checked : '+ event.target.checked)
    const idx = event.target.value
    const selected = selIndices
    if (event.target.checked) {
      selected?.add(idx)
    } else {
      selected?.delete(idx)
    }
    if (setSelIndices != null && setSelIndices != undefined) {
      setSelIndices(selected)
    }
  };

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      {!headless? (
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          {title}

          {directSubmitOnClick ?
            (
              <button 
              onClick={directSubmitOnClick}
              className="text-lg ml-5 bg-blue-500 hover:bg-blue-700 text-white 
              font-bold py-2 px-4 rounded-xl">
                Upload Model
              </button>
            )
          : <></>}
        </div>

        <CardMenu />
      </header>
      ): <></> }

      <div className={!headless ? "overflow-x-auto overflow-y-auto": "overflow-x-auto overflow-y-auto"}>
        <table className="w-full h-full">
          <thead>
            {table.getHeaderGroups()
              .map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                      style={{ maxWidth: header.id == "Prompt"? 200 : 100,
                               minWidth: header.id == "Prompt"? 150 : 50}}
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, idx) => {
                      return (
                        <td
                          key={cell.id}
                          className="border-white/0 py-3  pr-4"
                        >
                          {typeof cell.getValue() == "boolean" ? 
                            <Checkbox
                              value={idx} 
                              onChange={handleChange}
                            /> 
                            : flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          }
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default CheckTable;
const columnHelper = createColumnHelper<RowObj>();
