import type { Metadata } from "next";
// import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Widget",
  description: "Universal chat widget for website integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <Script
          src="/public/embed.js"
          strategy="afterInteractive"
          // data-source="http://localhost:3001/widget"
          data-source={`${window.location.origin}/widget`}
          async
          defer
        /> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
