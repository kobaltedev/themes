import { useTheme } from "@kobalte/themes";

export default function Home() {
	const { theme, resolvedTheme, setTheme, themes } = useTheme();

	return (
		<main class="min-h-screen p-8">
			<div class="max-w-2xl mx-auto space-y-8">
				<h1 class="text-4xl font-bold">Theme Demo</h1>

				{/* Theme Status */}
				<div
					class="p-6 rounded-lg"
					style={{ background: "rgb(var(--color-card))" }}
				>
					<h2 class="text-xl font-semibold mb-4">Current Theme</h2>
					<p class="mb-2">
						<span class="font-medium">Selected:</span>{" "}
						<code
							class="px-2 py-1 rounded"
							style={{ background: "rgb(var(--color-border))" }}
						>
							{theme()}
						</code>
					</p>
					<p>
						<span class="font-medium">Resolved:</span>{" "}
						<code
							class="px-2 py-1 rounded"
							style={{ background: "rgb(var(--color-border))" }}
						>
							{resolvedTheme()}
						</code>
					</p>
				</div>

				{/* Theme Switcher */}
				<div
					class="p-6 rounded-lg"
					style={{ background: "rgb(var(--color-card))" }}
				>
					<h2 class="text-xl font-semibold mb-4">Switch Theme</h2>
					<div class="flex gap-3 flex-wrap">
						{themes.map((t) => (
							<button
								type="button"
								onClick={() => setTheme(t)}
								class="px-4 py-2 rounded-lg font-medium transition-colors"
								style={{
									background:
										theme() === t
											? "rgb(var(--color-primary))"
											: "rgb(var(--color-border))",
									color:
										theme() === t
											? "rgb(var(--color-primary-foreground))"
											: "rgb(var(--color-text))",
								}}
							>
								{t.charAt(0).toUpperCase() + t.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Color Swatches */}
				<div
					class="p-6 rounded-lg"
					style={{ background: "rgb(var(--color-card))" }}
				>
					<h2 class="text-xl font-semibold mb-4">Theme Colors</h2>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<div
								class="h-16 rounded-lg mb-2"
								style={{
									background: "rgb(var(--color-bg))",
									border: "1px solid rgb(var(--color-border))",
								}}
							/>
							<p
								class="text-sm"
								style={{ color: "rgb(var(--color-text-muted))" }}
							>
								--color-bg
							</p>
						</div>
						<div>
							<div
								class="h-16 rounded-lg mb-2"
								style={{ background: "rgb(var(--color-primary))" }}
							/>
							<p
								class="text-sm"
								style={{ color: "rgb(var(--color-text-muted))" }}
							>
								--color-primary
							</p>
						</div>
						<div>
							<div
								class="h-16 rounded-lg mb-2"
								style={{
									background: "rgb(var(--color-card))",
									border: "1px solid rgb(var(--color-border))",
								}}
							/>
							<p
								class="text-sm"
								style={{ color: "rgb(var(--color-text-muted))" }}
							>
								--color-card
							</p>
						</div>
						<div>
							<div
								class="h-16 rounded-lg mb-2"
								style={{ background: "rgb(var(--color-border))" }}
							/>
							<p
								class="text-sm"
								style={{ color: "rgb(var(--color-text-muted))" }}
							>
								--color-border
							</p>
						</div>
					</div>
				</div>

				{/* Tailwind Dark Mode Example */}
				<div class="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
						Tailwind Dark Mode Classes
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						This box uses Tailwind's{" "}
						<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">dark:</code>{" "}
						variant classes. They automatically respond to the theme because we
						set{" "}
						<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">
							class="dark"
						</code>{" "}
						on the HTML element.
					</p>
				</div>
			</div>
		</main>
	);
}
