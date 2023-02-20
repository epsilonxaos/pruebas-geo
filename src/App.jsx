import {getmakeData} from './faker/makeData';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getGroupedRowModel, getPaginationRowModel, getSortedRowModel, useReactTable} from '@tanstack/react-table';
import { rankItem,compareItems } from '@tanstack/match-sorter-utils'

import PaginationTable from './table/components/pagination';
import SearchAll from './table/components/searshAll';
import ColumnsVisibility from './table/components/columsVisibility';
import Datatable from './table/table';
import { VscEdit, VscFilterFilled } from 'react-icons/vsc';
import IndeterminateCheckbox from './table/components/Indeterminate';
import { create } from 'zustand'

const useStore = create(() => ({ data: [], accion: 'add', dataEdit: {} }));
// Getting non-reactive fresh state
const data = useStore.getState().data;
const unsub2 = useStore.subscribe((state) => state.data, console.log)
unsub2();

function App() {
	const rerender = useReducer(() => ( {} ), {})[1];
	const [columns, setColumns] = useState([]);
	const [theme, setTheme] = useState(false);
	const data = useStore((state) => state.data);
	const accion = useStore((state) => state.accion);
	const dataEdit = useStore((state) => state.dataEdit);

	const [dataReplace, setDataReplace] = useState([]);
	// const [data, setData] = useState(() => getmakeData(25));
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

	const addColmnsClic = (value) => {
		setColumns([
			...columns,
			{
				header: value,
				idx: formatID(value),
				accessorKey: formatID(value)
			}
		]);

		console.log(columns);
	}

	const setDataEdit = (id) => {
		const data = useStore.getState().data;
		let dataArray = data.filter(item => item.id === id)[0];

		useStore.setState({ dataEdit: dataArray, accion: "edit" });
	}

	const editData = (id) => {
		let dataC = [...data];
		let index = dataC.findIndex(item => item.id === id);
		
		let inputs = document.querySelectorAll("#formData input");
		inputs.forEach(input => {
			dataC[index][input.id] = input.value;
		});

		const newArr = dataC.map(obj => {
			if (obj.id === 1) {
			  	inputs.forEach(input => {
					obj[input.id] = input.value;
				});
			}
		  
			return obj;
		});

		setDataReplace(newArr);
		document.getElementById("formData").reset();
	}

	useEffect(() => {
		useStore.setState({ data: dataReplace, accion: "add" });
	}, [dataReplace])

	const formatID = (val) => {
		let rep = val.replaceAll(" ", "_");
		return rep.toLowerCase();
	}

	const saveData = () => {
		let inputs = document.querySelectorAll("#formData input");
		let newD = {}
		inputs.forEach(input => {
			newD[input.id] = input.value;
		});
		useStore.setState({ data: [ ...data, newD ] });
		document.getElementById("formData").reset();
	}

	const tableInit = useReactTable({
		data,
		columns,
		enableColumnResizing: true,
    	columnResizeMode: 'onChange',

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

		debugTable: false,
		debugHeaders: false,
    	debugColumns: false,
		paginateExpandedRows: false
	});

	useEffect(() => {
		setColumns([
			{
				header: "Acciones",
				idx: 'acciones',
				cell: ({row}) => {
					let original = row.original;
					return (
						<>
							<button
								className="bg-blue-800 text-white py-1.5 px-2 text-sm rounded"
								onClick={() => setDataEdit(original.id)}
							>
								<VscEdit className="inline-block" />
							</button>
						</>
					)
				},
			},
			{
				header: "ID",
				idx: "id",
				accessorKey: "id"
			}
		]);
	}, []);

	useEffect(() => {
		theme ? document.querySelector("html").classList.add('dark') : document.querySelector("html").classList.remove('dark')
	}, [theme]);

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-slate-800">
			<div className="p-2">
				<form className="flex items-center pt-4 gap-2">
					<div className="mb-6 col-span-4 md:col-span-2">
						<label htmlFor="newCol" className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white">Nueva columna</label>
						<input type="text" id="newCol" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-56 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ejemplo: titulo" required />
					</div>

					<button 
						onClick={() => {
							let x = document.getElementById("newCol");

							if(x.value) {
								addColmnsClic(x.value);
								x.value = ''
							}
						}}
						type="button" 
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Agregar Columna</button>
				</form>

				<div className="py-4">
					<form id="formData" className="grid grid-cols-4 md:grid-cols-3 gap-2">
						{
							columns.length > 0 ?
							columns.map((item, idx) => {
								if(idx > 0) {
									return (
										<div className="mb-6 col-span-4 md:col-span-1" key={'add-'+item.idx}>
											<label htmlFor={item.idx} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{item.header}</label>
											<input 
												type="text" 
												id={item.idx} 
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
												{...(item.idx === 'id' ? 
													{
														disabled: true, 
														value: (accion === 'add') ? data.length + 1 : (dataEdit.hasOwnProperty(item.idx)) ? dataEdit[item.idx] : '' 
													}
													:
													{
														defaultValue: (accion === 'add') ? '' : (dataEdit.hasOwnProperty(item.idx)) ? dataEdit[item.idx] : '' 
													}
												)}
											/>
										</div>
									)
								}
							})
							:
							<></>
						}
					</form>

					{accion === 'add' && (
						<button 
							onClick={() => saveData()}
							type="button" 
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>Agregar Data</button>
					)}

					{accion === 'edit' && (
						<>
							<button 
								onClick={() => editData(dataEdit.id)}
								type="button" 
								className="text-white bg-yellow-700 hover:bg-yellow-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700"
							>Editar Data</button>
							<button 
								onClick={() => useStore.setState({accion: "add" })}
								type="button" 
								className="text-white ml-2 bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700"
							>Cancelar</button>
						</>
					)}

				</div>
				<div className="p-2 flex justify-between">
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
