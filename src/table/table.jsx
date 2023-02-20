import { flexRender } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { VscArrowSwap, VscChevronDown, VscChevronRight, VscGroupByRefType, VscTriangleDown, VscTriangleUp, VscUngroupByRefType } from "react-icons/vsc";
import DebouncedInput from './components/DebounceInput';
import { motion, AnimatePresence } from  'framer-motion';

const Datatable = ({tableInit}) => {
	return (
		<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
			<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:font-light">
				{tableInit.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => <HeadTh key={header.id} header={header} tableInit={tableInit} />)}
					</tr>
				))}
			</thead>
			<tbody>
				<AnimatePresence>
					{tableInit.getRowModel().rows.length > 0 ?
						tableInit.getRowModel().rows.map((row) => <BodyTr key={`${row.id}`} row={row} />)
						: 
						<motion.tr className="bg-gray-50 text-black dark:text-gray-300 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
							<td 
								colSpan={100}
								className={`px-1.5 py-1.5 text-center font-semibold h-[300px] `}
								>
								Sin resultados
							</td>
						</motion.tr>
					}
				</AnimatePresence>
			</tbody>
		</table>
	);
}

function HeadTh({header, tableInit}) {
	return (
		<th colSpan={header.colSpan} className="px-2 py-1.5 border border-gray-200 dark:border-gray-500 relative" style={{width: header.getSize()}}>
			{header.isPlaceholder ? null : (
				<div className="flex items-center justify-between flex-row">
					<span className="flex items-center">
						{/* Btn Grouping */}
						{console.log(header.column.getCanGroup())}
						{header.column.getCanGroup() && (
							// If the header can be grouped, let's add a toggle
							<button
								onClick={header.column.getToggleGroupingHandler()}
								className="cursor-pointer mr-2"
							>
								{header.column.getIsGrouped() ? <VscUngroupByRefType className="text-lg" /> : <VscGroupByRefType className="text-base" />}
							</button>
						)}

						{/* Value */}
						{ flexRender(header.column.columnDef.header, header.getContext()) }
					</span>

					{/* Btn Sorting */}
					{
						header.column.getCanSort() && (
							<button
								onClick={header.column.getToggleSortingHandler()}
								className="cursor-pointer select-none"
							>

								{
									{
										asc: <VscTriangleUp className="text-sky-600 text-base"/>,
										desc: <VscTriangleDown className="text-sky-600 text-base" />,
									}
									[header.column.getIsSorted()] ?? <VscArrowSwap className="rotate-90 text-base" />
								}
							</button>
						)
					}
				</div>
			)}

			{
				header.column.getCanFilter()  && (
					<div>
						<Filter column={header.column} tableInit={tableInit} />
					</div>
				)
			}

			{header.column.getCanResize() && (
				<div
					onMouseDown={header.getResizeHandler()}
					onTouchStart={header.getResizeHandler()}
					className={`resizer absolute right-0 top-0 h-full w-2 bg-sky-700 dark:bg-gray-300 opacity-0 hover:opacity-100 cursor-col-resize select-none touch-none ${ header.column.getIsResizing() ? 'isResizing' : '' }`}
				></div>
			)}
		</th>
	)
}

function BodyTr({row, id}) {
	const spring = useMemo	(
		() => ({
		  type: 'spring',
		  damping: 50,
		  stiffness: 50,
		}),
		[]
	);

	return(
		<motion.tr 
			className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
			// layoutTransition={spring}
			// exit={{ opacity: 0, maxHeight: 0 }}
		>
			{row.getVisibleCells().map((cell) => {
				return (
					<motion.td
						className={`px-1.5 py-1.5 `}
						key={cell.id}
						// layoutTransition={spring}
						// exit={{ opacity: 0, maxHeight: 0 }}
					>
						{cell.getIsGrouped() && row.getCanExpand() ? (
							// If it's a grouped cell, add an expander and row count
							<>
								<button
									{...{
										onClick: row.getToggleExpandedHandler(),
										style: {
											cursor: row.getCanExpand() ? "pointer" : "normal",
										},
									}}
								>
									{row.getIsExpanded() ? <VscChevronDown className="inline-block text-base" /> : <VscChevronRight className="inline-block text-base" />} {flexRender(cell.column.columnDef.cell, cell.getContext())} ({row.subRows.length})
								</button>
							</>
						) : cell.getIsAggregated() ? (
							// If the cell is aggregated, use the Aggregated
							// renderer for cell
							flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
						) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
							// Otherwise, just render the regular cell
							flexRender(cell.column.columnDef.cell, cell.getContext())
						)}
					</motion.td>
				);
			})}
		</motion.tr>
	)
}

function Filter({ column, tableInit }) {
	const firstValue = tableInit.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
	const columnFilterValue = column.getFilterValue();
	const sortedUniqueValues = useMemo(
		() =>
		  typeof firstValue === 'number'
			? []
			: Array.from(column.getFacetedUniqueValues().keys()).sort(),
		[column.getFacetedUniqueValues()]
	);

	return typeof firstValue === 'number' ? (
		<div className="pt-1">
			<div className="flex space-x-2">
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
					value={columnFilterValue?.[0] ?? ''}
					onChange={value =>
						column.setFilterValue(old => [value, old?.[1]])
					}
					placeholder={`Min ${
						column.getFacetedMinMaxValues()?.[0]
						? `(${column.getFacetedMinMaxValues()?.[0]})`
						: ''
					}`}
					className="bg-white shadow-sm border border-gray-300 text-gray-900 text-xs rounded-sm w-full h-7 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				/>
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
					value={columnFilterValue?.[1] ?? ''}
					onChange={value =>
						column.setFilterValue(old => [old?.[0], value])
					}
					placeholder={`Max ${
						column.getFacetedMinMaxValues()?.[1]
						? `(${column.getFacetedMinMaxValues()?.[1]})`
						: ''
					}`}
					className="bg-white shadow-sm border border-gray-300 text-gray-900 text-xs rounded-sm w-full h-7 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				/>
			</div>
		</div>
	  ) : (
		<div className="pt-1">
			<datalist id={column.id + 'list'}>
				{sortedUniqueValues.slice(0, 5000).map(value => (
				<option value={value} key={value} />
				))}
			</datalist>
			<DebouncedInput
				type="text"
				value={columnFilterValue ?? ''}
				onChange={value => column.setFilterValue(value)}
				placeholder={`Buscar...`}
				className="bg-white shadow-sm border border-gray-300 text-gray-900 text-xs rounded-sm w-full h-7 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				list={column.id + 'list'}
			/>
		</div>
	  )
}

export default Datatable;