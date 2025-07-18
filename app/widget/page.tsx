"use client"
import { useEffect } from "react"
import ChatWidget from "../components/ChatWidget"

export default function EmbedPage() {
    useEffect(() => {
        // Set title for the iframe page
        document.title = "Chat Widget";

        // Ensure this page works well in an iframe
        if (window.parent !== window) {
            console.log("Running in iframe mode");
        }
    }, []);

    return (
        <div className="h-screen w-screen bg-transparent">
            <ChatWidget />
        </div>
    )
}