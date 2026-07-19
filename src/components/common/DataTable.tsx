import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string; // column key to filter globally, e.g., "name" or "customerName"
  pageSize?: number;
  serverPagination?: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pageSize = 10,
  serverPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      pagination,
    },
  });

  const selectedCount = Object.keys(rowSelection).length;
  const filteredRowCount = serverPagination?.totalCount ?? table.getFilteredRowModel().rows.length;
  const { pageIndex: localPageIndex, pageSize: localPageSize } = table.getState().pagination;
  const pageIndex = serverPagination?.pageIndex ?? localPageIndex;
  const currentPageSize = serverPagination?.pageSize ?? localPageSize;
  const firstVisibleRow = filteredRowCount === 0 ? 0 : pageIndex * currentPageSize + 1;
  const lastVisibleRow = Math.min((pageIndex + 1) * currentPageSize, filteredRowCount);

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(event) => {
                setGlobalFilter(String(event.target.value));
                table.setPageIndex(0);
              }}
              className="pl-9 bg-background/50 backdrop-blur-sm"
            />
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden relative">
        <div className="overflow-auto max-h-[600px] custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-md z-10 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-border/40">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="transition-colors hover:bg-muted/40 border-b-border/40 group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="text-sm text-muted-foreground">
          Showing {firstVisibleRow}–{lastVisibleRow} of {filteredRowCount} row{filteredRowCount === 1 ? "" : "s"}.
        </div>
        <div className="flex items-center space-x-2">
          <span className="mr-2 text-sm text-muted-foreground">
            Page {pageIndex + 1} of {serverPagination ? Math.ceil(serverPagination.totalCount / serverPagination.pageSize) : table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={serverPagination?.onPreviousPage ?? (() => table.previousPage())}
            disabled={serverPagination ? !serverPagination.canPreviousPage : !table.getCanPreviousPage()}
            className="h-8 shadow-none"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={serverPagination?.onNextPage ?? (() => table.nextPage())}
            disabled={serverPagination ? !serverPagination.canNextPage : !table.getCanNextPage()}
            className="h-8 shadow-none"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full border border-border/50 bg-background/80 p-2 shadow-xl backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          >
            <div className="px-4 text-sm font-medium">
              <span className="text-primary">{selectedCount}</span> selected
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1">
              <Button size="sm" variant="secondary" className="rounded-full">Export</Button>
              <Button size="sm" variant="destructive" className="rounded-full">Delete</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
