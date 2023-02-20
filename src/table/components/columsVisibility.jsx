const ColumnsVisibility = (props) => {
	const {
		evtToggleAllColumns,
		hasIsAllColumnsVisible,
		getAllLeafColumns,
		className
	} = props;

	return(
		<div className={className}>
			<div className="px-2 pb-0.5 pt-1 border-b border-gray-200 bg-slate-100 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200">
				<label>
					<input
						type="checkbox"
						onChange={evtToggleAllColumns()}
						checked={hasIsAllColumnsVisible}
						className="w-4 h-4 rounded border appearance-none checked:bg-blue-400 dark:checked:bg-blue-500 bg-white mr-2"
					/>
					Todos
				</label>
			</div>
			{getAllLeafColumns.map(column => {				
				return (
					!['select'].includes(column.id) && (
						<div key={column.id} className="px-2 pt-0.5 dark:text-gray-200">
							<label className="flex items-center">
								<input
									type="checkbox"
									onChange={column.getToggleVisibilityHandler()}
									checked={column.getIsVisible()}
									className="w-4 h-4 rounded border appearance-none checked:bg-blue-400 dark:checked:bg-blue-500 bg-white mr-2"
								/>
								{typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
							</label>
						</div>
					)
				)
				})}
		</div>
	)
}

export default ColumnsVisibility;