import '../globals.css'

export const metadata = {
    title: 'Chat Widget',
    description: 'Universal chat widget for website integration',
}

export default function WidgetLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="h-full">
            <body className="h-full bg-transparent overflow-hidden">
                {children}
            </body>
        </html>
    )
} 