# Universal Chat Widget

A sleek, responsive floating chat widget designed for seamless integration across multiple websites. The widget is hosted centrally and embedded into client sites via iframe, requiring no complex setup.

## Features

- **Real-time Messaging**: Instant communication with streaming responses
- **Customizable Branding**: Colors, logo, welcome message, and positioning
- **Smart Behavior**: Auto-triggers on scroll, inactivity detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Easy Integration**: Simple iframe or script tag embedding
- **Cross-platform**: Compatible with any website or platform

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure your API settings:

```bash
cp .env.example .env.local
```

Add your NEBUL API credentials to `.env.local`:

```env
NEBUL_API_URL=https://api.nebul.ai/v1/chat/completions
NEBUL_API_KEY=your_nebul_api_key_here
NEBUL_MODEL=your_model_name_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the widget demo.

## Integration Methods

### Method 1: Script Tag (Recommended)

Add this to your website's HTML:

```html
<script>
	window.ChatWidgetConfig = {
		baseUrl: "https://your-widget-domain.com",
		brandColor: "#3B82F6",
		welcomeMessage: "Hi! How can I help you today?",
	};
</script>
<script src="https://your-widget-domain.com/embed.js"></script>
```

### Method 2: Direct Iframe

Embed the widget directly:

```html
<iframe
	src="https://your-widget-domain.com/widget?brandColor=%233B82F6"
	style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 9999; pointer-events: none; background: transparent;"
></iframe>
```

## Customization Options

### Configuration Parameters

| Parameter          | Type    | Default                         | Description                                       |
| ------------------ | ------- | ------------------------------- | ------------------------------------------------- |
| `brandColor`       | string  | `#3B82F6`                       | Widget theme color (hex code)                     |
| `logo`             | string  | `undefined`                     | URL to your company logo                          |
| `welcomeMessage`   | string  | `Hi! How can I help you today?` | Initial message from assistant                    |
| `position`         | string  | `bottom-right`                  | Widget position (`bottom-right` or `bottom-left`) |
| `showOnScroll`     | boolean | `true`                          | Pulse widget when user scrolls                    |
| `showOnInactivity` | boolean | `true`                          | Pulse widget after inactivity                     |
| `inactivityDelay`  | number  | `30000`                         | Inactivity delay in milliseconds                  |

### Example Configurations

**E-commerce Store:**

```javascript
window.ChatWidgetConfig = {
	baseUrl: "https://your-widget-domain.com",
	brandColor: "#FF6B6B",
	logo: "https://your-store.com/logo.png",
	welcomeMessage: "Welcome to our store! Need help finding something?",
	showOnScroll: true,
	inactivityDelay: 20000,
};
```

**SaaS Platform:**

```javascript
window.ChatWidgetConfig = {
	baseUrl: "https://your-widget-domain.com",
	brandColor: "#10B981",
	welcomeMessage: "Hi! Need help with our platform?",
	position: "bottom-left",
	showOnInactivity: true,
	inactivityDelay: 45000,
};
```

## API Endpoints

### `/api/chat`

Handles chat message processing with streaming support.

**Request:**

```json
{
	"messages": [
		{
			"role": "user",
			"content": "Hello, how can you help me?"
		}
	]
}
```

**Response:**
Streaming Server-Sent Events with content chunks.

## File Structure

```
├── app/
│   ├── api/chat/route.ts          # Chat API endpoint
│   ├── components/ChatWidget.tsx   # Main widget component
│   ├── widget/                    # Widget iframe page
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── page.tsx                   # Demo/documentation page
│   └── layout.tsx
├── public/
│   ├── embed.js                   # Client-side embed script
│   └── demo.html                  # Standalone demo
└── .env.example                   # Environment template
```

## Widget Behavior

### Smart Triggers

- **Scroll Detection**: Widget pulses when user scrolls past 100px
- **Inactivity Detection**: Widget pulses after specified delay without user interaction
- **Responsive Design**: Adapts to different screen sizes
- **Cross-browser**: Compatible with modern browsers

### Visual States

- **Closed**: Floating button in corner
- **Open**: Full chat interface
- **Minimized**: Small icon when minimized by user
- **Pulsing**: Attention-grabbing animation

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Ensure these are set in your production environment:

- `NEBUL_API_URL`
- `NEBUL_API_KEY`
- `NEBUL_MODEL`

## Testing

Test the widget on different sites:

1. Visit `/demo.html` for a standalone demo
2. Use browser dev tools to test responsive behavior
3. Test iframe integration on external sites

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Considerations

- API keys are server-side only
- CORS configured for iframe embedding
- Content Security Policy friendly
- No client-side API key exposure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For technical support or questions:

- Open an issue on GitHub
- Check the documentation
- Review the demo examples
