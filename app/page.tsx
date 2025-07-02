"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function DemoPage() {
  const [currentOrigin, setCurrentOrigin] = useState("https://your-domain.com")
  const [mounted, setMounted] = useState(false)
  const [copiedBasic, setCopiedBasic] = useState(false)

  useEffect(() => {
    setCurrentOrigin(window.location.origin)
    setMounted(true)
  }, [])

  const handleCopyBasic = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedBasic(true);
      setTimeout(() => setCopiedBasic(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = embedCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedBasic(true);
      setTimeout(() => setCopiedBasic(false), 2000);
    }
  }

  const embedCode = `<iframe 
  src="${currentOrigin}/widget" 
  width="100%" 
  height="100%" 
  style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;  background: transparent;"
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

       

        {/* Embed Code */}
        <div className="mb-16">
          <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${copiedBasic ? 'border-[#EF8143]/50 shadow-[#EF8143]/10 shadow-lg' : ''}`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-[#EF8143]/10 rounded-lg">
                <svg className="w-4 h-4 text-[#EF8143]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-white">Integration Code Snippet</h2>
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
              style={{ position: 'relative', zIndex: 10000, cursor: 'pointer' }}
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
        </div>
        {/* Demo Section */}
        <div className={`mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '100ms' }}>
          <div className="text-center">
            <h2 className="text-2xl font-medium text-white mb-6">Try the Widget Demo</h2>
            <p className="text-gray-400 mb-8">Experience the chat widget in action before embedding it on your site</p>
            <Link href="/widget" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium bg-[#EF8143] text-black hover:bg-[#E5723A] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Launch Demo Widget
            </Link>
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
  )
}