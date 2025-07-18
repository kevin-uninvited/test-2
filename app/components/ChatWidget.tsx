'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react'
import { X, Minimize2 } from 'lucide-react'
import { GrSend } from "react-icons/gr";
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
}

interface ChatQuestion {
    _id: string
    _type: string
    name: string
    category: string
    _createdAt: string
    _updatedAt: string
}

interface AskAIPageType {
    _id: string
    _type: string
    chatBoxtitle: string
    chatBoxsubTitle: string
    chatBoxDescription: string
    chatBoxInputPlaceholder: string
    title: string
}

interface ChatWidgetProps {
    brandColor?: string
    logo?: string
    welcomeMessage?: string
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
    width?: number
    height?: number
}

export default function ChatWidget({
    brandColor: initialBrandColor = '#EF8143',
    position: initialPosition = 'bottom-right',
    width = 400,
    height = 584,
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isFullView, setIsFullView] = useState(false)
    const [wasFullView, setWasFullView] = useState(false) // Track previous fullscreen state
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [chatQuestions, setChatQuestions] = useState<ChatQuestion[]>([])
    const [questionsLoading, setQuestionsLoading] = useState(true)
    const [askAIData, setAskAIData] = useState<AskAIPageType | null>(null)
    const [askAIDataLoading, setAskAIDataLoading] = useState(true)
    const [brandColor, setBrandColor] = useState(initialBrandColor)
    const [position, setPosition] = useState(initialPosition)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const positionClasses = {
        'bottom-right': 'bottom-0 right-4',
        'bottom-left': 'bottom-0 left-4',
        'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
    }

    const getChatClasses = () => {
        if (isFullView) return "inset-0"
        if (isMobile) return "inset-4"
        const desktopPositions = {
            'bottom-right': 'bottom-26 right-4',
            'bottom-left': 'bottom-26 left-4',
            'bottom-center': 'bottom-26 left-1/2 transform -translate-x-1/2'
        }
        return desktopPositions[position]
    }

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const focusInput = () => {
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    // Smooth opening animation
    const openChat = () => {
        setShouldRender(true);
        setTimeout(() => {
            setIsAnimating(true);
            setIsOpen(true);
            // Restore fullscreen state if it was in fullscreen before closing
            if (wasFullView) {
                setIsFullView(true);
            }
        }, 10); // Small delay to ensure DOM is ready
    };

    // Smooth closing animation
    const closeChat = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsOpen(false);
            setShouldRender(false);
        }, 300); // Match the transition duration
    };

    useEffect(() => {
        if (isOpen && isAnimating) {
            // Wait for animation to complete before focusing
            setTimeout(focusInput, 350);
        }
    }, [isOpen, isAnimating]);

    useEffect(() => {
        const checkMobile = () => {
            if (typeof window !== 'undefined') {
                setIsMobile(window.innerWidth < 768);
            }
        };
        checkMobile();
        if (typeof window !== 'undefined') {
            window.addEventListener("resize", checkMobile);
            return () => window.removeEventListener("resize", checkMobile);
        }
    }, []);

    const sendMessage = async () => {
        const messageText = inputValue.trim();
        if (!messageText || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: messageText,
            role: 'user',
            timestamp: new Date()
        };

        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = {
            id: aiMessageId,
            content: "",
            role: 'assistant',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage, aiMessage]);

        setInputValue('');
        setIsLoading(true);
        setTimeout(focusInput, 50);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                })
            });

            if (!response.ok || !response.body) {
                throw new Error('Failed to send message');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) {
                                assistantContent += data.content;
                                setMessages(prev => prev.map(msg =>
                                    msg.id === aiMessageId
                                        ? { ...msg, content: assistantContent }
                                        : msg
                                ));
                            }
                        } catch (error) {
                            console.error('Error parsing SSE data:', error);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, content: 'Sorry, an error occurred.' } : msg
            ));
        } finally {
            setIsLoading(false);
            setTimeout(focusInput, 50);
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        sendMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const fetchChatQuestions = async () => {
        try {
            const response = await fetch('/api/chat-questions')
            if (response.ok) {
                const data = await response.json()
                setChatQuestions(data)
            } else {
                console.error('Failed to fetch chat questions')
            }
        } catch (error) {
            console.error('Error fetching chat questions:', error)
        } finally {
            setQuestionsLoading(false)
        }
    }

    const fetchAskAIData = async () => {
        setAskAIDataLoading(true)
        try {
            const response = await fetch('/api/ask-ai-data')
            if (response.ok) {
                const data = await response.json()
                setAskAIData(data)
            } else {
                console.error('Failed to fetch Ask AI data')
            }
        } catch (error) {
            console.error('Error fetching Ask AI data:', error)
        } finally {
            setAskAIDataLoading(false)
        }
    }

    useEffect(() => {
        fetchChatQuestions()
        fetchAskAIData()
    }, [])

    const handleQuestionClick = (question: string) => {
        setInputValue(question);
        setTimeout(() => {
            sendMessage();
        }, 100);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Helper function to handle external links
    const handleExternalLink = (href: string, e: React.MouseEvent) => {
        // If we're in an iframe, use the parent window to open the link
        if (typeof window !== 'undefined' && window.parent !== window) {
            e.preventDefault();
            try {
                // Send message to parent to open the link
                window.parent.postMessage({
                    type: 'EXTERNAL_LINK',
                    value: { url: href }
                }, '*');
            } catch (error) {
                console.error('Error posting message to parent:', error);
                // Fallback: try to open directly
                if (typeof window !== 'undefined') {
                    window.open(href, '_blank', 'noopener,noreferrer');
                }
            }
        }
        // If not in an iframe, the default target="_blank" behavior will work
    };

    // Listen for configuration updates from the parent window
    useEffect(() => {
        const handleConfigMessage = (event: MessageEvent) => {
            // Add appropriate origin checks for security
            if (event.data && event.data.type === 'CHAT_WIDGET_CONFIG') {
                const config = event.data.config;

                // Apply configuration changes
                if (config.brandColor) {
                    // Update brand color
                    setBrandColor(config.brandColor);
                }

                // Handle other configuration options as needed
                if (config.position) {
                    // Update position
                    setPosition(config.position);
                }
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('message', handleConfigMessage);

            return () => {
                window.removeEventListener('message', handleConfigMessage);
            };
        }
    }, []);

    // Notify parent window when chat is closed
    const handleClose = () => {
        // Store the fullscreen state before closing
        setWasFullView(isFullView);
        closeChat();

        // Send message to parent window
        if (typeof window !== 'undefined') {
            try {
                window.parent.postMessage({
                    type: 'CHAT_WIDGET_CLOSE',
                    value: true,
                    wasFullscreen: isFullView // Send fullscreen state to parent
                }, '*');
            } catch (error) {
                console.error('Error posting message to parent:', error);
            }
        }
    };

    const toggleFullView = () => {
        setIsFullView(!isFullView)

        // Send message to parent window to toggle fullscreen if in iframe
        if (typeof window !== 'undefined') {
            try {
                window.parent.postMessage({
                    type: 'CHAT_WIDGET_FULLSCREEN',
                    value: !isFullView
                }, '*');
            } catch (error) {
                console.error('Error posting message to parent:', error);
            }
        }
    }

    // Notify parent window when chat is opened
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined') {
            try {
                window.parent.postMessage({
                    type: 'CHAT_WIDGET_OPEN',
                    value: true,
                    fullscreen: isFullView || wasFullView // Tell parent if we should be in fullscreen mode
                }, '*');

                // If we need to restore fullscreen mode
                if (wasFullView) {
                    setIsFullView(true);
                    setWasFullView(false); // Reset the wasFullView flag
                }
            } catch (error) {
                console.error('Error posting message to parent:', error);
            }
        }
    }, [isOpen, isFullView, wasFullView]);

    return (
        <>
            {!isOpen && (
                <div className={`fixed ${positionClasses[position]} z-50 transition-all duration-300 ${shouldRender ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                    }`}>
                    <button
                        onClick={openChat}
                        className={`relative text-black p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-300`}
                        style={{ backgroundColor: brandColor }}
                        aria-label="Open chat"
                    >
                        <Image src="/sms1.svg" alt="Logo" width={24} height={24} className="object-contain" />
                    </button>
                    <div className="text-center mt-2 font-medium text-sm text-white">
                        {askAIDataLoading ? (
                            <div className="h-4 bg-gray-600 rounded w-16 mx-auto animate-pulse"></div>
                        ) : (
                            askAIData?.chatBoxtitle
                        )}
                    </div>

                </div>
            )}
            {isOpen && !isFullView && (
                <div className={`fixed ${positionClasses[position]} z-[60] transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <button
                        onClick={handleClose}
                        className="text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-300"
                        style={{ backgroundColor: brandColor }}
                        aria-label="Close chat"
                    >
                        <X size={24} />
                    </button>
                    <div className="text-center mt-2 font-medium text-sm text-white">
                        {askAIDataLoading ? (
                            <div className="h-4 bg-gray-600 rounded w-16 mx-auto animate-pulse"></div>
                        ) : (
                            askAIData?.chatBoxtitle
                        )}
                    </div>
                </div>
            )}

            {shouldRender && (
                <div
                    className={`fixed ${getChatClasses()} ${isFullView ? 'z-[100]' : 'z-50'} transition-all duration-300 ease-out ${isAnimating
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-2'
                        }`}
                    style={isFullView ? { width: '100vw', height: '100vh' } : isMobile ? { width: 'calc(100vw - 2rem)', height: 'calc(91vh - 2rem)' } : { width: `${width}px`, height: `${height}px` }}
                >
                    <div className={`bg-[#151921de] rounded-[20px] border border-[#EF8143] shadow-2xl flex flex-col h-full chat-widget-container ${position} transition-all duration-300 ease-out ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
                        }`}>
                        <div className="flex items-center justify-between px-4 py-2 border-b border-[#EF8143] flex-shrink-0">
                            <div className="flex items-center">
                                <button
                                    onClick={toggleFullView}
                                    className="hover:bg-[#EF8143]/20 rounded-lg p-1 transition-colors"
                                >
                                    {isFullView ? <Minimize2 size={20} className="text-white" /> : <Image src="/fullview.svg" alt="Full view" width={20} height={20} />}
                                </button>
                            </div>
                            <Image src="/logo.svg" alt="Logo" width={120} height={80} className="object-contain" />
                            {isFullView ? <button onClick={handleClose} className="hover:bg-[#EF8143]/20 rounded-lg p-1 transition-colors"><X size={20} className="text-white" /></button> : <div className="w-6" />}
                        </div>

                        <div className="flex-1 flex flex-col min-h-0 relative">
                            {messages.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center p-6 pb-20">
                                    <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                                        <Image src="/message.svg" alt="Logo" width={50} height={50} className="object-contain" />
                                        <h1 className="font-sans text-center relative">
                                            {askAIDataLoading ? <div>...</div> : (
                                                <span className="block text-[#EF8143] font-bold text-[60px] md:text-4xl mb-2">
                                                    {askAIData?.chatBoxtitle}
                                                    <span className="absolute -top-1 -right-12 text-xs font-medium bg-[#EF8143]/20 text-[#EF8143] px-1.5 py-0.5 rounded">{askAIData?.chatBoxsubTitle}</span>
                                                </span>
                                            )}
                                        </h1>
                                        <div className="flex flex-col items-center gap-2">
                                            {questionsLoading ? <div>...</div> : chatQuestions.map((question) => (
                                                <button
                                                    key={question._id}
                                                    className={`bg-transparent border border-[#EF8143] text-white px-4 py-2 rounded-lg cursor-pointer text-left hover:bg-[#EF8143]/10 transition-colors duration-200 w-full`}
                                                    onClick={() => handleQuestionClick(question.name)}
                                                >
                                                    {question.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div ref={chatContainerRef} className="h-full overflow-y-auto scroll-smooth p-4 chat-scrollbar">
                                    <div className="space-y-3 pb-4">
                                        {messages.map((message) => (
                                            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className="flex flex-col max-w-[85%]">
                                                    <div className={`px-3 py-2 rounded-[12px] ${message.role === 'user' ? 'border border-[#EF8143] text-white' : 'bg-[#EF81433B] text-white border border-[#EF8143]'}`}>
                                                        {message.content || (message.role === 'assistant' && isLoading && message.id === messages[messages.length - 1].id) ? (
                                                            message.content ? (
                                                                message.role === 'assistant' ? (
                                                                    <div className="text-sm font-medium markdown-content">
                                                                        <ReactMarkdown
                                                                            remarkPlugins={[remarkGfm]}
                                                                            components={{
                                                                                p: ({ children, ...props }: any) => <p className="whitespace-pre-wrap break-words mb-4 last:mb-0" {...props}>{children}</p>,
                                                                                h1: ({ children, ...props }: any) => <h1 className="text-xl font-bold my-4" {...props}>{children}</h1>,
                                                                                h2: ({ children, ...props }: any) => <h2 className="text-lg font-bold my-3" {...props}>{children}</h2>,
                                                                                h3: ({ children, ...props }: any) => <h3 className="text-base font-bold my-2" {...props}>{children}</h3>,
                                                                                ul: ({ children, ...props }: any) => <ul className="list-disc pl-6 mb-4" {...props}>{children}</ul>,
                                                                                ol: ({ children, ...props }: any) => <ol className="list-decimal pl-6 mb-4" {...props}>{children}</ol>,
                                                                                li: ({ children, ...props }: any) => <li className="mb-1" {...props}>{children}</li>,
                                                                                a: ({ children, href, ...props }: any) => (
                                                                                    <a
                                                                                        className="text-[#EF8143] underline hover:no-underline"
                                                                                        href={href}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        onClick={(e) => handleExternalLink(href as string, e)}
                                                                                        {...props}
                                                                                    >
                                                                                        {children}
                                                                                    </a>
                                                                                ),
                                                                                code: ({ inline, children, ...props }: any) => {
                                                                                    return inline
                                                                                        ? <code className="bg-[#2A2E37] px-1 py-0.5 rounded text-xs" {...props}>{children}</code>
                                                                                        : <code className="block bg-[#2A2E37] p-2 rounded-md text-xs my-2 overflow-x-auto" {...props}>{children}</code>
                                                                                },
                                                                                pre: ({ children, ...props }: any) => <pre className="bg-transparent p-0 my-2" {...props}>{children}</pre>,
                                                                                blockquote: ({ children, ...props }: any) => <blockquote className="border-l-4 border-[#EF8143] pl-4 italic my-4" {...props}>{children}</blockquote>,
                                                                                hr: ({ ...props }: any) => <hr className="my-4 border-[#EF8143]/30" {...props} />,
                                                                                table: ({ children, ...props }: any) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse" {...props}>{children}</table></div>,
                                                                                th: ({ children, ...props }: any) => <th className="border border-[#EF8143]/30 px-2 py-1 bg-[#EF8143]/10" {...props}>{children}</th>,
                                                                                td: ({ children, ...props }: any) => <td className="border border-[#EF8143]/30 px-2 py-1" {...props}>{children}</td>
                                                                            }}
                                                                        >
                                                                            {message.content}
                                                                        </ReactMarkdown>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-sm font-medium">
                                                                        <ReactMarkdown
                                                                            remarkPlugins={[remarkGfm]}
                                                                            components={{
                                                                                p: ({ children, ...props }: any) => <p className="whitespace-pre-wrap break-words" {...props}>{children}</p>,
                                                                                a: ({ children, href, ...props }: any) => (
                                                                                    <a
                                                                                        className="text-[#EF8143] underline hover:no-underline"
                                                                                        href={href}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        onClick={(e) => handleExternalLink(href as string, e)}
                                                                                        {...props}
                                                                                    >
                                                                                        {children}
                                                                                    </a>
                                                                                ),
                                                                                code: ({ inline, children, ...props }: any) => {
                                                                                    return inline
                                                                                        ? <code className="bg-[#2A2E37] px-1 py-0.5 rounded text-xs" {...props}>{children}</code>
                                                                                        : <code className="block bg-[#2A2E37] p-2 rounded-md text-xs my-2 overflow-x-auto" {...props}>{children}</code>
                                                                                }
                                                                            }}
                                                                        >
                                                                            {message.content}
                                                                        </ReactMarkdown>
                                                                    </div>
                                                                )
                                                            ) : (
                                                                <span className="flex items-center space-x-2">
                                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                                                </span>
                                                            )
                                                        ) : (
                                                            <span className="flex items-center space-x-2">
                                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs mt-1 text-gray-500 ml-[4px]">
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} className="h-1" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 bg-transparent border-t border-[#EF8143] flex-shrink-0 bg-[#151921] rounded-b-[20px]">
                            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                                <input
                                    ref={inputRef}
                                    className="bg-transparent border-none h-[40px] pl-4 text-sm font-bold placeholder:text-white flex-1 text-white focus:outline-none"
                                    placeholder={askAIDataLoading ? "Loading..." : askAIData?.chatBoxInputPlaceholder}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSubmit()}
                                    className="w-11 h-11 rounded-full bg-[#ef8143] hover:bg-[#ef8143]/90 flex items-center justify-center flex-shrink-0 disabled:opacity-50"
                                    disabled={isLoading || !inputValue.trim()}
                                >
                                    <GrSend className="text-xl text-black" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}