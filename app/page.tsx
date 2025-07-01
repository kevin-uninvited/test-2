import Image from "next/image";
import ChatWidget from './components/ChatWidget'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ChatWidget
        brandColor="#EF8143"
        welcomeMessage="Hi! Welcome to our chat widget demo. How can I help you today?"
        showOnScroll={true}
        showOnInactivity={true}
        inactivityDelay={30000}
      />
    </div>
  );
}
