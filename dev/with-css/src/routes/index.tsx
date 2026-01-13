import { useTheme } from "../../../../src";

export default function Home() {
	const { theme, resolvedTheme, setTheme, themes } = useTheme();

	return (
		<main class="container">
			<h1>CSS-Only Theme Demo</h1>
			<p class="subtitle">Just CSS custom properties</p>

			{/* Theme Status */}
			<section class="card">
				<h2>Current Theme</h2>
				<div class="status-row">
					<span class="label">Selected:</span>
					<code>{theme()}</code>
				</div>
				<div class="status-row">
					<span class="label">Resolved:</span>
					<code>{resolvedTheme()}</code>
				</div>
			</section>

			{/* Theme Switcher */}
			<section class="card">
				<h2>Switch Theme</h2>
				<div class="button-group">
					{themes.map((t) => (
						<button
							type="button"
							class={theme() === t ? "active" : ""}
							onClick={() => setTheme(t)}
						>
							{t.charAt(0).toUpperCase() + t.slice(1)}
						</button>
					))}
				</div>
			</section>

			{/* Color Swatches */}
			<section class="card">
				<h2>Theme Colors</h2>
				<div class="swatches">
					<div class="swatch">
						<div
							class="swatch-color"
							style={{
								background: "rgb(var(--color-bg))",
								border: "1px solid rgb(var(--color-border))",
							}}
						/>
						<span>--color-bg</span>
					</div>
					<div class="swatch">
						<div
							class="swatch-color"
							style={{ background: "rgb(var(--color-primary))" }}
						/>
						<span>--color-primary</span>
					</div>
					<div class="swatch">
						<div
							class="swatch-color"
							style={{
								background: "rgb(var(--color-card))",
								border: "1px solid rgb(var(--color-border))",
							}}
						/>
						<span>--color-card</span>
					</div>
					<div class="swatch">
						<div
							class="swatch-color"
							style={{ background: "rgb(var(--color-border))" }}
						/>
						<span>--color-border</span>
					</div>
				</div>
			</section>
		</main>
	);
}
