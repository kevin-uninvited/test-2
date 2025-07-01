'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, SendIcon } from 'lucide-react'
import { IoChatbubblesOutline } from "react-icons/io5";
import { GrSend } from "react-icons/gr";
import Image from 'next/image'

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
}

interface ChatWidgetProps {
    brandColor?: string
    logo?: string
    welcomeMessage?: string
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
    showOnScroll?: boolean
    showOnInactivity?: boolean
    inactivityDelay?: number
    width?: number
    height?: number
    chatBoxtitle?: string
    chatBoxsubTitle?: string
    chatBoxDescription?: string
    chatBoxInputPlaceholder?: string
}

export default function ChatWidget({
    brandColor = '#EF8143',
    logo,
    welcomeMessage = "Hi! How can I help you today?",
    position = 'bottom-right',
    showOnScroll = true,
    showOnInactivity = true,
    inactivityDelay = 30000,
    width = 400,
    height = 584,
    chatBoxtitle = "Ask AI",
    chatBoxsubTitle = "powered by OpenAI",
    chatBoxDescription = "Get instant answers to your questions",
    chatBoxInputPlaceholder = "Type Your Question Here..."
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [hasScrolled, setHasScrolled] = useState(false)
    const [showPulse, setShowPulse] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    // Position classes for button
    const positionClasses = {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    }

    // Chat positioning - fixed to align properly with button
    const getChatClasses = () => {
        if (isMobile) {
            return "inset-4" // Small margin on mobile
        }

        // Position chat widget above and aligned with the button
        const desktopPositions = {
            'bottom-right': 'bottom-20 right-4', // Above the button, aligned to right
            'bottom-left': 'bottom-20 left-4',   // Above the button, aligned to left
            'bottom-center': 'bottom-20 left-1/2 transform -translate-x-1/2' // Above the button, centered
        }

        return desktopPositions[position]
    }

    // Auto-scroll to bottom of chat container when new messages are added
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
        }
    }, [isOpen])

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Handle scroll behavior
    useEffect(() => {
        if (!showOnScroll) return

        const handleScroll = () => {
            const scrolled = window.scrollY > 100
            if (scrolled && !hasScrolled) {
                setHasScrolled(true)
                setShowPulse(true)
                setTimeout(() => setShowPulse(false), 3000)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [hasScrolled, showOnScroll])

    // Handle inactivity detection
    useEffect(() => {
        if (!showOnInactivity) return

        const resetTimer = () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current)
            }

            inactivityTimerRef.current = setTimeout(() => {
                if (!isOpen) {
                    setShowPulse(true)
                    setTimeout(() => setShowPulse(false), 3000)
                }
            }, inactivityDelay)
        }

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']

        events.forEach(event => {
            document.addEventListener(event, resetTimer, true)
        })

        resetTimer()

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetTimer, true)
            })
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current)
            }
        }
    }, [showOnInactivity, inactivityDelay, isOpen])

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue.trim(),
            role: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        // Create AI message placeholder
        const aiMessageId = (Date.now() + 1).toString()
        const aiMessage: Message = {
            id: aiMessageId,
            content: "",
            role: 'assistant',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, aiMessage])

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                })
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            if (reader) {
                let assistantContent = ''

                while (true) {
                    const { done, value } = await reader.read()

                    if (done) break

                    const chunk = decoder.decode(value)
                    const lines = chunk.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6))
                                if (data.content) {
                                    assistantContent += data.content
                                    setMessages(prev => prev.map(msg =>
                                        msg.id === aiMessageId
                                            ? { ...msg, content: assistantContent }
                                            : msg
                                    ))
                                }
                            } catch (error) {
                                console.error('Error parsing SSE data:', error)
                            }
                        }
                    }
                }

                // If no content was received, show error message
                if (!assistantContent) {
                    setMessages(prev => prev.map(msg =>
                        msg.id === aiMessageId
                            ? { ...msg, content: 'Sorry, I could not generate a response.' }
                            : msg
                    ))
                }
            }
        } catch (error) {
            console.error('Error sending message:', error)
            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId
                    ? { ...msg, content: 'Sorry, there was an error processing your request. Please try again.' }
                    : msg
            ))
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <>
            {/* Message Icon Button - Only show when closed */}
            {!isOpen && (
                <div className={`fixed ${positionClasses[position]} z-50`}>
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`relative text-black p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-300 ${showPulse ? 'animate-pulse ring-4 ring-orange-300' : ''}`}
                        style={{ backgroundColor: brandColor }}
                        aria-label="Open chat"
                    >
                        <IoChatbubblesOutline size={24} />
                        {hasScrolled && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
                        )}
                    </button>
                </div>
            )}

            {/* Floating Close Button - Only show when open */}
            {isOpen && (
                <div className={`fixed ${positionClasses[position]} z-[60]`}>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-300"
                        style={{ backgroundColor: brandColor }}
                        aria-label="Close chat"
                    >
                        <X size={24} />
                    </button>
                </div>
            )}

            {/* Chat Widget - Only show when open */}
            {isOpen && (
                <div
                    className={`fixed ${getChatClasses()} z-50`}
                    style={isMobile ? {
                        width: 'calc(100vw - 2rem)',
                        height: 'calc(92vh - 2rem)'
                    } : {
                        width: `${width}px`,
                        height: `${height}px`
                    }}
                >
                    <div className="bg-[#151921] rounded-[20px] border border-[#EF8143] shadow-2xl flex flex-col h-full">
                        {/* Top Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#EF8143] flex-shrink-0">
                            <div className="flex items-center">
                                <Image
                                    src="/fullview.svg"
                                    alt="Full view"
                                    width={24}
                                    height={24}
                                    className="text-white"
                                />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div className="w-6"></div> {/* Spacer to balance the layout */}
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 flex flex-col min-h-0 relative">
                            {/* Header - only show when no messages, centered in middle */}
                            {messages.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                    <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                                        <h1 className="font-sans text-center">
                                            <span className="block text-[#EF8143] font-bold text-2xl md:text-4xl mb-2">
                                                {chatBoxtitle}
                                            </span>
                                            <span className="font-bold text-black text-base md:text-xl">
                                                ({chatBoxsubTitle})
                                            </span>
                                        </h1>
                                        <h2 className="text-base md:text-xl font-bold text-center tracking-[0.28px] leading-[24px] text-black px-4">
                                            {chatBoxDescription}
                                        </h2>
                                    </div>
                                </div>
                            )}

                            {/* Messages Container */}
                            <div className="flex-1 overflow-hidden transition-all duration-300 ease-in-out">
                                <div
                                    ref={chatContainerRef}
                                    className="h-full overflow-y-auto scroll-smooth p-4 chat-scrollbar"
                                >
                                    {messages.length === 0 ? (
                                        <div className="h-full"></div>
                                    ) : (
                                        <div className="space-y-3">
                                            {messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className="flex flex-col max-w-[85%]">
                                                        <div
                                                            className={`px-3 py-2 rounded-[12px] ${message.role === 'user'
                                                                ? 'border border-[#EF8143] text-white bg-transparent'
                                                                : 'bg-[#EF81433B] text-white border border-[#EF8143]'
                                                                }`}
                                                        >
                                                            {message.content || (message.role === 'assistant' && isLoading) ? (
                                                                message.content ? (
                                                                    <p className="text-sm font-medium whitespace-pre-wrap break-words">
                                                                        {message.content}
                                                                    </p>
                                                                ) : (
                                                                    <span className="flex items-center space-x-2">
                                                                        <span className="flex space-x-1">
                                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce inline-block"></span>
                                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce inline-block" style={{ animationDelay: '0.1s' }}></span>
                                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce inline-block" style={{ animationDelay: '0.2s' }}></span>
                                                                        </span>
                                                                    </span>
                                                                )
                                                            ) : null}
                                                        </div>
                                                        <p className="text-xs mt-1 text-gray-500 ml-[4px]">
                                                            {formatTime(message.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} className="h-1" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Input Form */}
                            <div className="px-4 py-3 border-t border-[#EF8143] flex-shrink-0">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex items-center gap-3 bg-transparent overflow-hidden">
                                        <input
                                            ref={inputRef}
                                            className="bg-transparent border-none h-[40px] pl-4 text-sm font-bold placeholder:text-white flex-1 text-white focus:outline-none"
                                            placeholder={chatBoxInputPlaceholder}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={isLoading}
                                            autoFocus={isOpen}
                                        />
                                        <button
                                            type="submit"
                                            className="w-11 h-11 rounded-full bg-[#ef8143] hover:bg-[#ef8143]/90 flex items-center justify-center"
                                            disabled={isLoading || !inputValue.trim()}
                                        >
                                            <GrSend className="text-xl text-black" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 