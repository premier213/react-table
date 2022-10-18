import "./App.css";

import {
  Column,
  Table,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { makeData, DefaultProps, colorRange } from "./makeData";
import { CaretDown, CaretRight, World } from "tabler-icons-react";
import { ReactNode, useMemo, useState } from "react";
import { Owner, Progress } from "./components";

function App() {
  const columns = useMemo<ColumnDef<DefaultProps>[]>(
    () => [
      {
        accessorKey: "Type",
        header: () => <div className="headerTitle">TYPE</div>,
        enableColumnFilter: false,
        cell: ({ row, getValue }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            <>
              {row.getCanExpand() ? (
                <div
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? (
                    <div className="flex items-center">
                      <CaretDown
                        size={12}
                        strokeWidth={5}
                        className="stroke-slate-700"
                      />
                      <World
                        size={20}
                        strokeWidth={2}
                        className="stroke-slate-400"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CaretRight
                        size={12}
                        strokeWidth={5}
                        className="stroke-slate-700"
                      />
                      <World
                        size={20}
                        strokeWidth={2}
                        className="stroke-slate-400 align-middle"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <World
                  size={20}
                  strokeWidth={2}
                  className="stroke-slate-400 align-middle"
                />
              )}
              {getValue()}
            </>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        cell: ({ row }) => `${row.index + 1}.`,
        id: "index",
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.title,
        header: () => <div className="headerTitle">TITLE</div>,
        enableColumnFilter: false,
        id: "title",
        cell: (info) => (
          <div className="mx-2">{info.getValue() as ReactNode}</div>
        ),
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "owner",
        header: () => <div className="headerTitle">OWNER</div>,
        cell: ({ row, getValue }) => (
          <div className="flex items-center gap-2 mx-2">
            <Owner id={row.id} value={getValue() as string} />
          </div>
        ),
        id: "ownder",
        enableColumnFilter: false,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "due",
        header: () => <div className="headerTitle">DUE</div>,
        enableColumnFilter: false,
        cell: (info) => (
          <div className="mx-2">{info.getValue() as ReactNode}</div>
        ),
        id: "due",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "progress",
        header: () => <div className="headerTitle">PROGRESS</div>,

        cell: ({ row, getValue }) => {
          const range = colorRange(getValue() as number, 100);
          return (
            <>
              <Progress
                id={row.id}
                range={range}
                value={getValue() as number}
              />
            </>
          );
        },
        id: "progress",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "score",
        header: () => <div className="headerTitle">SCORE</div>,

        cell: ({ row, getValue }) => {
          const range = colorRange(getValue() as number, 9);
          return (
            <div className={`${range} w-8 text-center text-white rounded-sm`}>
              {getValue() as ReactNode}
            </div>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "lastUpdated",
        header: () => <div className="headerTitle">LAST UPDATE</div>,
        enableColumnFilter: false,
        cell: ({ row, getValue }) => {
          return (
            <div className="text-gray-400 text-sm">
              {getValue() as ReactNode}
            </div>
          );
        },
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const [data, setData] = useState(() => makeData(100, 5, 3));

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center gap-2 my-4">
        <button
          className="border rounded p-1 w-8"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1 w-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1 w-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1 w-8"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          className="h-8"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <div>{table.getRowModel().rows.length} Rows</div>
      </div>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return (
    <div className="flex gap-1 mx-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-16 border"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-16 border"
      />
    </div>
  );
}

export default App;
