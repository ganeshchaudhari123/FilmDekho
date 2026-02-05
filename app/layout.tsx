import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import Script from 'next/script';
import "./globals.css";
import "./style.css";

export const metadata: Metadata = {
  title: "FilmDekho - Premium Mini-Drama",
  description: "Watch the best mini-dramas online.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#FFD700',
            border: '1px solid #333',
          },
        }} />
        {children}

        {/* Adsterra Social Bar / Popunder Script */}
        <Script
          id="adsterra-social-bar"
          strategy="lazyOnload"
          src="//pl2567890.profitabledisplaynetwork.com/9a/bb/cc/9abbcc1234567890.js"
        />
      </body>
    </html>
  );
}
