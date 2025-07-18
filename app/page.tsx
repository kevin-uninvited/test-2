"use client"

import { useState, useEffect } from "react"
import Script from "next/script"

// Extend the Window interface to include ChatWidgetConfig
declare global {
  interface Window {
    ChatWidgetConfig?: {
      setPosition: (position: string) => void
      setBrandColor: (color: string) => void
    }
  }
}

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // The new embed code using a script tag.
  const embedCode = `<script src="http://localhost:3001/embed.js"></script>

<script>
  // Wait for widget to load
  setTimeout(() => {
    // Set widget position
    window.ChatWidgetConfig.setPosition('bottom-left');
    
    // Set brand color
    window.ChatWidgetConfig.setBrandColor('#FF5500');
  }, 1000);
</script>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Handlers for the live demo control buttons.
  // Optional chaining (?.) is used in case the script hasn't loaded yet.
  const handleSetPosition = (position: string) => {
    window.ChatWidgetConfig?.setPosition(position)
  }


  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <svg className="w-10 h-10 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h1 className="text-4xl font-light text-white">Chat Widget</h1>
            </div>
            <p className="text-lg text-gray-400 font-light flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Embeddable chat widget via a simple script
            </p>
          </div>

          {/* How to Integrate Section */}
          <div className={`mb-12 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ animationDelay: "100ms" }}>
            <h2 className="text-2xl font-medium text-white mb-4">How to Integrate</h2>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 text-gray-300">
              <ol className="list-decimal list-inside space-y-3 font-light">
                <li>Simply add the &lsquo;script&rsquo; tag to your HTML file.</li>
                <li>The widget will automatically be added to your page.</li>
                <li>There&apos;s no need to manually add an &lsquo;iframe&rsquo;.</li>
              </ol>
            </div>
          </div>

          {/* Embed Code */}
          <div className="mb-12">
            <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${copied ? "border-[#EF8143]/50 shadow-[#EF8143]/10 shadow-lg" : ""}`} style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-[#EF8143]/10 rounded-lg">
                  <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-white">Integration Code Snippet</h2>
              </div>
              <div className="bg-black/50 border border-gray-600/30 rounded-lg p-4 mb-4 overflow-x-auto hover:border-[#EF8143]/30 transition-colors duration-300">
                <code className="text-xs text-gray-300 whitespace-pre font-mono leading-relaxed">{embedCode}</code>
              </div>
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 transform active:scale-95 ${copied
                  ? "bg-green-500/90 text-white shadow-lg"
                  : "bg-[#EF8143] text-black hover:bg-[#E5723A] shadow-md hover:shadow-lg"
                  }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Demo Controls Section */}
          <div className={`mb-16 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ animationDelay: "300ms" }}>
            <div className="text-center">
              <h2 className="text-2xl font-medium text-white mb-6">Live Demo Controls</h2>
              <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
                <button onClick={() => handleSetPosition('bottom-left')} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 transition-all duration-300 hover:scale-105 transform active:scale-95">Move to Bottom Left</button>
                <button onClick={() => handleSetPosition('bottom-right')} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 transition-all duration-300 hover:scale-105 transform active:scale-95">Move to Bottom Right</button>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
          }

          @keyframes fade-in-up {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>

      {/* Include the widget script for the live demo on this page. */}
      {/* It will load after the page is interactive. */}
      <Script src="http://localhost:3001/embed.js" data-source="http://localhost:3001/widget" strategy="lazyOnload" />
    </>
  )
}