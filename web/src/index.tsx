import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1
		},
	},
});

root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App/>
		</QueryClientProvider>
	</React.StrictMode>
);
