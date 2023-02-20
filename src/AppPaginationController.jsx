import {getmakeData} from './faker/makeData';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getGroupedRowModel, getPaginationRowModel, getSortedRowModel, useReactTable} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import PaginationTable from './table/components/pagination';
import SearchAll from './table/components/searshAll';
import ColumnsVisibility from './table/components/columsVisibility';
import Datatable from './table/table';
import { VscFilterFilled } from 'react-icons/vsc';
import IndeterminateCheckbox from './table/components/Indeterminate';
import { useQuery } from '@tanstack/react-query';

import { fetchData } from './faker/fetchData';

function App() {
	const columns = useMemo(() => [
		{
			header: "Name",
			footer: props => props.column.id,
			enableGrouping: false,
			columns: [
				{
					accessorKey: "firstName",
					cell: info => info.getValue(),
					footer: props => props.column.id
				},
				{
					accessorFn: row => row.lastName,
					id: "lastName",
					cell: info => info.getValue(),
					header: () => <span>Last Name</span>,
					footer: props => props.column.id
				}
			]
		},
		{
			header: "Info",
			footer: props => props.column.id,
			enableGrouping: false,
			columns: [
				{
					accessorKey: "age",
					header: () => "Age",
					footer: props => props.column.id
				},
				{
					accessorKey: "visits",
					header: () => <span>Visits</span>,
					footer: props => props.column.id
				},
				{
					accessorKey: "status",
					header: "Status",
					footer: props => props.column.id
				},
				{
					accessorKey: "progress",
					header: "Profile Progress",
					footer: props => props.column.id
				}
			]
		}
	]);

	const [{ pageIndex, pageSize }, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	})

	const fetchDataOptions = {
		pageIndex,
		pageSize
	}

	const dataQuery = useQuery(
		["data", fetchDataOptions],
		() => fetchData(fetchDataOptions),
		{keepPreviousData: true}
	);

	const defaultData = useMemo(() => [], []);
	const pagination = useMemo(
		() => ({
			pageIndex,
			pageSize
		}),
		[pageIndex, pageSize]
	);

	const [theme, setTheme] = useState(false);
	const [grouping, setGrouping] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [sorting, setSorting] = useState([]);
	const [rowSelection, setRowSelection] = useState({});
	const [globalFilter, setGlobalFilter] = useState('');
	const [openMenuColumns, setOpenMenuColumns] = useState(false);

	const fuzzyFilter = (row, columnId, value, addMeta) => {
		// Rank the item
		const itemRank = rankItem(row.getValue(columnId), value)
	  
		// Store the ranking info
		addMeta(itemRank)
	  
		// Return if the item should be filtered in/out
		return itemRank.passed
	}
	  
	const tableInit = useReactTable({
		data: dataQuery.data?.rows ?? defaultData,
		columns,
		enableColumnResizing: true,
    	columnResizeMode: 'onChange',
		pageCount: dataQuery.data?.pageCount ?? -1,
		state: {
			grouping,
			columnVisibility,
			sorting,
			globalFilter,
			rowSelection,
			pagination
		},

		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onGroupingChange: setGrouping,
		onGlobalFilterChange: setGlobalFilter,

		onPaginationChange: setPagination,

		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		globalFilterFn: fuzzyFilter,

		manualPagination: true,

		debugTable: true,
		debugHeaders: false,
    	debugColumns: false,
		paginateExpandedRows: false
	});

	useEffect(() => {
		theme ? document.querySelector("html").classList.add('dark') : document.querySelector("html").classList.remove('dark')
	}, [theme]);

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-slate-800">
			<div className="p-2">
				<div className="h-2" />
				<div>
					<button
						className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
						onClick={() => refreshData()}>Reset</button>
					<button
						className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
						onClick={() => setTheme(!theme)}>Theme</button>
				</div>
				
				<div className="p-2 flex justify-between pt-14">
					<SearchAll
						globalFilter={globalFilter}
						setHandlerGlobalFilter={(value) => setGlobalFilter(value)}
					/>

					<div className="relative max-w-max z-10 ml-auto mr-0">
						<button 
							onClick={() => setOpenMenuColumns(!openMenuColumns)}
							className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
							<VscFilterFilled className="inline-block mr-2"/> Columnas
						</button>

						<div className={`absolute ${!openMenuColumns && ('hidden')} top-full right-0`}>
							<ColumnsVisibility
								className="inline-block border border-gray-200 shadow w-40 bg-white dark:bg-gray-600 dark:border-gray-500"
								evtToggleAllColumns={() => tableInit.getToggleAllColumnsVisibilityHandler()}
								hasIsAllColumnsVisible={tableInit.getIsAllColumnsVisible()}
								getAllLeafColumns={tableInit.getAllLeafColumns()}
							/>
						</div>
					</div>
				</div>


				<Datatable
					tableInit={tableInit}
				/>
				
				<PaginationTable 
					hasCanPreviousPage={tableInit.getCanPreviousPage()}
					hasCanNextPage={tableInit.getCanNextPage()}
					evtStartPage={() => tableInit.setPageIndex(0)}
					evtEndPage={() => tableInit.setPageIndex(tableInit.getPageCount() - 1)}
					evtNextPage={() => tableInit.nextPage()}
					evtPrevPage={() => tableInit.previousPage()}
					page={tableInit.getState().pagination.pageIndex + 1}
					pageOf={tableInit.getPageCount()}
					goPage={tableInit.getState().pagination.pageIndex + 1}
					evtGoPage={(page) => tableInit.setPageIndex(page)}
					pageSize={tableInit.getState().pagination.pageSize}
					setPageSize={(val) => tableInit.setPageSize(val)}
					pageSizeArray={[10, 20, 30, 40, 50]}
					isFetching={dataQuery.isFetching}
				/>
				
				<pre className="text-gray-800 dark:text-gray-100">
					{JSON.stringify(pagination, null, 2)}
				</pre>
			</div>
		</div>
	);
}

export default App
