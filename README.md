# CTT Chat Widget

A sleek, responsive floating chat widget designed for seamless integration across multiple websites. The widget is hosted centrally and embedded into client sites via a simple script tag, requiring no complex setup.

## Features

- **Real-time Messaging**: Instant communication with streaming responses
- **Customizable Branding**: Colors, logo, welcome message, and positioning
- **Smart Behavior**: Auto-triggers on scroll, inactivity detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Easy Integration**: Simple script tag embedding
- **Cross-platform**: Compatible with any website or platform
- **Dynamic Chat Questions**: AI-powered suggested questions from Sanity CMS
- **Full-View Mode**: Expandable interface for enhanced user experience
- **Enhanced Customization**: Extensive theming and content customization options

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure your API settings:

```bash
cp .env.example .env.local
```

Add your API credentials and Sanity configuration to `.env.local`:

```env
# API Configuration
NEBUL_API_URL=https://api.nebul.ai/v1/chat/completions
NEBUL_API_KEY=your_nebul_api_key_here
NEBUL_MODEL=your_model_name_here

# Sanity CMS Configuration (for dynamic questions)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
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

## Integration

Add this script to your website's HTML:

```html
<script
	src="http://localhost:3000/embed.js"
	data-source="http://localhost:3000/widget"
	async
	defer
></script>
```

For production, replace `localhost:3000` with your deployed domain:

```html
<script
	src="https://your-widget-domain.com/embed.js"
	data-source="https://your-widget-domain.com/widget"
	async
	defer
></script>
```

## Customization Options

### Configuration Parameters

| Parameter                 | Type    | Default                         | Description                                                      |
| ------------------------- | ------- | ------------------------------- | ---------------------------------------------------------------- |
| `brandColor`              | string  | `#EF8143`                       | Widget theme color (hex code)                                    |
| `logo`                    | string  | `undefined`                     | URL to your company logo                                         |
| `welcomeMessage`          | string  | `Hi! How can I help you today?` | Initial message from assistant                                   |
| `position`                | string  | `bottom-right`                  | Widget position (`bottom-right`, `bottom-left`, `bottom-center`) |
| `showOnScroll`            | boolean | `true`                          | Pulse widget when user scrolls                                   |
| `showOnInactivity`        | boolean | `true`                          | Pulse widget after inactivity                                    |
| `inactivityDelay`         | number  | `30000`                         | Inactivity delay in milliseconds                                 |
| `width`                   | number  | `400`                           | Widget width in pixels (desktop)                                 |
| `height`                  | number  | `584`                           | Widget height in pixels (desktop)                                |
| `chatBoxtitle`            | string  | `Ask AI`                        | Title displayed in chat header                                   |
| `chatBoxsubTitle`         | string  | `powered by OpenAI`             | Subtitle displayed in chat header                                |
| `chatBoxDescription`      | string  | `Get instant answers...`        | Description text in chat interface                               |
| `chatBoxInputPlaceholder` | string  | `Type Your Question Here...`    | Placeholder text for input field                                 |



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

### `/api/chat-questions`

Fetches dynamic chat questions from Sanity CMS.

**Response:**

```json
[
	{
		"_id": "question-id-1",
		"name": "How do I get started?",
		"category": "general"
	},
	{
		"_id": "question-id-2",
		"name": "What are your pricing plans?",
		"category": "pricing"
	}
]
```

## File Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Chat API endpoint with streaming
│   │   └── chat-questions/route.ts     # Dynamic questions from Sanity
│   ├── components/ChatWidget.tsx       # Main widget component
│   ├── widget/                        # Widget page
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── page.tsx                       # Demo/documentation page
│   └── layout.tsx
├── lib/
│   └── sanity.ts                      # Sanity CMS client and types
├── public/
│   ├── embed.js                       # Client-side embed script
│   ├── demo.html                      # Standalone demo
│   ├── fullview.svg                   # Full-view mode icon
│   └── assets/                        # Additional UI assets
└── .env.example                       # Environment template
```

## Widget Features

### Smart Triggers

- **Scroll Detection**: Widget pulses when user scrolls past 100px
- **Inactivity Detection**: Widget pulses after specified delay without user interaction
- **Responsive Design**: Adapts to different screen sizes automatically
- **Cross-browser**: Compatible with modern browsers

### Visual States & Modes

- **Closed**: Floating button in corner
- **Open**: Full chat interface with suggested questions
- **Full-View Mode**: Expandable to full-screen for better experience
- **Minimized**: Compact icon when minimized by user
- **Pulsing**: Attention-grabbing animation for engagement

### Dynamic Features

- **Suggested Questions**: Dynamically loaded from Sanity CMS
- **Real-time Streaming**: Live response streaming for natural conversation
- **Mobile Optimization**: Adaptive layout for mobile devices
- **Customizable Themes**: Extensive branding and styling options

## Sanity CMS Integration

### Setup

1. Create a Sanity project at [sanity.io](https://sanity.io)
2. Define a `chatWidgetQuestionsType` schema with fields:
   - `name` (string): The question text
   - `category` (string): Question category
3. Add your Sanity credentials to `.env.local`

### Schema Example

```javascript
export default {
	name: "chatWidgetQuestionsType",
	title: "Chat Widget Questions",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Question",
			type: "string",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "category",
			title: "Category",
			type: "string",
			options: {
				list: [
					{ title: "General", value: "general" },
					{ title: "Pricing", value: "pricing" },
					{ title: "Support", value: "support" },
				],
			},
		},
	],
};
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEBUL_API_URL`
   - `NEBUL_API_KEY`
   - `NEBUL_MODEL`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
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

**Required:**

- `NEBUL_API_URL`
- `NEBUL_API_KEY`
- `NEBUL_MODEL`

**Optional (for dynamic questions):**

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_SANITY_API_VERSION`

## Testing

Test the widget on different sites:

1. Visit `/demo.html` for a standalone demo
2. Use browser dev tools to test responsive behavior
3. Test script integration on external sites
4. Verify full-view mode functionality
5. Test dynamic question loading

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Considerations

- API keys are server-side only
- CORS configured for widget embedding
- Content Security Policy friendly
- No client-side API key exposure
- Sanity tokens secured server-side

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
