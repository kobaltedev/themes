/**
 * Inline script to prevent FOUC when loading themes.
 * Uses cookies for SSR support.
 */

export type ThemeScriptProps = {
	cookieName?: string;
	defaultTheme?: string;
	attribute?: "class" | "data-theme";
	nonce?: string;
};

function getThemeScript(props: ThemeScriptProps = {}) {
	const {
		cookieName = "theme",
		defaultTheme = "system",
		attribute = "data-theme",
	} = props;

	return `
(function() {
  try {
    var cookieName = ${JSON.stringify(cookieName)};
    var defaultTheme = ${JSON.stringify(defaultTheme)};
    var attribute = ${JSON.stringify(attribute)};
    
    function getCookie(name) {
      if (!document.cookie) return null;
      var match = document.cookie.match(new RegExp('\\\\W?' + name + '=([^;]+)'));
      return match ? match[1] : null;
    }
    
    var theme = getCookie(cookieName) || defaultTheme;
    var resolved = theme;
    
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    var root = document.documentElement;
    
    if (attribute === 'class') {
      root.classList.add(resolved);
    } else {
      root.setAttribute('data-theme', resolved);
    }
    
    // Add 'dark' class for Tailwind compatibility
    if (resolved === 'dark') {
      root.classList.add('dark');
    }
  } catch (e) {}
})();
`.trim();
}

export function ThemeScript(props: ThemeScriptProps = {}) {
	return <script nonce={props.nonce} innerHTML={getThemeScript(props)} />;
}

export { getThemeScript };
