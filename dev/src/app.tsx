import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { ThemeProvider } from "../../src";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
	return (
		<ThemeProvider defaultTheme="system">
			<Router
				root={(props) => (
					<>
						<Nav />
						<Suspense>{props.children}</Suspense>
					</>
				)}
			>
				<FileRoutes />
			</Router>
		</ThemeProvider>
	);
}
