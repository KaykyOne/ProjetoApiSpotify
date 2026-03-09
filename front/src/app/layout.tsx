import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import custom font families for consistent typography
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the aplication - used for SEO and page title
export const metadata: Metadata = {
  title: "Sistema Estrelas",
  description: "Criado por Kayky Zioti",
};

// Root layout component - wraps entire aplication with fonts and base styling
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex items-stretch justify-center`}
      >
        <div className="flex flex-col w-full min-h-screen relative px-3 py-4 md:px-5 md:py-6 items-center justify-start">
          {children}
        </div>
      </body>
    </html>
  );
}
