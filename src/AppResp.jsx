import {getmakeData} from './faker/makeData';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getGroupedRowModel, getPaginationRowModel, getSortedRowModel, useReactTable} from '@tanstack/react-table';
import { rankItem,compareItems } from '@tanstack/match-sorter-utils'

import PaginationTable from './table/components/pagination';
import SearchAll from './table/components/searshAll';
import ColumnsVisibility from './table/components/columsVisibility';
import Datatable from './table/table';
import { RiFilterOffLine } from 'react-icons/ri';
import { VscFilterFilled } from 'react-icons/vsc';
import { AiOutlineGroup, AiOutlineUngroup } from 'react-icons/ai';
import { MdVisibility } from 'react-icons/md';
import IndeterminateCheckbox from './table/components/Indeterminate';

import {
	fetchDataGeo
} from './faker/fetchDataGeo'
import { useQuery } from '@tanstack/react-query';

function App() {
	const rerender = useReducer(() => ( {} ), {})[1];
	const columns = useMemo(() => [
		{
			header: "Nombre",
			accessorKey: "nombre",
			cell: info => info.getValue(),
			enableGrouping: false,
		},
		{
			header: "Categoria",
			accessorKey: "categoria",
			cell: info => info.getValue(),
			enableGrouping: false,
		},
		{
			header: "Colonia",
			accessorKey: "unidad_habitacional",
			cell: info => info.getValue(),
			enableGrouping: false,
		},
		{
			header: "Estado",
			accessorKey: "estado",
			cell: info => info.getValue(),
			enableGrouping: false,
		},
		{
			header: "Sector",
			accessorKey: "nombre_sector",
			cell: info => info.getValue(),
			enableGrouping: false,
		},
		{
			header: "Solicitante",
			accessorKey: "solicitante",
			cell: info => info.getValue(),
			enableGrouping: false,
		},
		{
			header: "Tipo Reporte",
			accessorKey: "tipo_reporte",
			cell: info => info.getValue(),
			enableGrouping: false,
		},
		{
			header: "# Reportes",
			id: "num_reportes",
			accessorKey: "nombre",
			aggregationFn: 'count',
			enableGrouping: false,
		}
	]);

	const old = [
		{
			id: "select",
			header: ({ table }) => (
				<div className="text-center">
					<IndeterminateCheckbox 
						{...{
							checked: table.getIsAllPageRowsSelected(), //getIsAllRowsSelected
							indeterminate: table.getIsSomePageRowsSelected(), //getIsSomeRowsSelected
							onChange: table.getToggleAllPageRowsSelectedHandler() //getToggleAllRowsSelectedHandler
						}}
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="px-1 text-center">
					<IndeterminateCheckbox 
						{...{
							checked: row.getIsSelected(),
							indeterminate: row.getIsSomeSelected(),
							onChange: row.getToggleSelectedHandler()
						}}
					/>
				</div>
			),
			enableGrouping: false,
			size: 20
		},
		{
			header: "Customer",
			enableGrouping: false,
			columns: [
				{
					header: "Name",
					accessorKey: "name",
					cell: info => info.getValue(),
				},
				{
					header: "Last Name",
					accessorKey: "lastName",
					cell: info => info.getValue(),
				},
				{
					header: "Full Name",
					id: "fullName",
					accessorFn: row => `${row.name} ${row.lastName}`,
					aggregationFn: 'count',
				}
			]
		},
		{
			header: "Information",
			enableGrouping: false,
			columns: [
				{
					header: "Age",
					accessorKey: "age",
				},
				{
					header: "Email",
					accessorKey: "email",
					cell: info => info.getValue(),
					aggregationFn: 'count',
				},
				{
					header: "Status",
					accessorKey: "status",
					cell: ({getValue}) => Math.round(getValue() * 100) / 100,
					aggregatedCell: ({getValue}) => Math.round(getValue() * 100) / 100,
					aggregationFn: 'count',
				},
				{
					header: "Progress",
					accessorKey: "progress",
					cell: ({ getValue }) => Math.round(getValue() * 100) / 100 + '%',
					aggregationFn: 'mean',
					aggregatedCell: ({ getValue }) => Math.round(getValue() * 100) / 100 + '%',
				}
			]
		}
	]

	const dataQuery = useQuery(
		["data"],
		() => fetchDataGeo(),
		{keepPreviousData: true}
	)

	useEffect(() => {
		
	});

	const [theme, setTheme] = useState(false);
	// const [data, setData] = useState(() => getmakeData(50000));
	const [dataDefault, setDataDefault] = useState([]);
	const refreshData = () => {
		let newData = getmakeData(25);
		setData(newData)
	};
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
		data: dataQuery.data?.features ?? dataDefault,
		columns,
		enableColumnResizing: true,
    	columnResizeMode: 'onChange',

		enableRowSelection: true,

		state: {
			grouping,
			columnVisibility,
			sorting,
			globalFilter,
			rowSelection
		},

		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onGroupingChange: setGrouping,
		onGlobalFilterChange: setGlobalFilter,

		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		globalFilterFn: fuzzyFilter,

		// size: 30,
		// minSize: 30,

		enableExpanding: false,
		enableGrouping: false,

		debugTable: true,
		debugHeaders: false,
    	debugColumns: false,
		paginateExpandedRows: false
	});

	useEffect(() => {
		theme ? document.querySelector("html").classList.add('dark') : document.querySelector("html").classList.remove('dark')
	}, [theme]);

	// useEffect(() => {
	// 	tableInit.setGrouping(['status']);
	// 	tableInit.setColumnVisibility({"lastName": false, "name": false, "age": false})
	// }, []);
	useEffect(() => {
		console.log(tableInit);
		tableInit.setColumnVisibility({"num_reportes": false, 'select': false})
	}, []);

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-slate-800">
			<div className="p-2">
				<div className="h-2" />
				<div>
					<button
						className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
						onClick={() => refreshData()}>Refresh Data</button>
					<button
						className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
						onClick={() => setTheme(!theme)}>Theme</button>
				</div>
				<div className="p-2 pt-6 flex justify-between">
					<SearchAll
						globalFilter={globalFilter}
						setHandlerGlobalFilter={(value) => setGlobalFilter(value)}
					/>

					<div className="relative max-w-max z-10 ml-auto mr-0">
						<button
							className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none"
							onClick={() => {
								tableInit.setGrouping(['estado'])
								tableInit.setColumnVisibility({
									"nombre": false,
									"categoria": false,
									"unidad_habitacional": false,
									"nombre_sector": false,
									"solicitante": false,
									"tipo_reporte": false,
									"num_reportes": true
								})
							}}
						><AiOutlineGroup className="inline-block mr-2 text-lg" /> Agrupar</button>
						<button
							className="text-white bg-amber-700 hover:bg-amber-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-amber-600 dark:hover:bg-amber-700 focus:outline-none"
							onClick={() => {
								tableInit.setGrouping([])
								tableInit.setColumnVisibility({
									"nombre": true,
									"categoria": true,
									"unidad_habitacional": true,
									"nombre_sector": true,
									"solicitante": true,
									"tipo_reporte": true,
									"num_reportes": false
								})
							}}
						><AiOutlineUngroup className="inline-block mr-2 text-lg" /> Desagrupar</button>
						<button
							className="text-white bg-rose-700 hover:bg-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none"
							onClick={() => {tableInit.resetColumnFilters(); tableInit.resetGlobalFilter();}}
						><RiFilterOffLine className="inline-block mr-2 text-lg" /> Limpiar filtros</button>
						<button 
							onClick={() => setOpenMenuColumns(!openMenuColumns)}
							className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
							<MdVisibility className="inline-block mr-2 text-lg"/> Columnas
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
				/>
				
				<pre className="text-gray-800 dark:text-gray-100">
					{JSON.stringify(
						{
							grouping: grouping,
							columnVisibility: columnVisibility,
							sorting: sorting,
							globalFilter: globalFilter,
							rowSelection: rowSelection,
							setRowSelection: tableInit.getSelectedRowModel().flatRows
						},
						null,
						2
					)} 
				</pre>
			</div>
		</div>
	);
}

export default App
