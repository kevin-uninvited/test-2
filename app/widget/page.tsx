import ChatWidget from '../components/ChatWidget'

interface WidgetPageProps {
    searchParams: {
        brandColor?: string
        logo?: string
        welcomeMessage?: string
        position?: 'bottom-right' | 'bottom-left'
        showOnScroll?: string
        showOnInactivity?: string
        inactivityDelay?: string
    }
}

export default function WidgetPage({ searchParams }: WidgetPageProps) {
    const {
        brandColor = '#3B82F6',
        logo,
        welcomeMessage = 'Hi! How can I help you today?',
        position = 'bottom-right',
        showOnScroll = 'true',
        showOnInactivity = 'true',
        inactivityDelay = '30000'
    } = searchParams

    return (
        <div className="min-h-screen w-full">
            <ChatWidget
                brandColor={brandColor}
                logo={logo}
                welcomeMessage={welcomeMessage}
                position={position as 'bottom-right' | 'bottom-left'}
                showOnScroll={showOnScroll === 'true'}
                showOnInactivity={showOnInactivity === 'true'}
                inactivityDelay={parseInt(inactivityDelay)}
            />
        </div>
    )
} 