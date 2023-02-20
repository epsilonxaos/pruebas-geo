import DebouncedInput from "./DebounceInput";

const SearchAll = (props) => {
	const {
		globalFilter,
		setHandlerGlobalFilter,
		className
	} = props;

	return(
		<div className={className}>
			<p className="text-sm font-medium text-gray-900 dark:text-white inline-block">Buscar:</p>
			<DebouncedInput
				value={globalFilter ?? ''}
				onChange={value => setHandlerGlobalFilter(String(value))}
				className="bg-gray-50 ml-3 inline-block border border-gray-300 text-gray-900 text-sm rounded w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				placeholder="Buscar en todas las columnas..."
			/>
		</div>
	)
}

export default SearchAll;