import type { Metadata } from "next";
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
      <body>
        {children}
      </body>
    </html>
  );
}
