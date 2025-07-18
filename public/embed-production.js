/**
 * Chat Widget Embed Script
 *
 * This script creates and manages a chat widget on your website.
 * Simply include this script on your page, and it will automatically
 * create the chat widget in the bottom-right corner.
 *
 * Configuration options are available through the global ChatWidgetConfig object.
 */

(function () {
	// Version
	const VERSION = "1.0.0";

	// Log initialization with version
	console.log(`Chat Widget v${VERSION} initializing...`);

	// Default configuration
	const DEFAULT_CONFIG = {
		widgetUrl: "http://localhost:3001/widget", // Replace with your production URL
		position: "bottom-right",
		collapsedWidth: "100px",
		collapsedHeight: "100px",
		expandedWidth: "500px",
		expandedHeight: "700px",
		brandColor: "#EF8143",
		zIndex: 9999,
	};

	// User configuration (can be overridden)
	let config = { ...DEFAULT_CONFIG };

	// Widget state
	let state = {
		isOpen: false,
		isFullscreen: false,
		isLoaded: false,
	};

	// DOM elements
	let elements = {
		container: null,
		iframe: null,
	};

	/**
	 * Create the chat widget elements
	 */
	function createChatWidget() {
		try {
			// Check if widget already exists
			if (document.getElementById("chat-widget-container")) {
				console.warn("Chat widget already exists on this page");
				return false;
			}

			// Create container for the widget
			const container = document.createElement("div");
			container.id = "chat-widget-container";

			// Create iframe
			const iframe = document.createElement("iframe");
			iframe.id = "chat-iframe";
			iframe.src = config.widgetUrl;
			iframe.style.width = config.collapsedWidth;
			iframe.style.height = config.collapsedHeight;
			iframe.style.position = "fixed";
			iframe.style.bottom = "0";
			iframe.style.right = "0";
			iframe.style.zIndex = config.zIndex;
			iframe.style.background = "transparent";
			iframe.style.border = "none";
			iframe.style.transition = "all 0.3s ease";
			iframe.style.overflow = "hidden";
			iframe.allow = "microphone; camera; popup";
			iframe.setAttribute("allowtransparency", "true");

			// Add to container
			container.appendChild(iframe);

			// Add container to body
			document.body.appendChild(container);

			// Store references
			elements.container = container;
			elements.iframe = iframe;

			// Add event listeners
			setupEventListeners();

			console.log("Chat widget created successfully");
			return true;
		} catch (error) {
			console.error("Error creating chat widget:", error);
			return false;
		}
	}

	/**
	 * Set up event listeners for the widget
	 */
	function setupEventListeners() {
		// Listen for messages from the iframe
		window.addEventListener("message", handleIframeMessages);

		// Add click handler to expand when clicked
		document.addEventListener("click", handleDocumentClick);

		// Check if iframe loads successfully
		elements.iframe.addEventListener("load", () => {
			console.log("Chat iframe loaded successfully");
			state.isLoaded = true;
		});

		elements.iframe.addEventListener("error", (e) => {
			console.error("Chat iframe failed to load:", e);
		});
	}

	/**
	 * Handle messages from the iframe
	 */
	function handleIframeMessages(event) {
		// Get the current URL for origin validation
		const allowedOrigins = [
			"http://localhost:3001",
			"https://localhost:3001",
			window.location.origin,
			// Add your production origins here
		];

		// Validate origin for security
		if (!allowedOrigins.includes(event.origin)) {
			console.warn("Message from unauthorized origin:", event.origin);
			return;
		}

		if (!event.data || typeof event.data !== "object") {
			return;
		}

		console.log("Message received:", event.data.type);

		// Handle different message types
		switch (event.data.type) {
			case "CHAT_WIDGET_FULLSCREEN":
				toggleFullscreen(event.data.value);
				break;

			case "CHAT_WIDGET_OPEN":
				expandWidget();
				break;

			case "CHAT_WIDGET_CLOSE":
				collapseWidget();
				break;
		}
	}

	/**
	 * Handle clicks on the document
	 */
	function handleDocumentClick(event) {
		if (
			elements.iframe &&
			event.target === elements.iframe &&
			elements.iframe.style.width === config.collapsedWidth
		) {
			expandWidget();
		}
	}

	/**
	 * Expand the chat widget
	 */
	function expandWidget() {
		if (state.isOpen) return;

		elements.iframe.style.width = config.expandedWidth;
		elements.iframe.style.height = config.expandedHeight;

		if (config.position === "bottom-right") {
			elements.iframe.style.right = "20px";
			elements.iframe.style.bottom = "20px";
		} else if (config.position === "bottom-left") {
			elements.iframe.style.left = "20px";
			elements.iframe.style.bottom = "20px";
		}

		elements.iframe.style.borderRadius = "20px";
		state.isOpen = true;
	}

	/**
	 * Collapse the chat widget
	 */
	function collapseWidget() {
		if (!state.isOpen) return;

		elements.iframe.style.width = config.collapsedWidth;
		elements.iframe.style.height = config.collapsedHeight;

		if (config.position === "bottom-right") {
			elements.iframe.style.right = "0";
			elements.iframe.style.bottom = "0";
		} else if (config.position === "bottom-left") {
			elements.iframe.style.left = "0";
			elements.iframe.style.bottom = "0";
		}

		elements.iframe.style.borderRadius = "0";
		state.isOpen = false;
	}

	/**
	 * Toggle fullscreen mode
	 */
	function toggleFullscreen(isFullscreen) {
		if (isFullscreen) {
			elements.iframe.style.width = "100%";
			elements.iframe.style.height = "100%";
			elements.iframe.style.top = "0";
			elements.iframe.style.left = "0";
			elements.iframe.style.right = "auto";
			elements.iframe.style.bottom = "auto";
			elements.iframe.style.borderRadius = "0";
		} else {
			expandWidget();
		}

		state.isFullscreen = isFullscreen;
	}

	/**
	 * Set the position of the widget
	 */
	function setPosition(position) {
		if (position !== "bottom-left" && position !== "bottom-right") {
			console.warn('Invalid position. Use "bottom-left" or "bottom-right"');
			return;
		}

		config.position = position;

		if (position === "bottom-left") {
			elements.iframe.style.right = "auto";
			elements.iframe.style.left = state.isOpen ? "20px" : "0";
		} else if (position === "bottom-right") {
			elements.iframe.style.left = "auto";
			elements.iframe.style.right = state.isOpen ? "20px" : "0";
		}
	}

	/**
	 * Set the brand color
	 */
	function setBrandColor(color) {
		if (!color.match(/^#[0-9A-F]{6}$/i)) {
			console.warn("Invalid color format. Use hexadecimal format (#RRGGBB)");
			return;
		}

		config.brandColor = color;

		// Pass color to iframe
		if (elements.iframe && state.isLoaded) {
			elements.iframe.contentWindow.postMessage(
				{
					type: "CHAT_WIDGET_CONFIG",
					config: { brandColor: color },
				},
				"*"
			);
		}
	}

	/**
	 * Initialize the chat widget
	 */
	function init() {
		// Create the widget
		createChatWidget();

		// Expose public API
		window.ChatWidgetConfig = {
			setPosition: setPosition,
			setBrandColor: setBrandColor,
			expand: expandWidget,
			collapse: collapseWidget,
			// Helper function to open external links
			openExternalLink: function (url) {
				if (url) {
					window.open(url, "_blank", "noopener,noreferrer");
				}
			},
		};

		// Listen for EXTERNAL_LINK messages from the iframe
		window.addEventListener("message", function (event) {
			if (event.data && event.data.type === "EXTERNAL_LINK" && event.data.url) {
				window.ChatWidgetConfig.openExternalLink(event.data.url);
			}
		});

		console.log("Chat Widget initialized successfully");
	}

	// Start the initialization when the page is loaded
	if (document.readyState === "complete") {
		init();
	} else {
		window.addEventListener("load", init);
	}
})();
