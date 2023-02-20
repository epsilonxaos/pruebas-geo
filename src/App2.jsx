import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional theme CSS

import {
	getmakeData
} from './faker/makeData';

const App = () => {
	const gridRef = useRef(); // Optional - for accessing Grid's API
	const [rowData, setRowData] = useState(() => getmakeData(50)); // Set rowData to Array of Objects, one Object per Row

	// Each Column Definition results in one Column.
	const [columnDefs, setColumnDefs] = useState([
		{ 
			headerName: "customer",
			children: [
				{field: "name"},
				{field: "lastName"}
			]
			
		}, 
		{
			headerName: "Information Customer",
			children: [
				{ field: "age", type: "numberColumn", filter: 'agNumberColumnFilter' },
				{ field: "email" }
			]
		},
		{ 
			field: "status",
			type: 'numberColumn',
			filter: 'agNumberColumnFilter'
		},
		{ 
			field: "progress",
			type: "numberColumn", filter: 'agNumberColumnFilter'
		}
	]);

	// DefaultColDef sets props common to all Columns
	const defaultColDef = useMemo(() => ({
		sortable: true,
		resizable: true,
		floatingFilter: true,
		editable: false,
		filter: true,
		filterParams: {
            buttons: ['reset', 'apply'],
            debounceMs: 200
        }
		
	}));

	// Example of consuming Grid Event
	const cellClickedListener = useCallback((event) => {
		console.log("cellClicked", event);
	}, []);

	const defaultColGroupDef = useMemo(() => {
		return {
		  marryChildren: true,
		};
	  }, []);

	return (
		<div className="p-3 bg-slate-900 w-full min-h-screen">

			{/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
			<div className="ag-theme-balham-dark h-[97vh]">
				<AgGridReact
					style={{ width: '100%', height: '100%;' }}
					ref={gridRef} // Ref for accessing Grid's API
					rowData={rowData} // Row Data for Rows
					columnDefs={columnDefs} // Column Defs for Columns
					defaultColDef={defaultColDef} // Default Column Properties
					animateRows={true} // Optional - set to 'true' to have rows animate when sorted
					rowSelection="multiple" // Options - allows click selection of rows
					onCellClicked={cellClickedListener} // Optional - registering for Grid Event
					defaultColGroupDef={defaultColGroupDef}
					pagination={true}
					paginationPageSize={15}
				/>
			</div>
		</div>
	);
};

export default App;
