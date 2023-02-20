import { VscChevronLeft, VscChevronRight, VscFoldUp } from "react-icons/vsc";

const PaginationTable = (props) => {
	const {
		hasCanPreviousPage,
		hasCanNextPage,
		evtStartPage,
		evtEndPage,
		evtNextPage,
		evtPrevPage,
		page,
		pageOf,
		goPage,
		evtGoPage,
		pageSize,
		setPageSize,
		pageSizeArray,
		isFetching = false
	} = props;

	return(
		<div className="grid grid-cols-2 pt-2 relative">
			<div className="col-span-1 flex items-center gap-2">
				<button 
					className={`rounded py-2 px-2 border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 ${!hasCanPreviousPage ? 'bg-gray-300 border-gray-300 text-gray-400 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed' : 'border-gray-200 shadow-sm dark:border-gray-600'}`} 
					onClick={() => evtStartPage()} 
					disabled={!hasCanPreviousPage}>
					<VscFoldUp className="-rotate-90" />
				</button>
				<button 
					className={`rounded py-2 px-2 border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 ${!hasCanPreviousPage ? 'bg-gray-300 border-gray-300 text-gray-400 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed' : 'border-gray-200 shadow-sm dark:border-gray-600'}`}
					onClick={() => evtPrevPage()} 
					disabled={!hasCanPreviousPage}>
					<VscChevronLeft />
				</button>
				<button 
					className={`rounded py-2 px-2 border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 ${!hasCanNextPage ? 'bg-gray-300 border-gray-300 text-gray-400 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed' : 'border-gray-200 shadow-sm dark:border-gray-600'}`} 
					onClick={() => evtNextPage()} 
					disabled={!hasCanNextPage}>
					<VscChevronRight />
				</button>
				<button 
					className={`rounded py-2 px-2 border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 ${!hasCanNextPage ? 'bg-gray-300 border-gray-300 text-gray-400 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed' : 'border-gray-200 shadow-sm dark:border-gray-600'}`}
					onClick={() => evtEndPage()} 
					disabled={!hasCanNextPage}>
					<VscFoldUp className="rotate-90" />
				</button>
				<span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
					<p className="mb-0">Página</p>
					<strong>
						{page} de {pageOf}
					</strong>
				</span>
			</div>
			<div className="col-span-1 flex items-center justify-end gap-2">
				<span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
					Ir a la página:
					<input
						type="number"
						defaultValue={goPage}
						onChange={(e) => {
							const page = e.target.value ? Number(e.target.value) - 1 : 0;
							evtGoPage(page);
						}}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm w-16 px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
					/>
				</span>
				<select
					value={pageSize}
					onChange={(e) => {
						setPageSize(Number(e.target.value));
					}}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm w-32 px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				>
					{pageSizeArray.map((pgSize) => (
						<option key={pgSize} value={pgSize}>
							Show {pgSize}
						</option>
					))}
				</select>
			</div>
			{isFetching ? <div className="absolute z-10 top-0 left-0 h-full w-full bg-white bg-opacity-75 text-black font-semibold dark:bg-gray-700 dark:bg-opacity-75 dark:text-white flex items-center justify-center">Loading</div> : null}
		</div>
	)
}

export default PaginationTable;