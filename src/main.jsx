import React from "react";
import ReactDOM from "react-dom/client";
// import App from './App'
// import App from './AppPaginationController'
// import App from './AppTest'
// import App from './AppResp'

// import App from "./Validate";
import App from "./Chart";

import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
);
