"use client"

import { useState, useEffect } from "react"

export default function DemoPage() {
  const [currentOrigin, setCurrentOrigin] = useState("https://your-domain.com")
  const [mounted, setMounted] = useState(false)
  const [copiedBasic, setCopiedBasic] = useState(false)
  const [copiedCustom, setCopiedCustom] = useState(false)

  useEffect(() => {
    setCurrentOrigin(window.location.origin)
    setMounted(true)
  }, [])

  const handleCopyBasic = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopiedBasic(true)
    setTimeout(() => setCopiedBasic(false), 2000)
  }

  const handleCopyCustom = async () => {
    await navigator.clipboard.writeText(customEmbedCode)
    setCopiedCustom(true)
    setTimeout(() => setCopiedCustom(false), 2000)
  }

  const embedCode = `<iframe 
  src="${currentOrigin}/widget" 
  width="100%" 
  height="100%" 
  frameborder="0" 
  style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; pointer-events: none; background: transparent;"
  allow="microphone; camera"
></iframe>`

  const customEmbedCode = `<iframe 
  src="${currentOrigin}/widget?brandColor=%23FF6B6B&chatBoxtitle=Custom%20Chat&position=bottom-left" 
  width="100%" 
  height="100%" 
  frameborder="0" 
  style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; pointer-events: none; background: transparent;"
  allow="microphone; camera"
></iframe>`

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg className="w-10 h-10 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h1 className="text-4xl font-light text-white">
              Chat Widget
            </h1>
          </div>
          <p className="text-lg text-gray-400 font-light flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Embeddable chat widget for any website
          </p>
        </div>

        {/* Embed Codes */}
        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${copiedBasic ? 'border-[#EF8143]/50 shadow-[#EF8143]/10 shadow-lg' : ''}`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-[#EF8143]/10 rounded-lg">
                <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-white">Basic</h2>
            </div>
            <div className="bg-black/50 border border-gray-600/30 rounded-lg p-3 mb-4 overflow-x-auto hover:border-[#EF8143]/30 transition-colors duration-300">
              <code className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">{embedCode}</code>
            </div>
            <button
              onClick={handleCopyBasic}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 transform active:scale-95 ${copiedBasic
                ? 'bg-green-500/90 text-white shadow-lg'
                : 'bg-[#EF8143] text-black hover:bg-[#E5723A] shadow-md hover:shadow-lg'
                }`}
            >
              {copiedBasic ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
          </div>

          <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${copiedCustom ? 'border-[#EF8143]/50 shadow-[#EF8143]/10 shadow-lg' : ''}`} style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-[#EF8143]/10 rounded-lg">
                <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-white">Custom</h2>
            </div>
            <div className="bg-black/50 border border-gray-600/30 rounded-lg p-3 mb-4 overflow-x-auto hover:border-[#EF8143]/30 transition-colors duration-300">
              <code className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">{customEmbedCode}</code>
            </div>
            <button
              onClick={handleCopyCustom}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 transform active:scale-95 ${copiedCustom
                ? 'bg-green-500/90 text-white shadow-lg'
                : 'bg-white text-black hover:bg-gray-100 shadow-md hover:shadow-lg'
                }`}
            >
              {copiedCustom ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Custom Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Configuration */}
        <div className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-8 mb-16 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#EF8143]/10 rounded-lg">
              <svg className="w-5 h-5 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-white">Configuration</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-[#EF8143]/10 rounded-lg">
                  <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#EF8143]">Appearance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center hover:bg-gray-800/30 p-3 rounded-lg transition-colors duration-200">
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    brandColor
                  </span>
                  <span className="text-gray-300 font-mono text-xs">Widget color</span>
                </div>
                <div className="flex justify-between items-center hover:bg-gray-800/30 p-3 rounded-lg transition-colors duration-200">
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    position
                  </span>
                  <span className="text-gray-300 font-mono text-xs">bottom-right</span>
                </div>
                <div className="flex justify-between items-center hover:bg-gray-800/30 p-3 rounded-lg transition-colors duration-200">
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    width
                  </span>
                  <span className="text-gray-300 font-mono text-xs">Widget width</span>
                </div>
                <div className="flex justify-between items-center hover:bg-gray-800/30 p-3 rounded-lg transition-colors duration-200">
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    height
                  </span>
                  <span className="text-gray-300 font-mono text-xs">Widget height</span>
                </div>
              </div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-[#EF8143]/10 rounded-lg">
                  <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#EF8143]">Content</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center hover:bg-gray-800/30 p-3 rounded-lg transition-colors duration-200">
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    chatBoxtitle
                  </span>
                  <span className="text-gray-300 font-mono text-xs">Chat title</span>
                </div>
                <div className="flex justify-between items-center hover:bg-gray-800/30 p-3 rounded-lg transition-colors duration-200">
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    welcomeMessage
                  </span>
                  <span className="text-gray-300 font-mono text-xs">Welcome text</span>
                </div>
                <div className="flex justify-between items-center hover:bg-gray-800/30 p-3 rounded-lg transition-colors duration-200">
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    showOnScroll
                  </span>
                  <span className="text-gray-300 font-mono text-xs">true/false</span>
                </div>
                <div className="flex justify-between items-center hover:bg-gray-800/30 p-3 rounded-lg transition-colors duration-200">
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    logo
                  </span>
                  <span className="text-gray-300 font-mono text-xs">Logo URL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo */}
        <div className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-8 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#EF8143]/10 rounded-lg">
              <svg className="w-5 h-5 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-white">Live Demo</h2>
          </div>
          <p className="text-gray-400 mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Chat widget is active on this page. Check the bottom-right corner.
          </p>
          <div className="bg-[#EF8143]/10 border border-[#EF8143]/20 rounded-lg p-4 hover:bg-[#EF8143]/20 transition-colors duration-300">
            <p className="text-[#EF8143] text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>
                <span className="font-medium">Note:</span> Demo uses simulated responses. Integrate with your AI service in <code className="bg-black px-2 py-1 rounded text-xs hover:bg-gray-800 transition-colors duration-200">/api/chat</code>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* The actual chat widget for demo */}
      <iframe
        src={`${currentOrigin}/widget`}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          background: 'transparent',
          border: 'none',
        }}
        allow="microphone; camera"
      />

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
  )
}