import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { ThemeProvider } from "../../../src";
import "./app.css";

export default function App() {
	return (
		<ThemeProvider
			defaultTheme="system"
			themes={["light", "dark", "brand", "system"]}
		>
			<Router root={(props) => <Suspense>{props.children}</Suspense>}>
				<FileRoutes />
			</Router>
		</ThemeProvider>
	);
}
