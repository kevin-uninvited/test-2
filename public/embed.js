(function () {
	// Default configuration
	const defaultConfig = {
		brandColor: "#3B82F6",
		welcomeMessage: "Hi! How can I help you today?",
		position: "bottom-right",
		showOnScroll: "true",
		showOnInactivity: "true",
		inactivityDelay: "30000",
	};

	// Get configuration from script tag attributes or global config
	function getConfig() {
		const script =
			document.currentScript ||
			document.querySelector('script[src*="embed.js"]');
		const config = { ...defaultConfig };

		// Check for global ChatWidgetConfig
		if (window.ChatWidgetConfig) {
			Object.assign(config, window.ChatWidgetConfig);
		}

		// Override with script tag data attributes
		if (script) {
			const dataset = script.dataset;
			Object.keys(dataset).forEach((key) => {
				if (key.startsWith("widget")) {
					const configKey = key.replace("widget", "").toLowerCase();
					const actualKey =
						configKey.charAt(0).toLowerCase() + configKey.slice(1);
					config[actualKey] = dataset[key];
				}
			});
		}

		return config;
	}

	// Create iframe URL with configuration
	function createIframeUrl(config) {
		const baseUrl =
			window.ChatWidgetConfig?.baseUrl || "https://your-domain.com";
		const url = new URL("/widget", baseUrl);

		Object.keys(config).forEach((key) => {
			if (config[key]) {
				url.searchParams.set(key, config[key]);
			}
		});

		return url.toString();
	}

	// Create and inject iframe
	function createWidget() {
		// Check if widget already exists
		if (document.getElementById("chat-widget-iframe")) {
			return;
		}

		const config = getConfig();
		const iframeUrl = createIframeUrl(config);

		const iframe = document.createElement("iframe");
		iframe.id = "chat-widget-iframe";
		iframe.src = iframeUrl;
		iframe.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      background: transparent !important;
    `;

		// Allow pointer events on widget elements
		iframe.onload = function () {
			iframe.style.pointerEvents = "none";

			// Add CSS to allow pointer events on widget areas
			const style = document.createElement("style");
			style.textContent = `
        #chat-widget-iframe:hover {
          pointer-events: auto !important;
        }
      `;
			document.head.appendChild(style);
		};

		document.body.appendChild(iframe);
	}

	// Initialize when DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", createWidget);
	} else {
		createWidget();
	}

	// Expose global function for manual initialization
	window.initChatWidget = createWidget;
})();
