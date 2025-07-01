"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ChatWidget from "../components/ChatWidget"

function EmbedContent() {
    const searchParams = useSearchParams()

    const props = {
        brandColor: searchParams.get("brandColor") || "#EF8143",
        logo: searchParams.get("logo") || undefined,
        welcomeMessage: searchParams.get("welcomeMessage") || "Hi! How can I help you today?",
        position: (searchParams.get("position") as "bottom-right" | "bottom-left" | "bottom-center") || "bottom-right",
        showOnScroll: searchParams.get("showOnScroll") !== "false",
        showOnInactivity: searchParams.get("showOnInactivity") !== "false",
        inactivityDelay: Number.parseInt(searchParams.get("inactivityDelay") || "30000"),
        width: Number.parseInt(searchParams.get("width") || "400"),
        height: Number.parseInt(searchParams.get("height") || "584"),
        chatBoxtitle: searchParams.get("chatBoxtitle") || "Ask AI",
        chatBoxsubTitle: searchParams.get("chatBoxsubTitle") || "powered by OpenAI",
        chatBoxDescription: searchParams.get("chatBoxDescription") || "Get instant answers to your questions",
        chatBoxInputPlaceholder: searchParams.get("chatBoxInputPlaceholder") || "Type Your Question Here...",
    }

    return <ChatWidget {...props} />
}

export default function EmbedPage() {
    return (
        <div className="min-h-screen bg-transparent">
            <Suspense fallback={<div>Loading...</div>}>
                <EmbedContent />
            </Suspense>
        </div>
    )
}