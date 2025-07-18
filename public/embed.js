// Self-executing function to create and manage the chat widget
(function () {
	// --- PRE-EXECUTION CHECKS ---

	// 1. Ensure the script doesn't run twice
	if (document.getElementById("chat-widget-container")) {
		console.warn("Chat widget script has already been loaded.");
		return;
	}

	// 2. Get configuration from the script tag itself (removes hardcoding)
	const scriptTag = document.currentScript;
	const iframeSrc = scriptTag ? scriptTag.dataset.source : null;

	if (!iframeSrc) {
		console.error(
			"Chat widget source URL not found. Please add 'data-source' attribute to the script tag."
		);
		return;
	}

	// 3. Helper to get origin from a URL for security
	const getOriginFromUrl = (url) => {
		try {
			return new URL(url).origin;
		} catch (e) {
			console.error("Invalid iframe source URL:", url);
			return null;
		}
	};

	const iframeOrigin = getOriginFromUrl(iframeSrc);
	if (!iframeOrigin) return;

	// --- STATE MANAGEMENT ---
	const widgetState = {
		isOpen: false,
		isFullscreen: false,
		position: "bottom-right", // Default position
		// Store normal, expanded dimensions
		lastNormalDimensions: {
			width: "500px",
			height: "700px",
			borderRadius: "15px",
		},
	};

	// --- DOM CREATION ---
	const createChatWidget = () => {
		const container = document.createElement("div");
		container.id = "chat-widget-container";

		const iframe = document.createElement("iframe");
		iframe.id = "chat-iframe";
		iframe.src = iframeSrc;
		iframe.style.position = "fixed";
		iframe.style.zIndex = "9999";
		iframe.style.border = "none";
		iframe.style.background = "transparent";
		iframe.style.overflow = "hidden";
		iframe.style.transition = "all 0.3s ease";
		iframe.allow = "microphone; camera";

		// Start in collapsed state
		applyStyles(iframe, getCollapsedStyles());

		container.appendChild(iframe);
		document.body.appendChild(container);
		return iframe;
	};

	// --- STYLE HELPERS ---
	const applyStyles = (element, styles) => {
		for (const property in styles) {
			element.style[property] = styles[property];
		}
	};

	const getCollapsedStyles = () => ({
		width: "100px",
		height: "100px",
		top: "auto",
		left: widgetState.position === "bottom-left" ? "0" : "auto",
		bottom: "0",
		right: widgetState.position === "bottom-right" ? "0" : "auto",
		borderRadius: "0",
	});

	const getExpandedStyles = () => ({
		width: widgetState.lastNormalDimensions.width,
		height: widgetState.lastNormalDimensions.height,
		top: "auto",
		left: widgetState.position === "bottom-left" ? "20px" : "auto",
		bottom: "20px",
		right: widgetState.position === "bottom-right" ? "20px" : "auto",
		borderRadius: widgetState.lastNormalDimensions.borderRadius,
	});

	const getFullscreenStyles = () => ({
		width: "100%",
		height: "100%",
		top: "0",
		left: "0",
		bottom: "auto",
		right: "auto",
		borderRadius: "0",
	});

	// --- WIDGET ACTIONS ---
	const expandWidget = () => {
		if (widgetState.isOpen) return;
		applyStyles(
			iframe,
			widgetState.isFullscreen ? getFullscreenStyles() : getExpandedStyles()
		);
		widgetState.isOpen = true;
	};

	const collapseWidget = () => {
		if (!widgetState.isOpen) return;
		// Don't reset isFullscreen state when collapsing
		applyStyles(iframe, getCollapsedStyles());
		widgetState.isOpen = false;
	};

	const toggleFullscreen = (enable) => {
		widgetState.isFullscreen = enable;
		if (widgetState.isOpen) {
			applyStyles(iframe, enable ? getFullscreenStyles() : getExpandedStyles());
		}
	};

	// --- EVENT HANDLING ---
	const handleMessage = (event) => {
		// Security: only accept messages from the iframe's origin
		if (event.origin !== iframeOrigin) {
			return;
		}

		const { type, value } = event.data;

		switch (type) {
			case "CHAT_WIDGET_OPEN":
				expandWidget();
				break;
			case "CHAT_WIDGET_CLOSE":
				collapseWidget();
				break;
			case "CHAT_WIDGET_FULLSCREEN":
				toggleFullscreen(value);
				break;
			case "EXTERNAL_LINK":
				if (value && value.url) {
					window.open(value.url, "_blank", "noopener,noreferrer");
				}
				break;
		}
	};

	// --- INITIALIZATION ---
	const iframe = createChatWidget();

	// Listen for messages from the iframe
	window.addEventListener("message", handleMessage);

	// More efficient click listener directly on the iframe
	iframe.addEventListener("click", () => {
		if (!widgetState.isOpen) {
			expandWidget();
		}
	});

	iframe.addEventListener("load", () =>
		console.log("Chat iframe loaded successfully.")
	);
	iframe.addEventListener("error", (e) =>
		console.error("Chat iframe failed to load:", e)
	);

	// --- PUBLIC API ---
	window.ChatWidgetConfig = {
		setPosition: (position) => {
			if (position !== "bottom-left" && position !== "bottom-right") {
				console.warn('Invalid position. Use "bottom-left" or "bottom-right"');
				return;
			}
			widgetState.position = position;
			// Re-apply styles based on new position
			applyStyles(
				iframe,
				widgetState.isOpen ? getExpandedStyles() : getCollapsedStyles()
			);
		},
		setBrandColor: (color) => {
			// Post message securely to the specific iframe origin
			iframe.contentWindow.postMessage(
				{ type: "CHAT_WIDGET_CONFIG", value: { brandColor: color } },
				iframeOrigin
			);
		},
	};
})();
